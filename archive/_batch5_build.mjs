const data = [
  {
    queryMeta: { query: "建始 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "建始", city: "恩施市", admin: "建始县", bureau: "恩施州邮政管理局" },
    results: [
      { title: "建始工业园区：项目建设提速增效 产业聚势赋能高质量发展", url: "https://estv.com.cn/sh/3253971.htm", snippet: "位于业州镇的建始富硒农产品加工产业园项目全速推进，规划电商展销中心、数智农贸集市等，打造集农产品加工、仓储物流、展示交易、研发培训、电商销售于一体的现代化综合性产业园。", date: null },
      { title: "京东物流供应链（恩施）产业基地建设正酣", url: "http://www.enshi.gov.cn/xw/xsdt/202511/t20251121_1756117.shtml", snippet: "京东物流供应链（恩施）产业基地正加紧建设，预计2026年6月前完成主体建设，将补足当地电商与物流基础设施短板，打造农产品京东云仓和电商直播基地。", date: null },
      { title: "建始县供销社深化“供京合作” 共建县域农产品供应链体系", url: "https://news.hubeidaily.net/pc/z_751098.html", snippet: "建始县供销社招引四川京斗云公司，推动总投资12.5亿元的中国（建始）硒产品交易中心项目稳步推进，京东物流供应链（恩施）产业基地为核心枢纽加速建设。", date: null },
      { title: "建始农产品加工园区稳步推进 项目建设跑出新年“加速度”", url: "https://www.cjbd.com.cn/dtxw3/3181653.html", snippet: "建始农产品加工园区为2026年湖北省重点项目，京东物流供应链（恩施）产业基地投资1.5亿元，计划2026年6月投入运营，预计年产值超100亿元。", date: null },
      { title: "建始县深化“交邮融合” 实现农村寄递物流降本增效", url: "https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202512/9c5489cc7ea648938b16f8183f9eb765.shtml", snippet: "建始县深化交邮融合模式，新建改造县级物流产业园、10个乡镇寄递物流综合服务站及159个村级示范服务点，打造数字化电商冷链物流扶贫产业园。", date: null }
    ]
  },
  {
    queryMeta: { query: "宜昌东站 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "宜昌东站", city: "宜昌市", admin: "伍家岗区", bureau: "宜昌市邮政管理局" },
    results: [
      { title: "市人民政府办公室关于印发《宜昌市建设全国性邮政快递枢纽承载城市工作方案》的通知", url: "https://www.yichang.gov.cn/zfxxgk/show.html?aid=1&id=224887&t=4", snippet: "附件重点项目清单含宜昌东站物流中心（各类仓库、快递配送区、快运中转区等），由伍家岗区政府负责，推动快递企业服务农产品加工和生鲜电商。", date: null },
      { title: "关于我们", url: "https://hbyctrade.com/aboutUs.html", snippet: "宜昌三峡物流园位于东站路188号，设农贸批发城、物流中心、仓储冷链配送中心、电商中心等五大功能区，年交易额500亿元，是鄂西渝东区域商品集散中心。", date: null },
      { title: "中国（宜昌）跨境电子商务综合试验区", url: "https://yjjdigital.com/yczsq/introduction", snippet: "宜昌自贸片区跨境电商产业园紧临宜昌火车东站，集聚阿里巴巴、亚马逊、速卖通等电商企业，是鄂西渝东区域跨境电商新引擎。", date: null },
      { title: "园区简介", url: "https://hubei.xuanzhi.com/yuanqu/detail/11355/intro", snippet: "三峡物流园位于伍家岗区东站路188号，紧临宜昌火车东站，设农贸城、冷链仓储配送中心、物流信息交易中心，是集展示交易、仓储、冷链、配送、电商等于一体的物流园。", date: null },
      { title: "宜昌三峡物流园有限公司", url: "http://www.kehui.net/index.php?aid=2719&file=read&id=46", snippet: "宜昌三峡物流园是稻花香集团投资18.8亿元打造的集农副产品展示交易、仓储、冷链、配送、电子商务等于一体的现代综合性物流园，紧临宜昌火车东站。", date: null }
    ]
  },
  {
    queryMeta: { query: "宜昌高新区 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "宜昌高新区", city: "宜昌市", admin: "西陵区", bureau: "宜昌市邮政管理局" },
    results: [
      { title: "创业孵化园春季招孵开始啦", url: "http://rsj.yichang.gov.cn/content-22791-983381-1.html", snippet: "中国科技开发院（宜昌）云计算孵化器位于宜昌高新区发展大道57-6号，招孵方向含电子信息、文化创意、电子商务方向。", date: null },
      { title: "三峡智慧航空产业园项目详情", url: "http://yczsy.com/smsw/30.html", snippet: "三峡智慧航空产业园位于猇亭区，重点招引快递分拨转运、跨境电商、货运代理、报关行等航空物流产业链企业，打造智慧化航空物流产业园。", date: null },
      { title: "宜昌和艺电子商务产业园", url: "https://baike.baidu.com/item/%E5%AE%9C%E6%98%8C%E5%92%8C%E8%89%BA%E7%94%B5%E5%AD%90%E5%95%86%E5%8A%A1%E4%BA%A7%E4%B8%9A%E5%9B%AD/53533196", snippet: "宜昌和艺电子商务产业园为国家级电子商务示范基地，入驻电商企业164家，为跨境电商企业提供人才、金融、通关等一站式服务。", date: null },
      { title: "创业孵化园春季招孵开始啦", url: "http://rsj.yichang.gov.cn/content-22792-981920-1.html", snippet: "中国科技开发院（宜昌）云计算孵化器位于宜昌高新区发展大道57-6号，招孵方向含电子信息、文化创意、电子商务方向。", date: null },
      { title: "挥师白洋一年后，他们重整行装再出发……", url: "http://gxq.yichang.gov.cn/content-20-27585-1.html", snippet: "宜昌高新区明确2026年起开展产业链招商三年行动，确保每年签约亿元以上产业项目90个以上，建设东部产业新区。", date: null }
    ]
  },
  {
    queryMeta: { query: "点军区 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "点军区", city: "宜昌市", admin: "点军区", bureau: "宜昌市邮政管理局" },
    results: [
      { title: "2026年点军区政府工作报告", url: "http://www.dianjun.gov.cn/zfxxgk/show.html?aid=5&id=58086", snippet: "点军区政府工作报告提出依托算力优势布局低空经济、具身智能等新兴未来产业，建设寄递物流公共配送中心，打造高校智慧物流试验区。", date: null },
      { title: "市人民政府办公室关于印发《宜昌市建设全国性邮政快递枢纽承载城市工作方案》的通知", url: "https://www.yichang.gov.cn/zfxxgk/show.html?aid=1&id=224887&t=4", snippet: "重点项目清单含点军区寄递物流公共配送中心（寄递物流公共配送中心、综合仓储中心、零担快运服务中心等），由点军区政府负责。", date: null },
      { title: "点军区寄递物流公共配送中心建设项目资审公告", url: "https://ggzy.sc.yichang.gov.cn/jyxx/003001/003001002/20260804/7c9ab6d2-ec8e-46c9-bbcd-54d4604c2ff8.html", snippet: "点军区寄递物流公共配送中心建设项目总建筑面积18067.10平方米，建设1#寄递物流公共配送中心、2#综合仓储中心等，计划工期360日历天。", date: "2026-08-04" },
      { title: "区政协九届五次会议提案第56号提案关于打造区域性物流集散基地的建议", url: "http://www.dianjun.gov.cn/zfxxgk/show.html?aid=5&id=58237", snippet: "点军区寄递物流共配中心选址桥边镇六里河村，占地约87亩，建设7栋单体建筑，将实施统一分拣、统一运输、统一派送的区域统仓共配模式。", date: null },
      { title: "宜昌将建设全国性邮政快递枢纽承载城市", url: "https://epaper.cn3x.com.cn/sxsb/content/202512/05/c327411.html", snippet: "点军区聚焦高校建设规划，建设寄递物流共配中心，创新智能分拣+无人配送+末端自提服务模式，打造高校智慧物流试验区；到2027年农村年发件量达1000万件以上。", date: null }
    ]
  },
  {
    queryMeta: { query: "宜都 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "宜都", city: "宜昌市", admin: "宜都市", bureau: "宜昌市邮政管理局" },
    results: [
      { title: "返乡创业平台/载体清单（2026年第二季度）", url: "https://www.yichang.gov.cn/show-64228-1077261-1.html", snippet: "宜都市莲花堰电商物流中心位于姚家店镇，聚焦电商物流、仓储加工、企业孵化等功能，已吸引电商、食品、光学等企业入驻，是宜都电商产业集聚重要平台。", date: "2026-05-21" },
      { title: "宜都闲置土地盘活典范：供销物流园转变之路", url: "https://www.yidu.gov.cn/list-130-1.html?id=202753", snippet: "中国供销·宜都商贸物流园占地150亩，集成农产品交易、电商服务、检验检测、冷链配送、零担快运及智能快递分拣等功能，招商率突破80%。", date: null },
      { title: "中国供销·宜都商贸物流园正式交付", url: "https://m.10jqka.com.cn/20250709/c669494141.shtml", snippet: "中国供销·宜都商贸物流园7月1日正式交付，150余家商户签约入驻，引入中通、圆通、申通、韵达、邮政、顺丰、京东等，集农产品交易、电商服务、智能快递分拣于一体。", date: null },
      { title: "快递企业齐入园 开启共配新时代", url: "https://www.yidu.gov.cn/zfxxgk/show.html?aid=8&id=203514", snippet: "宜都市交运局助力快递企业集约化入驻中国供销宜都商贸物流园，申通、圆通、中通、韵达、极兔等已入驻运营，推动统一分拣、统一配送共配模式。", date: null },
      { title: "中国供销·宜都商贸物流园正式开园", url: "https://m.hbyidu.com.cn/p/80575.html", snippet: "中国供销·宜都商贸物流园正式开园，建有万吨级智慧冷库，整合电商与物流资源，引入顺丰、京东、三通一达等，实现消费品下乡、农产品出山高效联通。", date: null }
    ]
  },
  {
    queryMeta: { query: "枝江 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "枝江", city: "宜昌市", admin: "枝江市", bureau: "宜昌市邮政管理局" },
    results: [
      { title: "返乡创业平台/载体清单（2026年第二季度）", url: "https://www.yichang.gov.cn/show-64228-1077261-1.html", snippet: "枝江市电商产业园位于东湖大道与民主大道交汇处，建筑面积约20000平方米，服务电商企业2100家，年GMV突破50亿元，是数字应用企业聚集地。", date: "2026-05-21" },
      { title: "2026年枝江市政府工作报告", url: "http://www.zgzhijiang.gov.cn/zfxxgk/show.html?aid=9&id=144083", snippet: "枝江新电商产业以果蔬生鲜、食品饮料、烤火炉具为发展方向，打造具有枝江特色、四季畅销的电商产品体系，确保全年实现公共网络零售额10亿元。", date: null },
      { title: "创业孵化园春季招孵开始啦", url: "http://rsj.yichang.gov.cn/content-22791-983381-1.html", snippet: "枝江市电子商务产业园招孵特色农产品电商、平行线电商客服、直播电商等项目，地址枝江市东湖大道与民主大道交汇处。", date: null },
      { title: "对政协枝江市七届四次会议第26号提案的答复", url: "http://www.zgzhijiang.gov.cn/content-541-607151-1.html", snippet: "枝江建成市级共配中心，引导三通一达、极兔入驻，配备104个格口自动分拣设备，日均出口集包能力3万件以上，日发特色农产品超5万单。", date: null },
      { title: "百里洲砂梨智慧产业园加快建设", url: "https://epaper.cn3x.com.cn/sxrb/content/202506/17/c316036.html", snippet: "百里洲砂梨智慧产业园建设智能温控仓储区和检测分选系统，将建立电商直播基地、冷链物流中心，推动传统农业转型。", date: null }
    ]
  },
  {
    queryMeta: { query: "野三关 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "野三关", city: "恩施市", admin: "巴东县", bureau: "恩施州邮政管理局" },
    results: [
      { title: "野三关镇招商网|招商网络-野三关镇招商引资|优惠政策", url: "https://hubei.xuanzhi.com/enshi/badong/yesanguanzhen", snippet: "野三关镇招商政策汇编，含产业扶持政策、厂房出租政策等，一企一策、一事一议。", date: null },
      { title: "贯彻落实县委十六届十四次全会精神访谈（二）", url: "https://cjbd.com.cn/dangjian1/3105903.html", snippet: "野三关镇（巴东经济开发区）以金象坪生物医药产业园、青龙桥智慧物流园、两溪坪硒食品加工产业园为载体招商引资，推动优质企业落地。", date: null },
      { title: "返乡创业正当时 | 巴东县优秀返乡创业项目推介", url: "https://news.hubeidaily.net/pc/c_4958994.html", snippet: "巴东经济开发区青龙桥智慧物流产业园位于野三关镇，提供电商仓储、区域物流分拨空间；收录289个优质返乡创业项目。", date: null },
      { title: "返乡创业正当时 | 巴东22个优质项目全揭秘，总有一个适合你！", url: "https://news.hubeidaily.net/pc/c_4639943.html", snippet: "巴东县发布22个优质返乡创业项目，含溪丘湾乡绿色建材产业园物流配送中心等，提供创业担保贷款等政策支持。", date: null },
      { title: "巴东经济开发区电商产业园：打造巴东特色产业集聚的新高地！", url: "https://www.sohu.com/a/475781789_377077", snippet: "巴东经济开发区电商产业园位于野三关镇，设电商运营中心、产品体验中心、电商企业孵化中心等，吸引大野印象、百裕原水果等十家本地电商企业入驻。", date: null }
    ]
  },
  {
    queryMeta: { query: "巴东 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "巴东", city: "恩施市", admin: "巴东县", bureau: "恩施州邮政管理局" },
    results: [
      { title: "【非凡“十四五”】破嶂穿山织路网 通江达海耀武陵", url: "https://www.cjbd.com.cn/cjbd68/3160124.htm", snippet: "巴东推进农村寄递物流网络建设，新建2个县级共配中心、12个乡镇仓储转运中心、174个村级综合服务点，全县农产品外销总额突破1亿元。", date: null },
      { title: "一“橙”不变，众志成“城”，官渡口镇呼唤你回家创业！", url: "https://news.hubeidaily.net/pc/c_4640198.html", snippet: "巴东官渡口镇发布返乡创业政策，涵盖农机购置补贴、重点群体创业税费减免、住房安居及子女入学保障等。", date: null },
      { title: "青春助农进橘乡 电商赋能乡村振兴", url: "https://www.cjbd.com.cn/xzdt/3260783.html", snippet: "湖北民族大学实践团队赴巴东县沿渡河镇柑橘产业园开展电商直播帮扶，借助新媒体助力富硒柑橘拓展线上销路。", date: null },
      { title: "巴东：硒地生金果 链动新未来", url: "https://news.hubeidaily.net/pc/c_3939653.html", snippet: "巴东金石开现代农业开发有限公司构建柑橘种植、加工、包装、冷藏仓储、物流配送全产业链，2024年线上销售额突破150万元。", date: null },
      { title: "从田间到万家——巴东年货土产“乘邮”出山俏销全国", url: "https://cjbd.com.cn/cjbd9/3172992.html", snippet: "巴东县寄递物流共配中心整合邮政与中通、申通等资源，新增巴东至武汉专线邮路，邮政直播团队开展柑橘专场直播带动本地柑橘销售。", date: null }
    ]
  },
  {
    queryMeta: { query: "咸丰 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "咸丰", city: "恩施市", admin: "咸丰县", bureau: "恩施州邮政管理局" },
    results: [
      { title: "咸丰县人民政府2025年政府工作报告", url: "http://www.xianfeng.gov.cn/xxgk/gkml/qtzdgknr/zfgzbg/202601/t20260105_1770291.shtml", snippet: "咸丰县大力支持直播经济发展，建设规模化直播实训基地，培育电商人才100人以上，加快汽贸、建材、再生资源、寄递物流等专业市场建设。", date: null },
      { title: "咸丰县科经局2025年重点工作规划", url: "http://www.xianfeng.gov.cn/xxgk/dfbmptlj/xz/xkjj/fdzdgknr/ghxx_1/202502/t20250218_1668693.shtml", snippet: "咸丰县大力支持电商发展，加快推进电商公共服务中心建设，促进县域电商产业高质量发展，加强富硒白茶、富硒稻米等特色资源推广。", date: null },
      { title: "【州农路物流局】加快推进咸丰县综合物流园开工建设", url: "http://jtj.enshi.gov.cn/gzdt/jzdt/202511/t20251103_1749662.shtml", snippet: "咸丰县综合物流园采用EPC+O模式挂网招标已开标，将建成集公铁联运、物流货运、仓储加工、大宗交易、电子商务、信息服务及商贸金融等于一体的现代化综合物流园。", date: null },
      { title: "【州农路物流局】加快推进一季度交通物流“开门红”项目建设", url: "http://jtj.enshi.gov.cn/gzdt/jzdt/202603/t20260318_1789468.shtml", snippet: "咸丰县综合物流园位于曲江镇高坡村，计划投资44000万元，建成快递配送中心、农产品冷链展示中心和物流仓储中心等，3月4日复工。", date: null },
      { title: "【统战委员说】咸丰县忠堡镇：红色底蕴培根脉 统战聚力促振兴", url: "http://www.estz.org.cn/gzdt/202602/t20260203_1779864.shtml", snippet: "咸丰县忠堡镇盘活闲置资产，依托黑猪资源引进市场主体建设牧硒腊味腊肉加工厂，建成冬桃桑葚草莓等四季水果产业基地。", date: null }
    ]
  },
  {
    queryMeta: { query: "远安 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "远安", city: "宜昌市", admin: "远安县", bureau: "宜昌市邮政管理局" },
    results: [
      { title: "返乡创业平台/载体清单（2026年第二季度）", url: "https://www.yichang.gov.cn/show-64228-1077261-1.html", snippet: "远安县伯乐创业孵化园、远安县公共实训基地、远安县晶品物流园、远安县瓜米电商孵化平台等面向电商、直播企业招商，提供免租、培训等服务。", date: "2026-05-21" },
      { title: "远安县科学技术和经济信息化局2026年上半年工作总结和下半年工作安排", url: "http://www.yuanan.gov.cn/zfxxgk/show.html?aid=11&id=161978", snippet: "远安全县各类电商主体达3960个，从业人员超万人，依托党建+电商模式开展直播活动近100场，成立电商行业协会推动行业规范化发展。", date: null },
      { title: "伯乐创业孵化园", url: "https://www.yichang.gov.cn/show-64228-1075667-1.html", snippet: "远安县伯乐创业孵化园位于临沮大道141号，规划容纳53家企业，建有网货选品中心、旗舰级直播间，免房租、免物业，面向直播电商、跨境电商招商。", date: null },
      { title: "创业孵化园春季招孵开始啦", url: "http://rsj.yichang.gov.cn/content-22791-983381-1.html", snippet: "远安伯乐创业孵化园招孵方向为直播电商、文化传媒，提供独立办公空间、共享直播间，地址远安县嫘祖大道141号。", date: null },
      { title: "强化电商产业培育，助力乡村全面振兴", url: "http://www.yuanan.gov.cn/content-1448-700914-1.html", snippet: "远安县科技经信局加快县域电商产业提档升级，全县电商主体达3960家，培育孵化限上电商企业9家，鼓励电商龙头企业建设运营专业化直播基地。", date: null }
    ]
  },
  {
    queryMeta: { query: "长阳 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "长阳", city: "宜昌市", admin: "长阳县", bureau: "宜昌市邮政管理局" },
    results: [
      { title: "长阳城乡冷链物流园建设提速", url: "http://www.changyang.gov.cn/zfxxgk/show.html?aid=13&id=91462", snippet: "长阳城乡冷链物流园位于磨市镇，集电子商务、智慧仓储、物流运输、加工配送于一体，农产品分拣中心冷库面积达8700平方米，电商大楼为农产品触电上网搭建平台。", date: null },
      { title: "磨市镇农民工返乡创业项目（流通与服务体系）", url: "http://www.changyang.gov.cn/content-11538-539966-1.html", snippet: "长阳磨市镇建设现代化产地集散中心，集柑桔清洗、分级、包装、预冷、暂存、交易于一体，引进自动化分选线，打造电商与品牌营销服务中心，预估投资3500万元。", date: null },
      { title: "返乡创业平台/载体清单（2026年第二季度）", url: "https://www.yichang.gov.cn/show-64228-1077261-1.html", snippet: "长阳县龙津星城返乡创业园位于龙舟坪镇津洋口，提供免装修期、停车优惠、租金优惠等政策；长阳民族工业园位于磨市镇，累计签约招商项目25个。", date: "2026-05-21" },
      { title: "【跨越2026·创一流 争第一 干唯一】长阳城乡冷链物流园建设全速推进 确保7月底农产品分拣中心试运行", url: "http://www.changyang.gov.cn/content-5084-540317-1.html", snippet: "长阳城乡冷链物流园定位为综合型冷链物流供应链服务产业园，智能分选线日处理能力500至1000吨，48小时送达全国，计划7月底农产品分拣中心试运行。", date: null },
      { title: "政府工作报告", url: "http://www.changyang.gov.cn/zfxxgk/show.html?aid=13&id=91675", snippet: "长阳围绕药用木瓜、高山蔬菜等特色产业精准开展产业链招商，力争招引签约落地亿元以上项目2个，培育规上工业企业5家。", date: null }
    ]
  },
  {
    queryMeta: { query: "荆州城区 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "荆州城区", city: "荆州市", admin: "沙市区", bureau: "荆州市邮政管理局" },
    results: [
      { title: "县市区频道", url: "https://epaper.hubeidaily.net/pc/attachment/202504/08/65726dca-4cb2-4cc4-91bc-d1cf63f89906.pdf", snippet: "荆州市沙市区锣场镇崛起现代物流产业园，中通快递鄂西南智能科技电商快递产业园投资5.2亿元，日分拣量可达110万件，韵达、中通等多家物流企业汇聚。", date: null },
      { title: "荆州市物流园项目最新进展：2026年入园门槛、运费降本实测、企业最关心的5个落地问题全拆解", url: "https://m.ccpc360.com/fabu/zsku81111.html", snippet: "2026年一季度荆州市物流园项目完成二期智能分拣中心交付，整体入驻率达78.3%，日均处理电商包裹47.5万件，发布新版准入实施细则与低碳运输承诺。", date: null },
      { title: "荆州这一大型农批市场，最新现场→", url: "https://news.hubeidaily.net/pc/c_5419926.html", snippet: "湖北农发两湖绿谷国际农产品交易中心位于荆州高新区，规划水果、副食干调粮油、蔬菜三大批发市场，预计年交易量1000万吨，招商工作同步推进。", date: null },
      { title: "有望9月建成投运！农发两湖国际农产品交易中心，有什么亮点？", url: "https://new.qq.com/rain/a/20260421A04QNI00?refer=cp_1009", snippet: "湖北农发两湖绿谷国际农产品交易中心预计年交易量达1000万吨，配套可售商铺和公寓，招商销售预约预定全面启动。", date: null },
      { title: "6个区域性分拨中心争相落户，快递企业为何扎堆荆州？", url: "https://news.hubeidaily.net/pc/c_4180904.html", snippet: "荆州已有邮政、中通、圆通、京东、德邦、顺丰等6个区域性快递分拨中心，总投资27.4亿元，建设用地1175亩，外运特色农产品占比三成。", date: null }
    ]
  },
  {
    queryMeta: { query: "古城北 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "古城北", city: "荆州市", admin: "荆州区", bureau: "荆州市邮政管理局" },
    results: [
      { title: "成都最大蔬果产业园区上新！", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_6956969f0b086052", snippet: "彭州市经开区东区智慧供应链产业园新引进奥特乐数字化仓储中心、攀果地总部基地+数智化分拨中心，预计年产值49.2亿元。", date: null },
      { title: "保定市满城区融智电子商务产业园招商公告", url: "http://www.sohu.com/a/933113175_100009816", snippet: "保定市满城区融智电子商务产业园依托周边葡萄、草莓、猕猴桃等特色产业，以农产品网络直播销售为主，提供45间电商直播及办公用房，可享房租水电补贴。", date: null },
      { title: "保定市满城区华夏智行电子商务产业园招商公告", url: "https://www.sohu.com/a/933637353_100009816", snippet: "保定市满城区华夏智行电子商务产业园已入驻韵达、圆通两家快递企业，设韵达智慧云仓，入驻电商企业可享三年免租政策。", date: null },
      { title: "长德电商园：从传统批发市场到西部食品电商新地标，一个“仓播一体”的创业理想国正在崛起", url: "https://news.10jqka.com.cn/20260506/c676480897.shtml", snippet: "长德电商园招商全面开启，面向电商经销、直播带货类公司及创业团队，提供政策对接服务，争取电商专项奖补资金。", date: null },
      { title: "盛世华诞·国庆同欢 | 长德电商园引领城北电商迈向辉煌新巅峰", url: "http://www.changdegroup.com/news/112.html", snippet: "长德电商园提供一年0租金入驻、超低价快递（1.2元起）及培训服务，汇聚500家优质厂家、200家活跃网商，有6大一线快递公司物流支持。", date: null }
    ]
  },
  {
    queryMeta: { query: "荆州大学城 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "荆州大学城", city: "荆州市", admin: "荆州区", bureau: "荆州市邮政管理局" },
    results: [
      { title: "张远重专题研究大学城产业招商工作 面对面倾听企业诉求 实打实破解发展难题", url: "http://www.jingzhouqu.gov.cn/sygx/tpxw/202606/t20260610_1115646.shtml", snippet: "荆州区、荆州高新区赴大学城开展产业招商专题调研，重点发展生物医药、人工智能、数字经济、低空经济等战略性新兴产业，热忱欢迎企业家来荆投资。", date: null },
      { title: "聚焦大学城赋能共商服务业发展 | 荆州区政协重点提案督办暨专题协商会议召开", url: "http://www.jingzhouqu.gov.cn/xwzx/jrtt/202508/t20250804_1031458.shtml", snippet: "荆州区依托大学城作为现代服务业重要载体，加大大学城招商力度，培育壮大与高校优势学科契合的生产性服务业企业，加快实现满园工程。", date: null },
      { title: "6个区域性分拨中心争相落户，快递企业为何扎堆荆州？", url: "https://news.hubeidaily.net/mobile/c_4180845.html", snippet: "荆州已有邮政、中通、圆通、京东、德邦、顺丰等6个区域性快递分拨中心，总投资27.4亿元，外运农产品占比三成，包括江陵黄桃、洪湖莲藕等。", date: null },
      { title: "韵达华中（荆州）快递产业园正式投产运营", url: "http://zsj.jingzhou.gov.cn/z/xinwenzhongxin/zhaoshangdongtai/2025-12-03/15305.html", snippet: "韵达华中（荆州）快递产业园位于沙市区锣场镇，总投资4亿元，配备全自动智能分拣设备，日均处理30万件，年邮件快件处理能力达35亿件。", date: null },
      { title: "荆州市商务局关于对市政协六届四次会议第81号提案的答复", url: "https://zwgk.jingzhou.gov.cn/54258/109220253/t130220253094/626241.shtml", snippet: "荆州市支持岑河电商产业园创建国家级电子商务示范基地，加强三湖黄桃、公安葡萄、洪湖莲藕等特色品牌宣传，推进数实融合与产销对接。", date: null }
    ]
  },
  {
    queryMeta: { query: "武德路 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "武德路", city: "荆州市", admin: "沙市区", bureau: "荆州市邮政管理局" },
    results: [
      { title: "卯足劲 加油干 | 以“五大片区”的加速建设架起全区发展的“四梁八柱”", url: "https://weiyang.xiancity.cn/system/2025/09/16/031218276.shtml", snippet: "未央湖片区提升武德路创新街区发展活力，挖掘环湖板块资源潜力，推广直播电商、微短剧等新业态，打造西安北跨战略核心辐射区。", date: null },
      { title: "投资未央就是投资未来|2025西安市未央区招商信息系列发布", url: "https://cj.sina.cn/articles/view/5982285918/16492705e00107sqne?froms=ggmp", snippet: "秦创原·西安未央科技成果转化基地位于未央区大学城片区武德路58号，拟招引高校院所项目团队和相关企业入驻，提供技术、资金、市场、人才、场地服务。", date: null },
      { title: "起价超1亿！义乌177亩新地块挂牌", url: "https://www.toutiao.com/article/7588075248416309769", snippet: "义乌市武德路以东、物流园路以北地块一、地块二挂牌出让，土地用途物流仓储用地，总面积约176.857亩，计划2026年1月26日出让。", date: null },
      { title: "义乌市国有建设用地使用权出让公告[义乌市武德路以东、物流园路以北地块二]", url: "https://ggzy.zj.gov.cn/jyxxgk/002003/002003001/20251225/44a5067a-69bf-4853-b486-ed5d59b1fed2.html", snippet: "义乌市武德路以东、物流园路以北地块二挂牌出让，土地用途一类物流仓储用地，面积37900.54平方米，挂牌截止时间2026-01-26。", date: null },
      { title: "义乌在建一个泛半导体基地！", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_6396a1cf72f83752", snippet: "泛半导体产业园位于福田街道武德路与天宝路交叉口西北侧，总用地230.68亩，总投资21.02亿元，规划建设标准化智能厂房、综合办公楼及配套。", date: null }
    ]
  },
  {
    queryMeta: { query: "开发区一部 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "开发区一部", city: "荆州市", admin: "沙市区", bureau: "荆州市邮政管理局" },
    results: [
      { title: "滇城昆亚农副产品智慧物流园招商中心正式对外开放", url: "http://www.yn.xinhua.org/20260701/8a11d4879b554a639792292e34c3e771/c.html", snippet: "昆明经济技术开发区滇城昆亚农副产品智慧物流园招商中心开放，总用地约500亩，集农产品现货交易、智能仓储物流、精深加工配送、线上电商运营等于一体。", date: null },
      { title: "大理经开·视野 | 平台已就位，只等凤来栖！大理经开区聚力打造高水平对外开放新高地", url: "https://jkq.dali.gov.cn/dljjkfq/c107872/pc/content/2058837332679774208/content_2058837332679774208.html", snippet: "大理经开区建成跨境电商产业园，水果出口货值超10亿元覆盖18国；高原特色农产品加工及进出口产业园提供订单统筹、出口退税一站式服务。", date: null },
      { title: "保定市满城区华夏智行电子商务产业园招商公告", url: "https://www.sohu.com/a/933637353_100009816", snippet: "保定市满城区华夏智行电子商务产业园已入驻韵达、圆通两家快递企业，设韵达智慧云仓，入驻电商企业可享三年免租政策。", date: null },
      { title: "周口临港开发区：发展跨境电商产业 打造区域开放新引擎", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_344696a08fe80252", snippet: "周口临港开发区跨境电商产业园两座电商综合体已投运，云便利保税体验中心进口商品占比超80%，含东南亚特色水果等。", date: null },
      { title: "广东海丰经济开发区管理委员会政府信息公开", url: "http://www.gdhf.gov.cn/swhfkfq/gkmlpt/content/1/1251/post_1251324.html", snippet: "海丰县粤博城果蔬一级批发市场启动招商，总投资6亿元、占地120亩，规划大宗交易园、冷链物流园、电商信息园、金融结算园四大功能园区。", date: null }
    ]
  },
  {
    queryMeta: { query: "江陵 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "江陵", city: "荆州市", admin: "江陵县", bureau: "荆州市邮政管理局" },
    results: [
      { title: "江陵县农产品加工产业链招商场景机会", url: "http://jiangling.gov.cn/ztzl/yhyshj/202512/t20251231_1061272.shtml", snippet: "江陵县发布产地冷链物流与全国性销售网络招商场景，欢迎头部电商平台、MCN机构设立直播基地，依托在建寄递物流园区打造农产品集散分拨中心。", date: null },
      { title: "江陵县现代物流产业链招商场景机会和场景能力", url: "http://www.jiangling.gov.cn/ztzl/yhyshj/202512/t20251231_1061267.shtml", snippet: "江陵创新构建县乡村三级寄递物流体系，整合三通一达、顺丰、京东、邮政成立湖北郢都供应链管理有限公司，2024年全县电商交易额达16.32亿元。", date: null },
      { title: "关于印发《江陵县现代物流产业链高质量发展行动方案》的通知", url: "http://zwgk.jiangling.gov.cn/jtysj/4088/109220253/t117220253094/621593.shtml", snippet: "江陵以郢都电商快递产业园为核心，支持邮政、快递、物流、电商共建共享基础设施，打造集散加工、仓储配送、快递分拨、电子商务等多功能综合型物流中心。", date: null },
      { title: "江陵县现代物流产业链招商场景机会", url: "http://jiangling.gov.cn/ztzl/yhyshj/202512/t20251231_1061268.shtml", snippet: "江陵发布华中区域性冷链与生鲜物流中心招商机会，已启动焕新生活生鲜项目，招商对象含大型生鲜电商、社区团购区域运营与冷链配送中心。", date: null },
      { title: "荆州邮政：从“田间地头”到“全国餐桌”", url: "https://www.cnhubei.com/content/2026-05/25/content_19996502.html", snippet: "江陵县入选农村电商快递协同发展示范区，三湖黄桃主产区设42个收寄点，建成8个楚邮云仓，江陵黄桃、洪湖莲藕寄递项目入选快递服务现代农业示范项目。", date: null }
    ]
  },
  {
    queryMeta: { query: "松滋 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "松滋", city: "荆州市", admin: "松滋市", bureau: "荆州市邮政管理局" },
    results: [
      { title: "松滋市人民政府网", url: "http://www.hbsz.gov.cn/index.html", snippet: "松滋市人民政府门户网站，发布政务要闻、通知公告及便民提醒等信息。", date: null },
      { title: "日销万单！“双11”，松滋农产品卖“爆”了", url: "http://hbsz.gov.cn/gov_news/sz_news/202511/t20251112_1051262_zzzq.shtml", snippet: "湖北诺缘电子商务有限公司投资1.2亿元建设电商产业园，预计明年5月投产，形成电商直播运营、物流分拨、食品加工及农产品处理四大核心板块。", date: null },
      { title: "【楚商回乡 创在松滋】深耕9年，他每年将上亿松滋好物卖向全国", url: "http://hbsz.gov.cn/gov_news/sz_news/202602/t20260213_1071527.html", snippet: "郑中涛2025年投资1.2亿元建设集电商运营、食品加工、智能物流于一体的松之云电商产业园，每年培育电商人才超4000人次。", date: null },
      { title: "【劳动最光荣】他在直播间唱响“莲花落”，带动“松滋好物”走向全国", url: "http://www.hbsz.gov.cn/gov_news/sz_news/202604/t20260429_1085490_zzzq.shtml", snippet: "杨世海打造松之云诺缘电商产业园，建设专业运营办公大楼、标准化直播基地，配套物流中心与深加工生产线，企业年销售额突破亿元。", date: null },
      { title: "松滋市物流项目落地实操指南：2026年中小县域物流升级的5个关键破局点", url: "https://bdsr.ccpc360.com/fabu/zsku78991.html", snippet: "2026年松滋市物流项目纳入湖北省县县通冷链三年攻坚清单，首批资金3760万元已拨付；松滋到武汉阳逻港陆路运输时间压缩至2.8小时。", date: null }
    ]
  },
  {
    queryMeta: { query: "荆门城区 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "荆门城区", city: "荆门市", admin: "东宝区", bureau: "荆门市邮政管理局" },
    results: [
      { title: "免费入驻！沙洋县电商公服中心火热招商中····", url: "https://m.cjyunshayang.cn/p/12387.html", snippet: "沙洋县电子商务公共服务中心位于荆门市沙洋县，设产品展示、物流分拣、仓储配送、电商培训、创业孵化等功能，免费入驻，销售本地特色农产品电商企业优先。", date: null },
      { title: "关于对市政协十届五次会议第182号提案会办工作的意见", url: "http://zsj.jingmen.gov.cn/art/2026/7/3/art_11770_1226053.html", snippet: "荆门市签约亿元以上现代物流服务、商贸、文旅产业项目36个，其中云开电商基地、三里人电商直播平台、康润智慧物流电商科创中心等电商项目补齐本地短板。", date: null },
      { title: "荆门市东宝区主要领导调度交通物流枢纽建设攻坚工作", url: "https://hb.spb.gov.cn/hubsyzglj/c104687/c104691/202508/1e47fe94b8e14f61b65961895a1bcded.shtml", snippet: "东宝区调度交通物流枢纽建设，加快荆门智慧物流园、区级寄递物流公共配送中心建设，推进电商物流阵地建设，培育壮大产业集群。", date: null },
      { title: "湖北多辉农产品物流园", url: "https://m.maigoo.com/citiao/1001873.html", snippet: "湖北多辉农产品物流园是荆门较大农产品及生活用品集散地，获中国百强批发市场等荣誉，入驻商户签约三年以上两年免收门店租金，配套住房免租二年。", date: null },
      { title: "中省媒体看东宝丨中国县域经济报：电商物流融合提速 构筑服务业新高地", url: "https://118.jingmen.gov.cn/art/2025/12/5/art_7927_1193034.html", snippet: "东宝区建成中天街电商企业集中办公区等五大特色功能区，依托荆门智慧物流产业园吸引中通、极兔、圆通、申通、韵达5家快递共建共配中心。", date: null }
    ]
  },
  {
    queryMeta: { query: "钟祥 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "钟祥", city: "荆门市", admin: "钟祥市", bureau: "荆门市邮政管理局" },
    results: [
      { title: "大柴湖开发区2025年工作总结及2026年工作计划", url: "https://zhongxiang.gov.cn/art/2026/2/3/art_13228_1204002.html", snippet: "大柴湖开发区建成10000平方米花卉电商基地，招商引入盼胜园电子商务入驻成立钟祥市奇玥电子商务有限公司，园区电商日均销货单量约2万单。", date: null },
      { title: "钟祥市2025年国民经济和社会发展计划执行情况与2026年计划（草案）的报告", url: "https://zhongxiang.gov.cn/art/2025/12/30/art_27943_1231017.html", snippet: "钟祥深化京东（钟祥）数字经济产业园、中软国际数字经济科教城运营，引进电商运营、直播带货、供应链管理等配套企业50家以上，培育电商企业100家以上。", date: null },
      { title: "京东云仓钟祥供应链基地", url: "https://aiqicha.baidu.com/details/ugknowledge?id=a96b1d550ea785ae20a13d16debd5165", snippet: "京东云仓（钟祥）供应链基地改造原交通物流园，打造集仓储、冷链和农产品交易于一体的综合基地，计划新建立体智慧冷库2万方，配备物流自动分拣线。", date: null },
      { title: "湖北大运物流园", url: "https://m.chinawutong.com/201/wlyw2807.html", snippet: "湖北大运物流园位于荆门市钟祥市，适合物流仓储、分拣、配送、加工、电子商务活动，诚邀全国专线品牌加盟入驻。", date: null },
      { title: "钟祥市智慧物流园区项目落地实操指南：3个关键问题、4个避坑细节、2026年最新进展全拆解", url: "https://m.ccpc360.com/fabu/zsku79805.html", snippet: "2026年钟祥市智慧物流园区执行分级准入+弹性试用制，1至5月平均单吨操作成本比老物流集聚区低23.6%，冷链专线车辆空驶率压到11.2%。", date: null }
    ]
  },
  {
    queryMeta: { query: "洪湖 电商 产业园 水果 寄递 招商 最新", channel: "电商", region: "洪湖", city: "荆州市", admin: "洪湖市", bureau: "荆州市邮政管理局" },
    results: [
      { title: "洪湖市支持电子商务发展的若干措施（送审稿）", url: "https://zw.jingzhou.gov.cn/api/content_center/PublishTask/download?file_path=/upload/default/bigfile/2023/02/27/20230227_18539f59f268bf7a44752a8e30f7f3af.docx&file_name=%E6%B4%AA%E6%B9%96%E5%B8%82%E6%94%AF%E6%8C%81%E7%94%B5%E5%AD%90%E5%95%86%E5%8A%A1%E5%8F%91%E5%B1%95%E7%9A%84%E8%8B%A5%E5%B9%B2%E6%8E%AA%E6%96%BD%EF%BC%88%E9%80%81%E5%AE%A1%E7%A8%BF%EF%BC%89.docx", snippet: "洪湖市支持电商产业园建设，第三方投资建设电商产业园引进物流仓储中心、电商文创园、直播基地等，市级园区经营面积达10000平方米以上给予运营主体一次性奖励20万元。", date: null },
      { title: "洪湖市人民政府办公室关于印发洪湖市推进楚商回乡和返乡创业工作实施方案的通知", url: "http://zwgk.honghu.gov.cn/30279/109220253/t125220253094/624538.shtml", snippet: "洪湖打造瀚城智谷电子产业园、莲藕产业园、水产品加工产业园及电商产业园等，引导返乡人员结合产业优势建立返乡创业电商基地、小型电商集聚区。", date: null },
      { title: "华洪物流园", url: "https://m.chinawutong.com/201/wlyw2824.html", snippet: "华洪物流园位于荆州市洪湖市，适合物流仓储、分拣、配送、加工、电子商务活动，生鲜食品、快递快运、3PL、社区团购等，诚邀全国专线品牌加盟入驻。", date: null },
      { title: "乌林镇党委副书记、镇长严晶：文旅+电商 唱响乌林名片", url: "http://www.honghu.gov.cn/xw/xzdt/202503/t20250317_998213.shtml", snippet: "乌林镇电商直播基地培养40名主播，依托超众农业供应链平台，全力打造乌林镇电商产业园，力争2025年电商销售额达1.5亿元。", date: null },
      { title: "洪湖市物流园项目最新进展：入驻门槛、租金行情、政策红利全拆解（2026实测版）", url: "https://www.ccpc360.com/fabu/zsku79106.html", snippet: "2026年洪湖市物流园东区一期日均吞吐量8600吨，中通、极兔鄂南分拨中心满负荷运转，开通武汉阳逻港班列每日2班、宜昌三峡枢纽水铁联运通道6月起试运行。", date: null }
    ]
  },
  {
    queryMeta: { query: "快递 违禁品 寄递 查获 湖北 最新", channel: "安全", region: null, city: null, admin: null, bureau: null },
    results: [
      { title: "咸宁局联合市烟草专卖局开展寄递渠道涉烟联合执法 连续查获非法寄递卷烟27.28万支", url: "https://hb.spb.gov.cn/hubsyzglj/c104869/c104880/c104882/202607/cff72fd1e08442e28b3bde90e3c895f7.shtml", snippet: "咸宁市邮政管理局联合市烟草专卖局在武深高速茶庵岭服务区布控，2日内连续查获2起利用寄递渠道非法运输卷烟案件，涉案卷烟27.28万支，案值约18.09万元。", date: null },
      { title: "随州局、咸宁局联合烟草部门打击寄递渠道涉烟违法活动", url: "https://hb.spb.gov.cn/hubsyzglj/c100057/c100061/202605/1340f56e6f77486dae451bf1e84c83bc.shtml", snippet: "随州、咸宁邮政管理局联合烟草部门打击寄递渠道涉烟违法活动，今年来已查处寄递渠道涉烟案件11起，查获烟草制品5813条，案值125.29万元。", date: null },
      { title: "湖北公安|“警察同志，这茶叶不对劲！”", url: "https://www.toutiao.com/article/7661933157498782234/", snippet: "荆门市一快递驿站工作人员开箱验视发现茶叶内藏现金，疑似电信诈骗，及时报警劝阻寄件人邮寄4000余元现金，警方提醒快递从业人员发现可疑物立即报案。", date: null },
      { title: "邮烟协同规范寄递渠道 硚口烟草持续优化烟草市场治理质效", url: "https://www.cinic.org.cn/zgzz/qy/1642184.html", snippet: "武汉市硚口区烟草专卖局深化与邮政管理部门协同，在快递驿站、物流运输环节排查多批次无合法流通手续烟草制品，督促落实实名收寄、收寄验视、过机安检三项制度。", date: null },
      { title: "织密流通防护网 撑起少年成长“安全伞”", url: "https://www.jingji.com.cn/zxxx/202606/t20260630_3061714.shtml", snippet: "武穴市局聚焦物流分拨中心、快递驿站开展穿透式专项排查，依托寄递监管大数据系统精准研判异常单号，严厉打击无证寄递假烟等违法行为。", date: null }
    ]
  },
  {
    queryMeta: { query: "财联社 媒体 最新公告 快递", channel: "资讯", region: "媒体", city: "媒体", admin: "媒体", bureau: "财联社" },
    results: [
      { title: "邮政业“十五五”规划发布：加快建设现代化寄递物流网络", url: "https://new.qq.com/rain/a/20260729A07HHN00?refer=cp_1009", snippet: "财联社7月29日电，国家邮政局发布《邮政业发展“十五五”规划》，到2030年国际快递网络覆盖国家和地区数达110个，推动城市配建邮政快递用房、布局快递箱柜。", date: null },
      { title: "菜鸟战略落定：国内供应链划归阿里电商，重心转向跨境物流赛道", url: "https://m.cls.cn/detail/2425080", snippet: "菜鸟将国内供应链业务板块正式调整到阿里电商事业群，进一步聚焦国际物流和物流科技战略；截至2026年6月在全球18个国家和地区布局超50座海外仓。", date: null },
      { title: "快递“反内卷”效果延续 圆通速递H1扣非净利预增超七成|财报解读", url: "https://finance.sina.com.cn/roll/2026-06-30/doc-inifexfn4748133.shtml", snippet: "财联社6月30日讯，圆通速递预计上半年扣非净利润30.4亿至34亿元，同比增长72.19%至89.18%，行业持续落实反内卷相关举措，终端价格合理修复。", date: null },
      { title: "申通快递遭立案调查，30亿可转债项目紧急终止", url: "https://www.toutiao.com/article/7670568790370927150/", snippet: "8月4日国家邮政局正式对申通快递有限公司立案调查，涉未按规定履行全网统一安全保障管理责任；申通终止不超30亿元可转债发行并撤回申报材料。", date: null },
      { title: "【上半年居民消费物流保持韧性增长 线上消费是核心动力】", url: "https://www.sina.cn/news/detail/5325947365753718.html", snippet: "财联社2026年7月29日电，上半年单位与居民物品物流需求同比增长3.8%，线上消费是核心增长动力，全国实物商品网上零售额同比增长4.8%，电商快递业务同步扩容。", date: null }
    ]
  }
];

import { writeFileSync } from "fs";
writeFileSync("D:/workbuddy/express-news/archive/search-results-batch5.json", JSON.stringify(data, null, 2));
console.log("tasks:", data.length, "total results:", data.reduce((s, x) => s + x.results.length, 0));
