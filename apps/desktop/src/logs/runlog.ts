export type RunLogStatus = 'ok' | 'error';

export type RunLogEntry = {
  id: string;
  at: string;
  action: string;
  input?: Record<string, unknown>;
  output?: unknown;
  status: RunLogStatus;
  error?: string;
  durationMs: number;
};

const KEY = 'cowork_runlog_v1';

export function loadRunLogs(): RunLogEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveRunLogs(logs: RunLogEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(logs.slice(0, 500)));
}

export function appendRunLog(entry: RunLogEntry) {
  const logs = loadRunLogs();
  logs.unshift(entry);
  saveRunLogs(logs);
  return logs;
}
