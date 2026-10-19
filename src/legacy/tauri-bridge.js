(() => {
  'use strict';

  const tauri = window.__TAURI__;
  if (!tauri?.core?.invoke) return;

  const { invoke } = tauri.core;
  const dialog = tauri.dialog;
  const opener = tauri.opener;
  const currentWindow = tauri.window?.getCurrentWindow?.();
  const platform = /Macintosh|Mac OS X/i.test(navigator.userAgent) ? 'darwin' : 'win32';
  document.documentElement.dataset.desktopPlatform = platform;

  const firstPath = value => Array.isArray(value) ? value[0] || null : value || null;
  const baseName = value => String(value || '').split(/[\\/]/).pop() || '';
  const safeMarkdownName = value => {
    const name = baseName(value).replace(/\.(md|markdown|txt)$/i, '') || '行记笔记';
    return `${name}.md`;
  };
  const assetType = Object.freeze({
    'application/pdf': { extension:'pdf', name:'PDF 文档' },
    'image/png': { extension:'png', name:'PNG 图片' },
    'image/jpeg': { extension:'jpg', name:'JPEG 图片' }
  });

  window.actaDesktop = Object.freeze({
    platform,
    async chooseSyncFolder() {
      return firstPath(await dialog.open({
        title:'选择行记数据保存文件夹',
        directory:true,
        multiple:false
      }));
    },
    uploadLibrary(folder, library) {
      return invoke('upload_library', { folder, library });
    },
    downloadLibrary(folder) {
      return invoke('download_library', { folder });
    },
    inspectFolder(folder) {
      return invoke('inspect_folder', { folder });
    },
    dataFolderStats(folder) {
      return invoke('data_folder_stats', { folder });
    },
    webDavRequest(requestUrl, requestOptions = {}) {
      return invoke('web_dav_request', { requestUrl, requestOptions });
    },
    lanSync: {
      startService(profiles, trusted) {
        return invoke('lan_sync_start_service', { profiles, trusted });
      },
      updateMeta(profiles, trusted) {
        return invoke('lan_sync_update_meta', { profiles, trusted });
      },
      stopService() {
        return invoke('lan_sync_stop_service');
      },
      serviceStatus() {
        return invoke('lan_sync_service_status');
      },
      discover(timeoutMs = 1800) {
        return invoke('lan_sync_discover', { timeoutMs });
      },
      fetchInfo(ip, port, session) {
        return invoke('lan_sync_fetch_info', { ip, port, session });
      },
      // 第一阶段：发送写入计划（小体积），返回对方生成的计划令牌。
      pushPlan(ip, port, session, plan) {
        return invoke('lan_sync_push_plan', { ip, port, session, plan });
      },
      // 第二阶段：携带计划令牌传输数据档案。
      pushData(ip, port, session, token, bundle) {
        return invoke('lan_sync_push_data', { ip, port, session, token, bundle });
      },
      // 读取对方的一份行记数据档案（需对方开启「信任此局域网」）。
      fetchProfileBundle(ip, port, session, profileId) {
        return invoke('lan_sync_fetch_profile_bundle', { ip, port, session, profileId });
      },
      decideIncoming(accept) {
        return invoke('lan_sync_decide_incoming', { accept });
      },
      provideBundle(requestId, result) {
        return invoke('lan_sync_provide_bundle', { requestId, ok: Boolean(result?.ok), bundle: result?.bundle ?? null, error: result?.error ?? null });
      },
      acceptIncoming() {
        return invoke('lan_sync_accept_incoming');
      },
      confirmIncoming() {
        return invoke('lan_sync_confirm_incoming');
      },
      rejectIncoming() {
        return invoke('lan_sync_reject_incoming');
      },
      backupLocal(bundle, profileName) {
        return invoke('lan_sync_backup_local', { bundle, profileName });
      }
    },
    onLanIncoming(handler) {
      // 事件 API 缺失（如测试环境的简化 mock）时返回哑句柄，不阻断启动。
      if (!tauri.event?.listen) return Promise.resolve(() => {});
      return tauri.event.listen('lan-sync://incoming', handler);
    },
    onLanData(handler) {
      if (!tauri.event?.listen) return Promise.resolve(() => {});
      return tauri.event.listen('lan-sync://data', handler);
    },
    onLanFetch(handler) {
      if (!tauri.event?.listen) return Promise.resolve(() => {});
      return tauri.event.listen('lan-sync://fetch', handler);
    },
    onLanProgress(handler) {
      if (!tauri.event?.listen) return Promise.resolve(() => {});
      return tauri.event.listen('lan-sync://progress', handler);
    },
    onLanRejected(handler) {
      if (!tauri.event?.listen) return Promise.resolve(() => {});
      return tauri.event.listen('lan-sync://rejected', handler);
    },
    async importNote() {
      const path = firstPath(await dialog.open({
        title:'导入单独笔记',
        multiple:false,
        directory:false,
        filters:[{ name:'Markdown / Text', extensions:['md', 'markdown', 'txt'] }]
      }));
      return path ? invoke('import_note', { path }) : null;
    },
    async exportNote(fileName, content) {
      const path = await dialog.save({
        title:'导出单独笔记',
        defaultPath:safeMarkdownName(fileName),
        filters:[{ name:'Markdown', extensions:['md'] }]
      });
      return path ? invoke('export_note', { path, content }) : null;
    },
    async exportText(fileName, content) {
      const extension = /\.md$/i.test(baseName(fileName)) ? 'md' : 'txt';
      const path = await dialog.save({
        title:'导出文本文件',
        defaultPath:baseName(fileName),
        filters:[{ name: extension === 'md' ? 'Markdown' : '文本文档', extensions:[extension] }]
      });
      return path ? invoke('export_note', { path, content }) : null;
    },
    async exportAssets(assets) {
      if (!Array.isArray(assets) || !assets.length) return null;
      if (assets.length === 1) {
        const asset = assets[0];
        const type = assetType[asset.mimeType];
        const path = await dialog.save({
          title:'导出笔记',
          defaultPath:baseName(asset.fileName) || `行记笔记.${type?.extension || 'png'}`,
          filters:type ? [{ name:type.name, extensions:[type.extension] }] : []
        });
        return path ? invoke('export_assets', { destination:path, assets, directory:false }) : null;
      }
      const destination = firstPath(await dialog.open({
        title:'选择导出图片保存位置',
        directory:true,
        multiple:false
      }));
      return destination ? invoke('export_assets', { destination, assets, directory:true }) : null;
    },
    clearAppCache() {
      return invoke('clear_app_cache');
    },
    // 后台运行：关闭窗口转入系统托盘（Rust 侧拦截 CloseRequested 并隐藏窗口）。
    setRunInBackground(enabled) {
      return invoke('set_background_run', { enabled: Boolean(enabled) });
    },
    setAppIcon(dataUrl = '', preset = '') {
      return invoke('set_app_icon', { dataUrl, preset });
    },
    resolveAppData() {
      return invoke('resolve_app_data_dir');
    },
    prepareAppData(path) {
      return invoke('prepare_app_data_dir', { path });
    },
    loadAppDataSettings() {
      return invoke('load_app_data_settings');
    },
    saveAppDataSettings(content) {
      return invoke('save_app_data_settings', { content });
    },
    async chooseAppDataFolder() {
      return firstPath(await dialog.open({
        title:'选择软件数据文件夹',
        directory:true,
        multiple:false
      }));
    },
    async openPath(path) {
      try { await opener.openPath(path); } catch { /* 忽略打开失败 */ }
    },
    checkAppUpdate() {
      return invoke('check_app_update');
    },
    downloadAppUpdate(request) {
      return invoke('download_app_update', request);
    },
    prepareUpdateRestart(payload, version) {
      return invoke('prepare_update_restart', { payload, version });
    },
    onDownloadProgress(handler) {
      return tauri.event.listen('update://download', handler);
    },
    closeAppWindow() {
      return currentWindow.close();
    }
  });

  if (currentWindow) {
    // 窗口拖动统一在这里判定，挂在 document 的捕获阶段。
    // 二级弹层（设置、OOBE、各类 dialog）的遮罩铺满视口并带模糊，压在标题栏
    // 之上，直接监听 .titlebar 的 mousedown 永远收不到事件——弹层打开时窗口
    // 就拖不动了。所以判定不看元素层级，只看落点是否属于“窗口 chrome”：
    // 标题栏、沉浸编辑的自绘顶栏、弹层打开时视口顶部的标题栏条带，
    // 以及弹层自己的标题栏。控件与内容区一律不参与。
    //
    // 拖动与「点击空白处关闭」共用同一块弹层表面：startDragging 一旦交给
    // 系统，webview 就收不到后续 mouseup，click 不会发生。所以按下后先等
    // 指针挪出死区再真正拖动，原样松手就让 click 照常发生——否则弹层打开时
    // 顶部条带附近的单击 / 双击关闭会全部失灵。同理，双击最大化只留给窗口
    // 自身的 chrome；弹层表面的双击属于「点击空白处关闭」，不能抢。
    const DRAG_BLOCKERS = 'button, a, input, select, textarea, [contenteditable], [role="button"], .acdt-panel, .acx-menu';
    const OVERLAY_SELECTOR = '.settings-backdrop.open, .oobe-backdrop.open, dialog[open]';
    const OVERLAY_CHROME = '.settings-header, .oobe-head, .relation-dialog-head';
    const DRAG_DEAD_ZONE = 6;
    const titlebarStripHeight = () => document.querySelector('.titlebar')?.getBoundingClientRect().height || 52;
    // 'chrome' = 窗口自身 chrome（标题栏 / 沉浸顶栏），双击可最大化；
    // 'overlay' = 弹层打开时的 chrome 表面，点击与双击归「空白处关闭」。
    const chromePressKind = event => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest(DRAG_BLOCKERS)) return null;
      if (target.closest('.titlebar, .note-focus-header')) return 'chrome';
      if (!target.closest(OVERLAY_SELECTOR)) return null;
      // 遮罩之下就是标题栏，顶部这条条带仍然按 chrome 对待。
      return event.clientY <= titlebarStripHeight() || target.closest(OVERLAY_CHROME) ? 'overlay' : null;
    };
    let windowDragStartedAt = 0;
    const armWindowDrag = event => {
      const startX = event.clientX;
      const startY = event.clientY;
      const detach = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', detach);
        window.removeEventListener('pointercancel', detach);
      };
      const onMove = move => {
        if (Math.hypot(move.clientX - startX, move.clientY - startY) < DRAG_DEAD_ZONE) return;
        detach();
        windowDragStartedAt = Date.now();
        currentWindow.startDragging().catch(() => {});
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', detach, { once: true });
      window.addEventListener('pointercancel', detach, { once: true });
    };
    document.addEventListener('mousedown', event => {
      if (event.button !== 0) return;
      const kind = chromePressKind(event);
      if (!kind) return;
      event.preventDefault();
      armWindowDrag(event);
      if (kind === 'chrome' && event.detail === 2) currentWindow.toggleMaximize().catch(() => {});
    }, true);
    // 系统拖动收尾时 webview 可能补发合成 click：拖完窗口的松手不是点击，
    // 不能顺手把弹层关掉。
    document.addEventListener('click', event => {
      if (!windowDragStartedAt) return;
      const consumed = Date.now() - windowDragStartedAt <= 350;
      windowDragStartedAt = 0;
      if (consumed) event.stopImmediatePropagation();
    }, true);
    // 窗口控件有两处：主标题栏，以及全屏设置页头部（settingsWindowControls）。
    document.querySelectorAll('[data-window-action="minimize"]').forEach(button => {
      button.addEventListener('click', () => { currentWindow.minimize().catch(() => {}); });
    });
    document.querySelectorAll('[data-window-action="maximize"]').forEach(button => {
      button.addEventListener('click', () => { currentWindow.toggleMaximize().catch(() => {}); });
    });
    document.querySelectorAll('[data-window-action="close"]').forEach(button => {
      button.addEventListener('click', () => { currentWindow.close().catch(() => {}); });
    });
    // 最大化状态实时反映到 <html data-window-maximized>，窗口控件据此切换
    // 最大化/还原图标。旧环境缺少事件 API 时静默跳过。
    if (typeof currentWindow.onResized === 'function' && typeof currentWindow.isMaximized === 'function') {
      const syncMaximizedState = async () => {
        try {
          document.documentElement.dataset.windowMaximized = (await currentWindow.isMaximized()) ? 'true' : 'false';
        } catch { /* 窗口已销毁时忽略 */ }
      };
      currentWindow.onResized(() => { void syncMaximizedState(); });
      if (typeof currentWindow.onMoved === 'function') currentWindow.onMoved(() => { void syncMaximizedState(); });
      void syncMaximizedState();
    }
  }

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || !opener?.openUrl || !/^(https?|mailto):/i.test(anchor.href)) return;
    event.preventDefault();
    opener.openUrl(anchor.href).catch(() => {});
  });
})();
