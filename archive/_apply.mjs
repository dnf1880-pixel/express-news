import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const before = JSON.parse(fs.readFileSync('archive/_data-before-2026-11-24.json', 'utf8'));
const beforeUrls = new Set();
for (const ch of ['news', 'leads', 'safety']) for (const it of before[ch] || []) beforeUrls.add(it.url);

// 1) 剔除 curate 新增中的问题条目（URL 精确匹配 + 排除 before 快照保护）
const kill = [
  // news
  'https://hbjtxw.ihwrm.com/index/article/articleinfo.html?doc_id=4946515',
  'https://www.spb.gov.cn/gjyzj/2025szqhxxc/202611/705338498fae4b7ca327963f1e883b24.shtml',
  'https://www.rmfzw.org.cn/article/0/337108',
  'http://www.dangyang.gov.cn/site_352_dangyangzixun/site_352_tupianxinwen/6af575305e05d182de688e2c.htm',
  'https://www.rmfzw.org.cn/article/239/332462',
  'http://www.rmfzw.org.cn/article/0/332462',
  'https://jikuaidi100.com/kuaidi-tousu-dianhua-12345-liucheng',
  'https://hb.spb.gov.cn/hubsyzglj/c105013/c105016/202611/bd36bd3e05a24cba93e97a51b767eafa.shtml',
  'https://news.qq.com/rain/a/20261115A0AW9Z00',
  'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202611/86d3c14877074fcaad887b2b8505fabe.shtml',
  'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202611/79fc74507c3d432e9490cbfbcd109175.shtml',
  'https://hb.spb.gov.cn/hubsyzglj/c100057/c100060/202611/51ffcc8a983548b0931137d7bbf18790.shtml',
  'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202611/d5e75e76aee4478cb9d033485f43b4f6.shtml',
  'https://hb.spb.gov.cn/hubsyzglj/c100057/c100071/202611/ccfd9ec0ae1748b69aadb9f5964758ce.shtml',
  'https://hb.spb.gov.cn/hubsyzglj/c100057/c100060/202611/e45f6d198dab4d9a9aca5b513cda832f.shtml',
  // leads
  'https://jingzho.99cfw.com/news/hangyedongtai/AHtI.htm',
  'https://m.thepaper.cn/newsDetail_forward_34466369',
  'https://news.hubeidaily.net/pc/c_6137033.html',
  'http://www.jingzhouqu.gov.cn/xwzx/jzqx/202611/t20261121_1147456.shtml',
  'https://news.hubeidaily.net/pc/c_6183763.html',
  'https://news.hubeidaily.net/mobile/c_6146384.html',
  'https://news.hubeidaily.net/pc/c_6153625.html',
  'https://gongshang.mingluji.com/hubei/kaifaqu/G423197/%E7%94%B5%E5%95%86%E5%85%AC%E5%8F%B8',
  // safety
  'http://www.hbjs.gov.cn/xwdt/bdyw/202611/t20261123_1854496.shtml',
  'https://www.sina.cn/news/detail/5360557034835141.html',
  'https://news.hubeidaily.net/pc/c_6187146.html',
  'https://news.hubeidaily.net/pc/c_6153705.html',
  'https://wap.cjyunjianghanfeng.cn/p/531362.html',
  'http://slhhpj.jingmen.gov.cn/art/2026/11/23/art_3335_1250288.html',
  'https://k.sina.com.cn/article_7517400647_1c0126e4705909f3my.html',
  'https://www.163.com/dy/article/LBN67UTK0514QCRQ.html',
  'https://jingshan.gov.cn/art/2026/11/7/art_5586_1247972.html',
];
const killSet = new Set(kill);
let removed = 0;
for (const ch of ['news', 'leads', 'safety']) {
  const arr = data[ch] || [];
  const out = arr.filter((it) => {
    const u = it.url || '';
    if (killSet.has(u) && !beforeUrls.has(u)) { removed++; return false; }
    return true;
  });
  data[ch] = out;
}
console.log('剔除:', removed);

