use std::sync::Mutex;

use crate::tools::types::FsMode;

#[derive(Debug)]
pub struct ToolState {
    pub workspace_root: Mutex<Option<String>>,
    pub mode: Mutex<FsMode>,
}

impl Default for ToolState {
    fn default() -> Self {
        Self {
            workspace_root: Mutex::new(None),
            mode: Mutex::new(FsMode::ReadOnly),
        }
    }
}
