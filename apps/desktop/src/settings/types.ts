export type GlobalLlmSettings = {
  defaultModelType: 'openai_compatible' | 'ollama' | 'company_gateway';
  defaultBaseUrl: string;
  defaultModelName: string;
  defaultApiKey: string;
  companyPath: string;
  companyAuthType: string;
  companyExtraHeadersText: string;
};
