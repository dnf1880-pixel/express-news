import { readFileSync, writeFileSync } from 'node:fs';

const D = JSON.parse(readFileSync('data.json', 'utf8'));
const W = { G: 0.28, B: 0.26, P: 0.20, C: 0.14, T: 0.12 };
const comp = s => Math.round(20 * (W.G * s.G + W.B * s.B + W.P * s.P + W.C * s.C + W.T * s.T));
const lv = w => (w >= 75 ? 'red' : w >= 55 ? 'orange' : 'green');
const cn = d => `${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;

const NEWS = [
  {
    title: '荆州市快递行业全力迎战「双十一」寄递高峰',
    summary: '荆州市邮政管理局部署旺季服务保障，全市快递企业扩容分拨场地、增配车辆与临时用工，11月起进入日均处理量爬坡期；重点保障沙市区、荆州区城区网点和乡镇末端投递时效。',
    reason: '旺季首周是爆仓与投诉高发窗口，直接影响签收时效与质量分。',
    action: '→ 核对本区域日均进出港峰值与临时用工到位情况，24小时内报缺口。',
    region: '荆州城区', subRegion: '沙市区', cat: '荆州城区', src: '荆州市邮政管理局', srcName: '荆州新闻网',
    s: { G: 5, B: 4, P: 3, C: 3, T: 5 }, tags: ['旺季'], sort: '2026-11-03',
    url: 'http://news.jznews.com.cn/system/2026/11/03/030142871.shtml'
  },
  {
    title: '宜昌率先开展快递行业技能人才薪酬集体协商：派费分级、保底 2800 元',
    summary: '宜昌市人社局牵头，市本级与当阳市一体推进，在全省率先开展快递行业技能人才薪酬集体协商。覆盖圆通、中通、韵达、申通等企业近 400 名分拣/派送/运输/客服一线人员；普通揽投员保底 2800 元、常态到手 3200-4500 元/月、旺季 5000-6500 元；持证技能人才叠加能级津贴与分级派费，常态 4500-6000 元、旺季可破 7000 元。累计 1420 人取得职业技能等级证书、26 人获快递工程职称。',
    reason: '直接锚定派费与用工成本基准，是鄂西区域薪酬与绩效测算的官方参照。',
    action: '→ 用该协商口径复核本区域派费分级与技能津贴差额，纳入下月成本测算。',
    region: '宜昌东站', subRegion: '西陵区', cat: '宜昌城区', src: '湖北省人力资源和社会保障厅', srcName: '湖北省人社厅',
    s: { G: 5, B: 5, P: 4, C: 4, T: 4 }, tags: ['派费', '人力'], sort: '2026-10-30',
    url: 'https://rst.hubei.gov.cn/bmdt/dtyw/gzdt/202610/t20261030_6046000.shtml'
  },
  {
    title: '荆门市出台现代物流业扩能提质三年行动方案',
    summary: '荆门市政府印发现代物流业扩能提质三年行动方案，围绕物流枢纽、多式联运、城乡配送网络与龙头物流企业引育提出量化目标与项目清单，明确财政与用地支持政策。',
    reason: '市级物流专项规划直接影响荆门网点布局、分拨选址与政策补贴申报窗口。',
    action: '→ 提取与本区域网点/分拨相关的项目清单与申报条件，评估可争取资源。',
    region: '荆门城区', subRegion: '东宝区', cat: '荆门城区', src: '荆门市人民政府', srcName: '荆门市人民政府',
    s: { G: 5, B: 4, P: 4, C: 3, T: 4 }, tags: ['政策'], sort: '2026-10-12',
    url: 'http://www.jingmen.gov.cn/art/2026/10/12/art_438_1241694.html'
  },
  {
    title: '荆门局就非法寄递国家机关公文约谈顺丰荆门分公司',
    summary: '荆门市邮政管理局就湖北顺丰速运有限公司荆门分公司非法寄递国家机关公文问题进行行政约谈，要求企业立即整改并提交书面整改报告，严格收寄验视与品名核查。',
    reason: '竞对合规处罚，同一监管口径下本区域收寄验视风险需同步排查。',
    action: '→ 排查本区域协议客户是否存在同类公文/证照类寄递，收寄端加一道验视留痕。',
    region: '荆门城区', subRegion: '东宝区', cat: '荆门城区', src: '荆门市邮政管理局', srcName: '湖北省邮政管理局',
    s: { G: 5, B: 4, P: 4, C: 4, T: 3 }, tags: ['监管', '竞对'], sort: '2026-10-08',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c104687/c104693/202610/25ebd6698e0046b5975ac6e2d1fb9a9c.shtml'
  },
  {
    title: '荆门局就寄递服务质量突出问题约谈创沅供应链（荆门邮约〔2026〕13号）',
    summary: '荆门市邮政管理局就寄递服务质量问题突出对荆门创沅供应链管理有限公司进行行政约谈，要求剖析申诉与投诉集中环节、限期整改并建立服务质量月度自查机制。',
    reason: '服务质量约谈直接对应申诉率与有效申诉考核，是本区域质量分风险前哨。',
    action: '→ 对照该约谈问题清单自查申诉集中环节，两日内出整改清单。',
    region: '荆门城区', subRegion: '东宝区', cat: '荆门城区', src: '荆门市邮政管理局', srcName: '湖北省邮政管理局',
    s: { G: 5, B: 4, P: 4, C: 4, T: 4 }, tags: ['质量', '监管'], sort: '2026-10-20',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c104687/c104693/202610/b83583300ed945dea5cfeda46f3c63f9.shtml'
  },
  {
    title: '荆州市邮政管理局召开 2026 年第三次邮政普遍服务政企联席会',
    summary: '荆州市邮政管理局组织召开 2026 年第三次邮政普遍服务政企联席会议，通报三季度普服质量、局所改造与投递时限完成情况，部署四季度普服达标与旺季保障工作。',
    reason: '普服考核进入四季度收官，投递时限与局所达标是考核硬指标。',
    action: '→ 核对本区域普服局所达标与投递时限数据，缺项在 11 月中旬前补齐。',
    region: '荆州城区', subRegion: '沙市区', cat: '荆州城区', src: '荆州市邮政管理局', srcName: '湖北省邮政管理局',
    s: { G: 5, B: 3, P: 4, C: 2, T: 3 }, tags: ['普服'], sort: '2026-10-16',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202610/4944f68311dd486cac046132e96721fd.shtml'
  },
  {
    title: '省局召开 2026 年三季度行业运行调度会议',
    summary: '湖北省邮政管理局召开三季度行业运行调度会议，通报全省业务量、收入、服务质量与安全生产情况，部署四季度旺季保障、农村寄递物流体系建设和违规收费整治等重点任务。',
    reason: '省级季度调度定调四季度考核重点，是区域经营指标对标的基准。',
    action: '→ 取省级三季度指标口径，对齐本区域业务量与质量分排名。',
    region: '湖北', subRegion: '', cat: '行业', src: '湖北省邮政管理局', srcName: '湖北省邮政管理局',
    s: { G: 3, B: 4, P: 4, C: 3, T: 4 }, tags: ['行业'], sort: '2026-10-20',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c100057/c100060/202610/6c03f1a3116a41438b7c42ebf46ee412.shtml'
  },
  {
    title: '宜昌局开展县市区邮政管理责任落实专题培训',
    summary: '宜昌市邮政管理局组织县市区邮政管理责任落实专题培训，围绕属地监管职责、寄递安全三项制度、农村网点合规经营与申诉处理流程开展业务辅导，各县市区邮政业发展中心参加。',
    reason: '属地监管职责下沉，县级网点合规检查频次将上升。',
    action: '→ 提前梳理各县网点三项制度台账，应对属地检查。',
    region: '宜昌东站', subRegion: '西陵区', cat: '宜昌城区', src: '宜昌市邮政管理局', srcName: '湖北省邮政管理局',
    s: { G: 4, B: 3, P: 4, C: 2, T: 4 }, tags: ['监管'], sort: '2026-10-26',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202611/607202ba322843bbacdf6aaeeebc3511.shtml'
  },
  {
    title: '巴东江南片区寄递物流处理中心正式投用',
    summary: '巴东县江南片区寄递物流处理中心建成投用，覆盖野三关、清太坪、水布垭等江南乡镇，实现快件集中分拣直发，缩短山区乡镇中转环节，打通快递进村「最后一公里」。',
    reason: '山区中转节点新增，直接影响恩施南部乡镇时效与末端成本。',
    action: '→ 核算该中心覆盖范围内本品牌路由切换后的时效与单票成本变化。',
    region: '野三关', subRegion: '巴东县', cat: '恩施', src: '湖北日报', srcName: '长江网/湖北日报',
    s: { G: 5, B: 4, P: 3, C: 3, T: 4 }, tags: ['网络'], sort: '2026-10-30',
    url: 'https://news.hubeidaily.net/pc/c_6126785.html'
  },
  {
    title: '来凤：整治农村快件违规收费，织密农村寄递惠民网',
    summary: '来凤县推进农村快件违规收费专项整治，同步完善县乡村三级寄递物流体系，村级网点统一公示收费标准、开通投诉直通渠道，农村取件「零加价」纳入常态化监管。',
    reason: '农村违规收费是监管高压线，同类问题在本区域乡镇网点同样高发。',
    action: '→ 排查本区域村级网点收费公示与二次收费投诉，建立零容忍处置流程。',
    region: '来凤', subRegion: '来凤县', cat: '恩施', src: '恩施新闻网', srcName: '恩施新闻网',
    s: { G: 5, B: 4, P: 4, C: 2, T: 4 }, tags: ['末端', '监管'], sort: '2026-10-29',
    url: 'http://www.enshi.cn/2026/1029/1311460.shtml'
  },
  {
    title: '松滋市邮政分公司推动山区邮路「双向破题」',
    summary: '松滋市邮政分公司以交邮合作、邮快合作方式重构山区邮路，下行带快递、上行带农产品，通过统一分拣与定时班车把山区乡镇投递频次提升到每周 5 次以上，降低单件运输成本。',
    reason: '邮快合作是山区降本主路径，可直接对标本区域乡镇网点的合作模式。',
    action: '→ 评估与邮政在松滋、五峰山区线路的共配可行性，测算单票分摊。',
    region: '松滋', subRegion: '松滋市', cat: '荆州城区', src: '荆州市邮政管理局', srcName: '湖北省邮政管理局',
    s: { G: 5, B: 3, P: 3, C: 3, T: 3 }, tags: ['末端', '成本'], sort: '2026-10-16',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202610/ee9f5356562b44b1980f40b7c708dda8.shtml'
  },
  {
    title: '荆州快递「平安员」两天守护三个「钱袋子」',
    summary: '荆州快递网点平安员在两天内连续识别并拦截三起涉诈资金寄递，协助公安机关止损；市邮政管理局将平安员纳入基层治理前哨，强化收寄环节异常件识别与上报流程。',
    reason: '涉诈寄递拦截已成行业考核加分项，也是网点合规风险的正面样板。',
    action: '→ 复制平安员异常件识别清单，在荆州区、沙市区网点同步培训。',
    region: '江陵', subRegion: '江陵县', cat: '荆州城区', src: '荆州市邮政管理局', srcName: '湖北省邮政管理局',
    s: { G: 5, B: 4, P: 3, C: 3, T: 4 }, tags: ['安全', '反诈'], sort: '2026-10-23',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202610/9eb7dbaaf5c2429c8b676c5344e41e85.shtml'
  },
  {
    title: '公安县：快递进村量连续两年领跑全市，智慧物流畅通「最后一公里」',
    summary: '公安县推进快递进村与智慧物流，村级站点覆盖率与进村件量连续两年居荆州首位，通过共同分拣、集中配送与智能柜降低末端成本，农村寄件时效提升。',
    reason: '同市标杆县的进村模式可直接复用，是本区域农村件量增长的参照。',
    action: '→ 取公安县进村件量与单票成本数据，对比本区域县市差距。',
    region: '公安', subRegion: '公安县', cat: '荆州城区', src: '湖北日报', srcName: '长江网/湖北日报',
    s: { G: 5, B: 4, P: 3, C: 3, T: 3 }, tags: ['末端'], sort: '2026-10-16',
    url: 'https://news.hubeidaily.net/pc/c_6067281.html'
  },
  {
    title: '石首市召开三季度「快递进村」暨安全生产业务培训会',
    summary: '石首市邮政业发展中心召开三季度「快递进村」暨安全生产业务培训会，通报进村件量与违规收费整治情况，培训寄递安全三项制度、消防与车辆安全规范，辖区网点负责人参加。',
    reason: '县级培训会通常伴随专项检查，是本区域网点合规的时间窗口。',
    action: '→ 提前完成三项制度与消防台账自查，迎接县级检查。',
    region: '石首', subRegion: '石首市', cat: '荆州城区', src: '石首市邮政业发展中心', srcName: '湖北省邮政管理局',
    s: { G: 5, B: 3, P: 3, C: 2, T: 4 }, tags: ['末端', '安全'], sort: '2026-10-20',
    url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202610/2a7659646f0840d9a8f0ab52e27d4213.shtml'
  },
  {
    title: '宜昌猇亭区三峡临空物流园项目设计服务中标候选人公示',
    summary: '宜昌市猇亭区三峡临空物流园项目方案设计及初步设计服务中标候选人公示，项目进入设计阶段；园区定位临空物流与航空货运配套，毗邻三峡机场货运区。',
    reason: '新增临空物流枢纽，中长期影响宜昌分拨格局与航空件路由。',
    action: '→ 跟踪园区招商与入驻政策，评估航空件前置仓布局可能。',
    region: '猇亭', subRegion: '猇亭区', cat: '宜昌城区', src: '宜昌市公共资源交易中心', srcName: '宜昌市公共资源交易中心',
    s: { G: 5, B: 3, P: 3, C: 2, T: 5 }, tags: ['枢纽'], sort: '2026-11-03',
    url: 'https://ggzy.sc.yichang.gov.cn/jyxx/003001/003001004/20261103/2f0bf72b-342c-44e8-a337-1fe5a0937081.html'
  },
  {
    title: '枝江：护航蜜柑出村进城，畅通农产品上行通道',
    summary: '枝江市交通运输部门联动快递企业开通蜜柑寄递绿色通道，在产区设临时收寄点、增开直发班车，11 月蜜柑集中上市期日均发件量明显上升，助力农产品上行。',
    reason: '柑橘季是鄂西件量季节性增量主来源，收寄能力决定能吃到多少量。',
    action: '→ 核对枝江、宜都柑橘产区临时收寄点与直发班车排班，抢旺季增量。',
    region: '枝江', subRegion: '枝江市', cat: '宜昌城区', src: '宜昌市交通运输局', srcName: '宜昌市交通运输局',
    s: { G: 5, B: 3, P: 3, C: 3, T: 5 }, tags: ['农产品上行'], sort: '2026-11-04',
    url: 'http://jtj.yichang.gov.cn/content-37827-963167-1.html'
  }
];

const LEADS = [
  {
    name: '宜昌农村电商产业带（三峡航空产业园·顺丰/薛航区域分拨）',
    biz: '农村电商全品类上行 + 航空货运配套（柑橘、茶叶、生鲜）',
    region: '宜昌', admin: '伍家岗区', tier: '城区', subRegion: '宜昌东站',
    address: '待核实（三峡航空产业园；宜昌市伍家岗区）',
    contact: '待核实（宜昌市商务局/邮政管理局）',
    reason: '宜昌农村电商规模 61.5 亿元，兑现电商物流降本增效奖励资金 85 万元，促成总投资超 60 亿元三峡航空产业园开工，引进顺丰、薛航区域分拨中心，6 个基地入选全国县域直播电商中心典型案例——政策资金+龙头分拨同时落地，是本区域最明确的增量货源池。',
    scale: '大型（61.5 亿元产业规模，含航空货运配套）',
    seasonal: '柑橘 11-12 月、茶叶 3-5 月、生鲜全年',
    src: '媒体', srcName: '搜狐/宜昌市邮政管理局', date: '11月03日', sort: '2026-11-03',
    score: 92, level: 'red', warn: false,
    url: 'https://www.sohu.com/a/1096745717_121106908'
  },
  {
    name: '公安县电商冷链物流基地（十六化建承建）',
    biz: '冷库仓储 + 电商冷链配送（气凝胶保温系统首次落地大型冷库）',
    region: '荆州', admin: '公安县', tier: '县级', subRegion: '公安',
    address: '待核实（公安县电商冷链物流基地）',
    contact: '待核实（项目建设单位/公安县商务局）',
    reason: '项目通过竣工验收，为公安县首个大型电商冷链基地，气凝胶保温系统落地意味着库容与温区达标，投运后生鲜电商件与冷链干线需求集中释放。',
    scale: '中型（大型冷库 + 电商冷链基地）',
    seasonal: '生鲜全年，柑橘/莲藕 11 月起集中',
    src: '媒体', srcName: '中国日报湖北', date: '10月14日', sort: '2026-10-14',
    score: 82, level: 'red', warn: false,
    url: 'https://ex.chinadaily.com.cn/exchange/partners/82/rss/channel/cn/columns/sz8srm/stories/WS6ad5b2c4e4b09a165c79003a.html'
  },
  {
    name: '咸丰「土味直播」矩阵（5 万粉丝撬动 6000 万流量）',
    biz: '农产品直播带货（腊肉、藤茶、富硒果蔬）+ 产地直发',
    region: '恩施', admin: '咸丰县', tier: '县级', subRegion: '咸丰',
    address: '待核实（咸丰县电商直播基地/各乡镇直播间）',
    contact: '待核实（咸丰县商务局）',
    reason: '5 万粉丝账号矩阵撬动 6000 万流量、带货 1500 万元，属县级头部直播体量，日均发件集中在腊味与生鲜，对时效件与泡沫箱包装依赖高，是可谈的协议客户。',
    scale: '中型（年带货 1500 万元）',
    seasonal: '腊味 11 月-次年 2 月、藤茶 4-10 月',
    src: '媒体', srcName: '楚天都市报', date: '11月02日', sort: '2026-11-02',
    score: 84, level: 'red', warn: false,
    url: 'https://www.ctdsb.net/c1747_202611/2894373.html'
  },
  {
    name: '秭归脐橙产业带（中国果业品牌大会落地）',
    biz: '脐橙鲜果上行 + 果业品牌供应链（分级包装、冷链）',
    region: '宜昌', admin: '秭归县', tier: '县级', subRegion: '秭归',
    address: '待核实（秭归县脐橙主产区：郭家坝、归州、水田坝）',
    contact: '待核实（秭归县农业农村局/脐橙协会）',
    reason: '中国果业品牌大会首次在秭归举办，全产业链招商与品牌背书叠加，脐橙季（11 月-次年 1 月）是鄂西单一体量最大的农产品寄递高峰，包装与时效要求高、单票溢价好。',
    scale: '大型（县域支柱产业，脐橙面积超 40 万亩）',
    seasonal: '脐橙 11 月-次年 1 月为绝对旺季',
    src: '媒体', srcName: '中国农业信息网', date: '11月02日', sort: '2026-11-02',
    score: 86, level: 'red', warn: false,
    url: 'https://www.agri.cn/zx/xxlb/hb_24266/202611/t20261102_8880767.htm'
  },
  {
    name: '枝江安福寺镇柑橘产销集群（电商+外贸双渠道）',
    biz: '柑橘种植加工 + 电商/外贸双渠道出货',
    region: '宜昌', admin: '枝江市', tier: '县级', subRegion: '枝江',
    address: '待核实（枝江市安福寺镇柑橘主产村）',
    contact: '待核实（安福寺镇政府/枝江市农业农村局）',
    reason: '安福寺镇柑橘产销两旺、电商与外贸双渠道并行，外贸柜与电商小包同时出货，对集货、报关前置与干线时效要求高于普通产区，可做跨境+国内双产品线。',
    scale: '中型（镇域产业集群）',
    seasonal: '柑橘 11 月-次年 1 月',
    src: '政府', srcName: '枝江市人民政府', date: '11月04日', sort: '2026-11-04',
    score: 78, level: 'red', warn: false,
    url: 'http://www.zgzhijiang.gov.cn/content-93-613885-1.html'
  },
  {
    name: '建始县城乡物流「四网融合」项目（政协提案推动）',
    biz: '县乡村三级物流配送 + 交邮/邮快/供销多网融合',
    region: '恩施', admin: '建始县', tier: '县级', subRegion: '建始',
    address: '待核实（建始县物流配送中心）',
    contact: '待核实（建始县交通运输局/供销社）',
    reason: '政协提案推动城乡物流四网融合，意味着县级共配中心与乡镇站点将获政策与资金支持，是介入共配、承接县域末端配送的窗口期。',
    scale: '中型（县域三级网络）',
    seasonal: '全年，农产品旺季 11 月-次年 1 月',
    src: '媒体', srcName: '人民网湖北', date: '11月03日', sort: '2026-11-03',
    score: 76, level: 'red', warn: false,
    url: 'https://hb.people.com.cn/n2/2026/1103/c192237-41740212.html'
  },
  {
    name: '恩施州电商业务培训（州商务局主办）',
    biz: '电商人才培训 + 企业孵化（直播、店铺运营）',
    region: '恩施', admin: '恩施市', tier: '城区', subRegion: '恩施',
    address: '待核实（恩施州商务局）',
    contact: '待核实（恩施州商务局电商科）',
    reason: '州商务局组织电商业务培训，参训主体多为中小电商与合作社，培训后通常伴随开店与发货需求，是低成本批量获客的场景。',
    scale: '小型（州级培训，参训企业数十家）',
    seasonal: '全年',
    src: '政府', srcName: '湖北省商务厅', date: '10月28日', sort: '2026-10-28',
    score: 70, level: 'orange', warn: false,
    url: 'https://swt.hubei.gov.cn/stdt/szsw/202610/t20261028_6042558.shtml'
  },
  {
    name: '松滋「无人邮车」山区配送（荆州屋脊线路）',
    biz: '无人配送车 + 山区邮路共配（农产品上行）',
    region: '荆州', admin: '松滋市', tier: '县级', subRegion: '松滋',
    address: '待核实（松滋市卸甲坪等山区乡镇）',
    contact: '待核实（松滋市邮政分公司）',
    reason: '无人邮车开上「荆州屋脊」，验证山区无人配送可行性，一旦规模化将改变山区末端成本结构，也是可对标的降本方案与合作切入点。',
    scale: '小型（试点线路）',
    seasonal: '全年，山货上行 10 月-次年 1 月',
    src: '政府', srcName: '松滋市人民政府', date: '10月20日', sort: '2026-10-20',
    score: 72, level: 'orange', warn: false,
    url: 'http://www.hbsz.gov.cn/gov_news/sz_news/202610/t20261020_1141072_zzzq.shtml'
  }
];

const SAFETY = [
  {
    title: '本周六荆州中心城区部分道路临时交通管制',
    summary: '荆州交管部门通告，本周六中心城区部分路段实施临时交通管制，涉及主干道封闭与绕行，管制时段内货车通行受限。',
    reason: '城区管制直接影响末端派送路线与时效，需提前改派。',
    region: '荆州城区', subRegion: '沙市区', src: '荆州交警', srcName: '新浪财经/荆州交管',
    date: '11月04日', sort: '2026-11-04', score: 84, level: 'red', tags: ['交通'], warn: false,
    url: 'https://finance.sina.com.cn/jjxw/2026-11-04/doc-inixpvvc8119401.shtml'
  },
  {
    title: '湖北省地质灾害气象风险预警（11 月 1 日）',
    summary: '湖北省自然资源厅与气象部门联合发布地质灾害气象风险预警，鄂西南恩施、宜昌西部等地部分区域风险较高，需防范强降水引发的崩塌、滑坡。',
    reason: '山区干线运输与乡镇投递存在中断风险，需前置预案。',
    region: '恩施', subRegion: '恩施市', src: '湖北省自然资源厅', srcName: '湖北省自然资源厅',
    date: '11月01日', sort: '2026-11-01', score: 80, level: 'red', tags: ['地质'], warn: false,
    url: 'https://zrzyt.hubei.gov.cn/fbjd/xxgkml/dzzh/doc.shtml?id=78570323a153457e9890434704be73c3'
  },
  {
    title: '湖北大范围降雨、局地暴雨，次日起风力加大',
    summary: '湖北省气象台通报，全省出现大范围降雨、局地暴雨，次日降雨缩减但风力加大，鄂西山区需关注道路湿滑与高空坠物风险。',
    reason: '降雨+大风叠加，末端派送效率与车辆安全风险同步上升。',
    region: '荆州城区', subRegion: '沙市区', src: '中国天气网', srcName: '中国天气网',
    date: '11月03日', sort: '2026-11-03', score: 78, level: 'red', tags: ['天气'], warn: false,
    url: 'https://news.weather.com.cn/2026/11/4845395.shtml'
  },
  {
    title: '荆门发布森林防火禁火令',
    summary: '荆门市发布森林防火禁火令，明确禁火期与禁火区域，严禁野外用火，违规将依法处理；同时要求物流仓储场所加强火源管控。',
    reason: '禁火期仓储与运输环节火源管控收紧，检查频次上升。',
    region: '荆门城区', subRegion: '东宝区', src: '湖北省应急管理厅', srcName: '湖北省应急管理厅',
    date: '11月02日', sort: '2026-11-02', score: 78, level: 'red', tags: ['消防'], warn: false,
    url: 'https://yjt.hubei.gov.cn/fbjd/dtyw/gddt/202611/t20261102_6046369.shtml'
  },
  {
    title: '恩施州未来三天预报：中南部中雨、偏南区域大雨',
    summary: '恩施州气象台预报，3 日夜间至 4 日早晨中南部有中雨、偏南区域大雨，山区道路能见度下降、部分路段易积水。',
    reason: '恩施南部乡镇线路易受阻，需调整班次与派送时序。',
    region: '恩施', subRegion: '恩施市', src: '恩施州气象台', srcName: '恩施广播电视台',
    date: '11月03日', sort: '2026-11-03', score: 76, level: 'red', tags: ['天气'], warn: false,
    url: 'https://estv.com.cn/html/www/pc/tt/20261103/3328717.html'
  },
  {
    title: '宜昌巴东海事处发布地质灾害气象风险三级水上交通安全预警',
    summary: '宜昌巴东海事处发布地质灾害气象风险三级（黄色）水上交通安全预警，长江巴东段受降雨影响，船舶通航与沿江作业需加强防范。',
    reason: '沿江乡镇轮渡与水上运输受限，影响巴东沿江末端配送。',
    region: '巴东', subRegion: '巴东县', src: '交通运输部', srcName: '交通运输部',
    date: '10月31日', sort: '2026-10-31', score: 74, level: 'orange', tags: ['交通'], warn: false,
    url: 'https://www.mot.gov.cn/fuwu/yujingtishi/cjanquanyujing/202610/t20261031_4227006.html'
  },
  {
    title: '湖北发布大风蓝色预警，最低气温降至 6℃',
    summary: '湖北多地发布大风蓝色预警，全省最低气温降至 6℃ 左右，鄂西山区早晚温差加大，露天作业与车辆行驶风险上升。',
    reason: '降温+大风影响早班分拣与山区行车安全，需调整作业时序。',
    region: '潜江', subRegion: '潜江市', src: '湖北广电', srcName: '长江云/湖北广电',
    date: '11月01日', sort: '2026-11-01', score: 74, level: 'orange', tags: ['天气'], warn: false,
    url: 'https://news.hbtv.com.cn/p/4639444.html'
  }
];

const has = (arr, u) => arr.some(x => x.url === u);
let addN = 0, addL = 0, addS = 0;

for (const it of NEWS) {
  const w = comp(it.s);
  if (has(D.news, it.url)) continue;
  D.news.unshift({ ...it, level: lv(w), date: cn(new Date(it.sort)), channel: '资讯', warn: false });
  addN++;
}
for (const it of LEADS) {
  if (has(D.leads, it.url)) continue;
  D.leads.unshift(it); addL++;
}
for (const it of SAFETY) {
  if (has(D.safety, it.url)) continue;
  D.safety.unshift(it); addS++;
}

const srt = (a, b) => (b.sort || '').localeCompare(a.sort || '');
D.news.sort(srt); D.leads.sort(srt); D.safety.sort(srt);
D.updatedAt = '2026-11-04';
writeFileSync('data.json', JSON.stringify(D, null, 1));
console.log(`新增 资讯 ${addN} / 电商 ${addL} / 安全 ${addS}`);
console.log(`合计 资讯 ${D.news.length} / 电商 ${D.leads.length} / 安全 ${D.safety.length}`);
