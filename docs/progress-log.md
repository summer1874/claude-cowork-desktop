# Progress Log

## 2026-03-01

### 决策与规则
- 新增 `docs/change-policy.md`：规定所有方向性改动必须先记录到 docs。
- 在 README 与 architecture 文档中加入变更策略引用。

### Sprint 0 实施
- 完成 `apps/desktop` 的最小可运行前端骨架（Vite + React + TypeScript）。
- 新增入口与构建配置：
  - `index.html`
  - `src/main.tsx`
  - `src/App.tsx`
  - `tsconfig.json`
  - `tsconfig.node.json`
  - `vite.config.ts`
- 验证 TypeScript 构建链（使用 npm 代替 pnpm，执行 `tsc -b` 通过）。

### 下一步推进（Tauri 通路）
- 新增 `src-tauri` 基础配置：`Cargo.toml`、`tauri.conf.json`、`build.rs`。
- 新增 Rust command：`app_health`（用于前后端通路验证）。
- 前端新增 `services/tauri.ts`，并在 `App.tsx` 加入 Health 检查按钮。
- 说明：纯 Web 调试时返回 fallback（`web-dev`），Tauri 环境走真实 invoke。

### LLM 接入规划推进
- 新增 `docs/llm-integration-plan.md`，明确三类 Provider 接入策略。
- 将 Company Gateway（公司后端）设为首期支持目标之一。
- 更新 `api-contract.md` 与 `architecture.md` 的 LLM 接口与分层约束。

### 工具层规划推进
- 新增 `docs/tooling-plan.md`，定义模型文件操作能力与安全分级。
- 文档补充 Tool Runtime Layer 与 File Tooling 接口约定。
- 已落地 Tool Runtime v0：
  - `fs_set_workspace_root`
  - `fs_set_mode`（readonly/readwrite）
  - `fs_list` / `fs_read` / `fs_stat`
  - `fs_write`（仅 readwrite 模式允许）
- 强制 workspace 边界校验，拒绝越界路径访问。

### Tool Runtime 前端控制面板
- 新增 `apps/desktop/src/components/ToolPanel.tsx`。
- 新增 `apps/desktop/src/services/tools.ts` 与 `stores/toolStore.ts`。
- 前端可设置 workspace root、切换 readonly/readwrite、执行 list/read/write 测试。

### Run Log 持久化（前端）
- 新增 `apps/desktop/src/logs/runlog.ts`（localStorage 持久化，最多 500 条）。
- 新增 `RunLogPanel` 展示最近工具调用审计记录。
- ToolPanel 每次执行工具调用都会写入 run log（含 action/status/duration/error）。

### Workspace 模块（前端 v0）
- 新增 `WorkspacePanel`，支持新增/激活 workspace。
- 新增 workspace 本地持久化（最近 20 项）。
- 激活 workspace 时联动调用 `fs_set_workspace_root`，并写入 run log。

### Task Board（前端 v0）
- 新增 `TaskBoard` 三列看板（todo/in_progress/done）。
- 新增任务本地持久化与状态流转。
- 任务按 active workspace 过滤展示。
- 任务创建/状态更新动作写入 run log。

### Session 模块（前端 v0）
- 新增 `SessionPanel`，支持多会话标签切换。
- 支持会话绑定任务与模型字段。
- 消息持久化（localStorage）与 stub assistant 回复。
- 会话创建/消息发送动作写入 run log。

### Session 接入真实 LLM 通路（v0）
- 新增 `apps/desktop/src/services/llm.ts`，调用 `llm_chat` command。
- SessionPanel 从 stub 回复升级为真实 llm_chat 调用。
- 支持在 UI 输入 base_url / model / api_key（本地调试用途）。
- Rust 侧为 openai_compatible 与 ollama provider 增加 HTTP blocking 请求实现。
- company_gateway 继续保留预留实现。
