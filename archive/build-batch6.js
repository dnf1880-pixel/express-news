const fs = require('fs');

// 原始任务对象（与 search-batch-input-6.json 一一对应）
const QM = [
 {type:"search",region:"潜江",city:"潜江市",admin:"潜江市",tier:"城区",channel:"资讯",template:"news",label:"资讯",query:"潜江市邮政管理局 潜江 快递 通报 整治 投诉 最新",bureau:"潜江市邮政管理局",govBase:"https://www.hbqj.gov.cn/",media:"潜江发布"},
 {type:"search",region:"潜江",city:"潜江市",admin:"潜江市",tier:"城区",channel:"安全",template:"safety",label:"安全",query:"潜江 暴雨 封路 事故 交通管制 最新",bureau:"潜江市邮政管理局",govBase:"https://www.hbqj.gov.cn/",media:"潜江发布"},
 {type:"search",region:"潜江",city:"潜江市",admin:"潜江市",tier:"城区",channel:"电商",template:"ecom",label:"电商",query:"潜江 电商 产业园 水果 寄递 招商 最新",bureau:"潜江市邮政管理局",govBase:"https://www.hbqj.gov.cn/",media:"潜江发布"},
 {type:"search",region:"洪湖",city:"荆州市",admin:"洪湖市",tier:"县级",channel:"资讯",template:"news",label:"资讯",query:"荆州市邮政管理局 洪湖 快递 通报 整治 投诉 最新",bureau:"荆州市邮政管理局",govBase:"https://www.jingzhou.gov.cn/",media:"洪湖融媒"},
 {type:"search",region:"洪湖",city:"荆州市",admin:"洪湖市",tier:"县级",channel:"安全",template:"safety",label:"安全",query:"洪湖 暴雨 封路 事故 交通管制 最新",bureau:"荆州市邮政管理局",govBase:"https://www.jingzhou.gov.cn/",media:"洪湖融媒"},
 {type:"search",region:"洪湖",city:"荆州市",admin:"洪湖市",tier:"县级",channel:"电商",template:"ecom",label:"电商",query:"洪湖 电商 产业园 水果 寄递 招商 最新",bureau:"荆州市邮政管理局",govBase:"https://www.jingzhou.gov.cn/",media:"洪湖融媒"},
 {type:"search",region:"京山",city:"荆门市",admin:"京山县",tier:"县级",channel:"资讯",template:"news",label:"资讯",query:"荆门市邮政管理局 京山 快递 通报 整治 投诉 最新",bureau:"荆门市邮政管理局",govBase:"https://www.jingmen.gov.cn/",media:"京山融媒"},
 {type:"search",region:"京山",city:"荆门市",admin:"京山县",tier:"县级",channel:"安全",template:"safety",label:"安全",query:"京山 暴雨 封路 事故 交通管制 最新",bureau:"荆门市邮政管理局",govBase:"https://www.jingmen.gov.cn/",media:"京山融媒"},
 {type:"search",region:"京山",city:"荆门市",admin:"京山县",tier:"县级",channel:"电商",template:"ecom",label:"电商",query:"京山 电商 产业园 水果 寄递 招商 最新",bureau:"荆门市邮政管理局",govBase:"https://www.jingmen.gov.cn/",media:"京山融媒"},
 {type:"search",source:"安全专项-typhoon",scope:"湖北",channel:"安全",template:"typhoon",label:"台风/极端天气对鄂西物流影响",query:"湖北 台风 暴雨 预警 快递 物流 影响 最新"},
 {type:"search",source:"安全专项-quake",scope:"湖北",channel:"安全",template:"quake",label:"湖北及周边震情",query:"湖北 地震 最新 震感"},
 {type:"search",source:"安全专项-contraband",scope:"湖北",channel:"安全",template:"contraband",label:"违禁品寄递/禁寄物品查获",query:"快递 违禁品 寄递 查获 湖北 最新"},
 {type:"search",source:"安全专项-courier-accident",scope:"湖北",channel:"安全",template:"courier-accident",label:"人员/车辆安全事件",query:"快递员 三轮车 交通事故 湖北 最新"},
 {type:"search",source:"安全专项-depot-fire",scope:"湖北",channel:"安全",template:"depot-fire",label:"网点/仓库消防安全",query:"快递 网点 仓库 火灾 消防 隐患 湖北 最新"},
 {type:"fetch",source:"恩施州邮政管理局",url:"https://www.enshi.gov.cn/",scope:"恩施",channel:"资讯",label:"恩施物流园/寄递",degraded:true,query:"恩施州邮政管理局 恩施 最新公告 快递"},
 {type:"fetch",source:"国务院新闻办",url:"http://www.scio.gov.cn/",scope:"全国",channel:"资讯",label:"枢纽集群等重大发布",degraded:true,query:"国务院新闻办 全国 最新公告 快递"},
 {type:"fetch",source:"鄂州花湖机场",url:"https://www.huahuairport.com/",scope:"湖北",channel:"资讯",label:"货运枢纽动态",degraded:true,query:"鄂州花湖机场 湖北 最新公告 快递"},
 {type:"fetch-or-search",source:"恩施产业招商",url:"https://www.enshi.gov.cn/",scope:"恩施",channel:"电商",label:"富硒产业/电商示范",degraded:true},
 {type:"fetch-or-search",source:"湖北气象",url:"http://hb.cma.gov.cn/",scope:"湖北",channel:"安全",label:"暴雨/暴雪/大雾预警信号",degraded:true},
 {type:"fetch-or-search",source:"中国地震台网",url:"http://www.ceic.ac.cn/",scope:"全国",channel:"安全",label:"地震速报（关注湖北及周边震情）",degraded:true,query:"中国地震台网 全国 最新 预警 事故"},
 {type:"fetch-or-search",source:"湖北应急管理",url:"https://yjgl.hubei.gov.cn/",scope:"湖北",channel:"安全",label:"省内突发事件/灾害预警",degraded:true},
 {type:"fetch-or-search",source:"国家消防救援局",url:"https://www.119.gov.cn/",scope:"全国",channel:"安全",label:"火灾事故通报/消防安全整治",degraded:true}
];

