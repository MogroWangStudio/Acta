(()=>{let e=window.__TAURI__;if(!e?.core?.invoke)return;let t=/^zh/i.test(navigator.language||``)?{title:`Acta 更新`,waiting:`等待应用退出…`,installing:`正在安装新版本…`,repairing:`正在清除隔离标记…`,launching:`正在启动新版本…`,done:`更新完成`,error:`更新失败`,close:`关闭`,hintRepair:`如果弹出了终端窗口，请输入密码以完成修复。`}:{title:`Acta Update`,waiting:`Waiting for the app to exit…`,installing:`Installing the new version…`,repairing:`Clearing the quarantine flag…`,launching:`Launching the new version…`,done:`Update complete`,error:`Update failed`,close:`Close`,hintRepair:`If a Terminal window appears, enter your password to finish the repair.`},n={wait:t.waiting,install:t.installing,repair:t.repairing,launch:t.launching,done:t.done,error:t.error},r=document.getElementById(`app`);r&&(r.innerHTML=`
      <style>
        html, body { height: 100%; margin: 0; }
        body { display: flex; align-items: center; justify-content: center; background: var(--sidebar); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; }
        .acta-wizard { width: 100%; max-width: 360px; padding: 0 24px; color: var(--ink); user-select: none; }
        .acta-wizard h1 { margin: 0 0 18px; font-size: 19px; font-weight: 700; letter-spacing: .01em; }
        /* 进度条：忙态为两段相位错开的不定进度，先加速离场再减速入场，
           收尾自然衔接；只动 left/width 的小元素，不引入渐变与光晕。 */
        .acta-wizard .track { height: 6px; border-radius: 3px; background: var(--panel); overflow: hidden; position: relative; }
        .acta-wizard .bar { height: 100%; width: 0; border-radius: 3px; background: var(--sage); transition: background-color .3s ease; }
        .acta-wizard.is-busy .bar { position: absolute; inset: 0; width: auto; background: transparent; }
        .acta-wizard.is-busy .bar::before,
        .acta-wizard.is-busy .bar::after { content: ''; position: absolute; top: 0; bottom: 0; border-radius: 3px; background: var(--sage); }
        .acta-wizard.is-busy .bar::before { animation: acta-wizard-sweep-main 1.7s cubic-bezier(.55,.1,.45,.9) infinite; }
        .acta-wizard.is-busy .bar::after { animation: acta-wizard-sweep-lead 1.7s cubic-bezier(.55,.1,.45,.9) infinite; animation-delay: .42s; }
        @keyframes acta-wizard-sweep-main { 0% { left: -38%; width: 38%; } 100% { left: 100%; width: 38%; } }
        @keyframes acta-wizard-sweep-lead { 0% { left: -24%; width: 24%; } 70% { width: 34%; } 100% { left: 100%; width: 34%; } }
        .acta-wizard.is-done .bar { width: 100%; background: var(--sage); animation: none; }
        .acta-wizard.is-error .bar { width: 100%; background: var(--danger-accent); animation: none; }
        .acta-wizard .stage { margin: 14px 0 4px; font-size: 13.5px; min-height: 18px; color: var(--ink); }
        .acta-wizard .hint { margin: 0; font-size: 12px; color: var(--muted); min-height: 16px; }
        .acta-wizard .actions { margin-top: 18px; text-align: right; }
        .acta-wizard button { display: none; border: 1px solid var(--line); border-radius: 9px; padding: 7px 16px; font-size: 13px; font-weight: 600; background: var(--white); color: var(--ink); cursor: pointer; transition: background .15s ease; }
        .acta-wizard button:hover { background: var(--panel); }
        .acta-wizard.is-error button { display: inline-block; }
        @media (prefers-reduced-motion: reduce) {
          .acta-wizard.is-busy .bar::before, .acta-wizard.is-busy .bar::after { animation: none; }
          .acta-wizard.is-busy .bar::before { left: 30%; width: 40%; opacity: .8; }
          .acta-wizard.is-busy .bar::after { content: none; }
        }
      </style>
      <div class="acta-wizard is-busy" id="actaWizard">
        <h1>${t.title}</h1>
        <div class="track"><div class="bar"></div></div>
        <p class="stage">${t.waiting}</p>
        <p class="hint"></p>
        <div class="actions"><button type="button" id="actaWizardClose">${t.close}</button></div>
      </div>`);let i=document.getElementById(`actaWizard`),a=i?.querySelector(`.stage`),o=i?.querySelector(`.hint`),s=e=>{if(!i||!e)return;let r=String(e.stage||``),s=String(e.message||``);i.classList.remove(`is-busy`,`is-done`,`is-error`),r===`done`?i.classList.add(`is-done`):r===`error`?i.classList.add(`is-error`):i.classList.add(`is-busy`),a&&(a.textContent=n[r]||s||t.installing),o&&(o.textContent=r===`repair`?t.hintRepair:r===`done`||r===`error`?s:``)};document.getElementById(`actaWizardClose`)?.addEventListener(`click`,()=>{e.window?.getCurrentWindow?.().close?.()}),e.core.invoke(`wizard_stage`).then(e=>{let[t,...n]=String(e||``).split(`|`);t&&s({stage:t,message:n.join(`|`)})}).catch(()=>{}),e.event.listen(`update://wizard`,e=>s(e.payload))})();