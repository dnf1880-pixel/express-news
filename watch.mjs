// watch.mjs — v2 核心源看守（13 core 源变更检测，逼近准实时）
// 轻量运行（13:00/18:00）：仅对 core 源 fetch + 与 archive/last-core.json 比对，新条目 → watch-alerts-<date>.json
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATE = new Date().toISOString().slice(0, 10);
const ARCHIVE = join(__dirname, 'archive');
mkdirSync(ARCHIVE, { recursive: true });

const sources = JSON.parse(readFileSync(join(__dirname, 'sources.json'), 'utf8'));
const UA = 'Mozilla/5.0 (compatible; YTObuddyBot/2.0; +https://github.com/dnf1880-pixel/express-news)';
const DATE_RE = /(20\d{2})[-/年.]?(1[0-2]|0?[1-9])[-/月.]?(3[01]|[12]\d|0?[1-9])/;
const stripTags = s => s.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const absUrl = (h, b) => { try { return new URL(h, b).href; } catch { return h; } };

async function fetchHtml(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: ctrl.signal, redirect: 'follow' });
    if (!r.ok) return null;
    return Buffer.from(await r.arrayBuffer()).toString('utf8');
  } catch { return null; }
  finally { clearTimeout(t); }
}
function extract(html, base) {
  const out = []; const seen = new Set(); const re = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while ((m = re.exec(html)) && out.length < 60) {
    const href = absUrl(m[1], base); if (!/^https?:\/\//.test(href)) continue;
    const text = stripTags(m[2]); if (text.length < 6 || text.length > 140) continue;
    if (seen.has(href)) continue; seen.add(href);
    const d = html.slice(m.index, m.index + 200).match(DATE_RE);
    out.push({ href, text, date: d ? d[0].replace(/[年月]/g, '-').replace(/\//g, '-') : null });
  }
  return out;
}

function main() {
  const lastPath = join(ARCHIVE, 'last-core.json');
  let last = {}; try { last = JSON.parse(readFileSync(lastPath, 'utf8')); } catch {}
  const alerts = [];
  for (const c of sources.core) {
    const html = fetchHtml(c.url);
    if (!html) continue;
    const items = extract(html, c.url);
    const prev = new Set(last[c.url] || []);
    const cur = [];
    for (const it of items) {
      cur.push(it.href);
      if (!prev.has(it.href)) {
        alerts.push({ title: it.text, url: it.href, date: it.date, channel: c.channel || '资讯', region: c.scope, subRegion: '', src: '权威', srcName: c.name, srcUrl: c.url, warn: !it.date, stage: 'watch', isNew: true });
      }
    }
    last[c.url] = cur;
  }
  writeFileSync(lastPath, JSON.stringify(last, null, 2));
  const ap = join(ARCHIVE, `watch-alerts-${DATE}.json`);
  writeFileSync(ap, JSON.stringify({ date: DATE, generatedAt: new Date().toISOString(), alerts }, null, 2));
  console.log(`✓ 看守完成：core ${sources.core.length} 源，新条目 ${alerts.length} 条 → ${ap}`);
  return alerts.length;
}
main();
