import { useMemo } from 'react';
import { useToolStore } from '../stores/toolStore';

export default function RunLogPanel() {
  const logs = useToolStore((s) => s.runLogs);

  const view = useMemo(() => logs.slice(0, 30), [logs]);

  return (
    <section style={{ marginTop: 20, border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
      <h3 style={{ marginTop: 0 }}>Run Logs（最近 30 条）</h3>
      <p style={{ color: '#64748b', marginTop: 0 }}>工具调用审计日志（本地持久化）。</p>

      <div style={{ display: 'grid', gap: 8 }}>
        {view.length === 0 && <div style={{ color: '#94a3b8' }}>暂无日志</div>}
        {view.map((l) => (
          <div key={l.id} style={{ border: '1px solid #1e293b', borderRadius: 8, padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <strong>{l.action}</strong>
              <span style={{ color: l.status === 'ok' ? '#22c55e' : '#ef4444' }}>{l.status}</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12 }}>{new Date(l.at).toLocaleString()} · {l.durationMs}ms</div>
            {l.error && <pre style={{ whiteSpace: 'pre-wrap', color: '#fda4af' }}>{l.error}</pre>}
          </div>
        ))}
      </div>
    </section>
  );
}
