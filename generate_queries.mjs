// generate_queries.mjs
// 读 regions.json + sources.json 的 43 区县检索模板，生成 "43 区县 × N 关键词" 检索词矩阵。
// 用法：node generate_queries.mjs > queries.json
// 或：node generate_queries.mjs --count  （仅输出总条数）
// 或：node generate_queries.mjs --by-channel ecom  （仅输出电商渠道）

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const regions = JSON.parse(readFileSync(join(__dirname, 'regions.json'), 'utf8')).regions;
const sources = JSON.parse(readFileSync(join(__dirname, 'sources.json'), 'utf8'));
const regionCat = sources.categories.find(c => c.id === 'region');
const templates = regionCat.templates;

const args = process.argv.slice(2);
const onlyCount = args.includes('--count');
const channelFilter = (args.find(a => a.startsWith('--by-channel=')) || '').replace('--by-channel=', '').trim();

const queries = [];
for (const r of regions) {
  for (const t of templates) {
    if (channelFilter && t.channel !== channelFilter) continue;
    queries.push({
      region: r.alias,
      city: r.city,
      admin: r.admin,
      tier: r.tier,
      channel: t.channel,
      template: t.id,
      label: t.label,
      query: t.query.replace(/\{alias\}/g, r.alias).replace(/\{city\}/g, r.city).replace(/\{admin\}/g, r.admin)
    });
  }
}

if (onlyCount) {
  console.log(queries.length);
} else {
  // 统计
  const byChannel = {};
  queries.forEach(q => byChannel[q.channel] = (byChannel[q.channel] || 0) + 1);
  const summary = {
    generatedAt: new Date().toISOString(),
    regionCount: regions.length,
    templateCount: templates.length,
    totalQueries: queries.length,
    byChannel,
    queries
  };
  writeFileSync(join(__dirname, 'queries.json'), JSON.stringify(summary, null, 2));
  console.log(`生成 ${queries.length} 条检索词（${regions.length} 区县 × ${templates.length} 模板）`);
  console.log('渠道分布：', JSON.stringify(byChannel));
}
