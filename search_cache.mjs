// search_cache.mjs — 搜索结果分级缓存
// 目的：减少 WebSearch 子代理调用次数以降低积分消耗，不牺牲产物质量。
//
// 设计依据（2026-09-01 实测，数据源 data.json 精选 554 条 + search-todo.json 142 条）：
//   主城级 query  64 条（占搜索预算 45%）→ 贡献 88.8% 精选内容（492/554）
//   偏远县 query  78 条（占搜索预算 55%）→ 仅贡献 11.2% 精选内容（ 62/554）
// 投入产出倒挂，故按区域信息产出频率分级调度：核心区每日必搜保时效，偏远县放宽到 3 天。
// 只缓存"搜索结果原文"（title/url/snippet/date），不缓存任何 AI 推理产物。
//
// 用法：
//   scrape.mjs               → splitByCache() 过滤待搜 query；cachedItemsToRaw() 把命中结果并入 raw.fetched
//   merge_search_results.mjs → saveResults() 把新搜到的结果回写缓存
//   CLI                      → node search_cache.mjs stats | clear
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARCHIVE = join(__dirname, 'archive');
const CACHE_PATH = join(ARCHIVE, 'search-cache.json');

// FORCE_TTL 为调试用：设了就忽略分级，全统一
const FORCE_TTL = process.env.SEARCH_CACHE_TTL ? Number(process.env.SEARCH_CACHE_TTL) : null;
const TIER1_TTL = Number(process.env.SEARCH_TTL_TIER1 || 24);  // 主城/全市级：每日必搜
const TIER2_TTL = Number(process.env.SEARCH_TTL_TIER2 || 72);  // 偏远县：3 天一搜
const MAX_ENTRIES = Number(process.env.SEARCH_CACHE_MAX || 3000);

// 鄂西偏远县名单（地级主城 宜昌/恩施/荆州/荆门/潜江 不在其中 → tier1）
const TIER2_HINT = ['宜都', '当阳', '枝江', '远安', '兴山', '秭归', '长阳', '五峰', '夷陵',
  '利川', '建始', '巴东', '宣恩', '咸丰', '来凤', '鹤峰',
  '江陵', '松滋', '公安', '石首', '监利', '洪湖',
  '沙洋', '钟祥', '京山'];

// 分级判定：命中具体县名 → tier2；否则 tier1
function ttlFor(o) {
  if (FORCE_TTL) return FORCE_TTL;
  const s = [o.query, o.region, o.city, o.scope, o.subRegion, o.alias, o.admin].filter(Boolean).join(' ');
  return TIER2_HINT.some(k => s.includes(k)) ? TIER2_TTL : TIER1_TTL;
}
function tierOf(o) { return ttlFor(o) === TIER1_TTL ? 'tier1' : 'tier2'; }

// FNV-1a 32bit → 稳定短 key
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export function readCache() {
  if (!existsSync(CACHE_PATH)) return { version: 1, entries: {} };
  try {
    const j = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
    if (!j.entries || typeof j.entries !== 'object') j.entries = {};
    return j;
  } catch {
    return { version: 1, entries: {} };
  }
}

