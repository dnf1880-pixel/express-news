import { readFileSync } from 'node:fs';
const S = JSON.parse(readFileSync('archive/staging-2026-11-04.json', 'utf8'));
const D = JSON.parse(readFileSync('data.json', 'utf8'));
const existing = new Set();
for (const k of ['news', 'leads', 'safety']) for (const it of D[k] || []) if (it.url) existing.add(it.url);

const OUT = ['武汉', '襄阳', '黄冈', '咸宁', '鄂州', '孝感', '黄石', '十堰', '随州', '天门', '仙桃', '神农架', '新洲', '蔡甸', '江夏', '黄陂', '东西湖', '周口', '重庆', '江津', '长沙', '南昌', '合肥', '南京', '郑州', '成都', '信阳', '岳阳', '常德', '九江', '安庆'];
const FARM = ['ccpc360.com', 'bdsr.ccpc360', 'guanhai.com.cn', 'topnews.cn', 'jingmu.net', 'changkuchuzu.com', 'mingluji.com', 'lcbaixing.cn'];
const isFarm = u => FARM.some(f => (u || '').includes(f));
const hitOut = t => OUT.find(o => (t || '').includes(o));

const ch = process.argv[2] || 'news';
const min = Number(process.argv[3] || 0);
const arr = (S[ch] || []).filter(x => !existing.has(x.url) && !isFarm(x.url) && (x.score || 0) >= min);
console.log(`#${ch} 候选 ${arr.length}（已排除库内重复/内容农场/低于${min}分）`);
arr.sort((a, b) => (b.score || 0) - (a.score || 0));
for (const it of arr) {
  const o = hitOut(it.title) || (hitOut(it.region) ? 'REGION:' + it.region : '');
  console.log(`${it.score}|${it.date}|${o ? 'OUT:' + o : ''}|${it.region}/${it.subRegion}|${(it.title || '').slice(0, 58)}|${it.url}`);
}
