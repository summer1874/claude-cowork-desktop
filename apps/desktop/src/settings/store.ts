import { create } from 'zustand';
import { DEFAULT_SETTINGS } from './storage';
import type { GlobalLlmSettings } from './types';

type SettingsState = GlobalLlmSettings & {
  setAll: (s: GlobalLlmSettings) => void;
  patch: (p: Partial<GlobalLlmSettings>) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_SETTINGS,
  setAll: (s) => set({ ...s }),
  patch: (p) => set((state) => ({ ...state, ...p })),
}));
