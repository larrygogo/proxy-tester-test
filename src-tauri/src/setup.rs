use tauri::{App, Manager};

/// setup
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let window = app.get_window("main").unwrap();

    // 仅在 macOS 下执行
    #[cfg(target_os = "macos")]
    window_vibrancy::apply_vibrancy(
        &window,
        window_vibrancy::NSVisualEffectMaterial::HudWindow,
        Option::from(window_vibrancy::NSVisualEffectState::Active),
        None
    ).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
    // 设置 titleBarStyle

    // 仅在 windows 下执行
    #[cfg(target_os = "windows")]
    // window_vibrancy::apply_blur(&window, Some((18, 18, 18, 125)))
    //     .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
    Ok(())
}
