// score.mjs — v2 评分层（存档 → 脚本基础评分 → staging 供 AI 策展）
// 读 archive/raw-<date>.json + archive/watch-alerts-<date>.json，去重、三通道归类，按 v1 权重算基础分，
// 输出 staging-<date>.json。AI（agent）读取 staging 做最终策展写入 data.json。
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATE = new Date().toISOString().slice(0, 10);

const W = { G: 0.28, B: 0.26, P: 0.20, C: 0.14, T: 0.12 };
const Wleads = { vol: 0.30, fit: 0.30, urgent: 0.25, sustain: 0.15 };
const comp5 = s => Math.round(20 * (W.G * s.G + W.B * s.B + W.P * s.P + W.C * s.C + W.T * s.T));
const comp4 = s => Math.round(20 * (Wleads.vol * s.vol + Wleads.fit * s.fit + Wleads.urgent * s.urgent + Wleads.sustain * s.sustain));
const levelOf = w => (w >= 75 ? 'red' : w >= 55 ? 'orange' : 'green');

const HUBEI = ['湖北', '宜昌', '恩施', '荆州', '荆门', '潜江', '鄂西', '武汉', '花湖'];
const has = (t, kws) => kws.some(k => t.includes(k));

// 内容相关性判定：党政宣传/文体活动/纯农业招商 若无快递/物流/寄递/电商/产业带/安全等核心词，则判为不相关
const CORE_KWS = ['快递', '物流', '寄递', '邮政', '快件', '包裹', '网点', '分拣', '转运', '干线', '末端', '派送', '揽收', '时效', '投递', '邮管', '客货邮', '进村', '出海', '冷链', '跨境'];
const BIZ_KWS = ['整治', '通报', '投诉', '质量', '安全', '消防', '隐患', '调度', '监管', '政策', '标准', '电商', '直播', '产业带', '水果', '生鲜', '农产品', '村播', '招商', '物流园', '产业园', '基地', '项目'];
const COMP_KWS = ['圆通', '顺丰', '京东', '中通', '韵达', '极兔', '申通', '德邦', '菜鸟', '丰巢'];
const NOISE_KWS = ['党建', '党', '支部', '党员', '跟党走', '学习', '贯彻', '精神', '文明', '道德', '典型', '礼遇', '表彰', '工会', '团委', '团建', '志愿者', '志愿服务', '宣讲', '读书', '文化', '体育', '篮球', '足球', '比赛', '运动会', '文艺', '汇演', '演讲', '征文', '竞赛', '扶贫', '振兴', '乡村', '三农', '农业招商', '农业发展', '德者有得'];
const STRONG_EXEMPT_KWS = [...CORE_KWS, ...COMP_KWS, '安全', '整治', '消防', '隐患', '监管', '通报', '投诉', '质量'];

function isRelevantNews(t = '') {
  const hasCore = has(t, CORE_KWS);
  const hasBiz = has(t, BIZ_KWS);
  const hasComp = has(t, COMP_KWS);
  const hasNoise = has(t, NOISE_KWS);
  // 党政/文体/纯农业招商等强噪音，必须同时含核心物流/安全/竞争词才算相关
  if (hasNoise && !(hasCore || hasComp || has(t, STRONG_EXEMPT_KWS))) return false;
  // 完全不含核心、业务、竞争词 → 不相关
  return hasCore || hasBiz || hasComp;
}


function baseNewsScores(it) {
  const t = (it.title || '') + ' ' + (it.snippet || '');
  let G = 3, B = 3, P = 3, C = 3, T = 3;
  if (HUBEI.some(h => (it.region || '').includes(h) || t.includes(h))) G = 5; else if (it.region && it.region !== '全国') G = 4;
  if (has(t, ['整治', '通报', '投诉', '质量', '时效', '揽收', '网点', '进村', '客货邮'])) B = 4;
  if (has(t, ['政策', '局', '通知', '办法', '标准', '反内卷', '监管', '会议'])) P = 4;
  if (has(t, ['顺丰', '京东', '中通', '韵达', '极兔', '申通', '德邦'])) C = 4;
  const d = it.date ? new Date(it.date) : null;
  if (it.warn || !d) T = 2;
  else { const days = (Date.now() - d) / 86400000; T = days <= 3 ? 5 : days <= 7 ? 4 : days <= 30 ? 3 : 2; }
  return { G, B, P, C, T };
}
function baseLeadScores(it) {
  const t = (it.title || '') + ' ' + (it.snippet || '');
  let vol = 3, fit = 3, urgent = 3, sustain = 3;
  if (has(t, ['产业园', '招商', '物流园', '示范区', '基地', '项目'])) vol = 5;
  if (has(t, ['快递', '寄递', '电商', '水果', '生鲜', '农产品', '村播', '直播'])) fit = 5;
  if (has(t, ['新开', '签约', '投产', '落地', '开工'])) urgent = 5;
  if (has(t, ['产业带', '常年', '基地', '示范', '持续'])) sustain = 5;
  return { vol, fit, urgent, sustain };
}

function classify(it) {
  const ch = (it.channel || '').trim();
  if (ch === '电商') return 'leads';
  if (ch === '安全') return 'safety';
  return 'news';
}

function load(date) {
  const items = [];
  for (const f of [`raw-${date}.json`, `watch-alerts-${date}.json`]) {
    const p = join(__dirname, 'archive', f);
    if (existsSync(p)) { try { const j = JSON.parse(readFileSync(p, 'utf8')); (j.fetched || j.alerts || []).forEach(x => items.push(x)); (j.searched || []).forEach(x => items.push(x)); } catch {} }
  }
  return items;
}

function main() {
  const items = load(DATE);
  console.log(`评分层：读入原始命中 ${items.length} 条`);
  const seen = new Set();
  const news = [], leads = [], safety = [], lowValue = [];
  for (const it of items) {
    const key = (it.url || it.title || '').replace(/\?.*$/, '').slice(0, 160);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const cat = classify(it);
    if (cat === 'leads') {
      const s = baseLeadScores(it); const score = comp4(s);
      leads.push({ ...it, s, score, level: levelOf(score), needsReview: true });
    } else if (cat === 'safety') {
      const s = baseNewsScores(it); const score = comp5(s);
      safety.push({ ...it, s, score, level: levelOf(score), needsReview: true });
    } else {
      const s = baseNewsScores(it); const score = comp5(s);
      const obj = { ...it, s, score, level: levelOf(score), needsReview: true };
      const t = (it.title || '') + ' ' + (it.snippet || '');
      if (score < 50 || (it.warn && !it.date) || !isRelevantNews(t)) lowValue.push(obj); else news.push(obj);
    }
  }
  const sortByScore = a => a.sort((x, y) => y.score - x.score);
  sortByScore(news); sortByScore(leads); sortByScore(safety); sortByScore(lowValue);

  const staging = {
    date: DATE, generatedAt: new Date().toISOString(),
    news, leads, safety, lowValue,
    meta: { news: news.length, leads: leads.length, safety: safety.length, lowValue: lowValue.length }
  };
  const sp = join(__dirname, 'archive', `staging-${DATE}.json`);
  writeFileSync(sp, JSON.stringify(staging, null, 2));
  console.log(`✓ staging 生成：${sp}`);
  console.log(`  资讯 ${news.length} · 电商线索 ${leads.length} · 安全 ${safety.length} · 低价值沉淀 ${lowValue.length}`);
  console.log('  → AI 读取 staging 做最终策展（补 summary/reason/action/真实日期/URL），写入 data.json');
}

main();
