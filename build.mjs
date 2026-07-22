import fs from 'fs';

const tpl = fs.readFileSync('template.html', 'utf8');
const raw = fs.readFileSync('data.json', 'utf8');
const obj = JSON.parse(raw);

// ---- 兼容两种结构：纯数组（向后兼容）或 {news/leads/safety} 对象 ----
const data = Array.isArray(obj) ? obj : (obj.news || []);
const leads = Array.isArray(obj) ? [] : (obj.leads || []);
const safety = Array.isArray(obj) ? [] : (obj.safety || []);

// ---- 自洽校验：权重等级 / 日期排序 / 精选逻辑 ----
const W = { G: 0.28, B: 0.26, P: 0.20, C: 0.14, T: 0.12 };
const comp = s => Math.round(20 * (W.G * s.G + W.B * s.B + W.P * s.P + W.C * s.C + W.T * s.T));
let bad = 0;
data.forEach(d => {
  const w = comp(d.s);
  const c = w >= 75 ? 'red' : (w >= 55 ? 'orange' : 'green');
  if (c !== d.level) { bad++; console.error('✗ 等级与分数不一致:', d.title, '分=', w, '标=', d.level); }
  if (!d.url && !d.warn) { console.error('✗ 非待核实条目缺少 url:', d.title); bad++; }
});
leads.forEach(d => {
  if (!d.name) { bad++; console.error('✗ 电商线索缺 name'); }
  if (typeof d.score !== 'number') { bad++; console.error('✗ 电商线索缺 score:', d.name); }
});
safety.forEach(d => {
  if (!d.title) { bad++; console.error('✗ 安全事件缺 title'); }
  if (typeof d.score !== 'number') { bad++; console.error('✗ 安全事件缺 score:', d.title); }
});
if (bad > 0) { console.error('校验失败，中止生成 index.html'); process.exit(1); }

// 占位替换：3 个数据块
let out = tpl;
out = out.replace('__DATA__', JSON.stringify(data));
out = out.replace('__LEADS__', JSON.stringify(leads));
out = out.replace('__SAFETY__', JSON.stringify(safety));
if (out.includes('__DATA__') || out.includes('__LEADS__') || out.includes('__SAFETY__')) {
  console.error('✗ 模板占位未全部替换'); process.exit(1);
}
fs.writeFileSync('index.html', out);

const featured = data.filter(d => comp(d.s) >= 65 && !d.warn).length;
console.log(`✓ index.html 生成成功：资讯 ${data.length} 条（精选 ${featured}） · 电商线索 ${leads.length} 条 · 安全事件 ${safety.length} 条`);
