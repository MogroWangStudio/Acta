(() => {
  const uiStorageKey = 'acta.interface.settings.v1';
  const defaultUISettings = {
    defaultView: 'inbox', compact: false, reduceMotion: false, theme: 'eye-yellow',
    customPaper: '#fbfaf6', customSidebar: '#ebe7dc', customAccent: '#526b55',
    customTodo: '#4f86a8', customTodoSoft: '#dceef8', customNote: '#987329', customNoteSoft: '#fff0bd', customCalendar: '#4f7656', customCalendarSoft: '#dcebdd',
    appIconPreset: 'default', customAppIcon: '',
    splashAnimationEnabled: true, splashAnimationPreset: 'acta-lines', splashAnimationSpeed: 1, inputFocusAnimation: true, subtaskCompletedDates: true,
    completedTodoSink: true, completedTodoSinkDelay: 1, subtaskDoneSort: 'asc', backdropClose: 'double',
    navPages: { inbox: true, calendar: true, todos: false, notes: false, trash: true, stats: true, lan: true },
    mobileSlots: ['trash', 'stats'], mobileTitleActions: ['trash', 'stats', 'refresh'], mobileNavStyle: 'labeled',
    runInBackground: false,
    lanDeviceName: '', lanDeviceIcon: '', lanPort: 0, lanAutomations: [], lanAutomationRuns: {},
    appFont: 'system', customFont: 'Inter', appFontSize: 14,
    noteHeadingH1Size: 32, noteHeadingH2Size: 24, noteHeadingH3Size: 19, noteBaseSize: 17, noteHeadingFont: 'serif', noteHeadingCustomFont: '', noteLineHeight: 1.6, noteParagraphGap: 1,
    noteToolbarPosition: 'bottom', noteToolbarShowLabels: false,
    oneDriveFolder: '', oneDriveLabel: '', workspaceLabel: '',
    dataProfiles: [], activeDataProfileId: '', lanTrustLan: false, webDavServer: '', webDavUsername: '', autoSync: false, autoSyncInterval: 5, lanDiscoverable: false, listPaneWidth: 330, sidebarCollapsed: false, language: ['zh', 'zh-Hant', 'en'].includes(settings.language) ? settings.language : 'zh'
  };
  let uiSettings = { ...defaultUISettings };
  try { uiSettings = { ...uiSettings, ...(JSON.parse(localStorage.getItem(uiStorageKey)) || {}) }; } catch { /* Use safe defaults. */ }
  // 软件数据位置（桌面端）：设置镜像写入所选文件夹中的 settings.json，
  // localStorage 继续作为运行时缓存；清缓存后可从文件恢复。
  const appDataState = { path: '', ready: false };
  let appDataSaveTimer = 0;
  function appDataBridge() {
    return window.actaDesktop?.resolveAppData ? window.actaDesktop : null;
  }
  function scheduleAppDataSave() {
    const bridge = appDataBridge();
    if (!bridge || !appDataState.ready) return;
    clearTimeout(appDataSaveTimer);
    appDataSaveTimer = setTimeout(() => {
      bridge.saveAppDataSettings(JSON.stringify(uiSettings, null, 2)).catch(() => {});
    }, 600);
  }
  const legacyAppIconPresets = { classic:'default', forest:'positive', sunset:'outline', midnight:'original' };
  const migratedAppIconPreset = Boolean(legacyAppIconPresets[uiSettings.appIconPreset]);
  if (migratedAppIconPreset) uiSettings.appIconPreset = legacyAppIconPresets[uiSettings.appIconPreset];
  const migratedTodayView = uiSettings.defaultView === 'today';
  if (migratedTodayView) uiSettings.defaultView = 'calendar';
  const migratedStatsView = uiSettings.defaultView === 'completed';
  if (migratedStatsView) uiSettings.defaultView = 'stats';

  const byId = id => document.getElementById(id);
  const settingsModal = byId('settingsModal');
  const saveUISettings = () => {
    localStorage.setItem(uiStorageKey, JSON.stringify(uiSettings));
    scheduleAppDataSave();
  };
  if (migratedTodayView || migratedAppIconPreset) saveUISettings();
  const saveRendererSettings = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...settings, language: uiSettings.language === 'zh-Hant' ? 'zh' : uiSettings.language }));
  if (migratedTodayView || migratedStatsView) saveUISettings();
  Object.assign(dictionaries.zh, { syncTitle:'连接本地文件夹', syncCopy:'选择设备本地、局域网或系统已挂载的网络文件夹。Acta 会在其中读写清单、归类、notes 和 todos 完整数据文件夹。', download:'下载完整数据文件夹', upload:'上传完整数据文件夹', taskDoneSortHint:'按完成时间正序或倒序排列已完成的子任务' });
  Object.assign(dictionaries.en, { syncTitle:'Connect a local folder', syncCopy:'Choose a device folder, LAN location, or mounted network folder. Acta reads and writes the complete manifest, classifications, notes, and todos data folder there.', download:'Download complete data folder', upload:'Upload complete data folder', taskDoneSortHint:'Sort completed subtasks by completion time, oldest or newest first' });
  dictionaries['zh-Hant'] = {
    ...dictionaries.zh,
    saved:'已儲存', saving:'正在儲存…', new:'新增', quickCapture:'速記', quickCaptureHint:'快速建立待辦或筆記', newNote:'新增筆記', newNoteHint:'記錄想法與靈感', newTodo:'新增待辦', newTodoHint:'拆解目標與行動',
    inbox:'收集箱', today:'今天', todos:'待辦', notes:'筆記', completed:'已完成', folders:'歸類', classify:'歸類', unclassified:'未歸類', cloudSync:'資料同步', notConfigured:'尚未設定', localWorkspace:'本機行記資料', workspace:'行記資料', actaData:'行記資料',
    search:'搜尋筆記和待辦…', all:'全部', localFirst:'本機優先', syncTitle:'連接本機資料夾', syncCopy:'選擇裝置本機、區域網路或系統已掛載的網路資料夾。Acta 會在其中讀寫清單、歸類、notes 和 todos 完整資料資料夾。',
    chooseFolder:'選擇同步資料夾', noFolder:'尚未選擇位置', download:'下載完整資料資料夾', upload:'上傳完整資料資料夾', safeLocal:'資料預設只儲存在你的裝置上',
    item:'個項目', note:'筆記', todo:'待辦', justNow:'剛剛', yesterday:'昨天', noItems:'這裡還沒有內容', noItemsHint:'新增一則筆記或待辦，開始記錄。',
    selectItem:'選擇一項開始編輯', selectItemHint:'你的想法與行動會在這裡展開。', untitledNote:'未命名筆記', untitledTodo:'新的待辦', created:'建立於', updated:'更新於',
    dueDate:'截止日期', priority:'優先順序', tags:'標籤', high:'高', medium:'中', low:'低', progress:'任務進度', done:'已完成', addTask:'新增子任務', taskPlaceholder:'輸入一個具體行動…',
    description:'補充說明', descriptionPlaceholder:'寫下背景、上下文或任何需要記住的細節…', notePlaceholder:'從一個想法開始…', words:'字', chars:'字元',
    folderPrompt:'新歸類的名稱', folderDefault:'新歸類', folderAdded:'歸類已新增', itemCreated:'已建立', deleted:'已刪除', deleteConfirm:'確定要刪除這一項嗎？',
    synced:'已同步', syncReady:'已連接', uploadDone:'已寫入同步位置', downloadDone:'已從同步位置還原', chooseFirst:'請先選擇同步資料夾', syncWorking:'正在同步…', invalidData:'同步失敗',
    noDate:'無日期', commaTags:'用逗號分隔', format:'格式', heading:'標題', completeTask:'完成待辦', reopenTask:'重新開啟', modified:'最後編輯', archive:'封存',
    viewToday:'今天', viewTodos:'所有待辦', viewNotes:'所有筆記', viewFolder:'歸類', languageChanged:'已切換為繁體中文',
    inboxFolder:'靈感收集', workFolder:'工作計畫', lifeFolder:'生活清單', readingFolder:'閱讀摘記', linkedItems:'關聯項目', linkTodo:'關聯待辦', linkNote:'關聯筆記',
    chooseTodo:'選擇一個待辦…', chooseNote:'選擇一則筆記…', noLinks:'還沒有關聯項目', unlink:'取消關聯', linked:'已建立雙向關聯', unlinked:'已取消關聯',
    importNote:'匯入筆記', importNoteHint:'支援 Markdown 與純文字', exportNote:'匯出這則筆記', noteImported:'筆記已匯入', noteExported:'筆記已匯出',
    importFailed:'匯入失敗', exportFailed:'匯出失敗', fileTooLarge:'檔案不能超過 5 MB', invalidNoteFile:'無法讀取這份筆記',
    stats:'總結', showCompletedTodos:'顯示已完成', statOpen:'進行中', confirm:'確定', cancel:'取消',
    statsEmpty:'這裡還沒有內容可以統計', statsEmptyHint:'建立筆記或待辦後，這裡會展示記錄情況。',
    trash:'回收站', trashItems:'件回收',
    trashEmptyTitle:'回收站還是空的', trashEmptyHint:'刪除的待辦和筆記會先躺在這裡，不會自動清空，隨時回來翻翻，也許就有新的靈感。',
    trashFooterNote:'回收站不會自動傾倒', restore:'恢復', destroy:'徹底刪除', restored:'已恢復到原位', destroyed:'已徹底刪除',
    emptyTrash:'清空回收站', emptyTrashConfirmTitle:'清空回收站', emptyTrashConfirmMessage:'回收站中的 {0} 件內容將被徹底刪除，無法恢復。', trashEmptied:'回收站已清空',
    deletedAt:'刪除於', restoreHint:'恢復到原來的歸類', trashOpenHint:'回收站中的內容不會出現在列表、日曆與總結裡',
    deleteTitle:'刪除項目', deleteSubtitle:'選擇如何處理「{0}」', deleteTrashLabel:'移入回收站', deleteTrashHint:'保留在回收站中，隨時可以恢復', deleteDestroyLabel:'直接刪除', deleteDestroyHint:'不進入回收站，立即徹底刪除', moveToTrash:'移入回收站', deletedToTrash:'已移入回收站',
    statsListTitle:'待辦筆記清單', statsListHint:'收集指定時間段建立的待辦與筆記，勾選後可製作圖片',
    statsRangeAll:'全部時間', statsRangeToday:'今天', statsRange7:'最近 7 天', statsRange30:'最近 30 天', statsRange90:'最近 90 天', statsRangeCustom:'自訂',
    statsCustomStart:'開始日期', statsCustomEnd:'截止日期', statsMakeImage:'產生圖片', statsSelectedCount:'已選 {0} 件', statsSelectAll:'全選', statsClearSelection:'清除選擇',
    statsNeedSelection:'請先勾選要產生圖片的條目', statsImageDone:'清單圖片已產生', statsImageFailed:'圖片產生失敗', statsEmptyRange:'這個時間段還沒有內容',
    statsGroupToday:'今天', statsGroupYesterday:'昨天', statsCheckItem:'加入圖片',
    metaQuickActions:'快捷操作', metaCopyTitle:'複製標題', metaCopyBody:'複製全文', metaCopyNotes:'複製說明', metaCopyMarkdown:'複製 Markdown', metaMarkComplete:'標記完成', metaReopen:'重新開啟', metaViewCalendar:'在日曆查看', metaTrash:'移入回收站',
    copied:'已複製到剪貼簿', copyFailed:'複製失敗',
    board:'計劃板', boardDefaultName:'計劃板', boardOpenItem:'開啟內容', boardFitView:'總覽全板', boardZoomIn:'放大', boardZoomOut:'縮小',
    boardNewBoard:'新建計劃板', boardRenameBoard:'重新命名計劃板', boardDeleteBoard:'刪除計劃板', boardNamePrompt:'計劃板名稱',
    boardDeleteConfirm:'刪除「{0}」後，這塊板上的擺放、文字與標註會一併移除，待辦與筆記本身不受影響。', boardSwitchLabel:'切換計劃板',
    boardAddText:'文字', boardAddMarker:'標註', boardAddItems:'匯入', boardImportTitle:'匯入到計劃板',
    boardImportHint:'勾選要展示在這塊板上的待辦與筆記；取消勾選已新增的條目會把它從板上移除。',
    boardImportAdded:'已在板上', boardImportEmpty:'沒有符合的待辦或筆記', boardImportApply:'套用', boardImportChange:'新增 {0} · 移除 {1}',
    boardTextPlaceholder:'雙擊編輯文字…', boardFontSize:'字號', boardFontLabel:'字型', boardFontApp:'跟隨介面', boardFontSerif:'襯線', boardFontRounded:'圓體', boardFontMono:'等寬',
    boardAlignLeft:'靠左對齊', boardAlignCenter:'置中對齊', boardAlignRight:'靠右對齊', boardRemoveWidget:'從板上移除',
    boardMarkerArrow:'箭頭', boardMarkerRect:'方框', boardMarkerEllipse:'橢圓', boardMarkerLine:'直線', boardMarkerDraw:'畫筆', boardMarkerColor:'標註顏色', boardMarkerDone:'完成標註',
    boardBg:'背景', boardBgNone:'無背景', boardBgOpacity:'不透明度', boardRadius:'圓角', boardPadding:'內邊距', boardCustomFont:'自訂字型', boardCustomFontHint:'輸入本機已安裝的字型名稱，如 Georgia',
    boardDeleteArm:'再點一次刪除', boardUndo:'復原', boardRedo:'重做', boardMarqueeClear:'取消選擇', boardMarqueeDelete:'刪除所選', boardSelectedCount:'已選 {0} 項',
    boardEmptyTitle:'這塊板還是空的', boardEmptyHint:'用下方工具新增文字與標註，或匯入想展示在這塊板上的待辦與筆記，自由擺放成你的計劃板。'
  };
  Object.assign(dictionaries['zh-Hant'], { taskDoneSortHint:'按完成時間正序或倒序排列已完成的子任務' });
  Object.assign(dictionaries.zh, { lanRadarNav:'局域网雷达', '返回':'返回' });
  Object.assign(dictionaries.en, { '返回':'Back' });
  Object.assign(dictionaries['zh-Hant'], { '返回':'返回' });
  Object.assign(dictionaries.en, {
    lanRadarNav:'LAN radar', '局域网雷达':'LAN radar',
    '设备名称':'Device name', '其他设备在雷达和同步请求中看到的名字，留空时使用电脑主机名':"The name other devices see on the radar and in sync requests; leave empty to use this computer's hostname", '本机主机名':"This computer's hostname",
    '设备图标':'Device icon', '用一个 emoji 作为本机在雷达上的头像，留空显示默认图标':"Use an emoji as this device's avatar on the radar; leave empty for the default icon", '例：🌿':'e.g. 🌿',
    '服务端口':'Service port', 'TCP 端口，留空自动分配；修改后需重开发现':'TCP port; empty means automatic', '自动分配':'Automatic',
    '关闭窗口时转入后台':'Keep running in the background', '关闭窗口后保留在系统托盘，局域网同步继续；可从托盘恢复或退出':'Closing the window keeps Acta in the tray; LAN sync continues. Restore or quit from the tray',
    '同步自动化':'Sync automations', '组合备份、冲突检查与收发步骤，按触发器自动执行':'Compose backups, conflict checks, and transfers; run by trigger', '新建自动化':'New automation',
    '保存 Acta 自身的设置；行记数据仍按数据档案的位置存储。':'Stores Acta\'s own settings; data profiles keep their own locations.',
    '更改后立即迁移现有设置':'Existing settings migrate immediately',
    '勾选框旁显示完成日期，悬停看时刻':'Show completion dates next to checkboxes',
    '列表与归类视图默认显示已完成待办':'Show completed tasks in lists and folders by default',
    '完成后先停留再移到列表末尾，可撤回':'Completed cards linger, then glide to the end',
    '完成到开始移动的等待时间':'Wait before a completed card moves',
    '点击右侧按钮可预览':'Preview with the button on the right',
    '数值越大播放越快':'Higher values play faster',
    '聚焦时边框与光环淡入':'Focus ring fades in on inputs',
    '留空时使用主机名':'Empty means this computer\'s hostname',
    '雷达头像，留空用默认图标':'Emoji avatar on the radar',
    '每个档案都包含完整的归类、笔记和待办，可保存在本地或指定文件夹。':'Each profile holds classifications, notes, and tasks; local or folder-backed.',
    '空间不足时浏览器可能清理本地数据，请定期导出备份。':'Browsers may evict local data; export backups regularly.',
    '当前档案的容量与内容概览':'Size and content of the active profile'
  });
  Object.assign(dictionaries['zh-Hant'], {
    lanRadarNav:'區域網路雷達', '局域网雷达':'區域網路雷達',
    '设备名称':'裝置名稱', '留空时使用主机名':'留空時使用主機名稱', '本机主机名':'本機主機名稱',
    '设备图标':'裝置圖示', '雷达头像，留空用默认图标':'雷達頭像，留空用預設圖示', '例：🌿':'例：🌿',
    '服务端口':'服務連接埠', 'TCP 端口，留空自动分配；修改后需重开发现':'TCP 連接埠，留空自動分配；修改後需重開探索', '自动分配':'自動分配',
    '关闭窗口时转入后台':'關閉視窗時轉入背景', '关闭窗口后保留在系统托盘，局域网同步继续；可从托盘恢复或退出':'關閉視窗後保留在系統托盤，區域網路同步繼續；可從托盤還原或結束',
    '同步自动化':'同步自動化', '组合备份、冲突检查与收发步骤，按触发器自动执行':'組合備份、衝突檢查與收發步驟，按觸發器自動執行', '新建自动化':'新增自動化'
  });
  Object.assign(dictionaries.zh, { high:'优先处理', medium:'稍后处理', low:'延缓处理' });
  Object.assign(dictionaries.en, { high:'Do first', medium:'Do later', low:'Delay' });
  Object.assign(dictionaries['zh-Hant'], { high:'優先處理', medium:'稍後處理', low:'延緩處理' });
  Object.assign(dictionaries.zh, {
    allPriorities:'全部优先级', allDeadlines:'全部截止时间', overdue:'已逾期', dueToday:'今天截止', nextSevenDays:'未来 7 天', withoutDeadline:'无截止时间',
    allFolders:'全部归类', allRelations:'全部关联', linkedOnly:'已关联', unlinkedOnly:'未关联', anyUpdatedTime:'全部更新时间', lastSevenDays:'最近 7 天', lastThirtyDays:'最近 30 天',
    clearFilters:'清除筛选', filterByPriority:'按优先级筛选', filterByDeadline:'按截止时间筛选', filterByFolder:'按归类筛选', filterByRelation:'按关联状态筛选', filterByUpdated:'按更新时间筛选',
    sortBy:'排序方式', sortUpdated:'最近更新', sortCreated:'最近创建', sortDue:'按截止时间', sortPriority:'按优先级', sortTitle:'按标题'
  });
  Object.assign(dictionaries.en, {
    allPriorities:'All priorities', allDeadlines:'All deadlines', overdue:'Overdue', dueToday:'Due today', nextSevenDays:'Next 7 days', withoutDeadline:'No deadline',
    allFolders:'All classifications', allRelations:'All links', linkedOnly:'Linked', unlinkedOnly:'Unlinked', anyUpdatedTime:'Any update time', lastSevenDays:'Last 7 days', lastThirtyDays:'Last 30 days',
    clearFilters:'Clear filters', filterByPriority:'Filter by priority', filterByDeadline:'Filter by deadline', filterByFolder:'Filter by classification', filterByRelation:'Filter by link status', filterByUpdated:'Filter by update time',
    sortBy:'Sort', sortUpdated:'Recently updated', sortCreated:'Recently created', sortDue:'By due date', sortPriority:'By priority', sortTitle:'By title'
  });
  Object.assign(dictionaries['zh-Hant'], {
    allPriorities:'全部優先順序', allDeadlines:'全部截止時間', overdue:'已逾期', dueToday:'今天截止', nextSevenDays:'未來 7 天', withoutDeadline:'無截止時間',
    allFolders:'全部歸類', allRelations:'全部關聯', linkedOnly:'已關聯', unlinkedOnly:'未關聯', anyUpdatedTime:'全部更新時間', lastSevenDays:'最近 7 天', lastThirtyDays:'最近 30 天',
    clearFilters:'清除篩選', filterByPriority:'按優先順序篩選', filterByDeadline:'按截止時間篩選', filterByFolder:'按歸類篩選', filterByRelation:'按關聯狀態篩選', filterByUpdated:'按更新時間篩選',
    sortBy:'排序方式', sortUpdated:'最近更新', sortCreated:'最近建立', sortDue:'按截止時間', sortPriority:'按優先順序', sortTitle:'按標題'
  });
  Object.assign(dictionaries['zh-Hant'], {
    calendar:'日曆', yearView:'年', monthView:'月', weekView:'週', dayView:'日', previousPeriod:'上一時段', nextPeriod:'下一時段', previousYear:'上一年', nextYear:'下一年', previousMonth:'上一月', nextMonth:'下一月', previousWeek:'上一週', nextWeek:'下一週', previousDay:'上一日', nextDay:'下一日', backToToday:'今天', calendarNavigation:'日曆導覽', calendarViewOptions:'日曆檢視',
    noScheduledTodos:'這段時間沒有待辦', noScheduledTodosHint:'為待辦設定截止日期後，它會顯示在日曆中。', scheduledTodos:'項待辦',
    noCalendarItems:'這段時間沒有日曆內容', noCalendarItemsHint:'有排程的待辦和當天建立的筆記會顯示在這裡。', calendarItems:'項日曆內容', createdNotes:'當日建立筆記',
    moreTodos:'另有 {0} 項', linkedNotes:'關聯筆記', calendarLegendLinked:'帶筆記關聯', calendarOpenTodo:'開啟待辦', calendarOpenNote:'開啟筆記', calendarOpenDay:'查看當日', weekNumber:'週數', swipeWeekHint:'左右滑動查看其他日期'
  });
  Object.assign(dictionaries.zh, {
    paragraph:'正文', heading1:'一级标题', heading2:'二级标题', heading3:'三级标题', bold:'粗体', italic:'斜体', strike:'删除线', highlight:'高亮',
    inlineCode:'行内代码', codeBlock:'代码块', quote:'引用', bulletList:'无序列表', numberedList:'有序列表', taskList:'任务列表', horizontalRule:'分隔线',
    link:'添加链接', unlink:'取消链接', undo:'撤销', redo:'重做', markdownSource:'Markdown 源码', richText:'可视化编辑', focusMode:'沉浸编辑', focusModeExit:'退出沉浸编辑', focusModeHint:'沉浸编辑', linkPrompt:'输入链接地址', invalidLink:'请输入有效的 HTTP、HTTPS 或邮箱链接', selectTextFirst:'请先选择要格式化的文字'
  });
  Object.assign(dictionaries.en, {
    paragraph:'Body', heading1:'Heading 1', heading2:'Heading 2', heading3:'Heading 3', bold:'Bold', italic:'Italic', strike:'Strikethrough', highlight:'Highlight',
    inlineCode:'Inline code', codeBlock:'Code block', quote:'Blockquote', bulletList:'Bulleted list', numberedList:'Numbered list', taskList:'Task list', horizontalRule:'Divider',
    link:'Add link', unlink:'Remove link', undo:'Undo', redo:'Redo', markdownSource:'Markdown source', richText:'Visual editor', focusMode:'Immersive editing', focusModeExit:'Exit immersive editing', focusModeHint:'Immersive editing', linkPrompt:'Enter a link', invalidLink:'Enter a valid HTTP, HTTPS, or email link', selectTextFirst:'Select text to format first'
  });
  Object.assign(dictionaries['zh-Hant'], {
    paragraph:'正文', heading1:'一級標題', heading2:'二級標題', heading3:'三級標題', bold:'粗體', italic:'斜體', strike:'刪除線', highlight:'醒目標記',
    inlineCode:'行內程式碼', codeBlock:'程式碼區塊', quote:'引用', bulletList:'無序清單', numberedList:'有序清單', taskList:'任務清單', horizontalRule:'分隔線',
    link:'新增連結', unlink:'取消連結', undo:'復原', redo:'重做', markdownSource:'Markdown 原始碼', richText:'視覺化編輯', focusMode:'沉浸編輯', focusModeExit:'退出沉浸編輯', focusModeHint:'沉浸編輯', linkPrompt:'輸入連結地址', invalidLink:'請輸入有效的 HTTP、HTTPS 或電子郵件連結', selectTextFirst:'請先選取要格式化的文字'
  });

  // 子任务批量添加与导出。
  Object.assign(dictionaries.zh, {
    bulkAddTask:'快速添加子任务', bulkAddTaskHint:'每行一条子任务，粘贴清单一键添加', bulkAddPlaceholder:'每行输入一条子任务…',
    bulkAddConfirm:'添加 {0} 条子任务', bulkAddEmpty:'请先输入至少一条子任务', bulkAddDone:'已添加 {0} 条子任务',
    exportTasks:'导出子任务', exportTasksHint:'复制或保存为分行文字 / 任务清单', exportFormatTitle:'导出格式',
    exportFormatLines:'分行文字', exportFormatLinesHint:'每行一条，不带完成状态',
    exportFormatChecklist:'任务清单', exportFormatChecklistHint:'Markdown 任务语法，保留完成状态',
    exportCopyClipboard:'复制到剪贴板', exportTasksTxt:'导出 TXT', exportTasksMd:'导出 Markdown',
    tasksExported:'子任务已导出', tasksExportEmpty:'还没有可导出的子任务',
    exportIncludeDone:'包含已完成的子任务', exportIncludeDoneHint:'关闭后只导出未完成的子任务',
    exportNumbering:'序号样式', exportNumberingNone:'不加序号', exportNumberingDot:'1. 2. 3.', exportNumberingDunhao:'1、2、3、', exportNumberingCn:'一、二、三、', exportNumberingParen:'(1) (2) (3)'
  });
  Object.assign(dictionaries.en, {
    bulkAddTask:'Quick-add subtasks', bulkAddTaskHint:'One subtask per line — paste a list and add them all at once', bulkAddPlaceholder:'Type one subtask per line…',
    bulkAddConfirm:'Add {0} subtasks', bulkAddEmpty:'Type at least one subtask first', bulkAddDone:'Added {0} subtasks',
    exportTasks:'Export subtasks', exportTasksHint:'Copy or save as plain lines or a task list', exportFormatTitle:'Format',
    exportFormatLines:'Plain lines', exportFormatLinesHint:'One per line, without states',
    exportFormatChecklist:'Task list', exportFormatChecklistHint:'Markdown task syntax, keeps states',
    exportCopyClipboard:'Copy to clipboard', exportTasksTxt:'Export TXT', exportTasksMd:'Export Markdown',
    tasksExported:'Subtasks exported', tasksExportEmpty:'No subtasks to export',
    exportIncludeDone:'Include completed subtasks', exportIncludeDoneHint:'Turn off to export open subtasks only',
    exportNumbering:'Numbering', exportNumberingNone:'No numbering', exportNumberingDot:'1. 2. 3.', exportNumberingDunhao:'1、2、3、', exportNumberingCn:'一、二、三、', exportNumberingParen:'(1) (2) (3)'
  });
  Object.assign(dictionaries['zh-Hant'], {
    bulkAddTask:'快速新增子任務', bulkAddTaskHint:'每行一條子任務，貼上清單一鍵新增', bulkAddPlaceholder:'每行輸入一條子任務…',
    bulkAddConfirm:'新增 {0} 條子任務', bulkAddEmpty:'請先輸入至少一條子任務', bulkAddDone:'已新增 {0} 條子任務',
    exportTasks:'匯出子任務', exportTasksHint:'複製或儲存為分行文字 / 任務清單', exportFormatTitle:'匯出格式',
    exportFormatLines:'分行文字', exportFormatLinesHint:'每行一條，不帶完成狀態',
    exportFormatChecklist:'任務清單', exportFormatChecklistHint:'Markdown 任務語法，保留完成狀態',
    exportCopyClipboard:'複製到剪貼簿', exportTasksTxt:'匯出 TXT', exportTasksMd:'匯出 Markdown',
    tasksExported:'子任務已匯出', tasksExportEmpty:'還沒有可匯出的子任務',
    exportIncludeDone:'包含已完成的子任務', exportIncludeDoneHint:'關閉後只匯出未完成的子任務',
    exportNumbering:'序號樣式', exportNumberingNone:'不加序號', exportNumberingDot:'1. 2. 3.', exportNumberingDunhao:'1、2、3、', exportNumberingCn:'一、二、三、', exportNumberingParen:'(1) (2) (3)'
  });

  // 编辑器内查找。
  Object.assign(dictionaries.zh, {
    findInItem:'查找', findInItemHint:'在当前内容中查找（Ctrl+F）', findPlaceholder:'查找…',
    findNoMatches:'无结果', findPrev:'上一个', findNext:'下一个', findClose:'关闭查找'
  });
  Object.assign(dictionaries.en, {
    findInItem:'Find', findInItemHint:'Find in this item (Ctrl+F)', findPlaceholder:'Find…',
    findNoMatches:'No matches', findPrev:'Previous match', findNext:'Next match', findClose:'Close find'
  });
  Object.assign(dictionaries['zh-Hant'], {
    findInItem:'尋找', findInItemHint:'在目前內容中尋找（Ctrl+F）', findPlaceholder:'尋找…',
    findNoMatches:'無結果', findPrev:'上一個', findNext:'下一個', findClose:'關閉尋找'
  });

  const interfaceTranslations = {
    en: {
      '设置':'Settings', '按你的方式使用 Acta':'Make Acta work your way', '关闭设置':'Close settings', '设置页面':'Settings pages',
      '语言':'Language', '工作区':'Workspace', '行记数据':'Acta Data', '数据同步':'Data sync', '常规设置':'General', '外观设置':'Appearance', '关于':'About',
      '切换界面语言，不影响笔记内容。':'Switch the interface language; notes are untouched.', '简体中文':'Simplified Chinese', '繁體中文':'Traditional Chinese', '英语':'English',
      '整个资料库保存在所选文件夹内唯一的':'The entire library is stored in a single', '文件中。':'file inside the selected folder.', '演示工作区':'Demo workspace', '演示行记数据':'Demo Acta Data', '尚未选择文件夹；本次修改不会保存。':'No folder selected; changes in this session will not be saved.',
      '选择本地文件夹':'Choose local folder', '立即保存':'Save now', '从文件重载':'Reload from file', '返回演示工作区':'Return to demo workspace', '返回演示行记数据':'Return to demo Acta Data', '当前是演示工作区。关闭或刷新页面后，演示内容会恢复，不会写入浏览器本地资料库。':'This is the demo workspace. Its content resets when you close or refresh the page and is not written to browser storage.', '当前是演示行记数据。关闭或刷新页面后，演示内容会恢复，不会写入浏览器本地资料库。':'This is demo Acta Data. Its content resets when you close or refresh the page and is not written to browser storage.',
      '启动、密度与动效偏好。':'Startup, density, and motion.', '默认启动页面':'Default startup view', '启动时进入的视图':'The view shown at launch', '收集箱':'Inbox', '今天':'Today', '所有待办':'All tasks', '所有笔记':'All notes', '日历':'Calendar', '汇总板':'Plan board', '已完成':'Completed',
      '紧凑列表':'Compact lists', '中栏密度更高':'Denser middle pane', '减少动态效果':'Reduce motion', '降低转场与弹性动画':'Fewer transitions and springs', '设置会自动保存在当前设备。':'Settings are saved automatically on this device.',
      '点击空白处':'Click outside dialogs', '点空白处如何关闭弹窗，默认双击防误触':'How clicks on blank areas close dialogs; double click by default', '不关闭（防误触）':"Don't close (accident protection)", '单击关闭':'Single click closes', '双击关闭':'Double click closes',
      '页面跳转栏':'Navigation bar', '按当前设备显示桌面侧边栏或移动端底栏与顶栏的入口。':'Show the entries for this device — the desktop sidebar, or the mobile bottom bar and titlebar.', '桌面端侧边栏':'Desktop sidebar', '勾选要显示的页面；待办与笔记默认隐藏':'Tick the pages to show; tasks and notes are hidden by default', '移动端底栏':'Mobile bottom bar', '两个槽位可替换；两端固定为收集箱与日历':'Two replaceable slots; Inbox and Calendar stay fixed', '槽位一':'Slot one', '槽位二':'Slot two', '移动端顶栏':'Mobile titlebar', '右上角三个按钮可自定义；设置按钮固定显示':'Customize the three top-right buttons; Settings stays fixed', '顶栏槽位一':'Titlebar slot one', '顶栏槽位二':'Titlebar slot two', '顶栏槽位三':'Titlebar slot three', '刷新数据':'Refresh data', '历史记录':'History', '回收站':'Trash',
      '主题只改变显示效果，不会影响任何笔记或待办数据。':'Themes only change the appearance; your notes and tasks are unaffected.', '黑白浅色':'Monochrome light', '黑白深色':'Monochrome dark', '蓝黄':'Blue and yellow', '纸色护眼':'Eye-comfort paper', '默认':'Default', '自定义':'Custom',
      '纸张颜色':'Paper color', '侧栏颜色':'Sidebar color', '强调颜色':'Accent color', '界面字体':'Interface font', '应用于列表、编辑器与设置页':'Applies to lists, editor, and settings', '系统默认':'System default', '衬线字体':'Serif', '圆体':'Rounded', '等宽字体':'Monospace', '自定义字体':'Custom font',
      '字体家族':'Font family', '本机已安装的字体，如 Inter':'A font installed on this device, e.g. Inter', '字体大小':'Font size', '界面整体缩放':'Scale the whole interface', '记录，然后行动。Acta 让笔记与待办自然连接。':'Capture, then act. Acta connects notes and tasks naturally.',
      '先支持 OneDrive 本地同步文件夹；上传与下载均使用完整资料库数据文件。':'OneDrive local sync folders are supported first. Upload and download both use the complete library file.', '尚未选择 OneDrive 同步文件夹':'No OneDrive sync folder selected', 'OneDrive 文件操作':'OneDrive file access', '由 OneDrive 客户端把 acta-library.json 同步到云端':'The OneDrive client syncs acta-library.json to the cloud', '选择文件夹':'Choose folder',
      '自动同步':'Automatic sync', '本地内容变化后自动上传，并定时检查 OneDrive 文件中的更新':'Upload local changes automatically and periodically check the OneDrive file for updates', '检查频率':'Check frequency', '仅 Acta 运行时执行':'Only while Acta is running', '每 1 分钟':'Every minute', '每 5 分钟':'Every 5 minutes', '每 15 分钟':'Every 15 minutes',
      '从 OneDrive 下载':'Download from OneDrive', '上传到 OneDrive':'Upload to OneDrive', '请选择电脑或网页文件选择器中的 OneDrive 同步文件夹。':'Choose your OneDrive sync folder using the desktop or web folder picker.', 'Acta 不会获取你的 OneDrive 账号或密码；文件传输由系统文件夹与 OneDrive 客户端完成。':'Acta never accesses your OneDrive account or password. The system folder and OneDrive client transfer the file.',
      '关于 Acta':'About Acta', '检查更新':'Check for updates', '让笔记与行动在一个安静、可掌控的本地空间中自然连接。':'Connect notes and actions naturally in a calm, controllable local space.', '产品':'Product', '版本':'Version', '本版更新日期':'Version date', '桌面框架':'Desktop framework', '笔记、待办和设置默认保存在当前设备；只有在你主动操作时才会导入、导出或同步。':'Notes, tasks, and settings stay on this device by default. Import, export, and sync occur only when you choose them.', '作者：':'Author: ', '。项目开源、免费，欢迎学习、使用与共同改进。':'. Open source and free for learning, use, and collaboration.',
      '完整数据文件夹由 acta-manifest.json、classifications.json、notes/ 和 todos/ 组成；每则笔记与待办分别保存。':'A complete data folder contains acta-manifest.json, classifications.json, notes/, and todos/; every note and task is stored separately.', '保存完整数据文件夹':'Save complete data folder', '从数据文件夹重载':'Reload data folder', '导出数据文件夹':'Export data folder',
      'OneDrive 上传、下载和自动同步均处理完整数据文件夹，笔记与待办不会合并成单个资料库文件。':'OneDrive upload, download, and automatic sync all process the complete data folder; notes and tasks are never merged into one library file.', 'OneDrive 文件夹操作':'OneDrive folder access', '由 OneDrive 客户端同步清单、归类、notes 和 todos 整套文件夹':'The OneDrive client syncs the manifest, classifications, notes, and todos as one complete folder.', '下载完整数据文件夹':'Download complete data folder', '上传完整数据文件夹':'Upload complete data folder', '本地内容变化后自动上传，并定时检查 OneDrive 数据文件夹中的更新':'Upload local changes automatically and periodically check the OneDrive data folder for updates',
      '选择 OneDrive 本地文件夹，由系统 OneDrive 客户端负责上传和下载。':'Choose a local OneDrive folder. The system OneDrive client handles cloud transfers.', 'OneDrive 本地文件夹':'Local OneDrive folder', '尚未选择 OneDrive 本地文件夹':'No local OneDrive folder selected', '文件夹同步':'Folder sync', 'Acta 读写完整数据文件夹，云端传输由 OneDrive 客户端完成':'Acta reads and writes the complete data folder; the OneDrive client handles cloud transfers.', '选择 OneDrive 文件夹':'Choose OneDrive folder', '断开文件夹':'Disconnect folder', '请先选择电脑中的 OneDrive 本地文件夹。':'Choose a local OneDrive folder on this device first.', 'Acta 不连接 Microsoft Graph，也不获取微软账号信息；请确保系统 OneDrive 客户端正在运行。':'Acta does not connect to Microsoft Graph or read Microsoft account information. Keep the system OneDrive client running.',
      '通过 WebDAV 服务器同步完整数据文件夹。':'Sync the complete data folder through a WebDAV server.', '密码仅保存在本机；网页版需服务器允许跨域。':'The password stays on this device; CORS required on web.', '同步模式':'Sync mode', '切换后使用对应位置进行上传、下载与自动同步':'Use the selected location for upload, download, and automatic sync.', '仅建议 Windows 用户使用；云端传输由 OneDrive 客户端完成':'Recommended only for Windows users; the OneDrive client handles cloud transfers.', '服务器地址':'Server URL', 'WebDAV 目录地址':'WebDAV directory URL', '账号':'Account', 'WebDAV 用户名':'WebDAV username', '密码':'Password', '建议使用应用专用密码':'An app-specific password is recommended', 'WebDAV 连接':'WebDAV connection', '尚未连接 WebDAV':'WebDAV is not connected', '保存并测试连接':'Save and test connection', '变化后自动上传，定时检查更新':'Upload on change; poll for updates', '断开同步位置':'Disconnect sync location', '请先选择同步模式并完成连接。':'Choose a sync mode and connect it first.', 'OneDrive 模式不连接 Microsoft Graph；WebDAV 密码仅保存在当前设备，网页版需要服务器允许跨域访问。':'OneDrive mode does not use Microsoft Graph. The WebDAV password stays on this device; web access requires the server to allow cross-origin requests.'
    },
    'zh-Hant': {
      '设置':'設定', '按你的方式使用 Acta':'依照你的方式使用 Acta', '关闭设置':'關閉設定', '设置页面':'設定頁面', '语言':'語言', '工作区':'工作區', '行记数据':'行記資料', '数据同步':'資料同步', '常规设置':'一般設定', '外观设置':'外觀設定', '关于':'關於',
      '切换界面语言，不影响笔记内容。':'切換介面語言，不影響筆記內容。', '简体中文':'簡體中文', '英语':'英文',
      '整个资料库保存在所选文件夹内唯一的':'整個資料庫儲存在所選資料夾內唯一的', '文件中。':'檔案中。', '演示工作区':'示範工作區', '尚未选择文件夹；本次修改不会保存。':'尚未選擇資料夾；本次修改不會儲存。', '选择本地文件夹':'選擇本機資料夾', '立即保存':'立即儲存', '从文件重载':'從檔案重新載入', '返回演示工作区':'返回示範工作區',
      '当前是演示工作区。关闭或刷新页面后，演示内容会恢复，不会写入浏览器本地资料库。':'目前是示範工作區。關閉或重新整理頁面後，示範內容會還原，不會寫入瀏覽器本機資料庫。', '启动、密度与动效偏好。':'啟動、密度與動效偏好。', '默认启动页面':'預設啟動頁面', '启动时进入的视图':'啟動時進入的視圖', '收集箱':'收集箱', '今天':'今天', '所有待办':'所有待辦', '所有笔记':'所有筆記', '日历':'日曆', '汇总板':'計劃板', '紧凑列表':'緊湊清單', '中栏密度更高':'中欄密度更高', '减少动态效果':'減少動態效果', '降低转场与弹性动画':'降低轉場與彈性動畫', '设置会自动保存在当前设备。':'設定會自動儲存在目前裝置。',
      '点击空白处':'點擊空白處', '点空白处如何关闭弹窗，默认双击防误触':'點空白處如何關閉彈窗，預設雙擊防誤觸', '不关闭（防误触）':'不關閉（防誤觸）', '单击关闭':'單擊關閉', '双击关闭':'雙擊關閉',
      '页面跳转栏':'頁面跳轉欄', '按当前设备显示桌面侧边栏或移动端底栏与顶栏的入口。':'按目前裝置顯示桌面側邊欄或行動端底欄與頂欄的入口。', '桌面端侧边栏':'桌面端側邊欄', '勾选要显示的页面；待办与笔记默认隐藏':'勾選要顯示的頁面；待辦與筆記預設隱藏', '移动端底栏':'行動端底欄', '两个槽位可替换；两端固定为收集箱与日历':'兩個槽位可替換；兩端固定為收集箱與日曆', '槽位一':'槽位一', '槽位二':'槽位二', '移动端顶栏':'行動端頂欄', '右上角三个按钮可自定义；设置按钮固定显示':'右上角三個按鈕可自訂；設定按鈕固定顯示', '顶栏槽位一':'頂欄槽位一', '顶栏槽位二':'頂欄槽位二', '顶栏槽位三':'頂欄槽位三', '刷新数据':'重新整理資料', '历史记录':'歷史記錄',
      '勾选框旁显示完成日期，悬停看时刻':'勾選框旁顯示完成日期，懸停看時刻',
      '列表与归类视图默认显示已完成待办':'清單與歸類視圖預設顯示已完成待辦',
      '完成后先停留再移到列表末尾，可撤回':'完成後先停留再移到清單結尾，可撤回',
      '完成到开始移动的等待时间':'完成到開始移動的等待時間',
      '点击右侧按钮可预览':'點擊右側按鈕可預覽',
      '数值越大播放越快':'數值越大播放越快',
      '聚焦时边框与光环淡入':'聚焦時邊框與光環淡入',
      '每个档案都包含完整的归类、笔记和待办，可保存在本地或指定文件夹。':'每個檔案都包含完整的歸類、筆記和待辦，可保存在本機或指定資料夾。',
      '空间不足时浏览器可能清理本地数据，请定期导出备份。':'空間不足時瀏覽器可能清理本機資料，請定期匯出備份。',
      '当前档案的容量与内容概览':'目前檔案的容量與內容概覽',
      '回收站':'回收站',
      '主题只改变显示效果，不会影响任何笔记或待办数据。':'主題只改變顯示效果，不會影響任何筆記或待辦資料。', '黑白浅色':'黑白淺色', '黑白深色':'黑白深色', '蓝黄':'藍黃', '纸色护眼':'紙色護眼', '默认':'預設', '自定义':'自訂', '纸张颜色':'紙張顏色', '侧栏颜色':'側欄顏色', '强调颜色':'強調顏色', '界面字体':'介面字型', '应用于列表、编辑器与设置页':'應用於清單、編輯器與設定頁', '系统默认':'系統預設', '衬线字体':'襯線字型', '圆体':'圓體', '等宽字体':'等寬字型', '自定义字体':'自訂字型', '字体家族':'字型家族', '本机已安装的字体，如 Inter':'本機已安裝的字型，如 Inter', '字体大小':'字型大小', '界面整体缩放':'介面整體縮放', '记录，然后行动。Acta 让笔记与待办自然连接。':'記錄，然後行動。Acta 讓筆記與待辦自然連接。',
      '先支持 OneDrive 本地同步文件夹；上传与下载均使用完整资料库数据文件。':'目前支援 OneDrive 本機同步資料夾；上傳與下載均使用完整資料庫檔案。', '尚未选择 OneDrive 同步文件夹':'尚未選擇 OneDrive 同步資料夾', 'OneDrive 文件操作':'OneDrive 檔案操作', '由 OneDrive 客户端把 acta-library.json 同步到云端':'由 OneDrive 用戶端把 acta-library.json 同步到雲端', '选择文件夹':'選擇資料夾', '自动同步':'自動同步', '本地内容变化后自动上传，并定时检查 OneDrive 文件中的更新':'本機內容變更後自動上傳，並定時檢查 OneDrive 檔案中的更新', '检查频率':'檢查頻率', '仅 Acta 运行时执行':'僅 Acta 執行時運作', '每 1 分钟':'每 1 分鐘', '每 5 分钟':'每 5 分鐘', '每 15 分钟':'每 15 分鐘', '从 OneDrive 下载':'從 OneDrive 下載', '上传到 OneDrive':'上傳到 OneDrive', '请选择电脑或网页文件选择器中的 OneDrive 同步文件夹。':'請從電腦或網頁資料夾選擇器選擇 OneDrive 同步資料夾。', 'Acta 不会获取你的 OneDrive 账号或密码；文件传输由系统文件夹与 OneDrive 客户端完成。':'Acta 不會取得你的 OneDrive 帳號或密碼；檔案傳輸由系統資料夾與 OneDrive 用戶端完成。',
      '关于 Acta':'關於 Acta', '检查更新':'檢查更新', '让笔记与行动在一个安静、可掌控的本地空间中自然连接。':'讓筆記與行動在一個安靜、可掌控的本機空間中自然連接。', '产品':'產品', '版本':'版本', '本版更新日期':'本版更新日期', '桌面框架':'桌面框架', '笔记、待办和设置默认保存在当前设备；只有在你主动操作时才会导入、导出或同步。':'筆記、待辦和設定預設儲存在目前裝置；只有在你主動操作時才會匯入、匯出或同步。',
      '完整数据文件夹由 acta-manifest.json、classifications.json、notes/ 和 todos/ 组成；每则笔记与待办分别保存。':'完整資料資料夾由 acta-manifest.json、classifications.json、notes/ 和 todos/ 組成；每則筆記與待辦分別儲存。', '保存完整数据文件夹':'儲存完整資料資料夾', '从数据文件夹重载':'從資料資料夾重新載入', '导出数据文件夹':'匯出資料資料夾',
      'OneDrive 上传、下载和自动同步均处理完整数据文件夹，笔记与待办不会合并成单个资料库文件。':'OneDrive 上傳、下載和自動同步都會處理完整資料資料夾，筆記與待辦不會合併成單一資料庫檔案。', 'OneDrive 文件夹操作':'OneDrive 資料夾操作', '由 OneDrive 客户端同步清单、归类、notes 和 todos 整套文件夹':'由 OneDrive 用戶端同步清單、歸類、notes 和 todos 整套資料夾。', '下载完整数据文件夹':'下載完整資料資料夾', '上传完整数据文件夹':'上傳完整資料資料夾', '本地内容变化后自动上传，并定时检查 OneDrive 数据文件夹中的更新':'本機內容變更後自動上傳，並定時檢查 OneDrive 資料資料夾中的更新',
      '选择 OneDrive 本地文件夹，由系统 OneDrive 客户端负责上传和下载。':'選擇 OneDrive 本機資料夾，由系統 OneDrive 用戶端負責上傳和下載。', 'OneDrive 本地文件夹':'OneDrive 本機資料夾', '尚未选择 OneDrive 本地文件夹':'尚未選擇 OneDrive 本機資料夾', '文件夹同步':'資料夾同步', 'Acta 读写完整数据文件夹，云端传输由 OneDrive 客户端完成':'Acta 讀寫完整資料資料夾，雲端傳輸由 OneDrive 用戶端完成。', '选择 OneDrive 文件夹':'選擇 OneDrive 資料夾', '断开文件夹':'中斷資料夾', '请先选择电脑中的 OneDrive 本地文件夹。':'請先選擇電腦中的 OneDrive 本機資料夾。', 'Acta 不连接 Microsoft Graph，也不获取微软账号信息；请确保系统 OneDrive 客户端正在运行。':'Acta 不連接 Microsoft Graph，也不取得 Microsoft 帳號資訊；請確保系統 OneDrive 用戶端正在執行。',
      '通过 WebDAV 服务器同步完整数据文件夹。':'透過 WebDAV 伺服器同步完整資料資料夾。', '密码仅保存在本机；网页版需服务器允许跨域。':'密碼僅保存在本機；網頁版需伺服器允許跨域。', '同步模式':'同步模式', '切换后使用对应位置进行上传、下载与自动同步':'切換後使用對應位置進行上傳、下載與自動同步。', '仅建议 Windows 用户使用；云端传输由 OneDrive 客户端完成':'僅建議 Windows 使用者使用；雲端傳輸由 OneDrive 用戶端完成。', '服务器地址':'伺服器地址', 'WebDAV 目录地址':'WebDAV 目錄位址', '账号':'帳號', 'WebDAV 用户名':'WebDAV 使用者名稱', '密码':'密碼', '建议使用应用专用密码':'建議使用應用專用密碼', 'WebDAV 连接':'WebDAV 連接', '尚未连接 WebDAV':'尚未連接 WebDAV', '保存并测试连接':'儲存並測試連接', '变化后自动上传，定时检查更新':'變更後自動上傳，定時檢查更新', '断开同步位置':'中斷同步位置', '请先选择同步模式并完成连接。':'請先選擇同步模式並完成連接。', 'OneDrive 模式不连接 Microsoft Graph；WebDAV 密码仅保存在当前设备，网页版需要服务器允许跨域访问。':'OneDrive 模式不連接 Microsoft Graph；WebDAV 密碼僅儲存在目前裝置，網頁版需要伺服器允許跨來源存取。'
    }
  };
  Object.assign(interfaceTranslations.en, {
    '缓存与页面':'Cache and page',
    '清空缓存并重新加载，不删数据。':'Clear caches and reload; data is kept.',
    '清除缓存重新加载':'Clear cache and reload',
    '森林晨雾':'Forest mist', '海盐晚霞':'Sea-salt sunset', '糖果气泡':'Candy pop', '深夜霓虹':'Midnight neon', '极光夜色':'Aurora night', '多彩浅色':'Colorful light', '深色发光':'Dark glow', '特殊主题':'Special theme',
    'MWS 浅色':'MWS Light', 'MWS 深色':'MWS Dark', '品牌主题':'Brand theme', '品牌深色':'Brand dark',
    '开始使用':'Get started', '下一步':'Next', '上一步':'Back', '尚未选择':'Not chosen yet', '尚未设置':'Not set',
    '默认位置：':'Default location: ', '便携版默认使用软件目录下的 data 文件夹；也可以自选位置。':'Portable builds use the data folder next to the app by default; you can also pick your own.',
    '已就绪，软件设置将保存在这里。':'Ready - Acta will keep its settings here.', '无法使用该文件夹：':'Cannot use this folder: ',
    '无法确定默认位置，请点击「选择文件夹」手动指定。':'Could not determine a default location - pick one with "Choose folder".',
    '软件数据位置':'Software data location', '位置操作':'Location actions', '打开文件夹':'Open folder', '更改位置':'Change location',
    '更改后立即迁移现有设置':'Existing settings migrate immediately after the change',
    '保存 Acta 自身的设置；行记数据仍按数据档案的位置存储。':"Stores Acta's own settings; data profiles keep their storage locations.",
    '先选择软件数据文件夹':'Choose the software data folder first', '使用默认位置':'Use default location', '选择文件夹…':'Choose folder…',
    '选择主题、字体与大小':'Choose theme, font, and size', '选择启动动画':'Choose the launch animation',
    '基础界面':'Base interface', '内容类型':'Content types', '待办主题色':'Task accent', '待办浅色背景':'Task soft background', '笔记主题色':'Note accent', '笔记浅色背景':'Note soft background', '日历主题色':'Calendar accent', '日历浅色背景':'Calendar soft background',
    '应用图标':'App icon', '应用于 Tauri 桌面客户端和 Capacitor 移动客户端；网页标签页图标保持默认。':'Used by the Tauri desktop client and Capacitor mobile client; the browser tab icon stays unchanged.',
    '默认书页':'Default page', '正·书页':'True · Page', '勾勒·书页':'Outline · Page', '初版简洁':'Original minimal', '恢复默认图标':'Restore default icon',
    '应用图标':'App icon', '仅用于 Android 桌面图标。':'Android launcher icon only.',
    '四个预设仅用于 Android 客户端；切换后桌面启动器可能需要稍候刷新。':'The four presets are for the Android client only; launchers may take a moment to refresh after switching.',
    '桌面框架':'Desktop framework', 'Tauri（Windows/macOS），Capacitor（Android）':'Tauri (Windows/macOS), Capacitor (Android)',
    '默认图标已恢复。':'Default icon restored.', '应用图标应用失败。':'Failed to apply the app icon.',
    '底栏图标':'Bottom bar icons', '图标和文字':'Icons and labels', '仅图标':'Icons only',
    '启动动画':'Splash animation', '启动过渡画面，可关闭':'Launch splash; can be turned off',
    '动画预设':'Animation preset', '启动画面的演绎方式，可预览效果':'How the splash plays out; preview to compare.', 'Acta 线构（默认）':'Acta lines (default)', '静谧淡入':'Calm fade', '聚焦缩放':'Focus zoom',
    '动画时间':'Animation speed', '启动动画的整体播放倍率':'Overall playback speed of the splash animation', '预览动画':'Preview animation',
    '笔记编辑器':'Note editor', 'Markdown 渲染与格式工具栏。':'Markdown rendering and the format toolbar.',
    '一级标题字号':'Heading 1 size', 'Markdown 一级标题大小':'H1 size after Markdown rendering',
    '二级标题字号':'Heading 2 size', 'Markdown 二级标题大小':'H2 size after Markdown rendering',
    '三级标题字号':'Heading 3 size', 'Markdown 三级标题大小':'H3 size after Markdown rendering',
    '标题字体':'Heading font', 'Markdown 标题字体':'Font for rendered headings', '跟随界面':'Follow app font', '标题字体家族':'Heading font family', '本机已安装的字体，如 Georgia':'A font installed on this device, e.g. Georgia',
    '工具栏位置':'Toolbar position', '编辑器上方或下方':'Above or below the editor',
    '上方':'Top', '下方':'Bottom', '显示工具名称':'Show tool names', '图标旁显示工具名称':'Show tool names next to icons',
    '标题预览':'Heading preview', '一级标题':'Heading 1', '二级标题':'Heading 2', '三级标题':'Heading 3',
    '正文行间距':'Body line spacing', '段落内行与行的距离':'Spacing between lines in a paragraph',
    '段落块间距':'Paragraph spacing', '段落之间的留白':'Spacing between paragraphs',
    '总结':'Summary',
    '初始设置向导':'Setup guide', '重新运行首次启动引导':'Run the first-launch onboarding again', '重新运行引导':'Run the guide again',
    '基准字号':'Base font size', '正文与各级标题一起缩放':'Scales body text and headings together',
    '通过 WebDAV 或局域网设备同步完整数据文件夹。':'Sync via WebDAV or LAN devices.',
    'Acta 局域网同步':'Acta LAN sync', '与局域网内其他 Acta 设备直接互传，不经过服务器；实验功能，传完请核对数据。':'Direct device-to-device sync over the LAN; experimental.',
    '允许被其他设备发现':'Be discoverable', '出现在附近设备的列表中':'List this device to nearby devices',
    '附近的设备':'Nearby devices', '搜索设备':'Scan for devices', '设备雷达':'Device radar',
    '信任此局域网（自动确认）':'Trust this network (auto-confirm)', '其他设备可免确认读写本机数据；覆盖前仍自动备份，仅限可信网络':'Other devices read/write without confirmation; trusted networks only'
  });
  Object.assign(interfaceTranslations.en, {
    '返回':'Back', '待办设置':'Tasks', '数据统计':'Data stats', '局域网雷达':'LAN radar',
    '当前档案的容量与内容概览':'Capacity and content overview of the current profile', '文件总大小':'Total size', '文件数':'Files', '笔记':'Notes', '待办':'Tasks', '归类':'Classifications',
    '关闭窗口时转入后台':'Keep running in the background', '关闭窗口后保留在系统托盘，局域网同步继续；可从托盘恢复或退出':'Closing the window keeps Acta in the tray; LAN sync continues. Restore or quit from the tray', '读取中…':'Reading…',
    '调整待办与子任务的显示偏好，不会修改任何待办数据。':'Adjust how tasks and subtasks are displayed; task data is never modified.',
    '子任务完成时间':'Subtask completion time', '勾选框旁显示完成日期，悬停看时刻':'Show the completion date next to the checkbox; hover for the exact time',
    '显示已完成待办':'Show completed tasks', '列表与归类视图默认显示已完成待办':'Completed tasks show by default in lists and classifications',
    '已完成待办自动置底':'Completed tasks sink to the bottom', '完成后先停留再移到列表末尾，可撤回':'Completed tasks linger before moving to the end of the list, with undo',
    '置底延迟':'Sink delay', '完成到开始移动的等待时间':'How long a completed task waits before moving',
    '点击右侧按钮可预览':'Preview with the button on the right', '动画速度':'Animation speed', '数值越大播放越快':'Higher values play faster',
    '输入框选中动画':'Input focus animation', '聚焦时边框与光环淡入':'The border and a focus ring fade in on focus',
    '与局域网内其他 Acta 设备直接互传，不经过服务器；覆盖前自动备份。':'Exchange data directly with other Acta devices on the LAN — no server involved; a backup is created before anything is overwritten.',
    '设备名称':'Device name', '留空时使用主机名':'Leave empty to use the hostname', '设备图标':'Device icon', '雷达头像，留空用默认图标':'Radar avatar; leave empty for the default icon',
    '服务端口':'Service port', 'TCP 端口，留空自动分配；修改后需重开发现':'TCP port; leave empty for automatic assignment. Re-enable discovery after changing it',
    '本机':'This device', '同步自动化':'Sync automations', '新建自动化':'New automation',
    '组合备份、冲突检查与收发步骤，按触发器自动执行':'Compose backups, conflict checks, and transfers; run by trigger',
    '最小化':'Minimize', '最大化':'Maximize', '中华人民共和国国旗':'Flag of China', '美国国旗':'Flag of the United States', '预览启动动画':'Preview the splash animation',
    '本机主机名':'Device hostname', '例：🌿':'e.g. 🌿', '自动分配':'Automatic'
  });
  Object.assign(interfaceTranslations['zh-Hant'], {
    '缓存与页面':'快取與頁面',
    '清空缓存并重新加载，不删数据。':'清空快取並重新載入，不刪資料。',
    '清除缓存重新加载':'清除快取並重新載入',
    '森林晨雾':'森林晨霧', '海盐晚霞':'海鹽晚霞', '糖果气泡':'糖果氣泡', '深夜霓虹':'深夜霓虹', '极光夜色':'極光夜色', '多彩浅色':'多彩淺色', '深色发光':'深色發光', '特殊主题':'特殊主題',
    'MWS 浅色':'MWS 淺色', 'MWS 深色':'MWS 深色', '品牌主题':'品牌主題', '品牌深色':'品牌深色',
    '开始使用':'開始使用', '下一步':'下一步', '上一步':'上一步', '尚未选择':'尚未選擇', '尚未设置':'尚未設定',
    '默认位置：':'預設位置：', '便携版默认使用软件目录下的 data 文件夹；也可以自选位置。':'可攜版預設使用軟體目錄下的 data 資料夾；也可以自選位置。',
    '已就绪，软件设置将保存在这里。':'已就緒，軟體設定將保存在這裡。', '无法使用该文件夹：':'無法使用該資料夾：',
    '无法确定默认位置，请点击「选择文件夹」手动指定。':'無法確定預設位置，請點擊「選擇資料夾」手動指定。',
    '软件数据位置':'軟體資料位置', '位置操作':'位置操作', '打开文件夹':'開啟資料夾', '更改位置':'更改位置',
    '先选择软件数据文件夹':'先選擇軟體資料資料夾', '使用默认位置':'使用預設位置', '选择文件夹…':'選擇資料夾…',
    '选择主题、字体与大小':'選擇主題、字型與大小', '选择启动动画':'選擇啟動動畫',
    '基础界面':'基礎介面', '内容类型':'內容類型', '待办主题色':'待辦主題色', '待办浅色背景':'待辦淺色背景', '笔记主题色':'筆記主題色', '笔记浅色背景':'筆記淺色背景', '日历主题色':'日曆主題色', '日历浅色背景':'日曆淺色背景',
    '应用图标':'應用程式圖示', '仅用于 Android 桌面图标。':'僅用於 Android 桌面圖示。',
    '四个预设仅用于 Android 客户端；切换后桌面启动器可能需要稍候刷新。':'四個預設僅適用於 Android 用戶端；切換後桌面啟動器可能需要稍候重新整理。',
    '默认书页':'預設書頁', '正·书页':'正·書頁', '勾勒·书页':'勾勒·書頁', '初版简洁':'初版簡潔', '恢复默认图标':'恢復預設圖示',

    '桌面框架':'桌面框架', 'Tauri（Windows/macOS），Capacitor（Android）':'Tauri（Windows/macOS），Capacitor（Android）',
    '默认图标已恢复。':'預設圖示已恢復。', '应用图标应用失败。':'套用應用程式圖示失敗。',
    '底栏图标':'底欄圖示', '图标和文字':'圖示與文字', '仅图标':'僅圖示',
    '启动动画':'啟動動畫', '启动过渡画面，可关闭':'啟動過渡畫面，可關閉',
    '动画预设':'動畫預設', '启动画面的演绎方式，可预览效果':'啟動畫面的演繹方式，可預覽效果', 'Acta 线构（默认）':'Acta 線構（預設）', '静谧淡入':'靜謐淡入', '聚焦缩放':'聚焦縮放',
    '动画时间':'動畫時間', '启动动画的整体播放倍率':'啟動動畫的整體播放倍率', '预览动画':'預覽動畫',
    '笔记编辑器':'筆記編輯器', 'Markdown 渲染与格式工具栏。':'Markdown 渲染與格式工具列。',
    '一级标题字号':'一級標題字級', 'Markdown 一级标题大小':'Markdown 一級標題大小',
    '二级标题字号':'二級標題字級', 'Markdown 二级标题大小':'Markdown 二級標題大小',
    '三级标题字号':'三級標題字級', 'Markdown 三级标题大小':'Markdown 三級標題大小',
    '标题字体':'標題字型', 'Markdown 标题字体':'Markdown 標題字型', '跟随界面':'跟隨介面', '标题字体家族':'標題字型家族', '本机已安装的字体，如 Georgia':'本機已安裝的字型，如 Georgia',
    '工具栏位置':'工具列位置', '编辑器上方或下方':'編輯器上方或下方',
    '上方':'上方', '下方':'下方', '显示工具名称':'顯示工具名稱', '图标旁显示工具名称':'圖示旁顯示工具名稱',
    '标题预览':'標題預覽', '一级标题':'一級標題', '二级标题':'二級標題', '三级标题':'三級標題',
    '正文行间距':'正文行距', '段落内行与行的距离':'段落內行與行的距離',
    '段落块间距':'段落塊間距', '段落之间的留白':'段落之間的留白',
    '总结':'總結',
    '初始设置向导':'初始設定精靈', '重新运行首次启动引导':'重新執行首次啟動引導', '重新运行引导':'重新執行引導',
    '基准字号':'基準字級', '正文与各级标题一起缩放':'正文與各級標題一起縮放',
    '通过 WebDAV 或局域网设备同步完整数据文件夹。':'透過 WebDAV 或區域網路裝置同步完整資料資料夾。',
    'Acta 局域网同步':'Acta 區域網路同步', '与局域网内其他 Acta 设备直接互传，不经过服务器；实验功能，传完请核对数据。':'與區域網路內其他 Acta 裝置直接互傳，不經過伺服器；實驗功能，傳完請核對資料。',
    '允许被其他设备发现':'允許被其他裝置發現', '出现在附近设备的列表中':'出現在附近裝置的清單中',
    '附近的设备':'附近的裝置', '搜尋裝置':'搜尋裝置', '设备雷达':'裝置雷達',
    '信任此局域网（自动确认）':'信任此區域網路（自動確認）', '其他设备可免确认读写本机数据；覆盖前仍自动备份，仅限可信网络':'其他裝置可免確認讀寫本機資料；覆寫前仍自動備份，僅限可信任網路'
  });
  Object.assign(interfaceTranslations['zh-Hant'], {
    '返回':'返回', '待办设置':'待辦設置', '数据统计':'資料統計', '局域网雷达':'區域網路雷達',
    '当前档案的容量与内容概览':'目前檔案的容量與內容概覽', '文件总大小':'檔案總大小', '文件数':'檔案數', '笔记':'筆記', '待办':'待辦', '归类':'歸類',
    '关闭窗口时转入后台':'關閉視窗時轉入背景', '关闭窗口后保留在系统托盘，局域网同步继续；可从托盘恢复或退出':'關閉視窗後保留在系統匣，區域網路同步繼續；可從系統匣恢復或結束', '读取中…':'讀取中…',
    '调整待办与子任务的显示偏好，不会修改任何待办数据。':'調整待辦與子任務的顯示偏好，不會修改任何待辦資料。',
    '子任务完成时间':'子任務完成時間', '勾选框旁显示完成日期，悬停看时刻':'勾選框旁顯示完成日期，懸停查看時刻',
    '显示已完成待办':'顯示已完成待辦', '列表与归类视图默认显示已完成待办':'清單與歸類視圖預設顯示已完成待辦',
    '已完成待办自动置底':'已完成待辦自動置底', '完成后先停留再移到列表末尾，可撤回':'完成後先停留再移到清單結尾，可撤銷',
    '置底延迟':'置底延遲', '完成到开始移动的等待时间':'完成到開始移動的等待時間',
    '点击右侧按钮可预览':'點擊右側按鈕可預覽', '动画速度':'動畫速度', '数值越大播放越快':'數值越大播放越快',
    '输入框选中动画':'輸入框選中動畫', '聚焦时边框与光环淡入':'聚焦時邊框與光環淡入',
    '与局域网内其他 Acta 设备直接互传，不经过服务器；覆盖前自动备份。':'與區域網路內其他 Acta 裝置直接互傳，不經過伺服器；覆寫前自動備份。',
    '设备名称':'裝置名稱', '留空时使用主机名':'留空時使用主機名稱', '设备图标':'裝置圖示', '雷达头像，留空用默认图标':'雷達頭像，留空用預設圖示',
    '服务端口':'服務連接埠', 'TCP 端口，留空自动分配；修改后需重开发现':'TCP 連接埠，留空自動分配；修改後需重新開啟探索',
    '本机':'本機', '同步自动化':'同步自動化', '新建自动化':'新建自動化',
    '最小化':'最小化', '最大化':'最大化', '中华人民共和国国旗':'中華人民共和國國旗', '美国国旗':'美國國旗', '预览启动动画':'預覽啟動動畫',
    '本机主机名':'本機主機名稱', '例：🌿':'例：🌿', '自动分配':'自動分配'
  });

  const settingsTextEntries = [];
  const settingsWalker = document.createTreeWalker(settingsModal, NodeFilter.SHOW_TEXT);
  while (settingsWalker.nextNode()) {
    const node = settingsWalker.currentNode;
    const source = node.nodeValue.trim();
    if (!source) continue;
    if (node.parentElement?.closest('#workspaceSettingsTitle,#workspaceFolderPath,#workspaceStatus,#generalStatus,#oneDriveStatus,#appFontSizeValue,#splashSpeedValue,#completedTodoSinkDelayValue')) continue;
    settingsTextEntries.push({ node, source, leading: node.nodeValue.match(/^\s*/)[0], trailing: node.nodeValue.match(/\s*$/)[0] });
  }
  const settingsAttributeEntries = [];
  settingsModal.querySelectorAll('[aria-label],[placeholder],[title]').forEach(node => ['aria-label', 'placeholder', 'title'].forEach(attribute => {
    if (node.hasAttribute(attribute)) settingsAttributeEntries.push({ node, attribute, source: node.getAttribute(attribute) });
  }));

  function applySettingsTranslation() {
    const translation = interfaceTranslations[uiSettings.language] || {};
    settingsTextEntries.forEach(entry => { entry.node.nodeValue = `${entry.leading}${translation[entry.source] || entry.source}${entry.trailing}`; });
    settingsAttributeEntries.forEach(entry => entry.node.setAttribute(entry.attribute, translation[entry.source] || entry.source));
  }
  const setStatus = (node, message, state = '') => {
    node.textContent = message;
    node.className = `settings-status ${state}`;
  };

  const dataManifestFile = 'acta-manifest.json';
  const classificationsFile = 'classifications.json';
  const notesDirectoryName = 'notes';
  const todosDirectoryName = 'todos';
  const legacyLibraryFile = 'acta-library.json';
  const workspaceFileName = `${dataManifestFile} · ${classificationsFile} · ${notesDirectoryName}/ · ${todosDirectoryName}/`;
  const savedNativeWorkspace = settings.syncFolder || '';
  let workspaceAdapter = null;
  let dataProfiles = [];
  // 数据档案列表变化时由 renderDataProfiles 调用（后定义于局域网同步段），
  // 刷新对外元数据；提前声明避免初始化时的 TDZ 问题。
  let lanProfilesChangedHook = null;
  // 设备雷达内嵌在数据同步设置页：设置页的打开/关闭/切页通过该钩子通知
  // 雷达扫描循环启停（钩子在局域网同步段赋值）。
  let lanRadarVisibilityHook = null;
  // 扫描结果落地后调用（同上）：驱动「发现设备」类自动化条目。
  let lanAutomationEvaluator = null;
  // 自动化卡片列表重绘（语言切换 / 设置页打开时调用）。
  let lanAutomationRenderHook = null;
  let editingDataProfileId = '';
  let oneDriveAdapter = null;
  let webDavAdapter = null;
  let webDavCredentials = null;
  let workspaceWriteQueue = Promise.resolve();
  let autoSyncTimer = null;
  let autoSyncSaveTimer = null;
  let autoSyncNoticeTimer = null;
  let autoSyncBusy = false;
  let autoSyncDirty = false;
  let autoSyncBaseline = '';
  let oneDriveRemoteVersion = '';
  let oneDriveBaselineReady = false;

  const syncMessages = {
    zh: {
      working:'正在同步网盘数据文件夹…', uploaded:'已将完整数据文件夹写入当前同步位置。', downloaded:'检测到网盘数据更新，已完整载入。', current:'网盘数据文件夹已是最新状态。', waiting:'自动同步已开启，等待数据变化。', disabled:'自动同步已关闭。', choose:'请先连接 WebDAV 同步位置。', connectFail:'WebDAV 连接失败：', uploadFail:'上传数据失败：', downloadFail:'下载数据失败：', connected:'网盘同步位置已连接。', manualUpload:'已上传清单、归类、notes 和 todos 完整数据文件夹。', manualDownload:'已从网盘完整下载并载入数据文件夹。', confirm:'从网盘下载会替换当前内容，是否继续？', disconnected:'已断开当前网盘同步位置。', reauthorize:'浏览器需要重新授权 OneDrive 文件夹，请重新选择。', conflict:'检测到网盘数据和当前内容均有新修改。为避免覆盖，自动同步已暂停；请先下载检查或手动上传。', invalidWebDavUrl:'请输入有效的 HTTP 或 HTTPS WebDAV 服务器地址。', webDavMissing:'请完整填写 WebDAV 服务器地址、账号和密码。', webDavConnected:'WebDAV 连接测试成功，设置已保存。', webDavStored:'已读取保存的 WebDAV 设置。', webDavCors:'浏览器阻止了跨域 WebDAV 请求。请在 WebDAV 服务器允许当前网页来源、Authorization、Depth、Content-Type 标头，并正确响应 OPTIONS 预检及 PROPFIND、MKCOL、GET、PUT、DELETE、HEAD 方法。', webDavMixedContent:'HTTPS 页面不能连接 HTTP WebDAV，请改用 HTTPS 服务器地址。', webDavNetwork:'无法连接 WebDAV 服务器，请检查地址、网络、证书和服务器状态。'
    },
    en: {
      working:'Syncing the cloud data folder…', uploaded:'Wrote the complete data folder to the current sync location.', downloaded:'A cloud update was found and fully loaded.', current:'The cloud data folder is up to date.', waiting:'Automatic sync is on and waiting for changes.', disabled:'Automatic sync is off.', choose:'Connect the WebDAV sync location first.', connectFail:'WebDAV connection failed: ', uploadFail:'Data upload failed: ', downloadFail:'Data download failed: ', connected:'The cloud sync location is connected.', manualUpload:'Uploaded the complete manifest, classifications, notes, and todos data folder.', manualDownload:'Downloaded and loaded the complete cloud data folder.', confirm:'Downloading from cloud storage will replace the current content. Continue?', disconnected:'Disconnected the current cloud sync location.', reauthorize:'The browser needs permission again. Choose the OneDrive folder again.', conflict:'Both cloud data and current content changed. Automatic sync was paused; download to review or upload manually.', invalidWebDavUrl:'Enter a valid HTTP or HTTPS WebDAV server URL.', webDavMissing:'Enter the WebDAV server URL, account, and password.', webDavConnected:'WebDAV connection test succeeded and settings were saved.', webDavStored:'Loaded the saved WebDAV settings.', webDavCors:'The browser blocked the cross-origin WebDAV request. Allow this web origin and the Authorization, Depth, and Content-Type headers, and correctly answer the OPTIONS preflight for PROPFIND, MKCOL, GET, PUT, DELETE, and HEAD.', webDavMixedContent:'An HTTPS page cannot connect to an HTTP WebDAV server. Use an HTTPS server URL.', webDavNetwork:'Could not reach the WebDAV server. Check its URL, network, certificate, and status.'
    },
    'zh-Hant': {
      working:'正在同步網路硬碟資料資料夾…', uploaded:'已將完整資料資料夾寫入目前同步位置。', downloaded:'偵測到網路硬碟資料更新，已完整載入。', current:'網路硬碟資料資料夾已是最新狀態。', waiting:'自動同步已開啟，等待資料變更。', disabled:'自動同步已關閉。', choose:'請先連接 WebDAV 同步位置。', connectFail:'WebDAV 連接失敗：', uploadFail:'上傳資料失敗：', downloadFail:'下載資料失敗：', connected:'網路硬碟同步位置已連接。', manualUpload:'已上傳清單、歸類、notes 和 todos 完整資料資料夾。', manualDownload:'已從網路硬碟完整下載並載入資料資料夾。', confirm:'從網路硬碟下載會取代目前內容，是否繼續？', disconnected:'已中斷目前網路硬碟同步位置。', reauthorize:'瀏覽器需要重新授權 OneDrive 資料夾，請重新選擇。', conflict:'偵測到網路硬碟資料和目前內容都有新修改。為避免覆寫，自動同步已暫停；請先下載檢查或手動上傳。', invalidWebDavUrl:'請輸入有效的 HTTP 或 HTTPS WebDAV 伺服器地址。', webDavMissing:'請完整填寫 WebDAV 伺服器地址、帳號和密碼。', webDavConnected:'WebDAV 連接測試成功，設定已儲存。', webDavStored:'已讀取儲存的 WebDAV 設定。', webDavCors:'瀏覽器封鎖了跨來源 WebDAV 請求。請在 WebDAV 伺服器允許目前網頁來源、Authorization、Depth、Content-Type 標頭，並正確回應 OPTIONS 預檢及 PROPFIND、MKCOL、GET、PUT、DELETE、HEAD 方法。', webDavMixedContent:'HTTPS 頁面不能連接 HTTP WebDAV，請改用 HTTPS 伺服器地址。', webDavNetwork:'無法連接 WebDAV 伺服器，請檢查地址、網路、憑證和伺服器狀態。'
    }
  };
  const folderPermissionMessages = {
    zh:'浏览器需要重新授权本地文件夹，请重新选择。',
    en:'The browser needs folder permission again. Choose the local folder again.',
    'zh-Hant':'瀏覽器需要重新授權本機資料夾，請重新選擇。'
  };
  const syncText = key => key === 'reauthorize' ? (folderPermissionMessages[uiSettings.language] || folderPermissionMessages.zh) : (syncMessages[uiSettings.language] || syncMessages.zh)[key];
  const runtimeMessages = {
    zh: {
      invalidLibrary:'这不是有效的 Acta 完整数据文件夹。', localFolder:'本地文件夹', unsupportedFolder:'当前平台不支持完整文件夹读写，请使用最新版 Chrome、Edge 或客户端文件夹选择器。', noFolderPermission:'没有获得文件夹读写权限。',
      localWorkspace:'本地行记数据', demoWorkspace:'演示行记数据', actaData:'行记数据', noFolderNoSave:'尚未选择文件夹；本次修改不会保存。', noSaveChanges:'不会保存更改', demoSave:'演示模式 · 不保存', demoStatus:'当前是演示行记数据。关闭或刷新页面后，演示内容会恢复，不会写入浏览器本地资料库。',
      savedTo:'已保存完整数据文件夹到 {0} / {1}', saveFailed:'保存失败：{0}', loaded:'已完整载入 {0} / {1}', created:'已在 {0} 创建完整数据文件夹：{1}', savedNow:'完整数据文件夹已立即保存。', reloadConfirm:'从数据文件夹重载会覆盖当前尚未保存的界面状态，是否继续？', reloaded:'已从完整数据文件夹重新载入。', exportedFolder:'完整数据文件夹已导出到 {0}。',
      settingsStored:'设置会自动保存在当前设备。', defaultSaved:'默认启动页面已保存。', compactUpdated:'列表密度已更新。', motionUpdated:'动态效果偏好已更新。', historySubtitle:'最近的操作一览', historyClear:'清空历史记录', historyClearConfirm:'再次点击确认清空', historyRestore:'恢复到此操作之前', historyJump:'跳转查看', historyRestoredToast:'已回溯到此操作之前的状态', historyUndoCreateToast:'已撤销创建',
      linkTitle:'关联项目', close:'关闭', linkHint:'选择一个项目建立双向关联；已有关系会显示在编辑器中。', restoreWorkspaceFailed:'无法恢复工作区：{0}', reauthorize:'浏览器需要重新授权工作区文件夹，请点击“选择本地文件夹”。', restoredOneDrive:'已恢复 OneDrive 同步文件夹连接。', restoreOneDriveFailed:'无法恢复 OneDrive 文件夹：{0}'
    },
    en: {
      invalidLibrary:'This is not a valid complete Acta data folder.', localFolder:'Local folder', unsupportedFolder:'This platform cannot read and write complete folders. Use the latest Chrome, Edge, or the client folder picker.', noFolderPermission:'Folder read/write permission was not granted.',
      localWorkspace:'Local Acta Data', demoWorkspace:'Demo Acta Data', actaData:'Acta Data', noFolderNoSave:'No folder selected; changes in this session will not be saved.', noSaveChanges:'Changes are not saved', demoSave:'Demo mode · Not saved', demoStatus:'This is demo Acta Data. Its content resets when you close or refresh the page and is not written to browser storage.',
      savedTo:'Saved the complete data folder to {0} / {1}', saveFailed:'Save failed: {0}', loaded:'Fully loaded {0} / {1}', created:'Created the complete data folder in {0}: {1}', savedNow:'Complete data folder saved now.', reloadConfirm:'Reloading from the data folder will replace the current unsaved interface state. Continue?', reloaded:'Reloaded from the complete data folder.', exportedFolder:'Complete data folder exported to {0}.',
      settingsStored:'Settings are saved automatically on this device.', defaultSaved:'Default startup view saved.', compactUpdated:'List density updated.', motionUpdated:'Motion preference updated.', historySubtitle:'A look back at recent actions', historyClear:'Clear history', historyClearConfirm:'Click again to confirm', historyRestore:'Restore to before this action', historyJump:'Open', historyRestoredToast:'Restored to the state before this action', historyUndoCreateToast:'Creation undone',
      linkTitle:'Link item', close:'Close', linkHint:'Choose an item to create a two-way link. Existing links appear in the editor.', restoreWorkspaceFailed:'Could not restore the workspace: {0}', reauthorize:'The browser needs folder permission again. Click “Choose local folder”.', restoredOneDrive:'Restored the OneDrive sync folder connection.', restoreOneDriveFailed:'Could not restore the OneDrive folder: {0}'
    },
    'zh-Hant': {
      invalidLibrary:'這不是有效的 Acta 完整資料資料夾。', localFolder:'本機資料夾', unsupportedFolder:'目前平台不支援完整資料夾讀寫，請使用最新版 Chrome、Edge 或用戶端資料夾選擇器。', noFolderPermission:'未取得資料夾讀寫權限。',
      localWorkspace:'本機行記資料', demoWorkspace:'示範行記資料', actaData:'行記資料', noFolderNoSave:'尚未選擇資料夾；本次修改不會儲存。', noSaveChanges:'不會儲存變更', demoSave:'示範模式 · 不儲存', demoStatus:'目前是示範行記資料。關閉或重新整理頁面後，示範內容會還原，不會寫入瀏覽器本機資料庫。',
      savedTo:'已儲存完整資料資料夾到 {0} / {1}', saveFailed:'儲存失敗：{0}', loaded:'已完整載入 {0} / {1}', created:'已在 {0} 建立完整資料資料夾：{1}', savedNow:'完整資料資料夾已立即儲存。', reloadConfirm:'從資料資料夾重新載入會覆蓋目前尚未儲存的介面狀態，是否繼續？', reloaded:'已從完整資料資料夾重新載入。', exportedFolder:'完整資料資料夾已匯出到 {0}。',
      settingsStored:'設定會自動儲存在目前裝置。', defaultSaved:'預設啟動頁面已儲存。', compactUpdated:'清單密度已更新。', motionUpdated:'動態效果偏好已更新。', historySubtitle:'最近的操作一覽', historyClear:'清空歷史記錄', historyClearConfirm:'再次點擊確認清空', historyRestore:'恢復到此操作之前', historyJump:'跳轉查看', historyRestoredToast:'已回溯到此操作之前的狀態', historyUndoCreateToast:'已撤銷建立',
      linkTitle:'關聯項目', close:'關閉', linkHint:'選擇一個項目建立雙向關聯；已有關係會顯示在編輯器中。', restoreWorkspaceFailed:'無法還原工作區：{0}', reauthorize:'瀏覽器需要重新授權工作區資料夾，請點擊「選擇本機資料夾」。', restoredOneDrive:'已還原 OneDrive 同步資料夾連接。', restoreOneDriveFailed:'無法還原 OneDrive 資料夾：{0}'
    }
  };
  Object.assign(runtimeMessages.zh, {
    clearCacheConfirm:'将清除应用页面缓存并重新加载。笔记、待办、数据档案、同步凭据和设置都不会被删除，是否继续？',
    clearingCache:'正在保存当前档案并清除缓存…',
    clearCacheFailed:'清除缓存失败：{0}',
    cacheSyncBusy:'网盘同步正在进行，请稍候再清除缓存。'
  });
  Object.assign(runtimeMessages.en, {
    clearCacheConfirm:'The app cache will be cleared and the page reloaded. Notes, tasks, profiles, sync credentials, and settings will not be deleted. Continue?',
    clearingCache:'Saving the current profile and clearing the cache…',
    clearCacheFailed:'Could not clear the cache: {0}',
    cacheSyncBusy:'Cloud sync is in progress. Clear the cache after it finishes.'
  });
  Object.assign(runtimeMessages['zh-Hant'], {
    clearCacheConfirm:'將清除應用程式頁面快取並重新載入。筆記、待辦、資料檔案、同步憑據和設定都不會被刪除，是否繼續？',
    clearingCache:'正在儲存目前檔案並清除快取…',
    clearCacheFailed:'清除快取失敗：{0}',
    cacheSyncBusy:'網路硬碟同步正在進行，請稍候再清除快取。'
  });
  const uiText = (key, ...values) => values.reduce((message, value, index) => message.replace(`{${index}}`, value), (runtimeMessages[uiSettings.language] || runtimeMessages.zh)[key]);
  const profileMessages = {
    zh: {
      panelDescription:'每个数据档案都包含完整的归类、笔记和待办；可以保存在软件本地，也可以连接到你选择的文件夹。', newProfile:'新建空白档案', newSubtitle:'从一份没有笔记和待办的数据开始', name:'档案名称', newName:'新的行记数据', location:'保存位置', localDesktop:'软件本地', localNative:'软件本地', localBrowser:'浏览器本地缓存', localHint:'默认位置，无需选择文件夹', folder:'自选文件夹', folderHint:'创建时选择保存位置', cancel:'取消', createOpen:'创建并打开', profiles:'数据档案', count:'{0} 个档案', activeSummary:'当前：{0}', browserTitle:'浏览器本地空间有限', browserHint:'浏览器可能在空间不足或清理缓存时移除本地数据，请定期导出完整档案备份。', active:'当前', open:'打开', edit:'编辑', current:'正在使用', stats:'{0} 则笔记 · {1} 个待办', saveName:'保存名称', changeLocation:'更改位置', copy:'复制', export:'导出完整档案', locationLabel:'档案位置', folderFiles:'完整档案文件夹', emptyName:'请输入档案名称。', duplicateName:'已经存在同名数据档案。', localQuota:'本地空间不足，无法保存。请先导出完整档案，再更换保存位置。', unavailable:'当前位置不可用，请编辑档案并重新选择保存位置。', created:'已创建并打开空白数据档案“{0}”。', switched:'已切换到“{0}”。', renamed:'数据档案已重命名为“{0}”。', moved:'“{0}”已复制到新的保存位置。', copied:'已创建“{0}”的本地副本。', exported:'已将“{0}”的完整档案导出到 {1}。', saved:'“{0}”已保存。', loaded:'已打开“{0}”。', initializing:'正在读取行记数据档案…', ready:'所有更改会自动保存到当前数据档案。', editHint:'修改名称或把完整档案复制到新的文件夹。', copySuffix:'副本', defaultName:'我的行记', chooseLocation:'选择文件夹后，Acta 会写入完整档案；原位置不会被删除。'
    },
    en: {
      panelDescription:'Each data profile contains all classifications, notes, and tasks. Keep it inside Acta or connect a folder you choose.', newProfile:'New blank profile', newSubtitle:'Start without any notes or tasks', name:'Profile name', newName:'New Acta Data', location:'Save location', localDesktop:'Inside Acta', localNative:'Inside Acta', localBrowser:'Browser local storage', localHint:'Default location; no folder needed', folder:'Choose a folder', folderHint:'Select a save location during creation', cancel:'Cancel', createOpen:'Create and open', profiles:'Data profiles', count:'{0} profiles', activeSummary:'Current: {0}', browserTitle:'Browser storage is limited', browserHint:'The browser may remove local data when space is low or its cache is cleared. Export complete backups regularly.', active:'Current', open:'Open', edit:'Edit', current:'In use', stats:'{0} notes · {1} tasks', saveName:'Save name', changeLocation:'Change location', copy:'Duplicate', export:'Export complete profile', locationLabel:'Profile location', folderFiles:'Complete profile folder', emptyName:'Enter a profile name.', duplicateName:'A data profile with this name already exists.', localQuota:'Local storage is full. Export the complete profile, then change its save location.', unavailable:'This location is unavailable. Edit the profile and choose its save location again.', created:'Created and opened the blank profile “{0}”.', switched:'Switched to “{0}”.', renamed:'Renamed the data profile to “{0}”.', moved:'Copied “{0}” to its new save location.', copied:'Created the local copy “{0}”.', exported:'Exported the complete “{0}” profile to {1}.', saved:'Saved “{0}”.', loaded:'Opened “{0}”.', initializing:'Loading Acta data profiles…', ready:'Changes are saved automatically to the current data profile.', editHint:'Change the name or copy the complete profile to another folder.', copySuffix:'copy', defaultName:'My Acta Data', chooseLocation:'After you choose a folder, Acta writes the complete profile there. The old location is not deleted.'
    },
    'zh-Hant': {
      panelDescription:'每個資料檔案都包含完整的歸類、筆記和待辦；可以儲存在軟體本機，也可以連接到你選擇的資料夾。', newProfile:'新增空白檔案', newSubtitle:'從一份沒有筆記和待辦的資料開始', name:'檔案名稱', newName:'新的行記資料', location:'儲存位置', localDesktop:'軟體本機', localNative:'軟體本機', localBrowser:'瀏覽器本機快取', localHint:'預設位置，無需選擇資料夾', folder:'自選資料夾', folderHint:'建立時選擇儲存位置', cancel:'取消', createOpen:'建立並開啟', profiles:'資料檔案', count:'{0} 個檔案', activeSummary:'目前：{0}', browserTitle:'瀏覽器本機空間有限', browserHint:'瀏覽器可能在空間不足或清理快取時移除本機資料，請定期匯出完整檔案備份。', active:'目前', open:'開啟', edit:'編輯', current:'正在使用', stats:'{0} 則筆記 · {1} 個待辦', saveName:'儲存名稱', changeLocation:'變更位置', copy:'複製', export:'匯出完整檔案', locationLabel:'檔案位置', folderFiles:'完整檔案資料夾', emptyName:'請輸入檔案名稱。', duplicateName:'已經存在同名資料檔案。', localQuota:'本機空間不足，無法儲存。請先匯出完整檔案，再變更儲存位置。', unavailable:'目前位置無法使用，請編輯檔案並重新選擇儲存位置。', created:'已建立並開啟空白資料檔案「{0}」。', switched:'已切換到「{0}」。', renamed:'資料檔案已重新命名為「{0}」。', moved:'「{0}」已複製到新的儲存位置。', copied:'已建立「{0}」的本機副本。', exported:'已將「{0}」的完整檔案匯出到 {1}。', saved:'「{0}」已儲存。', loaded:'已開啟「{0}」。', initializing:'正在讀取行記資料檔案…', ready:'所有變更會自動儲存到目前資料檔案。', editHint:'修改名稱或把完整檔案複製到新的資料夾。', copySuffix:'副本', defaultName:'我的行記', chooseLocation:'選擇資料夾後，Acta 會寫入完整檔案；原位置不會被刪除。'
    }
  };
  Object.assign(profileMessages.zh, { deleteProfile:'删除档案', lastProfile:'至少需要保留一个数据档案。', confirmDeleteLocal:'删除“{0}”将永久移除保存在软件或浏览器本地的全部档案数据，确定继续？', confirmDeleteFolder:'从列表删除“{0}”？外部文件夹中的完整档案不会被删除。', profileDeleted:'已删除数据档案“{0}”。', readExisting:'读取现有档案', readingExisting:'正在读取现有档案…', noExistingData:'此文件夹中没有找到行记数据，请选择包含 acta-manifest.json 的文件夹。', imported:'已读取并打开“{0}”。', overwriteActaWarn:'此文件夹已包含行记数据。创建空白档案将覆盖并清除其中的现有数据，是否继续？', overwriteFolderWarn:'此文件夹不是空文件夹。创建空白档案将在此文件夹中写入新的行记数据，是否继续？', refreshData:'刷新行记数据', refreshingData:'正在刷新行记数据…', dataRefreshed:'已刷新「{0}」。', refreshNoData:'还没有已保存的数据文件，保留当前内容。' });
  Object.assign(profileMessages.en, { deleteProfile:'Delete profile', lastProfile:'At least one data profile must remain.', confirmDeleteLocal:'Deleting “{0}” permanently removes all profile data stored inside Acta or the browser. Continue?', confirmDeleteFolder:'Remove “{0}” from the list? The complete profile in its external folder will not be deleted.', profileDeleted:'Deleted the data profile “{0}”.', readExisting:'Read existing profile', readingExisting:'Reading existing profile…', noExistingData:'No Acta data was found in this folder. Choose a folder that contains acta-manifest.json.', imported:'Read and opened “{0}”.', overwriteActaWarn:'This folder already contains Acta data. Creating a blank profile will overwrite and clear its existing data. Continue?', overwriteFolderWarn:'This folder is not empty. Creating a blank profile will write new Acta data into it. Continue?', refreshData:'Refresh Acta data', refreshingData:'Refreshing Acta data…', dataRefreshed:'Refreshed “{0}”.', refreshNoData:'No saved data file yet; keeping the current content.' });
  Object.assign(profileMessages['zh-Hant'], { deleteProfile:'刪除檔案', lastProfile:'至少需要保留一個資料檔案。', confirmDeleteLocal:'刪除「{0}」將永久移除儲存在軟體或瀏覽器本機的全部檔案資料，確定繼續？', confirmDeleteFolder:'從清單刪除「{0}」？外部資料夾中的完整檔案不會被刪除。', profileDeleted:'已刪除資料檔案「{0}」。', readExisting:'讀取現有檔案', readingExisting:'正在讀取現有檔案…', noExistingData:'此資料夾中沒有找到行記資料，請選擇包含 acta-manifest.json 的資料夾。', imported:'已讀取並開啟「{0}」。', overwriteActaWarn:'此資料夾已包含行記資料。建立空白檔案將覆蓋並清除其中的現有資料，是否繼續？', overwriteFolderWarn:'此資料夾不是空資料夾。建立空白檔案將在此資料夾中寫入新的行記資料，是否繼續？', refreshData:'重新整理行記資料', refreshingData:'正在重新整理行記資料…', dataRefreshed:'已重新整理「{0}」。', refreshNoData:'尚未有已保存的資料檔案，保留目前內容。' });
  const profileText = (key, ...values) => values.reduce((message, value, index) => message.replace(`{${index}}`, value), (profileMessages[uiSettings.language] || profileMessages.zh)[key]);

  const quickCaptureMessages = {
    zh: {
      title:'速记', subtitle:'快速创建后自动保存', intro:'选好类型，写下重点，Acta 会创建并自动保存。', chooseType:'创建什么？', writeContent:'写下内容',
      todo:'待办', todoHint:'记录一个需要行动的事项', note:'笔记', noteHint:'捕捉想法、灵感或片段', itemTitle:'标题', todoTitlePlaceholder:'要完成什么？', noteTitlePlaceholder:'这则笔记讲什么？',
      checkin:'打卡待办', checkinHint:'每天打卡，养成习惯', checkinTitlePlaceholder:'要养成什么习惯？', checkinBody:'打卡说明', checkinBodyPlaceholder:'写下打卡目标或规则…', checkinBodyHint:'创建后每天打卡一次，连续天数自动统计。', createCheckin:'创建打卡待办',
      folder:'归类', start:'开始日期时间', due:'截止日期时间', clearStart:'取消开始时间', clearDue:'取消截止时间', calendarHidden:'开始或截止时间未设置，此待办将不在日历中显示。', invalidSchedule:'请输入有效日期时间，且截止时间必须晚于开始时间。', priority:'优先级', childEvents:'子事件', childEventsPlaceholder:'每行输入一个子事件…', childEventsHint:'每个非空行都会创建为一个独立子事件。', todoBody:'补充说明', todoBodyPlaceholder:'补充背景或需要记住的细节…', todoBodyHint:'创建后仍可继续添加子事件和关联内容。',
      noteBody:'笔记正文', noteBodyPlaceholder:'写下想法；支持 Markdown…', noteBodyHint:'支持标题、列表、引用、任务列表和代码块。', arrange:'安排与归类', back:'上一步', next:'下一步', stepOf:'步骤 {0} / {1}', cancel:'取消', clear:'取消', close:'关闭', shortcut:'Ctrl/⌘ + Enter 快速创建', createTodo:'创建待办', createNote:'创建笔记', titleRequired:'请先填写标题。'
    },
    en: {
      title:'Quick capture', subtitle:'Create and auto-save', intro:'Choose a type, capture the essentials, and Acta will create and auto-save it.', chooseType:'What are you creating?', writeContent:'Capture the details',
      todo:'Task', todoHint:'Record something that needs action', note:'Note', noteHint:'Capture an idea, spark, or fragment', itemTitle:'Title', todoTitlePlaceholder:'What needs to be done?', noteTitlePlaceholder:'What is this note about?',
      checkin:'Check-in', checkinHint:'Check in daily to build a habit', checkinTitlePlaceholder:'What habit to build?', checkinBody:'Check-in details', checkinBodyPlaceholder:'Describe the goal or rules…', checkinBodyHint:'Check in once a day; streaks are tracked automatically.', createCheckin:'Create check-in',
      folder:'Classification', start:'Start date and time', due:'Due date and time', clearStart:'Clear start time', clearDue:'Clear due time', calendarHidden:'Without both a start and due time, this task will not appear in the calendar.', invalidSchedule:'Enter valid dates and times, with the due time after the start time.', priority:'Priority', childEvents:'Sub-events', childEventsPlaceholder:'Enter one sub-event per line…', childEventsHint:'Each non-empty line becomes a separate sub-event.', todoBody:'Details', todoBodyPlaceholder:'Add context or anything worth remembering…', todoBodyHint:'You can add more sub-events and linked items after creation.',
      noteBody:'Note body', noteBodyPlaceholder:'Write your idea; Markdown is supported…', noteBodyHint:'Headings, lists, quotes, task lists, and code blocks are supported.', arrange:'Arrange and file', back:'Back', next:'Next', stepOf:'Step {0} of {1}', cancel:'Cancel', clear:'Clear', close:'Close', shortcut:'Ctrl/⌘ + Enter to create', createTodo:'Create task', createNote:'Create note', titleRequired:'Enter a title first.'
    },
    'zh-Hant': {
      title:'速記', subtitle:'快速建立後自動儲存', intro:'選好類型，寫下重點，Acta 會建立並自動儲存。', chooseType:'建立什麼？', writeContent:'寫下內容',
      todo:'待辦', todoHint:'記錄一個需要行動的事項', note:'筆記', noteHint:'捕捉想法、靈感或片段', itemTitle:'標題', todoTitlePlaceholder:'要完成什麼？', noteTitlePlaceholder:'這則筆記在說什麼？',
      checkin:'打卡待辦', checkinHint:'每天打卡，養成習慣', checkinTitlePlaceholder:'要養成什麼習慣？', checkinBody:'打卡說明', checkinBodyPlaceholder:'寫下打卡目標或規則…', checkinBodyHint:'建立後每天打卡一次，連續天數自動統計。', createCheckin:'建立打卡待辦',
      folder:'歸類', start:'開始日期時間', due:'截止日期時間', clearStart:'取消開始時間', clearDue:'取消截止時間', calendarHidden:'開始或截止時間未設定，此待辦將不在日曆中顯示。', invalidSchedule:'請輸入有效日期時間，且截止時間必須晚於開始時間。', priority:'優先順序', childEvents:'子事件', childEventsPlaceholder:'每行輸入一個子事件…', childEventsHint:'每個非空行都會建立為一個獨立子事件。', todoBody:'補充說明', todoBodyPlaceholder:'補充背景或需要記住的細節…', todoBodyHint:'建立後仍可繼續新增子事件和關聯內容。',
      noteBody:'筆記正文', noteBodyPlaceholder:'寫下想法；支援 Markdown…', noteBodyHint:'支援標題、清單、引用、任務清單和程式碼區塊。', arrange:'安排與歸類', back:'上一步', next:'下一步', stepOf:'步驟 {0} / {1}', cancel:'取消', clear:'取消', close:'關閉', shortcut:'Ctrl/⌘ + Enter 快速建立', createTodo:'建立待辦', createNote:'建立筆記', titleRequired:'請先填寫標題。'
    }
  };
  const quickCaptureText = key => (quickCaptureMessages[uiSettings.language] || quickCaptureMessages.zh)[key];

  // 可编辑区粘贴统一取纯文本：input/textarea 本身只收纯文本，这里拦截
  // contenteditable 的富文本粘贴（子任务、补充说明、笔记正文），经
  // insertText 走原生撤销栈，与右键菜单的粘贴行为保持一致。
  // 点击确认区之外时复位所有待删除确认态（点击取消/确认按钮自身除外，
  // 它们在元素 handler 内自行处理）。
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || event.target.closest('.remove-task-zone')) return;
    document.querySelectorAll('.remove-task-zone.armed').forEach(zone => {
      zone.classList.remove('armed');
      const group = zone.querySelector('.remove-task-confirm');
      if (group) group.hidden = true;
    });
  });
  document.addEventListener('paste', event => {
    const target = event.target instanceof Element ? event.target.closest('[contenteditable="true"]') : null;
    if (!target) return;
    const text = event.clipboardData?.getData('text/plain') || '';
    if (!text) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    document.execCommand('insertText', false, text);
  });

  // 子任务完成日期的自定义悬浮框：悬停 mm/dd 日期时以浮层显示精确到秒
  // 的完成时刻（替代原生 title），离开或滚动即隐藏。
  const taskDateTip = document.createElement('div');
  taskDateTip.className = 'task-date-tip';
  taskDateTip.hidden = true;
  document.body.appendChild(taskDateTip);
  const hideTaskDateTip = () => { taskDateTip.hidden = true; };
  document.addEventListener('mouseover', event => {
    const dateEl = event.target instanceof Element ? event.target.closest('.task-done-date') : null;
    if (!dateEl || !dateEl.dataset.time) { hideTaskDateTip(); return; }
    taskDateTip.textContent = formatDateTimeSeconds(dateEl.dataset.time);
    taskDateTip.hidden = false;
    const rect = dateEl.getBoundingClientRect();
    const tipRect = taskDateTip.getBoundingClientRect();
    let x = rect.left + rect.width / 2 - tipRect.width / 2;
    let y = rect.top - tipRect.height - 8;
    if (y < 8) y = rect.bottom + 8;
    x = Math.max(8, Math.min(x, window.innerWidth - tipRect.width - 8));
    taskDateTip.style.left = `${x}px`;
    taskDateTip.style.top = `${y}px`;
  });
  document.addEventListener('mouseout', event => {
    if (event.target instanceof Element && event.target.closest('.task-done-date')) hideTaskDateTip();
  });
  document.addEventListener('scroll', hideTaskDateTip, true);

  const clearLegacyTags = snapshot => {
    snapshot?.items?.forEach(item => { delete item.tags; });
    return snapshot;
  };

  const rendererBuildNoteMarkdown = buildNoteMarkdown;
  buildNoteMarkdown = function buildTagFreeNoteMarkdown(item) {
    return rendererBuildNoteMarkdown({ ...item, tags: [] }).replace(/^tags:.*\n/m, '');
  };

  const rendererParseImportedNote = parseImportedNote;
  parseImportedNote = function parseTagFreeImportedNote(...args) {
    const imported = rendererParseImportedNote(...args);
    delete imported.tags;
    return imported;
  };

  const classificationMessages = {
    zh: { rename:'归类名称', placeholder:'修改当前归类名称', hint:'先点击“编辑名称”，修改后再点击勾选确认；更名会应用到该归类下的全部项目。', updated:'归类名称已更新', edit:'编辑名称', confirm:'确认修改', empty:'归类名称不能为空', duplicate:'已经存在同名归类', manage:'管理归类', managerTitle:'编辑归类', save:'保存名称', cancel:'取消', remove:'删除归类', summary:'此归类包含 {0} 个项目；删除后会移动到“{1}”。', lastSummary:'这是最后一个归类，不能删除。', deleteConfirm:'确定删除“{0}”吗？其中 {1} 个项目会移动到“{2}”。', deleted:'归类已删除，相关项目已移动到“{0}”' },
    en: { rename:'Classification name', placeholder:'Rename this classification', hint:'Click “Edit name”, make the change, then confirm with the check button. Renaming applies to every item in this classification.', updated:'Classification name updated', edit:'Edit name', confirm:'Confirm change', empty:'Classification name cannot be empty', duplicate:'A classification with this name already exists', manage:'Manage classification', managerTitle:'Edit classification', save:'Save name', cancel:'Cancel', remove:'Delete classification', summary:'This classification contains {0} items. Deleting it moves them to “{1}”.', lastSummary:'This is the last classification and cannot be deleted.', deleteConfirm:'Delete “{0}”? Its {1} items will move to “{2}”.', deleted:'Classification deleted; related items moved to “{0}”' },
    'zh-Hant': { rename:'歸類名稱', placeholder:'修改目前歸類名稱', hint:'先點擊「編輯名稱」，修改後再點擊勾選確認；更名會套用到該歸類下的全部項目。', updated:'歸類名稱已更新', edit:'編輯名稱', confirm:'確認修改', empty:'歸類名稱不能為空', duplicate:'已經存在同名歸類', manage:'管理歸類', managerTitle:'編輯歸類', save:'儲存名稱', cancel:'取消', remove:'刪除歸類', summary:'此歸類包含 {0} 個項目；刪除後會移動到「{1}」。', lastSummary:'這是最後一個歸類，不能刪除。', deleteConfirm:'確定刪除「{0}」嗎？其中 {1} 個項目會移動到「{2}」。', deleted:'歸類已刪除，相關項目已移動到「{0}」' }
  };
  Object.assign(classificationMessages.zh, { color:'归类颜色', colorHint:'选择颜色后，侧栏和项目卡片会同步更新。', presets:'预设颜色', save:'保存修改', updated:'归类名称、自定义简称或 Emoji 与颜色已更新', add:'新建归类', addHint:'创建一个新的归类', manageHint:'编辑名称、自定义简称或 Emoji 与颜色', menu:'归类操作', shortName:'自定义简称 / Emoji', shortHint:'输入 1–3 个文字或从右侧选择 Emoji；留空自动生成', shortAuto:'自动生成', emojiPicker:'选择 Emoji', emojiOpen:'打开 Emoji 选择器', managerTitle:'归类管理', editClassification:'编辑归类', listTitle:'归类列表', mobileTitle:'所有归类', listCount:'{0} 个归类', contentTitle:'归类内容', notesTitle:'笔记', todosTitle:'待办', noNotes:'此归类下还没有笔记', noTodos:'此归类下还没有待办', itemCount:'{0} 个内容', close:'关闭', openItem:'打开内容' });
  Object.assign(classificationMessages.en, { color:'Classification color', colorHint:'The sidebar and item cards update when you choose a color.', presets:'Preset colors', save:'Save changes', updated:'Classification name, custom short label or emoji, and color updated', add:'New classification', addHint:'Create a new classification', manageHint:'Edit names, custom short labels or emoji, and colors', menu:'Classification actions', shortName:'Custom label / Emoji', shortHint:'Enter 1–3 characters or choose an emoji; leave blank to generate one', shortAuto:'Auto', emojiPicker:'Choose an emoji', emojiOpen:'Open emoji picker', managerTitle:'Manage classifications', editClassification:'Edit classification', listTitle:'Classifications', mobileTitle:'All classifications', listCount:'{0} classifications', contentTitle:'Classification contents', notesTitle:'Notes', todosTitle:'Tasks', noNotes:'No notes in this classification', noTodos:'No tasks in this classification', itemCount:'{0} items', close:'Close', openItem:'Open item' });
  Object.assign(classificationMessages['zh-Hant'], { color:'歸類顏色', colorHint:'選擇顏色後，側欄和項目卡片會同步更新。', presets:'預設顏色', save:'儲存修改', updated:'歸類名稱、自訂簡稱或 Emoji 與顏色已更新', add:'新增歸類', addHint:'建立一個新的歸類', manageHint:'編輯名稱、自訂簡稱或 Emoji 與顏色', menu:'歸類操作', shortName:'自訂簡稱 / Emoji', shortHint:'輸入 1–3 個文字或從右側選擇 Emoji；留空時自動產生', shortAuto:'自動產生', emojiPicker:'選擇 Emoji', emojiOpen:'開啟 Emoji 選擇器', managerTitle:'歸類管理', editClassification:'編輯歸類', listTitle:'歸類列表', mobileTitle:'所有歸類', listCount:'{0} 個歸類', contentTitle:'歸類內容', notesTitle:'筆記', todosTitle:'待辦', noNotes:'此歸類下還沒有筆記', noTodos:'此歸類下還沒有待辦', itemCount:'{0} 個內容', close:'關閉', openItem:'開啟內容' });
  const classificationText = () => classificationMessages[uiSettings.language] || classificationMessages.zh;

  const classificationManagerDialog = byId('classificationManagerDialog');
  const mobileClassificationPanel = byId('viewTitleMenuPanel');
  const mobileClassificationTrigger = byId('viewTitleMenu');
  const quickCaptureDialog = byId('quickCaptureDialog');
  const quickCaptureForm = byId('quickCaptureForm');
  const quickCaptureTitleInput = byId('quickCaptureItemTitle');
  const quickCaptureFolder = byId('quickCaptureFolder');
  const quickCaptureStart = byId('quickCaptureStart');
  const quickCaptureDue = byId('quickCaptureDue');
  const quickCapturePriority = byId('quickCapturePriority');
  const quickCaptureTasks = byId('quickCaptureTasks');
  const quickCaptureBody = byId('quickCaptureBody');
  const quickCaptureSubmitButton = quickCaptureDialog.querySelector('.quick-capture-submit');
  const QUICK_CAPTURE_STEPS = 3;
  let quickCaptureStep = 1;
  let quickCaptureType = 'todo';
  let quickCaptureStartTouched = false;
  const classificationManagerName = byId('classificationManagerName');
  const classificationManagerShortName = byId('classificationManagerShortName');
  const classificationEmojiButton = byId('classificationEmojiButton');
  const classificationEmojiPicker = byId('classificationEmojiPicker');
  const classificationEmojiGrid = byId('classificationEmojiGrid');
  const classificationEmojis = ['📥','🗓️','✅','📝','💡','💼','🏠','📚','🎯','🚀','❤️','⭐','🔖','🧠','✨','🔧','💰','🛒','✈️','🎵','🎬','🍽️','🏃','🌿','🐾','👨‍👩‍👧‍👦','🎨','💻','📌','🔥','☕','🧭','👩‍💻','🌍','📷','🎁','🧹','💬','🔬','🧘'];
  const classificationManagerColor = byId('classificationManagerColor');
  const folderActionMenu = byId('folderActionMenu');
  const folderActionsMenu = byId('folderActionsMenu');
  let classificationManagerFolderId = '';
  const animatedDialogCloseTimers = new WeakMap();

  const reduceWindowMotion = () => document.body.classList.contains('acta-reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  function openAnimatedDialog(dialog) {
    clearTimeout(animatedDialogCloseTimers.get(dialog));
    animatedDialogCloseTimers.delete(dialog);
    dialog.classList.remove('is-closing');
    if (!dialog.open) dialog.showModal();
  }
  function closeAnimatedDialog(dialog) {
    if (!dialog?.open || dialog.classList.contains('is-closing')) return;
    const finish = () => {
      clearTimeout(animatedDialogCloseTimers.get(dialog));
      animatedDialogCloseTimers.delete(dialog);
      if (dialog.open) dialog.close();
      dialog.classList.remove('is-closing');
    };
    if (reduceWindowMotion()) { finish(); return; }
    dialog.classList.add('is-closing');
    animatedDialogCloseTimers.set(dialog, setTimeout(finish, 250));
  }

  // —— 弹窗空白处点击行为 ——
  // 设计约定：弹出窗口不因误触空白处丢内容；默认需要双击（明确的关闭
  // 意图）才触发各弹窗已有的 cancel 关闭逻辑（含传输中锁定等守卫），
  // 可在 常规设置 中改为单击关闭或完全不响应（防误触）。
  // 点击 ::backdrop 时 event.target 是 dialog 元素自身；设置面板这类 div
  // 遮罩则是遮罩元素本身——两者统一按「event.target 就是弹层表面」判定，
  // dialog 仍派发 cancel 走各自的守卫，设置面板直接 closeSettings()。
  // OOBE 是分步引导，空白处点击不关闭。
  const backdropClickState = { surface: null, at: 0 };
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const surface = event.target.closest('dialog, .settings-backdrop');
    if (!surface || event.target !== surface) return;
    const isOpen = surface instanceof HTMLDialogElement ? surface.open : surface.classList.contains('open');
    if (!isOpen) return;
    // dialog 的 rect 就是弹窗本体；div 遮罩的 rect 是整个视口，rect 检查对它
    // 没有意义——target 已经保证点击落在遮罩上而不是弹窗内容里。
    if (surface instanceof HTMLDialogElement) {
      const rect = surface.getBoundingClientRect();
      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) return;
    }
    const mode = ['none', 'single', 'double'].includes(uiSettings.backdropClose) ? uiSettings.backdropClose : 'double';
    if (mode === 'none') return;
    const dismiss = () => {
      if (surface instanceof HTMLDialogElement) surface.dispatchEvent(new Event('cancel', { cancelable: true }));
      else closeSettings();
    };
    if (mode === 'single') {
      dismiss();
      return;
    }
    const now = performance.now();
    if (backdropClickState.surface === surface && now - backdropClickState.at < 450) {
      backdropClickState.surface = null;
      dismiss();
    } else {
      backdropClickState.surface = surface;
      backdropClickState.at = now;
    }
  }, true);

  function populateQuickCaptureFolders(preferredFolderId = quickCaptureFolder.value) {
    quickCaptureFolder.replaceChildren();
    const unclassified = document.createElement('option');
    unclassified.value = '';
    unclassified.textContent = t('unclassified');
    quickCaptureFolder.appendChild(unclassified);
    library.folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.id;
      option.textContent = folderName(folder);
      quickCaptureFolder.appendChild(option);
    });
    if (preferredFolderId === '' || getFolder(preferredFolderId)) quickCaptureFolder.value = preferredFolderId;
  }

  function setQuickCaptureType(type) {
    quickCaptureType = type === 'note' ? 'note' : type === 'checkin' ? 'checkin' : 'todo';
    quickCaptureDialog.querySelectorAll('[data-quick-type]').forEach(button => {
      const active = button.dataset.quickType === quickCaptureType;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const isTodo = quickCaptureType === 'todo';
    const isCheckin = quickCaptureType === 'checkin';
    const isPlainTodo = isTodo;
    byId('quickCaptureStartField').hidden = !isPlainTodo;
    byId('quickCaptureDueField').hidden = !isPlainTodo;
    byId('quickCapturePriorityField').hidden = !isPlainTodo;
    byId('quickCaptureTasksField').hidden = !isPlainTodo;
    const bodyKey = isTodo ? 'todoBody' : isCheckin ? 'checkinBody' : 'noteBody';
    const bodyPlaceholderKey = isTodo ? 'todoBodyPlaceholder' : isCheckin ? 'checkinBodyPlaceholder' : 'noteBodyPlaceholder';
    const bodyHintKey = isTodo ? 'todoBodyHint' : isCheckin ? 'checkinBodyHint' : 'noteBodyHint';
    const titlePlaceholderKey = isTodo ? 'todoTitlePlaceholder' : isCheckin ? 'checkinTitlePlaceholder' : 'noteTitlePlaceholder';
    const submitLabelKey = isTodo ? 'createTodo' : isCheckin ? 'createCheckin' : 'createNote';
    byId('quickCaptureBodyLabel').textContent = quickCaptureText(bodyKey);
    quickCaptureBody.placeholder = quickCaptureText(bodyPlaceholderKey);
    byId('quickCaptureBodyHint').textContent = quickCaptureText(bodyHintKey);
    quickCaptureTitleInput.placeholder = quickCaptureText(titlePlaceholderKey);
    byId('quickCaptureSubmitLabel').textContent = quickCaptureText(submitLabelKey);
    syncQuickCaptureScheduleHint();
    syncQuickCaptureSteps();
  }

  function syncQuickCaptureScheduleHint() {
    const hint = byId('quickCaptureScheduleHint');
    const isTodo = quickCaptureType === 'todo';
    const incomplete = !quickCaptureStart.value || !quickCaptureDue.value;
    hint.hidden = !isTodo || !incomplete;
    quickCaptureDue.min = quickCaptureStart.value || '';
  }

  function quickCaptureIsMobile() {
    return matchMedia('(max-width: 800px)').matches;
  }

  // 移动端分步填写：同一份 DOM 在桌面上全部展开，在手机上只显示当前步骤。
  function syncQuickCaptureSteps() {
    const mobile = quickCaptureIsMobile();
    quickCaptureDialog.querySelectorAll('[data-quick-step]').forEach(section => {
      const index = Number(section.dataset.quickStep);
      section.hidden = mobile && index !== quickCaptureStep;
      section.classList.toggle('is-active', mobile && index === quickCaptureStep);
    });
    const progress = byId('quickCaptureProgress');
    if (progress) {
      progress.hidden = !mobile;
      progress.setAttribute('aria-valuenow', String(quickCaptureStep));
      [...progress.children].forEach((segment, index) => {
        segment.classList.toggle('is-done', mobile && index + 1 < quickCaptureStep);
        segment.classList.toggle('is-active', mobile && index + 1 === quickCaptureStep);
      });
    }
    const stepLabel = byId('quickCaptureStepLabel');
    stepLabel.hidden = !mobile;
    if (mobile) stepLabel.textContent = quickCaptureText('stepOf').replace('{0}', quickCaptureStep).replace('{1}', QUICK_CAPTURE_STEPS);
    byId('quickCaptureBack').hidden = !mobile || quickCaptureStep <= 1;
    byId('quickCaptureNext').hidden = !mobile || quickCaptureStep >= QUICK_CAPTURE_STEPS;
    quickCaptureSubmitButton.hidden = mobile && quickCaptureStep < QUICK_CAPTURE_STEPS;
    byId('cancelQuickCapture').hidden = mobile;
    byId('quickCaptureShortcut').hidden = mobile;
  }

  function validateQuickCaptureStep(step) {
    if (step !== 1) return true;
    const title = quickCaptureTitleInput.value.trim();
    if (title) {
      quickCaptureTitleInput.setCustomValidity('');
      const error = byId('quickCaptureError');
      if (error.textContent === quickCaptureText('titleRequired')) error.textContent = '';
      return true;
    }
    const message = quickCaptureText('titleRequired');
    quickCaptureTitleInput.setCustomValidity(message);
    byId('quickCaptureError').textContent = message;
    quickCaptureTitleInput.reportValidity();
    quickCaptureTitleInput.focus();
    return false;
  }

  function goQuickCaptureStep(next) {
    if (!quickCaptureIsMobile()) return;
    const target = Math.min(QUICK_CAPTURE_STEPS, Math.max(1, next));
    if (target > quickCaptureStep && !validateQuickCaptureStep(quickCaptureStep)) return;
    quickCaptureDialog.dataset.stepDirection = target >= quickCaptureStep ? 'forward' : 'back';
    quickCaptureStep = target;
    syncQuickCaptureSteps();
    const body = quickCaptureDialog.querySelector('.quick-capture-body');
    if (body) body.scrollTop = 0;
    const section = quickCaptureDialog.querySelector(`[data-quick-step="${quickCaptureStep}"]`);
    const field = section?.querySelector('input:not([type="hidden"]), textarea, select');
    requestAnimationFrame(() => field?.focus({ preventScroll: true }));
  }

  function updateQuickCaptureCopy() {
    const copy = quickCaptureText;
    byId('quickCaptureTitle').textContent = copy('title');
    byId('quickCaptureSubtitle').textContent = copy('subtitle');
    byId('quickCaptureIntro').textContent = copy('intro');
    byId('quickCaptureTypeLabel').textContent = copy('chooseType');
    byId('quickCaptureContentLabel').textContent = copy('writeContent');
    byId('quickCaptureArrangeLabel').textContent = copy('arrange');
    byId('quickCaptureTodoLabel').textContent = copy('todo');
    byId('quickCaptureTodoHint').textContent = copy('todoHint');
    byId('quickCaptureNoteLabel').textContent = copy('note');
    byId('quickCaptureNoteHint').textContent = copy('noteHint');
    byId('quickCaptureCheckinLabel').textContent = copy('checkin');
    byId('quickCaptureCheckinHint').textContent = copy('checkinHint');
    byId('quickCaptureItemTitleLabel').textContent = copy('itemTitle');
    byId('quickCaptureFolderLabel').textContent = copy('folder');
    byId('quickCaptureStartLabel').textContent = copy('start');
    byId('quickCaptureDueLabel').textContent = copy('due');
    byId('clearQuickCaptureStart').textContent = copy('clear');
    byId('clearQuickCaptureStart').title = copy('clearStart');
    byId('clearQuickCaptureStart').setAttribute('aria-label', copy('clearStart'));
    byId('clearQuickCaptureDue').textContent = copy('clear');
    byId('clearQuickCaptureDue').title = copy('clearDue');
    byId('clearQuickCaptureDue').setAttribute('aria-label', copy('clearDue'));
    byId('quickCaptureScheduleHint').textContent = copy('calendarHidden');
    byId('quickCapturePriorityLabel').textContent = copy('priority');
    byId('quickCaptureTasksLabel').textContent = copy('childEvents');
    quickCaptureTasks.placeholder = copy('childEventsPlaceholder');
    byId('quickCaptureTasksHint').textContent = copy('childEventsHint');
    byId('quickCapturePriority').querySelector('[value="high"]').textContent = t('high');
    byId('quickCapturePriority').querySelector('[value="medium"]').textContent = t('medium');
    byId('quickCapturePriority').querySelector('[value="low"]').textContent = t('low');
    byId('cancelQuickCapture').textContent = copy('cancel');
    byId('quickCaptureBack').textContent = copy('back');
    byId('quickCaptureNext').textContent = copy('next');
    byId('closeQuickCapture').setAttribute('aria-label', copy('close'));
    byId('quickCaptureShortcut').textContent = copy('shortcut');
    populateQuickCaptureFolders();
    setQuickCaptureType(quickCaptureType);
  }

  function openQuickCapture() {
    quickCaptureForm.reset();
    quickCaptureTitleInput.setCustomValidity('');
    byId('quickCaptureError').textContent = '';
    quickCaptureStart.value = dateTimeLocalValue(new Date());
    quickCaptureDue.value = '';
    quickCaptureStartTouched = false;
    quickCapturePriority.value = 'medium';
    quickCaptureType = 'todo';
    quickCaptureStep = 1;
    quickCaptureDialog.dataset.stepDirection = 'forward';
    updateQuickCaptureCopy();
    populateQuickCaptureFolders('');
    byId('createMenu').classList.remove('open');
    openAnimatedDialog(quickCaptureDialog);
    requestAnimationFrame(() => quickCaptureTitleInput.focus());
  }

  quickCaptureDialog.querySelectorAll('[data-quick-type]').forEach(button => button.addEventListener('click', () => {
    setQuickCaptureType(button.dataset.quickType);
    quickCaptureTitleInput.focus();
  }));
  byId('closeQuickCapture').addEventListener('click', () => closeAnimatedDialog(quickCaptureDialog));
  byId('cancelQuickCapture').addEventListener('click', () => closeAnimatedDialog(quickCaptureDialog));
  byId('quickCaptureBack').addEventListener('click', () => goQuickCaptureStep(quickCaptureStep - 1));
  byId('quickCaptureNext').addEventListener('click', () => goQuickCaptureStep(quickCaptureStep + 1));
  matchMedia('(max-width: 800px)').addEventListener('change', () => {
    if (quickCaptureDialog.open) syncQuickCaptureSteps();
  });
  // 设计约定：弹出窗口不因点击空白处而关闭，避免误触丢失已输入的内容；
  // 关闭只通过明确的关闭/取消按钮或 Esc。
  quickCaptureDialog.addEventListener('cancel', event => { event.preventDefault(); closeAnimatedDialog(quickCaptureDialog); });
  quickCaptureTitleInput.addEventListener('input', () => {
    quickCaptureTitleInput.setCustomValidity('');
    byId('quickCaptureError').textContent = '';
  });
  quickCaptureStart.addEventListener('input', () => {
    quickCaptureStartTouched = true;
    byId('quickCaptureError').textContent = '';
    syncQuickCaptureScheduleHint();
  });
  quickCaptureDue.addEventListener('input', () => {
    byId('quickCaptureError').textContent = '';
    syncQuickCaptureScheduleHint();
  });
  byId('clearQuickCaptureStart').addEventListener('click', () => {
    quickCaptureStart.value = '';
    quickCaptureStartTouched = true;
    syncQuickCaptureScheduleHint();
  });
  byId('clearQuickCaptureDue').addEventListener('click', () => {
    quickCaptureDue.value = '';
    syncQuickCaptureScheduleHint();
  });
  quickCaptureForm.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      quickCaptureForm.requestSubmit();
    }
  });
  quickCaptureForm.addEventListener('submit', event => {
    event.preventDefault();
    if (quickCaptureIsMobile() && quickCaptureStep < QUICK_CAPTURE_STEPS) {
      goQuickCaptureStep(quickCaptureStep + 1);
      return;
    }
    const title = quickCaptureTitleInput.value.trim();
    if (!title) {
      const message = quickCaptureText('titleRequired');
      quickCaptureTitleInput.setCustomValidity(message);
      byId('quickCaptureError').textContent = message;
      quickCaptureTitleInput.reportValidity();
      quickCaptureTitleInput.focus();
      return;
    }
    const created = new Date();
    const now = created.toISOString();
    const folderId = quickCaptureFolder.value === '' ? '' : (getFolder(quickCaptureFolder.value) ? quickCaptureFolder.value : '');
    const base = { id:uid(), type:quickCaptureType === 'note' ? 'note' : 'todo', folderId, title, linkedIds:[], createdAt:now, updatedAt:now };
    const content = quickCaptureBody.value.trim();
    const childEvents = quickCaptureTasks.value.split(/\r?\n/).map(text => text.trim()).filter(Boolean);
    const startAt = quickCaptureStart.value ? (quickCaptureStartTouched ? dateTimeLocalISO(quickCaptureStart.value) : now) : '';
    const dueAt = dateTimeLocalISO(quickCaptureDue.value);
    if (quickCaptureType === 'todo' && ((quickCaptureStart.value && !startAt) || (quickCaptureDue.value && !dueAt) || (startAt && dueAt && dueAt <= startAt))) {
      byId('quickCaptureError').textContent = quickCaptureText('invalidSchedule');
      return;
    }
    const item = quickCaptureType === 'note'
      ? { ...base, body:content ? markdownToNoteHTML(content) : '<p><br></p>' }
      : quickCaptureType === 'checkin'
        ? { ...base, checkin:true, checkins:{}, priority:'medium', notes:content, tasks:[], completed:false }
        : { ...base, startAt, dueAt, priority:['high', 'medium', 'low'].includes(quickCapturePriority.value) ? quickCapturePriority.value : 'medium', notes:content, tasks:childEvents.map(text => ({ id:uid(), text, done:false })), completed:false };
    library.items.unshift(item);
    persist();
    renderAll();
    logHistory(item.checkin ? 'checkin-created' : item.type === 'note' ? 'note-created' : 'todo-created', item.title, item.id);
    closeAnimatedDialog(quickCaptureDialog);
    showToast(`${t('itemCreated')} · ${item.checkin ? t('checkinTodo') : t(item.type)}`);
  });

  const normalizedClassificationColor = color => /^#[0-9a-f]{6}$/i.test(String(color || '')) ? String(color).toUpperCase() : '#526B55';
  function syncClassificationManagerColor() {
    const color = normalizedClassificationColor(classificationManagerColor.value);
    byId('classificationManagerColorValue').textContent = color;
    byId('classificationColorPresets').querySelectorAll('[data-classification-color]').forEach(button => {
      const active = button.dataset.classificationColor.toUpperCase() === color;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function formatClassificationMessage(template, ...values) {
    return values.reduce((message, value, index) => message.replace(`{${index}}`, value), template);
  }

  const normalizedFolderShortName = normalizeFolderShortName;
  function renderMobileClassifications() {
    const copy = classificationText();
    const list = byId('mobileClassificationList');
    list.setAttribute('aria-label', copy.mobileTitle);
    list.innerHTML = library.folders.length
      ? library.folders.map(folder => {
        const count = library.items.filter(item => item.folderId === folder.id && !isTrashed(item)).length;
        const shortName = folderShortName(folder);
        const shortNameClasses = ['folder-short-name', folderShortNameUsesEmoji(shortName) ? 'is-emoji' : '', folderShortSegments(shortName).length > 2 ? 'is-long' : ''].filter(Boolean).join(' ');
        const name = folderName(folder);
        return `<div class="mobile-classification-row ${currentView === `folder:${folder.id}` ? 'active' : ''}" style="--folder-color:${escapeHTML(normalizedClassificationColor(folder.color))}">
          <button class="mobile-classification-open" type="button" data-view="folder:${escapeHTML(folder.id)}">
            <i class="folder-dot"><b class="${shortNameClasses}">${escapeHTML(shortName)}</b></i>
            <span><strong>${escapeHTML(name)}</strong><small>${escapeHTML(formatClassificationMessage(copy.itemCount, count))}</small></span><em>${count}</em>
          </button>
          <button class="mobile-classification-edit" type="button" data-classification-edit="${escapeHTML(folder.id)}" title="${escapeHTML(copy.editClassification)}" aria-label="${escapeHTML(`${copy.editClassification}：${name}`)}"><svg><use href="#i-edit"/></svg></button>
        </div>`;
      }).join('')
      : `<button class="mobile-classification-empty" type="button" data-classification-add><svg><use href="#i-plus"/></svg><span>${escapeHTML(copy.add)}</span></button>`;
  }
  let mobileClassificationCloseTimer = 0;
  function openMobileClassifications() {
    clearTimeout(mobileClassificationCloseTimer);
    renderMobileClassifications();
    mobileClassificationPanel.hidden = false;
    mobileClassificationTrigger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      mobileClassificationPanel.classList.add('is-open');
      byId('mobileClassificationList').querySelector('.mobile-classification-row.active .mobile-classification-open, .mobile-classification-open, .mobile-classification-empty')?.focus({ preventScroll: true });
    });
  }
  function closeMobileClassifications(restoreFocus = false) {
    mobileClassificationPanel.classList.remove('is-open');
    mobileClassificationTrigger.setAttribute('aria-expanded', 'false');
    clearTimeout(mobileClassificationCloseTimer);
    mobileClassificationCloseTimer = setTimeout(() => {
      if (!mobileClassificationPanel.classList.contains('is-open')) mobileClassificationPanel.hidden = true;
    }, 220);
    if (restoreFocus) mobileClassificationTrigger.focus();
  }
  function toggleMobileClassifications() {
    if (mobileClassificationPanel.classList.contains('is-open')) closeMobileClassifications();
    else openMobileClassifications();
  }
  function updateFolderActionCopy() {
    const copy = classificationText();
    const mobileViewLabel = uiSettings.language === 'en' ? 'View classifications' : uiSettings.language === 'zh-Hant' ? '查看歸類' : '查看归类';
    folderActionsMenu.title = copy.menu;
    folderActionsMenu.setAttribute('aria-label', copy.menu);
    mobileClassificationTrigger.title = mobileViewLabel;
    mobileClassificationTrigger.setAttribute('aria-label', mobileViewLabel);
    const mobileDataLabel = uiSettings.language === 'en' ? 'Acta Data' : uiSettings.language === 'zh-Hant' ? '行記資料' : '行记数据';
    byId('folderMenuAddTitle').textContent = copy.add;
    byId('folderMenuAddHint').textContent = copy.addHint;
    byId('folderMenuManageTitle').textContent = copy.manage;
    byId('folderMenuManageHint').textContent = copy.manageHint;
  }
  mobileClassificationTrigger.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    toggleMobileClassifications();
  });
  byId('viewTitle').addEventListener('click', event => {
    if (!matchMedia('(max-width: 800px)').matches) return;
    if (!document.body.classList.contains('inbox-view') && !document.body.classList.contains('folder-view')) return;
    event.stopPropagation();
    toggleMobileClassifications();
  });
  byId('mobileClassificationList').addEventListener('click', event => {
    const addButton = event.target.closest('[data-classification-add]');
    if (addButton) {
      event.preventDefault();
      event.stopPropagation();
      closeMobileClassifications();
      byId('addFolder').click();
      return;
    }
    const editButton = event.target.closest('[data-classification-edit]');
    if (editButton) {
      event.preventDefault();
      event.stopPropagation();
      closeMobileClassifications();
      openClassificationManager(editButton.dataset.classificationEdit);
      return;
    }
    if (event.target.closest('[data-view^="folder:"]')) closeMobileClassifications();
  });
  document.addEventListener('click', event => {
    if (!mobileClassificationPanel.classList.contains('is-open')) return;
    if (event.target.closest('#viewTitleMenuPanel, #viewTitleMenu, #viewTitle')) return;
    closeMobileClassifications();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !mobileClassificationPanel.classList.contains('is-open') || isImeComposing(event)) return;
    event.preventDefault();
    closeMobileClassifications(true);
  });
  document.addEventListener('acta:view-changed', () => {
    if (mobileClassificationPanel.classList.contains('is-open')) closeMobileClassifications();
  });
  function closeFolderActionMenu() {
    folderActionMenu.classList.remove('open');
    folderActionMenu.setAttribute('aria-hidden', 'true');
    folderActionsMenu.setAttribute('aria-expanded', 'false');
  }
  function toggleFolderActionMenu() {
    if (!document.body.classList.contains('sidebar-collapsed')) return;
    if (folderActionMenu.classList.contains('open')) { closeFolderActionMenu(); return; }
    const triggerRect = folderActionsMenu.getBoundingClientRect();
    const sidebarRect = byId('primarySidebar').getBoundingClientRect();
    const top = Math.max(8, Math.min(triggerRect.top - sidebarRect.top - 4, sidebarRect.height - 126));
    folderActionMenu.style.setProperty('--folder-menu-top', `${top}px`);
    folderActionMenu.classList.add('open');
    folderActionMenu.setAttribute('aria-hidden', 'false');
    folderActionsMenu.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => folderActionMenu.querySelector('button')?.focus());
  }

  function renderClassificationManagerItems(items, emptyCopy) {
    if (!items.length) return `<div class="classification-manager-empty"><svg><use href="#i-folder"/></svg><span>${escapeHTML(emptyCopy)}</span></div>`;
    return [...items]
      .sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt))
      .map(item => {
        const done = item.type === 'todo' && isTodoComplete(item);
        const completedTasks = item.type === 'todo' ? (item.tasks || []).filter(task => task.done).length : 0;
        const totalTasks = item.type === 'todo' ? (item.tasks || []).length : 0;
        const title = item.title?.trim() || t(item.type === 'todo' ? 'untitledTodo' : 'untitledNote');
        const preview = itemPreview(item);
        const meta = item.type === 'todo' && totalTasks ? `${completedTasks}/${totalTasks}` : formatDate(item.updatedAt, true);
        return `<button class="classification-content-item ${done ? 'completed' : ''}" type="button" data-classification-item="${escapeHTML(item.id)}" title="${escapeHTML(classificationText().openItem)}">
          <span class="classification-content-state"><svg><use href="#i-${item.type === 'todo' ? 'check' : 'note'}"/></svg></span>
          <span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(preview)}</small></span><em>${escapeHTML(meta)}</em>
        </button>`;
      }).join('');
  }

  function renderClassificationManager() {
    const copy = classificationText();
    closeClassificationEmojiPicker();
    let folder = getFolder(classificationManagerFolderId);
    if (!folder) {
      folder = library.folders[0];
      classificationManagerFolderId = folder?.id || '';
    }
    if (!folder) return;
    const folderItems = library.items.filter(item => item.folderId === folder.id && !isTrashed(item));
    const notes = folderItems.filter(item => item.type === 'note');
    const todos = folderItems.filter(item => item.type === 'todo');
    const fallback = library.folders.find(entry => entry.id !== folder.id);
    byId('classificationManagerTitle').textContent = copy.managerTitle;
    byId('classificationManagerListTitle').textContent = copy.listTitle;
    byId('classificationManagerListCount').textContent = formatClassificationMessage(copy.listCount, library.folders.length);
    byId('classificationManagerList').setAttribute('aria-label', copy.listTitle);
    byId('classificationManagerContentTitle').textContent = copy.contentTitle;
    byId('classificationManagerNotesTitle').textContent = copy.notesTitle;
    byId('classificationManagerTodosTitle').textContent = copy.todosTitle;
    byId('classificationManagerNotesCount').textContent = notes.length;
    byId('classificationManagerTodosCount').textContent = todos.length;
    byId('classificationManagerLabel').textContent = copy.rename;
    byId('classificationManagerShortLabel').textContent = copy.shortName;
    byId('classificationManagerShortHint').textContent = copy.shortHint;
    byId('classificationEmojiPickerTitle').textContent = copy.emojiPicker;
    byId('classificationEmojiAuto').textContent = copy.shortAuto;
    classificationEmojiButton.title = copy.emojiOpen;
    classificationEmojiButton.setAttribute('aria-label', copy.emojiOpen);
    byId('classificationManagerColorLabel').textContent = copy.color;
    byId('classificationManagerColorHint').textContent = copy.colorHint;
    byId('classificationColorPresets').setAttribute('aria-label', copy.presets);
    byId('closeClassificationManager').setAttribute('aria-label', uiSettings.language === 'en' ? 'Close' : uiSettings.language === 'zh-Hant' ? '關閉' : '关闭');
    byId('deleteClassification').querySelector('span').textContent = copy.remove;
    byId('cancelClassificationManager').textContent = copy.close;
    byId('saveClassificationManager').querySelector('span').textContent = copy.save;
    byId('classificationManagerList').innerHTML = library.folders.map(entry => {
      const itemCount = library.items.filter(item => item.folderId === entry.id && !isTrashed(item)).length;
      return `<button type="button" data-classification-folder="${escapeHTML(entry.id)}" class="${entry.id === folder.id ? 'active' : ''}" style="--folder-color:${escapeHTML(normalizedClassificationColor(entry.color))}">
        <i class="folder-dot"></i><span><strong>${escapeHTML(folderName(entry))}</strong><small>${escapeHTML(formatClassificationMessage(copy.itemCount, itemCount))}</small></span><svg><use href="#i-chevron"/></svg>
      </button>`;
    }).join('');
    classificationManagerName.value = folderName(folder);
    classificationManagerShortName.value = normalizedFolderShortName(folder.shortName);
    classificationManagerShortName.placeholder = `${copy.shortAuto} · ${folderShortName({ ...folder, shortName:'' })}`;
    syncClassificationEmojiSelection();
    classificationManagerColor.value = normalizedClassificationColor(folder.color);
    syncClassificationManagerColor();
    classificationManagerName.setCustomValidity('');
    byId('classificationManagerSummary').textContent = fallback
      ? formatClassificationMessage(copy.summary, folderItems.length, folderName(fallback))
      : copy.lastSummary;
    byId('deleteClassification').disabled = !fallback;
    byId('classificationManagerNotes').innerHTML = renderClassificationManagerItems(notes, copy.noNotes);
    byId('classificationManagerTodos').innerHTML = renderClassificationManagerItems(todos, copy.noTodos);
    const manageFolders = byId('manageFolders');
    manageFolders.title = copy.manage;
    manageFolders.setAttribute('aria-label', copy.manage);
    const addFolder = byId('addFolder');
    addFolder.title = copy.add;
    addFolder.setAttribute('aria-label', copy.add);
    updateFolderActionCopy();
  }

  function openClassificationManager(folderId) {
    const preferredFolder = getFolder(folderId)
      || (currentView.startsWith('folder:') ? getFolder(currentView.slice('folder:'.length)) : null)
      || library.folders[0];
    if (!preferredFolder) return;
    classificationManagerFolderId = preferredFolder.id;
    renderClassificationManager();
    if (!classificationManagerDialog.open) openAnimatedDialog(classificationManagerDialog);
    requestAnimationFrame(() => {
      const activeFolder = byId('classificationManagerList').querySelector('.active');
      activeFolder?.focus();
      if (matchMedia('(max-width: 760px)').matches) activeFolder?.scrollIntoView({ block:'nearest', inline:'center' });
    });
  }

  function syncClassificationEmojiSelection() {
    const value = normalizedFolderShortName(classificationManagerShortName.value);
    const selectedEmoji = folderShortNameUsesEmoji(value) ? value : '';
    classificationEmojiButton.textContent = selectedEmoji || '🙂';
    classificationEmojiGrid.querySelectorAll('[data-classification-emoji]').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.classificationEmoji === selectedEmoji));
    });
  }

  function closeClassificationEmojiPicker(restoreFocus = false) {
    if (classificationEmojiPicker.hidden) return;
    classificationEmojiPicker.hidden = true;
    classificationEmojiButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) classificationEmojiButton.focus();
  }

  function openClassificationEmojiPicker() {
    const copy = classificationText();
    classificationEmojiGrid.innerHTML = classificationEmojis.map(emoji => `<button type="button" role="option" data-classification-emoji="${emoji}" aria-label="${escapeHTML(`${copy.emojiPicker}: ${emoji}`)}">${emoji}</button>`).join('');
    syncClassificationEmojiSelection();
    classificationEmojiPicker.hidden = false;
    classificationEmojiButton.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      const target = classificationEmojiGrid.querySelector('[aria-selected="true"]') || classificationEmojiGrid.querySelector('button');
      target?.focus();
    });
  }

  function commitClassificationManagerName() {
    const folder = getFolder(classificationManagerFolderId);
    if (!folder) return;
    const copy = classificationText();
    const nextName = classificationManagerName.value.trim();
    if (!nextName) {
      classificationManagerName.setCustomValidity(copy.empty);
      classificationManagerName.reportValidity();
      return;
    }
    if (library.folders.some(entry => entry.id !== folder.id && folderName(entry).trim().toLocaleLowerCase() === nextName.toLocaleLowerCase())) {
      classificationManagerName.setCustomValidity(copy.duplicate);
      classificationManagerName.reportValidity();
      return;
    }
    classificationManagerName.setCustomValidity('');
    folder.name = nextName;
    const nextShortName = normalizedFolderShortName(classificationManagerShortName.value);
    if (nextShortName) folder.shortName = nextShortName;
    else delete folder.shortName;
    folder.color = normalizedClassificationColor(classificationManagerColor.value);
    delete folder.nameKey;
    persist();
    renderAll();
    renderClassificationManager();
    closeAnimatedDialog(classificationManagerDialog);
    showToast(copy.updated);
  }

  folderActionsMenu.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    toggleFolderActionMenu();
  });
  folderActionMenu.addEventListener('click', event => {
    const action = event.target.closest('[data-folder-menu-action]')?.dataset.folderMenuAction;
    if (!action) return;
    event.stopPropagation();
    closeFolderActionMenu();
    if (action === 'add') byId('addFolder').click();
    if (action === 'manage') byId('manageFolders').click();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#folderActionMenu,#folderActionsMenu')) closeFolderActionMenu();
  });
  document.addEventListener('keydown', event => {
    if (!isImeComposing(event) && event.key === 'Escape' && folderActionMenu.classList.contains('open')) closeFolderActionMenu();
  });
  byId('manageFolders').addEventListener('click', () => openClassificationManager());
  byId('classificationManagerList').addEventListener('click', event => {
    const folderButton = event.target.closest('[data-classification-folder]');
    if (!folderButton) return;
    classificationManagerFolderId = folderButton.dataset.classificationFolder;
    renderClassificationManager();
    requestAnimationFrame(() => {
      const activeFolder = byId('classificationManagerList').querySelector('.active');
      activeFolder?.focus();
      if (matchMedia('(max-width: 760px)').matches) activeFolder?.scrollIntoView({ block:'nearest', inline:'center' });
    });
  });
  byId('classificationManagerDialog').addEventListener('cancel', event => {
    event.preventDefault();
    closeAnimatedDialog(classificationManagerDialog);
  });
  byId('classificationManagerDialog').addEventListener('click', event => {
    const itemButton = event.target.closest('[data-classification-item]');
    if (!itemButton) return;
    currentView = `folder:${classificationManagerFolderId}`;
    selectedId = itemButton.dataset.classificationItem;
    searchQuery = '';
    byId('searchInput').value = '';
    mobileEditorOpen = true;
    closeAnimatedDialog(classificationManagerDialog);
    renderAll();
  });
  byId('closeClassificationManager').addEventListener('click', () => closeAnimatedDialog(classificationManagerDialog));
  byId('cancelClassificationManager').addEventListener('click', () => closeAnimatedDialog(classificationManagerDialog));
  byId('saveClassificationManager').addEventListener('click', commitClassificationManagerName);
  classificationManagerName.addEventListener('input', () => classificationManagerName.setCustomValidity(''));
  classificationManagerName.addEventListener('input', () => {
    const folder = getFolder(classificationManagerFolderId);
    if (!folder || classificationManagerShortName.value.trim()) return;
    classificationManagerShortName.placeholder = `${classificationText().shortAuto} · ${folderShortName({ ...folder, name:classificationManagerName.value.trim(), nameKey:null, shortName:'' })}`;
  });
  classificationManagerShortName.addEventListener('input', () => {
    const normalized = normalizedFolderShortName(classificationManagerShortName.value);
    if (classificationManagerShortName.value !== normalized) classificationManagerShortName.value = normalized;
    syncClassificationEmojiSelection();
  });
  classificationEmojiButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    if (classificationEmojiPicker.hidden) openClassificationEmojiPicker();
    else closeClassificationEmojiPicker(true);
  });
  classificationEmojiGrid.addEventListener('click', event => {
    const option = event.target.closest('[data-classification-emoji]');
    if (!option) return;
    classificationManagerShortName.value = normalizedFolderShortName(option.dataset.classificationEmoji);
    classificationManagerShortName.dispatchEvent(new Event('input', { bubbles:true }));
    closeClassificationEmojiPicker(true);
  });
  byId('classificationEmojiAuto').addEventListener('click', () => {
    classificationManagerShortName.value = '';
    classificationManagerShortName.dispatchEvent(new Event('input', { bubbles:true }));
    closeClassificationEmojiPicker(true);
  });
  classificationEmojiGrid.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    const options = [...classificationEmojiGrid.querySelectorAll('button')];
    const current = Math.max(0, options.indexOf(document.activeElement));
    const columns = 8;
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? options.length - 1
      : event.key === 'ArrowLeft' ? current - 1
      : event.key === 'ArrowRight' ? current + 1
      : event.key === 'ArrowUp' ? current - columns
      : current + columns;
    event.preventDefault();
    options[Math.max(0, Math.min(options.length - 1, next))]?.focus();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest?.('#classificationEmojiPicker,#classificationEmojiButton')) closeClassificationEmojiPicker();
  });
  classificationManagerDialog.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || classificationEmojiPicker.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    closeClassificationEmojiPicker(true);
  }, true);
  classificationManagerColor.addEventListener('input', syncClassificationManagerColor);
  byId('classificationColorPresets').addEventListener('click', event => {
    const preset = event.target.closest('[data-classification-color]');
    if (!preset) return;
    classificationManagerColor.value = normalizedClassificationColor(preset.dataset.classificationColor);
    syncClassificationManagerColor();
  });
  classificationManagerName.addEventListener('keydown', event => {
    if (isImeComposing(event)) return;
    if (event.key === 'Enter') { event.preventDefault(); commitClassificationManagerName(); }
    if (event.key === 'Escape') { event.preventDefault(); closeAnimatedDialog(classificationManagerDialog); }
  });
  classificationManagerShortName.addEventListener('keydown', event => {
    if (isImeComposing(event)) return;
    if (event.key === 'Enter') { event.preventDefault(); commitClassificationManagerName(); }
    if (event.key === 'Escape') { event.preventDefault(); closeAnimatedDialog(classificationManagerDialog); }
  });
  byId('deleteClassification').addEventListener('click', () => {
    const folder = getFolder(classificationManagerFolderId);
    const fallback = library.folders.find(entry => entry.id !== folder?.id);
    if (!folder || !fallback) return;
    const copy = classificationText();
    const itemCount = library.items.filter(item => item.folderId === folder.id && !isTrashed(item)).length;
    if (!confirm(formatClassificationMessage(copy.deleteConfirm, folderName(folder), itemCount, folderName(fallback)))) return;
    const movedAt = new Date().toISOString();
    library.items.forEach(item => { if (item.folderId === folder.id) { item.folderId = fallback.id; item.updatedAt = movedAt; } });
    library.folders = library.folders.filter(entry => entry.id !== folder.id);
    if (currentView === `folder:${folder.id}`) currentView = `folder:${fallback.id}`;
    classificationManagerFolderId = fallback.id;
    persist();
    renderAll();
    renderClassificationManager();
    showToast(formatClassificationMessage(copy.deleted, folderName(fallback)));
  });

  const todoMetaMessages = {
    zh: { edit:'编辑', confirm:'确认时间设置', schedule:'时间安排', created:'创建日期时间', start:'开始日期时间', due:'截止日期时间', clear:'取消', notSet:'未设置', immutable:'创建时间不可更改', invalid:'请输入有效日期时间，且截止时间必须晚于开始时间。', calendarHidden:'开始或截止时间未设置，此待办将不在日历中显示。' },
    en: { edit:'Edit', confirm:'Confirm time settings', schedule:'Schedule', created:'Created date and time', start:'Start date and time', due:'Due date and time', clear:'Clear', notSet:'Not set', immutable:'The creation time cannot be changed', invalid:'Enter valid dates and times, with the due time after the start time.', calendarHidden:'Without both a start and due time, this task will not appear in the calendar.' },
    'zh-Hant': { edit:'編輯', confirm:'確認時間設定', schedule:'時間安排', created:'建立日期時間', start:'開始日期時間', due:'截止日期時間', clear:'取消', notSet:'未設定', immutable:'建立時間不可更改', invalid:'請輸入有效日期時間，且截止時間必須晚於開始時間。', calendarHidden:'開始或截止時間未設定，此待辦將不在日曆中顯示。' }
  };
  const todoMetaText = () => todoMetaMessages[uiSettings.language] || todoMetaMessages.zh;

  createItem = function createItemWithSchedule(type) {
    if (type === 'quick') { openQuickCapture(); return; }
    if (type !== 'note' && type !== 'todo' && type !== 'checkin') return;
    const now = new Date().toISOString();
    const currentFolder = currentView.startsWith('folder:') ? currentView.split(':')[1] : 'ideas';
    const base = {
      id: uid(), type: type === 'checkin' ? 'todo' : type, folderId: type === 'note' ? (getFolder(currentFolder) ? currentFolder : library.folders[0]?.id) : '',
      title: type === 'note' ? t('untitledNote') : (type === 'checkin' ? t('checkinTodo') : t('untitledTodo')), linkedIds: [], createdAt: now, updatedAt: now
    };
    const item = type === 'note'
      ? { ...base, body: '<p><br></p>' }
      : type === 'checkin'
        // 打卡式待办：checkins 以本地日期（todayISO 同款 YYYY-MM-DD）为键
        // 记录每天的打卡状态，不设开始/截止时间，也不参与子任务进度。
        ? { ...base, priority:'medium', notes:'', tasks:[], completed:false, checkin:true, checkins:{} }
        : { ...base, startAt:now, dueAt:'', priority:'medium', notes:'', tasks:[{ id:uid(), text:'', done:false }], completed:false };
    library.items.unshift(item);
    selectedId = item.id;
    mobileEditorOpen = true;
    resetListFilters(type);
    currentFilter = 'all';
    searchQuery = '';
    byId('searchInput').value = '';
    persist();
    renderAll();
    logHistory(type === 'note' ? 'note-created' : type === 'checkin' ? 'checkin-created' : 'todo-created', item.title, item.id);
    byId('createMenu').classList.remove('open');
    showToast(`${t('itemCreated')} · ${type === 'checkin' ? t('checkinTodo') : t(type)}`);
    requestAnimationFrame(() => byId('editorTitle')?.select());
  };

  classificationField = function selectableClassificationField(item) {
    const currentFolder = getFolder(item.folderId);
    return `<div class="meta-field classification-field">
      <div class="meta-field-heading">
        <label for="classificationFolder"><svg><use href="#i-folder"/></svg>${t('classify')}</label>
      </div>
      <div class="classification-controls classification-select-only">
        <select id="classificationFolder" aria-label="${t('classify')}">
          <option value="" ${currentFolder ? '' : 'selected'}>${escapeHTML(t('unclassified'))}</option>
          ${library.folders.map(folder => `<option value="${escapeHTML(folder.id)}" ${folder.id === item.folderId ? 'selected' : ''}>${escapeHTML(folderName(folder))}</option>`).join('')}
        </select>
      </div>
    </div>`;
  };

  const itemMetaMessages = {
    zh: { open:'编辑时间安排、优先级和归类', noteOpen:'编辑归类', close:'关闭属性设置', panel:'项目属性' },
    en: { open:'Edit schedule, priority, and classification', noteOpen:'Edit classification', close:'Close item properties', panel:'Item properties' },
    'zh-Hant': { open:'編輯時間安排、優先順序和歸類', noteOpen:'編輯歸類', close:'關閉屬性設定', panel:'項目屬性' }
  };
  const itemMetaText = () => itemMetaMessages[uiSettings.language] || itemMetaMessages.zh;

  function itemQuickActionsField(item) {
    const actions = item.type === 'todo' ? [
      { action:'toggle-complete', icon:'i-check', label: isTodoComplete(item) ? t('metaReopen') : t('metaMarkComplete') },
      { action:'copy-title', icon:'i-copy', label: t('metaCopyTitle') },
      { action:'copy-content', icon:'i-note', label: t('metaCopyNotes') },
      ...(todoIsScheduled(item) ? [{ action:'view-calendar', icon:'i-calendar', label: t('metaViewCalendar') }] : []),
      { action:'trash', icon:'i-trash', label: t('metaTrash'), danger:true }
    ] : [
      { action:'copy-title', icon:'i-copy', label: t('metaCopyTitle') },
      { action:'copy-content', icon:'i-note', label: t('metaCopyBody') },
      { action:'copy-markdown', icon:'i-markdown', label: t('metaCopyMarkdown') },
      { action:'trash', icon:'i-trash', label: t('metaTrash'), danger:true }
    ];
    return `<div class="meta-field quick-actions-field">
      <div class="meta-field-heading"><label><svg><use href="#i-spark"/></svg>${escapeHTML(t('metaQuickActions'))}</label></div>
      <div class="meta-quick-actions">
        ${actions.map(action => `<button type="button" data-meta-action="${action.action}" class="${action.danger ? 'is-danger' : ''}"><svg><use href="#${action.icon}"/></svg><span>${escapeHTML(action.label)}</span></button>`).join('')}
      </div>
    </div>`;
  }

  function itemMetaPopover(item) {
    const copy = itemMetaText();
    if (item.type === 'note') {
      return `<div class="item-meta-popover note-meta-popover" id="itemMetaPopover" role="group" aria-label="${escapeHTML(copy.panel)}" hidden>${itemQuickActionsField(item)}${classificationField(item)}</div>`;
    }
    const metaCopy = todoMetaText();
    const startLabel = item.startAt ? formatDateTimeSeconds(item.startAt) : metaCopy.notSet;
    const dueLabel = item.dueAt ? formatDateTimeSeconds(item.dueAt) : metaCopy.notSet;
    const scheduleIncomplete = !item.startAt || !item.dueAt;
    return `<div class="item-meta-popover todo-meta-grid" id="itemMetaPopover" role="group" aria-label="${escapeHTML(copy.panel)}" hidden>
      <div class="meta-field schedule-field">
        <div class="meta-field-heading">
          <label><svg><use href="#i-calendar"/></svg>${escapeHTML(metaCopy.schedule)}</label>
          <span class="meta-field-actions">
            <button class="meta-edit-button" id="editSchedule" type="button"><svg><use href="#i-edit"/></svg><span>${escapeHTML(metaCopy.edit)}</span></button>
            <button class="meta-confirm-button" id="confirmSchedule" type="button" title="${escapeHTML(metaCopy.confirm)}" aria-label="${escapeHTML(metaCopy.confirm)}" hidden><svg><use href="#i-check"/></svg></button>
          </span>
        </div>
        <div class="schedule-created-row">
          <span><b>${escapeHTML(metaCopy.created)}</b><time id="todoCreatedAt" datetime="${escapeHTML(item.createdAt)}">${escapeHTML(formatDateTimeSeconds(item.createdAt))}</time></span>
          <small>${escapeHTML(metaCopy.immutable)}</small>
        </div>
        <div class="schedule-display" id="scheduleDisplay">
          <span ${item.startAt ? '' : 'hidden'}><b>${escapeHTML(metaCopy.start)}</b><time id="scheduleStartValue" datetime="${escapeHTML(item.startAt || '')}">${escapeHTML(startLabel)}</time></span>
          <span ${item.dueAt ? '' : 'hidden'}><b>${escapeHTML(metaCopy.due)}</b><time id="scheduleDueValue" datetime="${escapeHTML(item.dueAt || '')}">${escapeHTML(dueLabel)}</time></span>
        </div>
        <div class="schedule-editor" id="scheduleEditor" hidden>
          <div class="schedule-editor-row"><label for="todoStartAt">${escapeHTML(metaCopy.start)}</label><button id="clearTodoStartAt" type="button">${escapeHTML(metaCopy.clear)}</button><input id="todoStartAt" type="datetime-local" step="1" value="${escapeHTML(dateTimeLocalValue(item.startAt))}" /></div>
          <div class="schedule-editor-row"><label for="todoDueAt">${escapeHTML(metaCopy.due)}</label><button id="clearTodoDueAt" type="button">${escapeHTML(metaCopy.clear)}</button><input id="todoDueAt" type="datetime-local" step="1" value="${escapeHTML(dateTimeLocalValue(item.dueAt))}" /></div>
        </div>
        <p class="schedule-warning" id="scheduleWarning" ${scheduleIncomplete ? '' : 'hidden'}>${escapeHTML(metaCopy.calendarHidden)}</p>
        <p class="meta-error" id="scheduleError" hidden>${escapeHTML(metaCopy.invalid)}</p>
      </div>
      <div class="meta-field priority-field"><label><svg><use href="#i-spark"/></svg>${t('priority')}</label><div class="priority-options">
        ${['high','medium','low'].map(value => `<button type="button" data-priority="${value}" class="${item.priority === value ? 'active' : ''}">${t(value)}</button>`).join('')}
      </div></div>
      ${classificationField(item)}
      ${itemQuickActionsField(item)}
    </div>`;
  }

  const rendererEditorTop = editorTop;
  editorTop = function editorTopWithItemMeta(item) {
    const copy = itemMetaText();
    const openLabel = item.type === 'todo' ? copy.open : copy.noteOpen;
    let top = rendererEditorTop(item).replace(/<button title="[^"]*"><svg><use href="#i-more"\/><\/svg><\/button>/, `<button id="itemMetaButton" type="button" title="${escapeHTML(openLabel)}" aria-label="${escapeHTML(openLabel)}" aria-controls="itemMetaPopover" aria-expanded="false"><svg><use href="#i-more"/></svg></button>`);
    if (item.type === 'note') {
      const exportStart = top.indexOf('<button id="exportNote"');
      const exportEnd = exportStart < 0 ? -1 : top.indexOf('</button>', exportStart) + '</button>'.length;
      if (exportEnd > 0) {
        const focusAction = `<button id="focusNoteEditor" type="button" title="${escapeHTML(t('focusMode'))}" aria-label="${escapeHTML(t('focusMode'))}" aria-pressed="false"><svg><use href="#i-focus"/></svg></button>`;
        top = `${top.slice(0, exportEnd)}${focusAction}${top.slice(exportEnd)}`;
      }
    }
    const closingIndex = top.lastIndexOf('</div>');
    if (closingIndex < 0) return top;
    return `${top.slice(0, closingIndex)}${itemMetaPopover(item)}${top.slice(closingIndex)}`;
  };

  noteEditor = function noteEditorWithMetaMenu(item) {
    const text = stripHTML(item.body);
    const toolButton = (attributes, icon, label, className = '') => `<button type="button"${className ? ` class="${className}"` : ''} ${attributes} title="${escapeHTML(label)}" aria-label="${escapeHTML(label)}"><svg><use href="#${icon}"/></svg><span class="note-tool-label">${escapeHTML(label)}</span></button>`;
    const toolbar = `<div class="note-toolbar" data-toolbar-position="${escapeHTML(uiSettings.noteToolbarPosition)}" aria-label="${t('format')}">
      <select class="note-block-format" id="noteBlockFormat" title="${t('paragraph')}" aria-label="${t('paragraph')}"><option value="p">${t('paragraph')}</option><option value="h1">${t('heading1')}</option><option value="h2">${t('heading2')}</option><option value="h3">${t('heading3')}</option></select>
      ${toolButton('data-command="bold"', 'i-bold', t('bold'))}
      ${toolButton('data-command="italic"', 'i-italic', t('italic'))}
      ${toolButton('data-command="strikeThrough"', 'i-strike', t('strike'))}
      ${toolButton('data-note-action="highlight"', 'i-highlight', t('highlight'))}
      ${toolButton('data-note-action="inline-code"', 'i-code', t('inlineCode'))}
      <span class="toolbar-divider"></span>
      ${toolButton('data-command="insertUnorderedList"', 'i-list', t('bulletList'))}
      ${toolButton('data-command="insertOrderedList"', 'i-ordered-list', t('numberedList'))}
      ${toolButton('data-note-action="task-list"', 'i-task-list', t('taskList'))}
      ${toolButton('data-command="formatBlock" data-value="blockquote"', 'i-quote', t('quote'))}
      ${toolButton('data-command="formatBlock" data-value="pre"', 'i-code-block', t('codeBlock'))}
      ${toolButton('data-command="insertHorizontalRule"', 'i-divider', t('horizontalRule'))}
      <span class="toolbar-divider"></span>
      ${toolButton('data-note-action="link"', 'i-link', t('link'))}
      ${toolButton('data-command="unlink"', 'i-unlink', t('unlink'))}
      <span class="toolbar-divider"></span>
      ${toolButton('data-command="undo"', 'i-undo', t('undo'))}
      ${toolButton('data-command="redo"', 'i-redo', t('redo'))}
      ${toolButton('data-note-action="toggle-markdown"', 'i-markdown', t('markdownSource'), 'markdown-mode-toggle')}
    </div>`;
    const toolbarAtTop = uiSettings.noteToolbarPosition === 'top';
    return `<article class="editor-wrap note-editor" data-editor-id="${escapeHTML(item.id)}">
      <header class="note-focus-header">
        <span class="note-focus-mark"><svg><use id="noteFocusModeIcon" href="#i-note"/></svg></span>
        <span><small id="noteFocusModeLabel">${escapeHTML(t('richText'))}</small><strong id="noteFocusTitle">${escapeHTML(item.title || t('untitledNote'))}</strong><time id="noteFocusUpdatedAt" datetime="${escapeHTML(item.updatedAt)}"><svg><use href="#i-clock"/></svg>${escapeHTML(t('modified'))} ${escapeHTML(formatDateTimeSeconds(item.updatedAt))}</time></span>
        <button id="exitFocusNoteEditor" type="button" title="${escapeHTML(t('focusModeExit'))}" aria-label="${escapeHTML(t('focusModeExit'))}"><svg><use href="#i-focus-exit"/></svg><span>${escapeHTML(t('focusModeExit'))}</span></button>
      </header>
      ${editorTop(item)}
      <textarea class="editor-title" id="editorTitle" rows="1" placeholder="${t('untitledNote')}">${escapeHTML(item.title)}</textarea>
      <div class="editor-subline note-date-line">
        <time id="noteCreatedAt" datetime="${escapeHTML(item.createdAt)}"><svg><use href="#i-calendar"/></svg>${t('created')} ${formatDateTimeSeconds(item.createdAt)}</time>
        <time id="noteUpdatedAt" datetime="${escapeHTML(item.updatedAt)}"><svg><use href="#i-clock"/></svg>${t('modified')} ${formatDateTimeSeconds(item.updatedAt)}</time>
      </div>
      ${linkedItemsSection(item)}
      ${toolbarAtTop ? toolbar : ''}
      <div class="note-body" id="noteBody" contenteditable="true" inputmode="text" spellcheck="true" autocapitalize="sentences" data-placeholder="${t('notePlaceholder')}">${item.body || ''}</div>
      <textarea class="note-markdown-source" id="noteMarkdownSource" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="${t('markdownSource')}" hidden></textarea>
      <div class="note-footer"><span id="noteStats">${text.split(/\s+/).filter(Boolean).length} ${t('words')} · ${text.length} ${t('chars')}</span><span id="noteFormatMode">Acta / Markdown-ready</span></div>
      ${toolbarAtTop ? '' : toolbar}
    </article>`;
  };

  // 打卡式待办的日期与连击统计：checkins 以本地日期为键，跨天/时区口径
  // 与 renderer.js 的 todayISO() 一致。streak 从今天（未打卡则从昨天）
  // 起往回数连续打卡的天数。
  const localDateKey = date => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().slice(0, 10);
  };
  const checkinStats = item => {
    const checkins = item.checkins || {};
    const todayKey = localDateKey(new Date());
    let streak = 0;
    const cursor = new Date();
    if (!checkins[todayKey]) cursor.setDate(cursor.getDate() - 1);
    while (checkins[localDateKey(cursor)]) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    const total = Object.keys(checkins).filter(key => checkins[key]).length;
    const week = [];
    for (let index = 6; index >= 0; index -= 1) {
      const day = new Date();
      day.setDate(day.getDate() - index);
      const key = localDateKey(day);
      week.push({ key, day, hit: Boolean(checkins[key]), today: index === 0 });
    }
    return { todayKey, todayDone: Boolean(checkins[todayKey]), streak, total, week };
  };

  todoEditor = function enhancedTodoEditor(item) {
    const tasks = item.tasks || [];
    const completed = tasks.filter(task => task.done).length;
    const progress = tasks.length ? Math.round(completed / tasks.length * 100) : (isTodoComplete(item) ? 100 : 0);
    const metaCopy = todoMetaText();
    const startLabel = item.startAt ? formatDateTimeSeconds(item.startAt) : metaCopy.notSet;
    const dueLabel = item.dueAt ? formatDateTimeSeconds(item.dueAt) : metaCopy.notSet;
    const ordered = item.taskOrder === 'ordered';
    // 无序模式把已完成子任务沉到列表末尾的折叠分组里（taskRowHTML 同时
    // 服务活跃区与该分组）；有序模式保持编号原位布局不变。分组内按完成
    // 时间排序，方向由设置（subtaskDoneSort）控制，分组头最右侧可切换。
    const doneTasks = tasks.filter(task => task.done);
    const doneDirection = uiSettings.subtaskDoneSort === 'desc' ? -1 : 1;
    const sortedDoneTasks = [...doneTasks].sort((a, b) =>
      String(a.completedAt || '').localeCompare(String(b.completedAt || '')) * doneDirection);
    const taskRowHTML = (task, index) => `<div class="task-row${ordered ? ' is-ordered' : ''} ${task.done ? 'done' : ''}" data-task-id="${escapeHTML(task.id)}" style="animation-delay:${index * 35}ms">
          <i class="task-done-date"${task.done && task.completedAt && uiSettings.subtaskCompletedDates !== false ? ` data-time="${escapeHTML(task.completedAt)}">${escapeHTML(formatMonthDay(task.completedAt))}</i>` : ' aria-hidden="true"></i>'}
          ${ordered ? `<i class="task-order-index" title="${escapeHTML(t('taskDragHint'))}" aria-hidden="true">${index + 1}</i>` : ''}
          <button class="task-check"><svg><use href="#i-check"/></svg></button>
          <div class="task-text" contenteditable="true" inputmode="text" spellcheck="true" autocapitalize="sentences" data-placeholder="${t('taskPlaceholder')}">${escapeHTML(task.text)}</div>
          ${ordered ? `<span class="task-move"><button class="move-task-up" type="button" title="${escapeHTML(t('taskMoveUp'))}" aria-label="${escapeHTML(t('taskMoveUp'))}"><svg><use href="#i-chevron"/></svg></button><button class="move-task-down" type="button" title="${escapeHTML(t('taskMoveDown'))}" aria-label="${escapeHTML(t('taskMoveDown'))}"><svg><use href="#i-chevron"/></svg></button></span>` : ''}
          <span class="remove-task-zone">
            <button class="remove-task" type="button"><svg><use href="#i-close"/></svg></button>
            <span class="remove-task-confirm" hidden>
              <button class="confirm-remove-task" type="button" title="${escapeHTML(t('confirm'))}" aria-label="${escapeHTML(t('confirm'))}"><svg><use href="#i-check"/></svg></button>
              <button class="cancel-remove-task" type="button" title="${escapeHTML(t('cancel'))}" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button>
            </span>
          </span>
        </div>`;
    if (item.checkin) {
      const stats = checkinStats(item);
      return `<article class="editor-wrap todo-editor checkin-editor" data-editor-id="${escapeHTML(item.id)}">
      ${editorTop(item)}
      <textarea class="editor-title" id="editorTitle" rows="1" placeholder="${t('untitledTodo')}">${escapeHTML(item.title)}</textarea>
      <div class="editor-subline todo-time-line" aria-label="${escapeHTML(metaCopy.schedule)}">
        <time id="todoCreatedAtSummary" datetime="${escapeHTML(item.createdAt)}"><svg><use href="#i-calendar"/></svg><b>${escapeHTML(metaCopy.created)}</b><span>${escapeHTML(formatDateTimeSeconds(item.createdAt))}</span></time>
        <time id="todoStartAtSummary" datetime="${escapeHTML(item.startAt || '')}" ${item.startAt ? '' : 'hidden'}><svg><use href="#i-clock"/></svg><b>${escapeHTML(metaCopy.start)}</b><span>${escapeHTML(startLabel)}</span></time>
        <time id="todoDueAtSummary" datetime="${escapeHTML(item.dueAt || '')}" ${item.dueAt ? '' : 'hidden'}><svg><use href="#i-clock"/></svg><b>${escapeHTML(metaCopy.due)}</b><span>${escapeHTML(dueLabel)}</span></time>
        <button class="checkin-schedule-edit" id="checkinScheduleEdit" type="button" title="${escapeHTML(metaCopy.edit)}" aria-label="${escapeHTML(metaCopy.edit)}"><svg><use href="#i-edit"/></svg><span>${escapeHTML(item.startAt && item.dueAt ? metaCopy.edit : metaCopy.schedule)}</span></button>
      </div>
      ${linkedItemsSection(item)}
      <section class="checkin-section" aria-label="${escapeHTML(t('checkinTodo'))}">
        <div class="checkin-main">
          <button class="checkin-button${stats.todayDone ? ' done' : ''}" id="checkinToggle" type="button" aria-pressed="${stats.todayDone}" title="${stats.todayDone ? escapeHTML(t('checkinUndo')) : escapeHTML(t('checkinToday'))}"><svg><use href="#i-check"/></svg></button>
          <div class="checkin-summary">
            <b>${escapeHTML(stats.todayDone ? t('checkinDone') : t('checkinTodoYet'))}</b>
            <span>${escapeHTML(t('checkinStreak'))} <em>${stats.streak}</em> ${escapeHTML(t('checkinDays'))} · ${escapeHTML(t('checkinTotal'))} ${stats.total} ${escapeHTML(t('checkinDays'))}</span>
          </div>
        </div>
        <div class="checkin-week" role="img" aria-label="${escapeHTML(t('checkinRecent'))}">
          ${stats.week.map(entry => `<i class="${entry.hit ? 'hit' : ''}${entry.today ? ' today' : ''}" title="${escapeHTML(entry.key)}">${entry.day.getDate()}</i>`).join('')}
        </div>
      </section>
      <section class="note-block"><h2>${t('description')}</h2><div class="todo-notes" id="todoNotes" contenteditable="true" inputmode="text" spellcheck="true" autocapitalize="sentences" data-placeholder="${t('descriptionPlaceholder')}">${escapeHTML(item.notes || '').replace(/\n/g, '<br>')}</div></section>
    </article>`;
    }
    return `<article class="editor-wrap todo-editor${ordered ? ' ordered-tasks' : ''}" data-editor-id="${escapeHTML(item.id)}">
      ${editorTop(item)}
      <textarea class="editor-title" id="editorTitle" rows="1" placeholder="${t('untitledTodo')}">${escapeHTML(item.title)}</textarea>
      <div class="editor-subline todo-time-line" aria-label="${escapeHTML(metaCopy.schedule)}">
        <time id="todoCreatedAtSummary" datetime="${escapeHTML(item.createdAt)}"><svg><use href="#i-calendar"/></svg><b>${escapeHTML(metaCopy.created)}</b><span>${escapeHTML(formatDateTimeSeconds(item.createdAt))}</span></time>
        <time id="todoStartAtSummary" datetime="${escapeHTML(item.startAt || '')}" ${item.startAt ? '' : 'hidden'}><svg><use href="#i-clock"/></svg><b>${escapeHTML(metaCopy.start)}</b><span>${escapeHTML(startLabel)}</span></time>
        <time id="todoDueAtSummary" datetime="${escapeHTML(item.dueAt || '')}" ${item.dueAt ? '' : 'hidden'}><svg><use href="#i-clock"/></svg><b>${escapeHTML(metaCopy.due)}</b><span>${escapeHTML(dueLabel)}</span></time>
      </div>
      ${linkedItemsSection(item)}
      <div class="progress-head"><h2>${t('progress')}</h2><span>${completed} / ${tasks.length} · ${progress}% ${t('done')}</span><span class="task-head-tools"><button class="task-tool-button" id="exportTasks" type="button" title="${escapeHTML(t('exportTasks'))}" aria-label="${escapeHTML(t('exportTasks'))}"><svg><use href="#i-upload"/></svg></button><button class="task-tool-button" id="bulkAddTask" type="button" title="${escapeHTML(t('bulkAddTask'))}" aria-label="${escapeHTML(t('bulkAddTask'))}"><svg><use href="#i-lightning"/></svg></button><button class="task-order-toggle${ordered ? ' active' : ''}" id="taskOrderToggle" type="button" aria-pressed="${ordered}" title="${escapeHTML(t('taskOrderHint'))}" aria-label="${escapeHTML(t('taskOrderHint'))}"><svg><use href="#i-ordered-list"/></svg></button></span></div>
      <div class="progress-track"><i style="width:${progress}%"></i></div>
      <div class="task-list" id="taskList">
        ${ordered
          ? tasks.map((task, index) => taskRowHTML(task, index)).join('')
          : tasks.filter(task => !task.done).map((task, index) => taskRowHTML(task, index)).join('')
            + (doneTasks.length ? `<div class="task-done-section" id="taskDoneSection">
          <div class="task-done-head">
            <button type="button" class="task-done-toggle" id="taskDoneToggle" aria-expanded="false" title="${escapeHTML(t('done'))}"><svg aria-hidden="true"><use href="#i-chevron"/></svg><span>${escapeHTML(t('done'))} ${doneTasks.length}</span></button>
            <button type="button" class="task-done-sort${doneDirection < 0 ? ' is-desc' : ''}" id="taskDoneSort" aria-pressed="${doneDirection < 0}" title="${escapeHTML(t('taskDoneSortHint'))}" aria-label="${escapeHTML(t('taskDoneSortHint'))}"><svg aria-hidden="true"><use href="#i-sort"/></svg></button>
          </div>
          <div class="task-done-group" id="taskDoneGroup" hidden>${sortedDoneTasks.map((task, index) => taskRowHTML(task, index)).join('')}</div>
        </div>` : '')}
      </div>
      <button class="add-task" id="addTask"><span><svg><use href="#i-plus"/></svg></span>${t('addTask')}</button>
      <section class="note-block"><h2>${t('description')}</h2><div class="todo-notes" id="todoNotes" contenteditable="true" inputmode="text" spellcheck="true" autocapitalize="sentences" data-placeholder="${t('descriptionPlaceholder')}">${escapeHTML(item.notes || '').replace(/\n/g, '<br>')}</div></section>
    </article>`;
  };

  bindTodoEditor = function bindEnhancedTodoEditor(item) {
    const editSchedule = byId('editSchedule');
    const confirmSchedule = byId('confirmSchedule');
    const scheduleDisplay = byId('scheduleDisplay');
    const scheduleEditor = byId('scheduleEditor');
    const scheduleError = byId('scheduleError');
    const scheduleWarning = byId('scheduleWarning');
    const startInput = byId('todoStartAt');
    const dueInput = byId('todoDueAt');
    const metaCopy = todoMetaText();

    const syncScheduleWarning = () => {
      scheduleWarning.hidden = Boolean(startInput.value && dueInput.value);
      dueInput.min = startInput.value || '';
    };
    const setScheduleEditing = editing => {
      editSchedule.hidden = editing;
      confirmSchedule.hidden = !editing;
      scheduleDisplay.hidden = editing;
      scheduleEditor.hidden = !editing;
      scheduleError.hidden = true;
      editSchedule.setAttribute('aria-expanded', String(editing));
      if (editing) requestAnimationFrame(() => startInput.focus());
    };

    editSchedule.addEventListener('click', () => {
      startInput.value = dateTimeLocalValue(item.startAt);
      dueInput.value = dateTimeLocalValue(item.dueAt);
      syncScheduleWarning();
      setScheduleEditing(true);
    });

    const clearScheduleInput = input => {
      input.value = '';
      scheduleError.hidden = true;
      syncScheduleWarning();
      input.focus();
    };
    byId('clearTodoStartAt').addEventListener('click', () => clearScheduleInput(startInput));
    byId('clearTodoDueAt').addEventListener('click', () => clearScheduleInput(dueInput));
    [startInput, dueInput].forEach(input => input.addEventListener('input', () => {
      scheduleError.hidden = true;
      syncScheduleWarning();
    }));

    confirmSchedule.addEventListener('click', () => {
      const nextStartAt = dateTimeLocalISO(startInput.value);
      const nextDueAt = dateTimeLocalISO(dueInput.value);
      if ((startInput.value && !nextStartAt) || (dueInput.value && !nextDueAt) || (nextStartAt && nextDueAt && nextDueAt <= nextStartAt)) {
        scheduleError.hidden = false;
        return;
      }
      item.startAt = nextStartAt;
      item.dueAt = nextDueAt;
      delete item.due;
      delete item.dueTime;
      delete item.durationMinutes;
      const startValue = byId('scheduleStartValue');
      const dueValue = byId('scheduleDueValue');
      const syncDisplayValue = (timeEl, value) => {
        if (!timeEl) return;
        timeEl.dateTime = value || '';
        timeEl.textContent = value ? formatDateTimeSeconds(value) : metaCopy.notSet;
        timeEl.parentElement?.toggleAttribute('hidden', !value);
      };
      syncDisplayValue(startValue, item.startAt);
      syncDisplayValue(dueValue, item.dueAt);
      const syncSummaryTime = (id, value) => {
        const summary = byId(id);
        if (!summary) return;
        summary.dateTime = value || '';
        summary.querySelector('span').textContent = value ? formatDateTimeSeconds(value) : metaCopy.notSet;
        summary.toggleAttribute('hidden', !value);
      };
      syncSummaryTime('todoStartAtSummary', item.startAt);
      syncSummaryTime('todoDueAtSummary', item.dueAt);
      scheduleWarning.hidden = Boolean(item.startAt && item.dueAt);
      touchItem(item);
      renderList();
      renderSidebar();
      setScheduleEditing(false);
    });

    [startInput, dueInput].forEach(input => input.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); confirmSchedule.click(); }
      if (event.key === 'Escape') { event.preventDefault(); setScheduleEditing(false); }
    }));

    $$('.priority-options button').forEach(button => button.addEventListener('click', () => {
      item.priority = button.dataset.priority;
      touchItem(item);
      $$('.priority-options button').forEach(entry => entry.classList.toggle('active', entry === button));
      renderList();
    }));

    if (item.checkin) {
      byId('checkinScheduleEdit').addEventListener('click', event => {
        // 阻止本次点击继续冒泡：document 上的「面板外点击」监听会把
        // 刚由 metaButton.click() 打开的属性面板立即误判关闭。
        event.stopPropagation();
        const metaButton = byId('itemMetaButton');
        if (metaButton && !metaButton.classList.contains('is-open')) metaButton.click();
      });
      byId('checkinToggle').addEventListener('click', event => {
        const button = event.currentTarget;
        const checkins = item.checkins || (item.checkins = {});
        const undo = Boolean(checkins[localDateKey(new Date())]);
        const snapshotBefore = JSON.parse(JSON.stringify(item));
        if (undo) delete checkins[localDateKey(new Date())];
        else checkins[localDateKey(new Date())] = true;
        logHistory(undo ? 'checkin-undo' : 'checkin', item.title || t('checkinTodo'), item.id, snapshotBefore);
        touchItem(item);
        showTodoBurst(button, undo);
        renderEditor(); renderList();
      });
    } else {
      const ordered = item.taskOrder === 'ordered';
      const moveTask = (taskId, direction) => {
        const index = item.tasks.findIndex(entry => entry.id === taskId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= item.tasks.length) return;
        const [entry] = item.tasks.splice(index, 1);
        item.tasks.splice(target, 0, entry);
        touchItem(item);
        renderEditor(); renderList();
        const rows = $$('.task-row');
        rows[target]?.classList.add('is-new');
      };
      byId('taskOrderToggle').addEventListener('click', () => {
        item.taskOrder = ordered ? 'unordered' : 'ordered';
        touchItem(item);
        renderEditor(); renderList();
      });
      // —— 子待办之间的键盘导航 ——
      // ↑/↓ 在子待办行之间移动焦点，落点光标停在文本末尾。多行子任务
      // （Shift+Enter 换行）内仍先用方向键在行内移动，只有光标已到达
      // 第一行/最后一行才跳出行——键盘顺序与视觉顺序一致，不跳过折叠组。
      const caretOnEdgeLine = (element, edge) => {
        if (!element.textContent) return true; // 空行视为首末行，可直接跳出。
        const selection = getSelection();
        if (!selection || !selection.rangeCount) return true;
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        const rects = range.getClientRects();
        if (!rects.length) return true;
        const caret = rects[0];
        const textRect = element.getBoundingClientRect();
        const lineHeight = caret.height || parseFloat(getComputedStyle(element).lineHeight) || 16;
        return edge === 'first'
          ? caret.top - textRect.top < lineHeight * 0.6
          : textRect.bottom - caret.bottom < lineHeight * 0.6;
      };
      const moveTaskFocus = (currentRow, step, event) => {
        const rows = $$('.task-row');
        const target = rows[rows.indexOf(currentRow) + step];
        const targetText = target ? $('.task-text', target) : null;
        if (!targetText) return false;
        targetText.focus();
        const range = document.createRange();
        range.selectNodeContents(targetText);
        range.collapse(false); // 光标定位到待办的最后一个字符之后。
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        event.preventDefault();
        return true;
      };
      const taskRows = $$('.task-row');
      taskRows.forEach(row => {
        const task = item.tasks.find(entry => entry.id === row.dataset.taskId);
        $('.task-check', row).addEventListener('click', () => {
          const snapshotBefore = JSON.parse(JSON.stringify(item));
          task.done = !task.done;
          if (task.done) task.completedAt = new Date().toISOString();
          else delete task.completedAt;
          // 有序模式勾选某一步：此前所有未勾选的步骤一并完成（各记各自
          // 的完成时刻），已勾选的保持原样不覆写；撤回只撤当前这一步。
          if (ordered && task.done) {
            const taskIndex = item.tasks.indexOf(task);
            item.tasks.forEach((entry, entryIndex) => {
              if (entryIndex >= taskIndex || entry.done) return;
              entry.done = true;
              entry.completedAt = new Date().toISOString();
              logHistory('subtask-completed', item.title || t('untitledTodo'), item.id, snapshotBefore);
              const earlierRow = taskRows[entryIndex];
              earlierRow?.classList.add('done');
              const earlierDate = earlierRow?.querySelector('.task-done-date');
              if (earlierDate) {
                earlierDate.dataset.time = entry.completedAt;
                earlierDate.textContent = formatMonthDay(entry.completedAt);
              }
            });
          }
          item.completed = (item.tasks || []).length > 0 && item.tasks.every(entry => entry.done);
          // 勾选/撤回的过渡完全交给 CSS（grid 模板平移、日期淡入、勾选
          // 弹出）：不重建编辑器，快速撤回时过渡从当前插值状态连续反向，
          // 而不是被重建瞬跳到终态。进度数字、进度条与列表卡片就地更新。
          row.classList.toggle('done', task.done);
          // 就地同步日期元素：勾选时写入 mm/dd 与原始时刻（编辑器不再
          // 重建，模板不会重渲染，必须在展开的占位列里填上内容）；撤回
          // 时保留文本，让它随列收合与透明度一起淡出即可。
          const dateEl = row.querySelector('.task-done-date');
          if (dateEl && task.done && task.completedAt && uiSettings.subtaskCompletedDates !== false) {
            dateEl.dataset.time = task.completedAt;
            dateEl.textContent = formatMonthDay(task.completedAt);
          }
          if (task.done) logHistory('subtask-completed', item.title || t('untitledTodo'), item.id, snapshotBefore);
          else logHistory('subtask-reopened', item.title || t('untitledTodo'), item.id, snapshotBefore);
          row.classList.remove('task-toggle-motion');
          requestAnimationFrame(() => row.classList.add('task-toggle-motion'));
          touchItem(item);
          const editor = document.querySelector(`.editor-wrap[data-editor-id="${CSS.escape(item.id)}"]`);
          const tasks = item.tasks || [];
          const doneCount = tasks.filter(entry => entry.done).length;
          const progress = tasks.length ? Math.round(doneCount / tasks.length * 100) : (item.completed ? 100 : 0);
          const progressLabel = editor?.querySelector('.progress-head span');
          if (progressLabel) progressLabel.textContent = `${doneCount} / ${tasks.length} · ${progress}% ${t('done')}`;
          const progressBar = editor?.querySelector('.progress-track i');
          if (progressBar) progressBar.style.width = `${progress}%`;
          // 撤回时取消在飞的置底淡出/滑入，避免 fill 透明度把行钉在隐形态。
          if (!task.done && row.__fadeAnimation) { row.__fadeAnimation.cancel(); row.__fadeAnimation = null; }
          // 「已完成 N」计数在勾选瞬间就同步（移入折叠分组是延迟后的
          // 观感收尾，计数不必等它）。
          const doneSectionNow = byId('taskDoneSection');
          const toggleNow = byId('taskDoneToggle');
          if (doneSectionNow && toggleNow) {
            toggleNow.hidden = doneCount === 0;
            doneSectionNow.hidden = doneCount === 0;
            toggleNow.querySelector('span').textContent = `${t('done')} ${doneCount}`;
          }
          updateCard(item);
          renderList();
          renderSidebar();
          // 无序模式：勾选后行原地停留（与列表的已完成待办共用同一套
          // 延迟偏好），延迟结束按折叠分组的状态收尾——分组展开时完成行
          // 与上方腾位的行从原位 FLIP 滑入，分组折叠时行淡出后移入；撤回
          // 时移出分组并复位在飞动画。移动的是同一节点，事件绑定保持有效。
          // 快速连点以最后一次状态为准；首次完成时分组尚未渲染，淡出后
          // 重建编辑器生成折叠分组（重建会把完成行归位，无需逐行搬移）。
          if (!ordered) {
            clearTimeout(row.__taskMoveTimer);
            const animateSink = uiSettings.completedTodoSink !== false && !reduceWindowMotion();
            const sinkDelay = animateSink ? Math.round((Number(uiSettings.completedTodoSinkDelay) || 1) * 1000) : 620;
            const fadeRowOut = () => {
              row.__fadeAnimation = row.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' });
            };
            const syncToggleCount = () => {
              const sectionNow = byId('taskDoneSection');
              const toggleNow = byId('taskDoneToggle');
              if (!sectionNow || !toggleNow) return;
              const doneCountNow = item.tasks.filter(entry => entry.done).length;
              toggleNow.hidden = doneCountNow === 0;
              sectionNow.hidden = doneCountNow === 0;
              toggleNow.querySelector('span').textContent = `${t('done')} ${doneCountNow}`;
            };
            const moveWithFlip = move => {
              const rows = animateSink ? [...byId('taskList').querySelectorAll('.task-row')] : [];
              const previousRects = new Map(rows.map(entry => [entry, entry.getBoundingClientRect()]));
              move();
              rows.forEach(entry => {
                const previous = previousRects.get(entry);
                if (!previous) return;
                const current = entry.getBoundingClientRect();
                const dx = previous.left - current.left;
                const dy = previous.top - current.top;
                if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;
                try { entry.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: 480, easing: 'cubic-bezier(.16, 1, .3, 1)' }); } catch { /* 动画失败不影响落位 */ }
              });
            };
            row.__taskMoveTimer = setTimeout(() => {
              if (!row.isConnected) return;
              const doneSection = byId('taskDoneSection');
              const doneGroupEl = byId('taskDoneGroup');
              const toggleEl = byId('taskDoneToggle');
              if (task.done && !doneSection) {
                if (!animateSink) { renderEditor(); return; }
                fadeRowOut();
                setTimeout(() => {
                  if (!task.done || !row.isConnected) return;
                  row.__fadeAnimation = null;
                  renderEditor();
                }, 260);
                return;
              }
              if (!doneSection || !doneGroupEl || !toggleEl) return;
              if (task.done) {
                if (doneGroupEl.hidden) {
                  // 折叠态：行淡出后移入分组，其后腾位的行平滑补位，观感
                  // 与列表的收集箱收尾一致。
                  if (!animateSink) {
                    doneGroupEl.appendChild(row);
                    syncToggleCount();
                    return;
                  }
                  fadeRowOut();
                  setTimeout(() => {
                    if (!task.done || !row.isConnected) return;
                    const group = byId('taskDoneGroup');
                    if (!group) return;
                    moveWithFlip(() => group.appendChild(row));
                    row.__fadeAnimation = null;
                    row.getAnimations().forEach(animation => animation.cancel());
                    syncToggleCount();
                  }, 260);
                  return;
                }
                // 展开态：完成行从原位平滑滑入分组，用户展开的状态保持。
                moveWithFlip(() => doneGroupEl.appendChild(row));
                syncToggleCount();
              } else if (doneGroupEl.contains(row)) {
                row.__fadeAnimation = null;
                moveWithFlip(() => doneSection.parentNode.insertBefore(row, doneSection));
                syncToggleCount();
              }
            }, sinkDelay);
          }
        });
        $('.task-text', row).addEventListener('input', event => {
          // innerText (unlike textContent) keeps the line breaks the user
          // typed with Shift+Enter; trailing breaks are editor artifacts.
          task.text = event.target.innerText.replace(/\r/g, '').replace(/\n+$/, '');
          touchItem(item); updateCard(item);
        });
        $('.task-text', row).addEventListener('keydown', event => {
          if (isImeComposing(event)) return;
          // Shift+Enter 在行内换行；Enter 直接新增下一条子任务。
          if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            document.execCommand('insertLineBreak');
            return;
          }
          if (event.key === 'Enter') { event.preventDefault(); addTask(item); return; }
          const textEl = $('.task-text', row);
          if (event.key === 'ArrowUp' && caretOnEdgeLine(textEl, 'first')) moveTaskFocus(row, -1, event);
          else if (event.key === 'ArrowDown' && caretOnEdgeLine(textEl, 'last')) moveTaskFocus(row, 1, event);
        });
        if (ordered) {
          $('.move-task-up', row).addEventListener('click', () => moveTask(task.id, -1));
          $('.move-task-down', row).addEventListener('click', () => moveTask(task.id, 1));
        }
        const zone = $('.remove-task-zone', row);
        const confirmGroup = $('.remove-task-confirm', row);
        // armed 切换同时控制确认组的 hidden 属性（CSS 依赖它隐藏/显示）。
        const setArmed = on => {
          zone.classList.toggle('armed', on);
          if (confirmGroup) confirmGroup.hidden = !on;
        };
        const disarmRow = () => setArmed(false);
        $('.remove-task', row).addEventListener('click', () => {
          // 同一时刻只允许一行处于确认态：展开新确认前复位其他行。
          taskRows.forEach(other => {
            if (other === row) return;
            other.classList.remove('armed');
            const otherGroup = other.querySelector('.remove-task-confirm');
            if (otherGroup) otherGroup.hidden = true;
          });
          setArmed(true);
          $('.confirm-remove-task', row).focus();
        });
        $('.cancel-remove-task', row).addEventListener('click', disarmRow);
        $('.confirm-remove-task', row).addEventListener('click', () => {
          logHistory('subtask-removed', item.title || t('untitledTodo'), item.id, JSON.parse(JSON.stringify(item)));
          item.tasks = item.tasks.filter(entry => entry.id !== task.id);
          item.completed = item.tasks.length > 0 && item.tasks.every(entry => entry.done);
          touchItem(item); renderEditor(); renderList(); renderSidebar();
        });
      });
      // 无序模式的折叠分组开关：默认收起，点击展开/收起已完成子任务。
      const doneToggle = byId('taskDoneToggle');
      const doneGroup = byId('taskDoneGroup');
      doneToggle?.addEventListener('click', () => {
        const open = doneGroup.hidden;
        doneGroup.hidden = !open;
        doneToggle.classList.toggle('is-open', open);
        doneToggle.setAttribute('aria-expanded', String(open));
      });
      // 已完成子任务按完成时间正/倒序切换：仅重排分组内已有节点（不重建
      // 事件绑定），并用 FLIP 动画从原位滑到新位，展开状态保持不变。
      const doneSortButton = byId('taskDoneSort');
      doneSortButton?.addEventListener('click', () => {
        const next = uiSettings.subtaskDoneSort === 'desc' ? 'asc' : 'desc';
        uiSettings.subtaskDoneSort = next;
        saveUISettings();
        doneSortButton.classList.toggle('is-desc', next === 'desc');
        doneSortButton.setAttribute('aria-pressed', String(next === 'desc'));
        if (!doneGroup || doneGroup.hidden) return;
        const direction = next === 'desc' ? -1 : 1;
        const rows = new Map([...doneGroup.children].map(entry => [entry.dataset.taskId, entry]));
        const order = [...(item.tasks || [])].filter(entry => entry.done)
          .sort((a, b) => String(a.completedAt || '').localeCompare(String(b.completedAt || '')) * direction);
        if (!order.length) return;
        const previousRects = new Map([...doneGroup.children].map(entry => [entry, entry.getBoundingClientRect()]));
        order.forEach(entry => { const node = rows.get(entry.id); if (node) doneGroup.appendChild(node); });
        if (!reduceWindowMotion()) {
          [...doneGroup.children].forEach(entry => {
            const previous = previousRects.get(entry);
            if (!previous) return;
            const dy = previous.top - entry.getBoundingClientRect().top;
            if (Math.abs(dy) < 2) return;
            try { entry.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: 420, easing: 'cubic-bezier(.16, 1, .3, 1)' }); } catch { /* 动画失败不影响落位 */ }
          });
        }
      });
      byId('addTask').addEventListener('click', () => addTask(item));
      byId('bulkAddTask')?.addEventListener('click', () => openBulkTaskDialog(item));
      byId('exportTasks')?.addEventListener('click', () => openExportTasksDialog(item));
      if (ordered) {
        // 拖动行首序号快速重排：用 Pointer Events 自实现（WebView2 对
        // 页面内 HTML5 拖放的支持不可靠），按住序号后原行半透明跟随
        // 指针，目标行按中点显示插入指示线，松手落位。capture 保证
        // 指针移出行外仍持续跟踪，touch-action 防止触屏拖动时滚动。
        const taskList = byId('taskList');
        let drag = null;
        const clearDropMarks = () => taskList.querySelectorAll('.task-row').forEach(entry => entry.classList.remove('dragging', 'drop-above', 'drop-below'));
        const settle = event => {
          if (!drag) return;
          const { id, overId, below, row } = drag;
          row.style.transform = '';
          drag = null;
          clearDropMarks();
          if (!overId || overId === id) return;
          const from = item.tasks.findIndex(entry => entry.id === id);
          let to = item.tasks.findIndex(entry => entry.id === overId) + (below ? 1 : 0);
          if (from < 0 || to < 0) return;
          if (from < to) to -= 1;
          const [moved] = item.tasks.splice(from, 1);
          item.tasks.splice(to, 0, moved);
          touchItem(item);
          renderEditor(); renderList();
          $$('.task-row')[to]?.classList.add('is-new');
        };
        taskList.addEventListener('pointerdown', event => {
          const handle = event.target instanceof Element ? event.target.closest('.task-order-index') : null;
          if (!handle || !event.isPrimary) return;
          const row = handle.closest('.task-row');
          if (!row) return;
          event.preventDefault();
          try { handle.setPointerCapture(event.pointerId); } catch { /* 合成事件或指针已释放时静默 */ }
          drag = { id: row.dataset.taskId, row, overId: null, below: false, startY: event.clientY };
          row.classList.add('dragging');
        });
        taskList.addEventListener('pointermove', event => {
          if (!drag) return;
          drag.row.style.transform = `translateY(${event.clientY - drag.startY}px)`;
          const rows = [...taskList.querySelectorAll('.task-row')];
          // 拖动行自身随指针位移（transform 影响其矩形），必须排除，
          // 否则指针永远命中自己、永远无法标记其他行的插入位置。
          const overRow = rows.find(entry => {
            if (entry.dataset.taskId === drag.id) return false;
            const rect = entry.getBoundingClientRect();
            return event.clientY >= rect.top && event.clientY <= rect.bottom;
          });
          rows.forEach(entry => entry.classList.remove('drop-above', 'drop-below'));
          if (!overRow || overRow.dataset.taskId === drag.id) { drag.overId = null; return; }
          const rect = overRow.getBoundingClientRect();
          drag.below = event.clientY >= rect.top + rect.height / 2;
          drag.overId = overRow.dataset.taskId;
          overRow.classList.add(drag.below ? 'drop-below' : 'drop-above');
        });
        taskList.addEventListener('pointerup', settle);
        taskList.addEventListener('pointercancel', settle);
      }
    }
    byId('todoNotes').addEventListener('input', event => {
      // innerText (unlike textContent) keeps the line breaks the user sees, so re-rendering
      // the editor (e.g. after adding a subtask) no longer collapses them.
      item.notes = event.target.innerText.replace(/\r/g, '').replace(/\n+$/, '');
      touchItem(item);
      updateCard(item);
    });
  };

  const rendererBindEditor = bindEditor;
  bindEditor = function bindSelectableClassification(item) {
    rendererBindEditor(item);
  };

  // 新建子待办的入场动效：addTask 会整体重建编辑器，其余行被
  // acta-steady 抑制重放，这里单独给新行叠加一次滑入加高亮的入场
  // 动画；顺序模式下的移动复用同一动画落位。新行按 addTask 返回的
  // id 定位——无序模式底部还有折叠分组，取最后一行会命中已完成行。
  const rendererAddTask = addTask;
  addTask = function addTaskWithMotion(item) {
    const snapshotBefore = JSON.parse(JSON.stringify(item));
    const taskId = rendererAddTask(item);
    logHistory('subtask-added', item.title || t('untitledTodo'), item.id, snapshotBefore);
    const row = typeof taskId === 'string'
      ? document.querySelector(`.task-row[data-task-id="${CSS.escape(taskId)}"]`)
      : $$('.task-row').at(-1);
    if (!row) return;
    row.classList.add('is-new');
    row.addEventListener('animationend', () => row.classList.remove('is-new'), { once: true });
  };

  // —— 子任务批量添加与导出 ——
  // 两个轻量对话框复用 relation-dialog 的骨架，动态创建、用完即毁。
  // 批量添加把非空行逐条转为子任务追加到列表尾部，记为一次撤销历史；
  // 新行复用 is-new 入场动画并按行级联延迟。
  const parseTaskLines = value => String(value || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);

  const openBulkTaskDialog = item => {
    document.querySelector('.bulk-task-dialog')?.remove();
    const dialog = document.createElement('dialog');
    dialog.className = 'relation-dialog bulk-task-dialog';
    dialog.innerHTML = `
      <header class="relation-dialog-head"><span><svg><use href="#i-lightning"/></svg></span><h3>${escapeHTML(t('bulkAddTask'))}</h3><button class="relation-dialog-close" type="button" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></header>
      <form class="relation-dialog-body" method="dialog" novalidate>
        <p class="bulk-task-hint">${escapeHTML(t('bulkAddTaskHint'))}</p>
        <textarea class="bulk-task-input" rows="7" placeholder="${escapeHTML(t('bulkAddPlaceholder'))}"></textarea>
        <div class="settings-actions">
          <button type="button" class="settings-button secondary" data-bulk-cancel>${escapeHTML(t('cancel'))}</button>
          <button type="submit" class="settings-button" data-bulk-submit disabled><svg><use href="#i-plus"/></svg><span>${escapeHTML(t('bulkAddTask'))}</span></button>
        </div>
      </form>`;
    const form = dialog.querySelector('form');
    const textarea = dialog.querySelector('.bulk-task-input');
    const submit = dialog.querySelector('[data-bulk-submit]');
    const syncSubmit = () => {
      const count = parseTaskLines(textarea.value).length;
      submit.disabled = count === 0;
      submit.querySelector('span').textContent = count ? uiText('bulkAddConfirm', count) : t('bulkAddTask');
    };
    const finish = () => { if (dialog.open) dialog.close(); dialog.remove(); };
    dialog.querySelector('[data-bulk-cancel]').addEventListener('click', finish);
    dialog.querySelector('.relation-dialog-close').addEventListener('click', finish);
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(); });
    textarea.addEventListener('input', syncSubmit);
    textarea.addEventListener('keydown', event => {
      if (isImeComposing(event)) return;
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); form.requestSubmit(); }
    });
    dialog.addEventListener('submit', event => {
      event.preventDefault();
      const lines = parseTaskLines(textarea.value);
      if (!lines.length) return;
      const snapshotBefore = JSON.parse(JSON.stringify(item));
      const newIds = lines.map(line => {
        const task = { id: uid(), text: line, done: false };
        item.tasks.push(task);
        return task.id;
      });
      item.completed = item.tasks.length > 0 && item.tasks.every(entry => entry.done);
      touchItem(item);
      logHistory('subtask-added', item.title || t('untitledTodo'), item.id, snapshotBefore);
      renderEditor(); renderList(); renderSidebar();
      newIds.forEach((id, index) => {
        const row = document.querySelector(`.task-row[data-task-id="${CSS.escape(id)}"]`);
        if (!row) return;
        row.style.animationDelay = `${Math.min(index, 12) * 35}ms`;
        row.classList.add('is-new');
        row.addEventListener('animationend', () => { row.classList.remove('is-new'); row.style.animationDelay = ''; }, { once: true });
      });
      finish();
      showToast(uiText('bulkAddDone', lines.length));
    });
    document.body.appendChild(dialog);
    dialog.showModal();
    textarea.focus();
  };

  // 子任务文本可能含 Shift+Enter 换行；导出以「每条一行」为语义，
  // 行内换行折叠为空格，避免破坏纯文本行与 Markdown 列表结构。
  const taskExportText = task => String(task?.text || '').replace(/\s*\r?\n\s*/g, ' ').trim();
  // 中文序号：个位十进制转汉字，支持到 9999 足够覆盖任何待办清单。
  const CN_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const cnNumber = value => {
    if (value <= 0 || value >= 10000) return String(value);
    const units = ['', '十', '百', '千'];
    let result = '';
    let zeroPending = false;
    for (let place = 3; place >= 0; place -= 1) {
      const digit = Math.floor(value / 10 ** place) % 10;
      if (!digit) { zeroPending = result.length > 0; continue; }
      if (zeroPending) result += '零';
      zeroPending = false;
      // 十位上的一：口語習慣「十二」而非「一十二」，其余数位正常展开。
      result += (place === 1 && digit === 1 && !result ? '' : CN_DIGITS[digit]) + units[place];
    }
    return result;
  };
  const exportNumberPrefix = (style, index) => {
    const number = index + 1;
    if (style === 'dot') return `${number}. `;
    if (style === 'dunhao') return `${number}、`;
    if (style === 'cn') return `${cnNumber(number)}、`;
    if (style === 'paren') return `(${number}) `;
    return '';
  };
  const taskExportContent = (item, format, options = {}) => {
    const includeDone = options.includeDone !== false;
    const numbering = options.numbering || 'none';
    const tasks = (item.tasks || []).filter(task => includeDone || !task.done);
    const render = (task, index) => {
      const text = `${exportNumberPrefix(numbering, index)}${taskExportText(task)}`;
      if (format !== 'checklist') return text;
      const mark = task.done ? 'x' : ' ';
      // 有序号时直接用 Markdown 有序列表语法（1. [x] …），无序号保留原任务语法。
      return numbering === 'none' ? `- [${mark}] ${taskExportText(task)}` : `${exportNumberPrefix(numbering, index).trim()} [${mark}] ${taskExportText(task)}`;
    };
    return tasks.map(render).join('\n');
  };
  // 与 note-export 相同的测试钩子：供冒烟/验证脚本检查导出内容。
  window.__actaTasksExportTest = { taskExportContent, cnNumber };

  const exportTasksToFile = async (item, content, extension) => {
    const base = portableFileName(item.title || t('untitledTodo')).replace(/\.md$/i, '');
    try {
      const result = await getNoteFileBridge().exportText(`${base}-subtasks.${extension}`, content);
      if (result) showToast(t('tasksExported'));
    } catch (error) {
      showToast(`${t('exportFailed')}: ${error?.message || error}`);
    }
  };

  const openExportTasksDialog = item => {
    if (!(item.tasks || []).length) { showToast(t('tasksExportEmpty')); return; }
    document.querySelector('.export-tasks-dialog')?.remove();
    const dialog = document.createElement('dialog');
    dialog.className = 'relation-dialog export-tasks-dialog';
    dialog.innerHTML = `
      <header class="relation-dialog-head"><span><svg><use href="#i-upload"/></svg></span><h3>${escapeHTML(t('exportTasks'))}</h3><button class="relation-dialog-close" type="button" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></header>
      <form class="relation-dialog-body" method="dialog" novalidate>
        <p class="bulk-task-hint">${escapeHTML(t('exportTasksHint'))}</p>
        <div class="export-tasks-format" role="radiogroup" aria-label="${escapeHTML(t('exportFormatTitle'))}">
          <label><input type="radio" name="taskExportFormat" value="lines" checked/><span><b>${escapeHTML(t('exportFormatLines'))}</b><small>${escapeHTML(t('exportFormatLinesHint'))}</small></span></label>
          <label><input type="radio" name="taskExportFormat" value="checklist"/><span><b>${escapeHTML(t('exportFormatChecklist'))}</b><small>${escapeHTML(t('exportFormatChecklistHint'))}</small></span></label>
        </div>
        <div class="export-tasks-options">
          <label class="export-tasks-switch" title="${escapeHTML(t('exportIncludeDoneHint'))}"><input type="checkbox" name="taskExportIncludeDone" checked/><span>${escapeHTML(t('exportIncludeDone'))}</span></label>
          <label class="export-tasks-numbering"><span>${escapeHTML(t('exportNumbering'))}</span><select name="taskExportNumbering">
            <option value="none">${escapeHTML(t('exportNumberingNone'))}</option>
            <option value="dot">${escapeHTML(t('exportNumberingDot'))}</option>
            <option value="dunhao">${escapeHTML(t('exportNumberingDunhao'))}</option>
            <option value="cn">${escapeHTML(t('exportNumberingCn'))}</option>
            <option value="paren">${escapeHTML(t('exportNumberingParen'))}</option>
          </select></label>
        </div>
        <div class="settings-actions">
          <button type="button" class="settings-button secondary" data-export-copy><svg><use href="#i-copy"/></svg><span>${escapeHTML(t('exportCopyClipboard'))}</span></button>
          <button type="button" class="settings-button secondary" data-export-txt><span>${escapeHTML(t('exportTasksTxt'))}</span></button>
          <button type="button" class="settings-button" data-export-md><span>${escapeHTML(t('exportTasksMd'))}</span></button>
        </div>
      </form>`;
    const currentFormat = () => dialog.querySelector('input[name="taskExportFormat"]:checked')?.value || 'lines';
    const currentOptions = () => ({
      includeDone: Boolean(dialog.querySelector('input[name="taskExportIncludeDone"]')?.checked),
      numbering: dialog.querySelector('select[name="taskExportNumbering"]')?.value || 'none'
    });
    const finish = () => { if (dialog.open) dialog.close(); dialog.remove(); };
    dialog.querySelector('.relation-dialog-close').addEventListener('click', finish);
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(); });
    dialog.querySelector('[data-export-copy]').addEventListener('click', async () => {
      await contextClipboardWrite(taskExportContent(item, currentFormat(), currentOptions()));
      showToast(t('copied'));
    });
    dialog.querySelector('[data-export-txt]').addEventListener('click', async () => {
      await exportTasksToFile(item, taskExportContent(item, currentFormat(), currentOptions()), 'txt');
      finish();
    });
    dialog.querySelector('[data-export-md]').addEventListener('click', async () => {
      await exportTasksToFile(item, taskExportContent(item, currentFormat(), currentOptions()), 'md');
      finish();
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  };

  // 打卡式待办的卡片预览显示今天的打卡状态与连续天数。
  const rendererItemPreview = itemPreview;
  itemPreview = function checkinAwareItemPreview(item) {
    if (item?.type === 'todo' && item.checkin) {
      const stats = checkinStats(item);
      const status = stats.todayDone ? t('checkinDone') : t('checkinTodoYet');
      return stats.streak ? `${status} · ${t('checkinStreak')} ${stats.streak} ${t('checkinDays')}` : status;
    }
    return rendererItemPreview(item);
  };

  const closeItemMetaPopover = (restoreFocus = false) => {
    const panel = byId('itemMetaPopover');
    const button = byId('itemMetaButton');
    if (!panel || !button || panel.hidden || panel.classList.contains('is-closing')) return;
    button.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    const item = getItem();
    const copy = itemMetaText();
    const label = item?.type === 'todo' ? copy.open : copy.noteOpen;
    button.title = label;
    button.setAttribute('aria-label', label);
    const finish = () => {
      clearTimeout(animatedDialogCloseTimers.get(panel));
      animatedDialogCloseTimers.delete(panel);
      if (panel.isConnected) {
        panel.hidden = true;
        panel.classList.remove('is-closing');
      }
      if (restoreFocus && button.isConnected) button.focus();
    };
    if (reduceWindowMotion()) { finish(); return; }
    panel.classList.add('is-closing');
    animatedDialogCloseTimers.set(panel, setTimeout(finish, 220));
  };

  document.addEventListener('click', event => {
    const button = event.target.closest?.('#itemMetaButton');
    if (button) {
      event.preventDefault();
      const panel = byId('itemMetaPopover');
      if (!panel) return;
      const opening = panel.hidden || panel.classList.contains('is-closing');
      if (opening) {
        clearTimeout(animatedDialogCloseTimers.get(panel));
        animatedDialogCloseTimers.delete(panel);
        panel.classList.remove('is-closing');
        panel.hidden = false;
        button.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        button.title = itemMetaText().close;
        button.setAttribute('aria-label', itemMetaText().close);
      } else closeItemMetaPopover();
      return;
    }
    // 日期时间选择器（.acdt-panel）与自定义下拉（.acx-menu）的弹层挂在
    // 面板外（body/dialog），点击它们属于面板内的选择操作，不应收起面板。
    // 弹层会在 click 处理中同步重建内容（原 target 脱离 DOM，closest 失效），
    // 因此改用事件派发时的传播路径快照 composedPath 判断归属。
    const path = event.composedPath?.();
    const insideSurface = path
      ? path.some(node => node instanceof Element && (node.id === 'itemMetaPopover' || node.classList.contains('acdt-panel') || node.classList.contains('acx-menu')))
      : Boolean(event.target.closest?.('#itemMetaPopover, .acdt-panel, .acx-menu'));
    if (!insideSurface) closeItemMetaPopover();
  });
  document.addEventListener('keydown', event => {
    if (isImeComposing(event)) return;
    if (event.key === 'Escape' && !byId('itemMetaPopover')?.hidden) closeItemMetaPopover(true);
  });

  const copyTextToClipboard = async text => {
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
    } catch { /* Fall through to the execCommand fallback. */ }
    try {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      const ok = document.execCommand('copy');
      helper.remove();
      return ok;
    } catch { return false; }
  };

  document.addEventListener('click', event => {
    const actionButton = event.target.closest?.('[data-meta-action]');
    if (!actionButton) return;
    const item = getItem();
    if (!item || isTrashed(item)) return;
    event.preventDefault();
    closeItemMetaPopover();
    const action = actionButton.dataset.metaAction;
    const copyAndReport = async text => {
      const ok = await copyTextToClipboard(text);
      showToast(ok ? t('copied') : t('copyFailed'));
    };
    if (action === 'toggle-complete') {
      setTodoCompletion(item, !isTodoComplete(item));
      renderAll();
      showToast(isTodoComplete(item) ? t('done') : t('reopenTask'));
      return;
    }
    if (action === 'copy-title') { copyAndReport(item.title || ''); return; }
    if (action === 'copy-content') { copyAndReport(item.type === 'note' ? stripHTML(item.body) : (item.notes || '')); return; }
    if (action === 'copy-markdown') { copyAndReport(item.type === 'note' ? noteHTMLToMarkdown(item.body) : (item.notes || '')); return; }
    if (action === 'view-calendar') {
      calendarCursor = todoStartDate(item) || calendarDate(todayISO());
      currentView = 'calendar';
      calendarMotion = 'enter';
      resetListFilters();
      renderAll();
      return;
    }
    if (action === 'trash') {
      (async () => {
        const choice = await askItemDelete(item);
        if (!choice) return;
        if (choice === 'trash') {
          item.deletedAt = new Date().toISOString();
          unlinkForTrash(item);
          const nextSelection = getVisibleItems().find(entry => entry.id !== item.id) || activeItems()[0];
          selectedId = nextSelection?.id || null;
          persist();
          renderAll();
          return;
        }
        destroyItems([item.id]);
        showToast(t('destroyed'));
      })();
    }
  });

  function syncMergedTodoNavigation() {
    const todoNavigation = document.querySelector('.smart-nav [data-view="todos"]');
    const onTodoView = currentView === 'todos';
    document.body.classList.remove('hide-type-filters');
    document.body.classList.toggle('merged-todo-view', onTodoView);
    if (todoNavigation) todoNavigation.classList.toggle('active', currentView === 'todos');

    document.querySelectorAll('.item-card').forEach(card => {
      if (!card.querySelector('.type-pill.note')) return;
      const tagCount = [...card.querySelectorAll('.card-bottom > span')].find(node => node.querySelector('use[href="#i-tag"]'));
      tagCount?.remove();
    });
  }

  const rendererRenderList = renderList;
  renderList = function renderMergedMobileList() {
    rendererRenderList();
    syncMergedTodoNavigation();
  };

  matchMedia('(max-width: 800px)').addEventListener?.('change', syncMergedTodoNavigation);

  function showSyncNotice(message, state = '', hold = false) {
    const notice = byId('syncNotice');
    clearTimeout(autoSyncNoticeTimer);
    notice.querySelector('span').textContent = message;
    notice.className = `sync-notice show ${state}`;
    if (!hold) autoSyncNoticeTimer = setTimeout(() => notice.classList.remove('show'), state === 'error' ? 5200 : 3200);
  }

  const librarySignature = (snapshot = library) => JSON.stringify(snapshot);

  function openHandleDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('acta.workspace.handles', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('handles');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function storeDirectoryHandle(key, handle) {
    if (!('indexedDB' in window)) return;
    const database = await openHandleDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('handles', 'readwrite');
      transaction.objectStore('handles').put(handle, key);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  }

  async function readDirectoryHandle(key) {
    if (!('indexedDB' in window)) return null;
    const database = await openHandleDatabase();
    const handle = await new Promise((resolve, reject) => {
      const request = database.transaction('handles').objectStore('handles').get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return handle;
  }

  async function removeDirectoryHandle(key) {
    if (!('indexedDB' in window)) return;
    const database = await openHandleDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('handles', 'readwrite');
      transaction.objectStore('handles').delete(key);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  }

  function parseLibraryPayload(raw) {
    const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const candidate = payload?.format === 'acta-library' ? payload.library : payload;
    if (!candidate || !Array.isArray(candidate.items) || !Array.isArray(candidate.folders)) throw new Error(uiText('invalidLibrary'));
    return clearLegacyTags(normalizeLibrary(candidate));
  }

  const itemFileBaseName = item => {
    const bytes = new TextEncoder().encode(String(item.id || 'item'));
    const encodedId = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
    return `item-${encodedId || '00'}`;
  };
  const itemFileName = item => `${itemFileBaseName(item)}.json`;

  function createDataFolderDocuments(librarySnapshot) {
    const snapshot = clearLegacyTags(JSON.parse(JSON.stringify(librarySnapshot)));
    const syncedAt = new Date().toISOString();
    const notes = snapshot.items.filter(item => item.type === 'note').map(item => {
      const { body = '', ...configuration } = item;
      const baseName = itemFileBaseName(item);
      return {
        id:item.id, markdownFile:`${baseName}.md`, configFile:`${baseName}.json`, updatedAt:item.updatedAt || '',
        markdown:noteHTMLToMarkdown(body),
        config:{ format:'acta-note-config', version:1, contentFile:`${baseName}.md`, item:configuration }
      };
    });
    const todos = snapshot.items.filter(item => item.type === 'todo').map(item => ({
      id: item.id, file: itemFileName(item), updatedAt: item.updatedAt || '',
      document: { format:'acta-todo', version:1, item }
    }));
    return {
      manifest: {
        format:'acta-data-folder', version:3, libraryVersion:snapshot.version || 1, syncedAt,
        classifications:classificationsFile,
        notes:notes.map(({ id, markdownFile, configFile, updatedAt }) => ({ id, markdown:markdownFile, config:configFile, updatedAt })),
        todos:todos.map(({ id, file, updatedAt }) => ({ id, file, updatedAt })),
        itemOrder:snapshot.items.map(item => item.id)
      },
      classifications: { format:'acta-classifications', version:1, folders:snapshot.folders || [] },
      notes,
      todos
    };
  }

  function libraryFromDataFolderDocuments(documents) {
    const { manifest, classifications, notes = [], todos = [] } = documents || {};
    if (manifest?.format !== 'acta-data-folder' || Number(manifest.version) < 2) throw new Error(uiText('invalidLibrary'));
    const folders = classifications?.format === 'acta-classifications' && Array.isArray(classifications.folders)
      ? classifications.folders : (Array.isArray(classifications) ? classifications : null);
    if (!folders) throw new Error(uiText('invalidLibrary'));
    const unwrapItem = (document, expectedType) => {
      const item = document?.item || document;
      if (!item || item.type !== expectedType || !item.id) throw new Error(uiText('invalidLibrary'));
      return item;
    };
    const unwrapNote = document => {
      if (document?.config && Object.prototype.hasOwnProperty.call(document, 'markdown')) {
        const configuration = document.config?.item || document.config;
        if (!configuration || configuration.type !== 'note' || !configuration.id) throw new Error(uiText('invalidLibrary'));
        return { ...configuration, body:markdownToNoteHTML(String(document.markdown || '')) };
      }
      return unwrapItem(document, 'note');
    };
    const items = [
      ...notes.map(unwrapNote),
      ...todos.map(document => unwrapItem(document, 'todo'))
    ];
    const itemMap = new Map(items.map(item => [item.id, item]));
    const ordered = (manifest.itemOrder || []).map(id => itemMap.get(id)).filter(Boolean);
    items.forEach(item => { if (!ordered.includes(item)) ordered.push(item); });
    return clearLegacyTags(normalizeLibrary({ version:manifest.libraryVersion || 1, folders, items:ordered }));
  }

  function createPortableDataFolderBundle(librarySnapshot) {
    const documents = createDataFolderDocuments(librarySnapshot);
    return {
      format:'acta-data-folder-bundle', version:3,
      files: {
        [dataManifestFile]: documents.manifest,
        [classificationsFile]: documents.classifications,
        [notesDirectoryName]: Object.fromEntries(documents.notes.flatMap(entry => [[entry.configFile, entry.config], [entry.markdownFile, entry.markdown]])),
        [todosDirectoryName]: Object.fromEntries(documents.todos.map(entry => [entry.file, entry.document]))
      }
    };
  }

  function parsePortableDataFolderBundle(payload) {
    if (payload?.format !== 'acta-data-folder-bundle') return parseLibraryPayload(payload);
    const files = payload.files || {};
    const manifest = files[dataManifestFile];
    const noteFiles = files[notesDirectoryName] || {};
    const todoFiles = files[todosDirectoryName] || {};
    return libraryFromDataFolderDocuments({
      manifest,
      classifications:files[classificationsFile],
      notes:(manifest?.notes || []).map(entry => entry.config && entry.markdown
        ? { config:noteFiles[entry.config], markdown:noteFiles[entry.markdown] ?? '' }
        : noteFiles[entry.file]),
      todos:(manifest?.todos || []).map(entry => todoFiles[entry.file])
    });
  }

  async function writeJSONFile(directory, name, value) {
    const fileHandle = await directory.getFileHandle(name, { create:true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(value, null, 2));
    await writable.close();
  }

  async function writeTextFile(directory, name, value) {
    const fileHandle = await directory.getFileHandle(name, { create:true });
    const writable = await fileHandle.createWritable();
    await writable.write(String(value || ''));
    await writable.close();
  }

  async function readJSONFile(directory, name) {
    const fileHandle = await directory.getFileHandle(name);
    const file = await fileHandle.getFile();
    return JSON.parse(await file.text());
  }

  async function readTextFile(directory, name) {
    const fileHandle = await directory.getFileHandle(name);
    return (await fileHandle.getFile()).text();
  }

  async function removeStaleItemFiles(directory, expectedFiles) {
    if (!directory.entries || !directory.removeEntry) return;
    for await (const [name, entry] of directory.entries()) {
      if (entry.kind === 'file' && /^item-[a-f0-9]+\.(?:json|md)$/i.test(name) && !expectedFiles.has(name)) {
        await directory.removeEntry(name);
      }
    }
  }

  async function saveDataFolder(handle, librarySnapshot) {
    const documents = createDataFolderDocuments(librarySnapshot);
    const notesDirectory = await handle.getDirectoryHandle(notesDirectoryName, { create:true });
    const todosDirectory = await handle.getDirectoryHandle(todosDirectoryName, { create:true });
    await Promise.all(documents.notes.flatMap(entry => [
      writeJSONFile(notesDirectory, entry.configFile, entry.config),
      writeTextFile(notesDirectory, entry.markdownFile, entry.markdown)
    ]));
    await Promise.all(documents.todos.map(entry => writeJSONFile(todosDirectory, entry.file, entry.document)));
    await writeJSONFile(handle, classificationsFile, documents.classifications);
    await writeJSONFile(handle, dataManifestFile, documents.manifest);
    await removeStaleItemFiles(notesDirectory, new Set(documents.notes.flatMap(entry => [entry.configFile, entry.markdownFile])));
    await removeStaleItemFiles(todosDirectory, new Set(documents.todos.map(entry => entry.file)));
  }

  async function loadDataFolder(handle) {
    let manifest;
    try {
      manifest = await readJSONFile(handle, dataManifestFile);
    } catch (error) {
      if (error?.name !== 'NotFoundError') throw error;
      const legacyPayload = await readJSONFile(handle, legacyLibraryFile);
      const legacyLibrary = parseLibraryPayload(legacyPayload);
      await saveDataFolder(handle, legacyLibrary);
      return legacyLibrary;
    }
    const classifications = await readJSONFile(handle, manifest.classifications || classificationsFile);
    const notesDirectory = await handle.getDirectoryHandle(notesDirectoryName);
    const todosDirectory = await handle.getDirectoryHandle(todosDirectoryName);
    const notes = await Promise.all((manifest.notes || []).map(entry => entry.config && entry.markdown
      ? Promise.all([readJSONFile(notesDirectory, entry.config), readTextFile(notesDirectory, entry.markdown)]).then(([config, markdown]) => ({ config, markdown }))
      : readJSONFile(notesDirectory, entry.file)));
    const todos = await Promise.all((manifest.todos || []).map(entry => readJSONFile(todosDirectory, entry.file)));
    const loadedLibrary = libraryFromDataFolderDocuments({ manifest, classifications, notes, todos });
    if (Number(manifest.version) < 3) await saveDataFolder(handle, loadedLibrary);
    return loadedLibrary;
  }

  function createWebFolderAdapter(handle, kind) {
    return {
      kind: 'web', handle, label: handle.name || uiText('localFolder'),
      save: librarySnapshot => saveDataFolder(handle, librarySnapshot),
      load: () => loadDataFolder(handle),
      version: async () => {
        try {
          const file = await (await handle.getFileHandle(dataManifestFile)).getFile();
          return `${file.lastModified}:${file.size}`;
        } catch (error) {
          if (error?.name === 'NotFoundError') return '';
          throw error;
        }
      }
    };
  }

  function createNativeFolderAdapter(folder, bridge, label = folder) {
    return {
      kind: 'native', folder, label,
      save: librarySnapshot => bridge.uploadLibrary(folder, createPortableDataFolderBundle(librarySnapshot)),
      load: async () => {
        const payload = (await bridge.downloadLibrary(folder)).library;
        const loadedLibrary = parsePortableDataFolderBundle(payload);
        if (payload?.format !== 'acta-data-folder-bundle' || Number(payload.version) < 3 || Number(payload?.files?.[dataManifestFile]?.version) < 3) {
          await bridge.uploadLibrary(folder, createPortableDataFolderBundle(loadedLibrary));
        }
        return loadedLibrary;
      },
      version: async () => ''
    };
  }

  const profileLibraryStorageKey = id => `acta.data.profile.${id}.v1`;
  const createBlankLibrary = () => {
    const blank = createDefaultLibrary();
    blank.items = [];
    return clearLegacyTags(normalizeLibrary(blank));
  };

  function localProfileLocation() {
    if (window.actaDesktop) return profileText('localDesktop');
    if (window.Capacitor?.Plugins) return profileText('localNative');
    return profileText('localBrowser');
  }

  function createLocalProfileAdapter(profile) {
    return {
      kind:'local', label:localProfileLocation(), profile,
      save:async librarySnapshot => {
        try { localStorage.setItem(profileLibraryStorageKey(profile.id), JSON.stringify(clearLegacyTags(JSON.parse(JSON.stringify(librarySnapshot))))); }
        catch (error) {
          if (error?.name === 'QuotaExceededError' || error?.code === 22) throw new Error(profileText('localQuota'));
          throw error;
        }
      },
      load:async () => {
        const raw = localStorage.getItem(profileLibraryStorageKey(profile.id));
        if (!raw) {
          const error = new Error('Profile data not found');
          error.name = 'NotFoundError';
          throw error;
        }
        return parseLibraryPayload(raw);
      },
      version:async () => profile.updatedAt || ''
    };
  }

  async function platformRequest(url, options = {}) {
    const desktopRequest = window.actaDesktop?.webDavRequest;
    if (desktopRequest) {
      const result = await desktopRequest(url, {
        method:options.method || 'GET', headers:options.headers || {}, body:options.body
      });
      const headerEntries = Object.entries(result.headers || {});
      return {
        ok:result.status >= 200 && result.status < 300,
        status:result.status,
        headers:{ get:name => headerEntries.find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1] || null },
        text:async () => result.body || ''
      };
    }
    const nativeHttp = window.Capacitor?.Plugins?.CapacitorHttp;
    if (nativeHttp?.request && window.Capacitor?.isNativePlatform?.()) {
      const result = await nativeHttp.request({
        url, method:options.method || 'GET', headers:options.headers || {}, data:options.body,
        responseType:'text', connectTimeout:30000, readTimeout:30000, disableRedirects:false
      });
      const headerEntries = Object.entries(result.headers || {});
      const raw = typeof result.data === 'string' ? result.data : JSON.stringify(result.data ?? '');
      return {
        ok:result.status >= 200 && result.status < 300,
        status:result.status,
        headers:{ get:name => headerEntries.find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1] || null },
        text:async () => raw
      };
    }
    return fetch(url, options);
  }

  function describeWebDavNetworkError(error, requestUrl) {
    const message = String(error?.message || error || 'Unknown network error');
    if (!/failed to fetch|networkerror|load failed|network request failed/i.test(message)) return message;
    let target;
    try { target = new URL(requestUrl); } catch { return syncText('webDavNetwork'); }
    if (location.protocol === 'https:' && target.protocol === 'http:') return syncText('webDavMixedContent');
    const nativeTransport = Boolean(window.actaDesktop?.webDavRequest || (window.Capacitor?.isNativePlatform?.() && window.Capacitor?.Plugins?.CapacitorHttp));
    return nativeTransport ? syncText('webDavNetwork') : syncText('webDavCors');
  }

  async function runWithConcurrency(values, limit, worker) {
    let cursor = 0;
    const runners = Array.from({ length:Math.min(limit, values.length) }, async () => {
      while (cursor < values.length) {
        const index = cursor++;
        await worker(values[index], index);
      }
    });
    await Promise.all(runners);
  }

  function normalizeWebDavServer(value) {
    const raw = String(value || '').trim();
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(syncText('invalidWebDavUrl'));
    url.username = '';
    url.password = '';
    url.hash = '';
    url.search = '';
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url.toString();
  }

  function webDavAuthorization(username, password) {
    if (!username && !password) return '';
    const bytes = new TextEncoder().encode(`${username}:${password}`);
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return `Basic ${btoa(binary)}`;
  }

  function createWebDavAdapter(configuration) {
    const config = {
      server:normalizeWebDavServer(configuration.server),
      username:String(configuration.username || ''),
      password:String(configuration.password || '')
    };
    const baseUrl = new URL(config.server);
    const resourceUrl = path => {
      const url = new URL(baseUrl.toString());
      const encodedPath = String(path || '').split('/').filter(Boolean).map(encodeURIComponent).join('/');
      url.pathname = `${baseUrl.pathname}${encodedPath}${path && String(path).endsWith('/') ? '/' : ''}`;
      return url.toString();
    };
    const auth = webDavAuthorization(config.username, config.password);

    async function request(path = '', options = {}) {
      const headers = { ...(options.headers || {}) };
      if (auth) headers.Authorization = auth;
      const targetUrl = resourceUrl(path);
      let response;
      try {
        response = await platformRequest(targetUrl, {
          method:options.method || 'GET',
          headers,
          body:options.body,
          cache:'no-store',
          redirect:'follow'
        });
      } catch (error) {
        throw new Error(describeWebDavNetworkError(error, targetUrl));
      }
      const raw = options.method === 'HEAD' ? '' : await response.text();
      const accepted = response.ok || (options.allow || []).includes(response.status);
      if (!accepted) {
        const error = new Error(`WebDAV HTTP ${response.status}${raw ? `: ${raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)}` : ''}`);
        error.status = response.status;
        if (response.status === 404) error.name = 'NotFoundError';
        throw error;
      }
      return { response, raw };
    }

    async function ensureCollection(path = '') {
      try {
        await request(path, {
          method:'PROPFIND',
          headers:{ Depth:'0', 'Content-Type':'application/xml; charset=utf-8' },
          body:'<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:"><d:prop><d:resourcetype/></d:prop></d:propfind>'
        });
        return;
      } catch (error) {
        if (error.status !== 404) throw error;
      }
      await request(path, { method:'MKCOL', allow:[201, 405] });
    }

    async function readJSON(path) {
      const { raw } = await request(path, { headers:{ Accept:'application/json' } });
      return JSON.parse(raw);
    }

    async function readText(path) {
      const { raw } = await request(path, { headers:{ Accept:'text/markdown, text/plain' } });
      return raw;
    }

    async function writeJSON(path, value) {
      await request(path, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json; charset=utf-8' },
        body:JSON.stringify(value, null, 2)
      });
    }

    async function writeText(path, value) {
      await request(path, {
        method:'PUT',
        headers:{ 'Content-Type':'text/markdown; charset=utf-8' },
        body:String(value || '')
      });
    }

    async function listCollection(path) {
      const { raw } = await request(path, {
        method:'PROPFIND',
        headers:{ Depth:'1', 'Content-Type':'application/xml; charset=utf-8' },
        body:'<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:"><d:prop><d:resourcetype/></d:prop></d:propfind>'
      });
      const documentNode = new DOMParser().parseFromString(raw, 'application/xml');
      return [...documentNode.getElementsByTagNameNS('DAV:', 'href')].map(node => {
        try {
          const pathname = new URL(node.textContent, baseUrl).pathname.replace(/\/$/, '');
          return decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1));
        } catch { return ''; }
      }).filter(Boolean);
    }

    async function cleanCollection(path, expectedFiles) {
      const stale = (await listCollection(path)).filter(name => /^item-[a-f0-9]+\.(?:json|md)$/i.test(name) && !expectedFiles.has(name));
      await runWithConcurrency(stale, 3, name => request(`${path}/${name}`, { method:'DELETE', allow:[204, 404] }));
    }

    async function save(librarySnapshot) {
      const documents = createDataFolderDocuments(librarySnapshot);
      await ensureCollection('');
      await Promise.all([ensureCollection(notesDirectoryName + '/'), ensureCollection(todosDirectoryName + '/')]);
      await runWithConcurrency([
        ...documents.notes.flatMap(entry => [
          { path:`${notesDirectoryName}/${entry.configFile}`, value:entry.config, type:'json' },
          { path:`${notesDirectoryName}/${entry.markdownFile}`, value:entry.markdown, type:'text' }
        ]),
        ...documents.todos.map(entry => ({ path:`${todosDirectoryName}/${entry.file}`, value:entry.document, type:'json' }))
      ], 4, entry => entry.type === 'text' ? writeText(entry.path, entry.value) : writeJSON(entry.path, entry.value));
      await writeJSON(classificationsFile, documents.classifications);
      await writeJSON(dataManifestFile, documents.manifest);
      await Promise.all([
        cleanCollection(notesDirectoryName + '/', new Set(documents.notes.flatMap(entry => [entry.configFile, entry.markdownFile]))),
        cleanCollection(todosDirectoryName + '/', new Set(documents.todos.map(entry => entry.file)))
      ]);
    }

    async function load() {
      const manifest = await readJSON(dataManifestFile);
      const classifications = await readJSON(manifest.classifications || classificationsFile);
      const notes = new Array((manifest.notes || []).length);
      const todos = new Array((manifest.todos || []).length);
      await runWithConcurrency(manifest.notes || [], 4, async (entry, index) => {
        notes[index] = entry.config && entry.markdown
          ? { config:await readJSON(`${notesDirectoryName}/${entry.config}`), markdown:await readText(`${notesDirectoryName}/${entry.markdown}`) }
          : await readJSON(`${notesDirectoryName}/${entry.file}`);
      });
      await runWithConcurrency(manifest.todos || [], 4, async (entry, index) => { todos[index] = await readJSON(`${todosDirectoryName}/${entry.file}`); });
      const loadedLibrary = libraryFromDataFolderDocuments({ manifest, classifications, notes, todos });
      if (Number(manifest.version) < 3) await save(loadedLibrary);
      return loadedLibrary;
    }

    async function version() {
      try {
        const { response } = await request(dataManifestFile, { method:'HEAD' });
        return response.headers.get('ETag') || response.headers.get('Last-Modified') || response.headers.get('Content-Length') || '';
      } catch (error) {
        if (error.status === 404) return '';
        throw error;
      }
    }

    return {
      kind:'webdav',
      label:config.server,
      config,
      probe:async () => {
        await ensureCollection('');
        await Promise.all([ensureCollection(notesDirectoryName + '/'), ensureCollection(todosDirectoryName + '/')]);
        return true;
      },
      save,
      load,
      version
    };
  }

  async function chooseFolderAdapter(kind, handleKey = '') {
    const bridge = getSyncBridge();
    const chooseNativeFolder = async () => {
      const selection = await bridge.chooseSyncFolder();
      if (!selection) return null;
      const folder = typeof selection === 'string' ? selection : (selection.folder || selection.uri);
      if (!folder) return null;
      return createNativeFolderAdapter(folder, bridge, typeof selection === 'string' ? selection : (selection.label || selection.name || folder));
    };
    if (bridge && window.Capacitor?.isNativePlatform?.()) return chooseNativeFolder();
    if (window.showDirectoryPicker) {
      try {
        const pickerId = `acta-${String(kind).replace(/[^a-z0-9_-]/gi, '-').slice(0, 48)}`;
        const handle = await window.showDirectoryPicker({ id:pickerId, mode:'readwrite', startIn:'documents' });
        if (handle.requestPermission && await handle.requestPermission({ mode:'readwrite' }) !== 'granted') throw new Error(uiText('noFolderPermission'));
        if (handleKey) await storeDirectoryHandle(handleKey, handle);
        return createWebFolderAdapter(handle, kind);
      } catch (error) {
        if (error?.name === 'AbortError') return null;
        if (!bridge || !['SecurityError', 'NotSupportedError'].includes(error?.name)) throw error;
      }
    }
    if (bridge) return chooseNativeFolder();
    throw new Error(uiText('unsupportedFolder'));
  }

  function replaceLibrary(nextLibrary) {
    library = clearLegacyTags(normalizeLibrary(nextLibrary));
    statsSelection.clear();
    selectedId = activeItems()[0]?.id || null;
    currentView = 'inbox';
    resetListFilters();
    searchQuery = '';
    mobileEditorOpen = false;
    byId('searchInput').value = '';
    document.querySelectorAll('.filter-row [data-filter]').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
    renderAll();
  }

  const activeDataProfile = () => dataProfiles.find(profile => profile.id === uiSettings.activeDataProfileId) || null;
  const dataProfileById = id => dataProfiles.find(profile => profile.id === id) || null;
  const profileLocation = profile => profile?.storage === 'local' ? localProfileLocation() : (profile?.label || profile?.folder || profileText('folder'));
  const profileStats = (profile, snapshot = null) => {
    const source = snapshot?.items || [];
    if (snapshot) {
      profile.noteCount = source.filter(item => item.type === 'note' && !isTrashed(item)).length;
      profile.todoCount = source.filter(item => item.type === 'todo' && !isTrashed(item)).length;
      profile.updatedAt = new Date().toISOString();
    }
    return { notes:Number(profile.noteCount) || 0, todos:Number(profile.todoCount) || 0 };
  };

  function saveDataProfileRegistry() {
    uiSettings.dataProfiles = dataProfiles.map(profile => ({ ...profile }));
    saveUISettings();
  }

  function uniqueProfileName(baseName) {
    const normalizedBase = String(baseName || profileText('newName')).trim() || profileText('newName');
    if (!dataProfiles.some(profile => profile.name.toLocaleLowerCase() === normalizedBase.toLocaleLowerCase())) return normalizedBase;
    let index = 2;
    while (dataProfiles.some(profile => profile.name.toLocaleLowerCase() === `${normalizedBase} ${index}`.toLocaleLowerCase())) index += 1;
    return `${normalizedBase} ${index}`;
  }

  function applyAdapterToProfile(profile, adapter, handleKey = profile.handleKey || '') {
    if (adapter.kind === 'local') {
      profile.storage = 'local';
      delete profile.folder;
      delete profile.handleKey;
      profile.label = localProfileLocation();
      return;
    }
    profile.storage = 'folder';
    profile.label = adapter.label;
    if (adapter.kind === 'native') {
      profile.folder = adapter.folder;
      delete profile.handleKey;
    } else {
      profile.handleKey = handleKey;
      delete profile.folder;
    }
  }

  async function adapterForDataProfile(profile, interactive = false) {
    if (!profile || profile.storage === 'local') return createLocalProfileAdapter(profile);
    const bridge = getSyncBridge();
    if (profile.folder && bridge) return createNativeFolderAdapter(profile.folder, bridge, profile.label || profile.folder);
    if (profile.handleKey) {
      const handle = await readDirectoryHandle(profile.handleKey);
      if (!handle) throw new Error(profileText('unavailable'));
      let permission = handle.queryPermission ? await handle.queryPermission({ mode:'readwrite' }) : 'granted';
      if (permission !== 'granted' && interactive && handle.requestPermission) permission = await handle.requestPermission({ mode:'readwrite' });
      if (permission !== 'granted') throw new Error(profileText('unavailable'));
      return createWebFolderAdapter(handle, 'profile');
    }
    throw new Error(profileText('unavailable'));
  }

  async function inspectFolderAdapter(adapter) {
    if (adapter.kind === 'web') {
      const handle = adapter.handle;
      const sample = [];
      let hasActaData = false;
      let empty = true;
      for await (const [name] of handle.entries()) {
        empty = false;
        if (name === dataManifestFile || name === legacyLibraryFile) hasActaData = true;
        if (sample.length < 20) sample.push(name);
      }
      return { empty, hasActaData, sample };
    }
    if (adapter.kind === 'native') {
      const bridge = getSyncBridge();
      if (bridge?.inspectFolder) {
        try {
          const result = await bridge.inspectFolder(adapter.folder);
          if (result && typeof result.empty === 'boolean') return { empty: result.empty, hasActaData: Boolean(result.hasActaData), sample: Array.isArray(result.sample) ? result.sample : [] };
        } catch { /* fall back to downloadLibrary detection below */ }
      }
      try { await bridge.downloadLibrary(adapter.folder); return { empty:false, hasActaData:true, sample:[] }; }
      catch { return { empty:true, hasActaData:false, sample:[] }; }
    }
    return { empty:true, hasActaData:false, sample:[] };
  }

  async function readExistingProfile() {
    const status = byId('workspaceStatus');
    try {
      setStatus(status, profileText('readingExisting'), '');
      const profileId = uid();
      const handleKey = `profile:${profileId}`;
      const adapter = await chooseFolderAdapter('profile', handleKey);
      if (!adapter) { setStatus(status, profileText('ready'), 'success'); return; }
      const inspect = await inspectFolderAdapter(adapter);
      if (!inspect.hasActaData) {
        if (handleKey) await removeDirectoryHandle(handleKey).catch(() => {});
        setStatus(status, profileText('noExistingData', adapter.label || profileText('folder')), 'error');
        return;
      }
      const snapshot = await adapter.load();
      const profile = { id:profileId, name:uniqueProfileName(adapter.label || profileText('newName')), storage:'folder', label:adapter.label, noteCount:0, todoCount:0, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
      applyAdapterToProfile(profile, adapter, handleKey);
      profileStats(profile, snapshot);
      dataProfiles.push(profile);
      saveDataProfileRegistry();
      await activateDataProfile(profile.id, { adapter, notify:false });
      setStatus(status, profileText('imported', profile.name), 'success');
    } catch (error) {
      setStatus(status, error.message, 'error');
    }
  }

  function renderDataProfiles() {
    const copy = profileMessages[uiSettings.language] || profileMessages.zh;
    const active = activeDataProfile();
    const panelHeader = document.querySelector('[data-settings-panel="workspace"] .data-profile-header');
    panelHeader.querySelector('p').textContent = copy.panelDescription;
    byId('newDataProfile').querySelector('span').textContent = copy.newProfile;
    byId('readDataProfile').querySelector('span').textContent = copy.readExisting;
    byId('refreshDataProfile').querySelector('span').textContent = copy.refreshData;
    byId('newDataProfileTitle').textContent = copy.newProfile;
    byId('newDataProfileSubtitle').textContent = copy.newSubtitle;
    byId('newDataProfileNameLabel').textContent = copy.name;
    byId('newDataProfileStorageLabel').textContent = copy.location;
    byId('newDataProfileLocalLabel').textContent = localProfileLocation();
    byId('newDataProfileLocalHint').textContent = copy.localHint;
    byId('newDataProfileFolderLabel').textContent = copy.folder;
    byId('newDataProfileFolderHint').textContent = copy.folderHint;
    byId('cancelDataProfile').textContent = copy.cancel;
    byId('confirmDataProfile').querySelector('span').textContent = copy.createOpen;
    byId('dataProfileListTitle').textContent = copy.profiles;
    byId('dataProfileCount').textContent = profileText('count', dataProfiles.length);
    byId('activeDataProfileSummary').textContent = active ? profileText('activeSummary', active.name) : '';
    const browserNotice = byId('browserStorageNotice');
    browserNotice.hidden = Boolean(window.actaDesktop || window.Capacitor?.Plugins);
    browserNotice.querySelector('b').textContent = copy.browserTitle;
    browserNotice.querySelector('span').textContent = copy.browserHint;
    const list = byId('dataProfileList');
    list.innerHTML = dataProfiles.map((profile, index) => {
      const isActive = profile.id === active?.id;
      const editing = profile.id === editingDataProfileId;
      const stats = profileStats(profile);
      const location = profileLocation(profile);
      return `<article class="data-profile-card${isActive ? ' active' : ''}${editing ? ' editing' : ''}" role="listitem" data-profile-id="${escapeHTML(profile.id)}" style="--profile-delay:${Math.min(index * 45, 220)}ms">
        <div class="data-profile-card-main">
          <span class="data-profile-card-icon"><svg><use href="#i-${profile.storage === 'local' ? 'database' : 'folder'}"/></svg></span>
          <div class="data-profile-card-copy"><div class="data-profile-card-title"><b>${escapeHTML(profile.name)}</b>${isActive ? `<span class="data-profile-active-badge">${escapeHTML(copy.active)}</span>` : ''}</div><span class="data-profile-card-path" title="${escapeHTML(location)}">${escapeHTML(location)}</span><small class="data-profile-card-meta">${escapeHTML(profileText('stats', stats.notes, stats.todos))}</small></div>
          <div class="data-profile-card-actions"><button class="data-profile-action ${isActive ? 'current' : 'primary'}" type="button" data-profile-action="switch" ${isActive ? 'disabled' : ''}><svg><use href="#i-${isActive ? 'check' : 'database'}"/></svg><span>${escapeHTML(isActive ? copy.current : copy.open)}</span></button><button class="data-profile-action" type="button" data-profile-action="edit" aria-expanded="${editing}"><svg><use href="#i-edit"/></svg><span>${escapeHTML(copy.edit)}</span></button></div>
        </div>
        <div class="data-profile-editor"><div class="data-profile-editor-inner"><div class="data-profile-edit-grid"><input class="data-profile-edit-name" data-profile-name-input value="${escapeHTML(profile.name)}" maxlength="60" aria-label="${escapeHTML(copy.name)}"/><button class="data-profile-action primary" type="button" data-profile-action="save-name"><svg><use href="#i-check"/></svg><span>${escapeHTML(copy.saveName)}</span></button></div><div class="data-profile-location-row"><svg><use href="#i-${profile.storage === 'local' ? 'database' : 'folder'}"/></svg><span><b>${escapeHTML(copy.locationLabel)}</b><small title="${escapeHTML(location)}">${escapeHTML(location)}</small></span><button class="data-profile-action" type="button" data-profile-action="change-location"><svg><use href="#i-folder"/></svg><span>${escapeHTML(copy.changeLocation)}</span></button></div><div class="data-profile-editor-actions"><button class="data-profile-action danger" type="button" data-profile-action="delete" ${dataProfiles.length <= 1 ? 'disabled' : ''} title="${escapeHTML(dataProfiles.length <= 1 ? copy.lastProfile : copy.deleteProfile)}"><svg><use href="#i-trash"/></svg><span>${escapeHTML(copy.deleteProfile)}</span></button><button class="data-profile-action" type="button" data-profile-action="copy"><svg><use href="#i-copy"/></svg><span>${escapeHTML(copy.copy)}</span></button><button class="data-profile-action" type="button" data-profile-action="export"><svg><use href="#i-upload"/></svg><span>${escapeHTML(copy.export)}</span></button></div></div></div>
      </article>`;
    }).join('');
    if (editingDataProfileId) requestAnimationFrame(() => list.querySelector(`[data-profile-id="${CSS.escape(editingDataProfileId)}"] [data-profile-name-input]`)?.focus());
    lanProfilesChangedHook?.();
  }

  function updateWorkspaceUI() {
    const profile = activeDataProfile();
    const connected = Boolean(profile && workspaceAdapter);
    const displayName = profile?.name || uiText('actaData');
    byId('workspaceButton').querySelector('b').textContent = displayName;
    const cardStatus = byId('workspaceCardStatus');
    cardStatus.textContent = profile ? profileLocation(profile) : profileText('initializing');
    cardStatus.className = `workspace-card-status ${connected ? 'connected' : 'demo'}`;
    window.actaDataName = displayName;
  }

  async function queueWorkspaceSave(librarySnapshot = JSON.parse(JSON.stringify(library))) {
    const profile = activeDataProfile();
    const adapter = workspaceAdapter;
    if (!profile || !adapter) throw new Error(profileText('unavailable'));
    const snapshot = clearLegacyTags(JSON.parse(JSON.stringify(librarySnapshot)));
    profileStats(profile, snapshot);
    workspaceWriteQueue = workspaceWriteQueue.catch(() => {}).then(() => adapter.save(snapshot)).then(() => {
      saveDataProfileRegistry();
      // 局域网同步服务在运行时保持快照最新，“发送到对方”始终是当前内容。
      lanSyncUpdateMeta();
    });
    return workspaceWriteQueue;
  }

  async function flushCurrentDataProfile() {
    clearTimeout(saveTimer);
    if (workspaceAdapter && activeDataProfile()) await queueWorkspaceSave();
  }

  persist = function persistWorkspace() {
    const saveState = byId('saveState');
    clearLegacyTags(library);
    autoSyncDirty = true;
    scheduleAutomaticSync();
    saveState.textContent = t('saving');
    saveState.classList.add('saving');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      saveRendererSettings();
      try {
        await queueWorkspaceSave();
        saveState.textContent = t('saved');
        saveState.classList.remove('saving');
      } catch (error) {
        saveState.textContent = uiText('saveFailed', '').replace(/[:：]\s*$/, '');
        saveState.classList.remove('saving');
        setStatus(byId('workspaceStatus'), error.message, 'error');
      }
    }, 320);
  };

  // The debounced save plus the async write queue can outlive a closed window or a
  // backgrounded tab, so flush pending edits on pagehide. Local profiles finish
  // synchronously inside the call; folder profiles fire the write and let it land.
  const flushPendingSaves = () => {
    clearTimeout(saveTimer);
    clearTimeout(autoSyncSaveTimer);
    autoSyncSaveTimer = null;
    flushCurrentDataProfile().catch(() => {});
  };
  window.addEventListener('pagehide', flushPendingSaves);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPendingSaves();
  });

  function missingLibraryFile(error) {
    return error?.name === 'NotFoundError' || /ENOENT|not found|没有 (acta-library|acta-manifest)|不存在|Profile data not found/i.test(error?.message || '');
  }

  async function activateDataProfile(profileId, { adapter = null, createIfMissing = false, notify = true, interactive = false } = {}) {
    const profile = dataProfileById(profileId);
    if (!profile) return;
    const previousId = uiSettings.activeDataProfileId;
    if (workspaceAdapter && previousId && previousId !== profileId) await flushCurrentDataProfile();
    const nextAdapter = adapter || await adapterForDataProfile(profile, interactive);
    let snapshot;
    try { snapshot = await nextAdapter.load(); }
    catch (error) {
      if (!createIfMissing || !missingLibraryFile(error)) throw error;
      snapshot = createBlankLibrary();
      await nextAdapter.save(snapshot);
    }
    workspaceAdapter = nextAdapter;
    uiSettings.activeDataProfileId = profile.id;
    settings.syncFolder = nextAdapter.kind === 'native' ? nextAdapter.folder : '';
    uiSettings.workspaceLabel = nextAdapter.label;
    profile.label = profile.storage === 'local' ? localProfileLocation() : nextAdapter.label;
    profileStats(profile, snapshot);
    saveDataProfileRegistry();
    saveRendererSettings();
    replaceLibrary(snapshot);
    updateWorkspaceUI();
    renderDataProfiles();
    byId('saveState').textContent = t('saved');
    byId('saveState').classList.remove('saving');
    if (notify) setStatus(byId('workspaceStatus'), profileText(previousId === profile.id ? 'loaded' : 'switched', profile.name), 'success');
  }

  async function loadDataProfileSnapshot(profile, interactive = true) {
    if (profile.id === activeDataProfile()?.id) {
      await flushCurrentDataProfile();
      return clearLegacyTags(JSON.parse(JSON.stringify(library)));
    }
    return (await adapterForDataProfile(profile, interactive)).load();
  }

  function setDataProfileCreateOpen(open) {
    const form = byId('dataProfileCreate');
    form.classList.toggle('open', open);
    form.setAttribute('aria-hidden', String(!open));
    byId('newDataProfile').setAttribute('aria-expanded', String(open));
    if (open) {
      byId('newDataProfileName').value = uniqueProfileName(profileText('newName'));
      document.querySelector('input[name="newDataProfileStorage"][value="local"]').checked = true;
      requestAnimationFrame(() => byId('newDataProfileName').select());
    }
  }

  async function initializeDataProfiles() {
    const records = Array.isArray(uiSettings.dataProfiles) ? uiSettings.dataProfiles : [];
    dataProfiles = records.filter(profile => profile && typeof profile.id === 'string').map(profile => ({ storage:'local', name:profileText('defaultName'), noteCount:0, todoCount:0, ...profile }));
    if (!dataProfiles.length) {
      let legacyHandle = null;
      if (!savedNativeWorkspace) legacyHandle = await readDirectoryHandle('workspace').catch(() => null);
      const id = uid();
      const profile = { id, name:uiSettings.workspaceLabel || profileText('defaultName'), storage:savedNativeWorkspace || legacyHandle ? 'folder' : 'local', label:uiSettings.workspaceLabel || localProfileLocation(), noteCount:library.items.filter(item => item.type === 'note' && !isTrashed(item)).length, todoCount:library.items.filter(item => item.type === 'todo' && !isTrashed(item)).length, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
      if (savedNativeWorkspace) profile.folder = savedNativeWorkspace;
      else if (legacyHandle) { profile.handleKey = 'workspace'; profile.label = legacyHandle.name || profileText('folder'); }
      dataProfiles.push(profile);
      uiSettings.activeDataProfileId = id;
      if (profile.storage === 'local') await createLocalProfileAdapter(profile).save(library);
      saveDataProfileRegistry();
    }
    if (!dataProfileById(uiSettings.activeDataProfileId)) uiSettings.activeDataProfileId = dataProfiles[0].id;
    renderDataProfiles();
    updateWorkspaceUI();
    try {
      await activateDataProfile(uiSettings.activeDataProfileId, { createIfMissing:true, notify:false });
      setStatus(byId('workspaceStatus'), profileText('ready'), 'success');
    } catch (error) {
      const recovery = { id:uid(), name:uniqueProfileName(profileText('defaultName')), storage:'local', label:localProfileLocation(), createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(), noteCount:library.items.filter(item => item.type === 'note' && !isTrashed(item)).length, todoCount:library.items.filter(item => item.type === 'todo' && !isTrashed(item)).length };
      dataProfiles.push(recovery);
      await createLocalProfileAdapter(recovery).save(library);
      await activateDataProfile(recovery.id, { notify:false });
      setStatus(byId('workspaceStatus'), `${error.message} ${profileText('ready')}`, 'error');
    }
  }

  byId('workspaceButton').addEventListener('click', () => openSettings('workspace'));
  byId('newDataProfile').addEventListener('click', () => setDataProfileCreateOpen(!byId('dataProfileCreate').classList.contains('open')));
  byId('cancelDataProfile').addEventListener('click', () => setDataProfileCreateOpen(false));
  byId('readDataProfile').addEventListener('click', readExistingProfile);

  // 刷新行记数据：从当前档案的存储位置重新读取并重绘界面；
  // 尚未生成数据文件的新档案保留当前内容。
  let dataProfileRefreshing = false;
  async function refreshActiveDataProfile() {
    if (dataProfileRefreshing) return;
    const profile = activeDataProfile();
    if (!profile) return;
    dataProfileRefreshing = true;
    const status = byId('workspaceStatus');
    try {
      setStatus(status, profileText('refreshingData'), '');
      const adapter = await adapterForDataProfile(profile, false);
      const snapshot = await adapter.load();
      replaceLibrary(clearLegacyTags(JSON.parse(JSON.stringify(snapshot))));
      profileStats(profile, snapshot);
      saveDataProfileRegistry();
      renderDataProfiles();
      updateWorkspaceUI();
      lanSyncUpdateMeta();
      setStatus(status, profileText('dataRefreshed', profile.name), 'success');
    } catch (error) {
      if (missingLibraryFile(error)) setStatus(status, profileText('refreshNoData'), '');
      else setStatus(status, error.message, 'error');
    } finally {
      dataProfileRefreshing = false;
    }
  }
  byId('refreshDataProfile').addEventListener('click', () => { void refreshActiveDataProfile(); });
  byId('confirmDataProfile').addEventListener('click', async () => {
    const name = byId('newDataProfileName').value.trim();
    const storage = document.querySelector('input[name="newDataProfileStorage"]:checked')?.value || 'local';
    if (!name) { byId('newDataProfileName').focus(); setStatus(byId('workspaceStatus'), profileText('emptyName'), 'error'); return; }
    if (dataProfiles.some(profile => profile.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { byId('newDataProfileName').focus(); setStatus(byId('workspaceStatus'), profileText('duplicateName'), 'error'); return; }
    const profile = { id:uid(), name, storage, label:localProfileLocation(), noteCount:0, todoCount:0, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
    try {
      const handleKey = `profile:${profile.id}`;
      const adapter = storage === 'local' ? createLocalProfileAdapter(profile) : await chooseFolderAdapter('profile', handleKey);
      if (!adapter) return;
      if (storage !== 'local') {
        const inspect = await inspectFolderAdapter(adapter);
        if (!inspect.empty) {
          const warning = profileText(inspect.hasActaData ? 'overwriteActaWarn' : 'overwriteFolderWarn', adapter.label || profileText('folder'));
          if (!window.confirm(warning)) {
            if (handleKey) await removeDirectoryHandle(handleKey).catch(() => {});
            return;
          }
        }
      }
      applyAdapterToProfile(profile, adapter, handleKey);
      await adapter.save(createBlankLibrary());
      dataProfiles.push(profile);
      saveDataProfileRegistry();
      await activateDataProfile(profile.id, { adapter, notify:false });
      setDataProfileCreateOpen(false);
      setStatus(byId('workspaceStatus'), profileText('created', profile.name), 'success');
    } catch (error) { setStatus(byId('workspaceStatus'), error.message, 'error'); }
  });
  byId('newDataProfileName').addEventListener('keydown', event => {
    if (!isImeComposing(event) && event.key === 'Enter') { event.preventDefault(); byId('confirmDataProfile').click(); }
  });

  byId('dataProfileList').addEventListener('click', async event => {
    const button = event.target.closest('[data-profile-action]');
    const card = event.target.closest('[data-profile-id]');
    if (!button || !card) return;
    const profile = dataProfileById(card.dataset.profileId);
    if (!profile) return;
    const action = button.dataset.profileAction;
    try {
      if (action === 'edit') {
        editingDataProfileId = editingDataProfileId === profile.id ? '' : profile.id;
        renderDataProfiles();
        return;
      }
      if (action === 'delete') {
        if (dataProfiles.length <= 1) throw new Error(profileText('lastProfile'));
        const confirmation = profileText(profile.storage === 'local' ? 'confirmDeleteLocal' : 'confirmDeleteFolder', profile.name);
        if (!window.confirm(confirmation)) return;
        const wasActive = profile.id === activeDataProfile()?.id;
        const fallback = wasActive ? dataProfiles.find(entry => entry.id !== profile.id) : null;
        let fallbackAdapter = null;
        if (wasActive) {
          clearTimeout(saveTimer);
          await workspaceWriteQueue.catch(() => {});
          fallbackAdapter = await adapterForDataProfile(fallback, true);
          await fallbackAdapter.load();
        }
        if (profile.storage === 'local') localStorage.removeItem(profileLibraryStorageKey(profile.id));
        if (profile.handleKey) await removeDirectoryHandle(profile.handleKey).catch(() => {});
        dataProfiles = dataProfiles.filter(entry => entry.id !== profile.id);
        editingDataProfileId = '';
        if (wasActive) {
          workspaceAdapter = null;
          uiSettings.activeDataProfileId = '';
          settings.syncFolder = '';
          saveDataProfileRegistry();
          await activateDataProfile(fallback.id, { adapter:fallbackAdapter, notify:false });
        } else {
          saveDataProfileRegistry();
          renderDataProfiles();
        }
        updateWorkspaceUI();
        setStatus(byId('workspaceStatus'), profileText('profileDeleted', profile.name), 'success');
        return;
      }
      if (action === 'switch') {
        await activateDataProfile(profile.id, { interactive:true });
        return;
      }
      if (action === 'save-name') {
        const name = card.querySelector('[data-profile-name-input]').value.trim();
        if (!name) throw new Error(profileText('emptyName'));
        if (dataProfiles.some(entry => entry.id !== profile.id && entry.name.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error(profileText('duplicateName'));
        profile.name = name;
        profile.updatedAt = new Date().toISOString();
        saveDataProfileRegistry();
        updateWorkspaceUI();
        editingDataProfileId = '';
        renderDataProfiles();
        setStatus(byId('workspaceStatus'), profileText('renamed', name), 'success');
        return;
      }
      if (action === 'change-location') {
        const snapshot = await loadDataProfileSnapshot(profile, true);
        const handleKey = profile.handleKey || `profile:${profile.id}`;
        const adapter = await chooseFolderAdapter('profile', handleKey);
        if (!adapter) return;
        await adapter.save(snapshot);
        applyAdapterToProfile(profile, adapter, handleKey);
        profileStats(profile, snapshot);
        if (profile.id === activeDataProfile()?.id) {
          workspaceAdapter = adapter;
          settings.syncFolder = adapter.kind === 'native' ? adapter.folder : '';
          saveRendererSettings();
        }
        saveDataProfileRegistry();
        updateWorkspaceUI();
        renderDataProfiles();
        setStatus(byId('workspaceStatus'), profileText('moved', profile.name), 'success');
        return;
      }
      if (action === 'copy') {
        const snapshot = await loadDataProfileSnapshot(profile, true);
        const copyProfile = { id:uid(), name:uniqueProfileName(`${profile.name} ${profileText('copySuffix')}`), storage:'local', label:localProfileLocation(), createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
        profileStats(copyProfile, snapshot);
        await createLocalProfileAdapter(copyProfile).save(snapshot);
        dataProfiles.push(copyProfile);
        saveDataProfileRegistry();
        renderDataProfiles();
        setStatus(byId('workspaceStatus'), profileText('copied', copyProfile.name), 'success');
        return;
      }
      if (action === 'export') {
        const snapshot = await loadDataProfileSnapshot(profile, true);
        const adapter = await chooseFolderAdapter('export');
        if (!adapter) return;
        await adapter.save(snapshot);
        setStatus(byId('workspaceStatus'), profileText('exported', profile.name, adapter.label), 'success');
      }
    } catch (error) { setStatus(byId('workspaceStatus'), error.message, 'error'); }
  });

  const dataProfilesReady = initializeDataProfiles();
  let settingsCloseTimer = 0;

  function openSettings(page = 'language') {
    clearTimeout(settingsCloseTimer);
    settingsCloseTimer = 0;
    settingsModal.classList.remove('is-closing');
    settingsModal.classList.add('open');
    settingsModal.setAttribute('aria-hidden', 'false');
    switchSettingsPage(page);
    // 全屏设置页承载了设备雷达：打开即进入扫描循环（钩子只对数据同步页起效）。
    lanRadarVisibilityHook?.(true);
    syncLanguageChoice();
    applySettingsTranslation();
    updateOneDriveUI();
  }

  function closeSettings() {
    if (!settingsModal.classList.contains('open') || settingsModal.classList.contains('is-closing')) return;
    settingsModal.setAttribute('aria-hidden', 'true');
    lanRadarVisibilityHook?.(false);
    const finish = () => {
      clearTimeout(settingsCloseTimer);
      settingsCloseTimer = 0;
      settingsModal.classList.remove('open', 'is-closing');
    };
    if (reduceWindowMotion()) { finish(); return; }
    settingsModal.classList.add('is-closing');
    settingsCloseTimer = setTimeout(finish, 250);
  }

  function switchSettingsPage(page) {
    document.querySelectorAll('[data-settings-page]').forEach(button => button.classList.toggle('active', button.dataset.settingsPage === page));
    document.querySelectorAll('[data-settings-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.settingsPanel === page));
    // 行记数据页内嵌的数据统计随切换刷新，保证容量与计数是最新值。
    if (page === 'workspace') void refreshDataStats();
    // 设备雷达只在数据同步页可见：离开该页即暂停扫描循环。
    lanRadarVisibilityHook?.(page === 'cloud');
  }

  byId('settingsButton').addEventListener('click', () => openSettings('language'));
  byId('mobileListSettings').addEventListener('click', event => {
    event.preventDefault();
    openSettings('general');
  }, true);
  byId('settingsClose').addEventListener('click', closeSettings);
  // 弹出窗口不因点击空白处而关闭（设计约定）：设置面板内容较多，误点空白
  // 丢失浏览位置代价高；关闭只通过关闭按钮或 Esc。
  document.querySelectorAll('[data-settings-page]').forEach(button => button.addEventListener('click', () => switchSettingsPage(button.dataset.settingsPage)));
  document.addEventListener('keydown', event => { if (!isImeComposing(event) && event.key === 'Escape') closeSettings(); });

  // 注意仓库归属是 MogroWangStudio：此前写成 MogroWang 导致检查永远 404。
  const ACTA_RELEASES_URL = 'https://github.com/MogroWangStudio/Acta/releases';
  const ACTA_LATEST_RELEASE_API = 'https://api.github.com/repos/MogroWangStudio/Acta/releases/latest';
  const ACTA_TAGS_API = 'https://api.github.com/repos/MogroWangStudio/Acta/tags';
  const updateMessages = {
    zh: { checking:'正在检查更新…', latest:'当前已是最新版本（{version}）。', available:'发现新版本 {remote}，{link}。', noRelease:'尚未在 GitHub 上发布版本，{link}。', error:'检查更新失败：{detail}', downloadLink:'前往下载', releasesLink:'查看发布页' },
    en: { checking:'Checking for updates…', latest:'Acta is up to date ({version}).', available:'A new version {remote} is available. {link}.', noRelease:'No releases have been published on GitHub yet. {link}.', error:'Update check failed: {detail}', downloadLink:'Get the update', releasesLink:'View releases' },
    'zh-Hant': { checking:'正在檢查更新…', latest:'目前已是最新版本（{version}）。', available:'發現新版本 {remote}，{link}。', noRelease:'尚未在 GitHub 上發佈版本，{link}。', error:'檢查更新失敗：{detail}', downloadLink:'前往下載', releasesLink:'查看發佈頁' }
  };
  let aboutUpdateState = 'idle';
  let aboutUpdateVars = {};
  const updateText = (key, vars = {}) => {
    let message = (updateMessages[uiSettings.language] || updateMessages.zh)[key] || key;
    for (const [name, value] of Object.entries(vars)) message = message.replace(`{${name}}`, value);
    return message;
  };
  const currentActaVersion = () => (byId('aboutVersion')?.textContent || '').trim();
  const extractActaVersion = value => {
    const match = String(value || '').match(/\d+\.\d+\.\d+/);
    return match ? match[0] : '';
  };
  const parseActaVersion = value => {
    const match = extractActaVersion(value).match(/(\d+)\.(\d+)\.(\d+)/);
    return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
  };
  const compareActaVersion = (a, b) => {
    const pa = parseActaVersion(a), pb = parseActaVersion(b);
    for (let i = 0; i < 3; i++) { if (pa[i] !== pb[i]) return pa[i] - pb[i]; }
    return 0;
  };
  function renderUpdateStatus() {
    const el = byId('aboutUpdateStatus');
    if (!el) return;
    if (aboutUpdateState === 'idle') { el.hidden = true; el.textContent = ''; return; }
    el.hidden = false;
    el.classList.remove('ok', 'error');
    if (aboutUpdateState === 'error') el.classList.add('error');
    else if (aboutUpdateState === 'available' || aboutUpdateState === 'latest') el.classList.add('ok');
    // The url/remote values come from the GitHub API; whitelist the host and escape
    // before they reach an href or the innerHTML template.
    const safeReleaseHref = value => (
      typeof value === 'string' && /^https:\/\/(github\.com|api\.github\.com)\//i.test(value)
        ? escapeHTML(value)
        : escapeHTML(ACTA_RELEASES_URL)
    );
    const linkHtml = (url, key) => `<a href="${safeReleaseHref(url)}" target="_blank" rel="noopener">${updateText(key)}</a>`;
    if (aboutUpdateState === 'available') {
      const remote = escapeHTML(extractActaVersion(aboutUpdateVars.remote) || aboutUpdateVars.remote || '');
      el.innerHTML = updateText('available', { remote, link: linkHtml(aboutUpdateVars.url || ACTA_RELEASES_URL, 'downloadLink') });
    } else if (aboutUpdateState === 'noRelease') {
      el.innerHTML = updateText('noRelease', { link: linkHtml(ACTA_RELEASES_URL, 'releasesLink') });
    } else if (aboutUpdateState === 'error') {
      el.textContent = updateText('error', { detail: aboutUpdateVars.detail || '' });
    } else {
      el.textContent = updateText(aboutUpdateState, aboutUpdateVars);
    }
  }
  function setUpdateStatus(state, vars = {}) {
    aboutUpdateState = state;
    aboutUpdateVars = vars;
    renderUpdateStatus();
  }
  async function checkForUpdates() {
    const btn = byId('aboutCheckUpdate');
    if (btn) { btn.classList.add('checking'); btn.disabled = true; }
    setUpdateStatus('checking');
    try {
      // 桌面端走 Rust 命令：返回分平台安装包信息，确认后进入应用内更新
      // 流程（下载 → 重启 → 更新向导）；否则退回网页式的发布页链接。
      if (window.actaDesktop?.checkAppUpdate) {
        const info = await window.actaDesktop.checkAppUpdate();
        if (!info) {
          setUpdateStatus('latest', { version: currentActaVersion() });
        } else {
          setUpdateStatus('available', { remote: info.version, url: info.url });
          window.actaUpdater?.open(info, { fromAbout: true });
        }
        return;
      }
      // Android 原生更新：直接检查 Release 的安装包资产，确认后下载并拉起安装器。
      if (window.actaMobileUpdater) {
        const mobileInfo = await window.actaMobileUpdater.checkUpdate(currentActaVersion());
        if (!mobileInfo) {
          setUpdateStatus('latest', { version: currentActaVersion() });
        } else {
          setUpdateStatus('available', { remote: mobileInfo.version, url: mobileInfo.htmlUrl || ACTA_RELEASES_URL });
          window.actaMobileUpdater.open(mobileInfo);
        }
        return;
      }
      const response = await fetch(ACTA_LATEST_RELEASE_API, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
      if (response.status === 404) {
        const tagsResponse = await fetch(ACTA_TAGS_API, { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
        const tags = tagsResponse.ok ? await tagsResponse.json() : [];
        if (Array.isArray(tags) && tags.length) {
          const remote = extractActaVersion(tags[0].name) || tags[0].name;
          if (compareActaVersion(remote, currentActaVersion()) > 0) setUpdateStatus('available', { remote, url: ACTA_RELEASES_URL });
          else setUpdateStatus('latest', { version: currentActaVersion() });
        } else {
          setUpdateStatus('noRelease');
        }
      } else {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const remote = extractActaVersion(data.tag_name) || extractActaVersion(data.name) || data.tag_name || data.name || '';
        const url = data.html_url || ACTA_RELEASES_URL;
        if (compareActaVersion(remote, currentActaVersion()) > 0) setUpdateStatus('available', { remote, url });
        else setUpdateStatus('latest', { version: currentActaVersion() });
      }
    } catch (err) {
      setUpdateStatus('error', { detail: (err && err.message) ? err.message : String(err) });
    } finally {
      if (btn) { btn.classList.remove('checking'); btn.disabled = false; }
    }
  }
  byId('aboutCheckUpdate')?.addEventListener('click', checkForUpdates);

  const brandButton = document.querySelector('.brand');
  let logoMotionFrame = 0;
  let logoMotionTimer = 0;
  const playLogoMotion = () => {
    cancelAnimationFrame(logoMotionFrame);
    clearTimeout(logoMotionTimer);
    brandButton.classList.remove('logo-pulse');
    logoMotionFrame = requestAnimationFrame(() => {
      brandButton.classList.add('logo-pulse');
      logoMotionTimer = window.setTimeout(() => brandButton.classList.remove('logo-pulse'), 620);
    });
  };
  brandButton.addEventListener('click', playLogoMotion);
  brandButton.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); playLogoMotion(); }
  });

  const sidebarToggle = byId('sidebarToggle');
  const dataRefreshButtons = [byId('dataRefreshButton'), byId('mobileDataRefresh')].filter(Boolean);
  const sidebarToggleCopy = {
    zh: { collapse:'收起左侧功能栏', expand:'展开左侧功能栏' },
    en: { collapse:'Collapse sidebar', expand:'Expand sidebar' },
    'zh-Hant': { collapse:'收起左側功能列', expand:'展開左側功能列' }
  };
  const dataRefreshCopy = {
    zh: { title:'刷新数据', syncLoading:'正在从数据同步位置刷新…', localLoading:'正在重新读取当前行记数据…', syncDone:'已从数据同步位置刷新', localDone:'当前行记数据已刷新', failed:'刷新失败：' },
    en: { title:'Refresh data', syncLoading:'Refreshing from the data sync location…', localLoading:'Reloading the current Acta Data…', syncDone:'Refreshed from the data sync location', localDone:'Current Acta Data refreshed', failed:'Refresh failed: ' },
    'zh-Hant': { title:'重新整理資料', syncLoading:'正在從資料同步位置重新整理…', localLoading:'正在重新讀取目前行記資料…', syncDone:'已從資料同步位置重新整理', localDone:'目前行記資料已重新整理', failed:'重新整理失敗：' }
  };
  let dataRefreshBusy = false;
  let dataRefreshStatusTimer = 0;
  const updateSidebarToggleLabel = () => {
    const collapsed = document.body.classList.contains('sidebar-collapsed');
    const copy = sidebarToggleCopy[uiSettings.language] || sidebarToggleCopy.zh;
    const label = collapsed ? copy.expand : copy.collapse;
    sidebarToggle.title = label;
    sidebarToggle.setAttribute('aria-label', label);
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
  };
  const updateDataRefreshLabel = () => {
    const copy = dataRefreshCopy[uiSettings.language] || dataRefreshCopy.zh;
    dataRefreshButtons.forEach(button => {
      button.title = copy.title;
      button.setAttribute('aria-label', copy.title);
    });
  };
  const settleDataRefreshStatus = message => {
    const saveState = byId('saveState');
    clearTimeout(dataRefreshStatusTimer);
    saveState.textContent = message;
    saveState.classList.remove('saving');
    dataRefreshStatusTimer = window.setTimeout(() => {
      if (!saveState.classList.contains('saving') && saveState.textContent === message) saveState.textContent = t('saved');
    }, 1600);
  };
  const refreshCurrentData = async () => {
    if (dataRefreshBusy) return;
    dataRefreshBusy = true;
    const copy = dataRefreshCopy[uiSettings.language] || dataRefreshCopy.zh;
    const saveState = byId('saveState');
    const syncAdapter = activateSelectedCloudAdapter();
    const source = syncAdapter ? 'sync' : 'profile';
    dataRefreshButtons.forEach(button => {
      button.dataset.refreshSource = source;
      button.disabled = true;
      button.classList.add('is-refreshing');
      button.setAttribute('aria-busy', 'true');
    });
    saveState.textContent = source === 'sync' ? copy.syncLoading : copy.localLoading;
    saveState.classList.add('saving');
    clearTimeout(autoSyncSaveTimer);
    autoSyncSaveTimer = null;
    try {
      // 刷新只读取数据源，不把任何内容写回文件夹或云端。
      let snapshot;
      if (syncAdapter) {
        snapshot = await syncAdapter.load();
        replaceLibrary(snapshot);
        await refreshCloudVersion();
        autoSyncBaseline = librarySignature(snapshot);
        autoSyncDirty = false;
        updateWorkspaceUI();
        renderDataProfiles();
        setStatus(byId('oneDriveStatus'), copy.syncDone, 'success');
        showSyncNotice(copy.syncDone);
      } else {
        const profile = activeDataProfile();
        if (!profile) throw new Error(profileText('unavailable'));
        const adapter = workspaceAdapter || await adapterForDataProfile(profile, true);
        snapshot = await adapter.load();
        workspaceAdapter = adapter;
        profileStats(profile, snapshot);
        saveDataProfileRegistry();
        replaceLibrary(snapshot);
        updateWorkspaceUI();
        renderDataProfiles();
        autoSyncDirty = false;
        setStatus(byId('workspaceStatus'), copy.localDone, 'success');
        showSyncNotice(copy.localDone);
      }
      settleDataRefreshStatus(source === 'sync' ? copy.syncDone : copy.localDone);
    } catch (error) {
      const message = `${copy.failed}${error.message}`;
      settleDataRefreshStatus(message);
      if (source === 'sync') setStatus(byId('oneDriveStatus'), message, 'error');
      else setStatus(byId('workspaceStatus'), message, 'error');
      showSyncNotice(message, 'error');
    } finally {
      dataRefreshBusy = false;
      dataRefreshButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove('is-refreshing');
        button.removeAttribute('aria-busy');
      });
    }
  };
  let sidebarResizeTimer = 0;
  const applySidebarCollapse = collapsed => {
    closeFolderActionMenu();
    uiSettings.sidebarCollapsed = Boolean(collapsed);
    document.body.classList.toggle('sidebar-collapsed', uiSettings.sidebarCollapsed);
    // 折叠/展开瞬间挂上 .sidebar-resizing 驱动工作区列宽过渡，动画结束后移除，
    // 避免视图切换的 grid 变化也被动画化。
    document.body.classList.add('sidebar-resizing');
    clearTimeout(sidebarResizeTimer);
    sidebarResizeTimer = setTimeout(() => document.body.classList.remove('sidebar-resizing'), 620);
    updateSidebarToggleLabel();
  };
  applySidebarCollapse(uiSettings.sidebarCollapsed);
  updateDataRefreshLabel();
  dataRefreshButtons.forEach(button => button.addEventListener('click', refreshCurrentData));

  /* ===================== 移动端下拉刷新当前行记数据 =====================
     列表顶端下拉 → 阻尼跟手 → 越过阈值松手触发 refreshCurrentData（与刷新按钮同一数据链路，
     只读不回写）。跟随与回弹均为非线性：前段线性后段越拉越重的阻尼映射 + 带回弹的弹簧过渡。 */
  const pullIndicator = byId('pullRefreshIndicator');
  const pullList = byId('itemList');
  if (pullIndicator && pullList) {
    const pullMobileQuery = window.matchMedia('(max-width: 760px)');
    const PULL_ENGAGE = 7;    // 确认向下意图的死区，避免误触
    const PULL_TRIGGER = 48;  // 触发刷新的位移
    const PULL_HOLD = 46;     // 刷新中驻留位置
    let pullStartY = 0, pullStartX = 0, pullArmed = false, pullEngaged = false;
    let pullShift = 0, pullBusy = false, pullFrame = 0;

    // 阻尼映射：前 24px 线性跟手，之后越拉越重，渐进收敛。
    const pullDamped = raw => {
      const soft = 24;
      if (raw <= soft) return raw;
      const extra = raw - soft;
      return soft + extra * (soft / (soft + extra * 0.55));
    };
    const pullPaint = () => {
      pullFrame = 0;
      pullIndicator.style.setProperty('--pull-shift', `${pullShift.toFixed(1)}px`);
      pullIndicator.style.setProperty('--pull-spin', `${(pullShift * 3.4).toFixed(1)}deg`);
      pullIndicator.style.setProperty('--pull-grow', (0.88 + 0.12 * Math.min(1, pullShift / PULL_TRIGGER)).toFixed(3));
      pullIndicator.style.opacity = Math.min(1, pullShift / 40).toFixed(3);
      pullIndicator.classList.toggle('is-ready', pullShift >= PULL_TRIGGER);
    };
    const pullPaintSoon = () => { if (!pullFrame) pullFrame = requestAnimationFrame(pullPaint); };
    const pullReset = () => {
      pullShift = 0;
      pullPaint();
    };
    pullList.addEventListener('touchstart', event => {
      if (!pullMobileQuery.matches || pullBusy) return;
      // 汇总板的画布手势占满中栏（列表本体不滚动），竖直拖动是平移而不是下拉刷新。
      if (document.body.classList.contains('board-view')) return;
      if (pullList.scrollTop > 0) { pullArmed = false; return; }
      pullArmed = true;
      pullStartY = event.touches[0].clientY;
      pullStartX = event.touches[0].clientX;
    }, { passive: true });
    pullList.addEventListener('touchmove', event => {
      if (!pullArmed || pullBusy) return;
      const touch = event.touches[0];
      const dy = touch.clientY - pullStartY;
      const dx = touch.clientX - pullStartX;
      if (!pullEngaged) {
        if (dy <= PULL_ENGAGE) return;
        if (Math.abs(dx) > dy * 0.9) { pullArmed = false; return; } // 横向滑动不进入下拉
        pullEngaged = true;
        pullIndicator.classList.add('is-pulling');
      }
      event.preventDefault(); // 下拉期间接管滚动
      pullShift = pullDamped(dy - PULL_ENGAGE);
      pullPaintSoon();
    }, { passive: false });
    const pullFinish = async () => {
      if (!pullEngaged) { pullArmed = false; return; }
      pullEngaged = false;
      pullArmed = false;
      pullIndicator.classList.remove('is-pulling'); // 恢复过渡，回弹走弹簧曲线
      if (pullShift >= PULL_TRIGGER && !dataRefreshBusy) {
        pullBusy = true;
        pullShift = PULL_HOLD;
        pullPaint();
        pullIndicator.classList.add('is-refreshing');
        try {
          await refreshCurrentData();
          await new Promise(resolve => setTimeout(resolve, 380)); // 驻留片刻，完成状态可见
        } finally {
          pullIndicator.classList.remove('is-refreshing', 'is-ready');
          pullReset();
          setTimeout(() => { pullBusy = false; }, 500); // 等回弹收尾再放行下一次
        }
      } else {
        pullReset();
      }
    };
    pullList.addEventListener('touchend', pullFinish, { passive: true });
    pullList.addEventListener('touchcancel', pullFinish, { passive: true });
  }
  sidebarToggle.addEventListener('click', () => {
    byId('createMenu').classList.remove('open');
    applySidebarCollapse(!uiSettings.sidebarCollapsed);
    saveUISettings();
  });

  /* ===================== 行记数据统计弹窗 ===================== */
  const dataStatsCopy = {
    zh: { loading:'正在统计当前数据档案…', failed:'统计失败：', localHint:'软件本地档案：大小按存储内容估算。' },
    en: { loading:'Measuring the active data profile…', failed:'Failed to measure: ', localHint:'Local profile: size is estimated from stored content.' },
    'zh-Hant': { loading:'正在統計目前資料檔案…', failed:'統計失敗：', localHint:'軟體本地檔案：大小按儲存內容估算。' }
  };
  const formatDataSize = bytes => {
    if (!Number.isFinite(bytes) || bytes < 0) return '—';
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    for (const [unit, size] of [['GB', 1024 ** 3], ['MB', 1024 ** 2], ['KB', 1024]]) {
      if (bytes >= size) {
        const value = bytes / size;
        return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${unit}`;
      }
    }
    return `${Math.round(bytes)} B`;
  };
  const estimateFolderHandleSize = async handle => {
    let totalBytes = 0;
    let fileCount = 0;
    const walk = async directory => {
      for await (const entry of directory.values()) {
        if (entry.kind === 'directory') await walk(entry);
        else {
          const file = await entry.getFile();
          totalBytes += file.size;
          fileCount += 1;
        }
      }
    };
    await walk(handle);
    return { totalBytes, fileCount };
  };
  async function refreshDataStats() {
    const copy = dataStatsCopy[uiSettings.language] || dataStatsCopy.zh;
    const statusEl = byId('dataStatsStatus');
    const pathEl = byId('dataStatsPath');
    ['dataStatsSize', 'dataStatsFiles', 'dataStatsNotes', 'dataStatsTodos', 'dataStatsClassifications', 'dataStatsTrash']
      .forEach(id => { byId(id).textContent = '—'; });
    pathEl.textContent = '—';
    statusEl.textContent = '';
    const fillCounts = () => {
      byId('dataStatsNotes').textContent = String(library.items.filter(item => item.type === 'note' && !isTrashed(item)).length);
      byId('dataStatsTodos').textContent = String(library.items.filter(item => item.type === 'todo' && !isTrashed(item)).length);
      byId('dataStatsClassifications').textContent = String(library.folders.length);
      byId('dataStatsTrash').textContent = String(library.items.filter(isTrashed).length);
    };
    fillCounts();
    try {
      const profile = activeDataProfile();
      const adapter = workspaceAdapter || await adapterForDataProfile(profile, true);
      const location = profile?.storage === 'local' ? localProfileLocation() : (adapter.label || profile?.folder || '');
      pathEl.textContent = location;
      let size = null;
      if (profile?.storage === 'folder') {
        if (adapter.kind === 'native' && window.actaDesktop?.dataFolderStats) {
          const stats = await window.actaDesktop.dataFolderStats(adapter.folder);
          size = { totalBytes: Number(stats.totalBytes) || 0, fileCount: Number(stats.fileCount) || 0 };
        } else if (adapter.kind === 'web' && adapter.handle?.values) {
          size = await estimateFolderHandleSize(adapter.handle);
        }
      } else if (profile?.storage === 'local') {
        const raw = localStorage.getItem(profileLibraryStorageKey(profile.id)) || '';
        size = { totalBytes: new Blob([raw]).size, fileCount: NaN };
        statusEl.textContent = copy.localHint;
      }
      fillCounts();
      if (size) {
        byId('dataStatsSize').textContent = formatDataSize(size.totalBytes);
        byId('dataStatsFiles').textContent = Number.isFinite(size.fileCount) ? String(size.fileCount) : '—';
      }
    } catch (error) {
      statusEl.textContent = `${copy.failed}${error.message || error}`;
    }
  }

  // 历史记录弹窗：活动流式行列表（行间 hairline 分隔），层级只靠字号
  // 与间距——描述为主文字、相对化时间戳靠右弱化，不加类型图标等无
  // 信息量的图形。可回溯条目右侧常驻回溯按钮：点击一次在原位展开
  // 确认按钮，再次点击才执行，误触其他区域或另一条目时复位。
  const historyDialog = byId('historyDialog');
  const historyList = byId('historyList');
  const historyEmpty = byId('historyEmpty');
  let clearHistoryArmed = false;
  let clearHistoryTimer = null;
  // 列表里显示缩短的时刻（今天只看时分，更早带日期，往年带年份），
  // 悬停 title 保留精确到秒的完整时间。
  const formatHistoryTime = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const now = new Date();
    const hm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    if (date.toDateString() === now.toDateString()) return hm;
    const md = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    return date.getFullYear() === now.getFullYear() ? `${md} ${hm}` : `${date.getFullYear()}/${md} ${hm}`;
  };
  const renderHistory = () => {
    historyList.innerHTML = historyEntries.map(entry => {
      const restorable = Boolean(entry.snapshot);
      const target = entry.targetId ? library.items.find(item => item.id === entry.targetId && !isTrashed(item)) : null;
      // 有快照的条目可恢复到操作之前；无快照但项目仍在的条目仅跳转查看。
      const action = restorable ? 'restore' : target ? 'jump' : 'none';
      const actionLabel = action === 'restore' ? uiText('historyRestore') : uiText('historyJump');
      const entryAction = action === 'none' ? '<span class="history-entry-action" aria-hidden="true"></span>'
        : `<span class="history-entry-action"><button class="history-undo" type="button" title="${escapeHTML(actionLabel)}" aria-label="${escapeHTML(actionLabel)}"><svg><use href="#i-undo"/></svg></button><span class="history-jump" hidden><button class="history-jump-confirm" type="button">${escapeHTML(actionLabel)}</button></span></span>`;
      return `<li class="history-entry${action === 'none' ? '' : ' with-target'}" data-history-id="${escapeHTML(entry.id)}" data-action="${action}" data-target-id="${escapeHTML(entry.targetId || '')}"><div class="history-copy"><span>${escapeHTML(historyText(entry))}</span></div><time datetime="${escapeHTML(entry.at)}" title="${escapeHTML(formatDateTimeSeconds(entry.at))}">${escapeHTML(formatHistoryTime(entry.at))}</time>${entryAction}</li>`;
    }).join('');
    historyEmpty.hidden = historyEntries.length > 0;
    byId('historySubtitle').textContent = `${uiText('historySubtitle')} · ${historyEntries.length} / 500`;
  };
  // 点击条目或回溯按钮：先在行内展开确认按钮（二级确认），确认后执行
  // 回溯 / 跳转并关闭历史弹窗；目标已删除的条目不可点击。
  const disarmHistoryRow = () => {
    historyList.querySelectorAll('.history-entry.armed').forEach(entry => {
      entry.classList.remove('armed');
      const jump = entry.querySelector('.history-jump');
      if (jump) jump.hidden = true;
    });
  };
  historyList.addEventListener('click', event => {
    const entryEl = event.target instanceof Element ? event.target.closest('.history-entry.with-target') : null;
    if (!entryEl) {
      disarmHistoryRow();
      return;
    }
    const jump = entryEl.querySelector('.history-jump');
    if (!jump) return;
    if (!entryEl.classList.contains('armed')) {
      historyList.querySelectorAll('.history-entry.armed').forEach(other => {
        if (other !== entryEl) {
          other.classList.remove('armed');
          const otherJump = other.querySelector('.history-jump');
          if (otherJump) otherJump.hidden = true;
        }
      });
      entryEl.classList.add('armed');
      jump.hidden = false;
      jump.querySelector('.history-jump-confirm')?.focus();
      return;
    }
    const action = entryEl.dataset.action;
    const targetId = entryEl.dataset.targetId;
    entryEl.classList.remove('armed');
    jump.hidden = true;
    if (action === 'restore') {
      const snapshot = historyEntries.find(entry => entry.id === (entryEl.dataset.historyId || ''))?.snapshot
        || historyEntries.find(entry => entry.targetId === targetId && entry.snapshot)?.snapshot;
      if (!snapshot) return;
      // 回溯 = 把该项目恢复到此操作之前；项目已不存在（撤销创建的逆）
      // 时重新插入，随后打开它让用户立即看到恢复结果。
      const index = library.items.findIndex(item => item.id === snapshot.id);
      if (index >= 0) library.items[index] = JSON.parse(JSON.stringify(snapshot));
      else library.items.push(JSON.parse(JSON.stringify(snapshot)));
      persist();
      renderAll();
      openItem(snapshot.id);
      closeAnimatedDialog(historyDialog);
      showToast(uiText('historyRestoredToast'));
      return;
    }
    if (targetId) openItem(targetId);
    closeAnimatedDialog(historyDialog);
  });
  byId('historyButton').addEventListener('click', () => {
    clearHistoryArmed = false;
    byId('clearHistory').classList.remove('is-danger');
    byId('clearHistory').querySelector('span')?.replaceChildren(document.createTextNode(uiText('historyClear')));
    renderHistory();
    openAnimatedDialog(historyDialog);
  });
  byId('closeHistory').addEventListener('click', () => closeAnimatedDialog(historyDialog));
  // 弹出窗口不因点击空白处而关闭（设计约定），关闭只通过关闭按钮或 Esc。
  historyDialog.addEventListener('cancel', event => { event.preventDefault(); closeAnimatedDialog(historyDialog); });
  byId('clearHistory').addEventListener('click', () => {
    if (!clearHistoryArmed) {
      clearHistoryArmed = true;
      byId('clearHistory').classList.add('is-danger');
      byId('clearHistory').querySelector('span')?.replaceChildren(document.createTextNode(uiText('historyClearConfirm')));
      clearTimeout(clearHistoryTimer);
      clearHistoryTimer = setTimeout(() => {
        clearHistoryArmed = false;
        byId('clearHistory').classList.remove('is-danger');
        byId('clearHistory').querySelector('span')?.replaceChildren(document.createTextNode(uiText('historyClear')));
      }, 3000);
      return;
    }
    historyEntries.length = 0;
    try { localStorage.removeItem('acta.history.v1'); } catch { }
    clearHistoryArmed = false;
    byId('clearHistory').classList.remove('is-danger');
    byId('clearHistory').querySelector('span')?.replaceChildren(document.createTextNode(uiText('historyClear')));
    renderHistory();
  });


  const mobileEdgeQuery = matchMedia('(max-width: 800px)');
  const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const mobileEdgeTimers = new WeakMap();
  let mobileEdgeGesture = null;
  const mobileEdgeSurfaceSelector = '.item-list, .editor-pane, .settings-content, .settings-nav';

  document.addEventListener('pointerup', event => {
    if (!mobileEdgeQuery.matches || event.pointerType === 'mouse') return;
    const card = event.target.closest?.('.item-card');
    if (!card) return;
    requestAnimationFrame(() => {
      card.classList.remove('active');
      card.blur();
    });
  }, true);

  const mobileEdgeTargetFor = surface => {
    if (surface.classList.contains('editor-pane')) return surface.querySelector('.editor-wrap');
    if (surface.classList.contains('settings-content')) return surface.querySelector('.settings-panel.active');
    return surface;
  };

  const clearMobileEdgeTarget = target => {
    if (!target) return;
    clearTimeout(mobileEdgeTimers.get(target));
    mobileEdgeTimers.delete(target);
    target.classList.remove('mobile-edge-dragging', 'mobile-edge-returning', 'mobile-edge-target');
    target.style.removeProperty('translate');
  };

  document.addEventListener('touchstart', event => {
    if (!mobileEdgeQuery.matches || reducedMotionQuery.matches || document.body.classList.contains('acta-reduce-motion') || event.touches.length !== 1) return;
    const surface = event.target.closest?.(mobileEdgeSurfaceSelector);
    if (!surface || (surface.classList.contains('editor-pane') && !surface.classList.contains('mobile-open'))) return;
    const target = mobileEdgeTargetFor(surface);
    if (!target) return;
    clearMobileEdgeTarget(target);
    target.classList.add('mobile-edge-target', 'mobile-edge-dragging');
    const touch = event.touches[0];
    mobileEdgeGesture = {
      surface, target, startX: touch.clientX, startY: touch.clientY,
      lastY: touch.clientY, axis: '', edgeDistance: 0, offset: 0, active: false, frame: 0
    };
  }, { passive: true });

  document.addEventListener('touchmove', event => {
    const gesture = mobileEdgeGesture;
    if (!gesture || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const totalX = touch.clientX - gesture.startX;
    const totalY = touch.clientY - gesture.startY;
    const stepY = touch.clientY - gesture.lastY;
    gesture.lastY = touch.clientY;
    if (!gesture.axis && Math.max(Math.abs(totalX), Math.abs(totalY)) >= 5) gesture.axis = Math.abs(totalY) >= Math.abs(totalX) ? 'vertical' : 'horizontal';
    if (gesture.axis !== 'vertical') return;

    const { surface, target } = gesture;
    const atTop = surface.scrollTop <= .5;
    const atBottom = surface.scrollTop + surface.clientHeight >= surface.scrollHeight - .5;
    const pullingTop = atTop && stepY > 0;
    const pullingBottom = atBottom && stepY < 0;
    if (!pullingTop && !pullingBottom) {
      gesture.edgeDistance = 0;
      gesture.offset = 0;
      gesture.active = false;
      target.style.translate = '0px 0px';
      return;
    }

    if (event.cancelable) event.preventDefault();
    if ((pullingTop && gesture.edgeDistance < 0) || (pullingBottom && gesture.edgeDistance > 0)) gesture.edgeDistance = 0;
    gesture.edgeDistance += stepY;
    const direction = gesture.edgeDistance < 0 ? -1 : 1;
    gesture.offset = direction * Math.min(22, Math.sqrt(Math.abs(gesture.edgeDistance)) * 2.05);
    gesture.active = true;
    if (!gesture.frame) gesture.frame = requestAnimationFrame(() => {
      gesture.frame = 0;
      if (target.isConnected) target.style.translate = `0px ${gesture.offset.toFixed(2)}px`;
    });
  }, { passive: false });

  const releaseMobileEdge = () => {
    const gesture = mobileEdgeGesture;
    mobileEdgeGesture = null;
    if (!gesture) return;
    cancelAnimationFrame(gesture.frame);
    const { target } = gesture;
    if (!target.isConnected || !gesture.active) { clearMobileEdgeTarget(target); return; }
    target.style.translate = `0px ${gesture.offset.toFixed(2)}px`;
    target.classList.remove('mobile-edge-dragging');
    target.classList.add('mobile-edge-returning');
    requestAnimationFrame(() => { if (target.isConnected) target.style.translate = '0px 0px'; });
    const timer = window.setTimeout(() => clearMobileEdgeTarget(target), 430);
    mobileEdgeTimers.set(target, timer);
  };
  document.addEventListener('touchend', releaseMobileEdge, { passive: true });
  document.addEventListener('touchcancel', releaseMobileEdge, { passive: true });

  const listResizer = byId('listResizer');
  const applyListWidth = value => {
    uiSettings.listPaneWidth = Math.max(330, Math.min(620, Number(value) || 330));
    document.documentElement.style.setProperty('--list-pane-width', `${uiSettings.listPaneWidth}px`);
  };
  applyListWidth(uiSettings.listPaneWidth);
  listResizer.addEventListener('pointerdown', event => {
    if (matchMedia('(max-width: 800px)').matches) return;
    event.preventDefault();
    listResizer.setPointerCapture(event.pointerId);
    listResizer.classList.add('dragging');
    const startX = event.clientX;
    const startWidth = uiSettings.listPaneWidth;
    const move = moveEvent => applyListWidth(startWidth + moveEvent.clientX - startX);
    const end = () => {
      listResizer.classList.remove('dragging');
      listResizer.removeEventListener('pointermove', move);
      listResizer.removeEventListener('pointerup', end);
      listResizer.removeEventListener('pointercancel', end);
      saveUISettings();
    };
    listResizer.addEventListener('pointermove', move);
    listResizer.addEventListener('pointerup', end);
    listResizer.addEventListener('pointercancel', end);
  });

  function currentLanguage() {
    return uiSettings.language;
  }

  function syncLanguageChoice() {
    const option = document.querySelector(`input[name="actaLanguage"][value="${currentLanguage()}"]`);
    if (option) option.checked = true;
  }

  const rendererTranslateStaticUI = translateStaticUI;
  translateStaticUI = function translateActaInterface() {
    rendererTranslateStaticUI();
    document.documentElement.lang = settings.language === 'en' ? 'en' : settings.language === 'zh-Hant' ? 'zh-Hant' : 'zh-CN';
    applySettingsTranslation();
    updateSidebarToggleLabel();
    updateDataRefreshLabel();
    renderUpdateStatus();
  };

  const rendererFormatDate = formatDate;
  formatDate = function formatLocalizedDate(value, short = false) {
    if (settings.language !== 'zh-Hant') return rendererFormatDate(value, short);
    if (!value) return t('noDate');
    const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
    const today = new Date(`${todayISO()}T12:00:00`);
    const difference = Math.round((date - today) / 86400000);
    if (difference === 0) return t('today');
    if (difference === -1) return t('yesterday');
    return new Intl.DateTimeFormat('zh-Hant', short ? { month:'short', day:'numeric' } : { year:'numeric', month:'short', day:'numeric' }).format(date);
  };

  function applyInterfaceLanguage(locale, notify = false) {
    uiSettings.language = locale;
    settings.language = locale;
    saveUISettings();
    saveRendererSettings();
    renderAll();
    syncLanguageChoice();
    setTimeout(() => {
      updateWorkspaceUI();
      renderDataProfiles();
      updateOneDriveUI();
      updateQuickCaptureCopy();
      const classificationCopy = classificationText();
      byId('manageFolders').title = classificationCopy.manage;
      byId('manageFolders').setAttribute('aria-label', classificationCopy.manage);
      byId('addFolder').title = classificationCopy.add;
      byId('addFolder').setAttribute('aria-label', classificationCopy.add);
      updateFolderActionCopy();
      if (classificationManagerDialog.open) renderClassificationManager();
      lanAutomationRenderHook?.();
      setStatus(byId('generalStatus'), uiText('settingsStored'));
    }, 0);
    if (notify) showToast(t('languageChanged'));
  }

  document.querySelectorAll('input[name="actaLanguage"]').forEach(option => option.addEventListener('change', () => {
    if (!option.checked || option.value === currentLanguage()) return;
    applyInterfaceLanguage(option.value, true);
  }));
  applyInterfaceLanguage(uiSettings.language);

  const defaultViewSetting = byId('defaultViewSetting');
  const compactModeSetting = byId('compactModeSetting');
  const reduceMotionSetting = byId('reduceMotionSetting');
  defaultViewSetting.value = uiSettings.defaultView;
  compactModeSetting.checked = Boolean(uiSettings.compact);
  reduceMotionSetting.checked = Boolean(uiSettings.reduceMotion);
  const backdropCloseSetting = byId('backdropCloseSetting');
  backdropCloseSetting.value = ['none', 'single', 'double'].includes(uiSettings.backdropClose) ? uiSettings.backdropClose : 'double';
  backdropCloseSetting.addEventListener('change', () => {
    uiSettings.backdropClose = backdropCloseSetting.value;
    saveUISettings();
  });

  // —— 页面跳转栏：桌面侧边栏显隐 + 移动底栏槽位 ——
  // 「所有待办」与「所有笔记」默认不在桌面侧栏显示；移动底栏两侧固定为
  // 收集箱、日历，右侧两个槽位由用户在设置中替换。
  // 页面入口的图标描线层：每个按钮只写一份主图标，这里再复制一份作为
  // 覆盖层。主图标始终可见，CSS 只让覆盖层在选中时描线；切换时主图标
  // 淡变颜色、旧描线淡出，不会出现选中/未选中之间的硬切。
  function prepareNavIconTraces() {
    document.querySelectorAll('.nav-section button > span > svg').forEach(svg => {
      if (svg.parentElement?.classList.contains('nav-icon')) return;
      const stack = document.createElement('span');
      stack.className = 'nav-icon';
      svg.replaceWith(stack);
      stack.appendChild(svg);
      const trace = svg.cloneNode(true);
      trace.classList.add('nav-icon-trace');
      trace.setAttribute('aria-hidden', 'true');
      stack.appendChild(trace);
    });
  }
  prepareNavIconTraces();
  const NAV_PAGE_IDS = ['inbox', 'calendar', 'board', 'todos', 'notes', 'trash', 'stats'];
  // 移动底栏左右两端固定为收集箱与日历，中间两个槽位才由用户替换。
  const MOBILE_FIXED_PAGES = ['inbox', 'calendar'];
  // 「局域网雷达」是打开设置页的动作入口而不是视图：可显隐，但不参与
  // 移动底栏槽位，也不进入视图切换逻辑。
  const NAV_ACTION_PAGES = ['lan'];
  const normalizeNavPages = () => {
    const stored = uiSettings.navPages;
    const pages = {};
    [...NAV_PAGE_IDS, ...NAV_ACTION_PAGES].forEach(id => { pages[id] = !(stored && stored[id] === false); });
    return pages;
  };
  const normalizeMobileSlots = () => {
    const pool = NAV_PAGE_IDS.filter(id => !MOBILE_FIXED_PAGES.includes(id));
    const stored = Array.isArray(uiSettings.mobileSlots) ? uiSettings.mobileSlots : [];
    const slots = [];
    // 固定页与重复页都不能占位，否则底栏会空出一格。
    stored.forEach(id => { if (pool.includes(id) && !slots.includes(id) && slots.length < 2) slots.push(id); });
    ['trash', 'stats', ...pool].forEach(id => { if (slots.length < 2 && pool.includes(id) && !slots.includes(id)) slots.push(id); });
    return slots;
  };
  // 移动端顶栏右上角的自定义按钮区：三个槽位 + 固定的设置按钮。
  const MOBILE_TITLE_POOL = ['todos', 'notes', 'board', 'trash', 'stats', 'refresh', 'history', 'lan'];
  const MOBILE_TITLE_DEFAULTS = ['trash', 'stats', 'refresh'];
  const normalizeMobileTitleActions = () => {
    const stored = Array.isArray(uiSettings.mobileTitleActions) ? uiSettings.mobileTitleActions : [];
    const slots = [];
    stored.forEach(id => { if (MOBILE_TITLE_POOL.includes(id) && !slots.includes(id) && slots.length < 3) slots.push(id); });
    [...MOBILE_TITLE_DEFAULTS, ...MOBILE_TITLE_POOL].forEach(id => {
      if (slots.length < 3 && MOBILE_TITLE_POOL.includes(id) && !slots.includes(id)) slots.push(id);
    });
    return slots;
  };
  const mobileTitleButtons = () => {
    const bar = byId('mobileTitlebarActions');
    const buttons = new Map();
    if (bar) {
      ['todos', 'notes', 'board', 'trash', 'stats'].forEach(id => buttons.set(id, bar.querySelector(`button[data-view="${id}"]`)));
      buttons.set('refresh', byId('mobileDataRefresh'));
      buttons.set('history', byId('mobileHistoryButton'));
      buttons.set('lan', byId('mobileLanAction'));
    }
    return buttons;
  };
  const navButtons = () => {
    const nav = byId('smartNav');
    const buttons = new Map();
    if (nav) {
      NAV_PAGE_IDS.forEach(id => buttons.set(id, nav.querySelector(`button[data-view="${id}"]`)));
      NAV_ACTION_PAGES.forEach(id => buttons.set(id, nav.querySelector(`button[data-nav-action="${id}"]`)));
    }
    return buttons;
  };
  const mobileSlotSelects = () => [byId('mobileSlotOne'), byId('mobileSlotTwo')].filter(Boolean);
  // 两个槽位互斥：固定占位的收集箱/日历、以及另一槽位已选中的页面都不可再选，
  // 否则选了也不生效——底栏只会留出一格空位。
  const syncMobileSlotOptions = () => {
    const selects = mobileSlotSelects();
    selects.forEach((select, index) => {
      const other = selects[1 - index]?.value;
      [...select.options].forEach(option => {
        option.disabled = MOBILE_FIXED_PAGES.includes(option.value)
          || (option.value === other && option.value !== select.value);
      });
    });
  };
  function applyNavSettings() {
    const buttons = navButtons();
    const pages = normalizeNavPages();
    // 桌面侧边栏与移动底栏是两套独立结论：侧栏用 .nav-page-hidden 隐藏
    // （只在桌面断点生效），底栏用 mobile-slot-N 决定四个位置。过去两者共用
    // [hidden]，槽位分配时又把 hidden 置回 false，占着槽位的页面开关因此失效。
    buttons.forEach((button, id) => { if (button) button.classList.toggle('nav-page-hidden', pages[id] === false); });
    // 先清空全部槽位标记再按设置重新分配，避免旧类残留。
    buttons.forEach(button => button && button.classList.remove('mobile-slot-1', 'mobile-slot-2', 'mobile-slot-3', 'mobile-slot-4'));
    [...MOBILE_FIXED_PAGES, ...normalizeMobileSlots()].forEach((id, index) => {
      buttons.get(id)?.classList.add(`mobile-slot-${index + 1}`);
    });
    // 移动顶栏：三个槽位由 mobile-title-slot-N 决定，设置按钮固定在末尾。
    const titleButtons = mobileTitleButtons();
    titleButtons.forEach(button => button && button.classList.remove('mobile-title-slot-1', 'mobile-title-slot-2', 'mobile-title-slot-3'));
    normalizeMobileTitleActions().forEach((id, index) => {
      titleButtons.get(id)?.classList.add(`mobile-title-slot-${index + 1}`);
    });
    syncMobileSlotOptions();
    syncMobileTitleOptions();
  }
  const navPageGrid = byId('navPageGrid');
  const navPageInputs = navPageGrid ? [...navPageGrid.querySelectorAll('input[data-nav-page]')] : [];
  navPageInputs.forEach(input => {
    input.checked = normalizeNavPages()[input.dataset.navPage] !== false;
    input.addEventListener('change', () => {
      const pages = normalizeNavPages();
      pages[input.dataset.navPage] = input.checked;
      uiSettings.navPages = pages;
      saveUISettings();
      applyNavSettings();
    });
  });
  const [mobileSlotOne, mobileSlotTwo] = mobileSlotSelects();
  const syncMobileSlotControls = () => {
    const slots = normalizeMobileSlots();
    mobileSlotOne.value = slots[0];
    mobileSlotTwo.value = slots[1];
  };
  syncMobileSlotControls();
  const saveMobileSlots = () => {
    uiSettings.mobileSlots = [mobileSlotOne.value, mobileSlotTwo.value];
    saveUISettings();
    applyNavSettings();
  };
  mobileSlotOne.addEventListener('change', saveMobileSlots);
  mobileSlotTwo.addEventListener('change', saveMobileSlots);
  // 顶栏三个槽位同样互斥：其余槽位与固定设置按钮不提供重复选项。
  const mobileTitleSelects = () => [byId('mobileTitleOne'), byId('mobileTitleTwo'), byId('mobileTitleThree')].filter(Boolean);
  const syncMobileTitleControls = () => {
    const slots = normalizeMobileTitleActions();
    mobileTitleSelects().forEach((select, index) => { select.value = slots[index] || ''; });
  };
  syncMobileTitleControls();
  function syncMobileTitleOptions() {
    const selects = mobileTitleSelects();
    selects.forEach((select, index) => {
      const others = selects.filter((_, other) => other !== index).map(other => other.value);
      [...select.options].forEach(option => {
        option.disabled = others.includes(option.value) && option.value !== select.value;
      });
    });
  }
  const saveMobileTitleActions = () => {
    uiSettings.mobileTitleActions = mobileTitleSelects().map(select => select.value);
    saveUISettings();
    applyNavSettings();
  };
  mobileTitleSelects().forEach(select => select.addEventListener('change', saveMobileTitleActions));
  applyNavSettings();

  // 侧边栏「局域网雷达」入口：雷达已内嵌在数据同步设置页，这里直接打开
  // 设置并定位到该页，不再经过独立的三级窗口。
  byId('smartNav')?.addEventListener('click', event => {
    if (!event.target.closest('[data-nav-action="lan"]')) return;
    openSettings('cloud');
  });
  // 移动顶栏的雷达入口走同一条路径；历史记录复用桌面 dock 的行为。
  byId('mobileLanAction')?.addEventListener('click', () => openSettings('cloud'));
  byId('mobileHistoryButton')?.addEventListener('click', () => byId('historyButton').click());

  function applyGeneralSettings() {
    document.body.classList.toggle('acta-compact', Boolean(uiSettings.compact));
    document.body.classList.toggle('acta-reduce-motion', Boolean(uiSettings.reduceMotion));
  }

  defaultViewSetting.addEventListener('change', () => {
    uiSettings.defaultView = defaultViewSetting.value;
    saveUISettings();
    setStatus(byId('generalStatus'), uiText('defaultSaved'), 'success');
  });
  compactModeSetting.addEventListener('change', () => {
    uiSettings.compact = compactModeSetting.checked; applyGeneralSettings(); saveUISettings();
    setStatus(byId('generalStatus'), uiText('compactUpdated'), 'success');
  });
  reduceMotionSetting.addEventListener('change', () => {
    uiSettings.reduceMotion = reduceMotionSetting.checked; applyGeneralSettings(); saveUISettings();
    setStatus(byId('generalStatus'), uiText('motionUpdated'), 'success');
  });

  // —— 后台运行（桌面端）：关闭窗口转入系统托盘，局域网发现与自动化继续 ——
  // 仅桌面 Tauri 环境提供；网页与 Android 没有对应能力，保持隐藏。
  const backgroundRunSetting = byId('backgroundRunSetting');
  if (backgroundRunSetting && window.actaDesktop) {
    byId('backgroundRunRow').hidden = false;
    backgroundRunSetting.checked = Boolean(uiSettings.runInBackground);
    // 启动即向原生层同步一次，保证崩溃恢复 / 更新重启后状态一致。
    window.actaDesktop.setRunInBackground?.(Boolean(uiSettings.runInBackground));
    backgroundRunSetting.addEventListener('change', () => {
      uiSettings.runInBackground = backgroundRunSetting.checked;
      saveUISettings();
      window.actaDesktop.setRunInBackground?.(backgroundRunSetting.checked);
      setStatus(byId('generalStatus'), uiText('settingsStored'), 'success');
    });
  }
  // 全屏设置页盖住了系统标题栏：Windows 的最小化 / 最大化改为放在设置头部。
  if (window.actaDesktop?.platform === 'win32') {
    const settingsWindowControls = byId('settingsWindowControls');
    if (settingsWindowControls) settingsWindowControls.hidden = false;
    // 与主标题栏同位的三枚窗口按钮：最小化 / 最大化 / 关闭设置页。
    const settingsCloseControl = settingsWindowControls?.querySelector('[data-window-action="close"]');
    if (settingsCloseControl) settingsCloseControl.addEventListener('click', () => closeSettings());
    // Windows 习惯把返回放到左下角：右上只留窗口按钮。
    const settingsClose = byId('settingsClose');
    if (settingsClose) settingsClose.hidden = true;
    const backDock = byId('settingsBackDock');
    if (backDock) {
      backDock.hidden = false;
      backDock.addEventListener('click', () => closeSettings());
    }
  }
  byId('clearCacheReload').addEventListener('click', async () => {
    if (autoSyncBusy) {
      setStatus(byId('generalStatus'), uiText('cacheSyncBusy'), 'error');
      return;
    }
    if (!window.confirm(uiText('clearCacheConfirm'))) return;
    const button = byId('clearCacheReload');
    button.disabled = true;
    setStatus(byId('generalStatus'), uiText('clearingCache'));
    clearInterval(autoSyncTimer);
    autoSyncTimer = null;
    clearTimeout(autoSyncSaveTimer);
    autoSyncSaveTimer = null;
    clearTimeout(saveTimer);
    try {
      saveRendererSettings();
      await flushCurrentDataProfile();
      await workspaceWriteQueue.catch(() => {});
      const nativeCacheClear = window.actaDesktop?.clearAppCache || window.Capacitor?.Plugins?.ActaSync?.clearAppCache;
      const preservedLocalStorage = nativeCacheClear
        ? Array.from({ length:localStorage.length }, (_, index) => localStorage.key(index))
          .filter(Boolean)
          .map(key => [key, localStorage.getItem(key)])
        : [];
      if (window.actaDesktop?.clearAppCache) await window.actaDesktop.clearAppCache();
      if (window.Capacitor?.Plugins?.ActaSync?.clearAppCache) await window.Capacitor.Plugins.ActaSync.clearAppCache();
      if (preservedLocalStorage.length) {
        localStorage.clear();
        preservedLocalStorage.forEach(([key, value]) => localStorage.setItem(key, value));
      }
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }
      window.location.reload();
    } catch (error) {
      button.disabled = false;
      configureAutomaticSync();
      setStatus(byId('generalStatus'), uiText('clearCacheFailed', error.message), 'error');
    }
  });
  applyGeneralSettings();

  const noteHeadingH1Size = byId('noteHeadingH1Size');
  const noteHeadingH2Size = byId('noteHeadingH2Size');
  const noteHeadingH3Size = byId('noteHeadingH3Size');
  const noteBaseSize = byId('noteBaseSize');
  const noteBaseSizeValue = byId('noteBaseSizeValue');
  const noteHeadingFont = byId('noteHeadingFont');
  const noteHeadingCustomFont = byId('noteHeadingCustomFont');
  const noteHeadingCustomFontRow = byId('noteHeadingCustomFontRow');
  const noteLineHeight = byId('noteLineHeight');
  const noteLineHeightValue = byId('noteLineHeightValue');
  const noteParagraphGap = byId('noteParagraphGap');
  const noteParagraphGapValue = byId('noteParagraphGapValue');
  const noteToolbarPosition = byId('noteToolbarPosition');
  const noteToolbarShowLabels = byId('noteToolbarShowLabels');
  const noteHeadingSizes = {
    noteHeadingH1Size: new Set([26, 28, 30, 32, 36, 40]),
    noteHeadingH2Size: new Set([20, 22, 24, 26, 28, 32]),
    noteHeadingH3Size: new Set([16, 17, 18, 19, 20, 22, 24])
  };
  const noteLineHeightRange = [1, 2];
  // 行距以 0.1 为一档，超出 1.0-2.0 的历史值回退默认。
  const normalizeNoteLineHeight = value => {
    const next = Math.round(Number(value) * 10) / 10;
    return Number.isFinite(next) ? Math.min(noteLineHeightRange[1], Math.max(noteLineHeightRange[0], next)) : defaultUISettings.noteLineHeight;
  };
  // 段落块间距以 em 计（相对正文字号），0.1 一档，0 表示紧贴。
  const normalizeNoteParagraphGap = value => {
    const next = Math.round(Number(value) * 10) / 10;
    return Number.isFinite(next) ? Math.min(2, Math.max(0, next)) : defaultUISettings.noteParagraphGap;
  };
  // 「标题样式」旧值迁移为字体：衬线样式与 modern/accent 的无衬线各归其位，装饰条不再保留。
  if (uiSettings.noteHeadingStyle) {
    uiSettings.noteHeadingFont = { classic: 'serif', modern: 'app', accent: 'app' }[uiSettings.noteHeadingStyle] || defaultUISettings.noteHeadingFont;
    delete uiSettings.noteHeadingStyle;
  }
  const noteHeadingFontStack = () => {
    const safeCustomFont = (uiSettings.noteHeadingCustomFont || 'Georgia').replace(/[;{}<>]/g, '').trim() || 'Georgia';
    uiSettings.noteHeadingCustomFont = safeCustomFont;
    return {
      app: 'var(--acta-app-font)',
      serif: 'Georgia, "Noto Serif CJK SC", "Songti SC", serif',
      rounded: '"Arial Rounded MT Bold", "PingFang SC", "Microsoft YaHei", sans-serif',
      mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
      custom: `${safeCustomFont}, "Segoe UI", "Microsoft YaHei", sans-serif`
    }[uiSettings.noteHeadingFont] || 'Georgia, "Noto Serif CJK SC", "Songti SC", serif';
  };

  function applyNoteEditorSettings() {
    const root = document.documentElement;
    Object.entries(noteHeadingSizes).forEach(([key, allowed]) => {
      const fallback = defaultUISettings[key];
      const value = Number(uiSettings[key]);
      uiSettings[key] = allowed.has(value) ? value : fallback;
    });
    const baseSize = Number(uiSettings.noteBaseSize);
    uiSettings.noteBaseSize = baseSize >= 13 && baseSize <= 22 ? baseSize : defaultUISettings.noteBaseSize;
    uiSettings.noteLineHeight = normalizeNoteLineHeight(uiSettings.noteLineHeight);
    uiSettings.noteParagraphGap = normalizeNoteParagraphGap(uiSettings.noteParagraphGap);
    if (!['app', 'serif', 'rounded', 'mono', 'custom'].includes(uiSettings.noteHeadingFont)) uiSettings.noteHeadingFont = defaultUISettings.noteHeadingFont;
    if (!['top', 'bottom'].includes(uiSettings.noteToolbarPosition)) uiSettings.noteToolbarPosition = defaultUISettings.noteToolbarPosition;
    uiSettings.noteToolbarShowLabels = Boolean(uiSettings.noteToolbarShowLabels);
    root.style.setProperty('--note-body-size', `${uiSettings.noteBaseSize}px`);
    root.style.setProperty('--note-heading-h1-size', `${uiSettings.noteHeadingH1Size}px`);
    root.style.setProperty('--note-heading-h2-size', `${uiSettings.noteHeadingH2Size}px`);
    root.style.setProperty('--note-heading-h3-size', `${uiSettings.noteHeadingH3Size}px`);
    root.style.setProperty('--note-line-height', String(uiSettings.noteLineHeight));
    root.style.setProperty('--note-paragraph-gap', String(uiSettings.noteParagraphGap));
    root.style.setProperty('--note-heading-font', noteHeadingFontStack());
    root.dataset.noteToolbarPosition = uiSettings.noteToolbarPosition;
    root.dataset.noteToolbarLabels = uiSettings.noteToolbarShowLabels ? 'show' : 'hide';
    noteBaseSize.value = String(uiSettings.noteBaseSize);
    noteBaseSizeValue.textContent = `${uiSettings.noteBaseSize} px`;
    noteHeadingH1Size.value = String(uiSettings.noteHeadingH1Size);
    noteHeadingH2Size.value = String(uiSettings.noteHeadingH2Size);
    noteHeadingH3Size.value = String(uiSettings.noteHeadingH3Size);
    noteHeadingFont.value = uiSettings.noteHeadingFont;
    noteHeadingCustomFont.value = uiSettings.noteHeadingCustomFont;
    noteHeadingCustomFontRow.classList.toggle('show', uiSettings.noteHeadingFont === 'custom');
    noteLineHeight.value = String(uiSettings.noteLineHeight);
    noteLineHeightValue.textContent = String(uiSettings.noteLineHeight);
    noteParagraphGap.value = String(uiSettings.noteParagraphGap);
    noteParagraphGapValue.textContent = `${uiSettings.noteParagraphGap.toFixed(1)} em`;
    noteToolbarPosition.value = uiSettings.noteToolbarPosition;
    noteToolbarShowLabels.checked = uiSettings.noteToolbarShowLabels;
  }

  const nearestAllowedSize = (value, allowed) => [...allowed].reduce((best, item) => Math.abs(item - value) < Math.abs(best - value) ? item : best);

  // 基准字号按比例联动三个标题：拖动滑块时正文与标题整体缩放，
  // 各标题取字号档位中最接近换算结果的值。
  noteBaseSize.addEventListener('input', () => {
    const next = Number(noteBaseSize.value);
    const previous = Number(uiSettings.noteBaseSize) || defaultUISettings.noteBaseSize;
    if (next && previous && next !== previous) {
      const ratio = next / previous;
      uiSettings.noteHeadingH1Size = nearestAllowedSize(uiSettings.noteHeadingH1Size * ratio, noteHeadingSizes.noteHeadingH1Size);
      uiSettings.noteHeadingH2Size = nearestAllowedSize(uiSettings.noteHeadingH2Size * ratio, noteHeadingSizes.noteHeadingH2Size);
      uiSettings.noteHeadingH3Size = nearestAllowedSize(uiSettings.noteHeadingH3Size * ratio, noteHeadingSizes.noteHeadingH3Size);
    }
    uiSettings.noteBaseSize = next;
    applyNoteEditorSettings();
  });
  noteBaseSize.addEventListener('change', () => { saveUISettings(); });

  [
    [noteHeadingH1Size, 'noteHeadingH1Size'],
    [noteHeadingH2Size, 'noteHeadingH2Size'],
    [noteHeadingH3Size, 'noteHeadingH3Size']
  ].forEach(([field, key]) => field.addEventListener('change', () => {
    uiSettings[key] = Number(field.value);
    applyNoteEditorSettings();
    saveUISettings();
  }));
  noteHeadingFont.addEventListener('change', () => {
    uiSettings.noteHeadingFont = noteHeadingFont.value;
    applyNoteEditorSettings();
    saveUISettings();
    if (uiSettings.noteHeadingFont === 'custom') noteHeadingCustomFont.focus();
  });
  noteHeadingCustomFont.addEventListener('input', () => {
    uiSettings.noteHeadingCustomFont = noteHeadingCustomFont.value;
    applyNoteEditorSettings();
    saveUISettings();
  });
  noteLineHeight.addEventListener('input', () => {
    uiSettings.noteLineHeight = normalizeNoteLineHeight(noteLineHeight.value);
    applyNoteEditorSettings();
  });
  noteLineHeight.addEventListener('change', () => {
    uiSettings.noteLineHeight = normalizeNoteLineHeight(noteLineHeight.value);
    applyNoteEditorSettings();
    saveUISettings();
  });
  noteParagraphGap.addEventListener('input', () => {
    uiSettings.noteParagraphGap = normalizeNoteParagraphGap(noteParagraphGap.value);
    applyNoteEditorSettings();
  });
  noteParagraphGap.addEventListener('change', () => {
    uiSettings.noteParagraphGap = normalizeNoteParagraphGap(noteParagraphGap.value);
    applyNoteEditorSettings();
    saveUISettings();
  });
  noteToolbarPosition.addEventListener('change', () => {
    uiSettings.noteToolbarPosition = noteToolbarPosition.value;
    applyNoteEditorSettings();
    saveUISettings();
    renderEditor();
  });
  noteToolbarShowLabels.addEventListener('change', () => {
    uiSettings.noteToolbarShowLabels = noteToolbarShowLabels.checked;
    applyNoteEditorSettings();
    saveUISettings();
  });
  applyNoteEditorSettings();

  const customPaper = byId('customPaperColor');
  const customSidebar = byId('customSidebarColor');
  const customAccent = byId('customAccentColor');
  const customTodo = byId('customTodoColor');
  const customTodoSoft = byId('customTodoSoftColor');
  const customNote = byId('customNoteColor');
  const customNoteSoft = byId('customNoteSoftColor');
  const customCalendar = byId('customCalendarColor');
  const customCalendarSoft = byId('customCalendarSoftColor');
  const darkThemes = new Set(['mono-dark', 'neon-ocean', 'aurora-night', 'mws-dark']);
  const glowThemes = new Set(['neon-ocean', 'aurora-night']);
  const safeThemeColor = (value, fallback) => /^#[\da-f]{6}$/i.test(String(value || '')) ? String(value) : fallback;
  const customThemeFields = [
    [customPaper, 'customPaper', defaultUISettings.customPaper],
    [customSidebar, 'customSidebar', defaultUISettings.customSidebar],
    [customAccent, 'customAccent', defaultUISettings.customAccent],
    [customTodo, 'customTodo', defaultUISettings.customTodo],
    [customTodoSoft, 'customTodoSoft', defaultUISettings.customTodoSoft],
    [customNote, 'customNote', defaultUISettings.customNote],
    [customNoteSoft, 'customNoteSoft', defaultUISettings.customNoteSoft],
    [customCalendar, 'customCalendar', defaultUISettings.customCalendar],
    [customCalendarSoft, 'customCalendarSoft', defaultUISettings.customCalendarSoft]
  ];
  customThemeFields.forEach(([input, key, fallback]) => {
    uiSettings[key] = safeThemeColor(uiSettings[key], fallback);
    input.value = uiSettings[key];
  });

  const isDarkSystemBarColor = color => {
    const match = String(color || '').trim().match(/^#([\da-f]{6})$/i);
    if (!match) return darkThemes.has(uiSettings.theme);
    const channels = [0, 2, 4].map(offset => parseInt(match[1].slice(offset, offset + 2), 16) / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722 < .42;
  };

  const currentSystemBarColor = () => getComputedStyle(document.documentElement).getPropertyValue('--sidebar').trim() || '#e6e6e6';

  // 安卓系统栏颜色跟随标题栏的实际底色：MWS 浅色等主题会整体重绘标题栏
  // （品牌绿），状态栏若仍取 --sidebar 就会出现配色错位、或看起来「没切换」。
  const systemBarColorForChrome = () => {
    const bar = document.querySelector('.titlebar');
    const background = bar ? getComputedStyle(bar).backgroundColor : '';
    const match = background.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/);
    if (!match) return currentSystemBarColor();
    if (match[4] !== undefined && Number(match[4]) < 0.5) return currentSystemBarColor();
    const hex = [match[1], match[2], match[3]].map(part => Number(part).toString(16).padStart(2, '0')).join('');
    return `#${hex}`;
  };

  function syncNativeSystemBar(color = currentSystemBarColor()) {
    const lightIcons = isDarkSystemBarColor(color);
    const nativeSystemBars = window.Capacitor?.Plugins?.ActaSync;
    if (nativeSystemBars?.setSystemBars) nativeSystemBars.setSystemBars({ color }).catch(() => {});
    const nativeStatusBar = window.Capacitor?.Plugins?.StatusBar;
    if (!nativeStatusBar) return;
    nativeStatusBar.setOverlaysWebView({ overlay:false }).catch(() => {});
    nativeStatusBar.setBackgroundColor({ color }).catch(() => {});
    nativeStatusBar.setStyle({ style:lightIcons ? 'DARK' : 'LIGHT' }).catch(() => {});
  }

  function applyTheme() {
    const root = document.documentElement;
    const isDark = darkThemes.has(uiSettings.theme);
    root.dataset.actaTheme = isDark ? 'mono-dark' : uiSettings.theme;
    root.dataset.actaPalette = uiSettings.theme;
    if (glowThemes.has(uiSettings.theme)) root.dataset.actaGlow = 'true';
    else delete root.dataset.actaGlow;
    const isCustom = uiSettings.theme === 'custom';
    ['--paper', '--panel', '--sidebar', '--sage', '--sage-2', '--todo-accent', '--todo-soft', '--todo-wash', '--note-accent', '--note-soft', '--note-wash', '--calendar-theme-accent', '--calendar-theme-soft'].forEach(property => root.style.removeProperty(property));
    if (isCustom) {
      root.style.setProperty('--paper', uiSettings.customPaper);
      root.style.setProperty('--panel', uiSettings.customPaper);
      root.style.setProperty('--sidebar', uiSettings.customSidebar);
      root.style.setProperty('--sage', uiSettings.customAccent);
      root.style.setProperty('--sage-2', `${uiSettings.customAccent}22`);
      root.style.setProperty('--todo-accent', uiSettings.customTodo);
      root.style.setProperty('--todo-soft', uiSettings.customTodoSoft);
      root.style.setProperty('--todo-wash', `color-mix(in srgb, ${uiSettings.customTodoSoft} 42%, ${uiSettings.customPaper})`);
      root.style.setProperty('--note-accent', uiSettings.customNote);
      root.style.setProperty('--note-soft', uiSettings.customNoteSoft);
      root.style.setProperty('--note-wash', `color-mix(in srgb, ${uiSettings.customNoteSoft} 42%, ${uiSettings.customPaper})`);
      root.style.setProperty('--calendar-theme-accent', uiSettings.customCalendar);
      root.style.setProperty('--calendar-theme-soft', uiSettings.customCalendarSoft);
    }
    byId('customColorSettings').classList.toggle('show', isCustom);
    document.querySelectorAll('input[name="actaTheme"]').forEach(option => option.checked = option.value === uiSettings.theme);
    byId('customSwatchPaper').style.background = uiSettings.customPaper;
    byId('customSwatchSidebar').style.background = uiSettings.customSidebar;
    byId('customSwatchAccent').style.background = uiSettings.customAccent;
    document.querySelector('meta[name="color-scheme"]').content = isDark ? 'dark' : 'light';
    const statusColor = systemBarColorForChrome();
    document.querySelector('meta[name="theme-color"]').content = statusColor;
    syncNativeSystemBar(statusColor);
    // Persist the splash background color (the body's sidebar tone, which the
    // splash layer uses) so the desktop client can paint the native window
    // background with it before the webview loads on the next launch.
    window.__TAURI__?.core?.invoke('save_theme_color', { color: getComputedStyle(root).getPropertyValue('--sidebar').trim() || '#ebe7dc' }).catch(() => {});
  }

  document.querySelectorAll('input[name="actaTheme"]').forEach(option => option.addEventListener('change', () => {
    if (!option.checked) return;
    uiSettings.theme = option.value; applyTheme(); saveUISettings();
  }));
  customThemeFields.forEach(([input, key]) => input.addEventListener('input', () => {
    uiSettings.theme = 'custom';
    uiSettings[key] = input.value;
    applyTheme(); saveUISettings();
  }));
  applyTheme();

  const splashAnimationSetting = byId('splashAnimationSetting');
  const splashPresetSetting = byId('splashPresetSetting');
  const splashSpeedSetting = byId('splashSpeedSetting');
  const splashSpeedValue = byId('splashSpeedValue');
  const splashPresetChoices = new Set(['acta-lines', 'calm-fade', 'focus-zoom']);
  const clampSplashSpeed = value => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(2, Math.max(0.5, parsed)) : 1;
  };
  if (!splashPresetChoices.has(uiSettings.splashAnimationPreset)) uiSettings.splashAnimationPreset = 'acta-lines';
  uiSettings.splashAnimationSpeed = clampSplashSpeed(uiSettings.splashAnimationSpeed);
  // 存储值 = 时长倍率（直接喂给 --splash-speed）；滑杆对外展示的是"速度倍率"= 1/时长，
  // 数值越大播放越快，修复此前标注与实际效果相反的问题。
  const formatSplashSpeed = value => `${value.toFixed(1)}×`;
  const splashDurationToSpeed = duration => Math.round((1 / clampSplashSpeed(duration)) * 10) / 10;
  const splashSpeedToDuration = speed => Math.round((1 / clampSplashSpeed(speed)) * 100) / 100;
  // Mirrors the boot-time priming in theme-boot.js: the <html> attribute and
  // --splash-speed drive the splash CSS, and the replay preview in the
  // settings panel picks them up from there.
  const applySplashSettings = () => {
    const root = document.documentElement;
    if (uiSettings.splashAnimationEnabled) delete root.dataset.actaSplashOff;
    else root.dataset.actaSplashOff = 'true';
    root.style.setProperty('--splash-speed', String(uiSettings.splashAnimationSpeed));
    if (uiSettings.splashAnimationPreset === 'acta-lines') delete root.dataset.actaSplashPreset;
    else root.dataset.actaSplashPreset = uiSettings.splashAnimationPreset;
  };
  splashAnimationSetting.checked = uiSettings.splashAnimationEnabled !== false;
  splashPresetSetting.value = uiSettings.splashAnimationPreset;
  splashSpeedSetting.value = String(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
  splashSpeedValue.textContent = formatSplashSpeed(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
  splashAnimationSetting.addEventListener('change', () => {
    uiSettings.splashAnimationEnabled = splashAnimationSetting.checked;
    applySplashSettings();
    saveUISettings();
  });
  splashPresetSetting.addEventListener('change', () => {
    if (!splashPresetChoices.has(splashPresetSetting.value)) return;
    uiSettings.splashAnimationPreset = splashPresetSetting.value;
    applySplashSettings();
    saveUISettings();
  });
  splashSpeedSetting.addEventListener('input', () => {
    splashSpeedValue.textContent = formatSplashSpeed(Number(splashSpeedSetting.value) || 1);
  });
  splashSpeedSetting.addEventListener('change', () => {
    uiSettings.splashAnimationSpeed = splashSpeedToDuration(Number(splashSpeedSetting.value));
    splashSpeedSetting.value = String(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
    splashSpeedValue.textContent = formatSplashSpeed(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
    applySplashSettings();
    saveUISettings();
  });
  // 输入框选中动画：开 = 边框与光环平滑淡入；关 = 恢复瞬跳。持久化在
  // <html data-input-focus-animation>，CSS 据此启停过渡与展开动画。
  const focusAnimationSetting = byId('focusAnimationSetting');
  const applyFocusAnimation = () => {
    if (uiSettings.inputFocusAnimation !== false) delete document.documentElement.dataset.inputFocusAnimation;
    else document.documentElement.dataset.inputFocusAnimation = 'off';
  };
  focusAnimationSetting.checked = uiSettings.inputFocusAnimation !== false;
  focusAnimationSetting.addEventListener('change', () => {
    uiSettings.inputFocusAnimation = focusAnimationSetting.checked;
    applyFocusAnimation();
    saveUISettings();
  });
  applyFocusAnimation();
  // 子待办完成时间：开启时已完成子任务在勾选框旁显示完成日期（悬停看
  // 精确时刻），关闭后隐藏；显示偏好持久化在 <html data-subtask-dates>。
  const subtaskDatesSetting = byId('subtaskDatesSetting');
  const applySubtaskDates = () => {
    if (uiSettings.subtaskCompletedDates !== false) delete document.documentElement.dataset.subtaskDates;
    else document.documentElement.dataset.subtaskDates = 'off';
  };
  subtaskDatesSetting.checked = uiSettings.subtaskCompletedDates !== false;
  subtaskDatesSetting.addEventListener('change', () => {
    uiSettings.subtaskCompletedDates = subtaskDatesSetting.checked;
    applySubtaskDates();
    saveUISettings();
    renderEditor();
  });
  applySubtaskDates();
  // 「显示已完成待办」与筛选栏的开关共用同一设置（renderer 的
  // settings.showCompletedTodos），两处 UI 双向同步。
  const showCompletedSetting = byId('showCompletedSetting');
  if (showCompletedSetting) {
    showCompletedSetting.checked = Boolean(settings.showCompletedTodos);
    showCompletedSetting.addEventListener('change', () => {
      settings.showCompletedTodos = showCompletedSetting.checked;
      persist();
      refreshFilteredList();
      const filterBox = document.getElementById('todoShowCompleted');
      if (filterBox) filterBox.checked = settings.showCompletedTodos;
      document.getElementById('todoCompletedToggle')?.classList.toggle('is-active', settings.showCompletedTodos);
    });
  }
  // 已完成待办自动置底：开关与延迟写进 <html data-completed-todo-sink*>，
  // renderer 的渲染循环据此决定置底等待与落位动效；改延迟立即生效。
  const completedSinkSetting = byId('completedTodoSinkSetting');
  const completedSinkDelay = byId('completedTodoSinkDelaySetting');
  const completedSinkDelayValue = byId('completedTodoSinkDelayValue');
  const completedSinkDelayRange = { min: 0.5, max: 5 };
  const clampSinkDelay = value => {
    const seconds = Number(value);
    if (!Number.isFinite(seconds)) return 1;
    return Math.min(completedSinkDelayRange.max, Math.max(completedSinkDelayRange.min, Math.round(seconds * 10) / 10));
  };
  const applyCompletedSink = () => {
    const seconds = clampSinkDelay(uiSettings.completedTodoSinkDelay);
    uiSettings.completedTodoSinkDelay = seconds;
    if (uiSettings.completedTodoSink !== false) delete document.documentElement.dataset.completedTodoSink;
    else document.documentElement.dataset.completedTodoSink = 'off';
    document.documentElement.dataset.completedTodoSinkDelay = String(Math.round(seconds * 1000));
    if (completedSinkSetting) completedSinkSetting.checked = uiSettings.completedTodoSink !== false;
    if (completedSinkDelay) completedSinkDelay.value = String(seconds);
    if (completedSinkDelayValue) completedSinkDelayValue.textContent = `${seconds.toFixed(1)}${uiSettings.language === 'en' ? 's' : ' 秒'}`;
  };
  if (completedSinkSetting) {
    completedSinkSetting.addEventListener('change', () => {
      uiSettings.completedTodoSink = completedSinkSetting.checked;
      applyCompletedSink();
      saveUISettings();
    });
  }
  if (completedSinkDelay) {
    completedSinkDelay.min = String(completedSinkDelayRange.min);
    completedSinkDelay.max = String(completedSinkDelayRange.max);
    completedSinkDelay.step = '0.1';
    completedSinkDelay.addEventListener('input', () => {
      uiSettings.completedTodoSinkDelay = clampSinkDelay(completedSinkDelay.value);
      applyCompletedSink();
      saveUISettings();
    });
  }
  applyCompletedSink();
  byId('previewSplashAnimation').addEventListener('click', () => {
    const button = byId('previewSplashAnimation');
    button.classList.add('is-busy');
    window.actaSplash?.replay();
    setTimeout(() => button.classList.remove('is-busy'), 1200);
  });
  applySplashSettings();

  const appIconPresets = Object.freeze({
    default: './icons/icon-512-square.png',
    positive: './icons/app-icon-positive-page.png',
    outline: './icons/app-icon-outlined-page.png',
    original: './icons/app-icon-original-simple.png'
  });
  const appIconChoices = new Set([...Object.keys(appIconPresets), 'custom']);
  if (!appIconChoices.has(uiSettings.appIconPreset)) uiSettings.appIconPreset = 'default';
  const appearanceText = source => interfaceTranslations[uiSettings.language]?.[source] || source;
  // 3.5.0 起应用图标更换仅保留在移动端（Android activity-alias）。桌面端与
  // 网页端不再提供入口：设置区块按 data-mobile-app-icon-only 显隐，桌面遗留
  // 的持久化运行时图标由 Tauri 启动逻辑清除并回归打包默认图标。
  const iconSourceFor = preset => appIconPresets[preset in appIconPresets ? preset : 'default'];

  async function applyAppIcon() {
    const mobileIcon = window.Capacitor?.Plugins?.ActaSync?.setAppIcon;
    document.querySelectorAll('[data-mobile-app-icon-only]').forEach(control => { control.hidden = !mobileIcon; });
    if (!mobileIcon) {
      // 桌面端 / 网页端：把遗留的预设选择归位即可，不再触碰运行时图标。
      if (uiSettings.appIconPreset !== 'default' || uiSettings.customAppIcon) {
        uiSettings.appIconPreset = 'default';
        uiSettings.customAppIcon = '';
        saveUISettings();
      }
      return true;
    }
    if (uiSettings.appIconPreset === 'custom') {
      uiSettings.appIconPreset = 'default';
      uiSettings.customAppIcon = '';
      saveUISettings();
    }
    document.querySelectorAll('[data-app-icon-preview]').forEach(preview => {
      preview.src = iconSourceFor(preview.dataset.appIconPreview);
    });
    document.querySelectorAll('input[name="actaAppIcon"]').forEach(option => option.checked = option.value === uiSettings.appIconPreset);
    try {
      await mobileIcon({ preset: uiSettings.appIconPreset });
      return true;
    } catch (error) {
      console.error('Failed to apply the Capacitor app icon.', error);
      setStatus(appIconStatus, appearanceText('应用图标应用失败。'), 'error');
      return false;
    }
  }

  const appIconStatus = byId('appIconStatus');
  document.querySelectorAll('input[name="actaAppIcon"]').forEach(option => option.addEventListener('change', async () => {
    if (!option.checked) return;
    uiSettings.appIconPreset = option.value;
    saveUISettings();
    await applyAppIcon();
  }));
  byId('resetAppIcon').addEventListener('click', async () => {
    uiSettings.appIconPreset = 'default';
    uiSettings.customAppIcon = '';
    saveUISettings();
    const applied = await applyAppIcon();
    setStatus(appIconStatus, appearanceText(applied ? '默认图标已恢复。' : '应用图标应用失败。'), applied ? 'success' : 'error');
  });
  void applyAppIcon();

  // 移动端底栏图标：图标+文字（默认）或仅图标。仅图标时 CSS 隐藏文字、
  // 放大并居中图标；未选中的图标统一 50% 不透明度。桌面端不生效。
  const mobileNavStyleSetting = byId('mobileNavStyleSetting');
  if (!['labeled', 'icon'].includes(uiSettings.mobileNavStyle)) uiSettings.mobileNavStyle = 'labeled';
  const applyMobileNavStyle = () => {
    if (uiSettings.mobileNavStyle === 'icon') document.documentElement.dataset.mobileNav = 'icon';
    else delete document.documentElement.dataset.mobileNav;
  };
  mobileNavStyleSetting.value = uiSettings.mobileNavStyle;
  mobileNavStyleSetting.addEventListener('change', () => {
    uiSettings.mobileNavStyle = mobileNavStyleSetting.value === 'icon' ? 'icon' : 'labeled';
    applyMobileNavStyle();
    saveUISettings();
  });
  applyMobileNavStyle();

  const appFontSetting = byId('appFontSetting');
  const customFontFamily = byId('customFontFamily');
  const customFontRow = byId('customFontRow');
  const appFontSizeSetting = byId('appFontSizeSetting');
  const appFontSizeValue = byId('appFontSizeValue');
  const fontSizeRange = Object.freeze({ min:12, max:18, default:14 });
  appFontSetting.value = uiSettings.appFont;
  customFontFamily.value = uiSettings.customFont || 'Inter';
  appFontSizeSetting.min = String(fontSizeRange.min);
  appFontSizeSetting.max = String(fontSizeRange.max);
  appFontSizeSetting.value = String(uiSettings.appFontSize);

  function applyFontSettings() {
    const safeCustomFont = (uiSettings.customFont || 'Inter').replace(/[;{}<>]/g, '').trim() || 'Inter';
    const requestedFontSize = Number(uiSettings.appFontSize);
    uiSettings.customFont = safeCustomFont;
    uiSettings.appFontSize = Number.isFinite(requestedFontSize) && requestedFontSize > 0
      ? Math.min(fontSizeRange.max, Math.max(fontSizeRange.min, Math.round(requestedFontSize)))
      : fontSizeRange.default;
    document.documentElement.dataset.actaFont = uiSettings.appFont;
    document.documentElement.style.setProperty('--acta-custom-font', safeCustomFont);
    const editorFont = {
      system:'"Segoe UI Variable", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
      serif:'Georgia, "Noto Serif CJK SC", "Songti SC", serif',
      rounded:'"Arial Rounded MT Bold", "PingFang SC", "Microsoft YaHei", sans-serif',
      mono:'"SFMono-Regular", Consolas, "Liberation Mono", monospace',
      custom:`${safeCustomFont}, "Segoe UI", "Microsoft YaHei", sans-serif`
    }[uiSettings.appFont] || '"Segoe UI Variable", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
    document.documentElement.style.setProperty('--acta-app-font', editorFont);
    document.documentElement.style.setProperty('--acta-font-scale', String(uiSettings.appFontSize / fontSizeRange.default));
    appFontSizeSetting.value = String(uiSettings.appFontSize);
    appFontSizeValue.textContent = `${uiSettings.appFontSize} px`;
    appFontSizeSetting.setAttribute('aria-valuetext', `${uiSettings.appFontSize} px`);
    customFontRow.classList.toggle('show', uiSettings.appFont === 'custom');
  }

  appFontSetting.addEventListener('change', () => {
    uiSettings.appFont = appFontSetting.value; applyFontSettings(); saveUISettings();
    if (uiSettings.appFont === 'custom') customFontFamily.focus();
  });
  customFontFamily.addEventListener('input', () => {
    uiSettings.customFont = customFontFamily.value; applyFontSettings(); saveUISettings();
  });
  appFontSizeSetting.addEventListener('input', () => {
    uiSettings.appFontSize = Number(appFontSizeSetting.value); applyFontSettings(); saveUISettings();
  });
  applyFontSettings();

  const webDavCredentialStorageKey = 'webdav.credentials.v1';
  const autoSyncSetting = byId('autoSyncSetting');
  const autoSyncInterval = byId('autoSyncInterval');
  // 本地文件夹（OneDrive）同步模式已移除；旧设置里的模式键一并清除，同步统一走 WebDAV。
  delete uiSettings.cloudSyncMode;
  const webDavServer = byId('webDavServer');
  const webDavUsername = byId('webDavUsername');
  const webDavPassword = byId('webDavPassword');
  webDavServer.value = uiSettings.webDavServer || '';
  webDavUsername.value = uiSettings.webDavUsername || '';
  autoSyncSetting.checked = Boolean(uiSettings.autoSync);
  autoSyncInterval.value = String(uiSettings.autoSyncInterval || 5);

  function activateSelectedCloudAdapter(resetBaseline = false) {
    oneDriveAdapter = webDavAdapter;
    if (resetBaseline) {
      oneDriveRemoteVersion = '';
      oneDriveBaselineReady = false;
      autoSyncBaseline = librarySignature();
      autoSyncDirty = false;
    }
    return oneDriveAdapter;
  }

  function updateOneDriveUI(message = '') {
    const connected = Boolean(activateSelectedCloudAdapter());
    byId('webDavConnectionPath').textContent = webDavAdapter
      ? webDavAdapter.label
      : (uiSettings.language === 'en' ? 'WebDAV is not connected' : uiSettings.language === 'zh-Hant' ? '尚未連接 WebDAV' : '尚未连接 WebDAV');
    byId('downloadOneDrive').disabled = !connected;
    byId('uploadOneDrive').disabled = !connected;
    byId('disconnectOneDrive').disabled = !connected;
    autoSyncSetting.disabled = !connected;
    autoSyncInterval.disabled = !connected || !uiSettings.autoSync;
    byId('autoSyncIntervalRow').style.opacity = connected && uiSettings.autoSync ? '1' : '.55';
    if (message) setStatus(byId('oneDriveStatus'), message, connected ? 'success' : '');
    else if (!connected) setStatus(byId('oneDriveStatus'), syncText('choose'));
  }

  function configureAutomaticSync(report = false) {
    clearInterval(autoSyncTimer);
    autoSyncTimer = null;
    autoSyncSetting.checked = Boolean(uiSettings.autoSync);
    autoSyncInterval.value = String(uiSettings.autoSyncInterval || 5);
    updateOneDriveUI();
    if (uiSettings.autoSync && oneDriveAdapter) {
      autoSyncTimer = setInterval(() => runAutomaticSync('interval'), Math.max(1, Number(uiSettings.autoSyncInterval) || 5) * 60000);
      if (report) {
        setStatus(byId('oneDriveStatus'), syncText('waiting'), 'success');
        showSyncNotice(syncText('waiting'));
      }
    } else if (report) {
      setStatus(byId('oneDriveStatus'), oneDriveAdapter ? syncText('disabled') : syncText('choose'));
      showSyncNotice(oneDriveAdapter ? syncText('disabled') : syncText('choose'));
    }
  }

  function scheduleAutomaticSync() {
    clearTimeout(autoSyncSaveTimer);
    if (!uiSettings.autoSync || !oneDriveAdapter) return;
    autoSyncSaveTimer = setTimeout(() => runAutomaticSync('change'), 1800);
  }

  async function refreshCloudVersion() {
    oneDriveRemoteVersion = oneDriveAdapter?.version ? await oneDriveAdapter.version() : '';
    oneDriveBaselineReady = true;
    return oneDriveRemoteVersion;
  }

  async function runAutomaticSync(reason = 'interval') {
    if (autoSyncBusy || !uiSettings.autoSync || !oneDriveAdapter) return;
    autoSyncBusy = true;
    showSyncNotice(syncText('working'), 'working', true);
    setStatus(byId('oneDriveStatus'), syncText('working'));
    try {
      const currentSnapshot = JSON.parse(JSON.stringify(library));
      const currentSignature = librarySignature(currentSnapshot);
      if (oneDriveBaselineReady && (autoSyncDirty || reason === 'change')) {
        const remoteVersion = oneDriveAdapter.version ? await oneDriveAdapter.version() : '';
        if (remoteVersion && oneDriveBaselineReady && oneDriveRemoteVersion && remoteVersion !== oneDriveRemoteVersion) {
          uiSettings.autoSync = false;
          saveUISettings();
          configureAutomaticSync();
          const conflictError = new Error(syncText('conflict'));
          conflictError.code = 'ACTA_SYNC_CONFLICT';
          throw conflictError;
        }
        await oneDriveAdapter.save(currentSnapshot);
        await refreshCloudVersion();
        autoSyncBaseline = currentSignature;
        autoSyncDirty = librarySignature() !== currentSignature;
        setStatus(byId('oneDriveStatus'), syncText('uploaded'), 'success');
        showSyncNotice(syncText('uploaded'));
        if (autoSyncDirty) scheduleAutomaticSync();
      } else {
        try {
          const remoteVersion = oneDriveAdapter.version ? await oneDriveAdapter.version() : '';
          if (oneDriveBaselineReady && remoteVersion && remoteVersion === oneDriveRemoteVersion) {
            setStatus(byId('oneDriveStatus'), syncText('current'), 'success');
            showSyncNotice(syncText('current'));
            return;
          }
          const remoteLibrary = await oneDriveAdapter.load();
          const remoteSignature = librarySignature(remoteLibrary);
          if (!oneDriveBaselineReady && autoSyncDirty && remoteSignature !== currentSignature) {
            uiSettings.autoSync = false;
            saveUISettings();
            configureAutomaticSync();
            const conflictError = new Error(syncText('conflict'));
            conflictError.code = 'ACTA_SYNC_CONFLICT';
            throw conflictError;
          }
          if (remoteSignature !== autoSyncBaseline && remoteSignature !== currentSignature) {
            replaceLibrary(remoteLibrary);
            autoSyncBaseline = remoteSignature;
            autoSyncDirty = false;
            if (workspaceAdapter) await queueWorkspaceSave(remoteLibrary);
            setStatus(byId('oneDriveStatus'), syncText('downloaded'), 'success');
            showSyncNotice(syncText('downloaded'));
          } else {
            autoSyncBaseline = remoteSignature;
            setStatus(byId('oneDriveStatus'), syncText('current'), 'success');
            showSyncNotice(syncText('current'));
          }
          await refreshCloudVersion();
        } catch (error) {
          if (!missingLibraryFile(error)) throw error;
          await oneDriveAdapter.save(currentSnapshot);
          await refreshCloudVersion();
          autoSyncBaseline = currentSignature;
          autoSyncDirty = false;
          setStatus(byId('oneDriveStatus'), syncText('uploaded'), 'success');
          showSyncNotice(syncText('uploaded'));
        }
      }
    } catch (error) {
      const message = error.code === 'ACTA_SYNC_CONFLICT' ? error.message : `${syncText(autoSyncDirty ? 'uploadFail' : 'downloadFail')}${error.message}`;
      setStatus(byId('oneDriveStatus'), message, 'error');
      showSyncNotice(message, 'error');
    } finally {
      autoSyncBusy = false;
    }
  }

  autoSyncSetting.addEventListener('change', async () => {
    uiSettings.autoSync = autoSyncSetting.checked;
    saveUISettings();
    if (uiSettings.autoSync) {
      activateSelectedCloudAdapter(true);
      configureAutomaticSync(true);
      setTimeout(() => runAutomaticSync('interval'), 450);
    } else configureAutomaticSync(true);
  });
  autoSyncInterval.addEventListener('change', () => {
    uiSettings.autoSyncInterval = Number(autoSyncInterval.value);
    saveUISettings();
    configureAutomaticSync(true);
  });

  byId('connectWebDav').addEventListener('click', async () => {
    const server = webDavServer.value.trim();
    const username = webDavUsername.value.trim();
    const password = webDavPassword.value;
    if (!server || !username || !password) {
      setStatus(byId('oneDriveStatus'), syncText('webDavMissing'), 'error');
      return;
    }
    const previousAdapter = webDavAdapter;
    const previousCredentials = webDavCredentials;
    let connectionError = '';
    byId('connectWebDav').disabled = true;
    setStatus(byId('oneDriveStatus'), syncText('working'));
    showSyncNotice(syncText('working'), 'working', true);
    try {
      const adapter = createWebDavAdapter({ server, username, password });
      await adapter.probe();
      webDavCredentials = { server:adapter.config.server, username, password };
      webDavAdapter = adapter;
      uiSettings.webDavServer = adapter.config.server;
      uiSettings.webDavUsername = username;
      webDavServer.value = adapter.config.server;
      await storeDirectoryHandle(webDavCredentialStorageKey, webDavCredentials);
      oneDriveAdapter = adapter;
      saveUISettings();
      await refreshCloudVersion();
      autoSyncBaseline = librarySignature();
      autoSyncDirty = false;
      updateOneDriveUI(syncText('webDavConnected'));
      showSyncNotice(syncText('webDavConnected'));
      configureAutomaticSync();
    } catch (error) {
      webDavAdapter = previousAdapter;
      webDavCredentials = previousCredentials;
      oneDriveAdapter = previousAdapter;
      const message = `${syncText('connectFail')}${error.message}`;
      connectionError = message;
      setStatus(byId('oneDriveStatus'), message, 'error');
      showSyncNotice(message, 'error');
    } finally {
      byId('connectWebDav').disabled = false;
      updateOneDriveUI();
      if (connectionError) setStatus(byId('oneDriveStatus'), connectionError, 'error');
    }
  });

  byId('disconnectOneDrive').addEventListener('click', async () => {
    clearInterval(autoSyncTimer);
    clearTimeout(autoSyncSaveTimer);
    uiSettings.autoSync = false;
    webDavAdapter = null;
    webDavCredentials = null;
    webDavPassword.value = '';
    await removeDirectoryHandle(webDavCredentialStorageKey).catch(() => {});
    oneDriveAdapter = null;
    oneDriveRemoteVersion = '';
    oneDriveBaselineReady = false;
    autoSyncBaseline = '';
    autoSyncDirty = false;
    saveUISettings();
    configureAutomaticSync();
    updateOneDriveUI(syncText('disconnected'));
    showSyncNotice(syncText('disconnected'));
  });

  byId('uploadOneDrive').addEventListener('click', async () => {
    if (!oneDriveAdapter) return;
    showSyncNotice(syncText('working'), 'working', true);
    try {
      const snapshot = JSON.parse(JSON.stringify(library));
      await oneDriveAdapter.save(snapshot);
      await refreshCloudVersion();
      autoSyncBaseline = librarySignature(snapshot);
      autoSyncDirty = false;
      setStatus(byId('oneDriveStatus'), syncText('manualUpload'), 'success');
      showSyncNotice(syncText('manualUpload'));
    } catch (error) {
      const message = `${syncText('uploadFail')}${error.message}`;
      setStatus(byId('oneDriveStatus'), message, 'error');
      showSyncNotice(message, 'error');
    }
  });

  byId('downloadOneDrive').addEventListener('click', async () => {
    if (!oneDriveAdapter || !confirm(syncText('confirm'))) return;
    showSyncNotice(syncText('working'), 'working', true);
    try {
      const remoteLibrary = await oneDriveAdapter.load();
      replaceLibrary(remoteLibrary);
      await refreshCloudVersion();
      autoSyncBaseline = librarySignature(remoteLibrary);
      autoSyncDirty = false;
      if (workspaceAdapter) await queueWorkspaceSave(remoteLibrary);
      setStatus(byId('oneDriveStatus'), syncText('manualDownload'), 'success');
      showSyncNotice(syncText('manualDownload'));
    } catch (error) {
      const message = `${syncText('downloadFail')}${error.message}`;
      setStatus(byId('oneDriveStatus'), message, 'error');
      showSyncNotice(message, 'error');
    }
  });
  updateOneDriveUI();
  configureAutomaticSync();

  // ===== Acta 局域网同步（桌面与 Android 客户端，协议 v2）=====
  // 与同一网络中的其他 Acta 客户端互传完整数据文件夹。协议 v2：
  // 每台设备暴露全部行记数据档案的元数据；推送走两段式确认（先发写入
  // 计划、对方确认后再传数据）；开启「信任此局域网」的设备自动确认。
  // 桌面端桥接由 tauri-bridge.js 提供，Android 桥接由 renderer.js 基于原生
  // ActaLanPlugin 提供，事件与载荷结构两端一致。
  const lanMessages = {
    zh: {
      stateOff:'未开启', stateOn:'可被发现', stateNoDiscovery:'已开启',
      peersHint:'搜索同一 Wi-Fi 或网络中的 Acta 设备。', scanning:'正在搜索附近的 Acta 设备…',
      noPeers:'没有找到其他 Acta 设备。请确认对方已打开 Acta，并在数据同步设置中开启「允许被其他设备发现」。',
      foundPeers:'找到 {0} 台设备，可以直接开始同步。', scanFail:'搜索失败：',
      serviceStartFail:'局域网同步服务启动失败：', serviceOn:'这台设备现在可以被同一局域网中的其他 Acta 发现。',
      serviceOff:'已停止局域网同步，其他设备不再看到这台设备。',
      trustOn:'已开启「信任此局域网」：其他设备现在可以不经确认读取或写入本机行记数据。',
      trustOff:'已关闭「信任此局域网」：其他设备的读取与写入需要逐次确认。',
      pullAction:'导入到本机', pushAction:'发送到对方',
      radarTitle:'设备雷达', radarSubtitle:'同一网络中的 Acta 设备会以气泡出现在本机周围',
      radarHint:'点击设备气泡，提取或发送行记数据', radarSelfName:'本机',
      pullTitle:'导入到本机', pushTitle:'发送到对方', incomingTitle:'收到同步请求',
      pullSubtitle:'从 {0} 获取行记数据到本机（需要对方开启「信任此局域网」）',
      pushSubtitle:'把选定的行记数据发送给 {0}；对方开启「信任此局域网」时自动接收，否则需对方确认',
      incomingSubtitle:'{0} 想要把行记数据发送到这台设备',
      thisDevice:'本机', unknownDevice:'未知设备', platformMacos:'macOS', platformWindows:'Windows', platformOther:'此设备',
      profilesCount:'{0} 份行记数据',
      statsLine:'笔记 {0} · 待办 {1} · 归类 {2}', statsLineShort:'笔记 {0} · 待办 {1}', bytesInfo:'约 {0}',
      filesHeading:'将写入以下文件',
      fileManifest:'acta-manifest.json — 数据清单', fileClassifications:'classifications.json — {0} 个归类',
      fileClassificationsPlain:'classifications.json — 归类文件',
      fileNotes:'notes/ — {0} 个笔记文件', fileTodos:'todos/ — {0} 个待办文件',
      modeHeading:'写入方式',
      modeReplaceTitle:'替换现有档案', modeReplaceHint:'用这份数据覆盖选定的行记数据档案，覆盖前自动备份',
      modeCopyTitle:'复制为新档案', modeCopyHint:'保留现有数据，把这份数据保存为一份新的行记数据档案',
      copyNewProfile:'新档案',
      sendProfileLabel:'发送的行记数据', sendProfileHint:'选择要传给对方的本机档案',
      sendReplaceTitle:'替换对方的档案', sendReplaceHint:'覆盖对方选定的行记数据；对方会先自动备份',
      sendCopyTitle:'复制给对方', sendCopyHint:'在对方设备上保存为一份新的行记数据档案',
      targetProfileLabel:'对方的档案', targetProfileHint:'选择要被替换的对方行记数据',
      peerProfileLabel:'获取的对方数据', peerProfileHint:'选择要获取的对方行记档案',
      localTargetLabel:'替换的目标档案', localTargetHint:'选择本机要被覆盖的行记数据',
      peerUntrusted:'对方未开启「信任此局域网」，无法直接获取其行记数据。请对方在数据同步设置中开启后重新搜索。',
      noticeDetail:'查看详情', noticeReject:'拒绝',
      noticeBody:'{0} 想要把「{1}」{2}。',
      modeReplaceTarget:'替换这台设备上的「{0}」', noticeCopyTarget:'复制为这台设备上的新档案',
      copyNote:'选择「复制为新档案」不会覆盖任何现有数据，也不会创建备份。',
      copyNotePush:'复制给对方不会覆盖对方任何现有数据。',
      backupNotePush:'对方会先自动备份被替换的档案，再执行覆盖。',
      backupNoteIncoming:'确认后会先备份这台设备上的「{0}」，再执行覆盖。',
      backupNote:'覆盖前会先备份「{0}」的当前内容到软件数据文件夹的 backups/lan-sync/。',
      backupDoneAt:'备份位置：{0}',
      confirmOverwrite:'备份并覆盖', confirmSend:'发送数据', confirmCopy:'复制为新档案', confirmReceive:'接收数据', confirm:'确认', cancel:'取消',
      stepPrepare:'准备本机数据', stepRequest:'发送请求并等待对方确认', stepTransfer:'传输数据',
      stepBackup:'备份本机数据', stepFetch:'从对方获取数据', stepWrite:'写入本机档案',
      stepReceive:'接收数据', stepSaveProfile:'保存为新档案',
      progressLine:'已接收 {0}', progressLineTotal:'已接收 {0} / {1}',
      snapshotReady:'已选择「{0}」，可以开始同步。', snapshotFail:'准备数据失败：',
      copyDone:'已将收到的数据保存为新档案「{0}」。', replaceDone:'已把数据写入「{0}」。',
      trustedAutoNotice:'正在自动接收来自 {0} 的数据（已开启信任此局域网）…',
      fetchedNotice:'本机「{0}」档案已被其他设备获取。',
      busyRefused:'正在处理其他同步，已自动拒绝来自 {0} 的请求。',
      peerRefresh:'正在重新搜索 {0}…',
      peerGone:'无法连接 {0}。请确认对方已打开 Acta 并开启「允许被其他设备发现」，且系统防火墙允许 Acta 通信，然后重新搜索设备后再试。',
      rejectToast:'有一台设备尝试连接本机同步，但身份验证未通过；对方的设备列表可能已过期，请在两台设备上重新搜索后再试。',
      targetMissing:'要被替换的档案不存在，可能已被删除。',
      backupFail:'备份失败：', applyFail:'写入数据失败：',
      pullDone:'已从 {0} 导入完整数据文件夹。', pullFail:'导入失败：',
      pushDone:'{0} 已确认接收，数据同步完成。', pushRefused:'{0} 拒绝了这次同步。',
      pushFail:'发送失败：', waitingPeer:'等待对方确认并写入…',
      incomingDone:'已应用来自 {0} 的数据。', incomingFail:'处理同步请求失败：',
      portInvalid:'服务端口需为 1024-65535 之间的数字，或留空自动分配。',
      autoCurrentProfile:'当前档案', autoNewName:'新自动化', autoNoSteps:'尚无步骤',
      autoStepBackup:'自动备份本机数据', autoStepConflict:'冲突检查', autoStepPush:'发送数据到设备', autoStepPull:'从设备导入数据',
      autoBackupSummary:'备份「{0}」的当前内容到本机备份目录',
      autoConflictSummary:'覆盖目标在上次同步后如有改动，取消并报告',
      autoPushReplaceSummary:'把「{0}」发送到设备，覆盖对方的同名档案', autoPushCopySummary:'把「{0}」发送到设备，另存为对方的新档案',
      autoPullReplaceSummary:'从设备取回同名档案，覆盖本机当前档案', autoPullCopySummary:'从设备取回同名档案，另存为本机新档案',
      autoPushReplaceShort:'覆盖同名档案', autoPushCopyShort:'另存为新档案', autoPullReplaceShort:'覆盖当前档案', autoPullCopyShort:'另存为新档案',
      autoTriggerDevice:'发现设备时', autoTriggerDevicePattern:'发现名称含「{0}」的设备时', autoTriggerInterval:'每 {0} 分钟', autoTriggerManual:'手动运行',
      autoTriggerLabel:'触发器', autoTriggerHint:'满足条件时自动按步骤执行',
      autoTriggerPatternLabel:'设备名包含', autoTriggerPatternHint:'留空匹配任意设备',
      autoTriggerIntervalLabel:'检查间隔', autoTriggerIntervalHint:'仅在 Acta 运行且局域网同步开启时检查',
      autoAddStep:'添加步骤', autoAddStepPlaceholder:'选择要添加的步骤…',
      autoSave:'保存', autoCancel:'取消', autoRun:'运行', autoEdit:'编辑', autoDelete:'删除', autoMoveUp:'上移', autoMoveDown:'下移',
      autoNameLabel:'名称', autoEnabledLabel:'启用该自动化', autoSummaryJoin:' · ',
      autoEmpty:'还没有自动化条目。点击「新建自动化」，把备份、冲突检查与收发数据组合成自动流程。',
      autoLastRun:'上次运行 {0}', autoNeverRun:'从未运行',
      autoConfirmDelete:'删除自动化「{0}」？',
      autoRunDone:'自动化「{0}」执行完成。', autoRunFail:'自动化「{0}」执行失败：',
      autoConflictFound:'检测到冲突：「{0}」在上次自动化同步后又有改动，已取消并保留原数据。可先运行自动备份，或手动核对后再试。',
      autoNoPeer:'附近没有匹配的设备，自动化「{0}」本次未执行。', autoPeerGone:'设备不可达：{0}',
      autoBusy:'手动同步正在进行，自动化「{0}」已跳过本次触发。',
      autoBackupDone:'已备份「{0}」', autoPushTargetMissing:'对方设备上没有同名档案「{0}」，可改用「另存为新档案」。', autoPullNothing:'对方设备上没有可导入的行记数据。',
      radarCountFound:'已发现 {0} 台设备', radarCountEmpty:'未发现设备', radarSearching:'查找中…', radarIdle:'自动刷新',
      peerAddress:'地址', peerPort:'端口', peerSystem:'操作系统', peerBrand:'设备品牌', autoRunCount:'已运行 {0} 次'
    },
    en: {
      stateOff:'Off', stateOn:'Discoverable', stateNoDiscovery:'On',
      peersHint:'Scan the same Wi-Fi or network for Acta devices.', scanning:'Scanning for nearby Acta devices…',
      noPeers:'No other Acta devices found. Make sure Acta is open on the other device and “Be discoverable” is on in Data sync.',
      foundPeers:'Found {0} device(s), ready to sync.', scanFail:'Scan failed: ',
      serviceStartFail:'LAN sync service failed to start: ', serviceOn:'This device is now discoverable by other Acta clients on this network.',
      serviceOff:'LAN sync stopped; other devices no longer see this device.',
      trustOn:'“Trust this network” is on: other devices can now read or write this device’s Acta data without confirmation.',
      trustOff:'“Trust this network” is off: reads and writes from other devices require confirmation each time.',
      pullAction:'Import here', pushAction:'Send over',
      radarTitle:'Device radar', radarSubtitle:'Acta devices on the same network appear as bubbles around this device',
      radarHint:'Tap a device bubble to import or send Acta data', radarSelfName:'This device',
      pullTitle:'Import to this device', pushTitle:'Send to the other device', incomingTitle:'Sync request received',
      pullSubtitle:'Fetch Acta data from {0} (requires “Trust this network” on the other device)',
      pushSubtitle:'Send the selected Acta data to {0}; trusted networks receive automatically, otherwise the other side confirms',
      incomingSubtitle:'{0} wants to send Acta data to this device',
      thisDevice:'This device', unknownDevice:'Unknown device', platformMacos:'macOS', platformWindows:'Windows', platformOther:'This device',
      profilesCount:'{0} data profile(s)',
      statsLine:'{0} notes · {1} tasks · {2} classifications', statsLineShort:'{0} notes · {1} tasks', bytesInfo:'~{0}',
      filesHeading:'Files that will be written',
      fileManifest:'acta-manifest.json — data manifest', fileClassifications:'classifications.json — {0} classifications',
      fileClassificationsPlain:'classifications.json — classifications',
      fileNotes:'notes/ — {0} note files', fileTodos:'todos/ — {0} task files',
      modeHeading:'How to write',
      modeReplaceTitle:'Replace a profile', modeReplaceHint:'Overwrite the selected Acta data profile with this data; a backup is created first',
      modeCopyTitle:'Copy as a new profile', modeCopyHint:'Keep existing data; save this data as a new Acta data profile',
      copyNewProfile:'New profile',
      sendProfileLabel:'Acta data to send', sendProfileHint:'Choose the local profile to send',
      sendReplaceTitle:'Replace the other profile', sendReplaceHint:'Overwrite the profile selected on the other device; it is backed up first',
      sendCopyTitle:'Copy to the other device', sendCopyHint:'Save as a new Acta data profile on the other device',
      targetProfileLabel:'Their profile', targetProfileHint:'Choose which profile on the other device will be replaced',
      peerProfileLabel:'Data to fetch', peerProfileHint:'Choose which profile to fetch from the other device',
      localTargetLabel:'Profile to replace', localTargetHint:'Choose which local profile will be overwritten',
      peerUntrusted:'The other device has not turned on “Trust this network”, so its data cannot be fetched directly. Ask it to enable the option in Data sync, then scan again.',
      noticeDetail:'View details', noticeReject:'Decline',
      noticeBody:'{0} wants to {2} with “{1}”.',
      modeReplaceTarget:'replace “{0}” on this device', noticeCopyTarget:'create a new profile on this device',
      copyNote:'Choosing “Copy as a new profile” overwrites nothing and creates no backup.',
      copyNotePush:'Copying to the other device overwrites none of its existing data.',
      backupNotePush:'The other device backs up the replaced profile automatically before overwriting.',
      backupNoteIncoming:'After you confirm, “{0}” on this device is backed up first, then overwritten.',
      backupNote:'“{0}” is backed up into backups/lan-sync/ inside the software data folder before anything is overwritten.',
      backupDoneAt:'Backup location: {0}',
      confirmOverwrite:'Back up and overwrite', confirmSend:'Send data', confirmCopy:'Copy as a new profile', confirmReceive:'Receive data', confirm:'Confirm', cancel:'Cancel',
      stepPrepare:'Prepare local data', stepRequest:'Send request and wait for confirmation', stepTransfer:'Transfer data',
      stepBackup:'Back up local data', stepFetch:'Fetch from the other device', stepWrite:'Write into the local profile',
      stepReceive:'Receive data', stepSaveProfile:'Save as a new profile',
      progressLine:'Received {0}', progressLineTotal:'Received {0} / {1}',
      snapshotReady:'“{0}” is selected and ready to sync.', snapshotFail:'Failed to prepare data: ',
      copyDone:'Saved the incoming data as the new profile “{0}”.', replaceDone:'Wrote the data into “{0}”.',
      trustedAutoNotice:'Automatically receiving data from {0} (Trust this network is on)…',
      fetchedNotice:'The profile “{0}” on this device was fetched by another device.',
      busyRefused:'Another sync is in progress; the request from {0} was declined automatically.',
      peerRefresh:'Searching for {0} again…',
      peerGone:'Cannot reach {0}. Make sure Acta is open there with “Be discoverable” on and the system firewall allows Acta, then scan for devices again.',
      rejectToast:'A device tried to sync with this one but failed verification; its device list may be out of date. Scan for devices on both sides and try again.',
      targetMissing:'The profile to replace no longer exists; it may have been deleted.',
      backupFail:'Backup failed: ', applyFail:'Failed to write data: ',
      pullDone:'Imported the complete data folder from {0}.', pullFail:'Import failed: ',
      pushDone:'{0} accepted the data; sync is complete.', pushRefused:'{0} declined this sync.',
      pushFail:'Send failed: ', waitingPeer:'Waiting for the other device to confirm and write…',
      incomingDone:'Applied the data from {0}.', incomingFail:'Failed to handle the sync request: ',
      portInvalid:'The service port must be a number between 1024 and 65535, or left empty for automatic assignment.',
      autoCurrentProfile:'Current profile', autoNewName:'New automation', autoNoSteps:'No steps yet',
      autoStepBackup:'Back up local data', autoStepConflict:'Conflict check', autoStepPush:'Send data to device', autoStepPull:'Import from device',
      autoBackupSummary:'Back up the current contents of “{0}” into the local backup folder',
      autoConflictSummary:'Cancel and report if the overwrite target changed since the last sync',
      autoPushReplaceSummary:'Send “{0}” to the device, replacing its same-name profile', autoPushCopySummary:'Send “{0}” to the device, saved as a new profile there',
      autoPullReplaceSummary:'Fetch the same-name profile and replace the local current profile', autoPullCopySummary:'Fetch the same-name profile and save it as a new local profile',
      autoPushReplaceShort:'Replace same-name profile', autoPushCopyShort:'Save as new profile', autoPullReplaceShort:'Replace current profile', autoPullCopyShort:'Save as new profile',
      autoTriggerDevice:'When a device is found', autoTriggerDevicePattern:'When a device named like “{0}” is found', autoTriggerInterval:'Every {0} minutes', autoTriggerManual:'Run manually',
      autoTriggerLabel:'Trigger', autoTriggerHint:'Steps run automatically when the condition is met',
      autoTriggerPatternLabel:'Device name contains', autoTriggerPatternHint:'Leave empty to match any device',
      autoTriggerIntervalLabel:'Check interval', autoTriggerIntervalHint:'Checked only while Acta is running with LAN sync on',
      autoAddStep:'Add step', autoAddStepPlaceholder:'Pick a step to add…',
      autoSave:'Save', autoCancel:'Cancel', autoRun:'Run', autoEdit:'Edit', autoDelete:'Delete', autoMoveUp:'Move up', autoMoveDown:'Move down',
      autoNameLabel:'Name', autoEnabledLabel:'Enable this automation', autoSummaryJoin:' · ',
      autoEmpty:'No automations yet. Click “New automation” to combine backups, conflict checks, and data transfers into an automatic flow.',
      autoLastRun:'Last run {0}', autoNeverRun:'Never run',
      autoConfirmDelete:'Delete automation “{0}”?',
      autoRunDone:'Automation “{0}” finished.', autoRunFail:'Automation “{0}” failed: ',
      autoConflictFound:'Conflict detected: “{0}” changed since the last automated sync; cancelled and nothing was overwritten. Run an automatic backup first, or review manually and retry.',
      autoNoPeer:'No matching device nearby; automation “{0}” did not run this time.', autoPeerGone:'Device unreachable: {0}',
      autoBusy:'A manual sync is in progress; automation “{0}” skipped this trigger.',
      autoBackupDone:'Backed up “{0}”', autoPushTargetMissing:'The device has no same-name profile “{0}”; use “Save as new profile” instead.', autoPullNothing:'The device has no profile to import.',
      radarCountFound:'{0} devices found', radarCountEmpty:'No devices found', radarSearching:'Searching…', radarIdle:'Auto refresh',
      peerAddress:'Address', peerPort:'Port', peerSystem:'OS', peerBrand:'Brand', autoRunCount:'Ran {0} times'
    },
    'zh-Hant': {
      stateOff:'未開啟', stateOn:'可被發現', stateNoDiscovery:'已開啟',
      peersHint:'搜尋同一 Wi-Fi 或網路中的 Acta 裝置。', scanning:'正在搜尋附近的 Acta 裝置…',
      noPeers:'沒有找到其他 Acta 裝置。請確認對方已開啟 Acta，並在資料同步設定中開啟「允許被其他裝置發現」。',
      foundPeers:'找到 {0} 台裝置，可以直接開始同步。', scanFail:'搜尋失敗：',
      serviceStartFail:'區域網路同步服務啟動失敗：', serviceOn:'這台裝置現在可以被同一區域網路中的其他 Acta 發現。',
      serviceOff:'已停止區域網路同步，其他裝置不再看到這台裝置。',
      trustOn:'已開啟「信任此區域網路」：其他裝置現在不經確認即可讀取或寫入本機行記資料。',
      trustOff:'已關閉「信任此區域網路」：其他裝置的讀取與寫入需要逐次確認。',
      pullAction:'匯入到本機', pushAction:'傳送到對方',
      radarTitle:'裝置雷達', radarSubtitle:'同一網路中的 Acta 裝置會以氣泡出現在本機周圍',
      radarHint:'點擊裝置氣泡，提取或傳送行記資料', radarSelfName:'本機',
      pullTitle:'匯入到本機', pushTitle:'傳送到對方', incomingTitle:'收到同步請求',
      pullSubtitle:'從 {0} 取得行記資料到本機（需要對方開啟「信任此區域網路」）',
      pushSubtitle:'把選定的行記資料傳送給 {0}；對方開啟「信任此區域網路」時自動接收，否則需對方確認',
      incomingSubtitle:'{0} 想要把行記資料傳送到這台裝置',
      thisDevice:'本機', unknownDevice:'未知裝置', platformMacos:'macOS', platformWindows:'Windows', platformOther:'此裝置',
      profilesCount:'{0} 份行記資料',
      statsLine:'筆記 {0} · 待辦 {1} · 歸類 {2}', statsLineShort:'筆記 {0} · 待辦 {1}', bytesInfo:'約 {0}',
      filesHeading:'將寫入以下檔案',
      fileManifest:'acta-manifest.json — 資料清單', fileClassifications:'classifications.json — {0} 個歸類',
      fileClassificationsPlain:'classifications.json — 歸類檔案',
      fileNotes:'notes/ — {0} 個筆記檔案', fileTodos:'todos/ — {0} 個待辦檔案',
      modeHeading:'寫入方式',
      modeReplaceTitle:'取代現有檔案', modeReplaceHint:'用這份資料覆寫選定的行記資料檔案，覆寫前自動備份',
      modeCopyTitle:'複製為新檔案', modeCopyHint:'保留現有資料，把這份資料保存為一份新的行記資料檔案',
      copyNewProfile:'新檔案',
      sendProfileLabel:'傳送的行記資料', sendProfileHint:'選擇要傳給對方的本機檔案',
      sendReplaceTitle:'取代對方的檔案', sendReplaceHint:'覆寫對方選定的行記資料；對方會先自動備份',
      sendCopyTitle:'複製給對方', sendCopyHint:'在對方裝置上保存為一份新的行記資料檔案',
      targetProfileLabel:'對方的檔案', targetProfileHint:'選擇要被取代的對方行記資料',
      peerProfileLabel:'取得的對方資料', peerProfileHint:'選擇要取得的對方行記檔案',
      localTargetLabel:'取代的目標檔案', localTargetHint:'選擇本機要被覆寫的行記資料',
      peerUntrusted:'對方未開啟「信任此區域網路」，無法直接取得其行記資料。請對方在資料同步設定中開啟後重新搜尋。',
      noticeDetail:'查看詳情', noticeReject:'拒絕',
      noticeBody:'{0} 想要{2}，資料為「{1}」。',
      modeReplaceTarget:'取代這台裝置上的「{0}」', noticeCopyTarget:'在這台裝置上建立新檔案',
      copyNote:'選擇「複製為新檔案」不會覆寫任何現有資料，也不會建立備份。',
      copyNotePush:'複製給對方不會覆寫對方任何現有資料。',
      backupNotePush:'對方會先自動備份被取代的檔案，再執行覆寫。',
      backupNoteIncoming:'確認後會先備份這台裝置上的「{0}」，再執行覆寫。',
      backupNote:'覆寫前會先備份「{0}」的目前內容到軟體資料資料夾的 backups/lan-sync/。',
      backupDoneAt:'備份位置：{0}',
      confirmOverwrite:'備份並覆寫', confirmSend:'傳送資料', confirmCopy:'複製為新檔案', confirmReceive:'接收資料', confirm:'確認', cancel:'取消',
      stepPrepare:'準備本機資料', stepRequest:'傳送請求並等待對方確認', stepTransfer:'傳輸資料',
      stepBackup:'備份本機資料', stepFetch:'從對方取得資料', stepWrite:'寫入本機檔案',
      stepReceive:'接收資料', stepSaveProfile:'保存為新檔案',
      progressLine:'已接收 {0}', progressLineTotal:'已接收 {0} / {1}',
      snapshotReady:'已選擇「{0}」，可以開始同步。', snapshotFail:'準備資料失敗：',
      copyDone:'已將收到的資料保存為新檔案「{0}」。', replaceDone:'已把資料寫入「{0}」。',
      trustedAutoNotice:'正在自動接收來自 {0} 的資料（已開啟信任此區域網路）…',
      fetchedNotice:'本機「{0}」檔案已被其他裝置取得。',
      busyRefused:'正在處理其他同步，已自動拒絕來自 {0} 的請求。',
      peerRefresh:'正在重新搜尋 {0}…',
      peerGone:'無法連接 {0}。請確認對方已開啟 Acta 並開啟「允許被其他裝置發現」，且系統防火牆允許 Acta 通訊，然後重新搜尋裝置後再試。',
      rejectToast:'有一台裝置嘗試連接本機同步，但身份驗證未通過；對方的裝置清單可能已過期，請在兩台裝置上重新搜尋後再試。',
      targetMissing:'要被取代的檔案不存在，可能已被刪除。',
      backupFail:'備份失敗：', applyFail:'寫入資料失敗：',
      pullDone:'已從 {0} 匯入完整資料資料夾。', pullFail:'匯入失敗：',
      pushDone:'{0} 已確認接收，資料同步完成。', pushRefused:'{0} 拒絕了這次同步。',
      pushFail:'傳送失敗：', waitingPeer:'等待對方確認並寫入…',
      incomingDone:'已套用來自 {0} 的資料。', incomingFail:'處理同步請求失敗：',
      portInvalid:'服務連接埠需為 1024-65535 之間的數字，或留空自動分配。',
      autoCurrentProfile:'目前檔案', autoNewName:'新自動化', autoNoSteps:'尚無步驟',
      autoStepBackup:'自動備份本機資料', autoStepConflict:'衝突檢查', autoStepPush:'傳送資料到裝置', autoStepPull:'從裝置匯入資料',
      autoBackupSummary:'備份「{0}」的目前內容到本機備份目錄',
      autoConflictSummary:'覆寫目標在上次同步後如有變更，取消並報告',
      autoPushReplaceSummary:'把「{0}」傳送到裝置，覆寫對方的同名檔案', autoPushCopySummary:'把「{0}」傳送到裝置，另存為對方的新檔案',
      autoPullReplaceSummary:'從裝置取回同名檔案，覆寫本機目前檔案', autoPullCopySummary:'從裝置取回同名檔案，另存為本機新檔案',
      autoPushReplaceShort:'覆寫同名檔案', autoPushCopyShort:'另存為新檔案', autoPullReplaceShort:'覆寫目前檔案', autoPullCopyShort:'另存為新檔案',
      autoTriggerDevice:'發現裝置時', autoTriggerDevicePattern:'發現名稱含「{0}」的裝置時', autoTriggerInterval:'每 {0} 分鐘', autoTriggerManual:'手動執行',
      autoTriggerLabel:'觸發器', autoTriggerHint:'滿足條件時自動按步驟執行',
      autoTriggerPatternLabel:'裝置名稱包含', autoTriggerPatternHint:'留空符合任意裝置',
      autoTriggerIntervalLabel:'檢查間隔', autoTriggerIntervalHint:'僅在 Acta 執行且區域網路同步開啟時檢查',
      autoAddStep:'新增步驟', autoAddStepPlaceholder:'選擇要新增的步驟…',
      autoSave:'儲存', autoCancel:'取消', autoRun:'執行', autoEdit:'編輯', autoDelete:'刪除', autoMoveUp:'上移', autoMoveDown:'下移',
      autoNameLabel:'名稱', autoEnabledLabel:'啟用此自動化', autoSummaryJoin:' · ',
      autoEmpty:'還沒有自動化條目。點擊「新增自動化」，把備份、衝突檢查與收發資料組合成自動流程。',
      autoLastRun:'上次執行 {0}', autoNeverRun:'從未執行',
      autoConfirmDelete:'刪除自動化「{0}」？',
      autoRunDone:'自動化「{0}」執行完成。', autoRunFail:'自動化「{0}」執行失敗：',
      autoConflictFound:'偵測到衝突：「{0}」在上次自動化同步後又有變更，已取消並保留原資料。可先執行自動備份，或手動核對後再試。',
      autoNoPeer:'附近沒有符合的裝置，自動化「{0}」本次未執行。', autoPeerGone:'裝置無法連接：{0}',
      autoBusy:'手動同步正在進行，自動化「{0}」已跳過本次觸發。',
      autoBackupDone:'已備份「{0}」', autoPushTargetMissing:'對方裝置上沒有同名檔案「{0}」，可改用「另存為新檔案」。', autoPullNothing:'對方裝置上沒有可匯入的行記資料。',
      radarCountFound:'已發現 {0} 台裝置', radarCountEmpty:'未發現裝置', radarSearching:'搜尋中…', radarIdle:'自動重新整理',
      peerAddress:'位址', peerPort:'連接埠', peerSystem:'作業系統', peerBrand:'裝置品牌', autoRunCount:'已執行 {0} 次'
    }
  };
  const lanText = (key, ...values) => values.reduce((message, value, index) => message.replace(`{${index}}`, value), (lanMessages[uiSettings.language] || lanMessages.zh)[key] || '');
  const lanBridge = window.actaDesktop?.lanSync || window.actaMobileLan?.lanSync || null;
  // 事件监听入口：桌面在 actaDesktop，Android 在 renderer.js 注入的 actaMobileLan。
  const lanEvents = window.actaDesktop?.onLanIncoming ? window.actaDesktop : (window.actaMobileLan || {});
  const lanDialog = byId('lanSyncDialog');
  const lanNoticeDialog = byId('lanNoticeDialog');
  let lanServiceRunning = false;
  let lanDiscoverable = false;
  let lanScanning = false;
  let lanPeers = [];
  let lanBusy = false;
  let lanIncomingActive = false;
  let lanDataBusy = false;
  // 已确认写入计划、正在等待数据阶段到达；超时自动复位，避免发送方异常
  // 中断后接收端永远拒绝后续请求。
  let lanDataExpected = false;
  let lanDataExpectTimer = null;
  let lanTrustLan = false;
  let lanConfirmPlan = null;
  let lanConfirmResolve = null;
  // 接收方式（拉取/接收）：replace = 覆盖选定档案（默认），copy = 另存为新档案。
  let lanConfirmMode = 'replace';
  // 推送方式：replace = 覆盖对方选定档案（默认），copy = 在对方设备新建档案。
  let lanSendMode = 'replace';
  // 传输进行中时锁定对话框，防止中途关闭造成半写入状态。
  let lanTransferActive = false;
  // 发送档案的快照缓存：发送对话框里选定档案后只构建一次。
  let lanSendSnapshot = null;
  // 第二阶段数据到达时的写入上下文（含步骤显示）。
  let lanActiveReceiver = null;
  let lanRejectedToastAt = 0;
  let lanSteps = null;
  let lanNoticeResolve = null;

  const lanPlatformLabel = platform => platform === 'macos' ? lanText('platformMacos') : platform === 'windows' ? lanText('platformWindows') : platform || lanText('platformOther');
  const lanRawBytes = bytes => {
    const value = Number(bytes) || 0;
    if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    if (value >= 1024) return `${Math.round(value / 1024)} KB`;
    return `${value} B`;
  };
  const lanFormatBytes = bytes => lanText('bytesInfo', lanRawBytes(bytes));
  const lanProfileLabel = () => activeDataProfile()?.name || uiText('actaData');
  const lanLocalStats = () => ({
    profile: lanProfileLabel(),
    notes: library.items.filter(item => item.type === 'note' && !isTrashed(item)).length,
    todos: library.items.filter(item => item.type === 'todo' && !isTrashed(item)).length,
    classifications: (library.folders || []).length,
    bytes: 0
  });
  // 本机全部档案的元数据（不含数据本体）：供发现列表与本机服务展示。
  const lanProfilesMeta = () => dataProfiles.map(profile => ({ id: profile.id, name: profile.name, notes: profileStats(profile).notes, todos: profileStats(profile).todos }));
  const lanPeerTotals = peer => {
    const profiles = Array.isArray(peer?.profiles) ? peer.profiles : [];
    if (!profiles.length) return { notes: Number(peer?.notes) || 0, todos: Number(peer?.todos) || 0 };
    return profiles.reduce((total, entry) => ({ notes: total.notes + (Number(entry.notes) || 0), todos: total.todos + (Number(entry.todos) || 0) }), { notes: 0, todos: 0 });
  };
  const lanStatsLine = info => {
    const hasClassifications = info.classifications != null;
    const base = hasClassifications ? lanText('statsLine', info.notes || 0, info.todos || 0, info.classifications || 0) : lanText('statsLineShort', info.notes || 0, info.todos || 0);
    return `${base}${info.bytes ? ` · ${lanFormatBytes(info.bytes)}` : ''}`;
  };
  const setLanStatus = (message, state = '') => setStatus(byId('lanSyncStatus'), message, state);

  function updateLanStateUI() {
    const state = byId('lanSyncState');
    if (lanServiceRunning) {
      state.dataset.state = lanDiscoverable ? 'on' : 'partial';
      state.textContent = lanDiscoverable ? lanText('stateOn') : lanText('stateNoDiscovery');
    } else {
      state.dataset.state = 'off';
      state.textContent = lanText('stateOff');
    }
    // 设备雷达：本机气泡的扩散环跟随服务状态。
    byId('lanRadarStage')?.classList.toggle('lan-service-on', lanServiceRunning && lanDiscoverable);
    // 局域网雷达入口（侧边栏动作按钮）：可被发现时播放循环光效。
    document.body.classList.toggle('lan-radar-live', lanServiceRunning && lanDiscoverable);
  }

  // 本机气泡显示自定义名称与图标：自定义值始终优先——设置后占位符图标与
  // 原（主机）名称一并隐藏，只显示自定义内容；仅当本机未自定义时才回退
  // 服务状态（与对外广播一致）和「本机」占位。
  async function lanRenderSelfIdentity() {
    const nameEl = byId('lanRadarSelfName');
    const iconEl = byId('lanRadarSelfIcon');
    const glyph = byId('lanRadarSelfGlyph');
    if (!nameEl || !iconEl || !glyph) return;
    const identity = lanIdentity();
    let name = identity.name;
    let icon = identity.icon;
    try {
      const status = await lanBridge?.serviceStatus?.();
      // 服务未运行时原生层只知道主机名：仅在本机未自定义时采用。
      if (status?.running) {
        if (!name && status.device) name = status.device;
        if (!icon && typeof status.icon === 'string' && status.icon) icon = status.icon;
      }
    } catch { /* 服务未启动，使用本地设置 */ }
    nameEl.textContent = name || lanText('radarSelfName');
    iconEl.textContent = icon;
    // svg 元素（SVGElement）没有 hidden 属性：必须操作 attribute，否则
    // 占位符图标会一直显示并与自定义 emoji 叠在一起。
    iconEl.toggleAttribute('hidden', !icon);
    glyph.toggleAttribute('hidden', Boolean(icon));
  }

  // 构建指定档案的完整数据包与统计：当前档案直接来自内存；其他档案从它
  // 的存储位置读取一次后缓存——非活动档案不会在后台变化。
  async function lanBuildSendBundle(profile) {
    const target = profile || activeDataProfile();
    if (!target) throw new Error(profileText('unavailable'));
    let snapshot;
    if (target.id === activeDataProfile()?.id) {
      lanSendSnapshot = null;
      snapshot = clearLegacyTags(JSON.parse(JSON.stringify(library)));
    } else {
      if (!lanSendSnapshot) {
        const loaded = await loadDataProfileSnapshot(target, true);
        lanSendSnapshot = clearLegacyTags(JSON.parse(JSON.stringify(loaded)));
      }
      snapshot = lanSendSnapshot;
    }
    const items = Array.isArray(snapshot?.items) ? snapshot.items : [];
    return {
      bundle: createPortableDataFolderBundle(snapshot),
      info: {
        profile: target.name,
        notes: items.filter(item => item.type === 'note' && !isTrashed(item)).length,
        todos: items.filter(item => item.type === 'todo' && !isTrashed(item)).length,
        classifications: (snapshot?.folders || []).length
      }
    };
  }

  // 本机身份（名称 / 图标 / 端口）：桌面端与 Android 端共用同一组参数；
  // 名称与图标可运行中热更新，端口变更由设置处显式重启服务生效。
  const lanIdentity = () => ({
    name: String(uiSettings.lanDeviceName || '').trim().slice(0, 40),
    icon: String(uiSettings.lanDeviceIcon || '').trim().slice(0, 8),
    port: Math.min(Math.max(Number(uiSettings.lanPort) || 0, 0), 65535)
  });
  // 档案列表、信任标记或本机身份变化时刷新运行中服务的元数据（轻量，
  // 不含数据本体）；端口的重新绑定由设置变更处显式重启服务完成。
  // 返回元数据刷新的 Promise：调用方等待它完成后再重读本机身份，避免
  // serviceStatus 读到旧值把自定义名覆盖回主机名。
  function lanSyncUpdateMeta() {
    if (!lanBridge || !lanServiceRunning) return Promise.resolve();
    return lanBridge.updateMeta(lanProfilesMeta(), lanTrustLan, lanIdentity()).catch(() => {});
  }

  async function lanStartService() {
    if (!lanBridge) return;
    try {
      const status = await lanBridge.startService(lanProfilesMeta(), lanTrustLan, lanIdentity());
      lanServiceRunning = Boolean(status.running);
      lanDiscoverable = Boolean(status.discoverable);
      if (status?.session) lanOwnSession = status.session;
      void lanRenderSelfIdentity();
    } catch (error) {
      lanServiceRunning = false;
      lanDiscoverable = false;
      setLanStatus(`${lanText('serviceStartFail')}${error.message}`, 'error');
    }
    updateLanStateUI();
  }

  async function lanStopService() {
    if (!lanBridge) return;
    try { await lanBridge.stopService(); } catch { /* 服务可能已经停止 */ }
    lanServiceRunning = false;
    lanDiscoverable = false;
    lanSendSnapshot = null;
    updateLanStateUI();
  }

  // 瞬时失败重试：设备休眠、ARP 未就绪等导致的首次连接失败重试一次即可
  // 恢复；仅用于无副作用的读取类请求。
  const lanRetry = async (work, times = 2) => {
    let lastError;
    for (let attempt = 0; attempt < times; attempt += 1) {
      if (attempt > 0) await new Promise(resolve => setTimeout(resolve, 600));
      try {
        return await work();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };

  // 传输前的对端预检：先用已知地址与令牌验证（首次连接可能因设备休眠或
  // ARP 未就绪而短暂失败，自动重试一次）；若对方重启过服务导致地址与会话
  // 令牌失效，则自动重新搜索一次并按设备名与平台匹配刷新坐标，避免把旧
  // 地址发出去后双方都毫无反馈。
  async function lanResolvePeer(peer) {
    const verify = async candidate => {
      try {
        const info = await lanBridge.fetchInfo(candidate.ip, candidate.port, candidate.session);
        return { ...candidate, trusted: Boolean(info.trusted), profiles: Array.isArray(info.profiles) ? info.profiles : candidate.profiles };
      } catch { return null; }
    };
    let resolved = await verify(peer);
    if (!resolved) {
      await new Promise(resolve => setTimeout(resolve, 600));
      resolved = await verify(peer);
    }
    if (resolved) {
      const index = lanPeers.indexOf(peer);
      if (index >= 0) lanPeers[index] = resolved;
      renderLanPeers();
      return resolved;
    }
    setLanStatus(lanText('peerRefresh', peer.name || lanText('unknownDevice')), 'info');
    try {
      const peers = await lanBridge.discover(1800);
      const candidates = Array.isArray(peers) ? peers : [];
      // 名称 + 系统匹配的全部候选逐个验证：多网卡设备的另一个地址可能才通。
      const fresh = candidates.filter(candidate => (candidate.name === peer.name && candidate.platform === peer.platform) || candidate.ip === peer.ip);
      for (const candidate of fresh) {
        resolved = await verify(candidate);
        if (resolved) {
          const index = lanPeers.indexOf(peer);
          if (index >= 0) lanPeers[index] = resolved;
          renderLanPeers();
          return resolved;
        }
      }
    } catch { /* 重新搜索失败，按不可达处理 */ }
    return null;
  }

  // —— 设备雷达 ——
  // 本机居中，开启「允许被发现」后播放圆形扩散环；扫描到的设备以圆形
  // 气泡从中心非线性滑出渐入（cubic-bezier(.16,1,.3,1)，级联延迟），
  // 点击气泡在旁边弹出发送/提取操作。气泡按 session 差量更新：新设备
  // 播放入场，消失的设备先淡出再移除，已知设备只平移到新落点。
  const lanRadarSeen = new Set();
  let lanRadarMenuPeer = null;

  const closeLanPeerMenu = () => {
    byId('lanRadarStage')?.querySelector('.lan-peer-menu')?.remove();
    lanRadarMenuPeer = null;
  };

  const lanBrandLabel = platform => ({ macos: 'Apple', windows: 'Microsoft', android: 'Android', ios: 'Apple' })[platform] || '—';
  function openLanPeerMenu(peer, wrapper) {
    closeLanPeerMenu();
    const stage = byId('lanRadarStage');
    if (!stage) return;
    const menu = document.createElement('div');
    menu.className = 'lan-peer-menu lan-open';
    const name = peer.name || lanText('unknownDevice');
    menu.innerHTML = `<b>${escapeHTML(name)}</b>
      <div class="lan-peer-meta">
        <span>${escapeHTML(lanText('peerAddress'))}</span><code>${escapeHTML(peer.ip || '—')}</code>
        <span>${escapeHTML(lanText('peerPort'))}</span><code>${peer.port || '—'}</code>
        <span>${escapeHTML(lanText('peerSystem'))}</span><code>${escapeHTML(lanPlatformLabel(peer.platform))}</code>
        <span>${escapeHTML(lanText('peerBrand'))}</span><code>${escapeHTML(lanBrandLabel(peer.platform))}</code>
      </div>
      <button type="button" data-lan-action="pull"><svg><use href="#i-download"/></svg><span>${escapeHTML(lanText('pullAction'))}</span></button>
      <button type="button" data-lan-action="push"><svg><use href="#i-upload"/></svg><span>${escapeHTML(lanText('pushAction'))}</span></button>`;
    const x = parseFloat(wrapper.style.left) || 0;
    const y = parseFloat(wrapper.style.top) || 0;
    const menuWidth = 208;
    let left = x + 40;
    if (left + menuWidth > stage.clientWidth - 8) left = x - 40 - menuWidth;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.style.top = `${Math.max(8, Math.min(y - 24, stage.clientHeight - 130))}px`;
    menu.addEventListener('click', event => {
      const button = event.target.closest('[data-lan-action]');
      if (!button) return;
      const action = button.dataset.lanAction;
      closeLanPeerMenu();
      if (action === 'pull') void pullFromPeer(peer);
      else void pushToPeer(peer);
    });
    stage.appendChild(menu);
    lanRadarMenuPeer = peer;
  }

  const lanRadarRemoveTimers = new Map();
  function renderLanRadar() {
    const stage = byId('lanRadarStage');
    if (!stage) return;
    const centerX = (stage.clientWidth || 360) / 2;
    const centerY = (stage.clientHeight || 340) / 2;
    // 半径必须把「气泡 + 名称」整体推到本机气泡之外：太小（小舞台 + 贴边
    // 余量）时设备会与本机气泡和名称相互压叠，这是重叠反馈的主要来源。
    const radius = Math.max(96, Math.min(stage.clientWidth || 360, stage.clientHeight || 340) / 2 - 62);
    const existing = new Map([...stage.querySelectorAll('.lan-radar-peer')].map(node => [node.dataset.session, node]));
    const present = new Set(lanPeers.map(peer => peer.session));
    existing.forEach((node, session) => {
      if (present.has(session)) return;
      lanRadarSeen.delete(session);
      if (lanRadarMenuPeer?.session === session) closeLanPeerMenu();
      const timer = lanRadarRemoveTimers.get(session);
      if (timer) clearTimeout(timer);
      node.classList.add('is-leaving');
      lanRadarRemoveTimers.set(session, setTimeout(() => {
        node.remove();
        lanRadarRemoveTimers.delete(session);
      }, 240));
    });
    let freshCount = 0;
    lanPeers.forEach((peer, index) => {
      const angle = -Math.PI / 2 + (index / Math.max(lanPeers.length, 1)) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const name = peer.name || lanText('unknownDevice');
      let node = existing.get(peer.session);
      const fresh = !node || !lanRadarSeen.has(peer.session);
      if (!node) {
        node = document.createElement('div');
        node.className = 'lan-radar-peer';
        node.dataset.session = peer.session;
        node.innerHTML = `<button type="button" class="lan-peer-bubble" title="${escapeHTML(name)}" aria-label="${escapeHTML(name)}">${peer.icon ? `<b class="lan-peer-emoji">${escapeHTML(peer.icon)}</b>` : '<svg><use href="#i-database"/></svg>'}</button><span class="lan-peer-name">${escapeHTML(name)}</span>`;
      }
      // 已知设备更新时同步图标（对端可能中途自定义了 emoji）。
      const iconMarkup = peer.icon ? `<b class="lan-peer-emoji">${escapeHTML(peer.icon)}</b>` : '<svg><use href="#i-database"/></svg>';
      if (node.dataset.icon !== (peer.icon || '')) {
        node.dataset.icon = peer.icon || '';
        const bubble = node.querySelector('.lan-peer-bubble');
        if (bubble) bubble.innerHTML = iconMarkup;
      }
      if (fresh) {
        // 设备在离场动画期间重新出现：取消移除计时器，原地恢复。
        const removeTimer = lanRadarRemoveTimers.get(peer.session);
        if (removeTimer) {
          clearTimeout(removeTimer);
          lanRadarRemoveTimers.delete(peer.session);
        }
        // 从本机（中心）滑向落点：CSS 变量提供起点偏移，入场带级联延迟。
        node.style.setProperty('--from-x', `${centerX - x}px`);
        node.style.setProperty('--from-y', `${centerY - y}px`);
        node.style.setProperty('--delay', `${Math.min(freshCount * 45, 180)}ms`);
        // 重新触发动效：已存在的节点先复位动画状态。
        node.classList.remove('is-leaving');
        node.style.animation = 'none';
        void node.offsetWidth;
        node.style.animation = '';
        freshCount += 1;
        lanRadarSeen.add(peer.session);
        if (!node.isConnected) stage.appendChild(node);
      }
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
    });
  }

  function renderLanPeers() {
    renderLanRadar();
  }

  // 本机 session：过滤「自己被当成设备列出」的应答（自身广播回环时原生层
  // 偶尔拦不住），这也是雷达上出现多个自己的直接来源。
  let lanOwnSession = '';
  async function lanRefreshOwnSession() {
    try {
      const status = await lanBridge?.serviceStatus?.();
      if (status?.session) lanOwnSession = status.session;
    } catch { /* 服务未启动 */ }
  }
  // 同一设备会从多个网卡各应答一次（session 相同、ip 不同）：按 session
  // 合并，只留最先到达的一份，雷达不再列出重复设备。
  const lanNormalizePeers = peers => {
    const merged = new Map();
    peers.forEach(peer => {
      if (!peer?.session || (lanOwnSession && peer.session === lanOwnSession)) return;
      if (!merged.has(peer.session)) merged.set(peer.session, peer);
    });
    return [...merged.values()];
  };
  // 雷达状态行：已发现数量与查找状态并列。
  const lanRenderRadarStatus = scanning => {
    const count = byId('lanRadarCount');
    const phase = byId('lanRadarPhase');
    if (count) count.textContent = lanPeers.length ? lanText('radarCountFound', lanPeers.length) : lanText('radarCountEmpty');
    if (phase) phase.textContent = scanning ? lanText('radarSearching') : lanText('radarIdle');
  };

  async function scanLanPeers() {
    if (!lanBridge || lanScanning) return;
    lanScanning = true;
    updateLanStateUI();
    if (!lanOwnSession) void lanRefreshOwnSession();
    lanRenderRadarStatus(true);
    setLanStatus(lanText('scanning'), 'info');
    try {
      const peers = await lanBridge.discover(1800);
      lanPeers = lanNormalizePeers(Array.isArray(peers) ? peers : []);
      renderLanRadar();
      // 扫描结果落地：驱动「发现设备 / 定时」类自动化条目。
      lanAutomationEvaluator?.();
      setLanStatus(lanPeers.length ? lanText('foundPeers', lanPeers.length) : lanText('noPeers'), lanPeers.length ? 'success' : '');
    } catch (error) {
      setLanStatus(`${lanText('scanFail')}${error.message}`, 'error');
    } finally {
      lanScanning = false;
      lanRenderRadarStatus(false);
      updateLanStateUI();
    }
  }

  function lanSideCardHTML(stats, fallbackName) {
    const title = stats.profile || fallbackName || lanText('unknownDevice');
    const subtitle = stats.platform ? lanPlatformLabel(stats.platform) : '';
    return `<b>${escapeHTML(title)}</b>${subtitle ? `<small>${escapeHTML(subtitle)}</small>` : ''}<span>${escapeHTML(lanStatsLine(stats))}</span>`;
  }

  function lanFileListHTML(stats) {
    const classifications = stats.classifications == null
      ? lanText('fileClassificationsPlain')
      : lanText('fileClassifications', stats.classifications || 0);
    return [lanText('fileManifest'), classifications, lanText('fileNotes', stats.notes || 0), lanText('fileTodos', stats.todos || 0)]
      .map(item => `<li>${escapeHTML(item)}</li>`).join('');
  }

  function lanFillSelect(select, entries, selectedId) {
    select.innerHTML = entries.map(entry => `<option value="${escapeHTML(entry.id)}">${escapeHTML(entry.name)} · ${escapeHTML(lanText('statsLineShort', entry.notes || 0, entry.todos || 0))}</option>`).join('');
    if (selectedId && entries.some(entry => entry.id === selectedId)) select.value = selectedId;
  }

  // 依据当前控件状态重算对话框的展示（流向卡片、文件清单、备份说明）。
  function lanRefreshDialog(plan) {
    if (!plan || plan.direction === 'incoming') return;
    if (plan.direction === 'push') {
      const sendProfile = dataProfileById(byId('lanSyncSendProfile').value) || activeDataProfile();
      const sendStats = sendProfile ? profileStats(sendProfile) : { notes: 0, todos: 0 };
      const replace = lanSendMode === 'replace';
      byId('lanSyncTargetProfileRow').hidden = !replace;
      const targetEntry = (plan.peer.profiles || []).find(entry => entry.id === byId('lanSyncTargetProfile').value);
      const sourceStats = { profile: sendProfile?.name || lanProfileLabel(), notes: sendStats.notes || 0, todos: sendStats.todos || 0 };
      const targetStats = replace
        ? { profile: targetEntry?.name || lanText('unknownDevice'), notes: targetEntry?.notes, todos: targetEntry?.todos }
        : { profile: lanText('copyNewProfile'), notes: sourceStats.notes, todos: sourceStats.todos };
      byId('lanSyncSourceSide').innerHTML = lanSideCardHTML(sourceStats, lanText('thisDevice'));
      byId('lanSyncTargetSide').innerHTML = lanSideCardHTML(targetStats, plan.peer.name);
      byId('lanSyncFileList').innerHTML = lanFileListHTML({ notes: sourceStats.notes, todos: sourceStats.todos });
      byId('lanSyncBackupNote').textContent = replace ? lanText('backupNotePush') : lanText('copyNotePush');
      return;
    }
    if (plan.direction === 'pull') {
      const peerEntry = (plan.peerProfiles || []).find(entry => entry.id === byId('lanSyncPeerProfile').value);
      const replace = lanConfirmMode === 'replace';
      byId('lanSyncLocalTargetRow').hidden = !replace;
      const localTarget = dataProfileById(byId('lanSyncLocalTarget').value) || activeDataProfile();
      const localStats = localTarget ? profileStats(localTarget) : { notes: 0, todos: 0 };
      const sourceStats = peerEntry
        ? { profile: peerEntry.name, notes: peerEntry.notes || 0, todos: peerEntry.todos || 0 }
        : { profile: plan.peer.name, notes: 0, todos: 0 };
      const targetStats = replace
        ? { profile: localTarget?.name || lanText('thisDevice'), notes: localStats.notes || 0, todos: localStats.todos || 0 }
        : { profile: lanText('copyNewProfile'), notes: sourceStats.notes, todos: sourceStats.todos };
      byId('lanSyncSourceSide').innerHTML = lanSideCardHTML(sourceStats, plan.peer.name);
      byId('lanSyncTargetSide').innerHTML = lanSideCardHTML(targetStats, lanText('thisDevice'));
      byId('lanSyncFileList').innerHTML = lanFileListHTML({ notes: sourceStats.notes, todos: sourceStats.todos });
      byId('lanSyncBackupNote').textContent = replace
        ? lanText('backupNote', targetStats.profile)
        : lanText('copyNote');
      byId('confirmLanSyncLabel').textContent = lanText('confirm');
      byId('confirmLanSync').className = `settings-button${replace ? ' danger' : ''}`;
    }
  }

  function syncLanModeButtons() {
    byId('lanSyncSendModeGroup').querySelectorAll('[data-lan-send-mode]').forEach(choice => {
      choice.setAttribute('aria-pressed', String(choice.dataset.lanSendMode === lanSendMode));
    });
    byId('lanSyncModeGroup').querySelectorAll('[data-lan-mode]').forEach(choice => {
      choice.setAttribute('aria-pressed', String(choice.dataset.lanMode === lanConfirmMode));
    });
  }

  function fillLanDialog(plan) {
    const peerName = plan.peer?.name || plan.from?.name || lanText('unknownDevice');
    const titles = {
      pull: [lanText('pullTitle'), lanText('pullSubtitle', peerName)],
      push: [lanText('pushTitle'), lanText('pushSubtitle', peerName)],
      incoming: [lanText('incomingTitle'), lanText('incomingSubtitle', peerName)]
    };
    const [title, subtitle] = titles[plan.direction];
    byId('lanSyncTitle').textContent = title;
    byId('lanSyncSubtitle').textContent = subtitle;
    // 对话框内所有静态标签按当前语言填充（对话框不走设置页文本翻译）。
    byId('lanSyncSendProfileLabel').textContent = lanText('sendProfileLabel');
    byId('lanSyncSendProfileHint').textContent = lanText('sendProfileHint');
    byId('lanSyncSendModeHeading').textContent = lanText('modeHeading');
    byId('lanSendModeReplaceTitle').textContent = lanText('sendReplaceTitle');
    byId('lanSendModeReplaceHint').textContent = lanText('sendReplaceHint');
    byId('lanSendModeCopyTitle').textContent = lanText('sendCopyTitle');
    byId('lanSendModeCopyHint').textContent = lanText('sendCopyHint');
    byId('lanSyncTargetProfileLabel').textContent = lanText('targetProfileLabel');
    byId('lanSyncTargetProfileHint').textContent = lanText('targetProfileHint');
    byId('lanSyncPeerProfileLabel').textContent = lanText('peerProfileLabel');
    byId('lanSyncPeerProfileHint').textContent = lanText('peerProfileHint');
    byId('lanSyncModeHeading').textContent = lanText('modeHeading');
    byId('lanModeReplaceTitle').textContent = lanText('modeReplaceTitle');
    byId('lanModeReplaceHint').textContent = lanText('modeReplaceHint');
    byId('lanModeCopyTitle').textContent = lanText('modeCopyTitle');
    byId('lanModeCopyHint').textContent = lanText('modeCopyHint');
    byId('lanSyncLocalTargetLabel').textContent = lanText('localTargetLabel');
    byId('lanSyncLocalTargetHint').textContent = lanText('localTargetHint');
    byId('lanSyncFilesHeading').textContent = lanText('filesHeading');
    byId('cancelLanSync').textContent = lanText('cancel');

    const isPush = plan.direction === 'push';
    const isPull = plan.direction === 'pull';
    byId('lanSyncPushFields').hidden = !isPush;
    byId('lanSyncPullFields').hidden = !isPull;
    byId('lanSyncModeGroup').hidden = !isPull;
    byId('lanSyncModeLine').hidden = plan.direction !== 'incoming';
    const error = byId('lanSyncError');
    error.hidden = true;
    error.textContent = '';

    if (isPush) {
      // 发送档案默认跟随当前档案；传输里可临时改选，确认后记录在 plan 上。
      lanFillSelect(byId('lanSyncSendProfile'), lanProfilesMeta(), activeDataProfile()?.id);
      lanFillSelect(byId('lanSyncTargetProfile'), plan.peer.profiles || [], plan.peer.profiles?.[0]?.id || '');
      lanSendMode = 'replace';
      lanConfirmMode = 'replace';
      syncLanModeButtons();
    } else if (isPull) {
      lanFillSelect(byId('lanSyncPeerProfile'), plan.peerProfiles || [], plan.peerProfiles?.[0]?.id || '');
      lanFillSelect(byId('lanSyncLocalTarget'), lanProfilesMeta(), activeDataProfile()?.id);
      lanConfirmMode = 'replace';
      syncLanModeButtons();
      byId('lanSyncPeerProfile').disabled = !plan.peer.trusted;
      byId('confirmLanSync').disabled = !plan.peer.trusted;
      if (!plan.peer.trusted) {
        byId('lanSyncBackupNote').textContent = lanText('peerUntrusted');
        byId('lanSyncFileList').innerHTML = '';
        const totals = lanPeerTotals(plan.peer);
        byId('lanSyncSourceSide').innerHTML = lanSideCardHTML({ profile: plan.peer.name, notes: totals.notes, todos: totals.todos }, peerName);
        byId('lanSyncTargetSide').innerHTML = lanSideCardHTML({ profile: lanText('thisDevice') }, lanText('thisDevice'));
        return;
      }
    } else {
      // 接收方向：对方已决定写入方式，这里只展示详情。
      const payload = plan.payload || {};
      const replace = payload.mode === 'replace';
      byId('lanSyncModeLine').textContent = `${lanText('modeHeading')}：${replace ? lanText('modeReplaceTarget', payload.targetProfileName || lanText('unknownDevice')) : lanText('noticeCopyTarget')}`;
      const sourceStats = { profile: payload.profile || lanText('unknownDevice'), notes: payload.notes || 0, todos: payload.todos || 0, classifications: payload.classifications || 0, platform: payload.from?.platform || '' };
      const targetProfile = replace ? dataProfileById(payload.targetProfileId) : null;
      const targetStats = replace
        ? { profile: payload.targetProfileName || lanText('unknownDevice'), notes: targetProfile ? profileStats(targetProfile).notes : null, todos: targetProfile ? profileStats(targetProfile).todos : null, platform: lanText('thisDevice') }
        : { profile: lanText('copyNewProfile'), notes: payload.notes || 0, todos: payload.todos || 0 };
      byId('lanSyncSourceSide').innerHTML = lanSideCardHTML(sourceStats, peerName);
      byId('lanSyncTargetSide').innerHTML = lanSideCardHTML(targetStats, lanText('thisDevice'));
      byId('lanSyncFileList').innerHTML = lanFileListHTML({ notes: payload.notes || 0, todos: payload.todos || 0, classifications: payload.classifications || 0 });
      byId('lanSyncBackupNote').textContent = replace ? lanText('backupNoteIncoming', payload.targetProfileName || lanText('unknownDevice')) : lanText('copyNote');
      byId('confirmLanSyncLabel').textContent = lanText('confirmReceive');
      byId('confirmLanSync').className = `settings-button${replace ? ' danger' : ''}`;
      return;
    }
    lanRefreshDialog(plan);
    if (isPush) {
      byId('confirmLanSyncLabel').textContent = lanText('confirmSend');
      byId('confirmLanSync').className = 'settings-button danger';
    }
  }

  function openLanConfirm(plan) {
    return new Promise(resolve => {
      lanConfirmPlan = plan;
      lanConfirmResolve = resolve;
      fillLanDialog(plan);
      openAnimatedDialog(lanDialog);
    });
  }

  function settleLanConfirm(result) {
    if (!lanConfirmResolve) return;
    const resolve = lanConfirmResolve;
    const plan = lanConfirmPlan;
    lanConfirmResolve = null;
    lanConfirmPlan = null;
    if (result) {
      // 记录当前选择并保持对话框打开：传输步骤会显示在这里。
      if (plan) {
        if (plan.direction === 'push') {
          plan.sendProfileId = byId('lanSyncSendProfile').value;
          plan.sendMode = lanSendMode;
          if (lanSendMode === 'replace') {
            plan.targetProfileId = byId('lanSyncTargetProfile').value;
            plan.targetProfileName = (plan.peer.profiles || []).find(entry => entry.id === plan.targetProfileId)?.name || '';
          }
        } else if (plan.direction === 'pull') {
          plan.peerProfileId = byId('lanSyncPeerProfile').value;
          plan.peerProfileName = (plan.peerProfiles || []).find(entry => entry.id === plan.peerProfileId)?.name || '';
          plan.mode = lanConfirmMode;
          if (lanConfirmMode === 'replace') plan.targetProfileId = byId('lanSyncLocalTarget').value;
        }
      }
      setLanTransferLocked(true);
      resolve(true);
    } else {
      closeAnimatedDialog(lanDialog);
      resolve(false);
    }
  }

  function setLanTransferLocked(locked) {
    lanTransferActive = locked;
    ['cancelLanSync', 'confirmLanSync', 'closeLanSync'].forEach(id => { byId(id).disabled = locked; });
    ['lanSyncSendProfile', 'lanSyncTargetProfile', 'lanSyncPeerProfile', 'lanSyncLocalTarget'].forEach(id => { const select = byId(id); if (select) select.disabled = locked; });
    byId('lanSyncSendModeGroup').querySelectorAll('[data-lan-send-mode]').forEach(choice => { choice.disabled = locked; });
    byId('lanSyncModeGroup').querySelectorAll('[data-lan-mode]').forEach(choice => { choice.disabled = locked; });
  }

  function lanCloseTransferDialog() {
    lanEndSteps();
    setLanTransferLocked(false);
    closeAnimatedDialog(lanDialog);
  }

  async function lanFinishTransfer() {
    // 让用户看得到「全部完成」的状态再收起对话框。
    await new Promise(resolve => setTimeout(resolve, 650));
    lanCloseTransferDialog();
  }

  // 传输步骤：按传入的键渲染列表，active/done/fail 推进状态，
  // note() 更新当前进行中步骤的说明（供进度事件调用）。
  function lanBeginSteps(keys) {
    const list = byId('lanSyncSteps');
    list.hidden = false;
    list.innerHTML = keys.map(key => `<li data-state="pending"><span class="lan-step-dot" aria-hidden="true"></span><span class="lan-step-copy"><b>${escapeHTML(lanText(key))}</b><small></small></span></li>`).join('');
    const items = [...list.children];
    let current = 0;
    const setItem = (index, state, note = '') => {
      const item = items[index];
      if (!item) return;
      item.dataset.state = state;
      item.querySelector('small').textContent = note;
    };
    const paint = () => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 30)));
    lanSteps = {
      async active(index, note = '') {
        current = Math.max(current, index);
        for (let before = 0; before < index; before += 1) if (items[before]?.dataset.state === 'pending') setItem(before, 'done');
        setItem(index, 'active', note);
        // 先让界面绘制当前步骤，再进入下一批重量级工作。
        await paint();
      },
      note(text) { const item = items[current]; if (item) item.querySelector('small').textContent = text; },
      done(index, note = '') { setItem(index, 'done', note); },
      fail(note = '') { setItem(current, 'error', note); }
    };
    return lanSteps;
  }

  function lanEndSteps() {
    const list = byId('lanSyncSteps');
    list.hidden = true;
    list.innerHTML = '';
    lanSteps = null;
  }

  const lanProgressNote = payload => {
    const received = lanRawBytes(payload.received || 0);
    return payload.total ? lanText('progressLineTotal', received, lanRawBytes(payload.total)) : lanText('progressLine', received);
  };

  // Android 桥接的大档案分块读取：按块拼接后一次性解析。
  async function lanReadChunkedBundle(accepted) {
    let text = '';
    let offset = 0;
    for (;;) {
      const part = await lanBridge.readBundleChunk(accepted.requestId, offset);
      text += part.chunk;
      offset += part.chunk.length;
      if (part.done || !part.chunk) return JSON.parse(text);
    }
  }

  function applyLanLibrary(nextLibrary) {
    replaceLibrary(nextLibrary);
    if (workspaceAdapter) return queueWorkspaceSave(nextLibrary);
    return Promise.resolve();
  }

  // 把收到的数据保存为一个全新的本地行记数据档案；switchOpen 时切换过去。
  async function lanCopyBundleAsProfile(bundle, baseName, switchOpen = true) {
    const snapshot = parsePortableDataFolderBundle(bundle);
    const profile = { id: uid(), name: uniqueProfileName(baseName || profileText('newName')), storage: 'local', label: localProfileLocation(), noteCount: 0, todoCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    profileStats(profile, snapshot);
    dataProfiles.push(profile);
    saveDataProfileRegistry();
    await createLocalProfileAdapter(profile).save(snapshot);
    if (switchOpen) await activateDataProfile(profile.id, { notify: false });
    lanProfilesChangedHook?.();
    return profile;
  }

  // 把数据写入指定档案：先备份该档案当前内容，再覆盖；若目标是当前档案
  // 则直接刷新工作区，否则写入对应存储位置。返回备份结果。
  async function lanWriteIntoProfile(target, bundle, steps, backupIndex, writeIndex) {
    const isActive = target.id === activeDataProfile()?.id;
    if (steps && backupIndex >= 0) await steps.active(backupIndex);
    const currentSnapshot = isActive ? library : await loadDataProfileSnapshot(target, false);
    const backup = await lanBridge.backupLocal(createPortableDataFolderBundle(clearLegacyTags(JSON.parse(JSON.stringify(currentSnapshot)))), target.name);
    if (steps && backupIndex >= 0) steps.done(backupIndex, lanText('backupDoneAt', backup.path));
    if (steps && writeIndex >= 0) await steps.active(writeIndex);
    const nextLibrary = parsePortableDataFolderBundle(bundle);
    if (isActive) {
      await applyLanLibrary(nextLibrary);
    } else {
      const adapter = await adapterForDataProfile(target, false);
      await adapter.save(clearLegacyTags(JSON.parse(JSON.stringify(nextLibrary))));
      profileStats(target, nextLibrary);
      saveDataProfileRegistry();
      lanProfilesChangedHook?.();
    }
    if (steps && writeIndex >= 0) steps.done(writeIndex);
    return backup;
  }

  // 接收完成后自动刷新一遍：档案卡片与统计、工作区标识、对外元数据。
  function lanRefreshAfterReceive() {
    try { renderDataProfiles(); } catch { /* 忽略刷新失败 */ }
    try { updateWorkspaceUI(); } catch { /* 忽略刷新失败 */ }
    lanSyncUpdateMeta();
  }

  async function pullFromPeer(peer) {
    if (!lanBridge || lanBusy) return;
    lanBusy = true;
    try {
      const resolved = await lanResolvePeer(peer);
      if (!resolved) {
        setLanStatus(lanText('peerGone', peer.name || lanText('unknownDevice')), 'error');
        showSyncNotice(lanText('peerGone', peer.name || lanText('unknownDevice')), 'error');
        return;
      }
      if (!resolved.trusted) {
        setLanStatus(lanText('peerUntrusted'), 'error');
        showSyncNotice(lanText('peerUntrusted'), 'error');
        return;
      }
      const plan = { direction: 'pull', peer: resolved, peerProfiles: resolved.profiles || [] };
      if (!(await openLanConfirm(plan))) return;
      const steps = lanBeginSteps(plan.mode === 'copy' ? ['stepFetch', 'stepSaveProfile'] : ['stepFetch', 'stepBackup', 'stepWrite']);
      try {
        await steps.active(0);
        // 获取对方档案：首次连接可能因设备休眠短暂失败，自动重试一次。
        const bundle = await lanRetry(() => lanBridge.fetchProfileBundle(resolved.ip, resolved.port, resolved.session, plan.peerProfileId));
        steps.done(0);
        if (plan.mode === 'copy') {
          await steps.active(1);
          const profile = await lanCopyBundleAsProfile(bundle, plan.peerProfileName);
          steps.done(1, profile.name);
          setLanStatus(lanText('copyDone', profile.name), 'success');
          showSyncNotice(lanText('copyDone', profile.name));
        } else {
          const target = dataProfileById(plan.targetProfileId);
          if (!target) throw new Error(lanText('targetMissing'));
          const backup = await lanWriteIntoProfile(target, bundle, steps, 1, 2);
          setLanStatus(`${lanText('replaceDone', target.name)} ${lanText('backupDoneAt', backup.path)}`, 'success');
          showSyncNotice(lanText('replaceDone', target.name));
        }
        lanRefreshAfterReceive();
        await lanFinishTransfer();
      } catch (error) {
        lanSteps?.fail(error.message);
        setLanStatus(`${lanText('pullFail')}${error.message}`, 'error');
        await lanFinishTransfer();
      }
    } catch (error) {
      setLanStatus(`${lanText('pullFail')}${error.message}`, 'error');
    } finally {
      lanBusy = false;
    }
  }

  async function pushToPeer(peer) {
    if (!lanBridge || lanBusy) return;
    lanBusy = true;
    try {
      const resolved = await lanResolvePeer(peer);
      if (!resolved) {
        setLanStatus(lanText('peerGone', peer.name || lanText('unknownDevice')), 'error');
        showSyncNotice(lanText('peerGone', peer.name || lanText('unknownDevice')), 'error');
        return;
      }
      const plan = { direction: 'push', peer: resolved };
      if (!(await openLanConfirm(plan))) return;
      const steps = lanBeginSteps(['stepPrepare', 'stepRequest', 'stepTransfer']);
      try {
        await steps.active(0);
        const sendProfile = dataProfileById(plan.sendProfileId) || activeDataProfile();
        const { bundle, info } = await lanBuildSendBundle(sendProfile);
        steps.done(0);
        await steps.active(1);
        const status = await lanBridge.serviceStatus().catch(() => null);
        // 第一阶段：发送写入计划；对方开启「信任此局域网」时立即接受，
        // 否则等对方在界面上两步确认后才返回令牌。
        const token = await lanBridge.pushPlan(resolved.ip, resolved.port, resolved.session, {
          device: status?.device || 'Acta',
          icon: status?.icon || '',
          platform: status?.platform || '',
          profile: info.profile,
          mode: plan.sendMode,
          targetProfileId: plan.targetProfileId || '',
          targetProfileName: plan.targetProfileName || '',
          notes: info.notes,
          todos: info.todos,
          classifications: info.classifications
        });
        steps.done(1);
        await steps.active(2, lanText('waitingPeer'));
        // 第二阶段：传输数据档案，等对方备份并写入完成后返回。
        const applied = await lanBridge.pushData(resolved.ip, resolved.port, resolved.session, token, bundle);
        if (applied) {
          steps.done(2);
          setLanStatus(lanText('pushDone', resolved.name || lanText('unknownDevice')), 'success');
          showSyncNotice(lanText('pushDone', resolved.name || lanText('unknownDevice')));
        } else {
          steps.fail(lanText('applyFail'));
          setLanStatus(lanText('pushRefused', resolved.name || lanText('unknownDevice')), 'error');
          showSyncNotice(lanText('pushRefused', resolved.name || lanText('unknownDevice')), 'error');
        }
      } catch (error) {
        lanSteps?.fail(error.message);
        setLanStatus(`${lanText('pushFail')}${error.message}`, 'error');
        showSyncNotice(`${lanText('pushFail')}${error.message}`, 'error');
      }
      await lanFinishTransfer();
    } finally {
      lanBusy = false;
    }
  }

  // ===== 通知对话框：收到推送请求时先弹轻量通知，点击后再看详情 =====
  function openLanNotice(payload) {
    return new Promise(resolve => {
      lanNoticeResolve = resolve;
      const name = payload.from?.name || lanText('unknownDevice');
      byId('lanNoticeTitle').textContent = lanText('incomingTitle');
      byId('lanNoticeFrom').textContent = name;
      const action = payload.mode === 'copy' ? lanText('noticeCopyTarget') : lanText('modeReplaceTarget', payload.targetProfileName || lanText('unknownDevice'));
      byId('lanNoticeText').textContent = lanText('noticeBody', name, payload.profile || lanText('unknownDevice'), action);
      byId('lanNoticeReject').textContent = lanText('noticeReject');
      byId('lanNoticeDetailLabel').textContent = lanText('noticeDetail');
      openAnimatedDialog(lanNoticeDialog);
    });
  }

  function settleLanNotice(result) {
    if (!lanNoticeResolve) return;
    const resolve = lanNoticeResolve;
    lanNoticeResolve = null;
    closeAnimatedDialog(lanNoticeDialog);
    resolve(result);
  }

    byId('lanSyncGroup').hidden = !lanBridge;
    if (lanBridge) {
      const lanDiscoverableSetting = byId('lanDiscoverableSetting');
      const lanTrustSetting = byId('lanTrustSetting');
      lanDiscoverableSetting.checked = Boolean(uiSettings.lanDiscoverable);
      lanTrustLan = Boolean(uiSettings.lanTrustLan);
      lanTrustSetting.checked = lanTrustLan;
      byId('lanPeersHint').textContent = lanText('peersHint');
      // 本机身份设置：名称与图标可在服务运行中热更新（元数据刷新），
      // 端口改变需要重新绑定，运行中时显式重启服务。
      const lanDeviceNameInput = byId('lanDeviceName');
      const lanDeviceIconInput = byId('lanDeviceIcon');
      const lanPortInput = byId('lanPortSetting');
      lanDeviceNameInput.value = String(uiSettings.lanDeviceName || '');
      lanDeviceIconInput.value = String(uiSettings.lanDeviceIcon || '');
      lanPortInput.value = Number(uiSettings.lanPort) > 0 ? String(Number(uiSettings.lanPort)) : '';
      const lanIdentityChanged = async restart => {
        saveUISettings();
        if (restart && lanServiceRunning) {
          await lanStopService();
          await lanStartService();
          if (lanServiceRunning) setLanStatus(lanText('serviceOn'), 'success');
          return;
        }
        await lanSyncUpdateMeta();
        void lanRenderSelfIdentity();
      };
      lanDeviceNameInput.addEventListener('change', () => {
        uiSettings.lanDeviceName = lanDeviceNameInput.value;
        void lanIdentityChanged(false);
      });
      lanDeviceIconInput.addEventListener('change', () => {
        uiSettings.lanDeviceIcon = lanDeviceIconInput.value;
        void lanIdentityChanged(false);
      });
      lanPortInput.addEventListener('change', () => {
        const port = Math.floor(Number(lanPortInput.value) || 0);
        if (port !== 0 && (port < 1024 || port > 65535)) {
          setLanStatus(lanText('portInvalid'), 'error');
          lanPortInput.value = Number(uiSettings.lanPort) > 0 ? String(Number(uiSettings.lanPort)) : '';
          return;
        }
        uiSettings.lanPort = port;
        lanPortInput.value = port > 0 ? String(port) : '';
        void lanIdentityChanged(true);
      });
      updateLanStateUI();
    setLanStatus(lanText('serviceOff'), '');
    if (lanDiscoverableSetting.checked) {
      void lanStartService().then(() => { if (lanServiceRunning) setLanStatus(lanText('serviceOn'), 'success'); });
    }
    lanDiscoverableSetting.addEventListener('change', async () => {
      uiSettings.lanDiscoverable = lanDiscoverableSetting.checked;
      saveUISettings();
      if (lanDiscoverableSetting.checked) {
        await lanStartService();
        if (lanServiceRunning) setLanStatus(lanText('serviceOn'), 'success');
      } else {
        await lanStopService();
        setLanStatus(lanText('serviceOff'), '');
      }
    });
    lanTrustSetting.addEventListener('change', () => {
      lanTrustLan = lanTrustSetting.checked;
      uiSettings.lanTrustLan = lanTrustLan;
      saveUISettings();
      lanSyncUpdateMeta();
      setLanStatus(lanText(lanTrustLan ? 'trustOn' : 'trustOff'), lanTrustLan ? 'success' : '');
    });
    // —— 设备雷达（内嵌在数据同步设置页）：面板可见时持续扫描 ——
    let lanRadarVisible = false;
    let lanRadarScanTimer = null;
    const radarPanelActive = () => document.querySelector('[data-settings-panel="cloud"]')?.classList.contains('active') || false;
    const syncRadarScanning = () => {
      const wanted = lanRadarVisible && radarPanelActive();
      if (wanted && !lanRadarScanTimer) {
        void scanLanPeers();
        lanRadarScanTimer = setInterval(() => { void scanLanPeers(); }, 3200);
      } else if (!wanted && lanRadarScanTimer) {
        clearInterval(lanRadarScanTimer);
        lanRadarScanTimer = null;
      }
    };
    // 设置页显隐钩子（openSettings / closeSettings / switchSettingsPage 调用）。
    lanRadarVisibilityHook = visible => {
      lanRadarVisible = visible;
      if (visible) {
        updateLanStateUI();
        void lanRenderSelfIdentity();
      } else {
        closeLanPeerMenu();
      }
      syncRadarScanning();
    };
    // 气泡点击弹出操作菜单；点击空白处收起。
    byId('lanRadarStage').addEventListener('click', event => {
      const bubble = event.target.closest('.lan-peer-bubble');
      if (!bubble) {
        closeLanPeerMenu();
        return;
      }
      const wrapper = bubble.closest('.lan-radar-peer');
      const peer = lanPeers.find(entry => entry.session === wrapper?.dataset.session);
      if (!peer) return;
      if (lanRadarMenuPeer?.session === peer.session) {
        closeLanPeerMenu();
        return;
      }
      openLanPeerMenu(peer, wrapper);
    });

    // —— 同步自动化：模块化条目（触发器 + 步骤序列）——
    // 步骤即命令：自动备份 / 冲突检查 / 发送到设备 / 从设备导入，自由增删
    // 排序。执行复用手动传输的同一套桥接与写入路径；自动化运行时手动传输
    // 被锁定（lanBusy），手动传输进行中时自动化让位，双方不会互相穿插。
    const LAN_STEP_ICONS = { backup: 'i-copy', conflict: 'i-undo', push: 'i-upload', pull: 'i-download' };
    const lanAutomationListNode = byId('lanAutomationList');
    const lanAutomations = () => (Array.isArray(uiSettings.lanAutomations) ? uiSettings.lanAutomations : []);
    const lanAutomationRecords = () => (uiSettings.lanAutomationRuns && typeof uiSettings.lanAutomationRuns === 'object' ? uiSettings.lanAutomationRuns : {});
    let lanAutomationEditingId = '';
    let lanAutomationDraft = null;
    let lanAutomationRunning = false;
    let lanAutomationSeen = new Set();
    const lanAutomationCooldown = new Map();
    const LAN_AUTOMATION_COOLDOWN_MS = 10 * 60 * 1000;
    const lanPeerKey = peer => `${peer?.name || ''}|${peer?.ip || ''}`;

    const lanSaveAutomations = () => {
      uiSettings.lanAutomations = lanAutomations();
      saveUISettings();
    };
    const lanRecordRun = (entry, patch = {}) => {
      const runs = lanAutomationRecords();
      const previous = runs[entry.id] || {};
      // count 只由「运行结束」的记录递增；步骤内部的记录沿用已有计数。
      const bump = Number(patch.count) || 0;
      runs[entry.id] = { ...previous, ...patch, at: new Date().toISOString(), count: (Number(previous.count) || 0) + bump };
      uiSettings.lanAutomationRuns = runs;
      saveUISettings();
    };
    const lanStepSummary = step => {
      if (step.type === 'backup') return lanText('autoBackupSummary', dataProfileById(step.profileId)?.name || lanText('autoCurrentProfile'));
      if (step.type === 'conflict') return lanText('autoConflictSummary');
      const source = dataProfileById(step.profileId)?.name || lanText('autoCurrentProfile');
      if (step.type === 'push') return step.mode === 'copy' ? lanText('autoPushCopySummary', source) : lanText('autoPushReplaceSummary', source);
      return step.mode === 'copy' ? lanText('autoPullCopySummary') : lanText('autoPullReplaceSummary');
    };
    const lanTriggerSummary = entry => {
      const trigger = entry.trigger || {};
      if (trigger.type === 'interval') return lanText('autoTriggerInterval', trigger.minutes || 15);
      if (trigger.type === 'manual') return lanText('autoTriggerManual');
      return trigger.pattern ? lanText('autoTriggerDevicePattern', trigger.pattern) : lanText('autoTriggerDevice');
    };
    const lanTriggerMatches = (entry, peer) => {
      const pattern = String(entry.trigger?.pattern || '').trim();
      return !pattern || (peer.name || '').includes(pattern);
    };
    const lanAutomationScanDue = () => lanServiceRunning && lanAutomations().some(entry => entry.enabled && entry.trigger?.type !== 'manual');

    // —— 执行 ——
    async function lanRunAutomation(entry, peer) {
      if (!lanBridge || !entry?.steps?.length) return;
      if (lanBusy || lanTransferActive || lanAutomationRunning || lanIncomingActive || lanDataBusy) {
        const message = lanText('autoBusy', entry.name);
        setLanStatus(message, 'error');
        showSyncNotice(message, 'error');
        return;
      }
      lanAutomationRunning = true;
      lanBusy = true;
      const notice = message => showSyncNotice(`${entry.name} · ${message}`);
      try {
        const resolved = peer ? await lanResolvePeer(peer) : null;
        if (!resolved) throw { message: lanText('autoPeerGone', peer?.name || lanText('unknownDevice')) };
        for (let index = 0; index < entry.steps.length; index += 1) {
          const step = entry.steps[index];
          if (step.type === 'backup') {
            const profile = dataProfileById(step.profileId) || activeDataProfile();
            if (!profile) continue;
            const snapshot = profile.id === activeDataProfile()?.id ? library : await loadDataProfileSnapshot(profile, false);
            const backup = await lanBridge.backupLocal(createPortableDataFolderBundle(clearLegacyTags(JSON.parse(JSON.stringify(snapshot)))), profile.name);
            notice(lanText('autoBackupDone', profile.name) + (backup?.path ? ` ${backup.path}` : ''));
          } else if (step.type === 'conflict') {
            // 冲突检查作用于其后第一个收发步骤的覆盖目标：目标规模与上次
            // 自动化成功写入的记录不一致，说明对方（或本机）又有改动，
            // 覆盖可能丢数据——取消整个条目并报告，宁可不同步。
            const next = entry.steps.slice(index + 1).find(candidate => candidate.type === 'push' || candidate.type === 'pull');
            if (!next || next.mode === 'copy') continue;
            const record = lanAutomationRecords()[entry.id];
            if (!record?.sent || record.peerKey !== lanPeerKey(resolved)) continue;
            let target;
            if (next.type === 'push') {
              const sourceName = dataProfileById(next.profileId)?.name || activeDataProfile()?.name;
              target = (resolved.profiles || []).find(candidate => candidate.name === sourceName);
            } else {
              const local = dataProfileById(next.targetProfileId) || activeDataProfile();
              target = local ? { name: local.name, notes: profileStats(local).notes, todos: profileStats(local).todos } : null;
            }
            if (target && (Number(target.notes) !== Number(record.sent.notes) || Number(target.todos) !== Number(record.sent.todos))) {
              throw { conflict: true, message: lanText('autoConflictFound', target.name || lanText('unknownDevice')) };
            }
          } else if (step.type === 'push') {
            const sendProfile = dataProfileById(step.profileId) || activeDataProfile();
            if (!sendProfile) throw { message: lanText('targetMissing') };
            const mode = step.mode === 'copy' ? 'copy' : 'replace';
            const { bundle, info } = await lanBuildSendBundle(sendProfile);
            const sameName = (resolved.profiles || []).find(candidate => candidate.name === sendProfile.name);
            if (mode === 'replace' && !sameName) throw { message: lanText('autoPushTargetMissing', sendProfile.name) };
            const status = await lanBridge.serviceStatus().catch(() => null);
            const token = await lanBridge.pushPlan(resolved.ip, resolved.port, resolved.session, {
              device: status?.device || 'Acta',
              icon: status?.icon || '',
              platform: status?.platform || '',
              profile: info.profile,
              mode,
              targetProfileId: mode === 'replace' ? sameName.id : '',
              targetProfileName: mode === 'replace' ? sameName.name : '',
              notes: info.notes,
              todos: info.todos,
              classifications: info.classifications
            });
            const applied = await lanBridge.pushData(resolved.ip, resolved.port, resolved.session, token, bundle);
            if (!applied) throw { message: lanText('pushRefused', resolved.name || lanText('unknownDevice')) };
            notice(lanText('pushDone', resolved.name || lanText('unknownDevice')));
            lanRecordRun(entry, { result: 'ok', peerKey: lanPeerKey(resolved), peerName: resolved.name || '', sent: { notes: info.notes, todos: info.todos }, message: lanText('pushDone', resolved.name || '') });
          } else if (step.type === 'pull') {
            if (!resolved.trusted) throw { message: lanText('peerUntrusted') };
            const mode = step.mode === 'copy' ? 'copy' : 'replace';
            const localName = activeDataProfile()?.name || '';
            const peerProfile = (resolved.profiles || []).find(candidate => candidate.name === localName) || (resolved.profiles || [])[0];
            if (!peerProfile) throw { message: lanText('autoPullNothing') };
            const bundle = await lanRetry(() => lanBridge.fetchProfileBundle(resolved.ip, resolved.port, resolved.session, peerProfile.id));
            if (mode === 'copy') {
              const profile = await lanCopyBundleAsProfile(bundle, peerProfile.name, false);
              notice(lanText('copyDone', profile.name));
            } else {
              const target = activeDataProfile();
              if (!target) throw { message: lanText('targetMissing') };
              const backup = await lanWriteIntoProfile(target, bundle, null, -1, -1);
              notice(`${lanText('replaceDone', target.name)} ${lanText('backupDoneAt', backup.path)}`);
            }
            lanRecordRun(entry, { result: 'ok', peerKey: lanPeerKey(resolved), peerName: resolved.name || '', sent: { notes: peerProfile.notes || 0, todos: peerProfile.todos || 0 }, message: lanText('pullDone', resolved.name || '') });
          }
        }
        setLanStatus(lanText('autoRunDone', entry.name), 'success');
        showSyncNotice(lanText('autoRunDone', entry.name), 'success');
      } catch (error) {
        const detail = error?.conflict ? error.message : `${lanText('autoRunFail', entry.name)}${error?.message || error}`;
        setLanStatus(detail, 'error');
        showSyncNotice(detail, 'error');
        lanRecordRun(entry, { result: error?.conflict ? 'conflict' : 'fail', message: error?.message ? String(error.message) : String(error) });
      } finally {
        lanAutomationRunning = false;
        lanBusy = false;
        // 运行次数在这里统一 +1：无论成功、失败还是冲突，跑过一次就算一次。
        lanRecordRun(entry, { count: 1 });
        lanRenderAutomations();
      }
    }

    // —— 触发器评估：扫描结果落地后调用 ——
    // 设备在扫描间抖动（掉线又上线）时按条目+设备做 10 分钟冷却，
    // 避免同一条目对同一设备反复执行。
    function lanEvaluateAutomations() {
      if (!lanServiceRunning || lanAutomationRunning || lanBusy) return;
      const now = Date.now();
      const presentKeys = new Set(lanPeers.map(lanPeerKey));
      lanAutomations().forEach(entry => {
        if (!entry.enabled) return;
        const trigger = entry.trigger || {};
        if (trigger.type === 'interval') {
          const minutes = Math.max(Number(trigger.minutes) || 15, 1);
          const last = Date.parse(entry.lastRunAt || '') || 0;
          if (now - last < minutes * 60000) return;
          const peer = lanPeers.find(candidate => lanTriggerMatches(entry, candidate));
          if (peer) void lanRunAutomation(entry, peer);
          return;
        }
        if (trigger.type === 'manual') return;
        // device-found：本轮新出现的设备。
        lanPeers.forEach(peer => {
          const key = lanPeerKey(peer);
          if (presentKeys.has(key) && lanAutomationSeen.has(key)) return;
          if (lanAutomationSeen.has(key)) return;
          if (!lanTriggerMatches(entry, peer)) return;
          const cooldownKey = `${entry.id}::${key}`;
          if (now - (lanAutomationCooldown.get(cooldownKey) || 0) < LAN_AUTOMATION_COOLDOWN_MS) return;
          lanAutomationCooldown.set(cooldownKey, now);
          void lanRunAutomation(entry, peer);
        });
      });
      lanAutomationSeen = presentKeys;
    }

    // —— 卡片与编辑器 ——
    const lanAutomationMetaButton = (label, icon) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'settings-button secondary';
      button.innerHTML = `<svg><use href="#${icon}"/></svg><span>${escapeHTML(label)}</span>`;
      return button;
    };
    const lanBuildAutomationCard = entry => {
      const card = document.createElement('div');
      card.className = 'lan-automation-card';
      card.dataset.automationId = entry.id;
      const head = document.createElement('div');
      head.className = 'settings-row';
      const copy = document.createElement('span');
      const stepsSummary = entry.steps.map(lanStepSummary).join(lanText('autoSummaryJoin')) || lanText('autoNoSteps');
      copy.innerHTML = `<b>${escapeHTML(entry.name || lanText('autoNewName'))}</b><small>${escapeHTML(lanTriggerSummary(entry))}${escapeHTML(lanText('autoSummaryJoin'))}${escapeHTML(stepsSummary)}</small>`;
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = entry.enabled !== false;
      toggle.setAttribute('aria-label', lanText('autoEnabledLabel'));
      toggle.addEventListener('change', () => {
        entry.enabled = toggle.checked;
        lanSaveAutomations();
      });
      head.append(copy, toggle);
      const last = document.createElement('p');
      last.className = 'lan-automation-last';
      // 运行记录是唯一事实来源（次数 / 时间 / 结果都在 record 上）。
      const record = lanAutomationRecords()[entry.id] || {};
      const resultText = record.message ? ` · ${record.message}` : '';
      last.textContent = record.count
        ? `${lanText('autoRunCount', record.count)} · ${lanText('autoLastRun', record.at ? formatDateTimeSeconds(record.at) : '—')}${resultText}`
        : lanText('autoNeverRun');
      const actions = document.createElement('div');
      actions.className = 'lan-automation-actions';
      const runButton = lanAutomationMetaButton(lanText('autoRun'), 'i-lightning');
      runButton.addEventListener('click', () => {
        const peer = lanPeers.find(candidate => lanTriggerMatches(entry, candidate));
        if (!peer) {
          const message = lanText('autoNoPeer', entry.name);
          setLanStatus(message, 'error');
          showSyncNotice(message, 'error');
          return;
        }
        void lanRunAutomation(entry, peer);
      });
      const editButton = lanAutomationMetaButton(lanText('autoEdit'), 'i-edit');
      editButton.addEventListener('click', () => {
        lanAutomationEditingId = entry.id;
        lanAutomationDraft = JSON.parse(JSON.stringify(entry));
        lanRenderAutomations();
      });
      const deleteButton = lanAutomationMetaButton(lanText('autoDelete'), 'i-trash');
      deleteButton.addEventListener('click', () => {
        if (!window.confirm(lanText('autoConfirmDelete', entry.name || lanText('autoNewName')))) return;
        const list = lanAutomations();
        list.splice(list.findIndex(candidate => candidate.id === entry.id), 1);
        lanSaveAutomations();
        lanRenderAutomations();
      });
      actions.append(runButton, editButton, deleteButton);
      card.append(head, last, actions);
      return card;
    };

    const lanBuildAutomationEditor = draft => {
      const card = document.createElement('div');
      card.className = 'lan-automation-card';
      const nameRow = document.createElement('label');
      nameRow.className = 'settings-row';
      nameRow.innerHTML = `<span><b>${escapeHTML(lanText('autoNameLabel'))}</b></span>`;
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.maxLength = 40;
      nameInput.value = draft.name || '';
      nameInput.addEventListener('change', () => { draft.name = nameInput.value; });
      nameRow.appendChild(nameInput);
      const triggerRow = document.createElement('label');
      triggerRow.className = 'settings-row';
      triggerRow.innerHTML = `<span><b>${escapeHTML(lanText('autoTriggerLabel'))}</b><small>${escapeHTML(lanText('autoTriggerHint'))}</small></span>`;
      const triggerSelect = document.createElement('select');
      [['device-found', 'autoTriggerDevice'], ['interval', 'autoTriggerIntervalLabel'], ['manual', 'autoTriggerManual']].forEach(([value, key]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = lanText(key);
        triggerSelect.appendChild(option);
      });
      triggerSelect.value = draft.trigger?.type || 'device-found';
      triggerRow.appendChild(triggerSelect);
      const patternRow = document.createElement('label');
      patternRow.className = 'settings-row';
      patternRow.innerHTML = `<span><b>${escapeHTML(lanText('autoTriggerPatternLabel'))}</b><small>${escapeHTML(lanText('autoTriggerPatternHint'))}</small></span>`;
      const patternInput = document.createElement('input');
      patternInput.type = 'text';
      patternInput.maxLength = 40;
      patternInput.value = draft.trigger?.pattern || '';
      patternInput.addEventListener('change', () => { draft.trigger.pattern = patternInput.value; });
      patternRow.appendChild(patternInput);
      const intervalRow = document.createElement('label');
      intervalRow.className = 'settings-row';
      intervalRow.innerHTML = `<span><b>${escapeHTML(lanText('autoTriggerIntervalLabel'))}</b><small>${escapeHTML(lanText('autoTriggerIntervalHint'))}</small></span>`;
      const intervalSelect = document.createElement('select');
      [5, 15, 30, 60].forEach(minutes => {
        const option = document.createElement('option');
        option.value = String(minutes);
        option.textContent = lanText('autoTriggerInterval', minutes);
        intervalSelect.appendChild(option);
      });
      intervalSelect.value = String(draft.trigger?.minutes || 15);
      intervalSelect.addEventListener('change', () => { draft.trigger.minutes = Number(intervalSelect.value); });
      intervalRow.appendChild(intervalSelect);
      const syncTriggerRows = () => {
        patternRow.hidden = triggerSelect.value !== 'device-found';
        intervalRow.hidden = triggerSelect.value !== 'interval';
      };
      triggerSelect.addEventListener('change', () => {
        draft.trigger.type = triggerSelect.value;
        syncTriggerRows();
      });
      const stepsBox = document.createElement('div');
      stepsBox.className = 'lan-automation-steps';
      const renderSteps = () => {
        stepsBox.innerHTML = '';
        draft.steps.forEach((step, index) => {
          const row = document.createElement('div');
          row.className = 'lan-automation-step';
          const tag = document.createElement('span');
          tag.className = 'lan-automation-step-tag';
          tag.textContent = String(index + 1);
          const body = document.createElement('span');
          body.className = 'lan-automation-step-body';
          const title = document.createElement('b');
          title.textContent = lanText(step.type === 'backup' ? 'autoStepBackup' : step.type === 'conflict' ? 'autoStepConflict' : step.type === 'push' ? 'autoStepPush' : 'autoStepPull');
          body.appendChild(title);
          const profileOptions = [{ id: '', name: lanText('autoCurrentProfile') }, ...lanProfilesMeta()];
          if (step.type === 'backup' || step.type === 'push') {
            const summary = document.createElement('small');
            summary.textContent = lanStepSummary(step);
            body.appendChild(summary);
            const profileSelect = document.createElement('select');
            profileOptions.forEach(optionMeta => {
              const option = document.createElement('option');
              option.value = optionMeta.id;
              option.textContent = optionMeta.name;
              profileSelect.appendChild(option);
            });
            profileSelect.value = step.profileId || '';
            profileSelect.addEventListener('change', () => { step.profileId = profileSelect.value; summary.textContent = lanStepSummary(step); });
            body.appendChild(profileSelect);
          }
          if (step.type === 'push' || step.type === 'pull') {
            const modeSelect = document.createElement('select');
            [['replace', step.type === 'push' ? 'autoPushReplaceShort' : 'autoPullReplaceShort'], ['copy', step.type === 'push' ? 'autoPushCopyShort' : 'autoPullCopyShort']].forEach(([value, key]) => {
              const option = document.createElement('option');
              option.value = value;
              option.textContent = lanText(key);
              modeSelect.appendChild(option);
            });
            modeSelect.value = step.mode === 'copy' ? 'copy' : 'replace';
            modeSelect.addEventListener('change', () => {
              step.mode = modeSelect.value;
              body.querySelector('small')?.remove?.();
              const summary = document.createElement('small');
              summary.textContent = lanStepSummary(step);
              body.insertBefore(summary, modeSelect);
            });
            body.appendChild(modeSelect);
          }
          if (step.type === 'conflict') {
            const summary = document.createElement('small');
            summary.textContent = lanStepSummary(step);
            body.appendChild(summary);
          }
          const tools = document.createElement('span');
          tools.className = 'lan-automation-step-tools';
          const upButton = document.createElement('button');
          upButton.type = 'button';
          upButton.title = lanText('autoMoveUp');
          upButton.disabled = index === 0;
          upButton.innerHTML = '<svg style="transform:rotate(-90deg)"><use href="#i-chevron"/></svg>';
          upButton.addEventListener('click', () => {
            draft.steps.splice(index - 1, 0, draft.steps.splice(index, 1)[0]);
            renderSteps();
          });
          const downButton = document.createElement('button');
          downButton.type = 'button';
          downButton.title = lanText('autoMoveDown');
          downButton.disabled = index === draft.steps.length - 1;
          downButton.innerHTML = '<svg style="transform:rotate(90deg)"><use href="#i-chevron"/></svg>';
          downButton.addEventListener('click', () => {
            draft.steps.splice(index + 1, 0, draft.steps.splice(index, 1)[0]);
            renderSteps();
          });
          const removeButton = document.createElement('button');
          removeButton.type = 'button';
          removeButton.title = lanText('autoDelete');
          removeButton.innerHTML = '<svg><use href="#i-close"/></svg>';
          removeButton.addEventListener('click', () => {
            draft.steps.splice(index, 1);
            renderSteps();
          });
          tools.append(upButton, downButton, removeButton);
          row.append(tag, body, tools);
          stepsBox.appendChild(row);
        });
      };
      renderSteps();
      const addRow = document.createElement('label');
      addRow.className = 'settings-row';
      addRow.innerHTML = `<span><b>${escapeHTML(lanText('autoAddStep'))}</b></span>`;
      const addSelect = document.createElement('select');
      [['', 'autoAddStepPlaceholder'], ['backup', 'autoStepBackup'], ['conflict', 'autoStepConflict'], ['push', 'autoStepPush'], ['pull', 'autoStepPull']].forEach(([value, key]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = lanText(key);
        addSelect.appendChild(option);
      });
      addSelect.addEventListener('change', () => {
        if (!addSelect.value) return;
        if (addSelect.value === 'backup') draft.steps.push({ type: 'backup', profileId: '' });
        else if (addSelect.value === 'conflict') draft.steps.push({ type: 'conflict' });
        else if (addSelect.value === 'push') draft.steps.push({ type: 'push', profileId: '', mode: 'replace' });
        else draft.steps.push({ type: 'pull', mode: 'replace' });
        addSelect.value = '';
        renderSteps();
      });
      addRow.appendChild(addSelect);
      const actions = document.createElement('div');
      actions.className = 'lan-automation-actions';
      const saveButton = lanAutomationMetaButton(lanText('autoSave'), 'i-check');
      saveButton.classList.remove('secondary');
      saveButton.addEventListener('click', () => {
        const list = lanAutomations();
        const index = list.findIndex(candidate => candidate.id === draft.id);
        if (index >= 0) list[index] = JSON.parse(JSON.stringify(draft));
        lanAutomationEditingId = '';
        lanAutomationDraft = null;
        lanSaveAutomations();
        lanRenderAutomations();
      });
      const cancelButton = lanAutomationMetaButton(lanText('autoCancel'), 'i-close');
      cancelButton.addEventListener('click', () => {
        lanAutomationEditingId = '';
        lanAutomationDraft = null;
        lanRenderAutomations();
      });
      actions.append(saveButton, cancelButton);
      card.append(nameRow, triggerRow, patternRow, intervalRow, stepsBox, addRow, actions);
      syncTriggerRows();
      return card;
    };

    function lanRenderAutomations() {
      if (!lanAutomationListNode) return;
      const entries = lanAutomations();
      if (!entries.length && !lanAutomationEditingId) {
        lanAutomationListNode.innerHTML = `<p class="lan-automation-empty">${escapeHTML(lanText('autoEmpty'))}</p>`;
        return;
      }
      lanAutomationListNode.innerHTML = '';
      entries.forEach(entry => {
        lanAutomationListNode.appendChild(entry.id === lanAutomationEditingId && lanAutomationDraft
          ? lanBuildAutomationEditor(lanAutomationDraft)
          : lanBuildAutomationCard(entry));
      });
    }
    byId('lanAutomationAdd')?.addEventListener('click', () => {
      const entry = {
        id: uid(),
        name: lanText('autoNewName'),
        enabled: true,
        trigger: { type: 'device-found', pattern: '', minutes: 15 },
        steps: [{ type: 'backup', profileId: '' }, { type: 'push', profileId: '', mode: 'replace' }],
        lastRunAt: '',
        lastResult: null
      };
      lanAutomations().push(entry);
      lanSaveAutomations();
      lanAutomationEditingId = entry.id;
      lanAutomationDraft = JSON.parse(JSON.stringify(entry));
      lanRenderAutomations();
      lanAutomationListNode?.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    lanAutomationRenderHook = () => lanRenderAutomations();
    lanAutomationEvaluator = () => lanEvaluateAutomations();
    // 后台扫描循环：雷达可见时跟手（3.2s 一轮）；不可见时只为自动化保活
    //（约 16s 一轮），服务未开启时不做任何扫描。
    let lanScanTick = 0;
    setInterval(() => {
      if (!lanServiceRunning) return;
      lanScanTick += 1;
      if (lanRadarVisible && radarPanelActive()) {
        void scanLanPeers();
        return;
      }
      if (lanAutomationScanDue() && lanScanTick % 5 === 0) void scanLanPeers();
    }, 3200);
    lanRenderAutomations();
    // 对话框控件：选择与模式变化即时重算展示。
    const lanDialogRefresh = () => lanRefreshDialog(lanConfirmPlan);
    byId('lanSyncSendProfile').addEventListener('change', lanDialogRefresh);
    byId('lanSyncTargetProfile').addEventListener('change', lanDialogRefresh);
    byId('lanSyncPeerProfile').addEventListener('change', lanDialogRefresh);
    byId('lanSyncLocalTarget').addEventListener('change', lanDialogRefresh);
    byId('lanSyncSendModeGroup').addEventListener('click', event => {
      const choice = event.target.closest('[data-lan-send-mode]');
      if (!choice || lanTransferActive || choice.dataset.lanSendMode === lanSendMode) return;
      lanSendMode = choice.dataset.lanSendMode;
      syncLanModeButtons();
      lanDialogRefresh();
    });
    byId('lanSyncModeGroup').addEventListener('click', event => {
      const choice = event.target.closest('[data-lan-mode]');
      if (!choice || lanTransferActive || choice.dataset.lanMode === lanConfirmMode) return;
      lanConfirmMode = choice.dataset.lanMode;
      syncLanModeButtons();
      lanDialogRefresh();
    });
    byId('confirmLanSync').addEventListener('click', () => { if (!lanTransferActive) settleLanConfirm(true); });
    byId('cancelLanSync').addEventListener('click', () => { if (!lanTransferActive) settleLanConfirm(false); });
    byId('closeLanSync').addEventListener('click', () => { if (!lanTransferActive) settleLanConfirm(false); });
    // 传输进行中不允许关闭对话框：半途关闭会让接收流程停在半写入状态。
    lanDialog.addEventListener('cancel', event => { event.preventDefault(); if (!lanTransferActive) settleLanConfirm(false); });
    // 弹出窗口不因点击空白处而关闭（设计约定）：传输确认必须由用户明确选择。

    // 通知对话框：查看详情 → 打开完整确认窗口；拒绝或关闭 → 拒绝请求。
    byId('lanNoticeDetail').addEventListener('click', () => settleLanNotice('detail'));
    byId('lanNoticeReject').addEventListener('click', () => settleLanNotice('reject'));
    lanNoticeDialog.addEventListener('cancel', event => { event.preventDefault(); settleLanNotice('reject'); });
    // 弹出窗口不因点击空白处而关闭（设计约定）。

    // 传输进度：原生层在分块收发数据时发出进度事件，这里更新当前步骤说明。
    lanEvents.onLanProgress?.(event => {
      const payload = event.payload || {};
      if (lanSteps) lanSteps.note(lanProgressNote(payload));
    });

    // 会话验证失败（常见于对方的设备列表已过期）：全局提示，10 秒节流。
    lanEvents.onLanRejected?.(() => {
      const now = Date.now();
      if (now - lanRejectedToastAt < 10000) return;
      lanRejectedToastAt = now;
      showSyncNotice(lanText('rejectToast'), 'error');
      setLanStatus(lanText('rejectToast'), 'error');
    });

    // 对方读取本机档案（信任网络）：按需加载并打包最新内容。
    lanEvents.onLanFetch?.(async event => {
      const payload = event.payload || {};
      try {
        const profile = dataProfileById(payload.profileId);
        if (!profile) throw new Error('profile missing');
        const snapshot = await loadDataProfileSnapshot(profile, false);
        const bundle = createPortableDataFolderBundle(clearLegacyTags(JSON.parse(JSON.stringify(snapshot))));
        await lanBridge.provideBundle(payload.requestId, { ok: true, bundle });
        showSyncNotice(lanText('fetchedNotice', profile.name), 'info');
      } catch (error) {
        await lanBridge.provideBundle(payload.requestId, { ok: false, error: error.message }).catch(() => {});
      }
    });

    // 第一阶段：收到推送写入计划。信任网络由原生层直接接受（auto=true），
    // 不需要界面；否则先弹通知，用户点击查看详情并确认后才接受。
    lanEvents.onLanIncoming?.(async event => {
      const payload = event.payload || {};
      if (payload.auto) return;
      if (lanBusy || lanIncomingActive || lanDataBusy || lanDataExpected) {
        await lanBridge.decideIncoming(false).catch(() => {});
        const name = payload.from?.name || lanText('unknownDevice');
        setLanStatus(lanText('busyRefused', name), 'error');
        showSyncNotice(lanText('busyRefused', name), 'error');
        return;
      }
      lanIncomingActive = true;
      try {
        const choice = await openLanNotice(payload);
        if (choice !== 'detail') {
          await lanBridge.decideIncoming(false).catch(() => {});
          return;
        }
        const plan = { direction: 'incoming', from: payload.from || {}, payload, remote: { profile: payload.profile, platform: payload.from?.platform, notes: payload.notes, todos: payload.todos, classifications: payload.classifications } };
        const confirmed = await openLanConfirm(plan);
        if (!confirmed) {
          await lanBridge.decideIncoming(false).catch(() => {});
          return;
        }
        if (payload.mode === 'replace' && !dataProfileById(payload.targetProfileId)) {
          throw new Error(lanText('targetMissing'));
        }
        // 已确认：立即向发送端应答第一阶段，发送端才会继续传输数据；
        // 对话框保持打开并显示步骤，等数据阶段推进。
        await lanBridge.decideIncoming(true);
        lanDataExpected = true;
        clearTimeout(lanDataExpectTimer);
        lanDataExpectTimer = setTimeout(() => { lanDataExpected = false; }, 300000);
        lanActiveReceiver = {
          plan: payload,
          steps: lanBeginSteps(payload.mode === 'copy' ? ['stepReceive', 'stepSaveProfile'] : ['stepReceive', 'stepBackup', 'stepWrite'])
        };
        setLanStatus(lanText('waitingPeer'), 'info');
      } catch (error) {
        await lanBridge.decideIncoming(false).catch(() => {});
        setLanStatus(`${lanText('incomingFail')}${error.message}`, 'error');
        showSyncNotice(`${lanText('incomingFail')}${error.message}`, 'error');
      }
      lanIncomingActive = false;
    });

    // 第二阶段：数据到位。信任网络无对话框，直接自动应用；非信任网络由
    // 已确认的对话框推进步骤。备份与写入全部完成后才通知对方成功。
    lanEvents.onLanData?.(async event => {
      const payload = event.payload || {};
      if (lanDataBusy) {
        await lanBridge.rejectIncoming().catch(() => {});
        return;
      }
      lanDataBusy = true;
      const steps = lanActiveReceiver?.steps || null;
      try {
        if (!steps) showSyncNotice(lanText('trustedAutoNotice', payload.from?.name || lanText('unknownDevice')), 'working', true);
        if (steps) await steps.active(0);
        const accepted = await lanBridge.acceptIncoming();
        const bundle = accepted && accepted.mode === 'chunked' ? await lanReadChunkedBundle(accepted) : accepted;
        if (steps) steps.done(0);
        let message;
        if (payload.mode === 'copy') {
          if (steps) await steps.active(1);
          const profile = await lanCopyBundleAsProfile(bundle, payload.profile, false);
          if (steps) steps.done(1, profile.name);
          message = lanText('copyDone', profile.name);
        } else {
          const target = dataProfileById(payload.targetProfileId);
          if (!target) throw new Error(lanText('targetMissing'));
          const backup = await lanWriteIntoProfile(target, bundle, steps, 1, 2);
          message = `${lanText('replaceDone', target.name)} ${lanText('backupDoneAt', backup.path)}`;
        }
        await lanBridge.confirmIncoming();
        lanRefreshAfterReceive();
        if (steps) await lanFinishTransfer();
        setLanStatus(message, 'success');
        showSyncNotice(message);
      } catch (error) {
        await lanBridge.rejectIncoming().catch(() => {});
        if (steps) {
          lanSteps?.fail(error.message);
          await lanFinishTransfer();
        }
        setLanStatus(`${lanText('applyFail')}${error.message}`, 'error');
        showSyncNotice(`${lanText('applyFail')}${error.message}`, 'error');
      } finally {
        lanDataBusy = false;
        lanDataExpected = false;
        clearTimeout(lanDataExpectTimer);
        lanActiveReceiver = null;
        lanIncomingActive = false;
      }
    });
  }
  // ===== Acta 局域网同步结束 =====

  function enhanceRelationEditor() {
    const article = byId('editorPane')?.querySelector('[data-editor-id]');
    if (!article || article.dataset.relationUi === 'ready') return;
    const section = article.querySelector('.linked-section');
    const actions = article.querySelector('.editor-actions');
    const picker = section?.querySelector('.link-picker');
    if (!section || !actions || !picker) return;
    article.dataset.relationUi = 'ready';

    const relationCopy = { title: uiText('linkTitle'), close: uiText('close'), hint: uiText('linkHint') };
    const linkedRows = section.querySelectorAll('.linked-row');
    section.classList.add('relation-summary');
    section.hidden = linkedRows.length === 0;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'relation-trigger';
    trigger.title = relationCopy.title;
    trigger.setAttribute('aria-label', trigger.title);
    trigger.innerHTML = '<svg><use href="#i-link"/></svg>';
    actions.insertBefore(trigger, actions.querySelector('#deleteItem'));

    const dialog = document.createElement('dialog');
    dialog.className = 'relation-dialog';
    dialog.innerHTML = `<header class="relation-dialog-head"><span><svg><use href="#i-link"/></svg></span><h3>${relationCopy.title}</h3><button class="relation-dialog-close" type="button" aria-label="${relationCopy.close}"><svg><use href="#i-close"/></svg></button></header><div class="relation-dialog-body"><p class="relation-dialog-hint">${relationCopy.hint}</p></div>`;
    dialog.querySelector('.relation-dialog-body').appendChild(picker);
    article.appendChild(dialog);

    trigger.addEventListener('click', () => { if (!dialog.open) openAnimatedDialog(dialog); });
    dialog.querySelector('.relation-dialog-close').addEventListener('click', () => closeAnimatedDialog(dialog));
    // 弹出窗口不因点击空白处而关闭（设计约定），关闭只通过关闭按钮或 Esc。
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeAnimatedDialog(dialog); });
  }

  const editorObserver = new MutationObserver(enhanceRelationEditor);
  editorObserver.observe(byId('editorPane'), { childList: true, subtree: true });
  enhanceRelationEditor();

  // —— 编辑器内查找（待办与笔记通用）——
  // 查找栏以悬浮层形式锚定在编辑器滚动容器顶部；匹配用 CSS Highlight API
  // 高亮（不改写 DOM，不干扰正在编辑的内容），唯一例外是 Markdown 源码
  // textarea——无法注入高亮，改用选中区间定位。导航支持 Enter/Shift+Enter
  // 与上下按钮；Esc 关闭并清空高亮。
  const findHighlightsSupported = typeof window.Highlight === 'function' && window.CSS && CSS.highlights;
  const findState = { bar: null, input: null, count: null, matches: [], current: -1, ranges: [], targets: [], kind: 'rich', sourceInput: null, query: '' };

  const clearFindHighlights = () => {
    if (!findHighlightsSupported) return;
    CSS.highlights.delete('acta-find');
    CSS.highlights.delete('acta-find-current');
  };

  const findTargets = () => {
    const source = byId('noteMarkdownSource');
    if (source && !source.hidden) return { kind: 'source', input: source };
    const roots = [];
    const noteBody = byId('noteBody');
    if (noteBody && !noteBody.hidden) roots.push(noteBody);
    const todoNotes = byId('todoNotes');
    if (todoNotes) roots.push(todoNotes);
    document.querySelectorAll('.task-row:not([hidden]) .task-text').forEach(node => roots.push(node));
    return { kind: 'rich', roots };
  };

  // 在单个可编辑根内收集不跨元素的匹配区间（大小写不敏感）。
  const collectFindRanges = (root, query) => {
    const ranges = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.parentElement?.closest('[contenteditable="false"]')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const loweredQuery = query.toLowerCase();
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue || '';
      if (!text) continue;
      const loweredText = text.toLowerCase();
      let index = loweredText.indexOf(loweredQuery);
      while (index !== -1) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + query.length);
        ranges.push(range);
        index = loweredText.indexOf(loweredQuery, index + 1);
      }
    }
    return ranges;
  };

  const scrollFindRangeIntoView = range => {
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const pane = byId('editorPane');
    if (!pane) return;
    const paneRect = pane.getBoundingClientRect();
    if (rect.top < paneRect.top || rect.bottom > paneRect.bottom) {
      range.startContainer.parentElement?.scrollIntoView({
        block: 'center',
        behavior: reduceWindowMotion() ? 'auto' : 'smooth'
      });
    }
  };

  const updateFindCount = () => {
    if (!findState.count) return;
    findState.count.textContent = findState.matches.length
      ? `${findState.current + 1}/${findState.matches.length}`
      : t('findNoMatches');
  };

  const revealFindMatch = index => {
    if (!findState.matches.length) return;
    findState.current = ((index % findState.matches.length) + findState.matches.length) % findState.matches.length;
    const target = findState.targets?.[findState.current];
    if (findState.kind === 'source' && findState.sourceInput && target !== undefined) {
      findState.sourceInput.focus({ preventScroll: true });
      findState.sourceInput.setSelectionRange(target, target + findState.query.length);
    } else if (findHighlightsSupported && findState.ranges[findState.current]) {
      const current = new Highlight(findState.ranges[findState.current]);
      CSS.highlights.set('acta-find-current', current);
      scrollFindRangeIntoView(findState.ranges[findState.current]);
    }
    updateFindCount();
  };

  const runFind = () => {
    clearFindHighlights();
    findState.matches = [];
    findState.ranges = [];
    findState.targets = [];
    findState.current = -1;
    findState.kind = 'rich';
    const query = findState.input?.value || '';
    findState.query = query;
    if (!query) { updateFindCount(); return; }
    const targets = findTargets();
    findState.kind = targets.kind;
    if (targets.kind === 'source') {
      findState.sourceInput = targets.input;
      const value = targets.input.value.toLowerCase();
      const loweredQuery = query.toLowerCase();
      let index = value.indexOf(loweredQuery);
      while (index !== -1) {
        findState.targets.push(index);
        findState.matches.push(index);
        index = value.indexOf(loweredQuery, index + 1);
      }
    } else {
      targets.roots.forEach(root => {
        collectFindRanges(root, query).forEach(range => {
          findState.ranges.push(range);
          findState.matches.push(range);
        });
      });
      if (findHighlightsSupported && findState.ranges.length) {
        CSS.highlights.set('acta-find', new Highlight(...findState.ranges));
      }
    }
    if (findState.matches.length) revealFindMatch(0);
    else updateFindCount();
  };

  let findRunTimer = 0;
  const scheduleRunFind = () => {
    clearTimeout(findRunTimer);
    findRunTimer = setTimeout(runFind, 160);
  };

  const closeFindBar = restoreFocus => {
    clearTimeout(findRunTimer);
    clearFindHighlights();
    const bar = findState.bar;
    findState.bar = null;
    findState.input = null;
    findState.count = null;
    findState.sourceInput = null;
    findState.matches = [];
    findState.ranges = [];
    findState.targets = [];
    if (bar) {
      bar.classList.add('is-closing');
      setTimeout(() => bar.remove(), reduceWindowMotion() ? 0 : 160);
    }
    if (restoreFocus) byId('editorPane')?.querySelector('.editor-title, #noteBody, #todoNotes')?.focus({ preventScroll: true });
  };

  const openFindBar = () => {
    if (!getItem()) return;
    if (findState.bar?.isConnected) { findState.input?.select(); return; }
    closeFindBar(false);
    const pane = byId('editorPane');
    if (!pane) return;
    const bar = document.createElement('div');
    bar.className = 'editor-find';
    bar.setAttribute('role', 'search');
    bar.innerHTML = `
      <svg aria-hidden="true"><use href="#i-search"/></svg>
      <input type="text" placeholder="${escapeHTML(t('findPlaceholder'))}" aria-label="${escapeHTML(t('findInItem'))}"/>
      <span class="editor-find-count"></span>
      <button type="button" data-find-prev title="${escapeHTML(t('findPrev'))}" aria-label="${escapeHTML(t('findPrev'))}"><svg><use href="#i-chevron"/></svg></button>
      <button type="button" data-find-next title="${escapeHTML(t('findNext'))}" aria-label="${escapeHTML(t('findNext'))}"><svg><use href="#i-chevron"/></svg></button>
      <button type="button" data-find-close title="${escapeHTML(t('findClose'))}" aria-label="${escapeHTML(t('findClose'))}"><svg><use href="#i-close"/></svg></button>`;
    findState.bar = bar;
    findState.input = bar.querySelector('input');
    findState.count = bar.querySelector('.editor-find-count');
    bar.querySelector('[data-find-prev]').addEventListener('click', () => revealFindMatch(findState.current - 1));
    bar.querySelector('[data-find-next]').addEventListener('click', () => revealFindMatch(findState.current + 1));
    bar.querySelector('[data-find-close]').addEventListener('click', () => closeFindBar(true));
    findState.input.addEventListener('input', scheduleRunFind);
    findState.input.addEventListener('keydown', event => {
      if (isImeComposing(event)) return;
      if (event.key === 'Enter') { event.preventDefault(); revealFindMatch(findState.current + (event.shiftKey ? -1 : 1)); }
      else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeFindBar(true); }
    });
    pane.prepend(bar);
    requestAnimationFrame(() => bar.classList.add('is-open'));
    findState.input.focus();
    // 打开时带入编辑器中当前选中的文字，贴近系统查找的习惯。
    const selection = getSelection();
    const selected = selection && !selection.isCollapsed ? String(selection) : '';
    if (selected && selected.length <= 80) findState.input.value = selected;
    runFind();
  };

  // 编辑器重渲染会移除查找栏；同步清理残留高亮与状态。
  const findCleanupObserver = new MutationObserver(() => {
    if (findState.bar && !findState.bar.isConnected) closeFindBar(false);
  });
  findCleanupObserver.observe(byId('editorPane'), { childList: true });
  // 查找打开时，编辑内容变化后实时重算匹配。
  document.addEventListener('input', event => {
    if (!findState.bar?.isConnected) return;
    if (!(event.target instanceof Element) || !event.target.closest('#editorPane')) return;
    if (event.target === findState.input) return;
    scheduleRunFind();
  }, true);

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey && String(event.key).toLowerCase() === 'f') {
      // 速记弹窗、设置面板与导出对话框中的 Cmd+F 保持系统行为。
      if (document.querySelector('dialog[open], .settings-backdrop.open')) return;
      if (!getItem()) return;
      event.preventDefault();
      openFindBar();
      return;
    }
    if (event.key === 'Escape' && findState.bar?.isConnected
      && event.target instanceof Element
      && !event.target.closest('.editor-find')
      && event.target.closest('#editorPane')) {
      // 焦点在编辑器内按 Esc 也收起查找栏。
      event.preventDefault();
      closeFindBar(true);
    }
  });

  function enhanceFindEditor() {
    const article = byId('editorPane')?.querySelector('[data-editor-id]');
    if (!article || article.dataset.findUi === 'ready') return;
    const actions = article.querySelector('.editor-actions');
    if (!actions) return;
    article.dataset.findUi = 'ready';
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'editorFindButton';
    button.title = `${t('findInItemHint')}`;
    button.setAttribute('aria-label', button.title);
    button.innerHTML = '<svg><use href="#i-search"/></svg>';
    button.addEventListener('click', openFindBar);
    actions.insertBefore(button, actions.querySelector('#deleteItem'));
  }
  const findButtonObserver = new MutationObserver(enhanceFindEditor);
  findButtonObserver.observe(byId('editorPane'), { childList: true, subtree: true });
  enhanceFindEditor();

  let listRevealTimer = null;
  document.addEventListener('click', event => {
    const sidebarNavigation = event.target.closest('.sidebar [data-view]');
    if (sidebarNavigation && event.isTrusted) {
      clearTimeout(listRevealTimer);
      document.body.classList.remove('acta-steady');
      listRevealTimer = setTimeout(() => document.body.classList.add('acta-steady'), 720);
    } else {
      document.body.classList.add('acta-steady');
    }
  }, true);
  document.addEventListener('input', event => {
    if (event.target.closest('#searchInput')) document.body.classList.add('acta-steady');
  }, true);

  function showTodoBurst(target, undo) {
    const rect = target.getBoundingClientRect();
    const burst = document.createElement('span');
    burst.className = `todo-burst${undo ? ' undo' : ''}`;
    burst.style.left = `${rect.left + rect.width / 2}px`;
    burst.style.top = `${rect.top + rect.height / 2}px`;
    burst.innerHTML = `${undo ? '<svg class="undo-icon"><use href="#i-undo"/></svg>' : '<svg><use href="#i-check"/></svg>'}<i></i><i></i><i></i><i></i><i></i><i></i>`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 780);
  }

  let taskRefreshTimer = null;
  document.addEventListener('click', event => {
    const target = event.target.closest('.task-check, #completeItem, .calendar-todo-check, .calendar-subtask-check');
    if (!target) return;
    const row = target.closest('.task-row');
    const calendarItem = target.dataset.calendarToggle ? library.items.find(item => item.id === target.dataset.calendarToggle) : null;
    const calendarSubtaskItem = target.dataset.calendarSubtaskToggle ? library.items.find(item => item.id === target.dataset.calendarSubtaskToggle) : null;
    const calendarSubtask = calendarSubtaskItem?.tasks?.find(task => task.id === target.dataset.calendarSubtaskId);
    const undo = row ? row.classList.contains('done') : calendarSubtask ? Boolean(calendarSubtask.done) : calendarItem ? isTodoComplete(calendarItem) : isTodoComplete(getItem());
    showTodoBurst(target, undo);
    document.body.classList.add('acta-steady');
    document.body.classList.add('suppress-task-refresh');
    clearTimeout(taskRefreshTimer);
    taskRefreshTimer = setTimeout(() => document.body.classList.remove('suppress-task-refresh'), 800);
  }, true);

  async function restoreFolderConnections() {
    await dataProfilesReady.catch(() => {});
    // 清理本地文件夹同步模式遗留的授权数据与文件夹句柄。
    await removeDirectoryHandle('onedrive.graph.auth.v1').catch(() => {});
    await removeDirectoryHandle('onedrive').catch(() => {});
    uiSettings.oneDriveFolder = '';
    uiSettings.oneDriveLabel = '';
    try {
      const storedCredentials = await readDirectoryHandle(webDavCredentialStorageKey);
      if (storedCredentials?.server && storedCredentials?.username && storedCredentials?.password) {
        webDavCredentials = storedCredentials;
        webDavServer.value = storedCredentials.server;
        webDavUsername.value = storedCredentials.username;
        webDavPassword.value = storedCredentials.password;
        webDavAdapter = createWebDavAdapter(storedCredentials);
      }
    } catch (error) {
      webDavAdapter = null;
      setStatus(byId('oneDriveStatus'), error.message, 'error');
    }
    activateSelectedCloudAdapter(true);
    if (oneDriveAdapter) {
      autoSyncBaseline = librarySignature();
      autoSyncDirty = false;
      updateOneDriveUI(syncText('webDavStored'));
      configureAutomaticSync();
      if (uiSettings.autoSync) setTimeout(() => runAutomaticSync('interval'), 450);
      else {
        try { await refreshCloudVersion(); }
        catch (error) { setStatus(byId('oneDriveStatus'), error.message, 'error'); }
      }
    } else updateOneDriveUI();
  }
  restoreFolderConnections();

  const nativeApp = window.Capacitor?.Plugins?.App;
  if (nativeApp?.addListener) {
    nativeApp.addListener('resume', () => syncNativeSystemBar());
    nativeApp.addListener('backButton', async () => {
      if (document.body.classList.contains('note-focus-mode')) {
        byId('exitFocusNoteEditor')?.click();
        return;
      }
      const relationDialog = document.querySelector('.relation-dialog[open]');
      if (relationDialog) {
        closeAnimatedDialog(relationDialog);
        return;
      }
      if (settingsModal.classList.contains('open')) { closeSettings(); return; }
      if (byId('createMenu').classList.contains('open')) { byId('createMenu').classList.remove('open'); return; }
      if (byId('editorPane').classList.contains('mobile-open')) {
        mobileEditorOpen = false;
        byId('editorPane').classList.remove('mobile-open');
        return;
      }
      if (currentView !== 'inbox') {
        document.querySelector('[data-view="inbox"]')?.click();
        return;
      }
      if (nativeApp.minimizeApp) await nativeApp.minimizeApp();
    });
  }

  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && location.hostname !== 'tauri.localhost') {
    addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}), { once:true });
  }

  /* ===================== 平台快捷键标注 ===================== */
  const shortcutIsApple = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
  const shortcutNew = document.querySelector('.shortcut-new');
  const shortcutSearch = document.querySelector('.shortcut-search');
  if (shortcutNew) shortcutNew.textContent = shortcutIsApple ? '⌘ N' : 'Ctrl+N';
  if (shortcutSearch) shortcutSearch.textContent = shortcutIsApple ? '⌘ K' : 'Ctrl+K';

  /* ===================== 自定义右键菜单（桌面端） ===================== */
  // 桌面端整体屏蔽原生右键菜单；可编辑区域提供剪切/复制/粘贴/全选，
  // 普通区域选中文字时提供复制。移动端与浏览器保留系统自带的文本操作栏。
  const contextMenu = byId('contextMenu');
  const contextMessages = {
    zh: { cut:'剪切', copy:'复制', paste:'粘贴', selectAll:'全选', pasteBlocked:'无法访问剪贴板，请使用 Ctrl+V 粘贴' },
    en: { cut:'Cut', copy:'Copy', paste:'Paste', selectAll:'Select all', pasteBlocked:'Clipboard is unavailable - use Ctrl+V to paste' },
    'zh-Hant': { cut:'剪下', copy:'複製', paste:'貼上', selectAll:'全選', pasteBlocked:'無法存取剪貼簿，請使用 Ctrl+V 貼上' }
  };
  const contextText = key => (contextMessages[uiSettings.language] || contextMessages.zh)[key] || key;
  let contextMenuItems = [];

  const editableContextMenuTarget = target => (
    target.closest('input:not([type]), input[type="text"], input[type="search"], input[type="url"], input[type="password"], input[type="number"], input[type="tel"], input[type="email"], textarea, [contenteditable="true"], [contenteditable=""]')
  );

  async function contextClipboardWrite(text) {
    if (!text) return;
    // 系统剪贴板优先（Tauri 插件，Windows WebView2 下 navigator.clipboard
    // 的读写权限会被默认拒绝），逐级降级到 Web API 与 execCommand。
    const pluginClipboard = window.__TAURI__?.clipboard;
    if (pluginClipboard?.writeText) {
      try { await pluginClipboard.writeText(text); return; } catch { /* 降级 */ }
    }
    try { await navigator.clipboard.writeText(text); return; } catch { /* 降级 */ }
    try { document.execCommand('copy'); } catch { }
  }

  async function contextPaste(target) {
    if (!target) return;
    target.focus?.();
    let text = '';
    const pluginClipboard = window.__TAURI__?.clipboard;
    if (pluginClipboard?.readText) {
      try { text = await pluginClipboard.readText(); } catch { text = ''; }
    }
    if (!text) {
      try { text = await navigator.clipboard.readText(); } catch { text = ''; }
    }
    if (!text) {
      let pasted = false;
      try { pasted = document.execCommand('paste'); } catch { pasted = false; }
      if (!pasted) showToast(contextText('pasteBlocked'));
      return;
    }
    if (!text) return;
    if (target.isContentEditable) {
      document.execCommand('insertText', false, text);
      return;
    }
    const length = target.value?.length ?? 0;
    const start = target.selectionStart ?? length;
    const end = target.selectionEnd ?? start;
    target.setRangeText(text, Math.min(start, length), Math.min(end, length), 'end');
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function closeContextMenu() {
    if (!contextMenu?.classList.contains('open')) return;
    contextMenu.classList.remove('open');
    contextMenu.setAttribute('aria-hidden', 'true');
  }

  function openContextMenu(x, y, items) {
    if (!contextMenu || !items.length) return;
    contextMenuItems = items;
    contextMenu.innerHTML = items.map((item, index) => `
      <button type="button" role="menuitem" data-context-index="${index}"${item.disabled ? ' disabled' : ''}>
        <span>${escapeHTML(item.label)}</span>${item.shortcut ? `<kbd>${escapeHTML(item.shortcut)}</kbd>` : ''}
      </button>`).join('');
    contextMenu.classList.add('open');
    contextMenu.setAttribute('aria-hidden', 'false');
    contextMenu.style.left = '0px';
    contextMenu.style.top = '0px';
    const rect = contextMenu.getBoundingClientRect();
    contextMenu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - rect.width - 8))}px`;
    contextMenu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - rect.height - 8))}px`;
  }

  contextMenu?.addEventListener('click', async event => {
    const button = event.target.closest('[data-context-index]');
    if (!button || button.disabled) return;
    const item = contextMenuItems[Number(button.dataset.contextIndex)];
    closeContextMenu();
    await item?.run?.();
  });

  if (window.actaDesktop && contextMenu) {
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
      closeContextMenu();
      const editable = editableContextMenuTarget(event.target);
      // textarea/input 的选区不反映在 window.getSelection() 里（此前标题
      // 右键的复制/剪切因此永远置灰），这里按元素类型分别取选区文本，
      // 并记录位置供「剪切」在菜单点击后显式删除（不依赖 document 选区）。
      let selected = '';
      let selectionRange = null;
      const selection = window.getSelection();
      if (editable && !editable.isContentEditable) {
        const start = editable.selectionStart ?? 0;
        const end = editable.selectionEnd ?? 0;
        if (end > start) {
          selected = editable.value.slice(start, end);
          selectionRange = { start, end };
        }
      } else if (selection && !selection.isCollapsed) {
        selected = String(selection);
        selectionRange = selection.rangeCount ? selection.getRangeAt(0) : null;
      }
      const modifier = shortcutIsApple ? '⌘' : 'Ctrl';
      const removeSelectedText = () => {
        if (editable && !editable.isContentEditable && selectionRange) {
          editable.focus();
          editable.setRangeText('', selectionRange.start, selectionRange.end, 'end');
          editable.dispatchEvent(new Event('input', { bubbles: true }));
          editable.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
        document.execCommand('delete');
      };
      const items = [];
      if (editable) {
        items.push(
          { label: contextText('cut'), shortcut: `${modifier}X`, disabled: !selected, run: () => contextClipboardWrite(selected).then(removeSelectedText) },
          { label: contextText('copy'), shortcut: `${modifier}C`, disabled: !selected, run: () => contextClipboardWrite(selected) },
          { label: contextText('paste'), shortcut: `${modifier}V`, run: () => contextPaste(editable) },
          { label: contextText('selectAll'), shortcut: `${modifier}A`, run: () => { editable?.focus?.(); document.execCommand('selectAll'); } }
        );
      } else if (selected) {
        items.push({ label: contextText('copy'), shortcut: `${modifier}C`, run: () => contextClipboardWrite(selected) });
      }
      openContextMenu(event.clientX, event.clientY, items);
    });
    document.addEventListener('click', closeContextMenu, true);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeContextMenu(); });
    window.addEventListener('blur', closeContextMenu);
    window.addEventListener('scroll', closeContextMenu, true);
    window.addEventListener('resize', closeContextMenu);
  }

  /* ===================== 软件数据位置 + OOBE 首次设置 ===================== */
  function syncSettingsControls() {
    applyInterfaceLanguage(uiSettings.language, false);
    applyGeneralSettings();
    applyNoteEditorSettings();
    applyTheme();
    applySplashSettings();
    applyFontSettings();
    void applyAppIcon();
    defaultViewSetting.value = uiSettings.defaultView;
    compactModeSetting.checked = Boolean(uiSettings.compact);
    reduceMotionSetting.checked = Boolean(uiSettings.reduceMotion);
    backdropCloseSetting.value = ['none', 'single', 'double'].includes(uiSettings.backdropClose) ? uiSettings.backdropClose : 'double';
    applyNavSettings();
    navPageInputs.forEach(input => { input.checked = normalizeNavPages()[input.dataset.navPage] !== false; });
    syncMobileSlotControls();
    splashAnimationSetting.checked = uiSettings.splashAnimationEnabled !== false;
    splashPresetSetting.value = uiSettings.splashAnimationPreset;
    splashSpeedSetting.value = String(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
    splashSpeedValue.textContent = formatSplashSpeed(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
  }

  function updateAppDataSettingsRow() {
    const group = byId('appDataSettingsGroup');
    const pathEl = byId('appDataPath');
    if (!group || !pathEl) return;
    const bridge = appDataBridge();
    group.hidden = !bridge;
    if (!bridge) return;
    pathEl.textContent = appDataState.path || appearanceText('尚未设置');
  }

  async function mirrorAppDataSettings() {
    const bridge = appDataBridge();
    if (!bridge) return;
    try {
      const fileSettings = await bridge.loadAppDataSettings();
      if (fileSettings && typeof fileSettings === 'object' && !Array.isArray(fileSettings)) {
        Object.assign(uiSettings, fileSettings);
        localStorage.setItem(uiStorageKey, JSON.stringify(uiSettings));
        syncSettingsControls();
      }
    } catch { /* 文件缺失或损坏时按 localStorage 继续 */ }
    appDataState.ready = true;
    updateAppDataSettingsRow();
  }

  const oobeOverlay = byId('oobeOverlay');
  const oobeStepEls = oobeOverlay ? [...oobeOverlay.querySelectorAll('.oobe-step')] : [];
  const oobeDotEls = oobeOverlay ? [...byId('oobeSteps').querySelectorAll('li')] : [];
  const oobeStepCount = oobeStepEls.length;
  let oobeIndex = 0;
  let oobePrepared = false;

  function syncOobeControls() {
    document.querySelectorAll('input[name="oobeTheme"]').forEach(option => { option.checked = option.value === uiSettings.theme; });
    byId('oobeAppFont').value = uiSettings.appFont;
    byId('oobeFontSize').value = String(uiSettings.appFontSize);
    byId('oobeFontSizeValue').textContent = `${uiSettings.appFontSize} px`;
    byId('oobeSplashEnabled').checked = uiSettings.splashAnimationEnabled !== false;
    byId('oobeSplashPreset').value = uiSettings.splashAnimationPreset;
    byId('oobeSplashSpeed').value = String(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
    byId('oobeSplashSpeedValue').textContent = formatSplashSpeed(splashDurationToSpeed(uiSettings.splashAnimationSpeed));
  }

  function showOobeStep(index, backward = false) {
    oobeIndex = Math.max(0, Math.min(oobeStepCount - 1, index));
    oobeStepEls.forEach((step, i) => {
      step.classList.toggle('active', i === oobeIndex);
      step.classList.toggle('oobe-step-back', backward && i === oobeIndex);
    });
    oobeDotEls.forEach((dot, i) => {
      dot.classList.toggle('active', i === oobeIndex);
      dot.classList.toggle('done', i < oobeIndex);
    });
    byId('oobeStepLabel').textContent = `${oobeIndex + 1} / ${oobeStepCount}`;
    byId('oobeBack').hidden = oobeIndex === 0;
    const next = byId('oobeNext');
    next.disabled = oobeIndex === 0 && !oobePrepared;
    byId('oobeNextLabel').textContent = oobeIndex === oobeStepCount - 1 ? appearanceText('开始使用') : appearanceText('下一步');
  }

  function openOobe(state = {}) {
    if (!oobeOverlay || !oobeStepCount) return;
    // 首次启动：等待用户确认数据位置；从设置重新体验时，当前位置已就绪，
    // 直接放行，用户仍可在第一步改选其他文件夹。
    oobePrepared = Boolean(appDataState.ready && appDataState.path);
    byId('oobePathValue').textContent = oobePrepared ? appDataState.path : appearanceText('尚未选择');
    byId('oobePathHint').textContent = state.defaultPath
      ? `${appearanceText('默认位置：')}${state.defaultPath}`
      : appearanceText('便携版默认使用软件目录下的 data 文件夹；也可以自选位置。');
    syncOobeControls();
    showOobeStep(0);
    oobeOverlay.classList.add('open');
    oobeOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeOobe() {
    if (!oobeOverlay) return;
    oobeOverlay.classList.remove('open');
    oobeOverlay.setAttribute('aria-hidden', 'true');
  }

  async function prepareOobePath(path) {
    const bridge = appDataBridge();
    const errorEl = byId('oobePathError');
    if (!bridge || !path) return false;
    try {
      const result = await bridge.prepareAppData(path);
      appDataState.path = result?.path || path;
      appDataState.ready = true;
      oobePrepared = true;
      if (result?.settings && typeof result.settings === 'object' && !Array.isArray(result.settings)) {
        Object.assign(uiSettings, result.settings);
        localStorage.setItem(uiStorageKey, JSON.stringify(uiSettings));
        syncSettingsControls();
        syncOobeControls();
      }
      await bridge.saveAppDataSettings(JSON.stringify(uiSettings, null, 2)).catch(() => {});
      byId('oobePathValue').textContent = appDataState.path;
      byId('oobePathHint').textContent = appearanceText('已就绪，软件设置将保存在这里。');
      errorEl.hidden = true;
      showOobeStep(oobeIndex);
      updateAppDataSettingsRow();
      return true;
    } catch (error) {
      errorEl.textContent = `${appearanceText('无法使用该文件夹：')}${error?.message || error}`;
      errorEl.hidden = false;
      return false;
    }
  }

  async function initSoftwareData() {
    const bridge = appDataBridge();
    if (!bridge) return;
    updateAppDataSettingsRow();
    let state = null;
    try { state = await bridge.resolveAppData(); } catch { return; }
    if (state?.status === 'ready' && state.path) {
      appDataState.path = state.path;
      appDataState.ready = true;
      await mirrorAppDataSettings();
      updateAppDataSettingsRow();
      return;
    }
    openOobe(state || {});
  }

  if (oobeOverlay && oobeStepCount) {
    byId('oobeChooseFolder').addEventListener('click', async () => {
      const bridge = appDataBridge();
      if (!bridge) return;
      const path = await bridge.chooseAppDataFolder().catch(() => null);
      if (path) await prepareOobePath(path);
    });
    byId('oobeUseDefault').addEventListener('click', async () => {
      const bridge = appDataBridge();
      if (!bridge) return;
      let defaultPath = '';
      try { defaultPath = (await bridge.resolveAppData())?.defaultPath || ''; } catch { /* 忽略 */ }
      if (defaultPath) await prepareOobePath(defaultPath);
      else {
        const errorEl = byId('oobePathError');
        errorEl.textContent = appearanceText('无法确定默认位置，请点击「选择文件夹」手动指定。');
        errorEl.hidden = false;
      }
    });
    byId('oobeBack').addEventListener('click', () => showOobeStep(oobeIndex - 1, true));
    byId('oobeNext').addEventListener('click', () => {
      if (oobeIndex === 0 && !oobePrepared) return;
      if (oobeIndex === oobeStepCount - 1) {
        saveUISettings();
        closeOobe();
        return;
      }
      showOobeStep(oobeIndex + 1);
    });
    document.querySelectorAll('input[name="oobeTheme"]').forEach(option => option.addEventListener('change', () => {
      if (!option.checked) return;
      uiSettings.theme = option.value;
      applyTheme();
      saveUISettings();
      syncOobeControls();
    }));
    byId('oobeAppFont').addEventListener('change', () => {
      uiSettings.appFont = byId('oobeAppFont').value;
      applyFontSettings();
      saveUISettings();
      appFontSetting.value = uiSettings.appFont;
    });
    byId('oobeFontSize').addEventListener('input', () => {
      uiSettings.appFontSize = Number(byId('oobeFontSize').value);
      byId('oobeFontSizeValue').textContent = `${uiSettings.appFontSize} px`;
      applyFontSettings();
      saveUISettings();
    });
    byId('oobeSplashEnabled').addEventListener('change', () => {
      uiSettings.splashAnimationEnabled = byId('oobeSplashEnabled').checked;
      applySplashSettings();
      saveUISettings();
      splashAnimationSetting.checked = uiSettings.splashAnimationEnabled !== false;
    });
    byId('oobeSplashPreset').addEventListener('change', () => {
      if (!splashPresetChoices.has(byId('oobeSplashPreset').value)) return;
      uiSettings.splashAnimationPreset = byId('oobeSplashPreset').value;
      applySplashSettings();
      saveUISettings();
      splashPresetSetting.value = uiSettings.splashAnimationPreset;
    });
    byId('oobeSplashSpeed').addEventListener('input', () => {
      byId('oobeSplashSpeedValue').textContent = formatSplashSpeed(Number(byId('oobeSplashSpeed').value) || 1);
    });
    byId('oobeSplashSpeed').addEventListener('change', () => {
      uiSettings.splashAnimationSpeed = splashSpeedToDuration(Number(byId('oobeSplashSpeed').value));
      const speed = splashDurationToSpeed(uiSettings.splashAnimationSpeed);
      byId('oobeSplashSpeed').value = String(speed);
      byId('oobeSplashSpeedValue').textContent = formatSplashSpeed(speed);
      applySplashSettings();
      saveUISettings();
      splashSpeedSetting.value = String(speed);
      splashSpeedValue.textContent = formatSplashSpeed(speed);
    });
    byId('oobeSplashPreview').addEventListener('click', () => {
      const button = byId('oobeSplashPreview');
      button.classList.add('is-busy');
      window.actaSplash?.replay();
      setTimeout(() => button.classList.remove('is-busy'), 1200);
    });
  }

  byId('changeAppDataFolder')?.addEventListener('click', async () => {
    const bridge = appDataBridge();
    if (!bridge) return;
    const path = await bridge.chooseAppDataFolder().catch(() => null);
    if (!path) return;
    const status = byId('appDataStatus');
    try {
      await bridge.prepareAppData(path);
      appDataState.path = path;
      appDataState.ready = true;
      await bridge.saveAppDataSettings(JSON.stringify(uiSettings, null, 2)).catch(() => {});
      updateAppDataSettingsRow();
      setStatus(status, appearanceText('软件数据位置已更新，设置已迁移。'), 'success');
    } catch (error) {
      setStatus(status, `${appearanceText('无法使用该文件夹：')}${error?.message || error}`, 'error');
    }
  });
  byId('openAppDataFolder')?.addEventListener('click', () => {
    const bridge = appDataBridge();
    if (bridge && appDataState.path) bridge.openPath?.(appDataState.path);
  });

  byId('openOobeButton')?.addEventListener('click', () => {
    openOobe({});
  });

  void initSoftwareData();

  requestAnimationFrame(() => {
    const startView = document.querySelector(`[data-view="${uiSettings.defaultView}"]`);
    if (startView) startView.click();
  });
})();
