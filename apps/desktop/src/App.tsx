import { useState } from 'react';
import RunLogPanel from './components/RunLogPanel';
import SessionPanel from './components/SessionPanel';
import TaskBoard from './components/TaskBoard';
import ToolPanel from './components/ToolPanel';
import WorkspacePanel from './components/WorkspacePanel';
import { getAppHealth, type AppHealth } from './services/tauri';

export default function App() {
  const [health, setHealth] = useState<AppHealth | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const data = await getAppHealth();
      setHealth(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>ClaudeCoWork Desktop</h1>
      <p>Sprint 1 起步：Tauri command 通路验证 + Tool Runtime 面板。</p>

      <button
        onClick={checkHealth}
        disabled={loading}
        style={{
          border: 0,
          background: '#2563eb',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        {loading ? '检查中...' : '检查 App Health'}
      </button>

      {health && (
        <pre
          style={{
            marginTop: 12,
            background: '#0f172a',
            color: '#e2e8f0',
            padding: 12,
            borderRadius: 8,
            overflow: 'auto',
          }}
        >
{JSON.stringify(health, null, 2)}
        </pre>
      )}

      <WorkspacePanel />
      <TaskBoard />
      <SessionPanel />
      <ToolPanel />
      <RunLogPanel />
    </main>
  );
}
