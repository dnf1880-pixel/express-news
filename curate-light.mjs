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
const ALL = [...data.news, ...data.leads, ...data.safety];

// 事件级去重：同一事件在 hb.spb 与 spb 常以「…规划正式发布」「…规划印发」两种标题出现，
// 精确 title 比对挡不住，手工删掉也会被下一轮 rescue 重新并入（2026-09-02 踩坑）。
// 仅在邮政局域名内生效，规范化后相等、或前导串相同且长度差≤4 判为同事件。
const normTitle = t => String(t || '')
  .replace(/["“”‘’'()（）《》【】\s·、，,。.:：;；!！?？\-—…]/g, '')
  .replace(/(正式发布|印发|出台|发布|公布|实施|启动|召开|举行|开展|推进|印发实施)$/g, '');
const isDupEvent = (title, url) => {
  if (!/spb\.gov\.cn/.test(url || '')) return false;
  const nt = normTitle(title);
  if (nt.length < 8) return false;
  return ALL.filter(x => /spb\.gov\.cn/.test(x.url || '')).some(x => {
    const o = normTitle(x.title);
    if (o.length < 8) return false;
    if (o === nt) return true;
    return Math.abs(o.length - nt.length) <= 4 && (o.startsWith(nt) || nt.startsWith(o));
  });
};

const TARGET = ['宜昌', '恩施', '荆州', '荆门', '潜江', '湖北', '鄂西'];
// 辖区城市（四重过滤之「鄂西辖区」）：省局网站每天大量非鄂西地市动态（襄阳/黄冈/咸宁/武汉…），
// 标题常常不含城市名（如「暖"新"送政策 安居有保障」正文实为襄阳），仅凭标题挡不住 → 必须读正文判定。
const IN_CITY = ['宜昌', '恩施', '荆州', '荆门', '潜江'];
const OUT_CITY = ['武汉', '襄阳', '黄冈', '咸宁', '鄂州', '孝感', '黄石', '十堰', '随州', '天门', '仙桃', '神农架'];
// 区域命中：鄂西/湖北命中，或「国家邮政局(spb.gov.cn)全国行业信号流」——后者按设计归入 cat=行业（2026-09-02 修复：09-01 成本优化提交误删'全国'导致该通道静默断流）
const isSpb = u => /spb\.gov\.cn/.test(u || '');
// spb 全国放行口径（2026-09-04 收紧）：只放行三类——①鄂西/湖北 ②全国性竞争对手动态 ③国家层面行业信号（政策/规划/数据/标准）。
// 外省市局本地动态（山东局、济南、萍乡、四平、清远…）对鄂西无实操价值，党建/慰问类无业务内容，一律剔除。
const NATIONAL_SIGNAL = /国家邮政局|国家局|交通运输部|全国|全行业|行业|中国快递|邮政业|邮政快递业|十四五|十五五|规划|纲要|数据|指数|运行情况|印发|施行|办法|意见|通知|标准|会议部署/;
const NATIONAL_NOISE = /党建|党组|工会|慰问|群团|道德模范|文明创建|主题教育|志愿服务|青年|妇女|纪检|巡察|集邮/;
// 外省主体：标题以非湖北的省/直辖市名开头（「云南省邮政管理局…」「江西局…」「山东局…」），一律判为外省本地动态
const OUT_PROVINCE = /^(?!.*(?:湖北|鄂西|宜昌|恩施|荆州|荆门|潜江))(?:北京|天津|上海|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|内蒙古|广西|西藏|宁夏|新疆)/;
const isSpbAllowed = (t = '') => !OUT_PROVINCE.test(t) && (/湖北|鄂西|宜昌|恩施|荆州|荆门|潜江/.test(t) || (NATIONAL_SIGNAL.test(t) && !NATIONAL_NOISE.test(t)));
const inTarget = (r = '', s = '', url = '', title = '') => TARGET.some(k => `${r}/${s}`.includes(k)) || (isSpb(url) && isSpbAllowed(title));

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
  // 国家邮政局(spb.gov.cn) = 纯邮政快递域，天然相关；但仍受全国放行口径约束（外省市局本地动态/党建类不算相关）
  if (/spb\.gov\.cn/.test(url)) return isSpbAllowed(t);
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

function addNews(x, sort, warn) {
  // 省委书记调研省邮政管理局：仅当标题确含"湖北/鄂西"才由"全国"校正为"湖北"，避免把海南/青海等外省事项误标湖北
  let region = x.region || '湖北/鄂西';
  if (/省委书记/.test(x.title) && x.region === '全国' && /湖北|鄂西/.test(x.title)) region = '湖北';
  // spb 全国条目若标题明确指向某省，按该省标注（如「湖北省邮政业…规划」被 score 误标全国）
  if (region === '全国') { const pm = x.title.match(/(湖北|宜昌|恩施|荆州|荆门|潜江|鄂西)/); if (pm) region = pm[1]; }
  // 省局站点大量「XX局…」地市动态（荆州局/恩施局/荆门局…），region 被 score 一律标成"湖北"。
  // 不下沉到地市，辖区筛选与看板归类就失真 —— 按标题里的地市名校正 region/subRegion/cat。
  const cityM = x.title && x.title.match(/(宜昌|恩施|荆州|荆门|潜江)[市州]?(?:局|邮政)/);
  if (cityM) { region = cityM[1]; x.subRegion = cityM[1]; }
  data.news.push({
    level: level(x.score), cat: cat(region), region, subRegion: x.subRegion || '',
    channel: x.channel || '资讯', src: x.src || '权威', srcName: x.srcName || x.src || '检索',
    title: x.title, summary: x.snippet || x.title, reason: reason(x.title), action: action(x.title),
    s: x.s || { G: 3, B: 3, P: 3, C: 3, T: 3 }, tags: tags(x.title),
    date: `${sort.slice(5, 7)}月${sort.slice(8, 10)}日`, sort,
    url: x.url || `https://www.baidu.com/s?wd=${encodeURIComponent(x.title)}`, warn
  });
}

// spb 页面 date 字段由标题截取，常残缺为「202609-4」甚至解析出未来日期。
// 抓取 <meta name="PubDate"> 取真实发布日，避免因日期不可信而误杀真新闻。
// 同一次抓取顺带缓存正文，供辖区判定复用（每 URL 只发一次请求）。
const metaCache = new Map();
async function spbMeta(url) {
  if (metaCache.has(url)) return metaCache.get(url);
  let out = { pubDate: null, bodyDate: null, text: '' };
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) });
    const h = await r.text();
    const m = h.match(/<meta\s+name="PubDate"\s+content="(\d{4}-\d{2}-\d{2})/i);
    out.pubDate = m ? m[1] : null;
    out.text = h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '').slice(0, 3000);
    // 正文「日期：YYYY-MM-DD」才是稿件真实日期；PubDate 是 CMS 批量发布时间（实测两篇不同日期的稿
    // 子 PubDate 同为 09-02 14:11，若盲信 PubDate 会把 09-01 的稿子错标成 09-02）。正文日期优先。
    // 该 CMS 的「日期：」字段位于正文前、约 1400 字符处（去标签后），窗口取 2000 才够得着
    const bd = out.text.slice(0, 2000).match(/20\d{2}[-/年]\s?(\d{1,2})[-/月]\s?(\d{1,2})/);
    if (bd) out.bodyDate = `${bd[0].slice(0, 4)}-${bd[1].padStart(2, '0')}-${bd[2].padStart(2, '0')}`;
  } catch { /* 抓取失败：pubDate 留空，正文留空 → 辖区判定放行（宁可不误杀） */ }
  metaCache.set(url, out);
  return out;
}

