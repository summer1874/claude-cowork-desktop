import { useEffect, useMemo, useState } from 'react';
import { appendRunLog } from '../logs/runlog';
import { useToolStore } from '../stores/toolStore';
import { updateTaskStatus, loadTasks, upsertTask } from '../tasks/storage';
import { useTaskStore } from '../tasks/store';
import type { TaskPriority, TaskStatus } from '../tasks/types';
import { useWorkspaceStore } from '../workspace/store';

const COLUMNS: { key: TaskStatus; title: string }[] = [
  { key: 'todo', title: '待办' },
  { key: 'in_progress', title: '进行中' },
  { key: 'done', title: '已完成' },
];

export default function TaskBoard() {
  const { tasks, setTasks } = useTaskStore();
  const { activeId } = useWorkspaceStore();
  const setRunLogs = useToolStore((s) => s.setRunLogs);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  useEffect(() => {
    setTasks(loadTasks());
  }, [setTasks]);

  const filtered = useMemo(
    () => (activeId ? tasks.filter((t) => t.workspaceId === activeId) : []),
    [tasks, activeId]
  );

  const createTask = () => {
    if (!activeId) return;
    if (!title.trim()) return;

    const now = new Date().toISOString();
    const task = {
      id: `task_${Date.now()}`,
      workspaceId: activeId,
      title: title.trim(),
      description: description.trim(),
      status: 'todo' as TaskStatus,
      priority,
      createdAt: now,
      updatedAt: now,
    };

    const next = upsertTask(task);
    setTasks(next);
    setTitle('');
    setDescription('');

    setRunLogs(
      appendRunLog({
        id: `log_${Date.now()}`,
        at: now,
        action: 'task_create',
        input: { title: task.title, priority: task.priority },
        output: { id: task.id },
        status: 'ok',
        durationMs: 1,
      })
    );
  };

  const moveTask = (taskId: string, status: TaskStatus) => {
    const next = updateTaskStatus(taskId, status);
    setTasks(next);
    setRunLogs(
      appendRunLog({
        id: `log_${Date.now()}`,
        at: new Date().toISOString(),
        action: 'task_update_status',
        input: { taskId, status },
        output: { ok: true },
        status: 'ok',
        durationMs: 1,
      })
    );
  };

  return (
    <section style={{ marginTop: 20, border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
      <h3 style={{ marginTop: 0 }}>Task Board</h3>
      <p style={{ color: '#64748b', marginTop: 0 }}>
        当前按激活 workspace 展示任务（todo / in_progress / done）。
      </p>

      {!activeId && (
        <div style={{ color: '#f59e0b', marginBottom: 8 }}>请先在 Workspace 面板激活一个项目。</div>
      )}

      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="任务标题"
          style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="任务描述（可选）"
          style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button onClick={createTask} disabled={!activeId}>创建任务</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        {COLUMNS.map((col) => (
          <div key={col.key} style={{ border: '1px solid #1e293b', borderRadius: 8, padding: 10, minHeight: 140 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{col.title}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {filtered
                .filter((t) => t.status === col.key)
                .map((t) => (
                  <div key={t.id} style={{ border: '1px solid #334155', borderRadius: 8, padding: 8 }}>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>{t.description || '无描述'}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>priority: {t.priority}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      {COLUMNS.filter((x) => x.key !== t.status).map((x) => (
                        <button key={x.key} onClick={() => moveTask(t.id, x.key)} style={{ fontSize: 12 }}>
                          {'→'} {x.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
