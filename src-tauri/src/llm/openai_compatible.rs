use reqwest::blocking::Client;
use serde_json::json;

use crate::llm::provider::ModelProvider;
use crate::llm::types::{ChatRequest, ChatResponse, ProviderConfig, ProviderHealth, ProviderType};

pub struct OpenAiCompatibleProvider;

impl ModelProvider for OpenAiCompatibleProvider {
    fn test_connection(&self, config: &ProviderConfig) -> ProviderHealth {
        let model = config
            .model
            .clone()
            .unwrap_or_else(|| "gpt-4o-mini".to_string());
        let req = ChatRequest {
            prompt: "ping".to_string(),
        };
        match self.chat(config, &req) {
            ChatResponse { .. } => ProviderHealth {
                ok: true,
                provider: ProviderType::OpenAiCompatible,
                message: format!("openai_compatible ok (model: {model})"),
            },
        }
    }

    fn chat(&self, config: &ProviderConfig, request: &ChatRequest) -> ChatResponse {
        let base = config.base_url.trim_end_matches('/');
        let path = config
            .path
            .clone()
            .unwrap_or_else(|| "/v1/chat/completions".to_string());
        let url = format!("{}{}", base, path);
        let model = config
            .model
            .clone()
            .unwrap_or_else(|| "gpt-4o-mini".to_string());

        let client = Client::new();
        let mut reqb = client.post(url).json(&json!({
            "model": model,
            "messages": [
                {"role": "user", "content": request.prompt}
            ],
            "temperature": 0.2
        }));

        if let Some(token) = &config.auth_value {
            if !token.trim().is_empty() {
                reqb = reqb.bearer_auth(token);
            }
        }

        let resp = reqb.send();
        match resp {
            Ok(r) => {
                let v: serde_json::Value = r.json().unwrap_or_else(|_| json!({}));
                let content = v
                    .get("choices")
                    .and_then(|x| x.get(0))
                    .and_then(|x| x.get("message"))
                    .and_then(|x| x.get("content"))
                    .and_then(|x| x.as_str())
                    .unwrap_or("[openai_compatible] empty response")
                    .to_string();
                ChatResponse {
                    content,
                    provider: ProviderType::OpenAiCompatible,
                }
            }
            Err(e) => ChatResponse {
                content: format!("[openai_compatible error] {e}"),
                provider: ProviderType::OpenAiCompatible,
            },
        }
    }
}
