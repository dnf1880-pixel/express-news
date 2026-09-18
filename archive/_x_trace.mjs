// 临时追踪脚本：单条复现 curate-light 判定链（跑完即删）
import { readFileSync } from 'node:fs';

const DATE = '2026-09-18';
const staging = JSON.parse(readFileSync('archive/staging-2026-09-18.json', 'utf8'));
const data = JSON.parse(readFileSync('data.json', 'utf8'));
const existUrls = new Set([...data.news, ...data.leads, ...data.safety].map(x => x.url).filter(Boolean));
const existTitles = new Set([...data.news, ...data.leads, ...data.safety].map(x => x.title));
const ALL = [...data.news, ...data.leads, ...data.safety];

const normTitle = t => String(t || '').replace(/["“”‘’'()（）《》【】\s·、，,。.:：;；!！?？\-—…]/g, '').replace(/(正式发布|印发|出台|发布|公布|实施|启动|召开|举行|开展|推进|印发实施)$/g, '');
const isDupEvent = (title, url) => {
  if (!/spb\.gov\.cn/.test(url || '')) return false;
  const nt = normTitle(title);
  if (nt.length < 8) return false;
  const hit = ALL.filter(x => /spb\.gov\.cn/.test(x.url || '')).find(x => {
    const o = normTitle(x.title);
    if (o.length < 8) return false;
    if (o === nt) return true;
    return Math.abs(o.length - nt.length) <= 4 && (o.startsWith(nt) || nt.startsWith(o));
  });
  if (hit) console.log('  isDupEvent HIT:', hit.title);
  return !!hit;
};

const x = staging.news.find(i => (i.name || i.title || '').includes('国家邮政局公布2026年1-8月'));
console.log('step0 存在:', !!x, '| stage:', x.stage, '| score:', x.score);
console.log('step1 existUrl:', existUrls.has(x.url), '| existTitle:', existTitles.has(x.title));
console.log('step2 isDupEvent:', isDupEvent(x.title, x.url));

// 直接 fetch inScope + resolveSort 用的页面
const r = await fetch(x.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) });
const h = await r.text();
const text = h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '').slice(0, 3000);
const IN_CITY = ['宜昌', '恩施', '荆州', '荆门', '潜江'];
const OUT_CITY = ['武汉', '襄阳', '黄冈', '咸宁', '鄂州', '孝感', '黄石', '十堰', '随州', '天门', '仙桃', '神农架'];
console.log('step3 inScope: textLen=', text.length,
  '| IN命中:', IN_CITY.filter(c => text.includes(c)),
  '| OUT命中:', OUT_CITY.filter(c => text.includes(c)));
const tm = h.match(/<title>([\s\S]*?)<\/title>/i);
console.log('页面title:', tm ? tm[1].slice(0, 60) : 'N/A');
const bd = text.slice(0, 2000).match(/20\d{2}[-/年]\s?(\d{1,2})[-/月]\s?(\d{1,2})/);
console.log('bodyDate:', bd ? bd[0] : 'null');