// 2) 手工并入（全部 curl 验真日期）
const d = (md) => ({ date: md.slice(5).replace('-', '月') + '日', sort: md });
const newsAdd = [
  {
    title: '宜昌布局四条特色物流通道畅联长江', url: 'http://www.yichang.gov.cn/html/zhengwuyizhantong/zhengwuzixun/jinriyaowen/2026/1124/1080633.html',
    region: '湖北', subRegion: '宜昌市', srcName: '宜昌市人民政府',
    summary: '宜昌市布局四条特色物流通道畅联长江，完善沿江物流网络组织，强化宜昌作为长江中上游区域物流节点城市的通道与集散能力。',
    reason: '宜昌干线通道格局变化直接影响鄂西快件陆运时效与干线成本，转运中心路由规划需跟进。',
    action: '→ 关注四条通道具体走向与货运班线配置，评估宜昌进出港快件路由是否可借道降本提效。',
    s: { G: 4, B: 4, P: 2, C: 2, T: 5 }, tags: ['物流通道', '干线时效'],
    ...d('2026-11-24'),
  },
  {
    title: '保障新业态，办好快递员的「烦薪事」', url: 'http://zfw.yichang.gov.cn/content-36752-965336-1.html',
    region: '湖北', subRegion: '宜昌市', srcName: '宜昌长安网（猇亭法院）',
    summary: '猇亭法院办结一批涉快递新业态货物运输合同纠纷，从立案到全部调解完成仅用较短周期；依据《快递暂行条例》与人社部八部门指导意见，新业态劳动者报酬纳入保障范畴，严禁克扣、无故拖欠。',
    reason: '新业态用工报酬保障司法口径趋严，网点加盟/承包的运费结算与派费发放需合规自查，防劳动纠纷外溢。',
    action: '→ 自查网点承包合同运费结算条款与派费发放台账，杜绝克扣拖欠，留意猇亭法院调解案例的裁判倾向。',
    s: { G: 4, B: 4, P: 3, C: 1, T: 3 }, tags: ['快递员权益', '司法', '新业态用工'],
    ...d('2026-11-12'),
  },
  {
    title: '潜江：邮政业申诉平台与12345政务热线实现数据对接', url: 'https://www.hbqj.gov.cn/sjtysj/xwzx/gzdt/202611/t20261109_6072909.html',
    region: '湖北', subRegion: '潜江市', srcName: '潜江市人民政府',
    summary: '潜江两个平台打通数据通道，邮政业用户申诉与12345政务服务平台实现一网通办，申诉转办、督办、回访全流程线上闭环。',
    reason: '申诉口径并入 12345 后，投诉响应时效被行政考核紧盯，末端投诉率直接影响网点考核分。',
    action: '→ 提示潜江各网点：申诉一网通办后转办更快，投诉工单须当日响应；对照申诉高频项（虚假签收/未按址投递）自查。',
    s: { G: 4, B: 3, P: 3, C: 1, T: 2 }, tags: ['申诉', '12345', '监管'],
    ...d('2026-11-09'),
  },
];
const leadsAdd = [
  {
    name: '松滋寄递物流提速（日均 9.5 万余件）', biz: '快递物流/电商发货',
    region: '湖北', admin: '松滋市', tier: '县', address: '松滋市（待核实）', contact: '待核实',
    reason: '松滋寄递物流日均 9.5 万余件并持续提速，县域发货盘子可观，是鄂西县级市场单量标杆。',
    scale: '日均寄递 9.5 万余件', seasonal: '全年（旺季上量）',
    srcName: '湖北日报（hubeidaily）', score: 84, tags: ['寄递量', '县域电商'],
    ...d('2026-11-09'), url: 'https://news.hubeidaily.net/pc/c_6152379.html',
  },
  {
    name: '当阳市「邮政助农杯」电商直播大赛启动', biz: '直播电商/农产品',
    region: '湖北', admin: '当阳市', tier: '县', address: '当阳市（待核实）', contact: '待核实',
    reason: '邮政冠名的电商直播大赛落地当阳，参赛主体是本地农产品电商卖家，直接产生发货需求且与邮政体系强关联。',
    scale: '赛事周期内集中发货；参赛电商主体待摸排', seasonal: '赛事期（11-12 月）',
    srcName: '湖北日报（hubeidaily）', score: 82, tags: ['直播电商', '助农', '邮政合作'],
    ...d('2026-11-17'), url: 'https://news.hubeidaily.net/pc/z_881232.html',
  },
  {
    name: '兴山「五合一」供应链护航双十一（山货出村进城）', biz: '供应链/农产品电商',
    region: '湖北', admin: '兴山县', tier: '县', address: '兴山县（待核实）', contact: '待核实',
    reason: '兴山以「五合一」供应链模式保障双十一山货出村，县内上行件量集中，末端共配与揽收资源有合作空间。',
    scale: '双十一期间上行件集中放量', seasonal: '旺季',
    srcName: '兴山县人民政府', score: 82, tags: ['供应链', '双十一', '农产品上行'],
    ...d('2026-11-11'), url: 'http://www.xingshan.gov.cn/content-18-64080-1.html',
  },
  {
    name: '京山市级电商基地运营服务项目竞争性磋商公告', biz: '电商基地运营招标',
    region: '湖北', admin: '京山市', tier: '县', address: '京山市（以公告为准）', contact: '待核实',
    reason: '京山市级电商基地运营服务对外磋商招标，中标主体将承接基地运营，带来整包快递/仓储合作需求。',
    scale: '市级电商基地运营服务（金额以公告为准）', seasonal: '按合同期',
    srcName: '招标采购网（gxzbcg）', score: 78, tags: ['招标', '电商基地', '荆门'],
    ...d('2026-11-20'), url: 'http://www.gxzbcg.net/class3/323822.html',
  },
  {
    name: '4.77 亿元投建恩施武陵山物流园', biz: '物流园区/仓储',
    region: '湖北', admin: '恩施州', tier: '市', address: '恩施州（待核实）', contact: '待核实',
    reason: '武陵山物流园总投资 4.77 亿元，建成后是恩施区域性仓储分拨载体，园区快递分拨席位与进场快递企业招商值得关注。',
    scale: '总投资 4.77 亿元', seasonal: '建设期+运营期',
    srcName: '物流信息网（99cfw）', score: 80, tags: ['物流园', '投资', '恩施'],
    ...d('2026-11-20'), url: 'https://es.99cfw.com/news/hangyedongtai/AHnr.htm',
  },
  {
    name: '湖北秭归交通物流进村激活城乡双向循环', biz: '客货邮/农村物流',
    region: '湖北', admin: '秭归县', tier: '县', address: '秭归县（待核实）', contact: '待核实',
    reason: '交通运输部媒体专题报道秭归交通物流进村，城乡双向循环体系成型，农村末端网络与客货邮线路是共享运力切入点。',
    scale: '县乡村三级物流网络（具体以正文为准）', seasonal: '全年',
    srcName: '中国交通报（zgjtb）', score: 80, tags: ['客货邮', '快递进村', '秭归'],
    ...d('2026-11-18'), url: 'https://www.zgjtb.com/2026-11/18/content_545209.html',
  },
  {
    name: '我的宜昌客户端柑橘专区上线（手机下单直邮全国）', biz: '平台电商/柑橘',
    region: '湖北', admin: '宜昌市', tier: '市', address: '宜昌市（线上平台）', contact: '待核实',
    reason: '宜昌本地客户端开出柑橘专区支持手机下单直邮全国，产地件直发模式带来季节性揽收增量。',
    scale: '柑橘季产地直发件量（待跟踪）', seasonal: '柑橘季（11-次年 2 月）',
    srcName: '宜昌市人民政府', score: 78, tags: ['平台电商', '柑橘', '产地直发'],
    ...d('2026-11-23'), url: 'https://www.yichang.gov.cn/html/zhengwuyizhantong/zhengwuzixun/jinriyaowen/2026/1123/1080618.html',
  },
  {
    name: '鸦鹊岭千余亩果冻橙俏销（电商发货至江浙沪）', biz: '农产品电商/合作社',
    region: '湖北', admin: '宜昌市夷陵区', tier: '县', address: '宜昌市夷陵区鸦鹊岭镇', contact: '待核实（宜昌江平柑橘专业合作社）',
    reason: '合作社 2000 余亩果冻橙经电商发往江苏、浙江、上海，单合作社产地件规模稳定，可与产地仓/揽收点直谈。',
    scale: '种植 2000 余亩（丰产期约 1000 亩），产量同比大幅增长', seasonal: '采摘季（11-12 月）',
    srcName: '长江云（cjyun）', score: 74, tags: ['农产品电商', '合作社', '柑橘'],
    ...d('2026-11-19'), url: 'https://m-yichang.cjyun.org/p/232920.html',
  },
  {
    name: '开辟绿色通道简易流程 宜昌优品出海提速', biz: '跨境电商/出口',
    region: '湖北', admin: '宜昌市', tier: '市', address: '宜昌市（海关绿色通道）', contact: '待核实',
    reason: '宜昌海关对本地优势农产品出口开绿色通道、简化流程，跨境电商与出口件通关时效提升，利于宜昌产地件外扩。',
    scale: '出口农产品加工订单持续至 11 月底（鲟鱼谷等日加工 700-800 公斤）', seasonal: '全年',
    srcName: '宜昌市人民政府（转湖北日报）', score: 72, tags: ['跨境电商', '出口', '海关'],
    ...d('2026-11-24'), url: 'http://www.yichang.gov.cn/html/zhengwuyizhantong/zhengwuzixun/jinriyaowen/2026/1124/1080636.html',
  },
  {
    name: '智能分选提优果直供商超 夷陵柑橘产销两旺', biz: '农产品电商/商超直供',
    region: '湖北', admin: '宜昌市夷陵区', tier: '县', address: '宜昌市夷陵区（待核实）', contact: '待核实',
    reason: '夷陵柑橘智能分选后直供商超拓展市场，分选线+商超直供模式发货标准化程度高，适合仓配一体合作。',
    scale: '分选产能与商超供货量待摸排', seasonal: '柑橘季',
    srcName: '湖北日报（hubeidaily）', score: 72, tags: ['智能分选', '商超直供', '柑橘'],
    ...d('2026-11-16'), url: 'https://news.hubeidaily.net/pc/z_881040.html',
  },
  {
    name: '钟祥东桥镇果园架起「云销路」直播助农', biz: '直播电商/农产品',
    region: '湖北', admin: '钟祥市', tier: '县', address: '钟祥市东桥镇', contact: '待核实',
    reason: '东桥镇果园直播助农形成稳定销路，产地直播发货集中于村镇揽收点，末端揽收频次可谈。',
    scale: '果园直播发货量（待摸排）', seasonal: '果季',
    srcName: '钟祥融媒（cjyun）', score: 72, tags: ['直播助农', '产地揽收', '荆门'],
    ...d('2026-11-12'), url: 'https://zhongxiang.cjyun.org/p/155574.html',
  },
];
const safetyAdd = [
  {
    title: '强冷空气来袭：狂降 12℃、8 级大风、雨夹雪', url: 'https://finance.sina.com.cn/jjxw/2026-11-18/doc-inizcexm4951647.shtml',
    region: '湖北', subRegion: '', srcName: '新浪财经（转气象报道）',
    summary: '强冷空气影响湖北，气温狂降 12℃，伴 8 级大风与雨夹雪，高山地区有雪，气温局部跌破零下。',
    reason: '降温+大风+雨雪直接影响鄂西山区干线时效与农村末端骑行派件安全，需提前预警。',
    action: '→ 提示鄂西各网点：山区线路防滑链/车辆检查，高山网点（巴东/建始/利川）防冻保暖，高峰期备双班。',
    score: 78, tags: ['寒潮', '雨雪', '派送安全'],
    ...d('2026-11-18'),
  },
  {
    title: 'G348 快速通道月明隧道（K588+610至K593+000）交通管制', url: 'https://estv.com.cn/sh/3340413.htm',
    region: '湖北', subRegion: '恩施市', srcName: '恩施电视台',
    summary: '恩施 G348 快速通道月明隧道部分路段实施交通管制。',
    reason: 'G348 是恩施干线通道，管制影响恩施方向干线时效。',
    action: '→ 干线车辆绕行方案核对，与恩施网点确认到货时效波动。',
    score: 74, tags: ['交通管制', '恩施', '干线'],
    ...d('2026-11-19'),
  },
  {
    title: '巴东县官渡口镇滨江大道、神农路部分路段限制通行', url: 'https://www.cjbd.com.cn/xzdt/3340194.html',
    region: '湖北', subRegion: '巴东县', srcName: '长江巴东网',
    summary: '巴东县官渡口镇滨江大道、神农路部分路段实行限制通行。',
    reason: '官渡口镇为巴西重点镇，路段限行影响末端派送时效。',
    action: '→ 提示巴东网点调整派送路线，涉及限行段改步行/小车接驳。',
    score: 74, tags: ['交通管制', '巴东', '末端'],
    ...d('2026-11-19'),
  },
  {
    title: '利川柏杨坝镇集镇兴隆路实施交通管制（封闭）', url: 'https://dy.163.com/article/LC3R3AA30514A5O1.html',
    region: '湖北', subRegion: '利川市', srcName: '网易号（转官方通告）',
    summary: '利川市柏杨坝镇集镇兴隆路实施交通管制（封闭）。',
    reason: '集镇封路影响利川西部片区末端派送。',
    action: '→ 利川网点确认封闭时长与绕行路线，告知客户派送延迟可能。',
    score: 70, tags: ['交通管制', '利川', '末端'],
    ...d('2026-11-19'),
  },
  {
    title: '荆门天仙大道部分路口即将实施交通管制', url: 'https://news.qq.com/rain/a/20261120A0CH8R00',
    region: '湖北', subRegion: '荆门市', srcName: '腾讯新闻（转官方）',
    summary: '荆门天仙大道部分路口即将实施交通管制。',
    reason: '天仙大道为荆门东南向干线，路口管制影响派送与干线时效。',
    action: '→ 荆门网点核对管制路口清单，调整干线与派送路线。',
    score: 72, tags: ['交通管制', '荆门'],
    ...d('2026-11-20'),
  },
  {
    title: '当阳这段路连续 3 天全封闭，车辆行人禁行', url: 'https://feng.ifeng.com/c/8y8D8oLsb1O',
    region: '湖北', subRegion: '当阳市', srcName: '凤凰网大风号（转官方）',
    summary: '当阳城区一路段连续 3 天全封闭施工，所有车辆、行人均禁行。',
    reason: '当阳城区全封闭路段直接影响当日派送时效。',
    action: '→ 当阳网点确认封闭日期与路段，改绕行并通知客户。',
    score: 76, tags: ['交通管制', '当阳', '全封闭'],
    ...d('2026-11-17'),
  },
  {
    title: '湖北省公路事业发展中心部署今冬明春公路安全防范', url: 'https://jtt.hubei.gov.cn/glj/zwdt/glxw/202611/t20261117_6125139.shtml',
    region: '湖北', subRegion: '', srcName: '湖北省交通运输厅',
    summary: '省公路事业发展中心提前部署今冬明春公路领域安全防范应对工作，聚焦冬季恶劣天气保通保畅。',
    reason: '省级冬季公路保通部署预示鄂西山区道路管控将趋严，干线需备预案。',
    action: '→ 跟踪鄂西山区国省道冬季管制动态，干线备除雪防滑与备用路线。',
    score: 65, tags: ['公路安全', '冬季保通', '省级'],
    ...d('2026-11-17'),
  },
];

