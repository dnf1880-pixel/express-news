# 快递资讯（圆通鄂西）V2 — 全面梳理与合规审计报告

> 审计时间：2026-07-23 10:39｜审计人：波哥智囊｜工作区：D:/workbuddy/express-news
> 结论先行：**全流程正确、可触发、可推送；期间修复 1 个严重 bug + 2 处一致性问题，均已进仓（commit 1a16c6e，unpushed=0）。V1 可安全删除。**

---

## 一、功能定位

定时抓取**鄂西 5 市（宜昌 / 恩施 / 荆州 / 荆门 / 潜江）**快递物流相关资讯、电商线索、安全事件，经「存档 → 评分 → AI 策展」后生成 GitHub Pages 静态站：

- 站点：https://dnf1880-pixel.github.io/express-news/
- 三路产出：**news（行业资讯）** / **leads（电商客户线索）** / **safety（天气/封路/事故）**
- 触发方式：单一自动化 `1784728673492`（状态 ACTIVE），每天 **8:08** 跑一次全量管道。

**信源优先级**（硬约束）：core 直连 > 区县定向 > 补缺，禁止无差别组合检索。

---

## 二、实施流程（S0–S6 管道）

| 步骤 | 脚本/动作 | 输入 → 输出 | 关键产出 |
|---|---|---|---|
| **S0** | `node generate_queries.mjs` | sources.json → queries.json | 153 条任务（13 fetch + 129 区县 search + 11 专项）；信源未变则**跳过**（updatedAt 守卫） |
| **S1** | `node scrape.mjs` | queries.json → archive/raw-<date>.json + search-todo.json | Node fetch 并发爬 22 官方 URL（13 core + ecom/safety），原始命中全量落盘（脏数据也留） |
| **S2** | agent WebSearch | search-todo.json → 合并进 raw.searched | 分批跑 129 区县 + 专项搜索，每 query 3–5 条（配 SEARCH_API_KEY 则脚本自搜） |
| **S3** | `node score.mjs` | raw + watch-alerts → staging-<date>.json | 去重 + 三通道归类 + v1 权重评分（资讯280/电商19/安全89 等） |
| **S4** | AI 策展 | staging → data.json | 挑高价值条目写 data.json（低价值沉淀不进前端）；严守字段契约与硬约束 |
| **S5** | `node build.mjs` | data.json + template.html → index.html | 发布前结构自检（等级/分数/URL），输出「✓ 生成成功：资讯 X · 电商 Y · 安全 Z」 |
| **S6** | git | 工作区 → origin main | `git add -A && commit && push`（push 失败不阻断提交，下次自动补推） |

**核心设计转变（v2 vs v1）**：先存档再评分 —— 抓取结果先全量落 `archive/`，评分/策展阶段再筛高价值进前端。漏抓不再永久丢失（原始存档保留）。

---

## 三、关键节点（演进史）

1. **V1（7/21–7/22）**：从「43 区县 × 8 模板 = 344 无差别组合」演进到「信源清单驱动 153 条」，确立权重 v1 五轴模型、信源双轨（约束轨+开放轨）、时间真实性红线。
2. **7/23 上午首次运行**：上线（commit `9f0e413`），news 46 / leads 14 / safety 14。
3. **7/23 用户五点重构**：① Step0 不每日重生 ② 抓全量 ③ 多方式并行 ④ 先存档再评分 ⑤ 承认定时非实时 → 落地 v2 框架（scrape/score/watch 三脚本 + updatedAt 守卫）。
4. **7/23 整合 V1 经验**：V1 每日日志并入 V2 memory；关键经验固化进 MEMORY.md「V1 演化遗产」；删除 orphan `regions.json`（全仓 0 引用）。
5. **本次审计（7/23 10:39）**：修复 watch 静默空转 bug、scrape srcName 兜底、收紧 S4 字段契约（commit `1a16c6e`）。

---

## 四、架构与代码合规审计

### 4.1 架构合规（对照硬约束）✅

