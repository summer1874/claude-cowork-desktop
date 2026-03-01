import type { GlobalLlmSettings } from './types';

const KEY = 'cowork_global_llm_settings_v1';

export const DEFAULT_SETTINGS: GlobalLlmSettings = {
  defaultModelType: 'openai_compatible',
  defaultBaseUrl: '',
  defaultModelName: '',
  defaultApiKey: '',
  companyPath: '/v1/chat/completions',
  companyAuthType: 'bearer',
  companyExtraHeadersText: '',
};

export function loadGlobalSettings(): GlobalLlmSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const data = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveGlobalSettings(settings: GlobalLlmSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
