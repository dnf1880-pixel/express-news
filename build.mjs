import fs from 'fs';

const tpl = fs.readFileSync('template.html', 'utf8');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

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
if (bad > 0) { console.error('校验失败，中止生成 index.html'); process.exit(1); }

// 占位替换：template 中 const DATA = __DATA__; → 真实数据
const out = tpl.replace('__DATA__', JSON.stringify(data));
if (!out.includes('const DATA =') || out.includes('__DATA__')) {
  console.error('✗ 模板占位替换失败'); process.exit(1);
}
fs.writeFileSync('index.html', out);
console.log('✓ index.html 生成成功，条目数:', data.length, ' 精选(≥65且已核实):', data.filter(d => comp(d.s) >= 65 && !d.warn).length);
