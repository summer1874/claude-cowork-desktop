use serde::Serialize;

use crate::llm::company_gateway::CompanyGatewayProvider;
use crate::llm::ollama::OllamaProvider;
use crate::llm::openai_compatible::OpenAiCompatibleProvider;
use crate::llm::provider::ModelProvider;
use crate::llm::types::{ChatRequest, ChatResponse, ProviderConfig, ProviderHealth, ProviderType};

#[derive(Serialize)]
pub struct HealthResponse {
    pub version: &'static str,
    pub ok: bool,
}

#[tauri::command]
pub fn app_health() -> HealthResponse {
    HealthResponse {
        version: "v0.1",
        ok: true,
    }
}

#[tauri::command]
pub fn llm_test_connection(config: ProviderConfig) -> ProviderHealth {
    match config.provider {
        ProviderType::OpenAiCompatible => OpenAiCompatibleProvider.test_connection(&config),
        ProviderType::Ollama => OllamaProvider.test_connection(&config),
        ProviderType::CompanyGateway => CompanyGatewayProvider.test_connection(&config),
    }
}

#[tauri::command]
pub fn llm_chat(config: ProviderConfig, request: ChatRequest) -> ChatResponse {
    match config.provider {
        ProviderType::OpenAiCompatible => OpenAiCompatibleProvider.chat(&config, &request),
        ProviderType::Ollama => OllamaProvider.chat(&config, &request),
        ProviderType::CompanyGateway => CompanyGatewayProvider.chat(&config, &request),
    }
}
