const fs = require('fs');

const inputFile = 'D:/workbuddy/express-news/archive/search-batch-input-5.json';
const outFile = 'D:/workbuddy/express-news/archive/search-results-batch5.json';

const tasks = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// sanitize: replace ASCII double quotes with 「」
function s(x) {
  return String(x == null ? '' : x).replace(/"/g, '「');
}

// results by task index (0-23), each: {title, url, snippet, date}
const R = [
  // 0 公安 news
  [
    {title: '公安县交通运输局:借力「6·26」禁毒日 筑牢寄递安全防线', url: 'http://jtys.jingzhou.gov.cn/xxdt_26/dtyw/202606/t20260626_1118854.shtml', snippet: '公安县交通运输局结合荆州市邮政管理局寄递安全三项制度专项整治部署，对县内寄递物流企业开展专项安全督导，现场下达责令改正通知书。', date: '2026-06-26'},
    {title: '公安县邮政业发展中心开展寄递三项制度专项整治', url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202606/55dda298a707482585b238a2806ec41e.shtml', snippet: '公安县邮政业发展中心落实荆州市邮政管理局部署，对县域邮政快递企业开展专项安全检查与帮扶指导，现场下达责令改正通知书。', date: null},
    {title: '荆州局召开全市邮政快递业安全生产和服务质量专项整治部署会', url: 'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202606/667664c1a5e94ec6a1bf29c070bd199c.shtml', snippet: '荆州市邮政管理局组织召开专项整治部署会，通报全市寄递行业2026年1-5月申诉、信访及安全生产总体情况，部署安全生产和服务质量整治。', date: null},
    {title: '荆州寄递渠道安全管理联席会议召开', url: 'https://www.spb.gov.cn/gjyzj/yzkdyaqsc02/202508/cad9dc521c5a4c9780dee51209b90f43.shtml', snippet: '荆州市召开寄递渠道安全管理联席会议，通报寄递渠道安全管理工作情况，部署深化寄递安全三项制度及专项治理工作。', date: null}
  ],
  // 1 公安 safety
  [],
  // 2 公安 ecom
  [
    {title: '硬核发力!公安县一批重点项目即将建成投产', url: 'https://so.html5.qq.com/page/real/search_news?docid=70000021_74369bd419272152', snippet: '中国供销公安商贸物流园占地178.91亩、总投资5亿元，聚焦一站式农产品商贸物流，预计年底对外运营，填补县域商贸物流产业整合空白。', date: null}
  ],
  // 3 江陵 news
  [
    {title: '红利直达「神经末梢」:江陵县农村快递服务「零加价」', url: 'https://news.hubeidaily.net/pc/c_4996255.html', snippet: '江陵县交通运输局对村级寄递物流服务网点开展突击检查，整治违规收费，2025年通过各类平台处理邮政快递行业投诉121条。', date: null},
    {title: '江陵县「快快合作」助推解决农村地区领取邮件快件违规收费问题', url: 'https://news.hubeidaily.net/mobile/c_4335887.html', snippet: '江陵县推进快快合作模式，建成县级共配中心1个、乡镇站10个、村级点96个，快递进村投递量日均1万件，同比增幅30%。', date: null},
    {title: '荆州局召开全市邮政快递业安全生产和服务质量专项整治部署会', url: 'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202606/667664c1a5e94ec6a1bf29c070bd199c.shtml', snippet: '荆州市邮政管理局通报全市寄递行业2026年1-5月申诉信访及安全生产情况，部署安全生产和服务质量专项整治。', date: null},
    {title: '荆州市邮政管理局持续加强行业服务质量整治', url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202509/faaaff21d2654b348a7826f40c0f6a1c.shtml', snippet: '荆州局开展快递服务质量突出问题专项整治，2025年7月申诉信访量较上半年月均下降19.95%，强化申诉信访与执法联动。', date: null}
  ],
  // 4 江陵 safety
  [
    {title: '荆州海事局气象类暴雨二级(橙色)水上交通安全预警', url: 'https://cjhy.mot.gov.cn/fw/cxfw/aqyj/202607/t20260729_486068.shtml', snippet: '公安县江陵县气象台2026年7月29日发布暴雨橙色预警，荆州海事局实施气象类二级橙色水上交通安全预警，预警范围长江干线鸭子口至茅林口。', date: '2026-07-29'},
    {title: '湖北省荆州市江陵县发布暴雨橙色预警信号', url: 'https://www.163.com/dy/article/L306HOTV0514R9KQ.html', snippet: '江陵县气象台2026年7月29日6时55分发布暴雨橙色预警信号，预计部分乡镇仍有30-50毫米降水，伴有雷电、阵风7-9级。', date: '2026-07-29'},
    {title: '江陵县气象台发布暴雨黄色预警[III级/较重]', url: 'https://weather.cma.cn/m/web/alarm/42102441600000_20260702172134.html', snippet: '江陵县气象台2026年7月2日17时21分发布暴雨黄色预警，预计傍晚到夜间有大雨到暴雨，城乡积涝、中小河流洪水风险较高。', date: '2026-07-02'},
    {title: '强降雨天气来临,江陵人请注意!', url: 'https://m.sohu.com/a/1055018835_121106908', snippet: '受台风红霞残涡影响，预计27日至28日江陵有暴雨过程，局地大暴雨，发布防范强降雨诱发的中小河流洪水及城乡积涝风险服务建议。', date: null},
    {title: '荆州海事局气象类暴雨二级(橙色)水上交通安全预警', url: 'https://cjhy.mot.gov.cn/fw/cxfw/aqyj/202606/t20260618_482370.shtml', snippet: '荆州市气象台2026年6月18日升级暴雨预警为橙色，预计江陵、公安、石首、监利将出现暴雨到大暴雨，荆州海事局实施橙色水上交通安全预警。', date: '2026-06-18'}
  ],
  // 5 江陵 ecom
  [
    {title: '江陵县农产品加工产业链招商场景机会', url: 'http://jiangling.gov.cn/ztzl/yhyshj/202512/t20251231_1061272.shtml', snippet: '江陵发布农产品加工产业链招商场景，包括产地冷链物流与全国性销售网络，欢迎电商平台、MCN机构设立直播基地或产地供应链公司。', date: '2025-12-31'},
    {title: '江陵县现代物流产业链招商场景机会和场景能力', url: 'http://www.jiangling.gov.cn/ztzl/yhyshj/202512/t20251231_1061267.shtml', snippet: '江陵创新构建县乡村三级寄递物流体系，建成1个县级共配中心、10个乡镇站、96个村级点，2024年全县电商交易额达16.32亿元。', date: '2025-12-31'},
    {title: '江陵县现代物流产业链招商场景机会', url: 'http://jiangling.gov.cn/ztzl/yhyshj/202512/t20251231_1061268.shtml', snippet: '江陵重点发布临港大宗商品、高端制造供应链枢纽、华中区域性冷链与生鲜物流中心等四大招商场景机会。', date: '2025-12-31'},
    {title: '关于印发《江陵县现代物流产业链高质量发展行动方案》的通知', url: 'http://zwgk.jiangling.gov.cn/jtysj/4088/109220253/t117220253094/621593.shtml', snippet: '江陵以郢都电商快递产业园为核心，支持邮政快递物流电商企业共建共享基础设施，打造集散加工、仓储配送、快递分拨综合物流中心。', date: null},
    {title: '荆州邮政:从「田间地头」到「全国餐桌」', url: 'https://www.cnhubei.com/content/2026-05/25/content_19996502.html', snippet: '江陵县入选农村电商快递协同发展示范区，江陵黄桃寄递物流服务提升项目入选示范项目，邮政设42个收寄点助黄桃出村。', date: '2026-05-25'}
  ],
  // 6 石首 news
  [
    {title: '石首:聚焦信访投诉整治 提升邮政快递服务质效', url: 'http://www.ctfzzz.com/show-14-62455-1.html', snippet: '石首市邮政业发展中心组织召开邮政快递业信访投诉整治专题推进会，通报企业信访投诉问题，部署按址投递等整改举措。', date: null},
    {title: '石首:精准监督 破农村快递「一元」收费难题', url: 'http://jzlz.gov.cn/column/dongtaiyaowen/xianshidongtai/21573.html', snippet: '石首市纪委监委推动解决农村快递违规收费，专班检查153个村级网点，退还群众违规收费3581元，农村快递服务合规率提升至100%。', date: null},
    {title: '【办实事 在行动】石首市交通运输局:整治取件乱收费 长效监管保民生', url: 'http://m.ssrmt.cn/p/34604.html', snippet: '石首市交通运输局整治寄递末端违规收费，累计退还群众费用3581元，罚款8600元，张贴取件不收费告示200余份。', date: null},
    {title: '荆州局召开全市邮政快递业安全生产和服务质量专项整治部署会', url: 'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202606/667664c1a5e94ec6a1bf29c070bd199c.shtml', snippet: '荆州市邮政管理局通报全市寄递行业2026年1-5月申诉信访及安全生产情况，部署专项整治行动。', date: null}
  ],
  // 7 石首 safety
  [
    {title: '为期10天!石首这段路请绕行', url: 'http://www.shishou.gov.cn/ssxwzx/xzpd/202607/t20260722_1123517.shtml', snippet: '因秦克湖生态补水工程施工，团山寺镇卫生院对面至鹤湾桥路段2026年7月27日至8月5日全封闭施工，禁止车辆行人通行。', date: '2026-07-22'},
    {title: '湖北省荆州市气象台发布暴雨黄色预警信号', url: 'https://k.sina.cn/article_7517400647_1c0126e4705908r2ck.html', snippet: '荆州市气象台2026年7月6日发布暴雨黄色预警，预计石首、监利、洪湖大部有大雨到暴雨、局部大暴雨，交通部门将采取管制措施。', date: '2026-07-06'},
    {title: '石首市交通运输综合执法大队:严阵以待防台风 筑牢交通安全线', url: 'https://news.hubeidaily.net/pc/c_5738211.html', snippet: '石首市交通运输综合执法大队部署防汛防台风工作，加密国省干线路段巡查，落实渡口停航避风，严查违规航行作业。', date: null},
    {title: '石首市气象台发布暴雨黄色预警[III级/较重]', url: 'https://weather.cma.cn/m/web/alarm/42108141600000_20260630130623.html', snippet: '石首市气象台2026年6月30日13时6分发布暴雨黄色预警，预计部分乡镇及街道累计雨量达暴雨量级，城乡积涝风险较高。', date: '2026-06-30'}
  ],
  // 8 石首 ecom
  [
    {title: '石首市物流项目落地实操指南:2026年中小县域物流升级的5个关键破局点', url: 'https://bdsr.ccpc360.com/fabu/zsku79215.html', snippet: '介绍石首临港物流园共享仓、冷链三级节点及荆江速运SaaS工具，田间到预冷时效缩至2.4小时，助力农产品电商仓配。', date: null},
    {title: '石首市召开电商协会现场座谈会 政企共商产业高质量发展', url: 'https://news.hubeidaily.net/pc/c_5770138.html', snippet: '石首市召开电商协会座谈会，走访电商产业园，要求夯实产业链基础、做强玉石首公用品牌、抓实人才引育，推动电商提质升级。', date: null},
    {title: '数字浪潮中的石首答卷:电商「拼」出振兴新高度', url: 'http://www.shishou.gov.cn/ssxwzx/bmdt/202508/t20250822_1034949.shtml', snippet: '石首市2025年上半年电商交易额34.61亿元，建成3000平方米电商综合服务平台，实施一村一主播计划培育农村电商带头人。', date: '2025-08-22'},
    {title: '石首市物流园项目最新进展:2026年投产在即', url: 'https://bdsr.ccpc360.com/fabu/zsku79218.html', snippet: '石首市物流园一期竣工验收，7栋仓储厂房、2座智能分拣中心及冷链中转仓试运营，已签约入驻企业32家。', date: null},
    {title: '石首澄明产业园只做专而精 打造食品界「小米生态圈」', url: 'https://www.toutiao.com/article/7646611656939766291', snippet: '荆州澄明产业园依托华鼎冷链与雪豹数智大模型，为入园企业共享全国冷链网络与物流底价，推动食品产业生态发展。', date: null}
  ],
  // 9 松滋 news
  [
    {title: '荆州市邮政管理局依托平安员系统成功拦截1起涉诈快件', url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202606/cda76f66f3fe4da290f4d20a4e0bad90.shtml', snippet: '松滋市顺丰某乡镇网点快递员发现82岁老人拟寄社保银行卡，依托平安员系统上报，警邮联动拦截涉诈快件保住养老财产。', date: null},
    {title: '关于开展集中整治农村地区领取邮件快件违规收费问题的通告', url: 'http://zwgk.hbsz.gov.cn/szsjtysj/24356/106220253/t118220253064/597689.shtml', snippet: '松滋市开展集中整治农村领取邮件快件违规收费专项工作，公布举报途径，整治时间2025年5月1日至12月31日。', date: '2025-06-09'},
    {title: '松滋市:治顽疾,建机制,农村快递重焕便民活力', url: 'https://news.hubeidaily.net/pc/c_4862409.html', snippet: '松滋市开展农村快递违规收费专项整治，对235个村级网点完成3轮排查，整改不规范问题5起，建设智能快递柜从源头解决收费。', date: null},
    {title: '荆州市邮政管理局持续加强行业服务质量整治', url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202509/faaaff21d2654b348a7826f40c0f6a1c.shtml', snippet: '荆州局开展快递服务质量突出问题专项整治，强化申诉信访与执法联动，打击扰乱市场秩序、侵害消费者权益行为。', date: null}
  ],
  // 10 松滋 safety
  [
    {title: '【图文直播】强降雨来袭,荆州城区暂未出现积水路段', url: 'https://www.toutiao.com/a7643246121787163172?channel=', snippet: '荆州交管局发布实时路况，松滋大队S225省道边山河大桥拆除重建实行交通管制，荆松一级公路部分路段半幅封闭。', date: null},
    {title: '湖北省荆州市松滋市发布暴雨红色预警信号', url: 'https://so.html5.qq.com/page/real/search_news?docid=70000021_9476a67fe9a73752', snippet: '松滋市气象台2026年7月28日7时47分升级暴雨红色预警，过去24小时最大降水182.2毫米，城乡积涝、山洪、地质灾害风险高。', date: '2026-07-28'},
    {title: '迎战强降雨,一直在行动!', url: 'http://www.hbsz.gov.cn/gov_news/sz_news/202605/t20260519_1107706_zzzq.shtml', snippet: '松滋市各地闻令而动开展积水抢排、防汛排涝，对严重积水及受损路段实施交通管制，转移避险群众。', date: '2026-05-19'},
    {title: '湖北省荆州市松滋市发布暴雨橙色预警', url: 'https://www.cneb.gov.cn/yjxx/csyj/20260723/t20260723_527726148.html', snippet: '松滋市气象台2026年7月23日20时25分发布暴雨橙色预警，预计未来3小时大部乡镇仍有50毫米以上降水，阵风9-11级。', date: '2026-07-23'}
  ],
  // 11 松滋 ecom
  [
    {title: '松滋市万家乡:一颗柑橘的「亿元蝶变」', url: 'http://www.hbsz.gov.cn/gov_news/xz_news/202510/t20251011_1044538.shtml', snippet: '总投资3亿元果愿松滋橘链智创产业园落户城东工业园，万家乡柑橘年产值9000余万元，建设电商物流服务平台3个。', date: '2025-10-11'},
    {title: '【楚商回乡 创在松滋】深耕9年,他每年将上亿松滋好物卖向全国', url: 'http://www.hbsz.gov.cn/gov_news/sz_news/202602/t20260213_1071527.shtml', snippet: '郑中涛创办松之云电商产业园，投资1.2亿元建设集电商运营、食品加工、智能物流于一体的产业园，年培育电商人才超4000人次。', date: '2026-02-13'},
    {title: '松滋万家乡柑橘链出亿元产业', url: 'https://ncxbepaper.hubeidaily.net/pc/content/202510/01/content_328024.html', snippet: '松滋万家乡柑橘产业链出亿元产业，搭建3个电商物流服务平台，与4家物流公司合作，抖音主播线上年销售额突破50万元。', date: null},
    {title: '日销万单!「双11」,松滋农产品卖「爆」了', url: 'http://hbsz.gov.cn/gov_news/sz_news/202511/t20251112_1051262.shtml', snippet: '湖北诺缘电商双11日均订单约1万单，投资1.2亿元建设电商产业园，预计2至3年内销售额突破5亿元。', date: '2025-11-12'},
    {title: '【劳动最光荣】他在直播间唱响「莲花落」,带动「松滋好物」走向全国', url: 'http://hbsz.gov.cn/gov_news/sz_news/202604/t20260429_1085490.shtml', snippet: '杨世海打造松之云诺缘电商产业园，构建直播运营、物流配送、农产品深加工一体产业模式，企业年销售额突破亿元。', date: '2026-04-29'}
  ],
  // 12 监利 news
  [
    {title: '荆州市邮政管理局持续加强行业服务质量整治', url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202509/faaaff21d2654b348a7826f40c0f6a1c.shtml', snippet: '荆州局开展快递服务质量突出问题专项整治，2025年7月申诉信访量较上半年月均下降19.95%，强化申诉信访与执法联动。', date: null},
    {title: '即日起,监利开展专项整治!', url: 'https://news.hubeidaily.net/pc/c_3908095.html', snippet: '监利市交通运输局自2025年4月起开展整治农村地区领取邮件快件违规收费问题专项行动，公布12345等反映渠道。', date: '2025-04-21'},
    {title: '荆州局召开全市邮政快递业安全生产和服务质量专项整治部署会', url: 'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202606/667664c1a5e94ec6a1bf29c070bd199c.shtml', snippet: '荆州市邮政管理局通报全市寄递行业2026年1-5月申诉信访及安全生产情况，部署专项整治行动。', date: null},
    {title: '荆州市邮政管理局开展烟花爆竹领域「打非治违」专项行动', url: 'https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202603/11fe3ae7278d4c47a05765aa7f3154d2.shtml', snippet: '荆州市邮政管理局赴包保责任区域监利市开展烟花爆竹打非治违专项督导，排查寄递渠道非法收寄烟花爆竹行为。', date: null}
  ],
  // 13 监利 safety
  [
    {title: '市公路发展中心连夜抢通保畅通', url: 'http://www.jianli.gov.cn/xw/bmdt/202607/t20260709_1121237.shtml', snippet: '监利市公路发展中心启动恶劣天气应急预案，清理倒伏路树76棵，巡查里程近400公里，未发生长时段拥堵或次生事故。', date: '2026-07-09'},
    {title: '实时路况,监利这些路段限行!', url: 'https://new.qq.com/rain/a/20260623A01X3D00?refer=cp_1009', snippet: '荆州市交管局发布实时路况，监利大队S215省道北口大桥、G351国道部分路段实行交通限制，禁止中型及以上货车通行。', date: '2026-06-23'},
    {title: '湖北省荆州市气象台发布暴雨黄色预警信号', url: 'https://k.sina.cn/article_7517400647_1c0126e4705908r2ck.html', snippet: '荆州市气象台2026年7月6日发布暴雨黄色预警，预计监利大部有大雨到暴雨、局部大暴雨，交通部门采取管制措施。', date: '2026-07-06'},
    {title: '荆州交警发布实时路况', url: 'https://www.163.com/dy/article/L1PIIMTV051495RL.html', snippet: '荆州交警发布实时路况，监利大队S215省道、G351国道部分路段实行交通限制，提醒过往车辆绕行。', date: null}
  ],
  // 14 监利 ecom
  [
    {title: '和监利一起奔跑 | 3万吨冷库投用!监利水产「鲜」人一步', url: 'http://www.jianli.gov.cn/xw/xzdt/202605/t20260511_1087817.shtml', snippet: '朱河现代水产产业园暨天顺冷链物流启动，3万吨级冷库投用，冷链车队4-12小时活鲜直达全国500个城市，损耗率降至5%以内。', date: '2026-05-11'},
    {title: '传统农产品乘上电商快车', url: 'http://news.cnchu.com/jzrb/wap/html/2024-09/26/nw.D421000jzrb_20240926_1-A004.htm', snippet: '监利市周老嘴镇打造电商强镇，兴建农村电商孵化中心，将藕粉、虾稻米等土特产搬上网络，日均销售农副产品800多单。', date: '2024-09-26'},
    {title: '美好置业:投资20亿元在湖北省监利县建设生态农业产业园项目', url: 'https://www.nbd.com.cn/rss/toutiao/articles/1219084.html', snippet: '美好置业与监利县政府签订协议，投资20亿元建设生态农业产业园，从事生态种养、农产品冷链物流与加工。', date: null},
    {title: '朱河现代水产产业园物流中心:补齐产业链「关键一公里」', url: 'http://www.jianli.gov.cn/xw/xzdt/202605/t20260511_1087836.shtml', snippet: '朱河现代水产产业园冷链物流启动，统一集货全程冷链直达全国，运输损耗从超10%降至不足0.5%，运费降约20%。', date: '2026-05-11'},
    {title: '监利市物流园项目最新进展:2026年投产实测数据、招商门槛、运输成本', url: 'https://www.ccpc360.com/fabu/zsku78892.html', snippet: '监利市物流园一期已运营，含高标仓8栋、冷链中心1座、智能分拣线3条，二期规划电商云仓集群，中小商户占比63%。', date: null}
  ],
  // 15 荆门城区 news
  [
    {title: '通知公告', url: 'https://hb.spb.gov.cn/hubsyzglj/c100068/c100112/common_listmores.shtml?channelId=442538b4702e42a1b20f32cbafa4aab4&code=c104693', snippet: '荆门市邮政管理局发布行政约谈、责令改正等执法信息，涉及未按址投递、安全管理不力、快递末端网点未备案等问题。', date: null},
    {title: '执法公开-约谈信息', url: 'http://zfgk.spb.gov.cn:8081/SPXzzfApp/base/spBaseXzzfOpenAction!toCheckDetails.action?openId=8a8bd70e9852682a019854f531231fa8', snippet: '湖北凯鑫邦物流有限公司（沙洋县中通）因擅自使用智能快件箱、快递服务站投递快件被荆门市邮政管理局警告。', date: '2025-07-29'},
    {title: '荆门邮政业高质量发展工作会召开', url: 'https://www.spb.gov.cn/gjyzj/c100015/c100017/202602/57494460a53f492394c9eca204d6d62b.shtml', snippet: '荆门市委常委召开全市邮政业高质量发展工作会，部署2026年任务，强调维护县域邮政市场稳定、深化寄递服务质量整治。', date: null},
    {title: '城区烟草象山所严查涉烟违法寄递', url: 'http://paper.jmnews.cn/jmwb/html/2026-05/27/content_708100.htm', snippet: '城区烟草专卖局象山所联合市邮政管理局开展寄递渠道涉烟违法错时检查，查获寄递涉烟案件3起，筑牢寄递渠道安全防线。', date: '2026-05-27'}
  ],
  // 16 荆门城区 safety
  [
    {title: '最新!荆门发布暴雨黄色预警', url: 'https://new.qq.com/rain/a/20260728A05X6O00?refer=cp_1009', snippet: '荆门市气象台2026年7月28日发布暴雨黄色预警，受红霞残涡影响预计大雨到暴雨，交通部门将在强降雨路段采取管制措施。', date: '2026-07-28'},
    {title: '湖北省荆门市气象台发布暴雨黄色预警信号', url: 'https://k.sina.com.cn/article_7517400647_1c0126e4705908wxre.html', snippet: '荆门市气象台2026年7月28日12时9分发布暴雨黄色预警，东宝区、掇刀区等将出现分散性大雨到暴雨，交通部门采取管制。', date: '2026-07-28'},
    {title: '提醒!荆门发布暴雨红色预警', url: 'https://so.html5.qq.com/page/real/search_news?docid=70000021_5916a6007e591352', snippet: '荆门市气象台2026年7月22日发布暴雨红色预警，掇刀区、钟祥南部大部地区仍有30-60毫米降雨，城乡积涝风险极高。', date: '2026-07-22'},
    {title: '端午遇中考,雨天出行请注意!', url: 'https://www.toutiao.com/article/7652628059858436660/', snippet: '荆门交警发布中考期间雨天出行提示，对龙泉中学等考点周边路段实施临时交通管控，提醒降速控距谨慎涉水。', date: '2026-06-18'},
    {title: '7月3日起,城区五条路分段封闭施工', url: 'https://jingmen.gov.cn/art/2026/6/29/art_693_1224936.html', snippet: '荆门城区象山二路、长坂坡路等五条路自7月3日起分阶段封闭施工，推进污水管网更新改造，工期贯穿整个暑期。', date: '2026-06-29'}
  ],
  // 17 荆门城区 ecom
  [
    {title: '免费入驻!沙洋县电商公服中心火热招商中', url: 'https://m.cjyunshayang.cn/p/12387.html', snippet: '沙洋县电子商务公共服务中心面向社会招商入驻，免场地租金、免直播间设备使用，优先销售本地特色农产品电商企业。', date: null},
    {title: '关于对市政协十届五次会议第182号提案会办工作的意见', url: 'https://www.jingmen.gov.cn/art/2026/6/25/art_29182_1226054.html', snippet: '荆门市招商局表示签约亿元以上现代服务业主业项目36个，其中云开电商基地、三里人电商直播平台等补齐本地电商配套短板。', date: '2026-06-25'},
    {title: '荆门市东宝区主要领导调度交通物流枢纽建设攻坚工作', url: 'https://hb.spb.gov.cn/hubsyzglj/c104687/c104691/202508/1e47fe94b8e14f61b65961895a1bcded.shtml', snippet: '东宝区调度交通物流枢纽建设，依托荆门智慧物流园推进快递资源整合，加大招商吸引物流头部企业，加快电商物流阵地建设。', date: null},
    {title: '中省媒体看东宝丨中国县域经济报:电商物流融合提速 构筑服务业新高地', url: 'https://118.jingmen.gov.cn/art/2025/12/5/art_7927_1193034.html', snippet: '东宝区建成五大电商特色功能区，吸引中通等5家快递共建共配中心，培育电商人才近3000人，直播销售额突破3亿元。', date: '2025-12-05'},
    {title: '极兔鄂西(荆门)智慧供应链产业园日均快递处理量超百万件', url: 'https://so.html5.qq.com/page/real/search_news?docid=70000021_760688eb58083752', snippet: '极兔鄂西（荆门）智慧供应链产业园2024年6月运营，长期合作企业突破500家，开通20多条省级直发线路，产能升级后日均处理超200万件。', date: null}
  ],
  // 18 沙洋 news
  [
    {title: '荆门市邮政管理局关于开展农村地区领取邮件快件违规收费问题专项治理工作的公告', url: 'https://hb.spb.gov.cn/hubsyzglj/c104687/c104693/202505/5f3846ec0d4d4760b1df9e98c74b3ac7.shtml', snippet: '荆门市邮政管理局公布农村地区领取邮件快件违规收费专项治理投诉举报渠道，沙洋县举报电话8551388，整治至2025年12月31日。', date: null},
    {title: '执法公开-约谈信息', url: 'http://zfgk.spb.gov.cn:8081/SPXzzfApp/base/spBaseXzzfOpenAction!toCheckDetails.action?openId=8a8bd70e9852682a019854f531231fa8', snippet: '湖北凯鑫邦物流有限公司（沙洋县中通）因擅自使用智能快件箱、快递服务站投递快件被荆门市邮政管理局警告。', date: '2025-07-29'},
    {title: '通知公告', url: 'https://hb.spb.gov.cn/hubsyzglj/c100068/c100112/common_listmores.shtml?channelId=442538b4702e42a1b20f32cbafa4aab4&code=c104693', snippet: '荆门市邮政管理局发布行政约谈、责令改正等执法信息，涉及未按址投递、安全管理、末端网点备案等问题。', date: null},
    {title: '荆门市邮政管理局协调推进全市「快递进村」工作', url: 'https://hb.spb.gov.cn/hubsyzglj/c104687/c104691/202605/ac2729774ce340a4b6af70e5822797e1.shtml', snippet: '荆门市邮政管理局赴沙洋县等开展快递进村协调督办，实地查看建制村快递进村情况，协调解决转邮接收、进村时效等矛盾。', date: null}
  ],
  // 19 沙洋 safety
  [
    {title: '最新!荆门发布暴雨黄色预警', url: 'https://so.html5.qq.com/page/real/search_news?docid=70000021_2596a6838b472552', snippet: '荆门市气象台2026年7月28日发布暴雨黄色预警，沙洋等地将出现分散性大雨到暴雨，交通部门在强降雨路段采取管制措施。', date: '2026-07-28'},
    {title: '沙洋县交通运输局多措并举筑牢防台风安全防线', url: 'https://www.shayang.gov.cn/art/2026/7/12/art_5441_1227515.html', snippet: '沙洋县交通运输局应对台风强降雨，检查客货运输企业，对200公里国省道拉网式巡查，汉江沙洋段航道巡查94公里。', date: '2026-07-12'},
    {title: '暴雨、雷暴大风!这波很猛,荆门接下来的雨势如何?', url: 'https://finance.sina.com.cn/wm/2026-07-28/doc-inikknsi3024460.shtml', snippet: '台风红霞残涡影响，荆门28日大雨到暴雨局地大暴雨，沙洋县毛李镇为大暴雨可能落区，需防范山洪滑坡等次生灾害。', date: '2026-07-28'},
    {title: '湖北省荆门市沙洋县发布暴雨橙色预警信号', url: 'https://so.html5.qq.com/page/real/search_news?docid=70000021_5366a60007856252', snippet: '沙洋县气象台2026年7月22日6时24分发布暴雨橙色预警，未来3小时沙洋北部乡镇将有40到70毫米降雨，山洪积涝风险高。', date: '2026-07-22'}
  ],
  // 20 沙洋 ecom
  [
    {title: '免费入驻!沙洋县电商公服中心火热招商中', url: 'https://m.cjyunshayang.cn/p/12387.html', snippet: '沙洋县电子商务公共服务中心招商入驻，设产品展示、物流分拣、仓储配送、电商培训等功能，免场地及设备租金。', date: null},
    {title: '滨江新区:沙洋智慧农博城项目抢工期 确保项目不停工', url: 'https://m.cjyunshayang.cn/p/28012.html', snippet: '沙洋智慧农博城总投资10亿元，建设智慧农副产品冷链物流交易中心，配套电商大厦、网红演播大厅，预计年前试运营。', date: null},
    {title: '沙政办发〔2025〕8号', url: 'https://shayang.gov.cn/module/download/downfile.jsp?filename=66eb9441652346da83ef5871d6a871fe.docx&classid=0', snippet: '沙洋县印发电商高质量发展2025-2026年行动方案，目标2026年农产品网络销售额突破15亿元，镇级冷链覆盖率提至50%以上。', date: '2025-09-11'},
    {title: '沙洋县电子商务公共服务中心正式运营', url: 'http://cjy.jptnews.cn/p/249421.html', snippet: '沙洋县电子商务公共服务中心正式运营，集总部办公、创业孵化、电商培训、特产展示于一体，多家本土电商企业入驻。', date: null},
    {title: '2026年政府工作报告', url: 'https://www.shayang.gov.cn/art/2026/1/12/art_2372_1198993.html', snippet: '沙洋县2026年政府工作报告提出全面建成铁水公空多式联运交通物流新枢纽，加快城乡融合与电商物流发展。', date: '2026-01-12'}
  ],
  // 21 钟祥 news
  [
    {title: '通知公告', url: 'https://hb.spb.gov.cn/hubsyzglj/c100068/c100112/common_listmores.shtml?channelId=442538b4702e42a1b20f32cbafa4aab4&code=c104693', snippet: '荆门市邮政管理局发布行政约谈、责令改正等执法信息，钟祥韵达等多家企业因未按址投递被约谈。', date: null},
    {title: '荆门市邮政管理局关于开展农村地区领取邮件快件违规收费问题专项治理工作的公告', url: 'https://hb.spb.gov.cn/hubsyzglj/c104687/c104693/202505/5f3846ec0d4d4760b1df9e98c74b3ac7.shtml', snippet: '荆门市邮政管理局公布专项治理投诉举报渠道，钟祥市举报电话4268955，整治农村地区领取邮件快件违规收费问题。', date: null},
    {title: '荆门局召开2026年二季度邮政普遍服务政企联席会', url: 'https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202604/d7ad17d30a974624b08a8202012306df.shtml', snippet: '荆门市邮政管理局召开二季度邮政普遍服务政企联席会，部署提升建制村服务质量、推动无人车应用和钟祥共配中心建设。', date: null},
    {title: '荆门市邮政管理局召开2026年半年工作会议', url: 'https://hb.spb.gov.cn/hubsyzglj/c104687/c104691/202607/a91a71b02961465491ab7cfd38478665.shtml', snippet: '荆门市邮政管理局召开半年工作会，强调深入推进农村寄递物流体系建设，开展快递市场服务质量突出问题专项整治。', date: null}
  ],
  // 22 钟祥 safety
  [
    {title: '最新!荆门发布暴雨黄色预警', url: 'https://new.qq.com/rain/a/20260728A05X6O00?refer=cp_1009', snippet: '荆门市气象台2026年7月28日发布暴雨黄色预警，钟祥东北部为大暴雨可能落区，交通部门在强降雨路段采取管制措施。', date: '2026-07-28'},
    {title: '提醒!荆门发布暴雨红色预警', url: 'https://so.html5.qq.com/page/real/search_news?docid=70000021_5916a6007e591352', snippet: '荆门市气象台2026年7月22日发布暴雨红色预警，钟祥南部大部地区仍有30-60毫米降雨，地质灾害、城乡积涝风险极高。', date: '2026-07-22'},
    {title: '直击钟祥农村公路抢险保通一线', url: 'https://www.sohu.com/a/1027999062_121106908', snippet: '受持续强降雨影响，钟祥市农村公路多处漫水、边坡溜方、路面损毁，农村公路管养局对危险路段实施主动管控、设置警示。', date: null},
    {title: '湖北省荆门市钟祥市气象台发布强对流黄色预警信号', url: 'https://www.nmc.cn/publish/alarm/42088141600000_20260729082629.html', snippet: '钟祥市气象台2026年7月29日8时26分发布强对流黄色预警，未来6小时东部乡镇有短时强降水、雷暴大风等强对流天气。', date: '2026-07-29'},
    {title: '湖北省荆门市2026-07-17 14:02发布暴雨橙色预警', url: 'https://m.tianqi.com/alarmnews/2607171442088141.html', snippet: '钟祥市气象台2026年7月17日14时2分发布暴雨橙色预警，柴湖镇最大降水51.7毫米，预计大部乡镇分散性暴雨。', date: '2026-07-17'}
  ],
  // 23 钟祥 ecom
  [
    {title: '大柴湖开发区2025年工作总结及2026年工作计划', url: 'https://zhongxiang.gov.cn/art/2026/2/3/art_13228_1204002.html', snippet: '大柴湖建成10000平方米花卉电商基地，引入奇玥电子商务开展花卉电商直播，园区电商日均销货约2万单、销售额约15万元。', date: '2026-02-03'},
    {title: '湖北大运物流园', url: 'https://m.chinawutong.com/201/wlyw2807.html', snippet: '湖北大运物流园位于钟祥市，适合物流仓储、分拣、配送、电子商务、生鲜食品、快递快运等，面向全国招商入驻。', date: null},
    {title: '京东(钟祥)数字经济产业园开园 京东科技助力湖北钟祥加「数」转型', url: 'https://www.cecc.org.cn/news/202303/571187.html', snippet: '京东（钟祥）数字经济产业园开园，10家重点企业签约入驻，提供电商、现代物流、区域品牌建设等一站式数智化升级服务。', date: null},
    {title: '2025年工作目标及2026年工作计划', url: 'https://www.zhongxiang.gov.cn/art/2026/1/30/art_12633_1203249.html', snippet: '钟祥市依托京东数字产业园与电商中心新增电商企业100家，挖掘葛粉、米茶等特色产品电商潜力，开展10场电商培训。', date: '2026-01-30'},
    {title: '京东云仓钟祥供应链基地', url: 'https://aiqicha.baidu.com/details/ugknowledge?id=a96b1d550ea785ae20a13d16debd5165', snippet: '京东云仓（钟祥）供应链基地改造原交通物流园，建设立体智慧冷库2万方及农产品交易中心，为电商企业提供一体化供应链方案。', date: null}
  ]
];

const out = tasks.map((t, i) => ({
  queryMeta: t,
  results: (R[i] || []).map(r => ({
    title: s(r.title),
    url: r.url,
    snippet: s(r.snippet),
    date: r.date || null
  }))
}));

fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
console.log('written', out.length, 'tasks; total results =', out.reduce((a, x) => a + x.results.length, 0));
