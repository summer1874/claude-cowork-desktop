use crate::llm::provider::ModelProvider;
use crate::llm::types::{ChatRequest, ChatResponse, ProviderConfig, ProviderHealth, ProviderType};

pub struct OllamaProvider;

impl ModelProvider for OllamaProvider {
    fn test_connection(&self, _config: &ProviderConfig) -> ProviderHealth {
        ProviderHealth {
            ok: true,
            provider: ProviderType::Ollama,
            message: "ollama provider skeleton ready".to_string(),
        }
    }

    fn chat(&self, _config: &ProviderConfig, request: &ChatRequest) -> ChatResponse {
        ChatResponse {
            content: format!("[stub/ollama] {}", request.prompt),
            provider: ProviderType::Ollama,
        }
    }
}
