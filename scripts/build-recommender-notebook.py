#!/usr/bin/env python3
"""生成 minimal-recommender 的 Colab notebook。

运行: python3 scripts/build-recommender-notebook.py
输出: app/blog/minimal-recommender/01_minimal_recommender.ipynb
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "app/blog/minimal-recommender/01_minimal_recommender.ipynb"


def md(source: str) -> dict:
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + "\n" for line in source.strip().split("\n")],
    }


def code(source: str) -> dict:
    return {
        "cell_type": "code",
        "metadata": {"id": None},
        "source": [line + "\n" for line in source.strip().split("\n")],
        "outputs": [],
        "execution_count": None,
    }


cells = []

# ===== 标题 =====
cells.append(md(
    """# 从零搭建一个推荐系统

[博客原文](https://oriensx.github.io/blog/minimal-recommender)

本 notebook 记录了从零搭建一个推荐系统流水线的完整过程：
数据加载 → 三路召回（热门 / 类型偏好 / ItemCF）→ 归一化合并 → 精排 → Top K。

读完这篇，你会理解 Spotify 首页推荐背后的核心流水线是怎么运转的。"""
))

# ===== 0. 环境 =====
cells.append(md("## 0. 环境"))
cells.append(code(
    """import math
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

import pandas as pd

pd.set_option("display.max_columns", 15)
pd.set_option("display.width", 200)
pd.set_option("display.max_colwidth", 40)

print("环境就绪 ✅")"""
))

# ===== 1. 数据：MovieLens =====
cells.append(md("## 1. 数据：MovieLens"))
cells.append(md(
    """使用 [MovieLens 25M](https://grouplens.org/datasets/movielens/25m/) 数据集。
数据将自动下载并转为 pkl 格式，包含三类表：

- `movies.pkl` — 电影信息（id、标题、类型、评分均值、投票数）
- `ratings.pkl` — 用户评分记录（user_id、movie_id、rating）
- `users.pkl` — 用户列表

**工程窍门：把所有 ID 统一为 `str` 类型，避免合并时 int/str 不一致。**"""
))

# 数据下载 cell (首次运行)
cells.append(code(
    """# ⚠️ 首次运行请执行此 cell，下载并准备 MovieLens 数据
import os, shutil, zipfile, urllib.request

DATA_DIR = "data/raw"
os.makedirs(DATA_DIR, exist_ok=True)

if not all(os.path.exists(f"{DATA_DIR}/{f}") for f in ["movies.pkl", "ratings.pkl", "users.pkl"]):
    print("下载 MovieLens 25M 数据集 (约 250MB)...")
    url = "https://files.grouplens.org/datasets/movielens/ml-25m.zip"
    zip_path = "ml-25m.zip"

    urllib.request.urlretrieve(url, zip_path)
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(".")
    os.remove(zip_path)

    print("转换中...")
    import pandas as pd

    movies = pd.read_csv("ml-25m/movies.csv")
    links = pd.read_csv("ml-25m/links.csv", dtype=str)
    links["movieId"] = links["movieId"].astype(int)

    ratings = pd.read_csv("ml-25m/ratings.csv")
    agg = ratings.groupby("movieId").agg(
        averageRating=("rating", "mean"),
        numVotes=("rating", "count"),
    ).reset_index()
    agg["averageRating"] = agg["averageRating"].round(1)

    movies = movies.merge(agg, on="movieId", how="left")
    movies = movies.merge(links, on="movieId", how="left")
    movies = movies.rename(columns={"movieId": "movie_id"})

    users = pd.DataFrame({"user_id": ratings["userId"].unique()})
    ratings = ratings.rename(columns={"userId": "user_id", "movieId": "movie_id"})

    movies.to_pickle(f"{DATA_DIR}/movies.pkl")
    ratings.to_pickle(f"{DATA_DIR}/ratings.pkl")
    users.to_pickle(f"{DATA_DIR}/users.pkl")

    shutil.rmtree("ml-25m")
    print("✅ 数据准备完成")
else:
    print("✅ 数据已存在，跳过下载")"""
))

cells.append(code(
    """@dataclass(frozen=True)
class MovieLensData:
    movies: pd.DataFrame
    ratings: pd.DataFrame
    users: pd.DataFrame


def load_movielens(data_dir: str = "data/raw") -> MovieLensData:
    data_dir = Path(data_dir)
    movies = pd.read_pickle(data_dir / "movies.pkl")
    ratings = pd.read_pickle(data_dir / "ratings.pkl")
    users = pd.read_pickle(data_dir / "users.pkl")

    movies["movie_id"] = movies["movie_id"].astype(str)
    ratings["movie_id"] = ratings["movie_id"].astype(str)
    ratings["user_id"] = ratings["user_id"].astype(str)
    users["user_id"] = users["user_id"].astype(str)

    return MovieLensData(movies=movies, ratings=ratings, users=users)


data = load_movielens()
print(f"电影: {len(data.movies):,} 部")
print(f"评分: {len(data.ratings):,} 条")
print(f"用户: {len(data.users):,} 位")"""
))

cells.append(code(
    """print("===== movies =====")
print(data.movies.head(3).to_string())
print()
print("===== ratings =====")
print(data.ratings.head(3).to_string())
print()
print("===== users =====")
print(data.users.head(3).to_string())"""
))

# ===== 2. 公用工具 =====
cells.append(md("## 2. 公用工具"))
cells.append(code(
    """DISPLAY_COLUMNS = [
    "movie_id", "title", "genres",
    "averageRating", "numVotes",
    "recall_score", "avg_user_rating",
]

def build_movie_stats(data: MovieLensData) -> pd.DataFrame:
    return (
        data.ratings.groupby("movie_id")
        .agg(avg_user_rating=("rating", "mean"), rating_count=("rating", "count"))
        .reset_index()
    )

def get_user_liked_movies(data: MovieLensData, user_id: str, min_rating: float = 8.0) -> pd.DataFrame:
    liked = data.ratings[
        (data.ratings["user_id"] == user_id) & (data.ratings["rating"] >= min_rating)
    ]
    return liked.merge(data.movies, on="movie_id", how="left")

user_1_liked = get_user_liked_movies(data, "1")
print(f"用户 1 打了 ≥8 分的电影: {len(user_1_liked)} 部")
print(user_1_liked[["title", "genres", "rating"]].head(8).to_string())"""
))

# ===== 3. 热门召回 =====
cells.append(md("## 3. 热门召回"))
cells.append(md(
    """筛选评分人数多、均分高的电影。不依赖用户历史，适用于新用户。

核心假设：**多数人觉得好的电影，新用户大概率也喜欢。**

实现：`recall_score = 评分人数`，按均分和评分人数联合排序。"""
))
cells.append(code(
    """def popular_recall(data: MovieLensData, top_k: int = 40, min_rating_count: int = 50) -> pd.DataFrame:
    movie_stats = build_movie_stats(data).rename(columns={"rating_count": "recall_score"})
    movie_stats = movie_stats[movie_stats["recall_score"] >= min_rating_count]

    result = movie_stats.merge(data.movies, on="movie_id", how="left")
    return result.sort_values(
        ["avg_user_rating", "recall_score"], ascending=[False, False]
    )[DISPLAY_COLUMNS].head(top_k)

popular = popular_recall(data)
print(f"热门召回 Top {len(popular)}:")
print(popular.head(10).to_string())"""
))

# ===== 4. 类型偏好召回 =====
cells.append(md("## 4. 类型偏好召回"))
cells.append(md(
    """统计用户历史观影的类型分布，按频率计算权重，推荐同类型的高分电影。

分两步：
1. **离线**：遍历用户历史，统计每种类型的观看占比 → 保存为权重表
2. **在线**：拿到权重后对每个类型单独查询高分电影，第 $i$ 个类型分配 $\\lfloor 40 \\cdot w_i \\rfloor$ 部

得分公式：`recall_score = 类型权重 × 均分`"""
))
cells.append(code(
    """def genre_recall(
    data: MovieLensData, user_id: str,
    top_k: int = 40, min_rating: float = 8.0, min_rating_count: int = 10,
) -> pd.DataFrame:
    liked = get_user_liked_movies(data, user_id, min_rating=min_rating)
    if liked.empty:
        return popular_recall(data, top_k=top_k)
    liked_movie_ids = set(liked["movie_id"])

    genre_counts: Counter[str] = Counter()
    for genres_str in liked["genres"].dropna():
        for genre in genres_str.split("|"):
            genre_counts[genre.strip()] += 1

    if not genre_counts:
        return popular_recall(data, top_k=top_k)

    total = sum(genre_counts.values())
    genre_weights = {g: c / total for g, c in genre_counts.items()}
    print(f"  用户 {user_id} 的类型偏好: {dict(genre_counts)}")
    print(f"  权重: { {g: round(w, 2) for g, w in genre_weights.items()} }")

    movie_stats = build_movie_stats(data)
    movie_stats = movie_stats[movie_stats["rating_count"] >= min_rating_count]
    candidates = movie_stats.merge(data.movies, on="movie_id", how="left")
    candidates = candidates[~candidates["movie_id"].isin(liked_movie_ids)]

    def calc_genre_score(genres_str: str | None) -> float:
        if not genres_str or not isinstance(genres_str, str):
            return 0.0
        return sum(genre_weights.get(g.strip(), 0.0) for g in genres_str.split("|"))

    candidates = candidates.copy()
    candidates["genre_weight"] = candidates["genres"].apply(calc_genre_score)
    candidates = candidates[candidates["genre_weight"] > 0]

    candidates["recall_score"] = (
        candidates["genre_weight"] * candidates["avg_user_rating"]
    ).round(6)

    return candidates.sort_values("recall_score", ascending=False)[DISPLAY_COLUMNS].head(top_k)

genre = genre_recall(data, "1")
print(f"\\n类型偏好召回 Top {len(genre)}:")
print(genre.head(10).to_string())"""
))

# ===== 5. ItemCF 召回 =====
cells.append(md("## 5. ItemCF 召回"))
cells.append(md(
    """核心思路：用户喜欢 A，A 和 B 相似 → 推荐 B。

分两步：
1. **离线构建相似表**：遍历所有用户行为，统计物品共现关系 → 保存为 `{物品 → [相似物品列表]}`
2. **在线查表**：拿到用户喜欢的电影列表 → 查表聚合相似电影 → 按相似度累加得分

技术细节：活跃用户看过几百部电影，引入 **IUF 加权**降低每部电影的共现贡献度：

$$\\text{weight} = \\frac{1}{\\log(1 + \\text{用户看过的电影数})}$$"""
))
cells.append(code(
    """def build_itemcf_model(
    data: MovieLensData, min_rating: float = 8.0,
    max_neighbors: int = 50, min_support: int = 2,
) -> dict:
    high_ratings = data.ratings.loc[
        data.ratings["rating"] >= min_rating, ["user_id", "movie_id"]
    ]
    user_histories = high_ratings.groupby("user_id")["movie_id"].agg(list)

    item_user_count: Counter[str] = Counter()
    pair_weight: defaultdict[tuple, float] = defaultdict(float)
    pair_support: defaultdict[tuple, int] = defaultdict(int)

    for movie_ids in user_histories:
        unique_ids = list(dict.fromkeys(str(mid) for mid in movie_ids))
        for mid in unique_ids:
            item_user_count[mid] += 1
        if len(unique_ids) < 2:
            continue

        weight = 1.0 / math.log(1 + len(unique_ids))
        for a in unique_ids:
            for b in unique_ids:
                if a == b:
                    continue
                pair_weight[(a, b)] += weight
                pair_support[(a, b)] += 1

    neighbors: defaultdict[str, list] = defaultdict(list)
    for (a, b), co_weight in pair_weight.items():
        if pair_support[(a, b)] < min_support:
            continue
        sim = co_weight / math.sqrt(item_user_count[a] * item_user_count[b])
        neighbors[a].append({"movie_id": b, "similarity": round(sim, 6),
                             "support_count": pair_support[(a, b)]})

    for mid, items in neighbors.items():
        items.sort(key=lambda x: (x["similarity"], x["support_count"]), reverse=True)
        neighbors[mid] = items[:max_neighbors]

    return {
        "meta": {"min_rating": min_rating, "max_neighbors": max_neighbors,
                  "min_support": min_support, "item_count": len(neighbors)},
        "neighbors": dict(neighbors),
    }


print("构建 ItemCF 相似表中...")
itemcf_model = build_itemcf_model(data)
meta = itemcf_model["meta"]
print(f"  覆盖 {meta['item_count']} 部电影，每部最多 {meta['max_neighbors']} 个邻居")
print(f"  min_rating={meta['min_rating']}, min_support={meta['min_support']}")

shawshank_id = data.movies[data.movies["title"].str.contains("Shawshank", na=False)].iloc[0]["movie_id"]
print(f"\\n肖申克的救赎 (id={shawshank_id}) 的相似电影:")
neighbors = itemcf_model["neighbors"].get(shawshank_id, [])
for n in neighbors[:5]:
    title = data.movies[data.movies["movie_id"] == n["movie_id"]].iloc[0]["title"]
    print(f"  {title}  -  similarity={n['similarity']}")"""
))
cells.append(code(
    """def itemcf_recall(
    data: MovieLensData, user_id: str,
    top_k: int = 40, min_rating: float = 8.0,
) -> pd.DataFrame:
    liked = get_user_liked_movies(data, user_id, min_rating=min_rating)
    liked_movie_ids = set(liked["movie_id"])

    if not liked_movie_ids:
        return popular_recall(data, top_k=top_k)

    candidate_scores: defaultdict[str, float] = defaultdict(float)
    for liked_id in liked_movie_ids:
        for neighbor in itemcf_model["neighbors"].get(liked_id, []):
            candidate_id = str(neighbor["movie_id"])
            if candidate_id in liked_movie_ids:
                continue
            candidate_scores[candidate_id] += float(neighbor["similarity"])

    if not candidate_scores:
        return popular_recall(data, top_k=top_k)

    candidate_df = pd.DataFrame([
        {"movie_id": mid, "recall_score": round(s, 6)}
        for mid, s in candidate_scores.items()
    ])
    movie_stats = build_movie_stats(data)[["movie_id", "avg_user_rating"]]
    result = candidate_df.merge(movie_stats, on="movie_id", how="left")
    result = result.merge(data.movies, on="movie_id", how="left")

    return result.sort_values("recall_score", ascending=False)[DISPLAY_COLUMNS].head(top_k)

itemcf = itemcf_recall(data, "1")
print(f"ItemCF 召回 Top {len(itemcf)}:")
print(itemcf.head(10).to_string())"""
))

# ===== 6. 归一化合并 =====
cells.append(md("## 6. 归一化合并"))
cells.append(md(
    """三路召回的分数尺度完全不同：

| 召回通道 | recall_score 范围 |
|----------|------------------|
| 热门召回 | 评分人数（几十一几千） |
| 类型偏好召回 | 类型权重 × 均分（0-10） |
| ItemCF | 相似度累加（0-几） |

量纲不同，直接相加无意义。先归一化到 [0, 1] 再按权重合并：

$$\\text{merged\\_score} = 0.5 \\times \\text{itemcf\\_norm} + 0.3 \\times \\text{genre\\_norm} + 0.2 \\times \\text{popular\\_norm}$$

ItemCF 最个性化，权重最高。"""
))
cells.append(code(
    """def normalize_scores(df: pd.DataFrame, score_col: str = "recall_score") -> pd.DataFrame:
    df = df.copy()
    mn, mx = df[score_col].min(), df[score_col].max()
    df[score_col] = (df[score_col] - mn) / (mx - mn) if mx - mn > 1e-9 else 1.0
    return df

def merge_recall(data: MovieLensData, user_id: str, recall_top_k: int = 40, top_k: int = 50) -> pd.DataFrame:
    popular = popular_recall(data, top_k=recall_top_k)
    genre = genre_recall(data, user_id, top_k=recall_top_k)
    itemcf = itemcf_recall(data, user_id, top_k=recall_top_k)

    weights = {"popular": 0.2, "genre": 0.3, "itemcf": 0.5}
    merged: defaultdict[str, dict] = defaultdict(lambda: {"score": 0.0, "sources": []})

    for source_name, df, w in [
        ("popular", popular, weights["popular"]),
        ("genre", genre, weights["genre"]),
        ("itemcf", itemcf, weights["itemcf"]),
    ]:
        if df.empty:
            continue
        norm = normalize_scores(df)
        for _, row in norm.iterrows():
            mid = str(row["movie_id"])
            merged[mid]["score"] += float(row["recall_score"]) * w
            merged[mid]["sources"].append(source_name)

    if not merged:
        return popular.head(top_k)

    liked_ids = set(get_user_liked_movies(data, user_id, min_rating=0.0)["movie_id"])
    candidates = [
        {"movie_id": mid, "recall_score": round(info["score"], 6),
         "recall_sources": "+".join(sorted(set(info["sources"])))}
        for mid, info in merged.items() if mid not in liked_ids
    ]
    if not candidates:
        return popular.head(top_k)
    candidate_df = pd.DataFrame(candidates)

    movie_stats = build_movie_stats(data)[["movie_id", "avg_user_rating"]]
    result = candidate_df.merge(movie_stats, on="movie_id", how="left")
    result = result.merge(data.movies, on="movie_id", how="left")

    return result.sort_values("recall_score", ascending=False).head(top_k)


merged = merge_recall(data, "1")
print(f"合并去重后: {len(merged)} 个候选")
print(merged.head(10).to_string())"""
))

# ===== 7. 精排 =====
cells.append(md("## 7. 精排"))
cells.append(md(
    r"""召回阶段问了"这部电影和用户相关吗"，但没问"这部电影本身值得推荐吗"。
一部复合用户口味的 3 分电影，不应该排在召回分数相似但评分 4.5 的电影前面。

精排引入物品质量信号，综合三个维度：

$$\text{final\_score} = 0.5 \times \text{recall\_score\_norm} + 0.3 \times \text{rating\_norm} + 0.2 \times \text{popularity\_norm}$$"""
))
cells.append(code(
    """def rank_candidates(candidates: pd.DataFrame, top_k: int = 20) -> pd.DataFrame:
    if candidates.empty:
        return candidates

    df = candidates.copy()
    df["popularity"] = df.get("numVotes", df.get("rating_count", 0)).fillna(0).astype(float)

    for col in ["recall_score", "avg_user_rating", "popularity"]:
        mn, mx = df[col].min(), df[col].max()
        df[col + "_norm"] = (df[col] - mn) / (mx - mn) if mx - mn > 1e-9 else 1.0

    df["final_score"] = (
        0.5 * df["recall_score_norm"]
        + 0.3 * df["avg_user_rating_norm"]
        + 0.2 * df["popularity_norm"]
    ).round(6)

    display_cols = ["movie_id", "title", "genres", "final_score",
                    "recall_score", "avg_user_rating", "popularity"]
    return df.sort_values("final_score", ascending=False)[
        [c for c in display_cols if c in df.columns]
    ].head(top_k)

ranked = rank_candidates(merged)
print(f"精排后 Top {len(ranked)}:")
print(ranked.to_string())"""
))

# ===== 8. 完整流程 =====
cells.append(md("## 8. 完整流程"))
cells.append(md(
    """把上面所有步骤串起来，一个函数搞定：

```text
recommend(user_id=1, top_k=20)
    → 热门召回(40)  ─┐
    → 类型偏好(40)  ─┼→ 归一化合并(50) → 精排 → Top 20
    → ItemCF(40)    ─┘
```"""
))
cells.append(code(
    """def recommend(data: MovieLensData, user_id: str, top_k: int = 20) -> pd.DataFrame:
    candidates = merge_recall(data, user_id, recall_top_k=40, top_k=50)
    return rank_candidates(candidates, top_k=top_k)

result = recommend(data, "1")
print(f"用户 1 的 Top {len(result)} 推荐:")
print(result.to_string())"""
))

# ===== 9. 自己玩 =====
cells.append(md("## 9. 自己玩"))
cells.append(md(
    """试试不同的用户 ID，看看推荐结果有什么变化：

MovieLens 25M 的用户 ID 范围是 1 ~ 162541。也可以试试 `popular_recall(data)` 看看全站热门是什么。"""
))
cells.append(code(
    """# 换一个用户试试
result = recommend(data, "42", top_k=10)
print(f"用户 42 的 Top 10 推荐:")
print(result[["title", "final_score", "genres"]].to_string())

print("\\n---\\n")

# 看看热门召回（全站最热）
popular = popular_recall(data, top_k=10)
print("全站热门 Top 10:")
print(popular[["title", "recall_score", "avg_user_rating"]].to_string())"""
))

# ===== 组装 =====
notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.10.0"},
        "colab": {"provenance": []},
    },
    "nbformat": 4,
    "nbformat_minor": 5,
}

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps(notebook, indent=1, ensure_ascii=False), encoding="utf-8")
print(f"✅ 输出到 {OUTPUT}")
