// curate-light.mjs — 轻量增量策展（L3）：仅并入本次 watch 新增高价值条目，保留既有。
// 与 curate.mjs 不同：不重跑区县搜索、不做历史噪音清理（保留既有条目），只追加 stage==='watch' 的新高价值条目。
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const cwd = process.cwd();
const staging = JSON.parse(readFileSync(join(cwd, 'archive', `staging-${DATE}.json`), 'utf8'));
const dataPath = join(cwd, 'data.json');
const data = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, 'utf8')) : { news: [], leads: [], safety: [] };
if (!data.news) data.news = [];
if (!data.leads) data.leads = [];
if (!data.safety) data.safety = [];

const existUrls = new Set([...data.news, ...data.leads, ...data.safety].map(x => x.url).filter(Boolean));
const existTitles = new Set([...data.news, ...data.leads, ...data.safety].map(x => x.title));

const TARGET = ['宜昌', '恩施', '荆州', '荆门', '潜江', '湖北', '鄂西'];
const inTarget = (r = '', s = '') => TARGET.some(k => `${r}/${s}`.includes(k));

const CORE = ['快递', '物流', '寄递', '邮政', '快件', '包裹', '网点', '分拣', '转运', '末端', '派送', '揽收', '时效', '客货邮', '进村', '冷链', '跨境', '配送', '闪送', '无人机', '分拨', '收寄', '安检', '验视', '过机'];
const COMP = ['圆通', '顺丰', '京东', '中通', '韵达', '极兔', '申通', '德邦', '菜鸟', '丰巢'];
// 仅天气/消防类可放行"裸安全/隐患"类标题；泛政务安全(沼气/河道/环评/交警/公路/出行)一律剔除
const WEATHER = ['台风', '暴雨', '防汛', '防洪', '洪涝', '地质灾害', '封路', '管制', '预警', '事故', '塌方', '垮塌', '中断', '强降雨', '降雨', '大风', '停运', '闭园'];
const SAFE = ['消防'];
const FUEL = ['成品油', '加注站', '加油站', '燃油'];
const has = (t, kws) => kws.some(k => t.includes(k));

function relevant(title = '', srcName = '', url = '') {
  const t = title;
  // 燃油/加注站整治（非寄递设施安全）一律剔除，优先级最高
  if (has(t, FUEL) && !has(t, [...CORE, ...COMP])) return false;
  // 国家邮政局(spb.gov.cn) = 纯邮政快递域，天然相关
  if (/spb\.gov\.cn/.test(url)) return true;
  // 地市"邮政管理局"源实际抓市政府页：必须含快递/物流/寄递/邮政/网点等核心词，或天气/消防类运营安全，否则视为泛政务噪音剔除
  return has(t, [...CORE, ...COMP, ...WEATHER, ...SAFE]);
}

function parseDate(d) {
  if (!d) return null;
  const m = String(d).match(/(20\d{2})[-/年.]?(1[0-2]|0?[1-9])[-/月.]?(3[01]|[12]\d|0?[1-9])?/);
  if (!m) return null;
  const y = m[1], mo = m[2].padStart(2, '0'), da = (m[3] || '01').padStart(2, '0');
  return `${y}-${mo}-${da}`;
}
const level = s => s >= 75 ? 'red' : s >= 55 ? 'orange' : 'green';
const cat = r => (['宜昌', '恩施', '荆州', '荆门', '潜江'].some(k => r.includes(k))) ? r.replace('湖北', '') || '湖北' : (r.includes('湖北') ? '湖北' : '行业');
const tags = t => { const x = []; if (/消防|安全|隐患|整治/.test(t)) x.push('安全'); if (/台风|暴雨|防汛|预警/.test(t)) x.push('天气'); if (/电商|直播|产业带|水果|农产品|寄递|快递/.test(t)) x.push('电商'); if (/会议|调度|政策|监管/.test(t)) x.push('监管'); return x.length ? x.slice(0, 4) : ['资讯']; };
const reason = t => { const r = '辖区'; if (/消防|安全|隐患|整治/.test(t)) return '安全整治直接关联网点消防、过机安检与质量分，需跟踪整改闭环。'; if (/台风|暴雨|防汛|封路|管制|预警/.test(t)) return '天气/路况影响末端派送与干线时效，需提前预警网点。'; if (/产业园|电商|水果|寄递|招商|直播|产业带|农村/.test(t)) return '电商/产业带/农村寄递释放增量，值得网点主动揽收。'; if (/会议|调度|部署|政策|监管/.test(t)) return '监管层面新动向，影响合规导向与考核重点，需周会传达。'; return '最新监管/市场动态，建议纳入日常关注和网点通报。'; };
const action = t => { if (/消防|安全|隐患|整治/.test(t)) return '→ 排查辖区网点消防与安检隐患，48小时内反馈整改。'; if (/台风|暴雨|防汛|封路|管制|预警/.test(t)) return '→ 启动恶劣天气应急预案，调整路由与派送班次。'; if (/产业园|电商|水果|寄递|招商|直播|产业带|农村/.test(t)) return '→ 联系属地网点上门对接，测算揽收潜力。'; if (/会议|调度|部署|政策|监管/.test(t)) return '→ 周会传达，对齐合规与质量分要求。'; return '→ 关注后续进展，必要时通报网点。'; };

