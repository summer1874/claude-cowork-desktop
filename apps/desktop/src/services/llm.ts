export type ProviderType = 'open_ai_compatible' | 'ollama' | 'company_gateway';

export type ProviderConfig = {
  provider: ProviderType;
  base_url: string;
  model?: string;
  path?: string;
  auth_type?: string;
  auth_value?: string;
  extra_headers?: [string, string][];
};

export type ChatRequest = {
  prompt: string;
};

export type ChatResponse = {
  content: string;
  provider: ProviderType;
};

const WEB_STUB: ChatResponse = {
  content: '（web-dev）当前非 Tauri 环境，返回本地占位回复。',
  provider: 'open_ai_compatible',
};

function isTauri() {
  return Boolean((window as any).__TAURI_INTERNALS__);
}

function mapProvider(model: string): ProviderType {
  if (model === 'ollama') return 'ollama';
  if (model === 'company_gateway') return 'company_gateway';
  return 'open_ai_compatible';
}

export async function llmChat(input: {
  modelType: string;
  prompt: string;
  baseUrl?: string;
  modelName?: string;
  apiKey?: string;
}): Promise<ChatResponse> {
  if (!isTauri()) return WEB_STUB;

  const { invoke } = await import('@tauri-apps/api/core');

  const provider = mapProvider(input.modelType);
  const config: ProviderConfig = {
    provider,
    base_url:
      input.baseUrl ||
      (provider === 'ollama' ? 'http://localhost:11434' : 'https://api.openai.com'),
    model: input.modelName || (provider === 'ollama' ? 'qwen2.5:latest' : 'gpt-4o-mini'),
    auth_type: provider === 'open_ai_compatible' ? 'bearer' : undefined,
    auth_value: input.apiKey,
  };

  return invoke<ChatResponse>('llm_chat', {
    config,
    request: { prompt: input.prompt },
  });
}
