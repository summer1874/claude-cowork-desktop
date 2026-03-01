use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
  pub version: &'static str,
  pub ok: bool,
}

#[tauri::command]
pub fn app_health() -> HealthResponse {
  HealthResponse {
    version: "v0.1",
    ok: true,
  }
}