function addNews(x) {
  const sort = parseDate(x.date) || DATE;
  const warn = !parseDate(x.date);
  // 省委书记调研省邮政管理局：仅当标题确含"湖北/鄂西"才由"全国"校正为"湖北"，避免把海南/青海等外省事项误标湖北
  let region = x.region || '湖北/鄂西';
  if (/省委书记/.test(x.title) && x.region === '全国' && /湖北|鄂西/.test(x.title)) region = '湖北';
  data.news.push({
    level: level(x.score), cat: cat(region), region, subRegion: x.subRegion || '',
    channel: x.channel || '资讯', src: x.src || '权威', srcName: x.srcName || x.src || '检索',
    title: x.title, summary: x.snippet || x.title, reason: reason(x.title), action: action(x.title),
    s: x.s || { G: 3, B: 3, P: 3, C: 3, T: 3 }, tags: tags(x.title),
    date: `${sort.slice(5, 7)}月${sort.slice(8, 10)}日`, sort,
    url: x.url || `https://www.baidu.com/s?wd=${encodeURIComponent(x.title)}`, warn
  });
}

let added = 0;
// 仅处理 watch 通道新增（不回填历史 raw）
for (const ch of ['news']) {
  for (const x of staging[ch].filter(x => x.stage === 'watch' && x.score >= 65 && inTarget(x.region, x.subRegion))) {
    if (existUrls.has(x.url) || existTitles.has(x.title)) continue;
    if (!relevant(x.title, x.srcName, x.url)) continue;
    const sort = parseDate(x.date);
    if (!sort || sort < '2026-07-15' || sort > DATE) continue; // 真实发生日需在窗口内，垃圾日期跳过
    addNews(x); added++;
  }
}
// watch 通道若有 leads/safety（本跑为 0，保留通用处理）
for (const ch of ['leads', 'safety']) {
  for (const x of (staging[ch] || []).filter(x => x.stage === 'watch' && x.score >= 65 && inTarget(x.region, x.subRegion))) {
    if (existUrls.has(x.url) || existTitles.has(x.title)) continue;
    const sort = parseDate(x.date) || DATE;
    if (ch === 'leads') data.leads.push({ name: x.name || x.title, biz: x.biz || '待核实', region: x.region || '待核实', admin: x.subRegion || x.region || '待核实', tier: x.tier || '区县', address: x.address || '待核实', contact: x.contact || '待核实', reason: x.reason || '电商/产业带寄递线索，值得网点对接。', scale: x.scale || '待核实', seasonal: x.seasonal || '待核实', src: x.src || '检索', srcName: x.srcName || x.src, url: x.url || `https://www.baidu.com/s?wd=${encodeURIComponent(x.name || '')}`, date: `${sort.slice(5, 7)}月${sort.slice(8, 10)}日`, sort, warn: !parseDate(x.date), score: x.score, level: level(x.score) });
    else data.safety.push({ title: x.title, summary: x.snippet || x.title, reason: x.reason || '影响辖区末端派送与干线时效，需预警网点。', subRegion: x.subRegion || '', region: x.region || '湖北/鄂西', src: x.src || '权威', srcName: x.srcName || x.src, date: `${sort.slice(5, 7)}月${sort.slice(8, 10)}日`, sort, score: x.score, level: level(x.score), tags: tags(x.title), warn: !parseDate(x.date), url: x.url || `https://www.baidu.com/s?wd=${encodeURIComponent(x.title)}` });
    added++;
  }
}

data.news.sort((a, b) => { if (a.sort === b.sort) return 0; if (a.level === 'red' && b.level !== 'red') return -1; if (b.level === 'red' && a.level !== 'red') return 1; return b.sort.localeCompare(a.sort); });
data.safety.sort((a, b) => b.sort.localeCompare(a.sort));
data.updatedAt = DATE;
data.note = `轻量补抓 ${DATE}（核心源看守）：仅并入 watch 新增高价值 ${added} 条，保留既有条目。`;

writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`✓ 轻量策展完成：新增 ${added} 条 · 资讯 ${data.news.length} · 电商线索 ${data.leads.length} · 安全 ${data.safety.length}`);