export function writeCache(cache) {
  cache.version = 1;
  cache.tiers = { tier1: TIER1_TTL, tier2: TIER2_TTL, force: FORCE_TTL };
  cache.updatedAt = new Date().toISOString();
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function isFresh(entry) {
  if (!entry || !entry.fetchedAt) return false;
  if (!Array.isArray(entry.results) || entry.results.length === 0) return false;
  const ageH = (Date.now() - new Date(entry.fetchedAt).getTime()) / 36e5;
  return ageH < ttlFor(entry);
}

// 把待搜 query 分成 命中/未命中 两组（命中项带 tier 便于日志统计）
export function splitByCache(queries) {
  const cache = readCache();
  const hit = [], miss = [];
  for (const q of queries) {
    const key = hash(q.query || '');
    const entry = cache.entries[key];
    if (isFresh(entry)) hit.push({ q, entry, tier: tierOf(entry) });
    else miss.push(q);
  }
  return { hit, miss, cache };
}

// 缓存命中项 → raw.fetched 条目（字段契约与 scrape/merge 保持一致）
export function cachedItemsToRaw(hitList) {
  const out = [];
  for (const { q, entry } of hitList) {
    for (const r of entry.results) {
      out.push({
        title: r.title || '',
        url: r.url || '',
        snippet: r.snippet || '',
        date: r.date || null,
        channel: q.channel || entry.channel || '资讯',
        region: q.city || q.scope || q.region || entry.region || '',
        subRegion: q.alias || q.admin || q.subRegion || entry.subRegion || '',
        src: q.bureau || q.source || q.src || entry.src || '检索',
        srcName: q.bureau || q.source || q.srcName || entry.srcName || '搜索兜底',
        srcUrl: r.url || '',
        warn: !r.date,
        stage: 'raw',
        fromCache: true,
        query: q.query || entry.query || ''
      });
    }
  }
  return out;
}

// 回写新搜索结果（由 merge_search_results.mjs 调用）
export function saveResults(entries) {
  if (!entries || !entries.length) return 0;
  const cache = readCache();
  let n = 0;
  for (const e of entries) {
    const qm = e.queryMeta || {};
    const results = e.results || [];
    if (!Array.isArray(results) || !results.length) continue;
    const rawQuery = qm.query || e.query || '';
    if (!rawQuery) continue;
    cache.entries[hash(rawQuery)] = {
      query: rawQuery,
      channel: qm.channel || e.channel || '',
      region: qm.region || qm.city || qm.scope || e.region || '',
      subRegion: qm.subRegion || qm.alias || qm.admin || e.subRegion || '',
      src: qm.bureau || qm.source || e.src || '',
      srcName: qm.bureau || qm.source || e.srcName || '',
      results: results.map(r => ({ title: r.title, url: r.url, snippet: r.snippet, date: r.date || null })),
      fetchedAt: new Date().toISOString()
    };
    n++;
  }
  prune(cache);
  writeCache(cache);
  return n;
}

// 清过期 + 控总量（按 fetchedAt 升序删最旧）
function prune(cache) {
  for (const k of Object.keys(cache.entries)) {
    if (!isFresh(cache.entries[k])) delete cache.entries[k];
  }
  let left = Object.keys(cache.entries);
  if (left.length > MAX_ENTRIES) {
    left.sort((a, b) => new Date(cache.entries[a].fetchedAt) - new Date(cache.entries[b].fetchedAt));
    for (const k of left.slice(0, left.length - MAX_ENTRIES)) delete cache.entries[k];
  }
}

export function cacheStats() {
  const cache = readCache();
  const keys = Object.keys(cache.entries);
  let fresh = 0, items = 0, t1 = 0, t2 = 0;
  for (const k of keys) {
    const e = cache.entries[k];
    if (isFresh(e)) {
      fresh++; items += e.results.length;
      if (tierOf(e) === 'tier1') t1++; else t2++;
    }
  }
  return {
    total: keys.length, fresh, items, tier1: t1, tier2: t2,
    tiers: { tier1: TIER1_TTL, tier2: TIER2_TTL, force: FORCE_TTL },
    updatedAt: cache.updatedAt || null
  };
}

// CLI：node search_cache.mjs stats | clear
if (process.argv[1] && process.argv[1].endsWith('search_cache.mjs')) {
  const cmd = process.argv[2] || 'stats';
  if (cmd === 'stats') {
    const s = cacheStats();
    console.log(`缓存统计：${s.fresh}/${s.total} 条 query 有效（${s.items} 条结果）`);
    console.log(`  分级：tier1 主城 ${s.tier1} 条 (TTL ${s.tiers.tier1}h) / tier2 偏远县 ${s.tier2} 条 (TTL ${s.tiers.tier2}h)${s.tiers.force ? ' [FORCE ' + s.tiers.force + 'h]' : ''}`);
    console.log(`  最后更新：${s.updatedAt || '无'}`);
  } else if (cmd === 'clear') {
    writeCache({ version: 1, entries: {} });
    console.log('缓存已清空');
  }
}
