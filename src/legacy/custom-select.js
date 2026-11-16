// 自定义下拉组件（MWS ComboBox）：接管所有原生 <select> 的下拉弹层。
// 规格严格对齐 MWS UI 的 ComboBox 参考（mws-combobox (2).html）：
// - 触发器仍是 select 本体（保留原生文字渲染、表单逻辑与布局），
//   按钮视觉对齐规格（10px 圆角、0.5px 边框、右 chevron 打开旋转 180°）；
// - 弹层为 frame + plate 两层结构，行高 38px，选中行左侧 2px accent 竖线 +
//   对勾，hover / disabled 行各有着色；
// - 展开：frame 从选中行的位置长到全高（420ms 回弹曲线），行按与选中行的
//   距离逐行淡入（stagger 24ms）；收起沿同一路径收回选中行（关闭曲线）；
// - 选中变更且弹层可居中展开时，先把选中项滑动到按钮位置再收起（recenter）；
// - 键盘：↑/↓ 移动高亮（跳过禁用行）、Enter/Space 提交、Esc 关闭、Tab 关闭；
// - 颜色全部走 Acta 主题变量（--sage / --white / --panel / --line / --ink /
//   --faint），任何主题（含深色）自动匹配，无需单独的深色色板。
// 弹层定位用 fixed（挂 body）或挂宿主 <dialog> 相对其边框盒计算坐标，
// 两种情况都按「视觉坐标 ÷ 界面缩放」换算成布局坐标（zoom 约定）。
(() => {
  'use strict';
  if (window.__actaCustomSelect) return;

  const ENHANCED_FLAG = 'data-acx-enhanced';
  const OPEN_FLAG = 'data-acx-open';
  // MWS ComboBox 规格。
  const ROW = 38;                    // 行高（px，布局值）
  const DUR = 420;                   // 展开时长
  const CLOSE_DUR = Math.round(DUR * 0.6);
  const MOVE_DUR = 320;              // recenter 滑动时长
  const EO = 'cubic-bezier(0.34, 1.56, 0.64, 1)';   // 展开曲线（回弹）
  const EC = 'cubic-bezier(0.55, 0, 1, 0.45)';      // 关闭曲线
  const ME = 'cubic-bezier(0.34, 1.56, 0.64, 1)';   // recenter 曲线
  const SHADOW = '0 8px 24px rgba(0,0,0,.14)';
  const EDGE_MARGIN = 12;            // 弹层与视口（或宿主 dialog）的净空

  // chevron 两态直接写在下方注入的样式表里（关闭指下、打开指上，用
  // background-image 切换；Chromium 会做交叉淡入，其他内核瞬切，方向正确）。

  const style = document.createElement('style');
  style.textContent = `
/* 三重限定（元素 + 属性 + .acx-trigger）提高特异性：业务样式里任何
   background 简写都会把 background-image 重置成 none，chevron 就没了。
   这里必须稳压普通的 “.some-field select:focus” 一类规则。 */
select[${ENHANCED_FLAG}].acx-trigger {
  appearance: none; -webkit-appearance: none;
  --acx-chev: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' fill='none' stroke='%23989b94' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-image: var(--acx-chev);
  background-repeat: no-repeat; background-position: right 10px center; background-size: 12px;
  border-radius: 10px;
  transition: background-image .18s ease, border-color .16s ease;
}
html[data-acta-theme="mono-dark"] select[${ENHANCED_FLAG}].acx-trigger {
  --acx-chev: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' fill='none' stroke='%238b8b8b' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
/* 打开态必须限定 ="true"：收起时组件把标记写成 "false"（而不是删掉），
   只按属性存在与否匹配会让箭头在第一次点开之后一直朝上——速记弹窗里
   选完归类、面板已收起，箭头还朝上就是这个原因。 */
select[${ENHANCED_FLAG}].acx-trigger[${OPEN_FLAG}="true"] {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 7.5L6 4L9.5 7.5' fill='none' stroke='%23989b94' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
html[data-acta-theme="mono-dark"] select[${ENHANCED_FLAG}].acx-trigger[${OPEN_FLAG}="true"] {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 7.5L6 4L9.5 7.5' fill='none' stroke='%238b8b8b' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
select[${ENHANCED_FLAG}].acx-trigger:hover { border-color: color-mix(in srgb, var(--sage) 34%, var(--line)); }
/* 点击后的 halo（浏览器给聚焦 select 的默认外圈）整体去除：菜单展开本身
   就是焦点指示，弹层收起时也会主动 blur，不需要额外的光圈。 */
select[${ENHANCED_FLAG}] { -webkit-tap-highlight-color: transparent; }
select[${ENHANCED_FLAG}]:focus, select[${ENHANCED_FLAG}]:focus-visible { outline: none; }
.acx-menu { position: fixed; z-index: 2147483000; visibility: hidden; pointer-events: none; }
.acx-frame {
  position: absolute; left: 0; width: 100%; overflow: hidden;
  background: var(--white); border: 0.5px solid color-mix(in srgb, var(--line) 68%, var(--faint));
  border-radius: 12px; box-shadow: none;
}
.acx-plate { position: absolute; left: 0; width: 100%; }
.acx-row {
  height: ${ROW}px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 10px; cursor: pointer; color: var(--ink); opacity: 0;
  border-left: 2px solid transparent; font: inherit;
  font-size: calc(12px * var(--acta-font-scale, 1)); letter-spacing: inherit; text-align: left;
}
.acx-row > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.acx-row svg { flex: none; width: 12px; height: 12px; opacity: 0; color: var(--sage); }
.acx-row.is-sel { background: color-mix(in srgb, var(--sage) 10%, var(--white)); font-weight: 500; border-left-color: var(--sage); }
.acx-row.is-sel svg { opacity: 1; }
.acx-row.is-hover { background: var(--panel); }
.acx-row.is-dis { color: var(--faint); cursor: not-allowed; background: transparent; }
.acx-empty { height: ${ROW}px; padding: 0 10px; color: var(--faint); font-size: calc(11px * var(--acta-font-scale, 1)); display: flex; align-items: center; }
@media (prefers-reduced-motion: reduce) {
  .acx-row { opacity: 1 !important; transform: none !important; }
}
`;
  document.head.appendChild(style);

  // —— 弹层状态（单例：同一时刻只有一个下拉展开） ——
  let menu = null;          // .acx-menu（fixed 容器，角色同参考的 pop）
  let frame = null;         // .acx-frame（裁剪窗，动画 top/height）
  let plate = null;         // .acx-plate（行容器，动画 top）
  let rows = [];            // .acx-row 列表（与 select.options 对齐）
  let openState = null;     // { select, dialog, hostRect }
  let idx = 0;              // 当前选中行
  let anchor = 0;           // 展开动画锚点行
  let open = false;
  let phase = 'closed';     // closed / opening / open / closing
  let busy = false;         // recenter 滑动进行中
  let hoverI = -1;
  let recenterGeom = false;
  let timer = 0;
  let moveTimer = 0;
  let lastEl = null;
  let lastDir = 'center';

  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 视觉坐标 → 弹层坐标（布局值）：界面缩放 zoom 的倒数；挂进 <dialog> 时
  // 再扣除 dialog 的视觉偏移（dialog 的动画 transform 会成为包含块）。
  const layoutScale = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--acta-ui-scale')) || 1;
  const hostOffset = () => {
    const rect = openState?.dialog?.getBoundingClientRect();
    return rect ? { x: rect.left, y: rect.top } : { x: 0, y: 0 };
  };

  const ensureMenu = () => {
    if (menu) return menu;
    menu = document.createElement('div');
    menu.className = 'acx-menu';
    menu.setAttribute('role', 'listbox');
    frame = document.createElement('div');
    frame.className = 'acx-frame';
    plate = document.createElement('div');
    plate.className = 'acx-plate';
    frame.appendChild(plate);
    menu.appendChild(frame);
    // 行内容只响应 click；移动端触摸滚动不误选。
    plate.addEventListener('mousedown', event => event.preventDefault());
    plate.addEventListener('click', event => {
      const row = event.target.closest('.acx-row');
      if (!row || row.classList.contains('is-dis') || !openState) return;
      commit(Number(row.dataset.i));
    });
    return menu;
  };

  const isDis = i => !openState || openState.disabled.has(i);
  const setGeom = (top, height, plateTop) => {
    frame.style.top = `${top}px`;
    frame.style.height = `${height}px`;
    plate.style.top = `${plateTop}px`;
  };
  // 弹层（menu 容器）的布局 top：选中行在「居中模式」下正好覆盖在
  // 触发器位置上；空间不足时整体上/下挂，必要时夹进视口或宿主边缘。
  function openOffset(to) {
    const pz = layoutScale();
    const select = openState.select;
    const rect = select.getBoundingClientRect(); // 视觉
    const host = hostOffset();
    const rowVisual = ROW * pz;
    const total = rows.length * rowVisual;
    const selectTop = rect.top - host.y;
    const vh = openState.dialog ? openState.dialog.getBoundingClientRect().height : window.innerHeight;
    const margin = EDGE_MARGIN * pz;
    const up = Math.max(0, selectTop - margin);
    const down = Math.max(0, vh - (selectTop + rowVisual) - margin);
    const needUp = to * rowVisual;
    const needDown = (rows.length - to) * rowVisual;
    const lo = margin - selectTop;
    const hi = vh - margin - total - selectTop;
    let offset;
    if (up >= needUp && down >= needDown) { lastDir = 'center'; offset = -to * rowVisual; }
    else if (down >= total) { lastDir = 'down'; offset = rowVisual; }
    else if (up >= total) { lastDir = 'up'; offset = -total; }
    else { lastDir = up >= down ? 'down' : 'up'; offset = lastDir === 'down' ? lo : hi; }
    // 视觉偏移 → 布局偏移，落到弹层布局 top（触发器布局 top 为基准）。
    const baseTop = (rect.top - host.y) / pz;
    return baseTop + offset / pz;
  }
  const menuTopNow = () => {
    const v = parseFloat(menu.style.top);
    return isNaN(v) ? 0 : v;
  };
  const elTop = el => {
    // getComputedStyle 优先（动画中的实时值）；inline style 兜底。
    // 注意必须是 let：计算值非数字时要用 inline 值重新赋一遍——vite 8 的
    // rolldown 打包器会静态拒绝 const 重赋值（ILLEGAL_REASSIGNMENT），
    // esbuild 转译与 dev 模式都发现不了，只有 CI 的 vite build 会挂。
    let v = parseFloat(getComputedStyle(el).top);
    if (!isNaN(v)) return v;
    v = parseFloat(el.style.top);
    return isNaN(v) ? 0 : v;
  };
  // 选中行当前在弹层坐标系里的 top（menu + frame + plate 三层偏移之和）。
  const contentTop = () => menuTopNow() + elTop(frame) + elTop(plate);

  // 收起态（展开动画的起点）：可见窗口对准触发器位置、内容是选中行——
  // 面板从「选中项中间」长出来。menu.top 已由 layout() 落成「面板相对
  // 触发器」的偏移结果，所以窗口相对 menu 的 top = 触发器布局 top −
  // menu 布局 top，plate 再把选中行滚进这个窗口。此前 center 模式硬编码
  // [0, 0]，面板实际从自身顶端长出、与选中项无关（用户实测的偏差点）。
  const closedGeom = () => {
    const pz = layoutScale();
    const select = openState?.select;
    const host = hostOffset();
    const selectTop = select ? (select.getBoundingClientRect().top - host.y) / pz : 0;
    return [selectTop - menuTopNow(), -idx * ROW];
  };
  const shift = i => (lastDir === 'center' ? (i === anchor ? 0 : (i > anchor ? 8 : -8)) : (i === 0 ? 0 : -8));

  function paint() {
    for (let i = 0; i < rows.length; i++) {
      const el = rows[i];
      const sel = i === idx;
      const dis = isDis(i);
      el.className = 'acx-row' + (sel ? ' is-sel' : '') + (hoverI === i && !dis ? ' is-hover' : '') + (dis ? ' is-dis' : '');
      el.setAttribute('aria-selected', sel ? 'true' : 'false');
      el.setAttribute('aria-disabled', dis ? 'true' : 'false');
    }
    openState?.select?.setAttribute(OPEN_FLAG, open ? 'true' : 'false');
  }

  function closedFrame() {
    frame.style.transition = 'none';
    plate.style.transition = 'none';
    frame.style.boxShadow = 'none';
    layout();
    const g = closedGeom();
    setGeom(g[0], ROW, g[1]);
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.transition = 'none';
      rows[i].style.opacity = '0';
      rows[i].style.transform = `translateY(${shift(i)}px)`;
    }
    void frame.offsetWidth;
  }

  // 弹层位置与尺寸：宽度对齐触发器，top 按当前 anchor 与方向落位。
  function layout() {
    const pz = layoutScale();
    const select = openState?.select;
    if (!select) return;
    const rect = select.getBoundingClientRect();
    const host = hostOffset();
    menu.style.left = `${(rect.left - host.x) / pz}px`;
    menu.style.width = `${rect.width / pz}px`;
    menu.style.top = `${openOffset(anchor)}px`;
    const total = rows.length * ROW;
    menu.style.height = `${total}px`;
  }

  function renderRows(select) {
    ensureMenu();
    plate.innerHTML = '';
    rows = [];
    const options = [...select.options];
    if (!options.length) {
      const empty = document.createElement('div');
      empty.className = 'acx-empty';
      empty.textContent = '…';
      plate.appendChild(empty);
      return;
    }
    options.forEach((option, i) => {
      const row = document.createElement('div');
      row.className = 'acx-row';
      row.dataset.i = String(i);
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', 'false');
      const label = document.createElement('span');
      label.textContent = option.textContent;
      const check = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      check.setAttribute('viewBox', '0 0 12 12');
      check.setAttribute('aria-hidden', 'true');
      check.innerHTML = '<path d="M2 6.2L4.7 9L10 3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>';
      row.append(label, check);
      if (option.disabled) row.setAttribute('aria-disabled', 'true');
      plate.appendChild(row);
      rows.push(row);
      row.addEventListener('pointerenter', () => { if (!open || busy) return; hoverI = i; paint(); });
      row.addEventListener('pointerleave', () => { if (hoverI === i) hoverI = -1; paint(); });
    });
  }

  function show() {
    clearTimeout(timer);
    clearTimeout(moveTimer);
    busy = false;
    recenterGeom = false;
    anchor = idx;
    hoverI = -1;
    open = true;
    phase = 'opening';
    paint();
    layout();
    menu.style.visibility = 'visible';
    menu.style.pointerEvents = 'auto';
    closedFrame();
    frame.style.boxShadow = SHADOW;
    if (reducedMotion()) {
      snapOpen();
      return;
    }
    frame.style.transition = `top ${DUR}ms ${EO}, height ${DUR}ms ${EO}`;
    plate.style.transition = `top ${DUR}ms ${EO}`;
    setGeom(0, rows.length * ROW, 0);
    for (let i = 0; i < rows.length; i++) {
      const delay = Math.round(Math.abs(i - anchor) * 24);
      rows[i].style.transition = `opacity ${Math.round(DUR * 0.4)}ms ${EO} ${delay}ms, transform ${Math.round(DUR * 0.55)}ms ${EO} ${delay}ms, background 120ms ease`;
      rows[i].style.opacity = '1';
      rows[i].style.transform = 'translateY(0)';
    }
    timer = setTimeout(() => { if (open) phase = 'open'; }, DUR + 160);
  }

  function hide() {
    if (!open) return;
    open = false;
    phase = 'closing';
    clearTimeout(timer);
    openState?.select?.setAttribute(OPEN_FLAG, 'false');
    const duration = reducedMotion() ? 1 : CLOSE_DUR;
    const curve = reducedMotion() ? 'linear' : EC;
    const g = closedGeom();
    frame.style.transition = `top ${duration}ms ${curve}, height ${duration}ms ${curve}`;
    plate.style.transition = `top ${duration}ms ${curve}`;
    setGeom(g[0], ROW, g[1]);
    for (let i = 0; i < rows.length; i++) {
      if (i === anchor) {
        rows[i].style.transition = 'none';
        rows[i].style.opacity = '1';
      } else {
        rows[i].style.transition = `opacity ${Math.round(duration * 0.5)}ms ${curve}`;
        rows[i].style.opacity = '0';
      }
    }
    timer = setTimeout(() => {
      if (open) return;
      menu.style.visibility = 'hidden';
      menu.style.pointerEvents = 'none';
      phase = 'closed';
      anchor = idx;
      recenterGeom = false;
      hoverI = -1;
      paint();
      closedFrame();
      // 收起后彻底摘除弹层，避免残留在宿主 dialog 里参与后续布局。
      menu.remove();
    }, duration + 30);
  }

  // 关闭动画尚未结束时重新打开：先掐掉收尾定时，直接落到展开完成态。
  function snapOpen() {
    clearTimeout(timer);
    frame.style.transition = 'none';
    plate.style.transition = 'none';
    setGeom(0, rows.length * ROW, 0);
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.transition = 'none';
      rows[i].style.opacity = '1';
      rows[i].style.transform = 'translateY(0)';
    }
    void frame.offsetWidth;
    phase = 'open';
  }

  // 选中变更：把选中的那一行滑动到触发器位置（slide 模式动 pop 容器），
  // 滑到位后按关闭路径收起。
  function recenter(to) {
    if (reducedMotion()) {
      anchor = to;
      idx = to;
      paint();
      hide();
      return;
    }
    const duration = MOVE_DUR;
    const current = menuTopNow();
    const delta = openOffset(to) - contentTop();
    clearTimeout(timer);
    clearTimeout(moveTimer);
    busy = true;
    recenterGeom = true;
    anchor = to;
    const el = menu;
    const start = current;
    const end = current + delta;
    plate.style.transition = 'none';
    plate.style.top = elTop(plate) + 'px';
    menu.style.transition = 'none';
    menu.style.top = `${start}px`;
    void menu.offsetWidth;
    menu.style.transition = `top ${duration}ms ${ME}`;
    menu.style.top = `${end}px`;
    lastEl = el;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => {
      if (!busy) return;
      busy = false;
      el.style.transition = 'none';
      if (!open) return;
      el.style.top = `${end}px`;
      hide();
    }, duration + 30);
  }

  // 动画中途被新交互打断：把进行中的 top 定格在当前值，避免跳变。
  function settle() {
    if (!busy) return;
    clearTimeout(moveTimer);
    busy = false;
    if (!lastEl) return;
    const v = elTop(lastEl);
    lastEl.style.transition = 'none';
    lastEl.style.top = `${v}px`;
  }

  function commit(k) {
    if (isDis(k)) return;
    const select = openState.select;
    const value = openState.values[k];
    const changed = String(select.value) !== String(value);
    idx = k;
    if (changed) {
      select.value = value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    select.focus({ preventScroll: true });
    if (changed && open && lastDir === 'center') {
      if (phase === 'opening') snapOpen();
      paint();
      recenter(k);
    } else {
      anchor = k;
      paint();
      hide();
    }
  }

  const openFor = select => {
    if (select.disabled || select.multiple) return;
    const rect = select.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    clearTimeout(timer);
    clearTimeout(moveTimer);
    close(true);
    const dialog = select.closest('dialog');
    ensureMenu();
    renderRows(select);
    (dialog || document.body).appendChild(menu);
    const opts = [...select.options];
    openState = {
      select,
      dialog,
      values: opts.map(option => option.value),
      disabled: new Set(opts.flatMap((option, i) => (option.disabled ? [i] : [])))
    };
    idx = Math.max(0, Math.min(rows.length - 1, select.selectedIndex));
    paint();
    if (!open) show();
    else snapOpen();
  };

  const close = (immediate = false) => {
    if (!openState) return;
    // 收起时释放触发器焦点：否则 :focus 的外圈高光会一直挂在收起的下拉上。
    if (openState.select && document.activeElement === openState.select) openState.select.blur();
    openState.select.removeAttribute(OPEN_FLAG);
    if (immediate || !open) {
      open = false;
      clearTimeout(timer);
      clearTimeout(moveTimer);
      busy = false;
      menu?.remove();
      openState = null;
      rows = [];
      return;
    }
    hide();
    // hide 的收尾定时里会移除菜单；状态引用延后到动画结束再清。
    openState = null;
    rows = [];
  };

  const handleDocumentPointerDown = event => {
    if (!openState) return;
    if (event.target.closest('.acx-menu')) return;
    if (event.target.closest(`[${ENHANCED_FLAG}]`) === openState.select) return;
    settle();
    close();
  };

  const handleDocumentKeyDown = event => {
    if (!openState) return;
    const select = openState.select;
    const count = select.options.length;
    if (!open) {
      // 菜单尚未展开（关闭动画后的间隙）：仅响应打开键。
      if (document.activeElement === select && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openFor(select);
      }
      return;
    }
    if (busy && event.key !== 'Escape') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      settle();
      hide();
      select.focus({ preventScroll: true });
      return;
    }
    if (event.key === 'Tab') { settle(); hide(); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      let i = hoverI < 0 ? idx : hoverI;
      const dir = event.key === 'ArrowDown' ? 1 : -1;
      for (let n = 0; n < count; n++) {
        i = (i + dir + count) % count;
        if (!isDis(i)) break;
      }
      hoverI = i;
      paint();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (hoverI >= 0 && hoverI !== idx) commit(hoverI);
      else hide();
    }
  };

  // 触发器滚动/窗口变化时跟随：按当前 anchor 与方向重新落位（无动画）。
  const reposition = () => {
    if (!openState || !menu || !open) return;
    const keep = { frameTop: elTop(frame), frameHeight: frame.style.height, plateTop: elTop(plate) };
    layout();
    frame.style.top = keep.frameTop + 'px';
    frame.style.height = keep.frameHeight;
    plate.style.top = keep.plateTop + 'px';
  };

  const handleScroll = event => {
    if (!openState) return;
    if (event.target.contains && event.target.contains(openState.select)) reposition();
    else if (event.target === document || event.target === document.documentElement) reposition();
  };

  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
  document.addEventListener('keydown', handleDocumentKeyDown, true);
  window.addEventListener('resize', reposition, true);
  window.addEventListener('scroll', handleScroll, true);

  // —— 跨面按压产生的合成 click ——
  // 弹层从触发器的位置长出来，指针常常正好落在新展开的行上：按下在 select、
  // 松开在行内，浏览器会把 click 派发到两者的公共祖先（通常是 body）。宿主
  // 浮层（待办属性面板、筛选面板、新建菜单等）都靠 document 上的 click 判断
  // 「点到外面了」，会因为这一下把面板收起。这里记录按下的归属面，丢掉这类
  // 既不在触发器、也不在弹层里的 click——它不是用户对别处的点击。
  let pressSurface = null;
  const inMenu = node => node instanceof Element && Boolean(node.closest?.('.acx-menu'));
  const inTrigger = node => node instanceof Element && Boolean(node.closest?.(`[${ENHANCED_FLAG}]`));
  document.addEventListener('pointerdown', event => {
    const path = event.composedPath?.() || [event.target];
    pressSurface = path.some(inMenu) ? 'menu' : path.some(inTrigger) ? 'trigger' : null;
  }, true);
  document.addEventListener('click', event => {
    const surface = pressSurface;
    pressSurface = null;
    if (!surface) return;
    const path = event.composedPath?.() || [event.target];
    if (path.some(inMenu) || path.some(inTrigger)) return;
    if (!document.querySelector('.acx-menu')) return;
    event.stopPropagation();
    event.preventDefault();
  }, true);

  const enhance = select => {
    if (!(select instanceof HTMLSelectElement)) return;
    if (select.hasAttribute(ENHANCED_FLAG) || select.multiple) return;
    select.setAttribute(ENHANCED_FLAG, 'true');
    select.classList.add('acx-trigger');
    const trigger = event => {
      if (event.button !== undefined && event.button !== 0) return;
      if (select.disabled) return;
      event.preventDefault();
      event.stopPropagation();
      // 与参考实现一致：开着就收起；关闭动画中的再次点击 = 重新打开。
      if (openState?.select === select && open) { settle(); hide(); return; }
      select.focus({ preventScroll: true });
      openFor(select);
    };
    select.addEventListener('mousedown', trigger);
    const label = select.closest('label');
    if (label) label.addEventListener('mousedown', trigger);
    select.addEventListener('keydown', event => {
      if (select.disabled || openState?.select === select) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ') {
        trigger(event);
      }
    });
    // 外部程序改值（selectOption、业务代码）时同步弹层选中态。
    select.addEventListener('change', () => {
      if (openState?.select !== select || !open) return;
      const next = [...select.options].findIndex(option => String(option.value) === String(select.value));
      if (next >= 0) { idx = next; hoverI = -1; paint(); }
    });
  };

  const enhanceAll = root => {
    (root || document).querySelectorAll?.('select').forEach(enhance);
  };
  enhanceAll(document);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node instanceof HTMLSelectElement) enhance(node);
        else if (node.querySelectorAll) node.querySelectorAll('select').forEach(enhance);
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.__actaCustomSelect = { enhance, enhanceAll, closeMenu: () => close(true) };
})();

export {};
