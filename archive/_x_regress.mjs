// 临时回归脚本：新旧 bodyDate 正则对比（跑完即删）
const staging = JSON.parse((await import('node:fs')).readFileSync('archive/staging-2026-09-18.json', 'utf8'));
const items = [...staging.news, ...staging.lowValue].filter(x => /spb\.gov\.cn/.test(x.url || '') && x.score >= 55);
console.log('spb 条目数:', items.length);
let diff = 0;
for (const x of items) {
  let h = '';
  try { h = await (await fetch(x.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) })).text(); } catch { continue; }
  const text = h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '').slice(0, 2000);
  const oldM = text.match(/20\d{2}[-/年]\s?(\d{1,2})[-/月]\s?(\d{1,2})/);
  const newM = text.match(/20\d{2}[-/年]\s?(\d{1,2})[-/月]\s?(\d{1,2})(?!\s*月)/);
  const fmt = m => m ? `${m[0].slice(0, 4)}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : null;
  const o = fmt(oldM), n = fmt(newM);
  if (o !== n) { diff++; console.log(`DIFF | ${(x.name || x.title).slice(0, 40)} | old=${o} new=${n}`); }
}
console.log(`差异条数: ${diff}`);
