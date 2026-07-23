// merge_search_results.mjs — 将 search-results-*.json 合并进 raw-<date>.json 的 searched 数组
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const ARCHIVE = join(__dirname, 'archive');

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

const files = readdirSync(ARCHIVE).filter(f => f.startsWith('search-results-') && f.endsWith('.json')).sort();
if (!files.length) { console.log('无 search-results-*.json，跳过合并'); process.exit(0); }

const merged = [];
for (const f of files) {
  const arr = JSON.parse(readFileSync(join(ARCHIVE, f), 'utf8'));
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
  }
}

const rawPath = join(ARCHIVE, `raw-${DATE}.json`);
if (!existsSync(rawPath)) { console.error('raw 文件不存在:', rawPath); process.exit(1); }
const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
raw.searched = merged;
raw.meta.searchedCount = merged.length;
writeFileSync(rawPath, JSON.stringify(raw, null, 2));
console.log(`✓ 合并完成：${files.length} 个结果文件 → ${merged.length} 条搜索命中 → ${rawPath}`);
