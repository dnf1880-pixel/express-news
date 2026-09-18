// 临时审计脚本：漏判扫描（跑完即删）
import fs from 'fs';

const stage = JSON.parse(fs.readFileSync('archive/staging-2026-09-18.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const cityRe = /(宜昌|恩施|荆州|荆门|潜江|监利|石首|洪湖|松滋|公安|江陵|沙市|当阳|枝江|宜都|长阳|五峰|秭归|兴山|远安|利川|建始|巴东|宣恩|咸丰|来凤|鹤峰)/;
const coreRe = /(快递|物流|寄递|邮政|网点|电商|产业带|配送|分拨|驿站|无人车|闪送|圆通|顺丰|中通|申通|韵达|极兔|京东|菜鸟)/;

const dataUrls = new Set();
for (const ch of ['news', 'leads', 'safety']) {
  for (const it of (data[ch] || [])) if (it.url) dataUrls.add(it.url);
}

function show(it, tag) {
  console.log(`[${tag}] ${it.score} ${it.stage || ''} ${(it.name || it.title || '').slice(0, 60)} | ${it.srcName || ''} | ${it.date || it.sort || ''}`);
}

// 1) news 通道 score>=65 全量列出
console.log('=== news 通道 score>=65 ===');
for (const it of (stage.news || [])) if (it.score >= 65) show(it, 'news65');

// 2) lowValue 通道：鄂西城市名 + 核心词
console.log('=== lowValue 鄂西+核心词 ===');
for (const it of (stage.lowValue || [])) {
  const t = (it.name || it.title || '');
  if (cityRe.test(t) && coreRe.test(t) && it.score >= 55) show(it, 'lowV');
}

// 3) spb 源 score>=60
console.log('=== spb 源 score>=60 ===');
for (const it of [...(stage.news || []), ...(stage.lowValue || [])]) {
  if ((it.url || '').includes('spb.gov.cn') && it.score >= 60) show(it, 'spb');
}

// 4) raw 补漏扫描：news score>=65 且鄂西城市、URL 不在 data.json
console.log('=== raw 补漏（news>=65 鄂西 URL不在库）===');
let miss = 0;
for (const it of (stage.news || [])) {
  const t = (it.name || it.title || '');
  if (it.score >= 65 && cityRe.test(t) && it.url && !dataUrls.has(it.url)) { show(it, 'miss'); miss++; }
}
console.log(`raw 补漏命中: ${miss}`);

// 5) 今日 staging 的 watch 通道高分候选（curate-light 的输入）
console.log('=== watch 通道 score>=60 候选 ===');
for (const it of (stage.news || [])) if (it.stage === 'watch' && it.score >= 60) show(it, 'watch');
