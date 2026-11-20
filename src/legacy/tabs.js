// 标签页：把「当前页面」从一堆全局状态里抽出来，存成可切换的标签。
//
// 一个标签保存的是**一整套浏览现场**——视图（收集箱 / 待办 / 笔记 / 某个
// 归类 / 日历……）、内容类型分段、筛选面板的全部条件、搜索词、选中项、列表
// 滚动位置，以及编辑器内读到的地方。切换标签时把这些值写回 renderer.js 的
// 同一组全局绑定，页面就回到离开时的样子，不需要复制任何 DOM。
//
// 标签标题写「页面名 · 正在看的条目名」：打开某条待办或笔记时，标签先说明
// 自己在哪个页面，再说清正在编辑哪一条；没打开条目时只留页面名。条目改名
// 会立刻反映到标签上（标题输入、列表重绘都会触发一次轻量刷新）。
//
// 标签分两组：主标签条与右侧的侧边标签条。侧边窗格默认落在工作区右缘，
// 点开时是一个空窗格（里面有自己的标签条），把主标签条里的标签拖进去，
// 那个页面就在右侧显示；再拖回来即回到主区。两组标签共用同一套逻辑：激活、
// 中键关闭、右键菜单（复制 / 移到另一侧 / 关闭 / 关闭全部）。
//
// 存储用独立键（acta.tabs.v1，v2 结构）而不是并进 interface 的设置：标签
// 布局是设备本地的浏览状态（同浏览器标签页），不跟着数据档案同步走。
(() => {
  'use strict';

  const STORAGE_KEY = 'acta.tabs.v1';
  const MAX_TABS = 9;
  // 侧边窗格要三列同屏才不至于挤成一条：与旧并排入口同一条界线。
  const SIDE_MIN_WIDTH = 1120;
  const anyWindow = window;
  if (typeof anyWindow.renderList !== 'function' || typeof anyWindow.itemCardMarkup !== 'function') return;

  const byId = id => document.getElementById(id);
  const cssEscape = value => (window.CSS?.escape ? window.CSS.escape(value) : String(value).replace(/["\\]/g, '\\$&'));
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => `tab-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const uiZoom = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--acta-ui-scale')) || 1;
  const readScroll = el => Math.max(0, Math.round(Number(el?.scrollTop) || 0));

  // 能放进侧边窗格的「列表型页面」：其余页面有自己的整页画布或独立布局。
  const LIST_VIEWS = ['inbox', 'today', 'todos', 'notes'];
  const isListView = view => LIST_VIEWS.includes(view) || String(view || '').startsWith('folder:');
  const viewIcons = {
    inbox: 'i-inbox', today: 'i-calendar', todos: 'i-check', notes: 'i-note',
    calendar: 'i-calendar', board: 'i-board', trash: 'i-trash', stats: 'i-chart', lan: 'i-radar'
  };

  const copy = {
    zh: {
      tabs: '标签页', newTab: '新建标签页', openSide: '打开侧边标签页', hideSide: '收起侧边标签页',
      closeTab: '关闭标签页', duplicate: '复制标签页', moveToSide: '移到右侧窗格',
      moveToMain: '移回主标签条', closeAll: '关闭全部标签页',
      sideHint: '把标签页拖到这里', sideEmptyTitle: '这个窗格还是空的',
      sideEmptyBody: '从上面的标签条拖一个标签页过来，它就会显示在这里。',
      sideAdopt: '把当前标签页移到这里',
      sideBlocked: '这个页面需要整屏，侧边窗格暂时收起',
      unsupportedTitle: '这个页面需要整屏',
      unsupportedBody: '日历、计划板与总结有自己的画布或整页布局，不能挤在侧边窗格里。',
      openMain: '在主区域打开',
      emptyTitle: '这里还没有内容', emptyBody: '换一个筛选条件，或在这个页面上新建一条。'
    },
    en: {
      tabs: 'Tabs', newTab: 'New tab', openSide: 'Open the side pane', hideSide: 'Close the side pane',
      closeTab: 'Close tab', duplicate: 'Duplicate tab', moveToSide: 'Move to the side pane',
      moveToMain: 'Move back to the tab strip', closeAll: 'Close all tabs',
      sideHint: 'Drag a tab here', sideEmptyTitle: 'This pane is empty',
      sideEmptyBody: 'Drag a tab from the strip above and it shows up here.',
      sideAdopt: 'Move the current tab here',
      sideBlocked: 'This page needs the full width; the side pane folds for now',
      unsupportedTitle: 'This page needs the full width',
      unsupportedBody: 'Calendar, board and summary have their own canvas or full-page layout and cannot sit in the side pane.',
      openMain: 'Open in the main area',
      emptyTitle: 'Nothing here yet', emptyBody: 'Change the filters, or create something on this page.'
    },
    'zh-Hant': {
      tabs: '標籤頁', newTab: '新增標籤頁', openSide: '開啟側邊標籤頁', hideSide: '收起側邊標籤頁',
      closeTab: '關閉標籤頁', duplicate: '複製標籤頁', moveToSide: '移到右側窗格',
      moveToMain: '移回主標籤條', closeAll: '關閉全部標籤頁',
      sideHint: '把標籤頁拖到這裡', sideEmptyTitle: '這個窗格還是空的',
      sideEmptyBody: '從上面的標籤條拖一個標籤頁過來，它就會顯示在這裡。',
      sideAdopt: '把目前標籤頁移到這裡',
      sideBlocked: '這個頁面需要整屏，側邊窗格暫時收起',
      unsupportedTitle: '這個頁面需要整屏',
      unsupportedBody: '日曆、計畫板與總結有自己的畫布或整頁版面，不能擠在側邊窗格裡。',
      openMain: '在主區域開啟',
      emptyTitle: '這裡還沒有內容', emptyBody: '換一個篩選條件，或在這個頁面上新增一則。'
    }
  };
  const text = key => {
    const language = (typeof settings !== 'undefined' && settings?.language) || 'zh';
    const table = copy[language] || copy.zh;
    return table[key] || copy.zh[key] || key;
  };

  // —— 标签数据 ——
  let tabs = [];            // { id, group: 'main' | 'side', state }
  let activeId = '';        // 主标签条的当前标签
  let sideActiveId = '';    // 侧边标签条的当前标签
  let sideOpen = false;     // 侧边窗格是否打开（窗口够宽时才真正显示）
  let focusGroup = 'main';  // 最后一次交互落在哪一组（标题里的条目名跟着它）
  let stripSignature = '';
  let sideStripSignature = '';
  let sidePaneSignature = '';
  let renderedSideId = '';
  let sideTimer = 0;
  let titleTimer = 0;
  let captureTimer = 0;
  let scrollToken = 0;
  let restoring = false;
  let selectionLocked = false;
  let ignoreNextClick = false;

  const groupTabs = group => tabs.filter(tab => tab.group === group);
  const mainTabs = () => groupTabs('main');
  const sideTabs = () => groupTabs('side');
  const tabById = id => tabs.find(tab => tab.id === id) || null;
  const activeOf = group => (
    group === 'side'
      ? tabById(sideActiveId) || sideTabs()[0] || null
      : tabById(activeId) || mainTabs()[0] || null
  );
  const mainActive = () => activeOf('main');
  const sideActive = () => activeOf('side');

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
    scroll: Math.max(0, Number(state?.scroll) || 0),
    editorScroll: Math.max(0, Number(state?.editorScroll) || 0)
  });

  // 选中项只保留「属于当前列表」的那一个：在侧边窗格里点了另一个页面的
  // 条目后，全局 selectedId 指向的是别处的条目，不该被记进本标签。
  const visibleSelection = () => {
    if (!selectedId) return '';
    try {
      return getVisibleItems().some(item => item.id === selectedId) ? selectedId : '';
    } catch {
      return selectedId;
    }
  };

  const editorItemId = () => document.querySelector('#editorPane .editor-wrap')?.dataset.editorId || '';

  const captureState = () => {
    const selection = visibleSelection();
    const state = {
      view: currentView,
      filter: currentFilter,
      search: searchQuery || '',
      selectedId: selection,
      sort: listSortMode,
      priority: todoPriorityFilter,
      due: todoDueFilter,
      todoFolder: todoFolderFilter,
      noteFolder: noteFolderFilter,
      relation: noteRelationFilter,
      updated: noteUpdatedFilter,
      trashType: trashTypeFilter,
      trashFolder: trashFolderFilter,
      scroll: readScroll(byId('itemList')),
      editorScroll: readScroll(byId('editorPane'))
    };
    // 右侧窗格里点开的条目也占着同一台编辑器：那一刻编辑器里不是本标签的
    // 条目，别把别人的阅读位置记进本标签（保留上次记下的值）。
    if (editorItemId() !== selection) delete state.editorScroll;
    return state;
  };

  // 写回全局：只碰 renderer.js 的状态，不动 DOM（侧边窗格借它做一次
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

  // —— 标签标题：页面名 · 条目名 ——
  const itemFor = id => {
    if (!id) return null;
    try {
      return library?.items?.find(item => item.id === id) || null;
    } catch {
      return null;
    }
  };
  const itemLabel = item => {
    const title = String(item?.title || '').trim();
    if (title) return title;
    return t(item?.type === 'todo' ? 'untitledTodo' : 'untitledNote');
  };
  // 正在被操作的那一组用实时 selectedId（点开即改名立刻可见），另一组用
  // 自己标签里记下的选中项——否则在侧边点一条卡片会把主标签的标题也改掉。
  const selectionOf = tab => {
    if (tab.id === activeOf(focusGroup)?.id) return selectedId || '';
    return tab.state.selectedId || '';
  };
  const tabLabel = tab => {
    const item = itemFor(selectionOf(tab));
    return item ? `${titleForView(tab.state.view)} · ${itemLabel(item)}` : titleForView(tab.state.view);
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
  const iconFor = tab => (tab.state.view.startsWith('folder:') ? 'i-folder' : viewIcons[tab.state.view] || 'i-inbox');

  const tabItemMarkup = (tab, { active, side = false } = {}) => {
    const page = titleForView(tab.state.view);
    const item = itemFor(selectionOf(tab));
    const label = item ? `${page} · ${itemLabel(item)}` : page;
    return `<div class="tab-item${active ? ' is-active' : ''}${side ? ' is-side' : ''}" role="presentation" data-tab-id="${cssEscape(tab.id)}" data-tab-group="${tab.group}">
      <button class="tab-item-main" type="button" role="tab" aria-selected="${active}" data-tab-activate="${cssEscape(tab.id)}" title="${escapeHTML(label)}">
        <svg aria-hidden="true"><use href="#${iconFor(tab)}"/></svg><span class="tab-item-label"><span class="tab-item-page">${escapeHTML(page)}</span>${item ? `<span class="tab-item-item"> · ${escapeHTML(itemLabel(item))}</span>` : ''}</span>
      </button>
      <button class="tab-item-close" type="button" data-tab-close="${cssEscape(tab.id)}" aria-label="${escapeHTML(text('closeTab'))}" title="${escapeHTML(text('closeTab'))}"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
    </div>`;
  };

  const renderStrips = () => {
    const strip = byId('tabStripScroll');
    // 归类被删掉后，指向它的标签页退回收集箱（恢复时也会做一次，
    // 这里兜住运行期删除）。
    tabs.forEach(tab => {
      const safe = sanitizeView(tab.state.view);
      if (safe !== tab.state.view) tab.state.view = safe;
    });

    const signature = JSON.stringify({
      activeId,
      sideOpen,
      tabs: mainTabs().map(tab => [tab.id, tab.state.view, tabLabel(tab)])
    });
    if (strip && signature !== stripSignature) {
      stripSignature = signature;
      strip.innerHTML = mainTabs().map(tab => tabItemMarkup(tab, { active: tab.id === activeId })).join('');
      // 最后一个主标签不给关闭口：没有页面的工作区是空壳。
      strip.querySelectorAll('[data-tab-close]').forEach(button => {
        button.hidden = mainTabs().length <= 1;
      });
    }
    strip?.querySelector(`[data-tab-id="${cssEscape(activeId)}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    const newButton = byId('tabNewButton');
    if (newButton) {
      // 标签条排得下就继续加：到上限后置灰，而不是点了没反应。
      newButton.disabled = mainTabs().length >= MAX_TABS;
      newButton.title = text('newTab');
      newButton.setAttribute('aria-label', text('newTab'));
    }
    const sideButton = byId('tabSideButton');
    if (sideButton) {
      // 整页视图（日历 / 计划板 / 总结 / 回收站）占满整行时窗格收起：入口
      // 置灰并说明原因，而不是留一个按下去没动静的开关。
      const splittable = isListView(currentView);
      sideButton.disabled = !splittable;
      sideButton.setAttribute('aria-disabled', String(!splittable));
      sideButton.setAttribute('aria-pressed', String(sideOpen));
      const label = sideOpen ? text('hideSide') : text('openSide');
      const title = splittable ? label : text('sideBlocked');
      sideButton.title = title;
      sideButton.setAttribute('aria-label', title);
    }
    // 标签语义挂在真正装标签的容器上（tablist）；#tabStrip 外层还装着动作
    // 按钮与侧边标签条，不再兼任 tablist。
    byId('tabStripScroll')?.setAttribute('aria-label', text('tabs'));

    renderSideStrip();
  };

  const renderSideStrip = () => {
    const visible = sideVisible();
    const strip = byId('tabSideStrip');
    if (strip) strip.hidden = !visible;
    const scroll = byId('tabSideStripScroll');
    const close = byId('tabSideCloseButton');
    if (close) {
      close.title = text('hideSide');
      close.setAttribute('aria-label', text('hideSide'));
    }
    if (!visible || !scroll) {
      // 收起期间不留旧标签在 DOM 里：再打开时一定按当前分组重画。
      if (scroll?.childElementCount) scroll.innerHTML = '';
      sideStripSignature = '';
      return;
    }
    const signature = JSON.stringify({
      sideActiveId,
      tabs: sideTabs().map(tab => [tab.id, tab.state.view, tabLabel(tab)])
    });
    if (signature === sideStripSignature) return;
    sideStripSignature = signature;
    const list = sideTabs();
    scroll.innerHTML = list.length
      ? list.map(tab => tabItemMarkup(tab, { active: tab.id === sideActiveId, side: true })).join('')
      : `<span class="tab-side-strip-hint">${escapeHTML(text('sideHint'))}</span>`;
    scroll.querySelectorAll('[data-tab-close]').forEach(button => { button.hidden = false; });
  };

  // —— 侧边窗格 ——
  const sideVisible = () => Boolean(sideOpen) && !restoring && window.innerWidth >= SIDE_MIN_WIDTH && isListView(currentView);

  const emptyMarkup = () => `<div class="tab-pane-empty"><b>${escapeHTML(text('emptyTitle'))}</b>${escapeHTML(text('emptyBody'))}</div>`;

  const sideEmptyMarkup = () => `<div class="tab-side-empty">
      <b>${escapeHTML(text('sideEmptyTitle'))}</b>
      <p>${escapeHTML(text('sideEmptyBody'))}</p>
      <button type="button" class="settings-button secondary" data-tab-side-adopt>${escapeHTML(text('sideAdopt'))}</button>
    </div>`;

  const unsupportedMarkup = tab => `<div class="tab-pane-empty"><b>${escapeHTML(text('unsupportedTitle'))}</b>${escapeHTML(text('unsupportedBody'))}<p><button type="button" class="settings-button secondary" data-tab-activate="${cssEscape(tab.id)}">${escapeHTML(text('openMain'))}</button></p></div>`;

  const captureSideState = () => {
    const tab = sideActive();
    if (!tab) return;
    const list = byId('tabSideList');
    if (list) tab.state.scroll = readScroll(list);
  };

  const renderSidePane = () => {
    const visible = sideVisible();
    document.body.classList.toggle('tab-side', visible);
    const pane = byId('tabSidePane');
    if (!pane) return;
    pane.hidden = !visible;
    if (!visible) {
      sidePaneSignature = '';
      return;
    }

    const tab = sideActive();
    const titleNode = byId('tabSideTitle');
    const countNode = byId('tabSideCount');
    const listNode = byId('tabSideList');
    const headNode = pane.querySelector('.item-header');
    // 空窗格没有页面名可写：页头整行收起，投放区在整块窗格里居中。
    if (headNode) headNode.hidden = !tab;
    // 窗格里还是这个标签、且列表没被重建过：滚动位置以用户当前的为准，
    // 免得数据刷新时把列表拽回上一次落盘的位置。
    if (tab && listNode && renderedSideId === tab.id) tab.state.scroll = readScroll(listNode);
    renderedSideId = tab ? tab.id : '';
    if (!tab) {
      sidePaneSignature = 'empty';
      // 空窗格不给页头标题：「标签页」这种栏目名不是页面名，只会抢注意力。
      if (titleNode) titleNode.textContent = '';
      if (countNode) countNode.textContent = '';
      if (listNode) {
        listNode.classList.add('is-empty');
        listNode.innerHTML = sideEmptyMarkup();
      }
      return;
    }

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

    const signature = JSON.stringify([
      tab.id, tab.state.view, title, unsupported ? -1 : items.length,
      unsupported ? '' : items.map(item => item.id).join(','),
      tab.state.selectedId
    ]);
    if (signature !== sidePaneSignature) {
      sidePaneSignature = signature;
      // 列表为空或这个页面放不进窗格：占位内容在窗格里居中，不做成一张
      // 贴顶的卡片——空态就该像空态。
      listNode?.classList.toggle('is-empty', unsupported || !items.length);
      if (titleNode) titleNode.textContent = title;
      if (countNode) countNode.textContent = unsupported ? '' : `${items.length} ${t('item')}`;
      if (listNode) {
        if (unsupported) listNode.innerHTML = unsupportedMarkup(tab);
        else if (!items.length) listNode.innerHTML = emptyMarkup();
        else {
          listNode.innerHTML = `<div class="list-body">${items.map((item, index) => itemCardMarkup(item, {
            index,
            animate: false,
            active: item.id === tab.state.selectedId
          })).join('')}</div>`;
        }
      }
      // 重建列表会把滚动归零：还回这个标签自己记下的位置。
      if (listNode) listNode.scrollTop = tab.state.scroll || 0;
    }
  };

  const scheduleSidePane = () => {
    if (sideTimer) return;
    sideTimer = setTimeout(() => {
      sideTimer = 0;
      renderSidePane();
    }, 90);
  };

  // —— 持久化 ——
  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 2,
        activeId,
        sideActiveId,
        sideOpen,
        tabs
      }));
    } catch { /* 空间不足等情况下静默放弃：标签不是数据本体。 */ }
  };

  const scheduleCapture = () => {
    if (captureTimer) return;
    captureTimer = setTimeout(() => {
      captureTimer = 0;
      const tab = mainActive();
      if (!tab) return;
      Object.assign(tab.state, captureState());
      captureSideState();
      persist();
    }, 500);
  };

  // 标题里的条目名要跟着改名走：列表重绘、编辑器重绘、标题输入都排一次
  // 轻量刷新，160ms 内的多次合并成一次。
  const refreshTitles = () => {
    titleTimer = 0;
    stripSignature = '';
    sideStripSignature = '';
    renderStrips();
  };
  const scheduleTitleRefresh = () => {
    if (titleTimer) return;
    titleTimer = setTimeout(refreshTitles, 160);
  };

  // 选中项与当前标签对齐：renderer 里改 selectedId 的地方很多（点卡片、
  // 删除、切视图、Esc），统一在 renderEditor 之后回写，不逐个埋点。
  const syncFocusedSelection = () => {
    if (selectionLocked || restoring) return;
    const tab = activeOf(focusGroup);
    if (!tab) return;
    if ((tab.state.selectedId || '') !== (selectedId || '')) tab.state.selectedId = selectedId || '';
  };

  const applyScrolls = state => {
    const token = ++scrollToken;
    const list = byId('itemList');
    const pane = byId('editorPane');
    if (list) list.scrollTop = state.scroll || 0;
    if (pane) pane.scrollTop = state.editorScroll || 0;
    // 内容刚重建、尺寸还没落定时 scrollTop 会被夹到 0：下一帧补一次。
    requestAnimationFrame(() => {
      if (token !== scrollToken) return;
      if (list?.isConnected && state.scroll && !list.scrollTop) list.scrollTop = state.scroll;
      if (pane?.isConnected && state.editorScroll && !pane.scrollTop) pane.scrollTop = state.editorScroll;
    });
  };

  const restoreMain = tab => {
    // 先取出目标标签自己的选中项：jumpToView 会走 activateView 复位选中。
    const selection = tab.state.selectedId || '';
    applyGlobals(tab.state);
    syncSearchInput(tab.state.search);
    selectionLocked = true;
    try {
      jumpToView(tab.state.view);
      selectedId = selection || null;
      renderList();
      renderEditor();
    } finally {
      selectionLocked = false;
    }
    applyScrolls(tab.state);
  };

  // —— 标签动作 ——
  const activateTab = (id, { quiet = false } = {}) => {
    const tab = tabById(id);
    if (!tab) return;
    if (tab.group === 'side') {
      if (id === sideActiveId && !quiet) { focusGroup = 'side'; renderStrips(); return; }
      // 整页视图在侧边放不下：直接移回主区打开，而不是给一个挤扁的画布。
      if (!isListView(tab.state.view)) { moveToMain(id); return; }
      captureSideState();
      sideActiveId = id;
      focusGroup = 'side';
      renderStrips();
      renderSidePane();
      persist();
      return;
    }
    if (id === activeId && !quiet) { focusGroup = 'main'; renderStrips(); return; }
    const previous = mainActive();
    if (previous && previous.id !== id) Object.assign(previous.state, captureState());
    activeId = id;
    focusGroup = 'main';
    restoreMain(tab);
    renderStrips();
    renderSidePane();
    persist();
  };

  const addTab = () => {
    if (mainTabs().length >= MAX_TABS) return;
    const state = captureState();
    // 新标签页复制当前页面的筛选与视图，但不带走选中项：它是同一个页面
    // 的另一个视角，从空态开始。
    const tab = { id: uid(), group: 'main', state: sanitizeState({ ...state, selectedId: '', scroll: 0, editorScroll: 0 }) };
    const after = tabs.findIndex(entry => entry.id === activeId);
    tabs.splice(after >= 0 ? after + 1 : tabs.length, 0, tab);
    persist();
    activateTab(tab.id, { quiet: true });
  };

  const duplicateTab = id => {
    const source = tabById(id);
    if (!source) return;
    const group = source.group;
    if (groupTabs(group).length >= MAX_TABS) return;
    // 复制前先吸收实时状态，复制的是「现在看到的这一页」，不是上次落盘的快照。
    if (source.group === 'main') Object.assign(source.state, captureState());
    else captureSideState();
    const tab = { id: uid(), group, state: sanitizeState(clone(source.state)) };
    const after = tabs.findIndex(entry => entry.id === id);
    tabs.splice(after + 1, 0, tab);
    persist();
    activateTab(tab.id, { quiet: true });
  };

  const moveToSide = id => {
    const tab = tabById(id);
    if (!tab || tab.group === 'side') {
      if (id === sideActiveId) { focusGroup = 'side'; renderStrips(); }
      return;
    }
    const live = mainActive();
    if (live) Object.assign(live.state, captureState());
    tab.group = 'side';
    sideOpen = true;
    sideActiveId = tab.id;
    focusGroup = 'side';
    // 主标签条不能空：留一个同视图、选中项为空的空白标签。
    if (!mainTabs().length) {
      const fresh = { id: uid(), group: 'main', state: sanitizeState({ ...tab.state, selectedId: '', scroll: 0, editorScroll: 0 }) };
      tabs.push(fresh);
      activeId = fresh.id;
      restoreMain(fresh);
    } else if (activeId === tab.id) {
      activeId = mainTabs()[0].id;
      restoreMain(mainActive());
    }
    renderStrips();
    renderSidePane();
    persist();
  };

  const moveToMain = id => {
    const tab = tabById(id);
    if (!tab || tab.group === 'main') return;
    captureSideState();
    tab.group = 'main';
    if (sideActiveId === id) sideActiveId = sideTabs()[0]?.id || '';
    activeId = id;
    focusGroup = 'main';
    restoreMain(tab);
    renderStrips();
    renderSidePane();
    persist();
  };

  const closeTab = (id, { force = false } = {}) => {
    const index = tabs.findIndex(tab => tab.id === id);
    if (index < 0) return;
    const tab = tabs[index];
    if (tab.group === 'main') {
      if (!force && mainTabs().length <= 1) return;
      const wasActive = id === activeId;
      const mainIndex = Math.max(0, mainTabs().findIndex(entry => entry.id === id));
      tabs.splice(index, 1);
      if (wasActive) {
        const rest = mainTabs();
        const neighbor = rest[Math.min(mainIndex, rest.length - 1)] || rest[0];
        if (neighbor) {
          activeId = neighbor.id;
          focusGroup = 'main';
          restoreMain(neighbor);
        }
      }
    } else {
      tabs.splice(index, 1);
      if (sideActiveId === id) sideActiveId = sideTabs()[0]?.id || '';
    }
    renderStrips();
    renderSidePane();
    persist();
  };

  const closeAllTabs = group => {
    if (group === 'side') {
      tabs = tabs.filter(tab => tab.group !== 'side');
      sideActiveId = '';
      sideOpen = false;
      renderStrips();
      renderSidePane();
      persist();
      return;
    }
    // 主区关空会留下一个空壳工作区：保留一个同视图、选中项为空的新标签。
    const state = captureState();
    const fresh = { id: uid(), group: 'main', state: sanitizeState({ ...state, selectedId: '', scroll: 0, editorScroll: 0 }) };
    tabs = tabs.filter(tab => tab.group !== 'main');
    tabs.unshift(fresh);
    activeId = fresh.id;
    focusGroup = 'main';
    restoreMain(fresh);
    renderStrips();
    renderSidePane();
    persist();
  };

  const toggleSide = () => {
    if (sideOpen) {
      // 收起时把侧边标签送回主标签条：收起的窗格里不该留着看不见的页面。
      sideTabs().forEach(tab => { tab.group = 'main'; });
      sideOpen = false;
      sideActiveId = '';
      focusGroup = 'main';
      sidePaneSignature = '';
      sideStripSignature = '';
      document.body.classList.remove('tab-side', 'tab-drop-side', 'tab-drop-main');
    } else {
      sideOpen = true;
      focusGroup = 'side';
    }
    renderStrips();
    renderSidePane();
    persist();
  };

  // —— 右键菜单 ——
  const tabMenu = byId('tabMenu');
  let tabMenuItems = [];

  const closeTabMenu = () => {
    if (!tabMenu?.classList.contains('open')) return;
    tabMenu.classList.remove('open');
    tabMenu.setAttribute('aria-hidden', 'true');
  };

  const openTabMenu = (tab, x, y) => {
    if (!tabMenu) return;
    tabMenuItems = [
      { label: text('duplicate'), run: () => duplicateTab(tab.id) },
      {
        label: tab.group === 'side' ? text('moveToMain') : text('moveToSide'),
        run: () => (tab.group === 'side' ? moveToMain(tab.id) : moveToSide(tab.id))
      },
      {
        label: text('closeTab'),
        disabled: tab.group === 'main' && mainTabs().length <= 1,
        run: () => closeTab(tab.id)
      },
      { label: text('closeAll'), run: () => closeAllTabs(tab.group) }
    ];
    tabMenu.innerHTML = tabMenuItems.map((item, index) => `
      <button type="button" role="menuitem" data-tab-menu-index="${index}"${item.disabled ? ' disabled' : ''}>
        <span>${escapeHTML(item.label)}</span>
      </button>`).join('');
    tabMenu.classList.add('open');
    tabMenu.setAttribute('aria-hidden', 'false');
    tabMenu.style.left = '0px';
    tabMenu.style.top = '0px';
    // 传入的 x/y 与 rect 都是视觉坐标，fixed 的 left/top 是布局值：统一
    // 除以界面缩放落到布局域再夹取（菜单尺寸 rect.width 亦同）。
    const z = uiZoom();
    const rect = tabMenu.getBoundingClientRect();
    tabMenu.style.left = `${Math.max(8, Math.min(x / z, window.innerWidth / z - rect.width / z - 8))}px`;
    tabMenu.style.top = `${Math.max(8, Math.min(y / z, window.innerHeight / z - rect.height / z - 8))}px`;
  };

  tabMenu?.addEventListener('click', event => {
    const button = event.target.closest('[data-tab-menu-index]');
    if (!button || button.disabled) return;
    const item = tabMenuItems[Number(button.dataset.tabMenuIndex)];
    closeTabMenu();
    item?.run?.();
  });

  // —— 拖放：把标签页拖进右侧窗格（也能拖回来） ——
  const DRAG_THRESHOLD = 7;
  let pending = null;
  let drag = null;

  const dropTargetAt = (x, y) => {
    const node = document.elementFromPoint(x, y);
    if (!node) return '';
    if (node.closest('#tabSideStrip, #tabSidePane')) return 'side';
    if (node.closest('#tabStrip')) return 'main';
    return '';
  };

  const setDropTarget = target => {
    document.body.classList.toggle('tab-drop-side', target === 'side');
    document.body.classList.toggle('tab-drop-main', target === 'main');
  };

  const startDrag = () => {
    const tab = tabById(pending.tabId);
    const source = pending.source;
    if (!tab || !source) return;
    const rect = source.getBoundingClientRect();
    const zoom = uiZoom();
    const ghost = document.createElement('div');
    ghost.className = 'tab-drag-ghost';
    ghost.innerHTML = `<svg aria-hidden="true"><use href="#${iconFor(tab)}"/></svg><span>${escapeHTML(tabLabel(tab))}</span>`;
    // ghost 挂在 body 上（要能越过窗格边界），自己带 zoom：尺寸与位移都
    // 按缩放换回它自己的布局域，指针跟手比例才与界面缩放一致。
    ghost.style.width = `${Math.round(rect.width / zoom)}px`;
    document.body.appendChild(ghost);
    drag = {
      tabId: pending.tabId,
      group: tab.group,
      ghost,
      source,
      zoom,
      offsetX: pending.x - rect.left,
      offsetY: pending.y - rect.top,
      x: pending.x,
      y: pending.y
    };
    source.classList.add('is-dragging');
    document.body.classList.add('tab-dragging');
    moveGhost(pending.x, pending.y);
  };

  const moveGhost = (x, y) => {
    if (!drag) return;
    drag.x = x;
    drag.y = y;
    const z = drag.zoom || 1;
    drag.ghost.style.transform = `translate3d(${(x - drag.offsetX) / z}px, ${(y - drag.offsetY) / z}px, 0) scale(1.02)`;
    setDropTarget(dropTargetAt(x, y));
  };

  const endGhost = ({ returning = false } = {}) => {
    if (!drag) return;
    const { ghost, source } = drag;
    document.body.classList.remove('tab-dragging');
    setDropTarget('');
    source?.classList.remove('is-dragging');
    if (returning && source?.isConnected) {
      const rect = source.getBoundingClientRect();
      const z = drag.zoom || 1;
      ghost.style.transition = 'transform .24s cubic-bezier(.2,.9,.3,1), opacity .18s ease';
      ghost.style.transform = `translate3d(${rect.left / z}px, ${rect.top / z}px, 0) scale(.92)`;
      ghost.style.opacity = '0';
    } else {
      ghost.style.transition = 'transform .16s ease-out, opacity .14s ease-out';
      ghost.style.opacity = '0';
      ghost.style.transform = `${ghost.style.transform} scale(.94)`;
    }
    setTimeout(() => ghost.remove(), 260);
    drag = null;
  };

  const finishDrag = (x, y) => {
    const current = drag;
    if (!current) return;
    const target = dropTargetAt(x, y);
    const { tabId, group } = current;
    // 拖动结束后紧跟的那次 click 不该把标签再激活一次；重绘可能让那个 click
    // 落空，所以再设一个兜底计时器，避免标志位一直挂着吃掉下一次点击。
    ignoreNextClick = true;
    setTimeout(() => { ignoreNextClick = false; }, 320);
    if (target === 'side' && group === 'main') {
      endGhost();
      moveToSide(tabId);
      return;
    }
    if (target === 'main' && group === 'side') {
      endGhost();
      moveToMain(tabId);
      return;
    }
    endGhost({ returning: !target || target === group });
    if (target === group) activateTab(tabId, { quiet: true });
  };

  const onPointerMove = event => {
    if (!pending && !drag) return;
    if (pending && !drag) {
      const dx = event.clientX - pending.x;
      const dy = event.clientY - pending.y;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      startDrag();
    }
    if (drag) {
      event.preventDefault();
      moveGhost(event.clientX, event.clientY);
    }
  };

  const onPointerUp = event => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    const wasDragging = Boolean(drag);
    pending = null;
    if (wasDragging) finishDrag(event.clientX, event.clientY);
  };

  const onPointerCancel = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    pending = null;
    endGhost({ returning: true });
  };

  const bindDrag = strip => {
    strip?.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.pointerType === 'touch') return;
      const item = event.target.closest('.tab-item');
      if (!item || event.target.closest('[data-tab-close]')) return;
      pending = { tabId: item.dataset.tabId, source: item, x: event.clientX, y: event.clientY };
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerCancel);
    });
  };

  // —— 启动 ——
  const restore = () => {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { stored = null; }
    const storedTabs = Array.isArray(stored?.tabs) ? stored.tabs.filter(tab => tab && tab.id) : [];
    if (storedTabs.length) {
      tabs = storedTabs.slice(0, MAX_TABS).map(tab => ({
        id: String(tab.id),
        group: tab.group === 'side' ? 'side' : 'main',
        state: sanitizeState(tab.state)
      }));
      // v1 只存一个 splitId：把那个标签放进右侧窗格，并排布局照旧回来。
      if (stored.splitId) {
        const legacy = tabs.find(tab => tab.id === String(stored.splitId) && tab.group === 'main');
        if (legacy) { legacy.group = 'side'; sideOpen = true; }
      } else {
        sideOpen = Boolean(stored.sideOpen);
      }
      // 主标签条至少留一个标签：旧档案里可能整条都在侧边。
      if (!mainTabs().length && tabs.length) tabs[0].group = 'main';
      const main = mainTabs();
      activeId = main.some(tab => tab.id === stored.activeId) ? stored.activeId : main[0].id;
      const side = sideTabs();
      sideActiveId = side.some(tab => tab.id === stored.sideActiveId) ? stored.sideActiveId : (side[0]?.id || '');
      if (!side.length) sideActiveId = '';

      // 「默认启动页面」优先：interface.js 在首帧后会点一次侧栏入口，把启动
      // 视图定下来。这里提前对齐，免得活动标签带着上次的页面被那次点击改写成
      // 启动页、和另一个标签撞成两个同名页面。
      const bootView = sanitizeView(byId('defaultViewSetting')?.value || 'inbox');
      const previousActive = activeId;
      if (mainActive().state.view !== bootView) {
        const matching = main.find(tab => tab.id !== previousActive && tab.state.view === bootView);
        if (matching) {
          activeId = matching.id;
        } else {
          // 沿用当前的排序偏好（设置里的默认排序），其余筛选取干净状态。
          mainActive().state = sanitizeState({ view: bootView, sort: listSortMode });
        }
      }
      restoring = true;
      try {
        restoreMain(mainActive());
      } finally {
        restoring = false;
      }
    } else {
      tabs = [{ id: uid(), group: 'main', state: sanitizeState(captureState()) }];
      activeId = tabs[0].id;
    }
    renderStrips();
    renderSidePane();
    persist();
  };

  const bind = () => {
    byId('tabStripScroll')?.addEventListener('click', event => {
      if (ignoreNextClick) { ignoreNextClick = false; return; }
      const activate = event.target.closest('[data-tab-activate]');
      if (activate) { activateTab(activate.dataset.tabActivate); return; }
      const close = event.target.closest('[data-tab-close]');
      if (close) { closeTab(close.dataset.tabClose); return; }
      const item = event.target.closest('.tab-item');
      if (item) activateTab(item.dataset.tabId);
    });

    byId('tabSideStripScroll')?.addEventListener('click', event => {
      if (ignoreNextClick) { ignoreNextClick = false; return; }
      const activate = event.target.closest('[data-tab-activate]');
      if (activate) { activateTab(activate.dataset.tabActivate); return; }
      const close = event.target.closest('[data-tab-close]');
      if (close) { closeTab(close.dataset.tabClose); return; }
      const item = event.target.closest('.tab-item');
      if (item) activateTab(item.dataset.tabId);
    });

    // 中键关闭：与浏览器标签页同一手感，不弹确认。
    const middleClose = event => {
      if (event.button !== 1) return;
      const item = event.target.closest('.tab-item');
      if (!item) return;
      event.preventDefault();
      closeTab(item.dataset.tabId);
    };
    byId('tabStripScroll')?.addEventListener('auxclick', middleClose);
    byId('tabSideStripScroll')?.addEventListener('auxclick', middleClose);

    byId('tabNewButton')?.addEventListener('click', addTab);
    byId('tabSideButton')?.addEventListener('click', toggleSide);
    byId('tabSideCloseButton')?.addEventListener('click', toggleSide);

    bindDrag(byId('tabStripScroll'));
    bindDrag(byId('tabSideStripScroll'));

    // 右键菜单：主标签条与侧边标签条共用一套。桌面端文本右键菜单由
    // interface.js 处理（这里只认标签），浏览器里也只对标签页接管右键。
    document.addEventListener('contextmenu', event => {
      const item = event.target.closest?.('.tab-item');
      if (!item) return;
      const tab = tabById(item.dataset.tabId);
      if (!tab) return;
      event.preventDefault();
      closeTabMenu();
      openTabMenu(tab, event.clientX, event.clientY);
    });
    document.addEventListener('pointerdown', event => {
      if (event.target.closest?.('#tabMenu')) return;
      closeTabMenu();
    }, true);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeTabMenu(); onPointerCancel(); } });
    window.addEventListener('blur', closeTabMenu);
    window.addEventListener('scroll', closeTabMenu, true);
    window.addEventListener('resize', closeTabMenu);

    // 侧边窗格里的卡片：全局的卡片点击（renderer.js 的 document 监听）负责
    // 选中 + 渲染编辑器，这里只把选中项记进那个标签页。刷新必须等它跑完——
    // 它会把「当前点击的这一张」标记为 active，提前重绘会把那个节点换掉，
    // 于是所有卡片都没有选中态。
    byId('tabSidePane')?.addEventListener('click', event => {
      // 占位说明里的「在主区域打开」：把那个整页标签送回主区。
      const activate = event.target.closest('[data-tab-activate]');
      if (activate) { moveToMain(activate.dataset.tabActivate); return; }
      if (event.target.closest('[data-tab-side-adopt]')) {
        const tab = mainActive();
        if (tab) moveToSide(tab.id);
        return;
      }
      const card = event.target.closest('.item-card');
      const tab = sideActive();
      if (!card || !tab) return;
      focusGroup = 'side';
      tab.state.selectedId = card.dataset.id || '';
      scheduleTitleRefresh();
      scheduleSidePane();
      persist();
    });

    byId('tabSideList')?.addEventListener('scroll', () => scheduleCapture(), { passive: true });
    byId('itemList')?.addEventListener('scroll', () => scheduleCapture(), { passive: true });

    // 主列表里的点击：把「正在看哪一条」记进主标签，标签标题立刻跟上。
    byId('itemList')?.addEventListener('click', event => {
      const card = event.target.closest('.item-card');
      if (!card) return;
      focusGroup = 'main';
      const tab = mainActive();
      if (tab) tab.state.selectedId = card.dataset.id || '';
      scheduleTitleRefresh();
      persist();
    });

    // 条目改名：标题输入框的 input 事件（debounce）让标签名跟着变。
    byId('editorPane')?.addEventListener('input', event => {
      if (event.target?.id !== 'editorTitle') return;
      scheduleTitleRefresh();
    });

    document.addEventListener('keydown', event => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (document.querySelector('dialog[open]')) return;
      if (byId('settingsModal')?.classList.contains('open')) return;
      const key = String(event.key).toLowerCase();
      if (key === 't') { event.preventDefault(); addTab(); }
      else if (key === '\\') { event.preventDefault(); toggleSide(); }
    });

    window.addEventListener('resize', () => {
      // 窗口变窄时只是把窗格收起来（标签留在侧边组里），宽回来时自己回来。
      renderStrips();
      renderSidePane();
    });

    window.addEventListener('beforeunload', () => {
      const tab = mainActive();
      if (tab) Object.assign(tab.state, captureState());
      captureSideState();
      persist();
    });

    // 主列表每次重绘后：标签名跟随视图、侧边窗格跟随数据、状态延迟落盘。
    // renderList 是 renderer.js 的全局函数声明，改写全局绑定后内部调用
    // 同样走这里（同一绑定），不需要逐个改调用点。
    const originalRenderList = window.renderList;
    window.renderList = function patchedRenderList(...args) {
      const result = originalRenderList.apply(this, args);
      try {
        const tab = mainActive();
        if (tab && tab.state.view !== currentView) { tab.state.view = currentView; sideStripSignature = ''; }
        renderStrips();
        // 窗格的开关会改 .workspace 的列模板：视图切换必须在同一帧里落地，
        // 否则日历等整页视图会先按四列画一次再被收回来。
        const shouldShow = sideVisible();
        if (shouldShow !== document.body.classList.contains('tab-side')) renderSidePane();
        else scheduleSidePane();
        scheduleTitleRefresh();
        scheduleCapture();
      } catch { /* 标签页的收尾不该影响列表渲染。 */ }
      return result;
    };

    // 编辑器每次重绘后：把选中项回写到当前标签（标签标题随之更新）。
    const originalRenderEditor = window.renderEditor;
    if (typeof originalRenderEditor === 'function') {
      window.renderEditor = function patchedRenderEditor(...args) {
        const result = originalRenderEditor.apply(this, args);
        try {
          syncFocusedSelection();
          scheduleTitleRefresh();
          scheduleCapture();
        } catch { /* 同上。 */ }
        return result;
      };
    }

    // 归类改名 / 删除后标签名跟着变。
    const originalRenderSidebar = window.renderSidebar;
    if (typeof originalRenderSidebar === 'function') {
      window.renderSidebar = function patchedRenderSidebar(...args) {
        const result = originalRenderSidebar.apply(this, args);
        try {
          stripSignature = '';
          sideStripSignature = '';
          renderStrips();
        } catch { /* 同上。 */ }
        return result;
      };
    }
  };

  restore();
  bind();

})();

export {};
