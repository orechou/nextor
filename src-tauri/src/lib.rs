// Modules
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            commands::set_window_theme,
        ]);

    // Only add devtools support when the feature is enabled
    #[cfg(feature = "devtools")]
    let builder = {
        use tauri::State;
        builder
            .manage(commands::DevtoolsState { open: std::sync::Mutex::new(false) })
            .invoke_handler(tauri::generate_handler![
                commands::set_window_theme,
                commands::toggle_devtools,
            ])
    };

    builder.run(tauri::generate_context!())
        .expect("error while running tauri application")
}
