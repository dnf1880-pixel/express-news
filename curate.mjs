// curate.mjs — S4 AI 策展：读 staging，挑高价值条目写 data.json
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const TARGET_REGIONS = new Set(['宜昌', '恩施', '荆州', '荆门', '潜江', '湖北', '全国', '鄂西', '湖北/鄂西', '湖北/鄂州']);

function loadJson(p) { return JSON.parse(readFileSync(p, 'utf8')); }

const staging = loadJson(join(process.cwd(), 'archive', `staging-${DATE}.json`));
const dataPath = join(process.cwd(), 'data.json');
const existing = existsSync(dataPath) ? loadJson(dataPath) : { news: [], leads: [], safety: [] };

const existingUrls = new Set();
[...existing.news, ...existing.leads, ...existing.safety].forEach(x => {
  if (x.url) existingUrls.add(x.url);
});

function inTargetRegion(region = '', subRegion = '') {
  const r = `${region}/${subRegion}`;
  return ['宜昌', '恩施', '荆州', '荆门', '潜江', '湖北', '全国', '鄂西'].some(k => r.includes(k));
}

function parseDate(d) {
  if (!d) return null;
  const s = String(d);
  const m = s.match(/(20\d{2})[-/年.]?(1[0-2]|0?[1-9])[-/月.]?(3[01]|[12]\d|0?[1-9])?/);
  if (!m) return null;
  const y = m[1], mo = m[2].padStart(2, '0'), da = (m[3] || '01').padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

function fmtDate(d, fallbackDate) {
  const p = parseDate(d);
  if (p) {
    const [y, mo, da] = p.split('-');
    return { date: `${mo}月${da}日`, sort: p, warn: false };
  }
  // 无法确认真实发生日：用运行时的系统时间兜底，warn 标待核实
  const fb = fallbackDate || DATE;
  const [y, mo, da] = fb.split('-');
  return { date: `${mo}月${da}日`, sort: fb, warn: true };
}

// 内容相关性判定：党政宣传/文体活动/纯农业招商 无核心业务词则判为不相关
const CORE_KWS = ['快递', '物流', '寄递', '邮政', '快件', '包裹', '网点', '分拣', '转运', '干线', '末端', '派送', '揽收', '时效', '投递', '邮管', '客货邮', '进村', '出海', '冷链', '跨境'];
const BIZ_KWS = ['整治', '通报', '投诉', '质量', '安全', '消防', '隐患', '调度', '监管', '政策', '标准', '电商', '直播', '产业带', '水果', '生鲜', '农产品', '村播', '招商', '物流园', '产业园', '基地', '项目'];
const COMP_KWS = ['圆通', '顺丰', '京东', '中通', '韵达', '极兔', '申通', '德邦', '菜鸟', '丰巢'];
const NOISE_KWS = ['党建', '党', '支部', '党员', '跟党走', '学习', '贯彻', '精神', '文明', '道德', '典型', '礼遇', '表彰', '工会', '团委', '团建', '志愿者', '志愿服务', '宣讲', '读书', '文化', '体育', '篮球', '足球', '比赛', '运动会', '文艺', '汇演', '演讲', '征文', '竞赛', '扶贫', '振兴', '乡村', '三农', '农业招商', '农业发展', '德者有得'];
const STRONG_EXEMPT_KWS = [...CORE_KWS, ...COMP_KWS, '安全', '整治', '消防', '隐患', '监管', '通报', '投诉', '质量'];

function has(t, kws) { return kws.some(k => t.includes(k)); }
function isRelevantNews(title = '', body = '') {
  const t = title + ' ' + body;
  const hasCore = has(t, CORE_KWS);
  const hasBiz = has(t, BIZ_KWS);
  const hasComp = has(t, COMP_KWS);
  const hasNoise = has(t, NOISE_KWS);
  // 党政/文体/纯农业招商等强噪音，必须同时含核心物流/安全/竞争词才算相关
  if (hasNoise && !(hasCore || hasComp || has(t, STRONG_EXEMPT_KWS))) return false;
  return hasCore || hasBiz || hasComp;
}

// 安全事件白名单：天气/地震/台风/违禁品寄递/人车/消防事件即使不含快递词也保留
const SAFETY_EVENT_KWS = ['台风', '暴雨', '暴雪', '大雾', '寒潮', '冰冻', '高温', '雷电', '大风', '洪涝', '内涝', '地质灾害', '山洪', '地震', '震感', '预警', '封路', '封闭', '管制', '事故', '火灾', '消防', '爆炸', '危化', '违禁品', '禁寄', '查获', '涉毒', '易燃', '易爆', '交通安全', '车辆'];
function isRelevantSafety(title = '', body = '') {
  const t = title + ' ' + body;
  if (has(t, NOISE_KWS) && !has(t, [...SAFETY_EVENT_KWS, ...CORE_KWS, ...COMP_KWS])) return false;
  return has(t, SAFETY_EVENT_KWS) || isRelevantNews(title, body);
}

// 清理明显非新闻的噪音条目
function isNoiseTitle(title = '') {
  const t = title.toLowerCase();
  return /京公网安备|备案号|icp|版权所有|©|all rights reserved|隐私政策|用户协议|网站地图|联系我们/.test(t);
}


function normalizeEntryDate(n) {
  if (n.sort && /^\d{4}-\d{2}-\d{2}$/.test(n.sort) && n.sort !== '0000-00-00') {
    const [y, mo, da] = n.sort.split('-');
    n.date = `${mo}月${da}日`;
  } else if (n.sort === '0000-00-00' || !n.sort) {
    // 旧数据：用抓取日期兜底并标记待核实
    n.sort = DATE;
    n.warn = true;
    const [y, mo, da] = DATE.split('-');
    n.date = `${mo}月${da}日`;
  }
}

function scoreToLevel(score) {
  if (score >= 75) return 'red';
  if (score >= 55) return 'orange';
  return 'green';
}

function reasonForNews(item) {
  const t = item.title || '';
  const region = item.region || item.subRegion || '辖区';
  if (/消防|安全|隐患|整治/.test(t)) return `${region}安全整治直接关联网点消防、过机安检与质量分，需跟踪整改闭环。`;
  if (/台风|暴雨|封路|交通管制|预警/.test(t)) return `${region}天气/路况影响末端派送与干线时效，需提前预警网点。`;
  if (/产业园|电商|水果|寄递|招商|直播|产业带/.test(t)) return `${region}电商/产业带释放寄递增量，值得网点主动揽收。`;
  if (/会议|调度|部署|精神|政策/.test(t)) return `监管层面新动向，影响辖区合规导向与考核重点，需周会传达。`;
  if (/圆通/.test(t)) return `总部层面动态，直接影响辖区政策、派费与资源投放。`;
  return `${region}最新监管/市场动态，建议纳入日常关注和网点通报。`;
}

function actionForNews(item) {
  const t = item.title || '';
  if (/消防|安全|隐患|整治/.test(t)) return '→ 排查辖区网点消防与安检隐患，48小时内反馈整改。';
  if (/台风|暴雨|封路|交通管制|预警/.test(t)) return '→ 启动恶劣天气应急预案，调整路由与派送班次。';
  if (/产业园|电商|水果|寄递|招商|直播|产业带/.test(t)) return '→ 联系属地网点上门对接，测算揽收潜力。';
  if (/会议|调度|部署|精神|政策/.test(t)) return '→ 周会传达，对齐合规与质量分要求。';
  if (/圆通/.test(t)) return '→ 跟踪总部细则，及时调整辖区策略。';
  return '→ 关注后续进展，必要时通报网点。';
}

function tagsForNews(item) {
  const t = item.title + ' ' + (item.snippet || '');
  const tags = [];
  if (/消防/.test(t)) tags.push('消防');
  if (/安全|隐患|整治/.test(t)) tags.push('安全');
  if (/台风|暴雨|预警/.test(t)) tags.push('天气');
  if (/交通管制|封路|高速/.test(t)) tags.push('路况');
  if (/电商|直播|产业带|水果|农产品/.test(t)) tags.push('电商');
  if (/会议|调度|政策/.test(t)) tags.push('监管');
  if (/圆通/.test(t)) tags.push('圆通');
  if (tags.length === 0) tags.push('资讯');
  return tags.slice(0, 4);
}

function catForNews(item) {
  const r = item.region || '';
  if (['宜昌', '恩施', '荆州', '荆门', '潜江'].some(k => r.includes(k))) return r;
  if (r.includes('湖北')) return '湖北';
  return '行业';
}

function channelForNews(item) {
  return item.channel || '资讯';
}

function srcNameFor(item) {
  return item.srcName || item.src || item.bureau || '检索';
}

// === 新增资讯 ===
const newNews = staging.news
  .filter(x => (x.score >= 65) && inTargetRegion(x.region, x.subRegion) && !existingUrls.has(x.url))
  .filter(x => !isNoiseTitle(x.title))
  .filter(x => isRelevantNews(x.title, x.snippet || x.summary))
  .filter(x => {
    const sort = parseDate(x.date);
    return sort && sort >= '2026-07-15';
  })
  .slice(0, 15);


for (const x of newNews) {
  const fd = fmtDate(x.date);
  existing.news.push({
    level: scoreToLevel(x.score),
    cat: catForNews(x),
    region: x.region || x.subRegion || '湖北/鄂西',
    subRegion: x.subRegion || x.region || '',
    channel: channelForNews(x),
    src: x.src || '权威',
    srcName: srcNameFor(x),
    title: x.title,
    summary: x.snippet || x.title,
    reason: reasonForNews(x),
    action: actionForNews(x),
    s: x.s || { G: 3, B: 3, P: 3, C: 3, T: 3 },
    tags: tagsForNews(x),
    date: fd.date,
    sort: fd.sort,
    url: x.url || `https://www.baidu.com/s?wd=${encodeURIComponent(x.title)}`,
    warn: fd.warn
  });
}

// === 新增电商线索 ===
const newLeads = staging.leads
  .filter(x => (x.score >= 65) && inTargetRegion(x.region, x.subRegion) && !existingUrls.has(x.url))
  .slice(0, 10);

for (const x of newLeads) {
  const fd = fmtDate(x.date);
  existing.leads.push({
    name: x.name || x.title || '待核实',
    biz: x.biz || '待核实',
    region: x.region || x.subRegion || '待核实',
    admin: x.admin || x.subRegion || x.region || '待核实',
    tier: x.tier || '区县',
    address: x.address || '待核实',
    contact: x.contact || '待核实',
    reason: x.reason || `(${x.region || ''}) 电商/产业带寄递线索，值得网点主动对接。`,
    scale: x.scale || '待核实',
    seasonal: x.seasonal || '待核实',
    src: x.src || '检索',
    srcName: srcNameFor(x),
    url: x.url || `https://www.baidu.com/s?wd=${encodeURIComponent(x.name || x.title || '')}`,
    date: fd.date,
    sort: fd.sort,
    warn: fd.warn,
    score: x.score,
    level: scoreToLevel(x.score)
  });
}

// === 字段补齐 + 日期规范化（旧条目） ===
for (const l of existing.leads) {
  normalizeEntryDate(l);
  if (!('url' in l)) l.url = `https://www.baidu.com/s?wd=${encodeURIComponent(l.name || '')}`;
}

// === 新增安全事件 ===
const newSafety = staging.safety
  .filter(x => (x.score >= 65) && inTargetRegion(x.region, x.subRegion) && !existingUrls.has(x.url))
  .filter(x => !isNoiseTitle(x.title))
  .filter(x => {
    const sort = parseDate(x.date);
    return sort && sort >= '2026-07-15';
  })
  .slice(0, 10);

for (const x of newSafety) {
  const fd = fmtDate(x.date);
  existing.safety.push({
    title: x.title,
    summary: x.snippet || x.title,
    reason: x.reason || `影响 ${x.region || x.subRegion || '辖区'} 末端派送与干线时效，需预警网点。`,
    subRegion: x.subRegion || x.region || '',
    region: x.region || x.subRegion || '湖北/鄂西',
    src: x.src || '权威',
    srcName: srcNameFor(x),
    date: fd.date,
    sort: fd.sort,
    score: x.score,
    level: scoreToLevel(x.score),
    tags: tagsForNews(x),
    warn: fd.warn,
    url: x.url || `https://www.baidu.com/s?wd=${encodeURIComponent(x.title)}`
  });
}

// === 字段补齐 + 日期规范化（旧条目） ===
for (const n of existing.news) {
  if (!('subRegion' in n)) n.subRegion = '';
  if (!('channel' in n)) n.channel = '资讯';
  normalizeEntryDate(n);
  if (!('warn' in n)) n.warn = n.sort === DATE;
}
for (const s of existing.safety) {
  normalizeEntryDate(s);
  if (!('warn' in s)) s.warn = s.sort === DATE;
}

// === 清理历史噪音 ===
existing.news = existing.news.filter(x => !isNoiseTitle(x.title) && isRelevantNews(x.title, x.summary || x.snippet || ''));
existing.safety = existing.safety.filter(x => !isNoiseTitle(x.title) && isRelevantSafety(x.title, x.summary || x.snippet || ''));


// === 去重 ===
function dedup(arr, keyFn) {
  const seen = new Set();
  return arr.filter(x => { const k = keyFn(x); if (seen.has(k)) return false; seen.add(k); return true; });
}
existing.news = dedup(existing.news, x => x.url || x.title);
existing.leads = dedup(existing.leads, x => (x.name + '|' + x.region + '|' + x.biz));
existing.safety = dedup(existing.safety, x => x.url || x.title);

// === 排序 ===
existing.news.sort((a, b) => {
  if (a.sort === '0000-00-00' && b.sort !== '0000-00-00') return 1;
  if (b.sort === '0000-00-00' && a.sort !== '0000-00-00') return -1;
  if (a.level === 'red' && b.level !== 'red') return -1;
  if (b.level === 'red' && a.level !== 'red') return 1;
  return b.sort.localeCompare(a.sort);
});
existing.safety.sort((a, b) => {
  if (a.sort === '0000-00-00' && b.sort !== '0000-00-00') return 1;
  if (b.sort === '0000-00-00' && a.sort !== '0000-00-00') return -1;
  return b.sort.localeCompare(a.sort);
});

existing.updatedAt = DATE;
existing.note = `每日刷新 ${DATE}（信源清单驱动：13 core 直连 + 43 区县定向 + 11 专项）。保留昨日高价值条目，追加今日真实抓取；低价值条目沉淀不进入前端。`;

writeFileSync(dataPath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`✓ data.json 写入：资讯 ${existing.news.length} · 电商线索 ${existing.leads.length} · 安全 ${existing.safety.length}`);
