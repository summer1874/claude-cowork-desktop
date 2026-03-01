import type { MessageItem, SessionItem } from './types';

const SKEY = 'cowork_sessions_v1';
const MKEY = 'cowork_messages_v1';

export function loadSessions(): SessionItem[] {
  try {
    const raw = localStorage.getItem(SKEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveSessions(items: SessionItem[]) {
  localStorage.setItem(SKEY, JSON.stringify(items));
}

export function upsertSession(item: SessionItem) {
  const list = loadSessions();
  const next = [item, ...list.filter((x) => x.id !== item.id)];
  saveSessions(next);
  return next;
}

export function loadMessages(): MessageItem[] {
  try {
    const raw = localStorage.getItem(MKEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveMessages(items: MessageItem[]) {
  localStorage.setItem(MKEY, JSON.stringify(items));
}

export function addMessage(msg: MessageItem) {
  const list = loadMessages();
  const next = [...list, msg].slice(-5000);
  saveMessages(next);
  return next;
}
