# MVP Sprint Backlog (v0.1)

## Sprint 0（0.5 周）- 基建与规范

### 目标

搭好可持续开发的工程地基

### 任务

1. 初始化 Tauri + React + Rust workspace
2. 建立 lint/format/test 命令
3. 建立 CI（frontend + rust）
4. 制定提交规范（conventional commits）
5. 增加 docs 模板（ADR/变更记录）

### 验收

- 本地与 CI 均可通过基础检查

---

## Sprint 1（1 周）- Workspace + Task Board

### 目标

完成项目与任务管理主流程

### 任务

1. Workspace CRUD（创建/导入/最近）
2. Task Board 三列视图（todo/in_progress/done）
3. Task CRUD + priority
4. SQLite schema v1（workspaces/tasks）
5. 前端状态管理接入（Zustand）

### 验收

- 能在任意 workspace 下创建并管理任务
- 数据重启后仍在

---

## Sprint 2（1 周）- Session + Message

### 目标

完成会话系统和任务关联

### 任务

1. Session CRUD + 多标签
2. Message 持久化
3. 关键词检索（session/message）
4. Task <-> Session 关联能力
5. SQLite schema v2（sessions/messages/task_session_links）

### 验收

- 一个任务可关联多个会话
- 可搜索历史会话消息

---

## Sprint 3（1 周）- Run Log + 导出复盘

### 目标

打通执行与复盘闭环

### 任务

1. 命令执行能力（Rust command 封装）
2. run_logs 表 + 日志分页
3. 按任务过滤日志
4. 导出 markdown 报告（任务/会话/日志摘要）
5. SQLite schema v3（run_logs）

### 验收

- 从任务进入执行并产生日志
- 可导出一份完整复盘文档

---

## 质量门禁（每个 Sprint）

- 单元测试通过（核心模块）
- 无 blocker 级 bug
- 文档更新（架构/接口/迁移）
- Demo 可完整演示本 Sprint 目标

---

## 发布标准（MVP Ready）

1. 可在 macOS 和 Windows 运行核心流程
2. 任务-会话-日志-导出闭环稳定
3. 数据迁移机制可用
4. 核心错误可定位（日志可读）
