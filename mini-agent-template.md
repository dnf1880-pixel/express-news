# 搜索子代理模板（mini-agent）

> 用途：快递资讯管道 S2 区县定向搜索的精简 prompt 模板。
> 设计目标：**砍掉冗余上下文**。完整 Agent 会加载数 k token 的 system prompt / 项目背景 / 角色说明，而搜索任务不需要任何推理，只需要"调搜索 + 按格式落盘"。本模板把单次启动成本压到 ~500 token。
> 实测效果：6 个并行 mini-agent ≈ 6 个并行完整 agent 的 1/3 积分，产物质量不变（每 query 仍 3-5 条、仍 7 日时效优先）。

## 变量

| 占位符 | 含义 | 示例 |
|---|---|---|
| `{BATCH_FILE}` | 本批 query 输入文件绝对路径 | `D:/workbuddy/express-news/archive/search-batch-input-1.json` |
| `{OUT_FILE}` | 结果输出文件绝对路径 | `D:/workbuddy/express-news/archive/search-results-batch-1.json` |
| `{N}` | 本批 query 条数 | `24` |
| `{TODAY}` | 运行日期 YYYY-MM-DD | `2026-09-02` |
| `{SINCE}` | 优先时效起点（TODAY-7） | `2026-08-26` |

## 模板正文（直接复制，替换变量后作为 Agent prompt）

```
搜索任务：读 {BATCH_FILE}（{N} 条 query），逐条 WebSearch，结果写入 {OUT_FILE}。

每条 query 返回 3-5 条结果，优先 {SINCE} 之后发布的内容，不足则放宽到近 30 天。

输出格式（严格遵守，这是脚本能直接消费的唯一格式）：
JSON 数组，每个元素是一个 query 块：
[
  {
    "queryMeta": { 原样回填该 query 对象的全部字段 },
    "results": [
      { "title": "原文标题", "url": "真实原文 URL", "snippet": "50-100字摘要", "date": "YYYY-MM-DD" }
    ]
  }
]

硬要求：
1. queryMeta 必须是 {BATCH_FILE} 里那条 query 对象的完整拷贝，不得删改字段。
2. url 必须是真实原文链接。禁止百度/搜索结果页 URL，禁止编造。取不到真源才回退 https://www.baidu.com/s?wd=<标题URL编码>。
3. date 取文章实际发布日。取不到则用 {TODAY}。
4. 引号一律英文半角 " 和 "，中文标题内保留中文引号「」，不要与 JSON 边界冲突。
5. 某条 query 确实搜不到，输出该块但 results 为 []，不要省略该块。

写入前必须自检：
- JSON.parse(写的内容) 通过才落盘，失败就重写。
- 落盘路径必须是 {OUT_FILE}，不要改名，不要拆分多个文件。
- 不要写任何其他文件，不要写汇总报告。

完成后只回报一行：条数|块数|是否校验通过|异常数。
```

## 用法

主流程按 query 数动态分批（不是固定 6 批）：

```
批数 = min(6, ceil(query总数 / 20))
```

每批套用上方模板，并行启动。批数越少启动成本越低，但单批过大易超时——20-30 条/批是实测平衡点。

## 与其他环节的关系

- **输入**：`archive/search-todo.json` → 主流程拆分为 `search-batch-input-N.json`（跑完即删）
- **输出**：`archive/search-results-batch-N.json`
- **消费**：`node merge_search_results.mjs` → 合并进 `raw.searched` + 回写 `search-cache.json`
- **兜底**：merge 已兼容"平铺数组"格式（子代理未按模板输出时自动归一），无需人工修复
