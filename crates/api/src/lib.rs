use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiHealth {
    pub ok: bool,
}

pub fn health() -> ApiHealth {
    ApiHealth { ok: true }
}
