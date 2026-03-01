# ClaudeCoWork Desktop

Tauri 2 + Rust + React/TypeScript 的跨平台桌面协作工作台（Win/macOS）。

## Monorepo 结构

- `apps/desktop`：前端应用（React + Vite + TS）
- `crates/core`：Rust 领域核心逻辑
- `crates/infra`：基础设施实现（sqlite/fs/git/pty）
- `crates/api`：对外命令层（Tauri Commands + DTO）
- `src-tauri`：Tauri 程序入口
- `docs`：架构与规范
- `CONTEXT.md`：根目录上下文总览

## 开发原则

1. UI 不直接访问系统能力，统一走 Tauri command。
2. 业务规则尽量在 Rust Core，前端只做展示/交互。
3. 所有关键 I/O 操作可审计（日志）。
4. 所有方向性改动必须先记录到 docs（见 `docs/change-policy.md`）。

---

## 环境依赖

## Node 版本

- **推荐：Node.js 22 LTS**（当前开发环境：`v22.22.0`）
- 最低建议：Node >= 20

## 其他必需依赖

- Rust 工具链（`rustup`, `cargo`）
- Tauri 依赖（不同系统略有差异）
  - macOS：Xcode Command Line Tools
  - Windows：Visual Studio C++ Build Tools

> Tauri 系统依赖可参考官方文档：https://tauri.app/start/prerequisites/

---

## 安装

在前端目录安装依赖：

```bash
cd apps/desktop
npm install
```

---

## 本地开发

### 1) 仅前端调试（Web）

```bash
cd apps/desktop
npm run dev
```

默认地址：`http://localhost:5173`

### 2) 桌面端联调（Tauri）

在项目根目录执行：

```bash
npx tauri dev
```

说明：
- 会自动先跑前端 dev server（见 `src-tauri/tauri.conf.json` 的 `beforeDevCommand`）
- 然后启动桌面壳并连接前端

---

## 构建

### 前端构建

```bash
cd apps/desktop
npm run build
```

### TypeScript 检查

```bash
cd apps/desktop
npx tsc -b --pretty false
```

---

## 打包发布（Win/macOS）

在项目根目录执行：

```bash
npx tauri build
```

当前配置（`src-tauri/tauri.conf.json`）：
- `dmg`（macOS）
- `nsis`（Windows）
- `app`

产物通常在：
- `src-tauri/target/release/bundle/`

---

## 常用命令速查

```bash
# 前端开发
cd apps/desktop && npm run dev

# 前端构建
cd apps/desktop && npm run build

# 前端类型检查
cd apps/desktop && npx tsc -b --pretty false

# 桌面联调（根目录）
npx tauri dev

# 桌面打包（根目录）
npx tauri build
```

---

## 文档入口

- 产品与架构：`docs/prd-v0.1.md`, `docs/architecture.md`
- 迭代计划：`docs/mvp-sprint-backlog.md`
- LLM 接入：`docs/llm-integration-plan.md`
- 工具运行时：`docs/tooling-plan.md`
- 变更策略：`docs/change-policy.md`
- 进展日志：`docs/progress-log.md`
- 上下文总览：`CONTEXT.md`
