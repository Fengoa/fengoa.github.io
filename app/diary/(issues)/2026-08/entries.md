---
id: salary-ticker
date: 2026-08-04
time: 20:10
tags: macOS, 菜单栏, 工具
url: https://steveharrison.dev/salaryticker/
---

# Salary Ticker：菜单栏里实时跳动的今日已赚工资

一款很小的 macOS 菜单栏应用：按日薪与上下班时间换算，把「今天已经赚到多少」显示在菜单栏，并随时间实时累加。

设置里可填日薪、上班与下班时刻；勾选后可在屏幕共享时自动遮罩金额，也可随时用 Option 点击菜单项手动切换遮罩。免费，要求 macOS 13 及以上。

![Salary Ticker：菜单栏金额与设置面板](https://chaomei-1259670296.cos.ap-guangzhou.myqcloud.com/imghub/hn__1785845413574.png)

---
id: simon-willison-weblog
date: 2026-08-04
time: 13:23
tags: 博客, 大模型, 工具, 笔记
url: https://simonwillison.net/
---

# Simon Willison 的 Weblog：跟踪大模型与开发工具的一手笔记

Django 共同作者 Simon Willison 的个人站点，按日更新条目、摘引、短评与 TIL。主题集中在大模型、编程智能体、开源工具，以及他自己维护的 `llm` CLI、Datasette 等项目。

首页按日期倒序排列：长文与短摘并存，常见内容包括模型版本评测、提示词实验、开源许可争论，以及把智能体接到日常开发流程里的具体做法。另有 TILs 与 Tools 分区，适合当作持续跟读的信息源。

---
id: tectonic-globe
date: 2026-08-10
time: 21:30
tags: 地球科学, 板块构造, 可视化, 交互
---

# Tectonic Globe：把今日国家与城市嵌入十亿年的板块运动

一款可旋转的地球可视化，把今日的国家边界和主要城市作为着色地壳标记，沿 Merdith 2021 板块重建模型前后推移，时间从十亿年前一直延伸到两亿五千万年后。大陆各自保留色系，陆地则随板块运动改变位置。

界面提供旋转与时间两个维度。时间轴可前后拖动，当前停在 +125 Ma（未来推演约 1.25 亿年）附近；下方列出 Africa、Europe、Asia、North America、South America、Oceania、Antarctica 等分区，以及与碰撞相关的提示。

技术实现上，国家多边形先按 Merdith 2021 模型的现今静态多边形切分，再借助 pyGPlates 的有限旋转把每个「国家—板块」碎片向后重建。未来部分由年轻板块旋转的匀速外推得到，只加入少量粗略的碰撞交接。作者明确将其定位为交互草图，不具备预测意义。重建之后仍然相互重叠的板块碎片用红色标出。

![Tectonic Globe：旋转地球与板块重建时间轴](https://chaomei-1259670296.cos.ap-guangzhou.myqcloud.com/imghub/gaia_1786331998343.png)

---
id: perso-dubbing-plugin
date: 2026-08-10
time: 10:02
tags: FFmpeg, 视频, 开源, 编程 Agent
url: https://github.com/perso-ai/perso-dubbing-plugin
---

# 让编程 Agent 用 FFmpeg 给视频加字幕、翻译与切片

一个开源插件，把视频的字幕、翻译与切片交给编程 Agent 处理，底层命令由 FFmpeg 完成。Agent 直接生成并调用 FFmpeg 命令，生成字幕、做翻译、裁剪片段，省去手动拼接命令行的步骤。

---

id: odyssey-was-for-sailors
date: 2026-08-10
time: 18:41
tags: 视觉随笔, D3.js, 荷马史诗, 古希腊, 航海
url: https://theheasman.com/the-odyssey-was-for-sailors/
---

# The Odyssey was for sailors：把《奥德赛》还给水手

一篇用 D3.js 做的滚动式视觉随笔，作者 TheHeasman。它的主张直白得有点冒犯：我们反复说《奥德赛》是西方文学的源头，却很少问它最初讲给谁听。作者的答案，水手。

古希腊不是大陆国家，而是散在爱琴海上的群岛，靠同一种语言和贸易连在一起。从罗得斯到雅典，唯一的路是海。整片文明泡在水里，也泡满了水手。从这个角度重新读，很多地方就通了。

nostos（归乡）本身是一场航海。奥德修斯在卡吕普索的岛上每天坐到岸边哭，望的是那片"无用的海"；他一度离伊萨卡近到能看见岸上人家点的火，却被一阵风吹远。这正对应水手对沉船的永恒恐惧。xenia（待客之道）对水手是生死问题：看见地平线上升起陆地，你不知道岸上的人会款待你还是吃掉你。史诗里好客与坏客交替出现，恰好是一个漂泊者最关心的处境。

文章还把那些劝诫读成水手的经验：别贪吃别人岛上的牛，听见女妖唱歌就往耳朵里塞蜡。关于 Penelope 的等待，关于家里若没有男主人会怎样，讲的也是水手家属的处境。

结尾有点狡黠。奥德修斯在法伊阿科斯人面前讲自己的历险，讲到一半突然打住，说时候不早、怕耽误主人，其实他清楚对方已经上钩。作者把这一手当成给水手的写作课：会讲故事的人走得更远。"spin a yarn"这个习语，本就来自水手在船上搓绳时消磨时间的闲谈。

阅读时长约 15 到 24 分钟，带脚注 20 到 31 分钟，另有精简版。作者注明参考了 Elizabeth Vandiver 的讲座与 T.E. 劳伦斯的译本。

![The Odyssey was for sailors：滚动式视觉随笔中的时间轴与航海示意](https://chaomei-1259670296.cos.ap-guangzhou.myqcloud.com/imghub/gaia_1786414959343.png)
