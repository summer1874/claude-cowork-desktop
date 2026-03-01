use reqwest::blocking::Client;
use serde_json::json;

use crate::llm::provider::ModelProvider;
use crate::llm::types::{ChatRequest, ChatResponse, ProviderConfig, ProviderHealth, ProviderType};

pub struct OllamaProvider;

impl ModelProvider for OllamaProvider {
    fn test_connection(&self, config: &ProviderConfig) -> ProviderHealth {
        let req = ChatRequest {
            prompt: "ping".to_string(),
        };
        match self.chat(config, &req) {
            ChatResponse { .. } => ProviderHealth {
                ok: true,
                provider: ProviderType::Ollama,
                message: "ollama provider ok".to_string(),
            },
        }
    }

    fn chat(&self, config: &ProviderConfig, request: &ChatRequest) -> ChatResponse {
        let base = if config.base_url.trim().is_empty() {
            "http://localhost:11434".to_string()
        } else {
            config.base_url.trim_end_matches('/').to_string()
        };
        let url = format!("{}/api/chat", base);
        let model = config
            .model
            .clone()
            .unwrap_or_else(|| "qwen2.5:latest".to_string());

        let client = Client::new();
        let resp = client
            .post(url)
            .json(&json!({
                "model": model,
                "messages": [
                    {"role": "user", "content": request.prompt}
                ],
                "stream": false
            }))
            .send();

        match resp {
            Ok(r) => {
                let v: serde_json::Value = r.json().unwrap_or_else(|_| json!({}));
                let content = v
                    .get("message")
                    .and_then(|x| x.get("content"))
                    .and_then(|x| x.as_str())
                    .unwrap_or("[ollama] empty response")
                    .to_string();
                ChatResponse {
                    content,
                    provider: ProviderType::Ollama,
                }
            }
            Err(e) => ChatResponse {
                content: format!("[ollama error] {e}"),
                provider: ProviderType::Ollama,
            },
        }
    }
}