const RES = [
 // 1 潜江资讯
 [
  {title:`浩口镇开展第二季度「扫黄打非」专项检查`,url:`https://www.cnqjw.com/dfbm/20260703/452472.html`,snippet:`浩口镇联合综合文化站对打印复印店、快递物流网点等重点场所开展第二季度「扫黄打非」专项检查,聚焦实名收寄、收寄验视、过机安检等寄递安全三项制度落实情况,排查非法出版物寄递流通渠道。`,date:`2026-07-03`},
  {title:`省纪委监委网站报道潜江:监督故事丨凭空出现的「保管费」`,url:`https://www.qjjcj.gov.cn/xwzx/lzyw/202508/t20250822_5752811.html`,snippet:`潜江市纪委监委督促市交通运输局对近三年快递行业投诉记录全面梳理,对整改完成投诉件开展回访,出台《投诉管理制度》,明确投诉必须现场核查、留存凭证、限时反馈。`,date:`2025-08-22`},
  {title:`荆楚网 加强寄递行业检查,潜江筑牢物流安全防线`,url:`https://cnqjw.com/mtjj/20240423/407277.html`,snippet:`潜江市张金镇邀请公安、烟草、交通物流局深入辖区物流寄递行业开展安全检查,重点检查资质证件、安全设施设备,要求严格落实收寄验视、实名收寄、过机安检制度,下达责令整改通知书5份。`,date:`2024-04-23`},
  {title:`顺丰快递员批量寄递「包治百病」广告 系统内随机选地址 寄件地址显示湖北省潜江市`,url:`https://www.toutiao.com/article/7637772469582955060`,snippet:`山东济南贾先生多次收到寄件地址显示为湖北省潜江市的顺丰「匿名快递」,实为保健品虚假宣传册。武汉市邮政管理局出具行政处罚告知书,对湖北顺丰速运有限公司罚款并责令改正。`,date:null}
 ],
 // 2 潜江安全
 [
  {title:`潜江市气象台发布暴雨橙色预警信号`,url:`https://nmc.cn/publish/alarm/42900541600000_20260729024035.html`,snippet:`潜江市气象台2026年7月29日2时40分发布暴雨橙色预警:过去6小时高石碑镇、广华街道已出现60毫米以上降水,预计未来12小时全市仍有30-50毫米降水,伴有雷电,阵风6-8级。`,date:`2026-07-29`},
  {title:`潜江连续强降雨来袭,未来四天大雨转小雨,体感闷热需防涝`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_0336a6830d638652`,snippet:`2026年7月28日潜江白天夜间均为大雨,最高29℃,空气湿度94%。气象部门提醒交通管理部门在易积水路段加强巡查和交通引导,低洼地区居民注意防范内涝。`,date:`2026-07-28`},
  {title:`潜江市气象台发布暴雨橙色预警[II级/严重]`,url:`https://m.tianqi.com/alarmnews/42900541600000_20260718004940.html`,snippet:`潜江市气象台2026年7月18日0时49分发布暴雨橙色预警:预计未来6小时城区及乡镇将出现分散性暴雨,最大小时雨强20-40毫米并伴有雷电,阵风7-9级,城乡积涝风险高。`,date:`2026-07-18`},
  {title:`潜江市交通运输局 关于实施防范台风「巴威」临时水上交通管制的通告`,url:`https://www.msa.gov.cn/html/cnmsa/hxaq/article/2026/7055250b48454df4a5a145d18ff312d0.html`,snippet:`受第9号台风「巴威」外围云系影响,潜江市交通运输局决定自2026年7月11日起对汉江潜江段实施临时水上交通管制,禁止运输船舶航行,辖区码头停止靠离泊作业。`,date:`2026-07-10`}
 ],
 // 3 潜江电商
 [
  {title:`全市农村电商快递协同发展示范区 建设推进会召开`,url:`http://qjrb.cnqjw.com/bz/html/content.html?articleId=iUYkRZ4B5tEblsFKJ2ft&articleIndex=3&cid=4&date=2026-05-20&pageIndex=1`,snippet:`5月19日潜江市召开农村电商快递协同发展示范区建设推进会,要求加快推进十号湖物流产业园建设,健全市镇村三级物流配送体系,聚焦纺织服装、绿色食品等产业推进物流快递与电商融合。`,date:`2026-05-20`},
  {title:`龙湾镇乡村振兴农业产业园建设「火力全开」`,url:`https://www.hbqj.gov.cn/xwzx/jrqj/smsh/202510/t20251010_5785935.html`,snippet:`潜江市龙湾镇盘活原陶瓷厂60余亩工业用地建设乡村振兴农业产业园,规划建设常温仓库、多温控冷库、物流交易中心,打造4条自动化分拣包装生产线,形成生产加工、仓储物流、电商直播全链条运营。`,date:`2025-10-10`},
  {title:`潜江龙湾 闲置地块「腾笼换鸟」 乡村振兴产业园正建`,url:`https://news.hubeidaily.net/pc/z_739101.html`,snippet:`潜江龙湾镇乡村振兴农业产业园已完成总进度50%,将建设常温仓库、联合厂房,配备智能化温控设备和自动化分拣包装线,依托多温控冷库和物流交易中心打造覆盖西南地区的农产品集散中心。`,date:null},
  {title:`潜江城市物流配送中心`,url:`http://www.xczzs.com/xcz1400131`,snippet:`潜江城市物流配送中心位于泰丰办事处,规划面积350亩,总投资约7亿元,主要建设城市配送、物流商贸、电子商务、智能仓储、第三方物流,由新城镇招商网托管招商。`,date:`2025-10-13`},
  {title:`传化公路港:打通物流「动脉」 集聚发展动能`,url:`https://www.cnqjw.com/qjxw/20220316/358579.html`,snippet:`传化智联江汉平原冷链物流中心落户潜江,是设计标准最高、规模最大的现代化城市物流中心,2021年平台服务产值达3亿元,计划打造全国农业现代化示范区标杆。`,date:`2022-03-16`}
 ],
 // 4 洪湖资讯
 [
  {title:`洪湖交通:整治农村地区领取邮件快件违规收费问题切实维护消费者合法权益`,url:`http://www.honghu.gov.cn/xw/bmdt/202505/t20250515_1011179.shtml`,snippet:`洪湖市邮政业发展中心开展农村地区领取邮件快件违规收费问题专项整治,检查城区站点及螺山、龙口、汊河、万全、乌林五个乡镇村级站点,督促严格执行快递服务标准。`,date:`2025-05-15`},
  {title:`荆州市邮政管理局对洪湖市「快递进村」工作开展专题调研`,url:`https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202603/7b6df70fef5a4a6db24ef9c4011d4a2d.shtml`,snippet:`荆州市邮政管理局赴洪湖市开展「快递进村」专题调研,针对回退现象决定集中开展防回退专项整治行动,要求加大监督执法力度,对典型问题予以通报,依法依规查处。`,date:null},
  {title:`荆州局召开全市邮政快递业安全生产和服务质量专项整治部署会`,url:`https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202606/667664c1a5e94ec6a1bf29c070bd199c.shtml`,snippet:`荆州市邮政管理局召开全市邮政快递业安全生产和服务质量专项整治部署会,通报2026年1-5月申诉、信访及安全生产情况,要求刚性落实实名收寄、收寄验视、过机安检三项制度。`,date:null},
  {title:`荆州市邮政管理局持续加强行业服务质量整治`,url:`https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202509/faaaff21d2654b348a7826f40c0f6a1c.shtml`,snippet:`荆州局开展快递服务质量突出问题专项整治,2025年7月申诉信访量较上半年月均下降19.95%,依托申诉信访数据点对点指导薄弱企业提升服务管理质效。`,date:null}
 ],
 // 5 洪湖安全
 [
  {title:`关于对S214省道峰口沙岭桥至万全红桥村部分路段采取限制通行措施的通告`,url:`https://www.toutiao.com/article/7667164550038438452/`,snippet:`因S214省道洪湖市峰口镇沙岭桥至万全镇红桥段路面养护结构性改造,2026年7月28日至10月26日实施半幅轮流封闭施工,限速30公里/小时,大型货车可绕行S86赤洪高速。`,date:`2026-07-27`},
  {title:`湖北省荆州市气象台发布暴雨黄色预警信号`,url:`https://k.sina.cn/article_7517400647_1c0126e4705908r2ck.html`,snippet:`荆州市气象台2026年7月6日14时18分发布暴雨黄色预警:预计傍晚至夜间石首、监利、洪湖大部乡镇及街道有大雨到暴雨、局部大暴雨,并伴有短时强降水、雷暴大风。`,date:`2026-07-06`},
  {title:`洪湖市气象台发布暴雨黄色预警[III级/较重]`,url:`https://weather.cma.cn/m/web/alarm/42108341600000_20260630161519.html`,snippet:`洪湖市气象台2026年6月30日16时15分发布暴雨黄色预警:受降雨云团持续影响,预计下午至夜间洪湖部分乡镇及街道累计雨量将达暴雨量级,伴有雷电、阵风5-7级。`,date:`2026-06-30`},
  {title:`下午16时,荆州这一高速入口实行交通管制!`,url:`https://www.toutiao.com/article/7660791528234828328/`,snippet:`2026年7月10日因S13武监高速监武向抢修施工,16时整主线封闭,往武汉方向车辆在K97公里处进入洪湖服务区等候,洪湖收费站入口临时交通管制。`,date:`2026-07-10`},
  {title:`洪湖市积极应对强降雨天气`,url:`http://www.honghu.gov.cn/xw/hhyw/202605/t20260527_1109339_slh.shtml`,snippet:`5月25日晚至26日清晨洪湖市普降大到暴雨,市交通运输局启动暴雨橙色预警应急响应,组建68人应急抢险队伍对国省干线每2小时全覆盖巡查,及时疏堵保畅。`,date:`2026-05-27`}
 ],
 // 6 洪湖电商
 [
  {title:`洪湖市支持电子商务发展的若干措施(征求意见稿)`,url:`http://www.honghu.gov.cn/IGI/upload/file/2023/02/27/20230227050708987384.doc`,snippet:`洪湖市拟对投资建设市、镇级电商产业园并引入快递物流仓储中心等业态的运营主体给予一次性奖励,市级园区经营面积达10000平方米以上、入驻企业10家及以上奖20万元。`,date:`2023-02-27`},
  {title:`沙口镇赴上海市开展招商引资活动`,url:`http://honghu.gov.cn/xw/xzdt/202512/t20251227_1060289.shtml`,snippet:`洪湖市沙口镇招商专班赴上海围绕食品及农产品深加工、电商物流及服务业开展精准招商考察,邀请企业家到洪湖考察投资,推进务实合作。`,date:`2025-12-27`},
  {title:`洪湖市人民政府办公室关于印发洪湖市推进楚商回乡和返乡创业工作实施方案的通知`,url:`http://zwgk.honghu.gov.cn/30279/109220253/t125220253094/624538.shtml`,snippet:`洪湖市推进楚商回乡和返乡创业,引导返乡人员建立返乡创业电商基地、小型电商集聚区,在邮政等物流平台开通返乡创业产品上行专线,降低物流成本。`,date:null},
  {title:`乌林镇党委副书记、镇长严晶:文旅+电商 唱响乌林名片`,url:`http://www.honghu.gov.cn/xw/xzdt/202503/t20250317_998213.shtml`,snippet:`乌林镇依托电商直播基地培养40名主播,打造乌林镇电商产业园,依托洪湖特色农产品形成农民—基地—加工企业—电商企业产销供耦合体系,力争2025年电商销售额达1.5亿元。`,date:`2025-03-17`},
  {title:`华洪物流园`,url:`https://m.chinawutong.com/201/wlyw2824.html`,snippet:`华洪物流园位于洪湖市,设有仓储区、专线区、分拨区,适合物流仓储、分拣、配送、电子商务、生鲜食品、快递快运等,现面向全国招商。`,date:null}
 ],
 // 7 京山资讯
 [
  {title:`荆门市邮政管理局到京山市邮政快递企业调研「快递进村」行业维稳等重点工作`,url:`https://hb.spb.gov.cn/hubsyzglj/c104687/c104691/202512/f32aff86501146aa9631b49af9ea6d42.shtml`,snippet:`荆门市邮政管理局主要负责人带队前往京山调研快递进村、行业维稳和快递服务质量提升,要求深化邮快合作、维护企业稳定、提高投诉处理能力、开展行业反内卷行动。`,date:null},
  {title:`荆门市邮政管理局协调推进全市「快递进村」工作`,url:`https://hb.spb.gov.cn/hubsyzglj/c104687/c104691/202605/ac2729774ce340a4b6af70e5822797e1.shtml`,snippet:`荆门市邮政管理局赴沙洋、钟祥、京山开展快递进村协调督办,实地查看建制村进村情况,协调快件转邮接收、进村时效、村级网点操作不规范等问题。`,date:null},
  {title:`荆门市邮政管理局协助市公安局成功拦截涉诈包裹`,url:`https://hb.spb.gov.cn/hubsyzglj/c104687/c104691/202509/aa753353249c4e708fe3c6f02b3b6be1.shtml`,snippet:`2025年8月28日荆门市公安局通报一条快件涉诈线索,该快件由京山圆通揽收,荆门市邮政管理局立即拦截退回,成功阻止潜在诈骗行为发生。`,date:null},
  {title:`通知公告(荆门市邮政管理局)`,url:`https://hb.spb.gov.cn/hubsyzglj/c100068/c100112/common_listmores.shtml?channelId=442538b4702e42a1b20f32cbafa4aab4&code=c104693`,snippet:`荆门市邮政管理局通知公告显示,曾就未按址投递问题对京山韵达、京山申通等企业进行行政约谈,并就安全管理不力问题对多家快递企业开展约谈和责令改正。`,date:null}
 ],
 // 8 京山安全
 [
  {title:`最新!荆门发布暴雨黄色预警`,url:`https://new.qq.com/rain/a/20260728A05X6O00?refer=cp_1009`,snippet:`荆门市气象台2026年7月28日12时09分发布暴雨黄色预警,受「红霞」残涡影响,京山西北部出现分散性中到大雨,最大小时雨强出现在京山天门观站32.9毫米。`,date:`2026-07-28`},
  {title:`刚刚!京山发布强对流黄色预警,雷暴大风短时强降雨今天就到`,url:`https://finance.sina.com.cn/wm/2026-07-26/doc-inikcpvy8676625.shtml`,snippet:`京山市气象台2026年7月26日14时19分发布强对流黄色预警,预计下午到夜间京山大部乡镇和街道将出现分散性短时强降雨、雷暴大风,阵风6-8级,最大小时雨强20-40毫米。`,date:`2026-07-26`},
  {title:`湖北省荆门市京山市发布暴雨红色预警信号`,url:`https://www.163.com/dy/article/L22QI6QQ0514R9KQ.html`,snippet:`京山市气象台2026年7月17日20时59分升级暴雨预警为红色:过去1小时坪坝镇最大降水60.4毫米,预计未来3小时京山大部仍有30-60毫米降雨,局地超100毫米,致灾风险极高。`,date:`2026-07-17`},
  {title:`【公路交通阻断信息】关于临时封闭任畈路路段的通告`,url:`https://www.jingshan.gov.cn/art/2026/7/6/art_22840_1228115.html`,snippet:`因京山市2025年老旧小区改造项目任畈路雨水管网施工,需临时半封闭任畈路,封闭时间2026年7月5日至9月1日,请过往车辆注意行车安全。`,date:`2026-07-06`},
  {title:`关于做好防汛防台风工作的提醒函`,url:`https://www.jrjingshan.com/a/zt/ywjs/2026/0710/76916.html`,snippet:`荆门市应急委员会办公室2026年7月9日发布提醒函,要求市公安局加密国省干道巡逻,根据雨情及时采取限速、限行、封路等管制措施,引导车辆避开积水路段。`,date:`2026-07-09`}
 ],
 // 9 京山电商
 [
  {title:`金瑞智汇城「农品馆」开馆仪式暨招商运营发布会成功举行`,url:`https://jinrui56.com.cn/newabout.asp?fs_id=38&id=200`,snippet:`金瑞智汇城项目占地1000亩,包含智汇物流园、智汇农电商城等组团,一期已签约中国邮政、菜鸟、圆通、中通、德邦等快递物流企业及淘宝、京东等农产品电商平台。`,date:null},
  {title:`数实融合京山案例:辉莱科技搭建新一代县域数字新基建`,url:`https://www.cnjjwb.com/news-show-184224.html`,snippet:`辉莱科技依托专利双循环模式聚焦京山桥米加工、轻工装备制造、网球文旅三大特色产业,盘活闲置厂房园区存量资产,打造县域经济内生蓄水池与电商集聚区。`,date:null},
  {title:`电商:畅通兴农富农「最后一公里」`,url:`https://dzb.jrjingshan.com/content/2022-05/13/023931.html`,snippet:`依托金瑞农电商物流园,京山建成6500平米市级电子商务公共服务中心和5万平米仓储物流配送中心,20多家快递物流企业入驻,日零担发送量达15万件。`,date:`2022-05-13`},
  {title:`主题市场(金瑞·农电商产业园)`,url:`http://jinrui56.com.cn/about.asp?fs_id=11&ff_id=33`,snippet:`金瑞·农电商产业园定位江汉平原现代农电商产业基地,集粮油电商产业园、农产品批发中心于一体,招商范围涵盖农副产品经销商、加工企业、种植养殖户等。`,date:null},
  {title:`京山市曹武镇:绿色食品电商产业园建设提速`,url:`https://news.hubeidaily.net/pc/c_4544834.html`,snippet:`京山市曹武镇推进绿色食品电商产业园建设,计划引进现代化物流仓储设施和电商平台,打造集生产、加工、销售于一体的综合性农业产业链,带动农民增收。`,date:null}
 ],
 // 10 typhoon
 [
  {title:`台风「红霞」及暴雨天气影响快递时效的温馨提示`,url:`https://www.jdl.com/news/7900-content03483`,snippet:`京东物流2026年7月24日发布提示,受台风「红霞」及暴雨影响,相关区域进出快递时效可能延迟,将密切关注天气合理调配资源确保快件安全送达。`,date:`2026-07-24`},
  {title:`麻城:多举措保障暴雨期间物流运输安全`,url:`http://hb.cma.gov.cn/xwzx/gzdt/202607/t20260708_7911605.html`,snippet:`受台风「美莎克」残余环流与梅雨锋共同影响,麻城遭遇暴雨到大暴雨,气象部门启动叫应将预警直达物流园区、冷链企业及司乘人员,物流企业及时调整运输计划绕行。`,date:`2026-07-08`},
  {title:`孝感市邮政管理局关于台风期间邮政快递服务的消费提示`,url:`https://hb.spb.gov.cn/hubsyzglj/c104724/c104729/202607/4cecd793ac2b4354889d1911e8c41d43.shtml`,snippet:`孝感市邮政管理局发布台风期间寄递消费提示,受第9号超强台风「巴威」外围环流影响,7月11日至14日邮件快件收寄、运输、中转、投递全流程可能受不利影响。`,date:null},
  {title:`台风「巴威」来袭,「楚超」延期,你的快递可能延迟送达`,url:`https://new.qq.com/rain/a/20260710A064FC00?refer=cp_1009`,snippet:`受台风「巴威」影响,圆通、中通、韵达、百世等多家物流企业发布告客户书,提醒全国多地快件中转、派送时效将出现不同程度延误。`,date:`2026-07-10`},
  {title:`台风「巴威」来袭,多家快递公司发声:近期进出这些地区的包裹时效或延迟`,url:`https://www.163.com/dy/article/L1ECB8RJ053469LG.html`,snippet:`7月9日晚顺丰、中通、圆通、韵达等快递公司发布公告,受台风「巴威」影响,近期黑龙江、吉林、辽宁、浙江、福建等多地快件收寄和派送将受影响。`,date:`2026-07-09`}
 ],
 // 11 quake
 [
  {title:`湖北宜昌市长阳县发生M2.2级地震`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_5676a5b34da49252`,snippet:`据湖北省地震局消息,2026年7月18日15时17分湖北宜昌市长阳县发生M2.2级地震,震源深度7公里,北纬30.41度、东经110.61度。`,date:`2026-07-18`},
  {title:`湖北宜昌市长阳县发生2.2级地震,震源深度7公里`,url:`https://www.toutiao.com/article/7663784495530672703`,snippet:`2026年7月18日15时17分,湖北宜昌市长阳县发生M2.2级地震,震源深度7公里,此前报道来源为湖北省地震局。`,date:`2026-07-18`},
  {title:`湖北宜昌市长阳县发生M2.2级地震`,url:`https://new.qq.com/rain/a/20260718A0768I00?refer=cp_1009`,snippet:`2026年7月18日15时17分,湖北宜昌市长阳县发生M2.2级地震,震源深度7公里,来源为湖北省地震局、极目新闻。`,date:`2026-07-18`},
  {title:`湖北宜昌市长阳县发生M2.2级地震`,url:`http://www.hubdzj.gov.cn/info_map2.jsp?id=11846&wbtreeid=1244`,snippet:`据中国地震台网测定,北京时间2026年7月18日15时17分在湖北宜昌市长阳县发生2.2级地震,震源深度7公里。`,date:`2026-07-18`},
  {title:`湖北荆州市荆州区发生M2.4级地震,震源深度5公里`,url:`https://m.jiemian.com/article/14699857.html`,snippet:`据湖北省地震局消息,2026年7月3日17时24分湖北荆州市荆州区发生M2.4级地震,震源深度5公里。`,date:`2026-07-03`}
 ],
 // 12 contraband
 [
  {title:`快速联动 精准拦截——我州成功阻断一起寄递渠道涉诈黄金外流案件`,url:`https://hb.spb.gov.cn/hubsyzglj/c105013/c105016/202604/a353cb30a46f4bcb8e88a7cf867c4fc5.shtml`,snippet:`恩施州邮政管理局与公安部门协作,成功拦截一件从利川寄出、夹带涉诈黄金31克的快递包裹,黄金藏入茶叶中用锡箔纸袋包装二次封口,伪装手段隐蔽。`,date:null},
  {title:`直击国门「缉毒战」:武汉海关这场活动揭开邮包里的隐藏危机`,url:`https://www.toutiao.com/article/7651948385401979455/`,snippet:`武汉海关联合公安、物流企业直击口岸禁毒一线,2024年至今口岸累计查获百余票涉毒邮件,其中精神药品、大麻制品、违规减肥类涉毒药品占比较高。`,date:`2026-06-16`},
  {title:`湖北公安 「警察同志,这茶叶不对劲!」`,url:`https://www.toutiao.com/article/7661933157498782234/`,snippet:`7月9日荆门市一快递驿站工作人员开箱验视发现茶叶内藏现金,识破电诈套路报警,民警劝阻寄件人免于被骗4000余元,提醒从业人员发现可疑物立即报案。`,date:`2026-07-09`},
  {title:`荆州市邮政管理局联合烟草专卖局持续推进寄递渠道涉烟违法整治工作`,url:`https://hb.spb.gov.cn/hubsyzglj/c104905/c104908/202512/3c5644834c2e47eca5f562e86f342729.shtml`,snippet:`荆州市邮政管理局联合市烟草专卖局推进寄递渠道涉烟违法整治,对邮政快递企业、网点开展拉网式排查,专项行动以来累计查获违规寄递卷烟1万余支。`,date:null},
  {title:`立案、约谈、罚款!快递企业违规运输丁烷压缩气罐报道后续来了`,url:`https://weibo.com/ttarticle/p/show?id=2309405032901002789075`,snippet:`湖北省邮政管理部门回应,鄂州市韵达快递未严格执行安全检查致丁烷压缩气罐流入寄递渠道,被责令停业整顿10天并罚款29800元,韵达湖北省公司被罚2万元并约谈。`,date:`2026-05-11`}
 ],
 // 13 courier-accident
 [
  {title:`五次调解化纠纷!民警跑腿帮八旬老人拿到全额赔偿款`,url:`https://news.hubeidaily.net/pc/c_4984328.html`,snippet:`快递员左某骑电动三轮车倒车时撞倒80岁居民何大爷致骨折,经民警五次调解,保险公司赔付1.9万元、左某支付2.3万元,4.2万元赔偿款全额到位。`,date:null},
  {title:`警邮联动筑防线 安全配送护出行——罗田交警开展快递行业交通安全专题培训`,url:`https://news.hubeidaily.net/pc/c_5765230.html`,snippet:`罗田交警走进邮政快递为一线驾驶人开展交通安全培训,聚焦两轮、三轮快递电动车安全驾驶规范,严禁酒后驾驶、违法载人、超速、闯红灯及违规加装遮阳篷。`,date:null},
  {title:`湖北交警: 别侥幸!这种车不能坐!`,url:`https://www.toutiao.com/article/7664531805118284288`,snippet:`黄冈交警拦停一辆满载6人的三轮载货摩托车,提醒农用三轮车违法载人非常危险,法律明令禁止货运机动车载客,一旦遇紧急情况极易酿成恶性事故。`,date:`2026-07-20`},
  {title:`武汉3岁男童小区遭三轮车撞亡,安全管理引担忧`,url:`https://www.toutiao.com/article/7600622229243691530/?wid=1778397554416`,snippet:`武汉光谷某小区一名3岁男童被送货三轮车撞倒不幸离世,暴露出小区外来车辆登记形同虚设、内部交通规则缺失、快递站点车辆超载超速等管理漏洞。`,date:null},
  {title:`行政处罚决定书(襄阳 三轮车交通事故逃逸)`,url:`https://gat.hubei.gov.cn/zfgk/document/detail/45cb1ec4-74d2-4242-9e4f-c833f8e908c0`,snippet:`詹某驾驶电动三轮车装载广告牌碰撞电动自行车致二人受伤,事故发生后逃逸,被认定负全部责任,构成造成致人轻伤以上交通事故后逃逸,被行政拘留七日。`,date:`2026-02-12`}
 ],
 // 14 depot-fire
 [
  {title:`五峰消防联合县邮政业发展中心开展邮政快递网点火灾隐患排查`,url:`https://news.hubeidaily.net/pc/c_5770436.html`,snippet:`7月14日五峰消防救援局联合县邮政业发展中心深入辖区快递网点排查火灾隐患,发现包裹堵塞疏散通道、灭火器被遮挡、私拉插排、室内存放充电电瓶等问题并督促整改。`,date:null},
  {title:`宜昌长阳:消防宣讲走进邮政快递网点 实操演练守护寄递平安`,url:`https://news.hubeidaily.net/pc/c_5758313.html`,snippet:`长阳消防救援局组织宣传人员走进快递分拨中心开展消防安全教学与实战演练,围绕快件堆放、车间用电、电动车充电、违禁品排查等重点内容普及自救知识。`,date:null},
  {title:`鄂州局全面开展快递末端网点消防安全专项检查`,url:`https://hb.spb.gov.cn/hubsyzglj/c104797/c104800/202607/247cb9055b194c27a2dfbd281a6466b1.shtml`,snippet:`鄂州市邮政管理局对全市快递末端网点开展全覆盖消防安全专项排查,重点整治私拉乱接、通道堵塞、室内违规充电、器材缺失过期等风险,实行限期整改复查销号。`,date:null},
  {title:`以练筑防 以训提能——十堰市邮政快递行业开展消防安全知识培训暨实战应急演练`,url:`https://hb.spb.gov.cn/hubsyzglj/c104633/202606/497a03709d3144ad90790fe719de193a.shtml`,snippet:`十堰局在市快递物流园组织消防安全培训和实战演练,围绕分拨中心货物堆放、网点用电、电动自行车违规充电、三合一场所防火等高频风险点展开。`,date:null},
  {title:`安全生产月 公安县开展邮政快递业消防安全培训及应急演练`,url:`https://www.cjyunjianghanfeng.cn/p/519241.html`,snippet:`公安县邮政业发展中心组织全县邮政快递企业开展消防安全培训及应急演练,模拟快件堆场包裹自燃场景,开展警戒、疏散和初期火情处置全流程演练。`,date:null}
 ],
 // 15 恩施 fetch
 [
  {title:`恩施局部署开展邮政业安全生产集中攻坚行动`,url:`https://hb.spb.gov.cn/hubsyzglj/c105013/c105016/202607/a9e9d95548d5421f912a068c587b4812.shtml`,snippet:`恩施州邮政管理局印发《恩施州邮政业安全生产风险隐患大排查大整治集中攻坚行动方案》,决定自即日起至2026年底在全州开展安全生产集中攻坚行动。`,date:null},
  {title:`恩施州明确2026年邮政业绿色发展任务清单`,url:`https://hb.spb.gov.cn/hubsyzglj/c105013/c105016/202605/add713a038fb4d2e8eedac61f8b621c3.shtml`,snippet:`恩施州邮政管理局发布《全州邮政业生态环保2026年工作要点》,推广以竹代塑,力争年底同城快递循环包装比例达12%,快递电商件不再二次包装比例达99.5%以上。`,date:null},
  {title:`恩施州召开2026年寄递渠道安全管理工作会议`,url:`https://hb.spb.gov.cn/hubsyzglj/c105013/c105016/202606/2c3228cf302f4da081a96e622c9b7a09.shtml`,snippet:`恩施州召开2026年寄递渠道安全管理工作会议,以寄递安全三项制度落实、两金等涉诈物品寄递管控、末端网点消防安全整治为重点部署隐患排查整治。`,date:null},
  {title:`恩施局组织召开二季度政企联席会`,url:`https://hb.spb.gov.cn/hubsyzglj/c105013/c105016/202606/fc65cd87351041d1b5200c831c5580db.shtml`,snippet:`恩施州邮政管理局召开二季度政企联席会,通报上半年邮政普遍服务和特殊服务监管情况,部署录取通知书寄递、安全生产、农村寄递物流体系建设等重点工作。`,date:null}
 ],
 // 16 国新办
 [
  {title:`国新办发布会公布五大全球性国际邮政快递枢纽集群名单,武汉鄂州位列其中`,url:`https://dy.163.com/article/L2C8SHIC053469LG.html`,snippet:`7月21日国新办举行「开局起步十五五」发布会,国家邮政局副局长陈凯介绍,基本建成武汉鄂州郑州长沙等五大全球性国际邮政快递枢纽集群。`,date:`2026-07-21`},
  {title:`交通建设发力补短板、扬优势(权威发布·开局起步「十五五」)`,url:`https://new.qq.com/rain/a/20260722A046WG00?refer=cp_1009`,snippet:`国新办发布会介绍「十五五」现代化综合交通运输体系建设,国家邮政局表示将加快建设现代化寄递物流网络,发展低空寄递物流,深化快递服务现代农业、制造业。`,date:`2026-07-22`},
  {title:`《限制快递过度包装要求》7月起正式实施 快递包装「瘦身」按下快进键`,url:`https://www.toutiao.com/article/7658512228261380618`,snippet:`人民日报报道,《限制快递过度包装要求》国家标准7月起实施,将优化包装方式等原则转化为可量化刚性指标,引导寄递企业、电商经营者协同推动包装绿色化减量化。`,date:`2026-07-04`},
  {title:`聚焦「十五五」交通运输发展,国务院新闻办公室举行新闻发布会`,url:`https://www.jiangxiwuliu.com.cn/nd.jsp?fromColId=2&id=7158`,snippet:`国新办举行「十五五」交通运输发展新闻发布会,提出优布局、成集群、强能力、促衔接、联产业五方面推进国家邮政快递枢纽建设,武汉鄂州郑州长沙列入集群。`,date:null},
  {title:`基本建成交通强国将取得决定性进展——国新办发布会聚焦「十五五」时期交通运输领域新发展`,url:`https://www.jgsdaily.com/19/19qysj/19yw/138106.shtml`,snippet:`国新办发布会聚焦「十五五」交通运输发展,国家邮政局表示将通过优化普遍服务和特殊服务供给提高快递服务质效,推进绿色低碳发展,深化农村寄递物流体系建设。`,date:null}
 ],
 // 17 花湖
 [
  {title:`凌空拓新途 花湖机场连开2条洲际货运航线`,url:`https://lkjjq.ezhou.gov.cn/lkzx/lkdt/202605/t20260518_764751.shtml`,snippet:`5月16日至17日鄂州花湖国际机场连续开通至捷克布拉格、德国哈恩两条洲际货运航线,采用B777F全货机执飞,进一步织密对欧航空物流网络。`,date:`2026-05-18`},
  {title:`鄂州花湖国际机场与海南机场集团、顺丰集团签署战略合作协议`,url:`https://www.ezhou.gov.cn/zt/zdzt/hkcs/ywdt/202604/t20260414_759806.html`,snippet:`鄂州花湖国际机场与海南机场集团、顺丰集团签署战略合作协议,开通「鄂州⇌海口」定期货运航线,发布「琼鄂顺达快线」,打造连接华中与东南亚的物流通道。`,date:`2026-04-14`},
  {title:`奋力打造武汉都市圈协同发展区 为全省支点建设贡献鄂州力量`,url:`https://www.ezhou.gov.cn/zt/zdzt/hkcs/xwfbh/202606/t20260622_768749.html`,snippet:`鄂州专场发布会解读「十五五」规划,花湖国际机场将加密优化欧美航线、拓展一带一路和RCEP空中通道,投用北区国际货站,国际货邮保障能力达140万吨/年。`,date:`2026-06-22`},
  {title:`鄂州花湖国际机场连开两条洲际货运航线`,url:`https://hb.spb.gov.cn/hubsyzglj/c104797/c104800/202605/fa7ea96ae4cc478d9294a90f32234af3.shtml`,snippet:`鄂州花湖国际机场开通至布拉格、哈恩洲际货运航线,华中发往欧洲邮政快递包裹时效较传统中转缩短3-5天,配套德国哈恩海外仓实现航空干线加海外仓一体化寄递。`,date:null},
  {title:`鄂州花湖国际机场6天连开5条国际货运航线`,url:`https://www.spb.gov.cn/gjyzj/c100195/202501/c3470bddd02748a58bbc7e58fa273cde.shtml`,snippet:`鄂州花湖国际机场连续开通至巴黎、墨西哥城、克拉克、马斯特里赫特、第比利斯5条国际货运航线,加密至列日、法兰克福、布达佩斯航线,每周保障国际货运航班超120班。`,date:null}
 ],
 // 18 恩施产业招商 (derived query)
 [
  {title:`建始县供销社:深化「供京合作」 共建县域农产品供应链体系`,url:`http://gxs.enshi.gov.cn/xsgz/202512/t20251210_1762622.shtml`,snippet:`建始县供销社招引京斗云公司,共建京东物流供应链(恩施)产业基地,占地约110亩,补足本地电商与物流基建短板,通过直播加供应链模式推动富硒产品上行。`,date:`2025-12-10`},
  {title:`京东物流供应链(恩施)产业基地建设正酣`,url:`http://www.enshi.gov.cn/xw/xsdt/202511/t20251121_1756117.shtml`,snippet:`京东物流供应链(恩施)产业基地位于建始县业州镇,占地7.4万余平方米,预计2026年6月前完成主体建设,同步打造农产品京东云仓和电商直播基地。`,date:`2025-11-21`},
  {title:`关于对州政协九届五次会议20260220号提案办理工作的会办意见`,url:`http://swj.enshi.gov.cn/xxgk/gkml/qtzdgknr/jytajgg/202606/t20260630_1816273.shtml`,snippet:`恩施州商务局表示恩施市跨境电商产业园基本建成,培训企业100余家,通过跨境电商完成进出口额4亿余元,并在摩洛哥建成全州首家海外仓。`,date:`2026-06-30`},
  {title:`恩施高新区富硒产业园招商工作推进会召开`,url:`http://kfq.enshi.gov.cn/bmgz/202508/t20250806_1725795.shtml`,snippet:`恩施高新区召开富硒产业园招商工作推进会,已与20余家优质企业对接洽谈,阳春啤酒项目成功签约,京东物流等知名企业合作事宜稳步推进。`,date:`2025-08-06`},
  {title:`对州九届人大五次会议20260112号建议办理工作的会办意见`,url:`http://www.enshi.gov.cn/zc/xxgkml/qtzdgknr/jytabl/rddbjyh/202606/t20260630_1816272.shtml`,snippet:`恩施州支持来凤、龙山共建农产品集散中心、冷链仓储物流节点,统一打造龙凤富硒公共区域品牌,鼓励两地电商产业园联动运营,培育直播电商、跨境电商主体。`,date:`2026-06-30`}
 ],
 // 19 湖北气象 (derived query)
 [
  {title:`湖北省十堰市丹江口市气象台发布暴雨橙色预警信号`,url:`https://www.nmc.cn/publish/alarm/42038141600000_20260729042417.html`,snippet:`丹江口市气象台2026年7月29日4时24分发布暴雨橙色预警:目前习家店马家沟降雨量已达30毫米,预计未来3小时局地累计雨量将达60毫米以上,山洪地质灾害风险高。`,date:`2026-07-29`},
  {title:`湖北省直辖县级行政区划仙桃市气象台发布暴雨黄色预警信号`,url:`https://www.nmc.cn/publish/alarm/42900441600000_20260729072201.html`,snippet:`仙桃市气象台2026年7月29日7时22分发布暴雨黄色预警:预计未来六小时西部乡镇及街道将有大雨到暴雨,伴有短时强降水、雷暴大风,最大小时雨强20-40毫米。`,date:`2026-07-29`},
  {title:`中央气象台发布暴雨、强对流预警:河南、山东、山西、河北、湖北等地有大到暴雨`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_4716a694e0e32652`,snippet:`据湖北气象最新消息,目前湖北省正在生效的预警信号有56期,其中橙红预警9期,发布暴雨橙色预警的有十堰、孝感、潜江等地,暴雨红色预警涉及十堰、宜昌、荆州等。`,date:`2026-07-29`},
  {title:`今明两天湖北降雨明显局地有大暴雨 后天高温天气再现`,url:`https://k.sina.com.cn/article_7879848923_1d5acf3db01901gae8.html`,snippet:`受「红霞」残涡和西南季风影响,7月28日至29日湖北大部仍有明显降雨,今天江汉平原大雨到暴雨、局地大暴雨,后天降雨减弱气温回升最高可达30至35℃。`,date:`2026-07-29`},
  {title:`暴雨、大暴雨、雷暴大风,马上到湖北,今天下班早点回家!`,url:`https://www.toutiao.com/article/7667674041695683124/`,snippet:`7月29日湖北气象发布实况,28日8时至10时松滋、茅箭、郧阳等地雨量超40毫米,全省51期预警信号生效,暴雨红色预警涉及十堰、宜昌、荆州等地,提醒谨慎出行。`,date:`2026-07-29`}
 ],
 // 20 地震台网 (has query)
 [
  {title:`云南发生地震 中国地震台网正式测定:7月29日00时53分在云南德宏州盈江县发生3.2级地震`,url:`https://www.toutiao.com/w/1872006794530828/`,snippet:`中国地震台网正式测定:7月29日00时53分在云南德宏州盈江县发生3.2级地震,震源深度8千米。`,date:`2026-07-29`},
  {title:`突发 青海20分钟2次5级以上地震!多地有震感!应急响应启动!`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_4496a68339961152`,snippet:`青海兴海县发生5.7级地震后,中国地震局已启动四级应急响应,兴海县温泉乡部分山体出现滑坡,海南州消防正赶赴震中。`,date:`2026-07-28`},
  {title:`青海兴海发生5.7级地震,震源深度10千米,网友反映西宁、兰州有震感`,url:`https://new.qq.com/rain/a/20260728A04V5Z00?refer=cp_1009`,snippet:`中国地震台网正式测定:7月28日11时16分在青海海南州兴海县发生5.7级地震,震源深度10千米,网友反映西宁、兰州有震感。`,date:`2026-07-28`},
  {title:`青海海南州兴海县发生5.7级地震`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_4406a68251991852`,snippet:`中国地震台网正式测定:7月28日11时16分在青海海南州兴海县发生5.7级地震,震源深度10千米,网友反映西宁、兰州有震感。`,date:`2026-07-28`}
 ],
 // 21 湖北应急管理 (derived query)
 [
  {title:`从「遇见」到「预见」 解码湖北防范化解灾害风险的实践路径`,url:`https://www.mem.gov.cn/xw/gdyj/202607/t20260725_677992.shtml`,snippet:`湖北省应急管理厅解读防范化解灾害风险实践,推行6-3-1递进式预警叫应和恩施三个一工作法,2026年5月27日恩施官坡社区巡查发现山体裂缝,1小时内转移128人避免伤亡。`,date:`2026-07-25`},
  {title:`山洪黄色预警!今明两天湖北这些地区需注意`,url:`https://new.qq.com/rain/a/20260728A0B2T900`,snippet:`湖北省防汛抗旱指挥部办公室7月28日发布黄色山洪灾害气象预警,预计28日20时至29日20时随州、襄阳、荆门(钟祥、京山)为黄色预警区域,提醒提前转移弱势人群。`,date:`2026-07-28`},
  {title:`湖北省发布山洪灾害气象预警,宜昌这些区域特别要注意`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_5206a67417d95152`,snippet:`湖北省防汛抗旱指挥部办公室7月27日发布黄色山洪灾害气象预警,荆州松滋、宜昌多地及恩施鹤峰、巴东、建始等为预警区域,提醒做好实时监测和转移避险。`,date:`2026-07-27`},
  {title:`红霞余威犹存 湖北中西部需警惕`,url:`https://www.163.com/dy/article/L2V4MS7K053469LG.html`,snippet:`湖北省自然资源厅和气象局7月28日联合发布地质灾害预警,三峡库区、十堰、襄阳、宜昌、荆门、孝感等地发生崩塌、滑坡、泥石流风险较高,局部风险高。`,date:`2026-07-28`},
  {title:`周末湖北等地暴雨如注 需警惕城市积涝等次生灾害`,url:`https://news.hubeidaily.net/pc/c_4167536.html`,snippet:`央视新闻报道,6月21日至22日贵州到长江中下游强降雨持续,湖北东部和南部局地特大暴雨,中央气象台继续发布暴雨橙色预警,需警惕城市积涝、中小河流洪水等次生灾害。`,date:`2025-06-21`}
 ],
 // 22 国家消防救援局 (derived query)
 [
  {title:`国家消防救援局党委强调 全力做好关键期防汛抢险救灾工作 全面加强基层消防安全治理`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_2146a601e3397552`,snippet:`7月20日国家消防救援局召开党委会,强调全力做好重庆彭水山体崩塌抢险救援,出战七下八上防汛关键期,深入推进高层建筑、劳动密集型企业、电动自行车全链条整治。`,date:`2026-07-22`},
  {title:`国家消防救援局党委强调 统筹抓好消防安全和防汛救灾 全力维护人民群众生命财产安全`,url:`https://so.html5.qq.com/page/real/search_news?docid=70000021_3556a56d9d586052`,snippet:`7月14日国家消防救援局召开党委会议,强调重拳整治劳动密集型企业等重点领域消防安全风险隐患,持续关注雨情汛情,前置布防闻令而动处置险情灾情。`,date:`2026-07-14`},
  {title:`国家消防救援局举行例行新闻发布会 介绍近期消防安全形势和消防救援重点工作`,url:`https://js.119.gov.cn/202606/jsxfww-menu-zxft-zxftlb_c_12e5b91d930f4aa0bafa.html`,snippet:`国家消防救援局建立较大火灾事故调查备案审查制度,今年20起较大火灾中居民住宅占14起、电气故障诱发占65%,电动自行车非法改装违规充电问题出现反弹。`,date:null},
  {title:`三部门调度医疗和养老机构消防安全`,url:`https://js.119.gov.cn/202607/jsxfww-menu-xfyw_c_ce2a84c28df3457281e0.html`,snippet:`国家消防救援局、国家卫生健康委、民政部联合召开全国医疗和养老机构消防安全视频调度会,通报暗访情况,要求压实主体责任,常态化开展隐患排查。`,date:null}
 ]
];

// 清洗英文双引号 -> 中文「」
function clean(s){
  if(typeof s !== 'string') return s;
  return s.replace(/"([^"]*)"/g, '「$1」').replace(/"/g, '「」');
}

const out = QM.map((qm, i) => ({
  queryMeta: qm,
  results: (RES[i] || []).map(r => ({
    title: clean(r.title),
    url: r.url,
    snippet: clean(r.snippet),
    date: r.date
  }))
}));

const outPath = 'D:/workbuddy/express-news/archive/search-results-batch6.json';
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('written', out.length, 'entries');
let total = 0; out.forEach(e => total += e.results.length);
console.log('total results', total);
