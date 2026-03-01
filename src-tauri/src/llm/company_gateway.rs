use crate::llm::provider::ModelProvider;
use crate::llm::types::{ChatRequest, ChatResponse, ProviderConfig, ProviderHealth, ProviderType};

pub struct CompanyGatewayProvider;

impl ModelProvider for CompanyGatewayProvider {
    fn test_connection(&self, _config: &ProviderConfig) -> ProviderHealth {
        ProviderHealth {
            ok: true,
            provider: ProviderType::CompanyGateway,
            message: "company_gateway provider skeleton ready (waiting backend schema)".to_string(),
        }
    }

    fn chat(&self, _config: &ProviderConfig, request: &ChatRequest) -> ChatResponse {
        ChatResponse {
            content: format!("[stub/company_gateway] {}", request.prompt),
            provider: ProviderType::CompanyGateway,
        }
    }
}
