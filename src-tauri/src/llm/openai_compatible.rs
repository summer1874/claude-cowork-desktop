use crate::llm::provider::ModelProvider;
use crate::llm::types::{ChatRequest, ChatResponse, ProviderConfig, ProviderHealth, ProviderType};

pub struct OpenAiCompatibleProvider;

impl ModelProvider for OpenAiCompatibleProvider {
    fn test_connection(&self, _config: &ProviderConfig) -> ProviderHealth {
        ProviderHealth {
            ok: true,
            provider: ProviderType::OpenAiCompatible,
            message: "openai_compatible provider skeleton ready".to_string(),
        }
    }

    fn chat(&self, _config: &ProviderConfig, request: &ChatRequest) -> ChatResponse {
        ChatResponse {
            content: format!("[stub/openai] {}", request.prompt),
            provider: ProviderType::OpenAiCompatible,
        }
    }
}
