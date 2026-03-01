import { useEffect, useMemo, useState } from 'react';
import { appendRunLog } from '../logs/runlog';
import { setWorkspaceRoot } from '../services/tools';
import { useToolStore } from '../stores/toolStore';
import { loadWorkspaces, upsertWorkspace } from '../workspace/storage';
import { useWorkspaceStore } from '../workspace/store';
import type { WorkspaceItem } from '../workspace/types';

function nowIso() {
  return new Date().toISOString();
}

export default function WorkspacePanel() {
  const { items, activeId, setItems, setActiveId } = useWorkspaceStore();
  const setRunLogs = useToolStore((s) => s.setRunLogs);
  const setToolRoot = useToolStore((s) => s.setWorkspaceRoot);

  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setItems(loadWorkspaces());
  }, [setItems]);

  const active = useMemo(() => items.find((x) => x.id === activeId) || null, [items, activeId]);

  const addWorkspace = async () => {
    if (!path.trim()) return;
    const item: WorkspaceItem = {
      id: `ws_${Date.now()}`,
      name: name.trim() || path.split('/').filter(Boolean).pop() || 'workspace',
      path: path.trim(),
      lastOpenedAt: nowIso(),
    };
    const list = upsertWorkspace(item);
    setItems(list);
    setName('');
    setPath('');
  };

  const activate = async (item: WorkspaceItem) => {
    setBusy(true);
    const t0 = Date.now();
    try {
      await setWorkspaceRoot(item.path);
      setToolRoot(item.path);
      setActiveId(item.id);
      const next = upsertWorkspace({ ...item, lastOpenedAt: nowIso() });
      setItems(next);
      setRunLogs(
        appendRunLog({
          id: `log_${Date.now()}`,
          at: nowIso(),
          action: 'workspace_activate',
          input: { path: item.path },
          output: { id: item.id, name: item.name },
          status: 'ok',
          durationMs: Date.now() - t0,
        })
      );
    } catch (e) {
      setRunLogs(
        appendRunLog({
          id: `log_${Date.now()}`,
          at: nowIso(),
          action: 'workspace_activate',
          input: { path: item.path },
          status: 'error',
          error: String(e),
          durationMs: Date.now() - t0,
        })
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section style={{ marginTop: 20, border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
      <h3 style={{ marginTop: 0 }}>Workspace 管理</h3>
      <p style={{ color: '#64748b', marginTop: 0 }}>创建/切换项目目录，并联动 Tool Runtime 根路径。</p>

      <div style={{ display: 'grid', gap: 8 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="项目名（可选）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="项目路径（必填）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <button onClick={addWorkspace} disabled={busy} style={{ width: 140 }}>新增 Workspace</button>
      </div>

      {active && (
        <div style={{ marginTop: 10, color: '#22c55e' }}>
          当前 Workspace：{active.name} ({active.path})
        </div>
      )}

      <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: '1px solid #1e293b', borderRadius: 8, padding: 10, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>{item.path}</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>最近打开：{new Date(item.lastOpenedAt).toLocaleString()}</div>
            </div>
            <button onClick={() => activate(item)} disabled={busy}>{activeId === item.id ? '已激活' : '激活'}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
