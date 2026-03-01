import { create } from 'zustand';
import type { MessageItem, SessionItem } from './types';

type SessionState = {
  sessions: SessionItem[];
  messages: MessageItem[];
  activeSessionId: string | null;
  setSessions: (sessions: SessionItem[]) => void;
  setMessages: (messages: MessageItem[]) => void;
  setActiveSessionId: (id: string | null) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  messages: [],
  activeSessionId: null,
  setSessions: (sessions) => set({ sessions }),
  setMessages: (messages) => set({ messages }),
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
}));
