// 标签页：把「当前页面」从一堆全局状态里抽出来，存成可切换的标签。
//
// 一个标签保存的是**一整套浏览现场**——视图（收集箱 / 待办 / 笔记 / 某个
// 归类 / 日历……）、内容类型分段、筛选面板的全部条件、搜索词、选中项与
// 列表滚动位置。切换标签时把这些值写回 renderer.js 的同一组全局绑定，页面
// 就回到离开时的样子，不需要复制任何 DOM。
//
// 并排（split）时第二个标签页渲染在列表右侧的独立窗格里：它有自己的页头、
// 卡片列表与滚动，点其中的卡片会把该条目开在右侧编辑器里。日历 / 计划板 /
// 总结是整页画布，不能挤在半边窗格里——这两个标签页被要求并排时，副窗格
// 给一条说明与「在左侧打开」的入口，而不是把画布压变形。
//
// 存储用独立键（acta.tabs.v1）而不是并进 interface 的设置：标签布局是
// 设备本地的浏览状态（同浏览器标签页），不跟着数据档案同步走。
(() => {
  'use strict';

  const STORAGE_KEY = 'acta.tabs.v1';
  const MAX_TABS = 9;
  const anyWindow = window;
  if (typeof anyWindow.renderList !== 'function' || typeof anyWindow.itemCardMarkup !== 'function') return;

  const byId = id => document.getElementById(id);
  const cssEscape = value => (window.CSS?.escape ? window.CSS.escape(value) : String(value).replace(/["\\]/g, '\\$&'));
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => `tab-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  // 能放进副窗格的「列表型页面」：其余页面有自己的整页画布或独立布局。
  const LIST_VIEWS = ['inbox', 'today', 'todos', 'notes'];
  const isListView = view => LIST_VIEWS.includes(view) || String(view || '').startsWith('folder:');
  const viewIcons = {
    inbox: 'i-inbox', today: 'i-calendar', todos: 'i-check', notes: 'i-note',
    calendar: 'i-calendar', board: 'i-board', trash: 'i-trash', stats: 'i-chart', lan: 'i-radar'
  };

  const copy = {
    zh: {
      tabs: '标签页', newTab: '新建标签页', split: '并排显示两个标签页', unsplit: '取消并排',
      closeTab: '关闭标签页', unsupportedTitle: '这个页面需要整屏',
      unsupportedBody: '日历、计划板与总结有自己的画布或整页布局，不能挤在半边窗格里。',
      openLeft: '在左侧打开', emptyTitle: '这里还没有内容', emptyBody: '换一个筛选条件，或在这个页面上新建一条。',
      splitHint: '并排显示需要再开一个标签页', splitBlocked: '这个页面需要整屏，不能并排'
    },
    en: {
      tabs: 'Tabs', newTab: 'New tab', split: 'Show two tabs side by side', unsplit: 'Stop side-by-side',
      closeTab: 'Close tab', unsupportedTitle: 'This page needs the full width',
      unsupportedBody: 'Calendar, board and summary have their own canvas or full-page layout and cannot share half the window.',
      openLeft: 'Open on the left', emptyTitle: 'Nothing here yet', emptyBody: 'Change the filters, or create something on this page.',
      splitHint: 'Open another tab first', splitBlocked: 'This page needs the full width to itself'
    },
    'zh-Hant': {
      tabs: '標籤頁', newTab: '新增標籤頁', split: '並排顯示兩個標籤頁', unsplit: '取消並排',
      closeTab: '關閉標籤頁', unsupportedTitle: '這個頁面需要整屏',
      unsupportedBody: '日曆、計畫板與總結有自己的畫布或整頁版面，不能擠在半邊視窗裡。',
      openLeft: '在左側開啟', emptyTitle: '這裡還沒有內容', emptyBody: '換一個篩選條件，或在這個頁面上新增一則。',
      splitHint: '並排顯示需要再開一個標籤頁'
    }
  };
  const text = key => {
    const language = (typeof settings !== 'undefined' && settings?.language) || 'zh';
    const table = copy[language] || copy.zh;
    return table[key] || copy.zh[key] || key;
  };

  // —— 标签数据 ——
  let tabs = [];
  let activeId = '';
  let splitId = '';
  let stripSignature = '';
  let companionTimer = 0;
  let captureTimer = 0;
  let restoring = false;

  const activeTab = () => tabs.find(tab => tab.id === activeId) || tabs[0] || null;
  const splitTab = () => (splitId ? tabs.find(tab => tab.id === splitId) || null : null);

  const sanitizeView = view => {
    const value = String(view || 'inbox');
    if (value.startsWith('folder:')) return getFolder(value.slice(7)) ? value : 'inbox';
    return ['inbox', 'today', 'todos', 'notes', 'calendar', 'board', 'trash', 'stats', 'lan'].includes(value) ? value : 'inbox';
  };

  const sanitizeState = state => ({
    view: sanitizeView(state?.view),
    filter: state?.filter || 'all',
    search: typeof state?.search === 'string' ? state.search : '',
    selectedId: state?.selectedId || '',
    sort: state?.sort || 'updated',
    priority: state?.priority || 'all',
    due: state?.due || 'all',
    todoFolder: state?.todoFolder || 'all',
    noteFolder: state?.noteFolder || 'all',
    relation: state?.relation || 'all',
    updated: state?.updated || 'all',
    trashType: state?.trashType || 'all',
    trashFolder: state?.trashFolder || 'all',
    scroll: Number(state?.scroll) || 0
  });

  // 选中项只保留「属于当前列表」的那一个：在并排窗格里点了另一个页面的
  // 条目后，全局 selectedId 指向的是别处的条目，不该被记进本标签。
  const visibleSelection = () => {
    if (!selectedId) return '';
    try {
      return getVisibleItems().some(item => item.id === selectedId) ? selectedId : '';
    } catch {
      return selectedId;
    }
  };

  const captureState = () => ({
    view: currentView,
    filter: currentFilter,
    search: searchQuery || '',
    selectedId: visibleSelection(),
    sort: listSortMode,
    priority: todoPriorityFilter,
    due: todoDueFilter,
    todoFolder: todoFolderFilter,
    noteFolder: noteFolderFilter,
    relation: noteRelationFilter,
    updated: noteUpdatedFilter,
    trashType: trashTypeFilter,
    trashFolder: trashFolderFilter,
    scroll: byId('itemList')?.scrollTop || 0
  });

  // 写回全局：只碰 renderer.js 的状态，不动 DOM（并排窗格借它做一次
  // 临时上下文，随后原样还原）。
  const applyGlobals = state => {
    currentView = state.view;
    currentFilter = state.filter;
    searchQuery = state.search;
    listSortMode = state.sort;
    todoPriorityFilter = state.priority;
    todoDueFilter = state.due;
    todoFolderFilter = state.todoFolder;
    noteFolderFilter = state.noteFolder;
    noteRelationFilter = state.relation;
    noteUpdatedFilter = state.updated;
    trashTypeFilter = state.trashType;
    trashFolderFilter = state.trashFolder;
  };

  const snapshotGlobals = () => ({
    view: currentView, filter: currentFilter, search: searchQuery,
    sort: listSortMode, priority: todoPriorityFilter, due: todoDueFilter,
    todoFolder: todoFolderFilter, noteFolder: noteFolderFilter, relation: noteRelationFilter,
    updated: noteUpdatedFilter, trashType: trashTypeFilter, trashFolder: trashFolderFilter
  });

  const titleForView = view => {
    const saved = currentView;
    let title = '';
    try {
      currentView = view;
      title = viewTitle() || '';
    } finally {
      currentView = saved;
    }
    if (title) return title;
    if (view === 'lan') return t('lanRadarNav');
    if (view === 'today') return t('viewToday');
    return t('inbox');
  };

  const syncSearchInput = value => {
    const input = byId('searchInput');
    if (input && input.value !== value) input.value = value;
  };

  // 走侧栏导航的同一个入口（activateView）：切视图时它负责复位选中、
  // 日历入场与移动端标题栏的选中态，标签页不该另起一套。
  const jumpToView = view => {
    const target = sanitizeView(view);
    const button = document.querySelector(`.smart-nav [data-view="${cssEscape(target)}"]`)
      || document.querySelector(`#folderNav [data-view="${cssEscape(target)}"]`);
    if (button) {
      button.click();
      return;
    }
    if (target === 'lan') {
      document.querySelector('[data-nav-action="lan"]')?.click();
      return;
    }
    // 入口被用户在「工具栏」里隐藏了：直接落到视图本身。
    currentView = target;
    renderSidebar();
    renderList();
    renderEditor();
  };

  // —— 标签条 ——
  const renderStrip = () => {
    const strip = byId('tabStripScroll');
    const splitButton = byId('tabSplitButton');
    if (!strip) return;
    // 归类被删掉后，指向它的后台标签页退回收集箱（恢复时也会做一次，
    // 这里兜住运行期删除）。
    tabs.forEach(tab => {
      const safe = sanitizeView(tab.state.view);
      if (safe !== tab.state.view) tab.state.view = safe;
    });
    const signature = JSON.stringify({
      activeId,
      splitId,
      tabs: tabs.map(tab => [tab.id, tab.state.view, titleForView(tab.state.view)])
    });
    if (signature !== stripSignature) {
      stripSignature = signature;
      strip.innerHTML = tabs.map(tab => {
        const title = titleForView(tab.state.view);
        const icon = tab.state.view.startsWith('folder:') ? 'i-folder' : viewIcons[tab.state.view] || 'i-inbox';
        const active = tab.id === activeId;
        return `<div class="tab-item${active ? ' is-active' : ''}" role="presentation" data-tab-id="${cssEscape(tab.id)}">
          <button class="tab-item-main" type="button" role="tab" aria-selected="${active}" data-tab-activate="${cssEscape(tab.id)}" title="${escapeHTML(title)}">
            <svg aria-hidden="true"><use href="#${icon}"/></svg><span class="tab-item-label">${escapeHTML(title)}</span>
          </button>
          <button class="tab-item-close" type="button" data-tab-close="${cssEscape(tab.id)}" aria-label="${escapeHTML(text('closeTab'))}" title="${escapeHTML(text('closeTab'))}"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
        </div>`;
      }).join('');
      // 最后一个标签页不给关闭口：没有页面的工作区是空壳。
      strip.querySelectorAll('[data-tab-close]').forEach(button => {
        button.hidden = tabs.length <= 1;
      });
    }
    const activeNode = strip.querySelector(`[data-tab-id="${cssEscape(activeId)}"]`);
    activeNode?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (splitButton) {
      // 当前页本身要占满整屏（日历 / 计划板 / 总结 / 回收站）时不能并排：
      // 入口置灰但保留 —— 换回列表页，之前开着的副窗格会自己回来。
      const splittableView = isListView(currentView);
      const available = tabs.length > 1 && splittableView;
      const pressed = Boolean(splitId) && splittableView;
      splitButton.disabled = !available;
      splitButton.setAttribute('aria-disabled', String(!available));
      splitButton.setAttribute('aria-pressed', String(pressed));
      const label = pressed ? text('unsplit') : text('split');
      splitButton.title = available ? label : (tabs.length > 1 ? text('splitBlocked') : text('splitHint'));
      splitButton.setAttribute('aria-label', splitButton.title);
    }
    byId('tabStrip')?.setAttribute('aria-label', text('tabs'));
    const newButton = byId('tabNewButton');
    if (newButton) {
      // 标签条排得下就继续加：到上限后置灰，而不是点了没反应。
      newButton.disabled = tabs.length >= MAX_TABS;
      newButton.title = text('newTab');
      newButton.setAttribute('aria-label', text('newTab'));
    }
  };

  // —— 并排窗格 ——
  const emptyMarkup = () => `<div class="tab-pane-empty"><b>${escapeHTML(text('emptyTitle'))}</b>${escapeHTML(text('emptyBody'))}</div>`;

  const unsupportedMarkup = tab => `<div class="tab-pane-empty"><b>${escapeHTML(text('unsupportedTitle'))}</b>${escapeHTML(text('unsupportedBody'))}<p><button type="button" class="settings-button secondary" data-tab-activate="${cssEscape(tab.id)}">${escapeHTML(text('openLeft'))}</button></p></div>`;

  const renderCompanion = () => {
    const pane = byId('tabPaneSecondary');
    if (!pane) return;
    // 副窗格不该和主窗格是同一个标签（换边、关标签后都可能留下这种组合）。
    if (splitId && splitId === activeId) splitId = '';
    const tab = splitTab();
    // 整页视图（日历 / 计划板 / 总结 / 回收站的大列表布局）占满整行，
    // 此时并排会让 .workspace 的列宽规则打架——直接收起窗格。
    const visible = Boolean(tab) && !restoring && isListView(currentView);
    document.body.classList.toggle('tab-split', visible);
    pane.hidden = !visible;
    if (!visible) return;

    const titleNode = byId('tabSecondaryTitle');
    const countNode = byId('tabSecondaryCount');
    const listNode = byId('tabSecondaryList');

    const saved = snapshotGlobals();
    let title = '';
    let items = [];
    let unsupported = false;
    try {
      applyGlobals(tab.state);
      if (isListView(tab.state.view)) {
        title = viewTitle() || '';
        items = getVisibleItems();
      } else {
        unsupported = true;
        title = titleForView(tab.state.view);
      }
    } finally {
      applyGlobals(saved);
    }

    if (titleNode) titleNode.textContent = title;
    if (countNode) countNode.textContent = unsupported ? '' : `${items.length} ${t('item')}`;
    if (!listNode) return;
    if (unsupported) {
      listNode.innerHTML = unsupportedMarkup(tab);
      return;
    }
    if (!items.length) {
      listNode.innerHTML = emptyMarkup();
      return;
    }
    listNode.innerHTML = `<div class="list-body">${items.map((item, index) => itemCardMarkup(item, {
      index,
      animate: false,
      active: item.id === tab.state.selectedId
    })).join('')}</div>`;
  };

  const scheduleCompanion = () => {
    if (companionTimer) return;
    companionTimer = window.setTimeout(() => {
      companionTimer = 0;
      renderCompanion();
    }, 90);
  };

  // —— 持久化 ——
  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, activeId, splitId, tabs }));
    } catch { /* 空间不足等情况下静默放弃：标签不是数据本体。 */ }
  };

  const scheduleCapture = () => {
    if (captureTimer) return;
    captureTimer = window.setTimeout(() => {
      captureTimer = 0;
      const tab = activeTab();
      if (!tab) return;
      Object.assign(tab.state, captureState());
      persist();
    }, 500);
  };

  // —— 标签动作 ——
  const activateTab = (id, { quiet = false } = {}) => {
    const tab = tabs.find(entry => entry.id === id);
    if (!tab || (id === activeId && !quiet)) return;
    const previous = activeTab();
    if (previous && previous.id !== id) Object.assign(previous.state, captureState());
    // 点的正是并排窗格里那个标签：两个页面换边，副窗格回到刚才的主页面。
    if (splitId === id && previous && previous.id !== id) splitId = previous.id;
    activeId = id;
    applyGlobals(tab.state);
    syncSearchInput(tab.state.search);
    jumpToView(tab.state.view);
    selectedId = tab.state.selectedId || null;
    renderList();
    renderEditor();
    const list = byId('itemList');
    if (list) list.scrollTop = tab.state.scroll;
    renderStrip();
    renderCompanion();
    persist();
  };

  const addTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const state = captureState();
    // 新标签页复制当前页面的筛选与视图，但不带走选中项：它是同一个页面
    // 的另一个视角，从空态开始。
    const tab = { id: uid(), state: sanitizeState({ ...state, selectedId: '', scroll: 0 }) };
    tabs.push(tab);
    persist();
    activateTab(tab.id, { quiet: true });
  };

  const closeTab = id => {
    const index = tabs.findIndex(tab => tab.id === id);
    if (index < 0 || tabs.length <= 1) return;
    const wasActive = id === activeId;
    tabs.splice(index, 1);
    if (splitId === id) splitId = '';
    if (wasActive) {
      const next = tabs[Math.min(index, tabs.length - 1)];
      activeId = next.id;
      applyGlobals(next.state);
      syncSearchInput(next.state.search);
      jumpToView(next.state.view);
      selectedId = next.state.selectedId || null;
      renderList();
      renderEditor();
      const list = byId('itemList');
      if (list) list.scrollTop = next.state.scroll;
    }
    renderStrip();
    renderCompanion();
    persist();
  };

  const toggleSplit = () => {
    if (splitId) {
      splitId = '';
    } else if (tabs.length > 1 && isListView(currentView)) {
      // 副窗格默认挑最近用过的那个标签页（列表里紧邻主标签的那一个）。
      const activeIndex = tabs.findIndex(tab => tab.id === activeId);
      const neighbor = tabs[activeIndex + 1] || tabs[activeIndex - 1];
      splitId = neighbor ? neighbor.id : '';
    }
    renderStrip();
    renderCompanion();
    persist();
  };

  // —— 启动 ——
  const restore = () => {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { stored = null; }
    const storedTabs = Array.isArray(stored?.tabs) ? stored.tabs.filter(tab => tab && tab.id) : [];
    if (storedTabs.length) {
      tabs = storedTabs.slice(0, MAX_TABS).map(tab => ({ id: String(tab.id), state: sanitizeState(tab.state) }));
      activeId = tabs.some(tab => tab.id === stored.activeId) ? stored.activeId : tabs[0].id;
      splitId = tabs.some(tab => tab.id === stored.splitId && tab.id !== activeId) ? stored.splitId : '';
      // 上次在宽窗口里并排、这次窗口很窄：直接收掉副窗格。
      if (window.innerWidth < 1120) splitId = '';
      // 「默认启动页面」优先：interface.js 在首帧后会点一次侧栏入口，把启动
      // 视图定下来。这里提前对齐，免得活动标签带着上次的页面被那次点击改写成
      // 启动页、和另一个标签撞成两个同名页面。
      const bootView = sanitizeView(byId('defaultViewSetting')?.value || 'inbox');
      const previousActive = activeId;
      if (activeTab().state.view !== bootView) {
        const matching = tabs.find(tab => tab.id !== previousActive && tab.state.view === bootView);
        if (matching) {
          activeId = matching.id;
          // 副窗格若正好是新的主标签，让它换回刚才的主标签——并排不用重建。
          if (splitId === activeId) splitId = previousActive;
        } else {
          // 沿用当前的排序偏好（设置里的默认排序），其余筛选取干净状态。
          activeTab().state = sanitizeState({ view: bootView, sort: listSortMode });
        }
      }
      const tab = activeTab();
      restoring = true;
      try {
        applyGlobals(tab.state);
        syncSearchInput(tab.state.search);
        jumpToView(tab.state.view);
        selectedId = tab.state.selectedId || null;
        renderList();
        renderEditor();
        const list = byId('itemList');
        if (list) list.scrollTop = tab.state.scroll;
      } finally {
        restoring = false;
      }
    } else {
      tabs = [{ id: uid(), state: sanitizeState(captureState()) }];
      activeId = tabs[0].id;
    }
    renderStrip();
    renderCompanion();
    persist();
  };

  const bind = () => {
    byId('tabStripScroll')?.addEventListener('click', event => {
      const activate = event.target.closest('[data-tab-activate]');
      if (activate) { activateTab(activate.dataset.tabActivate); return; }
      const close = event.target.closest('[data-tab-close]');
      if (close) { closeTab(close.dataset.tabClose); return; }
      const item = event.target.closest('.tab-item');
      if (item) activateTab(item.dataset.tabId);
    });
    // 中键关闭：与浏览器标签页同一手感，不弹确认。
    byId('tabStripScroll')?.addEventListener('auxclick', event => {
      if (event.button !== 1) return;
      const item = event.target.closest('.tab-item');
      if (!item) return;
      event.preventDefault();
      closeTab(item.dataset.tabId);
    });
    byId('tabNewButton')?.addEventListener('click', addTab);
    byId('tabSplitButton')?.addEventListener('click', toggleSplit);

    // 并排窗格里的卡片：全局的卡片点击（renderer.js 的 document 监听）负责
    // 选中 + 渲染编辑器，这里只把选中项记进那个标签页。刷新必须等它跑完——
    // 它会把「当前点击的这一张」标记为 active，提前重绘会把那个节点换掉，
    // 于是所有卡片都没有选中态。
    byId('tabPaneSecondary')?.addEventListener('click', event => {
      // 占位说明里的「在左侧打开」：把那个整页标签换到主窗格。
      const activate = event.target.closest('[data-tab-activate]');
      if (activate) { activateTab(activate.dataset.tabActivate); return; }
      const card = event.target.closest('.item-card');
      const tab = splitTab();
      if (!card || !tab) return;
      tab.state.selectedId = card.dataset.id || '';
      scheduleCompanion();
      persist();
    });

    document.addEventListener('keydown', event => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (document.querySelector('dialog[open]')) return;
      if (byId('settingsModal')?.classList.contains('open')) return;
      const key = String(event.key).toLowerCase();
      if (key === 't') { event.preventDefault(); addTab(); }
      else if (key === '\\') { event.preventDefault(); toggleSplit(); }
    });

    window.addEventListener('resize', () => {
      if (!splitId) return;
      if (window.innerWidth < 1120) {
        splitId = '';
        renderStrip();
        renderCompanion();
        persist();
      } else {
        scheduleCompanion();
      }
    });
    window.addEventListener('beforeunload', () => {
      const tab = activeTab();
      if (tab) Object.assign(tab.state, captureState());
      persist();
    });

    // 主列表每次重绘后：标签名跟随视图、副窗格跟随数据、状态延迟落盘。
    // renderList 是 renderer.js 的全局函数声明，改写全局绑定后内部调用
    // 同样走这里（同一绑定），不需要逐个改调用点。
    const originalRenderList = window.renderList;
    window.renderList = function patchedRenderList(...args) {
      const result = originalRenderList.apply(this, args);
      try {
        const tab = activeTab();
        if (tab && tab.state.view !== currentView) tab.state.view = currentView;
        renderStrip();
        // 并排的开关会改 .workspace 的列模板：视图切换必须在同一帧里落地，
        // 否则日历等整页视图会先按四列画一次再被收回来。
        const shouldSplit = Boolean(splitId) && isListView(currentView);
        if (shouldSplit !== document.body.classList.contains('tab-split')) renderCompanion();
        else scheduleCompanion();
        scheduleCapture();
      } catch { /* 标签页的收尾不该影响列表渲染。 */ }
      return result;
    };

    // 归类改名 / 删除后标签名跟着变。
    const originalRenderSidebar = window.renderSidebar;
    if (typeof originalRenderSidebar === 'function') {
      window.renderSidebar = function patchedRenderSidebar(...args) {
        const result = originalRenderSidebar.apply(this, args);
        try { renderStrip(); } catch { /* 同上。 */ }
        return result;
      };
    }
  };

  restore();
  bind();
})();

export {};
