# API Contract v0.1

## 命名规范

`domain_action`，例如：

- `workspace_open`
- `workspace_recent_list`
- `task_create`
- `task_update_status`
- `session_send_message`
- `run_exec`
- `run_log_tail`

## DTO 版本策略

- 所有对外 DTO 增加 `version: "v1"`
- 破坏性变更升 `v2`，并保留迁移层

## 错误模型

统一：

```json
{
  "code": "WORKSPACE_NOT_FOUND",
  "message": "workspace path does not exist",
  "traceId": "..."
}
```


## LLM 接口（新增）

- `llm_set_provider_config`
- `llm_test_connection`
- `llm_list_models`
- `llm_chat`

### Provider 类型

- `openai_compatible`
- `ollama`
- `company_gateway`


## File Tooling 接口（新增）

- `fs_set_workspace_root`
- `fs_set_mode`（readonly/readwrite）
- `fs_list`
- `fs_read`
- `fs_write`
- `fs_stat`
