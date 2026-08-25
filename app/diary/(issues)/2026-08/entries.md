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

---

id: kidscreen
date: 2026-08-12
time: 09:00
tags: 儿童产品, YouTube, 算法替代, 开源
url: https://kidscreen.app/
---

# KidScreen：把 YouTube 变成家长可控的视频架

一个给小孩用的 YouTube 前端。核心机制很简单：家长在后台把视频加进去，孩子打开后只看到这些视频，没有搜索、没有推荐、没有无限滚动。

YouTube Kids 存在，但它的"儿童模式"仍然依赖算法推荐，内容池由平台决定。KidScreen 走了另一条路——白名单制，能出现在屏幕上的只有你手动放进去的那几条链接。免费，开源。

对有孩子的家庭来说，这个取舍很实际：放弃"发现新内容"的可能性，换来确定性。孩子不会点进下一个推荐视频然后看两小时。界面本身也配合了这个目标，没有搜索框，没有侧边栏，没有评论区，只有一排封面图。

---

id: ponzy-io
date: 2026-08-13
time: 07:38
tags: 游戏, 多人, 交易模拟, 浏览器
url: https://ponzy.io
---

# Ponzy.io：浏览器里的在线多人交易游戏

一个直接在浏览器里跑的多人交易模拟游戏，作者 ponzy_io 在 Hacker News 上发的 Show HN。不需要下载，打开网页就能进房间跟别人实时买卖。

玩法围绕"交易"展开，多人同场，价格跟着在场玩家的买卖行为走。名字带 Ponzi 的意味，但本质是个沙盒：你能观察群体行为怎么把价格推上去又砸下来。适合拿来直观感受市场情绪，不必真金白银下场。

地址 ponzy.io，网页端直接玩。

---

id: changedetection-io
date: 2026-08-13
time: 13:20
tags: 监控, 网页变化, 开源, 自动化
url: https://changedetection.io
---

# changedetection.io：盯住网页变化的开源监控

一个开源的网页变更监控工具。给它一个 URL，它按设定频率抓取页面、比对前后内容，有改动就发通知。通知渠道覆盖 Discord、Email、Slack、Telegram、Webhook 等。

