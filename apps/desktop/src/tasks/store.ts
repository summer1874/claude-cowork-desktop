import { create } from 'zustand';
import type { TaskItem } from './types';

type TaskState = {
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
