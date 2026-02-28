# ClaudeCoWork Desktop

Tauri 2 + Rust + React/TypeScript 的跨平台桌面协作工作台（Win/macOS）。

## Monorepo 结构

- `apps/desktop`：前端应用（React + Vite + TS）
- `crates/core`：Rust 领域核心逻辑
- `crates/infra`：基础设施实现（sqlite/fs/git/pty）
- `crates/api`：对外命令层（Tauri Commands + DTO）
- `src-tauri`：Tauri 程序入口
- `docs`：架构与规范

## 开发原则

1. UI 不直接访问系统能力，统一走 Tauri command。
2. 业务规则尽量在 Rust Core，前端只做展示/交互。
3. 所有关键 I/O 操作可审计（日志）。
