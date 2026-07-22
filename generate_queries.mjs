// generate_queries.mjs
// 信源清单驱动：读 sources.json（core 直连 + counties 路由 + ecom/safety 专项），生成抓取任务矩阵。
// 替代旧的「43区县 × 8模板 = 344 无差别组合」。
// 用法：
//   node generate_queries.mjs                 生成全部任务到 queries.json
//   node generate_queries.mjs --count         仅输出总条数
//   node generate_queries.mjs --by-channel 安全   仅输出安全渠道

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sources = JSON.parse(readFileSync(join(__dirname, 'sources.json'), 'utf8'));

const args = process.argv.slice(2);
const onlyCount = args.includes('--count');
const channelFilter = (args.find(a => a.startsWith('--by-channel=')) || '').replace('--by-channel=', '').trim();

const queries = [];

// 1) core：核心官方直连源（每日 fetch）
for (const c of sources.core) {
  if (channelFilter && c.channel !== channelFilter) continue;
  queries.push({ type: 'fetch', source: c.name, url: c.url, scope: c.scope, channel: c.channel, label: c.desc });
}

// 2) counties：43 区县定向检索（每区县 3 条：资讯/安全/电商，带市局+区县名，非泛组合）
const countyTemplates = [
  { id: 'news', channel: '资讯', build: (r, m) => `${m.bureau} ${r.alias} 快递 通报 整治 投诉 最新` },
  { id: 'safety', channel: '安全', build: (r) => `${r.alias} 暴雨 封路 事故 交通管制 最新` },
  { id: 'ecom', channel: '电商', build: (r) => `${r.alias} 电商 产业园 水果 寄递 招商 最新` }
];
for (const r of sources.counties) {
  const m = sources.cityBureauMap[r.city];
  if (!m) continue;
  for (const t of countyTemplates) {
    if (channelFilter && t.channel !== channelFilter) continue;
    queries.push({
      type: 'search', region: r.alias, city: r.city, admin: r.admin, tier: r.tier,
      channel: t.channel, template: t.id, label: t.channel,
      query: t.build(r, m), bureau: m.bureau, govBase: m.govBase, media: r.media
    });
  }
}

// 3) ecom / safety：专项源（优先 fetch，失败回退 search）
for (const e of sources.ecom) {
  if (channelFilter && e.channel !== '电商') continue;
  queries.push({ type: 'fetch-or-search', source: e.name, url: e.url, scope: e.scope, channel: '电商', label: e.desc });
}
for (const s of sources.safety) {
  if (channelFilter && s.channel !== '安全') continue;
  queries.push({ type: 'fetch-or-search', source: s.name, url: s.url, scope: s.scope, channel: '安全', label: s.desc });
}

if (onlyCount) {
  console.log(queries.length);
} else {
  const byType = {}, byChannel = {};
  queries.forEach(q => { byType[q.type] = (byType[q.type] || 0) + 1; byChannel[q.channel] = (byChannel[q.channel] || 0) + 1; });
  const summary = {
    generatedAt: new Date().toISOString(),
    note: '信源清单驱动任务矩阵（core 直连 + counties 定向 + 专项源），替代 344 无差别组合。',
    totalQueries: queries.length,
    byType, byChannel, queries
  };
  writeFileSync(join(__dirname, 'queries.json'), JSON.stringify(summary, null, 2));
  console.log(`生成 ${queries.length} 条任务（fetch直连 ${byType.fetch || 0} + 定向检索 ${byType.search || 0} + 专项 ${byType['fetch-or-search'] || 0}）`);
  console.log('渠道分布：', JSON.stringify(byChannel));
}
