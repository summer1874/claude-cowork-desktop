# Architecture v0.1

## 分层

1. UI 层（React）
2. App 层（Store / UseCase）
3. Bridge 层（Tauri Command + DTO）
4. Core 层（Rust 领域服务）

## 关键约束

- 前端只通过 typed API 调用系统能力
- 业务规则优先放 Rust core
- 所有文件与命令执行操作写审计日志
- 方向性变更先记录到 docs（遵循 `docs/change-policy.md`）

## 领域模块（首批）

- workspace：项目目录与上下文
- chat-session：多会话协作
- task-board：任务流转
- runlog：命令执行日志
