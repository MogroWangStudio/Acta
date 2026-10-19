// 自定义日期时间选择器：接管所有原生 <input type="datetime-local"> 的弹出选择。
// input 本体保留为值载体与触发器（设为 readonly，杜绝原生日历/滚轮），
// 弹层提供月历 + 时间选择；写回格式与 renderer 的 dateTimeLocalValue
// （YYYY-MM-DDTHH:mm:ss）一致，现有读写 input.value 的逻辑零改动。
// 弹层定位沿用 custom-select 的方案：fixed 定位、锚定触发器、
// 触发器位于 <dialog> 内时挂进该 dialog 并相对其边框盒计算坐标。
//
// 时间区提供两种可随时切换的输入方式（选择持久化在 localStorage）：
// - 转盘：Material You 风格的时钟转盘，时/分/秒三个阶段，按下即选、
//   拖动 1:1 跟随，松手自动进入下一阶段；24 小时制用内外双环。
// - 输入：数字输入框，支持手动键入（两位自动跳栏）、方向键增减、滚轮步进。
(() => {
  'use strict';
  if (window.__actaCustomDatetime) return;

  const ENHANCED_FLAG = 'data-acdt-enhanced';
  const DIAL_MODE_KEY = 'acta.datetime.mode';
  let panel = null;
  let openState = null; // { input, dialog, mode, stage, dragging, view, value }
  let closeTimer = 0;

  const style = document.createElement('style');
  style.textContent = `
input[${ENHANCED_FLAG}] { cursor: pointer; }
input[${ENHANCED_FLAG}]:hover { border-color: color-mix(in srgb, var(--sage) 30%, var(--line)); }
.acdt-panel { position: fixed; z-index: 2147483000; width: 268px; margin: 0; padding: 10px 10px 8px; border: 1px solid color-mix(in srgb, var(--line) 78%, var(--faint)); border-radius: 14px; background: var(--paper); color: var(--ink); box-shadow: 0 3px 9px -2px rgba(31,35,30,.14), 0 14px 32px -10px rgba(31,35,30,.22); overflow: hidden auto; opacity: 0; transform: scale(.955) translateY(-5px); transform-origin: 50% 0; pointer-events: none; transition: opacity .16s ease, transform .26s cubic-bezier(.16,1,.3,1); font-size: calc(11px * var(--acta-font-scale, 1)); }
.acdt-panel.acdt-flip { transform-origin: 50% 100%; transform: scale(.955) translateY(5px); }
.acdt-panel.acdt-open { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
.acdt-panel.acdt-closing { transition: opacity .13s ease, transform .13s cubic-bezier(.4,0,.7,.2); }
.acdt-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 7px; }
.acdt-title { min-width: 0; text-align: center; font-weight: 700; font-size: calc(11px * var(--acta-font-scale, 1)); letter-spacing: .01em; }
.acdt-nav { width: 26px; height: 26px; padding: 0; border: 0; border-radius: 8px; background: transparent; color: var(--muted); display: grid; place-items: center; cursor: pointer; transition: background .14s ease, color .14s ease, transform .18s cubic-bezier(.16,1,.3,1); }
.acdt-nav:hover { background: var(--panel); color: var(--ink); transform: scale(1.06); }
.acdt-nav svg { width: 13px; height: 13px; }
.acdt-nav.acdt-next svg { transform: rotate(180deg); }
.acdt-week, .acdt-grid { display: grid; grid-template-columns: repeat(7, minmax(0,1fr)); gap: 2px; }
.acdt-week span { padding: 2px 0 4px; color: var(--faint); font-size: calc(9px * var(--acta-font-scale, 1)); text-align: center; }
.acdt-day { height: 30px; padding: 0; border: 0; border-radius: 8px; background: transparent; color: var(--ink); font: inherit; font-size: calc(10px * var(--acta-font-scale, 1)); cursor: pointer; transition: background .13s ease, color .13s ease; }
.acdt-day:hover { background: var(--panel); }
.acdt-day.acdt-out { color: var(--faint); opacity: .55; }
.acdt-day.acdt-today { color: var(--sage); font-weight: 700; }
.acdt-day.acdt-selected { background: var(--sage); color: #fff; font-weight: 650; }
.acdt-time { margin-top: 9px; padding-top: 9px; border-top: 1px solid var(--line); }
.acdt-time-head { display: flex; align-items: center; justify-content: space-between; gap: 7px; margin-bottom: 7px; }
.acdt-time-head > span { color: var(--faint); font-size: calc(8px * var(--acta-font-scale, 1)); }
.acdt-mode { display: inline-flex; padding: 2px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); gap: 2px; }
.acdt-mode button { height: 20px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: var(--muted); font: inherit; font-size: calc(8.5px * var(--acta-font-scale, 1)); font-weight: 650; cursor: pointer; transition: background .14s ease, color .14s ease; }
.acdt-mode button.acdt-active { background: var(--white); color: var(--ink); box-shadow: 0 1px 2px rgba(31,35,30,.08); }
.acdt-time .acdt-inputs { display: flex; align-items: end; gap: 7px; }
.acdt-time label { min-width: 0; flex: 1; display: grid; gap: 3px; }
.acdt-time label span { color: var(--faint); font-size: calc(8px * var(--acta-font-scale, 1)); }
.acdt-time input { width: 100%; height: 29px; padding: 0 6px; border: 1px solid var(--line); border-radius: 8px; background: var(--white); color: var(--ink); outline: 0; font: inherit; font-size: calc(10px * var(--acta-font-scale, 1)); text-align: center; font-variant-numeric: tabular-nums; cursor: text; transition: border-color .14s ease; }
.acdt-time input:hover { border-color: color-mix(in srgb, var(--sage) 30%, var(--line)); }
.acdt-time input:focus { border-color: color-mix(in srgb, var(--sage) 55%, var(--line)); }
/* —— 时钟转盘 —— */
.acdt-chips { display: flex; justify-content: center; gap: 4px; margin-bottom: 4px; }
.acdt-chip { min-width: 52px; height: 26px; padding: 0 8px; border: 0; border-radius: 8px; background: transparent; color: var(--muted); font: inherit; font-variant-numeric: tabular-nums; font-size: calc(11px * var(--acta-font-scale, 1)); font-weight: 400; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px; transition: background .15s ease, color .15s ease; }
/* 阶段值用 <b> 承载语义，必须显式归零字重：浏览器对 <b> 的 bolder 会
   在 650 的基础上继续加粗到 900，看起来比转盘数字重得多。 */
.acdt-chip b { font-weight: 400; }
.acdt-chip em { font-style: normal; color: var(--faint); font-size: calc(8px * var(--acta-font-scale, 1)); font-weight: 400; }
.acdt-chip.acdt-active { background: color-mix(in srgb, var(--sage) 12%, transparent); color: var(--sage); }
/* 全局 svg 规则（fill:none / stroke:currentColor / stroke-width:1.7）是给图标用的，
   它会沿继承链灌进转盘：数字被描上一圈深色轮廓，看着像加粗体；旋钮与圆心也
   多出一圈描边。转盘在这里整体复位描边，只让刻度与指针自己声明。 */
.acdt-dial { display: block; width: 216px; height: 216px; margin: 0 auto; touch-action: none; cursor: pointer; outline: none; user-select: none; -webkit-user-select: none; stroke: none; }
.acdt-dial:focus-visible .acdt-dial-face { stroke: color-mix(in srgb, var(--sage) 55%, var(--line)); }
.acdt-dial-face { fill: var(--panel); stroke: var(--line); }
.acdt-dial-tick { stroke: var(--line); }
.acdt-dial-num { fill: var(--ink); font-size: 13px; font-weight: 400; font-variant-numeric: tabular-nums; text-anchor: middle; dominant-baseline: central; }
.acdt-dial-num.acdt-sub { fill: var(--muted); font-size: 10.5px; font-weight: 400; }
.acdt-dial-num.acdt-picked { fill: var(--paper); }
.acdt-dial-knob { fill: var(--sage); opacity: 0; transition: opacity .12s ease, transform .18s cubic-bezier(.16,1,.3,1); }
.acdt-dial.acdt-dragging .acdt-dial-knob, .acdt-dial.acdt-dragging .acdt-dial-hand { transition: none; }
.acdt-dial-hand { stroke: var(--sage); opacity: 0; transition: opacity .12s ease, transform .18s cubic-bezier(.16,1,.3,1); transform-origin: 108px 108px; }
.acdt-dial-dot { fill: var(--sage); }
.acdt-actions { display: flex; align-items: center; justify-content: space-between; gap: 7px; margin-top: 9px; }
.acdt-actions button { height: 28px; padding: 0 11px; border: 1px solid var(--line); border-radius: 8px; background: transparent; color: var(--muted); font: inherit; font-size: calc(9px * var(--acta-font-scale, 1)); font-weight: 650; cursor: pointer; transition: color .15s ease, background .15s ease, border-color .15s ease; }
.acdt-actions button:hover { color: var(--ink); background: var(--panel); }
.acdt-actions .acdt-now { color: var(--sage); border-color: color-mix(in srgb, var(--sage) 30%, var(--line)); }
.acdt-actions .acdt-now:hover { background: color-mix(in srgb, var(--sage) 12%, transparent); }
@media (prefers-reduced-motion: reduce) { .acdt-panel { transition: opacity .01ms; transform: none; } .acdt-dial-knob, .acdt-dial-hand { transition: none; } }
`;
  document.head.appendChild(style);

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  const STAGES = [['hour', '时', 23], ['minute', '分', 59], ['second', '秒', 59]];
  const pad = value => String(value).padStart(2, '0');

  const readDialMode = () => {
    try { return localStorage.getItem(DIAL_MODE_KEY) === 'input' ? 'input' : 'dial'; }
    catch { return 'dial'; }
  };
  const saveDialMode = mode => {
    try { localStorage.setItem(DIAL_MODE_KEY, mode === 'input' ? 'input' : 'dial'); } catch { /* 隐私模式等场景忽略 */ }
  };

  const toLocalValue = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  const toTwo = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const parseInputValue = raw => {
    const match = String(raw || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    return {
      year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]),
      hour: Number(match[4]), minute: Number(match[5]), second: Number(match[6] || 0)
    };
  };

  const writeBack = () => {
    if (!openState) return;
    const { input, value } = openState;
    const next = `${value.year}-${pad(value.month + 1)}-${pad(value.day)}T${pad(value.hour)}:${pad(value.minute)}:${pad(value.second)}`;
    if (input.value !== next) {
      input.value = next;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // —— 时钟转盘渲染 ——
  // viewBox 216×216，圆心 (108,108)。外环数字半径 86，内环（13-24 时）54。
  const DIAL_CENTER = 108;
  const DIAL_OUTER_R = 86;
  const DIAL_INNER_R = 54;

  const polar = (radius, angleDeg) => {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return [DIAL_CENTER + radius * Math.cos(rad), DIAL_CENTER + radius * Math.sin(rad)];
  };

  // 当前阶段所选值落在外环还是内环：13-24 时（含 0 → 内环 24）走内环。
  const hourRing = hour => (hour >= 13 || hour === 0 ? DIAL_INNER_R : DIAL_OUTER_R);
  const hourAngle = hour => ((hour === 0 ? 24 : hour) % 12) * 30;
  const unitAngle = (unit, value) => unit === 'hour' ? hourAngle(value) : value * 6;

  const dialHand = (unit, value) => {
    const radius = unit === 'hour' ? hourRing(value) : DIAL_OUTER_R;
    return `${DIAL_CENTER},${DIAL_CENTER} ${polar(radius, unitAngle(unit, value)).join(',')}`;
  };

  const buildDialSVG = (unit, value) => {
    // 刻度与数字先算好，最后再叠到指针与旋钮之上——旋钮正好压住选中数字时，
    // 反白的数字才能浮在旋钮上；否则当前选择会被旋钮整个盖住。
    const marks = [];
    if (unit === 'hour') {
      // 24 小时制双环：外环 1-12，内环 13-24；内环数字更小、更弱。
      for (let hour = 1; hour <= 12; hour += 1) {
        const [x, y] = polar(DIAL_OUTER_R, hour * 30);
        marks.push(`<text class="acdt-dial-num${value === hour ? ' acdt-picked' : ''}" x="${x}" y="${y}">${hour}</text>`);
      }
      for (let hour = 13; hour <= 24; hour += 1) {
        const [x, y] = polar(DIAL_INNER_R, (hour - 12) * 30);
        marks.push(`<text class="acdt-dial-num acdt-sub${value === hour % 24 ? ' acdt-picked' : ''}" x="${x}" y="${y}">${hour}</text>`);
      }
    } else {
      // 分/秒：60 刻度，每 5 格标数字。
      for (let tick = 0; tick < 60; tick += 1) {
        if (tick % 5 === 0) continue;
        const [x1, y1] = polar(DIAL_OUTER_R + 10, tick * 6);
        const [x2, y2] = polar(DIAL_OUTER_R + 14, tick * 6);
        marks.push(`<line class="acdt-dial-tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="1.5"/>`);
      }
      // 只有旋钮正好落在这个刻度上时才反白；否则白色数字落在浅色底盘上会消失。
      for (let tick = 0; tick < 60; tick += 5) {
        const [x, y] = polar(DIAL_OUTER_R, tick * 6);
        marks.push(`<text class="acdt-dial-num${value === tick ? ' acdt-picked' : ''}" x="${x}" y="${y}">${pad(tick)}</text>`);
      }
    }
    const [knobX, knobY] = unit === 'hour' ? polar(hourRing(value), hourAngle(value)) : polar(DIAL_OUTER_R, value * 6);
    return [
      `<circle class="acdt-dial-face" cx="${DIAL_CENTER}" cy="${DIAL_CENTER}" r="${DIAL_OUTER_R + 16}"/>`,
      `<line class="acdt-dial-hand" x1="${DIAL_CENTER}" y1="${DIAL_CENTER}" x2="${knobX}" y2="${knobY}"/>`,
      `<circle class="acdt-dial-knob" cx="${knobX}" cy="${knobY}" r="${unit === 'hour' ? 15 : 13}"/>`,
      `<circle class="acdt-dial-dot" cx="${DIAL_CENTER}" cy="${DIAL_CENTER}" r="4.5"/>`,
      ...marks
    ].join('');
  };

  // 指针角度（12 点方向为 0°，顺时针）。
  const pointerAngle = (svg, clientX, clientY) => {
    const rect = svg.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    let deg = Math.atan2(dx, -dy) * 180 / Math.PI;
    if (deg < 0) deg += 360;
    return { deg, radius: Math.hypot(dx, dy) * (216 / rect.width) };
  };

  // 角度 → 当前阶段的值；小时区分内外环（内外环边界取两环半径中点）。
  const pointerToValue = (unit, deg, radius) => {
    if (unit === 'hour') {
      const outer = radius >= (DIAL_INNER_R + DIAL_OUTER_R) / 2;
      const slot = Math.round(deg / 30) % 12;
      return outer ? (slot === 0 ? 12 : slot) : ((slot + 12) % 24);
    }
    return Math.round(deg / 6) % 60;
  };

  // 拖动中只更新转盘与写回值，不重建面板（保持 1:1 跟随、可随时打断）。
  const applyDialValue = (unit, value) => {
    if (!openState) return;
    const svg = panel?.querySelector('.acdt-dial');
    if (!svg) return;
    value = ((value % (unit === 'hour' ? 24 : 60)) + (unit === 'hour' ? 24 : 60)) % (unit === 'hour' ? 24 : 60);
    openState.value[unit] = value;
    svg.innerHTML = buildDialSVG(unit, value);
    svg.querySelector('.acdt-dial-hand')?.style.setProperty('opacity', '1');
    svg.querySelector('.acdt-dial-knob')?.style.setProperty('opacity', '1');
    const chip = panel.querySelector(`.acdt-chip[data-stage="${unit}"] b`);
    if (chip) chip.textContent = pad(value);
    writeBack();
  };

  const advanceStage = () => {
    if (!openState || openState.mode !== 'dial') return;
    const order = STAGES.map(([key]) => key);
    const next = order[Math.min(order.indexOf(openState.stage) + 1, order.length - 1)];
    if (next !== openState.stage) {
      openState.stage = next;
      renderTimeBody();
    }
  };

  const renderTimeBody = () => {
    if (!openState || !panel) return;
    const body = panel.querySelector('.acdt-time-body');
    if (!body) return;
    const { value, mode, stage } = openState;
    if (mode === 'dial') {
      body.innerHTML = `
        <div class="acdt-chips">${STAGES.map(([key, label]) => `
          <button type="button" class="acdt-chip${key === stage ? ' acdt-active' : ''}" data-stage="${key}" aria-label="选择${label}">
            <em>${label}</em><b>${pad(value[key])}</b>
          </button>`).join('')}
        </div>
        <svg class="acdt-dial" viewBox="0 0 216 216" role="application" tabindex="0" aria-label="时钟转盘，拖动选择${stage === 'hour' ? '小时' : stage === 'minute' ? '分钟' : '秒'}"></svg>`;
      const svg = body.querySelector('.acdt-dial');
      svg.innerHTML = buildDialSVG(stage, value[stage]);
      svg.querySelector('.acdt-dial-hand')?.style.setProperty('opacity', '1');
      svg.querySelector('.acdt-dial-knob')?.style.setProperty('opacity', '1');
      return;
    }
    // 输入模式：数字框支持手动键入（两位自动跳栏）、方向键增减、滚轮步进。
    body.innerHTML = `<div class="acdt-inputs">${STAGES.map(([key, label, max]) => `
      <label>
        <span>${label}</span>
        <input type="text" inputmode="numeric" maxLength="2" class="acdt-${key}" data-unit="${key}" data-max="${max}" value="${pad(value[key])}" aria-label="${label}"/>
      </label>`).join('')}
    </div>`;
  };

  const renderPanel = () => {
    if (!openState || !panel) return;
    const { value, view } = openState;
    panel.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'acdt-head';
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'acdt-nav';
    prev.setAttribute('aria-label', '上一月');
    prev.innerHTML = '<svg><use href="#i-chevron"/></svg>';
    const title = document.createElement('b');
    title.className = 'acdt-title';
    title.textContent = `${view.year} 年 ${view.month + 1} 月`;
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'acdt-nav acdt-next';
    next.setAttribute('aria-label', '下一月');
    next.innerHTML = '<svg><use href="#i-chevron"/></svg>';
    head.append(prev, title, next);

    const week = document.createElement('div');
    week.className = 'acdt-week';
    WEEKDAYS.forEach(label => {
      const cell = document.createElement('span');
      cell.textContent = label;
      week.appendChild(cell);
    });

    const grid = document.createElement('div');
    grid.className = 'acdt-grid';
    const firstDay = new Date(view.year, view.month, 1);
    const startOffset = firstDay.getDay();
    const todayTwo = toTwo(new Date());
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(view.year, view.month, 1 - startOffset + index);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'acdt-day';
      cell.textContent = String(date.getDate());
      cell.dataset.date = toTwo(date);
      const outOfMonth = date.getMonth() !== view.month;
      if (outOfMonth) cell.classList.add('acdt-out');
      if (cell.dataset.date === todayTwo) cell.classList.add('acdt-today');
      if (value.year === date.getFullYear() && value.month === date.getMonth() && value.day === date.getDate()) {
        cell.classList.add('acdt-selected');
      }
      grid.appendChild(cell);
    }

    // 时间区：标题行带「转盘 / 输入」切换，两种方式随时互换并记住选择。
    const time = document.createElement('div');
    time.className = 'acdt-time';
    const timeHead = document.createElement('div');
    timeHead.className = 'acdt-time-head';
    timeHead.innerHTML = `
      <span>时间</span>
      <span class="acdt-mode" role="group" aria-label="时间输入方式">
        <button type="button" data-acdt-mode="dial" class="${openState.mode === 'dial' ? 'acdt-active' : ''}" aria-pressed="${openState.mode === 'dial'}">转盘</button>
        <button type="button" data-acdt-mode="input" class="${openState.mode === 'input' ? 'acdt-active' : ''}" aria-pressed="${openState.mode === 'input'}">输入</button>
      </span>`;
    const timeBody = document.createElement('div');
    timeBody.className = 'acdt-time-body';
    time.append(timeHead, timeBody);

    const actions = document.createElement('div');
    actions.className = 'acdt-actions';
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'acdt-clear';
    clear.textContent = '清除';
    const now = document.createElement('button');
    now.type = 'button';
    now.className = 'acdt-now';
    now.textContent = '此刻';
    actions.append(clear, now);

    panel.append(head, week, grid, time, actions);
    renderTimeBody();
  };

  const placePanel = () => {
    if (!openState || !panel) return;
    const { input, dialog } = openState;
    const rect = input.getBoundingClientRect();
    if (!panel.isConnected) return;
    const dialogRect = dialog ? dialog.getBoundingClientRect() : null;
    const width = panel.offsetWidth || 268;
    // 弹层必须完整落在容器（宿主 dialog 或视口）内：dialog 常带
    // overflow:hidden，超出部分会被裁剪。面板比容器矮时正常上下翻转；
    // 比容器还高时夹取位置并允许面板内部滚动。
    const bounds = dialogRect
      ? { top: dialogRect.top, height: dialogRect.height }
      : { top: 0, height: window.innerHeight };
    const margin = 6;
    const spaceBelow = bounds.top + bounds.height - margin - rect.bottom;
    const spaceAbove = rect.top - bounds.top - margin;
    const naturalHeight = panel.offsetHeight || 330;
    const flip = spaceBelow < naturalHeight + 10 && spaceAbove > spaceBelow;
    const availableHeight = Math.max(220, Math.min(naturalHeight, (flip ? spaceAbove : spaceBelow) - margin));
    panel.style.maxHeight = `${Math.max(220, Math.min(naturalHeight, availableHeight))}px`;
    const height = Math.min(naturalHeight, availableHeight);
    let left = rect.left - (dialogRect ? dialogRect.left : 0);
    let top = flip
      ? rect.top - (dialogRect ? dialogRect.top : 0) - height - margin
      : rect.bottom - (dialogRect ? dialogRect.top : 0) + margin;
    const maxTop = Math.max(margin, bounds.height - height - margin);
    top = Math.min(Math.max(top, margin), maxTop);
    if (dialogRect) left = Math.min(Math.max(left, 6), Math.max(6, dialogRect.width - width - 6));
    else left = Math.min(Math.max(left, 8), Math.max(8, window.innerWidth - width - 8));
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    panel.classList.toggle('acdt-flip', flip);
  };

  const closePanel = (immediate = false) => {
    if (!openState || !panel) return;
    openState = null;
    clearTimeout(closeTimer);
    const closing = panel;
    if (immediate) { closing.remove(); return; }
    closing.classList.add('acdt-closing');
    closing.classList.remove('acdt-open');
    closeTimer = setTimeout(() => closing.remove(), 140);
  };

  const openPanel = input => {
    if (input.disabled) return;
    const rect = input.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    clearTimeout(closeTimer);
    closePanel(true);
    const dialog = input.closest('dialog');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'acdt-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', '选择日期和时间');
      panel.addEventListener('mousedown', event => {
        // 时间输入框需要原生焦点与光标，不能阻断其默认行为。
        if (event.target.closest('input[data-unit]')) return;
        event.preventDefault();
      });
      panel.addEventListener('click', event => {
        if (!openState) return;
        const nav = event.target.closest('.acdt-nav');
        if (nav) {
          const step = nav.classList.contains('acdt-next') ? 1 : -1;
          const shifted = openState.view.year * 12 + openState.view.month + step;
          openState.view.year = Math.floor(shifted / 12);
          openState.view.month = ((shifted % 12) + 12) % 12;
          renderPanel();
          placePanel();
          return;
        }
        const day = event.target.closest('.acdt-day');
        if (day) {
          const [year, month, date] = day.dataset.date.split('-').map(Number);
          openState.value = { ...openState.value, year, month: month - 1, day: date };
          writeBack();
          renderPanel();
          placePanel();
          return;
        }
        if (event.target.closest('.acdt-clear')) {
          openState.input.value = '';
          openState.input.dispatchEvent(new Event('input', { bubbles: true }));
          openState.input.dispatchEvent(new Event('change', { bubbles: true }));
          closePanel();
          return;
        }
        if (event.target.closest('.acdt-now')) {
          const current = new Date();
          openState.value = parseInputValue(toLocalValue(current));
          writeBack();
          openState.view = { year: openState.value.year, month: openState.value.month };
          renderPanel();
          placePanel();
          return;
        }
        // 输入方式切换：记忆选择，切换后重绘时间区。
        const modeButton = event.target.closest('[data-acdt-mode]');
        if (modeButton) {
          const mode = modeButton.dataset.acdtMode;
          if (mode !== openState.mode) {
            openState.mode = mode;
            saveDialMode(mode);
            panel.querySelectorAll('[data-acdt-mode]').forEach(button => {
              const active = button.dataset.acdtMode === mode;
              button.classList.toggle('acdt-active', active);
              button.setAttribute('aria-pressed', String(active));
            });
            renderTimeBody();
          }
          return;
        }
        // 转盘的阶段标签：点击直接切到对应阶段。
        const chip = event.target.closest('.acdt-chip');
        if (chip && chip.dataset.stage !== openState.stage) {
          openState.stage = chip.dataset.stage;
          renderTimeBody();
        }
      });

      // —— 转盘指针交互 ——
      // 按下即选（响应先于松手），拖动 1:1 跟随，松手提交并进入下一阶段；
      // 全程可被打断，与手指保持同一节奏。
      panel.addEventListener('pointerdown', event => {
        if (!openState || openState.mode !== 'dial') return;
        const svg = event.target.closest?.('.acdt-dial');
        if (!svg) return;
        event.preventDefault();
        try { svg.setPointerCapture(event.pointerId); } catch { /* 指针已释放时静默 */ }
        svg.classList.add('acdt-dragging');
        openState.dragging = true;
        const { deg, radius } = pointerAngle(svg, event.clientX, event.clientY);
        applyDialValue(openState.stage, pointerToValue(openState.stage, deg, radius));
      });
      panel.addEventListener('pointermove', event => {
        if (!openState?.dragging || openState.mode !== 'dial') return;
        const svg = event.target.closest?.('.acdt-dial');
        if (!svg) return;
        const { deg, radius } = pointerAngle(svg, event.clientX, event.clientY);
        applyDialValue(openState.stage, pointerToValue(openState.stage, deg, radius));
      });
      const endDialDrag = event => {
        if (!openState?.dragging) return;
        const svg = event.target.closest?.('.acdt-dial');
        svg?.classList.remove('acdt-dragging');
        openState.dragging = false;
        // 拖完一小时/一分钟自动进入下一阶段（秒为最后一站，停在原地）。
        if (openState.stage !== 'second') advanceStage();
      };
      panel.addEventListener('pointerup', endDialDrag);
      panel.addEventListener('pointercancel', endDialDrag);

      // 转盘键盘支持：聚焦后方向键以 1 为步长调整当前阶段。
      panel.addEventListener('keydown', event => {
        if (!openState || openState.mode !== 'dial') return;
        const svg = event.target.closest?.('.acdt-dial');
        if (!svg) return;
        const step = event.key === 'ArrowUp' || event.key === 'ArrowRight' ? 1
          : event.key === 'ArrowDown' || event.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        event.preventDefault();
        applyDialValue(openState.stage, openState.value[openState.stage] + step);
      });

      panel.addEventListener('input', event => {
        const input = event.target.closest('input[data-unit]');
        if (!input || !openState) return;
        const unit = input.dataset.unit;
        const max = Number(input.dataset.max);
        const digits = input.value.replace(/\D/g, '').slice(-2);
        if (!digits) return; // 输入中允许暂时为空，失焦时归一化。
        const number = Math.min(Number(digits), max);
        openState.value[unit] = number;
        writeBack();
        // 两位输满或已到上限时自动跳到下一栏，连续键入 0930 即 09:30。
        if (digits.length === 2 || Number(digits) * 10 > max) {
          const inputs = [...panel.querySelectorAll('input[data-unit]')];
          inputs[Math.min(inputs.indexOf(input) + 1, inputs.length - 1)]?.select?.();
        }
      });
      panel.addEventListener('focusin', event => {
        const input = event.target.closest('input[data-unit]');
        if (input) input.select?.(); // 聚焦即全选，直接输入替换。
      });
      const normalizeTimeInput = input => {
        if (!openState) return;
        const unit = input.dataset.unit;
        const max = Number(input.dataset.max);
        const digits = input.value.replace(/\D/g, '');
        const number = Math.min(Math.max(Number(digits) || 0, 0), max);
        openState.value[unit] = number;
        input.value = pad(number);
        writeBack();
      };
      panel.addEventListener('focusout', event => {
        const input = event.target.closest('input[data-unit]');
        if (input) normalizeTimeInput(input);
      });
      panel.addEventListener('keydown', event => {
        const input = event.target.closest('input[data-unit]');
        if (!input || !openState) return;
        const unit = input.dataset.unit;
        const max = Number(input.dataset.max);
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          const step = event.key === 'ArrowUp' ? 1 : -1;
          const next = ((openState.value[unit] + step) % (max + 1) + max + 1) % (max + 1);
          openState.value[unit] = next;
          input.value = pad(next);
          writeBack();
          input.select?.();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          normalizeTimeInput(input);
          input.blur();
        }
      });
      panel.addEventListener('wheel', event => {
        const input = event.target.closest('input[data-unit]');
        if (!input || !openState) return;
        event.preventDefault();
        const unit = input.dataset.unit;
        const max = Number(input.dataset.max);
        const step = event.deltaY < 0 ? 1 : -1;
        const next = ((openState.value[unit] + step) % (max + 1) + max + 1) % (max + 1);
        openState.value[unit] = next;
        input.value = pad(next);
        writeBack();
      }, { passive: false });
    }
    const parsed = parseInputValue(input.value);
    const fallback = new Date();
    openState = {
      input,
      dialog,
      mode: readDialMode(),
      stage: 'hour',
      dragging: false,
      value: parsed || { year: fallback.getFullYear(), month: fallback.getMonth(), day: fallback.getDate(), hour: 0, minute: 0, second: 0 },
      view: null
    };
    openState.view = { year: openState.value.year, month: openState.value.month };
    renderPanel();
    (dialog || document.body).appendChild(panel);
    placePanel();
    // 双 rAF：先以收起态完成布局，再过渡到展开态，可中断、沿同一路径返回。
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (openState) panel.classList.add('acdt-open');
    }));
  };

  const handleDocumentPointerDown = event => {
    if (!openState) return;
    if (event.target.closest('.acdt-panel')) return;
    if (event.target.closest(`[${ENHANCED_FLAG}]`) === openState.input) return;
    closePanel();
  };

  const moveDayFocus = step => {
    const days = [...panel.querySelectorAll('.acdt-day')];
    const current = days.indexOf(document.activeElement);
    const target = days[(current < 0 ? 0 : current) + step];
    target?.focus({ preventScroll: true });
  };

  const handleDocumentKeyDown = event => {
    if (!openState || !panel) return;
    if (event.key === 'Escape') {
      // custom-select 的时间下拉打开时，Esc 交给它先收起。
      if (document.querySelector('.acx-menu.acx-open')) return;
      event.preventDefault();
      event.stopPropagation();
      closePanel();
      openState?.input?.focus({ preventScroll: true });
      return;
    }
    if (!panel.contains(document.activeElement)) return;
    // 时间输入框/转盘内的方向键由各自的调整逻辑处理，不移动日期焦点。
    if (document.activeElement instanceof Element && (document.activeElement.closest('input[data-unit]') || document.activeElement.closest('.acdt-dial'))) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); moveDayFocus(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); moveDayFocus(-1); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); moveDayFocus(7); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveDayFocus(-7); }
  };

  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
  document.addEventListener('keydown', handleDocumentKeyDown, true);
  window.addEventListener('resize', () => placePanel(), true);
  window.addEventListener('scroll', event => {
    if (!openState) return;
    if (event.target.contains && event.target.contains(openState.input)) placePanel();
    else if (event.target === document || event.target === document.documentElement) placePanel();
  }, true);

  const enhance = input => {
    if (!(input instanceof HTMLInputElement) || input.type !== 'datetime-local') return;
    if (input.hasAttribute(ENHANCED_FLAG)) return;
    input.setAttribute(ENHANCED_FLAG, 'true');
    input.readOnly = true;
    const trigger = event => {
      if (event.button !== undefined && event.button !== 0) return;
      if (input.disabled) return;
      event.preventDefault();
      event.stopPropagation();
      if (openState?.input === input) { closePanel(); return; }
      openPanel(input);
    };
    input.addEventListener('mousedown', trigger);
    const label = input.closest('label');
    if (label) label.addEventListener('mousedown', trigger);
    input.addEventListener('keydown', event => {
      if (input.disabled || openState?.input === input) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ' || event.key === 'Enter') trigger(event);
    });
  };

  const enhanceAll = root => {
    (root || document).querySelectorAll?.('input[type="datetime-local"]').forEach(enhance);
  };
  enhanceAll(document);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node instanceof HTMLInputElement) enhance(node);
        else if (node.querySelectorAll) node.querySelectorAll('input[type="datetime-local"]').forEach(enhance);
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.__actaCustomDatetime = { enhance, enhanceAll, closePanel };
})();
