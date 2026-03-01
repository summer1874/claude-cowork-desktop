# CONTEXT.md

> 项目上下文维护文件（根目录）

## 约定

- 后续新增的产品方向、关键决策、阶段进展，汇总维护在本文件。
- 详细设计与实现仍放在 `docs/`，本文件作为总览索引与会话上下文入口。

## 当前状态（2026-03-01）

- 技术栈：Tauri + Rust + React + TypeScript
- 已完成模块：
  - Settings（全局 LLM 默认配置）
  - Workspace（新增/激活/持久化）
  - Task Board（todo/in_progress/done）
  - Session（多会话、任务绑定、消息持久化、真实 llm_chat 通路）
  - Tool Runtime（workspace 边界、只读/可写模式、fs commands）
  - Run Log（前端持久化与审计面板）
- LLM Provider：
  - openai_compatible（已接 HTTP）
  - ollama（已接 HTTP）
  - company_gateway（预留）

## 待办（等待老大补充）

- 公司后端接口文档（暂预留）
- 下一阶段需求与优先级
