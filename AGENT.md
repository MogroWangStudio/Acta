# AGENT.md — Acta 项目工作参考

给后续接手的智能体：这份文件描述**当前的架构与功能现状**，不记录改动历史（历史看 `CHANGELOG.md`）。改代码前先读完「架构」「约定」「容易踩的坑」三节。

## 1. 这是什么

Acta 是本地优先的笔记 + 待办应用，一套 Web 界面同时供三个壳使用：

| 壳 | 技术 | 入口 |
| --- | --- | --- |
| 桌面（Windows / macOS） | Tauri 2（Rust + WebView） | `src-tauri/` |
| Android | Capacitor 8（原生插件在 `android/`） | `android/app/src/main/java/com/acta/xingji/` |
| 浏览器 / PWA | Vite 构建的纯前端 | `index.html` + `src/` |

数据默认只存本机（localStorage / 数据档案文件夹），只有用户主动操作才会导入、导出或同步（WebDAV、局域网）。

## 2. 目录与职责

```
index.html                 图标 sprite（#i-* 全部符号都在这里）+ 两个样式表
src/App.vue                应用外壳的全部 DOM 标记（启动画面 / 顶栏 / 侧栏 /
                           列表 / 编辑器 / 设置 / OOBE / 各种 dialog）。
                           顶栏自带四段：品牌（`.brand`）/ 标签条（`#tabStrip`
                           内含 `#tabSideStrip`）/ 状态与版本（`.titlebar-meta`）
                           / 窗口控件；没有响应式状态，脚本按 id 绑节点。
src/main.ts                挂载 App；若是更新向导实例（__ACTA_UPDATER__）则只
                           渲染向导，不加载应用。
src/boot.ts                引导顺序（顺序不能乱）：splash → tauri-bridge →
                           note-export → interface → custom-select →
                           custom-datetime → tabs → updater
src/styles.css             外壳与布局（网格、侧栏、列表、编辑器、移动端断点）
src/interface.css          功能层样式（日历 / 计划板 / 标签条 / 版本列表 /
                           各种弹窗）；后加载，可覆盖 styles.css
src/legacy/renderer.js     最重要的文件（经典脚本，约 1 万行）：library 与
                           settings 状态、全部渲染函数、快捷键、手势。
                           以 <script src="./legacy/renderer.js"> 方式加载，
                           文件本体在 public/legacy/renderer.js
