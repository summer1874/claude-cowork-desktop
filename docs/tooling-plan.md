# Tooling Plan v0.1 (File Operations for LLM)

## 目标

在接入大模型后，为其提供受控的文件工具能力，实现“可审计、可回放、可授权”的本地操作。

## 核心原则

1. 模型不直接访问文件系统，只能通过受控 command。
2. 所有工具调用必须落日志（时间、参数、结果、耗时）。
3. 默认最小权限：先只读，后可写。
4. 强制 workspace 边界：禁止越界访问。

## 工具分级

### 只读工具（Phase 1）

- `fs_list(path)`
- `fs_read(path)`
- `fs_stat(path)`

### 写入工具（Phase 2）

- `fs_write(path, content)`
- `fs_patch(path, diff)`

### 危险工具（Phase 3）

- `fs_delete(path)`
- `run_exec(command)`

> Phase 3 默认关闭，必须显式开启并二次确认。

## 安全策略

- 路径归一化后必须位于 workspace 根目录内
- 拒绝敏感路径（如 `~/.ssh`, `~/.openclaw/credentials`）
- 写入前可配置审批策略（always/on-risk/off）

## 交互策略

1. 模型先生成执行计划
2. 编排层逐步调用工具
3. 每步回显结果并记录
4. 汇总输出文件改动清单
