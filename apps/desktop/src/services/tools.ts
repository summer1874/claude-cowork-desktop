import type { AppHealth } from './tauri';

export type FsMode = 'read_only' | 'read_write';

export type FsListItem = {
  name: string;
  path: string;
  is_dir: boolean;
};

export type FsStat = {
  path: string;
  is_dir: boolean;
  len: number;
};

async function invokeTauri<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<T>(cmd, args);
}

function isTauri() {
  return Boolean((window as any).__TAURI_INTERNALS__);
}

export async function setWorkspaceRoot(root: string): Promise<void> {
  if (!isTauri()) return;
  await invokeTauri('fs_set_workspace_root', { root });
}

export async function setFsMode(mode: FsMode): Promise<void> {
  if (!isTauri()) return;
  await invokeTauri('fs_set_mode', { mode });
}

export async function fsList(relPath = '.'): Promise<FsListItem[]> {
  if (!isTauri()) return [];
  return invokeTauri<FsListItem[]>('fs_list', { relPath });
}

export async function fsRead(relPath: string): Promise<string> {
  if (!isTauri()) return '[web-dev] fs_read unavailable';
  return invokeTauri<string>('fs_read', { relPath });
}

export async function fsWrite(relPath: string, content: string): Promise<void> {
  if (!isTauri()) return;
  await invokeTauri('fs_write', { relPath, content });
}

export async function fsStat(relPath: string): Promise<FsStat> {
  if (!isTauri()) return { path: relPath, is_dir: false, len: 0 };
  return invokeTauri<FsStat>('fs_stat', { relPath });
}

export async function healthFallback(): Promise<AppHealth> {
  if (!isTauri()) return { version: 'web-dev', ok: true };
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<AppHealth>('app_health');
}
