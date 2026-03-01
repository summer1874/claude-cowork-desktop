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
