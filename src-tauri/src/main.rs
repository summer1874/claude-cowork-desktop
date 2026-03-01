mod commands;

use tracing_subscriber::{fmt, EnvFilter};

fn init_logging() {
  let _ = fmt()
    .with_env_filter(EnvFilter::from_default_env())
    .try_init();
}

fn main() {
  init_logging();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![commands::app_health])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
