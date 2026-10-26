try {
  const storedActaSettings = JSON.parse(localStorage.getItem('acta.settings.v1') || 'null');
  if (storedActaSettings?.language === 'zh-Hant') {
    storedActaSettings.language = 'zh';
    localStorage.setItem('acta.settings.v1', JSON.stringify(storedActaSettings));
  }
} catch { /* Use the renderer defaults when stored settings are invalid. */ }

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE_KEY = 'acta.library.v1';
const SETTINGS_KEY = 'acta.settings.v1';

const dictionaries = {
  zh: {
    saved: '已保存', saving: '正在保存…', new: '新建', quickCapture: '速记', quickCaptureHint: '快速创建待办或笔记', newNote: '新建笔记', newNoteHint: '记录想法与灵感',
    newTodo: '新建待办', newTodoHint: '拆解目标与行动', inbox: '收集箱', today: '今天', todos: '待办', notes: '笔记', completed: '已完成',
    folders: '归类', classify: '归类', unclassified:'未归类', cloudSync: '数据同步', notConfigured: '尚未配置', localWorkspace: '行记数据', workspace: '行记数据', actaData: '行记数据',
    search: '搜索笔记和待办…', all: '全部', localFirst: '本地优先', syncTitle: '连接你的网盘',
    syncCopy: '选择设备本地、局域网或系统已挂载的网络文件夹。Acta 会在其中读写完整数据。',
    chooseFolder: '选择同步文件夹', noFolder: '尚未选择位置', download: '从网盘下载', upload: '上传到网盘', safeLocal: '数据默认只保存在你的设备上',
    item: '个项目', note: '笔记', todo: '待办', justNow: '刚刚', yesterday: '昨天', noItems: '这里还没有内容', noItemsHint: '新建一则笔记或待办，开始记录。',
    selectItem: '选择一项开始编辑', selectItemHint: '你的想法与行动会在这里展开。', untitledNote: '无标题笔记', untitledTodo: '新的待办',
    created: '创建于', updated: '更新于', dueDate: '截止日期', priority: '优先级', tags: '标签', high: '高', medium: '中', low: '低',
    progress: '任务进度', done: '已完成', addTask: '添加子任务', taskPlaceholder: '输入一个具体行动…', description: '补充说明',
    checkinTodo: '打卡待办', checkinTodoHint: '每天打卡，养成习惯', checkinToday: '今日打卡', checkinDone: '今日已打卡', checkinTodoYet: '今日未打卡',
    checkinStreak: '连续', checkinTotal: '累计', checkinDays: '天', checkinRecent: '最近 7 天', checkinUndo: '取消打卡', checkinMarkedToast: '打卡成功，继续保持',
    orderedTasks: '顺序执行', unorderedTasks: '无序子任务', taskOrderHint: '开启后子任务按顺序执行，可上下移动调整先后',
    taskMoveUp: '上移', taskMoveDown: '下移', taskDragHint: '拖动调整顺序',
    descriptionPlaceholder: '写下背景、上下文或任何需要记住的细节…', notePlaceholder: '从一个想法开始…', words: '字', chars: '字符',
    folderPrompt: '新归类的名称', folderDefault: '新归类', folderAdded: '归类已添加', itemCreated: '已创建', deleted: '已删除',
    deleteConfirm: '确定要删除这一项吗？', synced: '已同步', syncReady: '已连接', uploadDone: '已上传到网盘', downloadDone: '已从网盘恢复',
    chooseFirst: '请先选择同步文件夹', syncWorking: '正在同步…', invalidData: '同步失败', noDate: '无日期', commaTags: '用逗号分隔',
    format: '格式', heading: '标题', completeTask: '完成待办', reopenTask: '重新打开', modified: '最后编辑', archive: '归档',
    viewToday: '今天', viewTodos: '所有待办', viewNotes: '所有笔记', viewFolder: '归类', languageChanged: '已切换为中文',
    inboxFolder: '灵感收集', workFolder: '工作计划', lifeFolder: '生活清单', readingFolder: '阅读摘记',
    linkedItems: '关联项目', linkTodo: '关联待办', linkNote: '关联笔记', chooseTodo: '选择一个待办…', chooseNote: '选择一则笔记…',
    noLinks: '还没有关联项目', unlink: '取消关联', linked: '已建立双向关联', unlinked: '已取消关联',
    importNote: '导入笔记', importNoteHint: '支持 Markdown 与纯文本', exportNote: '导出这则笔记', noteImported: '笔记已导入', noteExported: '笔记已导出',
    importFailed: '导入失败', exportFailed: '导出失败', fileTooLarge: '文件不能超过 5 MB', invalidNoteFile: '无法读取这份笔记',
    calendar:'日历', yearView:'年', monthView:'月', weekView:'周', dayView:'日', previousPeriod:'上一时段', nextPeriod:'下一时段', previousYear:'上一年', nextYear:'下一年', previousMonth:'上一月', nextMonth:'下一月', previousWeek:'上一周', nextWeek:'下一周', previousDay:'上一日', nextDay:'下一日', backToToday:'今天', calendarNavigation:'日历导航', calendarViewOptions:'日历视图',
    noScheduledTodos:'这段时间没有待办', noScheduledTodosHint:'为待办设置截止日期后，它会显示在日历中。', scheduledTodos:'项待办',
    noCalendarItems:'这段时间没有日历内容', noCalendarItemsHint:'有排期的待办和当天创建的笔记会显示在这里。', calendarItems:'项日历内容', createdNotes:'当日创建笔记',
    moreTodos:'另有 {0} 项', linkedNotes:'关联笔记', calendarLegendLinked:'带笔记关联', calendarOpenTodo:'打开待办', calendarOpenNote:'打开笔记', calendarOpenDay:'查看当日', weekNumber:'周数', swipeWeekHint:'左右滑动查看其他日期',
    stats:'总结', showCompletedTodos:'显示已完成', statOpen:'进行中', confirm:'确定', cancel:'取消',
    statsEmpty:'这里还没有内容可以统计', statsEmptyHint:'创建笔记或待办后，这里会展示记录情况。',
    trash:'回收站', trashItems:'件回收',
    trashEmptyTitle:'回收站还是空的', trashEmptyHint:'删除的待办和笔记会先躺在这里，不会自动清空，随时回来翻翻，也许就有新的灵感。',
    trashFooterNote:'回收站不会自动倾倒', restore:'恢复', destroy:'彻底删除', restored:'已恢复到原位', destroyed:'已彻底删除',
    emptyTrash:'清空回收站', emptyTrashConfirmTitle:'清空回收站', emptyTrashConfirmMessage:'回收站中的 {0} 件内容将被彻底删除，无法恢复。', trashEmptied:'回收站已清空',
    deletedAt:'删除于', restoreHint:'恢复到原来的归类', trashOpenHint:'回收站中的内容不会出现在列表、日历与总结里',
    deleteTitle:'删除项目', deleteSubtitle:'选择如何处理「{0}」', deleteTrashLabel:'移入回收站', deleteTrashHint:'保留在回收站中，随时可以恢复', deleteDestroyLabel:'直接删除', deleteDestroyHint:'不进入回收站，立即彻底删除', moveToTrash:'移入回收站', deletedToTrash:'已移入回收站',
    statsListTitle:'待办笔记清单', statsListHint:'收集指定时间段创建的待办与笔记，勾选后可制作图片',
    statsRangeAll:'全部时间', statsRangeToday:'今天', statsRange7:'最近 7 天', statsRange30:'最近 30 天', statsRange90:'最近 90 天', statsRangeCustom:'自定义',
    statsCustomStart:'开始日期', statsCustomEnd:'截止日期', statsMakeImage:'生成图片', statsSelectedCount:'已选 {0} 件', statsSelectAll:'全选', statsClearSelection:'清除选择',
    statsNeedSelection:'请先勾选要生成图片的条目', statsImageDone:'清单图片已生成', statsImageFailed:'图片生成失败', statsEmptyRange:'这个时间段还没有内容',
    statsGroupToday:'今天', statsGroupYesterday:'昨天', statsCheckItem:'加入图片',
    metaQuickActions:'快捷操作', metaCopyTitle:'复制标题', metaCopyBody:'复制全文', metaCopyNotes:'复制说明', metaCopyMarkdown:'复制 Markdown', metaMarkComplete:'标记完成', metaReopen:'重新打开', metaViewCalendar:'在日历查看', metaTrash:'移入回收站',
    copied:'已复制到剪贴板', copyFailed:'复制失败',
    board:'计划板', boardDefaultName:'计划板', boardOpenItem:'打开内容', boardFitView:'总览全板', boardZoomIn:'放大', boardZoomOut:'缩小',
    boardNewBoard:'新建计划板', boardRenameBoard:'重命名计划板', boardDeleteBoard:'删除计划板', boardNamePrompt:'计划板名称',
    boardDeleteConfirm:'删除「{0}」后，这块板上的摆放、文本与标注会一并移除，待办与笔记本身不受影响。', boardSwitchLabel:'切换计划板',
    boardAddText:'文本', boardAddMarker:'标注', boardAddItems:'导入', boardImportTitle:'导入到计划板',
    boardImportHint:'勾选要展示在这块板上的待办与笔记；取消勾选已添加的条目会把它从板上移除。',
    boardImportAdded:'已在板上', boardImportEmpty:'没有匹配的待办或笔记', boardImportApply:'应用', boardImportChange:'添加 {0} · 移除 {1}',
    boardTextPlaceholder:'双击编辑文本…', boardFontSize:'字号', boardFontLabel:'字体', boardFontApp:'跟随界面', boardFontSerif:'衬线', boardFontRounded:'圆体', boardFontMono:'等宽',
    boardAlignLeft:'左对齐', boardAlignCenter:'居中', boardAlignRight:'右对齐', boardRemoveWidget:'从板上移除',
    boardMarkerArrow:'箭头', boardMarkerRect:'方框', boardMarkerEllipse:'椭圆', boardMarkerLine:'直线', boardMarkerDraw:'笔绘', boardMarkerEraser:'橡皮擦', boardMarkerColor:'标注颜色', boardMarkerDone:'完成标注', boardMarkerStroke:'线条粗细', boardMarkerFill:'填充颜色', boardFillOpacity:'填充不透明度', boardStrokeOpacity:'线条不透明度', boardArrowHead:'前端箭头', boardArrowTail:'末端箭头', boardArrowNone:'无', boardArrowArrow:'箭头', boardArrowDot:'圆点', boardArrowBar:'短杠', boardMarkerStyle:'标注样式',
    boardBg:'背景', boardBgNone:'无背景', boardBgOpacity:'不透明度', boardRadius:'圆角', boardPadding:'内边距', boardCustomFont:'自定义字体', boardCustomFontHint:'输入本机已安装的字体名，如 Georgia',
    boardDeleteArm:'再点一次删除', boardUndo:'撤销', boardRedo:'重做', boardMarqueeClear:'取消选择', boardMarqueeDelete:'删除所选', boardSelectedCount:'已选 {0} 项',
    boardTextColor:'文字颜色', boardContentSettings:'显示内容', boardShowPill:'类型标签', boardShowPriority:'优先级', boardShowDate:'日期', boardShowPreview:'摘要', boardShowFoot:'底部信息', boardShowTasks:'子待办', boardShowBody:'完整内容', boardShowDoneOnly:'仅显示已完成', boardBodyLargeConfirm:'这篇笔记超过一万字符，完整显示可能影响流畅度。仍要开启完整内容显示吗？', boardWidgetOpacity:'不透明度',
    boardPersonalize:'个性化计划板', boardBgPattern:'背景图案', boardPatternDots:'点阵', boardPatternGrid:'网格', boardPatternNone:'无', boardPatternLines:'横线', boardPatternCross:'交叉点', boardGridColor:'网格颜色', boardGridOpacity:'网格不透明度', boardBoardBgColor:'背景颜色', boardBgColorTheme:'跟随主题', boardSnapGrid:'吸附到网格', boardGridSize:'图案网格大小',
    boardCustomColor:'自定义颜色', boardBrushPen:'钢笔', boardBrushHighlighter:'荧光笔', boardPenStroke:'粗细', boardPenOpacity:'不透明度', boardPenFlow:'流量', boardPenDone:'完成', boardPenCap:'笔尖', boardCapRound:'圆头', boardCapFlat:'平头', boardCapSquare:'方头', boardBrushEraser:'橡皮', boardPenMode:'笔绘模式：可连续绘制，橡皮擦在面板中切换，完成或按 Esc 退出', boardLayers:'图层', boardLayerShow:'显示图层', boardLayerHide:'隐藏图层', boardLayerGroup:'组', boardGroup:'组合所选', boardUngroup:'取消组合', brandEgg:'行记不辍 —— 这是 Acta 给好奇心的回礼',
    boardExportOptionsHint:'选择分辨率与图片格式；JPG 可调节压缩程度', boardExportScale:'分辨率', boardExportFormat:'图片格式', boardExportQuality:'JPG 质量', boardExportConfirm:'导出', boardExportPlan:'导出计划板文件 (.actaplan)', boardExportImage:'导出为图片', boardExportPdf:'导出为 PDF', boardExportDone:'计划板已导出', boardExportWorking:'正在渲染并导出，请稍候…', boardExportFailed:'导出失败', boardExportEmpty:'这块板还是空的，先加点内容再导出', boardImportPlan:'导入计划板文件 (.actaplan)', boardImported:'计划板已导入', boardImportInvalid:'这不是有效的 Acta 计划板文件', boardExportRegionTitle:'选择导出区域', boardExportRegionHint:'拖动边框或角点调整范围，导出框内内容', boardExportRegionAll:'全部元素', boardExportRegionView:'当前视图', boardExportRegionNext:'下一步',
    boardEmptyTitle:'这块板还是空的', boardEmptyHint:'用下方工具添加文本与标注，或导入想展示在这块板上的待办与笔记，自由摆放成你的计划板。'
  },
  en: {
    saved: 'Saved', saving: 'Saving…', new: 'New', quickCapture: 'Quick capture', quickCaptureHint: 'Create a task or note fast', newNote: 'New note', newNoteHint: 'Capture ideas and sparks',
    newTodo: 'New task', newTodoHint: 'Turn goals into action', inbox: 'Inbox', today: 'Today', todos: 'Tasks', notes: 'Notes', completed: 'Completed',
    folders: 'Classify', classify: 'Classify', unclassified:'Unclassified', cloudSync: 'Data sync', notConfigured: 'Not configured', localWorkspace: 'Acta Data', workspace: 'Acta Data', actaData: 'Acta Data',
    search: 'Search notes and tasks…', all: 'All', localFirst: 'Local first', syncTitle: 'Connect your cloud drive',
    syncCopy: 'Choose a device folder, LAN location, or mounted network folder. Acta reads and writes the complete data there.',
    chooseFolder: 'Choose sync folder', noFolder: 'No location selected', download: 'Download from cloud', upload: 'Upload to cloud', safeLocal: 'Your data stays on this device by default',
    item: 'items', note: 'Note', todo: 'Task', justNow: 'Just now', yesterday: 'Yesterday', noItems: 'Nothing here yet', noItemsHint: 'Create a note or task to get started.',
    selectItem: 'Select something to edit', selectItemHint: 'Your thoughts and actions will unfold here.', untitledNote: 'Untitled note', untitledTodo: 'New task',
    created: 'Created', updated: 'Updated', dueDate: 'Due date', priority: 'Priority', tags: 'Tags', high: 'High', medium: 'Medium', low: 'Low',
    progress: 'Task progress', done: 'complete', addTask: 'Add subtask', taskPlaceholder: 'Type a concrete action…', description: 'Notes',
    checkinTodo: 'Check-in task', checkinTodoHint: 'Check in daily to build a habit', checkinToday: "Today's check-in", checkinDone: 'Checked in today', checkinTodoYet: 'Not checked in yet',
    checkinStreak: 'streak', checkinTotal: 'total', checkinDays: 'days', checkinRecent: 'Last 7 days', checkinUndo: 'Undo check-in', checkinMarkedToast: 'Checked in — keep it going',
    orderedTasks: 'In order', unorderedTasks: 'Any order', taskOrderHint: 'Subtasks run in order; use the arrows to reorder',
    taskMoveUp: 'Move up', taskMoveDown: 'Move down', taskDragHint: 'Drag to reorder',
    descriptionPlaceholder: 'Add context, background, or anything worth remembering…', notePlaceholder: 'Start with an idea…', words: 'words', chars: 'characters',
    folderPrompt: 'Name your new classification', folderDefault: 'New classification', folderAdded: 'Classification added', itemCreated: 'Created', deleted: 'Deleted',
    deleteConfirm: 'Delete this item?', synced: 'Synced', syncReady: 'Connected', uploadDone: 'Uploaded to cloud', downloadDone: 'Restored from cloud',
    chooseFirst: 'Choose a sync folder first', syncWorking: 'Syncing…', invalidData: 'Sync failed', noDate: 'No date', commaTags: 'Separate with commas',
    format: 'Format', heading: 'Heading', completeTask: 'Complete task', reopenTask: 'Reopen task', modified: 'Last edited', archive: 'Archive',
    viewToday: 'Today', viewTodos: 'All tasks', viewNotes: 'All notes', viewFolder: 'Classification', languageChanged: 'Switched to English',
    inboxFolder: 'Idea inbox', workFolder: 'Work plans', lifeFolder: 'Life lists', readingFolder: 'Reading notes',
    linkedItems: 'Linked items', linkTodo: 'Link task', linkNote: 'Link note', chooseTodo: 'Choose a task…', chooseNote: 'Choose a note…',
    noLinks: 'No linked items yet', unlink: 'Unlink', linked: 'Linked in both directions', unlinked: 'Link removed',
    importNote: 'Import note', importNoteHint: 'Markdown and plain text', exportNote: 'Export this note', noteImported: 'Note imported', noteExported: 'Note exported',
    importFailed: 'Import failed', exportFailed: 'Export failed', fileTooLarge: 'Files must be under 5 MB', invalidNoteFile: 'This note could not be read',
    calendar:'Calendar', yearView:'Year', monthView:'Month', weekView:'Week', dayView:'Day', previousPeriod:'Previous period', nextPeriod:'Next period', previousYear:'Previous year', nextYear:'Next year', previousMonth:'Previous month', nextMonth:'Next month', previousWeek:'Previous week', nextWeek:'Next week', previousDay:'Previous day', nextDay:'Next day', backToToday:'Today', calendarNavigation:'Calendar navigation', calendarViewOptions:'Calendar views',
    noScheduledTodos:'No tasks in this period', noScheduledTodosHint:'Set a task deadline to place it on the calendar.', scheduledTodos:'tasks',
    noCalendarItems:'Nothing on this calendar yet', noCalendarItemsHint:'Scheduled tasks and notes created that day appear here.', calendarItems:'calendar items', createdNotes:'Notes created that day',
    moreTodos:'{0} more', linkedNotes:'Linked notes', calendarLegendLinked:'Linked to notes', calendarOpenTodo:'Open task', calendarOpenNote:'Open note', calendarOpenDay:'Open day', weekNumber:'Week', swipeWeekHint:'Swipe left or right for other days',
    stats:'Summary', showCompletedTodos:'Show completed', statOpen:'In progress', confirm:'Confirm', cancel:'Cancel',
    statsEmpty:'Nothing to report yet', statsEmptyHint:'Once you add notes or tasks, your activity shows up here.',
    trash:'Trash', trashItems:'items',
    trashEmptyTitle:'The trash is empty', trashEmptyHint:'Deleted notes and tasks rest here. Nothing is emptied automatically — come back and rummage whenever you like.',
    trashFooterNote:'Trash is never emptied automatically', restore:'Restore', destroy:'Delete forever', restored:'Restored to its place', destroyed:'Deleted forever',
    emptyTrash:'Empty trash', emptyTrashConfirmTitle:'Empty trash', emptyTrashConfirmMessage:'{0} items in the trash will be deleted forever and cannot be recovered.', trashEmptied:'Trash emptied',
    deletedAt:'Deleted', restoreHint:'Restore to its original classification', trashOpenHint:'Trashed items stay out of lists, calendar, and the summary',
    deleteTitle:'Delete item', deleteSubtitle:'Choose what to do with “{0}”', deleteTrashLabel:'Move to trash', deleteTrashHint:'Kept in the trash, restore anytime', deleteDestroyLabel:'Delete now', deleteDestroyHint:'Skips the trash and is deleted forever', moveToTrash:'Move to trash', deletedToTrash:'Moved to trash',
    statsListTitle:'Notes and tasks list', statsListHint:'Gather notes and tasks created in a chosen period, tick some, and make a picture',
    statsRangeAll:'All time', statsRangeToday:'Today', statsRange7:'Last 7 days', statsRange30:'Last 30 days', statsRange90:'Last 90 days', statsRangeCustom:'Custom',
    statsCustomStart:'Start date', statsCustomEnd:'End date', statsMakeImage:'Make picture', statsSelectedCount:'{0} selected', statsSelectAll:'Select all', statsClearSelection:'Clear',
    statsNeedSelection:'Tick some items before making a picture', statsImageDone:'List picture saved', statsImageFailed:'Picture export failed', statsEmptyRange:'Nothing was created in this period',
    statsGroupToday:'Today', statsGroupYesterday:'Yesterday', statsCheckItem:'Include in picture',
    metaQuickActions:'Quick actions', metaCopyTitle:'Copy title', metaCopyBody:'Copy content', metaCopyNotes:'Copy notes', metaCopyMarkdown:'Copy Markdown', metaMarkComplete:'Mark complete', metaReopen:'Reopen', metaViewCalendar:'Show on calendar', metaTrash:'Move to trash',
    copied:'Copied to clipboard', copyFailed:'Copy failed',
    board:'Plan board', boardDefaultName:'Plan board', boardOpenItem:'Open', boardFitView:'Fit board', boardZoomIn:'Zoom in', boardZoomOut:'Zoom out',
    boardNewBoard:'New plan board', boardRenameBoard:'Rename plan board', boardDeleteBoard:'Delete plan board', boardNamePrompt:'Plan board name',
    boardDeleteConfirm:'Deleting “{0}” removes its layout, texts, and markers. The tasks and notes themselves are untouched.', boardSwitchLabel:'Switch board',
    boardAddText:'Text', boardAddMarker:'Marker', boardAddItems:'Import', boardImportTitle:'Import to plan board',
    boardImportHint:'Tick the tasks and notes to show on this board; unticking an added item removes it from the board.',
    boardImportAdded:'On the board', boardImportEmpty:'No matching tasks or notes', boardImportApply:'Apply', boardImportChange:'Add {0} · remove {1}',
    boardTextPlaceholder:'Double-click to edit…', boardFontSize:'Font size', boardFontLabel:'Font', boardFontApp:'Follow interface', boardFontSerif:'Serif', boardFontRounded:'Rounded', boardFontMono:'Monospace',
    boardAlignLeft:'Align left', boardAlignCenter:'Align center', boardAlignRight:'Align right', boardRemoveWidget:'Remove from board',
    boardMarkerArrow:'Arrow', boardMarkerRect:'Box', boardMarkerEllipse:'Ellipse', boardMarkerLine:'Line', boardMarkerDraw:'Freehand', boardMarkerEraser:'Eraser', boardMarkerColor:'Marker color', boardMarkerDone:'Done', boardMarkerStroke:'Stroke width', boardMarkerFill:'Fill color', boardFillOpacity:'Fill opacity', boardStrokeOpacity:'Stroke opacity', boardArrowHead:'End arrowhead', boardArrowTail:'Start arrowhead', boardArrowNone:'None', boardArrowArrow:'Arrow', boardArrowDot:'Dot', boardArrowBar:'Bar', boardMarkerStyle:'Marker style',
    boardBg:'Background', boardBgNone:'None', boardBgOpacity:'Opacity', boardRadius:'Corner radius', boardPadding:'Padding', boardCustomFont:'Custom font', boardCustomFontHint:'Type an installed font family, e.g. Georgia',
    boardDeleteArm:'Tap again to delete', boardUndo:'Undo', boardRedo:'Redo', boardMarqueeClear:'Clear selection', boardMarqueeDelete:'Delete selected', boardSelectedCount:'{0} selected',
    boardTextColor:'Text color', boardContentSettings:'Shown content', boardShowPill:'Type pill', boardShowPriority:'Priority', boardShowDate:'Date', boardShowPreview:'Preview', boardShowFoot:'Footer', boardShowTasks:'Subtasks', boardShowBody:'Full content', boardShowDoneOnly:'Completed only', boardBodyLargeConfirm:'This note exceeds 10,000 characters — showing it in full may affect smoothness. Enable full content anyway?', boardWidgetOpacity:'Opacity',
    boardPersonalize:'Customize board', boardBgPattern:'Background pattern', boardPatternDots:'Dots', boardPatternGrid:'Grid', boardPatternNone:'None', boardPatternLines:'Ruled', boardPatternCross:'Crosses', boardGridColor:'Grid color', boardGridOpacity:'Grid opacity', boardBoardBgColor:'Background color', boardBgColorTheme:'Follow theme', boardSnapGrid:'Snap to grid', boardGridSize:'Pattern grid size',
    boardCustomColor:'Custom color', boardBrushPen:'Pen', boardBrushHighlighter:'Highlighter', boardPenStroke:'Size', boardPenOpacity:'Opacity', boardPenFlow:'Flow', boardPenDone:'Done', boardPenCap:'Tip', boardCapRound:'Round', boardCapFlat:'Flat', boardCapSquare:'Square', boardBrushEraser:'Eraser', boardPenMode:'Freehand mode: draw as many strokes as you like; the eraser lives in the panel; press Done or Esc to exit', boardLayers:'Layers', boardLayerShow:'Show layer', boardLayerHide:'Hide layer', boardLayerGroup:'Group', boardGroup:'Group selected', boardUngroup:'Ungroup', brandEgg:'Keep journaling — Acta thanks the curious',
    boardExportOptionsHint:'Pick resolution and image format; JPG compression is adjustable', boardExportScale:'Resolution', boardExportFormat:'Image format', boardExportQuality:'JPG quality', boardExportConfirm:'Export', boardExportPlan:'Export plan board file (.actaplan)', boardExportImage:'Export as image', boardExportPdf:'Export as PDF', boardExportDone:'Plan board exported', boardExportWorking:'Rendering and exporting — hang on…', boardExportFailed:'Export failed', boardExportEmpty:'This board is empty — add something before exporting', boardImportPlan:'Import plan board file (.actaplan)', boardImported:'Plan board imported', boardImportInvalid:'This is not a valid Acta plan board file', boardExportRegionTitle:'Choose export area', boardExportRegionHint:'Drag the frame or handles to adjust; the framed area is exported', boardExportRegionAll:'All elements', boardExportRegionView:'Current view', boardExportRegionNext:'Next',
    boardEmptyTitle:'This board is empty', boardEmptyHint:'Add text and markers with the toolbar below, or import tasks and notes to arrange freely into your plan board.'
  },
  ja: {
    saved: '保存済み', saving: '保存中…', new: '新規', quickCapture: 'クイック作成', quickCaptureHint: 'タスクやノートをすばやく作成', newNote: '新しいノート', newNoteHint: 'アイデアを書き留める',
    newTodo: '新しいタスク', newTodoHint: '目標を行動に変える', inbox: 'インボックス', today: '今日', todos: 'タスク', notes: 'ノート', completed: '完了',
    folders: '分類', classify: '分類', unclassified:'未分類', cloudSync: 'データ同期', notConfigured: '未設定', localWorkspace: 'Acta データ', workspace: 'Acta データ', actaData: 'Acta データ',
    search: 'ノートとタスクを検索…', all: 'すべて', localFirst: 'ローカル優先', syncTitle: 'クラウドドライブを接続',
    syncCopy: '端末のフォルダー、LAN、またはマウント済みのネットワークフォルダーを選択できます。Acta はそこに完全なデータを読み書きします。',
    chooseFolder: '同期フォルダーを選択', noFolder: '場所が未選択', download: 'クラウドからダウンロード', upload: 'クラウドへアップロード', safeLocal: 'データは既定でこの端末にのみ保存されます',
    item: '件', note: 'ノート', todo: 'タスク', justNow: 'たった今', yesterday: '昨日', noItems: 'まだ何もありません', noItemsHint: 'ノートやタスクを作成して始めましょう。',
    selectItem: '編集する項目を選択', selectItemHint: 'あなたの考えと行動がここに広がります。', untitledNote: '無題のノート', untitledTodo: '新しいタスク',
    created: '作成', updated: '更新', dueDate: '期限', priority: '優先度', tags: 'タグ', high: '高', medium: '中', low: '低',
    progress: 'タスクの進捗', done: '完了', addTask: 'サブタスクを追加', taskPlaceholder: '具体的な行動を入力…', description: 'メモ',
    checkinTodo: 'チェックインタスク', checkinTodoHint: '毎日のチェックインで習慣に', checkinToday: '今日のチェックイン', checkinDone: 'チェックイン済み', checkinTodoYet: '今日は未チェックイン',
    checkinStreak: '連続', checkinTotal: '合計', checkinDays: '日', checkinRecent: '過去 7 日間', checkinUndo: 'チェックインを取消', checkinMarkedToast: 'チェックインしました。この調子で',
    orderedTasks: '順序あり', unorderedTasks: '順序なし', taskOrderHint: 'サブタスクを順番に実行。矢印で並べ替えできます',
    taskMoveUp: '上へ移動', taskMoveDown: '下へ移動', taskDragHint: 'ドラッグで並べ替え',
    descriptionPlaceholder: '背景や文脈、覚えておきたいことを書きます…', notePlaceholder: 'アイデアから始めましょう…', words: '語', chars: '文字',
    folderPrompt: '新しい分類の名前', folderDefault: '新しい分類', folderAdded: '分類を追加しました', itemCreated: '作成しました', deleted: '削除済み',
    deleteConfirm: 'この項目を削除しますか？', synced: '同期済み', syncReady: '接続済み', uploadDone: 'クラウドへアップロードしました', downloadDone: 'クラウドから復元しました',
    chooseFirst: '先に同期フォルダーを選択してください', syncWorking: '同期中…', invalidData: '同期に失敗しました', noDate: '日付なし', commaTags: 'カンマで区切って入力',
    format: '書式', heading: '見出し', completeTask: 'タスクを完了', reopenTask: 'やり直す', modified: '最終編集', archive: 'アーカイブ',
    viewToday: '今日', viewTodos: 'すべてのタスク', viewNotes: 'すべてのノート', viewFolder: '分類', languageChanged: '日本語に切り替えました',
    inboxFolder: 'アイデア収集', workFolder: '仕事の計画', lifeFolder: '生活リスト', readingFolder: '読書メモ',
    linkedItems: '関連項目', linkTodo: 'タスクを関連付け', linkNote: 'ノートを関連付け', chooseTodo: 'タスクを選択…', chooseNote: 'ノートを選択…',
    noLinks: '関連項目はまだありません', unlink: '関連付けを解除', linked: '双方向に関連付けました', unlinked: '関連付けを解除しました',
    importNote: 'ノートを読み込む', importNoteHint: 'Markdown とプレーンテキストに対応', exportNote: 'このノートを書き出す', noteImported: 'ノートを読み込みました', noteExported: 'ノートを書き出しました',
    importFailed: '読み込みに失敗しました', exportFailed: '書き出しに失敗しました', fileTooLarge: 'ファイルは 5 MB までです', invalidNoteFile: 'このノートを読み取れません',
    calendar:'カレンダー', yearView:'年', monthView:'月', weekView:'週', dayView:'日', previousPeriod:'前の期間', nextPeriod:'次の期間', previousYear:'前の年', nextYear:'次の年', previousMonth:'前の月', nextMonth:'次の月', previousWeek:'前の週', nextWeek:'次の週', previousDay:'前の日', nextDay:'次の日', backToToday:'今日', calendarNavigation:'カレンダー操作', calendarViewOptions:'カレンダー表示',
    noScheduledTodos:'この期間にタスクはありません', noScheduledTodosHint:'タスクに期限を設定するとカレンダーに表示されます。', scheduledTodos:'件のタスク',
    noCalendarItems:'この期間のカレンダー内容はありません', noCalendarItemsHint:'予定のあるタスクとその日に作成したノートがここに表示されます。', calendarItems:'件のカレンダー項目', createdNotes:'その日に作成したノート',
    moreTodos:'他 {0} 件', linkedNotes:'関連ノート', calendarLegendLinked:'ノートと関連', calendarOpenTodo:'タスクを開く', calendarOpenNote:'ノートを開く', calendarOpenDay:'この日を見る', weekNumber:'週', swipeWeekHint:'左右にスワイプで他の日へ',
    stats:'まとめ', showCompletedTodos:'完了を表示', statOpen:'進行中', confirm:'確定', cancel:'キャンセル',
    statsEmpty:'まだ集計できる内容がありません', statsEmptyHint:'ノートやタスクを作成すると、ここに記録が表示されます。',
    trash:'ゴミ箱', trashItems:'件',
    trashEmptyTitle:'ゴミ箱は空です', trashEmptyHint:'削除したノートとタスクはここに残ります。自動では空になりません。戻って探せば、新しいひらめきがあるかもしれません。',
    trashFooterNote:'ゴミ箱は自動では空になりません', restore:'復元', destroy:'完全に削除', restored:'元の場所に戻しました', destroyed:'完全に削除しました',
    emptyTrash:'ゴミ箱を空にする', emptyTrashConfirmTitle:'ゴミ箱を空にする', emptyTrashConfirmMessage:'ゴミ箱の {0} 件は完全に削除され、元に戻せません。', trashEmptied:'ゴミ箱を空にしました',
    deletedAt:'削除日時', restoreHint:'元の分類に戻す', trashOpenHint:'ゴミ箱の中身はリスト・カレンダー・まとめには表示されません',
    deleteTitle:'項目を削除', deleteSubtitle:'「{0}」の処理方法を選択', deleteTrashLabel:'ゴミ箱へ移動', deleteTrashHint:'ゴミ箱に残り、いつでも復元できます', deleteDestroyLabel:'即座に削除', deleteDestroyHint:'ゴミ箱を経由せず完全に削除します', moveToTrash:'ゴミ箱へ移動', deletedToTrash:'ゴミ箱へ移動しました',
    statsListTitle:'ノートとタスクのリスト', statsListHint:'指定期間に作成したノートとタスクを集め、チェックして画像を作成できます',
    statsRangeAll:'全期間', statsRangeToday:'今日', statsRange7:'過去 7 日間', statsRange30:'過去 30 日間', statsRange90:'過去 90 日間', statsRangeCustom:'カスタム',
    statsCustomStart:'開始日', statsCustomEnd:'終了日', statsMakeImage:'画像を作成', statsSelectedCount:'{0} 件を選択中', statsSelectAll:'すべて選択', statsClearSelection:'選択を解除',
    statsNeedSelection:'画像にする項目を先にチェックしてください', statsImageDone:'リスト画像を作成しました', statsImageFailed:'画像の作成に失敗しました', statsEmptyRange:'この期間に作成された内容はありません',
    statsGroupToday:'今日', statsGroupYesterday:'昨日', statsCheckItem:'画像に含める',
    metaQuickActions:'クイック操作', metaCopyTitle:'タイトルをコピー', metaCopyBody:'本文をコピー', metaCopyNotes:'メモをコピー', metaCopyMarkdown:'Markdown をコピー', metaMarkComplete:'完了にする', metaReopen:'再び開く', metaViewCalendar:'カレンダーで表示', metaTrash:'ゴミ箱へ移動',
    copied:'クリップボードにコピーしました', copyFailed:'コピーに失敗しました',
    board:'プランボード', boardDefaultName:'プランボード', boardOpenItem:'開く', boardFitView:'全体を表示', boardZoomIn:'拡大', boardZoomOut:'縮小',
    boardNewBoard:'新しいプランボード', boardRenameBoard:'プランボード名を変更', boardDeleteBoard:'プランボードを削除', boardNamePrompt:'プランボード名',
    boardDeleteConfirm:'「{0}」を削除すると、このボードのレイアウト・テキスト・マーカーも削除されます。タスクとノート自体は影響を受けません。', boardSwitchLabel:'ボードを切り替え',
    boardAddText:'テキスト', boardAddMarker:'マーカー', boardAddItems:'読み込む', boardImportTitle:'プランボードに読み込む',
    boardImportHint:'このボードに表示するタスクとノートにチェックしてください。追加済みの項目のチェックを外すとボードから削除されます。',
    boardImportAdded:'ボード上', boardImportEmpty:'一致するタスクやノートがありません', boardImportApply:'適用', boardImportChange:'追加 {0} · 削除 {1}',
    boardTextPlaceholder:'ダブルクリックで編集…', boardFontSize:'文字サイズ', boardFontLabel:'フォント', boardFontApp:'画面に合わせる', boardFontSerif:'明朝体', boardFontRounded:'丸ゴシック', boardFontMono:'等幅',
    boardAlignLeft:'左揃え', boardAlignCenter:'中央揃え', boardAlignRight:'右揃え', boardRemoveWidget:'ボードから削除',
    boardMarkerArrow:'矢印', boardMarkerRect:'矩形', boardMarkerEllipse:'楕円', boardMarkerLine:'直線', boardMarkerDraw:'フリーハンド', boardMarkerEraser:'消しゴム', boardMarkerColor:'マーカーの色', boardMarkerDone:'完了', boardMarkerStroke:'線の太さ', boardMarkerFill:'塗りつぶしの色', boardFillOpacity:'塗りの不透明度', boardStrokeOpacity:'線の不透明度', boardArrowHead:'終点の矢印', boardArrowTail:'始点の矢印', boardArrowNone:'なし', boardArrowArrow:'矢印', boardArrowDot:'点', boardArrowBar:'棒', boardMarkerStyle:'マーカー設定',
    boardBg:'背景', boardBgNone:'背景なし', boardBgOpacity:'不透明度', boardRadius:'角丸', boardPadding:'内側余白', boardCustomFont:'カスタムフォント', boardCustomFontHint:'端末にインストール済みのフォント名を入力（例: Georgia）',
    boardDeleteArm:'もう一度タップで削除', boardUndo:'元に戻す', boardRedo:'やり直す', boardMarqueeClear:'選択を解除', boardMarqueeDelete:'選択中を削除', boardSelectedCount:'{0} 件を選択中',
    boardTextColor:'文字の色', boardContentSettings:'表示内容', boardShowPill:'種類ラベル', boardShowPriority:'優先度', boardShowDate:'日付', boardShowPreview:'概要', boardShowFoot:'フッター', boardShowTasks:'サブタスク', boardShowBody:'全文表示', boardShowDoneOnly:'完了のみ表示', boardBodyLargeConfirm:'このノートは1万文字を超えています。全文表示は動作に影響する可能性があります。それでも有効にしますか？', boardWidgetOpacity:'不透明度',
    boardPersonalize:'ボードをカスタマイズ', boardBgPattern:'背景パターン', boardPatternDots:'ドット', boardPatternGrid:'グリッド', boardPatternNone:'なし', boardPatternLines:'罫線', boardPatternCross:'交差ポイント', boardGridColor:'グリッドの色', boardGridOpacity:'グリッドの不透明度', boardBoardBgColor:'背景色', boardBgColorTheme:'テーマに合わせる', boardSnapGrid:'グリッドにスナップ', boardGridSize:'パターンの間隔',
    boardCustomColor:'カスタムカラー', boardBrushPen:'ペン', boardBrushHighlighter:'蛍光ペン', boardPenStroke:'太さ', boardPenOpacity:'不透明度', boardPenFlow:'流量', boardPenDone:'完了', boardPenCap:'ペン先', boardCapRound:'丸', boardCapFlat:'平', boardCapSquare:'角', boardBrushEraser:'消しゴム', boardPenMode:'フリーハンドモード：何筆でも描けます。消しゴムはパネルで切り替え、完了または Esc で終了', boardLayers:'レイヤー', boardLayerShow:'レイヤーを表示', boardLayerHide:'レイヤーを非表示', boardLayerGroup:'グループ', boardGroup:'選択をグループ化', boardUngroup:'グループ解除', brandEgg:'筆を絶たず —— 好奇心に、Acta からの贈りもの',
    boardExportOptionsHint:'解像度と画像形式を選択。JPG は圧縮率を調整できます', boardExportScale:'解像度', boardExportFormat:'画像形式', boardExportQuality:'JPG 画質', boardExportConfirm:'書き出す', boardExportPlan:'プランボードファイルを書き出す(.actaplan)', boardExportImage:'画像として書き出す', boardExportPdf:'PDF として書き出す', boardExportDone:'プランボードを書き出しました', boardExportWorking:'レンダリングして書き出し中です。しばらくお待ちください…', boardExportFailed:'書き出しに失敗しました', boardExportEmpty:'このボードは空です。何か追加してから書き出してください', boardImportPlan:'プランボードファイルを読み込む(.actaplan)', boardImported:'プランボードを読み込みました', boardImportInvalid:'有効な Acta プランボードファイルではありません', boardExportRegionTitle:'書き出し範囲を選択', boardExportRegionHint:'枠やハンドルをドラッグして調整。枠内が書き出されます', boardExportRegionAll:'すべての要素', boardExportRegionView:'現在のビュー', boardExportRegionNext:'次へ',
    boardEmptyTitle:'このボードは空です', boardEmptyHint:'下のツールでテキストとマーカーを追加したり、タスクとノートを読み込んで、自由にプランボードを組み立てましょう。'
  },
  ko: {
    saved: '저장됨', saving: '저장 중…', new: '새로 만들기', quickCapture: '빠른 작성', quickCaptureHint: '할 일이나 노트를 빠르게 만들기', newNote: '새 노트', newNoteHint: '아이디어를 적어두기',
    newTodo: '새 할 일', newTodoHint: '목표를 행동으로 바꾸기', inbox: '수집함', today: '오늘', todos: '할 일', notes: '노트', completed: '완료됨',
    folders: '분류', classify: '분류', unclassified:'미분류', cloudSync: '데이터 동기화', notConfigured: '구성되지 않음', localWorkspace: 'Acta 데이터', workspace: 'Acta 데이터', actaData: 'Acta 데이터',
    search: '노트와 할 일 검색…', all: '전체', localFirst: '로컬 우선', syncTitle: '클라우드 드라이브 연결',
    syncCopy: '기기 폴더, LAN 또는 마운트된 네트워크 폴더를 선택하세요. Acta는 그 위치에 전체 데이터를 읽고 씁니다.',
    chooseFolder: '동기화 폴더 선택', noFolder: '위치가 선택되지 않음', download: '클라우드에서 내려받기', upload: '클라우드에 올리기', safeLocal: '데이터는 기본적으로 이 기기에만 저장됩니다',
    item: '개 항목', note: '노트', todo: '할 일', justNow: '방금 전', yesterday: '어제', noItems: '아직 아무것도 없어요', noItemsHint: '노트나 할 일을 만들어 시작해 보세요.',
    selectItem: '편집할 항목을 선택하세요', selectItemHint: '생각과 행동이 여기에서 펼쳐집니다.', untitledNote: '제목 없는 노트', untitledTodo: '새 할 일',
    created: '생성됨', updated: '업데이트됨', dueDate: '마감일', priority: '우선순위', tags: '태그', high: '높음', medium: '보통', low: '낮음',
    progress: '할 일 진행률', done: '완료', addTask: '하위 작업 추가', taskPlaceholder: '구체적인 행동을 입력…', description: '메모',
    checkinTodo: '체크인 할 일', checkinTodoHint: '매일 체크인으로 습관 만들기', checkinToday: '오늘의 체크인', checkinDone: '오늘 체크인 완료', checkinTodoYet: '아직 체크인하지 않음',
    checkinStreak: '연속', checkinTotal: '누적', checkinDays: '일', checkinRecent: '최근 7일', checkinUndo: '체크인 취소', checkinMarkedToast: '체크인 완료! 계속 이어가요',
    orderedTasks: '순서 있음', unorderedTasks: '순서 없음', taskOrderHint: '하위 작업을 순서대로 실행하며, 화살표로 순서를 바꿀 수 있어요',
    taskMoveUp: '위로 이동', taskMoveDown: '아래로 이동', taskDragHint: '드래그로 순서 변경',
    descriptionPlaceholder: '배경, 맥락 또는 기억할 내용을 적어보세요…', notePlaceholder: '아이디어로 시작해 보세요…', words: '단어', chars: '자',
    folderPrompt: '새 분류의 이름', folderDefault: '새 분류', folderAdded: '분류가 추가되었어요', itemCreated: '생성됨', deleted: '삭제됨',
    deleteConfirm: '이 항목을 삭제할까요?', synced: '동기화됨', syncReady: '연결됨', uploadDone: '클라우드에 올렸어요', downloadDone: '클라우드에서 복원했어요',
    chooseFirst: '먼저 동기화 폴더를 선택하세요', syncWorking: '동기화 중…', invalidData: '동기화 실패', noDate: '날짜 없음', commaTags: '쉼표로 구분',
    format: '서식', heading: '제목', completeTask: '할 일 완료', reopenTask: '다시 열기', modified: '마지막 편집', archive: '보관',
    viewToday: '오늘', viewTodos: '모든 할 일', viewNotes: '모든 노트', viewFolder: '분류', languageChanged: '한국어로 전환되었어요',
    inboxFolder: '아이디어 수집', workFolder: '업무 계획', lifeFolder: '생활 목록', readingFolder: '독서 노트',
    linkedItems: '연결된 항목', linkTodo: '할 일 연결', linkNote: '노트 연결', chooseTodo: '할 일 선택…', chooseNote: '노트 선택…',
    noLinks: '아직 연결된 항목이 없어요', unlink: '연결 해제', linked: '양방향으로 연결되었어요', unlinked: '연결이 해제되었어요',
    importNote: '노트 가져오기', importNoteHint: 'Markdown과 일반 텍스트 지원', exportNote: '이 노트 내보내기', noteImported: '노트를 가져왔어요', noteExported: '노트를 내보냈어요',
    importFailed: '가져오기 실패', exportFailed: '내보내기 실패', fileTooLarge: '파일은 5 MB 이하여야 해요', invalidNoteFile: '이 노트를 읽을 수 없어요',
    calendar:'달력', yearView:'년', monthView:'월', weekView:'주', dayView:'일', previousPeriod:'이전 기간', nextPeriod:'다음 기간', previousYear:'이전 해', nextYear:'다음 해', previousMonth:'이전 달', nextMonth:'다음 달', previousWeek:'이전 주', nextWeek:'다음 주', previousDay:'이전 날', nextDay:'다음 날', backToToday:'오늘', calendarNavigation:'달력 탐색', calendarViewOptions:'달력 보기',
    noScheduledTodos:'이 기간에는 할 일이 없어요', noScheduledTodosHint:'할 일에 마감일을 지정하면 달력에 표시돼요.', scheduledTodos:'개의 할 일',
    noCalendarItems:'이 기간의 달력 내용이 없어요', noCalendarItemsHint:'일정이 잡힌 할 일과 그날 만든 노트가 여기에 표시돼요.', calendarItems:'개의 달력 항목', createdNotes:'그날 만든 노트',
    moreTodos:'외 {0}개', linkedNotes:'연결된 노트', calendarLegendLinked:'노트와 연결', calendarOpenTodo:'할 일 열기', calendarOpenNote:'노트 열기', calendarOpenDay:'그날 보기', weekNumber:'주', swipeWeekHint:'좌우로 밀어 다른 날 보기',
    stats:'요약', showCompletedTodos:'완료된 항목 표시', statOpen:'진행 중', confirm:'확인', cancel:'취소',
    statsEmpty:'아직 집계할 내용이 없어요', statsEmptyHint:'노트나 할 일을 만들면 여기에 기록이 표시돼요.',
    trash:'휴지통', trashItems:'개 항목',
    trashEmptyTitle:'휴지통이 비어 있어요', trashEmptyHint:'삭제한 노트와 할 일은 여기에 머물러요. 자동으로 비워지지 않으니 언제든 돌아와 둘러보세요.',
    trashFooterNote:'휴지통은 자동으로 비워지지 않아요', restore:'복원', destroy:'영구 삭제', restored:'원래 자리로 복원했어요', destroyed:'영구 삭제했어요',
    emptyTrash:'휴지통 비우기', emptyTrashConfirmTitle:'휴지통 비우기', emptyTrashConfirmMessage:'휴지통의 {0}개 항목이 영구 삭제되며 복구할 수 없어요.', trashEmptied:'휴지통을 비웠어요',
    deletedAt:'삭제일', restoreHint:'원래 분류로 복원', trashOpenHint:'휴지통의 항목은 목록·달력·요약에 표시되지 않아요',
    deleteTitle:'항목 삭제', deleteSubtitle:'「{0}」을 어떻게 처리할까요', deleteTrashLabel:'휴지통으로 이동', deleteTrashHint:'휴지통에 보관되며 언제든 복원할 수 있어요', deleteDestroyLabel:'바로 삭제', deleteDestroyHint:'휴지통을 거치지 않고 영구 삭제해요', moveToTrash:'휴지통으로 이동', deletedToTrash:'휴지통으로 이동했어요',
    statsListTitle:'노트·할 일 목록', statsListHint:'지정 기간에 만든 노트와 할 일을 모아 체크하고 이미지로 만들 수 있어요',
    statsRangeAll:'전체 기간', statsRangeToday:'오늘', statsRange7:'최근 7일', statsRange30:'최근 30일', statsRange90:'최근 90일', statsRangeCustom:'직접 지정',
    statsCustomStart:'시작일', statsCustomEnd:'종료일', statsMakeImage:'이미지 만들기', statsSelectedCount:'{0}개 선택됨', statsSelectAll:'모두 선택', statsClearSelection:'선택 해제',
    statsNeedSelection:'이미지로 만들 항목을 먼저 체크하세요', statsImageDone:'목록 이미지를 만들었어요', statsImageFailed:'이미지 생성 실패', statsEmptyRange:'이 기간에 만든 내용이 없어요',
    statsGroupToday:'오늘', statsGroupYesterday:'어제', statsCheckItem:'이미지에 포함',
    metaQuickActions:'빠른 동작', metaCopyTitle:'제목 복사', metaCopyBody:'본문 복사', metaCopyNotes:'메모 복사', metaCopyMarkdown:'Markdown 복사', metaMarkComplete:'완료로 표시', metaReopen:'다시 열기', metaViewCalendar:'달력에서 보기', metaTrash:'휴지통으로 이동',
    copied:'클립보드에 복사했어요', copyFailed:'복사 실패',
    board:'플랜 보드', boardDefaultName:'플랜 보드', boardOpenItem:'열기', boardFitView:'전체 보기', boardZoomIn:'확대', boardZoomOut:'축소',
    boardNewBoard:'새 플랜 보드', boardRenameBoard:'플랜 보드 이름 바꾸기', boardDeleteBoard:'플랜 보드 삭제', boardNamePrompt:'플랜 보드 이름',
    boardDeleteConfirm:'「{0}」을 삭제하면 이 보드의 배치·텍스트·마커도 함께 사라져요. 할 일과 노트 자체는 영향받지 않아요.', boardSwitchLabel:'보드 전환',
    boardAddText:'텍스트', boardAddMarker:'마커', boardAddItems:'가져오기', boardImportTitle:'플랜 보드로 가져오기',
    boardImportHint:'이 보드에 표시할 할 일과 노트에 체크하세요. 추가된 항목의 체크를 해제하면 보드에서 사라져요.',
    boardImportAdded:'보드에 있음', boardImportEmpty:'일치하는 할 일이나 노트가 없어요', boardImportApply:'적용', boardImportChange:'추가 {0} · 삭제 {1}',
    boardTextPlaceholder:'두 번 눌러 편집…', boardFontSize:'글자 크기', boardFontLabel:'글꼴', boardFontApp:'인터페이스 따르기', boardFontSerif:'명조', boardFontRounded:'둥근 글꼴', boardFontMono:'고정폭',
    boardAlignLeft:'왼쪽 정렬', boardAlignCenter:'가운데 정렬', boardAlignRight:'오른쪽 정렬', boardRemoveWidget:'보드에서 제거',
    boardMarkerArrow:'화살표', boardMarkerRect:'사각형', boardMarkerEllipse:'타원', boardMarkerLine:'직선', boardMarkerDraw:'자유 곡선', boardMarkerEraser:'지우개', boardMarkerColor:'마커 색', boardMarkerDone:'완료', boardMarkerStroke:'선 굵기', boardMarkerFill:'채우기 색', boardFillOpacity:'채우기 불투명도', boardStrokeOpacity:'선 불투명도', boardArrowHead:'끝 화살촉', boardArrowTail:'시작 화살촉', boardArrowNone:'없음', boardArrowArrow:'화살표', boardArrowDot:'점', boardArrowBar:'막대', boardMarkerStyle:'마커 스타일',
    boardBg:'배경', boardBgNone:'배경 없음', boardBgOpacity:'불투명도', boardRadius:'모서리 둥글기', boardPadding:'안쪽 여백', boardCustomFont:'사용자 지정 글꼴', boardCustomFontHint:'기기에 설치된 글꼴 이름을 입력하세요(예: Georgia)',
    boardDeleteArm:'한 번 더 누르면 삭제', boardUndo:'실행 취소', boardRedo:'다시 실행', boardMarqueeClear:'선택 해제', boardMarqueeDelete:'선택 항목 삭제', boardSelectedCount:'{0}개 선택됨',
    boardTextColor:'글자 색', boardContentSettings:'표시 내용', boardShowPill:'유형 라벨', boardShowPriority:'우선순위', boardShowDate:'날짜', boardShowPreview:'요약', boardShowFoot:'하단 정보', boardShowTasks:'하위 작업', boardShowBody:'전체 내용', boardShowDoneOnly:'완료된 항목만', boardBodyLargeConfirm:'이 노트는 1만 자를 넘습니다. 전체 표시가 성능에 영향을 줄 수 있어요. 그래도 켜시겠어요?', boardWidgetOpacity:'불투명도',
    boardPersonalize:'보드 꾸미기', boardBgPattern:'배경 패턴', boardPatternDots:'점', boardPatternGrid:'격자', boardPatternNone:'없음', boardPatternLines:'줄선', boardPatternCross:'교차점', boardGridColor:'격자 색', boardGridOpacity:'격자 불투명도', boardBoardBgColor:'배경색', boardBgColorTheme:'테마 따르기', boardSnapGrid:'격자에 스냅', boardGridSize:'패턴 간격',
    boardCustomColor:'사용자 지정 색', boardBrushPen:'펜', boardBrushHighlighter:'형광펜', boardPenStroke:'굵기', boardPenOpacity:'불투명도', boardPenFlow:'유량', boardPenDone:'완료', boardPenCap:'펜촉', boardCapRound:'둥근 촉', boardCapFlat:'평평한 촉', boardCapSquare:'각진 촉', boardBrushEraser:'지우개', boardPenMode:'자유 곡선 모드: 여러 번 그릴 수 있어요. 지우개는 패널에서 전환하고 완료 또는 Esc로 종료', boardLayers:'레이어', boardLayerShow:'레이어 보이기', boardLayerHide:'레이어 숨기기', boardLayerGroup:'그룹', boardGroup:'선택 항목 그룹화', boardUngroup:'그룹 해제', brandEgg:'꾸준히 기록하기 — 호기심 깊은 당신에게, Acta 드림',
    boardExportOptionsHint:'해상도와 이미지 형식을 선택하세요. JPG는 압축 수준을 조절할 수 있어요', boardExportScale:'해상도', boardExportFormat:'이미지 형식', boardExportQuality:'JPG 품질', boardExportConfirm:'내보내기', boardExportPlan:'플랜 보드 파일 내보내기(.actaplan)', boardExportImage:'이미지로 내보내기', boardExportPdf:'PDF로 내보내기', boardExportDone:'플랜 보드를 내보냈어요', boardExportWorking:'렌더링 후 내보내는 중이에요. 잠시만 기다려 주세요…', boardExportFailed:'내보내기 실패', boardExportEmpty:'이 보드는 비어 있어요. 먼저 내용을 추가하세요', boardImportPlan:'플랜 보드 파일 가져오기(.actaplan)', boardImported:'플랜 보드를 가져왔어요', boardImportInvalid:'유효한 Acta 플랜 보드 파일이 아니에요', boardExportRegionTitle:'내보낼 영역 선택', boardExportRegionHint:'테두리나 핸들을 드래그해 조정하면 프레임 안이 내보내져요', boardExportRegionAll:'모든 요소', boardExportRegionView:'현재 보기', boardExportRegionNext:'다음',
    boardEmptyTitle:'이 보드는 비어 있어요', boardEmptyHint:'아래 도구로 텍스트와 마커를 추가하거나 할 일과 노트를 가져와 자유롭게 플랜 보드를 꾸며 보세요.'
  },
  fr: {
    saved: 'Enregistré', saving: 'Enregistrement…', new: 'Nouveau', quickCapture: 'Capture rapide', quickCaptureHint: 'Créer une tâche ou une note vite', newNote: 'Nouvelle note', newNoteHint: 'Noter idées et inspirations',
    newTodo: 'Nouvelle tâche', newTodoHint: 'Transformer les objectifs en action', inbox: 'Boîte de réception', today: 'Aujourd’hui', todos: 'Tâches', notes: 'Notes', completed: 'Terminé',
    folders: 'Classements', classify: 'Classement', unclassified:'Non classé', cloudSync: 'Synchro des données', notConfigured: 'Non configuré', localWorkspace: 'Données Acta', workspace: 'Données Acta', actaData: 'Données Acta',
    search: 'Rechercher notes et tâches…', all: 'Tout', localFirst: 'Priorité au local', syncTitle: 'Connecter votre disque cloud',
    syncCopy: 'Choisissez un dossier de l’appareil, un emplacement LAN ou un dossier réseau monté. Acta y lit et écrit l’intégralité des données.',
    chooseFolder: 'Choisir le dossier de synchro', noFolder: 'Aucun emplacement choisi', download: 'Télécharger du cloud', upload: 'Envoyer vers le cloud', safeLocal: 'Vos données restent sur cet appareil par défaut',
    item: 'éléments', note: 'Note', todo: 'Tâche', justNow: 'À l’instant', yesterday: 'Hier', noItems: 'Rien ici pour l’instant', noItemsHint: 'Créez une note ou une tâche pour commencer.',
    selectItem: 'Choisissez un élément à modifier', selectItemHint: 'Vos idées et vos actions se déploient ici.', untitledNote: 'Note sans titre', untitledTodo: 'Nouvelle tâche',
    created: 'Créé', updated: 'Mis à jour', dueDate: 'Échéance', priority: 'Priorité', tags: 'Étiquettes', high: 'Haute', medium: 'Moyenne', low: 'Basse',
    progress: 'Avancement', done: 'terminée', addTask: 'Ajouter une sous-tâche', taskPlaceholder: 'Saisir une action concrète…', description: 'Notes',
    checkinTodo: 'Tâche à pointage', checkinTodoHint: 'Pointer chaque jour pour prendre l’habitude', checkinToday: 'Pointage du jour', checkinDone: 'Pointé aujourd’hui', checkinTodoYet: 'Pas encore pointé',
    checkinStreak: 'série', checkinTotal: 'total', checkinDays: 'jours', checkinRecent: '7 derniers jours', checkinUndo: 'Annuler le pointage', checkinMarkedToast: 'Pointé — continuez ainsi',
    orderedTasks: 'Dans l’ordre', unorderedTasks: 'Sans ordre', taskOrderHint: 'Les sous-tâches s’exécutent dans l’ordre ; réorganisez avec les flèches',
    taskMoveUp: 'Monter', taskMoveDown: 'Descendre', taskDragHint: 'Glisser pour réorganiser',
    descriptionPlaceholder: 'Ajoutez le contexte, le fond ou tout ce qu’il faut retenir…', notePlaceholder: 'Commencez par une idée…', words: 'mots', chars: 'caractères',
    folderPrompt: 'Nom du nouveau classement', folderDefault: 'Nouveau classement', folderAdded: 'Classement ajouté', itemCreated: 'Créé', deleted: 'Supprimé',
    deleteConfirm: 'Supprimer cet élément ?', synced: 'Synchronisé', syncReady: 'Connecté', uploadDone: 'Envoyé vers le cloud', downloadDone: 'Restauré depuis le cloud',
    chooseFirst: 'Choisissez d’abord un dossier de synchro', syncWorking: 'Synchronisation…', invalidData: 'Échec de la synchro', noDate: 'Sans date', commaTags: 'Séparez par des virgules',
    format: 'Format', heading: 'Titre', completeTask: 'Terminer la tâche', reopenTask: 'Rouvrir', modified: 'Dernière modification', archive: 'Archiver',
    viewToday: 'Aujourd’hui', viewTodos: 'Toutes les tâches', viewNotes: 'Toutes les notes', viewFolder: 'Classement', languageChanged: 'Passé en français',
    inboxFolder: 'Boîte à idées', workFolder: 'Plans de travail', lifeFolder: 'Listes de vie', readingFolder: 'Notes de lecture',
    linkedItems: 'Éléments liés', linkTodo: 'Lier une tâche', linkNote: 'Lier une note', chooseTodo: 'Choisir une tâche…', chooseNote: 'Choisir une note…',
    noLinks: 'Aucun élément lié pour l’instant', unlink: 'Délier', linked: 'Lié dans les deux sens', unlinked: 'Lien supprimé',
    importNote: 'Importer une note', importNoteHint: 'Markdown et texte brut', exportNote: 'Exporter cette note', noteImported: 'Note importée', noteExported: 'Note exportée',
    importFailed: 'Échec de l’import', exportFailed: 'Échec de l’export', fileTooLarge: 'Les fichiers doivent faire moins de 5 Mo', invalidNoteFile: 'Impossible de lire cette note',
    calendar:'Calendrier', yearView:'Année', monthView:'Mois', weekView:'Semaine', dayView:'Jour', previousPeriod:'Période précédente', nextPeriod:'Période suivante', previousYear:'Année précédente', nextYear:'Année suivante', previousMonth:'Mois précédent', nextMonth:'Mois suivant', previousWeek:'Semaine précédente', nextWeek:'Semaine suivante', previousDay:'Jour précédent', nextDay:'Jour suivant', backToToday:'Aujourd’hui', calendarNavigation:'Navigation du calendrier', calendarViewOptions:'Vues du calendrier',
    noScheduledTodos:'Aucune tâche sur cette période', noScheduledTodosHint:'Fixez une échéance à une tâche pour la placer sur le calendrier.', scheduledTodos:'tâches',
    noCalendarItems:'Rien sur ce calendrier pour l’instant', noCalendarItemsHint:'Les tâches planifiées et les notes créées ce jour apparaissent ici.', calendarItems:'éléments du calendrier', createdNotes:'Notes créées ce jour',
    moreTodos:'{0} de plus', linkedNotes:'Notes liées', calendarLegendLinked:'Lié à des notes', calendarOpenTodo:'Ouvrir la tâche', calendarOpenNote:'Ouvrir la note', calendarOpenDay:'Voir le jour', weekNumber:'Sem.', swipeWeekHint:'Balayez pour les autres jours',
    stats:'Bilan', showCompletedTodos:'Afficher les terminées', statOpen:'En cours', confirm:'Confirmer', cancel:'Annuler',
    statsEmpty:'Rien à comptabiliser pour l’instant', statsEmptyHint:'Dès que vous ajouterez des notes ou des tâches, votre activité apparaîtra ici.',
    trash:'Corbeille', trashItems:'éléments',
    trashEmptyTitle:'La corbeille est vide', trashEmptyHint:'Les notes et tâches supprimées reposent ici. Rien n’est vidé automatiquement — revenez fouiller quand vous voulez.',
    trashFooterNote:'La corbeille ne se vide jamais toute seule', restore:'Restaurer', destroy:'Supprimer définitivement', restored:'Remis à sa place', destroyed:'Supprimé définitivement',
    emptyTrash:'Vider la corbeille', emptyTrashConfirmTitle:'Vider la corbeille', emptyTrashConfirmMessage:'{0} éléments de la corbeille seront supprimés définitivement, sans retour possible.', trashEmptied:'Corbeille vidée',
    deletedAt:'Supprimé le', restoreHint:'Restaurer dans son classement d’origine', trashOpenHint:'Le contenu de la corbeille reste hors des listes, du calendrier et du bilan',
    deleteTitle:'Supprimer l’élément', deleteSubtitle:'Choisissez le sort de « {0} »', deleteTrashLabel:'Mettre à la corbeille', deleteTrashHint:'Conservé dans la corbeille, restaurable à tout moment', deleteDestroyLabel:'Supprimer maintenant', deleteDestroyHint:'Sans passer par la corbeille, supprimé définitivement', moveToTrash:'Mettre à la corbeille', deletedToTrash:'Déplacé vers la corbeille',
    statsListTitle:'Liste de notes et tâches', statsListHint:'Rassemblez les notes et tâches créées sur une période, cochez, et faites une image',
    statsRangeAll:'Tout le temps', statsRangeToday:'Aujourd’hui', statsRange7:'7 derniers jours', statsRange30:'30 derniers jours', statsRange90:'90 derniers jours', statsRangeCustom:'Personnalisé',
    statsCustomStart:'Date de début', statsCustomEnd:'Date de fin', statsMakeImage:'Créer l’image', statsSelectedCount:'{0} sélectionnés', statsSelectAll:'Tout sélectionner', statsClearSelection:'Effacer la sélection',
    statsNeedSelection:'Cochez d’abord des éléments avant de créer l’image', statsImageDone:'Image de liste créée', statsImageFailed:'Échec de la création d’image', statsEmptyRange:'Rien n’a été créé sur cette période',
    statsGroupToday:'Aujourd’hui', statsGroupYesterday:'Hier', statsCheckItem:'Inclure dans l’image',
    metaQuickActions:'Actions rapides', metaCopyTitle:'Copier le titre', metaCopyBody:'Copier le contenu', metaCopyNotes:'Copier les notes', metaCopyMarkdown:'Copier en Markdown', metaMarkComplete:'Marquer terminée', metaReopen:'Rouvrir', metaViewCalendar:'Voir au calendrier', metaTrash:'Mettre à la corbeille',
    copied:'Copié dans le presse-papiers', copyFailed:'Échec de la copie',
    board:'Tableau', boardDefaultName:'Tableau', boardOpenItem:'Ouvrir', boardFitView:'Voir tout', boardZoomIn:'Zoomer', boardZoomOut:'Dézoomer',
    boardNewBoard:'Nouveau tableau', boardRenameBoard:'Renommer le tableau', boardDeleteBoard:'Supprimer le tableau', boardNamePrompt:'Nom du tableau',
    boardDeleteConfirm:'Supprimer « {0} » efface aussi sa disposition, ses textes et ses annotations. Les tâches et notes ne sont pas touchées.', boardSwitchLabel:'Changer de tableau',
    boardAddText:'Texte', boardAddMarker:'Annotation', boardAddItems:'Importer', boardImportTitle:'Importer vers le tableau',
    boardImportHint:'Cochez les tâches et notes à montrer sur ce tableau ; décocher un élément ajouté le retire du tableau.',
    boardImportAdded:'Sur le tableau', boardImportEmpty:'Aucune tâche ou note correspondante', boardImportApply:'Appliquer', boardImportChange:'Ajouter {0} · retirer {1}',
    boardTextPlaceholder:'Double-cliquez pour modifier…', boardFontSize:'Taille de police', boardFontLabel:'Police', boardFontApp:'Suivre l’interface', boardFontSerif:'Avec empattement', boardFontRounded:'Arrondie', boardFontMono:'Chasse fixe',
    boardAlignLeft:'Aligner à gauche', boardAlignCenter:'Centrer', boardAlignRight:'Aligner à droite', boardRemoveWidget:'Retirer du tableau',
    boardMarkerArrow:'Flèche', boardMarkerRect:'Rectangle', boardMarkerEllipse:'Ellipse', boardMarkerLine:'Ligne', boardMarkerDraw:'Dessin', boardMarkerEraser:'Gomme', boardMarkerColor:'Couleur d’annotation', boardMarkerDone:'Terminé', boardMarkerStroke:'Épaisseur du trait', boardMarkerFill:'Couleur de remplissage', boardFillOpacity:'Opacité du remplissage', boardStrokeOpacity:'Opacité du trait', boardArrowHead:'Pointe (fin)', boardArrowTail:'Pointe (début)', boardArrowNone:'Aucune', boardArrowArrow:'Flèche', boardArrowDot:'Point', boardArrowBar:'Barre', boardMarkerStyle:'Style du marquage',
    boardBg:'Arrière-plan', boardBgNone:'Aucun fond', boardBgOpacity:'Opacité', boardRadius:'Arrondi', boardPadding:'Marge interne', boardCustomFont:'Police personnalisée', boardCustomFontHint:'Saisissez une police installée, ex. Georgia',
    boardDeleteArm:'Touchez encore pour supprimer', boardUndo:'Annuler', boardRedo:'Rétablir', boardMarqueeClear:'Effacer la sélection', boardMarqueeDelete:'Supprimer la sélection', boardSelectedCount:'{0} sélectionnés',
    boardTextColor:'Couleur du texte', boardContentSettings:'Contenu affiché', boardShowPill:'Étiquette de type', boardShowPriority:'Priorité', boardShowDate:'Date', boardShowPreview:'Aperçu', boardShowFoot:'Pied', boardShowTasks:'Sous-tâches', boardShowBody:'Contenu complet', boardShowDoneOnly:'Terminées uniquement', boardBodyLargeConfirm:'Cette note dépasse 10 000 caractères — l’affichage complet peut nuire à la fluidité. Activer quand même ?', boardWidgetOpacity:'Opacité',
    boardPersonalize:'Personnaliser le tableau', boardBgPattern:'Motif de fond', boardPatternDots:'Points', boardPatternGrid:'Grille', boardPatternNone:'Aucun', boardPatternLines:'Lignes', boardPatternCross:'Croix', boardGridColor:'Couleur du quadrillage', boardGridOpacity:'Opacité du quadrillage', boardBoardBgColor:'Couleur de fond', boardBgColorTheme:'Suivre le thème', boardSnapGrid:'Aimanter à la grille', boardGridSize:'Taille de la grille',
    boardCustomColor:'Couleur personnalisée', boardBrushPen:'Stylo', boardBrushHighlighter:'Surligneur', boardPenStroke:'Épaisseur', boardPenOpacity:'Opacité', boardPenFlow:'Flux', boardPenDone:'Terminé', boardPenCap:'Pointe', boardCapRound:'Ronde', boardCapFlat:'Plate', boardCapSquare:'Carrée', boardBrushEraser:'Gomme', boardPenMode:'Mode dessin : tracez autant de traits que voulu ; la gomme se trouve dans le panneau ; terminez ou Échap pour sortir', boardLayers:'Calques', boardLayerShow:'Afficher le calque', boardLayerHide:'Masquer le calque', boardLayerGroup:'Groupe', boardGroup:'Grouper la sélection', boardUngroup:'Dissocier', brandEgg:'Tenir son journal — le cadeau d’Acta aux curieux',
    boardExportOptionsHint:'Choisissez la résolution et le format ; la compression JPG est réglable', boardExportScale:'Résolution', boardExportFormat:'Format d’image', boardExportQuality:'Qualité JPG', boardExportConfirm:'Exporter', boardExportPlan:'Exporter le fichier du tableau (.actaplan)', boardExportImage:'Exporter en image', boardExportPdf:'Exporter en PDF', boardExportDone:'Tableau exporté', boardExportWorking:'Rendu et export en cours — veuillez patienter…', boardExportFailed:'Échec de l’export', boardExportEmpty:'Ce tableau est vide — ajoutez du contenu avant d’exporter', boardImportPlan:'Importer le fichier du tableau (.actaplan)', boardImported:'Tableau importé', boardImportInvalid:'Ce fichier n’est pas un tableau Acta valide', boardExportRegionTitle:'Choisir la zone à exporter', boardExportRegionHint:'Faites glisser le cadre ou les poignées ; la zone encadrée est exportée', boardExportRegionAll:'Tous les éléments', boardExportRegionView:'Vue actuelle', boardExportRegionNext:'Suivant',
    boardEmptyTitle:'Ce tableau est vide', boardEmptyHint:'Ajoutez du texte et des annotations avec la barre d’outils, ou importez tâches et notes pour composer librement votre tableau.'
  },
  de: {
    saved: 'Gespeichert', saving: 'Speichern…', new: 'Neu', quickCapture: 'Schnellerfassung', quickCaptureHint: 'Aufgabe oder Notiz schnell anlegen', newNote: 'Neue Notiz', newNoteHint: 'Ideen und Einfälle festhalten',
    newTodo: 'Neue Aufgabe', newTodoHint: 'Ziele in Handlungen umsetzen', inbox: 'Eingang', today: 'Heute', todos: 'Aufgaben', notes: 'Notizen', completed: 'Erledigt',
    folders: 'Kategorien', classify: 'Kategorisieren', unclassified:'Unkategorisiert', cloudSync: 'Datensync', notConfigured: 'Nicht konfiguriert', localWorkspace: 'Acta-Daten', workspace: 'Acta-Daten', actaData: 'Acta-Daten',
    search: 'Notizen und Aufgaben suchen…', all: 'Alle', localFirst: 'Lokal zuerst', syncTitle: 'Cloud-Laufwerk verbinden',
    syncCopy: 'Wähle einen Geräteordner, einen LAN-Speicherort oder einen eingebundenen Netzwerkordner. Acta liest und schreibt die vollständigen Daten dort.',
    chooseFolder: 'Sync-Ordner wählen', noFolder: 'Kein Ort ausgewählt', download: 'Aus der Cloud laden', upload: 'In die Cloud laden', safeLocal: 'Deine Daten bleiben standardmäßig auf diesem Gerät',
    item: 'Einträge', note: 'Notiz', todo: 'Aufgabe', justNow: 'Gerade eben', yesterday: 'Gestern', noItems: 'Noch nichts hier', noItemsHint: 'Lege eine Notiz oder Aufgabe an, um loszulegen.',
    selectItem: 'Wähle etwas zum Bearbeiten', selectItemHint: 'Hier entfalten sich deine Gedanken und Handlungen.', untitledNote: 'Unbenannte Notiz', untitledTodo: 'Neue Aufgabe',
    created: 'Erstellt', updated: 'Aktualisiert', dueDate: 'Fällig am', priority: 'Priorität', tags: 'Tags', high: 'Hoch', medium: 'Mittel', low: 'Niedrig',
    progress: 'Aufgabenfortschritt', done: 'erledigt', addTask: 'Unteraufgabe hinzufügen', taskPlaceholder: 'Konkrete Handlung eingeben…', description: 'Notizen',
    checkinTodo: 'Check-in-Aufgabe', checkinTodoHint: 'Täglich einchecken, Gewohnheit aufbauen', checkinToday: 'Heutiger Check-in', checkinDone: 'Heute eingecheckt', checkinTodoYet: 'Noch nicht eingecheckt',
    checkinStreak: 'Serie', checkinTotal: 'gesamt', checkinDays: 'Tage', checkinRecent: 'Letzte 7 Tage', checkinUndo: 'Check-in zurücknehmen', checkinMarkedToast: 'Eingecheckt — mach so weiter',
    orderedTasks: 'In Reihenfolge', unorderedTasks: 'Ohne Reihenfolge', taskOrderHint: 'Unteraufgaben laufen der Reihe nach; mit Pfeilen umordnen',
    taskMoveUp: 'Nach oben', taskMoveDown: 'Nach unten', taskDragHint: 'Zum Umordnen ziehen',
    descriptionPlaceholder: 'Hintergrund, Kontext oder alles Wichtige notieren…', notePlaceholder: 'Starte mit einer Idee…', words: 'Wörter', chars: 'Zeichen',
    folderPrompt: 'Name der neuen Kategorie', folderDefault: 'Neue Kategorie', folderAdded: 'Kategorie hinzugefügt', itemCreated: 'Erstellt', deleted: 'Gelöscht',
    deleteConfirm: 'Diesen Eintrag löschen?', synced: 'Synchronisiert', syncReady: 'Verbunden', uploadDone: 'In die Cloud geladen', downloadDone: 'Aus der Cloud wiederhergestellt',
    chooseFirst: 'Wähle zuerst einen Sync-Ordner', syncWorking: 'Synchronisiere…', invalidData: 'Sync fehlgeschlagen', noDate: 'Kein Datum', commaTags: 'Mit Kommas trennen',
    format: 'Format', heading: 'Überschrift', completeTask: 'Aufgabe abschließen', reopenTask: 'Wieder öffnen', modified: 'Zuletzt bearbeitet', archive: 'Archivieren',
    viewToday: 'Heute', viewTodos: 'Alle Aufgaben', viewNotes: 'Alle Notizen', viewFolder: 'Kategorie', languageChanged: 'Auf Deutsch umgestellt',
    inboxFolder: 'Ideen-Eingang', workFolder: 'Arbeitspläne', lifeFolder: 'Alltagslisten', readingFolder: 'Lesenotizen',
    linkedItems: 'Verknüpfte Einträge', linkTodo: 'Aufgabe verknüpfen', linkNote: 'Notiz verknüpfen', chooseTodo: 'Aufgabe wählen…', chooseNote: 'Notiz wählen…',
    noLinks: 'Noch keine Verknüpfungen', unlink: 'Verknüpfung lösen', linked: 'In beide Richtungen verknüpft', unlinked: 'Verknüpfung gelöst',
    importNote: 'Notiz importieren', importNoteHint: 'Markdown und Klartext', exportNote: 'Diese Notiz exportieren', noteImported: 'Notiz importiert', noteExported: 'Notiz exportiert',
    importFailed: 'Import fehlgeschlagen', exportFailed: 'Export fehlgeschlagen', fileTooLarge: 'Dateien müssen unter 5 MB liegen', invalidNoteFile: 'Diese Notiz konnte nicht gelesen werden',
    calendar:'Kalender', yearView:'Jahr', monthView:'Monat', weekView:'Woche', dayView:'Tag', previousPeriod:'Vorherige Zeitspanne', nextPeriod:'Nächste Zeitspanne', previousYear:'Vorheriges Jahr', nextYear:'Nächstes Jahr', previousMonth:'Voriger Monat', nextMonth:'Nächster Monat', previousWeek:'Vorige Woche', nextWeek:'Nächste Woche', previousDay:'Voriger Tag', nextDay:'Nächster Tag', backToToday:'Heute', calendarNavigation:'Kalendernavigation', calendarViewOptions:'Kalenderansichten',
    noScheduledTodos:'Keine Aufgaben in diesem Zeitraum', noScheduledTodosHint:'Lege eine Fälligkeit fest, damit die Aufgabe im Kalender erscheint.', scheduledTodos:'Aufgaben',
    noCalendarItems:'Noch nichts im Kalender', noCalendarItemsHint:'Geplante Aufgaben und an dem Tag erstellte Notizen erscheinen hier.', calendarItems:'Kalendereinträge', createdNotes:'An dem Tag erstellte Notizen',
    moreTodos:'{0} weitere', linkedNotes:'Verknüpfte Notizen', calendarLegendLinked:'Mit Notizen verknüpft', calendarOpenTodo:'Aufgabe öffnen', calendarOpenNote:'Notiz öffnen', calendarOpenDay:'Tag öffnen', weekNumber:'KW', swipeWeekHint:'Wische für andere Tage',
    stats:'Bilanz', showCompletedTodos:'Erledigte zeigen', statOpen:'In Arbeit', confirm:'Bestätigen', cancel:'Abbrechen',
    statsEmpty:'Noch nichts zu berichten', statsEmptyHint:'Sobald du Notizen oder Aufgaben anlegst, erscheint deine Aktivität hier.',
    trash:'Papierkorb', trashItems:'Einträge',
    trashEmptyTitle:'Der Papierkorb ist leer', trashEmptyHint:'Gelöschte Notizen und Aufgaben ruhen hier. Nichts wird automatisch geleert — schau jederzeit wieder vorbei.',
    trashFooterNote:'Der Papierkorb wird nie automatisch geleert', restore:'Wiederherstellen', destroy:'Endgültig löschen', restored:'An seinen Platz zurückgeholt', destroyed:'Endgültig gelöscht',
    emptyTrash:'Papierkorb leeren', emptyTrashConfirmTitle:'Papierkorb leeren', emptyTrashConfirmMessage:'{0} Einträge im Papierkorb werden endgültig gelöscht und können nicht wiederhergestellt werden.', trashEmptied:'Papierkorb geleert',
    deletedAt:'Gelöscht am', restoreHint:'In die ursprüngliche Kategorie zurückholen', trashOpenHint:'Gelöschte Einträge erscheinen nicht in Listen, Kalender und Bilanz',
    deleteTitle:'Eintrag löschen', deleteSubtitle:'Was soll mit „{0}“ passieren', deleteTrashLabel:'In den Papierkorb', deleteTrashHint:'Bleibt im Papierkorb, jederzeit wiederherstellbar', deleteDestroyLabel:'Sofort löschen', deleteDestroyHint:'Überspringt den Papierkorb und wird endgültig gelöscht', moveToTrash:'In den Papierkorb', deletedToTrash:'In den Papierkorb verschoben',
    statsListTitle:'Notiz- und Aufgabenliste', statsListHint:'Notizen und Aufgaben eines Zeitraums sammeln, abhaken und als Bild erstellen',
    statsRangeAll:'Gesamte Zeit', statsRangeToday:'Heute', statsRange7:'Letzte 7 Tage', statsRange30:'Letzte 30 Tage', statsRange90:'Letzte 90 Tage', statsRangeCustom:'Benutzerdefiniert',
    statsCustomStart:'Startdatum', statsCustomEnd:'Enddatum', statsMakeImage:'Bild erstellen', statsSelectedCount:'{0} ausgewählt', statsSelectAll:'Alle auswählen', statsClearSelection:'Auswahl löschen',
    statsNeedSelection:'Hake zuerst Einträge an, bevor du ein Bild erstellst', statsImageDone:'Listenbild erstellt', statsImageFailed:'Bilderstellung fehlgeschlagen', statsEmptyRange:'In diesem Zeitraum wurde nichts erstellt',
    statsGroupToday:'Heute', statsGroupYesterday:'Gestern', statsCheckItem:'Ins Bild aufnehmen',
    metaQuickActions:'Schnellaktionen', metaCopyTitle:'Titel kopieren', metaCopyBody:'Inhalt kopieren', metaCopyNotes:'Notizen kopieren', metaCopyMarkdown:'Markdown kopieren', metaMarkComplete:'Als erledigt markieren', metaReopen:'Wieder öffnen', metaViewCalendar:'Im Kalender zeigen', metaTrash:'In den Papierkorb',
    copied:'In die Zwischenablage kopiert', copyFailed:'Kopieren fehlgeschlagen',
    board:'Planboard', boardDefaultName:'Planboard', boardOpenItem:'Öffnen', boardFitView:'Ganzes Board', boardZoomIn:'Vergrößern', boardZoomOut:'Verkleinern',
    boardNewBoard:'Neues Planboard', boardRenameBoard:'Planboard umbenennen', boardDeleteBoard:'Planboard löschen', boardNamePrompt:'Name des Planboards',
    boardDeleteConfirm:'Beim Löschen von „{0}“ werden Anordnung, Texte und Marker dieses Boards entfernt. Aufgaben und Notizen bleiben unberührt.', boardSwitchLabel:'Board wechseln',
    boardAddText:'Text', boardAddMarker:'Marker', boardAddItems:'Importieren', boardImportTitle:'Ins Planboard importieren',
    boardImportHint:'Hake Aufgaben und Notizen an, die auf dieses Board sollen; abgehakte Einträge werden vom Board entfernt.',
    boardImportAdded:'Auf dem Board', boardImportEmpty:'Keine passenden Aufgaben oder Notizen', boardImportApply:'Anwenden', boardImportChange:'Hinzufügen {0} · Entfernen {1}',
    boardTextPlaceholder:'Doppelklicken zum Bearbeiten…', boardFontSize:'Schriftgröße', boardFontLabel:'Schrift', boardFontApp:'Wie Oberfläche', boardFontSerif:'Serif', boardFontRounded:'Gerundet', boardFontMono:'Monospace',
    boardAlignLeft:'Linksbündig', boardAlignCenter:'Zentriert', boardAlignRight:'Rechtsbündig', boardRemoveWidget:'Vom Board entfernen',
    boardMarkerArrow:'Pfeil', boardMarkerRect:'Kasten', boardMarkerEllipse:'Ellipse', boardMarkerLine:'Linie', boardMarkerDraw:'Zeichnen', boardMarkerEraser:'Radierer', boardMarkerColor:'Markerfarbe', boardMarkerDone:'Fertig', boardMarkerStroke:'Linienbreite', boardMarkerFill:'Füllfarbe', boardFillOpacity:'Füll-Deckkraft', boardStrokeOpacity:'Linien-Deckkraft', boardArrowHead:'Spitze (Ende)', boardArrowTail:'Spitze (Anfang)', boardArrowNone:'Keine', boardArrowArrow:'Pfeil', boardArrowDot:'Punkt', boardArrowBar:'Strich', boardMarkerStyle:'Markierungsstil',
    boardBg:'Hintergrund', boardBgNone:'Kein Hintergrund', boardBgOpacity:'Deckkraft', boardRadius:'Eckenradius', boardPadding:'Innenabstand', boardCustomFont:'Eigene Schrift', boardCustomFontHint:'Name einer installierten Schrift, z. B. Georgia',
    boardDeleteArm:'Nochmal tippen zum Löschen', boardUndo:'Widerrufen', boardRedo:'Wiederholen', boardMarqueeClear:'Auswahl aufheben', boardMarqueeDelete:'Auswahl löschen', boardSelectedCount:'{0} ausgewählt',
    boardTextColor:'Textfarbe', boardContentSettings:'Angezeigter Inhalt', boardShowPill:'Typ-Label', boardShowPriority:'Priorität', boardShowDate:'Datum', boardShowPreview:'Vorschau', boardShowFoot:'Fußzeile', boardShowTasks:'Unteraufgaben', boardShowBody:'Vollständiger Inhalt', boardShowDoneOnly:'Nur erledigte', boardBodyLargeConfirm:'Diese Notiz überschreitet 10.000 Zeichen — die vollständige Anzeige kann die Flüssigkeit beeinträchtigen. Trotzdem aktivieren?', boardWidgetOpacity:'Deckkraft',
    boardPersonalize:'Board gestalten', boardBgPattern:'Hintergrundmuster', boardPatternDots:'Punkte', boardPatternGrid:'Gitter', boardPatternNone:'Keine', boardPatternLines:'Linien', boardPatternCross:'Kreuze', boardGridColor:'Rasterfarbe', boardGridOpacity:'Rasterdeckkraft', boardBoardBgColor:'Hintergrundfarbe', boardBgColorTheme:'Wie Thema', boardSnapGrid:'Am Raster ausrichten', boardGridSize:'Rastergröße',
    boardCustomColor:'Eigene Farbe', boardBrushPen:'Füller', boardBrushHighlighter:'Textmarker', boardPenStroke:'Stärke', boardPenOpacity:'Deckkraft', boardPenFlow:'Fluss', boardPenDone:'Fertig', boardPenCap:'Spitze', boardCapRound:'Rund', boardCapFlat:'Flach', boardCapSquare:'Quadratisch', boardBrushEraser:'Radierer', boardPenMode:'Zeichenmodus: so viele Striche wie du willst; der Radierer ist im Panel; mit Fertig oder Esc beenden', boardLayers:'Ebenen', boardLayerShow:'Ebene einblenden', boardLayerHide:'Ebene ausblenden', boardLayerGroup:'Gruppe', boardGroup:'Auswahl gruppieren', boardUngroup:'Gruppierung aufheben', brandEgg:'Weiter im Journal — Actas Geschenk an Neugierige',
    boardExportOptionsHint:'Auflösung und Bildformat wählen; JPG-Komprimierung ist einstellbar', boardExportScale:'Auflösung', boardExportFormat:'Bildformat', boardExportQuality:'JPG-Qualität', boardExportConfirm:'Exportieren', boardExportPlan:'Planboard-Datei exportieren (.actaplan)', boardExportImage:'Als Bild exportieren', boardExportPdf:'Als PDF exportieren', boardExportDone:'Planboard exportiert', boardExportWorking:'Wird gerendert und exportiert — bitte warten…', boardExportFailed:'Export fehlgeschlagen', boardExportEmpty:'Dieses Board ist leer — füge zuerst Inhalte hinzu', boardImportPlan:'Planboard-Datei importieren (.actaplan)', boardImported:'Planboard importiert', boardImportInvalid:'Dies ist keine gültige Acta-Planboard-Datei', boardExportRegionTitle:'Exportbereich wählen', boardExportRegionHint:'Rahmen oder Griffe ziehen, um den Bereich anzupassen; der Rahmeninhalt wird exportiert', boardExportRegionAll:'Alle Elemente', boardExportRegionView:'Aktuelle Ansicht', boardExportRegionNext:'Weiter',
    boardEmptyTitle:'Dieses Board ist leer', boardEmptyHint:'Füge über die Leiste unten Text und Marker hinzu oder importiere Aufgaben und Notizen und gestalte dein Planboard frei.'
  },
  es: {
    saved: 'Guardado', saving: 'Guardando…', new: 'Nuevo', quickCapture: 'Captura rápida', quickCaptureHint: 'Crea una tarea o nota al instante', newNote: 'Nueva nota', newNoteHint: 'Anota ideas e inspiraciones',
    newTodo: 'Nueva tarea', newTodoHint: 'Convierte metas en acción', inbox: 'Bandeja', today: 'Hoy', todos: 'Tareas', notes: 'Notas', completed: 'Completadas',
    folders: 'Clasificaciones', classify: 'Clasificar', unclassified:'Sin clasificar', cloudSync: 'Sincronización', notConfigured: 'Sin configurar', localWorkspace: 'Datos de Acta', workspace: 'Datos de Acta', actaData: 'Datos de Acta',
    search: 'Buscar notas y tareas…', all: 'Todo', localFirst: 'Primero lo local', syncTitle: 'Conecta tu disco en la nube',
    syncCopy: 'Elige una carpeta del dispositivo, una ubicación LAN o una carpeta de red montada. Acta lee y escribe allí todos los datos.',
    chooseFolder: 'Elegir carpeta de sincronización', noFolder: 'Sin ubicación elegida', download: 'Descargar de la nube', upload: 'Subir a la nube', safeLocal: 'Tus datos permanecen en este dispositivo por defecto',
    item: 'elementos', note: 'Nota', todo: 'Tarea', justNow: 'Justo ahora', yesterday: 'Ayer', noItems: 'Aún no hay nada aquí', noItemsHint: 'Crea una nota o tarea para empezar.',
    selectItem: 'Elige algo para editar', selectItemHint: 'Tus ideas y acciones se despliegan aquí.', untitledNote: 'Nota sin título', untitledTodo: 'Nueva tarea',
    created: 'Creado', updated: 'Actualizado', dueDate: 'Fecha límite', priority: 'Prioridad', tags: 'Etiquetas', high: 'Alta', medium: 'Media', low: 'Baja',
    progress: 'Progreso de la tarea', done: 'completada', addTask: 'Añadir subtarea', taskPlaceholder: 'Escribe una acción concreta…', description: 'Notas',
    checkinTodo: 'Tarea de registro', checkinTodoHint: 'Regístrate a diario para crear el hábito', checkinToday: 'Registro de hoy', checkinDone: 'Registrado hoy', checkinTodoYet: 'Aún sin registrar',
    checkinStreak: 'racha', checkinTotal: 'total', checkinDays: 'días', checkinRecent: 'Últimos 7 días', checkinUndo: 'Deshacer registro', checkinMarkedToast: '¡Registrado! Sigue así',
    orderedTasks: 'En orden', unorderedTasks: 'Sin orden', taskOrderHint: 'Las subtareas se ejecutan en orden; reordénalas con las flechas',
    taskMoveUp: 'Subir', taskMoveDown: 'Bajar', taskDragHint: 'Arrastra para reordenar',
    descriptionPlaceholder: 'Añade contexto, antecedentes o todo lo que valga la pena recordar…', notePlaceholder: 'Empieza con una idea…', words: 'palabras', chars: 'caracteres',
    folderPrompt: 'Nombre de la nueva clasificación', folderDefault: 'Nueva clasificación', folderAdded: 'Clasificación añadida', itemCreated: 'Creado', deleted: 'Eliminado',
    deleteConfirm: '¿Eliminar este elemento?', synced: 'Sincronizado', syncReady: 'Conectado', uploadDone: 'Subido a la nube', downloadDone: 'Restaurado desde la nube',
    chooseFirst: 'Elige antes una carpeta de sincronización', syncWorking: 'Sincronizando…', invalidData: 'Fallo de sincronización', noDate: 'Sin fecha', commaTags: 'Separa con comas',
    format: 'Formato', heading: 'Título', completeTask: 'Completar tarea', reopenTask: 'Reabrir', modified: 'Última edición', archive: 'Archivar',
    viewToday: 'Hoy', viewTodos: 'Todas las tareas', viewNotes: 'Todas las notas', viewFolder: 'Clasificación', languageChanged: 'Cambiado a español',
    inboxFolder: 'Bandeja de ideas', workFolder: 'Planes de trabajo', lifeFolder: 'Listas de vida', readingFolder: 'Notas de lectura',
    linkedItems: 'Elementos vinculados', linkTodo: 'Vincular tarea', linkNote: 'Vincular nota', chooseTodo: 'Elige una tarea…', chooseNote: 'Elige una nota…',
    noLinks: 'Aún no hay elementos vinculados', unlink: 'Desvincular', linked: 'Vinculado en ambos sentidos', unlinked: 'Vínculo eliminado',
    importNote: 'Importar nota', importNoteHint: 'Markdown y texto plano', exportNote: 'Exportar esta nota', noteImported: 'Nota importada', noteExported: 'Nota exportada',
    importFailed: 'Fallo al importar', exportFailed: 'Fallo al exportar', fileTooLarge: 'Los archivos deben pesar menos de 5 MB', invalidNoteFile: 'No se pudo leer esta nota',
    calendar:'Calendario', yearView:'Año', monthView:'Mes', weekView:'Semana', dayView:'Día', previousPeriod:'Periodo anterior', nextPeriod:'Periodo siguiente', previousYear:'Año anterior', nextYear:'Año siguiente', previousMonth:'Mes anterior', nextMonth:'Mes siguiente', previousWeek:'Semana anterior', nextWeek:'Semana siguiente', previousDay:'Día anterior', nextDay:'Día siguiente', backToToday:'Hoy', calendarNavigation:'Navegación del calendario', calendarViewOptions:'Vistas del calendario',
    noScheduledTodos:'Sin tareas en este periodo', noScheduledTodosHint:'Ponle fecha límite a una tarea para que aparezca en el calendario.', scheduledTodos:'tareas',
    noCalendarItems:'Nada en este calendario todavía', noCalendarItemsHint:'Las tareas programadas y las notas creadas ese día aparecen aquí.', calendarItems:'elementos del calendario', createdNotes:'Notas creadas ese día',
    moreTodos:'{0} más', linkedNotes:'Notas vinculadas', calendarLegendLinked:'Vinculadas a notas', calendarOpenTodo:'Abrir tarea', calendarOpenNote:'Abrir nota', calendarOpenDay:'Ver el día', weekNumber:'Sem.', swipeWeekHint:'Desliza para ver otros días',
    stats:'Resumen', showCompletedTodos:'Mostrar completadas', statOpen:'En curso', confirm:'Confirmar', cancel:'Cancelar',
    statsEmpty:'Nada que contabilizar todavía', statsEmptyHint:'Cuando añadas notas o tareas, tu actividad aparecerá aquí.',
    trash:'Papelera', trashItems:'elementos',
    trashEmptyTitle:'La papelera está vacía', trashEmptyHint:'Las notas y tareas eliminadas descansan aquí. Nada se vacía automáticamente — vuelve a rebuscar cuando quieras.',
    trashFooterNote:'La papelera nunca se vacía sola', restore:'Restaurar', destroy:'Eliminar para siempre', restored:'Devuelto a su lugar', destroyed:'Eliminado para siempre',
    emptyTrash:'Vaciar papelera', emptyTrashConfirmTitle:'Vaciar papelera', emptyTrashConfirmMessage:'{0} elementos de la papelera se eliminarán para siempre y no podrán recuperarse.', trashEmptied:'Papelera vaciada',
    deletedAt:'Eliminado el', restoreHint:'Restaurar a su clasificación original', trashOpenHint:'Lo que está en la papelera no aparece en listas, calendario ni resumen',
    deleteTitle:'Eliminar elemento', deleteSubtitle:'Elige qué hacer con «{0}»', deleteTrashLabel:'Mover a la papelera', deleteTrashHint:'Se guarda en la papelera; restaurable en cualquier momento', deleteDestroyLabel:'Eliminar ya', deleteDestroyHint:'Sin pasar por la papelera; se elimina para siempre', moveToTrash:'Mover a la papelera', deletedToTrash:'Movido a la papelera',
    statsListTitle:'Lista de notas y tareas', statsListHint:'Reúne notas y tareas creadas en un periodo, marca algunas y crea una imagen',
    statsRangeAll:'Todo el tiempo', statsRangeToday:'Hoy', statsRange7:'Últimos 7 días', statsRange30:'Últimos 30 días', statsRange90:'Últimos 90 días', statsRangeCustom:'Personalizado',
    statsCustomStart:'Fecha de inicio', statsCustomEnd:'Fecha de fin', statsMakeImage:'Crear imagen', statsSelectedCount:'{0} seleccionados', statsSelectAll:'Seleccionar todo', statsClearSelection:'Quitar selección',
    statsNeedSelection:'Marca elementos antes de crear la imagen', statsImageDone:'Imagen de lista creada', statsImageFailed:'Fallo al crear la imagen', statsEmptyRange:'No se creó nada en este periodo',
    statsGroupToday:'Hoy', statsGroupYesterday:'Ayer', statsCheckItem:'Incluir en la imagen',
    metaQuickActions:'Acciones rápidas', metaCopyTitle:'Copiar título', metaCopyBody:'Copiar contenido', metaCopyNotes:'Copiar notas', metaCopyMarkdown:'Copiar Markdown', metaMarkComplete:'Marcar completada', metaReopen:'Reabrir', metaViewCalendar:'Ver en el calendario', metaTrash:'Mover a la papelera',
    copied:'Copiado al portapapeles', copyFailed:'Fallo al copiar',
    board:'Tablero', boardDefaultName:'Tablero', boardOpenItem:'Abrir', boardFitView:'Ver todo', boardZoomIn:'Acercar', boardZoomOut:'Alejar',
    boardNewBoard:'Nuevo tablero', boardRenameBoard:'Renombrar tablero', boardDeleteBoard:'Eliminar tablero', boardNamePrompt:'Nombre del tablero',
    boardDeleteConfirm:'Al eliminar «{0}» se quitan su disposición, textos y anotaciones. Las tareas y notas no se tocan.', boardSwitchLabel:'Cambiar de tablero',
    boardAddText:'Texto', boardAddMarker:'Anotación', boardAddItems:'Importar', boardImportTitle:'Importar al tablero',
    boardImportHint:'Marca las tareas y notas que quieras mostrar en este tablero; desmarcar un elemento añadido lo quita del tablero.',
    boardImportAdded:'En el tablero', boardImportEmpty:'Sin tareas o notas coincidentes', boardImportApply:'Aplicar', boardImportChange:'Añadir {0} · quitar {1}',
    boardTextPlaceholder:'Doble clic para editar…', boardFontSize:'Tamaño de letra', boardFontLabel:'Fuente', boardFontApp:'Como la interfaz', boardFontSerif:'Con serifa', boardFontRounded:'Redondeada', boardFontMono:'Monoespaciada',
    boardAlignLeft:'Alinear a la izquierda', boardAlignCenter:'Centrar', boardAlignRight:'Alinear a la derecha', boardRemoveWidget:'Quitar del tablero',
    boardMarkerArrow:'Flecha', boardMarkerRect:'Caja', boardMarkerEllipse:'Elipse', boardMarkerLine:'Línea', boardMarkerDraw:'Dibujo', boardMarkerEraser:'Borrador', boardMarkerColor:'Color de anotación', boardMarkerDone:'Listo', boardMarkerStroke:'Grosor de línea', boardMarkerFill:'Color de relleno', boardFillOpacity:'Opacidad del relleno', boardStrokeOpacity:'Opacidad de la línea', boardArrowHead:'Punta final', boardArrowTail:'Punta inicial', boardArrowNone:'Ninguna', boardArrowArrow:'Flecha', boardArrowDot:'Punto', boardArrowBar:'Barra', boardMarkerStyle:'Estilo de anotación',
    boardBg:'Fondo', boardBgNone:'Sin fondo', boardBgOpacity:'Opacidad', boardRadius:'Redondeo', boardPadding:'Margen interior', boardCustomFont:'Fuente personalizada', boardCustomFontHint:'Escribe una fuente instalada, p. ej. Georgia',
    boardDeleteArm:'Toca otra vez para eliminar', boardUndo:'Deshacer', boardRedo:'Rehacer', boardMarqueeClear:'Quitar selección', boardMarqueeDelete:'Eliminar selección', boardSelectedCount:'{0} seleccionados',
    boardTextColor:'Color del texto', boardContentSettings:'Contenido mostrado', boardShowPill:'Etiqueta de tipo', boardShowPriority:'Prioridad', boardShowDate:'Fecha', boardShowPreview:'Vista previa', boardShowFoot:'Pie', boardShowTasks:'Subtareas', boardShowBody:'Contenido completo', boardShowDoneOnly:'Solo completadas', boardBodyLargeConfirm:'Esta nota supera los 10.000 caracteres; mostrarla completa puede afectar la fluidez. ¿Activar de todos modos?', boardWidgetOpacity:'Opacidad',
    boardPersonalize:'Personalizar tablero', boardBgPattern:'Patrón de fondo', boardPatternDots:'Puntos', boardPatternGrid:'Cuadrícula', boardPatternNone:'Ninguno', boardPatternLines:'Líneas', boardPatternCross:'Cruces', boardGridColor:'Color de cuadrícula', boardGridOpacity:'Opacidad de cuadrícula', boardBoardBgColor:'Color de fondo', boardBgColorTheme:'Según el tema', boardSnapGrid:'Ajustar a la cuadrícula', boardGridSize:'Tamaño de cuadrícula',
    boardCustomColor:'Color personalizado', boardBrushPen:'Pluma', boardBrushHighlighter:'Rotulador', boardPenStroke:'Grosor', boardPenOpacity:'Opacidad', boardPenFlow:'Flujo', boardPenDone:'Listo', boardPenCap:'Punta', boardCapRound:'Redonda', boardCapFlat:'Plana', boardCapSquare:'Cuadrada', boardBrushEraser:'Borrador', boardPenMode:'Modo dibujo: traza tantos trazos como quieras; el borrador está en el panel; termina o pulsa Esc para salir', boardLayers:'Capas', boardLayerShow:'Mostrar capa', boardLayerHide:'Ocultar capa', boardLayerGroup:'Grupo', boardGroup:'Agrupar selección', boardUngroup:'Desagrupar', brandEgg:'Sigue escribiendo — el regalo de Acta para los curiosos',
    boardExportOptionsHint:'Elige resolución y formato de imagen; la compresión JPG es ajustable', boardExportScale:'Resolución', boardExportFormat:'Formato de imagen', boardExportQuality:'Calidad JPG', boardExportConfirm:'Exportar', boardExportPlan:'Exportar archivo del tablero (.actaplan)', boardExportImage:'Exportar como imagen', boardExportPdf:'Exportar como PDF', boardExportDone:'Tablero exportado', boardExportWorking:'Renderizando y exportando; espera un momento…', boardExportFailed:'Fallo al exportar', boardExportEmpty:'Este tablero está vacío — añade contenido antes de exportar', boardImportPlan:'Importar archivo del tablero (.actaplan)', boardImported:'Tablero importado', boardImportInvalid:'No es un archivo de tablero Acta válido', boardExportRegionTitle:'Elegir área de exportación', boardExportRegionHint:'Arrastra el marco o las asas para ajustarlo; se exporta el área marcada', boardExportRegionAll:'Todos los elementos', boardExportRegionView:'Vista actual', boardExportRegionNext:'Siguiente',
    boardEmptyTitle:'Este tablero está vacío', boardEmptyHint:'Añade texto y anotaciones con la barra de abajo, o importa tareas y notas para componer tu tablero con libertad.'
  },
  ru: {
    saved: 'Сохранено', saving: 'Сохранение…', new: 'Новая запись', quickCapture: 'Быстрая заметка', quickCaptureHint: 'Быстро создать задачу или заметку', newNote: 'Новая заметка', newNoteHint: 'Записать идеи и мысли',
    newTodo: 'Новая задача', newTodoHint: 'Превратить цели в действия', inbox: 'Входящие', today: 'Сегодня', todos: 'Задачи', notes: 'Заметки', completed: 'Выполнено',
    folders: 'Категории', classify: 'Категория', unclassified:'Без категории', cloudSync: 'Синхронизация', notConfigured: 'Не настроено', localWorkspace: 'Данные Acta', workspace: 'Данные Acta', actaData: 'Данные Acta',
    search: 'Поиск заметок и задач…', all: 'Все', localFirst: 'Локально прежде всего', syncTitle: 'Подключите облачный диск',
    syncCopy: 'Выберите папку устройства, папку локальной сети или подключённую сетевую папку. Acta читает и записывает туда все данные.',
    chooseFolder: 'Выбрать папку синхронизации', noFolder: 'Место не выбрано', download: 'Скачать из облака', upload: 'Загрузить в облако', safeLocal: 'По умолчанию данные остаются на этом устройстве',
    item: 'записей', note: 'Заметка', todo: 'Задача', justNow: 'Только что', yesterday: 'Вчера', noItems: 'Здесь пока ничего нет', noItemsHint: 'Создайте заметку или задачу, чтобы начать.',
    selectItem: 'Выберите запись для редактирования', selectItemHint: 'Здесь развернутся ваши мысли и дела.', untitledNote: 'Заметка без названия', untitledTodo: 'Новая задача',
    created: 'Создано', updated: 'Обновлено', dueDate: 'Срок', priority: 'Приоритет', tags: 'Метки', high: 'Высокий', medium: 'Средний', low: 'Низкий',
    progress: 'Прогресс задачи', done: 'выполнено', addTask: 'Добавить подзадачу', taskPlaceholder: 'Введите конкретное действие…', description: 'Заметки',
    checkinTodo: 'Задача с отметкой', checkinTodoHint: 'Отмечайтесь ежедневно, чтобы выработать привычку', checkinToday: 'Отметка за сегодня', checkinDone: 'Сегодня отмечено', checkinTodoYet: 'Ещё не отмечено',
    checkinStreak: 'серия', checkinTotal: 'всего', checkinDays: 'дн.', checkinRecent: 'Последние 7 дней', checkinUndo: 'Отменить отметку', checkinMarkedToast: 'Отмечено — продолжайте в том же духе',
    orderedTasks: 'По порядку', unorderedTasks: 'Без порядка', taskOrderHint: 'Подзадачи выполняются по порядку; меняйте стрелками',
    taskMoveUp: 'Вверх', taskMoveDown: 'Вниз', taskDragHint: 'Перетащите, чтобы изменить порядок',
    descriptionPlaceholder: 'Добавьте контекст, предысторию и всё, что стоит запомнить…', notePlaceholder: 'Начните с идеи…', words: 'слова', chars: 'символы',
    folderPrompt: 'Название новой категории', folderDefault: 'Новая категория', folderAdded: 'Категория добавлена', itemCreated: 'Создано', deleted: 'Удалено',
    deleteConfirm: 'Удалить эту запись?', synced: 'Синхронизировано', syncReady: 'Подключено', uploadDone: 'Загружено в облако', downloadDone: 'Восстановлено из облака',
    chooseFirst: 'Сначала выберите папку синхронизации', syncWorking: 'Синхронизация…', invalidData: 'Сбой синхронизации', noDate: 'Без даты', commaTags: 'Разделяйте запятыми',
    format: 'Формат', heading: 'Заголовок', completeTask: 'Выполнить задачу', reopenTask: 'Открыть снова', modified: 'Изменено', archive: 'В архив',
    viewToday: 'Сегодня', viewTodos: 'Все задачи', viewNotes: 'Все заметки', viewFolder: 'Категория', languageChanged: 'Переключено на русский',
    inboxFolder: 'Копилка идей', workFolder: 'Рабочие планы', lifeFolder: 'Личные списки', readingFolder: 'Заметки о чтении',
    linkedItems: 'Связанные записи', linkTodo: 'Связать задачу', linkNote: 'Связать заметку', chooseTodo: 'Выберите задачу…', chooseNote: 'Выберите заметку…',
    noLinks: 'Связей пока нет', unlink: 'Разорвать связь', linked: 'Двусторонняя связь установлена', unlinked: 'Связь разорвана',
    importNote: 'Импорт заметки', importNoteHint: 'Markdown и обычный текст', exportNote: 'Экспортировать заметку', noteImported: 'Заметка импортирована', noteExported: 'Заметка экспортирована',
    importFailed: 'Не удалось импортировать', exportFailed: 'Не удалось экспортировать', fileTooLarge: 'Файлы не больше 5 МБ', invalidNoteFile: 'Не удалось прочитать эту заметку',
    calendar:'Календарь', yearView:'Год', monthView:'Месяц', weekView:'Неделя', dayView:'День', previousPeriod:'Предыдущий период', nextPeriod:'Следующий период', previousYear:'Прошлый год', nextYear:'Следующий год', previousMonth:'Прошлый месяц', nextMonth:'Следующий месяц', previousWeek:'Прошлая неделя', nextWeek:'Следующая неделя', previousDay:'Прошлый день', nextDay:'Следующий день', backToToday:'Сегодня', calendarNavigation:'Навигация по календарю', calendarViewOptions:'Виды календаря',
    noScheduledTodos:'Нет задач за этот период', noScheduledTodosHint:'Задайте задаче срок — она появится в календаре.', scheduledTodos:'задач',
    noCalendarItems:'В календаре пока пусто', noCalendarItemsHint:'Здесь появятся задачи с расписанием и заметки, созданные в этот день.', calendarItems:'записей календаря', createdNotes:'Заметки, созданные в этот день',
    moreTodos:'ещё {0}', linkedNotes:'Связанные заметки', calendarLegendLinked:'Связано с заметками', calendarOpenTodo:'Открыть задачу', calendarOpenNote:'Открыть заметку', calendarOpenDay:'Открыть день', weekNumber:'Нед.', swipeWeekHint:'Смахивайте, чтобы листать дни',
    stats:'Итоги', showCompletedTodos:'Показывать выполненные', statOpen:'В работе', confirm:'Подтвердить', cancel:'Отмена',
    statsEmpty:'Пока нечего подводить', statsEmptyHint:'Как только появятся заметки или задачи, здесь будет видна активность.',
    trash:'Корзина', trashItems:'записей',
    trashEmptyTitle:'Корзина пуста', trashEmptyHint:'Удалённые заметки и задачи лежат здесь. Автоочистки нет — возвращайтесь и пересматривайте в любой момент.',
    trashFooterNote:'Корзина никогда не очищается сама', restore:'Восстановить', destroy:'Удалить навсегда', restored:'Возвращено на место', destroyed:'Удалено навсегда',
    emptyTrash:'Очистить корзину', emptyTrashConfirmTitle:'Очистить корзину', emptyTrashConfirmMessage:'{0} записей в корзине будут удалены навсегда, восстановить их нельзя.', trashEmptied:'Корзина очищена',
    deletedAt:'Удалено', restoreHint:'Вернуть в исходную категорию', trashOpenHint:'Содержимое корзины не показывается в списках, календаре и итогах',
    deleteTitle:'Удалить запись', deleteSubtitle:'Что сделать с «{0}»', deleteTrashLabel:'В корзину', deleteTrashHint:'Останется в корзине, восстановить в любой момент', deleteDestroyLabel:'Удалить сразу', deleteDestroyHint:'Мимо корзины, удаление навсегда', moveToTrash:'В корзину', deletedToTrash:'Перемещено в корзину',
    statsListTitle:'Список заметок и задач', statsListHint:'Соберите заметки и задачи за период, отметьте нужные и сделайте картинку',
    statsRangeAll:'Всё время', statsRangeToday:'Сегодня', statsRange7:'Последние 7 дней', statsRange30:'Последние 30 дней', statsRange90:'Последние 90 дней', statsRangeCustom:'Свой период',
    statsCustomStart:'Дата начала', statsCustomEnd:'Дата конца', statsMakeImage:'Сделать картинку', statsSelectedCount:'Выбрано: {0}', statsSelectAll:'Выбрать все', statsClearSelection:'Снять выбор',
    statsNeedSelection:'Сначала отметьте записи для картинки', statsImageDone:'Картинка-список готова', statsImageFailed:'Не удалось создать картинку', statsEmptyRange:'За этот период ничего не создано',
    statsGroupToday:'Сегодня', statsGroupYesterday:'Вчера', statsCheckItem:'Включить в картинку',
    metaQuickActions:'Быстрые действия', metaCopyTitle:'Копировать заголовок', metaCopyBody:'Копировать текст', metaCopyNotes:'Копировать заметки', metaCopyMarkdown:'Копировать Markdown', metaMarkComplete:'Отметить выполненной', metaReopen:'Открыть снова', metaViewCalendar:'Показать в календаре', metaTrash:'В корзину',
    copied:'Скопировано в буфер обмена', copyFailed:'Не удалось скопировать',
    board:'Планшет', boardDefaultName:'Планшет', boardOpenItem:'Открыть', boardFitView:'Весь планшет', boardZoomIn:'Приблизить', boardZoomOut:'Отдалить',
    boardNewBoard:'Новый планшет', boardRenameBoard:'Переименовать планшет', boardDeleteBoard:'Удалить планшет', boardNamePrompt:'Название планшета',
    boardDeleteConfirm:'При удалении «{0}» исчезнут раскладка, тексты и пометки этого планшета. Сами задачи и заметки не пострадают.', boardSwitchLabel:'Сменить планшет',
    boardAddText:'Текст', boardAddMarker:'Пометка', boardAddItems:'Импорт', boardImportTitle:'Импорт на планшет',
    boardImportHint:'Отметьте задачи и заметки для показа на планшете; снятие отметки убирает запись с планшета.',
    boardImportAdded:'На планшете', boardImportEmpty:'Нет подходящих задач или заметок', boardImportApply:'Применить', boardImportChange:'Добавить {0} · убрать {1}',
    boardTextPlaceholder:'Двойное нажатие — редактировать…', boardFontSize:'Размер шрифта', boardFontLabel:'Шрифт', boardFontApp:'Как в интерфейсе', boardFontSerif:'С засечками', boardFontRounded:'Округлый', boardFontMono:'Моноширинный',
    boardAlignLeft:'По левому краю', boardAlignCenter:'По центру', boardAlignRight:'По правому краю', boardRemoveWidget:'Убрать с планшета',
    boardMarkerArrow:'Стрелка', boardMarkerRect:'Рамка', boardMarkerEllipse:'Овал', boardMarkerLine:'Линия', boardMarkerDraw:'Рисование', boardMarkerEraser:'Ластик', boardMarkerColor:'Цвет пометки', boardMarkerDone:'Готово', boardMarkerStroke:'Толщина линии', boardMarkerFill:'Цвет заливки', boardFillOpacity:'Непрозрачность заливки', boardStrokeOpacity:'Непрозрачность линии', boardArrowHead:'Наконечник (конец)', boardArrowTail:'Наконечник (начало)', boardArrowNone:'Нет', boardArrowArrow:'Стрелка', boardArrowDot:'Точка', boardArrowBar:'Черта', boardMarkerStyle:'Стиль пометки',
    boardBg:'Фон', boardBgNone:'Без фона', boardBgOpacity:'Непрозрачность', boardRadius:'Скругление', boardPadding:'Внутренние поля', boardCustomFont:'Свой шрифт', boardCustomFontHint:'Введите установленный шрифт, напр. Georgia',
    boardDeleteArm:'Нажмите ещё раз для удаления', boardUndo:'Отменить', boardRedo:'Повторить', boardMarqueeClear:'Снять выделение', boardMarqueeDelete:'Удалить выбранное', boardSelectedCount:'Выбрано: {0}',
    boardTextColor:'Цвет текста', boardContentSettings:'Показывать', boardShowPill:'Метка типа', boardShowPriority:'Приоритет', boardShowDate:'Дату', boardShowPreview:'Анонс', boardShowFoot:'Нижнюю строку', boardShowTasks:'Подзадачи', boardShowBody:'Полное содержимое', boardShowDoneOnly:'Только выполненные', boardBodyLargeConfirm:'Эта заметка больше 10 000 символов — полное отображение может снизить плавность. Всё равно включить?', boardWidgetOpacity:'Непрозрачность',
    boardPersonalize:'Оформить планшет', boardBgPattern:'Фоновый узор', boardPatternDots:'Точки', boardPatternGrid:'Сетка', boardPatternNone:'Нет', boardPatternLines:'Линии', boardPatternCross:'Перекрестия', boardGridColor:'Цвет сетки', boardGridOpacity:'Непрозрачность сетки', boardBoardBgColor:'Цвет фона', boardBgColorTheme:'Как в теме', boardSnapGrid:'Привязка к сетке', boardGridSize:'Шаг сетки',
    boardCustomColor:'Свой цвет', boardBrushPen:'Перо', boardBrushHighlighter:'Маркер', boardPenStroke:'Толщина', boardPenOpacity:'Непрозрачность', boardPenFlow:'Поток', boardPenDone:'Готово', boardPenCap:'Перо', boardCapRound:'Круглое', boardCapFlat:'Плоское', boardCapSquare:'Квадратное', boardBrushEraser:'Ластик', boardPenMode:'Режим рисования: рисуйте сколько угодно штрихов; ластик — в панели; «Готово» или Esc — выход', boardLayers:'Слои', boardLayerShow:'Показать слой', boardLayerHide:'Скрыть слой', boardLayerGroup:'Группа', boardGroup:'Сгруппировать выбранное', boardUngroup:'Разгруппировать', brandEgg:'Записывайте не останавливаясь — подарок Acta любопытным',
    boardExportOptionsHint:'Выберите разрешение и формат; сжатие JPG настраивается', boardExportScale:'Разрешение', boardExportFormat:'Формат изображения', boardExportQuality:'Качество JPG', boardExportConfirm:'Экспортировать', boardExportPlan:'Экспортировать файл планшета (.actaplan)', boardExportImage:'Экспортировать как изображение', boardExportPdf:'Экспортировать в PDF', boardExportDone:'Планшет экспортирован', boardExportWorking:'Рендеринг и экспорт — подождите…', boardExportFailed:'Не удалось экспортировать', boardExportEmpty:'Этот планшет пуст — сначала добавьте содержимое', boardImportPlan:'Импортировать файл планшета (.actaplan)', boardImported:'Планшет импортирован', boardImportInvalid:'Это не действительный файл планшета Acta', boardExportRegionTitle:'Выбрать область экспорта', boardExportRegionHint:'Потяните рамку или маркеры, чтобы изменить область; экспортируется содержимое рамки', boardExportRegionAll:'Все элементы', boardExportRegionView:'Текущий вид', boardExportRegionNext:'Далее',
    boardEmptyTitle:'Этот планшет пуст', boardEmptyHint:'Добавьте текст и пометки панелью снизу или импортируйте задачи и заметки и свободно соберите свой планшет.'
  }
};

const todayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
};

// 子待办完成时刻的短日期（mm/dd，本地时区），悬停 title 给出精确到秒的时刻。
const formatMonthDay = value => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

// 操作历史：本地保留最近 500 条（超出淘汰最旧），按类型词典渲染为
// 当前语言的描述，detail 携带目标标题等原文。
const HISTORY_KEY = 'acta.history.v1';
const HISTORY_LIMIT = 500;
let historyEntries = (() => {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return Array.isArray(raw) ? raw.slice(0, HISTORY_LIMIT) : [];
  } catch { return []; }
})();
const historyMessages = {
  zh: {
    'note-created': '创建了笔记《{detail}》', 'todo-created': '创建了待办《{detail}》', 'checkin-created': '创建了打卡待办《{detail}》',
    'item-trashed': '把《{detail}》移入回收站', 'item-destroyed': '彻底删除了《{detail}》',
    'todo-completed': '完成了待办《{detail}》', 'todo-reopened': '重新打开了待办《{detail}》',
    'checkin': '为《{detail}》打卡', 'checkin-undo': '取消了《{detail}》的今日打卡',
    'subtask-added': '在《{detail}》中添加了子任务', 'subtask-completed': '完成了《{detail}》中的一个子任务', 'subtask-reopened': '重新打开了《{detail}》中的一个子任务', 'subtask-removed': '删除了《{detail}》中的一个子任务',
    'folder-created': '新建了归类「{detail}」', 'folder-deleted': '删除了归类「{detail}」'
  },
  en: {
    'note-created': 'Created note “{detail}”', 'todo-created': 'Created task “{detail}”', 'checkin-created': 'Created check-in task “{detail}”',
    'item-trashed': 'Moved “{detail}” to trash', 'item-destroyed': 'Permanently deleted “{detail}”',
    'todo-completed': 'Completed task “{detail}”', 'todo-reopened': 'Reopened task “{detail}”',
    'checkin': 'Checked in “{detail}”', 'checkin-undo': 'Undid today’s check-in for “{detail}”',
    'subtask-added': 'Added a subtask to “{detail}”', 'subtask-completed': 'Completed a subtask in “{detail}”', 'subtask-reopened': 'Reopened a subtask in “{detail}”', 'subtask-removed': 'Removed a subtask from “{detail}”',
    'folder-created': 'Created classification “{detail}”', 'folder-deleted': 'Deleted classification “{detail}”'
  }
};
function historyText(entry) {
  const dict = historyMessages[settings.language] || historyMessages.zh;
  return (dict[entry.type] || entry.type).replace('{detail}', entry.detail || '');
}
function logHistory(type, detail = '', targetId = '', snapshotBefore = null) {
  // snapshotBefore 为「操作之前」的条目深拷贝：回溯 = 把该项目恢复到
  // 此操作发生之前的状态；创建类操作无前状态（null），回溯即撤销创建。
  // 单条快照超过 96KB 时不随记录保存（回溯降级为仅跳转）。
  let snapshot = null;
  try {
    if (snapshotBefore) {
      const serialized = JSON.stringify(snapshotBefore);
      if (serialized.length <= 96 * 1024) snapshot = JSON.parse(serialized);
    }
  } catch { snapshot = null; }
  historyEntries.unshift({ id: uid(), type, detail: String(detail || ''), at: new Date().toISOString(), targetId: String(targetId || ''), snapshot });
  if (historyEntries.length > HISTORY_LIMIT) historyEntries.length = HISTORY_LIMIT;
  // 存储溢出时从最旧开始淘汰，直到写入成功。
  while (historyEntries.length) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historyEntries));
      break;
    } catch {
      historyEntries.pop();
    }
  }
}

const daysFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date - offset).toISOString().slice(0, 10);
};

function createDefaultLibrary() {
  return {
    version: 1,
    folders: [
      { id: 'ideas', nameKey: 'inboxFolder', color: '#b68b54' },
      { id: 'work', nameKey: 'workFolder', color: '#6f8a72' },
      { id: 'life', nameKey: 'lifeFolder', color: '#a87876' },
      { id: 'reading', nameKey: 'readingFolder', color: '#7a7799' }
    ],
    items: []
  };
}

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

// Note bodies are user-authored HTML that round-trips through sync/import, so any
// HTML entering the library gets sanitized once at this single choke point.
const sanitizeNoteHTML = value => (
  typeof value === 'string' && value && window.DOMPurify?.sanitize ? window.DOMPurify.sanitize(value) : value
);

const folderColor = value => (typeof value === 'string' && /^#[0-9a-f]{3,8}$/i.test(value) ? value : '#999');

// 汇总板的自由摆放坐标（世界坐标，组件左上角）：非法值一律清掉，
// 保证同步与旧数据进来时画布不会拿到 NaN 位置。
const boardCoords = value => (value && Number.isFinite(Number(value.x)) && Number.isFinite(Number(value.y))
  ? { x: Math.round(Number(value.x)), y: Math.round(Number(value.y)) }
  : null);

// 汇总板结构校验：板与组件逐层规范化，引用失效（条目被删）的组件在打开
// 汇总板时由 ensureBoards 清理，这里只保证进来的数据形状可靠。
const BOARD_MARKER_KINDS = ['arrow', 'rect', 'ellipse', 'line', 'draw'];
const BOARD_TEXT_FONTS = ['app', 'serif', 'rounded', 'mono'];
const BOARD_MARKER_COLORS = ['#526b55', '#b96051', '#4f86a8', '#987329', '#7a7799', '#a87876'];
function sanitizeBoards(boards) {
  if (!Array.isArray(boards)) return undefined;
  const seen = new Set();
  const clean = [];
  boards.forEach(board => {
    if (!board || typeof board !== 'object' || !board.id || seen.has(board.id)) return;
    seen.add(board.id);
    const widgets = [];
    const widgetSeen = new Set();
    (Array.isArray(board.widgets) ? board.widgets : []).forEach(widget => {
      if (!widget || typeof widget !== 'object' || !widget.id || widgetSeen.has(widget.id)) return;
      const spot = boardCoords({ x: widget.x, y: widget.y });
      if (!spot) return;
      if (widget.type === 'note' || widget.type === 'todo') {
        if (typeof widget.ref !== 'string') return;
        widgetSeen.add(widget.id);
        const show = widget.show && typeof widget.show === 'object' ? widget.show : {};
        widgets.push({
          id: widget.id, type: widget.type, ref: widget.ref, x: spot.x, y: spot.y,
          w: Math.min(1200, Math.max(200, Math.round(Number(widget.w) || 264))),
          h: Math.min(1000, Math.max(88, Math.round(Number(widget.h) || 114))),
          opacity: Math.min(100, Math.max(30, Math.round(Number(widget.opacity) ?? 100))),
          show: {
            pill: show.pill !== false, priority: show.priority !== false, date: show.date !== false,
            tasks: show.tasks === true, preview: show.preview !== false, foot: show.foot !== false
          }
        });
        return;
      }
      if (widget.type === 'text') {
        widgetSeen.add(widget.id);
        widgets.push({
          id: widget.id, type: 'text', x: spot.x, y: spot.y,
          w: Math.min(720, Math.max(120, Math.round(Number(widget.w) || 240))),
          text: typeof widget.text === 'string' ? widget.text.slice(0, 4000) : '',
          size: Math.min(48, Math.max(11, Math.round(Number(widget.size) || 16))),
          font: [...BOARD_TEXT_FONTS, 'custom'].includes(widget.font) ? widget.font : 'app',
          customFont: typeof widget.customFont === 'string' ? widget.customFont.slice(0, 120) : '',
          align: ['left', 'center', 'right'].includes(widget.align) ? widget.align : 'left',
          bold: Boolean(widget.bold), italic: Boolean(widget.italic),
          color: /^#[0-9a-f]{3,8}$/i.test(widget.color) ? widget.color : '',
          bg: widget.bg === 'none' || /^#[0-9a-f]{3,8}$/i.test(widget.bg) ? widget.bg : 'none',
          bgOpacity: Math.min(100, Math.max(0, Math.round(Number(widget.bgOpacity) ?? 100))),
          radius: Math.min(24, Math.max(0, Math.round(Number(widget.radius) || 0))),
          pad: Math.min(24, Math.max(0, Math.round(Number(widget.pad) ?? 0)))
        });
        return;
      }
      if (widget.type === 'marker') {
        if (!BOARD_MARKER_KINDS.includes(widget.kind)) return;
        widgetSeen.add(widget.id);
        const marker = {
          id: widget.id, type: 'marker', kind: widget.kind, x: spot.x, y: spot.y,
          // 颜色支持任意 hex（取色器自选），仅挡掉非法值。
          color: /^#[0-9a-f]{3,8}$/i.test(widget.color) ? widget.color : BOARD_MARKER_COLORS[0]
        };
        // 通用外观：线条粗细、笔触尖端、图层分组与显隐。
        marker.stroke = Math.min(40, Math.max(1, Number(widget.stroke) || 2.5));
        if (['round', 'butt', 'square'].includes(widget.cap)) marker.cap = widget.cap;
        if (typeof widget.groupId === 'string' && widget.groupId) marker.groupId = widget.groupId.slice(0, 64);
        if (widget.hidden === true) marker.hidden = true;
        if (widget.kind === 'draw') {
          const points = Array.isArray(widget.points)
            ? widget.points.filter(value => Number.isFinite(Number(value))).map(value => Math.round(Number(value))).slice(0, 4000)
            : [];
          if (points.length < 4 || points.length % 2) return;
          marker.points = points;
          marker.w = Math.max(1, Math.round(Number(widget.w) || 1));
          marker.h = Math.max(1, Math.round(Number(widget.h) || 1));
          marker.brush = widget.brush === 'highlighter' ? 'highlighter' : 'pen';
          marker.opacity = Math.min(100, Math.max(5, Math.round(Number(widget.opacity) ?? 100)));
          marker.flow = Math.min(100, Math.max(10, Math.round(Number(widget.flow) ?? 100)));
        } else {
          marker.w = Math.round(Number(widget.w) || 120);
          marker.h = Math.round(Number(widget.h) || 80);
          // 箭头两端端帽：无 / 箭头 / 圆点 / 短杠（终点默认箭头，起点默认无）。
          if (widget.kind === 'arrow') {
            const capShape = value => ['none', 'arrow', 'dot', 'bar'].includes(value) ? value : null;
            marker.head = capShape(widget.head) || 'arrow';
            marker.tail = capShape(widget.tail) || 'none';
          }
          // 椭圆填充：填充色 / 填充不透明度 / 线条不透明度。
          if (widget.kind === 'ellipse') {
            marker.fill = widget.fill === 'none' || /^#[0-9a-f]{3,8}$/i.test(widget.fill || '') ? widget.fill : 'none';
            marker.fillOpacity = Math.min(100, Math.max(0, Math.round(Number(widget.fillOpacity) ?? 100)));
            marker.strokeOpacity = Math.min(100, Math.max(5, Math.round(Number(widget.strokeOpacity) ?? 100)));
          }
        }
        widgets.push(marker);
      }
    });
    const style = board.style && typeof board.style === 'object' ? board.style : {};
    clean.push({
      id: board.id,
      // 名称兜底留空，ensureBoards 打开计划板时（t 已可用）再补默认名。
      name: typeof board.name === 'string' && board.name.trim() ? board.name.trim().slice(0, 60) : '',
      widgets,
      style: {
        pattern: ['dots', 'grid', 'none'].includes(style.pattern) ? style.pattern : 'dots',
        color: /^#[0-9a-f]{3,8}$/i.test(style.color) ? style.color : '',
        snap: Boolean(style.snap),
        gridSize: Math.min(64, Math.max(16, Math.round(Number(style.gridSize) || 26)))
      },
      createdAt: validDate(board.createdAt) || new Date().toISOString(),
      updatedAt: validDate(board.updatedAt) || validDate(board.createdAt) || new Date().toISOString()
    });
  });
  return clean;
}

function normalizeLibrary(candidate) {
  if (!candidate || !Array.isArray(candidate.items) || !Array.isArray(candidate.folders)) return createDefaultLibrary();
  const normalized = { ...candidate, version: Math.max(Number(candidate.version) || 1, 1) };
  const cleanedBoards = sanitizeBoards(candidate.boards);
  if (cleanedBoards) normalized.boards = cleanedBoards;
  else delete normalized.boards;
  normalized.folders = candidate.folders.map(folder => (
    folder && typeof folder === 'object' ? { ...folder, color: folderColor(folder.color) } : folder
  ));
  const ids = new Set(candidate.items.map(item => item?.id).filter(Boolean));
  const normalizedAt = new Date().toISOString();
  normalized.items = candidate.items
    .filter(item => item && ids.has(item.id) && (item.type === 'note' || item.type === 'todo'))
    .map(item => {
      const createdAt = validDate(item.createdAt) || validDate(item.updatedAt) || normalizedAt;
      const updatedAt = validDate(item.updatedAt) || validDate(item.createdAt) || normalizedAt;
      const common = {
        ...item,
        createdAt,
        updatedAt,
        tags: Array.isArray(item.tags) ? item.tags.filter(tag => typeof tag === 'string') : [],
        linkedIds: Array.isArray(item.linkedIds) ? [...new Set(item.linkedIds.filter(id => typeof id === 'string' && id !== item.id && ids.has(id)))] : []
      };
      const board = boardCoords(item.board);
      if (board) common.board = board;
      else delete common.board;
      if (item.type === 'note') return { ...common, body:typeof item.body === 'string' ? sanitizeNoteHTML(item.body) : '<p><br></p>' };

      const hasStartAt = Object.prototype.hasOwnProperty.call(item, 'startAt');
      const hasDueAt = Object.prototype.hasOwnProperty.call(item, 'dueAt');
      const legacyStartAt = legacyTodoStartAt(item, createdAt);
      const legacyDuration = Number.isFinite(Number(item.durationMinutes)) && Number(item.durationMinutes) > 0
        ? Number(item.durationMinutes)
        : 60;
      const startAt = hasStartAt ? validDate(item.startAt) : legacyStartAt;
      const dueAt = hasDueAt
        ? validDate(item.dueAt)
        : (calendarDate(item.due) && legacyStartAt ? new Date(new Date(legacyStartAt).getTime() + legacyDuration * 60000).toISOString() : '');
      const { due, dueTime, durationMinutes, ...todo } = common;
      return {
        ...todo,
        startAt,
        dueAt,
        priority:['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
        tasks:Array.isArray(item.tasks) ? item.tasks : [],
        completed:Boolean(item.completed)
      };
    });

  const itemById = new Map(normalized.items.map(item => [item.id, item]));
  normalized.items.forEach(item => {
    item.linkedIds = item.linkedIds.filter(id => itemById.get(id)?.type);
    item.linkedIds.forEach(id => {
      const other = itemById.get(id);
      if (other && !other.linkedIds.includes(item.id)) other.linkedIds.push(item.id);
    });
  });
  return normalized;
}

let library = normalizeLibrary(loadJSON(STORAGE_KEY, createDefaultLibrary()));
let settings = loadJSON(SETTINGS_KEY, { language: 'zh', syncFolder: '', lastSyncedAt: '' });
settings.showCompletedTodos = Boolean(settings.showCompletedTodos);
let currentView = 'inbox';
let currentFilter = 'all';
let todoPriorityFilter = 'all';
let todoDueFilter = 'all';
let todoFolderFilter = 'all';
let noteFolderFilter = 'all';
let noteRelationFilter = 'all';
let noteUpdatedFilter = 'all';
let trashTypeFilter = 'all';
let trashFolderFilter = 'all';
const listSortModes = ['updated', 'created', 'due', 'priority', 'title'];
let listSortMode = listSortModes.includes(settings.sortMode) ? settings.sortMode : 'updated';
let calendarViewMode = 'month';
let calendarCursor = new Date(`${todayISO()}T12:00:00`);
let calendarMotion = '';
let calendarMotionTimer = null;
let selectedId = library.items.find(item => !item.deletedAt)?.id || null;
let searchQuery = '';
// —— 已完成待办自动置底 ——
// 勾选完成后待办先原地停留一段可配置的延迟（等勾选动效播完，也给用户留出
// 撤回的时间），再把卡片以非线性动效移动到列表末尾（或从被过滤的列表中淡出）。
// 等待期间该待办按「冻结顺序」参与排序与筛选：其它重渲染（搜索、筛选、勾选
// 子任务）都不会让它提前跳动。偏好由 interface.js 写在 <html data-completed-todo-sink*>。
const pendingSink = new Map();          // 待办 id -> 延迟计时器
let sinkFrozenOrder = [];               // 置底等待期间冻结的卡片顺序（当前视图上下文）
let sinkContext = { view: '', filter: '' };
let sinkRenderQueued = false;           // 置底重渲染信号：由延迟计时器置位
const lastRenderCompletion = new Map(); // 待办 id -> 上次渲染时的完成态（用于识别完成瞬间）
const completedTodoSinkEnabled = () => document.documentElement.dataset.completedTodoSink !== 'off';
const completedTodoSinkDelay = () => Math.min(10000, Math.max(0, Number(document.documentElement.dataset.completedTodoSinkDelay) || 1000));
const completedTodoSinkView = () => currentView === 'todos' || currentView === 'inbox' || currentView === 'today' || String(currentView).startsWith('folder:');
let mobileEditorOpen = false;
let saveTimer;
let toastTimer;
let editorPaneResizeObserver;
let editorTitleResizeFrame = 0;

// 支持的界面语言；新语言缺键时按 新语言 → 英文 → 键名 兜底，不会露出键名。
const SUPPORTED_LANGUAGES = ['zh', 'zh-Hant', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'];
// 各语言的 Intl locale 标签（日期 / 日历格式化用）。
const LOCALE_TAGS = { zh: 'zh-CN', 'zh-Hant': 'zh-Hant', en: 'en-GB', ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', ru: 'ru-RU' };
const localeTag = () => LOCALE_TAGS[settings.language] || 'zh-CN';
const t = (key) => dictionaries[settings.language]?.[key] ?? dictionaries.en[key] ?? key;
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const stripHTML = (html = '') => {
  const node = document.createElement('div');
  node.innerHTML = html;
  return (node.textContent || '').trim();
};
const isSafeHref = (value = '') => /^(https?:\/\/|mailto:)/i.test(String(value).trim());

// 行内 Markdown 特殊字符转义：保证 HTML→Markdown→HTML 往返不改变格式。
// 行首块级字符（#、>、-、数字）不做转义，源码保持易读。
const escapeMarkdownText = value => String(value)
  .replace(/\\/g, '\\\\')
  .replace(/([`*_[\]=~])/g, '\\$1');

function noteHTMLToMarkdown(html = '') {
  const root = document.createElement('div');
  root.innerHTML = html;
  const renderChildren = (node) => [...node.childNodes].map(renderNode).join('');
  const renderList = (node, ordered) => [...node.children].filter(child => child.tagName === 'LI').map((child, index) => {
    const content = renderChildren(child).trim().replace(/\n+/g, '\n  ');
    const taskMarker = child.classList.contains('markdown-task') || child.hasAttribute('data-checked')
      ? `- [${child.dataset.checked === 'true' ? 'x' : ' '}]`
      : '-';
    return `${ordered ? `${index + 1}.` : taskMarker} ${content}`;
  }).join('\n') + '\n\n';
  const renderNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return escapeMarkdownText((node.nodeValue || '').replace(/\u00a0/g, ' '));
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const tag = node.tagName;
    const content = renderChildren(node);
    if (tag === 'BR') return '\n';
    if (tag === 'P' || tag === 'DIV') return `${content.trim()}\n\n`;
    if (/^H[1-6]$/.test(tag)) return `${'#'.repeat(Number(tag.slice(1)))} ${content.trim()}\n\n`;
    if (tag === 'STRONG' || tag === 'B') return `**${content}**`;
    if (tag === 'EM' || tag === 'I') return `*${content}*`;
    if (tag === 'DEL' || tag === 'S' || tag === 'STRIKE') return `~~${content}~~`;
    if (tag === 'MARK') return `==${content}==`;
    if (tag === 'CODE' && node.parentElement?.tagName !== 'PRE') return `\`${content.replace(/`/g, '\\`')}\``;
    if (tag === 'UL') return renderList(node, false);
    if (tag === 'OL') return renderList(node, true);
    if (tag === 'A') {
      const href = node.getAttribute('href') || '';
      return isSafeHref(href) ? `[${content}](${href})` : content;
    }
    if (tag === 'BLOCKQUOTE') return `${content.trim().split('\n').map(line => `> ${line}`).join('\n')}\n\n`;
    if (tag === 'PRE') {
      const code = node.querySelector(':scope > code');
      const language = String(code?.dataset.language || '').replace(/[^a-z0-9_+-]/gi, '');
      return `\`\`\`${language}\n${node.textContent || ''}\n\`\`\`\n\n`;
    }
    if (tag === 'HR') return `---\n\n`;
    if (tag === 'SPAN' && node.classList.contains('markdown-task-box')) return '';
    return content;
  };
  return renderChildren(root).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// 行内文本 → HTML。转义字符 `\x` 在格式替换后统一还原，
// 格式匹配的 em 规则排除前置反斜杠，避免把 `\*x\*` 误判为斜体。
const inlineMarkdownHTML = value => markdownInline(value).replace(/\n/g, '<br>');

function markdownInline(value = '') {
  const protectedHTML = [];
  const protect = html => {
    const token = `\u0000${protectedHTML.length}\u0000`;
    protectedHTML.push(html);
    return token;
  };
  let text = String(value).replace(/`([^`\n]+)`/g, (_match, code) => protect(`<code>${escapeHTML(code.replace(/\\`/g, '`'))}</code>`));
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    if (!isSafeHref(href)) return label;
    return protect(`<a href="${escapeHTML(href.trim())}">${escapeHTML(label.replace(/\\([\[\]()])/g, '$1'))}</a>`);
  });
  text = escapeHTML(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/==([^=]+)==/g, '<mark>$1</mark>')
    .replace(/(^|[^*\\])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^_\\])_([^_\n]+)_/g, '$1<em>$2</em>')
    .replace(/\\([\\`*_[\]=~])/g, '$1');
  return text.replace(/\u0000(\d+)\u0000/g, (_match, index) => protectedHTML[Number(index)] || '');
}

function markdownToNoteHTML(markdown = '') {
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
  const output = [];
  let paragraph = [];
  // 列表栈按缩进层级解析嵌套列表；与 HTML→Markdown 的缩进输出互为逆操作。
  let listStack = [];
  let inCode = false;
  let codeLines = [];
  let codeLanguage = '';
  let quoteLines = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${paragraph.map(inlineMarkdownHTML).join('<br>')}</p>`);
    paragraph = [];
  };
  const closeLists = toDepth => {
    while (listStack.length > toDepth) output.push(`</${listStack.pop().type}>`);
  };
  const flushQuote = () => {
    if (!quoteLines.length) return;
    output.push(`<blockquote><p>${quoteLines.map(inlineMarkdownHTML).join('<br>')}</p></blockquote>`);
    quoteLines = [];
  };
  const openListItem = (indent, type, listItemHTML) => {
    if (listStack.length && indent < listStack[listStack.length - 1].indent) closeLists(listStack.length - 1);
    const top = listStack[listStack.length - 1];
    if (!top || indent > top.indent) {
      output.push(`<${type}>`);
      listStack.push({ type, indent });
    } else if (top.type !== type) {
      output.push(`</${top.type}>`);
      output.push(`<${type}>`);
      listStack[listStack.length - 1] = { type, indent };
    }
    output.push(listItemHTML);
  };
  lines.forEach(line => {
    const fence = line.match(/^\s*```([a-z0-9_+-]*)\s*$/i);
    if (fence) {
      flushParagraph(); closeLists(0); flushQuote();
      if (inCode) {
        output.push(`<pre><code${codeLanguage ? ` data-language="${escapeHTML(codeLanguage)}"` : ''}>${escapeHTML(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        codeLanguage = '';
      } else {
        codeLanguage = fence[1] || '';
      }
      inCode = !inCode;
      return;
    }
    if (inCode) { codeLines.push(line); return; }
    const quote = line.match(/^\s*>\s?(.*)$/);
    if (quote) {
      flushParagraph(); closeLists(0);
      quoteLines.push(quote[1]);
      return;
    }
    flushQuote();
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const horizontalRule = /^\s{0,3}(?:(?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,})$/.test(line);
    const task = line.match(/^(\s*)[-+*]\s+\[([ xX])\]\s+(.+)$/);
    const unordered = line.match(/^(\s*)[-+*]\s+(.+)$/);
    const ordered = line.match(/^(\s*)\d+[.)]\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeLists(0);
      output.push(`<h${heading[1].length}>${inlineMarkdownHTML(heading[2])}</h${heading[1].length}>`);
    } else if (horizontalRule) {
      flushParagraph(); closeLists(0);
      output.push('<hr>');
    } else if (task || unordered || ordered) {
      flushParagraph();
      const match = task || unordered || ordered;
      const indent = match[1].length;
      const type = ordered ? 'ol' : 'ul';
      const listItemHTML = task
        ? `<li class="markdown-task" data-checked="${task[2].toLowerCase() === 'x'}"><span class="markdown-task-box" contenteditable="false">${task[2].toLowerCase() === 'x' ? '☑' : '☐'}</span>${inlineMarkdownHTML(task[3])}</li>`
        : `<li>${inlineMarkdownHTML(match[2])}</li>`;
      openListItem(indent, type, listItemHTML);
    } else if (!line.trim()) {
      flushParagraph(); closeLists(0);
    } else {
      closeLists(0);
      paragraph.push(line);
    }
  });
  if (inCode && codeLines.length) output.push(`<pre><code${codeLanguage ? ` data-language="${escapeHTML(codeLanguage)}"` : ''}>${escapeHTML(codeLines.join('\n'))}</code></pre>`);
  flushParagraph(); closeLists(0); flushQuote();
  return output.join('') || '<p><br></p>';
}

function validDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : '';
}

function legacyTodoStartAt(item, fallback = '') {
  if (!calendarDate(item?.due)) return fallback;
  const time = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(String(item.dueTime || ''))
    ? String(item.dueTime)
    : '09:00:00';
  const date = new Date(`${item.due}T${time}`);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function dateTimeLocalValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = part => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function dateTimeLocalISO(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function todoStartDate(item) {
  const value = validDate(item?.startAt);
  return value ? new Date(value) : null;
}

function todoDueDate(item) {
  const value = validDate(item?.dueAt);
  return value ? new Date(value) : null;
}

function todoIsScheduled(item) {
  const start = todoStartDate(item);
  const due = todoDueDate(item);
  return Boolean(start && due && due > start);
}

function todoScheduleDate(item) {
  const start = todoStartDate(item);
  return start ? calendarDateISO(start) : '';
}

function todoDueDateISO(item) {
  const due = todoDueDate(item);
  return due ? calendarDateISO(due) : '';
}

function parseImportedNote(content, fileName = '') {
  if (typeof content !== 'string') throw new Error(t('invalidNoteFile'));
  if (new Blob([content]).size > 5 * 1024 * 1024) throw new Error(t('fileTooLarge'));
  let markdown = content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const metadata = {};
  if (markdown.startsWith('---\n')) {
    const end = markdown.indexOf('\n---\n', 4);
    if (end !== -1) {
      markdown.slice(4, end).split('\n').forEach(line => {
        const separator = line.indexOf(':');
        if (separator > 0) metadata[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
      });
      markdown = markdown.slice(end + 5).replace(/^\n+/, '');
    }
  }

  let title = '';
  if (metadata.title) {
    try { title = JSON.parse(metadata.title); } catch { title = metadata.title; }
  }
  const firstHeading = markdown.match(/^#\s+(.+)\s*(?:\n|$)/);
  if (!title && firstHeading) title = firstHeading[1].trim();
  if (firstHeading) markdown = markdown.slice(firstHeading[0].length).replace(/^\n+/, '');
  if (!title) title = String(fileName).replace(/\.(md|markdown|txt)$/i, '') || t('untitledNote');

  let tags = [];
  if (metadata.tags) {
    try { const parsed = JSON.parse(metadata.tags); if (Array.isArray(parsed)) tags = parsed.filter(tag => typeof tag === 'string'); } catch { /* Ignore malformed optional metadata. */ }
  }
  return {
    title: String(title).trim() || t('untitledNote'),
    tags,
    createdAt: validDate(metadata.created) || new Date().toISOString(),
    body: markdownToNoteHTML(markdown)
  };
}

function portableFileName(title = '') {
  let name = String(title).replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-').replace(/[. ]+$/g, '').trim().slice(0, 80) || 'Acta note';
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name)) name = `_${name}`;
  return `${name}.md`;
}

function buildNoteMarkdown(item) {
  const title = String(item.title || t('untitledNote')).replace(/[\r\n]+/g, ' ').trim();
  const body = noteHTMLToMarkdown(item.body || '');
  return `---\nacta-note: 1\ntitle: ${JSON.stringify(title)}\ntags: ${JSON.stringify(item.tags || [])}\ncreated: ${item.createdAt || ''}\nupdated: ${item.updatedAt || ''}\n---\n\n# ${title}\n\n${body}${body ? '\n' : ''}`;
}
const getItem = () => library.items.find(item => item.id === selectedId);
const getFolder = (id) => library.folders.find(folder => folder.id === id);
const folderName = (folder) => folder ? (folder.nameKey ? t(folder.nameKey) : folder.name) : t('unclassified');
const folderShortSegmenter = typeof Intl?.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity:'grapheme' }) : null;
const folderShortSegments = value => {
  const text = String(value || '').trim();
  return folderShortSegmenter ? [...folderShortSegmenter.segment(text)].map(entry => entry.segment) : Array.from(text);
};
const folderShortNameUsesEmoji = value => folderShortSegments(value).some(segment => /[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u20E3]/u.test(segment));
const normalizeFolderShortName = value => {
  const segments = folderShortSegments(value);
  if (!segments.length) return '';
  const emoji = segments.find(segment => folderShortNameUsesEmoji(segment));
  return emoji || segments.slice(0, 3).join('');
};
const folderShortName = (folder) => {
  if (!folder) return '';
  const custom = normalizeFolderShortName(folder.shortName);
  if (custom) return custom;
  const name = String(folderName(folder) || '').trim();
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 3).map(word => folderShortSegments(word)[0]).join('').toLocaleUpperCase();
  return folderShortSegments(name.replace(/\s+/g, '')).slice(0, 2).join('').toLocaleUpperCase();
};
const isTodoComplete = (item) => item?.type === 'todo' && (Boolean(item.completed) || ((item.tasks || []).length > 0 && item.tasks.every(task => task.done)));
const isTrashed = (item) => Boolean(item?.deletedAt);
const activeItems = () => library.items.filter(item => !isTrashed(item));
const trashedItems = () => library.items.filter(isTrashed).sort((a, b) => String(b.deletedAt).localeCompare(String(a.deletedAt)));
const priorityRank = (priority) => ({ high: 0, medium: 1, low: 2 })[priority] ?? 1;
const getLinkedItems = (item) => (item.linkedIds || []).map(id => library.items.find(entry => entry.id === id)).filter(Boolean);

function persist() {
  $('#saveState').textContent = t('saving');
  $('#saveState').classList.add('saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    $('#saveState').textContent = t('saved');
    $('#saveState').classList.remove('saving');
  }, 320);
}

function showToast(message, hold = 2400, busy = false) {
  const toast = $('#toast');
  $('p', toast).textContent = message;
  // busy 变体：图标换为旋转的刷新符号，表达「进行中」而非「完成」。
  toast.querySelector('use').setAttribute('href', busy ? '#i-refresh' : '#i-check');
  toast.classList.toggle('is-busy', busy);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), hold);
}

// 收起进行中提示：仅在当前 toast 仍是 busy 变体时生效——
// 成功 / 失败的结果提示已把它覆盖，这里不会误伤。
function hideBusyToast() {
  const toast = $('#toast');
  if (toast.classList.contains('is-busy')) {
    clearTimeout(toastTimer);
    toast.classList.remove('show');
    toast.classList.remove('is-busy');
  }
}

function formatDate(value, short = false) {
  if (!value) return t('noDate');
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  const today = new Date(`${todayISO()}T12:00:00`);
  const difference = Math.round((date - today) / 86400000);
  if (difference === 0) return t('today');
  if (difference === -1) return t('yesterday');
  return new Intl.DateTimeFormat(localeTag(), short
    ? { month: 'short', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function formatDateTimeSeconds(value) {
  if (!value) return t('noDate');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t('noDate');
  const locale = localeTag();
  return new Intl.DateTimeFormat(locale, {
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
  }).format(date).replace(',', '');
}

function formatListDateTime(value) {
  if (!value) return t('noDate');
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return t('noDate');
  const locale = localeTag();
  return new Intl.DateTimeFormat(locale, {
    month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false
  }).format(date).replace(',', '');
}

function todoListTimeMarkup(item) {
  const start = todoStartDate(item);
  const due = todoDueDate(item);
  if (start && due && due > start) {
    const fullRange = `${formatDateTimeSeconds(start)} — ${formatDateTimeSeconds(due)}`;
    return `<span class="card-date card-schedule-date" title="${escapeHTML(fullRange)}" aria-label="${escapeHTML(fullRange)}"><time datetime="${escapeHTML(start.toISOString())}">${escapeHTML(formatListDateTime(start))}</time><i aria-hidden="true">—</i><time datetime="${escapeHTML(due.toISOString())}">${escapeHTML(formatListDateTime(due))}</time></span>`;
  }
  const createdAt = validDate(item.createdAt) || validDate(item.updatedAt);
  const createdLabel = formatDateTimeSeconds(createdAt);
  return `<time class="card-date card-created-date" datetime="${escapeHTML(createdAt)}" title="${escapeHTML(createdLabel)}">${escapeHTML(formatListDateTime(createdAt))}</time>`;
}

const calendarLocale = () => localeTag();
const calendarModeKey = mode => ({ year:'yearView', month:'monthView', week:'weekView', day:'dayView' })[mode] || 'monthView';
const calendarShiftKey = (direction, mode = calendarViewMode) => `${direction < 0 ? 'previous' : 'next'}${mode[0].toUpperCase()}${mode.slice(1)}`;
const calendarText = (key, ...values) => values.reduce((message, value, index) => message.replace(`{${index}}`, value), t(key));

function calendarDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]) ? date : null;
}

function calendarDateISO(date) {
  const normalized = calendarDate(date);
  if (!normalized) return '';
  const pad = value => String(value).padStart(2, '0');
  return `${normalized.getFullYear()}-${pad(normalized.getMonth() + 1)}-${pad(normalized.getDate())}`;
}

function calendarAddDays(date, amount) {
  const normalized = calendarDate(date) || calendarDate(todayISO());
  return new Date(normalized.getFullYear(), normalized.getMonth(), normalized.getDate() + amount, 12);
}

function calendarStartOfWeek(date) {
  const normalized = calendarDate(date) || calendarDate(todayISO());
  const mondayOffset = (normalized.getDay() + 6) % 7;
  return calendarAddDays(normalized, -mondayOffset);
}

function calendarWeekNumber(date) {
  const normalized = calendarDate(date) || calendarDate(todayISO());
  const utcDate = new Date(Date.UTC(normalized.getFullYear(), normalized.getMonth(), normalized.getDate()));
  const weekday = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
}

function calendarMonthStart(date) {
  const normalized = calendarDate(date) || calendarDate(todayISO());
  return new Date(normalized.getFullYear(), normalized.getMonth(), 1, 12);
}

function calendarWeekdayLabels(style = 'short') {
  const monday = new Date(2024, 0, 1, 12);
  return Array.from({ length:7 }, (_, index) => new Intl.DateTimeFormat(calendarLocale(), { weekday:style }).format(calendarAddDays(monday, index)));
}

function calendarTodoTime(item) {
  const start = todoStartDate(item);
  const due = todoDueDate(item);
  if (!start || !due) return '';
  const time = date => new Intl.DateTimeFormat(calendarLocale(), { hour:'2-digit', minute:'2-digit', hour12:false }).format(date);
  if (calendarDateISO(start) === calendarDateISO(due)) return `${time(start)}–${time(due)}`;
  const dateTime = date => new Intl.DateTimeFormat(calendarLocale(), { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false }).format(date);
  return `${dateTime(start)}–${dateTime(due)}`;
}

function calendarTodos() {
  return library.items
    .filter(item => !isTrashed(item) && item.type === 'todo' && todoIsScheduled(item))
    .sort((first, second) => {
      const startDifference = String(first.startAt).localeCompare(String(second.startAt));
      if (startDifference) return startDifference;
      const dueDifference = String(first.dueAt).localeCompare(String(second.dueAt));
      if (dueDifference) return dueDifference;
      const completionDifference = Number(isTodoComplete(first)) - Number(isTodoComplete(second));
      if (completionDifference) return completionDifference;
      return priorityRank(first.priority) - priorityRank(second.priority);
    });
}

function calendarNotes() {
  return library.items
    .filter(item => !isTrashed(item) && item.type === 'note' && calendarDateISO(new Date(item.createdAt)))
    .sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt));
}

function calendarTodosByDate(items = calendarTodos(), rangeStart = null, rangeEnd = null) {
  const grouped = new Map();
  const visibleStart = calendarDate(rangeStart);
  const visibleEnd = calendarDate(rangeEnd);
  items.forEach(item => {
    let date = calendarDate(todoScheduleDate(item));
    let lastDate = calendarDate(todoDueDateISO(item));
    if (!date || !lastDate) return;
    if (visibleStart && date < visibleStart) date = visibleStart;
    if (visibleEnd) {
      const visibleLastDate = calendarAddDays(visibleEnd, -1);
      if (lastDate > visibleLastDate) lastDate = visibleLastDate;
    }
    while (date <= lastDate) {
      const iso = calendarDateISO(date);
      if (!grouped.has(iso)) grouped.set(iso, []);
      grouped.get(iso).push(item);
      date = calendarAddDays(date, 1);
    }
  });
  return grouped;
}

function calendarNotesByDate(items = calendarNotes(), rangeStart = null, rangeEnd = null) {
  const grouped = new Map();
  const visibleStart = calendarDate(rangeStart);
  const visibleEnd = calendarDate(rangeEnd);
  items.forEach(item => {
    const date = calendarDate(new Date(item.createdAt));
    if (!date || (visibleStart && date < visibleStart) || (visibleEnd && date >= visibleEnd)) return;
    const iso = calendarDateISO(date);
    if (!grouped.has(iso)) grouped.set(iso, []);
    grouped.get(iso).push(item);
  });
  return grouped;
}

function calendarPeriodRange(mode = calendarViewMode, cursor = calendarCursor) {
  const active = calendarDate(cursor) || calendarDate(todayISO());
  if (mode === 'year') {
    const start = new Date(active.getFullYear(), 0, 1, 12);
    return [start, new Date(active.getFullYear() + 1, 0, 1, 12)];
  }
  if (mode === 'month') {
    const start = calendarMonthStart(active);
    return [start, new Date(start.getFullYear(), start.getMonth() + 1, 1, 12)];
  }
  if (mode === 'week') {
    const start = calendarStartOfWeek(active);
    return [start, calendarAddDays(start, 7)];
  }
  return [active, calendarAddDays(active, 1)];
}

function calendarPeriodTodos(mode = calendarViewMode, cursor = calendarCursor) {
  const [start, end] = calendarPeriodRange(mode, cursor);
  const startISO = calendarDateISO(start);
  const endISO = calendarDateISO(end);
  return calendarTodos().filter(item => {
    const firstDate = todoScheduleDate(item);
    const lastDate = todoDueDateISO(item);
    return firstDate < endISO && lastDate >= startISO;
  });
}

function calendarPeriodItems(mode = calendarViewMode, cursor = calendarCursor) {
  const [start, end] = calendarPeriodRange(mode, cursor);
  const notesByDate = calendarNotesByDate(calendarNotes(), start, end);
  return [...calendarPeriodTodos(mode, cursor), ...[...notesByDate.values()].flat()];
}

function calendarPeriodLabel() {
  const active = calendarDate(calendarCursor) || calendarDate(todayISO());
  const locale = calendarLocale();
  if (calendarViewMode === 'year') return new Intl.DateTimeFormat(locale, { year:'numeric' }).format(active);
  if (calendarViewMode === 'month') {
    const monthStart = calendarMonthStart(active);
    const gridStart = calendarStartOfWeek(monthStart);
    const monthLabel = new Intl.DateTimeFormat(locale, { year:'numeric', month:'long' }).format(active);
    return `${monthLabel} · W${calendarWeekNumber(gridStart)}–W${calendarWeekNumber(calendarAddDays(gridStart, 35))}`;
  }
  if (calendarViewMode === 'week') {
    const start = calendarStartOfWeek(active);
    const end = calendarAddDays(start, 6);
    const sameYear = start.getFullYear() === end.getFullYear();
    const startLabel = new Intl.DateTimeFormat(locale, { ...(sameYear ? {} : { year:'numeric' }), month:'short', day:'numeric' }).format(start);
    const endLabel = new Intl.DateTimeFormat(locale, { year:'numeric', month:'short', day:'numeric' }).format(end);
    return `W${calendarWeekNumber(start)} · ${startLabel} – ${endLabel}`;
  }
  return new Intl.DateTimeFormat(locale, { year:'numeric', month:'long', day:'numeric', weekday:'long' }).format(active);
}

function calendarLinkedNotes(item) {
  return getLinkedItems(item).filter(linked => linked.type === 'note');
}

function calendarSubtasksMarkup(item) {
  const tasks = item.tasks || [];
  if (!tasks.length) return '';
  return `<div class="calendar-subtasks" aria-label="${escapeHTML(t('progress'))}">
    ${tasks.map(task => {
      const label = task.text || t('taskPlaceholder');
      const actionLabel = task.done ? t('reopenTask') : t('completeTask');
      return `<div class="calendar-subtask ${task.done ? 'is-complete' : ''}" data-calendar-subtask="${escapeHTML(task.id)}">
        <button class="calendar-subtask-check" type="button" data-calendar-subtask-toggle="${escapeHTML(item.id)}" data-calendar-subtask-id="${escapeHTML(task.id)}" title="${escapeHTML(actionLabel)}" aria-label="${escapeHTML(actionLabel)}" aria-pressed="${Boolean(task.done)}"><svg><use href="#i-check"/></svg></button>
        <button class="calendar-subtask-title" type="button" data-calendar-open="${escapeHTML(item.id)}">${escapeHTML(label)}</button>
      </div>`;
    }).join('')}
  </div>`;
}

function calendarTodoMarkup(item, density = 'full') {
  const done = isTodoComplete(item);
  const linkedNotes = calendarLinkedNotes(item);
  const folder = getFolder(item.folderId);
  const time = calendarTodoTime(item);
  const title = item.title || t('untitledTodo');
  const completionLabel = done ? t('reopenTask') : t('completeTask');
  const linkedMarkup = linkedNotes.length ? `<div class="calendar-linked-notes" aria-label="${escapeHTML(t('linkedNotes'))}">
    ${linkedNotes.map(note => `<button type="button" data-calendar-open-note="${escapeHTML(note.id)}" title="${escapeHTML(note.title || t('untitledNote'))}"><svg><use href="#i-note"/></svg><span>${escapeHTML(note.title || t('untitledNote'))}</span></button>`).join('')}
  </div>` : '';
  const meta = density === 'full' ? `<div class="calendar-todo-meta">
    ${time ? `<span><svg><use href="#i-clock"/></svg>${escapeHTML(time)}</span>` : ''}
    <span><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span>
    <span class="priority-pill ${escapeHTML(item.priority || 'medium')}">${escapeHTML(t(item.priority || 'medium'))}</span>
  </div>` : (time ? `<time>${escapeHTML(time)}</time>` : '');
  return `<article class="calendar-todo calendar-todo-${density} priority-${escapeHTML(item.priority || 'medium')} ${done ? 'is-complete' : ''}" data-calendar-todo="${escapeHTML(item.id)}">
    <button class="calendar-todo-check" type="button" data-calendar-toggle="${escapeHTML(item.id)}" title="${escapeHTML(completionLabel)}" aria-label="${escapeHTML(completionLabel)}" aria-pressed="${done}">
      <svg><use href="#i-check"/></svg>
    </button>
    <div class="calendar-todo-content">
      <div class="calendar-todo-heading">${meta}<button class="calendar-todo-title" type="button" data-calendar-open="${escapeHTML(item.id)}" title="${escapeHTML(t('calendarOpenTodo'))}">${escapeHTML(title)}</button></div>
      ${linkedMarkup}
      ${density === 'full' ? calendarSubtasksMarkup(item) : ''}
    </div>
  </article>`;
}

function calendarMonthTodoMarkup(item) {
  const done = isTodoComplete(item);
  const linkedNotes = calendarLinkedNotes(item);
  const title = item.title || t('untitledTodo');
  const relationTitle = linkedNotes.map(note => note.title || t('untitledNote')).join(' · ');
  const linkedMarkup = linkedNotes.length ? `<button class="calendar-month-link" type="button" data-calendar-open-note="${escapeHTML(linkedNotes[0].id)}" title="${escapeHTML(relationTitle)}" aria-label="${escapeHTML(`${t('linkedNotes')}：${relationTitle}`)}"><svg><use href="#i-note"/></svg>${linkedNotes.length > 1 ? `<span>${linkedNotes.length}</span>` : ''}</button>` : '';
  return `<article class="calendar-month-todo priority-${escapeHTML(item.priority || 'medium')} ${done ? 'is-complete' : ''}" data-calendar-todo="${escapeHTML(item.id)}">
    <button class="calendar-month-todo-icon" type="button" data-calendar-open="${escapeHTML(item.id)}" title="${escapeHTML(title)}" aria-label="${escapeHTML(title)}"><svg><use href="#i-check"/></svg></button>
    <button class="calendar-month-todo-title" type="button" data-calendar-open="${escapeHTML(item.id)}" title="${escapeHTML(title)}">${escapeHTML(title)}</button>
    ${linkedMarkup}
  </article>`;
}

function calendarMonthNoteMarkup(item) {
  const title = item.title || t('untitledNote');
  return `<article class="calendar-month-todo calendar-month-note" data-calendar-note="${escapeHTML(item.id)}">
    <button class="calendar-month-todo-icon calendar-month-note-icon" type="button" data-calendar-open-note="${escapeHTML(item.id)}" title="${escapeHTML(title)}" aria-label="${escapeHTML(title)}"><svg><use href="#i-note"/></svg></button>
    <button class="calendar-month-todo-title" type="button" data-calendar-open-note="${escapeHTML(item.id)}" title="${escapeHTML(title)}">${escapeHTML(title)}</button>
  </article>`;
}

function calendarNoteMarkup(item) {
  const folder = getFolder(item.folderId);
  const title = item.title || t('untitledNote');
  const preview = itemPreview(item);
  return `<article class="calendar-todo calendar-todo-full calendar-note" data-calendar-note="${escapeHTML(item.id)}">
    <span class="calendar-note-state" aria-hidden="true"><svg><use href="#i-note"/></svg></span>
    <div class="calendar-todo-content">
      <div class="calendar-todo-heading">
        <div class="calendar-todo-meta">
          <span><svg><use href="#i-clock"/></svg>${escapeHTML(formatDateTimeSeconds(item.createdAt))}</span>
          <span><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span>
          <span class="type-pill note">${escapeHTML(t('note'))}</span>
        </div>
        <button class="calendar-todo-title" type="button" data-calendar-open-note="${escapeHTML(item.id)}" title="${escapeHTML(t('calendarOpenNote'))}">${escapeHTML(title)}</button>
      </div>
      ${preview ? `<p class="calendar-note-preview">${escapeHTML(preview)}</p>` : ''}
    </div>
  </article>`;
}

const calendarMonthItemMarkup = item => item.type === 'note' ? calendarMonthNoteMarkup(item) : calendarMonthTodoMarkup(item);
const calendarItemMarkup = item => item.type === 'note' ? calendarNoteMarkup(item) : calendarTodoMarkup(item, 'full');

function calendarEmptyMarkup() {
  return `<div class="calendar-empty"><span><svg><use href="#i-calendar"/></svg></span><h3>${escapeHTML(t('noCalendarItems'))}</h3><p>${escapeHTML(t('noCalendarItemsHint'))}</p></div>`;
}

function renderCalendarMonth() {
  const monthStart = calendarMonthStart(calendarCursor);
  const gridStart = calendarStartOfWeek(monthStart);
  const gridEnd = calendarAddDays(gridStart, 42);
  const activeMonth = monthStart.getMonth();
  const today = todayISO();
  const weekdays = calendarWeekdayLabels('short');
  const todosByDate = calendarTodosByDate(calendarTodos(), gridStart, gridEnd);
  const notesByDate = calendarNotesByDate(calendarNotes(), gridStart, gridEnd);
  const visibleLimit = matchMedia('(max-width: 800px)').matches ? 2 : 3;
  const cells = Array.from({ length:6 }, (_, weekIndex) => {
    const weekStart = calendarAddDays(gridStart, weekIndex * 7);
    const weekNumber = calendarWeekNumber(weekStart);
    const days = Array.from({ length:7 }, (_, dayIndex) => {
      const date = calendarAddDays(weekStart, dayIndex);
      const iso = calendarDateISO(date);
      const items = [...(notesByDate.get(iso) || []), ...(todosByDate.get(iso) || [])];
      const visible = items.slice(0, visibleLimit);
      const remaining = items.length - visible.length;
      return `<section class="calendar-day-cell ${date.getMonth() === activeMonth ? '' : 'is-adjacent'} ${iso === today ? 'is-today' : ''}" data-calendar-cell="${iso}">
        <header><button type="button" data-calendar-date="${iso}" title="${escapeHTML(t('calendarOpenDay'))}">${date.getDate()}</button>${items.length ? `<span>${items.length}</span>` : ''}</header>
        <div class="calendar-day-events">${visible.map(calendarMonthItemMarkup).join('')}${remaining > 0 ? `<button class="calendar-overflow" type="button" data-calendar-date="${iso}" title="${escapeHTML(calendarText('moreTodos', remaining))}" aria-label="${escapeHTML(calendarText('moreTodos', remaining))}"><svg><use href="#i-more"/></svg></button>` : ''}</div>
      </section>`;
    }).join('');
    return `<div class="calendar-month-week" data-calendar-week="${calendarDateISO(weekStart)}"><aside class="calendar-week-number" title="${escapeHTML(`${t('weekNumber')} ${weekNumber}`)}"><span>W</span><b>${weekNumber}</b></aside>${days}</div>`;
  }).join('');
  return `<div class="calendar-month-view"><div class="calendar-weekdays"><span class="calendar-week-number-heading">${escapeHTML(t('weekNumber'))}</span>${weekdays.map(label => `<span>${escapeHTML(label)}</span>`).join('')}</div><div class="calendar-month-grid">${cells}</div></div>`;
}

function renderCalendarWeek() {
  const start = calendarStartOfWeek(calendarCursor);
  const end = calendarAddDays(start, 7);
  const today = todayISO();
  const labels = calendarWeekdayLabels('short');
  const todosByDate = calendarTodosByDate(calendarTodos(), start, end);
  const notesByDate = calendarNotesByDate(calendarNotes(), start, end);
  const days = Array.from({ length:7 }, (_, index) => {
    const date = calendarAddDays(start, index);
    const iso = calendarDateISO(date);
    const items = [...(todosByDate.get(iso) || []), ...(notesByDate.get(iso) || [])];
    return `<section class="calendar-week-day ${iso === today ? 'is-today' : ''}" data-calendar-day="${iso}">
      <header><button type="button" data-calendar-date="${iso}"><span>${escapeHTML(labels[index])}</span><b>${date.getDate()}</b></button><em>${items.length || ''}</em></header>
      <div class="calendar-week-events">${items.length ? items.map(calendarItemMarkup).join('') : '<span class="calendar-day-quiet">—</span>'}</div>
    </section>`;
  }).join('');
  return `<div class="calendar-week-swipe-hint" aria-hidden="true"><svg><use href="#i-chevron"/></svg><span>${escapeHTML(t('swipeWeekHint'))}</span><svg><use href="#i-chevron"/></svg></div><div class="calendar-week-view">${days}</div>`;
}

function renderCalendarDay() {
  const iso = calendarDateISO(calendarCursor);
  const dayStart = calendarDate(calendarCursor);
  const todos = calendarTodosByDate(calendarTodos(), dayStart, calendarAddDays(dayStart, 1)).get(iso) || [];
  const notes = calendarNotesByDate(calendarNotes(), dayStart, calendarAddDays(dayStart, 1)).get(iso) || [];
  const items = [...todos, ...notes];
  const openCount = todos.filter(item => !isTodoComplete(item)).length;
  const completedCount = todos.length - openCount;
  return `<div class="calendar-day-view">
    <div class="calendar-day-summary">
      <div><b>${items.length}</b><span>${escapeHTML(t('calendarItems'))}</span></div>
      <div><b>${openCount}</b><span>${escapeHTML(t('todos'))}</span></div>
      <div><b>${completedCount}</b><span>${escapeHTML(t('completed'))}</span></div>
      <div><b>${notes.length}</b><span>${escapeHTML(t('createdNotes'))}</span></div>
    </div>
    <div class="calendar-day-list">${items.length ? items.map(calendarItemMarkup).join('') : calendarEmptyMarkup()}</div>
  </div>`;
}

function renderCalendarYear() {
  const year = calendarCursor.getFullYear();
  const yearStart = new Date(year, 0, 1, 12);
  const yearEnd = new Date(year + 1, 0, 1, 12);
  const today = todayISO();
  const weekdays = calendarWeekdayLabels('narrow');
  const scheduled = calendarTodos();
  const notes = calendarNotes();
  const todosByDate = calendarTodosByDate(scheduled, yearStart, yearEnd);
  const notesByDate = calendarNotesByDate(notes, yearStart, yearEnd);
  const monthItemIds = Array.from({ length:12 }, () => new Set());
  todosByDate.forEach((todos, iso) => {
    const date = calendarDate(iso);
    todos.forEach(item => monthItemIds[date.getMonth()].add(item.id));
  });
  notesByDate.forEach((createdNotes, iso) => {
    const date = calendarDate(iso);
    createdNotes.forEach(item => monthItemIds[date.getMonth()].add(item.id));
  });
  const monthCounts = monthItemIds.map(ids => ids.size);
  return `<div class="calendar-year-view">${Array.from({ length:12 }, (_, month) => {
    const monthStart = new Date(year, month, 1, 12);
    const gridStart = calendarStartOfWeek(monthStart);
    const monthLabel = new Intl.DateTimeFormat(calendarLocale(), { month:'long' }).format(monthStart);
    const days = Array.from({ length:42 }, (_, index) => {
      const date = calendarAddDays(gridStart, index);
      if (date.getMonth() !== month) return '<span class="calendar-mini-day is-empty"></span>';
      const iso = calendarDateISO(date);
      const todos = todosByDate.get(iso) || [];
      const createdNotes = notesByDate.get(iso) || [];
      const itemCount = todos.length + createdNotes.length;
      const linkedCount = todos.filter(item => calendarLinkedNotes(item).length).length;
      return `<button type="button" class="calendar-mini-day ${iso === today ? 'is-today' : ''} ${todos.length ? 'has-todos' : ''} ${createdNotes.length ? 'has-notes' : ''} ${linkedCount ? 'has-links' : ''}" data-calendar-date="${iso}" title="${escapeHTML(`${date.getDate()} · ${itemCount} ${t('calendarItems')}`)}"><span>${date.getDate()}</span>${itemCount ? `<i>${itemCount}</i>` : ''}</button>`;
    }).join('');
    return `<section class="calendar-year-month" data-calendar-year-month="${calendarDateISO(monthStart)}"><header><button type="button" data-calendar-month="${calendarDateISO(monthStart)}">${escapeHTML(monthLabel)}</button><span>${monthCounts[month] || ''}</span></header><div class="calendar-mini-weekdays">${weekdays.map(label => `<span>${escapeHTML(label)}</span>`).join('')}</div><div class="calendar-mini-grid">${days}</div></section>`;
  }).join('')}</div><div class="calendar-legend"><span><i class="has-todos"></i>${escapeHTML(t('scheduledTodos'))}</span><span><i class="has-notes"></i>${escapeHTML(t('createdNotes'))}</span><span><i class="has-links"></i>${escapeHTML(t('calendarLegendLinked'))}</span></div>`;
}

function renderCalendar() {
  if (calendarViewMode === 'year') return renderCalendarYear();
  if (calendarViewMode === 'week') return renderCalendarWeek();
  if (calendarViewMode === 'day') return renderCalendarDay();
  return renderCalendarMonth();
}

function playCalendarTransition(list) {
  if (!calendarMotion) return;
  clearTimeout(calendarMotionTimer);
  list.classList.remove('calendar-is-animating');
  list.dataset.calendarMotion = calendarMotion;
  calendarMotion = '';
  void list.offsetWidth;
  list.classList.add('calendar-is-animating');
  calendarMotionTimer = setTimeout(() => {
    list.classList.remove('calendar-is-animating');
    delete list.dataset.calendarMotion;
  }, 480);
}

function alignMobileWeek(list) {
  if (calendarViewMode !== 'week' || !matchMedia('(max-width: 800px)').matches) return;
  const week = list.querySelector('.calendar-week-view');
  requestAnimationFrame(() => {
    const selectedDate = calendarDateISO(calendarCursor);
    const selectedDay = list.querySelector(`.calendar-week-day[data-calendar-day="${selectedDate}"]`) || list.querySelector('.calendar-week-day.is-today');
    if (!selectedDay || !week) return;
    week.scrollLeft = Math.max(0, selectedDay.offsetLeft - (week.clientWidth - selectedDay.clientWidth) / 2);
  });
}

function syncCalendarShell() {
  const active = currentView === 'calendar';
  document.body.classList.toggle('calendar-view', active);
  document.body.classList.toggle('calendar-week-active', active && calendarViewMode === 'week');
  document.body.classList.toggle('inbox-view', currentView === 'inbox');
  document.body.classList.toggle('folder-view', currentView.startsWith('folder:'));
  document.body.classList.toggle('stats-view', currentView === 'stats');
  document.body.classList.toggle('trash-view', currentView === 'trash');
  document.body.classList.toggle('board-view', currentView === 'board');
  if (currentView !== 'board') {
    // 离开计划板时停掉相机动画循环、取消标注绘制并丢弃渲染缓存；
    // 下次进入按「首次进入」重新编排入场。
    boardWasActive = false;
    boardStopMotion();
    boardCancelDraw();
    boardSetSelection([]);
    boardRemovePill();
    boardRemoveStyleTrigger();
    boardRemoveLayerTrigger();
    boardRenderedCards.clear();
  }
  document.dispatchEvent(new CustomEvent('acta:view-changed', { detail: currentView }));
  const toolbar = $('#calendarToolbar');
  if (toolbar) {
    toolbar.hidden = !active;
    const jumpLabel = $('#calendarJumpLabel');
    if (jumpLabel && active) {
      const activeDate = calendarDate(calendarCursor) || calendarDate(todayISO());
      jumpLabel.textContent = calendarViewMode === 'year'
        ? String(activeDate.getFullYear())
        : new Intl.DateTimeFormat(calendarLocale(), { year: 'numeric', month: 'long' }).format(activeDate);
    }
    toggleCalendarJump(false);
    $$('[data-calendar-mode]', toolbar).forEach(button => {
      const selected = button.dataset.calendarMode === calendarViewMode;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    [-1, 1].forEach(direction => {
      const button = $(`[data-calendar-shift="${direction}"]`, toolbar);
      if (!button) return;
      const label = t(calendarShiftKey(direction));
      button.title = label;
      button.setAttribute('aria-label', label);
      $('[data-calendar-shift-label]', button).textContent = label;
    });
    $('[data-calendar-today]', toolbar)?.setAttribute('aria-label', t('backToToday'));
    $('.calendar-navigation', toolbar)?.setAttribute('aria-label', t('calendarNavigation'));
    $('.calendar-view-switch', toolbar)?.setAttribute('aria-label', t('calendarViewOptions'));
  }
}

function translateStaticUI() {
  document.documentElement.lang = settings.language === 'zh' ? 'zh-CN' : settings.language === 'zh-Hant' ? 'zh-Hant' : settings.language;
  $$('[data-i18n]').forEach(node => node.textContent = t(node.dataset.i18n));
  $$('[data-i18n-placeholder]').forEach(node => node.placeholder = t(node.dataset.i18nPlaceholder));
  $$('[data-i18n-title]').forEach(node => node.title = t(node.dataset.i18nTitle));
}

function viewTitle() {
  if (currentView.startsWith('folder:')) return folderName(getFolder(currentView.split(':')[1]));
  return ({ inbox: t('inbox'), today: t('viewToday'), todos: t('viewTodos'), notes: t('viewNotes'), calendar: t('calendar'), trash: t('trash'), stats: t('stats'), board: t('board') })[currentView];
}

function listViewContext() {
  if (currentView === 'calendar') return 'calendar';
  if (currentView === 'stats' || currentView === 'trash') return currentView;
  if (currentView === 'board') return 'board';
  if (['today', 'todos'].includes(currentView)) return 'todo';
  if (currentView === 'notes') return 'note';
  return 'mixed';
}

function listFilterContext() {
  const viewContext = listViewContext();
  return viewContext === 'mixed' && ['todo', 'note'].includes(currentFilter) ? currentFilter : viewContext;
}

function resetListFilters(context = 'all') {
  if (context === 'all' || context === 'trash') {
    trashTypeFilter = 'all';
    trashFolderFilter = 'all';
  }
  if (context === 'all' || context === 'mixed') currentFilter = 'all';
  if (context === 'all' || context === 'todo') {
    todoPriorityFilter = 'all';
    todoDueFilter = 'all';
    todoFolderFilter = 'all';
  }
  if (context === 'all' || context === 'note') {
    noteFolderFilter = 'all';
    noteRelationFilter = 'all';
    noteUpdatedFilter = 'all';
  }
}

function hasActiveListFilters(context = listFilterContext()) {
  if (context === 'trash') return trashTypeFilter !== 'all' || trashFolderFilter !== 'all';
  if (['calendar', 'stats', 'board'].includes(context)) return false;
  if (context === 'mixed') return currentFilter !== 'all';
  if (context === 'todo') return [todoPriorityFilter, todoDueFilter, todoFolderFilter].some(value => value !== 'all');
  return [noteFolderFilter, noteRelationFilter, noteUpdatedFilter].some(value => value !== 'all');
}

function syncFolderFilter(select, selectedValue) {
  if (!select) return;
  select.innerHTML = [
    `<option value="all">${escapeHTML(t('allFolders'))}</option>`,
    ...library.folders.map(folder => `<option value="${escapeHTML(folder.id)}">${escapeHTML(folderName(folder))}</option>`)
  ].join('');
  select.value = selectedValue;
}

function syncListFilterUI() {
  const row = $('#listFilterRow') || $('.filter-row');
  if (!row) return;
  const viewContext = listViewContext();
  const context = listFilterContext();
  const folderIds = new Set(library.folders.map(folder => folder.id));
  if (todoFolderFilter !== 'all' && !folderIds.has(todoFolderFilter)) todoFolderFilter = 'all';
  if (noteFolderFilter !== 'all' && !folderIds.has(noteFolderFilter)) noteFolderFilter = 'all';

  row.dataset.filterContext = context;
  row.dataset.filterView = viewContext;
  $$('[data-filter-context]', row).forEach(group => {
    group.hidden = group.dataset.filterContext === 'mixed'
      ? viewContext !== 'mixed'
      : group.dataset.filterContext !== context;
  });
  $$('[data-filter]', row).forEach(button => button.classList.toggle('active', button.dataset.filter === currentFilter));
  $$('[data-trash-filter]', row).forEach(button => button.classList.toggle('active', button.dataset.trashFilter === trashTypeFilter));
  if (context === 'trash') {
    const trashFolderSelect = $('#trashFolderFilter');
    if (trashFolderSelect) {
      trashFolderSelect.innerHTML = [
        `<option value="all">${escapeHTML(t('allFolders'))}</option>`,
        `<option value="none">${escapeHTML(t('unclassified'))}</option>`,
        ...library.folders.map(folder => `<option value="${escapeHTML(folder.id)}">${escapeHTML(folderName(folder))}</option>`)
      ].join('');
      trashFolderSelect.value = trashFolderFilter;
      if (trashFolderSelect.value !== trashFolderFilter) { trashFolderFilter = 'all'; trashFolderSelect.value = 'all'; }
      trashFolderSelect.closest('.filter-select')?.classList.toggle('is-active', trashFolderFilter !== 'all');
    }
  }

  const values = {
    todoPriorityFilter, todoDueFilter, todoFolderFilter,
    noteFolderFilter, noteRelationFilter, noteUpdatedFilter
  };
  syncFolderFilter($('#todoFolderFilter'), todoFolderFilter);
  syncFolderFilter($('#noteFolderFilter'), noteFolderFilter);
  Object.entries(values).forEach(([id, value]) => {
    const select = $(`#${id}`);
    if (!select) return;
    select.value = value;
    select.closest('.filter-select')?.classList.toggle('is-active', value !== 'all');
  });

  const sortSelect = $('#listSortOrder');
  if (sortSelect) {
    sortSelect.value = listSortMode;
    sortSelect.closest('.filter-select')?.classList.toggle('is-active', listSortMode !== 'updated');
  }

  const labels = {
    todoPriorityFilter:'filterByPriority', todoDueFilter:'filterByDeadline', todoFolderFilter:'filterByFolder',
    noteFolderFilter:'filterByFolder', noteRelationFilter:'filterByRelation', noteUpdatedFilter:'filterByUpdated',
    listSortOrder:'sortBy'
  };
  Object.entries(labels).forEach(([id, key]) => {
    const select = $(`#${id}`);
    select?.setAttribute('aria-label', t(key));
    select?.setAttribute('title', t(key));
  });

  const completedToggle = $('#todoCompletedToggle');
  if (completedToggle) {
    completedToggle.hidden = currentView !== 'todos' && !currentView.startsWith('folder:');
    completedToggle.classList.toggle('is-active', settings.showCompletedTodos);
    const box = $('#todoShowCompleted');
    if (box) box.checked = settings.showCompletedTodos;
  }

  const clearButton = $('#clearListFilters');
  if (clearButton) {
    clearButton.hidden = !hasActiveListFilters(context);
    clearButton.title = t('clearFilters');
    clearButton.setAttribute('aria-label', t('clearFilters'));
  }
}

function getVisibleItems() {
  let items = currentView === 'trash' ? trashedItems() : activeItems();
  if (currentView === 'trash') {
    // 回收站的类型与归类筛选：未归类 = 没有有效归类（归类本身被删也算）。
    if (trashTypeFilter !== 'all') items = items.filter(item => item.type === trashTypeFilter);
    if (trashFolderFilter !== 'all') {
      items = trashFolderFilter === 'none'
        ? items.filter(item => !getFolder(item.folderId))
        : items.filter(item => item.folderId === trashFolderFilter);
    }
  }
  if (currentView === 'calendar') items = items.filter(item => (item.type === 'todo' && todoIsScheduled(item)) || item.type === 'note');
  if (currentView === 'inbox') items = items.filter(item => !isTodoComplete(item) || pendingSink.has(item.id));
  if (currentView === 'today') items = items.filter(item => item.type === 'todo' && todoScheduleDate(item) === todayISO() && (!isTodoComplete(item) || pendingSink.has(item.id)));
  if (currentView === 'todos') items = items.filter(item => item.type === 'todo' && (settings.showCompletedTodos || !isTodoComplete(item) || pendingSink.has(item.id)));
  if (currentView === 'notes') items = items.filter(item => item.type === 'note');
  if (currentView.startsWith('folder:')) items = items.filter(item => item.folderId === currentView.split(':')[1]
    && (item.type === 'note' || settings.showCompletedTodos || !isTodoComplete(item) || pendingSink.has(item.id)));
  const viewContext = listViewContext();
  const filterContext = listFilterContext();
  if (viewContext === 'mixed' && currentFilter !== 'all') items = items.filter(item => item.type === currentFilter);
  if (filterContext === 'todo') {
    if (todoPriorityFilter !== 'all') items = items.filter(item => item.priority === todoPriorityFilter);
    if (todoFolderFilter !== 'all') items = items.filter(item => item.folderId === todoFolderFilter);
    if (todoDueFilter !== 'all') {
      const today = todayISO();
      const upcoming = daysFromToday(7);
      items = items.filter(item => {
        const dueDate = todoDueDateISO(item);
        if (todoDueFilter === 'none') return !dueDate;
        if (!dueDate) return false;
        if (todoDueFilter === 'overdue') return dueDate < today;
        if (todoDueFilter === 'today') return dueDate === today;
        return dueDate > today && dueDate <= upcoming;
      });
    }
  }
  if (filterContext === 'note') {
    if (noteFolderFilter !== 'all') items = items.filter(item => item.folderId === noteFolderFilter);
    if (noteRelationFilter !== 'all') {
      items = items.filter(item => noteRelationFilter === 'linked' ? getLinkedItems(item).length > 0 : getLinkedItems(item).length === 0);
    }
    if (noteUpdatedFilter !== 'all') {
      const cutoff = Date.now() - Number(noteUpdatedFilter) * 86400000;
      items = items.filter(item => {
        const updatedAt = Date.parse(item.updatedAt);
        return Number.isFinite(updatedAt) && updatedAt >= cutoff;
      });
    }
  }
  if (searchQuery && currentView !== 'calendar') {
    const query = searchQuery.toLocaleLowerCase();
    items = items.filter(item => {
      const content = item.type === 'note' ? stripHTML(item.body) : `${item.notes || ''} ${(item.tasks || []).map(task => task.text).join(' ')}`;
      const linkedTitles = getLinkedItems(item).map(linked => linked.title).join(' ');
      return `${item.title} ${content} ${linkedTitles} ${(item.tags || []).join(' ')}`.toLocaleLowerCase().includes(query);
    });
  }
  const taskFocused = currentView === 'today' || currentView === 'todos' || currentView === 'calendar' || currentFilter === 'todo';
  const sortByDueThenPriority = (a, b) => {
    const dueDifference = String(a.dueAt || '9999-12-31').localeCompare(String(b.dueAt || '9999-12-31'));
    if (dueDifference) return dueDifference;
    return priorityRank(a.priority) - priorityRank(b.priority);
  };
  const listSortComparers = {
    updated: (a, b) => {
      if (a.type === 'todo' && b.type === 'todo') {
        const priorityDifference = priorityRank(a.priority) - priorityRank(b.priority);
        if (priorityDifference) return priorityDifference;
        const dueDifference = String(a.dueAt || '9999-12-31').localeCompare(String(b.dueAt || '9999-12-31'));
        if (dueDifference) return dueDifference;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    },
    created: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    due: (a, b) => {
      if (a.type !== b.type) return a.type === 'todo' ? -1 : 1;
      if (a.type === 'todo') {
        const scheduledDifference = sortByDueThenPriority(a, b);
        if (scheduledDifference) return scheduledDifference;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    },
    priority: (a, b) => {
      if (a.type !== b.type) return a.type === 'todo' ? -1 : 1;
      if (a.type === 'todo') {
        const priorityDifference = priorityRank(a.priority) - priorityRank(b.priority);
        if (priorityDifference) return priorityDifference;
        const dueDifference = String(a.dueAt || '9999-12-31').localeCompare(String(b.dueAt || '9999-12-31'));
        if (dueDifference) return dueDifference;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    },
    title: (a, b) => String(a.title || '').localeCompare(String(b.title || ''), undefined, { numeric: true })
  };
  const compareBySortMode = listSortComparers[listSortMode] || ((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  if (currentView === 'trash') return items;
  // 置底等待期间沿用冻结顺序：完成瞬间触碰了 updatedAt，若按正常比较器排序，
  // 待办会在延迟期间跳到未完成区的顶部而不是原地停留。
  if (pendingSink.size && sinkContext.view === currentView && sinkContext.filter === currentFilter && sinkFrozenOrder.length) {
    const orderIndex = new Map(sinkFrozenOrder.map((id, index) => [id, index]));
    return items.sort((a, b) => {
      const aIndex = orderIndex.get(a.id);
      const bIndex = orderIndex.get(b.id);
      if (aIndex !== undefined || bIndex !== undefined) {
        return (aIndex ?? Number.MAX_SAFE_INTEGER) - (bIndex ?? Number.MAX_SAFE_INTEGER);
      }
      return compareBySortMode(a, b);
    });
  }
  return items.sort((a, b) => {
    if (taskFocused && a.type === 'todo' && b.type === 'todo') {
      const completionDifference = Number(isTodoComplete(a)) - Number(isTodoComplete(b));
      if (completionDifference) return completionDifference;
    }
    return compareBySortMode(a, b);
  });
}

function renderSidebar() {
  $('#inboxCount').textContent = activeItems().filter(item => !isTodoComplete(item)).length;
  $('#todoCount').textContent = activeItems().filter(item => item.type === 'todo' && !isTodoComplete(item)).length;
  $('#noteCount').textContent = activeItems().filter(item => item.type === 'note').length;
  $('#calendarCount').textContent = calendarTodos().length + calendarNotes().length;
  $('#trashCount').textContent = trashedItems().length;

  $$('#smartNav button').forEach(button => button.classList.toggle('active', button.dataset.view === currentView));
  $('#folderNav').innerHTML = library.folders.map(folder => {
    const count = activeItems().filter(item => item.folderId === folder.id).length;
    const shortName = folderShortName(folder);
    const shortNameClasses = ['folder-short-name', folderShortNameUsesEmoji(shortName) ? 'is-emoji' : '', folderShortSegments(shortName).length > 2 ? 'is-long' : ''].filter(Boolean).join(' ');
    return `<button data-view="folder:${escapeHTML(folder.id)}" class="${currentView === `folder:${folder.id}` ? 'active' : ''}" title="${escapeHTML(folderName(folder))}" aria-label="${escapeHTML(folderName(folder))}">
      <span><i class="folder-dot" style="background:${escapeHTML(folder.color)};color:${escapeHTML(folder.color)}"><b class="${shortNameClasses}">${escapeHTML(shortName)}</b></i><span>${escapeHTML(folderName(folder))}</span></span><em>${count}</em>
    </button>`;
  }).join('');

}

function itemPreview(item) {
  if (item.type === 'note') return stripHTML(item.body) || t('notePlaceholder');
  // 子任务文本可能含 Shift+Enter 换行；卡片预览为单行，折叠为空格。
  const open = (item.tasks || []).filter(task => !task.done).map(task => task.text).filter(Boolean);
  return open[0]?.replace(/\s*\r?\n\s*/g, ' ') || item.notes || (isTodoComplete(item) ? t('done') : t('taskPlaceholder'));
}

const statsRangePresets = ['all', 'today', '7', '30', '90', 'custom'];
const statsSelection = new Set();

// createdAt is a UTC ISO string; slicing it would put items created before the UTC
// offset (e.g. UTC+8 mornings) on the previous day. Stats group by local calendar day.
const statsDateKey = item => {
  const raw = validDate(item.createdAt);
  return raw ? calendarDateISO(new Date(raw)) : '';
};

// Drop ids that no longer belong to the current period/library so the toolbar count,
// the checkboxes and the exported picture always describe the same selection.
const pruneStatsSelection = () => {
  const collected = new Set(statsCollectionItems().map(item => item.id));
  [...statsSelection].forEach(id => { if (!collected.has(id)) statsSelection.delete(id); });
};

function statsRangeWindow() {
  const range = statsRangePresets.includes(settings.statsRange) ? settings.statsRange : 'all';
  const today = todayISO();
  if (range === 'today') return [today, today];
  if (range === '7' || range === '30' || range === '90') return [daysFromToday(-(Number(range) - 1)), today];
  if (range === 'custom') {
    const start = validDate(settings.statsRangeStart) ? settings.statsRangeStart.slice(0, 10) : '';
    const end = validDate(settings.statsRangeEnd) ? settings.statsRangeEnd.slice(0, 10) : '';
    if (start || end) return [start, end];
  }
  return [null, null];
}

function statsRangeLabel() {
  const [start, end] = statsRangeWindow();
  const range = statsRangePresets.includes(settings.statsRange) ? settings.statsRange : 'all';
  if (range === 'today') return t('statsRangeToday');
  if (range === '7' || range === '30' || range === '90') return t(`statsRange${range}`);
  if (range === 'custom') return `${start || '…'} — ${end || '…'}`;
  return t('statsRangeAll');
}

function statsCollectionItems() {
  const [start, end] = statsRangeWindow();
  return activeItems().filter(item => {
    const key = statsDateKey(item);
    if (!key) return false;
    if (start && key < start) return false;
    if (end && key > end) return false;
    return true;
  }).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function statsGroupLabel(dateKey) {
  if (dateKey === todayISO()) return t('statsGroupToday');
  if (dateKey === daysFromToday(-1)) return t('yesterday');
  return new Intl.DateTimeFormat(calendarLocale(), { month:'long', day:'numeric', weekday:'short' }).format(new Date(`${dateKey}T12:00:00`));
}

function statsItemRow(item, index) {
  const folder = getFolder(item.folderId);
  const checked = statsSelection.has(item.id);
  const done = item.type === 'todo' && isTodoComplete(item);
  const title = item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote'));
  // 完整子待办：逐条列出、不截断；没有子任务时回退到原有的单行预览。
  const tasks = item.type === 'todo' ? (item.tasks || []).filter(task => String(task.text || '').trim()) : [];
  const subtasks = tasks.length ? `<ul class="stats-subtasks">${tasks.map(task => `<li class="${task.done ? 'is-done' : ''}"><i aria-hidden="true"><svg><use href="#i-check"/></svg></i><span>${escapeHTML(task.text)}</span></li>`).join('')}</ul>` : '';
  const preview = tasks.length ? '' : `<small><span class="mini-folder"><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span>${escapeHTML(itemPreview(item).slice(0, 80))}</small>`;
  return `<div class="stats-item-row ${checked ? 'is-checked' : ''}" data-stats-row="${escapeHTML(item.id)}" style="animation-delay:${Math.min(index * 16, 90)}ms">
    <label class="stats-item-check" title="${escapeHTML(t('statsCheckItem'))}">
      <input type="checkbox" data-stats-check="${escapeHTML(item.id)}" ${checked ? 'checked' : ''}/>
      <i aria-hidden="true"><svg><use href="#i-check"/></svg></i>
    </label>
    <button type="button" class="stats-item-open" data-stats-open="${escapeHTML(item.id)}">
      <span class="stats-item-topline"><span class="type-pill ${item.type}"><svg><use href="#i-${item.type === 'todo' ? 'check' : 'note'}"/></svg>${t(item.type)}${item.type === 'todo' ? ` · ${done ? t('done') : t('statOpen')}` : ''}</span><time datetime="${escapeHTML(item.createdAt)}">${escapeHTML(formatListDateTime(item.createdAt))}</time></span>
      <b>${escapeHTML(title)}</b>
      ${subtasks}
      ${preview || (tasks.length ? `<small><span class="mini-folder"><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span></small>` : '')}
    </button>
  </div>`;
}

function renderStatsToolbar(selectedCount) {
  return `<section class="stats-toolbar">
    <label class="filter-select stats-range-field">
      <svg><use href="#i-clock"/></svg>
      <select id="statsRange" aria-label="${escapeHTML(t('statsListTitle'))}">
        <option value="all">${escapeHTML(t('statsRangeAll'))}</option>
        <option value="today">${escapeHTML(t('statsRangeToday'))}</option>
        <option value="7">${escapeHTML(t('statsRange7'))}</option>
        <option value="30">${escapeHTML(t('statsRange30'))}</option>
        <option value="90">${escapeHTML(t('statsRange90'))}</option>
        <option value="custom">${escapeHTML(t('statsRangeCustom'))}</option>
      </select>
    </label>
    <div class="stats-custom-range" id="statsCustomRange" ${settings.statsRange === 'custom' ? '' : 'hidden'}>
      <input type="date" id="statsRangeStart" value="${escapeHTML(settings.statsRangeStart || '')}" aria-label="${escapeHTML(t('statsCustomStart'))}"/>
      <i aria-hidden="true">—</i>
      <input type="date" id="statsRangeEnd" value="${escapeHTML(settings.statsRangeEnd || '')}" aria-label="${escapeHTML(t('statsCustomEnd'))}"/>
    </div>
    <div class="stats-toolbar-actions">
      <span class="stats-selection-count" id="statsSelectionCount">${escapeHTML(t('statsSelectedCount').replace('{0}', selectedCount))}</span>
      <button type="button" class="stats-tool-button" id="statsSelectAll">${escapeHTML(t('statsSelectAll'))}</button>
      <button type="button" class="stats-tool-button" id="statsClearSelection">${escapeHTML(t('statsClearSelection'))}</button>
      <button type="button" class="stats-tool-button is-primary" id="statsMakeImage"><svg><use href="#i-image"/></svg>${escapeHTML(t('statsMakeImage'))}</button>
    </div>
  </section>`;
}

function renderStats() {
  const items = statsCollectionItems();
  const selectedCount = items.filter(item => statsSelection.has(item.id)).length;
  if (!items.length) {
    // Keep the toolbar rendered so the period picker stays reachable on empty ranges.
    return `<div class="stats-collection-wrap">
      ${renderStatsToolbar(selectedCount)}
      <div class="stats-empty"><div><span><svg><use href="#i-chart"/></svg></span><h3>${escapeHTML(t('statsListTitle'))}</h3><p>${escapeHTML(t('statsEmptyRange'))}</p></div></div>
    </div>`;
  }
  const groups = new Map();
  items.forEach(item => {
    const key = statsDateKey(item);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  let rowIndex = 0;
  const groupsMarkup = [...groups.entries()].map(([key, groupItems]) => `
    <section class="stats-day-group">
      <header class="stats-day-head"><b>${escapeHTML(statsGroupLabel(key))}</b><span>${escapeHTML(key)} · ${groupItems.length} ${t('item')}</span></header>
      ${groupItems.map(item => statsItemRow(item, rowIndex++)).join('')}
    </section>`).join('');
  return `<div class="stats-collection-wrap">
    ${renderStatsToolbar(selectedCount)}
    <div class="stats-collection">${groupsMarkup}</div>
    <p class="stats-collection-hint">${escapeHTML(t('statsListHint'))}</p>
  </div>`;
}

function syncStatsSelectionCount() {
  const counter = $('#statsSelectionCount');
  if (!counter) return;
  const selectedCount = statsCollectionItems().filter(item => statsSelection.has(item.id)).length;
  counter.textContent = t('statsSelectedCount').replace('{0}', selectedCount);
}

function bindStatsView() {
  const range = $('#statsRange');
  if (!range) return;
  range.value = statsRangePresets.includes(settings.statsRange) ? settings.statsRange : 'all';
  range.addEventListener('change', () => {
    settings.statsRange = statsRangePresets.includes(range.value) ? range.value : 'all';
    pruneStatsSelection();
    persist();
    renderList();
  });
  [['statsRangeStart', 'statsRangeStart'], ['statsRangeEnd', 'statsRangeEnd']].forEach(([id, key]) => {
    $(`#${id}`)?.addEventListener('change', event => {
      settings[key] = event.target.value;
      pruneStatsSelection();
      persist();
      renderList();
    });
  });
  $('#statsSelectAll')?.addEventListener('click', () => {
    statsCollectionItems().forEach(item => statsSelection.add(item.id));
    $$('.stats-item-row').forEach(row => row.classList.add('is-checked'));
    $$('.stats-item-check input').forEach(box => { box.checked = true; });
    syncStatsSelectionCount();
  });
  $('#statsClearSelection')?.addEventListener('click', () => {
    statsSelection.clear();
    $$('.stats-item-row').forEach(row => row.classList.remove('is-checked'));
    $$('.stats-item-check input').forEach(box => { box.checked = false; });
    syncStatsSelectionCount();
  });
  $('#statsMakeImage')?.addEventListener('click', () => exportStatsImage());
  $$('.stats-item-check input').forEach(box => box.addEventListener('change', () => {
    if (box.checked) statsSelection.add(box.dataset.statsCheck);
    else statsSelection.delete(box.dataset.statsCheck);
    box.closest('.stats-item-row')?.classList.toggle('is-checked', box.checked);
    syncStatsSelectionCount();
  }));
  $$('.stats-item-open').forEach(button => button.addEventListener('click', () => openItem(button.dataset.statsOpen)));
}

function themeCanvasColors() {
  const style = getComputedStyle(document.documentElement);
  const pick = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
  return {
    paper: pick('--paper', '#fbfaf6'),
    ink: pick('--ink', '#242823'),
    muted: pick('--muted', '#6b6f66'),
    faint: pick('--faint', '#9aa094'),
    line: pick('--line', '#e3e2da'),
    card: pick('--white', '#ffffff'),
    todoAccent: pick('--todo-accent', '#4f86a8'),
    todoSoft: pick('--todo-soft', '#dceef8'),
    noteAccent: pick('--note-accent', '#987329'),
    noteSoft: pick('--note-soft', '#fff0bd')
  };
}

const STATS_CANVAS_MAX_HEIGHT = 14000;

if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y, x + w, y + h, radius);
    this.arcTo(x + w, y + h, x, y + h, radius);
    this.arcTo(x, y + h, x, y, radius);
    this.arcTo(x, y, x + w, y, radius);
    this.closePath();
    return this;
  };
}

function canvasTruncateText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = String(text);
  while (truncated.length > 1 && ctx.measureText(`${truncated}…`).width > maxWidth) truncated = truncated.slice(0, -1);
  return `${truncated}…`;
}

function renderStatsCanvas(items) {
  const colors = themeCanvasColors();
  const width = 1080;
  const margin = 84;
  const fontFamily = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif';
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `650 30px ${fontFamily}`;

  const groups = new Map();
  items.forEach(item => {
    const key = statsDateKey(item);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  const layout = [];
  let height = margin + 96 + 44 + 36;
  const limit = STATS_CANVAS_MAX_HEIGHT - margin - 120;
  let omitted = 0;
  groups.forEach((groupItems, key) => {
    if (height >= limit) { omitted += groupItems.length; return; }
    height += 30 + 52;
    layout.push({ type:'group', key, count:groupItems.length });
    groupItems.forEach(item => {
      if (height >= limit) { omitted += 1; return; }
      const title = item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote'));
      const folder = getFolder(item.folderId);
      const meta = [folderName(folder), formatListDateTime(item.createdAt)].filter(Boolean).join(' · ');
      const preview = stripHTML(item.type === 'note' ? item.body : item.notes || '') || '';
      measure.font = `650 30px ${fontFamily}`;
      const titleWidth = width - margin * 2 - 118 - 24;
      const titleLines = canvasTruncateText(measure, title, titleWidth);
      measure.font = `400 22px ${fontFamily}`;
      const metaWidth = width - margin * 2 - 118 - 24;
      const metaLines = meta ? [canvasTruncateText(measure, meta, metaWidth)] : [];
      const previewLines = preview ? [canvasTruncateText(measure, preview.replace(/\s+/g, ' ').trim(), metaWidth)] : [];
      const rowHeight = 34 + (titleLines ? 42 : 0) + (metaLines.length ? 32 : 0) + (previewLines.length ? 30 : 0) + 26;
      height += rowHeight;
      layout.push({ type:'item', item, title:titleLines, meta, metaLines, previewLines, height:rowHeight });
    });
  });
  height = Math.min(height + 150, STATS_CANVAS_MAX_HEIGHT);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.round(height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = colors.paper;
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.textBaseline = 'alphabetic';

  let y = margin;
  ctx.fillStyle = colors.ink;
  ctx.font = `700 56px ${fontFamily}`;
  ctx.fillText('Acta · 行记', margin, y + 56);
  ctx.fillStyle = colors.faint;
  ctx.font = `600 26px ${fontFamily}`;
  const todoCount = items.filter(item => item.type === 'todo').length;
  const summary = `${statsRangeLabel()} · ${items.length} ${t('item')}（${todoCount} ${t('todo')} · ${items.length - todoCount} ${t('note')}）`;
  ctx.fillText(canvasTruncateText(ctx, summary, width - margin * 2), margin, y + 104);
  y += 140;
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(width - margin, y);
  ctx.stroke();
  y += 30;

  layout.forEach(entry => {
    if (entry.type === 'group') {
      ctx.fillStyle = colors.faint;
      ctx.font = `700 26px ${fontFamily}`;
      ctx.fillText(`${statsGroupLabel(entry.key)} · ${entry.key}`, margin, y + 34);
      y += 52;
      return;
    }
    const item = entry.item;
    const isTodo = item.type === 'todo';
    const done = isTodo && isTodoComplete(item);
    const badge = { x:margin, y:y + 6, w:118, h:40 };
    ctx.fillStyle = isTodo ? colors.todoSoft : colors.noteSoft;
    ctx.beginPath();
    ctx.roundRect(badge.x, badge.y, badge.w, badge.h, 12);
    ctx.fill();
    ctx.fillStyle = isTodo ? colors.todoAccent : colors.noteAccent;
    ctx.font = `700 21px ${fontFamily}`;
    const badgeText = isTodo ? (done ? `✓ ${t('done')}` : t('todo')) : t('note');
    const badgeWidth = ctx.measureText(badgeText).width;
    ctx.fillText(badgeText, badge.x + (badge.w - badgeWidth) / 2, badge.y + 27);
    const textX = margin + 118 + 24;
    let textY = y + 30;
    ctx.fillStyle = done ? colors.faint : colors.ink;
    ctx.font = `650 30px ${fontFamily}`;
    ctx.fillText(entry.title, textX, textY);
    if (done) {
      const titleWidth = ctx.measureText(entry.title).width;
      ctx.strokeStyle = colors.faint;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(textX, textY - 10);
      ctx.lineTo(textX + titleWidth, textY - 10);
      ctx.stroke();
    }
    textY += 42;
    ctx.font = `400 22px ${fontFamily}`;
    ctx.fillStyle = colors.muted;
    if (entry.metaLines.length) {
      ctx.fillText(entry.metaLines[0], textX, textY);
      textY += 32;
    }
    if (entry.previewLines.length) {
      ctx.fillStyle = colors.faint;
      ctx.fillText(entry.previewLines[0], textX, textY);
      textY += 30;
    }
    y += entry.height;
  });

  if (omitted > 0) {
    ctx.fillStyle = colors.faint;
    ctx.font = `600 22px ${fontFamily}`;
    ctx.fillText(t('moreTodos').replace('{0}', omitted), margin, y + 30);
    y += 46;
  }

  ctx.fillStyle = colors.faint;
  ctx.font = `500 22px ${fontFamily}`;
  ctx.fillText(`${formatDateTimeSeconds(new Date().toISOString())} · Acta 行记`, margin, canvas.height - margin / 1.6);
  return canvas;
}

async function saveExportAssets(assets) {
  if (window.actaDesktop?.exportAssets) return window.actaDesktop.exportAssets(assets);
  const nativeExport = window.Capacitor?.Plugins?.ActaSync?.exportAsset;
  if (nativeExport) {
    const results = [];
    for (const asset of assets) results.push(await nativeExport(asset));
    return results;
  }
  assets.forEach((asset, index) => {
    const [header, data] = asset.dataUrl.split(',');
    const mimeType = /data:([^;]+)/.exec(header)?.[1] || asset.mimeType;
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let offset = 0; offset < binary.length; offset += 1) bytes[offset] = binary.charCodeAt(offset);
    const url = URL.createObjectURL(new Blob([bytes], { type:mimeType }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = asset.fileName;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    setTimeout(() => {
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
    }, index * 140);
  });
  return assets;
}

async function exportStatsImage() {
  const items = statsCollectionItems().filter(item => statsSelection.has(item.id));
  if (!items.length) {
    showToast(t('statsNeedSelection'));
    return;
  }
  try {
    const canvas = renderStatsCanvas(items);
    const stamp = todayISO();
    const asset = { fileName:`Acta ${t('statsListTitle')} ${stamp}.png`, mimeType:'image/png', dataUrl:canvas.toDataURL('image/png') };
    const saved = await saveExportAssets([asset]);
    if (saved) showToast(t('statsImageDone'));
  } catch (error) {
    showToast(`${t('statsImageFailed')}: ${error?.message || error}`);
  }
}

function renderTrashList(items) {
  return `<div class="trash-tools">
      <span class="trash-note">${escapeHTML(t('trashFooterNote'))}</span>
      <button type="button" class="stats-tool-button" id="emptyTrashButton"><svg><use href="#i-trash"/></svg>${escapeHTML(t('emptyTrash'))}</button>
    </div>
    ${items.map((item, index) => {
      const folder = getFolder(item.folderId);
      return `<div class="trash-card ${item.type === 'todo' ? 'is-todo' : 'is-note'}" data-trash-card="${escapeHTML(item.id)}" style="animation-delay:${Math.min(index * 18, 100)}ms">
        <span class="type-pill ${item.type}"><svg><use href="#i-${item.type === 'todo' ? 'check' : 'note'}"/></svg>${t(item.type)}</span>
        <div class="trash-card-body">
          <b>${escapeHTML(item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote')))}</b>
          <small><span class="mini-folder"><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span><time datetime="${escapeHTML(item.deletedAt)}">${escapeHTML(t('deletedAt'))} ${escapeHTML(formatListDateTime(item.deletedAt))}</time></small>
        </div>
        <div class="trash-card-actions">
          <button type="button" class="trash-action is-restore" data-trash-restore="${escapeHTML(item.id)}" title="${escapeHTML(t('restoreHint'))}"><svg><use href="#i-undo"/></svg><span>${escapeHTML(t('restore'))}</span></button>
          <button type="button" class="trash-action is-destroy" data-trash-destroy="${escapeHTML(item.id)}" title="${escapeHTML(t('destroy'))}"><svg><use href="#i-trash"/></svg><span>${escapeHTML(t('destroy'))}</span></button>
        </div>
      </div>`;
    }).join('')}`;
}

function bindTrashList() {
  $('#emptyTrashButton')?.addEventListener('click', async () => {
    const items = trashedItems();
    if (!items.length) return;
    if (!await askDestroyConfirm({ itemLabel: t('emptyTrash'), message: t('emptyTrashConfirmMessage').replace('{0}', items.length) })) return;
    destroyItems(items.map(item => item.id));
    showToast(t('trashEmptied'));
  });
  $$('[data-trash-restore]').forEach(button => button.addEventListener('click', () => {
    const item = library.items.find(entry => entry.id === button.dataset.trashRestore);
    if (!item) return;
    delete item.deletedAt;
    relinkFromTrash(item);
    touchItem(item);
    renderAll();
    showToast(t('restored'));
  }));
  $$('[data-trash-destroy]').forEach(button => button.addEventListener('click', async () => {
    const item = library.items.find(entry => entry.id === button.dataset.trashDestroy);
    if (!item) return;
    const title = item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote'));
    if (!await askDestroyConfirm({ itemLabel: `${t(item.type)} · ${title}`, message: t('deleteDestroyHint') })) return;
    logHistory('item-destroyed', title, item.id, JSON.parse(JSON.stringify(item)));
    logHistory('item-destroyed', item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote')), item.id, JSON.parse(JSON.stringify(item)));
    destroyItems([item.id]);
    showToast(t('destroyed'));
  }));
}

function destroyItems(ids) {
  const idSet = new Set(ids);
  library.items.forEach(entry => { entry.linkedIds = (entry.linkedIds || []).filter(id => !idSet.has(id)); });
  library.items = library.items.filter(entry => !idSet.has(entry.id));
  idSet.forEach(id => statsSelection.delete(id));
  if (selectedId && idSet.has(selectedId)) selectedId = activeItems()[0]?.id || null;
  persist();
  renderAll();
}

// Moving an item to the trash keeps its two-way links recoverable: both sides stash
// the removed link in _trashedLinkedIds so a restore can rebuild the pair. Items
// destroyed from the trash drop out of the library, and relinkFromTrash skips ids
// that no longer resolve, so stale stashes are cleaned up lazily.
function unlinkForTrash(item) {
  const linked = (item.linkedIds || []).filter(id => id && id !== item.id);
  item._trashedLinkedIds = Array.from(new Set([...(item._trashedLinkedIds || []), ...linked]));
  item.linkedIds = [];
  linked.forEach(id => {
    const other = library.items.find(entry => entry.id === id);
    if (!other) return;
    other._trashedLinkedIds = Array.from(new Set([...(other._trashedLinkedIds || other.linkedIds || []), item.id]));
    other.linkedIds = (other.linkedIds || []).filter(entryId => entryId !== item.id);
  });
}

function relinkFromTrash(item) {
  const linked = Array.isArray(item._trashedLinkedIds) ? item._trashedLinkedIds.filter(id => id && id !== item.id) : [];
  delete item._trashedLinkedIds;
  const restored = [];
  linked.forEach(id => {
    const other = library.items.find(entry => entry.id === id);
    if (!other || other.deletedAt) return;
    restored.push(id);
    other.linkedIds = Array.from(new Set([...(other.linkedIds || []), item.id]));
    if (Array.isArray(other._trashedLinkedIds)) {
      other._trashedLinkedIds = other._trashedLinkedIds.filter(entryId => entryId !== item.id);
      if (!other._trashedLinkedIds.length) delete other._trashedLinkedIds;
    }
  });
  item.linkedIds = Array.from(new Set([...(item.linkedIds || []), ...restored]));
}

// —— 汇总板：自由搭建的模块化画布 ——
// 画布 = 一块可自定义的白板：条目卡片（引用待办/笔记）、富文本、标注三类组件
// 随意摆放；多块板随行记数据（library.boards）保存与同步，相机与当前板是
// 本机偏好（localStorage）。画布没有固定尺寸，条目卡片虚拟化渲染，
// 平移缩放全部走 transform ——「无限大」只是一个坐标平面。
const BOARD_KEY = 'acta.board.v2';
const BOARD_CARD_W = 264;
// 条目卡片的八向调节点（四角 + 四边中点）。
const BOARD_RESIZE_DIRS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const BOARD_CARD_MIN_W = 200;
const BOARD_CARD_MIN_H = 88;
const BOARD_CARD_MAX_W = 1200;
const BOARD_CARD_MAX_H = 1000;
const BOARD_CARD_H = 114;
const BOARD_SCALE_MIN = 0.4;
const BOARD_SCALE_MAX = 1.75;
const BOARD_MARGIN = 460;
const BOARD_GLIDE_DECAY = 0.998; // 每毫秒保留的速度比例（Apple 滚动衰减率）
const BOARD_PRESS_SLOP = 9;      // 按下后超过该位移才算拖动，之前松手都是点击（触屏按压自带抖动，死区要够宽）
const BOARD_TEXT_FAMILIES = {
  app: '',
  serif: 'Georgia, "Noto Serif CJK SC", "Songti SC", serif',
  rounded: '"Arial Rounded MT Bold", "PingFang SC", "Microsoft YaHei", sans-serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
};
const boardState = (() => {
  const stored = loadJSON(BOARD_KEY, null) || {};
  const cams = {};
  if (stored.cams && typeof stored.cams === 'object') {
    Object.entries(stored.cams).forEach(([id, cam]) => {
      if (cam && Number.isFinite(cam.x) && Number.isFinite(cam.y) && Number.isFinite(cam.scale)) {
        cams[id] = { x: cam.x, y: cam.y, scale: Math.min(BOARD_SCALE_MAX, Math.max(BOARD_SCALE_MIN, cam.scale)) };
      }
    });
  }
  const storedPrefs = stored.prefs && typeof stored.prefs === 'object' ? stored.prefs : {};
  return {
    activeBoardId: typeof stored.activeBoardId === 'string' ? stored.activeBoardId : null,
    cams,
    editorWidth: Number.isFinite(stored.editorWidth) ? Math.min(760, Math.max(340, Math.round(stored.editorWidth))) : 460,
    prefs: {
      renderMargin: ['small', 'medium', 'large'].includes(storedPrefs.renderMargin) ? storedPrefs.renderMargin : 'medium',
      linkCurves: storedPrefs.linkCurves !== false
    }
  };
})();
const BOARD_RENDER_MARGINS = { small: 260, medium: 460, large: 800 };
const boardRenderMargin = () => BOARD_RENDER_MARGINS[boardState.prefs.renderMargin] || 460;
const boardCam = { x: 0, y: 0, scale: 1, vX: 0, vY: 0 };
// motion.mode: 'idle' | 'drag' | 'pinch' | 'glide' | 'settle'；组件拖拽 / 端点编辑 /
// 标注绘制用 gesture.mode（'widget' | 'handle' | 'draw'）。zooming（滚轮/按钮的
// 目标缩放逼近）与 settle（fit / 回边界的目标动画）独立于 mode。
const boardMotion = { mode: 'idle', raf: 0, last: 0, anchor: null, targetScale: 0, settle: null };
const boardPointers = new Map();
let boardGesture = null;
let boardEls = null;
let boardResizeObserver = null;
let boardLayoutCache = null;
let boardSyncFrame = 0;
let boardEnterAnimated = false;
let boardWasActive = false;
let boardPersistTimer = 0;
const boardSelection = new Set();  // 选中的组件集合（框选可多选；条目组件的选中即编辑器）
let boardSelectedHandle = null;   // 拖动中的端点句柄样式标记
let boardEditingText = null;      // 正在编辑的文本组件 id
let boardPendingMarker = null;    // 待绘制的标注形状（点击画布拖出）
let boardDraftMarker = null;      // 绘制中的临时元素
let boardMenuTimer = 0;
let boardMarkerMenuOutside = null; // 标注菜单的外部关闭监听（菜单移出工具条后自行管理）
// 面板打开前的相机取景：收起时画布归位；期间用户手动平移过则尊重新位置。
let boardCamRestore = null;
let boardCamManual = false;
// 画笔模式：选中「笔绘」后进入连续绘制（多笔），完成 / Esc / 再点按钮退出。
// 笔刷参数跨笔保持；荧光笔是宽、低透明度、multiply 混合的笔型；橡皮
// 与笔集成在同一面板里切换（stroke 字段此时表示橡皮半径）。
const boardPenState = { brush: 'pen', color: BOARD_MARKER_COLORS[0], stroke: 2.5, opacity: 100, flow: 100, cap: 'round' };
const boardPenPresets = {
  pen: { stroke: 2.5, opacity: 100, flow: 100, cap: 'round' },
  highlighter: { stroke: 14, opacity: 35, flow: 100, cap: 'butt' },
  eraser: { stroke: 12, opacity: 100, flow: 100, cap: 'round' }
};
let lastBoardTap = { id: null, at: 0 };
const boardRenderedCards = new Map(); // 条目卡片 id → 已渲染元素（虚拟化的增删基准）
let boardSpaceDown = false;          // 按住空格：主键拖拽临时变成平移画布（框选让位）
// 空格键监听一次性注册（模块加载即挂上，输入框内不劫持）。
document.addEventListener('keydown', event => {
  if (event.code !== 'Space' || event.repeat || currentView !== 'board') return;
  if (event.target?.closest?.('input, textarea, select, [contenteditable="true"], [contenteditable="plaintext-only"]')) return;
  boardSpaceDown = true;
  boardEls?.canvas.classList.add('is-panning');
  event.preventDefault();
});
document.addEventListener('keyup', event => {
  if (event.code !== 'Space') return;
  boardSpaceDown = false;
  boardEls?.canvas.classList.remove('is-panning');
});
const boardTextHeights = new Map();   // 文本组件 id → 实测高度（bounds 估算用）

function persistBoardState() {
  clearTimeout(boardPersistTimer);
  boardPersistTimer = setTimeout(() => {
    try {
      const board = boardLayoutCache?.board;
      if (board) boardState.cams[board.id] = { x: boardCam.x, y: boardCam.y, scale: boardCam.scale };
      localStorage.setItem(BOARD_KEY, JSON.stringify({ activeBoardId: boardState.activeBoardId, cams: boardState.cams, editorWidth: boardState.editorWidth, prefs: boardState.prefs }));
    } catch { /* 状态存不进去不影响画布使用 */ }
  }, 350);
}

const touchBoard = board => { board.updatedAt = new Date().toISOString(); };

// 惰性初始化：第一次打开汇总板时建板。旧版本把摆放坐标存在条目上
// （item.board），这里把它们迁移成第一块板的组件，让老用户的画布原地升级。
function ensureBoards() {
  if (!Array.isArray(library.boards)) library.boards = [];
  library.boards.forEach(board => { if (!board.name) board.name = t('boardDefaultName'); });
  if (library.boards.length) return library.boards;
  const board = {
    id: uid(), name: t('boardDefaultName'), widgets: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  activeItems().forEach(item => {
    if (!item.board) return;
    board.widgets.push({ id: uid(), type: item.type, ref: item.id, x: item.board.x, y: item.board.y });
    delete item.board;
  });
  library.boards.push(board);
  persist();
  return library.boards;
}

function activeBoard() {
  const boards = ensureBoards();
  const board = boards.find(entry => entry.id === boardState.activeBoardId) || boards[0];
  boardState.activeBoardId = board.id;
  return board;
}

// 视口中心附近的第一个空位：多选导入 / 新建组件的自动安家点，向下错开。
function boardVacantSpot(width = BOARD_CARD_W, height = BOARD_CARD_H) {
  const board = activeBoard();
  const { w, h } = boardViewportSize();
  const centerX = Math.round((w / 2 - boardCam.x) / boardCam.scale);
  const centerY = Math.round((h / 2 - boardCam.y) / boardCam.scale);
  const step = height + 14;
  const occupied = board.widgets.filter(widget => !widget.hidden).map(widget => ({ x: widget.x, y: widget.y, ...boardWidgetSize(widget) }));
  const overlaps = (x, y) => occupied.some(rect => rect.x < x + width + 12 && rect.x + rect.w + 12 > x
    && rect.y < y + height + 12 && rect.y + rect.h + 12 > y);
  let top = centerY - Math.round(height / 2);
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const y = top + attempt * step;
    if (!overlaps(centerX, y)) return { x: centerX, y };
  }
  return { x: centerX, y: top + 60 * step };
}

// 组件的占位尺寸：条目卡片可自由调整（widget.w/h），文本宽度固定高度实测，
// 标注取外接矩形（画笔取包络）——bounds、框选与聚焦统一走这里。
function boardWidgetSize(widget) {
  if (widget.type === 'note' || widget.type === 'todo') return { w: widget.w || 264, h: widget.h || 114 };
  if (widget.type === 'text') return { w: widget.w || 240, h: boardTextHeights.get(widget.id) || 64 };
  if (widget.type === 'marker') {
    const floor = widget.kind === 'draw' ? 1 : 40;
    return { w: Math.max(Math.abs(widget.w) || floor, floor), h: Math.max(Math.abs(widget.h) || floor, floor) };
  }
  return { w: 264, h: 114 };
}

function boardBoundsOf(widgets) {
  let minX = 0;
  let minY = 0;
  let maxX = BOARD_CARD_W;
  let maxY = 196;
  widgets.forEach(widget => {
    const size = boardWidgetSize(widget);
    minX = Math.min(minX, widget.x);
    minY = Math.min(minY, widget.y);
    maxX = Math.max(maxX, widget.x + size.w);
    maxY = Math.max(maxY, widget.y + size.h);
  });
  return { minX, minY, maxX: maxX + 24, maxY: maxY + 24 };
}

// 布局：组件即布局。条目组件解析出卡片（引用失效的组件顺手清理），
// 文本与标注是常驻组件（数量少，不做虚拟化）。
function boardLayout() {
  const board = activeBoard();
  let dirty = false;
  if (!board.name) board.name = t('boardDefaultName');
  const itemById = new Map(library.items.map(item => [item.id, item]));
  board.widgets = board.widgets.filter(widget => {
    if (widget.type !== 'note' && widget.type !== 'todo') return true;
    const item = itemById.get(widget.ref);
    if (!item || item.deletedAt) { dirty = true; boardTextHeights.delete(widget.id); return false; }
    return true;
  });
  if (dirty) { touchBoard(board); persist(); }
  const cards = [];
  const statics = [];
  const visible = board.widgets.filter(widget => !widget.hidden);
  const order = [...visible].sort((a, b) => a.y - b.y || a.x - b.x);
  const rank = new Map(order.map((widget, index) => [widget.id, index]));
  visible.forEach(widget => {
    if (widget.type === 'note' || widget.type === 'todo') {
      cards.push({ widget, item: itemById.get(widget.ref), x: widget.x, y: widget.y, rowIndex: rank.get(widget.id) || 0 });
    } else statics.push(widget);
  });
  // 隐藏图层不参与渲染，也不算内容边界（总览取景、画布约束都以其为准）。
  return { board, cards, statics, bounds: boardBoundsOf(visible) };
}

function boardViewportSize() {
  const viewport = boardEls?.viewport;
  return viewport ? { w: viewport.clientWidth, h: viewport.clientHeight } : { w: 0, h: 0 };
}

// 相机边界（假无限）：以内容外接矩形为锚，四周各预留约一屏的空白——
// 画布拖起来永远有地方可去，但 rubber-band 在一屏外把它拉回来，不会拖丢。
// 内容小于视口时以居中为锚，同样可以拖出 ± 一屏。
function boardContentBounds() {
  if (!boardLayoutCache) boardLayoutCache = boardLayout();
  const { minX, minY, maxX, maxY } = boardLayoutCache.bounds;
  const { w, h } = boardViewportSize();
  const pad = Math.min(72, Math.max(32, w * 0.1));
  const scale = boardCam.scale;
  const axis = (min, max, view) => {
    const anchor = (view - (min + max) * scale) / 2;
    if ((max - min) * scale <= view - pad) return { min: anchor - view * 0.9, max: anchor + view * 0.9 };
    return { min: pad - max * scale - view * 0.9, max: view - pad - min * scale + view * 0.9 };
  };
  return { x: axis(minX, maxX, w), y: axis(minY, maxY, h) };
}

const boardClampAxis = (value, { min, max }) => Math.min(max, Math.max(min, value));

// 越界量按 rubber-band 曲线折减：拉得越远阻力越大，永远撞不到硬边界。
function boardRubberOffset(overshoot, dimension) {
  const constant = 0.55;
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

function boardSoftScale(value) {
  if (value < BOARD_SCALE_MIN) return BOARD_SCALE_MIN - (BOARD_SCALE_MIN - value) * 0.3;
  if (value > BOARD_SCALE_MAX) return BOARD_SCALE_MAX + (value - BOARD_SCALE_MAX) * 0.3;
  return value;
}

// 拖拽 / 捏合进行中：越界的轴就地折减（写入的是显示值，松手后的惯性从这里继续）。
function boardConstrainDrag() {
  const bounds = boardContentBounds();
  const { w, h } = boardViewportSize();
  const soft = (value, min, max, dimension) => {
    if (value < min) return min - boardRubberOffset(min - value, dimension);
    if (value > max) return max + boardRubberOffset(value - max, dimension);
    return value;
  };
  boardCam.x = soft(boardCam.x, bounds.x.min, bounds.x.max, w);
  boardCam.y = soft(boardCam.y, bounds.y.min, bounds.y.max, h);
}

function boardApplyCamera() {
  if (!boardEls?.world) return;
  if (boardMotion.mode === 'drag' || boardMotion.mode === 'pinch') {
    // 拖拽中的值已在 boardConstrainDrag 折减，这里原样上屏保证 1:1 跟手。
  } else {
    const bounds = boardContentBounds();
    boardCam.x = boardClampAxis(boardCam.x, bounds.x);
    boardCam.y = boardClampAxis(boardCam.y, bounds.y);
  }
  boardEls.world.style.transform = `translate3d(${boardCam.x.toFixed(2)}px, ${boardCam.y.toFixed(2)}px, 0) scale(${boardCam.scale.toFixed(4)})`;
  // 底纹跟着相机走：平移改 background-position，缩放同步间距；
  // 图案与底色由板个性化设置决定（点阵 / 网格线 / 无 + 自选底色）。
  const style = boardLayoutCache?.board?.style || {};
  const base = style.gridSize || 26;
  const grid = base * boardCam.scale;
  boardEls.viewport.style.setProperty('--board-grid', `${grid.toFixed(2)}px`);
  boardEls.viewport.style.setProperty('--board-grid-x', `${(boardCam.x % grid).toFixed(2)}px`);
  boardEls.viewport.style.setProperty('--board-grid-y', `${(boardCam.y % grid).toFixed(2)}px`);
  boardEls.viewport.dataset.pattern = style.pattern || 'dots';
  boardEls.viewport.style.backgroundColor = style.color || '';
  // 底纹颜色：自选色或跟随主题 ink；不透明度 0-60%。
  const gridColor = /^#[0-9a-f]{6}$/i.test(style.gridColor || '') ? style.gridColor : (getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#2b2e29');
  const gridOpacity = Math.max(0, Math.min(60, Number.isFinite(style.gridOpacity) ? style.gridOpacity : 10)) / 100;
  boardEls.viewport.style.setProperty('--board-grid-color', boardHexToRgba(gridColor, gridOpacity));
  if (boardEls.scaleLabel) boardEls.scaleLabel.textContent = `${Math.round(boardCam.scale * 100)}%`;
  boardSyncToolbar();
  boardSyncMultiFrame();
}

function boardEnsureFrame() {
  if (!boardMotion.raf) {
    boardMotion.last = 0;
    boardMotion.raf = requestAnimationFrame(boardFrame);
  }
}

function boardStopMotion() {
  boardMotion.mode = 'idle';
  boardMotion.anchor = null;
  boardMotion.targetScale = boardCam.scale;
  boardMotion.settle = null;
  boardCam.vX = 0;
  boardCam.vY = 0;
  if (boardMotion.raf) {
    cancelAnimationFrame(boardMotion.raf);
    boardMotion.raf = 0;
  }
}

function boardFrame(now) {
  boardMotion.raf = 0;
  if (currentView !== 'board') { boardMotion.mode = 'idle'; return; }
  const dt = boardMotion.last ? Math.min(32, now - boardMotion.last) : 16;
  boardMotion.last = now;
  let active = false;
  // 缩放逼近：目标 scale 与锚点（屏幕坐标）保持不动，世界坐标每帧反推。
  if (boardMotion.anchor && Math.abs(boardMotion.targetScale - boardCam.scale) > 0.0004) {
    const ease = 1 - Math.exp(-dt / 90);
    const previous = boardCam.scale;
    boardCam.scale += (boardMotion.targetScale - boardCam.scale) * ease;
    const worldX = (boardMotion.anchor.x - boardCam.x) / previous;
    const worldY = (boardMotion.anchor.y - boardCam.y) / previous;
    boardCam.x = boardMotion.anchor.x - worldX * boardCam.scale;
    boardCam.y = boardMotion.anchor.y - worldY * boardCam.scale;
    active = true;
  } else if (boardMotion.anchor) {
    boardCam.scale = boardMotion.targetScale;
    boardMotion.anchor = null;
  }
  if (boardMotion.mode === 'settle') {
    const ease = 1 - Math.exp(-dt / 130);
    let targetX;
    let targetY;
    let settleScale = 0;
    if (boardMotion.settle) {
      targetX = boardMotion.settle.x;
      targetY = boardMotion.settle.y;
      settleScale = boardMotion.settle.scale || 0;
    } else {
      const bounds = boardContentBounds();
      targetX = boardClampAxis(boardCam.x, bounds.x);
      targetY = boardClampAxis(boardCam.y, bounds.y);
    }
    // fit：x/y/scale 同步向目标指数趋近（目标位置本就按目标缩放算好，
    // 三轴同频收敛，整场是一次平滑的取景移动而不是手势跟随）。
    boardCam.x += (targetX - boardCam.x) * ease;
    boardCam.y += (targetY - boardCam.y) * ease;
    if (settleScale) boardCam.scale += (settleScale - boardCam.scale) * ease;
    const settled = Math.abs(targetX - boardCam.x) < 0.5
      && Math.abs(targetY - boardCam.y) < 0.5
      && (!settleScale || Math.abs(settleScale - boardCam.scale) < 0.0006);
    if (settled) {
      boardCam.x = targetX;
      boardCam.y = targetY;
      if (settleScale) boardCam.scale = settleScale;
      boardMotion.mode = 'idle';
      boardMotion.settle = null;
    } else active = true;
  }
  boardApplyCamera();
  boardScheduleSync();
  if (active || boardMotion.mode !== 'idle' || boardMotion.anchor) boardEnsureFrame();
  else persistBoardState();
}

function boardScheduleSync() {
  if (boardSyncFrame || !boardEls) return;
  boardSyncFrame = requestAnimationFrame(() => {
    boardSyncFrame = 0;
    boardSyncNodes();
  });
}

function boardVisibleWorldRect() {
  const { w, h } = boardViewportSize();
  const margin = boardRenderMargin();
  return {
    x: -boardCam.x / boardCam.scale - margin,
    y: -boardCam.y / boardCam.scale - margin,
    w: w / boardCam.scale + margin * 2,
    h: h / boardCam.scale + margin * 2
  };
}

// 虚拟化只作用于条目卡片：与可见矩形（外扩 BOARD_MARGIN）做 AABB 相交，
// 按 id 集合增删 DOM；文本与标注常驻（数量少，且编辑状态不能被增删打断）。
// 卡片内容签名：条目数据或显示设置变化时重绘该节点（仅重绘数据，
// 拖动 / 选中 / 悬停状态保持）。
function boardCardSignature(card) {
  const item = card.item || {};
  const widget = card.widget || {};
  const tasks = item.tasks || [];
  return [
    item.title, item.updatedAt, item.body, item.priority, item.completed,
    item.folderId, (item.checkins ? Object.keys(item.checkins).join(',') : ''),
    tasks.map(task => `${task.done ? 1 : 0}:${task.text}`).join('\u0001'),
    JSON.stringify(widget.show || {}), widget.opacity, widget.w, widget.h,
    (item.linkedIds || []).join(',')
  ].join('\u0002');
}

function boardSyncNodes() {
  if (!boardEls?.world || !boardLayoutCache) return;
  const rect = boardVisibleWorldRect();
  const visibleIds = new Set();
  boardLayoutCache.cards.forEach(card => {
    const size = boardWidgetSize(card.widget);
    if (card.x + size.w < rect.x || card.x > rect.x + rect.w) return;
    if (card.y + size.h < rect.y || card.y > rect.y + rect.h) return;
    visibleIds.add(card.widget.id);
  });
  for (const [id, element] of boardRenderedCards) {
    if (!visibleIds.has(id)) {
      element.remove();
      boardRenderedCards.delete(id);
    }
  }
  boardLayoutCache.cards.forEach(card => {
    if (!visibleIds.has(card.widget.id)) return;
    const existing = boardRenderedCards.get(card.widget.id);
    if (existing) {
      // 内容变化（标题 / 正文 / 子待办 / 显示设置等）时重绘：不清缓存、不动
      // 选中态，拖拽中的卡片跳过以免打断手势。
      const signature = boardCardSignature(card);
      if (existing.dataset.signature === signature || existing.classList.contains('is-dragging') || existing.classList.contains('is-resizing')) return;
      const template = document.createElement('template');
      template.innerHTML = boardNodeHTML(card, true);
      const next = template.content.firstElementChild;
      if (!next) return;
      next.dataset.signature = signature;
      next.classList.toggle('active', existing.classList.contains('active'));
      next.classList.toggle('selected', existing.classList.contains('selected'));
      existing.replaceWith(next);
      boardRenderedCards.set(card.widget.id, next);
      return;
    }
    const template = document.createElement('template');
    template.innerHTML = boardNodeHTML(card);
    const element = template.content.firstElementChild;
    if (element) {
      element.dataset.signature = boardCardSignature(card);
      boardEls.world.appendChild(element);
      boardRenderedCards.set(card.widget.id, element);
    }
  });
  boardSyncLinks();
  boardSyncMultiFrame();
}

// —— 关联曲线：板上互相关联（linkedIds）的条目之间画一根跟随的贝塞尔曲线 ——
// 曲线层铺在画布最底（列标注之下、卡片之下），卡片拖动时按 rAF 频率重算，
// 两端始终咬合两张卡片的中心，随时移动随时相连。
function boardSyncLinks() {
  if (!boardEls?.world || !boardLayoutCache) return;
  if (!boardState.prefs.linkCurves) {
    $('.board-links', boardEls.world)?.remove();
    return;
  }
  const byRef = new Map(boardLayoutCache.cards.map(card => [card.item.id, card]));
  const seen = new Set();
  const pairs = [];
  boardLayoutCache.cards.forEach(card => {
    (card.item.linkedIds || []).forEach(ref => {
      const other = byRef.get(ref);
      if (!other || other === card) return;
      const key = [card.item.id, ref].sort().join('~');
      if (seen.has(key)) return;
      seen.add(key);
      pairs.push([card, other]);
    });
  });
  let svg = $('.board-links', boardEls.world);
  if (!pairs.length) {
    svg?.remove();
    return;
  }
  const { minX, minY, maxX, maxY } = boardLayoutCache.bounds;
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const paths = pairs.map(([a, b]) => {
    const aSize = boardWidgetSize(a.widget);
    const bSize = boardWidgetSize(b.widget);
    // 读组件实时坐标：拖动中坐标直接写在 widget 上，曲线才能跟手。
    const ax = a.widget.x + aSize.w / 2;
    const ay = a.widget.y + aSize.h / 2;
    const bx = b.widget.x + bSize.w / 2;
    const by = b.widget.y + bSize.h / 2;
    const dx = bx - ax;
    const dy = by - ay;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const bend = Math.max(Math.abs(horizontal ? dx : dy) * 0.35, 34);
    const signX = Math.sign(dx) || 1;
    const signY = Math.sign(dy) || 1;
    const c1x = ax + (horizontal ? signX * bend : 0);
    const c1y = ay + (horizontal ? 0 : signY * bend);
    const c2x = bx - (horizontal ? signX * bend : 0);
    const c2y = by - (horizontal ? 0 : signY * bend);
    return `<path d="M${ax.toFixed(1)} ${ay.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}"/>`;
  }).join('');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('board-links');
    svg.setAttribute('aria-hidden', 'true');
    boardEls.world.prepend(svg);
  }
  svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
  svg.style.left = `${minX}px`;
  svg.style.top = `${minY}px`;
  svg.style.width = `${width}px`;
  svg.style.height = `${height}px`;
  svg.innerHTML = paths;
}

function boardNodeCheckinBadge(item) {
  if (!item.checkin) return '';
  const checkins = item.checkins || {};
  const on = Boolean(checkins[todayISO()]);
  return `<span class="checkin-badge${on ? ' on' : ''}"><svg><use href="#i-check"/></svg>${escapeHTML(on ? t('checkinDone') : t('checkinTodoYet'))}</span>`;
}

function boardNodeHTML(card, silent) {
  const item = card.item;
  const done = item.type === 'todo' && isTodoComplete(item);
  const folder = getFolder(item.folderId);
  const tasks = item.type === 'todo' ? (item.tasks || []) : [];
  const completedCount = tasks.filter(task => task.done).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : (done ? 100 : 0);
  const stampDate = item.type === 'todo' ? todoScheduleDate(item) : item.updatedAt;
  const stamp = stampDate ? `<time datetime="${escapeHTML(stampDate)}">${escapeHTML(formatDate(stampDate, true))}</time>` : '';
  const delay = boardEnterAnimated && !silent ? Math.min(card.rowIndex * 16, 360) : 0;
  // 首次进入按序级联落位；滚动中新增的卡片只做短淡入。
  const motion = delay ? ' data-enter="1"' : (!silent ? ' data-new="1"' : '');
  const widget = card.widget;
  const show = widget.show || {};
  const opacity = Number.isFinite(widget.opacity) ? Math.min(100, Math.max(30, widget.opacity)) : 100;
  // 区块始终渲染、由 hidden 承载「显示内容」开关：切换开关时只改 hidden 不重建
  // 节点——重建会让悬停位移与层叠顺序跳动，卡片看起来像突然挪了位置。
  const topParts = [
    `<span class="type-pill ${item.type}"${show.pill === false ? ' hidden' : ''}><svg><use href="#i-${item.type === 'todo' ? 'check' : 'note'}"/></svg>${t(item.type)}</span>`,
    item.type === 'todo' ? `<span class="priority-pill ${item.priority || 'medium'}"${show.priority === false ? ' hidden' : ''}>${t(item.priority || 'medium')}</span>` : '',
    stamp ? stamp.replace('<time ', `<time${show.date === false ? ' hidden' : ''} `) : ''
  ].join('');
  const topRow = `<div class="board-node-top">${topParts}</div>`;
  // 子待办行：可选择只看已完成的（复盘 / 验收场景）。
  const shownTasks = show.tasksDoneOnly === true ? tasks.filter(task => task.done) : tasks;
  const tasksBlock = item.type === 'todo' && tasks.length
    ? `<div class="board-node-tasks"${show.tasks === true ? '' : ' hidden'}>${shownTasks.map(task => `<span class="board-node-task${task.done ? ' is-done' : ''}"><i><svg><use href="#i-check"/></svg></i><span>${escapeHTML(task.text)}</span></span>`).join('')}</div>`
    : '';
  // 笔记的完整内容：Markdown 渲染后的正文直接呈现（与编辑器同一净化管线）。
  // 区块常驻渲染、由 hidden 承载开关——切换时无需重建节点；超高在卡片内滚动。
  const bodyBlock = item.type === 'note' && item.body
    ? `<div class="board-node-body"${show.body === true ? '' : ' hidden'}>${item.body}</div>`
    : '';
  return `<button type="button" class="board-node ${item.type} priority-${item.type === 'todo' ? (item.priority || 'medium') : 'none'}${done ? ' is-done' : ''}${item.id === selectedId ? ' active' : ''}" data-id="${escapeHTML(item.id)}" data-widget-id="${escapeHTML(card.widget.id)}" data-board-node="${escapeHTML(item.id)}"${motion} style="left:${card.x}px;top:${card.y}px;width:${card.widget.w || 264}px;height:${card.widget.h || 114}px;opacity:${(opacity / 100).toFixed(2)};${delay ? `--board-d:${delay}ms;` : ''}" aria-label="${escapeHTML(item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote')))}">
    ${BOARD_RESIZE_DIRS.map(dir => `<i class="board-handle is-resize" data-widget-handle="${dir}" data-dir="${dir}" aria-hidden="true"></i>`).join('')}
    <span class="board-node-remove" data-widget-remove="${escapeHTML(card.widget.id)}" role="button" title="${escapeHTML(t('boardRemoveWidget'))}" aria-label="${escapeHTML(t('boardRemoveWidget'))}"><svg><use href="#i-close"/></svg></span>
    ${topRow}
    <b class="board-node-title">${escapeHTML(item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote')))}</b>
    ${tasksBlock}
    ${bodyBlock}
    <p class="board-node-preview"${show.body === true || show.preview === false ? ' hidden' : ''}>${escapeHTML(itemPreview(item))}</p>
    <div class="board-node-foot"${show.foot === false ? ' hidden' : ''}><span class="mini-folder"><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span>${item.type === 'todo' ? (item.checkin ? boardNodeCheckinBadge(item) : (!done && tasks.length ? `<span class="board-node-count"${show.tasks === true ? ' hidden' : ''}>${completedCount}/${tasks.length}</span><span class="mini-progress"${show.tasks === true ? ' hidden' : ''}><i style="width:${progress}%"></i></span>` : '')) : (getLinkedItems(item).length ? `<span class="link-count"><svg><use href="#i-link"/></svg>${getLinkedItems(item).length}</span>` : '')}</div>
  </button>`;
}

// 「显示内容」开关切换：只改现有节点各区块的 hidden，不重建节点，
// 悬停态、层叠顺序与位置保持原样。
function boardApplyShownContent(node, widget) {
  if (!node || (widget.type !== 'note' && widget.type !== 'todo')) return;
  const show = widget.show || {};
  const top = node.querySelector('.board-node-top');
  if (top) {
    const pill = top.querySelector('.type-pill');
    const priority = top.querySelector('.priority-pill');
    const date = top.querySelector('time');
    if (pill) pill.hidden = show.pill === false;
    if (priority) priority.hidden = show.priority === false;
    if (date) date.hidden = show.date === false;
    const parts = [...top.children];
    top.hidden = parts.length === 0 || parts.every(el => el.hidden);
  }
  const tasks = node.querySelector('.board-node-tasks');
  if (tasks) tasks.hidden = show.tasks !== true;
  const body = node.querySelector('.board-node-body');
  if (body) body.hidden = show.body !== true;
  const preview = node.querySelector('.board-node-preview');
  if (preview) preview.hidden = show.body === true || show.preview === false;
  const count = node.querySelector('.board-node-count');
  if (count) count.hidden = show.tasks === true;
  const progress = node.querySelector('.mini-progress');
  if (progress) progress.hidden = show.tasks === true;
  const foot = node.querySelector('.board-node-foot');
  if (foot) foot.hidden = show.foot === false;
}

// —— 标注绘制：形状由（可能为负的）端点向量描述，渲染时归一为外接矩形；
// 线段一律以归一后的容器原点为参考，斜向时也精确贴合。 ——
// 箭头端帽：形状随线条粗细缩放。返回 { trim, svg }——trim 是线体为端帽
// 让出的长度（从端点向内收），svg 是该端的图形片段。angle 指向线体延伸方向。
function boardArrowCapSVG(kind, x, y, angle, stroke, strokeWidth) {
  if (kind === 'dot') {
    const r = Math.max(2.5, strokeWidth * 1.3 + 0.8);
    return { trim: r * 0.5, svg: `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${stroke}" stroke="none"/>` };
  }
  if (kind === 'bar') {
    const size = Math.max(7, strokeWidth * 2.8);
    const px = Math.cos(angle + Math.PI / 2) * size / 2;
    const py = Math.sin(angle + Math.PI / 2) * size / 2;
    return { trim: strokeWidth / 2, svg: `<path d="M${(x - px).toFixed(1)} ${(y - py).toFixed(1)} L${(x + px).toFixed(1)} ${(y + py).toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth.toFixed(1)}" stroke-linecap="round"/>` };
  }
  if (kind === 'arrow') {
    const head = Math.max(10, strokeWidth * 3.4);
    const wing = head * 0.5;
    const leftX = x - head * Math.cos(angle) + wing * Math.sin(angle);
    const leftY = y - head * Math.sin(angle) - wing * Math.cos(angle);
    const rightX = x - head * Math.cos(angle) - wing * Math.sin(angle);
    const rightY = y - head * Math.sin(angle) + wing * Math.cos(angle);
    return { trim: head * 0.55, svg: `<path d="M${leftX.toFixed(1)} ${leftY.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)} L${rightX.toFixed(1)} ${rightY.toFixed(1)} Z" fill="${stroke}" stroke="none"/>` };
  }
  return { trim: 0, svg: '' };
}

function boardMarkerSVG(widget, originLeft = 0, originTop = 0, live = false) {
  const stroke = live ? 'currentColor' : 'var(--board-marker-color, currentColor)';
  if (widget.kind === 'draw') {
    const points = widget.points || [];
    let path = '';
    for (let i = 0; i + 1 < points.length; i += 2) {
      path += `${i === 0 ? 'M' : 'L'}${points[i].toFixed(1)} ${points[i + 1].toFixed(1)} `;
    }
    const highlighter = widget.brush === 'highlighter';
    const strokeWidth = widget.stroke || 2.5;
    const opacity = highlighter ? Math.min(0.5, (widget.opacity ?? 35) / 100) : (widget.opacity ?? 100) / 100;
    const flow = widget.flow ?? 100;
    // 流量 < 100 用点状虚线近似出墨密度（低流量笔迹断续变浅）。
    const dash = flow < 100 ? ` stroke-dasharray="${Math.max(0.4, flow / 14).toFixed(2)} ${Math.max(0.5, (100 - flow) / 12).toFixed(2)}"` : '';
    const blend = highlighter ? ' style="mix-blend-mode:multiply"' : '';
    // 笔触尖端：round / butt / square；荧光笔默认平头才有荧光笔观感。
    const cap = widget.cap || (highlighter ? 'butt' : 'round');
    return `<svg class="board-marker-svg" width="100%" height="100%" overflow="visible"${blend}><path d="${path.trim()}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-opacity="${opacity.toFixed(3)}"${dash} stroke-linecap="${cap}" stroke-linejoin="round"/></svg>`;
  }
  const strokeWidth = widget.stroke || 2.5;
  const x1 = widget.x - originLeft;
  const y1 = widget.y - originTop;
  const x2 = widget.x + widget.w - originLeft;
  const y2 = widget.y + widget.h - originTop;
  if (widget.kind === 'rect') {
    return `<svg class="board-marker-svg" width="100%" height="100%" overflow="visible"><rect x="${Math.min(x1, x2)}" y="${Math.min(y1, y2)}" width="${Math.abs(x2 - x1)}" height="${Math.abs(y2 - y1)}" rx="10" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
  }
  if (widget.kind === 'ellipse') {
    const fillOpacity = (widget.fillOpacity ?? 100) / 100;
    const strokeOpacity = (widget.strokeOpacity ?? 100) / 100;
    const fill = widget.fill && widget.fill !== 'none' ? widget.fill : 'none';
    // 填充必须走内联 style：样式表里 .board-marker-svg ellipse { fill:none }
    // 会压过 SVG 的 fill 属性（presentation attribute 优先级最低）。
    const fillAttr = fill === 'none' ? 'fill="none"' : `style="fill:${fill};fill-opacity:${fillOpacity.toFixed(3)}"`;
    return `<svg class="board-marker-svg" width="100%" height="100%" overflow="visible"><ellipse cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" rx="${Math.abs(x2 - x1) / 2}" ry="${Math.abs(y2 - y1) / 2}" ${fillAttr} stroke="${stroke}" stroke-opacity="${strokeOpacity.toFixed(3)}" stroke-width="${strokeWidth}"/></svg>`;
  }
  if (widget.kind === 'line') {
    return `<svg class="board-marker-svg" width="100%" height="100%" overflow="visible"><path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/></svg>`;
  }
  // 箭头：两端均可选端帽（前端 = 终点，末端 = 起点），线体两端各为本端帽让位。
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headCap = boardArrowCapSVG(widget.head || 'arrow', x2, y2, angle, stroke, strokeWidth);
  const tailCap = boardArrowCapSVG(widget.tail || 'none', x1, y1, angle + Math.PI, stroke, strokeWidth);
  const fromX = x1 + tailCap.trim * Math.cos(angle);
  const fromY = y1 + tailCap.trim * Math.sin(angle);
  const usable = Math.max(Math.hypot(x2 - x1, y2 - y1) - headCap.trim - tailCap.trim, 0);
  const toX = fromX + usable * Math.cos(angle);
  const toY = fromY + usable * Math.sin(angle);
  return `<svg class="board-marker-svg" width="100%" height="100%" overflow="visible"><path d="M${fromX.toFixed(1)} ${fromY.toFixed(1)} L${toX.toFixed(1)} ${toY.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>${tailCap.svg}${headCap.svg}</svg>`;
}

function boardStaticHTML(widget) {
  const selected = boardSelection.has(widget.id) ? ' selected' : '';
  if (widget.type === 'text') {
    const family = widget.font === 'custom'
      ? (widget.customFont || '')
      : (BOARD_TEXT_FAMILIES[widget.font] || '');
    const body = widget.text
      ? escapeHTML(widget.text).replace(/\n/g, '<br>')
      : `<span class="board-text-placeholder">${escapeHTML(t('boardTextPlaceholder'))}</span>`;
    const background = widget.bg !== 'none'
      ? `background:color-mix(in srgb, ${widget.bg} ${widget.bgOpacity}%, transparent);`
      : '';
    return `<div class="board-widget board-text${selected}" data-widget-id="${escapeHTML(widget.id)}" data-board-static spellcheck="false" style="left:${widget.x}px;top:${widget.y}px;width:${widget.w}px;font-size:${widget.size}px;${family ? `font-family:${family};` : ''}${widget.bold ? 'font-weight:700;' : ''}${widget.italic ? 'font-style:italic;' : ''}text-align:${widget.align};${widget.color ? `color:${widget.color};` : ''}${background}border-radius:${widget.radius}px;padding:${widget.pad}px;">${body}<i class="board-handle is-resize" data-widget-handle="resize" aria-hidden="true"></i></div>`;
  }
  // 画笔：容器取点集包络，笔迹按包络原点平移绘制。
  if (widget.kind === 'draw') {
    const points = widget.points || [];
    let minX = 0;
    let minY = 0;
    let maxX = 1;
    let maxY = 1;
    for (let i = 0; i + 1 < points.length; i += 2) {
      if (i === 0 || points[i] < minX) minX = points[i];
      if (i === 0 || points[i + 1] < minY) minY = points[i + 1];
      if (points[i] > maxX) maxX = points[i];
      if (points[i + 1] > maxY) maxY = points[i + 1];
    }
    const shifted = { ...widget, points: points.map((value, index) => value - (index % 2 === 0 ? minX : minY)) };
    return `<div class="board-widget board-marker kind-draw${selected}" data-widget-id="${escapeHTML(widget.id)}" data-board-static style="left:${widget.x + minX}px;top:${widget.y + minY}px;width:${Math.max(maxX - minX, 1)}px;height:${Math.max(maxY - minY, 1)}px;--board-marker-color:${widget.color};">
      ${boardMarkerSVG(shifted)}
    </div>`;
  }
  const left = Math.min(widget.x, widget.x + widget.w);
  const top = Math.min(widget.y, widget.y + widget.h);
  const width = Math.max(Math.abs(widget.w), 1);
  const height = Math.max(Math.abs(widget.h), 1);
  const startX = ((widget.x - left) / width) * 100;
  const startY = ((widget.y - top) / height) * 100;
  const endX = ((widget.x + widget.w - left) / width) * 100;
  const endY = ((widget.y + widget.h - top) / height) * 100;
  return `<div class="board-widget board-marker kind-${widget.kind}${selected}" data-widget-id="${escapeHTML(widget.id)}" data-board-static style="left:${left}px;top:${top}px;width:${width}px;height:${height}px;--board-marker-color:${widget.color};">
    ${boardMarkerSVG(widget, left, top)}
    <i class="board-handle" data-widget-handle="start" style="left:${startX}%;top:${startY}%;" aria-hidden="true"></i>
    <i class="board-handle" data-widget-handle="end" style="left:${endX}%;top:${endY}%;" aria-hidden="true"></i>
  </div>`;
}

// 常驻组件（文本 / 标注）整体重建：marker 先铺底，text 居中，卡片最后（虚拟化 append）。
function boardRenderStatics() {
  if (!boardEls?.world || !boardLayoutCache) return;
  const markers = boardLayoutCache.statics.filter(widget => widget.type === 'marker');
  const texts = boardLayoutCache.statics.filter(widget => widget.type === 'text');
  let html = markers.map(boardStaticHTML).join('');
  html += texts.map(boardStaticHTML).join('');
  boardEls.world.insertAdjacentHTML('afterbegin', html);
  boardMeasureTexts();
}

// 单个组件局部重渲染（工具条改样式 / 端点拖完落定），不打断其他组件。
function boardRefreshStatic(widget) {
  if (!boardEls?.world) return;
  const element = $(`[data-widget-id="${CSS.escape(widget.id)}"]`, boardEls.world);
  const template = document.createElement('template');
  template.innerHTML = boardStaticHTML(widget);
  const next = template.content.firstElementChild;
  if (element && next) element.replaceWith(next);
  else if (next) boardEls.world.appendChild(next);
  if (widget.type === 'text') boardMeasureText(widget);
}

function boardMeasureText(widget) {
  const element = $(`[data-widget-id="${CSS.escape(widget.id)}"]`, boardEls?.world || document);
  if (!element) return;
  boardTextHeights.set(widget.id, Math.max(24, element.scrollHeight));
}

function boardMeasureTexts() {
  boardLayoutCache?.statics.forEach(widget => {
    if (widget.type === 'text') boardMeasureText(widget);
  });
}

function renderBoardShell() {
  return `<div class="board-canvas" id="boardCanvas">
    <div class="board-viewport" id="boardViewport">
      <div class="board-world" id="boardWorld"></div>
      <div class="board-marquee" id="boardMarquee" hidden></div>
      <div class="board-multi-frame" id="boardMultiFrame" hidden aria-hidden="true">
        ${BOARD_RESIZE_DIRS.map(dir => `<i class="board-handle is-resize" data-multi-handle="${dir}" data-dir="${dir}"></i>`).join('')}
      </div>
      <div class="board-empty" id="boardEmpty" hidden><div><span><svg><use href="#i-board"/></svg></span><h3>${escapeHTML(t('boardEmptyTitle'))}</h3><p>${escapeHTML(t('boardEmptyHint'))}</p></div></div>
    </div>
    <div class="board-chrome" id="boardChrome">
      <button type="button" class="board-tool" id="boardAddText" title="${escapeHTML(t('boardAddText'))}"><svg><use href="#i-text"/></svg><span>${escapeHTML(t('boardAddText'))}</span></button>
      <div class="board-tool-wrap">
        <button type="button" class="board-tool" id="boardAddMarker" title="${escapeHTML(t('boardAddMarker'))}"><svg><use href="#i-marker"/></svg><span>${escapeHTML(t('boardAddMarker'))}</span></button>
      </div>
      <button type="button" class="board-tool" id="boardAddImport" title="${escapeHTML(t('boardAddItems'))}"><svg><use href="#i-plus"/></svg><span>${escapeHTML(t('boardAddItems'))}</span></button>
      <span class="board-chrome-sep" aria-hidden="true"></span>
      <button type="button" class="board-zoom-button" id="boardUndo" title="${escapeHTML(t('boardUndo'))}" aria-label="${escapeHTML(t('boardUndo'))}" disabled><svg><use href="#i-undo"/></svg></button>
      <button type="button" class="board-zoom-button" id="boardRedo" title="${escapeHTML(t('boardRedo'))}" aria-label="${escapeHTML(t('boardRedo'))}" disabled><svg><use href="#i-redo"/></svg></button>
      <div class="board-zoom">
        <button type="button" class="board-zoom-button" id="boardZoomOut" title="${escapeHTML(t('boardZoomOut'))}" aria-label="${escapeHTML(t('boardZoomOut'))}"><svg><use href="#i-window-minimize"/></svg></button>
        <span class="board-zoom-level" id="boardZoomLevel" aria-live="off">100%</span>
        <button type="button" class="board-zoom-button" id="boardZoomIn" title="${escapeHTML(t('boardZoomIn'))}" aria-label="${escapeHTML(t('boardZoomIn'))}"><svg><use href="#i-plus"/></svg></button>
        <button type="button" class="board-zoom-button" id="boardFit" title="${escapeHTML(t('boardFitView'))}" aria-label="${escapeHTML(t('boardFitView'))}"><svg><use href="#i-focus"/></svg></button>
      </div>
    </div>
    <div class="board-marker-menu" id="boardMarkerMenu" role="menu" hidden>
      <button type="button" data-board-marker="arrow"><svg><use href="#i-marker"/></svg>${escapeHTML(t('boardMarkerArrow'))}</button>
      <button type="button" data-board-marker="rect"><svg><use href="#i-window-maximize"/></svg>${escapeHTML(t('boardMarkerRect'))}</button>
      <button type="button" data-board-marker="ellipse"><svg><use href="#i-radar"/></svg>${escapeHTML(t('boardMarkerEllipse'))}</button>
      <button type="button" data-board-marker="line"><svg><use href="#i-divider"/></svg>${escapeHTML(t('boardMarkerLine'))}</button>
      <button type="button" data-board-marker="draw"><svg><use href="#i-edit"/></svg>${escapeHTML(t('boardMarkerDraw'))}</button>
    </div>
    <div class="board-widget-toolbar" id="boardWidgetToolbar" hidden></div>
    <div class="board-pen-bar" id="boardPenBar" hidden></div>
  </div>`;
}

function boardFitView(instant = false) {
  const layout = boardLayoutCache || (boardLayoutCache = boardLayout());
  const { minX, minY, maxX, maxY } = layout.bounds;
  const { w, h } = boardViewportSize();
  const pad = Math.min(72, Math.max(32, w * 0.1));
  const scale = Math.min(Math.max((w - 48) / (maxX - minX), BOARD_SCALE_MIN), 1);
  // 取景目标与边界规则同构：内容整体居中；内容高于视口时顶缘贴 pad 线。
  const target = {
    scale,
    x: (w - (minX + maxX) * scale) / 2,
    y: (maxY - minY) * scale >= h - pad ? pad - minY * scale : (h - (minY + maxY) * scale) / 2
  };
  if (instant || reduceWindowMotion()) {
    boardCam.x = target.x;
    boardCam.y = target.y;
    boardCam.scale = target.scale;
    boardApplyCamera();
    boardScheduleSync();
    persistBoardState();
    return;
  }
  boardMotion.anchor = null;
  boardMotion.targetScale = target.scale;
  boardCam.vX = 0;
  boardCam.vY = 0;
  boardMotion.mode = 'settle';
  boardMotion.settle = { x: target.x, y: target.y, scale: target.scale };
  boardEnsureFrame();
}

// 滚轮 / 缩放按钮：目标 scale 累积，动画帧里向目标平滑逼近（临界阻尼节奏）。
function boardZoomAt(screenX, screenY, factor) {
  const base = boardMotion.anchor ? boardMotion.targetScale : boardCam.scale;
  boardMotion.targetScale = Math.min(BOARD_SCALE_MAX, Math.max(BOARD_SCALE_MIN, base * factor));
  boardMotion.anchor = { x: screenX, y: screenY };
  if (boardMotion.mode === 'idle' || boardMotion.mode === 'settle') boardMotion.mode = 'settle';
  boardMotion.settle = null;
  boardEnsureFrame();
  persistBoardState();
}

// 选中即右侧编辑器：桌面展开三栏、移动端全屏编辑器；点空白或 Esc 收回。
function boardSelect(id) {
  const item = library.items.find(entry => entry.id === id && !isTrashed(entry));
  if (!item) return;
  if (!selectedId || !boardCamRestore) {
    boardCamRestore = { x: boardCam.x, y: boardCam.y, scale: boardCam.scale };
    boardCamManual = false;
  }
  selectedId = id;
  mobileEditorOpen = true;
  renderEditor();
  boardMarkActive(id);
  boardFocusSelection();
}

function boardDeselect() {
  selectedId = null;
  mobileEditorOpen = false;
  renderEditor();
  boardMarkActive(null);
  // 面板收起：画布平滑归位到打开面板前的取景；
  // 打开期间用户手动平移 / 缩放过画布则保持新位置，不强行拉回。
  const restore = boardCamRestore;
  boardCamRestore = null;
  if (!restore || boardCamManual || matchMedia('(max-width: 800px)').matches) return;
  if (Math.abs(restore.scale - boardCam.scale) < 0.001
    && Math.abs(restore.x - boardCam.x) < 1 && Math.abs(restore.y - boardCam.y) < 1) return;
  boardCam.vX = 0;
  boardCam.vY = 0;
  boardMotion.anchor = null;
  boardMotion.mode = 'settle';
  boardMotion.settle = { x: restore.x, y: restore.y, scale: restore.scale };
  boardEnsureFrame();
}

function boardMarkActive(id) {
  boardRenderedCards.forEach(element => element.classList.toggle('active', element.dataset.id === id));
}

// —— 组件选中与浮动工具条（文本 / 标注；条目组件的「工具」即右侧编辑器） ——
function boardSetSelection(ids) {
  boardSelection.clear();
  ids.forEach(id => boardSelection.add(id));
  if (boardEls?.world) {
    $$('[data-board-static]', boardEls.world).forEach(element => {
      element.classList.toggle('selected', boardSelection.has(element.dataset.widgetId));
    });
    boardRenderedCards.forEach((element, widgetId) => element.classList.toggle('selected', boardSelection.has(widgetId)));
  }
  // 多选时调节点收敛到整体外接框（八向），单组件自身的调节点隐藏。
  boardEls?.canvas.classList.toggle('has-multi', boardSelection.size > 1);
  boardRenderToolbar();
  boardSyncMultiFrame();
  boardSyncLayerPop();
}

// 多选整体外接矩形（世界坐标）：框选 / 图层点选组合后的统一缩放基准。
function boardMultiSelectionBounds() {
  if (boardSelection.size < 2) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const id of boardSelection) {
    const widget = boardWidgetById(id);
    if (!widget) continue;
    const size = boardWidgetSize(widget);
    const left = Math.min(widget.x, widget.x + widget.w);
    const top = Math.min(widget.y, widget.y + widget.h);
    minX = Math.min(minX, left);
    minY = Math.min(minY, top);
    maxX = Math.max(maxX, left + size.w);
    maxY = Math.max(maxY, top + size.h);
  }
  if (!Number.isFinite(minX)) return null;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

// 多选外接框：屏幕层（与框选矩形同级），调节点大小不随画布缩放；
// 相机移动与组件拖动时由 boardApplyCamera / boardSyncNodes 顺带刷新。
function boardSyncMultiFrame() {
  const frame = $('#boardMultiFrame', boardEls?.canvas || document);
  if (!frame) return;
  const bounds = boardMultiSelectionBounds();
  if (!bounds) { frame.hidden = true; return; }
  const scale = boardCam.scale;
  frame.hidden = false;
  frame.style.left = `${bounds.x * scale + boardCam.x}px`;
  frame.style.top = `${bounds.y * scale + boardCam.y}px`;
  frame.style.width = `${bounds.w * scale}px`;
  frame.style.height = `${bounds.h * scale}px`;
}

function boardWidgetById(id) {
  return boardLayoutCache?.board.widgets.find(widget => widget.id === id) || null;
}

// 浮动编辑面板（桌面端）：宽度可拖、向左投影；面板出现 / 收起为非线性滑入滑出。
function boardEditorWidth() {
  const live = Number.parseInt(document.documentElement.style.getPropertyValue('--board-editor-w'), 10);
  if (Number.isFinite(live) && live >= 340) return Math.min(760, live);
  return boardState.editorWidth;
}

let boardEditorResizer = null;
let boardEditorClose = null;
function boardEnsureEditorChrome() {
  if (boardEditorResizer && document.contains(boardEditorResizer)) return;
  const workspace = $('main.workspace');
  if (!workspace) return;
  boardEditorResizer = document.createElement('div');
  boardEditorResizer.className = 'board-editor-resizer';
  boardEditorResizer.id = 'boardEditorResizer';
  boardEditorResizer.setAttribute('role', 'separator');
  boardEditorResizer.setAttribute('aria-orientation', 'vertical');
  workspace.appendChild(boardEditorResizer);
  let drag = null;
  boardEditorResizer.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    try { boardEditorResizer.setPointerCapture(event.pointerId); } catch { /* 合成指针无捕获 */ }
    drag = true;
    boardEditorResizer.classList.add('is-dragging');
  });
  boardEditorResizer.addEventListener('pointermove', event => {
    if (!drag) return;
    const rect = workspace.getBoundingClientRect();
    const width = Math.min(760, Math.max(340, Math.round(rect.right - event.clientX)));
    document.documentElement.style.setProperty('--board-editor-w', `${width}px`);
    boardFocusSelection();
  });
  const finish = () => {
    if (!drag) return;
    drag = null;
    boardEditorResizer.classList.remove('is-dragging');
    boardState.editorWidth = boardEditorWidth();
    persistBoardState();
  };
  boardEditorResizer.addEventListener('pointerup', finish);
  boardEditorResizer.addEventListener('pointercancel', finish);
  // 面板关闭按钮：浮动在面板左上角内侧，点击收起面板（与点空白等效）。
  if (!boardEditorClose || !document.contains(boardEditorClose)) {
    boardEditorClose = document.createElement('button');
    boardEditorClose.type = 'button';
    boardEditorClose.className = 'board-editor-close';
    boardEditorClose.id = 'boardEditorClose';
    boardEditorClose.title = t('cancel');
    boardEditorClose.setAttribute('aria-label', t('cancel'));
    boardEditorClose.innerHTML = '<svg><use href="#i-close"/></svg>';
    boardEditorClose.addEventListener('click', () => boardDeselect());
    workspace.appendChild(boardEditorClose);
  }
}

// 面板打开 / 拖宽时，把选中的卡片或组件平滑带到面板左侧的可见区中心。
function boardFocusSelection() {
  if (!boardLayoutCache || matchMedia('(max-width: 800px)').matches) return;
  let target = null;
  const card = boardLayoutCache.cards.find(entry => entry.item.id === selectedId);
  if (card) {
    const size = boardWidgetSize(card.widget);
    target = { x: card.widget.x + size.w / 2, y: card.widget.y + size.h / 2 };
  }
  if (!target && boardSelection.size === 1) {
    const widget = boardWidgetById([...boardSelection][0]);
    if (widget) {
      const width = widget.type === 'text' ? widget.w : Math.max(Math.abs(widget.w), 40);
      target = { x: widget.x + width / 2, y: widget.y + (widget.type === 'text' ? 26 : Math.abs(widget.h) / 2) };
    }
  }
  if (!target) return;
  const { w, h } = boardViewportSize();
  const visible = Math.max(200, w - boardEditorWidth() - 24);
  const bounds = boardContentBounds();
  boardCam.vX = 0;
  boardCam.vY = 0;
  boardMotion.anchor = null;
  boardMotion.mode = 'settle';
  boardMotion.settle = {
    x: boardClampAxis(visible / 2 - target.x * boardCam.scale, bounds.x),
    y: boardClampAxis(h / 2 - target.y * boardCam.scale, bounds.y)
  };
  boardEnsureFrame();
}

const BOARD_ALIGN_ICONS = {
  left: '<svg viewBox="0 0 24 24" class="board-align-icon"><path d="M4 6h16M4 12h10M4 18h13"/></svg>',
  center: '<svg viewBox="0 0 24 24" class="board-align-icon"><path d="M4 6h16M7 12h10M5.5 18h13"/></svg>',
  right: '<svg viewBox="0 0 24 24" class="board-align-icon"><path d="M4 6h16M10 12h10M7 18h13"/></svg>'
};
const BOARD_ALIGN_ORDER = ['left', 'center', 'right'];
const BOARD_ALIGN_HINT = { left: 'boardAlignLeft', center: 'boardAlignCenter', right: 'boardAlignRight' };

function boardRenderToolbar() {
  const bar = boardEls?.toolbar;
  if (!bar) return;
  if (boardSelection.size === 1) {
    const widget = boardWidgetById([...boardSelection][0]);
    if (widget?.type === 'text') {
      const alignNext = BOARD_ALIGN_ORDER[(BOARD_ALIGN_ORDER.indexOf(widget.align) + 1) % 3];
      bar.innerHTML = `
        <button type="button" class="board-tw" data-tw="size-down" title="${escapeHTML(t('boardFontSize'))}">−</button>
        <input class="board-tw-size-input" data-tw="size-set" type="number" min="11" max="48" step="1" value="${widget.size}" aria-label="${escapeHTML(t('boardFontSize'))}"/>
        <button type="button" class="board-tw" data-tw="size-up" title="${escapeHTML(t('boardFontSize'))}">＋</button>
        <label class="board-tw-font"><select data-tw="font" aria-label="${escapeHTML(t('boardFontLabel'))}">
          <option value="app"${widget.font === 'app' ? ' selected' : ''}>${escapeHTML(t('boardFontApp'))}</option>
          <option value="serif"${widget.font === 'serif' ? ' selected' : ''}>${escapeHTML(t('boardFontSerif'))}</option>
          <option value="rounded"${widget.font === 'rounded' ? ' selected' : ''}>${escapeHTML(t('boardFontRounded'))}</option>
          <option value="mono"${widget.font === 'mono' ? ' selected' : ''}>${escapeHTML(t('boardFontMono'))}</option>
          <option value="custom"${widget.font === 'custom' ? ' selected' : ''}>${escapeHTML(t('boardCustomFont'))}</option>
        </select></label>
        <button type="button" class="board-tw${widget.bold ? ' on' : ''}" data-tw="bold" title="Bold"><b>B</b></button>
        <button type="button" class="board-tw${widget.italic ? ' on' : ''}" data-tw="italic" title="Italic"><i>I</i></button>
        <button type="button" class="board-tw" data-tw="align-cycle" title="${escapeHTML(t(BOARD_ALIGN_HINT[alignNext]))}">${BOARD_ALIGN_ICONS[widget.align]}</button>
        <span class="board-chrome-sep" aria-hidden="true"></span>
        ${BOARD_MARKER_COLORS.map(color => `<button type="button" class="board-swatch board-swatch-sm${widget.color === color ? ' on' : ''}" data-tw="text-color" data-color="${color}" style="background:${color}" title="${escapeHTML(t('boardTextColor'))}"></button>`).join('')}
        <label class="board-swatch is-custom" title="${escapeHTML(t('boardCustomColor'))}"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(widget.color) ? widget.color : '#242823'}" data-text-color/></label>
        <button type="button" class="board-tw" data-tw="bg-pop" title="${escapeHTML(t('boardBg'))}"><svg><use href="#i-palette"/></svg></button>
        <button type="button" class="board-tw is-danger" data-tw="remove" title="${escapeHTML(t('boardRemoveWidget'))}"><svg><use href="#i-trash"/></svg></button>`;
      bar.hidden = false;
      boardSyncToolbar();
      return;
    }
    if (widget?.type === 'note' || widget?.type === 'todo') {
      // 条目组件：不透明度滑杆 + 显示内容设置 + 移除（编辑面板承担内容编辑）。
      bar.innerHTML = `
        <span class="board-tw-label">${escapeHTML(t('boardWidgetOpacity'))}</span>
        <input class="board-tw-range" type="range" min="30" max="100" step="5" value="${Number.isFinite(widget.opacity) ? widget.opacity : 100}" data-tw="card-opacity" aria-label="${escapeHTML(t('boardWidgetOpacity'))}"/>
        <output class="board-tw-size">${Number.isFinite(widget.opacity) ? widget.opacity : 100}%</output>
        <span class="board-chrome-sep" aria-hidden="true"></span>
        <button type="button" class="board-tw" data-tw="content-pop" title="${escapeHTML(t('boardContentSettings'))}"><svg><use href="#i-sliders"/></svg></button>
        <button type="button" class="board-tw is-danger" data-tw="remove" title="${escapeHTML(t('boardRemoveWidget'))}"><svg><use href="#i-trash"/></svg></button>`;
      bar.hidden = false;
      boardSyncToolbar();
      return;
    }
    if (widget?.type === 'marker') {
      bar.innerHTML = `
        <span class="board-tw-label">${escapeHTML(t('boardMarkerColor'))}</span>
        ${BOARD_MARKER_COLORS.map(color => `<button type="button" class="board-swatch${widget.color === color ? ' on' : ''}" data-tw="color" data-color="${color}" style="background:${color}" title="${escapeHTML(t('boardMarkerColor'))}"></button>`).join('')}
        <label class="board-swatch is-custom${/^#[0-9a-f]{6}$/i.test(widget.color) && !BOARD_MARKER_COLORS.includes(widget.color) ? ' on' : ''}" title="${escapeHTML(t('boardCustomColor'))}"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(widget.color) ? widget.color : '#526b55'}" data-marker-color/></label>
        <span class="board-chrome-sep" aria-hidden="true"></span>
        <span class="board-tw-label">${escapeHTML(t('boardMarkerStroke'))}</span>
        <input class="board-tw-range" type="range" min="1" max="24" step="0.5" value="${widget.stroke || 2.5}" data-tw="marker-stroke" aria-label="${escapeHTML(t('boardMarkerStroke'))}"/>
        <output class="board-tw-size">${widget.stroke || 2.5}</output>
        <button type="button" class="board-tw" data-tw="marker-pop" title="${escapeHTML(t('boardMarkerStyle'))}"><svg><use href="#i-sliders"/></svg></button>
        <button type="button" class="board-tw is-danger" data-tw="remove" title="${escapeHTML(t('boardRemoveWidget'))}"><svg><use href="#i-trash"/></svg></button>`;
      bar.hidden = false;
      boardSyncToolbar();
      return;
    }
  }
  if (boardSelection.size > 1) {
    bar.innerHTML = `
      <span class="board-tw-label">${escapeHTML(t('boardSelectedCount').replace('{0}', boardSelection.size))}</span>
      <button type="button" class="board-tw is-danger" data-tw="remove-selection" title="${escapeHTML(t('boardMarqueeDelete'))}"><svg><use href="#i-trash"/></svg></button>
      <button type="button" class="board-tw" data-tw="clear-selection" title="${escapeHTML(t('boardMarqueeClear'))}"><svg><use href="#i-close"/></svg></button>`;
    bar.hidden = false;
    boardSyncToolbar();
    return;
  }
  bar.hidden = true;
  bar.innerHTML = '';
}

// 背景样式小面板（填充色 / 不透明度 / 圆角 / 内边距）：挂在工具条上方。
function boardRenderBgPop(widget) {
  let pop = $('#boardBgPop', boardEls?.canvas || document);
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'boardBgPop';
    pop.className = 'board-style-pop';
    boardEls.toolbar.after(pop);
  }
  const colors = ['none', ...BOARD_MARKER_COLORS];
  pop.innerHTML = `
    <div class="board-style-row">${colors.map(color => color === 'none'
      ? `<button type="button" class="board-swatch is-none${widget.bg === 'none' ? ' on' : ''}" data-bg="none" title="${escapeHTML(t('boardBgNone'))}"></button>`
      : `<button type="button" class="board-swatch${widget.bg === color ? ' on' : ''}" data-bg="${color}" style="background:${color}"></button>`).join('')}<label class="board-swatch is-custom" title="${escapeHTML(t('boardCustomColor'))}"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(widget.bg) ? widget.bg : '#f4e2c8'}" data-bg-custom/></label></div>
    <div class="board-style-row"><span>${escapeHTML(t('boardBgOpacity'))}</span><input type="range" min="0" max="100" step="5" value="${widget.bgOpacity}" data-bgop aria-label="${escapeHTML(t('boardBgOpacity'))}"/><output>${widget.bgOpacity}%</output></div>
    <div class="board-style-row"><span>${escapeHTML(t('boardRadius'))}</span><input type="range" min="0" max="24" step="1" value="${widget.radius}" data-radius-range aria-label="${escapeHTML(t('boardRadius'))}"/><output>${widget.radius}px</output></div>
    <div class="board-style-row"><span>${escapeHTML(t('boardPadding'))}</span><input type="range" min="0" max="24" step="1" value="${widget.pad}" data-pad-range aria-label="${escapeHTML(t('boardPadding'))}"/><output>${widget.pad}px</output></div>`;
  pop.hidden = false;
  // 落位到工具条正上方居中：先渲染量高，再按工具条的 canvas 内坐标定位。
  const bar = boardEls?.toolbar;
  if (bar) {
    const height = pop.offsetHeight || 168;
    const width = pop.offsetWidth || 250;
    const left = Math.min(Math.max(bar.offsetLeft, width / 2 + 8), (boardEls.canvas.clientWidth || 400) - width / 2 - 8);
    pop.style.left = `${left}px`;
    pop.style.top = `${Math.max(bar.offsetTop - height - 10, 8)}px`;
  }
}

// 标注样式小面板：粗细在工具条上，这里承载按形状差异化的设置——
// 箭头的两端端帽、椭圆的填充与不透明度、笔绘的不透明度与笔尖。
function boardMarkerPopPlacement(pop) {
  const bar = boardEls?.toolbar;
  if (!bar) return;
  const height = pop.offsetHeight || 160;
  const width = pop.offsetWidth || 250;
  const left = Math.min(Math.max(bar.offsetLeft, width / 2 + 8), (boardEls.canvas.clientWidth || 400) - width / 2 - 8);
  pop.style.left = `${left}px`;
  pop.style.top = `${Math.max(bar.offsetTop - height - 10, 8)}px`;
}

function boardRenderMarkerPop(widget) {
  let pop = $('#boardMarkerPop', boardEls?.canvas || document);
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'boardMarkerPop';
    pop.className = 'board-style-pop';
    boardEls.toolbar.after(pop);
  }
  const capOptions = value => [
    ['none', t('boardArrowNone')], ['arrow', t('boardArrowArrow')],
    ['dot', t('boardArrowDot')], ['bar', t('boardArrowBar')]
  ].map(([key, label]) => `<button type="button" data-mk-cap="${key}"${value === key ? ' class="active"' : ''}>${escapeHTML(label)}</button>`).join('');
  const tipOptions = value => [
    ['round', t('boardCapRound')], ['butt', t('boardCapFlat')], ['square', t('boardCapSquare')]
  ].map(([key, label]) => `<button type="button" data-mk-tip="${key}"${value === key ? ' class="active"' : ''}>${escapeHTML(label)}</button>`).join('');
  let rows = '';
  if (widget.kind === 'arrow') {
    rows += `
      <div class="board-style-row" data-row="head"><span>${escapeHTML(t('boardArrowHead'))}</span><div class="board-import-seg">${capOptions(widget.head || 'arrow')}</div></div>
      <div class="board-style-row" data-row="tail"><span>${escapeHTML(t('boardArrowTail'))}</span><div class="board-import-seg">${capOptions(widget.tail || 'none')}</div></div>`;
  }
  if (widget.kind === 'ellipse') {
    const fill = widget.fill || 'none';
    rows += `
      <div class="board-style-row"><span>${escapeHTML(t('boardMarkerFill'))}</span><button type="button" class="board-swatch is-none${fill === 'none' ? ' on' : ''}" data-mk-fill="none" title="${escapeHTML(t('boardBgNone'))}"></button>${BOARD_MARKER_COLORS.map(color => `<button type="button" class="board-swatch${fill === color ? ' on' : ''}" data-mk-fill="${color}" style="background:${color}"></button>`).join('')}<label class="board-swatch is-custom" title="${escapeHTML(t('boardCustomColor'))}"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(fill) ? fill : '#f4e2c8'}" data-mk-fill-custom/></label></div>
      <div class="board-style-row"><span>${escapeHTML(t('boardFillOpacity'))}</span><input type="range" min="0" max="100" step="5" value="${widget.fillOpacity ?? 100}" data-mk-fillop aria-label="${escapeHTML(t('boardFillOpacity'))}"/><output>${widget.fillOpacity ?? 100}%</output></div>
      <div class="board-style-row"><span>${escapeHTML(t('boardStrokeOpacity'))}</span><input type="range" min="5" max="100" step="5" value="${widget.strokeOpacity ?? 100}" data-mk-strokeop aria-label="${escapeHTML(t('boardStrokeOpacity'))}"/><output>${widget.strokeOpacity ?? 100}%</output></div>`;
  }
  if (widget.kind === 'draw') {
    rows += `
      <div class="board-style-row"><span>${escapeHTML(t('boardPenOpacity'))}</span><input type="range" min="5" max="100" step="5" value="${widget.opacity ?? 100}" data-mk-op aria-label="${escapeHTML(t('boardPenOpacity'))}"/><output>${widget.opacity ?? 100}%</output></div>
      <div class="board-style-row"><span>${escapeHTML(t('boardPenCap'))}</span><div class="board-import-seg">${tipOptions(widget.cap || (widget.brush === 'highlighter' ? 'butt' : 'round'))}</div></div>`;
  }
  pop.innerHTML = rows || `<div class="board-style-row"><span>${escapeHTML(t('boardMarkerStroke'))}</span><span class="board-pop-hint">${escapeHTML(t('boardMarkerStyle'))}</span></div>`;
  pop.hidden = false;
  boardMarkerPopPlacement(pop);
}

function boardCloseMarkerPop() {
  const pop = $('#boardMarkerPop', boardEls?.canvas || document);
  if (pop) pop.hidden = true;
}

// —— 板个性化：背景图案 / 背景颜色 / 吸附网格 / 图案网格大小 ——
function boardRenderStylePop() {
  const board = boardLayoutCache?.board || activeBoard();
  const style = board.style || { pattern: 'dots', color: '', gridColor: '', gridOpacity: 10, snap: false, gridSize: 26 };
  // 浮层互斥：个性化面板打开时收起图层面板。
  $('#boardLayerPop', boardEls?.canvas || document)?.remove();
  let pop = $('#boardStylePop', boardEls?.canvas || document);
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'boardStylePop';
    pop.className = 'board-style-pop board-style-pop-lg';
    pop.setAttribute('role', 'dialog');
    boardEls.canvas.appendChild(pop);
  }
  const patterns = [
    ['dots', t('boardPatternDots')], ['grid', t('boardPatternGrid')], ['lines', t('boardPatternLines')],
    ['cross', t('boardPatternCross')], ['none', t('boardPatternNone')]
  ];
  const gridColorValid = /^#[0-9a-f]{6}$/i.test(style.gridColor || '');
  pop.innerHTML = `
    <div class="board-style-pop-head"><b>${escapeHTML(t('boardPersonalize'))}</b><button type="button" data-style-close title="${escapeHTML(t('cancel'))}" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></div>
    <div class="board-style-row"><span>${escapeHTML(t('boardBgPattern'))}</span><div class="board-import-seg">${patterns.map(([key, label]) => `<button type="button" data-pattern="${key}"${style.pattern === key ? ' class="active"' : ''}>${escapeHTML(label)}</button>`).join('')}</div></div>
    <div class="board-style-row"><span>${escapeHTML(t('boardBoardBgColor'))}</span><button type="button" class="board-tw${style.color ? '' : ' on'}" data-bg-color="theme">${escapeHTML(t('boardBgColorTheme'))}</button><label class="board-swatch is-custom" title="${escapeHTML(t('boardCustomColor'))}"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(style.color) ? style.color : '#fbfaf6'}" data-bg-color-picker/></label></div>
    <div class="board-style-row"><span>${escapeHTML(t('boardGridColor'))}</span><button type="button" class="board-tw${gridColorValid ? '' : ' on'}" data-grid-color="theme">${escapeHTML(t('boardBgColorTheme'))}</button><label class="board-swatch is-custom" title="${escapeHTML(t('boardCustomColor'))}"><input type="color" value="${gridColorValid ? style.gridColor : '#6f6748'}" data-grid-color-picker/></label></div>
    <div class="board-style-row"><span>${escapeHTML(t('boardGridOpacity'))}</span><input type="range" min="0" max="60" step="2" value="${Number.isFinite(style.gridOpacity) ? style.gridOpacity : 10}" data-grid-opacity aria-label="${escapeHTML(t('boardGridOpacity'))}"/><output>${Number.isFinite(style.gridOpacity) ? style.gridOpacity : 10}%</output></div>
    <label class="board-style-toggle"><input type="checkbox" id="boardSnapToggle"${style.snap ? ' checked' : ''}/><i></i><span>${escapeHTML(t('boardSnapGrid'))}</span></label>
    <div class="board-style-row"><span>${escapeHTML(t('boardGridSize'))}</span><input type="range" min="16" max="64" step="2" value="${style.gridSize}" data-grid-size aria-label="${escapeHTML(t('boardGridSize'))}"/><output>${style.gridSize}px</output></div>`;
  pop.hidden = false;
}

function boardApplyStyle(board) {
  touchBoard(board);
  persist();
  boardLayoutCache.board = board;
  boardApplyCamera();
}

// 吸附：开启后组件拖动 / 端点编辑 / 形状绘制按板网格大小取整（画笔不吸附，保笔迹平滑）。
function boardSnap(value) {
  const style = boardLayoutCache?.board?.style;
  if (!style?.snap) return value;
  const step = style.gridSize || 26;
  return Math.round(value / step) * step;
}

// 条目组件的「显示内容」小面板：五项内容开关。
function boardRenderContentPop(widget) {
  let pop = $('#boardContentPop', boardEls?.canvas || document);
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'boardContentPop';
    pop.className = 'board-style-pop';
    // 挂在画布上（不挂在会被重建的工具条旁边），开关切换时面板保持打开。
    boardEls.canvas.appendChild(pop);
  }
  const show = widget.show || {};
  // 开关按模块类型过滤：优先级与子待办仅对待办有意义，笔记提供完整内容显示。
  const items = widget.type === 'todo'
    ? [
        ['pill', t('boardShowPill')], ['priority', t('boardShowPriority')], ['date', t('boardShowDate')],
        ['tasks', t('boardShowTasks')], ['tasksDoneOnly', t('boardShowDoneOnly')],
        ['preview', t('boardShowPreview')], ['foot', t('boardShowFoot')]
      ]
    : [
        ['pill', t('boardShowPill')], ['date', t('boardShowDate')],
        ['body', t('boardShowBody')], ['preview', t('boardShowPreview')], ['foot', t('boardShowFoot')]
      ];
  pop.innerHTML = `
    <div class="board-style-pop-head"><b>${escapeHTML(t('boardContentSettings'))}</b><button type="button" data-content-close title="${escapeHTML(t('cancel'))}" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></div>
    <div class="board-style-column">${items.map(([key, label]) => `
    <label class="board-style-toggle"><input type="checkbox" data-show="${key}"${show[key] !== false ? ' checked' : ''}/><i></i><span>${escapeHTML(label)}</span></label>`).join('')}
  </div>`;
  pop.hidden = false;
  const bar = boardEls?.toolbar;
  if (bar) {
    const height = pop.offsetHeight || 190;
    const width = pop.offsetWidth || 200;
    const left = Math.min(Math.max(bar.offsetLeft, width / 2 + 8), (boardEls.canvas.clientWidth || 400) - width / 2 - 8);
    pop.style.left = `${left}px`;
    pop.style.top = `${Math.max(bar.offsetTop - height - 10, 8)}px`;
  }
}

function boardCloseContentPop() {
  const pop = $('#boardContentPop', boardEls?.canvas || document);
  if (pop) pop.hidden = true;
}

function boardCloseBgPop() {
  const pop = $('#boardBgPop', boardEls?.canvas || document);
  if (pop) pop.hidden = true;
}

// 框选：拖动期间的虚线矩形（屏幕层）；松手转换为世界矩形做相交测试。
function boardUpdateMarquee(gesture) {
  const element = boardEls?.marquee;
  if (!element) return;
  element.style.left = `${Math.min(gesture.originX, gesture.currentX)}px`;
  element.style.top = `${Math.min(gesture.originY, gesture.currentY)}px`;
  element.style.width = `${Math.abs(gesture.currentX - gesture.originX)}px`;
  element.style.height = `${Math.abs(gesture.currentY - gesture.originY)}px`;
}

function boardApplyMarquee(gesture) {
  const left = Math.min(gesture.originX, gesture.currentX);
  const right = Math.max(gesture.originX, gesture.currentX);
  const top = Math.min(gesture.originY, gesture.currentY);
  const bottom = Math.max(gesture.originY, gesture.currentY);
  const world = {
    x0: (left - boardCam.x) / boardCam.scale,
    x1: (right - boardCam.x) / boardCam.scale,
    y0: (top - boardCam.y) / boardCam.scale,
    y1: (bottom - boardCam.y) / boardCam.scale
  };
  const hits = [];
  (boardLayoutCache?.board.widgets || []).forEach(widget => {
    const size = boardWidgetSize(widget);
    if (widget.x + size.w < world.x0 || widget.x > world.x1) return;
    if (widget.y + size.h < world.y0 || widget.y > world.y1) return;
    hits.push(widget.id);
  });
  if (hits.length) boardSetSelection(hits);
  else boardSetSelection([]);
}

// 卡片尺寸拖拽时同步已渲染节点的 inline 尺寸（内容自适应由 CSS 完成）。
function boardRefreshCardNode(widget) {
  const element = boardRenderedCards.get(widget.id);
  if (!element) return null;
  // 西 / 北向调节会同时改写原点：宽高之外必须同步 left/top，否则节点只朝
  // 东南方向长，固定的对边随之移动，整张卡片看起来在「位移」。
  element.style.left = `${widget.x}px`;
  element.style.top = `${widget.y}px`;
  element.style.width = `${widget.w}px`;
  element.style.height = `${widget.h}px`;
  if (Number.isFinite(widget.opacity)) element.style.opacity = `${(Math.min(100, Math.max(30, widget.opacity)) / 100).toFixed(2)}`;
  // 虚拟化重建用布局缓存里的卡片原点生成内联样式；缓存不同步会把刚调好的
  // 位置画回旧值。顺带返回缓存项供调用方刷新内容签名。
  const cached = boardLayoutCache?.cards.find(card => card.widget === widget) || null;
  if (cached) {
    cached.x = widget.x;
    cached.y = widget.y;
  }
  return cached;
}

// 工具条浮在组件上方（屏幕层，不随画布缩放）；组件移出视口时暂时隐藏。
function boardSyncToolbar() {
  const bar = boardEls?.toolbar;
  if (!bar) return;
  // 多选工具条固定在画布底部居中（添加工具条上一行），不跟随组件。
  if (boardSelection.size > 1) {
    bar.classList.add('is-multi');
    bar.style.left = '';
    bar.style.top = '';
    bar.style.opacity = '';
    bar.style.pointerEvents = '';
    return;
  }
  bar.classList.remove('is-multi');
  const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
  if (!widget) return;
  const viewportSize = boardViewportSize();
  const w = viewportSize.w;
  const width = widget.type === 'text' ? widget.w : Math.max(Math.abs(widget.w), 40);
  const height = widget.type === 'text'
    ? (boardTextHeights.get(widget.id) || 64)
    : Math.max(Math.abs(widget.h) || 114, 40);
  const screenX = widget.x * boardCam.scale + boardCam.x + (width * boardCam.scale) / 2;
  const screenY = widget.y * boardCam.scale + boardCam.y;
  if (screenX < -80 || screenX > w + 80 || screenY > viewportSize.h + 80 || screenY + height * boardCam.scale < -40) {
    // 组件整体在视口外：工具条暂时隐藏。
    bar.style.opacity = '0';
    bar.style.pointerEvents = 'none';
    return;
  }
  bar.style.opacity = '';
  bar.style.pointerEvents = '';
  bar.style.left = `${Math.min(Math.max(screenX, 150), Math.max(w - 150, 160))}px`;
  // 组件上方放不下（贴近视口顶部）时，工具条移到组件下方，不再整体隐藏。
  bar.style.top = screenY - 46 >= 10 ? `${screenY - 46}px` : `${Math.min(screenY + height * boardCam.scale + 14, viewportSize.h - 52)}px`;
}

// —— 撤销 / 重做：以板组件快照为粒度（样式类操作 800ms 内合并为一步）。 ——
const boardUndoStack = [];
const boardRedoStack = [];
let boardUndoKind = '';
let boardUndoAt = 0;

function boardPushUndo(kind = 'structure') {
  const board = boardLayoutCache?.board || activeBoard();
  if (!board) return;
  const now = Date.now();
  if (kind === 'style' && boardUndoKind === 'style' && now - boardUndoAt < 800 && boardUndoStack.length) {
    boardUndoAt = now;
    boardRedoStack.length = 0;
    boardSyncUndoButtons();
    return;
  }
  boardUndoStack.push(JSON.stringify(board.widgets));
  if (boardUndoStack.length > 60) boardUndoStack.shift();
  boardRedoStack.length = 0;
  boardUndoKind = kind;
  boardUndoAt = now;
  boardSyncUndoButtons();
}
// style 合并分支与普通分支统一在入口处刷新按钮状态。

function boardUndo() {
  const board = boardLayoutCache?.board || activeBoard();
  if (!board || !boardUndoStack.length) return;
  boardRedoStack.push(JSON.stringify(board.widgets));
  board.widgets = JSON.parse(boardUndoStack.pop());
  boardUndoKind = '';
  touchBoard(board);
  persist();
  boardSetSelection([]);
  renderList();
  boardSyncUndoButtons();
}

function boardRedo() {
  const board = boardLayoutCache?.board || activeBoard();
  if (!board || !boardRedoStack.length) return;
  boardUndoStack.push(JSON.stringify(board.widgets));
  board.widgets = JSON.parse(boardRedoStack.pop());
  boardUndoKind = '';
  touchBoard(board);
  persist();
  boardSetSelection([]);
  renderList();
  boardSyncUndoButtons();
}

function boardSyncUndoButtons() {
  if (!boardEls?.canvas) return;
  $('#boardUndo', boardEls.canvas)?.toggleAttribute('disabled', !boardUndoStack.length);
  $('#boardRedo', boardEls.canvas)?.toggleAttribute('disabled', !boardRedoStack.length);
}

// 极简二级确认：第一次点变成「再点一次删除」，2.6 秒内再点才执行。
function boardArmDelete(button, onConfirm) {
  if (button.dataset.armed === '1') {
    button.dataset.armed = '';
    button.classList.remove('is-armed');
    onConfirm();
    return;
  }
  button.dataset.armed = '1';
  button.classList.add('is-armed');
  button.title = t('boardDeleteArm');
  setTimeout(() => {
    if (button.dataset.armed !== '1') return;
    button.dataset.armed = '';
    button.classList.remove('is-armed');
    button.title = t('boardRemoveWidget');
  }, 2600);
}

function boardRemoveWidgets(ids) {
  const board = activeBoard();
  const idSet = new Set(ids);
  boardPushUndo();
  board.widgets = board.widgets.filter(widget => !idSet.has(widget.id));
  ids.forEach(id => boardTextHeights.delete(id));
  touchBoard(board);
  persist();
  boardSetSelection([]);
  renderList();
}

function boardRemoveWidget(id) {
  boardRemoveWidgets([id]);
}

// —— 文本编辑：双击进入，失焦保存；空文本落糊即撤（不留隐形组件） ——
function boardEditText(id) {
  const widget = boardWidgetById(id);
  const element = $(`[data-widget-id="${CSS.escape(id)}"]`, boardEls?.world || document);
  if (!widget || !element) return;
  boardEditingText = id;
  element.classList.add('is-editing');
  element.contentEditable = 'plaintext-only';
  if (!element.contentEditable || element.contentEditable !== 'plaintext-only') element.contentEditable = 'true';
  element.innerHTML = escapeHTML(widget.text).replace(/\n/g, '<br>');
  element.focus();
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  const save = () => {
    element.removeEventListener('blur', save);
    if (boardEditingText !== id) return;
    boardEditingText = null;
    element.classList.remove('is-editing');
    element.contentEditable = 'false';
    const text = (element.innerText || '').replace(/\n{3,}/g, '\n\n').trim();
    if (!text) {
      boardRemoveWidget(id);
      return;
    }
    if (text !== widget.text) {
      boardPushUndo();
      widget.text = text.slice(0, 4000);
      touchBoard(boardLayoutCache.board);
      persist();
    }
    boardRefreshStatic(widget);
    if (boardLayoutCache) boardLayoutCache.bounds = boardBoundsOf(boardLayoutCache.board.widgets.filter(widget => !widget.hidden));
  };
  element.addEventListener('blur', save);
}

// —— 橡皮擦：指针路径触及的整条笔迹擦除（与主流白板的 stroke eraser 一致） ——
// 半径由笔绘面板的「粗细」滑杆控制（boardPenState.stroke，橡皮预设默认 12）。

function boardPointToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function boardEraseAt(worldX, worldY) {
  const board = boardLayoutCache?.board;
  if (!board) return false;
  const radius = boardPenState.brush === 'eraser' ? boardPenState.stroke : 12;
  let erased = false;
  for (let i = board.widgets.length - 1; i >= 0; i -= 1) {
    const widget = board.widgets[i];
    if (widget.type !== 'marker' || widget.kind !== 'draw' || widget.hidden) continue;
    const points = widget.points || [];
    const tolerance = radius + (widget.stroke || 2.5) / 2;
    for (let p = 0; p + 3 < points.length; p += 2) {
      const hit = boardPointToSegment(
        worldX, worldY,
        widget.x + points[p], widget.y + points[p + 1],
        widget.x + points[p + 2], widget.y + points[p + 3]
      ) <= tolerance;
      if (!hit) continue;
      $(`[data-widget-id="${CSS.escape(widget.id)}"]`, boardEls?.world || document)?.remove();
      board.widgets.splice(i, 1);
      erased = true;
      break;
    }
  }
  if (erased) {
    if (boardEls?.empty) boardEls.empty.hidden = board.widgets.length > 0;
    boardLayoutCache.bounds = boardBoundsOf(board.widgets.filter(widget => !widget.hidden));
    touchBoard(board);
    persist();
  }
  return erased;
}

// —— 标注绘制：选形状后在画布上拖出 ——
// boardPenSessionId：一次笔绘会话的组号——进入笔绘模式时生成，退出时清空，
// 期间每一笔都以它为 groupId 自动打组。
let boardPenSessionId = null;

function boardStartDraw(kind) {
  boardPendingMarker = kind;
  boardSetSelection([]);
  boardEls?.canvas.classList.add('is-drawing');
  if (kind === 'draw') {
    boardPenSessionId = uid();
    boardRenderPenBar();
  }
}

function boardCancelDraw() {
  boardPendingMarker = null;
  boardPenSessionId = null;
  boardDraftMarker?.remove();
  boardDraftMarker = null;
  boardEls?.canvas.classList.remove('is-drawing');
  const bar = $('#boardPenBar', boardEls?.canvas || document);
  if (bar) bar.hidden = true;
  $$('#boardMarkerMenu [data-board-marker]', boardEls?.canvas || document).forEach(button => button.classList.remove('active'));
}

// 笔绘面板：笔型（钢笔 / 荧光笔 / 橡皮）切换、粗细 / 不透明度 / 流量 /
// 笔尖、颜色与完成。橡皮与笔集成在同一面板：切到橡皮时只留半径滑杆。
function boardRenderPenBar() {
  const bar = $('#boardPenBar', boardEls?.canvas || document);
  if (!bar) return;
  const preset = boardPenPresets[boardPenState.brush];
  const eraser = boardPenState.brush === 'eraser';
  const caps = [['round', t('boardCapRound')], ['butt', t('boardCapFlat')], ['square', t('boardCapSquare')]];
  bar.innerHTML = `
    <button type="button" class="board-tw${boardPenState.brush === 'pen' ? ' on' : ''}" data-brush="pen" title="${escapeHTML(t('boardBrushPen'))}"><svg><use href="#i-edit"/></svg></button>
    <button type="button" class="board-tw${boardPenState.brush === 'highlighter' ? ' on' : ''}" data-brush="highlighter" title="${escapeHTML(t('boardBrushHighlighter'))}"><svg><use href="#i-highlight"/></svg></button>
    <button type="button" class="board-tw${eraser ? ' on' : ''}" data-brush="eraser" title="${escapeHTML(t('boardBrushEraser'))}"><svg><use href="#i-eraser"/></svg></button>
    <span class="board-chrome-sep" aria-hidden="true"></span>
    <label class="board-pen-field"><span>${escapeHTML(eraser ? t('boardMarkerStroke') : t('boardPenStroke'))}</span><input type="range" min="${eraser ? 6 : 1}" max="${eraser ? 40 : 24}" step="${eraser ? 2 : 0.5}" value="${boardPenState.stroke}" data-pen="stroke"/><output>${boardPenState.stroke}</output></label>
    ${eraser ? '' : `
    <label class="board-pen-field"><span>${escapeHTML(t('boardPenOpacity'))}</span><input type="range" min="5" max="100" step="5" value="${boardPenState.opacity}" data-pen="opacity"/><output>${boardPenState.opacity}%</output></label>
    <label class="board-pen-field"><span>${escapeHTML(t('boardPenFlow'))}</span><input type="range" min="10" max="100" step="5" value="${boardPenState.flow}" data-pen="flow"/><output>${boardPenState.flow}%</output></label>
    <label class="board-pen-field"><span>${escapeHTML(t('boardPenCap'))}</span><span class="board-import-seg board-cap-seg">${caps.map(([value, label]) => `<button type="button" data-pen-cap="${value}"${boardPenState.cap === value ? ' class="active"' : ''}>${escapeHTML(label)}</button>`).join('')}</span></label>
    <span class="board-chrome-sep" aria-hidden="true"></span>
    ${BOARD_MARKER_COLORS.map(color => `<button type="button" class="board-swatch board-swatch-round${boardPenState.color === color ? ' on' : ''}" data-pen-color="${color}" style="background:${color}" title="${escapeHTML(t('boardMarkerColor'))}"></button>`).join('')}
    <label class="board-swatch is-custom" title="${escapeHTML(t('boardCustomColor'))}"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(boardPenState.color) ? boardPenState.color : '#526b55'}" data-pen-color-custom/></label>`}
    <button type="button" class="board-tw is-primary" id="boardPenDone" title="${escapeHTML(t('boardPenDone'))}"><svg><use href="#i-check"/></svg>${escapeHTML(t('boardPenDone'))}</button>`;
  bar.hidden = false;
  bar.dataset.presetStroke = String(preset.stroke);
}

function boardDrawDraft(draft) {
  if (!boardDraftMarker) {
    boardDraftMarker = document.createElement('div');
    boardEls.world.appendChild(boardDraftMarker);
  }
  const widget = draft.kind === 'draw'
    ? { kind: 'draw', x: draft.x, y: draft.y, points: draft.points, w: 1, h: 1, brush: boardPenState.brush, stroke: boardPenState.stroke, opacity: boardPenState.opacity, flow: boardPenState.flow, cap: boardPenState.cap }
    : draft;
  let left;
  let top;
  let width;
  let height;
  let renderWidget = widget;
  if (draft.kind === 'draw') {
    const points = draft.points;
    let minX = 0; let minY = 0; let maxX = 1; let maxY = 1;
    for (let i = 0; i + 1 < points.length; i += 2) {
      if (i === 0 || points[i] < minX) minX = points[i];
      if (i === 0 || points[i + 1] < minY) minY = points[i + 1];
      if (points[i] > maxX) maxX = points[i];
      if (points[i + 1] > maxY) maxY = points[i + 1];
    }
    left = draft.x + minX;
    top = draft.y + minY;
    width = Math.max(maxX - minX, 1);
    height = Math.max(maxY - minY, 1);
    renderWidget = { ...widget, points: points.map((value, index) => value - (index % 2 === 0 ? minX : minY)) };
  } else {
    left = Math.min(draft.x, draft.x + draft.w);
    top = Math.min(draft.y, draft.y + draft.h);
    width = Math.max(Math.abs(draft.w), 1);
    height = Math.max(Math.abs(draft.h), 1);
  }
  boardDraftMarker.className = `board-widget board-marker kind-${draft.kind} is-draft`;
  boardDraftMarker.style.left = `${left}px`;
  boardDraftMarker.style.top = `${top}px`;
  boardDraftMarker.style.width = `${width}px`;
  boardDraftMarker.style.height = `${height}px`;
  boardDraftMarker.style.setProperty('--board-marker-color', boardPenState.color);
  boardDraftMarker.innerHTML = boardMarkerSVG(renderWidget, draft.kind === 'draw' ? 0 : left, top, true);
}

function boardCommitDraw(draft) {
  const kind = boardPendingMarker;
  if (!kind) return;
  const board = activeBoard();
  let widget;
  if (kind === 'draw') {
    const points = draft.points || [];
    if (points.length < 6) { boardCancelDraw(); return; }
    let minX = 0; let minY = 0; let maxX = 1; let maxY = 1;
    for (let i = 0; i + 1 < points.length; i += 2) {
      if (i === 0 || points[i] < minX) minX = points[i];
      if (i === 0 || points[i + 1] < minY) minY = points[i + 1];
      if (points[i] > maxX) maxX = points[i];
      if (points[i + 1] > maxY) maxY = points[i + 1];
    }
    boardPushUndo();
    widget = { id: uid(), type: 'marker', kind, x: Math.round(draft.x + minX), y: Math.round(draft.y + minY), w: Math.round(maxX - minX), h: Math.round(maxY - minY), color: boardPenState.color, brush: boardPenState.brush, stroke: boardPenState.stroke, opacity: boardPenState.opacity, flow: boardPenState.flow, cap: boardPenState.cap, points: points.map((value, index) => Math.round(value - (index % 2 === 0 ? minX : minY))) };
    // 一次笔绘会话（进入模式到退出）的所有笔迹自动归为一组：
    // 图层面板里整组移动 / 显隐，手写内容的多笔不会散开。
    widget.groupId = boardPenSessionId;
  } else {
    if (Math.hypot(draft.w || 0, draft.h || 0) < 10) { boardCancelDraw(); return; }
    boardPushUndo();
    widget = { id: uid(), type: 'marker', kind, x: Math.round(draft.x), y: Math.round(draft.y), w: Math.round(draft.w), h: Math.round(draft.h), color: boardPenState.color, stroke: 2.5 };
  }
  board.widgets.push(widget);
  touchBoard(board);
  persist();
  // 提交只做局部更新（重建布局缓存 + 插入这一个静态组件）：
  // 走 renderList 会整壳重建画布，连续画笔时每笔都重播全部组件的入场动画。
  boardLayoutCache = boardLayout();
  boardLayoutCache.bounds = boardBoundsOf(boardLayoutCache.board.widgets.filter(entry => !entry.hidden));
  boardRefreshStatic(widget);
  boardScheduleSync();
  boardSyncLayerPop();
  if (kind === 'draw') {
    // 画笔模式连续绘制：清掉草稿继续下一笔，不退出模式、不抢选中。
    boardDraftMarker?.remove();
    boardDraftMarker = null;
    boardRenderPenBar();
    return;
  }
  boardCancelDraw();
  boardSetSelection([widget.id]);
}

// —— 板管理：切换 / 新建 / 重命名 / 删除 ——
function boardRenderMenu() {
  const menu = boardEls?.pillMenu;
  if (!menu) return;
  const boards = ensureBoards();
  const current = activeBoard();
  menu.innerHTML = `
    ${boards.map(board => `<button type="button" role="menuitem" class="board-pill-item${board.id === current.id ? ' active' : ''}" data-board-goto="${escapeHTML(board.id)}"><svg><use href="#i-board"/></svg><span>${escapeHTML(board.name)}</span><em>${board.widgets.length}</em></button>`).join('')}
    <div class="board-pill-sep" role="separator"></div>
    <button type="button" role="menuitem" class="board-pill-item" data-board-action="export-plan"><svg><use href="#i-upload"/></svg><span>${escapeHTML(t('boardExportPlan'))}</span></button>
    <button type="button" role="menuitem" class="board-pill-item" data-board-action="export-image"><svg><use href="#i-upload"/></svg><span>${escapeHTML(t('boardExportImage'))}</span></button>
    <button type="button" role="menuitem" class="board-pill-item" data-board-action="export-pdf"><svg><use href="#i-upload"/></svg><span>${escapeHTML(t('boardExportPdf'))}</span></button>
    <button type="button" role="menuitem" class="board-pill-item" data-board-action="import-plan"><svg><use href="#i-download"/></svg><span>${escapeHTML(t('boardImportPlan'))}</span></button>
    <div class="board-pill-sep" role="separator"></div>
    <button type="button" role="menuitem" class="board-pill-item" data-board-action="new"><svg><use href="#i-plus"/></svg><span>${escapeHTML(t('boardNewBoard'))}</span></button>
    <button type="button" role="menuitem" class="board-pill-item" data-board-action="rename"><svg><use href="#i-edit"/></svg><span>${escapeHTML(t('boardRenameBoard'))}</span></button>
    <button type="button" role="menuitem" class="board-pill-item is-danger" data-board-action="delete"><svg><use href="#i-trash"/></svg><span>${escapeHTML(t('boardDeleteBoard'))}</span></button>`;
}

function boardToggleMenu(open) {
  const menu = boardEls?.pillMenu;
  const button = boardEls?.pillButton;
  if (!menu || !button) return;
  const next = open ?? menu.hidden;
  if (next) {
    boardRenderMenu();
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    clearTimeout(boardMenuTimer);
    boardMenuTimer = setTimeout(() => {
      document.addEventListener('pointerdown', boardMenuOutside, { once: true });
    }, 0);
  } else {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', boardMenuOutside);
  }
}

function boardMenuOutside(event) {
  if (boardEls?.pill?.contains(event.target)) return;
  boardToggleMenu(false);
}

// —— 计划板导出：.actaplan 自包含文件 / PNG 图片 / PDF ——
// .actaplan 携带板结构与卡片引用的条目全文，文件自包含、不依赖当前资料库即可还原。
// 图片与 PDF 由 Canvas 按板数据重绘：卡片全部区块、文本组件、标注、关联曲线与底纹都包含在内。

const BOARD_EXPORT_MARGIN = 60;
const BOARD_EXPORT_SCALE = 2;
const BOARD_EXPORT_PRIORITY_COLORS = { high: ['#a15b43', '#f4ded5'], medium: ['#94702f', '#f3e8c9'], low: ['#526b55', '#dcebdd'] };

// 导出保存：桌面端（Tauri）与移动端（Capacitor）弹系统保存对话框让用户选位置，
// 浏览器回落为下载。返回保存位置（或 'download'），用户取消时返回 null。
async function boardSaveBlob(fileName, blob) {
  const asset = { fileName, mimeType: blob.type || 'application/octet-stream' };
  const desktop = window.actaDesktop?.exportAssets;
  const nativeExport = window.Capacitor?.Plugins?.ActaSync?.exportAsset;
  // 原生导出桥（桌面与移动）都按 data URL 传数据；移动端此前只传了文件名和
  // MIME，原生侧收到空数据只能报错——用户看不到保存对话框，也没有任何产物。
  if (desktop || nativeExport) {
    const dataUrl = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
    if (!dataUrl) return null;
    asset.dataUrl = dataUrl;
  }
  if (desktop) {
    // 桥失败（如格式不被支持）要显式提示：静默失败会让用户完全看不到产物。
    let paths;
    try {
      paths = await desktop([asset]);
    } catch (error) {
      showToast(`${t('boardExportFailed')}${error?.message || error}`);
      return null;
    }
    return Array.isArray(paths) && paths[0] ? paths[0] : null;
  }
  if (nativeExport) {
    // Capacitor 返回 { fileName, path }；用户取消时原生 resolve(undefined)。
    let result;
    try {
      result = await nativeExport(asset);
    } catch (error) {
      showToast(`${t('boardExportFailed')}${error?.message || error}`);
      return null;
    }
    return result?.fileName || null;
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'download';
}

function boardExportBaseName() {
  return (activeBoard().name || t('boardDefaultName')).replace(/[\\/:*?"<>|]/g, '_').trim().slice(0, 60) || t('boardDefaultName');
}

function boardPickActaplanFile() {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.actaplan,application/json';
    input.hidden = true;
    const cleanup = () => input.remove();
    input.addEventListener('cancel', () => { cleanup(); resolve(null); }, { once: true });
    input.addEventListener('change', async () => {
      try {
        const file = input.files?.[0];
        if (!file) { cleanup(); resolve(null); return; }
        if (file.size > 20 * 1024 * 1024) throw new Error(t('fileTooLarge'));
        const content = await file.text();
        cleanup();
        resolve({ content, fileName: file.name });
      } catch (error) { cleanup(); resolve(null); }
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

async function boardImportPlanFile() {
  const picked = await boardPickActaplanFile();
  if (!picked) return;
  let payload;
  try { payload = JSON.parse(picked.content); } catch { showToast(t('boardImportInvalid')); return; }
  if (payload?.app !== 'acta' || payload?.kind !== 'actaplan' || !Array.isArray(payload.board?.widgets)) {
    showToast(t('boardImportInvalid'));
    return;
  }
  // 条目重建：文件携带的条目快照在当前资料库不存在时新建（新 id 并重映射
  // 卡片引用）；同 id 条目已存在时直接复用，避免重复创建。
  const idMap = new Map();
  const importedItems = [];
  Object.entries(payload.items || {}).forEach(([ref, item]) => {
    if (!item || typeof item !== 'object' || (item.type !== 'note' && item.type !== 'todo')) return;
    if (library.items.some(entry => entry.id === ref)) { idMap.set(ref, ref); return; }
    const newId = uid();
    idMap.set(ref, newId);
    importedItems.push({ ...item, id: newId, folderId: library.folders.some(f => f.id === item.folderId) ? item.folderId : '' });
  });
  library.items.push(...importedItems);
  const widgets = payload.board.widgets
    .filter(widget => widget && (widget.type === 'text' || widget.type === 'marker' || (idMap.has(widget.ref))))
    .map(widget => {
      const copy = JSON.parse(JSON.stringify(widget));
      if ((copy.type === 'note' || copy.type === 'todo') && idMap.has(copy.ref)) copy.ref = idMap.get(copy.ref);
      return copy;
    });
  const created = {
    id: uid(),
    name: (payload.board.name || t('boardDefaultName')).slice(0, 60),
    style: { ...(payload.board.style || {}) },
    widgets,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const [cleaned] = sanitizeBoards([{ ...created, widgets }]) || [];
  if (!cleaned) { showToast(t('boardImportInvalid')); return; }
  Object.assign(created, cleaned);
  const boards = ensureBoards();
  boards.push(created);
  boardState.activeBoardId = created.id;
  touchBoard(created);
  persist();
  boardState.cams[created.id] = { x: 0, y: 0, scale: 1 };
  persistBoardState();
  renderList();
  showToast(t('boardImported'));
}

async function boardExportPlanFile() {
  const board = activeBoard();
  if (!board.widgets.length) { showToast(t('boardExportEmpty')); return; }
  const refs = new Set(board.widgets.filter(widget => widget.type === 'note' || widget.type === 'todo').map(widget => widget.ref));
  const items = {};
  refs.forEach(ref => {
    const item = library.items.find(entry => entry.id === ref);
    if (item) items[ref] = item;
  });
  const payload = {
    app: 'acta',
    kind: 'actaplan',
    version: 1,
    exportedAt: new Date().toISOString(),
    board: {
      name: board.name || t('boardDefaultName'),
      style: { ...(board.style || {}) },
      widgets: board.widgets,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt
    },
    items
  };
  const saved = await boardSaveBlob(`${boardExportBaseName()}.actaplan`, new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  if (saved) showToast(typeof saved === 'string' && saved !== 'download' ? `${t('boardExportDone')}${saved}` : t('boardExportDone'));
  return saved;
}

function boardExportTheme() {
  const cs = getComputedStyle(document.documentElement);
  const read = name => cs.getPropertyValue(name).trim();
  return {
    paper: read('--paper') || '#fbfaf6',
    white: read('--white') || '#ffffff',
    line: read('--line') || '#e2ded2',
    ink: read('--ink') || '#2b2e29',
    muted: read('--muted') || '#6d7168',
    faint: read('--faint') || '#989b94',
    sage: read('--sage') || '#526b55',
    sage2: read('--sage-2') || '#e4ede2',
    violet: read('--violet') || '#8a7bc8',
    violetSoft: read('--violet-soft') || '#efeafc',
    appFont: read('--acta-app-font') || 'system-ui, sans-serif',
    fontScale: Number.parseFloat(read('--acta-font-scale')) || 1
  };
}

function boardHexToRgba(hex, alpha = 1) {
  const match = String(hex).trim().match(/^#([0-9a-f]{3,8})$/i);
  if (!match) return hex;
  let body = match[1];
  if (body.length === 3) body = body.split('').map(char => char + char).join('');
  const number = Number.parseInt(body.slice(0, 6), 16);
  const r = (number >> 16) & 255;
  const g = (number >> 8) & 255;
  const b = number & 255;
  const a = body.length === 8 ? Number.parseInt(body.slice(6, 8), 16) / 255 : alpha;
  return `rgba(${r},${g},${b},${a})`;
}

function boardRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function boardDrawMarker(ctx, widget, X, Y, theme) {
  ctx.save();
  if (widget.kind === 'draw') {
    const points = widget.points || [];
    const highlighter = widget.brush === 'highlighter';
    ctx.globalCompositeOperation = highlighter ? 'multiply' : 'source-over';
    ctx.strokeStyle = boardHexToRgba(widget.color, highlighter ? Math.min(0.5, (widget.opacity ?? 35) / 100) : (widget.opacity ?? 100) / 100);
    ctx.lineWidth = widget.stroke || 2.5;
    ctx.lineCap = widget.cap || (highlighter ? 'butt' : 'round');
    ctx.lineJoin = 'round';
    const flow = widget.flow ?? 100;
    if (flow < 100) ctx.setLineDash([Math.max(0.4, flow / 14), Math.max(0.5, (100 - flow) / 12)]);
    ctx.beginPath();
    for (let i = 0; i + 1 < points.length; i += 2) {
      const px = X(widget.x + points[i]);
      const py = Y(widget.y + points[i + 1]);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
    return;
  }
  const lineWidth = widget.stroke || 2.5;
  ctx.strokeStyle = boardHexToRgba(widget.color, widget.kind === 'ellipse' ? (widget.strokeOpacity ?? 100) / 100 : 1);
  ctx.fillStyle = boardHexToRgba(widget.color);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  const x1 = X(widget.x);
  const y1 = Y(widget.y);
  const x2 = X(widget.x + widget.w);
  const y2 = Y(widget.y + widget.h);
  if (widget.kind === 'rect') {
    boardRoundRect(ctx, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), 10);
    ctx.stroke();
  } else if (widget.kind === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2, 0, 0, Math.PI * 2);
    if (widget.fill && widget.fill !== 'none') {
      ctx.fillStyle = boardHexToRgba(widget.fill, (widget.fillOpacity ?? 100) / 100);
      ctx.fill();
    }
    ctx.stroke();
  } else if (widget.kind === 'line') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  } else {
    // 箭头：与画布渲染同构的两端端帽（无 / 箭头 / 圆点 / 短杠）。
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const capAt = (kind, x, y, dir) => {
      if (kind === 'dot') {
        const r = Math.max(2.5, lineWidth * 1.3 + 0.8);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        return r * 0.5;
      }
      if (kind === 'bar') {
        const size = Math.max(7, lineWidth * 2.8) / 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(dir + Math.PI / 2) * size, y + Math.sin(dir + Math.PI / 2) * size);
        ctx.lineTo(x + Math.cos(dir - Math.PI / 2) * size, y + Math.sin(dir - Math.PI / 2) * size);
        ctx.stroke();
        return lineWidth / 2;
      }
      if (kind === 'arrow') {
        const head = Math.max(10, lineWidth * 3.4);
        const wing = head * 0.5;
        ctx.beginPath();
        ctx.moveTo(x - head * Math.cos(dir) + wing * Math.sin(dir), y - head * Math.sin(dir) - wing * Math.cos(dir));
        ctx.lineTo(x, y);
        ctx.lineTo(x - head * Math.cos(dir) - wing * Math.sin(dir), y - head * Math.sin(dir) + wing * Math.cos(dir));
        ctx.closePath();
        ctx.fill();
        return head * 0.55;
      }
      return 0;
    };
    const headKind = widget.head || 'arrow';
    const tailKind = widget.tail || 'none';
    const headTrim = capAt(headKind, x2, y2, angle);
    const tailTrim = capAt(tailKind, x1, y1, angle + Math.PI);
    const usable = Math.max(Math.hypot(x2 - x1, y2 - y1) - headTrim - tailTrim, 0);
    ctx.beginPath();
    ctx.moveTo(x1 + tailTrim * Math.cos(angle), y1 + tailTrim * Math.sin(angle));
    ctx.lineTo(x1 + (tailTrim + usable) * Math.cos(angle), y1 + (tailTrim + usable) * Math.sin(angle));
    ctx.stroke();
  }
  ctx.restore();
}

function boardDrawTextWidget(ctx, widget, X, Y, theme) {
  const size = widget.size || 16;
  const family = widget.font === 'custom' && widget.customFont
    ? `"${widget.customFont}"`
    : (BOARD_TEXT_FAMILIES[widget.font] || theme.appFont);
  const pad = widget.pad || 0;
  const lineHeight = size * 1.55;
  const lines = String(widget.text || t('boardTextPlaceholder')).split('\n');
  const maxWidth = Math.max(20, widget.w - pad * 2);
  ctx.save();
  ctx.font = `${widget.italic ? 'italic ' : ''}${widget.bold ? '700 ' : '400 '}${size}px ${family}`;
  const wrapped = [];
  lines.forEach(line => {
    if (!line) { wrapped.push(''); return; }
    let current = '';
    for (const char of line) {
      if (current && ctx.measureText(current + char).width > maxWidth) { wrapped.push(current); current = char; }
      else current += char;
    }
    wrapped.push(current);
  });
  const textHeight = wrapped.length * lineHeight + pad * 2;
  if (widget.bg && widget.bg !== 'none') {
    ctx.fillStyle = boardHexToRgba(widget.bg, Math.min(1, (widget.bgOpacity ?? 100) / 100));
    boardRoundRect(ctx, X(widget.x), Y(widget.y), widget.w, textHeight, widget.radius || 0);
    ctx.fill();
  }
  ctx.fillStyle = widget.color ? boardHexToRgba(widget.color) : theme.ink;
  ctx.textBaseline = 'top';
  ctx.textAlign = widget.align === 'center' ? 'center' : widget.align === 'right' ? 'right' : 'left';
  const anchorX = widget.align === 'center' ? X(widget.x) + widget.w / 2 : widget.align === 'right' ? X(widget.x) + widget.w - pad : X(widget.x) + pad;
  let ty = Y(widget.y) + pad;
  wrapped.forEach(line => {
    ctx.fillText(line, anchorX, ty);
    ty += lineHeight;
  });
  ctx.restore();
}

// —— 笔记正文的富文本绘制（导出与画布所见一致） ——
// 解析正文 HTML 的块级结构（段落 / 标题 / 列表 / 引用 / 代码 / 分隔线），
// 行内保留加粗、斜体与行内代码；按卡片可用宽度断行，超出卡片高度即止
// （与画布上的可见区域一致）。
function boardCollectInline(node, style = {}) {
  const runs = [];
  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.replace(/\s+/g, ' ');
      if (text) runs.push({ text, ...style });
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const tag = child.tagName.toLowerCase();
    if (tag === 'br') { runs.push({ text: '\n', ...style }); return; }
    if (tag === 'script' || tag === 'style') return;
    const next = { ...style };
    if (tag === 'strong' || tag === 'b') next.bold = true;
    if (tag === 'em' || tag === 'i') next.italic = true;
    if (tag === 'code') next.code = true;
    if (tag === 'a') next.link = true;
    runs.push(...boardCollectInline(child, next));
  });
  return runs;
}

function boardWrapRuns(ctx, runs, maxWidth, fontOf) {
  const lines = [];
  let line = [];
  let width = 0;
  const pushLine = () => { lines.push(line); line = []; width = 0; };
  runs.forEach(run => {
    run.text.split('\n').forEach((chunk, chunkIndex) => {
      if (chunkIndex > 0) pushLine();
      const chars = [...chunk];
      let buffer = '';
      const flush = () => {
        if (!buffer) return;
        line.push({ ...run, text: buffer });
        buffer = '';
      };
      chars.forEach(char => {
        ctx.font = fontOf(run);
        const charWidth = ctx.measureText(char).width;
        if (width + charWidth > maxWidth && (width > 0 || buffer)) {
          flush();
          pushLine();
        }
        buffer += char;
        width += charWidth;
      });
      flush();
    });
  });
  if (line.length || !lines.length) lines.push(line);
  return lines;
}

function boardDrawNoteBody(ctx, item, area, theme) {
  const { x, width, top, bottom } = area;
  const doc = new DOMParser().parseFromString(`<div id="root">${item.body || ''}</div>`, 'text/html');
  const root = doc.querySelector('#root');
  if (!root) return;
  const scale = theme.fontScale;
  const base = 9 * scale;
  const lineGap = 2 * scale;
  const color = { ink: theme.ink, muted: theme.muted, faint: theme.faint };
  let cy = top;
  const limited = () => cy >= bottom - base;
  const fontOf = run => {
    const family = run.code ? 'ui-monospace, "SFMono-Regular", Consolas, monospace' : theme.appFont;
    const weight = run.bold ? '700 ' : '400 ';
    const italic = run.italic ? 'italic ' : '';
    const size = run.size || base;
    return `${italic}${weight}${size}px ${family}`;
  };
  const drawBlock = (runs, opts = {}) => {
    if (limited()) return;
    const size = opts.size || base;
    const styled = runs.map(run => ({ ...run, size: run.size || size }));
    const indent = (opts.indent || 0) + (opts.quote ? 7 * scale : 0);
    const maxWidth = Math.max(20, width - indent);
    const lineH = size * 1.45;
    const lines = boardWrapRuns(ctx, styled, maxWidth, fontOf);
    lines.forEach(lineRuns => {
      if (limited()) return;
      let lx = x + indent;
      if (opts.bullet) { ctx.fillStyle = color.muted; ctx.font = fontOf({ size }); ctx.fillText(opts.bullet, lx, cy + lineH * 0.78); lx += 9 * scale; }
      lineRuns.forEach(run => {
        ctx.font = fontOf(run);
        ctx.fillStyle = run.link ? theme.sage : (opts.color || color.muted);
        ctx.fillText(run.text, lx, cy + lineH * 0.78);
        lx += ctx.measureText(run.text).width;
      });
      cy += lineH;
    });
    cy += lineGap;
  };
  const blocks = [...root.children];
  if (!blocks.length && root.textContent.trim()) {
    drawBlock([{ text: root.textContent.trim() }]);
  }
  blocks.forEach(node => {
    if (limited()) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      const size = (tag === 'h1' ? 12 : tag === 'h2' ? 11 : 10) * scale;
      cy += 3 * scale;
      drawBlock(boardCollectInline(node), { size, color: color.ink });
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      [...node.querySelectorAll(':scope > li')].forEach((li, index) => {
        drawBlock(boardCollectInline(li), { indent: 4 * scale, bullet: tag === 'ol' ? `${index + 1}.` : '•' });
      });
      cy += 1 * scale;
      return;
    }
    if (tag === 'blockquote') {
      const startY = cy;
      drawBlock(boardCollectInline(node), { quote: true, color: color.faint });
      ctx.fillStyle = boardHexToRgba(theme.line, 1);
      ctx.fillRect(x, startY, 2, Math.max(2, cy - startY - lineGap));
      return;
    }
    if (tag === 'pre') {
      const text = node.textContent.replace(/\s+$/, '');
      const lineH = base * 1.4;
      const lines = text.split('\n');
      const boxTop = cy;
      const boxHeight = Math.min(lines.length * lineH, Math.max(0, bottom - cy)) + 6 * scale;
      ctx.fillStyle = theme.panel || '#f0eee6';
      boardRoundRect(ctx, x, boxTop, width, boxHeight, 5);
      ctx.fill();
      cy += 3 * scale;
      lines.forEach(raw => {
        if (limited()) return;
        ctx.font = fontOf({ code: true, size: base });
        ctx.fillStyle = color.ink;
        ctx.fillText(canvasTruncateText(ctx, raw, width - 8 * scale), x + 4 * scale, cy + lineH * 0.78);
        cy += lineH;
      });
      cy += 3 * scale + 2 * scale;
      return;
    }
    if (tag === 'hr') {
      ctx.strokeStyle = boardHexToRgba(theme.line, 1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, cy + 3 * scale);
      ctx.lineTo(x + width, cy + 3 * scale);
      ctx.stroke();
      cy += 7 * scale;
      return;
    }
    if (tag === 'p' || tag === 'div') { drawBlock(boardCollectInline(node)); return; }
    // 未知块：按纯文本处理
    const text = node.textContent.trim();
    if (text) drawBlock([{ text }]);
  });
}

function boardDrawCard(ctx, widget, item, X, Y, theme) {
  const show = widget.show || {};
  const done = item.type === 'todo' && isTodoComplete(item);
  const tasks = item.type === 'todo' ? (item.tasks || []) : [];
  const completedCount = tasks.filter(task => task.done).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : (done ? 100 : 0);
  const x = X(widget.x);
  const y = Y(widget.y);
  const width = widget.w || 264;
  const height = widget.h || 114;
  const padX = 12;
  const f = size => `${size * theme.fontScale}px ${theme.appFont}`;
  ctx.save();
  ctx.globalAlpha = (Number.isFinite(widget.opacity) ? Math.min(100, Math.max(30, widget.opacity)) : 100) / 100;
  ctx.shadowColor = 'rgba(47,50,43,.08)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = theme.white;
  boardRoundRect(ctx, x, y, width, height, 12);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = theme.line;
  ctx.lineWidth = 1;
  boardRoundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, 12);
  ctx.stroke();
  let cy = y + 10;
  // 顶行：类型标签 / 优先级 / 日期
  if (show.pill !== false || (show.priority !== false && item.type === 'todo') || show.date !== false) {
    let cx = x + padX;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    if (show.pill !== false) {
      const label = t(item.type).toUpperCase();
      ctx.font = `700 ${8 * theme.fontScale}px ${theme.appFont}`;
      const pillWidth = ctx.measureText(label).width + 22;
      ctx.fillStyle = item.type === 'todo' ? theme.sage2 : theme.violetSoft;
      boardRoundRect(ctx, cx, cy, pillWidth, 19, 6);
      ctx.fill();
      ctx.strokeStyle = item.type === 'todo' ? theme.sage : theme.violet;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (item.type === 'todo') {
        ctx.moveTo(cx + 8, cy + 9.5);
        ctx.lineTo(cx + 10.5, cy + 12);
        ctx.lineTo(cx + 14, cy + 7);
      } else {
        ctx.moveTo(cx + 8, cy + 5.5);
        ctx.lineTo(cx + 14, cy + 5.5);
        ctx.moveTo(cx + 8, cy + 9.5);
        ctx.lineTo(cx + 14, cy + 9.5);
        ctx.moveTo(cx + 8, cy + 13.5);
        ctx.lineTo(cx + 12, cy + 13.5);
      }
      ctx.stroke();
      ctx.fillStyle = item.type === 'todo' ? theme.sage : theme.violet;
      ctx.fillText(label, cx + 20, cy + 10.5);
      cx += pillWidth + 5;
    }
    if (show.priority !== false && item.type === 'todo') {
      const [fg, bg] = BOARD_EXPORT_PRIORITY_COLORS[item.priority || 'medium'] || BOARD_EXPORT_PRIORITY_COLORS.medium;
      const label = t(item.priority || 'medium');
      ctx.font = `700 ${8 * theme.fontScale}px ${theme.appFont}`;
      const pillWidth = ctx.measureText(label).width + 12;
      ctx.fillStyle = bg;
      boardRoundRect(ctx, cx, cy, pillWidth, 19, 6);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.fillText(label, cx + 6, cy + 10.5);
      cx += pillWidth + 5;
    }
    if (show.date !== false) {
      const stampDate = item.type === 'todo' ? todoScheduleDate(item) : item.updatedAt;
      if (stampDate) {
        ctx.font = `500 ${9 * theme.fontScale}px ${theme.appFont}`;
        ctx.fillStyle = theme.faint;
        ctx.textAlign = 'right';
        ctx.fillText(formatDate(stampDate, true), x + width - padX, cy + 10.5);
        ctx.textAlign = 'left';
      }
    }
    cy += 26;
  }
  // 标题（单行截断，与卡片 ellipsis 一致；完成态划线）
  const titleText = item.title || t(item.type === 'todo' ? 'untitledTodo' : 'untitledNote');
  ctx.font = `650 ${12 * theme.fontScale}px ${theme.appFont}`;
  ctx.fillStyle = done ? theme.muted : theme.ink;
  ctx.textBaseline = 'top';
  const drawnTitle = canvasTruncateText(ctx, titleText, width - padX * 2);
  ctx.fillText(drawnTitle, x + padX, cy + 4);
  if (done) {
    const tw = ctx.measureText(drawnTitle).width;
    ctx.strokeStyle = boardHexToRgba(theme.faint, 0.7);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + padX, cy + 4 + 8 * theme.fontScale);
    ctx.lineTo(x + padX + tw, cy + 4 + 8 * theme.fontScale);
    ctx.stroke();
  }
  cy += Math.round(16 * theme.fontScale) + 6;
  // 子待办（显示内容开关）
  if (show.tasks === true && tasks.length) {
    tasks.slice(0, 10).forEach(task => {
      ctx.lineWidth = 1.2;
      boardRoundRect(ctx, x + padX, cy + 1, 12, 12, 4);
      if (task.done) { ctx.fillStyle = theme.sage; ctx.fill(); }
      ctx.strokeStyle = task.done ? theme.sage : boardHexToRgba(theme.faint, 0.7);
      ctx.stroke();
      if (task.done) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x + padX + 3, cy + 7);
        ctx.lineTo(x + padX + 5.2, cy + 9.4);
        ctx.lineTo(x + padX + 9, cy + 4.6);
        ctx.stroke();
      }
      ctx.font = `400 ${9 * theme.fontScale}px ${theme.appFont}`;
      ctx.fillStyle = task.done ? theme.faint : theme.muted;
      ctx.fillText(canvasTruncateText(ctx, task.text, width - padX * 2 - 17), x + padX + 17, cy + 3.5);
      cy += Math.round(12 * theme.fontScale) + 3;
    });
    cy += 2;
  }
  const footY = show.foot !== false ? y + height - 9 - 12 : y + height - 9;
  // 笔记的完整内容：富文本绘制（标题 / 段落 / 列表 / 引用 / 代码），与画布上的
  // Markdown 渲染所见一致；超出卡片高度的部分按可见区域截断。
  if (item.type === 'note' && show.body === true) {
    boardDrawNoteBody(ctx, item, { x: x + padX, width: width - padX * 2, top: cy + 2, bottom: footY }, theme);
  } else if (show.preview !== false && cy + Math.round(13 * theme.fontScale) < footY) {
    // 摘要：完整内容关闭时的单行概览（空间被子待办挤占时让位）。
    ctx.font = `400 ${9 * theme.fontScale}px ${theme.appFont}`;
    ctx.fillStyle = theme.muted;
    ctx.fillText(canvasTruncateText(ctx, itemPreview(item).replace(/\s+/g, ' ').trim(), width - padX * 2), x + padX, cy + 4);
    cy += Math.round(13 * theme.fontScale) + 4;
  }
  // 底行（贴卡片底部）：归类 / 完成度或关联数
  if (show.foot !== false) {
    const folder = getFolder(item.folderId);
    ctx.font = `400 ${9 * theme.fontScale}px ${theme.appFont}`;
    ctx.fillStyle = theme.muted;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = folder?.color || '#999';
    ctx.beginPath();
    ctx.arc(x + padX + 2, footY + 6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.muted;
    ctx.fillText(canvasTruncateText(ctx, folderName(folder), width / 2), x + padX + 10, footY + 6.5);
    if (item.type === 'todo' && item.checkin) {
      const on = Boolean((item.checkins || {})[todayISO()]);
      ctx.textAlign = 'right';
      ctx.fillStyle = on ? theme.sage : theme.faint;
      ctx.fillText(`✓ ${t(on ? 'checkinDone' : 'checkinTodoYet')}`, x + width - padX, footY + 6.5);
      ctx.textAlign = 'left';
    } else if (item.type === 'todo' && !done && tasks.length && show.tasks !== true) {
      ctx.textAlign = 'right';
      ctx.fillStyle = theme.muted;
      ctx.fillText(`${completedCount}/${tasks.length}`, x + width - padX, footY + 6.5);
      const barWidth = 40;
      ctx.fillStyle = boardHexToRgba(theme.faint, 0.35);
      boardRoundRect(ctx, x + width - padX - barWidth, footY + 11, barWidth, 3, 1.5);
      ctx.fill();
      ctx.fillStyle = theme.sage;
      boardRoundRect(ctx, x + width - padX - barWidth, footY + 11, Math.max(2, barWidth * progress / 100), 3, 1.5);
      ctx.fill();
      ctx.textAlign = 'left';
    } else if (item.type === 'note' && getLinkedItems(item).length) {
      ctx.textAlign = 'right';
      ctx.strokeStyle = theme.violet;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + width - padX - ctx.measureText('0').width / 2 - 8, footY + 6.5, 4.5, Math.PI * 0.25, Math.PI * 1.6);
      ctx.stroke();
      ctx.fillStyle = theme.violet;
      ctx.fillText(String(getLinkedItems(item).length), x + width - padX, footY + 6.5);
      ctx.textAlign = 'left';
    }
  }
  ctx.restore();
}

function boardRenderToCanvas(options = {}) {
  const exportScale = Math.min(4, Math.max(1, Number(options.scale) || BOARD_EXPORT_SCALE));
  const board = activeBoard();
  if (!board.widgets.length) return null;
  const region = options.region || null;
  let ox;
  let oy;
  let width;
  let height;
  if (region) {
    ox = region.x;
    oy = region.y;
    width = Math.max(1, region.w);
    height = Math.max(1, region.h);
  } else {
    const bounds = boardBoundsOf(board.widgets.filter(widget => !widget.hidden));
    const margin = BOARD_EXPORT_MARGIN;
    width = (bounds.maxX - bounds.minX) + margin * 2;
    height = (bounds.maxY - bounds.minY) + margin * 2;
    ox = bounds.minX - margin;
    oy = bounds.minY - margin;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * exportScale);
  canvas.height = Math.round(height * exportScale);
  const ctx = canvas.getContext('2d');
  ctx.scale(exportScale, exportScale);
  const X = value => value - ox;
  const Y = value => value - oy;
  const theme = boardExportTheme();
  const style = board.style || {};
  const grid = style.gridSize || 26;
  // 底色与底纹（个性化设置随图导出：图案 / 网格颜色 / 不透明度）
  ctx.fillStyle = style.color ? boardHexToRgba(style.color) : theme.paper;
  ctx.fillRect(0, 0, width, height);
  const pattern = style.pattern || 'dots';
  if (pattern !== 'none') {
    const gridColorHex = /^#[0-9a-f]{6}$/i.test(style.gridColor || '') ? style.gridColor : theme.ink;
    const gridAlpha = Math.max(0, Math.min(60, Number.isFinite(style.gridOpacity) ? style.gridOpacity : 10)) / 100;
    ctx.strokeStyle = boardHexToRgba(gridColorHex, gridAlpha);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 1;
    const startX = Math.ceil(ox / grid) * grid;
    const startY = Math.ceil(oy / grid) * grid;
    if (pattern === 'dots') {
      for (let gx = startX; gx <= ox + width; gx += grid) {
        for (let gy = startY; gy <= oy + height; gy += grid) {
          ctx.beginPath();
          ctx.arc(X(gx), Y(gy), 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (pattern === 'grid' || pattern === 'lines' || pattern === 'cross') {
      ctx.beginPath();
      if (pattern !== 'lines') {
        for (let gx = startX; gx <= ox + width; gx += grid) {
          ctx.moveTo(X(gx), 0);
          ctx.lineTo(X(gx), height);
        }
      }
      for (let gy = startY; gy <= oy + height; gy += grid) {
        ctx.moveTo(0, Y(gy));
        ctx.lineTo(width, Y(gy));
      }
      ctx.stroke();
      if (pattern === 'cross') {
        // 交叉点：每格交点叠一枚实心小点，形似工程绘图板的十字标记
        ctx.fillStyle = boardHexToRgba(gridColorHex, Math.min(1, gridAlpha * 2.4));
        for (let gx = startX; gx <= ox + width; gx += grid) {
          for (let gy = startY; gy <= oy + height; gy += grid) {
            ctx.beginPath();
            ctx.arc(X(gx), Y(gy), 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }
  // 关联曲线（同板互链的卡片之间，垫在组件之下）
  if (boardState.prefs.linkCurves) {
    const byRef = new Map(board.widgets.filter(w => w.type === 'note' || w.type === 'todo').map(w => [w.ref, w]));
    const seen = new Set();
    ctx.strokeStyle = boardHexToRgba(theme.sage, 0.48);
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.setLineDash([4, 5]);
    board.widgets.forEach(widget => {
      if (widget.type !== 'note' && widget.type !== 'todo') return;
      const item = library.items.find(entry => entry.id === widget.ref);
      (item?.linkedIds || []).forEach(ref => {
        const other = byRef.get(ref);
        if (!other || other === widget) return;
        const key = [widget.ref, ref].sort().join('~');
        if (seen.has(key)) return;
        seen.add(key);
        const aSize = boardWidgetSize(widget);
        const bSize = boardWidgetSize(other);
        const ax = X(widget.x + aSize.w / 2);
        const ay = Y(widget.y + aSize.h / 2);
        const bx = X(other.x + bSize.w / 2);
        const by = Y(other.y + bSize.h / 2);
        const dx = bx - ax;
        const dy = by - ay;
        const horizontal = Math.abs(dx) >= Math.abs(dy);
        const bend = Math.max(Math.abs(horizontal ? dx : dy) * 0.35, 34);
        const signX = Math.sign(dx) || 1;
        const signY = Math.sign(dy) || 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.bezierCurveTo(
          ax + (horizontal ? signX * bend : 0), ay + (horizontal ? 0 : signY * bend),
          bx - (horizontal ? signX * bend : 0), by - (horizontal ? 0 : signY * bend),
          bx, by
        );
        ctx.stroke();
      });
    });
    ctx.setLineDash([]);
  }
  // 组件顺序与画布 DOM 一致：标注在下、文本其上、卡片最上；隐藏图层不导出。
  board.widgets.filter(widget => widget.type === 'marker' && !widget.hidden).forEach(widget => boardDrawMarker(ctx, widget, X, Y, theme));
  board.widgets.filter(widget => widget.type === 'text' && !widget.hidden).forEach(widget => boardDrawTextWidget(ctx, widget, X, Y, theme));
  board.widgets.filter(widget => (widget.type === 'note' || widget.type === 'todo') && !widget.hidden).forEach(widget => {
    const item = library.items.find(entry => entry.id === widget.ref);
    if (item) boardDrawCard(ctx, widget, item, X, Y, theme);
  });
  return { canvas, width, height };
}

// —— 导出区域选择：导出图片 / PDF 前在画布上框定范围 ——
// 默认框为"包含全部元素、四边等距留白"的区域；可拖动整框或八个角/边手柄
// 调整，也可以一键切回全部元素或当前视图。世界矩形与相机解耦，导出渲染
// 不受取景影响。
function boardWidgetVisualBounds(widget) {
  if (widget.type === 'marker') {
    if (widget.kind === 'draw') {
      const points = widget.points || [];
      let minX = 0;
      let minY = 0;
      let maxX = 1;
      let maxY = 1;
      for (let i = 0; i + 1 < points.length; i += 2) {
        if (i === 0 || points[i] < minX) minX = points[i];
        if (i === 0 || points[i + 1] < minY) minY = points[i + 1];
        if (points[i] > maxX) maxX = points[i];
        if (points[i + 1] > maxY) maxY = points[i + 1];
      }
      return { x: widget.x + minX, y: widget.y + minY, w: Math.max(maxX - minX, 1), h: Math.max(maxY - minY, 1) };
    }
    return { x: Math.min(widget.x, widget.x + widget.w), y: Math.min(widget.y, widget.y + widget.h), w: Math.max(Math.abs(widget.w), 1), h: Math.max(Math.abs(widget.h), 1) };
  }
  const size = boardWidgetSize(widget);
  return { x: widget.x, y: widget.y, w: size.w, h: size.h };
}

function boardExportContentRegion() {
  const widgets = activeBoard().widgets;
  if (!widgets.length) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  widgets.forEach(widget => {
    const bounds = boardWidgetVisualBounds(widget);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.w);
    maxY = Math.max(maxY, bounds.y + bounds.h);
  });
  return {
    x: minX - BOARD_EXPORT_MARGIN,
    y: minY - BOARD_EXPORT_MARGIN,
    w: (maxX - minX) + BOARD_EXPORT_MARGIN * 2,
    h: (maxY - minY) + BOARD_EXPORT_MARGIN * 2
  };
}

// 临时取景：缩放不受画布限制（超小板也能整框入镜），恢复相机由调用方负责。
function boardFitCameraToRect(rect) {
  const { w, h } = boardViewportSize();
  const pad = Math.min(96, Math.max(28, w * 0.08));
  const scale = Math.min(4, Math.max(0.05, Math.min((w - pad * 2) / rect.w, (h - pad * 2) / rect.h)));
  boardCam.scale = scale;
  boardCam.x = (w - rect.w * scale) / 2 - rect.x * scale;
  boardCam.y = (h - rect.h * scale) / 2 - rect.y * scale;
  boardApplyCamera();
}

function boardSelectExportRegion() {
  return new Promise(resolve => {
    const canvas = boardEls?.canvas;
    const region = boardExportContentRegion();
    if (!canvas || !region) { resolve(null); return; }
    const savedCam = { x: boardCam.x, y: boardCam.y, scale: boardCam.scale };
    boardStopMotion();
    boardFitCameraToRect(region);
    const dirs = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    const layer = document.createElement('div');
    layer.className = 'board-export-region';
    layer.innerHTML = `
      <div class="board-export-frame" data-export-frame>
        ${dirs.map(dir => `<i class="board-export-handle" data-export-handle="${dir}" data-dir="${dir}"></i>`).join('')}
      </div>
      <div class="board-export-region-bar">
        <b>${escapeHTML(t('boardExportRegionTitle'))}</b>
        <small>${escapeHTML(t('boardExportRegionHint'))}</small>
        <span class="board-export-region-spacer"></span>
        <button type="button" data-export-region="all">${escapeHTML(t('boardExportRegionAll'))}</button>
        <button type="button" data-export-region="view">${escapeHTML(t('boardExportRegionView'))}</button>
        <button type="button" data-export-region="cancel">${escapeHTML(t('cancel'))}</button>
        <button type="button" class="is-primary" data-export-region="next">${escapeHTML(t('boardExportRegionNext'))}</button>
      </div>`;
    canvas.appendChild(layer);
    canvas.classList.add('is-export-region');
    const frame = layer.querySelector('.board-export-frame');
    const state = { world: { ...region }, dir: null, start: null };
    const viewportSize = () => ({ w: boardEls.viewport.clientWidth, h: boardEls.viewport.clientHeight });
    const MIN_SCREEN = 80;
    const paint = () => {
      const s = boardCam.scale;
      frame.style.left = `${boardCam.x + state.world.x * s}px`;
      frame.style.top = `${boardCam.y + state.world.y * s}px`;
      frame.style.width = `${state.world.w * s}px`;
      frame.style.height = `${state.world.h * s}px`;
    };
    // 屏幕空间夹取：框始终留在画布可视区内（手柄够得着），最小 80px。
    const clampWorld = () => {
      const { w, h } = viewportSize();
      const s = boardCam.scale;
      let left = boardCam.x + state.world.x * s;
      let top = boardCam.y + state.world.y * s;
      let width = state.world.w * s;
      let height = state.world.h * s;
      width = Math.min(Math.max(width, MIN_SCREEN), Math.max(MIN_SCREEN, w));
      height = Math.min(Math.max(height, MIN_SCREEN), Math.max(MIN_SCREEN, h));
      left = Math.min(Math.max(left, 0), Math.max(0, w - width));
      top = Math.min(Math.max(top, 0), Math.max(0, h - height));
      state.world = {
        x: (left - boardCam.x) / s,
        y: (top - boardCam.y) / s,
        w: width / s,
        h: height / s
      };
    };
    const onKey = event => {
      if (event.key !== 'Escape' || isImeComposing(event)) return;
      event.preventDefault();
      cleanup(null);
    };
    // 画布被整壳重建（数据刷新等）时选择层会随 DOM 消失：兜底结算，避免 Promise 悬挂。
    const observer = new MutationObserver(() => {
      if (layer.isConnected) return;
      observer.disconnect();
      document.removeEventListener('keydown', onKey);
      canvas.classList.remove('is-export-region');
      Object.assign(boardCam, savedCam);
      boardApplyCamera();
      resolve(null);
    });
    observer.observe(canvas, { childList: true });
    const cleanup = value => {
      observer.disconnect();
      document.removeEventListener('keydown', onKey);
      layer.remove();
      canvas.classList.remove('is-export-region');
      Object.assign(boardCam, savedCam);
      boardApplyCamera();
      resolve(value);
    };
    layer.addEventListener('pointerdown', event => {
      const handle = event.target.closest('[data-export-handle]');
      const onFrame = event.target.closest('[data-export-frame]');
      if (!handle && !onFrame) return;
      event.preventDefault();
      event.stopPropagation();
      layer.setPointerCapture(event.pointerId);
      state.dir = handle ? handle.dataset.dir : 'move';
      state.start = { x: event.clientX, y: event.clientY, world: { ...state.world } };
    });
    layer.addEventListener('pointermove', event => {
      if (!state.dir || !state.start) return;
      const s = boardCam.scale;
      const dx = (event.clientX - state.start.x) / s;
      const dy = (event.clientY - state.start.y) / s;
      const base = state.start.world;
      const dir = state.dir;
      let x = base.x;
      let y = base.y;
      let w = base.w;
      let h = base.h;
      if (dir === 'move') { x = base.x + dx; y = base.y + dy; }
      else {
        if (dir.includes('e')) w = base.w + dx;
        if (dir.includes('w')) { x = base.x + dx; w = base.w - dx; }
        if (dir.includes('s')) h = base.h + dy;
        if (dir.includes('n')) { y = base.y + dy; h = base.h - dy; }
      }
      state.world = { x, y, w, h };
      clampWorld();
      paint();
    });
    const endDrag = () => { state.dir = null; state.start = null; };
    layer.addEventListener('pointerup', endDrag);
    layer.addEventListener('pointercancel', endDrag);
    layer.addEventListener('click', event => {
      const action = event.target.closest('[data-export-region]')?.dataset.exportRegion;
      if (!action) return;
      event.preventDefault();
      if (action === 'cancel') { cleanup(null); return; }
      if (action === 'all') {
        const all = boardExportContentRegion();
        if (all) { state.world = { ...all }; boardFitCameraToRect(state.world); paint(); }
        return;
      }
      if (action === 'view') {
        const { w, h } = viewportSize();
        state.world = { x: -boardCam.x / boardCam.scale, y: -boardCam.y / boardCam.scale, w: w / boardCam.scale, h: h / boardCam.scale };
        clampWorld();
        paint();
        return;
      }
      cleanup({ rect: { ...state.world } });
    });
    document.addEventListener('keydown', onKey);
    paint();
  });
}

// 导出选项：分辨率倍率、图片格式（PNG / JPG）与 JPG 压缩质量。
function askBoardExportOptions(kind) {
  return new Promise(resolve => {
    const dialog = document.createElement('dialog');
    dialog.className = 'relation-dialog board-export-dialog';
    const state = { scale: 2, format: 'png', quality: 0.9 };
    dialog.innerHTML = `
      <header class="relation-dialog-head"><span><svg><use href="#i-image"/></svg></span><div><h3>${escapeHTML(t(kind === 'pdf' ? 'boardExportPdf' : 'boardExportImage'))}</h3><small>${escapeHTML(t('boardExportOptionsHint'))}</small></div><button class="relation-dialog-close" type="button" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></header>
      <div class="relation-dialog-body board-export-options">
        <div class="board-style-row"><span>${escapeHTML(t('boardExportScale'))}</span><div class="board-import-seg" role="group">${[1, 2, 3].map(scale => `<button type="button" data-export-scale="${scale}"${scale === state.scale ? ' class="active"' : ''}>${scale}×</button>`).join('')}</div></div>
        <div class="board-style-row"><span>${escapeHTML(t('boardExportFormat'))}</span><div class="board-import-seg" role="group"><button type="button" data-export-format="png" class="active">PNG</button><button type="button" data-export-format="jpg">JPG</button></div></div>
        <div class="board-style-row"><span>${escapeHTML(t('boardExportQuality'))}</span><input type="range" min="50" max="100" step="5" value="${state.quality * 100}" data-export-quality disabled aria-label="${escapeHTML(t('boardExportQuality'))}"/><output>90%</output></div>
      </div>
      <footer class="settings-actions board-import-actions">
        <button type="button" class="settings-button secondary" data-export-cancel>${escapeHTML(t('cancel'))}</button>
        <button type="button" class="settings-button" data-export-confirm><svg><use href="#i-check"/></svg><span>${escapeHTML(t('boardExportConfirm'))}</span></button>
      </footer>`;
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      resolve(value);
      if (dialog.open) dialog.close();
      dialog.remove();
    };
    const qualityRow = () => dialog.querySelector('[data-export-quality]');
    const syncQuality = () => {
      const input = qualityRow();
      input.disabled = state.format !== 'jpg';
      input.value = String(Math.round(state.quality * 100));
      const output = input.parentElement?.querySelector('output');
      if (output) output.textContent = `${Math.round(state.quality * 100)}%`;
    };
    dialog.addEventListener('click', event => {
      const scaleButton = event.target.closest('[data-export-scale]');
      if (scaleButton) {
        state.scale = Number(scaleButton.dataset.exportScale);
        $$('[data-export-scale]', dialog).forEach(button => button.classList.toggle('active', button === scaleButton));
        return;
      }
      const formatButton = event.target.closest('[data-export-format]');
      if (formatButton) {
        state.format = formatButton.dataset.exportFormat;
        $$('[data-export-format]', dialog).forEach(button => button.classList.toggle('active', button === formatButton));
        syncQuality();
        return;
      }
      if (event.target.closest('[data-export-cancel]')) { finish(null); return; }
      if (event.target.closest('[data-export-confirm]')) { finish({ ...state }); }
    });
    dialog.addEventListener('input', event => {
      const slider = event.target.closest('[data-export-quality]');
      if (!slider) return;
      state.quality = Number(slider.value) / 100;
      const output = slider.parentElement?.querySelector('output');
      if (output) output.textContent = `${slider.value}%`;
    });
    dialog.querySelector('.relation-dialog-close').addEventListener('click', () => finish(null));
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(null); });
    dialog.addEventListener('close', () => finish(null));
    syncQuality();
    document.body.appendChild(dialog);
    dialog.showModal();
  });
}

async function boardExportImage() {
  if (!activeBoard().widgets.length) { showToast(t('boardExportEmpty')); return null; }
  const selection = await boardSelectExportRegion();
  if (!selection) return null;
  const options = await askBoardExportOptions('image');
  if (!options) return null;
  // 安卓端渲染 + 编码 + 桥传输可能明显偏慢：确认后即弹出进行中提示，
  // 直到成功 / 失败的结果提示覆盖，或用户取消保存时收起。
  const androidExport = Boolean(window.Capacitor?.Plugins?.ActaSync?.exportAsset) && !window.actaDesktop;
  if (androidExport) showToast(t('boardExportWorking'), 60000, true);
  const rendered = boardRenderToCanvas({ scale: options.scale, region: selection.rect });
  if (!rendered) { if (androidExport) hideBusyToast(); showToast(t('boardExportEmpty')); return null; }
  const jpg = options.format === 'jpg';
  const mimeType = jpg ? 'image/jpeg' : 'image/png';
  const blob = await new Promise(resolve => rendered.canvas.toBlob(resolve, mimeType, jpg ? options.quality : undefined));
  if (!blob) { if (androidExport) hideBusyToast(); showToast(t('boardExportFailed')); return null; }
  const saved = await boardSaveBlob(`${boardExportBaseName()}.${jpg ? 'jpg' : 'png'}`, blob);
  if (!saved && androidExport) hideBusyToast();
  if (saved) showToast(typeof saved === 'string' && saved !== 'download' && saved !== 'native' ? `${t('boardExportDone')}${saved}` : t('boardExportDone'));
  return saved;
}

async function boardExportPdf() {
  if (!activeBoard().widgets.length) { showToast(t('boardExportEmpty')); return null; }
  const { PDFDocument, rgb } = window.PDFLib || {};
  if (!PDFDocument) { showToast(t('boardExportFailed')); return null; }
  const selection = await boardSelectExportRegion();
  if (!selection) return null;
  const options = await askBoardExportOptions('pdf');
  if (!options) return null;
  const androidExport = Boolean(window.Capacitor?.Plugins?.ActaSync?.exportAsset) && !window.actaDesktop;
  if (androidExport) showToast(t('boardExportWorking'), 60000, true);
  const rendered = boardRenderToCanvas({ scale: options.scale, region: selection.rect });
  if (!rendered) { if (androidExport) hideBusyToast(); showToast(t('boardExportEmpty')); return null; }
  const jpg = options.format === 'jpg';
  const dataUrl = rendered.canvas.toDataURL(jpg ? 'image/jpeg' : 'image/png', jpg ? options.quality : undefined);
  const pdf = await PDFDocument.create();
  const image = jpg ? await pdf.embedJpg(dataUrl) : await pdf.embedPng(dataUrl);
  // 页面尺寸按画布逻辑像素换算为 pt（1px = 0.75pt），保持排版比例。
  const pageWidth = rendered.width * 0.75;
  const pageHeight = rendered.height * 0.75;
  const page = pdf.addPage([pageWidth, pageHeight]);
  page.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });
  const bytes = await pdf.save();
  const saved = await boardSaveBlob(`${boardExportBaseName()}.pdf`, new Blob([bytes], { type: 'application/pdf' }));
  if (!saved && androidExport) hideBusyToast();
  if (saved) showToast(typeof saved === 'string' && saved !== 'download' && saved !== 'native' ? `${t('boardExportDone')}${saved}` : t('boardExportDone'));
  return saved;
}

async function boardMenuAction(action) {
  const boards = ensureBoards();
  const board = activeBoard();
  boardToggleMenu(false);
  if (action === 'export-plan') { await boardExportPlanFile(); return; }
  if (action === 'export-image') { await boardExportImage(); return; }
  if (action === 'export-pdf') { await boardExportPdf(); return; }
  if (action === 'import-plan') { await boardImportPlanFile(); return; }
  if (action === 'new') {
    const name = await askNameDialog({ title: t('boardNamePrompt'), defaultValue: `${t('boardDefaultName')} ${boards.length + 1}`, icon: '#i-board' });
    if (!name) return;
    const created = { id: uid(), name, widgets: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    boards.push(created);
    boardState.activeBoardId = created.id;
    touchBoard(created);
    persist();
    renderList();
    return;
  }
  if (action === 'rename') {
    const name = await askNameDialog({ title: t('boardRenameBoard'), defaultValue: board.name, icon: '#i-edit', confirmIcon: '#i-check' });
    if (!name || name === board.name) return;
    board.name = name;
    touchBoard(board);
    persist();
    renderList();
    return;
  }
  if (action === 'delete') {
    if (!await askDestroyConfirm({ itemLabel: board.name, message: t('boardDeleteConfirm').replace('{0}', board.name) })) return;
    library.boards = boards.filter(entry => entry.id !== board.id);
    delete boardState.cams[board.id];
    persist();
    ensureBoards();
    boardState.activeBoardId = library.boards[0]?.id || null;
    renderList();
  }
}

// —— 导入对话框：按类型 / 归类 / 搜索过滤，多选导入；取消勾选即从板上移除 ——
function askBoardImport(board) {
  return new Promise(resolve => {
    const dialog = document.createElement('dialog');
    dialog.className = 'relation-dialog board-import-dialog';
    const existing = new Set(board.widgets.filter(widget => widget.type === 'note' || widget.type === 'todo').map(widget => widget.ref));
    const state = { type: 'all', folder: 'all', query: '', selected: new Set(existing) };
    const folderOptions = [
      `<option value="all">${escapeHTML(t('allFolders'))}</option>`,
      ...library.folders.map(folder => `<option value="${escapeHTML(folder.id)}">${escapeHTML(folderName(folder))}</option>`)
    ].join('');
    dialog.innerHTML = `
      <header class="relation-dialog-head"><span><svg><use href="#i-board"/></svg></span><div><h3>${escapeHTML(t('boardImportTitle'))}</h3><small>${escapeHTML(t('boardImportHint'))}</small></div><button class="relation-dialog-close" type="button" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></header>
      <div class="relation-dialog-body board-import-body">
        <div class="board-import-filters">
          <div class="board-import-seg" role="group">
            <button type="button" data-import-type="all" class="active">${escapeHTML(t('all'))}</button>
            <button type="button" data-import-type="todo">${escapeHTML(t('todos'))}</button>
            <button type="button" data-import-type="note">${escapeHTML(t('notes'))}</button>
          </div>
          <label class="board-import-folder"><select id="boardImportFolder">${folderOptions}</select></label>
          <label class="board-import-search"><svg><use href="#i-search"/></svg><input id="boardImportQuery" type="search" placeholder="${escapeHTML(t('search'))}"/></label>
        </div>
        <div class="board-import-list" id="boardImportList" role="list"></div>
      </div>
      <footer class="settings-actions board-import-actions">
        <button type="button" class="settings-button secondary" data-import-cancel>${escapeHTML(t('cancel'))}</button>
        <button type="button" class="settings-button" data-import-apply disabled><svg><use href="#i-plus"/></svg><span id="boardImportApplyLabel">${escapeHTML(t('boardImportApply'))}</span></button>
      </footer>`;
    const listEl = () => dialog.querySelector('#boardImportList');
    const applyButton = () => dialog.querySelector('[data-import-apply]');
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      resolve(value);
      if (dialog.open) dialog.close();
      dialog.remove();
    };
    const visibleItems = () => {
      let items = activeItems();
      if (state.type !== 'all') items = items.filter(item => item.type === state.type);
      if (state.folder !== 'all') items = items.filter(item => item.folderId === state.folder);
      if (state.query) items = items.filter(item => `${item.title || ''}\n${stripHTML(item.body || '')}\n${(item.tasks || []).map(task => task.text).join('\n')}`.toLowerCase().includes(state.query.toLowerCase()));
      return items.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    };
    const syncApply = () => {
      const add = [...state.selected].filter(id => !existing.has(id)).length;
      const remove = [...existing].filter(id => !state.selected.has(id)).length;
      const label = dialog.querySelector('#boardImportApplyLabel');
      if (add + remove) {
        applyButton().disabled = false;
        label.textContent = t('boardImportChange').replace('{0}', add).replace('{1}', remove);
      } else {
        applyButton().disabled = true;
        label.textContent = t('boardImportApply');
      }
    };
    const renderListRows = () => {
      try {
        renderRows();
      } catch (error) {
        listEl().innerHTML = `<p class="board-import-empty">${escapeHTML(String(error?.message || error))}</p>`;
      }
    };
    const renderRows = () => {
      const items = visibleItems();
      listEl().innerHTML = items.length ? items.map(item => {
        const folder = getFolder(item.folderId);
        const onBoard = existing.has(item.id);
        const checked = state.selected.has(item.id);
        // 纯按钮行：不嵌原生 checkbox——label + 隐藏 input 依赖转发点击，
        // 在部分 WebView 下行为不一致（点击无响应甚至白屏），状态也易与 UI 不同步。
        return `<button type="button" class="board-import-row${checked ? ' is-checked' : ''}" data-import-row="${escapeHTML(item.id)}" role="listitem" aria-pressed="${checked}">
          <i class="board-import-check"><svg><use href="#i-check"/></svg></i>
          <span class="type-pill ${item.type}"><svg><use href="#i-${item.type === 'todo' ? 'check' : 'note'}"/></svg>${t(item.type)}</span>
          <b>${escapeHTML(item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote')))}</b>
          <small><span class="mini-folder"><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span></small>
          ${onBoard ? `<em class="board-import-added">${escapeHTML(t('boardImportAdded'))}</em>` : ''}
        </button>`;
      }).join('') : `<p class="board-import-empty">${escapeHTML(t('boardImportEmpty'))}</p>`;
    };
    dialog.addEventListener('click', event => {
      const typeButton = event.target.closest('[data-import-type]');
      if (typeButton) {
        state.type = typeButton.dataset.importType;
        $$('[data-import-type]', dialog).forEach(button => button.classList.toggle('active', button === typeButton));
        renderListRows();
        return;
      }
      const row = event.target.closest('[data-import-row]');
      if (row) {
        const id = row.dataset.importRow;
        const next = !state.selected.has(id);
        if (next) state.selected.add(id);
        else state.selected.delete(id);
        row.classList.toggle('is-checked', next);
        row.setAttribute('aria-pressed', String(next));
        syncApply();
      }
    });
    dialog.querySelector('#boardImportFolder').addEventListener('change', event => {
      state.folder = event.target.value;
      renderListRows();
    });
    dialog.querySelector('#boardImportQuery').addEventListener('input', event => {
      state.query = event.target.value.trim();
      renderListRows();
    });
    dialog.querySelector('[data-import-cancel]').addEventListener('click', () => finish(null));
    dialog.querySelector('.relation-dialog-close').addEventListener('click', () => finish(null));
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(null); });
    dialog.addEventListener('close', () => finish(null));
    dialog.querySelector('[data-import-apply]').addEventListener('click', () => {
      const add = [...state.selected].filter(id => !existing.has(id));
      const remove = [...existing].filter(id => !state.selected.has(id));
      finish({ add, remove });
    });
    renderListRows();
    syncApply();
    document.body.appendChild(dialog);
    dialog.showModal();
  });
}

async function boardRunImport() {
  const board = activeBoard();
  const result = await askBoardImport(board);
  if (!result || (!result.add.length && !result.remove.length)) return;
  boardPushUndo();
  const removeSet = new Set(result.remove);
  if (removeSet.size) board.widgets = board.widgets.filter(widget => !removeSet.has(widget.ref));
  result.add.forEach(id => {
    const item = library.items.find(entry => entry.id === id && !entry.deletedAt);
    if (!item) return;
    const spot = boardVacantSpot();
    // 字段与画布新建的组件一致：补全尺寸与显示默认值，避免渲染期读缺省。
    board.widgets.push({
      id: uid(), type: item.type, ref: item.id, x: spot.x, y: spot.y,
      w: BOARD_CARD_W, h: BOARD_CARD_H, opacity: 100,
      show: { pill: true, priority: true, date: true, tasks: false, body: false, preview: true, foot: true }
    });
  });
  touchBoard(board);
  persist();
  renderList();
}

function boardCancelWidgetSelection() {
  if (boardSelection.size) boardSetSelection([]);
}

// 板选择器胶囊挂在视图标题右侧（离开计划板时摘下）。
let boardPillEl = null;
function boardEnsurePill() {
  const titleRow = $('.item-title-row');
  if (!titleRow) return null;
  if (boardPillEl && document.contains(boardPillEl)) return boardPillEl;
  boardPillEl = document.createElement('div');
  boardPillEl.className = 'board-pill';
  boardPillEl.id = 'boardPill';
  boardPillEl.innerHTML = `
    <button type="button" class="board-pill-button" id="boardPillButton" aria-haspopup="menu" aria-expanded="false"><svg><use href="#i-board"/></svg><b id="boardPillName"></b><svg class="board-pill-chevron"><use href="#i-chevron"/></svg></button>
    <div class="board-pill-menu" id="boardPillMenu" role="menu" hidden></div>`;
  titleRow.appendChild(boardPillEl);
  // 绑定跟随元素创建（title-row 不随 renderList 重建，绑定放这里只发生一次；
  // 放在 bindBoardScene 会随每次重建叠加监听器，一次点击触发多次导出）。
  $('#boardPillButton', boardPillEl).addEventListener('click', () => boardToggleMenu());
  $('#boardPillMenu', boardPillEl).addEventListener('click', async event => {
    const goto = event.target.closest('[data-board-goto]');
    if (goto) {
      const id = goto.dataset.boardGoto;
      // 切换后必须收起菜单：菜单挂在 title-row 上，renderList 重建的只是画布壳，
      // 留在原地的旧菜单里高亮还停在切换前的板上（菜单重开时才重渲染）。
      boardToggleMenu(false);
      if (boardState.activeBoardId !== id) {
        boardState.activeBoardId = id;
        boardUndoStack.length = 0;
        boardRedoStack.length = 0;
        boardSetSelection([]);
        persistBoardState();
        renderList();
      }
      return;
    }
    const action = event.target.closest('[data-board-action]');
    if (action) boardMenuAction(action.dataset.boardAction);
  });
  return boardPillEl;
}

function boardRemovePill() {
  boardToggleMenu(false);
  boardPillEl?.remove();
  boardPillEl = null;
}

// 个性化按钮挂在标题行最右（与板选择器同一行，离开计划板时摘下）。
let boardStyleTriggerEl = null;
function boardEnsureStyleTrigger() {
  const titleRow = $('.item-title-row');
  if (!titleRow) return null;
  if (boardStyleTriggerEl && document.contains(boardStyleTriggerEl)) return boardStyleTriggerEl;
  boardStyleTriggerEl = document.createElement('button');
  boardStyleTriggerEl.type = 'button';
  boardStyleTriggerEl.className = 'board-style-trigger';
  boardStyleTriggerEl.id = 'boardStyleTrigger';
  boardStyleTriggerEl.title = t('boardPersonalize');
  boardStyleTriggerEl.setAttribute('aria-label', t('boardPersonalize'));
  boardStyleTriggerEl.setAttribute('aria-haspopup', 'dialog');
  boardStyleTriggerEl.innerHTML = '<svg><use href="#i-palette"/></svg>';
  titleRow.appendChild(boardStyleTriggerEl);
  // 绑定跟随元素创建（同板选择器：避免随 renderList 叠加导致浮层开即关）。
  boardStyleTriggerEl.addEventListener('click', () => {
    const pop = $('#boardStylePop', boardEls?.canvas || document);
    if (pop && !pop.hidden) { pop.hidden = true; return; }
    boardRenderStylePop();
  });
  return boardStyleTriggerEl;
}

function boardRemoveStyleTrigger() {
  $('#boardStylePop', boardEls?.canvas || document)?.remove();
  boardStyleTriggerEl?.remove();
  boardStyleTriggerEl = null;
}

// —— 图层面板：以 z 序列出板上全部元素，组（groupId）聚合展示；
// 支持选中、显隐；笔绘会话自动成组，Ctrl/⌘+G 组合所选、+Shift 解组。 ——
let boardLayerTriggerEl = null;

function boardEnsureLayerTrigger() {
  const titleRow = $('.item-title-row');
  if (!titleRow) return null;
  if (boardLayerTriggerEl && document.contains(boardLayerTriggerEl)) return boardLayerTriggerEl;
  if (!boardStyleTriggerEl) return null;
  boardLayerTriggerEl = document.createElement('button');
  boardLayerTriggerEl.type = 'button';
  boardLayerTriggerEl.className = 'board-style-trigger board-layer-trigger';
  boardLayerTriggerEl.id = 'boardLayerTrigger';
  boardLayerTriggerEl.title = t('boardLayers');
  boardLayerTriggerEl.setAttribute('aria-label', t('boardLayers'));
  boardLayerTriggerEl.setAttribute('aria-haspopup', 'dialog');
  boardLayerTriggerEl.innerHTML = '<svg><use href="#i-layers"/></svg>';
  // 图层按钮在个性化按钮左侧（同一行、同一材质）。右推的 auto 边距移到
  // 图层按钮上，两钮相邻成组；卸载时还原个性化按钮的推法。
  titleRow.insertBefore(boardLayerTriggerEl, boardStyleTriggerEl);
  boardStyleTriggerEl.style.marginLeft = 'auto';
  boardLayerTriggerEl.style.marginLeft = 'auto';
  boardStyleTriggerEl.style.marginLeft = '0';
  boardLayerTriggerEl.addEventListener('click', () => {
    const pop = $('#boardLayerPop', boardEls?.canvas || document);
    if (pop && !pop.hidden) { pop.hidden = true; return; }
    boardRenderLayerPop();
  });
  return boardLayerTriggerEl;
}

function boardRemoveLayerTrigger() {
  $('#boardLayerPop', boardEls?.canvas || document)?.remove();
  if (boardStyleTriggerEl) boardStyleTriggerEl.style.marginLeft = '';
  boardLayerTriggerEl?.remove();
  boardLayerTriggerEl = null;
}

function boardLayerName(widget) {
  if (widget.type === 'note' || widget.type === 'todo') {
    const item = library.items.find(entry => entry.id === widget.ref);
    return item?.title || t(widget.type === 'note' ? 'untitledNote' : 'untitledTodo');
  }
  if (widget.type === 'text') return (widget.text || '').split('\n')[0].trim().slice(0, 24) || t('boardAddText');
  const names = { arrow: t('boardMarkerArrow'), rect: t('boardMarkerRect'), ellipse: t('boardMarkerEllipse'), line: t('boardMarkerLine'), draw: t('boardMarkerDraw') };
  return names[widget.kind] || t('boardAddMarker');
}

function boardLayerIcon(widget) {
  if (widget.type === 'note' || widget.type === 'todo') return 'i-board';
  if (widget.type === 'text') return 'i-text';
  return widget.kind === 'draw' ? 'i-edit' : 'i-marker';
}

function boardLayerRow(widget, isChild = false) {
  const selected = boardSelection.has(widget.id) ? ' is-selected' : '';
  return `<button type="button" class="board-layer-row${isChild ? ' is-child' : ''}${selected}" data-layer-pick="${escapeHTML(widget.id)}">
    <svg><use href="#${boardLayerIcon(widget)}"/></svg><span>${escapeHTML(boardLayerName(widget))}</span>
    <i class="board-layer-eye${widget.hidden ? ' is-off' : ''}" data-layer-toggle="${escapeHTML(widget.id)}" title="${escapeHTML(widget.hidden ? t('boardLayerShow') : t('boardLayerHide'))}"><svg><use href="#${widget.hidden ? 'i-eye-off' : 'i-eye'}"/></svg></i>
  </button>`;
}

function boardRenderLayerPop() {
  const board = boardLayoutCache?.board || activeBoard();
  // 浮层互斥：图层面板打开时收起个性化与标注样式面板。
  $('#boardStylePop', boardEls?.canvas || document)?.remove();
  boardCloseMarkerPop();
  let pop = $('#boardLayerPop', boardEls?.canvas || document);
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'boardLayerPop';
    pop.className = 'board-style-pop board-style-pop-lg board-layer-pop';
    pop.setAttribute('role', 'dialog');
    boardEls.canvas.appendChild(pop);
  }
  // z 序与画布 DOM 一致：卡片最上、文本其上、标注铺底；段内后画的在上。
  const section = types => board.widgets.filter(widget => types.includes(widget.type)).reverse();
  const zOrder = [
    ...section(['note', 'todo']),
    ...section(['text']),
    ...section(['marker'])
  ];
  const groupDone = new Set();
  const rows = zOrder.map(widget => {
    if (!widget.groupId) return boardLayerRow(widget);
    if (groupDone.has(widget.groupId)) return '';
    groupDone.add(widget.groupId);
    const members = zOrder.filter(entry => entry.groupId === widget.groupId);
    const selected = members.every(entry => boardSelection.has(entry.id));
    const allHidden = members.every(entry => entry.hidden);
    const childRows = members.map(entry => boardLayerRow(entry, true)).join('');
    return `<button type="button" class="board-layer-row is-group${selected ? ' is-selected' : ''}" data-layer-pick-group="${escapeHTML(widget.groupId)}">
      <svg><use href="#i-layers"/></svg><span>${escapeHTML(t('boardLayerGroup'))} · ${members.length}</span>
      <i class="board-layer-eye${allHidden ? ' is-off' : ''}" data-layer-toggle-group="${escapeHTML(widget.groupId)}" title="${escapeHTML(allHidden ? t('boardLayerShow') : t('boardLayerHide'))}"><svg><use href="#${allHidden ? 'i-eye-off' : 'i-eye'}"/></svg></i>
    </button>${childRows}`;
  }).join('');
  pop.innerHTML = `<div class="board-style-pop-head"><b>${escapeHTML(t('boardLayers'))}</b><button type="button" data-layer-close title="${escapeHTML(t('cancel'))}" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></div>
    <div class="board-layer-list">${rows || `<div class="board-import-empty">${escapeHTML(t('boardEmptyHint'))}</div>`}</div>`;
  pop.hidden = false;
}

// 面板开着时同步重渲染（绘制提交 / 删除 / 选中变化后调用；关着直接返回）。
function boardSyncLayerPop() {
  const pop = $('#boardLayerPop', boardEls?.canvas || document);
  if (!pop || pop.hidden) return;
  boardRenderLayerPop();
}

// 组合所选：选中 ≥2 个元素时给它们统一 groupId（Ctrl/⌘+G）。
function boardGroupSelection() {
  if (boardSelection.size < 2 || currentView !== 'board') return;
  const board = boardLayoutCache?.board || activeBoard();
  const targets = board.widgets.filter(widget => boardSelection.has(widget.id));
  if (targets.length < 2) return;
  boardPushUndo();
  const groupId = uid();
  targets.forEach(widget => { widget.groupId = groupId; });
  touchBoard(board);
  persist();
  boardSyncLayerPop();
}

// 解组：选中成员所在的组整体解散（Ctrl/⌘+Shift+G）。
function boardUngroupSelection() {
  if (!boardSelection.size || currentView !== 'board') return;
  const board = boardLayoutCache?.board || activeBoard();
  const groups = new Set(board.widgets.filter(widget => boardSelection.has(widget.id)).map(widget => widget.groupId).filter(Boolean));
  if (!groups.size) return;
  boardPushUndo();
  board.widgets.forEach(widget => { if (groups.has(widget.groupId)) delete widget.groupId; });
  touchBoard(board);
  persist();
  boardSyncLayerPop();
}

function bindBoardScene() {
  const canvas = $('#boardCanvas');
  if (!canvas) return;
  // 画布每次重建都会换掉标注菜单：先撤掉上一轮的外部关闭监听，避免留住旧节点。
  if (boardMarkerMenuOutside) {
    document.removeEventListener('pointerdown', boardMarkerMenuOutside);
    boardMarkerMenuOutside = null;
  }
  const entering = !boardWasActive;
  boardWasActive = true;
  boardEnsurePill();
  boardEnsureStyleTrigger();
  boardEnsureLayerTrigger();
  boardEls = {
    canvas,
    pill: boardPillEl,
    pillButton: $('#boardPillButton', boardPillEl || document),
    pillMenu: $('#boardPillMenu', boardPillEl || document),
    viewport: $('#boardViewport', canvas),
    world: $('#boardWorld', canvas),
    empty: $('#boardEmpty', canvas),
    marquee: $('#boardMarquee', canvas),
    scaleLabel: $('#boardZoomLevel', canvas),
    toolbar: $('#boardWidgetToolbar', canvas)
  };
  
  boardEditingText = null;
  if (entering) {
    boardCancelDraw();
  } else {
    // 数据驱动的重渲染（连续画笔的每一笔、undo 等）不退出画笔模式：
    // 草稿元素已随画布重建失效，模式与选项条原地恢复。
    boardDraftMarker = null;
    if (boardPendingMarker === 'draw') {
      canvas.classList.add('is-drawing');
      boardRenderPenBar();
    }
  }
  boardLayoutCache = boardLayout();
  boardEls.empty.hidden = boardLayoutCache.board.widgets.length > 0;
  $('#boardPillName', boardEls.pill || document).textContent = boardLayoutCache.board.name;
  boardEls.world.innerHTML = '';
  boardRenderedCards.clear();
  boardRenderStatics();
  if (entering) {
    boardStopMotion();
    boardUndoStack.length = 0;
    boardRedoStack.length = 0;
    boardSyncUndoButtons();
    boardEnterAnimated = !reduceWindowMotion();
    const cam = boardState.cams[boardLayoutCache.board.id];
    if (cam) {
      boardCam.x = cam.x;
      boardCam.y = cam.y;
      boardCam.scale = cam.scale;
      boardApplyCamera();
    } else {
      boardCam.scale = 1;
      boardFitView(true);
    }
  } else {
    boardEnterAnimated = false;
    boardApplyCamera();
  }
  if (boardLayoutCache) boardLayoutCache.bounds = boardBoundsOf(boardLayoutCache.board.widgets.filter(widget => !widget.hidden));
  boardSyncNodes();
  boardSyncLinks();
  boardEnterAnimated = false;
  boardMarkActive(selectedId);
  boardRenderToolbar();
  persistBoardState();

  const viewport = boardEls.viewport;
  viewport.addEventListener('wheel', event => {
    // 滚轮 / 触控板双指 = 以指针为锚缩放；平移交给拖拽（左键空白 / 中键任意位置）。
    event.preventDefault();
    if (boardCamRestore) boardCamManual = true;
    const rect = viewport.getBoundingClientRect();
    const multiplier = event.deltaMode === 1 ? 16 : 1;
    boardZoomAt(event.clientX - rect.left, event.clientY - rect.top, Math.exp(-event.deltaY * multiplier * 0.0022));
  }, { passive: false });

  const widgetFromEvent = event => {
    const node = event.target.closest('[data-widget-id]');
    if (!node) return null;
    return boardWidgetById(node.dataset.widgetId);
  };

  viewport.addEventListener('pointerdown', event => {
    // 主键：空白处框选（按住空格则拖画布）、组件上拖组件；中键：任何位置都拖画布；
    // 触摸：空白拖画布（触屏没有框选的习惯）。
    if (event.pointerType === 'mouse' && event.button !== 0 && event.button !== 1) return;
    if (event.button === 1) event.preventDefault();
    if (event.target.closest('.is-editing')) return;
    // 捕获让指针移出画布也能继续跟踪；合成 / 已失效的指针捕获会抛错，安全跳过。
    try { viewport.setPointerCapture(event.pointerId); } catch { /* 无活跃指针可捕获 */ }
    boardPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    boardStopMotion();
    boardCloseBgPop();
    boardCloseContentPop();
    if (boardPointers.size >= 2) {
      const [a, b] = [...boardPointers.values()];
      const rect = viewport.getBoundingClientRect();
      boardGesture = {
        mode: 'pinch',
        startDist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        startScale: boardCam.scale,
        startCam: { x: boardCam.x, y: boardCam.y },
        startMid: { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top }
      };
      return;
    }
    boardMotion.mode = 'drag';
    // 中键固定拖画布（即使落在组件上），也不参与点击选中。
    const panGesture = button => ({
      mode: 'pan',
      button,
      lastX: event.clientX,
      lastY: event.clientY,
      pressX: event.clientX,
      pressY: event.clientY,
      moved: false,
      pressNode: button === 0 ? event.target.closest('[data-widget-id]') : null,
      history: [{ x: event.clientX, y: event.clientY, t: performance.now() }]
    });
    if (event.button === 1 || boardSpaceDown) {
      boardGesture = panGesture(1);
      return;
    }
    // 选中标注形状后按下即绘制：明确的意图优先于组件命中（标注常画在卡片上或跨卡片）。
    // 笔绘模式下切到橡皮即进入擦除手势（橡皮与笔集成在同一面板）。
    if (boardPendingMarker === 'draw' && boardPenState.brush === 'eraser') {
      const rect = viewport.getBoundingClientRect();
      boardPushUndo();
      boardGesture = {
        mode: 'eraser',
        erased: false,
        startX: (event.clientX - rect.left - boardCam.x) / boardCam.scale,
        startY: (event.clientY - rect.top - boardCam.y) / boardCam.scale
      };
      // 起点即命中也算擦除：否则 release 会把这次手势的撤销快照弹掉。
      boardGesture.erased = boardEraseAt(boardGesture.startX, boardGesture.startY);
      return;
    }
    // 多选整体缩放：外接框上的八向调节点（按下即入栈，未移动松手弹出）。
    const multiHandle = event.target.closest('[data-multi-handle]');
    if (multiHandle && boardSelection.size > 1) {
      const bounds = boardMultiSelectionBounds();
      if (bounds) {
        boardPushUndo();
        const bases = [];
        for (const id of boardSelection) {
          const widget = boardWidgetById(id);
          if (!widget) continue;
          const size = boardWidgetSize(widget);
          bases.push({
            widget,
            left0: Math.min(widget.x, widget.x + widget.w),
            top0: Math.min(widget.y, widget.y + widget.h),
            w0: size.w,
            h0: size.h,
            points: widget.kind === 'draw' ? [...(widget.points || [])] : null,
            negativeW: widget.w < 0,
            negativeH: widget.h < 0
          });
        }
        boardGesture = {
          mode: 'multi-resize',
          dir: multiHandle.dataset.dir,
          bounds,
          originX: event.clientX,
          originY: event.clientY,
          bases,
          moved: false
        };
        // 缩放期间锁定卡片虚拟化重建，防止内容刷新打断手势。
        bases.forEach(base => $(`[data-widget-id="${CSS.escape(base.widget.id)}"]`, boardEls.world)?.classList.add('is-resizing'));
      }
      return;
    }
    if (boardPendingMarker) {
      const rect = viewport.getBoundingClientRect();
      const startX = (event.clientX - rect.left - boardCam.x) / boardCam.scale;
      const startY = (event.clientY - rect.top - boardCam.y) / boardCam.scale;
      boardGesture = {
        mode: 'draw',
        kind: boardPendingMarker,
        startX,
        startY,
        currentW: 0,
        currentH: 0,
        points: boardPendingMarker === 'draw' ? [0, 0] : null,
        lastPointAt: 0
      };
      return;
    }
    const handle = event.target.closest('[data-widget-handle]');
    if (handle) {
      const widget = widgetFromEvent(event);
      if (widget) {
        boardPushUndo();
        // 迁移来的旧组件可能没有尺寸字段：按默认尺寸补齐写回，避免调节
        // 过程中以 undefined 起算（对边固定、夹取都会失效）。
        if (widget.w == null) widget.w = widget.type === 'text' ? 240 : BOARD_CARD_W;
        if (widget.h == null) widget.h = widget.type === 'note' || widget.type === 'todo' ? BOARD_CARD_H : 114;
        boardGesture = {
          mode: 'handle', widget, handle: handle.dataset.widgetHandle,
          node: event.target.closest('[data-widget-id]'),
          originX: event.clientX, originY: event.clientY,
          baseX: widget.x, baseY: widget.y,
          baseW: widget.w, baseH: widget.h
        };
        // 调节期间锁定位移与悬停位移：卡片本体不参与任何 transform，
        // 只有被拖动的边跟随指针。
        boardGesture.node?.classList.add('is-resizing');
        handle.classList.add('is-active');
        boardSelectedHandle = handle;
        return;
      }
    }
    const widget = widgetFromEvent(event);
    if (widget) {
      // 多选状态下拖动选中的任一组件 = 整组移动；否则拖单个组件。
      const node = event.target.closest('[data-widget-id]');
      const group = boardSelection.size > 1 && boardSelection.has(widget.id)
        ? [...boardSelection].map(id => boardWidgetById(id)).filter(Boolean)
        : null;
      // 快照必须在坐标被改写之前：按下即入栈，松手未移动则弹出。
      boardPushUndo();
      boardGesture = {
        mode: 'widget',
        node,
        widget,
        group,
        pressItem: widget.type === 'note' || widget.type === 'todo' ? widget.ref : null,
        originX: event.clientX,
        originY: event.clientY,
        widgetX: widget.x,
        widgetY: widget.y,
        groupBase: group ? group.map(entry => ({ widget: entry, x: entry.x, y: entry.y })) : null,
        moved: false
      };
      node?.classList.add('is-dragging');
      return;
    }
    // 鼠标主键在空白处按下 = 框选（marquee）；触摸与中键 = 平移画布。
    if (event.pointerType === 'mouse') {
      const rect = viewport.getBoundingClientRect();
      boardGesture = {
        mode: 'marquee',
        originX: event.clientX - rect.left,
        originY: event.clientY - rect.top,
        currentX: event.clientX - rect.left,
        currentY: event.clientY - rect.top
      };
      if (boardEls.marquee) {
        boardEls.marquee.hidden = false;
        boardUpdateMarquee(boardGesture);
      }
      return;
    }
    boardGesture = panGesture(0);
  });
  viewport.addEventListener('pointermove', event => {
    const point = boardPointers.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX;
    point.y = event.clientY;
    if (boardGesture?.mode === 'pinch' && boardPointers.size >= 2) {
      if (boardCamRestore) boardCamManual = true;
      const [a, b] = [...boardPointers.values()];
      const rect = viewport.getBoundingClientRect();
      const distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
      const mid = { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top };
      boardCam.scale = boardSoftScale(boardGesture.startScale * (distance / boardGesture.startDist));
      const worldX = (boardGesture.startMid.x - boardGesture.startCam.x) / boardGesture.startScale;
      const worldY = (boardGesture.startMid.y - boardGesture.startCam.y) / boardGesture.startScale;
      boardCam.x = mid.x - worldX * boardCam.scale;
      boardCam.y = mid.y - worldY * boardCam.scale;
      boardConstrainDrag();
      boardApplyCamera();
      boardScheduleSync();
      return;
    }
    if (boardGesture?.mode === 'handle') {
      const dx = (event.clientX - boardGesture.originX) / boardCam.scale;
      const dy = (event.clientY - boardGesture.originY) / boardCam.scale;
      const { widget } = boardGesture;
      if (boardGesture.handle === 'resize') {
        widget.w = Math.round(boardGesture.baseW + dx);
      } else if (BOARD_RESIZE_DIRS.includes(boardGesture.handle)) {
        // 八向调节：按方向改尺寸，左侧 / 上方同时移动原点，对边保持不动。
        const dir = boardGesture.handle;
        let x = boardGesture.baseX;
        let y = boardGesture.baseY;
        let w = boardGesture.baseW;
        let h = boardGesture.baseH;
        if (dir.includes('e')) w = w + dx;
        if (dir.includes('w')) w = w - dx;
        if (dir.includes('s')) h = h + dy;
        if (dir.includes('n')) h = h - dy;
        w = Math.min(BOARD_CARD_MAX_W, Math.max(BOARD_CARD_MIN_W, Math.round(w)));
        h = Math.min(BOARD_CARD_MAX_H, Math.max(BOARD_CARD_MIN_H, Math.round(h)));
        if (dir.includes('w')) x = boardGesture.baseX + boardGesture.baseW - w;
        if (dir.includes('n')) y = boardGesture.baseY + boardGesture.baseH - h;
        widget.x = x;
        widget.y = y;
        widget.w = w;
        widget.h = h;
      } else if (boardGesture.handle === 'end') {
        widget.w = boardSnap(boardGesture.baseW + dx);
        widget.h = boardSnap(boardGesture.baseH + dy);
      } else if (boardGesture.handle === 'start') {
        widget.x = boardSnap(boardGesture.baseX + dx);
        widget.y = boardSnap(boardGesture.baseY + dy);
      }
      if (widget.type === 'note' || widget.type === 'todo') {
        widget.w = Math.min(BOARD_CARD_MAX_W, Math.max(BOARD_CARD_MIN_W, widget.w));
        widget.h = Math.min(BOARD_CARD_MAX_H, Math.max(BOARD_CARD_MIN_H, widget.h));
        boardGesture.node = boardGesture.node || $(`[data-widget-id="${CSS.escape(widget.id)}"]`, boardEls.world);
        boardRefreshCardNode(widget);
      } else {
        boardRefreshStatic(widget);
      }
      boardScheduleSync();
      return;
    }
    if (boardGesture?.mode === 'multi-resize') {
      const gesture = boardGesture;
      const dx = (event.clientX - gesture.originX) / boardCam.scale;
      const dy = (event.clientY - gesture.originY) / boardCam.scale;
      if (!gesture.moved && Math.hypot(event.clientX - gesture.originX, event.clientY - gesture.originY) > BOARD_PRESS_SLOP) gesture.moved = true;
      let x1 = gesture.bounds.x;
      let y1 = gesture.bounds.y;
      let x2 = gesture.bounds.x + gesture.bounds.w;
      let y2 = gesture.bounds.y + gesture.bounds.h;
      if (gesture.dir.includes('w')) x1 += dx;
      if (gesture.dir.includes('e')) x2 += dx;
      if (gesture.dir.includes('n')) y1 += dy;
      if (gesture.dir.includes('s')) y2 += dy;
      // 缩放比例的下限：任何条目卡片都不被压破（按各卡最小尺寸取最紧约束）。
      let scaleMinX = 0.08;
      let scaleMinY = 0.08;
      gesture.bases.forEach(base => {
        if (base.widget.type === 'note' || base.widget.type === 'todo') {
          scaleMinX = Math.max(scaleMinX, BOARD_CARD_MIN_W / base.w0);
          scaleMinY = Math.max(scaleMinY, BOARD_CARD_MIN_H / base.h0);
        }
      });
      let sx = Math.max((x2 - x1) / gesture.bounds.w, scaleMinX);
      let sy = Math.max((y2 - y1) / gesture.bounds.h, scaleMinY);
      x2 = x1 + gesture.bounds.w * sx;
      y2 = y1 + gesture.bounds.h * sy;
      gesture.bases.forEach(base => {
        const widget = base.widget;
        const nx = Math.round(x1 + (base.left0 - gesture.bounds.x) * sx);
        const ny = Math.round(y1 + (base.top0 - gesture.bounds.y) * sy);
        const nw = Math.max(1, Math.round(base.w0 * sx));
        const nh = Math.max(1, Math.round(base.h0 * sy));
        widget.x = base.negativeW ? nx + nw : nx;
        widget.y = base.negativeH ? ny + nh : ny;
        if (widget.type === 'text') {
          // 文本高度由内容实测决定：只缩位置与宽度，松手后重新量高。
          widget.w = nw;
        } else {
          widget.w = base.negativeW ? -nw : nw;
          widget.h = base.negativeH ? -nh : nh;
          if (base.points) widget.points = base.points.map((value, index) => Math.round(value * (index % 2 === 0 ? sx : sy)));
        }
        if (widget.type === 'note' || widget.type === 'todo') {
          boardRefreshCardNode(widget);
        } else {
          boardRefreshStatic(widget);
        }
      });
      // 外接框即时跟随（缩放中比例恒定，直接以手计算的新框定位）。
      const frame = $('#boardMultiFrame', boardEls.canvas);
      if (frame && !frame.hidden) {
        const scale = boardCam.scale;
        frame.style.left = `${x1 * scale + boardCam.x}px`;
        frame.style.top = `${y1 * scale + boardCam.y}px`;
        frame.style.width = `${(x2 - x1) * scale}px`;
        frame.style.height = `${(y2 - y1) * scale}px`;
      }
      boardScheduleSync();
      return;
    }
    if (boardGesture?.mode === 'draw') {
      const rect = viewport.getBoundingClientRect();
      const x = (event.clientX - rect.left - boardCam.x) / boardCam.scale;
      const y = (event.clientY - rect.top - boardCam.y) / boardCam.scale;
      if (boardGesture.kind === 'draw') {
        // 画笔按 6px 间距采样，避免高频 move 把点集撑爆。
        const points = boardGesture.points;
        const lastX = points[points.length - 2];
        const lastY = points[points.length - 1];
        if (Math.hypot(x - boardGesture.startX - lastX, y - boardGesture.startY - lastY) >= 6 || points.length < 4) {
          points.push(Math.round(x - boardGesture.startX), Math.round(y - boardGesture.startY));
        }
        boardDrawDraft({ kind: 'draw', x: boardGesture.startX, y: boardGesture.startY, points, w: 1, h: 1 });
      } else {
        boardGesture.currentW = boardSnap(x - boardGesture.startX);
        boardGesture.currentH = boardSnap(y - boardGesture.startY);
        boardDrawDraft({ kind: boardGesture.kind, x: boardGesture.startX, y: boardGesture.startY, w: boardGesture.currentW, h: boardGesture.currentH });
      }
      return;
    }
    if (boardGesture?.mode === 'eraser') {
      const rect = viewport.getBoundingClientRect();
      if (boardEraseAt((event.clientX - rect.left - boardCam.x) / boardCam.scale, (event.clientY - rect.top - boardCam.y) / boardCam.scale)) {
        boardGesture.erased = true;
      }
      return;
    }
    if (boardGesture?.mode === 'marquee') {
      const rect = viewport.getBoundingClientRect();
      boardGesture.currentX = event.clientX - rect.left;
      boardGesture.currentY = event.clientY - rect.top;
      boardUpdateMarquee(boardGesture);
      return;
    }
    if (boardGesture?.mode === 'widget') {
      const dx = event.clientX - boardGesture.originX;
      const dy = event.clientY - boardGesture.originY;
      if (!boardGesture.moved && Math.hypot(dx, dy) > BOARD_PRESS_SLOP) boardGesture.moved = true;
      if (!boardGesture.moved) return;
      const worldDX = Math.round(dx / boardCam.scale);
      const worldDY = Math.round(dy / boardCam.scale);
      const applyMove = (entry, baseX, baseY, node) => {
        entry.x = boardSnap(baseX + worldDX);
        entry.y = boardSnap(baseY + worldDY);
        if (node) {
          node.style.left = `${entry.x}px`;
          node.style.top = `${entry.y}px`;
        }
        // 同步布局缓存原点：后续内容变化触发的虚拟化重建会按缓存原点生成
        // 内联样式，缓存滞后会让卡片突然跳回拖动前的位置。
        const cached = boardLayoutCache?.cards.find(card => card.widget === entry);
        if (cached) {
          cached.x = entry.x;
          cached.y = entry.y;
        }
      };
      if (boardGesture.groupBase) {
        boardGesture.groupBase.forEach(base => {
          const node = $(`[data-widget-id="${CSS.escape(base.widget.id)}"]`, boardEls.world);
          applyMove(base.widget, base.x, base.y, node);
        });
      } else {
        applyMove(boardGesture.widget, boardGesture.widgetX, boardGesture.widgetY, boardGesture.node);
      }
      boardScheduleSync();
      return;
    }
    if (boardGesture?.mode !== 'pan') return;
    if (boardCamRestore) boardCamManual = true;
    if (!boardGesture.moved && Math.hypot(event.clientX - boardGesture.pressX, event.clientY - boardGesture.pressY) > BOARD_PRESS_SLOP) {
      boardGesture.moved = true;
    }
    // 平移量按屏幕像素 1:1 计入相机（cam 是屏幕空间偏移，与缩放锚定同一
    // 语义）；此前除以 scale，导致不同缩放下拖动画布的量随缩放变化。
    boardCam.x += event.clientX - boardGesture.lastX;
    boardCam.y += event.clientY - boardGesture.lastY;
    boardGesture.lastX = event.clientX;
    boardGesture.lastY = event.clientY;
    boardConstrainDrag();
    boardApplyCamera();
    boardScheduleSync();
    const now = performance.now();
    boardGesture.history.push({ x: event.clientX, y: event.clientY, t: now });
    while (boardGesture.history.length > 2 && now - boardGesture.history[0].t > 90) boardGesture.history.shift();
  });
  const releasePointer = event => {
    boardPointers.delete(event.pointerId);
    if (!boardGesture) return;
    if (boardGesture.mode === 'pinch') {
      if (boardPointers.size === 1) {
        // 从捏合落回单指：把剩余指针接成一次新的拖拽起点。
        const rest = [...boardPointers.values()][0];
        boardMotion.mode = 'drag';
        boardGesture = { mode: 'pan', button: 1, lastX: rest.x, lastY: rest.y, pressX: rest.x, pressY: rest.y, moved: true, history: [] };
      } else if (!boardPointers.size) {
        boardGesture = null;
        boardMotion.mode = 'idle';
        boardMotion.targetScale = Math.min(BOARD_SCALE_MAX, Math.max(BOARD_SCALE_MIN, boardCam.scale));
        const { w, h } = boardViewportSize();
        boardMotion.anchor = { x: w / 2, y: h / 2 };
        boardEnsureFrame();
      }
      return;
    }
    if (boardGesture.mode === 'handle') {
      const gesture = boardGesture;
      boardGesture = null;
      boardMotion.mode = 'idle';
      boardSelectedHandle?.classList.remove('is-active');
      boardSelectedHandle = null;
      gesture.node?.classList.remove('is-resizing');
      if (!boardPointers.size) {
        const { widget } = gesture;
        if (widget.type === 'text' && gesture.handle === 'resize') {
          widget.w = Math.min(720, Math.max(120, widget.w || 240));
        }
        if (widget.type === 'marker' && widget.kind !== 'draw') {
          if (Math.abs(widget.w) < 6 && Math.abs(widget.h) < 6) widget.w = widget.w < 0 ? -24 : 24;
        }
        const unchanged = widget.x === gesture.baseX && widget.y === gesture.baseY
          && widget.w === gesture.baseW && (widget.type === 'text' || widget.h === gesture.baseH);
        if (unchanged) boardUndoStack.pop();
        touchBoard(boardLayoutCache.board);
        persist();
        if (widget.type === 'note' || widget.type === 'todo') {
          // 尺寸与原点已经落定：同步内容签名，避免下一次虚拟化按旧尺寸重建节点。
          const cached = boardRefreshCardNode(widget);
          if (cached && gesture.node) gesture.node.dataset.signature = boardCardSignature(cached);
        } else boardRefreshStatic(widget);
        boardLayoutCache.bounds = boardBoundsOf(boardLayoutCache.board.widgets.filter(widget => !widget.hidden));
        boardSyncUndoButtons();
      }
      return;
    }
    if (boardGesture.mode === 'eraser') {
      const gesture = boardGesture;
      boardGesture = null;
      boardMotion.mode = 'idle';
      if (!gesture.erased) {
        // 没擦到任何笔迹：撤销栈里这次空手势不留步。
        boardUndoStack.pop();
        boardSyncUndoButtons();
      }
      return;
    }
    if (boardGesture.mode === 'multi-resize') {
      const gesture = boardGesture;
      boardGesture = null;
      boardMotion.mode = 'idle';
      gesture.bases.forEach(base => $(`[data-widget-id="${CSS.escape(base.widget.id)}"]`, boardEls.world)?.classList.remove('is-resizing'));
      if (!gesture.moved) {
        // 未实际缩放：撤销栈里这次空手势不留步。
        boardUndoStack.pop();
        boardSyncUndoButtons();
        boardSyncMultiFrame();
        return;
      }
      // 文本宽度变了：先重量高度，再按新包络重算外接框。
      gesture.bases.forEach(base => { if (base.widget.type === 'text') boardMeasureText(base.widget); });
      const board = boardLayoutCache.board;
      touchBoard(board);
      persist();
      boardLayoutCache.bounds = boardBoundsOf(board.widgets.filter(widget => !widget.hidden));
      boardSetSelection([...boardSelection]);
      boardSyncToolbar();
      return;
    }
    if (boardGesture.mode === 'draw') {
      const gesture = boardGesture;
      boardGesture = null;
      boardMotion.mode = 'idle';
      if (!boardPointers.size) boardCommitDraw({ x: gesture.startX, y: gesture.startY, w: gesture.currentW, h: gesture.currentH, points: gesture.points });
      return;
    }
    if (boardGesture.mode === 'marquee') {
      const gesture = boardGesture;
      boardGesture = null;
      boardMotion.mode = 'idle';
      if (boardEls.marquee) boardEls.marquee.hidden = true;
      if (boardPointers.size) return;
      const dragged = Math.abs(gesture.currentX - gesture.originX) > 6 || Math.abs(gesture.currentY - gesture.originY) > 6;
      if (dragged) {
        boardApplyMarquee(gesture);
      } else {
        // 左键单击空白：组件选择与编辑面板一次性全收。
        if (boardSelection.size) boardSetSelection([]);
        if (selectedId) boardDeselect();
      }
      return;
    }
    if (boardGesture.mode === 'widget') {
      const gesture = boardGesture;
      boardGesture = null;
      boardMotion.mode = 'idle';
      gesture.node?.classList.remove('is-dragging');
      if (boardPointers.size) return;
      if (!gesture.moved) {
        boardUndoStack.pop();
        boardSyncUndoButtons();
        // 单击：条目 → 右侧编辑器；文本 / 标注 → 选中组件；双击文本 → 进入编辑。
        const now = performance.now();
        const isDoubleTap = lastBoardTap.id === gesture.widget.id && now - lastBoardTap.at < 340;
        lastBoardTap = { id: gesture.widget.id, at: now };
        if (gesture.widget.type === 'note' || gesture.widget.type === 'todo') {
          boardSetSelection([gesture.widget.id]);
          boardSelect(gesture.pressItem);
        } else if (gesture.widget.type === 'text' && isDoubleTap) {
          boardSetSelection([gesture.widget.id]);
          boardEditText(gesture.widget.id);
        } else {
          boardSetSelection([gesture.widget.id]);
        }
        return;
      }
      // 组件落位：坐标已是组件字段（拖动中直接写入），这里只结算与刷新边界。
      touchBoard(boardLayoutCache.board);
      persist();
      boardLayoutCache.bounds = boardBoundsOf(boardLayoutCache.board.widgets.filter(widget => !widget.hidden));
      boardSyncToolbar();
      return;
    }
    if (!boardPointers.size) {
      const gesture = boardGesture;
      boardGesture = null;
      if (!gesture.moved) {
        boardMotion.mode = 'idle';
        if (gesture.button === 0) {
          // 主键点击空白：组件选择与编辑面板一次性全收。
          if (boardSelection.size) boardSetSelection([]);
          if (selectedId) boardDeselect();
        }
        return;
      }
      // 拖拽松手不带惯性：直接从当前位置指数回弹到边界内（rubber-band 收尾）。
      boardCam.vX = 0;
      boardCam.vY = 0;
      boardMotion.mode = 'settle';
      boardMotion.settle = null;
      boardEnsureFrame();
    }
  };
  viewport.addEventListener('pointerup', releasePointer);
  viewport.addEventListener('pointercancel', event => {
    // 系统打断（滚轮接管、来电等）不算点击也不算释放惯性。
    if (boardGesture?.mode === 'pan') boardGesture.moved = true;
    if (boardGesture?.mode === 'widget') boardGesture.moved = true;
    if (boardGesture?.mode === 'marquee' && boardEls.marquee) boardEls.marquee.hidden = true;
    releasePointer(event);
  });

  // 卡片右上角的「从板上移除」：不进入拖动，单击即移除。
  boardEls.world.addEventListener('pointerdown', event => {
    const remove = event.target.closest('[data-widget-remove]');
    if (remove) event.stopPropagation();
  }, true);
  boardEls.world.addEventListener('click', event => {
    const remove = event.target.closest('[data-widget-remove]');
    if (remove) {
      event.stopPropagation();
      boardArmDelete(remove, () => boardRemoveWidget(remove.dataset.widgetRemove));
    }
  });

  // 板胶囊：切换 / 管理。
  // 板选择器与个性化按钮的绑定在 boardEnsurePill / boardEnsureStyleTrigger
  // 里随元素创建完成：这两个元素挂在 title-row（renderList 不重建的区域），
  // 在这里重复绑定会随每次重建叠加（一次导出触发多次下载的根源）。

  // 添加工具。
  $('#boardAddText', canvas)?.addEventListener('click', () => {
    const board = activeBoard();
    const spot = boardVacantSpot(240, 48);
    boardPushUndo();
    const widget = { id: uid(), type: 'text', x: spot.x, y: spot.y, w: 240, text: '', size: 16, font: 'app', customFont: '', align: 'left', bold: false, italic: false, bg: 'none', bgOpacity: 100, radius: 0, pad: 0 };
    board.widgets.push(widget);
    touchBoard(board);
    persist();
    renderList();
    boardSetSelection([widget.id]);
    boardEditText(widget.id);
  });
  // 标注菜单挂在画布层而不是工具条里：移动端工具条横向滚动（overflow-x:auto），
  // 向上弹出的菜单会被滚动容器裁掉，看起来像点了没反应。这里按标注按钮在屏幕
  // 上的实际位置，把菜单锚定到画布坐标系；上方空间不足时翻到按钮下方。
  function boardPositionMarkerMenu(menu, canvas) {
    const button = $('#boardAddMarker', canvas);
    if (!button) return;
    const btn = button.getBoundingClientRect();
    const box = canvas.getBoundingClientRect();
    const width = menu.offsetWidth || 128;
    const height = menu.offsetHeight || 216;
    const maxLeft = Math.max(8, box.width - width - 8);
    const left = Math.min(Math.max(8, btn.left - box.left + btn.width / 2 - width / 2), maxLeft);
    menu.style.left = `${Math.round(left)}px`;
    if (btn.top - box.top < height + 10) {
      menu.style.top = `${Math.round(btn.bottom - box.top + 8)}px`;
      menu.style.bottom = 'auto';
      menu.classList.add('is-below');
    } else {
      menu.style.bottom = `${Math.round(box.bottom - btn.top + 8)}px`;
      menu.style.top = 'auto';
      menu.classList.remove('is-below');
    }
  }
  function boardCloseMarkerMenu(menu) {
    if (menu) menu.hidden = true;
    if (boardMarkerMenuOutside) {
      document.removeEventListener('pointerdown', boardMarkerMenuOutside);
      boardMarkerMenuOutside = null;
    }
  }
  $('#boardAddMarker', canvas)?.addEventListener('click', () => {
    const menu = $('#boardMarkerMenu', canvas);
    if (!menu) return;
    if (!menu.hidden) { boardCloseMarkerMenu(menu); return; }
    menu.hidden = false;
    boardPositionMarkerMenu(menu, canvas);
    boardCloseMarkerMenu(null);
    boardMarkerMenuOutside = event => {
      if (event.target.closest('#boardMarkerMenu, #boardAddMarker')) return;
      boardCloseMarkerMenu(menu);
    };
    document.addEventListener('pointerdown', boardMarkerMenuOutside);
  });
  $$('#boardMarkerMenu [data-board-marker]', canvas).forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.boardMarker;
    // 笔绘是模式化工具（橡皮在面板里切换）：再点一次退出；形状工具保持单次绘制。
    if (kind === 'draw' && boardPendingMarker === kind) {
      boardCloseMarkerMenu($('#boardMarkerMenu', canvas));
      boardCancelDraw();
      return;
    }
    $$('#boardMarkerMenu [data-board-marker]', canvas).forEach(entry => entry.classList.toggle('active', entry === button));
    boardCloseMarkerMenu($('#boardMarkerMenu', canvas));
    boardStartDraw(kind);
  }));
  $('#boardAddImport', canvas)?.addEventListener('click', boardRunImport);

  // 组件工具条（容器级委托：内容随选中对象重建）。
  boardEls.toolbar.addEventListener('click', async event => {
    const button = event.target.closest('[data-tw]');
    if (!button) return;
    const action = button.dataset.tw;
    // 多选操作不依赖单选对象，先于单选分支处理。
    if (action === 'remove-selection') {
      boardArmDelete(button, () => boardRemoveWidgets([...boardSelection]));
      return;
    }
    if (action === 'clear-selection') { boardSetSelection([]); return; }
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (!widget) return;
    if (action === 'remove') {
      boardArmDelete(button, () => boardRemoveWidget(widget.id));
      return;
    }
    if (action === 'size-up' || action === 'size-down' || action === 'size-set') {
      boardPushUndo('style');
      if (action === 'size-up') widget.size = Math.min(48, widget.size + 2);
      if (action === 'size-down') widget.size = Math.max(11, widget.size - 2);
      boardRefreshStatic(widget);
      boardRenderToolbar();
      touchBoard(boardLayoutCache.board);
      persist();
      return;
    }
    if (action === 'bold' || action === 'italic' || action.startsWith('align-')) {
      boardPushUndo('style');
      if (action === 'bold') widget.bold = !widget.bold;
      if (action === 'italic') widget.italic = !widget.italic;
      if (action === 'align-cycle') widget.align = BOARD_ALIGN_ORDER[(BOARD_ALIGN_ORDER.indexOf(widget.align) + 1) % 3];
      boardRefreshStatic(widget);
      boardRenderToolbar();
      touchBoard(boardLayoutCache.board);
      persist();
      return;
    }
    if (action === 'color') {
      boardPushUndo('style');
      widget.color = button.dataset.color;
      boardRefreshStatic(widget);
      boardRenderToolbar();
      touchBoard(boardLayoutCache.board);
      persist();
      return;
    }
    if (action === 'bg-pop') {
      const pop = $('#boardBgPop', canvas);
      if (pop && !pop.hidden) { boardCloseBgPop(); return; }
      boardCloseContentPop();
      boardCloseMarkerPop();
      boardPushUndo('style');
      boardRenderBgPop(widget);
      return;
    }
    if (action === 'marker-pop') {
      const pop = $('#boardMarkerPop', canvas);
      if (pop && !pop.hidden) { boardCloseMarkerPop(); return; }
      boardCloseBgPop();
      boardCloseContentPop();
      boardPushUndo('style');
      boardRenderMarkerPop(widget);
      return;
    }
    if (action === 'content-pop') {
      const pop = $('#boardContentPop', canvas);
      if (pop && !pop.hidden) { boardCloseContentPop(); return; }
      boardCloseBgPop();
      boardRenderContentPop(widget);
      return;
    }
    if (action === 'text-color') {
      boardPushUndo('style');
      widget.color = button.dataset.color;
      boardRefreshStatic(widget);
      boardRenderToolbar();
      touchBoard(boardLayoutCache.board);
      persist();
      return;
    }
  });
  boardEls.toolbar.addEventListener('input', event => {
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (!widget) return;
    const cardOpacity = event.target.closest('[data-tw="card-opacity"]');
    if (cardOpacity && (widget.type === 'note' || widget.type === 'todo')) {
      widget.opacity = Number(cardOpacity.value);
      const output = cardOpacity.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.opacity}%`;
      boardRefreshCardNode(widget);
      touchBoard(boardLayoutCache.board);
      return;
    }
    const markerStroke = event.target.closest('[data-tw="marker-stroke"]');
    if (markerStroke && widget.type === 'marker') {
      boardPushUndo('style');
      widget.stroke = Number(markerStroke.value);
      const output = markerStroke.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.stroke}`;
      boardRefreshStatic(widget);
      boardCloseMarkerPop();
      touchBoard(boardLayoutCache.board);
      return;
    }
    const textColor = event.target.closest('[data-text-color]');
    if (textColor && widget.type === 'text') {
      widget.color = textColor.value;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
    }
  });
  boardEls.toolbar.addEventListener('change', event => {
    const cardOpacity = event.target.closest('[data-tw="card-opacity"]');
    if (cardOpacity) persist();
    const textColor = event.target.closest('[data-text-color]');
    if (textColor) persist();
  });
  boardEls.toolbar.addEventListener('change', async event => {
    const sizeInput = event.target.closest('[data-tw="size-set"]');
    if (sizeInput) {
      const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
      if (!widget) return;
      boardPushUndo('style');
      widget.size = Math.min(48, Math.max(11, Math.round(Number(sizeInput.value) || widget.size)));
      boardRefreshStatic(widget);
      boardRenderToolbar();
      touchBoard(boardLayoutCache.board);
      persist();
      return;
    }
    const markerColor = event.target.closest('[data-marker-color]');
    if (markerColor) {
      const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
      if (widget?.type === 'marker') {
        boardPushUndo('style');
        widget.color = markerColor.value;
        boardRefreshStatic(widget);
        boardRenderToolbar();
        touchBoard(boardLayoutCache.board);
        persist();
      }
      return;
    }
    const select = event.target.closest('[data-tw="font"]');
    if (!select) return;
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (!widget) return;
    boardPushUndo('style');
    if (select.value === 'custom') {
      boardCloseBgPop();
      const custom = await askNameDialog({ title: t('boardCustomFont'), defaultValue: widget.customFont || '', icon: '#i-text', confirmIcon: '#i-check', maxlength: 120 });
      if (!custom) { boardRenderToolbar(); return; }
      widget.font = 'custom';
      widget.customFont = custom;
    } else {
      widget.font = select.value;
    }
    boardRefreshStatic(widget);
    boardRenderToolbar();
    touchBoard(boardLayoutCache.board);
    persist();
  });
  // 背景样式面板（委托：色板 / 透明度 / 圆角 / 内边距）。
  boardEls.toolbar.parentElement?.addEventListener('click', event => {
    if (!event.target.closest('#boardBgPop, [data-tw="bg-pop"]')) boardCloseBgPop();
    if (!event.target.closest('#boardContentPop, [data-tw="content-pop"]')) boardCloseContentPop();
  });
  boardEls.canvas.addEventListener('click', event => {
    const pop = $('#boardBgPop', canvas);
    if (!pop || pop.hidden) return;
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (!widget || widget.type !== 'text') { boardCloseBgPop(); return; }
    const swatch = event.target.closest('[data-bg]');
    const radius = event.target.closest('[data-radius]');
    const pad = event.target.closest('[data-pad]');
    const opacity = event.target.closest('[data-bgop]');
    if (!swatch && !radius && !pad && !opacity) return;
    if (swatch) widget.bg = swatch.dataset.bg;
    if (radius) widget.radius = Number(radius.dataset.radius);
    if (pad) widget.pad = Number(pad.dataset.pad);
    touchBoard(boardLayoutCache.board);
    persist();
    boardRefreshStatic(widget);
    boardRenderBgPop(widget);
  });
  boardEls.canvas.addEventListener('input', event => {
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (!widget || widget.type !== 'text') return;
    const slider = event.target.closest('[data-bgop]');
    if (slider) {
      widget.bgOpacity = Number(slider.value);
      const output = slider.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.bgOpacity}%`;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
      return;
    }
    const custom = event.target.closest('[data-bg-custom]');
    if (custom) {
      widget.bg = custom.value;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
      return;
    }
    const radius = event.target.closest('[data-radius-range]');
    if (radius) {
      widget.radius = Number(radius.value);
      const output = radius.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.radius}px`;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
      return;
    }
    const pad = event.target.closest('[data-pad-range]');
    if (pad) {
      widget.pad = Number(pad.value);
      const output = pad.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.pad}px`;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
    }
  });
  // 标注样式面板（委托：端帽 / 填充 / 不透明度 / 笔尖），改动即时落盘。
  boardEls.toolbar.parentElement?.addEventListener('click', event => {
    if (!event.target.closest('#boardMarkerPop, [data-tw="marker-pop"]')) boardCloseMarkerPop();
  });
  boardEls.canvas.addEventListener('click', event => {
    const pop = $('#boardMarkerPop', canvas);
    if (!pop || pop.hidden) return;
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (!widget || widget.type !== 'marker') { boardCloseMarkerPop(); return; }
    const cap = event.target.closest('[data-mk-cap]');
    if (cap) {
      boardPushUndo('style');
      if (cap.closest('[data-row="head"]')) widget.head = cap.dataset.mkCap; else widget.tail = cap.dataset.mkCap;
      boardRefreshStatic(widget);
      boardRenderMarkerPop(widget);
      touchBoard(boardLayoutCache.board);
      persist();
      return;
    }
    const tip = event.target.closest('[data-mk-tip]');
    if (tip) {
      boardPushUndo('style');
      widget.cap = tip.dataset.mkTip;
      boardRefreshStatic(widget);
      boardRenderMarkerPop(widget);
      touchBoard(boardLayoutCache.board);
      persist();
      return;
    }
    const fill = event.target.closest('[data-mk-fill]');
    if (fill) {
      boardPushUndo('style');
      widget.fill = fill.dataset.mkFill;
      boardRefreshStatic(widget);
      boardRenderMarkerPop(widget);
      touchBoard(boardLayoutCache.board);
      persist();
    }
  });
  boardEls.canvas.addEventListener('input', event => {
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (!widget || widget.type !== 'marker') return;
    const pop = $('#boardMarkerPop', canvas);
    if (!pop || pop.hidden) return;
    const fillOpacity = event.target.closest('[data-mk-fillop]');
    if (fillOpacity) {
      boardPushUndo('style');
      widget.fillOpacity = Number(fillOpacity.value);
      const output = fillOpacity.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.fillOpacity}%`;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
      return;
    }
    const strokeOpacity = event.target.closest('[data-mk-strokeop]');
    if (strokeOpacity) {
      boardPushUndo('style');
      widget.strokeOpacity = Number(strokeOpacity.value);
      const output = strokeOpacity.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.strokeOpacity}%`;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
      return;
    }
    const drawOpacity = event.target.closest('[data-mk-op]');
    if (drawOpacity) {
      boardPushUndo('style');
      widget.opacity = Number(drawOpacity.value);
      const output = drawOpacity.parentElement?.querySelector('output');
      if (output) output.textContent = `${widget.opacity}%`;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
      return;
    }
    const fillCustom = event.target.closest('[data-mk-fill-custom]');
    if (fillCustom) {
      boardPushUndo('style');
      widget.fill = fillCustom.value;
      boardRefreshStatic(widget);
      touchBoard(boardLayoutCache.board);
    }
  });
  boardEls.canvas.addEventListener('change', event => {
    const showBox = event.target.closest('[data-show]');
    if (showBox) {
      const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
      if (widget && (widget.type === 'note' || widget.type === 'todo')) {
        // 完整内容显示对超长笔记先确认：纯文本超过一万字符时询问是否开启。
        if (showBox.dataset.show === 'body' && showBox.checked && widget.type === 'note') {
          const item = library.items.find(entry => entry.id === widget.ref);
          if (item && stripHTML(item.body || '').length > 10000 && !window.confirm(t('boardBodyLargeConfirm'))) {
            showBox.checked = false;
            return;
          }
        }
        widget.show = { ...(widget.show || {}), [showBox.dataset.show]: showBox.checked };
        touchBoard(boardLayoutCache.board);
        persist();
        // 只更新现有节点各区块的 hidden：不重建节点（重建会让卡片悬停位移
        // 与层叠顺序跳动），也不动选中态与打开中的面板。子待办的行集合可能
        // 变化（仅显示已完成），这类开关走签名重绘。
        boardApplyShownContent(boardRenderedCards.get(widget.id), widget);
        if (showBox.dataset.show === 'tasksDoneOnly' || showBox.dataset.show === 'tasks') boardSyncNodes();
      }
      return;
    }
    if (!event.target.closest('[data-bgop]')) return;
    const widget = boardSelection.size === 1 ? boardWidgetById([...boardSelection][0]) : null;
    if (widget) { touchBoard(boardLayoutCache.board); persist(); }
  });

  $('#boardUndo', canvas)?.addEventListener('click', boardUndo);
  $('#boardRedo', canvas)?.addEventListener('click', boardRedo);

  // 笔绘面板：笔型切换（带预设）、粗细 / 不透明度 / 流量 / 笔尖、颜色与完成。
  const penBar = $('#boardPenBar', canvas);
  penBar?.addEventListener('click', event => {
    const done = event.target.closest('#boardPenDone');
    if (done) { boardCancelDraw(); return; }
    const brush = event.target.closest('[data-brush]');
    if (brush) {
      boardPenState.brush = brush.dataset.brush;
      Object.assign(boardPenState, boardPenPresets[boardPenState.brush]);
      boardRenderPenBar();
      return;
    }
    const cap = event.target.closest('[data-pen-cap]');
    if (cap) {
      boardPenState.cap = cap.dataset.penCap;
      boardRenderPenBar();
      return;
    }
    const swatch = event.target.closest('[data-pen-color]');
    if (swatch) {
      boardPenState.color = swatch.dataset.penColor;
      boardRenderPenBar();
    }
  });
  penBar?.addEventListener('input', event => {
    const slider = event.target.closest('[data-pen]');
    if (slider) {
      const key = slider.dataset.pen;
      boardPenState[key] = key === 'stroke' ? Number(slider.value) : Math.round(Number(slider.value));
      const output = slider.parentElement?.querySelector('output');
      if (output) output.textContent = key === 'stroke' ? boardPenState.stroke : `${boardPenState[key]}%`;
      return;
    }
    const custom = event.target.closest('[data-pen-color-custom]');
    if (custom) boardPenState.color = custom.value;
  });

  // 板个性化：右上角按钮弹出设置浮层，改动即时生效并随板保存。
  // 个性化按钮的绑定随元素创建（boardEnsureStyleTrigger）。
  // 显示内容面板：点头部关闭按钮或面板外（画布内）时收起；
  // 面板挂在画布上且开关切换只做局部重建，这里不会误伤打开中的面板。
  canvas.addEventListener('click', event => {
    if (event.target.closest('[data-content-close]')) { boardCloseContentPop(); return; }
    const contentPop = $('#boardContentPop', canvas);
    if (contentPop && !contentPop.hidden && !event.target.closest('#boardContentPop, [data-tw="content-pop"]')) boardCloseContentPop();
  });
  canvas.addEventListener('click', event => {
    const pop = $('#boardStylePop', canvas);
    if (!pop || pop.hidden) return;
    const board = boardLayoutCache.board;
    board.style = board.style || { pattern: 'dots', color: '', gridColor: '', gridOpacity: 10, snap: false, gridSize: 26 };
    const pattern = event.target.closest('[data-pattern]');
    if (pattern) {
      board.style.pattern = pattern.dataset.pattern;
      boardApplyStyle(board);
      boardRenderStylePop();
      return;
    }
    if (event.target.closest('[data-grid-color="theme"]')) {
      board.style.gridColor = '';
      boardApplyStyle(board);
      boardRenderStylePop();
      return;
    }
    if (event.target.closest('[data-style-close]')) {
      pop.hidden = true;
      return;
    }
    const themeColor = event.target.closest('[data-bg-color="theme"]');
    if (themeColor) {
      board.style.color = '';
      boardApplyStyle(board);
      boardRenderStylePop();
      return;
    }
    if (!event.target.closest('#boardStylePop, #boardStyleTrigger')) pop.hidden = true;
  });
  // 图层面板：行点击选中（组行选整组）、眼睛显隐、头部关闭；点面板外收起。
  canvas.addEventListener('click', event => {
    const pop = $('#boardLayerPop', canvas);
    if (!pop || pop.hidden) return;
    if (event.target.closest('[data-layer-close]')) { pop.hidden = true; return; }
    if (!event.target.closest('#boardLayerPop, #boardLayerTrigger')) { pop.hidden = true; return; }
    const toggleGroup = event.target.closest('[data-layer-toggle-group]');
    if (toggleGroup) {
      const board = boardLayoutCache.board;
      const members = board.widgets.filter(widget => widget.groupId === toggleGroup.dataset.layerToggleGroup);
      if (!members.length) return;
      const hide = !members.every(widget => widget.hidden);
      boardPushUndo();
      members.forEach(widget => { widget.hidden = hide; });
      touchBoard(board);
      persist();
      renderList();
      boardRenderLayerPop();
      return;
    }
    const toggle = event.target.closest('[data-layer-toggle]');
    if (toggle) {
      const widget = boardWidgetById(toggle.dataset.layerToggle);
      if (!widget) return;
      boardPushUndo();
      widget.hidden = !widget.hidden;
      touchBoard(boardLayoutCache.board);
      persist();
      renderList();
      boardRenderLayerPop();
      return;
    }
    const pickGroup = event.target.closest('[data-layer-pick-group]');
    if (pickGroup) {
      const ids = boardLayoutCache.board.widgets.filter(widget => widget.groupId === pickGroup.dataset.layerPickGroup).map(widget => widget.id);
      if (ids.length) boardSetSelection(ids);
      return;
    }
    const pick = event.target.closest('[data-layer-pick]');
    if (pick) boardSetSelection([pick.dataset.layerPick]);
  });
  canvas.addEventListener('input', event => {
    const pop = $('#boardStylePop', canvas);
    if (!pop || pop.hidden) return;
    const board = boardLayoutCache.board;
    board.style = board.style || { pattern: 'dots', color: '', gridColor: '', gridOpacity: 10, snap: false, gridSize: 26 };
    const picker = event.target.closest('[data-bg-color-picker]');
    if (picker) {
      board.style.color = picker.value;
      boardApplyStyle(board);
      return;
    }
    const gridPicker = event.target.closest('[data-grid-color-picker]');
    if (gridPicker) {
      board.style.gridColor = gridPicker.value;
      boardApplyStyle(board);
      return;
    }
    const gridOpacity = event.target.closest('[data-grid-opacity]');
    if (gridOpacity) {
      board.style.gridOpacity = Number(gridOpacity.value);
      const output = gridOpacity.parentElement?.querySelector('output');
      if (output) output.textContent = `${board.style.gridOpacity}%`;
      boardApplyStyle(board);
      return;
    }
    const gridSize = event.target.closest('[data-grid-size]');
    if (gridSize) {
      board.style.gridSize = Number(gridSize.value);
      const output = gridSize.parentElement?.querySelector('output');
      if (output) output.textContent = `${board.style.gridSize}px`;
      boardApplyStyle(board);
    }
  });
  canvas.addEventListener('change', event => {
    const snapToggle = event.target.closest('#boardSnapToggle');
    if (!snapToggle) return;
    const board = boardLayoutCache.board;
    board.style = board.style || { pattern: 'dots', color: '', gridColor: '', gridOpacity: 10, snap: false, gridSize: 26 };
    board.style.snap = snapToggle.checked;
    boardApplyStyle(board);
  });
  $('#boardZoomIn', canvas)?.addEventListener('click', () => {
    const { w, h } = boardViewportSize();
    boardZoomAt(w / 2, h / 2, 1.22);
  });
  $('#boardZoomOut', canvas)?.addEventListener('click', () => {
    const { w, h } = boardViewportSize();
    boardZoomAt(w / 2, h / 2, 1 / 1.22);
  });
  $('#boardFit', canvas)?.addEventListener('click', () => boardFitView());

  if (boardResizeObserver) boardResizeObserver.disconnect();
  if ('ResizeObserver' in window) {
    boardResizeObserver = new ResizeObserver(() => {
      if (currentView !== 'board') return;
      boardApplyCamera();
      boardScheduleSync();
    });
    boardResizeObserver.observe(viewport);
  }
}

const deleteConfirmState = { dialog: null, resolve: null, mode: '', closeTimer: 0 };

function deleteConfirmDialogEl() {
  if (!deleteConfirmState.dialog) deleteConfirmState.dialog = $('#deleteConfirmDialog');
  return deleteConfirmState.dialog;
}

function reduceWindowMotion() {
  return document.body.classList.contains('acta-reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function finishDeleteConfirm(result) {
  const dialog = deleteConfirmDialogEl();
  if (!dialog?.open) return;
  const resolve = deleteConfirmState.resolve;
  deleteConfirmState.resolve = null;
  const closeNow = () => {
    clearTimeout(deleteConfirmState.closeTimer);
    deleteConfirmState.closeTimer = 0;
    if (dialog.open) dialog.close();
    dialog.classList.remove('is-closing');
    resolve?.(result);
  };
  if (reduceWindowMotion()) { closeNow(); return; }
  dialog.classList.add('is-closing');
  deleteConfirmState.closeTimer = setTimeout(closeNow, 250);
}

// Settle a still-pending confirm synchronously: openDeleteConfirm can be re-entered
// while the previous dialog is animating out, and the animation timer would otherwise
// close the new dialog or strand the old promise forever.
function settleDeleteConfirm(result) {
  const dialog = deleteConfirmDialogEl();
  const resolve = deleteConfirmState.resolve;
  deleteConfirmState.resolve = null;
  clearTimeout(deleteConfirmState.closeTimer);
  deleteConfirmState.closeTimer = 0;
  if (dialog?.open) dialog.close();
  dialog?.classList.remove('is-closing');
  resolve?.(result);
}

function openDeleteConfirm({ itemLabel, message, mode }) {
  const dialog = deleteConfirmDialogEl();
  if (!dialog) return null;
  if (deleteConfirmState.resolve || deleteConfirmState.closeTimer) settleDeleteConfirm(null);
  deleteConfirmState.mode = mode;
  $('#deleteConfirmTitle').textContent = t('deleteTitle');
  $('#deleteConfirmItem').textContent = t('deleteSubtitle').replace('{0}', itemLabel || '');
  $('#deleteConfirmMessage').textContent = message || t('deleteConfirm');
  $('#deleteChoiceTrashLabel').textContent = t('deleteTrashLabel');
  $('#deleteChoiceTrashHint').textContent = t('deleteTrashHint');
  $('#deleteChoiceDestroyLabel').textContent = t('deleteDestroyLabel');
  $('#deleteChoiceDestroyHint').textContent = t('deleteDestroyHint');
  $('#confirmDestroyAllLabel').textContent = t('destroy');
  $('#cancelDeleteConfirm').textContent = t('cancel');
  $('.delete-confirm-choices', dialog).hidden = mode !== 'item';
  $('#confirmDestroyAll').hidden = mode === 'item';
  dialog.classList.remove('is-closing');
  if (!dialog.open) dialog.showModal();
  return new Promise(resolve => { deleteConfirmState.resolve = resolve; });
}

function askItemDelete(item) {
  const title = item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote'));
  const label = `${t(item.type)} · ${title}`;
  return openDeleteConfirm({
    itemLabel: label,
    message: t('deleteTrashHint'),
    mode: 'item'
  }).then(choice => {
    if (choice !== 'trash') return choice;
    showToast(t('deletedToTrash'));
    return choice;
  });
}

function askDestroyConfirm({ itemLabel, message }) {
  return openDeleteConfirm({ itemLabel, message, mode: 'destroy' }).then(result => result === 'destroy');
}

function bindDeleteConfirmDialog() {
  const dialog = deleteConfirmDialogEl();
  if (!dialog) return;
  $('#deleteChoiceTrash')?.addEventListener('click', () => finishDeleteConfirm('trash'));
  $('#deleteChoiceDestroy')?.addEventListener('click', () => finishDeleteConfirm('destroy'));
  $('#confirmDestroyAll')?.addEventListener('click', () => finishDeleteConfirm('destroy'));
  $('#cancelDeleteConfirm')?.addEventListener('click', () => finishDeleteConfirm(null));
  $('#closeDeleteConfirm')?.addEventListener('click', () => finishDeleteConfirm(null));
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    finishDeleteConfirm(null);
  });
}

// 每次渲染时对比各待办的完成态：识别「未完成 → 已完成」的瞬间，在可置底的
// 列表视图（所有待办、归类的待办筛选）布置底延迟计时器；视图上下文变化或
// 撤回完成时收回等待。previousOrder 是本次渲染前卡片的 DOM 顺序。
function syncCompletedTodoSink(previousOrder) {
  const eligible = completedTodoSinkView() && completedTodoSinkEnabled() && !reduceWindowMotion();
  if (!eligible || sinkContext.view !== currentView || sinkContext.filter !== currentFilter) {
    if (pendingSink.size) {
      pendingSink.forEach(timer => clearTimeout(timer));
      pendingSink.clear();
    }
    sinkFrozenOrder = [];
    sinkContext = { view: eligible ? currentView : '', filter: eligible ? currentFilter : '' };
  }
  const liveIds = new Set();
  activeItems().forEach(item => {
    if (item.type !== 'todo') return;
    liveIds.add(item.id);
    const complete = isTodoComplete(item);
    const previouslyComplete = lastRenderCompletion.get(item.id);
    lastRenderCompletion.set(item.id, complete);
    if (!complete) {
      // 撤回完成：取消进行中的置底等待，卡片原地恢复。
      if (pendingSink.has(item.id)) {
        clearTimeout(pendingSink.get(item.id));
        pendingSink.delete(item.id);
        if (!pendingSink.size) sinkFrozenOrder = [];
      }
      return;
    }
    if (previouslyComplete === false && !pendingSink.has(item.id) && eligible
        && previousOrder.includes(item.id)) {
      // 只对当前列表里可见的卡片布置底等待（其它视图/筛选下完成不动画）。
      // 冻结当前顺序，让该待办在延迟期间原地停留；多个待办相继完成时，
      // 以屏幕上的现状（含此前冻结的结果）为准重新冻结。
      pendingSink.set(item.id, setTimeout(() => {
        pendingSink.forEach(timer => clearTimeout(timer));
        pendingSink.clear();
        sinkFrozenOrder = [];
        // 完成后仍会留在列表（待办/归类视图且「显示已完成」开启）→ 重渲染
        // 落位并播放 FLIP；不再显示（收集箱、今天、显示已完成关闭）→ 先
        // 淡出卡片再重渲染，避免延迟停留后突然消失。
        const staysVisible = (currentView === 'todos' || String(currentView).startsWith('folder:')) && settings.showCompletedTodos;
        if (!staysVisible && !reduceWindowMotion()) {
          const card = $('#itemList')?.querySelector(`.item-card[data-id="${CSS.escape(item.id)}"]`);
          if (card) {
            // 淡出只负责观感；状态切换用定时器驱动，动画被遮挡节流或
            // 引擎不支持时 onfinish 不触发也不会让卡片滞留列表。
            card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' });
            setTimeout(() => { sinkRenderQueued = true; renderList(); }, 260);
            return;
          }
        }
        sinkRenderQueued = true;
        renderList();
      }, completedTodoSinkDelay()));
      sinkContext = { view: currentView, filter: currentFilter };
      sinkFrozenOrder = [...previousOrder];
    }
  });
  // 待办被移入回收站或彻底删除后不再参与等待。
  pendingSink.forEach((timer, id) => {
    if (!liveIds.has(id)) {
      clearTimeout(timer);
      pendingSink.delete(id);
    }
  });
  if (!pendingSink.size) sinkFrozenOrder = [];
}

// 置底落位动效：把移位的卡片（被移动的待办与其上方腾位的卡片）从旧位置
// 平滑归位。缓动与界面统一的 --ease-out 同曲线，强减速无非线性回弹——
// 这是按钮触发的状态提交，不带手势动量，不做超调。
function playCompletedSinkMotion(list, previousCards) {
  if (reduceWindowMotion() || !previousCards.size) return;
  list.querySelectorAll('.item-card').forEach(card => {
    const previous = previousCards.get(card.dataset.id);
    if (!previous) return;
    const current = card.getBoundingClientRect();
    const dx = previous.left - current.left;
    const dy = previous.top - current.top;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;
    card.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
      { duration: 520, easing: 'cubic-bezier(.16, 1, .3, 1)' }
    );
  });
}

function renderList() {
  const sinkList = $('#itemList');
  const sinkCards = sinkList ? [...sinkList.querySelectorAll('.item-card')] : [];
  const sinkPreviousOrder = sinkCards.map(card => card.dataset.id);
  const sinkPreviousRects = sinkRenderQueued || pendingSink.size
    ? new Map(sinkCards.map(card => [card.dataset.id, card.getBoundingClientRect()]))
    : null;
  const sinking = sinkRenderQueued;
  sinkRenderQueued = false;
  syncCompletedTodoSink(sinkPreviousOrder);
  syncCalendarShell();
  syncListFilterUI();
  const list = $('#itemList');
  if (currentView === 'calendar') {
    const periodItems = calendarPeriodItems();
    $('#viewTitle').textContent = calendarPeriodLabel();
    $('#itemCountLabel').textContent = `${periodItems.length} ${t('calendarItems')}`;
    list.className = `item-list calendar-list calendar-${calendarViewMode}`;
    list.innerHTML = renderCalendar();
    playCalendarTransition(list);
    alignMobileWeek(list);
    return;
  }
  if (currentView === 'stats') {
    const total = statsCollectionItems().length;
    $('#viewTitle').textContent = viewTitle();
    $('#itemCountLabel').textContent = `${total} ${t('item')}`;
    list.className = 'item-list stats-list';
    list.innerHTML = renderStats();
    bindStatsView();
    return;
  }
  if (currentView === 'trash') {
    const items = getVisibleItems();
    $('#viewTitle').textContent = viewTitle();
    $('#itemCountLabel').textContent = `${items.length} ${t('trashItems')}`;
    list.className = 'item-list trash-list';
    list.innerHTML = items.length
      ? renderTrashList(items)
      : `<div class="empty-list trash-empty"><div><span><svg><use href="#i-trash"/></svg></span><h3>${escapeHTML(t('trashEmptyTitle'))}</h3><p>${escapeHTML(t('trashEmptyHint'))}</p></div></div>`;
    bindTrashList();
    return;
  }
  if (currentView === 'board') {
    $('#viewTitle').textContent = viewTitle();
    const board = activeBoard();
    const shownItems = board.widgets.filter(widget => widget.type === 'note' || widget.type === 'todo').length;
    $('#itemCountLabel').textContent = `${shownItems} ${t('item')}`;
    list.className = 'item-list board-list';
    list.innerHTML = renderBoardShell();
    bindBoardScene();
    return;
  }
  const items = getVisibleItems();
  $('#viewTitle').textContent = viewTitle();
  $('#itemCountLabel').textContent = `${items.length} ${t('item')}`;
  list.className = 'item-list';
  if (!items.length) {
    list.innerHTML = `<div class="empty-list"><div><span><svg><use href="#i-spark"/></svg></span><h3>${t('noItems')}</h3><p>${t('noItemsHint')}</p></div></div>`;
    return;
  }

  list.innerHTML = items.map((item, index) => {
    const folder = getFolder(item.folderId);
    const linkedCount = getLinkedItems(item).length;
    const completed = item.type === 'todo' && (item.tasks || []).filter(task => task.done).length;
    const total = item.type === 'todo' ? (item.tasks || []).length : 0;
    const done = isTodoComplete(item);
    const progress = total ? Math.round(completed / total * 100) : (done ? 100 : 0);
    const dateMarkup = item.type === 'todo'
      ? todoListTimeMarkup(item)
      : `<time class="card-date" datetime="${escapeHTML(item.updatedAt)}">${escapeHTML(formatDate(item.updatedAt, true))}</time>`;
    const active = !matchMedia('(max-width: 800px)').matches && item.id === selectedId;
    return `<button class="item-card ${active ? 'active' : ''} ${done ? 'completed-card' : ''} ${item.type === 'todo' ? `priority-${item.priority || 'medium'}` : ''}" data-id="${escapeHTML(item.id)}" style="animation-delay:${Math.min(index * 18, 100)}ms">
      <div class="card-top"><span class="type-pill ${item.type}"><svg><use href="#i-${item.type === 'todo' ? 'check' : 'note'}"/></svg>${t(item.type)}</span>${item.type === 'todo' ? `<span class="priority-pill ${item.priority || 'medium'}">${t(item.priority || 'medium')}</span>` : ''}${dateMarkup}</div>
      <h3>${escapeHTML(item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote')))}</h3>
      <p>${escapeHTML(itemPreview(item))}</p>
      <div class="card-bottom"><span class="mini-folder"><i class="folder-dot" style="background:${escapeHTML(folder?.color || '#999')}"></i>${escapeHTML(folderName(folder))}</span>
      ${linkedCount ? `<span class="link-count"><svg><use href="#i-link"/></svg>${linkedCount}</span>` : ''}
      ${item.type === 'todo' ? (item.checkin
        ? (() => {
            const checkins = item.checkins || {};
            const todayKey = todayISO();
            const streakCursor = new Date();
            if (!checkins[todayKey]) streakCursor.setDate(streakCursor.getDate() - 1);
            let streak = 0;
            const offsetMs = streakCursor.getTimezoneOffset() * 60000;
            while (checkins[new Date(streakCursor - offsetMs).toISOString().slice(0, 10)]) {
              streak += 1;
              streakCursor.setDate(streakCursor.getDate() - 1);
            }
            const on = Boolean(checkins[todayKey]);
            return `<span class="checkin-badge${on ? ' on' : ''}"><svg><use href="#i-check"/></svg>${escapeHTML(on ? t('checkinDone') : t('checkinTodoYet'))}</span>${streak ? `<span class="checkin-streak">${escapeHTML(t('checkinStreak'))} ${streak} ${escapeHTML(t('checkinDays'))}</span>` : ''}`;
          })()
        : `<span>${completed}/${total}</span><span class="mini-progress"><i style="width:${progress}%"></i></span>`) : ''}</div>
    </button>`;
  }).join('');
  if (sinking && sinkPreviousRects) {
    // 置底落位：抑制入场级联重放，只播移位卡片的位置动效。
    document.body.classList.add('acta-steady');
    try { playCompletedSinkMotion(list, sinkPreviousRects); } catch { /* 动画失败不影响落位。 */ }
  }
}

function editorTop(item) {
  const folder = getFolder(item.folderId);
  return `<div class="editor-topline">
    <button class="mobile-back" id="mobileBack" aria-label="Back"><svg><use href="#i-chevron"/></svg></button>
    <span class="editor-type ${item.type}"><svg><use href="#i-${item.type === 'todo' ? 'check' : 'note'}"/></svg>${t(item.type)}</span>
    <span class="editor-folder">${escapeHTML(folderName(folder))}</span>
    <div class="editor-actions">
      ${item.type === 'todo' ? `<button id="completeItem" title="${isTodoComplete(item) ? t('reopenTask') : t('completeTask')}"><svg><use href="#i-check"/></svg></button>` : ''}
      ${item.type === 'note' ? `<button id="exportNote" title="${t('exportNote')}"><svg><use href="#i-upload"/></svg></button>` : ''}
      <button id="deleteItem" title="${t('moveToTrash')}"><svg><use href="#i-trash"/></svg></button>
      <button title="${t('archive')}"><svg><use href="#i-more"/></svg></button>
    </div>
  </div>`;
}

function linkedItemsSection(item) {
  const linkedItems = getLinkedItems(item);
  const availableItems = library.items.filter(entry => entry.id !== item.id
    && !isTrashed(entry)
    && (item.type === 'todo' || entry.type === 'todo')
    && !linkedItems.some(linked => linked.id === entry.id));
  const pickerLabel = item.type === 'note' ? t('chooseTodo') : t('linkedItems');
  const addLabel = item.type === 'note' ? t('linkTodo') : t('linkedItems');
  return `<section class="linked-section">
    <div class="linked-head"><span><svg><use href="#i-link"/></svg><b>${t('linkedItems')}</b><em>${linkedItems.length}</em></span></div>
    <div class="link-picker">
      <select id="linkItemSelect" aria-label="${escapeHTML(pickerLabel)}">
        <option value="">${escapeHTML(pickerLabel)}</option>
        ${availableItems.map(entry => `<option value="${escapeHTML(entry.id)}">${item.type === 'todo' ? `${escapeHTML(t(entry.type))} · ` : ''}${escapeHTML(entry.title || (entry.type === 'todo' ? t('untitledTodo') : t('untitledNote')))}</option>`).join('')}
      </select>
      <button id="addItemLink" disabled><svg><use href="#i-plus"/></svg>${escapeHTML(addLabel)}</button>
    </div>
    <div class="linked-list">
      ${linkedItems.length ? linkedItems.map(linked => `<div class="linked-row" data-linked-id="${escapeHTML(linked.id)}">
        <button class="open-linked-item"><span class="type-pill ${linked.type}"><svg><use href="#i-${linked.type === 'todo' ? 'check' : 'note'}"/></svg>${t(linked.type)}</span><b>${escapeHTML(linked.title || (linked.type === 'todo' ? t('untitledTodo') : t('untitledNote')))}</b>${linked.type === 'todo' ? `<span class="priority-pill ${linked.priority || 'medium'}">${t(linked.priority || 'medium')}</span>` : ''}</button>
        <button class="remove-item-link" title="${t('unlink')}" aria-label="${t('unlink')}"><svg><use href="#i-close"/></svg></button>
      </div>`).join('') : `<p class="no-links">${t('noLinks')}</p>`}
    </div>
  </section>`;
}

let classificationField;
let noteEditor;
let todoEditor;
let bindTodoEditor;
let createItem;

function renderEditor() {
  let item = getItem();
  if (item && isTrashed(item)) item = null;
  const pane = $('#editorPane');
  // 计划板的编辑器是浮在画布右侧的面板：按选中状态滑入 / 滑出。
  if (currentView === 'board') {
    document.body.classList.toggle('board-editor-open', Boolean(item));
    document.documentElement.style.setProperty('--board-editor-w', `${boardState.editorWidth}px`);
    boardEnsureEditorChrome();
  }
  const previousEditorId = $('.editor-wrap', pane)?.dataset.editorId;
  document.body.classList.remove('note-focus-mode', 'note-focus-leaving');
  if (!item) {
    pane.classList.remove('mobile-open');
    pane.innerHTML = `<div class="empty-editor"><div><span><svg><use href="#i-spark"/></svg></span><h2>${t('selectItem')}</h2><p>${t('selectItemHint')}</p></div></div>`;
    pane.scrollTop = 0;
    return;
  }
  pane.innerHTML = item.type === 'note' ? noteEditor(item) : todoEditor(item);
  pane.classList.toggle('mobile-open', mobileEditorOpen);
  if (previousEditorId !== item.id) pane.scrollTop = 0;
  bindEditor(item);
}

function autoSizeTitle() {
  const title = $('#editorTitle');
  if (!title) return;
  title.style.height = 'auto';
  if (title.getBoundingClientRect().width <= 1) return;
  title.style.height = `${Math.ceil(title.scrollHeight)}px`;
}

function watchEditorPaneWidth() {
  const pane = $('#editorPane');
  if (!pane) return;
  if (!('ResizeObserver' in window)) {
    window.addEventListener('resize', autoSizeTitle);
    return;
  }
  let previousWidth = -1;
  editorPaneResizeObserver = new ResizeObserver(entries => {
    const width = entries[0]?.contentRect.width ?? pane.clientWidth;
    if (Math.abs(width - previousWidth) < .5) return;
    previousWidth = width;
    cancelAnimationFrame(editorTitleResizeFrame);
    editorTitleResizeFrame = requestAnimationFrame(autoSizeTitle);
  });
  editorPaneResizeObserver.observe(pane);
}

function isImeComposing(event) {
  return Boolean(event.isComposing || event.keyCode === 229);
}

function touchItem(item) {
  item.updatedAt = new Date().toISOString();
  persist();
}

function syncEditorModifiedTime(item) {
  if (!item || item.type !== 'note') return;
  const label = `${t('modified')} ${formatDateTimeSeconds(item.updatedAt)}`;
  const subline = $('#noteUpdatedAt');
  const focusTime = $('#noteFocusUpdatedAt');
  if (subline) {
    subline.dateTime = item.updatedAt;
    subline.lastChild.textContent = label;
  }
  if (focusTime) {
    focusTime.dateTime = item.updatedAt;
    focusTime.lastChild.textContent = label;
  }
}

function setTodoCompletion(item, complete) {
  if (!item || item.type !== 'todo') return;
  const snapshotBefore = JSON.parse(JSON.stringify(item));
  item.completed = Boolean(complete);
  (item.tasks || []).forEach(task => {
    task.done = Boolean(complete);
    if (complete) { task.completedAt = task.completedAt || new Date().toISOString(); }
    else { delete task.completedAt; }
  });
  logHistory('todo-completed', item.title || t('untitledTodo'), item.id, snapshotBefore);
  touchItem(item);
}

function toggleCalendarSubtask(item, taskId) {
  if (!item || item.type !== 'todo') return;
  const task = (item.tasks || []).find(entry => entry.id === taskId);
  if (!task) return;
  task.done = !task.done;
  if (task.done) task.completedAt = new Date().toISOString();
  else delete task.completedAt;
  item.completed = item.tasks.length > 0 && item.tasks.every(entry => entry.done);
  touchItem(item);
}

function updateCard(item) {
  const card = $(`.item-card[data-id="${CSS.escape(item.id)}"]`);
  if (!card) return;
  const heading = $('h3', card);
  const preview = $('p', card);
  if (heading) heading.textContent = item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote'));
  if (preview) preview.textContent = itemPreview(item);
}

function bindEditor(item) {
  autoSizeTitle();
  $('#mobileBack')?.addEventListener('click', () => {
    mobileEditorOpen = false;
    $('#editorPane').classList.remove('mobile-open');
  });
  $('#editorTitle').addEventListener('input', event => {
    item.title = event.target.value;
    autoSizeTitle();
    touchItem(item);
    syncEditorModifiedTime(item);
    const focusTitle = $('#noteFocusTitle');
    if (focusTitle) focusTitle.textContent = item.title || t('untitledNote');
    updateCard(item);
  });
  $('#deleteItem')?.addEventListener('click', async () => {
    const choice = await askItemDelete(item);
    if (!choice) return;
    if (choice === 'trash') {
      logHistory('item-trashed', item.title || (item.type === 'todo' ? t('untitledTodo') : t('untitledNote')), item.id, JSON.parse(JSON.stringify(item)));
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
  });
  $('#completeItem')?.addEventListener('click', () => {
    const nextState = !isTodoComplete(item);
    setTodoCompletion(item, nextState);
    renderAll();
  });

  $('#classificationFolder')?.addEventListener('change', event => {
    item.folderId = event.target.value;
    touchItem(item);
    syncEditorModifiedTime(item);
    const folderLabel = $('.editor-folder');
    if (folderLabel) folderLabel.textContent = folderName(getFolder(item.folderId));
    renderSidebar();
    renderList();
  });
  if (item.type === 'note') bindNoteEditor(item);
  else bindTodoEditor(item);
  bindLinkedItems(item);
}

function bindNoteEditor(item) {
  const article = $('.note-editor');
  const body = $('#noteBody');
  const source = $('#noteMarkdownSource');
  const toolbar = $('.note-toolbar');
  const blockFormat = $('#noteBlockFormat');
  const formatMode = $('#noteFormatMode');
  const markdownToggle = $('[data-note-action="toggle-markdown"]', toolbar);
  const focusButton = $('#focusNoteEditor');
  const exitFocusButton = $('#exitFocusNoteEditor');
  const focusModeLabel = $('#noteFocusModeLabel');
  const focusModeIcon = $('#noteFocusModeIcon');
  let markdownMode = false;
  let focusMode = false;
  let focusExitTimer = 0;
  let savedRange = null;

  const updateStats = html => {
    const text = stripHTML(html);
    $('#noteStats').textContent = `${text.split(/\s+/).filter(Boolean).length} ${t('words')} · ${text.length} ${t('chars')}`;
  };
  const commitHTML = () => {
    item.body = body.innerHTML;
    updateStats(item.body);
    touchItem(item);
    syncEditorModifiedTime(item);
    updateCard(item);
  };
  const commitMarkdown = () => {
    item.body = markdownToNoteHTML(source.value);
    updateStats(item.body);
    touchItem(item);
    syncEditorModifiedTime(item);
    updateCard(item);
  };
  const updateMarkdownSource = (replacement, start, end, selectionStart, selectionEnd) => {
    source.focus();
    source.setRangeText(replacement, start, end, 'end');
    source.setSelectionRange(selectionStart, selectionEnd);
    source.dispatchEvent(new Event('input', { bubbles:true }));
  };
  const markdownHasSelection = () => source.selectionEnd > source.selectionStart && source.value.slice(source.selectionStart, source.selectionEnd).trim().length > 0;
  const markdownSelectionOptional = new Set(['undo', 'redo', 'insertHorizontalRule']);
  const requireMarkdownSelection = action => {
    if (markdownSelectionOptional.has(action) || markdownHasSelection()) return true;
    showToast(t('selectTextFirst'));
    source.focus();
    return false;
  };
  const toggleMarkdownSelection = (prefix, suffix = prefix) => {
    const value = source.value;
    const start = source.selectionStart;
    const end = source.selectionEnd;
    const selected = value.slice(start, end);
    const ambiguousSingleMarker = prefix === suffix
      && prefix.length === 1
      && ['*', '`'].includes(prefix)
      && (selected.startsWith(prefix.repeat(2)) || selected.endsWith(suffix.repeat(2)));
    if (!ambiguousSingleMarker && selected.length >= prefix.length + suffix.length && selected.startsWith(prefix) && selected.endsWith(suffix)) {
      const unwrapped = selected.slice(prefix.length, selected.length - suffix.length);
      updateMarkdownSource(unwrapped, start, end, start, start + unwrapped.length);
      return;
    }
    const markerStart = start - prefix.length;
    const markerEnd = end + suffix.length;
    const hasExternalMarkers = markerStart >= 0
      && value.slice(markerStart, start) === prefix
      && value.slice(end, markerEnd) === suffix;
    const externalSingleMarkerIsExact = !(prefix === suffix
      && prefix.length === 1
      && ['*', '`'].includes(prefix)
      && (value[markerStart - 1] === prefix || value[markerEnd] === suffix));
    if (hasExternalMarkers && externalSingleMarkerIsExact) {
      updateMarkdownSource(selected, markerStart, markerEnd, markerStart, markerStart + selected.length);
      return;
    }
    const replacement = `${prefix}${selected}${suffix}`;
    updateMarkdownSource(replacement, start, end, start + prefix.length, start + prefix.length + selected.length);
  };
  const transformMarkdownLines = transform => {
    const value = source.value;
    const selectionStart = source.selectionStart;
    const selectionEnd = source.selectionEnd;
    const start = value.lastIndexOf('\n', Math.max(0, selectionStart - 1)) + 1;
    const nextBreak = value.indexOf('\n', selectionEnd);
    const end = nextBreak < 0 ? value.length : nextBreak;
    const replacement = value.slice(start, end).split('\n').map(transform).join('\n');
    updateMarkdownSource(replacement, start, end, start, start + replacement.length);
  };
  const stripMarkdownLinePrefix = line => line.replace(/^(?:#{1,6}\s+|>\s+|[-+*]\s+(?:\[[ xX]\]\s+)?|\d+\.\s+)/, '');
  const toggleMarkdownLines = ({ test, remove, apply }) => {
    const value = source.value;
    const selectionStart = source.selectionStart;
    const selectionEnd = source.selectionEnd;
    const start = value.lastIndexOf('\n', Math.max(0, selectionStart - 1)) + 1;
    const nextBreak = value.indexOf('\n', selectionEnd);
    const end = nextBreak < 0 ? value.length : nextBreak;
    const lines = value.slice(start, end).split('\n');
    const contentLines = lines.filter(line => line.trim());
    const shouldRemove = contentLines.length > 0 && contentLines.every(test);
    const replacement = lines.map((line, index) => {
      if (!line.trim()) return line;
      return shouldRemove ? remove(line) : apply(stripMarkdownLinePrefix(line), index);
    }).join('\n');
    updateMarkdownSource(replacement, start, end, start, start + replacement.length);
  };
  const markdownBlockAtCaret = () => {
    const lineStart = source.value.lastIndexOf('\n', Math.max(0, source.selectionStart - 1)) + 1;
    const lineEnd = source.value.indexOf('\n', source.selectionStart);
    const line = source.value.slice(lineStart, lineEnd < 0 ? source.value.length : lineEnd);
    return /^###\s+/.test(line) ? 'h3' : /^##\s+/.test(line) ? 'h2' : /^#\s+/.test(line) ? 'h1' : 'p';
  };
  const setMarkdownBlockFormat = value => {
    if (!requireMarkdownSelection('formatBlock')) return false;
    if (value === 'p') {
      transformMarkdownLines(line => line.replace(/^#{1,6}\s+/, ''));
      return true;
    }
    const level = /^h([1-3])$/.exec(value)?.[1];
    if (level) {
      const marker = `${'#'.repeat(Number(level))} `;
      toggleMarkdownLines({
        test: line => line.startsWith(marker) && !line.startsWith(`${marker}#`),
        remove: line => line.slice(marker.length),
        apply: line => `${marker}${line}`,
      });
    }
    return Boolean(level);
  };
  const removeMarkdownLinkAtSelection = () => {
    const value = source.value;
    const start = source.selectionStart;
    const end = source.selectionEnd;
    const selected = value.slice(start, end);
    const selectedLink = selected.match(/^\[([^\]\n]+)\]\(([^)\n]+)\)$/);
    if (selectedLink) {
      updateMarkdownSource(selectedLink[1], start, end, start, start + selectedLink[1].length);
      return true;
    }
    const suffix = value.slice(end).match(/^\]\(([^)\n]+)\)/)?.[0];
    if (start > 0 && value[start - 1] === '[' && suffix) {
      updateMarkdownSource(selected, start - 1, end + suffix.length, start - 1, start - 1 + selected.length);
      return true;
    }
    return false;
  };
  const addMarkdownLink = () => {
    if (!requireMarkdownSelection('link')) return;
    if (removeMarkdownLinkAtSelection()) return;
    const start = source.selectionStart;
    const end = source.selectionEnd;
    const selected = source.value.slice(start, end).trim();
    const requested = window.prompt(t('linkPrompt'), /^https?:\/\//i.test(selected) ? selected : 'https://');
    if (requested === null) return;
    let href = requested.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href)) href = `mailto:${href}`;
    else if (href && !/^[a-z][a-z0-9+.-]*:/i.test(href)) href = `https://${href}`;
    if (!isSafeHref(href)) { showToast(t('invalidLink')); return; }
    const label = selected || href;
    const replacement = `[${label}](${href})`;
    updateMarkdownSource(replacement, start, end, start + 1, start + 1 + label.length);
  };
  const runMarkdownTool = (action, value = '') => {
    if (!source) return;
    if (!requireMarkdownSelection(action)) return;
    if (action === 'bold') toggleMarkdownSelection('**');
    else if (action === 'italic') toggleMarkdownSelection('*');
    else if (action === 'strikeThrough') toggleMarkdownSelection('~~');
    else if (action === 'highlight') toggleMarkdownSelection('==');
    else if (action === 'inline-code') toggleMarkdownSelection('`');
    else if (action === 'insertUnorderedList') toggleMarkdownLines({
      test: line => /^[-+*]\s+(?!\[[ xX]\]\s+)/.test(line),
      remove: line => line.replace(/^[-+*]\s+/, ''),
      apply: line => `- ${line}`,
    });
    else if (action === 'insertOrderedList') toggleMarkdownLines({
      test: line => /^\d+\.\s+/.test(line),
      remove: line => line.replace(/^\d+\.\s+/, ''),
      apply: (line, index) => `${index + 1}. ${line}`,
    });
    else if (action === 'task-list') toggleMarkdownLines({
      test: line => /^[-+*]\s+\[[ xX]\]\s+/.test(line),
      remove: line => line.replace(/^[-+*]\s+\[[ xX]\]\s+/, ''),
      apply: line => `- [ ] ${line}`,
    });
    else if (action === 'formatBlock' && value === 'blockquote') toggleMarkdownLines({
      test: line => /^>\s+/.test(line),
      remove: line => line.replace(/^>\s+/, ''),
      apply: line => `> ${line}`,
    });
    else if (action === 'formatBlock' && value === 'pre') toggleMarkdownSelection('```\n', '\n```');
    else if (action === 'insertHorizontalRule') {
      const start = source.selectionStart;
      updateMarkdownSource('\n\n---\n\n', start, source.selectionEnd, start + 7, start + 7);
    } else if (action === 'link') addMarkdownLink();
    else if (action === 'unlink') {
      if (removeMarkdownLinkAtSelection()) return;
      const start = source.selectionStart;
      const end = source.selectionEnd;
      const selected = source.value.slice(start, end);
      const replacement = selected.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      updateMarkdownSource(replacement, start, end, start, start + replacement.length);
    } else if (action === 'undo' || action === 'redo') {
      source.focus();
      document.execCommand(action);
      source.dispatchEvent(new Event('input', { bubbles:true }));
    }
  };
  const selectionInsideBody = selection => {
    const anchor = selection?.anchorNode;
    return Boolean(anchor && (anchor === body || body.contains(anchor)));
  };
  const captureSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && selectionInsideBody(selection)) savedRange = selection.getRangeAt(0).cloneRange();
    return savedRange;
  };
  const restoreSelection = () => {
    if (!savedRange) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
  };
  const visualSelectionOptional = new Set(['undo', 'redo', 'insertHorizontalRule']);
  const visualHasSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && selectionInsideBody(selection) && !selection.isCollapsed && selection.toString().trim()) return true;
    return Boolean(savedRange && !savedRange.collapsed && body.contains(savedRange.commonAncestorContainer) && savedRange.toString().trim());
  };
  const requireVisualSelection = action => {
    if (visualSelectionOptional.has(action) || visualHasSelection()) return true;
    showToast(t('selectTextFirst'));
    body.focus();
    return false;
  };
  const syncToolbarState = () => {
    if (markdownMode) return;
    const selection = window.getSelection();
    if (!selectionInsideBody(selection)) return;
    captureSelection();
    ['bold', 'italic', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'].forEach(command => {
      const button = toolbar.querySelector(`[data-command="${command}"]`);
      if (!button) return;
      let active = false;
      try { active = document.queryCommandState(command); } catch { /* Unsupported command. */ }
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let block = selection.anchorNode?.nodeType === Node.ELEMENT_NODE ? selection.anchorNode : selection.anchorNode?.parentElement;
    while (block && block !== body && !/^(P|H1|H2|H3|BLOCKQUOTE|PRE)$/.test(block.tagName)) block = block.parentElement;
    blockFormat.value = block && /^(P|H1|H2|H3)$/.test(block.tagName) ? block.tagName.toLowerCase() : 'p';
    [['blockquote', 'blockquote'], ['pre', 'pre']].forEach(([value, tag]) => {
      const button = toolbar.querySelector(`[data-command="formatBlock"][data-value="${value}"]`);
      const active = block?.tagName?.toLowerCase() === tag;
      button?.classList.toggle('active', active);
      button?.setAttribute('aria-pressed', String(active));
    });
    [['inline-code', 'code'], ['highlight', 'mark'], ['link', 'a']].forEach(([action, tag]) => {
      const button = toolbar.querySelector(`[data-note-action="${action}"]`);
      const anchor = selection.anchorNode?.nodeType === Node.ELEMENT_NODE ? selection.anchorNode : selection.anchorNode?.parentElement;
      const active = Boolean(anchor?.closest?.(tag) && body.contains(anchor.closest(tag)));
      button?.classList.toggle('active', active);
      button?.setAttribute('aria-pressed', String(active));
    });
  };
  const runCommand = (command, value = null) => {
    restoreSelection();
    if (command === 'formatBlock' && value) {
      const selection = window.getSelection();
      let block = selection?.anchorNode?.nodeType === Node.ELEMENT_NODE ? selection.anchorNode : selection?.anchorNode?.parentElement;
      while (block && block !== body && !/^(P|H1|H2|H3|BLOCKQUOTE|PRE)$/.test(block.tagName)) block = block.parentElement;
      if (block?.tagName?.toLowerCase() === value.toLowerCase()) value = 'p';
    }
    body.focus();
    document.execCommand(command, false, value);
    captureSelection();
    commitHTML();
    syncToolbarState();
  };
  const selectedElementForTag = tag => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || selection.isCollapsed || !selectionInsideBody(selection)) return null;
    const range = selection.getRangeAt(0);
    const closest = node => (node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement)?.closest?.(tag);
    const startElement = closest(range.startContainer);
    const endElement = closest(range.endContainer);
    return startElement && startElement === endElement && body.contains(startElement) ? startElement : null;
  };
  const unwrapSelectedElement = element => {
    if (!element?.parentNode) return false;
    const parent = element.parentNode;
    const nodes = [...element.childNodes];
    if (!nodes.length) {
      element.remove();
      return true;
    }
    nodes.forEach(node => parent.insertBefore(node, element));
    element.remove();
    const range = document.createRange();
    range.setStartBefore(nodes[0]);
    range.setEndAfter(nodes.at(-1));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    savedRange = range.cloneRange();
    return true;
  };
  const toggleWrappedSelection = tag => {
    restoreSelection();
    const selection = window.getSelection();
    const activeElement = selectedElementForTag(tag);
    if (activeElement) {
      unwrapSelectedElement(activeElement);
      commitHTML();
      syncToolbarState();
      return;
    }
    if (!selection?.rangeCount || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const wrapper = document.createElement(tag);
    wrapper.append(range.extractContents());
    range.insertNode(wrapper);
    range.selectNodeContents(wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
    captureSelection();
    commitHTML();
    syncToolbarState();
  };
  const insertTaskList = () => {
    restoreSelection();
    const selection = window.getSelection();
    const lines = (selection?.toString() || t('taskList')).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const items = lines.map(line => `<li class="markdown-task" data-checked="false"><span class="markdown-task-box" contenteditable="false">☐</span>${escapeHTML(line)}</li>`).join('');
    document.execCommand('insertHTML', false, `<ul>${items}</ul>`);
    captureSelection();
    commitHTML();
  };
  const addLink = () => {
    restoreSelection();
    const activeLink = selectedElementForTag('a');
    if (activeLink) {
      unwrapSelectedElement(activeLink);
      commitHTML();
      syncToolbarState();
      return;
    }
    captureSelection();
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';
    const requested = window.prompt(t('linkPrompt'), /^https?:\/\//i.test(selectedText) ? selectedText : 'https://');
    if (requested === null) return;
    let href = requested.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href)) href = `mailto:${href}`;
    else if (href && !/^[a-z][a-z0-9+.-]*:/i.test(href)) href = `https://${href}`;
    if (!isSafeHref(href)) { showToast(t('invalidLink')); return; }
    restoreSelection();
    if (window.getSelection()?.isCollapsed) document.execCommand('insertHTML', false, `<a href="${escapeHTML(href)}">${escapeHTML(href)}</a>`);
    else document.execCommand('createLink', false, href);
    captureSelection();
    commitHTML();
  };
  const updateModeIndicator = () => {
    const label = markdownMode ? t('markdownSource') : t('richText');
    if (focusModeLabel) focusModeLabel.textContent = label;
    focusModeIcon?.setAttribute('href', markdownMode ? '#i-markdown' : '#i-note');
    const toolbarLabel = $('.note-tool-label', markdownToggle);
    if (toolbarLabel) toolbarLabel.textContent = markdownMode ? t('richText') : t('markdownSource');
  };
  const applyFocusMode = enabled => {
    const shouldEnable = Boolean(enabled && source);
    clearTimeout(focusExitTimer);
    focusExitTimer = 0;
    focusMode = shouldEnable;
    focusButton?.setAttribute('aria-pressed', String(focusMode));
    article?.classList.toggle('note-focus-active', focusMode);
    if (focusMode) {
      document.body.classList.remove('note-focus-leaving');
      document.body.classList.add('note-focus-mode');
      requestAnimationFrame(() => (markdownMode ? source : body).focus());
      return;
    }
    if (!document.body.classList.contains('note-focus-mode')) return;
    document.body.classList.add('note-focus-leaving');
    const finish = () => {
      document.body.classList.remove('note-focus-mode', 'note-focus-leaving');
      article?.classList.remove('note-focus-active');
      (markdownMode ? source : body).focus();
    };
    if (document.body.classList.contains('acta-reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else focusExitTimer = setTimeout(finish, 210);
  };
  // 模式切换保真：进入源码模式时暂存可视化 DOM，若源码未被修改，
  // 退出时直接恢复原文（零转换）；只有真正改过源码才走 MD→HTML 转换。
  let visualHTMLBeforeSource = '';
  let sourceDirty = false;
  const setMarkdownMode = enabled => {
    markdownMode = Boolean(enabled && source);
    if (markdownMode) {
      visualHTMLBeforeSource = body.innerHTML;
      sourceDirty = false;
      source.value = noteHTMLToMarkdown(body.innerHTML);
      body.hidden = true;
      source.hidden = false;
      formatMode.textContent = t('markdownSource');
      markdownToggle.title = t('richText');
      markdownToggle.setAttribute('aria-label', t('richText'));
      requestAnimationFrame(() => source.focus());
    } else {
      if (source && !source.hidden) {
        if (!sourceDirty) {
          body.innerHTML = visualHTMLBeforeSource;
        } else {
          item.body = markdownToNoteHTML(source.value);
          body.innerHTML = item.body;
        }
      }
      if (source) source.hidden = true;
      body.hidden = false;
      formatMode.textContent = 'Acta / Markdown-ready';
      markdownToggle.title = t('markdownSource');
      markdownToggle.setAttribute('aria-label', t('markdownSource'));
      requestAnimationFrame(() => body.focus());
    }
    markdownToggle.classList.toggle('active', markdownMode);
    markdownToggle.setAttribute('aria-pressed', String(markdownMode));
    $('.note-editor').classList.toggle('markdown-source-active', markdownMode);
    updateModeIndicator();
    updateStats(item.body);
  };
  const setFocusMode = enabled => {
    applyFocusMode(Boolean(enabled));
  };

  $('#exportNote')?.addEventListener('click', () => exportNoteToFile(item));
  /* ===================== 可视化模式实时 Markdown =====================
   * 行首键入 "# " / "> " / "- " / "1. " / "- [ ] " 时转换为对应块级格式，
   * 闭合 "**xx**"、"`xx`" 等行内标记时立即替换为富文本元素；
   * 全部通过 execCommand 完成，浏览器原生撤销栈保持可用。 */
  let liveMarkdownBusy = false;
  const liveInlineRules = [
    { marker: '**', tag: 'strong' },
    { marker: '~~', tag: 'del' },
    { marker: '==', tag: 'mark' },
    { marker: '`', tag: 'code' },
    { marker: '*', tag: 'em' },
    { marker: '_', tag: 'em' }
  ];
  const liveBlockFormats = { '#': 'h1', '##': 'h2', '###': 'h3', '>': 'blockquote' };
  const applyLiveBlockMarkdown = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return false;
    const lineText = node.nodeValue.slice(0, range.startOffset);
    if (!lineText.endsWith(' ')) return false;
    const token = lineText.trimEnd();
    let command = null;
    let value = null;
    let isTask = false;
    if (liveBlockFormats[token]) { command = 'formatBlock'; value = liveBlockFormats[token]; }
    else if (token === '-' || token === '*') command = 'insertUnorderedList';
    else if (/^\d+[.)]$/.test(token)) command = 'insertOrderedList';
    else if (token === '- [ ]' || token === '- [x]') { command = 'insertUnorderedList'; isTask = true; }
    if (!command) return false;
    const deleteRange = document.createRange();
    deleteRange.setStart(node, 0);
    deleteRange.setEnd(node, range.startOffset);
    selection.removeAllRanges();
    selection.addRange(deleteRange);
    document.execCommand('delete', false, null);
    document.execCommand(command, false, value);
    if (isTask) {
      const li = window.getSelection().anchorNode?.parentElement?.closest('li');
      if (li) {
        li.classList.add('markdown-task');
        li.dataset.checked = token.endsWith('x') ? 'true' : 'false';
        li.insertAdjacentHTML('afterbegin', `<span class="markdown-task-box" contenteditable="false">${token.endsWith('x') ? '☑' : '☐'}</span>`);
      }
    }
    return true;
  };
  const applyLiveInlineMarkdown = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || !selection.isCollapsed) return false;
    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return false;
    const before = node.nodeValue.slice(0, range.startOffset);
    for (const { marker, tag } of liveInlineRules) {
      if (!before.endsWith(marker)) continue;
      const contentEnd = before.length - marker.length;
      const contentStart = before.lastIndexOf(marker, contentEnd - 1);
      if (contentStart < 0) continue;
      const content = before.slice(contentStart + marker.length, contentEnd);
      if (!content || content.includes('\n')) continue;
      const replace = document.createRange();
      replace.setStart(node, contentStart);
      replace.setEnd(node, range.startOffset);
      selection.removeAllRanges();
      selection.addRange(replace);
      document.execCommand('insertHTML', false, `<${tag}>${escapeHTML(content)}</${tag}>`);
      return true;
    }
    return false;
  };
  body.addEventListener('input', event => {
    if (liveMarkdownBusy || event.isComposing) {
      commitHTML();
      return;
    }
    liveMarkdownBusy = true;
    try {
      applyLiveBlockMarkdown() || applyLiveInlineMarkdown();
    } finally {
      liveMarkdownBusy = false;
    }
    commitHTML();
  });
  body.addEventListener('click', event => {
    const checkbox = event.target.closest('.markdown-task-box');
    if (!checkbox) return;
    const task = checkbox.closest('.markdown-task');
    const checked = task.dataset.checked !== 'true';
    task.dataset.checked = String(checked);
    checkbox.textContent = checked ? '☑' : '☐';
    commitHTML();
  });
  $$('[data-command]', toolbar).forEach(button => button.addEventListener('mousedown', event => {
    event.preventDefault();
    if (markdownMode) runMarkdownTool(button.dataset.command, button.dataset.value || '');
    else if (requireVisualSelection(button.dataset.command)) runCommand(button.dataset.command, button.dataset.value || null);
  }));
  $$('[data-note-action="inline-code"],[data-note-action="highlight"],[data-note-action="task-list"],[data-note-action="link"]', toolbar).forEach(button => button.addEventListener('mousedown', event => {
    event.preventDefault();
    if (markdownMode) runMarkdownTool(button.dataset.noteAction);
    else if (requireVisualSelection(button.dataset.noteAction)) {
      if (button.dataset.noteAction === 'inline-code') toggleWrappedSelection('code');
      else if (button.dataset.noteAction === 'highlight') toggleWrappedSelection('mark');
      else if (button.dataset.noteAction === 'task-list') insertTaskList();
      else addLink();
    }
  }));
  blockFormat.addEventListener('pointerdown', captureSelection);
  blockFormat.addEventListener('change', () => {
    if (markdownMode) {
      if (!setMarkdownBlockFormat(blockFormat.value)) blockFormat.value = markdownBlockAtCaret();
    }
    else if (requireVisualSelection('formatBlock')) runCommand('formatBlock', blockFormat.value);
    else syncToolbarState();
  });
  markdownToggle.addEventListener('click', () => setMarkdownMode(!markdownMode));
  focusButton?.addEventListener('click', () => setFocusMode(true));
  exitFocusButton?.addEventListener('click', () => setFocusMode(false));
  source?.addEventListener('input', () => {
    sourceDirty = true;
    commitMarkdown();
  });
  source?.addEventListener('keydown', event => {
    const mod = event.metaKey || event.ctrlKey;
    if (event.key === 'Escape' && focusMode) {
      event.preventDefault();
      event.stopPropagation();
      setFocusMode(false);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const start = source.selectionStart;
      source.setRangeText('  ', start, source.selectionEnd, 'end');
      source.dispatchEvent(new Event('input'));
    } else if (mod && event.shiftKey && event.key.toLowerCase() === 'm') {
      event.preventDefault();
      event.stopPropagation();
      setMarkdownMode(false);
    }
  });
  body.addEventListener('keydown', event => {
    if (event.key === 'Escape' && focusMode) {
      event.preventDefault();
      event.stopPropagation();
      setFocusMode(false);
      return;
    }
    const mod = event.metaKey || event.ctrlKey;
    if (!mod) return;
    let handled = true;
    if (event.key.toLowerCase() === 'b') {
      if (requireVisualSelection('bold')) runCommand('bold');
    } else if (event.key.toLowerCase() === 'i') {
      if (requireVisualSelection('italic')) runCommand('italic');
    } else if (event.key.toLowerCase() === 'k') {
      if (requireVisualSelection('link')) addLink();
    } else if (event.shiftKey && event.key === '7') {
      if (requireVisualSelection('insertOrderedList')) runCommand('insertOrderedList');
    } else if (event.shiftKey && event.key === '8') {
      if (requireVisualSelection('insertUnorderedList')) runCommand('insertUnorderedList');
    }
    else if (event.shiftKey && event.key.toLowerCase() === 'm') setMarkdownMode(true);
    else if (event.altKey && ['1','2','3'].includes(event.key)) {
      if (requireVisualSelection('formatBlock')) runCommand('formatBlock', `h${event.key}`);
    } else if (event.code === 'Backquote') {
      if (requireVisualSelection('inline-code')) toggleWrappedSelection('code');
    }
    else handled = false;
    if (handled) { event.preventDefault(); event.stopPropagation(); }
  });
  if (window.__actaNoteToolbarSelectionHandler) document.removeEventListener('selectionchange', window.__actaNoteToolbarSelectionHandler);
  // selectionchange 在拖选与格式化后高频触发，其中 queryCommandState 与
  // 逐按钮的 DOM 查询在大文档上代价可观；合并到每帧最多一次。
  let toolbarSyncFrame = 0;
  const scheduleToolbarSync = () => {
    if (toolbarSyncFrame) return;
    toolbarSyncFrame = requestAnimationFrame(() => { toolbarSyncFrame = 0; syncToolbarState(); });
  };
  window.__actaNoteToolbarSelectionHandler = scheduleToolbarSync;
  document.addEventListener('selectionchange', scheduleToolbarSync);
}

function addTask(item) {
  item.tasks ||= [];
  item.completed = false;
  const task = { id: uid(), text: '', done: false };
  item.tasks.push(task);
  // 在重建编辑器前记录正在编辑的子任务行在视口中的位置：新行渲染后
  // 从同一视角位置接力平移过去，保持空间连续性（视线不跳动）。
  const pane = $('#editorPane');
  const activeRow = document.activeElement instanceof Element ? document.activeElement.closest('.task-row') : null;
  const anchorTop = activeRow && pane?.contains(activeRow)
    ? activeRow.getBoundingClientRect().top - pane.getBoundingClientRect().top
    : null;
  touchItem(item); renderEditor(); renderList();
  requestAnimationFrame(() => focusNewTaskRow(task.id, anchorTop));
  return task.id;
}

// 编辑区滚动动画：快速、非线性（easeOutQuart）的垂直平移，接近关键
// 阻尼弹簧的观感——起步快、缓入落点。可随时被用户滚轮/触摸打断，
// 从当前位置继续，绝不和用户抢方向盘。
const paneScrollAnimations = new WeakMap();
function cancelPaneScroll(pane) {
  const state = paneScrollAnimations.get(pane);
  if (!state) return;
  cancelAnimationFrame(state.frame);
  paneScrollAnimations.delete(pane);
}
function animatePaneScrollTo(pane, targetTop) {
  cancelPaneScroll(pane);
  if (reduceWindowMotion()) { pane.scrollTop = targetTop; return; }
  const from = pane.scrollTop;
  const delta = targetTop - from;
  if (Math.abs(delta) < 1) return;
  const duration = Math.min(560, 260 + Math.abs(delta) * 0.32);
  const start = performance.now();
  const easeOutQuart = progress => 1 - (1 - progress) ** 4;
  const state = { frame: 0 };
  const step = now => {
    if (!paneScrollAnimations.get(pane)) return;
    const progress = Math.min((now - start) / duration, 1);
    pane.scrollTop = from + delta * easeOutQuart(progress);
    if (progress < 1) state.frame = requestAnimationFrame(step);
    else paneScrollAnimations.delete(pane);
  };
  state.frame = requestAnimationFrame(step);
  paneScrollAnimations.set(pane, state);
}
// 用户的任何滚动意图立即接管，取消进行中的视角平移。
['wheel', 'touchstart'].forEach(type => {
  document.addEventListener(type, event => {
    const pane = event.target instanceof Element ? event.target.closest('#editorPane') : null;
    if (pane) cancelPaneScroll(pane);
  }, { passive: true, capture: true });
});

// 新行要立即可以输入：聚焦它的正文区并把视角非线性平移过去。注意不能
// 取 .task-text 的最后一项——无序模式底部还有折叠的已完成分组，新行
// （未完成）永远在活跃区，按 id 定位才准确。anchorTop 是添加前上一条
// 正在编辑的子任务行在视口中的纵向位置：新行落到同一视角位置，视线
// 无缝接力；没有参考时（如从标题或正文触发添加）居中落位。
function focusNewTaskRow(taskId, anchorTop = null) {
  const row = document.querySelector(`.task-row[data-task-id="${CSS.escape(taskId)}"]`);
  const text = row && !row.closest('#taskDoneGroup') ? $('.task-text', row) : null;
  if (!text) return;
  const pane = $('#editorPane');
  if (pane) {
    const paneRect = pane.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const fullyVisible = rowRect.top >= paneRect.top && rowRect.bottom <= paneRect.bottom;
    // 没有锚点（从标题、正文或「添加子任务」按钮触发）时，无论新行是否
    // 可见都把视角平移到让新行居中；有锚点（从正在编辑的行接力）且新行
    // 已完整可见时保持当前视角不动，避免无意义的抖动。
    if (!fullyVisible || anchorTop === null) {
      // 用 offsetTop 链定位：getBoundingClientRect 会把新行入场动画的
      // transform 位移算进坐标，造成落点偏差。
      let rowContentTop = 0;
      for (let node = row; node && node !== pane; node = node.offsetParent) rowContentTop += node.offsetTop;
      const rowHeight = row.offsetHeight;
      const maxAnchor = Math.max(0, pane.clientHeight - rowHeight);
      const desired = anchorTop === null
        ? (pane.clientHeight - rowHeight) / 2
        : Math.min(Math.max(anchorTop, 0), maxAnchor);
      const target = Math.min(Math.max(rowContentTop - desired, 0), Math.max(0, pane.scrollHeight - pane.clientHeight));
      animatePaneScrollTo(pane, target);
    }
  }
  text.focus({ preventScroll: true });
  // 新行为空时无需选区；若行内已有文字（例如重放定位），全选便于直接输入替换。
  const range = document.createRange();
  range.selectNodeContents(text);
  const selection = getSelection();
  selection.removeAllRanges();
  if (text.textContent) selection.addRange(range);
}

function linkItems(item, linked) {
  item.linkedIds ||= [];
  linked.linkedIds ||= [];
  if (!item.linkedIds.includes(linked.id)) item.linkedIds.push(linked.id);
  if (!linked.linkedIds.includes(item.id)) linked.linkedIds.push(item.id);
  const now = new Date().toISOString();
  item.updatedAt = now;
  linked.updatedAt = now;
  persist();
}

function unlinkItems(item, linked) {
  item.linkedIds = (item.linkedIds || []).filter(id => id !== linked.id);
  linked.linkedIds = (linked.linkedIds || []).filter(id => id !== item.id);
  const now = new Date().toISOString();
  item.updatedAt = now;
  linked.updatedAt = now;
  persist();
}

function openItem(id) {
  const target = library.items.find(item => item.id === id);
  if (!target) return;
  selectedId = id;
  if (isTodoComplete(target) && target.type === 'todo') {
    settings.showCompletedTodos = true;
    persist();
  }
  currentView = target.type === 'todo' ? 'todos' : 'notes';
  resetListFilters(target.type);
  searchQuery = '';
  mobileEditorOpen = true;
  $('#searchInput').value = '';
  $$('.filter-row [data-filter]').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
  renderAll();
}

// 快速跳转：点当前周期标签弹出年份导航 + 12 月网格，选中即切换。
function renderCalendarJump() {
  const pop = $('#calendarJumpPop');
  if (!pop) return;
  const active = calendarDate(calendarCursor) || calendarDate(todayISO());
  const year = active.getFullYear();
  const months = Array.from({ length: 12 }, (_, index) => index);
  pop.innerHTML = `
    <div class="calendar-jump-year">
      <button type="button" data-jump-year="-1" aria-label="${escapeHTML(t('previousYear'))}"><svg><use href="#i-chevron"/></svg></button>
      <b>${year}</b>
      <button type="button" data-jump-year="1" aria-label="${escapeHTML(t('nextYear'))}"><svg><use href="#i-chevron"/></svg></button>
    </div>
    <div class="calendar-jump-months">${months.map(month => `<button type="button" data-jump-month="${month}"${month === active.getMonth() ? ' class="active"' : ''}>${escapeHTML(calendarMonthShort(month))}</button>`).join('')}</div>`;
  pop.hidden = false;
}

function calendarMonthShort(month) {
  const formatter = new Intl.DateTimeFormat(calendarLocale(), { month: 'short' });
  return formatter.format(new Date(2021, month, 15));
}

function toggleCalendarJump(open) {
  const pop = $('#calendarJumpPop');
  const trigger = $('#calendarJumpTrigger');
  if (!pop || !trigger) return;
  const next = open ?? pop.hidden;
  pop.hidden = !next;
  trigger.setAttribute('aria-expanded', String(next));
}

function shiftCalendarCursor(direction) {
  const active = calendarDate(calendarCursor) || calendarDate(todayISO());
  if (calendarViewMode === 'year') {
    calendarCursor = new Date(active.getFullYear() + direction, active.getMonth(), active.getDate(), 12);
    return;
  }
  if (calendarViewMode === 'month') {
    const targetMonth = new Date(active.getFullYear(), active.getMonth() + direction, 1, 12);
    const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 12).getDate();
    calendarCursor = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(active.getDate(), lastDay), 12);
    return;
  }
  calendarCursor = calendarAddDays(active, direction * (calendarViewMode === 'week' ? 7 : 1));
}

function bindLinkedItems(item) {
  const select = $('#linkItemSelect');
  const addButton = $('#addItemLink');
  select?.addEventListener('change', () => { addButton.disabled = !select.value; });
  addButton?.addEventListener('click', () => {
    const linked = library.items.find(entry => entry.id === select.value
      && entry.id !== item.id
      && (item.type === 'todo' || entry.type === 'todo'));
    if (!linked) return;
    linkItems(item, linked);
    renderEditor();
    renderList();
    showToast(t('linked'));
  });
  $$('.linked-row').forEach(row => {
    const linked = library.items.find(entry => entry.id === row.dataset.linkedId);
    if (!linked) return;
    $('.open-linked-item', row).addEventListener('click', () => {
      // 计划板内点击关联条目：留在画布上切换——目标在板上时聚焦它的卡片与
      // 面板；不在板上时保持原行为（跳转到对应视图）。
      if (currentView === 'board') {
        const onBoard = boardLayoutCache?.board.widgets.some(widget => widget.ref === linked.id);
        if (onBoard && !isTrashed(linked)) { boardSelect(linked.id); return; }
      }
      openItem(linked.id);
    });
    $('.remove-item-link', row).addEventListener('click', () => {
      unlinkItems(item, linked);
      renderEditor();
      renderList();
      showToast(t('unlinked'));
    });
  });
}

function renderAll() {
  translateStaticUI();
  renderSidebar();
  renderList();
  renderEditor();
}

function browserImportNote() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt,text/markdown,text/plain';
    input.hidden = true;
    const cleanup = () => input.remove();
    input.addEventListener('cancel', () => { cleanup(); resolve(null); }, { once: true });
    input.addEventListener('change', async () => {
      try {
        const file = input.files?.[0];
        if (!file) { cleanup(); resolve(null); return; }
        if (file.size > 5 * 1024 * 1024) throw new Error(t('fileTooLarge'));
        const content = await file.text();
        cleanup();
        resolve({ content, fileName: file.name });
      } catch (error) { cleanup(); reject(error); }
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

function browserExportNote(fileName, content) {
  const isMarkdown = /\.md$/i.test(fileName);
  const url = URL.createObjectURL(new Blob([content], { type: `${isMarkdown ? 'text/markdown' : 'text/plain'};charset=utf-8` }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return Promise.resolve({ fileName });
}

function getNoteFileBridge() {
  if (window.actaDesktop?.importNote && window.actaDesktop?.exportNote) {
    return {
      importNote: window.actaDesktop.importNote,
      exportNote: window.actaDesktop.exportNote,
      exportText: window.actaDesktop.exportText || window.actaDesktop.exportNote
    };
  }
  const nativeFiles = window.Capacitor?.Plugins?.ActaSync;
  if (nativeFiles?.importNote && nativeFiles?.exportNote) {
    return {
      importNote: () => nativeFiles.importNote(),
      exportNote: (fileName, content) => nativeFiles.exportNote({ fileName, content }),
      exportText: (fileName, content) => nativeFiles.exportNote({ fileName, content })
    };
  }
  return { importNote: browserImportNote, exportNote: browserExportNote, exportText: browserExportNote };
}

async function importNoteFromFile() {
  $('#createMenu').classList.remove('open');
  try {
    const result = await getNoteFileBridge().importNote();
    if (!result) return;
    const imported = parseImportedNote(result.content, result.fileName || result.name || '');
    const now = new Date().toISOString();
    const currentFolder = currentView.startsWith('folder:') ? currentView.split(':')[1] : 'ideas';
    const item = {
      id: uid(), type: 'note', folderId: getFolder(currentFolder) ? currentFolder : library.folders[0]?.id,
      title: imported.title, body: imported.body, tags: imported.tags, linkedIds: [],
      createdAt: imported.createdAt, updatedAt: now
    };
    library.items.unshift(item);
    selectedId = item.id;
    currentView = 'inbox';
    resetListFilters('note');
    currentFilter = 'all';
    searchQuery = '';
    mobileEditorOpen = true;
    $('#searchInput').value = '';
    $$('.filter-row [data-filter]').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
    persist(); renderAll(); showToast(t('noteImported'));
  } catch (error) {
    showToast(`${t('importFailed')}: ${error?.message || t('invalidNoteFile')}`);
  }
}

async function exportNoteToFile(item) {
  if (!item || item.type !== 'note') return;
  try {
    const result = await getNoteFileBridge().exportNote(portableFileName(item.title), buildNoteMarkdown(item));
    if (result) showToast(t('noteExported'));
  } catch (error) {
    showToast(`${t('exportFailed')}: ${error?.message || t('invalidNoteFile')}`);
  }
}

// 通用命名对话框：归类新建 / 汇总板新建与重命名共用一套弹窗。
function askNameDialog({ title, defaultValue = '', icon = '#i-folder', confirmIcon = '#i-plus', maxlength = 60 }) {
  return new Promise(resolve => {
    const dialog = document.createElement('dialog');
    dialog.className = 'relation-dialog folder-name-dialog';
    dialog.innerHTML = `
      <header class="relation-dialog-head"><span><svg><use href="${icon}"/></svg></span><h3>${escapeHTML(title)}</h3><button class="relation-dialog-close" type="button" aria-label="${escapeHTML(t('cancel'))}"><svg><use href="#i-close"/></svg></button></header>
      <form class="relation-dialog-body folder-name-form" method="dialog" novalidate>
        <input class="folder-name-input" maxlength="${maxlength}" autocomplete="off" value="${escapeHTML(defaultValue)}"/>
        <div class="settings-actions">
          <button type="button" class="settings-button secondary" data-name-cancel>${escapeHTML(t('cancel'))}</button>
          <button type="submit" class="settings-button"><svg><use href="${confirmIcon}"/></svg><span>${escapeHTML(t('confirm'))}</span></button>
        </div>
      </form>`;
    const input = dialog.querySelector('.folder-name-input');
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      resolve(value);
      if (dialog.open) dialog.close();
      dialog.remove();
    };
    dialog.querySelector('[data-name-cancel]').addEventListener('click', () => finish(null));
    dialog.querySelector('.relation-dialog-close').addEventListener('click', () => finish(null));
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(null); });
    dialog.addEventListener('close', () => finish(null));
    dialog.addEventListener('submit', event => {
      event.preventDefault();
      const value = input.value.trim();
      finish(value || null);
    });
    document.body.appendChild(dialog);
    dialog.showModal();
    input.focus();
    input.select();
  });
}

function askClassificationName(defaultName) {
  return askNameDialog({ title: t('folderPrompt'), defaultValue: defaultName, icon: '#i-folder' });
}

function bindShell() {
  // —— 安卓放射式新建菜单 ——
  // 五枚圆钮从中央新建按钮沿弧线弹出（等角围绕、依次入场），
  // 底部渐入遮罩保证文字对比度；桌面端保持侧栏的纵向功能列表。
  const MOBILE_CREATE_RADIUS = 112;
  // 弧上角度（屏幕角：0°=右，逆时针；90°=正上）。速记居正上（最常用），
  // 笔记 / 待办在两侧上位，打卡 / 导入在两侧下位，对称展开。
  const mobileCreateAngles = { quick: 90, note: 54, todo: 126, checkin: 18, import: 162 };
  let mobileCreateHideTimer = 0;
  const syncMobileCreatePositions = () => {
    $$('#mobileCreateActions .mobile-create-item').forEach(item => {
      const angle = (mobileCreateAngles[item.dataset.create] ?? 90) * Math.PI / 180;
      // 屏幕坐标：y 向下为正，向上弹出取负。
      item.style.setProperty('--dx', `${Math.round(Math.cos(angle) * MOBILE_CREATE_RADIUS)}px`);
      item.style.setProperty('--dy', `${Math.round(-Math.sin(angle) * MOBILE_CREATE_RADIUS)}px`);
    });
  };
  const openMobileCreate = () => {
    const layer = $('#mobileCreateLayer');
    if (!layer) return;
    clearTimeout(mobileCreateHideTimer);
    syncMobileCreatePositions();
    layer.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('open')));
    $('#newButton').classList.add('is-open');
  };
  const closeMobileCreate = () => {
    const layer = $('#mobileCreateLayer');
    if (!layer || layer.hidden) return;
    layer.classList.remove('open');
    $('#newButton').classList.remove('is-open');
    clearTimeout(mobileCreateHideTimer);
    mobileCreateHideTimer = setTimeout(() => { layer.hidden = true; }, 300);
  };
  const toggleMobileCreate = () => {
    const layer = $('#mobileCreateLayer');
    if (layer && !layer.hidden) closeMobileCreate(); else openMobileCreate();
  };
  // 返回键统一入口（interface.js 的 __actaHandleBackButton）会调用：放射菜单是返回层级之一。
  window.__actaCloseMobileCreate = () => { if (!layer.hidden) closeMobileCreate(); };
  $('#newButton').addEventListener('click', event => {
    event.stopPropagation();
    if (matchMedia('(max-width: 800px)').matches) {
      toggleMobileCreate();
      return;
    }
    $('#createMenu').classList.toggle('open');
  });
  const mobileLayer = $('#mobileCreateLayer');
  mobileLayer?.addEventListener('click', event => {
    if (event.target.closest('[data-mobile-create-close]')) { closeMobileCreate(); return; }
    // 导入是既有文件选择流程，先于通用 createItem 分派（它也带 data-create 以取弧位）。
    if (event.target.closest('[data-import]')) {
      closeMobileCreate();
      importNoteFromFile();
      return;
    }
    const action = event.target.closest('[data-create]');
    if (action) {
      closeMobileCreate();
      createItem(action.dataset.create);
    }
  });
  // 旋转 / 拉宽到桌面布局时若放射菜单还开着，静默收起（桌面没有该层）。
  matchMedia('(max-width: 800px)').addEventListener?.('change', event => {
    if (!event.matches) closeMobileCreate();
  });
  $$('#createMenu [data-create]').forEach(button => button.addEventListener('click', () => createItem(button.dataset.create)));
  $('#importNoteButton').addEventListener('click', importNoteFromFile);
  document.addEventListener('click', event => {
    if (!event.target.closest('#createMenu')) $('#createMenu').classList.remove('open');
  });
  document.addEventListener('click', event => {
    const modeButton = event.target.closest('[data-calendar-mode]');
    if (modeButton) {
      calendarViewMode = ['year', 'month', 'week', 'day'].includes(modeButton.dataset.calendarMode) ? modeButton.dataset.calendarMode : 'month';
      calendarMotion = 'zoom';
      renderList();
      return;
    }
    const shiftButton = event.target.closest('[data-calendar-shift]');
    if (shiftButton) {
      calendarMotion = Number(shiftButton.dataset.calendarShift) < 0 ? 'backward' : 'forward';
      shiftCalendarCursor(Number(shiftButton.dataset.calendarShift) < 0 ? -1 : 1);
      renderList();
      return;
    }
    if (event.target.closest('[data-calendar-today]')) {
      calendarCursor = calendarDate(todayISO());
      calendarMotion = 'today';
      renderList();
      return;
    }
    const mobileCalendar = currentView === 'calendar' && matchMedia('(max-width: 800px)').matches;
    if (mobileCalendar && calendarViewMode === 'year') {
      const monthRegion = event.target.closest('[data-calendar-year-month]');
      if (monthRegion) {
        calendarCursor = calendarDate(monthRegion.dataset.calendarYearMonth) || calendarCursor;
        calendarViewMode = 'month';
        calendarMotion = 'zoom';
        renderList();
      }
      return;
    }
    if (mobileCalendar && calendarViewMode === 'month') {
      const weekRegion = event.target.closest('[data-calendar-week]');
      if (weekRegion) {
        const dayRegion = event.target.closest('[data-calendar-cell]');
        calendarCursor = calendarDate(dayRegion?.dataset.calendarCell || weekRegion.dataset.calendarWeek) || calendarCursor;
        calendarViewMode = 'week';
        calendarMotion = 'zoom';
        renderList();
      }
      return;
    }
    if (mobileCalendar && calendarViewMode === 'week') {
      const dayRegion = event.target.closest('[data-calendar-day]');
      if (dayRegion) {
        calendarCursor = calendarDate(dayRegion.dataset.calendarDay) || calendarCursor;
        calendarViewMode = 'day';
        calendarMotion = 'zoom';
        renderList();
      }
      return;
    }
    const monthButton = event.target.closest('[data-calendar-month]');
    if (monthButton) {
      calendarCursor = calendarDate(monthButton.dataset.calendarMonth) || calendarCursor;
      calendarViewMode = 'month';
      calendarMotion = 'zoom';
      renderList();
      return;
    }
    const dateButton = event.target.closest('[data-calendar-date]');
    if (dateButton) {
      calendarCursor = calendarDate(dateButton.dataset.calendarDate) || calendarCursor;
      calendarViewMode = 'day';
      calendarMotion = 'zoom';
      renderList();
      return;
    }
    const subtaskButton = event.target.closest('[data-calendar-subtask-toggle]');
    if (subtaskButton) {
      const item = library.items.find(entry => entry.id === subtaskButton.dataset.calendarSubtaskToggle && entry.type === 'todo');
      toggleCalendarSubtask(item, subtaskButton.dataset.calendarSubtaskId);
      renderAll();
      return;
    }
    const toggleButton = event.target.closest('[data-calendar-toggle]');
    if (toggleButton) {
      const item = library.items.find(entry => entry.id === toggleButton.dataset.calendarToggle && entry.type === 'todo');
      if (!item) return;
      setTodoCompletion(item, !isTodoComplete(item));
      renderAll();
      return;
    }
    const noteButton = event.target.closest('[data-calendar-open-note]');
    if (noteButton) {
      openItem(noteButton.dataset.calendarOpenNote);
      return;
    }
    const todoButton = event.target.closest('[data-calendar-open]');
    if (todoButton) openItem(todoButton.dataset.calendarOpen);
  });
  document.addEventListener('click', event => {
    const navigation = event.target.closest('[data-view]');
    if (navigation) {
      currentView = navigation.dataset.view;
      if (currentView === 'calendar') calendarMotion = 'enter';
      mobileEditorOpen = false;
      renderSidebar(); renderList();
      const visible = getVisibleItems();
      // 进入汇总板不带旧选中：画布以全宽打开，点击卡片再展开编辑器；
      // 其余视图维持「选中项不在列表时回落到第一项」的既有行为。
      if (currentView === 'board') selectedId = null;
      else if (!visible.some(item => item.id === selectedId)) selectedId = visible[0]?.id || null;
      if (currentView !== 'calendar') renderEditor();
    }
    const card = event.target.closest('.item-card');
    if (card) {
      selectedId = card.dataset.id;
      mobileEditorOpen = true;
      if (!matchMedia('(max-width: 800px)').matches) {
        $$('.item-card').forEach(entry => entry.classList.toggle('active', entry === card));
      }
      renderEditor();
    }
  });
  const refreshFilteredList = () => {
    renderList();
    const visible = getVisibleItems();
    if (!visible.some(item => item.id === selectedId)) { selectedId = visible[0]?.id || null; renderEditor(); }
  };
  $$('.filter-row [data-filter]').forEach(button => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    $$('.filter-row [data-filter]').forEach(entry => entry.classList.toggle('active', entry === button));
    refreshFilteredList();
  }));
  $$('.filter-row [data-trash-filter]').forEach(button => button.addEventListener('click', () => {
    trashTypeFilter = button.dataset.trashFilter;
    $$('.filter-row [data-trash-filter]').forEach(entry => entry.classList.toggle('active', entry === button));
    refreshFilteredList();
  }));
  $('#trashFolderFilter')?.addEventListener('change', event => {
    trashFolderFilter = event.target.value;
    event.target.closest('.filter-select')?.classList.toggle('is-active', trashFolderFilter !== 'all');
    refreshFilteredList();
  });
  [
    ['todoPriorityFilter', value => { todoPriorityFilter = value; }],
    ['todoDueFilter', value => { todoDueFilter = value; }],
    ['todoFolderFilter', value => { todoFolderFilter = value; }],
    ['noteFolderFilter', value => { noteFolderFilter = value; }],
    ['noteRelationFilter', value => { noteRelationFilter = value; }],
    ['noteUpdatedFilter', value => { noteUpdatedFilter = value; }]
  ].forEach(([id, update]) => $(`#${id}`)?.addEventListener('change', event => {
    update(event.target.value);
    refreshFilteredList();
  }));
  $('#clearListFilters')?.addEventListener('click', () => {
    resetListFilters(listFilterContext());
    refreshFilteredList();
  });
  $('#listSortOrder')?.addEventListener('change', event => {
    listSortMode = listSortModes.includes(event.target.value) ? event.target.value : 'updated';
    settings.sortMode = listSortMode;
    persist();
    refreshFilteredList();
  });
  $('#todoShowCompleted')?.addEventListener('change', event => {
    settings.showCompletedTodos = event.target.checked;
    persist();
    refreshFilteredList();
  });
  // 设置页「显示已完成待办」与筛选栏双向同步。
  const showCompletedSettingSync = () => {
    const settingBox = document.getElementById('showCompletedSetting');
    if (settingBox) settingBox.checked = settings.showCompletedTodos;
  };
  $('#todoCompletedToggle')?.addEventListener('click', () => setTimeout(showCompletedSettingSync, 0));
  $('#searchInput').addEventListener('input', event => {
    searchQuery = event.target.value.trim(); renderList();
    const visible = getVisibleItems();
    if (!visible.some(item => item.id === selectedId)) { selectedId = visible[0]?.id || null; renderEditor(); }
  });
  // 日历快速跳转：标签开关浮层，年导航与月份格选中即跳转。
  $('#calendarJumpTrigger')?.addEventListener('click', () => {
    const pop = $('#calendarJumpPop');
    if (pop && !pop.hidden) { toggleCalendarJump(false); return; }
    renderCalendarJump();
    toggleCalendarJump(true);
  });
  $('#calendarJumpPop')?.addEventListener('click', event => {
    const yearButton = event.target.closest('[data-jump-year]');
    if (yearButton) {
      calendarCursor = new Date((calendarDate(calendarCursor) || calendarDate(todayISO())).getFullYear() + Number(yearButton.dataset.jumpYear), 0, 1, 12);
      renderCalendarJump();
      return;
    }
    const monthButton = event.target.closest('[data-jump-month]');
    if (monthButton) {
      const active = calendarDate(calendarCursor) || calendarDate(todayISO());
      calendarCursor = new Date(active.getFullYear(), Number(monthButton.dataset.jumpMonth), 1, 12);
      calendarMotion = 'zoom';
      toggleCalendarJump(false);
      renderList();
    }
  });
  document.addEventListener('pointerdown', event => {
    const pop = $('#calendarJumpPop');
    if (pop && !pop.hidden && !event.target.closest('#calendarJump')) toggleCalendarJump(false);
  });
  $('#addFolder').addEventListener('click', async () => {
    const name = await askClassificationName(t('folderDefault'));
    if (!name) return;
    const palette = ['#6f8a72', '#b68b54', '#7a7799', '#a87876', '#668792'];
    const folder = { id: uid(), name, color: palette[library.folders.length % palette.length] };
    library.folders.push(folder);
    logHistory('folder-created', folder.name);
    currentView = `folder:${folder.id}`;
    persist(); renderAll(); showToast(t('folderAdded'));
  });
  matchMedia('(max-width: 800px)').addEventListener?.('change', () => {
    if (currentView !== 'calendar') return;
    renderList();
  });
  bindDeleteConfirmDialog();
  document.addEventListener('keydown', event => {
    if (isImeComposing(event)) return;
    const mod = event.metaKey || event.ctrlKey;
    if (!mod) {
      if (event.key === 'Escape') {
        $('#createMenu').classList.remove('open');
        // 汇总板的 Esc 按层级退场：取消标注绘制 → 收起组件工具条 → 收起编辑器。
        if (currentView === 'board' && !event.target.closest('.editor-pane, dialog')) {
          if (boardPendingMarker) boardCancelDraw();
          else if (boardSelection.size) boardSetSelection([]);
          else if (selectedId) boardDeselect();
        }
      }
      return;
    }
    // Keep the global shortcuts from hijacking keys inside the editor, quick capture
    // and settings inputs; ignore auto-repeat so holding the combo creates one item.
    if (event.repeat) return;
    if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    if (document.querySelector('dialog[open]')) return;
    if (event.key.toLowerCase() === 'n') { event.preventDefault(); createItem('note'); }
    if (event.key.toLowerCase() === 'k') { event.preventDefault(); $('#searchInput').focus(); }
    // 计划板：Ctrl/⌘+Z 撤销、Shift+Z 或 Y 重做、G 组合所选、Shift+G 解组
    // （画布手势专用，不抢编辑器内快捷键）。
    if (currentView === 'board' && !event.target?.closest?.('.editor-pane, input, textarea, [contenteditable="true"], [contenteditable="plaintext-only"]')) {
      const key = event.key.toLowerCase();
      if (key === 'z' && !event.shiftKey) { event.preventDefault(); boardUndo(); }
      else if ((key === 'z' && event.shiftKey) || key === 'y') { event.preventDefault(); boardRedo(); }
      else if (key === 'g' && event.shiftKey) { event.preventDefault(); boardUngroupSelection(); }
      else if (key === 'g') { event.preventDefault(); boardGroupSelection(); }
    }
  });
}

function getSyncBridge() {
  if (window.actaDesktop) return window.actaDesktop;
  const nativeSync = window.Capacitor?.Plugins?.ActaSync;
  if (!nativeSync) return null;
  return {
    chooseSyncFolder: async () => {
      const result = await nativeSync.chooseSyncFolder();
      return result?.uri ? { folder: result.uri, label: result.name || result.uri } : null;
    },
    uploadLibrary: (folder, library) => nativeSync.uploadLibrary({ folder, library }),
    downloadLibrary: (folder) => nativeSync.downloadLibrary({ folder }),
    inspectFolder: (folder) => nativeSync.inspectFolder({ folder })
  };
}

// Android 局域网同步桥：与桌面端 window.actaDesktop.lanSync 同一套 API 面，
// 原生实现在 ActaLanPlugin（UDP 发现 + 极简 HTTP + 协议 v2 两段式确认）。
// 事件名与载荷结构与桌面端一致，interface.js 的局域网逻辑两端共用。
(function initAndroidLanBridge() {
  const native = window.Capacitor?.Plugins?.ActaLan;
  if (!native) return;
  // 大档案数据跨 WebView 桥单次传输会卡死/失败，因此统一分块传递。
  const LAN_CHUNK_CHARS = 400000;
  const sendInChunks = async (begin, append, text) => {
    const { handle } = await begin({ size: text.length });
    for (let offset = 0; offset < text.length; offset += LAN_CHUNK_CHARS) {
      const result = await append({ handle, chunk: text.slice(offset, offset + LAN_CHUNK_CHARS) });
      if (result?.done) return result;
    }
    return null;
  };
  const lanSync = {
    startService: (profiles, trusted, identity) => native.startService({ profiles, trusted, identity }),
    updateMeta: (profiles, trusted, identity) => native.updateMeta({ profiles, trusted, identity }),
    stopService: () => native.stopService(),
    serviceStatus: () => native.serviceStatus(),
    discover: (timeoutMs = 1800) => native.discover({ timeoutMs }).then(result => result?.peers || []),
    fetchInfo: (ip, port, session) => native.fetchInfo({ ip, port, session }).then(result => result?.info || {}),
    pushPlan: (ip, port, session, plan) => native.pushPlan({ ip, port, session, plan }).then(result => result?.token || ''),
    pushData: async (ip, port, session, token, bundle) => {
      const result = await sendInChunks(
        payload => native.pushDataBegin({ ...payload, ip, port, session, token }),
        payload => native.pushDataAppend(payload),
        JSON.stringify(bundle)
      );
      if (!result?.applied) throw new Error('对方写入数据失败。');
      return true;
    },
    fetchProfileBundle: (ip, port, session, profileId) => native.fetchProfileBundle({ ip, port, session, profileId }).then(result => result?.bundle || null),
    decideIncoming: (accept) => native.decideIncoming({ accept }),
    provideBundle: async (requestId, result) => {
      if (!result?.ok) return native.provideBundle({ requestId, ok: false, bundle: null, error: result?.error ?? '档案不可用' });
      await sendInChunks(
        payload => native.provideBundleBegin({ ...payload, requestId }),
        payload => native.provideBundleAppend(payload),
        JSON.stringify(result.bundle)
      );
    },
    readBundleChunk: (requestId, offset) => native.readBundleChunk({ requestId, offset }),
    acceptIncoming: () => native.acceptIncoming().then(result => (result?.bundle ? result.bundle : result)),
    confirmIncoming: () => native.confirmIncoming(),
    rejectIncoming: () => native.rejectIncoming(),
    backupLocal: (bundle, profileName) => native.backupLocal({ bundle, profileName })
  };
  const listen = (event, handler) => (native.addListener
    ? native.addListener(event, payload => handler({ payload }))
    : Promise.resolve(() => {}));
  window.actaMobileLan = {
    lanSync,
    onLanIncoming: handler => listen('lanIncoming', handler),
    onLanData: handler => listen('lanData', handler),
    onLanFetch: handler => listen('lanFetch', handler),
    onLanProgress: handler => listen('lanProgress', handler),
    onLanRejected: handler => listen('lanRejected', handler)
  };
})();

// Android 应用内更新：检查 GitHub Release 的安卓安装包 → 询问 → 下载（进度）→
// 下载完成后自动拉起系统安装器（未授「安装未知应用」时先跳转授权页，授权后
// 重试）。桌面端更新走 updater.js（Tauri 机制），本模块只在安卓原生容器内启用。
(function initAndroidUpdaterBridge() {
  const native = window.Capacitor?.Plugins?.ActaUpdater;
  if (!native) return;
  const language = () => (window.settings?.language === 'en' ? 'en' : window.settings?.language === 'zh-Hant' ? 'zh-Hant' : 'zh'); // ja/ko/fr/de/es/ru 暂回退英文文案
  const copy = {
    zh: {
      title: '发现新版本',
      ask: '发现新版本，是否下载并安装？下载完成后会自动打开系统安装程序。',
      installing: '下载完成，正在打开安装程序…',
      permission: '需要允许 Acta 安装未知应用。已为你打开系统设置，授权后点击下方按钮继续。',
      retry: '已授权，继续安装',
      failed: '更新失败：{detail}',
      notesEmpty: '（暂无更新说明）',
      later: '稍后',
      update: '下载更新',
      close: '关闭',
      size: '{received} / {total} MB（{percent}%）'
    },
    en: {
      title: 'Update available',
      ask: 'Download and install the update now? The system installer opens automatically once the download finishes.',
      installing: 'Download complete — opening the installer…',
      permission: 'Acta needs permission to install unknown apps. System settings is open — tap the button below after granting it.',
      retry: 'Granted, continue install',
      failed: 'Update failed: {detail}',
      notesEmpty: '(no release notes)',
      later: 'Later',
      update: 'Download update',
      close: 'Close',
      size: '{received} / {total} MB ({percent}%)'
    },
    'zh-Hant': {
      title: '發現新版本',
      ask: '發現新版本，是否下載並安裝？下載完成後會自動開啟系統安裝程式。',
      installing: '下載完成，正在開啟安裝程式…',
      permission: '需要允許 Acta 安裝未知應用。已為你開啟系統設定，授權後點擊下方按鈕繼續。',
      retry: '已授權，繼續安裝',
      failed: '更新失敗：{detail}',
      notesEmpty: '（暫無更新說明）',
      later: '稍後',
      update: '下載更新',
      close: '關閉',
      size: '{received} / {total} MB（{percent}%）'
    }
  };
  const text = (key, vars = {}) => {
    let message = (copy[language()] || copy.zh)[key] || key;
    for (const [name, value] of Object.entries(vars)) message = message.replace(`{${name}}`, value);
    return message;
  };

  let dialog = null;
  let state = 'idle';
  let pending = null; // { version, url, size, notes, htmlUrl, filePath? }

  const ensureDialog = () => {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'acta-updater-dialog';
    dialog.innerHTML = `
      <style>
        .acta-updater-dialog { border: 0; padding: 0; border-radius: 16px; background: #f6f2e9; color: #3a3126;
          box-shadow: 0 18px 60px rgba(40, 32, 20, .28); width: min(400px, calc(100vw - 48px)); }
        .acta-updater-dialog::backdrop { background: rgba(30, 24, 15, .42); }
        .acta-updater-card { padding: 22px 24px 20px; }
        .acta-updater-card h3 { margin: 0 0 8px; font-size: 17px; }
        .acta-updater-card .acta-updater-version { margin: 0 0 10px; font-size: 13px; font-weight: 600; color: #8a7d68; }
        .acta-updater-card .acta-updater-notes { margin: 0 0 14px; font-size: 12.5px; line-height: 1.6; color: #6f6350;
          max-height: 96px; overflow: auto; white-space: pre-line; }
        .acta-updater-card .acta-updater-track { height: 6px; border-radius: 3px; background: #ded6c3; overflow: hidden; margin-bottom: 8px; }
        .acta-updater-card .acta-updater-bar { height: 100%; width: 0; border-radius: 3px; background: #6f6350; transition: width .25s ease; }
        .acta-updater-card .acta-updater-percent { margin: 0 0 16px; font-size: 12px; color: #8a7d68; min-height: 16px; }
        .acta-updater-card .acta-updater-actions { display: flex; justify-content: flex-end; gap: 10px; }
        .acta-updater-card button { border: 0; border-radius: 9px; padding: 8px 18px; font-size: 13px; cursor: pointer;
          background: #4a4036; color: #f6f2e9; }
        .acta-updater-card button:hover { background: #3a3126; }
        .acta-updater-card button.secondary { background: transparent; color: #6f6350; }
        .acta-updater-card button.secondary:hover { background: rgba(74, 64, 54, .08); }
        .acta-updater-card button:disabled { opacity: .45; cursor: default; }
      </style>
      <div class="acta-updater-card">
        <h3 class="acta-updater-title"></h3>
        <p class="acta-updater-version"></p>
        <p class="acta-updater-notes"></p>
        <div class="acta-updater-track" hidden><div class="acta-updater-bar"></div></div>
        <p class="acta-updater-percent"></p>
        <div class="acta-updater-actions">
          <button type="button" class="secondary"></button>
          <button type="button" class="primary"></button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    dialog.addEventListener('cancel', event => {
      if (state === 'download' || state === 'installing') event.preventDefault();
    });
    dialog.addEventListener('close', () => {
      if (state !== 'download' && state !== 'installing') state = 'idle';
    });
    return dialog;
  };

  const render = (mode, extra = {}) => {
    state = mode;
    const card = ensureDialog();
    const title = card.querySelector('.acta-updater-title');
    const version = card.querySelector('.acta-updater-version');
    const notes = card.querySelector('.acta-updater-notes');
    const track = card.querySelector('.acta-updater-track');
    const bar = card.querySelector('.acta-updater-bar');
    const percent = card.querySelector('.acta-updater-percent');
    const secondary = card.querySelector('button.secondary');
    const primary = card.querySelector('button.primary');

    title.textContent = mode === 'error' ? text('failed', { detail: extra.detail || '' }) : text('title');
    version.textContent = mode === 'error' ? '' : (pending ? `v${pending.version}` : '');
    notes.textContent = mode === 'ask' ? (pending?.notes || text('notesEmpty')) : (extra.message || text(mode === 'installing' ? 'installing' : 'permission'));
    notes.hidden = mode === 'download' || mode === 'error';
    track.hidden = mode !== 'download';
    if (extra.percent != null) bar.style.width = `${Math.max(0, Math.min(100, extra.percent))}%`;
    percent.textContent = extra.percentText || '';

    secondary.hidden = false;
    primary.disabled = false;
    secondary.textContent = text('later');
    if (mode === 'ask') {
      primary.textContent = text('update');
      primary.onclick = () => startDownload();
      secondary.onclick = () => dialog.close();
    } else if (mode === 'download') {
      primary.textContent = text('update');
      primary.disabled = true;
      secondary.hidden = true;
      primary.onclick = null;
      secondary.onclick = null;
    } else if (mode === 'installing') {
      primary.textContent = text('update');
      primary.disabled = true;
      secondary.hidden = true;
      primary.onclick = null;
      secondary.onclick = null;
    } else if (mode === 'permission') {
      primary.textContent = text('retry');
      primary.onclick = () => tryInstall();
      secondary.onclick = () => dialog.close();
    } else if (mode === 'error') {
      primary.textContent = text('update');
      primary.onclick = () => startDownload();
      secondary.textContent = text('close');
      secondary.onclick = () => dialog.close();
    }
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
  };

  const formatSize = bytes => (bytes / 1048576).toFixed(1);
  const renderProgress = payload => {
    if (state !== 'download') return;
    const received = payload?.received || 0;
    const total = payload?.total || 0;
    const percent = total > 0 ? Math.round(received / total * 100) : 0;
    render('download', {
      percent,
      percentText: total > 0
        ? text('size', { received: formatSize(received), total: formatSize(total), percent })
        : formatSize(received) + ' MB'
    });
  };
  if (native.addListener) {
    native.addListener('updaterProgress', payload => renderProgress(payload?.received != null ? payload : payload?.payload));
  }

  const tryInstall = async () => {
    if (!pending?.filePath) return;
    render('installing');
    try {
      const install = await native.installUpdate({ filePath: pending.filePath });
      if (install?.needsPermission) {
        render('permission');
        return;
      }
      dialog.close();
      state = 'idle';
    } catch (error) {
      render('error', { detail: error?.message || String(error) });
    }
  };

  const startDownload = async () => {
    if (!pending?.url || state === 'download') return;
    render('download', { percentText: text('size', { received: '0.0', total: String(formatSize(pending.size || 0)), percent: 0 }) });
    try {
      const result = await native.downloadUpdate({ url: pending.url, version: pending.version, size: pending.size || 0 });
      if (state !== 'download') return;
      pending.filePath = result?.filePath || '';
      await tryInstall();
    } catch (error) {
      render('error', { detail: error?.message || String(error) });
    }
  };

  const open = updateInfo => {
    if (state === 'download' || state === 'installing') return;
    pending = updateInfo && updateInfo.version ? { ...pending, ...updateInfo } : pending;
    if (!pending) return;
    render('ask');
  };

  window.actaMobileUpdater = {
    open,
    checkUpdate: async currentVersion => {
      const result = await native.checkUpdate({ currentVersion: currentVersion || '' });
      return result?.available
        ? { version: result.version, url: result.url, size: result.size || 0, notes: result.notes || '', htmlUrl: result.htmlUrl || '' }
        : null;
    }
  };

  // 启动后静默检查一次；离线或接口失败都安静跳过，不打扰使用。
  window.setTimeout(async () => {
    if (state !== 'idle') return;
    try {
      const info = await window.actaMobileUpdater.checkUpdate('');
      if (info && state === 'idle') open(info);
    } catch { /* 离线等情况忽略 */ }
  }, 6000);
})();

watchEditorPaneWidth();
bindShell();
