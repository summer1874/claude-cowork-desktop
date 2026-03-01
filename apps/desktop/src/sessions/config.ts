export type SessionConfig = {
  sessionId: string;
  baseUrl?: string;
  modelName?: string;
  apiKey?: string;
};

const KEY = 'cowork_session_configs_v1';

export function loadSessionConfigs(): SessionConfig[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveSessionConfigs(items: SessionConfig[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function upsertSessionConfig(item: SessionConfig) {
  const list = loadSessionConfigs();
  const next = [item, ...list.filter((x) => x.sessionId !== item.sessionId)].slice(0, 200);
  saveSessionConfigs(next);
  return next;
}

export function getSessionConfig(sessionId: string): SessionConfig | null {
  return loadSessionConfigs().find((x) => x.sessionId === sessionId) || null;
}
