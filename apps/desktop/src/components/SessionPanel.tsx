import { useEffect, useMemo, useState } from 'react';
import { appendRunLog } from '../logs/runlog';
import { llmChat } from '../services/llm';
import { useSessionStore } from '../sessions/store';
import { getSessionConfig, loadSessionConfigs, upsertSessionConfig } from '../sessions/config';
import { loadGlobalSettings } from '../settings/storage';
import { addMessage, loadMessages, loadSessions, upsertSession } from '../sessions/storage';
import type { MessageItem, SessionItem } from '../sessions/types';
import { useTaskStore } from '../tasks/store';
import { useToolStore } from '../stores/toolStore';
import { useWorkspaceStore } from '../workspace/store';

function friendlyErr(e: unknown) {
  const text = String(e || 'unknown error');
  if (text.includes('401') || text.toLowerCase().includes('unauthorized')) return '鉴权失败（401），请检查 API Key';
  if (text.toLowerCase().includes('timed out') || text.toLowerCase().includes('timeout')) return '请求超时，请检查网络或后端可用性';
  if (text.toLowerCase().includes('failed to fetch') || text.toLowerCase().includes('connection')) return '连接失败，请检查 Base URL 与服务状态';
  return text;
}

export default function SessionPanel() {
  const { activeId: workspaceId } = useWorkspaceStore();
  const { tasks } = useTaskStore();
  const { setRunLogs } = useToolStore();

  const {
    sessions,
    messages,
    activeSessionId,
    setSessions,
    setMessages,
    setActiveSessionId,
  } = useSessionStore();

  const [title, setTitle] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [model, setModel] = useState('openai_compatible');
  const [baseUrl, setBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [apiKey, setApiKey] = useState('');

  // company_gateway 预留配置
  const [path, setPath] = useState('/v1/chat/completions');
  const [authType, setAuthType] = useState('bearer');
  const [extraHeadersText, setExtraHeadersText] = useState('');

  const [input, setInput] = useState('');

  useEffect(() => {
    setSessions(loadSessions());
    setMessages(loadMessages());
    loadSessionConfigs();

    const gs = loadGlobalSettings();
    setModel(gs.defaultModelType);
    setBaseUrl(gs.defaultBaseUrl || '');
    setModelName(gs.defaultModelName || '');
    setApiKey(gs.defaultApiKey || '');
    setPath(gs.companyPath || '/v1/chat/completions');
    setAuthType(gs.companyAuthType || 'bearer');
    setExtraHeadersText(gs.companyExtraHeadersText || '');
  }, [setSessions, setMessages]);

  useEffect(() => {
    if (!activeSessionId) return;
    const cfg = getSessionConfig(activeSessionId);
    if (!cfg) return;
    setBaseUrl(cfg.baseUrl || '');
    setModelName(cfg.modelName || '');
    setApiKey(cfg.apiKey || '');
    setPath(cfg.path || '/v1/chat/completions');
    setAuthType(cfg.authType || 'bearer');
    setExtraHeadersText(cfg.extraHeadersText || '');
  }, [activeSessionId]);

  const scopedSessions = useMemo(() => {
    if (!workspaceId) return [];
    let arr = sessions.filter((s) => s.workspaceId === workspaceId);
    if (taskFilter !== 'all') {
      arr = arr.filter((s) => (s.taskId || '') === taskFilter);
    }
    return arr;
  }, [sessions, workspaceId, taskFilter]);

  const activeSession = useMemo(
    () => scopedSessions.find((s) => s.id === activeSessionId) || null,
    [scopedSessions, activeSessionId]
  );

  const activeMessages = useMemo(
    () => (activeSessionId ? messages.filter((m) => m.sessionId === activeSessionId) : []),
    [messages, activeSessionId]
  );

  const persistCfg = (sessionId: string) => {
    upsertSessionConfig({
      sessionId,
      baseUrl,
      modelName,
      apiKey,
      path,
      authType,
      extraHeadersText,
    });
  };

  const createSession = () => {
    if (!workspaceId) return;
    const now = new Date().toISOString();
    const s: SessionItem = {
      id: `sess_${Date.now()}`,
      workspaceId,
      taskId: taskId || undefined,
      title: title.trim() || `Session ${sessions.filter((x) => x.workspaceId === workspaceId).length + 1}`,
      model,
      createdAt: now,
      updatedAt: now,
    };
    const next = upsertSession(s);
    setSessions(next);
    setActiveSessionId(s.id);
    setTitle('');
    setTaskId('');
    persistCfg(s.id);

    setRunLogs(
      appendRunLog({
        id: `log_${Date.now()}`,
        at: now,
        action: 'session_create',
        input: { title: s.title, taskId: s.taskId, model: s.model },
        output: { sessionId: s.id },
        status: 'ok',
        durationMs: 1,
      })
    );
  };

  const testConnection = async () => {
    if (!activeSessionId) return;
    const t0 = Date.now();
    try {
      const resp = await llmChat({
        modelType: model,
        prompt: 'ping',
        baseUrl,
        modelName,
        apiKey,
      });
      setRunLogs(
        appendRunLog({
          id: `log_${Date.now()}`,
          at: new Date().toISOString(),
          action: 'llm_test_connection',
          input: { model, baseUrl, modelName },
          output: { provider: resp.provider },
          status: 'ok',
          durationMs: Date.now() - t0,
        })
      );
    } catch (e) {
      setRunLogs(
        appendRunLog({
          id: `log_${Date.now()}`,
          at: new Date().toISOString(),
          action: 'llm_test_connection',
          input: { model, baseUrl, modelName },
          status: 'error',
          error: friendlyErr(e),
          durationMs: Date.now() - t0,
        })
      );
    }
  };

  const sendMessage = async () => {
    if (!activeSessionId) return;
    if (!input.trim()) return;
    const now = new Date().toISOString();
    const t0 = Date.now();

    const userMsg: MessageItem = {
      id: `msg_${Date.now()}`,
      sessionId: activeSessionId,
      role: 'user',
      content: input.trim(),
      createdAt: now,
    };

    let next = addMessage(userMsg);
    setMessages(next);
    const prompt = input.trim();
    setInput('');
    persistCfg(activeSessionId);

    try {
      const resp = await llmChat({
        modelType: model,
        prompt,
        baseUrl,
        modelName,
        apiKey,
      });

      const assistantMsg: MessageItem = {
        id: `msg_${Date.now() + 1}`,
        sessionId: activeSessionId,
        role: 'assistant',
        content: resp.content,
        createdAt: new Date().toISOString(),
      };

      next = addMessage(assistantMsg);
      setMessages(next);

      setRunLogs(
        appendRunLog({
          id: `log_${Date.now()}`,
          at: new Date().toISOString(),
          action: 'session_send_message',
          input: { sessionId: activeSessionId, model, prompt: prompt.slice(0, 120) },
          output: { provider: resp.provider },
          status: 'ok',
          durationMs: Date.now() - t0,
        })
      );
    } catch (e) {
      const errText = friendlyErr(e);
      const assistantMsg: MessageItem = {
        id: `msg_${Date.now() + 1}`,
        sessionId: activeSessionId,
        role: 'assistant',
        content: `调用失败：${errText}`,
        createdAt: new Date().toISOString(),
      };
      next = addMessage(assistantMsg);
      setMessages(next);

      setRunLogs(
        appendRunLog({
          id: `log_${Date.now()}`,
          at: new Date().toISOString(),
          action: 'session_send_message',
          input: { sessionId: activeSessionId, model, prompt: prompt.slice(0, 120) },
          status: 'error',
          error: errText,
          durationMs: Date.now() - t0,
        })
      );
    }
  };

  return (
    <section style={{ marginTop: 20, border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
      <h3 style={{ marginTop: 0 }}>Session 协作区（v0）</h3>
      <p style={{ color: '#64748b', marginTop: 0 }}>多会话 tab + 消息持久化 + 任务绑定（真实 llm_chat）。</p>

      {!workspaceId && <div style={{ color: '#f59e0b' }}>请先激活 workspace。</div>}

      <div style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="会话标题（可选）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={taskId} onChange={(e) => setTaskId(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}>
            <option value="">不绑定任务</option>
            {tasks.filter((t) => t.workspaceId === workspaceId).map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}>
            <option value="openai_compatible">openai_compatible</option>
            <option value="ollama">ollama</option>
            <option value="company_gateway">company_gateway</option>
          </select>
          <button onClick={createSession} disabled={!workspaceId}>新建会话</button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}>
            <option value="all">全部任务会话</option>
            {tasks.filter((t) => t.workspaceId === workspaceId).map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="Base URL（可选，默认按 provider）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Model（可选，如 gpt-4o-mini / qwen2.5:latest）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API Key（openai_compatible/company_gateway 可填）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />

        {model === 'company_gateway' && (
          <div style={{ display: 'grid', gap: 8, border: '1px dashed #334155', borderRadius: 8, padding: 10 }}>
            <div style={{ color: '#94a3b8', fontSize: 12 }}>Company Gateway 预留配置（暂不实现请求映射）</div>
            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="Path（如 /v1/chat/completions）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
            <input value={authType} onChange={(e) => setAuthType(e.target.value)} placeholder="Auth Type（bearer/api_key/custom）" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
            <textarea value={extraHeadersText} onChange={(e) => setExtraHeadersText(e.target.value)} placeholder="Extra Headers（JSON 文本，预留）" rows={3} style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {scopedSessions.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSessionId(s.id)}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #334155',
              background: activeSessionId === s.id ? '#1d4ed8' : '#0f172a',
              color: '#e2e8f0',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {activeSession ? (
        <>
          <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>
            当前会话：{activeSession.title} | model: {activeSession.model} | task: {activeSession.taskId || '无'}
          </div>

          <div style={{ border: '1px solid #1e293b', borderRadius: 8, padding: 10, minHeight: 120, maxHeight: 260, overflow: 'auto', marginBottom: 8 }}>
            {activeMessages.map((m) => (
              <div key={m.id} style={{ marginBottom: 8 }}>
                <strong style={{ color: m.role === 'user' ? '#38bdf8' : '#22c55e' }}>{m.role}:</strong>{' '}
                <span>{m.content}</span>
              </div>
            ))}
            {activeMessages.length === 0 && <div style={{ color: '#64748b' }}>暂无消息</div>}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入消息..."
              style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #475569' }}
            />
            <button onClick={testConnection}>测试连接</button>
            <button onClick={sendMessage}>发送</button>
          </div>
        </>
      ) : (
        <div style={{ color: '#64748b' }}>请选择或创建一个会话</div>
      )}
    </section>
  );
}
