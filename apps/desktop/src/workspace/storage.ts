import type { WorkspaceItem } from './types';

const KEY = 'cowork_workspaces_v1';

export function loadWorkspaces(): WorkspaceItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveWorkspaces(items: WorkspaceItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function upsertWorkspace(item: WorkspaceItem) {
  const list = loadWorkspaces();
  const next = [item, ...list.filter((x) => x.path !== item.path)].slice(0, 20);
  saveWorkspaces(next);
  return next;
}
