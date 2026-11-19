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
                           没有响应式状态，脚本按 id 绑节点。
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
src/legacy/tabs.js         标签页（页面状态快照 + 并排副窗格）
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
- **持久化**：`localStorage` 键——`acta.library.v1`（正文数据）、`acta.settings.v1`（用户偏好）、`acta.interface.settings.v1`（界面设置，桌面端另镜像到数据文件夹的 `settings.json`）、`acta.tabs.v1`（标签页布局，设备本地，不随档案同步）。数据档案格式为 v4：`acta-manifest.json`、`classifications.json`、`notes/`、`todos/`、`boards/`，通道共有五条（见 `2026-10-26` 的工作记忆），改动档案结构要同时改 Rust、WebDAV 与 Android 插件。

## 4. 功能地图

- **笔记 / 待办**：列表卡片 + 右侧编辑器；子任务（顺序模式、拖拽排序、批量添加、导出）、打卡待办、优先级、开始 / 截止时间、双向关联。
- **日历**：年 / 月 / 周 / 日四种视图，周数、快速跳转、移动端独立滚动；`body.calendar-view` 把 `.workspace` 的编辑器列压成 0。
- **计划板**：`#boardViewport` 内的相机画布，卡片 / 富文本 / 标注三类组件，图层、多选、撤销、导出 PNG/JPG/PDF；`body.board-view` 下编辑器是浮层。
- **总结 / 回收站**：整页视图，同样把编辑器列压成 0。
- **筛选**：行内只有内容类型分段（`#listTypeSwitch`），其余条件在标题行漏斗弹出的 `#listFilterPanel`；状态变量见上。
- **标签页**：`tabs.js`。一个标签 = 一整套页面状态快照；`renderList` 被包装后负责同步标签名、刷新副窗格与延迟落盘。并排只在「主页面是列表型视图」时生效（`isListView`），整页视图下按钮置灰。
- **更新**：`interface.js`（关于页 UI：检查更新、通道、下载来源、测速、版本列表）＋ `updater.js`（下载 / 读秒 / 重启）＋ `updater.rs`（GitHub API、semver 比较、平台安装）。`window.actaUpdater.install(info)` 用于"选了某个版本直接装"，跳过询问但仍走同一个下载与向导。
- **Android 更新**：`ActaUpdaterPlugin.java`，`/releases` 列表端点 + 通道过滤 + semver 取最大，下载 zip、解出 apk、交给系统安装器。

## 5. 设计约定

- 颜色、字号一律用变量：`--ink/--paper/--panel/--white/--sage/--muted/--faint/--line`，字号写成 `calc(Npx * var(--acta-font-scale))`（界面字号设置会整体缩放，硬编码 px 会破坏这一点；冒烟测试会扫描未走缩放的字号声明）。
- 圆角 8–12px，控件高度 28–38px；悬停只改底色 / 颜色，按下 `scale(.94–.98)` 反馈，不做位移或投影抬升（`kill-ai-slop` 口径）；动效尊重 `prefers-reduced-motion`。
- 三语文案：`renderer.js` 的 `dictionaries` + `interface.js` 里的 `Object.assign(dictionaries.zh, …)`；关于页更新板块另有一份 `updateMessages`（zh / en / zh-Hant）。新增文案三处都要给。
- 弹窗一律 `<dialog class="relation-dialog">` + `.relation-dialog-head` / `-body`；网格布局用 `grid-template-areas` 而不是改 DOM 层级（`.workspace` 的三列被日历 / 计划板 / 总结的 `!important` 规则依赖）。

## 6. 容易踩的坑

1. **版本号有 7 处**：`package.json`、`package-lock.json`（两处）、`src-tauri/tauri.conf.json`、`src-tauri/Cargo.toml`、`src-tauri/Cargo.lock`（`name = "acta"` 那条）、`public/service-worker.js` 的 `CACHE_NAME`、`src/App.vue` 的 `.brand-version` 与 `#aboutVersion`（连同「本版更新日期」）。README 顶部再写一次。冒烟测试用 `package.json` 的版本断言界面版本，漏改会挂在 `expandedBrandVersionVisible`。
2. **`docs/` 是构建产物**，不要手改；需要更新就 `npm run build:pages`。
3. **`public/legacy/renderer.js` 不是构建产物**，它就是源文件，改了直接生效。
4. **预发布版本号必须按 semver 比**：三端都有实现（`compareActaVersion` / `compare_release_tags` / `compareVersions`），不要再退回「取前三段数字」的写法——`beta10` 会被算成和 `beta9` 一样。
5. **GitHub Release 列表按发布时间排**，不是版本号顺序；取「最新版」要过滤后按 semver 取最大，不能取第一个。
6. **更新资产命名**固定为 `Acta-<版本>-<平台>-<架构>.zip`，`pick_asset` 按后缀挑平台包；版本列表只列出当前平台真有资产的发布。
7. **冒烟测试在本机沙箱**：`pipe:true` 会卡在 launch，需要复制到 `/tmp`、把 `puppeteer-core` / `vite` / `path.join(__dirname,'..')` 换成绝对路径、去掉 pipe 并加 `--no-sandbox --remote-debugging-port=0`，并在项目根目录下运行（脚本按相对路径读 css）。
8. **界面缩放**：`zoom` 挂在 `.app-shell` 与各顶层弹层上，不在根元素；自定义手势里「视觉 px → 布局值」要除以 `actaZoom()`。
9. **移动端断点 800px**：`.workspace` 变 `display:block`、编辑器全屏、标签条与副窗格隐藏；并排入口在 1120px 以下也不提供。

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
