// merge_search_results.mjs — 将 search-results-*.json 合并进 raw-<date>.json 的 searched 数组
import { readFileSync, writeFileSync, readdirSync, existsSync, renameSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { saveResults, cacheStats } from './search_cache.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const ARCHIVE = join(__dirname, 'archive');

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

const files = readdirSync(ARCHIVE).filter(f => f.startsWith('search-results-') && f.endsWith('.json')).sort();
if (!files.length) { console.log('无 search-results-*.json，跳过合并'); process.exit(0); }

const merged = [];
const cacheEntries = [];
for (const f of files) {
  let arr;
  try { arr = JSON.parse(readFileSync(join(ARCHIVE, f), 'utf8')); }
  catch (e) { console.warn(`  ! ${f} JSON 解析失败，跳过：${e.message}`); continue; }
  if (!Array.isArray(arr)) { console.warn(`  ! ${f} 非数组，跳过`); continue; }

  // 格式兼容：wrapper 模式 {queryMeta, results} / 平铺模式 {title, url, ...}
  // 平铺模式是子代理未按模板输出时的兜底，脚本自动归一，不再需要人工修复
  const isFlat = arr.length > 0 && !arr[0].queryMeta && !arr[0].results && (arr[0].title || arr[0].url);

  if (isFlat) {
    const byQuery = new Map();
    for (const r of arr) {
      const query = r.query || '';
      merged.push({
        title: stripTags(r.title || ''),
        url: r.url || `https://www.baidu.com/s?wd=${encodeURIComponent(stripTags(r.title || ''))}`,
        snippet: stripTags(r.snippet || ''),
        date: r.date || null,
        channel: r.channel || '资讯',
        region: r.region || '',
        subRegion: r.subRegion || '',
        src: r.src || '检索',
        srcName: r.src || '搜索兜底',
        srcUrl: r.url || '',
        warn: !r.date,
        stage: 'raw',
        fromSearch: true,
        query
      });
      if (query) {
        if (!byQuery.has(query)) byQuery.set(query, { queryMeta: { query, channel: r.channel, region: r.region, subRegion: r.subRegion, src: r.src }, results: [] });
        byQuery.get(query).results.push({ title: r.title, url: r.url, snippet: r.snippet, date: r.date });
      }
    }
    for (const e of byQuery.values()) cacheEntries.push(e);
    console.log(`  ↳ ${f}：平铺模式（${arr.length} 条，归并为 ${byQuery.size} 个 query 组）`);
    continue;
  }

  for (const entry of arr) {
    const q = entry.queryMeta || {};
    for (const r of (entry.results || [])) {
      merged.push({
        title: stripTags(r.title || ''),
        url: r.url || `https://www.baidu.com/s?wd=${encodeURIComponent(stripTags(r.title || ''))}`,
        snippet: stripTags(r.snippet || ''),
        date: r.date || null,
        channel: q.channel || entry.channel || '资讯',
        region: q.region || q.city || entry.region || '',
        subRegion: q.subRegion || q.alias || q.admin || entry.subRegion || '',
        src: q.bureau || q.source || entry.src || '检索',
        srcName: q.bureau || q.source || entry.srcName || '搜索兜底',
        srcUrl: r.url || '',
        warn: !r.date,
        stage: 'raw',
        fromSearch: true,
        query: q.query || entry.query || ''
      });
    }
    if (entry.queryMeta && Array.isArray(entry.results) && entry.results.length) {
      cacheEntries.push({ queryMeta: entry.queryMeta, results: entry.results });
    }
  }
}

// A1：回写缓存（下次跑同 query 直接复用，省搜索调用）
const savedN = saveResults(cacheEntries);
const st = cacheStats();
console.log(`  💾 缓存回写 ${savedN} 条 query → 有效 ${st.fresh} 条（tier1 ${st.tier1} / tier2 ${st.tier2}）/ ${st.items} 条结果 [TTL ${st.tiers.tier1}h / ${st.tiers.tier2}h]`);

const rawPath = join(ARCHIVE, `raw-${DATE}.json`);
if (!existsSync(rawPath)) { console.error('raw 文件不存在:', rawPath); process.exit(1); }
const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
raw.searched = merged;
raw.meta.searchedCount = merged.length;
writeFileSync(rawPath, JSON.stringify(raw, null, 2));

// 归档已消费的结果文件：防止下次 merge 重复合并历史数据（旧结果已入缓存 + 已进 raw）
const CONSUMED = join(ARCHIVE, 'consumed');
mkdirSync(CONSUMED, { recursive: true });
let moved = 0;
for (const f of files) {
  try { renameSync(join(ARCHIVE, f), join(CONSUMED, `${DATE}-${f}`)); moved++; }
  catch (e) { console.warn(`  ! ${f} 归档失败：${e.message}`); }
}

console.log(`✓ 合并完成：${files.length} 个结果文件 → ${merged.length} 条搜索命中 → ${rawPath}`);
console.log(`  📦 归档 ${moved} 个结果文件 → archive/consumed/`);