| 检查项 | 结果 | 证据 |
|---|---|---|
| 信源真源 = sources.json，页面只读 | ✅ | sources.html 为门禁级只读展示（口令 9527，前端展示，读取 sources.json）；脚本对 sources.json 仅读不改 |
| 框架固定不变（template.html/build.mjs/sources.html） | ✅ | 全仓 grep 无任何脚本写入这三文件 |
| archive 原始存档 gitignore，仅 last-core.json 入库 | ✅ | .gitignore 已隔离 raw/staging/todo/watch-alerts |
| 自动化 = 触发器，prompt 与生效 rrule 一致 | ✅ | prompt 写 8:08，生效 `FREQ=DAILY;BYHOUR=8;BYMINUTE=8`，无漂移 |
| 字段不可伪造（URL/地址/时间） | ✅ 部分机器校验 | build.mjs 强制「非 warn 必须有 url」；日期/地址真实性依赖 AI 纪律 + warn 标记兜底 |

### 4.2 代码正确性审计（发现 & 修复）🔧

| # | 严重度 | 位置 | 问题 | 处置 |
|---|---|---|---|---|
| 1 | **严重** | watch.mjs:45 | `const html = fetchHtml(c.url)` **缺 `await`** → fetchHtml 返回 Promise，被 `if(!html)` 判 truthy 跳过 continue，`extract(Promise)` 永远空 → **看守静默空转、永不报新** | ✅ 已修：`await` + `main()` 改 `async` + `.catch`；实跑确认fetch到 502 条真实条目 |
| 2 | 轻微 | scrape.mjs:62 | `srcName: q.source || … || q.source` 末尾 `q.source` 重复（死代码） | ✅ 已修：兜底改为 `'官方源'` |
| 3 | 一致性 | 自动化 S4 | data.json news 缺 v2 要求的 subRegion/channel/warn（schema 漂移，MEMORY 已记录待办） | ✅ 已收紧：prompt 新增「data.json 字段契约」明确三通道字段 |

**未改动、验证正确的部分**：
- `score.mjs`：三通道归类、去重（URL 归一 + 160 字截断）、v1 权重（5轴 news/safety、4轴 leads）、阈值（🔴≥75/🟠55–74/🟢<55）全部自洽。
- `build.mjs`：发布前结构校验（level↔score 一致性、非 warn 必带 url、leads/safety 必带 name/title+score）是有效质量门禁。
- `scrape.mjs`：9s 超时 + 降级 search + `SEARCH_API_KEY` 桥（Bing v7）设计合理。
- `generate_queries.mjs`：updatedAt 守卫生效（信源未变正确跳过）。

### 4.3 风险与遗留

| 风险 | 现状 | 建议 |
|---|---|---|
| **实时性** | 单一自动化 8:08 一次，非实时（系统 RRULE 不支持多 BYHOUR） | 13:08/18:08 轻量补抓需**另建 2 个 automation**（已修复的 watch 已就绪，可直接挂） |
| **push 韧性** | github.com:443 偶发连不上 | 已改为「失败不阻断本次提交，下次触发自动补推」；本地 commit 始终保留 |
| **搜索 API 未配** | 区县 129 条仍靠 agent WebSearch 兜底 | 给 `SEARCH_API_KEY` 即启用纯脚本搜索路径（scrape 已写好桥） |
| **记忆未入仓** | `.workbuddy/` 被 gitignore → 项目记忆（MEMORY.md/日志）仅本地 | workspace 删除即失；如需备份可单独 commit 或迁外部 |
| **语义校验不可机检** | 日期/URL 真实性靠 AI 纪律 | 已用 warn 标记 + build 门禁兜底，属可接受边界 |

---

## 五、最终结论

1. **功能完整**：抓取（爬虫+搜索+看守三路）→ 存档 → 评分 → AI 策展 → 构建 → 推送，闭环清晰。
2. **架构合规**：信源真源固定、框架零侵入、存档与展示解耦、自动化=纯触发器，全部满足硬约束。
3. **代码正确**：审计发现并修复 **1 个严重 bug（watch 静默空转）+ 2 处一致性问题**，实跑验证通过；修复已推送（`1a16c6e`，unpushed=0）。
4. **可触发可推送**：现有 8:08 主线不受影响且更健壮（push 失败不再丢提交）；修复为未来 13/18 轻量补抓扫清障碍。
5. **V1 可安全删除**：经验已整合进 V2 的 MEMORY.md「V1 演化遗产」，无信息损失。

---

## 六、待你决策

- [ ] 是否加 **13:08 / 18:08 两个轻量 automation**（依赖已修复的 watch，逼近准实时）？
- [ ] 是否提供 **SEARCH_API_KEY** 启用纯脚本搜索（摆脱 agent 兜底）？
- [ ] V1 工作区 `D:/workbuddy/2026-07-21-16-13-32` 确认删除？
