use std::fs;
use std::path::{Path, PathBuf};

use crate::tools::state::ToolState;
use crate::tools::types::{FsListItem, FsMode, FsStat};

fn ensure_in_workspace(root: &Path, target: &Path) -> Result<(), String> {
    let root = root
        .canonicalize()
        .map_err(|e| format!("workspace root invalid: {e}"))?;
    let target = target
        .canonicalize()
        .map_err(|e| format!("target invalid: {e}"))?;

    if target.starts_with(&root) {
        Ok(())
    } else {
        Err("path out of workspace boundary".to_string())
    }
}

fn resolve_path(root: &str, rel: &str) -> PathBuf {
    Path::new(root).join(rel)
}

#[tauri::command]
pub fn fs_set_workspace_root(state: tauri::State<ToolState>, root: String) -> Result<(), String> {
    let p = Path::new(&root);
    if !p.exists() || !p.is_dir() {
        return Err("workspace root does not exist or is not a directory".to_string());
    }
    let mut guard = state.workspace_root.lock().map_err(|_| "lock error")?;
    *guard = Some(root);
    Ok(())
}

#[tauri::command]
pub fn fs_set_mode(state: tauri::State<ToolState>, mode: FsMode) -> Result<(), String> {
    let mut guard = state.mode.lock().map_err(|_| "lock error")?;
    *guard = mode;
    Ok(())
}

#[tauri::command]
pub fn fs_list(state: tauri::State<ToolState>, rel_path: String) -> Result<Vec<FsListItem>, String> {
    let root = state
        .workspace_root
        .lock()
        .map_err(|_| "lock error")?
        .clone()
        .ok_or("workspace root not set")?;

    let target = resolve_path(&root, &rel_path);
    ensure_in_workspace(Path::new(&root), &target)?;

    let mut out = Vec::new();
    for entry in fs::read_dir(&target).map_err(|e| e.to_string())? {
        let e = entry.map_err(|e| e.to_string())?;
        let md = e.metadata().map_err(|e| e.to_string())?;
        out.push(FsListItem {
            name: e.file_name().to_string_lossy().to_string(),
            path: e.path().to_string_lossy().to_string(),
            is_dir: md.is_dir(),
        });
    }
    Ok(out)
}

#[tauri::command]
pub fn fs_read(state: tauri::State<ToolState>, rel_path: String) -> Result<String, String> {
    let root = state
        .workspace_root
        .lock()
        .map_err(|_| "lock error")?
        .clone()
        .ok_or("workspace root not set")?;

    let target = resolve_path(&root, &rel_path);
    ensure_in_workspace(Path::new(&root), &target)?;
    fs::read_to_string(&target).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_stat(state: tauri::State<ToolState>, rel_path: String) -> Result<FsStat, String> {
    let root = state
        .workspace_root
        .lock()
        .map_err(|_| "lock error")?
        .clone()
        .ok_or("workspace root not set")?;

    let target = resolve_path(&root, &rel_path);
    ensure_in_workspace(Path::new(&root), &target)?;
    let md = fs::metadata(&target).map_err(|e| e.to_string())?;
    Ok(FsStat {
        path: target.to_string_lossy().to_string(),
        is_dir: md.is_dir(),
        len: md.len(),
    })
}

#[tauri::command]
pub fn fs_write(state: tauri::State<ToolState>, rel_path: String, content: String) -> Result<(), String> {
    let root = state
        .workspace_root
        .lock()
        .map_err(|_| "lock error")?
        .clone()
        .ok_or("workspace root not set")?;

    let mode = state.mode.lock().map_err(|_| "lock error")?.clone();
    if !matches!(mode, FsMode::ReadWrite) {
        return Err("fs_write denied: current mode is readonly".to_string());
    }

    let target = resolve_path(&root, &rel_path);
    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    // For new files, canonicalize may fail before creation, so check parent boundary.
    let parent = target.parent().ok_or("invalid target path")?;
    ensure_in_workspace(Path::new(&root), parent)?;

    fs::write(&target, content).map_err(|e| e.to_string())
}