src/legacy/interface.js    设置页、数据档案、WebDAV、局域网、关于页与更新入口
src/legacy/tabs.js         标签页（页面状态快照 + 右侧侧边窗格；见「标签页」一节）
src/legacy/tauri-bridge.js window.actaDesktop：所有 Tauri 命令的 JS 门面
src/legacy/updater.js      应用内更新对话框 + 静默检查（仅桌面）
src/legacy/updater-wizard.js 更新向导窗口的界面（Rust 侧拉起的第二个实例）
src/legacy/note-export.js  笔记 / 子任务导出（TXT / Markdown / PDF）
src/legacy/custom-select.js, custom-datetime.js  自绘下拉与日期时间控件
src-tauri/src/lib.rs       Tauri 命令注册（薄包装）+ 数据档案读写
src-tauri/src/updater.rs   检查更新 / 版本列表 / 下载 / 更新向导与安装
src-tauri/src/lan_sync.rs  局域网发现、两段式推送、备份
scripts/smoke-test.js      无头冒烟测试（vite + puppeteer-core + 本机 Edge/Chrome）
docs/                      `npm run build:pages` 的产物（GitHub Pages），勿手改
```

## 3. 状态与渲染管线

- **全局绑定**：`renderer.js` 顶层用 `let` 声明 `library`、`settings`、`currentView`、`selectedId`、`searchQuery`、`listSortMode`、`todoPriorityFilter`、`todoDueFilter`、`todoFolderFilter`、`noteFolderFilter`、`noteRelationFilter`、`noteUpdatedFilter`、`trashTypeFilter`、`trashFolderFilter` 等；用 `const` 声明 `t`、`escapeHTML`、`$`/`$$` 等工具。
- **模块如何访问**：`src/legacy/*.js` 是 ES 模块，但**直接读写这些裸标识符**即可（全局词法环境共享，`updater.js` 里的 `settings` 就是这么用的）。`function` 声明同时是 `window` 属性，所以可以包装 `window.renderList` 这类全局函数（`tabs.js` 就这么做的）。
- **渲染入口**：`renderAll()` = `translateStaticUI()` + `renderSidebar()` + `renderList()` + `renderEditor()`。视图切换统一走 `activateView(view)`（侧栏、移动端导航、类型分段共用；它负责复位选中、日历入场与转场）。
- **列表卡片**：`itemCardMarkup(item, { active, index, animate })` 是主列表与并排副窗格共用的唯一卡片标记函数，改卡片样式只改这一处。
- **DOM 约定**：所有节点都靠固定 id 取用（`#itemList`、`#editorPane`、`#viewTitle`、`#itemCountLabel`…）。新增界面时优先在 `App.vue` 里加静态标记、由模块按 id 绑定，不要在 JS 里拼整页结构。
- **持久化**：`localStorage` 键——`acta.library.v1`（正文数据）、`acta.settings.v1`（用户偏好）、`acta.interface.settings.v1`（界面设置，桌面端另镜像到数据文件夹的 `settings.json`）、`acta.tabs.v1`（标签页布局，v2 结构：`{ version, activeId, sideActiveId, sideOpen, tabs:[{ id, group, state }] }`，设备本地，不随档案同步；旧版只有 `splitId` 的布局在启动时迁移成右侧窗格）。数据档案格式为 v4：`acta-manifest.json`、`classifications.json`、`notes/`、`todos/`、`boards/`，通道共有五条（见 `2026-10-26` 的工作记忆），改动档案结构要同时改 Rust、WebDAV 与 Android 插件。

## 4. 功能地图

- **笔记 / 待办**：列表卡片 + 右侧编辑器；子任务（顺序模式、拖拽排序、批量添加、导出、**单独排期**）、打卡待办、优先级、开始 / 截止时间、双向关联。
- **子待办排期**（v4.3.0-beta8）：子待办可有独立 `startAt` / `dueAt`（ISO，结构与父待办同款；归一化时非法值剔除，`sanitizeTaskSchedule`）。设置入口两处，**互为镜像**：编辑器行内 `.task-schedule` 列（排期显示区间 pill、逾期未完成染 `--danger-accent`、未排期为悬停现身的时钟按钮，点击展开 `.task-schedule-panel`）与属性面板 `.subtask-schedule-field` 区块；任一处确认后由 `bindTodoEditor` 里的 `syncTaskScheduleViews(taskId)` 就地同步另一处（不重建编辑器）。校验与父待办一致：截止晚于开始（都填时），只设一端也保存。`taskScheduleValue` / `taskIsScheduled` / `taskScheduleOverdue` 在 `interface.js`（`renderer.js` 里有 `taskIsScheduled` / `taskStartDate` / `taskDueDate`）。
- **日历**：年 / 月 / 周 / 日四种视图，周数、快速跳转、移动端独立滚动；`body.calendar-view` 把 `.workspace` 的编辑器列压成 0。**单独排期的子待办独立成条**：`calendarScheduledSubtasks()`（`{ item, task }` 伪条目，按 `task.startAt` / `task.dueAt` 跨天铺开 `calendarSubtasksByDate`）混入月 / 周 / 日视图的格内条目数组——分发函数 `calendarMonthEntryMarkup` / `calendarEntryMarkup` 按 `entry.task` 是否存在分流；月视图条目只有标题（月格不放勾选），周 / 日视图复用 `data-calendar-subtask-toggle` / `data-calendar-open` 委托事件；年视图只计入天格计数不渲染条目；侧栏日历徽标刻意保持父级口径（父待办 + 笔记，与待办 / 笔记计数同级）。
- **计划板**：`#boardViewport` 内的相机画布，卡片 / 富文本 / 标注三类组件，图层、多选、撤销、导出 PNG/JPG/PDF；`body.board-view` 下编辑器是浮层。待办卡片的子待办行有两条显示过滤（「显示内容」面板）：`show.tasksDoneVisible`（已完成行去留，默认开）与 `show.tasksDoneOnly`（仅显示已完成，优先级更高、复盘用），画布与导出共用 `boardShownTasks()` 一个口径；`sanitizeBoards` 重建 widget 的 `show` 对象时逐键写默认值——**给「显示内容」加新开关必须同步补进 `sanitizeBoards`**，否则设置在归一化后被丢弃（`tasksDoneOnly` 就这样丢过）。
- **总结 / 回收站**：整页视图，同样把编辑器列压成 0。
- **筛选**：行内只有内容类型分段（`#listTypeSwitch`），其余条件在标题行漏斗弹出的 `#listFilterPanel`；状态变量见上。
- **空态（列表 / 编辑器 / 回收站）**：`renderer.js` 里的 `HANDY_SVG`、`emptyMood*` 与 `paintEmptyState()`。小块的面内联 SVG（不是 sprite 的 `<use>`：子部件要能各自动），`.handy-head` 点头、`.handy-eye` 眨眼、整个 svg 做呼吸，换句时 `.handy-block.is-fresh` 让脑袋抬头一次。问候语在 `dictionaries[lang].emptyGreetings`（三组：`list` / `editor` / `trash`），`paintEmptyState` 按 `语言|语境|view|index` 守门：同一状态不重画（否则动画每次从第一帧重来）；从「有内容」回到空态时 `rollEmptyGreeting` 换一句；`armEmptyMoodTimer` 每 11–18 秒就地换文字（不重画小人）。搜索或筛选无结果走 `filtered` 这一组（`noMatch` / `noMatchHint`），不轮换。
- **标签页**：`tabs.js`。一个标签 = 一整套页面状态快照：视图、内容类型分段、筛选面板全部条件、搜索词、选中项、列表滚动位置与编辑器滚动位置。标签标题是「页面名 · 正在看的条目名」（`tabLabel`，条目名先省略）。标签条住在顶栏（`#tabStrip` 是 `.titlebar` 的第二列，见上方「顶栏」一段）：主标签条 `#tabStripScroll` 后跟 `#tabStripActions`（新建 / 侧边两个按钮），再跟右侧窗格的标签条 `#tabSideStrip`（两者由一条短竖线 `::before` 分开，不是通高列缝）；侧边窗格是 `#tabSidePane` + `#tabSideList`。右键菜单（`#tabMenu`）提供复制 / 移到另一侧 / 关闭 / 关闭全部；标签可以用指针拖进拖出侧边窗格（`dropTargetAt` 按 `#tabSideStrip` / `#tabSidePane` / `#tabStrip` 判定落点）。`renderList` 与 `renderEditor` 被包装后负责同步标签名、侧边窗格与延迟落盘。
- **顶栏（改这块先读）**：`.titlebar` 是四列网格 `grid-template-areas: "brand tabs meta controls"`，列宽 `var(--acta-sidebar-width) minmax(0,1fr) auto auto`，所以标签条左缘永远与列表/编辑器的竖缝对齐、侧栏折叠时跟着走。`--acta-sidebar-width` 在 801–1220px 是 220px，折叠后 72px。`.titlebar-meta` 装版本胶囊与 `#saveState`（右对齐、`justify-content: flex-end`）；窗口控件只在 Windows 显示（`display: flex`），macOS 红绿灯由原生落位、品牌区吃 84px 左内边距。移动端（≤800px）顶栏收成单列，标签条 / 侧边窗格隐藏，`.titlebar-meta` 变绝对定位容器、只留版本胶囊。
- **侧边标签页的规则**（改这块先读）：侧边窗格默认在右侧；收起窗格时侧边的标签全部回主标签条（不留看不见的页面），所以每次打开都是空窗格；主标签条永远至少一个标签（最后一个不给关闭口，关全部时留一个同视图空标签）。**窗格与任何主页面同屏**，整页视图（日历 / 计划板 / 总结 / 回收站）也算：`sideVisible()` 只按窗口宽度放行——列表页 1120px（`SIDE_MIN_WIDTH`），整页视图 1280px（`FULL_PAGE_SIDE_MIN_WIDTH`，日历月视图要 760px），不够宽时窗格收起、标签保留、`#tabSideButton` 由 CSS 在 1279px 以下隐藏（换回列表页或窗口变宽即回来）。整页视图下网格是四列（主页面占 2、编辑器列 0、窗格占最后，见 styles.css 的 `body.tab-side.*-view`），窗格在整页视图里收窄到 `clamp(240px,18vw,320px)`。窗格**自己**仍装不下整页视图标签（渲染是单例的），激活这类侧边标签仍会 `moveToMain` 送回主区。整页页面里点窗格卡片走 `openItem`（落到该条目所在的列表页并选中），因为那里没有编辑器列；计划板例外（编辑面板是浮层，原地打开）。
- **局域网雷达入口光效**：`body.lan-radar-live` 由 `interface.js` 的 `updateLanStateUI()` 按服务状态挂上；样式在 `styles.css`：`::before` 是呼吸柔光，`.nav-icon::after`（移动端为按钮 `::after`）是 6 秒一圈的雷达扇面，图标本身不旋转；「减少动态效果」退成静态。
- **更新**：`interface.js`（关于页 UI：检查更新、通道、下载来源、测速、版本列表）＋ `updater.js`（下载 / 读秒 / 重启）＋ `updater.rs`（GitHub API、semver 比较、平台安装）。`window.actaUpdater.install(info)` 用于"选了某个版本直接装"，跳过询问但仍走同一个下载与向导。
- **Android 更新**：`ActaUpdaterPlugin.java`，`/releases` 列表端点 + 通道过滤 + semver 取最大，下载 zip、解出 apk、交给系统安装器。

## 5. 设计约定

- 颜色、字号一律用变量：`--ink/--paper/--panel/--white/--sage/--muted/--faint/--line`，字号写成 `calc(Npx * var(--acta-font-scale))`（界面字号设置会整体缩放，硬编码 px 会破坏这一点；冒烟测试会扫描未走缩放的字号声明）。
- 圆角 8–12px，控件高度 28–38px；悬停只改底色 / 颜色，按下 `scale(.94–.98)` 反馈，不做位移或投影抬升（`kill-ai-slop` 口径）；动效尊重 `prefers-reduced-motion`。
- 三语文案：`renderer.js` 的 `dictionaries` + `interface.js` 里的 `Object.assign(dictionaries.zh, …)`；关于页更新板块另有一份 `updateMessages`（zh / en / zh-Hant）。新增文案三处都要给。
- 弹窗一律 `<dialog class="relation-dialog">` + `.relation-dialog-head` / `-body`；网格布局用 `grid-template-areas` 而不是改 DOM 层级（`.workspace` 的三列被日历 / 计划板 / 总结的 `!important` 规则依赖）。
- **空态里的角色**：Handy 是品牌小人（尖顶脑袋 + 两只眼睛 + 梯形身子），只在列表空着与未选中内容时出现。它替代的是一枚图标，所以不给它垫彩色底板、不加投影；动作只保留呼吸 / 眨眼 / 点头三样，幅度 2° / 2px 以内，三个周期错开——这三条是刻意的克制（`kill-ai-slop` 与 `apple-design` 的口径：循环动画要么有用、要么安静，不拿它当装饰）。改尺寸 / 颜色只动 `.handy-figure` 的 `height` 与 `color`，眼睛颜色走 `var(--paper)`（深色主题下脑袋是浅的，白眼睛会消失）。
- **顶栏是唯一一条横带**：品牌、标签条、状态与版本、窗口控件全在 52px 高的 `.titlebar` 里，不要再给标签条单开一行。顶栏底色是 `var(--sidebar)`（各主题差异很大：深色近黑、MWS 浅色是品牌绿），所以上面的一切文字 / 边框 / 悬停底色都用 `--chrome-line` / `--chrome-hover` / `--chrome-muted` 三个混色令牌（定义在 `.titlebar`，MWS 浅色主题另行覆盖成白色系），不要写死浅灰。**工作区网格的侧栏列（普通三列、`body.tab-side` 四列、整页视图）一律用 `var(--acta-sidebar-width)`**，与顶栏品牌列同一事实来源——硬编码（如 248px / 220px）会让折叠态（72px）下窗格模式把侧栏拉回旧宽、顶栏与列表竖缝错位（beta8 修过一回，别再犯）。

## 6. 容易踩的坑

1. **版本号有 7 处**：`package.json`、`package-lock.json`（两处）、`src-tauri/tauri.conf.json`、`src-tauri/Cargo.toml`、`src-tauri/Cargo.lock`（`name = "acta"` 那条）、`public/service-worker.js` 的 `CACHE_NAME`、`src/App.vue` 的 `.brand-version` 与 `#aboutVersion`（连同「本版更新日期」）。README 顶部再写一次。冒烟测试用 `package.json` 的版本断言界面版本，漏改会挂在 `expandedBrandVersionVisible`。
2. **`docs/` 是构建产物**，不要手改；需要更新就 `npm run build:pages`。
3. **`public/legacy/renderer.js` 不是构建产物**，它就是源文件，改了直接生效。
4. **预发布版本号必须按 semver 比**：三端都有实现（`compareActaVersion` / `compare_release_tags` / `compareVersions`），不要再退回「取前三段数字」的写法——`beta10` 会被算成和 `beta9` 一样。
5. **GitHub Release 列表按发布时间排**，不是版本号顺序；取「最新版」要过滤后按 semver 取最大，不能取第一个。
6. **更新资产命名**固定为 `Acta-<版本>-<平台>-<架构>.zip`，`pick_asset` 按后缀挑平台包；版本列表只列出当前平台真有资产的发布。
7. **冒烟测试在本机沙箱**：`pipe:true` 会卡在 launch，需要复制到 `/tmp`、把 `puppeteer-core` / `vite` / `path.join(__dirname,'..')` 换成绝对路径、去掉 pipe 并加 `--no-sandbox --remote-debugging-port=0`，并在项目根目录下运行（脚本按相对路径读 css）。
8. **界面缩放**：`zoom` 挂在 `.app-shell` 与各顶层弹层上，不在根元素；自定义手势里「视觉 px → 布局值」要除以 `actaZoom()`。
9. **窗格与整页视图共存（三处别踩）**：`#tabSidePane` 元素同时带 `.item-pane` 与 `.tab-side-pane` 两个类——`body.calendar-view` / `board-view` / `stats-view` / `trash-view` 的页头与底色规则一律要写成 `.item-pane:not(.tab-side-pane)`，否则计划板的浮动标题行会把窗格页头也变成绝对定位、卡片压到标题下；`.tab-side-pane` 的 `z-index: 25` 是给计划板编辑面板「收起时向右滑进窗格那一列」用的（面板 z 24，滑出后消失在窗格后面）；面板的拖宽条与关闭钮不是网格子项（包含块是整个 `.workspace`），右偏移要把 `--tab-side-width` 加进去。
10. **移动端断点 800px**：`.workspace` 变 `display:block`、编辑器全屏、标签条 / 侧边标签条 / 侧边窗格隐藏；侧边入口在 1120px 以下也不提供。
11. **标签页的网格与 localStorage 不要另起一套**：`.titlebar` 是四列 `brand / tabs / meta / controls`，`.workspace` 只剩一行 `side / list / editor`（`body.tab-side` 再加 `sidepane` 一列，见 `styles.css`）——两侧的竖缝靠 `--acta-sidebar-width` 对齐，整页视图的列宽覆盖规则依赖 `.workspace` 的结构；标签持久化的键仍是 `acta.tabs.v1`，改结构要在 `tabs.js` 的 `restore()` 里兼容旧版本，否则用户的标签布局会丢。
12. **顶栏里的标签不能触发窗口拖动**：窗口拖动由 `tauri-bridge.js` 在 document 捕获阶段判定（`DRAG_BLOCKERS` + 6px 死区）。标签条进了顶栏后，`.tab-item` 必须在 `DRAG_BLOCKERS` 里，否则按住标签拖页面会变成拖窗口；新建 / 侧边 / 收起按钮是 `<button>`，本来就被拦。
13. **macOS 顶栏不再居中品牌**：顶栏中段归标签页后，`.brand` 回左侧、`styles.css` 的 `padding-left: 84px` 让开原生红绿灯；不要再写回「logo 绝对居中」的规则，它会把标签条挤到一半。

## 7. 常用命令

```bash
npm run dev            # Vite dev server（预览 / 手动验收）
npm run typecheck      # vue-tsc（覆盖 App.vue 与 TS）
npm test               # 无头冒烟测试（需要本机 Edge 或 Chrome）
npm run build          # 构建 Web 资源到 dist/
npm run build:pages    # 构建 PWA 站点到 docs/
npm run desktop:build  # 当前平台桌面应用（先 vite build）
npm run android:sync   # 构建 Web 资源并同步到 Android 工程
```

修改 Rust（`src-tauri/`）或 Java（`android/`）时本机无法在 Web 预览里验证，需要对应平台构建后确认。
