import { readFileSync } from 'node:fs';
const D = JSON.parse(readFileSync('data.json', 'utf8'));
const B = JSON.parse(readFileSync('archive/_data-before-2026-11-04.json', 'utf8'));
const TODAY = '2026-11-04';

const all = ch => D[ch] || [];
let bad = 0;

// 1 非 warn 必须有 url
for (const ch of ['news', 'leads', 'safety']) for (const it of all(ch)) {
  if (!it.warn && !it.url) { bad++; console.log('NOURL', ch, it.title || it.name); }
}
// 2 未来日期
for (const ch of ['news', 'leads', 'safety']) for (const it of all(ch)) {
  if (it.sort && it.sort > TODAY) { bad++; console.log('FUTURE', ch, it.sort, it.title || it.name); }
}
// 3 新增条目的跨年旧文
const beforeUrls = new Set();
for (const ch of ['news', 'leads', 'safety']) for (const it of B[ch] || []) if (it.url) beforeUrls.add(it.url);
const added = [];
for (const ch of ['news', 'leads', 'safety']) for (const it of all(ch)) {
  if (it.url && !beforeUrls.has(it.url)) added.push({ ch, it });
}
console.log('新增条目数', added.length);
for (const { ch, it } of added) {
  const yr = (it.sort || '').slice(0, 4);
  if (yr && yr < '2026') { bad++; console.log('OLDYEAR', ch, it.sort, it.title || it.name); }
}

// 4 非鄂西（新增条目按标题/region）
const OUT = ['武汉', '襄阳', '黄冈', '咸宁', '鄂州', '孝感', '黄石', '十堰', '随州', '天门', '仙桃', '神农架', '新洲', '蔡甸', '江夏', '黄陂', '东西湖', '周口', '重庆', '长沙', '南昌', '合肥', '南京', '郑州', '成都', '信阳', '岳阳', '九江'];
for (const { ch, it } of added) {
  const t = it.title || it.name || '';
  const hit = OUT.find(o => t.includes(o));
  if (hit) { bad++; console.log('OUT', ch, hit, t); }
}

// 5 重复标题（跨通道/跨域名镜像）
const seen = new Map();
for (const ch of ['news', 'leads', 'safety']) for (const it of all(ch)) {
  const key = (it.title || it.name || '').replace(/\s/g, '').slice(0, 26);
  if (!key) continue;
  if (seen.has(key)) { console.log('DUP', key, '|', seen.get(key), '|', ch); }
  else seen.set(key, ch);
}

// 6 资讯等级自洽
const W = { G: 0.28, B: 0.26, P: 0.20, C: 0.14, T: 0.12 };
for (const it of all('news')) {
  const w = Math.round(20 * (W.G * it.s.G + W.B * it.s.B + W.P * it.s.P + W.C * it.s.C + W.T * it.s.T));
  const c = w >= 75 ? 'red' : w >= 55 ? 'orange' : 'green';
  if (c !== it.level) { bad++; console.log('LEVEL', it.title, w, it.level); }
}
console.log(bad === 0 ? '✓ QA 全部通过' : `✗ 问题 ${bad} 条`);