async function resolveSort(x) {
  let sort = parseDate(x.date);
  if (isSpb(x.url)) {
    const m = await spbMeta(x.url);
    // 稿件真实日期优先：正文日期 > PubDate > 列表页解析出的残缺日期
    if (m.bodyDate && m.bodyDate <= DATE) sort = m.bodyDate;
    else if (!sort || sort > DATE) sort = m.pubDate || null;
  }
  return sort;
}

// 辖区判定：正文出现任一辖区城市 → 入；否则出现任一非辖区湖北地市 → 剔；
// 两端都不出现（省级/全国性内容）→ 放行，归 cat=行业。抓取失败同样放行（不因网络抖动误杀）。
async function inScope(x) {
  if (!isSpb(x.url)) return true;
  const { text } = await spbMeta(x.url);
  if (!text) return true;
  if (IN_CITY.some(c => text.includes(c))) return true;
  if (OUT_CITY.some(c => text.includes(c))) return false;
  return true;
}

let added = 0;
// 仅处理 watch 通道新增（不回填历史 raw）
for (const ch of ['news']) {
  for (const x of staging[ch].filter(x => x.stage === 'watch' && x.score >= 65 && inTarget(x.region, x.subRegion, x.url, x.title))) {
    if (existUrls.has(x.url) || existTitles.has(x.title) || isDupEvent(x.title, x.url)) continue;
    if (!relevant(x.title, x.srcName, x.url)) continue;
    if (!(await inScope(x))) continue;
    const sort = await resolveSort(x);
    if (!sort || sort < '2026-07-15' || sort > DATE) continue; // 真实发生日需在窗口内，垃圾日期跳过
    addNews(x, sort, false); added++;
  }
}
// 漏判兜底：score.mjs 对省局/国家局条目的 region 识别偏弱，湖北/鄂西信号常被误标"全国"而沉 lowValue。
// 主动扫 lowValue 中「spb 源 + 标题含湖北/鄂西地域词」的高价值条目。
const RESCUE = /湖北|鄂西|宜昌|恩施|荆州|荆门|潜江/;
for (const x of (staging.lowValue || []).filter(x => x.stage === 'watch' && x.score >= 65 && isSpb(x.url) && RESCUE.test(x.title || ''))) {
  if (existUrls.has(x.url) || existTitles.has(x.title) || isDupEvent(x.title, x.url)) continue;
  if (!relevant(x.title, x.srcName, x.url)) continue;
  if (!(await inScope(x))) continue;
  const sort = await resolveSort(x);
  if (!sort || sort < '2026-07-15' || sort > DATE) continue;
  addNews(x, sort, false); added++;
}
// watch 通道若有 leads/safety（本跑为 0，保留通用处理）
for (const ch of ['leads', 'safety']) {
  for (const x of (staging[ch] || []).filter(x => x.stage === 'watch' && x.score >= 65 && inTarget(x.region, x.subRegion, x.url, x.title))) {
    if (existUrls.has(x.url) || existTitles.has(x.title)) continue;
    const sort = (await resolveSort(x)) || DATE;
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
