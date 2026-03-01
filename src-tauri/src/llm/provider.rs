use crate::llm::types::{ChatRequest, ChatResponse, ProviderConfig, ProviderHealth};

pub trait ModelProvider {
    fn test_connection(&self, config: &ProviderConfig) -> ProviderHealth;
    fn chat(&self, config: &ProviderConfig, request: &ChatRequest) -> ChatResponse;
}
