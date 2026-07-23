// scrape.mjs — v2 抓取层（脚本爬虫 + 搜索任务派发）
// ① 对带 url 的 query（core/ecom/safety，含 fetch / fetch-or-search）用 Node fetch 真爬，提取候选条目
// ② 对 search 类 query：若配置了 SEARCH_API_KEY 则脚本直接搜；否则写入 archive/search-todo.json 由 agent 执行
// 全量原始命中落盘到 archive/raw-<date>.json（脏数据也留，评分阶段再筛）
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATE = new Date().toISOString().slice(0, 10);
const ARCHIVE = join(__dirname, 'archive');
mkdirSync(ARCHIVE, { recursive: true });

const SEARCH_API_KEY = process.env.SEARCH_API_KEY || '';
const SEARCH_ENGINE = (process.env.SEARCH_ENGINE || 'bing').toLowerCase();
const CONCURRENCY = 6;

const queries = JSON.parse(readFileSync(join(__dirname, 'queries.json'), 'utf8')).queries;

const DATE_RE = /(20\d{2})[-/年.]?(1[0-2]|0?[1-9])[-/月.]?(3[01]|[12]\d|0?[1-9])/;
const UA = 'Mozilla/5.0 (compatible; YTObuddyBot/2.0; +https://github.com/dnf1880-pixel/express-news)';

function stripTags(s) { return s.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim(); }
function absUrl(href, base) { try { return new URL(href, base).href; } catch { return href; } }

async function fetchHtml(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' }, signal: ctrl.signal, redirect: 'follow' });
    if (!r.ok) return { ok: false, status: r.status };
    const buf = Buffer.from(await r.arrayBuffer());
    return { ok: true, html: buf.toString('utf8') };
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally { clearTimeout(t); }
}

function extractItems(html, baseUrl, q) {
  const out = [];
  const seen = new Set();
  const re = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < 60) {
    const href = absUrl(m[1], baseUrl);
    if (!/^https?:\/\//.test(href)) continue;
    const text = stripTags(m[2]);
    if (text.length < 6 || text.length > 140) continue;
    if (/^(首页|返回|更多|下载|登录|注册|网站地图|版权)/.test(text)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    const dateM = html.slice(m.index, m.index + 200).match(DATE_RE);
    out.push({
      title: text,
      url: href,
      date: dateM ? dateM[0].replace(/[年月]/g, '-').replace(/\//g, '-') : null,
      snippet: '',
      channel: q.channel || '资讯',
      region: q.scope || q.city || (q.region || ''),
      subRegion: q.alias || q.admin || '',
      src: q.source || q.bureau || q.src || '权威',
      srcName: q.source || q.bureau || q.srcName || '官方源',
      srcUrl: baseUrl,
      warn: !dateM,
      stage: 'raw'
    });
  }
  return out;
}

async function searchViaApi(query) {
  // 搜索 API 桥（默认 Bing Web Search v7）。无 key 时返回 null，交由 agent 兜底。
  if (!SEARCH_API_KEY) return null;
  try {
    const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=5&mkt=zh-CN`;
    const r = await fetch(url, { headers: { 'Ocp-Apim-Subscription-Key': SEARCH_API_KEY } });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.webPages?.value || []).map(v => ({
      title: v.name, url: v.url, snippet: stripTags(v.snippet || ''), date: null,
      warn: true, stage: 'raw'
    }));
  } catch { return []; }
}

async function pool(items, worker, size = CONCURRENCY) {
  const ret = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    const res = await Promise.all(batch.map(worker));
    res.forEach(r => r && ret.push(...r));
  }
  return ret;
}

async function main() {
  const urlQs = queries.filter(q => q.url && (q.type === 'fetch' || q.type === 'fetch-or-search'));
  const searchQs = queries.filter(q => q.type === 'search');
  const fsQs = queries.filter(q => q.type === 'fetch-or-search');

  console.log(`爬虫层：URL源 ${urlQs.length} 个，搜索任务 ${searchQs.length} 条，fetch-or-search ${fsQs.length} 个`);

  const fetched = await pool(urlQs, async (q) => {
    const res = await fetchHtml(q.url);
    if (!res.ok) {
      // fetch 失败 → 降级为搜索任务
      if (q.type === 'fetch-or-search') searchQs.push({ ...q, degraded: true });
      else searchQs.push({ ...q, degraded: true, query: `${q.source} ${q.scope} 最新公告 快递`, channel: q.channel, scope: q.scope });
      return [];
    }
    const items = extractItems(res.html, q.url, q);
    // JS 渲染页（如地震台网）fetch 成功但提取 0 条 → 同样降级为搜索
    if (items.length === 0 && q.type === 'fetch-or-search') {
      searchQs.push({ ...q, degraded: true, query: `${q.source} ${q.scope} 最新 ${q.channel === '安全' ? '预警 事故' : '动态'}` });
    }
    console.log(`  ✓ ${q.source || q.url}: ${items.length} 条`);
    return items;
  });

  // fetch-or-search：优先 fetch 已处理；仍想补搜索的，派发到 todo（仅当配了 API 或 agent 模式）
  const todo = [];
  // 纯 search 类 + 降级类
  for (const q of searchQs) {
    if (SEARCH_API_KEY) {
      const r = await searchViaApi(q.query || `${q.bureau} ${q.alias} 快递`);
      if (r && r.length) { r.forEach(x => { x.channel = q.channel; x.region = q.city || q.scope; x.subRegion = q.alias || q.admin; x.src = q.bureau || '检索'; x.srcName = q.bureau || q.source || '检索'; }); fetched.push(...r); }
      else todo.push(q);
    } else {
      todo.push(q);
    }
  }

  const rawPath = join(ARCHIVE, `raw-${DATE}.json`);
  let raw = { date: DATE, generatedAt: new Date().toISOString(), fetched: [], searched: [], meta: { fetchedCount: 0, searchedCount: 0 } };
  if (existsSync(rawPath)) { try { raw = JSON.parse(readFileSync(rawPath, 'utf8')); } catch {} }
  raw.fetched.push(...fetched);
  raw.meta.fetchedCount = raw.fetched.length;
  writeFileSync(rawPath, JSON.stringify(raw, null, 2));

  const todoPath = join(ARCHIVE, 'search-todo.json');
  writeFileSync(todoPath, JSON.stringify({ date: DATE, count: todo.length, queries: todo }, null, 2));

  console.log(`✓ 爬虫完成：fetch 命中 ${fetched.length} 条 → ${rawPath}`);
  console.log(`✓ 搜索任务 ${todo.length} 条 → ${todoPath}${SEARCH_API_KEY ? '' : '（agent 执行 / 或配置 SEARCH_API_KEY 启用脚本搜索）'}`);
}

main().catch(e => { console.error('scrape.mjs 失败:', e); process.exit(1); });
