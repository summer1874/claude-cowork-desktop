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
