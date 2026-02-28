# Claude CoWork Desktop - PRD v0.1

## 1. 背景与目标

Claude CoWork Desktop 是一个面向 AI 编码协作的本地桌面工作台。目标是把“聊天式开发”升级为“项目式协作”，形成可追踪、可复盘的闭环。

### 1.1 产品目标

- 支持多项目、多会话并行协作
- 建立任务-会话-执行日志的关联关系
- 降低上下文丢失与重复沟通成本
- 提供可导出复盘材料（便于交接/沉淀）

### 1.2 非目标（MVP）

- 不做云同步
- 不做多人实时协作
- 不做插件市场
- 不做复杂权限系统

---

## 2. 用户画像与场景

### 2.1 用户画像

1) 独立开发者：同时维护多个项目，需要结构化协作
2) 技术负责人：需要追踪任务状态与执行证据
3) AI 重度用户：会话多、上下文容易混乱

### 2.2 高频场景

- 从需求创建任务并进入会话执行
- 将会话内容关联到具体任务
- 查看某次命令执行日志定位问题
- 完成后导出任务复盘

---

## 3. 信息架构

## 3.1 页面结构

1. 项目首页（Workspace Hub）
2. 项目工作台（Workbench）
   - 任务看板（左）
   - 会话区（中）
   - 详情/日志面板（右）
3. 设置页（Settings）

### 3.2 导航策略

- 顶层：项目切换
- 项目内二级：任务 / 会话 / 日志
- 页面状态持久化（重启后恢复）

---

## 4. 功能需求（MVP）

## 4.1 Workspace 管理

- 新建 workspace
- 导入本地目录
- 最近打开列表（按时间排序）
- workspace 元数据：name/path/lastOpenedAt

### 验收标准

- 可创建与打开 workspace
- 重启后能恢复最近列表

## 4.2 Session 会话系统

- 新建会话（绑定 workspace）
- 多标签会话切换
- 会话消息历史持久化
- 会话搜索（按关键词）

### 会话字段

- id
- workspaceId
- title
- model
- createdAt
- updatedAt

### 消息字段

- id
- sessionId
- role(user/assistant/system)
- content
- tokenUsage(可选)
- createdAt

### 验收标准

- 同一 workspace 可并行多个会话
- 会话与消息可持久化并可检索

## 4.3 任务看板（Task Board）

- 创建任务
- 更新状态：todo/in_progress/done
- 设置优先级：low/medium/high
- 任务可关联一个或多个会话

### 任务字段

- id
- workspaceId
- title
- description
- status
- priority
- assignee(预留)
- dueAt(预留)
- createdAt
- updatedAt

### 验收标准

- 任务状态可流转
- 能查看任务关联的会话

## 4.4 执行日志（Run Log）

- 记录命令执行：command、stdout/stderr、exitCode、duration
- 可按任务筛选执行记录
- 可快速复制日志

### 日志字段

- id
- workspaceId
- taskId(可空)
- command
- status(success/fail/running)
- exitCode
- stdout
- stderr
- startedAt
- finishedAt
- durationMs

### 验收标准

- 至少保存最近 500 条日志
- 日志可检索与按任务过滤

## 4.5 导出复盘

- 按任务导出 markdown
- 内容包含：任务信息、关联会话摘要、执行日志摘要

### 验收标准

- 一键导出成功
- 导出文档可直接阅读/分享

---

## 5. 关键交互流程

### 5.1 需求到交付

创建任务 -> 进入绑定会话 -> 执行命令 -> 更新任务状态 -> 导出复盘

### 5.2 问题排查

检索任务 -> 查看关联日志 -> 回看会话上下文 -> 新建修复任务

---

## 6. 数据与存储设计（MVP）

存储：SQLite（本地）

核心表：
- workspaces
- sessions
- messages
- tasks
- task_session_links
- run_logs

要求：
- 全表含 created_at / updated_at
- 关键查询字段建索引（workspace_id, session_id, task_id）
- 提供 schema 版本号，支持迁移

---

## 7. 非功能需求

- 启动时间：冷启动 < 3s（目标）
- 稳定性：核心流程不崩溃
- 可观测性：关键错误写入日志
- 跨平台：macOS + Windows 基础功能一致

---

## 8. 风险与对策

风险：命令执行能力在不同平台表现差异
对策：统一 Rust 侧执行抽象 + 平台适配层

风险：会话/日志快速膨胀
对策：分页加载 + 保留策略 + 归档机制

风险：上下文一致性
对策：所有关联关系显式建模（task-session-log）

---

## 9. 版本里程碑

- v0.1（MVP）：本地单机闭环
- v0.2：Git 关联增强 + 更强检索
- v0.3：团队协作与同步能力（待定）
