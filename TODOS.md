# SeekingTop1 — TODO List

## P0: 数据源（阻塞产品核心价值）

### 深度财务数据源调研与接入
- **What:** 找到能提供 ROE/ROIC/毛利率/F-Score/Altman Z-Score/流动比率等深度财务指标的数据源
- **Why:** 没有深度数据，神奇公式/巴菲特/F-Score 三个策略永远是"即将支持"。当前 3 个可用策略本质上都只用 PE/PB/股息率，差异化不足
- **候选数据源:**
  - Financial Modeling Prep (FMP) — REST API，覆盖全球，有免费额度
  - Alpha Vantage — 免费 API，有基本面数据
  - Tushare（A 股专用）— 积分制 API，A 股数据最全
  - 财报原始数据爬取 — 从交易所公告/巨潮资讯网爬取财报，自己计算
  - Yahoo Finance API（非官方）— 基本面数据丰富但稳定性不确定
- **Depends on:** 无
- **Effort:** M (human: ~2天调研) → CC: ~3h
- **Priority:** P0 — 阻塞其余所有策略

### 全市场股票码表获取
- **What:** 获取 A 股 ~5000 只、美股 ~8000 只、港股 ~2500 只的完整股票码表
- **Why:** Longbridge API 无 list-all endpoint，sync.ts 需要预存股票列表才能批量同步
- **Depends on:** 深度数据源调研（可能和数据源一起解决）
- **Effort:** S (可能和数据源调研一起完成)
- **Priority:** P0

## P1: 数据同步

### Longbridge 数据同步脚本完善
- **What:** 完善 scripts/sync.ts，接入 Longbridge API 获取真实行情数据（PE/PB/股息率/EPS/BPS/市值/股价）
- **Why:** 当前只有 39 只 mock 数据
- **Depends on:** 全市场股票码表、Longbridge API Key
- **Effort:** M → CC: ~30min
- **Priority:** P1

### T+1 定时任务
- **What:** 设置 cron / Vercel cron 自动执行 sync.ts
- **Why:** 数据需要每天更新
- **Depends on:** sync.ts 完善
- **Effort:** S → CC: ~15min
- **Priority:** P1

### 深度数据同步脚本
- **What:** 新建 scripts/sync-fundamentals.ts，从深度数据源获取 ROE/ROIC/毛利率等
- **Why:** 启用神奇公式/巴菲特/F-Score 三个策略
- **Depends on:** 深度数据源确定
- **Effort:** M → CC: ~30min
- **Priority:** P1

## P2: 功能增强

### 启用神奇公式策略
- **What:** 策略标记 available: true，实现 Rank 策略的 API Route 逻辑
- **Depends on:** 深度数据同步（需要 ROIC + EV/EBITDA）
- **Effort:** S → CC: ~15min
- **Priority:** P2

### 启用巴菲特护城河策略
- **Depends on:** 深度数据同步（需要 ROE/ROIC/毛利率/PEG）
- **Effort:** S → CC: ~10min
- **Priority:** P2

### 启用 F-Score 策略
- **Depends on:** 深度数据同步（需要 F-Score 或 9 个原始因子）
- **Effort:** M → CC: ~20min（如需自己计算 F-Score）
- **Priority:** P2

### 价格实时更新
- **What:** 用 Longbridge WebSocket 推送实时价格
- **Depends on:** Longbridge API Key + sync 基础设施
- **Effort:** M → CC: ~30min
- **Priority:** P2

### DB schema 升级 marketCap 精度
- **What:** `real` (float32) → `numeric` 或 `bigint`，A 股市值可达万亿级
- **Effort:** S → CC: ~10min
- **Priority:** P2

## P3: 未来方向

### 策略回测引擎
- **What:** 给定策略参数，展示历史年化回报、最大回撤、夏普比率
- **Depends on:** 深度数据 + 历史数据
- **Priority:** P3 — 10x 版本功能

### AI 智能推荐
- **What:** 基于用户偏好推荐策略和股票
- **Priority:** P3 — 10x 版本功能

### 搜索功能
- **What:** 按股票代码/名称搜索
- **Effort:** S → CC: ~15min
- **Priority:** P3
