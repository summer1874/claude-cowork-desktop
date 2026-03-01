import { useEffect } from 'react';
import { appendRunLog } from '../logs/runlog';
import { useToolStore } from '../stores/toolStore';
import { loadGlobalSettings, saveGlobalSettings } from '../settings/storage';
import { useSettingsStore } from '../settings/store';

export default function SettingsPanel() {
  const setRunLogs = useToolStore((s) => s.setRunLogs);
  const settings = useSettingsStore();

  useEffect(() => {
    settings.setAll(loadGlobalSettings());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    const payload = {
      defaultModelType: settings.defaultModelType,
      defaultBaseUrl: settings.defaultBaseUrl,
      defaultModelName: settings.defaultModelName,
      defaultApiKey: settings.defaultApiKey,
      companyPath: settings.companyPath,
      companyAuthType: settings.companyAuthType,
      companyExtraHeadersText: settings.companyExtraHeadersText,
    };
    saveGlobalSettings(payload);
    setRunLogs(
      appendRunLog({
        id: `log_${Date.now()}`,
        at: new Date().toISOString(),
        action: 'settings_save_global_llm',
        input: { defaultModelType: payload.defaultModelType },
        output: { ok: true },
        status: 'ok',
        durationMs: 1,
      })
    );
  };

  return (
    <section style={{ marginTop: 20, border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
      <h3 style={{ marginTop: 0 }}>全局设置（LLM Defaults）</h3>
      <p style={{ color: '#64748b', marginTop: 0 }}>会话创建时可继承这些默认值，减少重复配置。</p>

      <div style={{ display: 'grid', gap: 8 }}>
        <select value={settings.defaultModelType} onChange={(e) => settings.patch({ defaultModelType: e.target.value as any })} style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }}>
          <option value="openai_compatible">openai_compatible</option>
          <option value="ollama">ollama</option>
          <option value="company_gateway">company_gateway</option>
        </select>
        <input value={settings.defaultBaseUrl} onChange={(e) => settings.patch({ defaultBaseUrl: e.target.value })} placeholder="默认 Base URL" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <input value={settings.defaultModelName} onChange={(e) => settings.patch({ defaultModelName: e.target.value })} placeholder="默认 Model 名" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <input value={settings.defaultApiKey} onChange={(e) => settings.patch({ defaultApiKey: e.target.value })} placeholder="默认 API Key" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />

        <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>Company Gateway 预留全局字段</div>
        <input value={settings.companyPath} onChange={(e) => settings.patch({ companyPath: e.target.value })} placeholder="company path" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <input value={settings.companyAuthType} onChange={(e) => settings.patch({ companyAuthType: e.target.value })} placeholder="company auth type" style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />
        <textarea value={settings.companyExtraHeadersText} onChange={(e) => settings.patch({ companyExtraHeadersText: e.target.value })} placeholder="company extra headers json" rows={3} style={{ padding: 10, borderRadius: 8, border: '1px solid #475569' }} />

        <button onClick={save} style={{ width: 120 }}>保存全局设置</button>
      </div>
    </section>
  );
}
