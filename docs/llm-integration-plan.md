# LLM Integration Plan v0.1

## 目标

为 ClaudeCoWork Desktop 提供统一的大模型接入层，支持：

1. 公有云（OpenAI-compatible）
2. 本地模型（Ollama）
3. 公司后端网关（Company Gateway）

并保持前端调用统一，不感知具体供应商差异。

---

## Provider 抽象

在 Rust 侧建立 `ModelProvider` trait：

- `chat(request) -> response`
- `list_models() -> models`
- `test_connection() -> health`

统一 DTO：
- `ChatRequest`
- `ChatResponse`
- `ModelInfo`
- `ProviderHealth`

---

## Provider 列表（首期）

### 1) OpenAI Compatible Provider

- 配置项：`base_url`, `api_key`, `model`
- 请求路径：默认 `/v1/chat/completions`

### 2) Ollama Provider

- 配置项：`base_url`（默认 `http://localhost:11434`）, `model`
- 请求路径：`/api/chat`

### 3) Company Gateway Provider（新增）

- 配置项：
  - `base_url`
  - `path`
  - `auth_type`（api_key/bearer/custom）
  - `auth_value`（加密存储）
  - `extra_headers`（如 `X-Org-Id`）
- 特性要求：
  - 支持公司自定义请求字段映射
  - 支持错误码映射到统一错误模型
  - 支持流式响应（若后端提供）

---

## 安全与合规

- 密钥不落明文日志
- 密钥优先存系统安全存储（Keychain/Credential Manager）
- 网络请求默认超时、可重试（指数退避）

---

## 前端调用规范

前端仅调用统一 command：

- `llm_chat`
- `llm_list_models`
- `llm_test_connection`
- `llm_set_provider_config`

禁止前端直接拼接供应商 API。

---

## 待补充信息（公司后端）

接入前需补全：

1. endpoint 与 method
2. 请求/响应 JSON 结构
3. 鉴权方式与 header 规范
4. 错误码定义
5. 流式协议（SSE/chunk）
