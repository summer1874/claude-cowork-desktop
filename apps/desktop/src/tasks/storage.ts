import type { TaskItem, TaskStatus } from './types';

const KEY = 'cowork_tasks_v1';

export function loadTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: TaskItem[]) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

export function upsertTask(task: TaskItem) {
  const tasks = loadTasks();
  const next = [task, ...tasks.filter((t) => t.id !== task.id)];
  saveTasks(next);
  return next;
}

export function updateTaskStatus(taskId: string, status: TaskStatus) {
  const tasks = loadTasks();
  const next = tasks.map((t) =>
    t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
  );
  saveTasks(next);
  return next;
}
