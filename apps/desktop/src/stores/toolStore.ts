import { create } from 'zustand';
import type { FsMode, FsListItem } from '../services/tools';

type ToolState = {
  workspaceRoot: string;
  mode: FsMode;
  list: FsListItem[];
  selectedPath: string;
  fileContent: string;
  output: string;
  setWorkspaceRoot: (v: string) => void;
  setMode: (v: FsMode) => void;
  setList: (v: FsListItem[]) => void;
  setSelectedPath: (v: string) => void;
  setFileContent: (v: string) => void;
  setOutput: (v: string) => void;
};

export const useToolStore = create<ToolState>((set) => ({
  workspaceRoot: '',
  mode: 'read_only',
  list: [],
  selectedPath: 'README.md',
  fileContent: '',
  output: '',
  setWorkspaceRoot: (workspaceRoot) => set({ workspaceRoot }),
  setMode: (mode) => set({ mode }),
  setList: (list) => set({ list }),
  setSelectedPath: (selectedPath) => set({ selectedPath }),
  setFileContent: (fileContent) => set({ fileContent }),
  setOutput: (output) => set({ output }),
}));