// 补 w/level for news
function comp(s) {
  return Math.round(20 * (0.28 * s.G + 0.26 * s.B + 0.20 * s.P + 0.14 * s.C + 0.12 * s.T));
}
function lvl(w) { return w >= 75 ? 'red' : w >= 55 ? 'orange' : 'green'; }
function lvlScore(x) { return x >= 75 ? 'red' : x >= 55 ? 'orange' : 'green'; }

let addedNews = 0, addedLeads = 0, addedSafety = 0;
const addedUrls = new Set();
for (const it of newsAdd) {
  if (!it.url || data.news.some((x) => x.url === it.url)) continue;
  const w = comp(it.s);
  data.news.push({ ...it, channel: '资讯', cat: '湖北', src: it.srcName, w, level: lvl(w), warn: false });
  addedUrls.add(it.url); addedNews++;
}
for (const it of leadsAdd) {
  if (!it.url || data.leads.some((x) => x.url === it.url)) continue;
  data.leads.push({ ...it, region: it.region, src: it.srcName, level: lvlScore(it.score), warn: false, channel: '电商' });
  addedUrls.add(it.url); addedLeads++;
}
for (const it of safetyAdd) {
  if (!it.url || data.safety.some((x) => x.url === it.url)) continue;
  data.safety.push({ ...it, cat: '湖北', src: it.srcName, level: lvlScore(it.score), warn: false, channel: '安全' });
  addedUrls.add(it.url); addedSafety++;
}
console.log('手工并入: news', addedNews, '/ leads', addedLeads, '/ safety', addedSafety);

// 3) 全量补 w（news 通道缺 w 的）
let patched = 0;
for (const it of data.news || []) {
  if (it.s && (it.w == null || it.level == null || lvl(comp(it.s)) !== it.level)) {
    it.w = comp(it.s); it.level = lvl(it.w); patched++;
  }
}
console.log('news 补/校正 w:', patched);

data.updatedAt = new Date().toISOString().slice(0, 10);
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
console.log('data.json 保存：资讯', data.news.length, '· 电商', data.leads.length, '· 安全', data.safety.length);
