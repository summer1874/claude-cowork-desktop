import { create } from 'zustand';
import type { WorkspaceItem } from './types';

type WorkspaceState = {
  items: WorkspaceItem[];
  activeId: string | null;
  setItems: (items: WorkspaceItem[]) => void;
  setActiveId: (id: string | null) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  items: [],
  activeId: null,
  setItems: (items) => set({ items }),
  setActiveId: (activeId) => set({ activeId }),
}));