![changedetection.io 网页变更监控工具宣传图](https://chaomei-1259670296.cos.ap-guangzhou.myqcloud.com/imghub/changedetection_1786610723400.png)

## 示例用例

1. 产品和服务价格变动
2. 缺货通知与补货通知
3. 监控并追踪 PDF 文件变化，获知 PDF 文本何时改动
4. 政府部门更新（变化往往只发生在他们的网站上）
5. 新软件发布、安全公告（当你不在他们的邮件列表里时）
6. 节日活动的变更
7. Discogs 补货提醒与监控
8. 房产挂牌信息变化
9. 你喜欢的威士忌打折、或其他特价先于他人知道时收到通知
10. 政府网站的疫情相关新闻
11. 大学/机构网站的新闻
12. 检测并监控 JSON API 响应中的变化
13. JSON API 监控与告警
14. 法律及其他文档的变更
15. 当网页出现某段文本时，通过通知触发 API 调用
16. 用 JSON 过滤器和 JSON 通知把多个 API 粘合起来
17. 基于网页内容变化生成 RSS feed
18. 监控 HTML 源码的异常改动，强化 PCI 合规
19. 你有一份需要盯的敏感 URL 列表，又不想用付费替代品（记住，你本身就是产品）
20. 某些关键词出现在 Twitter 搜索结果时收到通知
21. 主动搜工作，公司更新 careers 页时通知，在招聘门户搜索关键词
22. 在 Bamboo HR 等平台出现新职位时告警
23. 网站篡改监控
24. Pokémon 卡补货追踪 / Pokémon TCG 追踪
25. RegTech——领先于监管变化，满足合规要求
26. 需要支持 JavaScript 的真实 Chrome 运行器？我们支持通过 WebDriver 和 Playwright 抓取

## 核心特性

1. 大量触发过滤器，如"文本触发""按选择器移除文本""忽略文本""提取文本"，并支持正则
2. 用 xPath 1 与 xPath 2、CSS 选择器定位元素；用 JSONPath 或 jq 轻松监控复杂 JSON
3. 在快速无 JS 与 Chrome JS 两种"抓取器"之间切换
4. 追踪 PDF 文件变化（监控 PDF 文本改动，也监控 PDF 文件大小与校验和）
5. 轻松指定站点的检查频率
6. 提取文本前执行 JS（适合登录，UI 中有示例）
7. 覆盖请求头，指定 POST 或 GET 等其他方法
8. 用"可视化选择器"辅助定位特定元素
9. 每个监控项可配置独立代理
10. 检测到网页变化时，随通知发送截图

---
id: awesome-gpt-image-2
date: 2026-08-25
time: 10:27
tags: GPT-Image2, 提示词, Agent Skills, 开源
url: https://github.com/freestylefly/awesome-gpt-image-2
---

# awesome-gpt-image-2：把 GPT-Image2 案例逆向成 Prompt-as-Code

freestylefly 维护的开源仓库，标题写成 **Prompt as Code**。作者把社区里散落的 GPT-Image2 出图案例逆向拆开，把主体、光影、材质、排版整理成可组合字段，再做成分类模板，供 Agent 和脚本调用。画廊目前收录 532 个案例、二十余套模板，并整理出 `gpt-image-2-style-library` Skill。

海报与排版一类最多，有 86 例；摄影写实 77 例，UI 与界面 73 例。其余还有信息图、电商主图、插画和古风长卷。先在画廊里选定视觉方向，再回到模板页填入业务变量。可视化站点 [gpt-image2.canghe.ai](https://gpt-image2.canghe.ai/) 可以放大预览、复制完整 Prompt、按风格筛选，登录后可以试生成。

![信息图案例 Urban Metabolism Atlas](https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case1.jpg)

Skill 与网站共用 `data/style-library.json`。Claude Code、Codex、Cursor 可用 `npx skills add freestylefly/awesome-gpt-image-2` 安装，或执行 `npx gpt-image-2-style-library install all` 写入本地 skills 目录。请求可以写成：用 gpt-image-2-style-library 生成一张 Codex 信息图提示词。

案例多整理自 YouMind、OpenNana 等公开社区，仓库本身按 MIT 开源。

---
id: free-claude-code
date: 2026-08-25
time: 10:30
tags: Claude Code, 代理, 开源, 编程 Agent
url: https://github.com/Alishahryar1/free-claude-code
---

# Free Claude Code：用本地代理把免费额度接入 Claude Code

独立开源项目，作者 Alishahryar1，与 Anthropic 无隶属关系。它在本机启动代理和管理界面，把约 50 家符合服务条款的供应商汇总成一份模型目录，再接入 Claude Code、Codex、Pi、OpenCode、Cline 等客户端。目录覆盖免费额度、订阅、付费接口和本地模型。README 写明每月可用免费 token 超过 13 亿，额度由各供应商自行控制，随时可能调整。

安装后用 `fcc-claude`、`fcc-codex`、`fcc-pi`、`fcc-opencode` 启动对应客户端。Windows 与 macOS 提供托盘或菜单栏入口，Linux 运行 `fcc-server`。管理界面里填写 API Key、选择模型、配置 fallback；请求重试耗尽后，会自动切到下一份已配置模型。也可接入 VS Code、JetBrains、Discord、Telegram，语音输入使用本地 Whisper 或 NVIDIA NIM。可选 RTK 过滤常见命令输出，降低终端回传占用的 token。

macOS / Linux 安装命令为 `curl -fsSL "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.sh" | sh`。默认示例模型是 NVIDIA NIM 上的 `nvidia/nemotron-3-super-120b-a12b`。MIT 许可。

---
id: openlogi
date: 2026-08-25
time: 10:31
tags: 罗技, HID++, Rust, 开源, 鼠标
url: https://github.com/AprilNEA/OpenLogi
---

# OpenLogi：用 Rust 在本地配置罗技键鼠，不经过 Options+

AprilNEA 写的本地优先工具，走 HID++ 直接读写罗技外设。可改按键映射、DPI、SmartShift、滚轮与灯光，配置写在一份明文 TOML 里，不要求罗技账号，也不采集遥测。连接方式覆盖 Logi Bolt、Unifying、Lightspeed 接收器、蓝牙直连和 USB 线。键鼠之外，Litra 灯和部分摄像头的 UVC 参数也可以调。

程序分 GUI、后台 agent 和 CLI 三块：agent 占用系统输入钩子并独占设备 I/O，GUI 只做 IPC 客户端。Linux 按一等平台维护，提供 evdev/uinput、udev 规则、systemd 用户单元，以及 `.deb` / `.rpm` 包。使用前需要先退出官方 Logi Options+，两套软件会争抢同一接收器的 HID++ 通道。项目仍在活跃开发，配置格式可能继续变。文档在 [openlogi.org](https://openlogi.org/docs)。Apache 2.0 许可。

---
id: skylens
date: 2026-08-25
time: 10:32
tags: 卫星, 可视化, UAP, 公开数据
url: https://skylens.yantraai.app/
---

# SkyLens：三维地球上的在轨目标，旁边是一份可检索的 UAP 档案

YantraAI 做的浏览器站点，把 CelesTrak 公开星历画成可旋转的三维地球，并附一份美国政府滚动解密的 UAP 阅读室。地球上可以搜国际空间站、Starlink，按国家、轨道、运营方和任务类型过滤；卡片给出 NORAD 编号、高度、速度和星历历元。位置在浏览器里由公开轨道根数推算，站点自己标明这不是导航级数据。近地小行星走 NASA / JPL 的接近预报。

另一半产品是 PURSUE 披露计划的索引。五次批次合计约 375 条记录，可按批次、来源机构、事发日期、地点和文件类型检索，条目链回 DVIDS、FBI、NASA、AARO 等原始托管地址。档案不鉴定现象本身，政府侧也把这些个案标成未决。站点声明与政府无隶属关系，分析层只做来源、时间、地点和传感器限制的整理。

---
id: box-blanks
date: 2026-08-25
time: 10:34
tags: 包装, 刀版, 参数化, FEFCO
url: https://boxblanks.com/
---

# Box Blanks：按尺寸生成 479 种盒型的免费刀版

a1anm 做的浏览器工具。选定盒型后填长宽高和纸板厚度，得到实时展开图，并可从平面拖到成型状态查看折叠过程。导出 PDF（1:1 矢量）、SVG，以及带 CUT / CREASE / PERF 分层的 DXF R12，给模切厂和激光机用。

![Box Blanks：开盖状态的三维纸盒](https://chaomei-1259670296.cos.ap-guangzhou.myqcloud.com/jobhunt/pasted-1787626521747.png)

盒型代码来自 FEFCO Code 第 12 版（2022）和 ECMA Codes EN 2022。无标准编号的常见结构（磁吸礼盒、手提袋、柜台展示架）只用描述名。模板是面板与铰链的图结构：改一个尺寸，轮廓、压痕和三维折叠一起重算。尺寸可按内径、压痕到压痕或外径输入，另外两项会同步显示。纸板厚度可从瓦楞、卡纸、灰板表里选，也可直接输入；余量、槽宽、糊口和角部间隙都暴露成参数。

![Box Blanks：平面刀版与折叠预览](https://chaomei-1259670296.cos.ap-guangzhou.myqcloud.com/jobhunt/pasted-1787626609824.png)

每套模板带校验标记。「Checked against the plate」表示已与标准附图对照；「Not yet plate-checked」表示能折、能导出，细节尚未逐条对齐图纸。站点建议先打样再开模。

---
id: 2048bid
date: 2026-08-25
time: 11:04
tags: 营销, 排行榜, 2048, 游戏
url: https://2048bid.lol/
---

# 2048bid.lol：用 2048 分数给产品排名

voladd 做的浏览器站点，灵感来自 outbid.lol 的付费排行榜。提交产品网址后玩一局 2048，分数进入当日 UTC 排行榜；最高分占据榜首，并记入 Hall of Fame。方向键、WASD 或滑动均可操作。对局结束后，服务器回放每一步并核对时间，只有通过校验的分数才会上榜。免费。

作者博士第一年常玩 2048。同类玩法还有 flappybid.lol。
