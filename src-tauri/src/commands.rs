use tauri::{AppHandle, Manager, Theme, State};
use tauri::Wry;

#[cfg(feature = "devtools")]
use std::sync::Mutex;

#[cfg(feature = "devtools")]
pub struct DevtoolsState {
    pub open: Mutex<bool>,
}

#[tauri::command]
pub async fn set_window_theme(app_handle: AppHandle<Wry>, theme: String) -> Result<(), String> {
    let window_theme = match theme.as_str() {
        "dark" => Some(Theme::Dark),
        "light" => Some(Theme::Light),
        _ => return Err("Invalid theme".to_string()),
    };

    if let Some(window) = app_handle.get_webview_window("main") {
        window.set_theme(window_theme).map_err(|e| e.to_string())?;
    }

    Ok(())
}

// Devtools command is only available when the devtools feature is enabled
#[cfg(feature = "devtools")]
#[tauri::command]
pub fn toggle_devtools(app_handle: AppHandle<Wry>, state: State<DevtoolsState>) -> Result<(), String> {
    if let Some(window) = app_handle.get_webview_window("main") {
        let mut is_open = state.open.lock().unwrap();
        if *is_open {
            window.close_devtools();
            *is_open = false;
        } else {
            window.open_devtools();
            *is_open = true;
            // Set focus back to main window after a delay
            // This allows devtools to open but keeps keyboard focus on main window
            let window_clone = window.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(100));
                let _ = window_clone.set_focus();
            });
        }
        Ok(())
    } else {
        Err("Window not found".to_string())
    }
}

// Note: File operations are now handled on the frontend using Tauri plugins
// These commands are kept as a reference for future extensions
