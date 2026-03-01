import { useEffect, useState } from 'react';
import {
  fsList,
  fsRead,
  fsWrite,
  setFsMode,
  setWorkspaceRoot,
  type FsMode,
} from '../services/tools';
import { appendRunLog, loadRunLogs } from '../logs/runlog';
import { useToolStore } from '../stores/toolStore';

export default function ToolPanel() {
  const {
    workspaceRoot,
    mode,
    list,
    selectedPath,
    fileContent,
    output,
    setWorkspaceRoot: setRoot,
    setMode,
    setList,
    setSelectedPath,
    setFileContent,
    setOutput,
    setRunLogs,
  } = useToolStore();

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setRunLogs(loadRunLogs());
  }, [setRunLogs]);

  const run = async (action: string, input: Record<string, unknown>, fn: () => Promise<unknown>) => {
    setBusy(true);
    const t0 = Date.now();
    try {
      const output = await fn();
      setRunLogs(appendRunLog({
        id: `log_${Date.now()}`,
        at: new Date().toISOString(),
        action,
        input,
        output,
        status: 'ok',
        durationMs: Date.now() - t0,
      }));
    } catch (e) {
      const err = String(e);
      setOutput(err);
      setRunLogs(appendRunLog({
        id: `log_${Date.now()}`,
        at: new Date().toISOString(),
        action,
        input,
        status: 'error',
        error: err,
        durationMs: Date.now() - t0,
      }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section style={{ marginTop: 20, border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
      <h3 style={{ marginTop: 0 }}>Tool Runtime 控制台</h3>
      <p style={{ color: '#64748b', marginTop: 0 }}>设置 workspace、切换读写模式、验证文件工具通路。</p>

      <div style={{ display: 'grid', gap: 8 }}>
        <input
          value={workspaceRoot}
          onChange={(e) => setRoot(e.target.value)}
          placeholder="workspace root, 例如 /Users/.../ClaudeCoWork-Desktop"
          style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => run('fs_set_workspace_root', { root: workspaceRoot }, async () => { await setWorkspaceRoot(workspaceRoot); setOutput('workspace root 已设置'); return 'ok'; })} disabled={busy}>设置 Root</button>
          <button onClick={() => run('fs_set_mode', { current: mode }, async () => { const m: FsMode = mode === 'read_only' ? 'read_write' : 'read_only'; await setFsMode(m); setMode(m); setOutput(`mode => ${m}`); return m; })} disabled={busy}>
            切换模式（当前: {mode}）
          </button>
          <button onClick={() => run('fs_list', { relPath: '.' }, async () => { const items = await fsList('.'); setList(items); setOutput(`list ok: ${items.length} items`); return items.length; })} disabled={busy}>列目录</button>
          <button onClick={() => run('fs_read', { relPath: selectedPath }, async () => { const text = await fsRead(selectedPath); setFileContent(text); setOutput(`read ok: ${selectedPath}`); return text.slice(0, 80); })} disabled={busy}>读文件</button>
          <button onClick={() => run('fs_write', { relPath: selectedPath }, async () => { await fsWrite(selectedPath, fileContent); setOutput(`write ok: ${selectedPath}`); return 'ok'; })} disabled={busy}>写文件</button>
        </div>

        <input
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          placeholder="相对路径，如 docs/progress-log.md"
          style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}
        />

        <textarea
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
          placeholder="读取到的内容 / 要写入的内容"
          rows={10}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #475569', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>目录项：</strong>
        <ul>
          {list.slice(0, 20).map((item) => (
            <li key={item.path}>{item.is_dir ? '📁' : '📄'} {item.name}</li>
          ))}
        </ul>
      </div>

      <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: 10, borderRadius: 8, overflow: 'auto' }}>{output || '暂无输出'}</pre>
    </section>
  );
}
