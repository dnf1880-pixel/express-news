import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
const todo = JSON.parse(readFileSync('archive/search-todo.json', 'utf8'));
const arr = todo.queries;

const MANUAL = {
  '湖北气象': '湖北 暴雨 预警 大雾 强对流 天气预报 宜昌 恩施 荆州 荆门 潜江',
  '湖北应急管理': '湖北省应急管理厅 灾害预警 突发事件 应急响应 通知',
  '恩施产业招商': '恩施 富硒 产业 电商 示范县 招商 项目 最新',
  '国家消防救援局': '国家消防救援局 火灾事故 通报 仓储物流 消防安全整治'
};

const items = arr.map(it => {
  if (it.query) return it;
  const q = MANUAL[it.source] || `${it.source} ${it.scope} ${it.label}`;
  return { ...it, query: q, queryConstructed: true };
});

const missing = items.filter(i => !i.query);
console.log('总数', items.length, '无query残留', missing.length);

const B = Math.min(6, Math.ceil(items.length / 20));
const per = Math.ceil(items.length / B);
for (let i = 0; i < B; i++) {
  const slice = items.slice(i * per, (i + 1) * per);
  if (!slice.length) continue;
  writeFileSync(`archive/search-batch-input-${i + 1}.json`, JSON.stringify(slice, null, 1));
  console.log(`batch ${i + 1}: ${slice.length} 条`);
}
