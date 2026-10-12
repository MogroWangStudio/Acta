//! 单实例约束：同一时间只允许一个 Acta 主窗口存在。
//!
//! 以 127.0.0.1:44154 的 TCP 端口作为实例锁：先到的实例绑定端口并监听
//! “唤起”请求；后到的实例连接、发送 ACTA_SHOW、收到确认后退出，由
//! 首实例把主窗口带到前台。只绑定回环地址，不涉及对外网络，也不会触发
//! 系统防火墙提示。更新向导实例（--acta-update-wizard）不走此流程。

use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::time::Duration;

pub const SINGLE_INSTANCE_PORT: u16 = 44154;
const SHOW_MAGIC: &[u8] = b"ACTA_SHOW";
const ACK_MAGIC: &[u8] = b"ACTA_ACK";

/// 实例锁的申请结果。
pub enum Claim {
    /// 首个实例：持有监听器，后续在 setup 中启动唤起监听线程。
    First(TcpListener),
    /// 已有 Acta 实例在运行：已向其发送唤起请求，调用方应立即退出。
    Another,
    /// 锁端口被无关应用占用：放行启动（端口冲突不应让应用无法运行），
    /// 但本进程无法再阻止后续实例。
    Fallback,
}

/// 尝试成为唯一实例。
pub fn claim() -> Claim {
    match TcpListener::bind(("127.0.0.1", SINGLE_INSTANCE_PORT)) {
        Ok(listener) => Claim::First(listener),
        Err(_) => {
            if notify_running() { Claim::Another } else { Claim::Fallback }
        }
    }
}

/// 向已运行的实例发送唤起请求并等待确认；确认来自真正的 Acta 才返回 true。
fn notify_running() -> bool {
    let Ok(mut stream) = TcpStream::connect_timeout(
        &format!("127.0.0.1:{SINGLE_INSTANCE_PORT}").parse().unwrap(),
        Duration::from_millis(800),
    ) else { return false };
    let _ = stream.write_all(SHOW_MAGIC);
    let _ = stream.flush();
    let _ = stream.set_read_timeout(Some(Duration::from_millis(800)));
    let mut buffer = [0u8; 16];
    match stream.read(&mut buffer) {
        Ok(size) => buffer[..size].starts_with(ACK_MAGIC),
        Err(_) => false,
    }
}

/// 在首个实例中启动唤起监听线程：收到 ACTA_SHOW 即把主窗口带到前台。
pub fn spawn_show_listener(listener: TcpListener, app: tauri::AppHandle) {
    std::thread::spawn(move || {
        for stream in listener.incoming() {
            let Ok(mut stream) = stream else { continue };
            let mut buffer = [0u8; 64];
            let request = stream.read(&mut buffer).unwrap_or(0);
            if request == 0 || !buffer[..request].starts_with(SHOW_MAGIC) { continue; }
            let _ = stream.write_all(ACK_MAGIC);
            let _ = stream.flush();
            show_main_window(&app);
        }
    });
}

fn show_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}
