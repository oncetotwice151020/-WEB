const shopSourceProducts = Array.isArray(window.sonyOfficialProducts)
  ? window.sonyOfficialProducts
  : [];
const SHOP_ORDER_STORAGE_KEY = "sonyShopOrders";
const PRODUCT_FOOTPRINT_STORAGE_KEY = "sonyProductFootprints";
const PRODUCT_FOOTPRINT_LIMIT = 20;
const officialProductDetails =
  window.sonyOfficialProductDetails && typeof window.sonyOfficialProductDetails === "object"
    ? window.sonyOfficialProductDetails
    : {};
const shouldPlayShopArrival = document.documentElement.classList.contains("shop-arriving");

function loadStoredOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(SHOP_ORDER_STORAGE_KEY) || "[]");
    if (!Array.isArray(orders)) return [];
    return closeExpiredOrders(orders);
  } catch (error) {
    return [];
  }
}

const shopState = {
  type: "camera",
  series: "all",
  ideal: "all",
  query: "",
  sort: "featured",
  cart: [],
  orders: loadStoredOrders(),
  orderManageMode: false,
  selectedOrderIds: new Set(),
  pendingRemovalSku: null,
};

function recordProductFootprint(product, source = "shop") {
  if (!product || !product.model) return;

  try {
    const current = JSON.parse(localStorage.getItem(PRODUCT_FOOTPRINT_STORAGE_KEY) || "[]");
    const footprints = Array.isArray(current) ? current : [];
    const item = {
      model: product.model,
      title: product.title || product.model,
      image: product.image || "",
      type: product.type || "",
      badge: product.badge || "",
      description: product.description || product.category || "",
      category: product.category || "",
      sku8D: product.sku8D || "",
      productUrl: product.productUrl || "",
      source,
      viewedAt: new Date().toISOString(),
    };
    const next = [item, ...footprints].slice(0, PRODUCT_FOOTPRINT_LIMIT);
    localStorage.setItem(PRODUCT_FOOTPRINT_STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    // Browsing history is a convenience feature; ignore storage failures.
  }
}

const suggestionState = {
  items: [],
  activeIndex: -1,
};

const customProductDetails = {
  "Alpha 7C II": {
    eyebrow: "SONY ALPHA | ILCE-7CM2",
    title: "Alpha 7C II",
    model: "ILCE-7CM2",
    tagline: "全画幅双影像小一号旗舰",
    summary:
      "将约3300万像素全画幅画质、AI 智能识别、4K 视频能力与轻巧机身整合在一起，适合日常记录、旅行、人像与混合创作。",
    specs: [
      ["影像核心", "约3300万有效像素全画幅背照式 Exmor R CMOS"],
      ["处理系统", "BIONZ XR 影像处理器 + AI 智能芯片"],
      ["智能对焦", "759个相位检测对焦点，支持人、动物、鸟类、昆虫、车辆与飞机识别"],
      ["视频能力", "4K 60p、10-bit 4:2:2、S-Cinetone 与 LUT 监看"],
      ["稳定表现", "照片最高支持 7 级防抖，视频支持增强防抖模式"],
      ["机身设计", "约514g，侧翻式 LCD，照片 / 视频 / S&Q 模式切换转盘"],
    ],
    sections: [
      {
        title: "轻巧的全画幅核心",
        kicker: "FULL-FRAME COMPACT",
        body:
          "Alpha 7C II 把全画幅传感器放进紧凑机身里，在便携和画质之间取得平衡。它更适合随身携带，而不是只在正式拍摄时才拿出来。",
        bullets: ["约3300万有效像素全画幅传感器", "约514g 机身重量", "索尼 E 卡口镜头系统"],
      },
      {
        title: "直出与后期都保留空间",
        kicker: "COLOR / RAW / HEIF",
        body:
          "机内创意外观适合快速建立影像风格，RAW、JPEG 与 HEIF 则为后期和交付提供更灵活的选择。",
        bullets: ["10种创意外观预设", "支持 RAW / JPEG / HEIF", "S-Cinetone 适合视频直出色彩"],
      },
      {
        title: "AI 识别让拍摄更轻松",
        kicker: "AI AUTOFOCUS",
        body:
          "AI 智能芯片可识别更多主体，并配合覆盖范围广的相位检测对焦点，让人像、动物、交通工具和视频追踪更稳定。",
        bullets: ["759个相位检测对焦点", "支持人、动物、鸟类、昆虫、汽车、火车和飞机识别", "视频支持实时追踪与自动构图"],
      },
      {
        title: "面向混合创作者的视频能力",
        kicker: "4K / 10-BIT",
        body:
          "它不是单纯的照片相机。4K 录制、10-bit 4:2:2、S-Log3、S-Cinetone 与 LUT 监看，让它可以覆盖更认真的视频创作流程。",
        bullets: ["最高 4K 60p 视频录制", "10-bit 4:2:2 色彩采样", "支持 LUT 导入与监看"],
      },
      {
        title: "更适合随身使用的操控",
        kicker: "DAILY CONTROL",
        body:
          "侧翻屏、模式切换转盘、触摸操作和稳定系统让拍摄流程更直接。它适合频繁切换照片、视频和轻量记录的创作者。",
        bullets: ["侧翻式可变角度 LCD", "照片 / 视频 / S&Q 模式切换", "USB 连接可用于直播和高速传输"],
      },
    ],
    scenes: ["全画幅", "AI 对焦", "4K 60p", "轻量化"],
    sourceUrl: "https://www.sonystyle.com.cn/products/ilc/ilce_7cm2/ilce_7cm2_feature.html",
    shopUrl: "shop.html",
  },
  "Alpha 7CR": {
    eyebrow: "SONY ALPHA | ILCE-7CR",
    title: "Alpha 7CR",
    model: "ILCE-7CR",
    tagline: "全画幅高像素旗舰小一号",
    summary:
      "将约6100万像素全画幅画质、AI 智能识别和轻巧机身整合在一起，适合风光、旅行、人文街拍、人像与高分辨率创作。",
    specs: [
      ["影像核心", "约6100万有效像素全画幅背照式 Exmor R CMOS"],
      ["处理系统", "BIONZ XR 影像处理器 + AI 智能芯片"],
      ["智能对焦", "693个相位检测对焦点，支持人、动物、鸟类、昆虫、汽车 / 火车与飞机识别"],
      ["高分辨率", "支持像素转换多重拍摄，16张合成约2.408亿像素影像"],
      ["视频能力", "4K 60p、10-bit 4:2:2、S-Cinetone、S-Log3 与 LUT 监看"],
      ["机身设计", "约515g，最高 7 级防抖，多角度侧翻 LCD"],
    ],
    sections: [
      {
        title: "高像素的小机身",
        kicker: "61MP COMPACT",
        body:
          "Alpha 7CR 把接近 Alpha 7R V 的高分辨率画质放进更轻巧的机身里，核心价值不是堆满规格，而是让高像素相机更容易被随身带出去。",
        bullets: ["约6100万有效像素全画幅传感器", "35.7 x 23.8mm 全画幅尺寸", "约515g 含电池和存储卡重量"],
      },
      {
        title: "为细节和后期留下空间",
        kicker: "DETAIL / RAW / HEIF",
        body:
          "高像素传感器适合风光、建筑、商业静物和需要裁切余量的拍摄，RAW、JPEG 与 HEIF 组合也让交付方式更灵活。",
        bullets: ["支持 RAW / JPEG / HEIF 记录", "L 规格静态影像可达 9504 x 6336", "标准感光度 ISO 100-32000，静态照片可扩展至 ISO 50-102400"],
      },
      {
        title: "AI 识别辅助高像素拍摄",
        kicker: "AI AUTOFOCUS",
        body:
          "高像素对对焦精度更敏感，AI 智能芯片和实时追踪能降低拍摄压力，让人像、动物、交通工具和生态题材更稳定。",
        bullets: ["693个相位检测对焦点", "覆盖约79%成像范围的焦平面相位检测系统", "支持人、动物、鸟类、昆虫、汽车、火车和飞机识别"],
      },
      {
        title: "更完整的高分辨率工作流",
        kicker: "PIXEL SHIFT",
        body:
          "像素转换多重拍摄适合静物、文档、产品和风光等需要极致细节的场景，也让 A7CR 和普通轻量全画幅机型拉开层次。",
        bullets: ["支持像素转换多重拍摄", "16张照片可合成约2.408亿像素高分辨率影像", "支持对焦包围，便于获得更深景深效果"],
      },
      {
        title: "兼顾视频与随身创作",
        kicker: "4K / 10-BIT",
        body:
          "A7CR 的重点仍是高画质照片，但它也提供足够现代的视频规格，适合照片和短片混合创作的用户。",
        bullets: ["支持 4K 60p 视频录制", "支持 10-bit 4:2:2、S-Cinetone 与 S-Log3", "视频支持防抖增强模式和主体识别实时追踪"],
      },
    ],
    scenes: ["6100万像素", "AI 对焦", "像素转换", "轻量化"],
    sourceUrl: "https://www.sonystyle.com.cn/products/ilc/ilce_7cr/ilce_7cr_feature.html",
    shopUrl: "shop.html",
  },
};

const detailLabels = {
  portrait: "人像",
  travel: "旅行轻量",
  video: "视频创作",
  action: "高速抓拍",
  pro: "专业旗舰",
};

let activeDetailOverlay = null;
let lastDetailTrigger = null;

const shopRefs = {
  search: document.getElementById("shop-search"),
  suggestions: document.getElementById("shop-search-suggestions"),
  sort: document.getElementById("shop-sort"),
  contactWechat: document.querySelector('.shop-contact-link[href*="Sony_China_WeChat_Official_Account"]'),
  count: document.getElementById("shop-count"),
  note: document.getElementById("shop-note"),
  grid: document.getElementById("shop-grid"),
  empty: document.getElementById("shop-empty"),
  reset: document.getElementById("shop-reset"),
  cart: document.getElementById("shop-cart"),
  cartToggle: document.getElementById("shop-cart-toggle"),
  serviceWidget: document.getElementById("shop-service-widget"),
  serviceToggle: document.getElementById("shop-floating-service"),
  servicePanel: document.getElementById("shop-service-panel"),
  serviceInput: document.getElementById("shop-service-input"),
  serviceSend: document.getElementById("shop-service-send"),
  floatingCart: document.getElementById("shop-floating-cart"),
  floatingOrder: document.getElementById("shop-floating-order"),
  floatingOrderCount: document.getElementById("shop-floating-order-count"),
  floatingTop: document.getElementById("shop-floating-top"),
  orders: document.getElementById("shop-orders"),
  ordersClose: document.getElementById("shop-orders-close"),
  ordersManage: document.getElementById("shop-orders-manage"),
  ordersList: document.getElementById("shop-orders-list"),
  ordersBulkBar: document.getElementById("shop-orders-bulk-bar"),
  ordersSelectedCount: document.getElementById("shop-orders-selected-count"),
  ordersCancelManage: document.getElementById("shop-orders-cancel-manage"),
  ordersDeleteSelected: document.getElementById("shop-orders-delete-selected"),
  orderDetail: document.getElementById("shop-order-detail"),
  orderDetailClose: document.getElementById("shop-order-detail-close"),
  orderDetailContent: document.getElementById("shop-order-detail-content"),
  cartClose: document.getElementById("shop-cart-close"),
  cartClear: document.getElementById("shop-cart-clear"),
  cartCount: document.getElementById("shop-cart-count"),
  floatingCartCount: document.getElementById("shop-floating-cart-count"),
  cartItems: document.getElementById("shop-cart-items"),
  subtotal: document.getElementById("shop-subtotal"),
  checkout: document.getElementById("shop-checkout"),
  checkoutPanel: document.getElementById("shop-checkout-panel"),
  checkoutClose: document.getElementById("shop-checkout-close"),
  checkoutTotal: document.getElementById("shop-checkout-total"),
  checkoutProductsTotal: document.getElementById("shop-checkout-products-total"),
  checkoutDeliveryFee: document.getElementById("shop-checkout-delivery-fee"),
  checkoutTimer: document.getElementById("shop-checkout-timer"),
  checkoutError: document.getElementById("shop-checkout-error"),
  payButton: document.getElementById("shop-pay-button"),
  checkoutHint: document.getElementById("shop-checkout-hint"),
  addressMapOpen: document.getElementById("checkout-address-map-open"),
  addressMapModal: document.getElementById("shop-address-map-modal"),
  addressMapClose: document.getElementById("shop-address-map-close"),
  addressMapNote: document.getElementById("shop-address-map-note"),
  removeConfirm: document.getElementById("shop-remove-confirm"),
  removeConfirmName: document.getElementById("shop-remove-confirm-name"),
  removeConfirmCancel: document.getElementById("shop-remove-confirm-cancel"),
  removeConfirmAccept: document.getElementById("shop-remove-confirm-accept"),
  clearConfirm: document.getElementById("shop-clear-confirm"),
  clearConfirmCancel: document.getElementById("shop-clear-confirm-cancel"),
  clearConfirmAccept: document.getElementById("shop-clear-confirm-accept"),
  orderDeleteConfirm: document.getElementById("shop-order-delete-confirm"),
  orderDeleteConfirmCancel: document.getElementById("shop-order-delete-confirm-cancel"),
  orderDeleteConfirmAccept: document.getElementById("shop-order-delete-confirm-accept"),
  payment: document.getElementById("checkout-payment"),
  paymentLogo: document.getElementById("checkout-payment-logo"),
  cardFields: document.getElementById("checkout-card-fields"),
  delivery: document.getElementById("checkout-delivery"),
  qrModal: document.getElementById("shop-qr-modal"),
  qrClose: document.getElementById("shop-qr-close"),
  qrComplete: document.getElementById("shop-qr-complete"),
  qrLogo: document.getElementById("shop-qr-logo"),
  qrName: document.getElementById("shop-qr-name"),
  wechatModal: document.getElementById("shop-wechat-modal"),
  wechatClose: document.getElementById("shop-wechat-close"),
  paymentLoading: document.getElementById("shop-payment-loading"),
  orderCreating: document.getElementById("shop-order-creating"),
  paymentSuccess: document.getElementById("shop-payment-success"),
  successClose: document.getElementById("shop-success-close"),
  successDetails: document.getElementById("shop-success-details"),
  checkoutExpired: document.getElementById("shop-checkout-expired"),
  checkoutExpiredClose: document.getElementById("shop-checkout-expired-close"),
  checkoutExpiredConfirm: document.getElementById("shop-checkout-expired-confirm"),
};

const checkoutDurationSeconds = 5 * 60;
let checkoutRemainingSeconds = checkoutDurationSeconds;
let checkoutTimerId = null;
let paymentSimulationTimerId = null;
let orderCreationTimerId = null;
let activeCheckoutOrderId = null;
const checkoutCardPaymentTypes = new Set(["UnionPay", "Mastercard", "VISA", "JCB", "American Express"]);
const seriesFiltersByType = {
  camera: new Set(["all", "alpha-1", "alpha-9", "alpha-7r", "alpha-7c", "alpha-7"]),
  lens: new Set(["all", "g-master", "g-lens"]),
};
const checkoutDeliveryFees = {
  标准配送: 0,
  门店自提: 0,
  当日送达: 50,
};

const checkoutPaymentLogos = {
  "WeChat Pay": "images/wechatpay_logo.png",
  Alipay: "images/alipay_logo.png",
  UnionPay: "images/unionpay_logo.png",
  Mastercard: "images/mastercard_logo.png",
  VISA: "images/visa_logo.png",
  JCB: "images/JCB_logo.png",
  "American Express": "images/americanexpress_logo.png",
  PayPal: "images/paypal_logo.png",
};

const checkoutCityData = {
  北京市: ["北京市"],
  上海市: ["上海市"],
  天津市: ["天津市"],
  重庆市: ["重庆市"],
  河北省: ["石家庄市", "唐山市", "秦皇岛市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "沧州市", "廊坊市", "衡水市"],
  山西省: ["太原市", "大同市", "阳泉市", "长治市", "晋城市", "朔州市", "晋中市", "运城市", "忻州市", "临汾市", "吕梁市"],
  辽宁省: ["沈阳市", "大连市", "鞍山市", "抚顺市", "本溪市", "丹东市", "锦州市", "营口市", "阜新市", "辽阳市", "盘锦市", "铁岭市", "朝阳市", "葫芦岛市"],
  吉林省: ["长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"],
  黑龙江省: ["哈尔滨市", "齐齐哈尔市", "鸡西市", "鹤岗市", "双鸭山市", "大庆市", "伊春市", "佳木斯市", "七台河市", "牡丹江市", "黑河市", "绥化市", "大兴安岭地区"],
  江苏省: ["南京市", "无锡市", "徐州市", "常州市", "苏州市", "南通市", "连云港市", "淮安市", "盐城市", "扬州市", "镇江市", "泰州市", "宿迁市"],
  浙江省: ["杭州市", "宁波市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "衢州市", "舟山市", "台州市", "丽水市"],
  安徽省: ["合肥市", "芜湖市", "蚌埠市", "淮南市", "马鞍山市", "淮北市", "铜陵市", "安庆市", "黄山市", "滁州市", "阜阳市", "宿州市", "六安市", "亳州市", "池州市", "宣城市"],
  福建省: ["福州市", "厦门市", "莆田市", "三明市", "泉州市", "漳州市", "南平市", "龙岩市", "宁德市"],
  江西省: ["南昌市", "景德镇市", "萍乡市", "九江市", "新余市", "鹰潭市", "赣州市", "吉安市", "宜春市", "抚州市", "上饶市"],
  山东省: ["济南市", "青岛市", "淄博市", "枣庄市", "东营市", "烟台市", "潍坊市", "济宁市", "泰安市", "威海市", "日照市", "临沂市", "德州市", "聊城市", "滨州市", "菏泽市"],
  河南省: ["郑州市", "开封市", "洛阳市", "平顶山市", "安阳市", "鹤壁市", "新乡市", "焦作市", "濮阳市", "许昌市", "漯河市", "三门峡市", "南阳市", "商丘市", "信阳市", "周口市", "驻马店市", "济源市"],
  湖北省: ["武汉市", "黄石市", "十堰市", "宜昌市", "襄阳市", "鄂州市", "荆门市", "孝感市", "荆州市", "黄冈市", "咸宁市", "随州市", "恩施土家族苗族自治州", "仙桃市", "潜江市", "天门市", "神农架林区"],
  湖南省: ["长沙市", "株洲市", "湘潭市", "衡阳市", "邵阳市", "岳阳市", "常德市", "张家界市", "益阳市", "郴州市", "永州市", "怀化市", "娄底市", "湘西土家族苗族自治州"],
  广东省: ["广州市", "韶关市", "深圳市", "珠海市", "汕头市", "佛山市", "江门市", "湛江市", "茂名市", "肇庆市", "惠州市", "梅州市", "汕尾市", "河源市", "阳江市", "清远市", "东莞市", "中山市", "潮州市", "揭阳市", "云浮市"],
  海南省: ["海口市", "三亚市", "三沙市", "儋州市", "五指山市", "琼海市", "文昌市", "万宁市", "东方市"],
  四川省: ["成都市", "自贡市", "攀枝花市", "泸州市", "德阳市", "绵阳市", "广元市", "遂宁市", "内江市", "乐山市", "南充市", "眉山市", "宜宾市", "广安市", "达州市", "雅安市", "巴中市", "资阳市", "阿坝藏族羌族自治州", "甘孜藏族自治州", "凉山彝族自治州"],
  贵州省: ["贵阳市", "六盘水市", "遵义市", "安顺市", "毕节市", "铜仁市", "黔西南布依族苗族自治州", "黔东南苗族侗族自治州", "黔南布依族苗族自治州"],
  云南省: ["昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "普洱市", "临沧市", "楚雄彝族自治州", "红河哈尼族彝族自治州", "文山壮族苗族自治州", "西双版纳傣族自治州", "大理白族自治州", "德宏傣族景颇族自治州", "怒江傈僳族自治州", "迪庆藏族自治州"],
  陕西省: ["西安市", "铜川市", "宝鸡市", "咸阳市", "渭南市", "延安市", "汉中市", "榆林市", "安康市", "商洛市"],
  甘肃省: ["兰州市", "嘉峪关市", "金昌市", "白银市", "天水市", "武威市", "张掖市", "平凉市", "酒泉市", "庆阳市", "定西市", "陇南市", "临夏回族自治州", "甘南藏族自治州"],
  青海省: ["西宁市", "海东市", "海北藏族自治州", "黄南藏族自治州", "海南藏族自治州", "果洛藏族自治州", "玉树藏族自治州", "海西蒙古族藏族自治州"],
  内蒙古自治区: ["呼和浩特市", "包头市", "乌海市", "赤峰市", "通辽市", "鄂尔多斯市", "呼伦贝尔市", "巴彦淖尔市", "乌兰察布市", "兴安盟", "锡林郭勒盟", "阿拉善盟"],
  广西壮族自治区: ["南宁市", "柳州市", "桂林市", "梧州市", "北海市", "防城港市", "钦州市", "贵港市", "玉林市", "百色市", "贺州市", "河池市", "来宾市", "崇左市"],
  西藏自治区: ["拉萨市", "日喀则市", "昌都市", "林芝市", "山南市", "那曲市", "阿里地区"],
  宁夏回族自治区: ["银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"],
  新疆维吾尔自治区: ["乌鲁木齐市", "克拉玛依市", "吐鲁番市", "哈密市", "昌吉回族自治州", "博尔塔拉蒙古自治州", "巴音郭楞蒙古自治州", "阿克苏地区", "克孜勒苏柯尔克孜自治州", "喀什地区", "和田地区", "伊犁哈萨克自治州", "塔城地区", "阿勒泰地区", "石河子市", "阿拉尔市", "图木舒克市", "五家渠市", "北屯市", "铁门关市", "双河市", "可克达拉市", "昆玉市", "胡杨河市", "新星市", "白杨市"],
  香港特别行政区: ["香港"],
  澳门特别行政区: ["澳门"],
  台湾省: ["台北市", "新北市", "桃园市", "台中市", "台南市", "高雄市", "基隆市", "新竹市", "嘉义市"],
};

const checkoutDistrictData = {
  北京市: ["东城区", "西城区", "朝阳区", "海淀区", "丰台区", "通州区"],
  上海市: ["黄浦区", "徐汇区", "静安区", "浦东新区", "闵行区", "杨浦区"],
  天津市: ["和平区", "河西区", "南开区", "滨海新区", "武清区"],
  重庆市: ["渝中区", "江北区", "渝北区", "南岸区", "九龙坡区"],
  南京市: ["玄武区", "秦淮区", "建邺区", "鼓楼区", "浦口区", "江宁区"],
  苏州市: ["姑苏区", "虎丘区", "吴中区", "相城区", "吴江区"],
  无锡市: ["梁溪区", "锡山区", "惠山区", "滨湖区", "新吴区"],
  广州市: ["越秀区", "天河区", "海珠区", "荔湾区", "番禺区", "白云区"],
  深圳市: ["福田区", "南山区", "罗湖区", "宝安区", "龙岗区", "龙华区"],
  杭州市: ["上城区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区"],
  成都市: ["锦江区", "青羊区", "金牛区", "武侯区", "成华区", "高新区"],
  香港: ["中西区", "湾仔区", "东区", "南区", "油尖旺区", "深水埗区", "九龙城区", "黄大仙区", "观塘区", "北区", "大埔区", "沙田区", "西贡区", "荃湾区", "屯门区", "元朗区", "葵青区", "离岛区"],
  澳门: ["花地玛堂区", "圣安多尼堂区", "大堂区", "望德堂区", "风顺堂区", "嘉模堂区", "圣方济各堂区", "路氹填海区"],
  台北市: ["中正区", "大同区", "中山区", "松山区", "大安区", "万华区", "信义区", "士林区", "北投区", "内湖区", "南港区", "文山区"],
  新北市: ["板桥区", "三重区", "中和区", "永和区", "新庄区", "新店区", "土城区", "芦洲区", "树林区", "汐止区", "淡水区", "三峡区"],
  桃园市: ["桃园区", "中坜区", "平镇区", "八德区", "龟山区", "芦竹区", "大溪区", "杨梅区", "大园区", "观音区", "龙潭区", "新屋区", "复兴区"],
  台中市: ["中区", "东区", "南区", "西区", "北区", "西屯区", "南屯区", "北屯区", "丰原区", "大里区", "太平区", "清水区"],
  台南市: ["中西区", "东区", "南区", "北区", "安平区", "安南区", "永康区", "归仁区", "新营区", "仁德区", "善化区", "麻豆区"],
  高雄市: ["新兴区", "前金区", "苓雅区", "盐埕区", "鼓山区", "旗津区", "前镇区", "三民区", "左营区", "楠梓区", "小港区", "凤山区"],
  基隆市: ["仁爱区", "信义区", "中正区", "中山区", "安乐区", "暖暖区", "七堵区"],
  新竹市: ["东区", "北区", "香山区"],
  嘉义市: ["东区", "西区"],
};

const checkoutRegionDataUrl = "https://unpkg.com/china-division@2.7.0/dist/pca.json";
let checkoutRegionSource = [];
let checkoutAddressMap = null;
let checkoutAddressMarker = null;

function normalizeSpaces(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getOrderStatus(order = {}) {
  if (order.status === "completed") return "completed";
  if (order.status === "paid") return "paid";
  if (order.status === "closed") return "closed";
  if (order.status === "unpaid") {
    const expiresAt = new Date(order.expiresAt || 0).getTime();
    return expiresAt && expiresAt <= Date.now() ? "closed" : "unpaid";
  }
  return order.paidAt ? "paid" : "unpaid";
}

function isOrderUnpaid(order = {}) {
  return getOrderStatus(order) === "unpaid";
}

function closeExpiredOrders(orders = []) {
  let changed = false;
  const normalized = orders.map((order) => {
    if (order && getOrderStatus(order) === "closed" && order.status === "unpaid") {
      changed = true;
      return { ...order, status: "closed", closedAt: order.closedAt || new Date().toISOString() };
    }
    return order;
  });

  if (changed) {
    try {
      localStorage.setItem(SHOP_ORDER_STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {}
  }

  return normalized;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
}

function persistOrders() {
  try {
    localStorage.setItem(SHOP_ORDER_STORAGE_KEY, JSON.stringify(shopState.orders));
  } catch (error) {}
}

function normalizeShopSearch(value) {
  return normalizeSpaces(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[™®]/g, "")
    .replace(/α/g, "alpha")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "");
}

function normalizeShopSearch(value) {
  return normalizeSpaces(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[™®]/g, "")
    .replace(/伪/g, "alpha")
    .replace(/\bsony\b/g, "")
    .replace(/索尼/g, "")
    .replace(/微单/g, " alpha ")
    .replace(/全画幅/g, " full frame ")
    .replace(/半画幅/g, " aps-c ")
    .replace(/[路銉籡]/g, " ")
    .replace(/[_/|+()（）,，。·、【】]/g, " ")
    .replace(/[-鈥愨€戔€掆€撷€斺€曪紞]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactRawShopSearch(value) {
  return normalizeShopSearch(value).replace(/[^a-z0-9\u4e00-\u9fff]/g, "");
}

function romanValue(value) {
  const romanMap = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };
  return romanMap[value] || value;
}

function compactShopSearch(value) {
  const raw = compactRawShopSearch(value);
  return raw.replace(/(\d+[a-z]*)(iii|ii|iv|v)$/g, (_, prefix, roman) => {
    return prefix + romanValue(roman);
  });
}

function addAlias(aliases, value) {
  const normalized = normalizeShopSearch(value);
  if (!normalized) return;

  aliases.add(normalized);
  aliases.add(compactRawShopSearch(normalized));
  aliases.add(compactShopSearch(normalized));
}

function addAlphaAliases(aliases, model) {
  const normalized = normalizeShopSearch(model);
  const match = normalized.match(/^alpha\s+(.+)$/);
  if (!match) return;

  const rest = match[1];
  const restRaw = compactRawShopSearch(rest);
  const restCompact = compactShopSearch(rest);

  [restRaw, restCompact].filter(Boolean).forEach((variant) => {
    aliases.add(`a${variant}`);
    aliases.add(`alpha${variant}`);
  });

  const series = rest.match(/^(\d+[a-z]*)(?:\s+)?(ii|iii|iv|v)$/);
  if (series) {
    const numbered = romanValue(series[2]);
    aliases.add(`a${series[1]}m${numbered}`);
    aliases.add(`alpha${series[1]}m${numbered}`);
  }
}

function addModelFamilyAliases(aliases, model) {
  const normalized = normalizeShopSearch(model);
  const compactRaw = compactRawShopSearch(normalized);
  const compact = compactShopSearch(normalized);

  addAlphaAliases(aliases, model);

  [compactRaw, compact].filter(Boolean).forEach((variant) => {
    if (variant.startsWith("dscrx")) {
      aliases.add(variant.replace(/^dsc/, ""));
    }
  });

  const fxMatch = compactRaw.match(/^fx(\d+)a$/);
  if (fxMatch) {
    aliases.add(`fx${fxMatch[1]}`);
  }

  const zvMatch = normalized.match(/^zv\s*e?(\d+)\s+(ii|iii|iv|v)$/);
  if (zvMatch) {
    aliases.add(`zve${zvMatch[1]}m${romanValue(zvMatch[2])}`);
  }

  if (compactRaw.startsWith("sel") && compactRaw.length > 3) {
    aliases.add(compactRaw.slice(3));
  }
}

function createShopAliases(product, model, title, description, filters) {
  const aliases = new Set();
  [
    model,
    title,
    product.sku8D,
    product.category,
    description,
    ...filters,
  ].forEach((value) => addAlias(aliases, value));

  addModelFamilyAliases(aliases, model);
  addModelFamilyAliases(aliases, title);

  return [...aliases].filter(Boolean);
}

function getQueryInfo(query) {
  const normalized = normalizeShopSearch(query);
  return {
    raw: query,
    normalized,
    compactRaw: compactRawShopSearch(query),
    compact: compactShopSearch(query),
    tokens: normalized.split(" ").filter(Boolean),
  };
}

function getSubsequenceScore(query, target) {
  if (query.length < 2 || !target || query.length > target.length) return 0;

  let queryIndex = 0;
  let firstMatch = -1;
  let lastMatch = -1;
  let gaps = 0;

  for (let i = 0; i < target.length && queryIndex < query.length; i += 1) {
    if (target[i] === query[queryIndex]) {
      if (firstMatch === -1) firstMatch = i;
      if (lastMatch !== -1) gaps += Math.max(0, i - lastMatch - 1);
      lastMatch = i;
      queryIndex += 1;
    }
  }

  if (queryIndex !== query.length) return 0;

  const density = query.length / Math.max(target.length, 1);
  const startBonus = firstMatch === 0 ? 10 : 0;
  return Math.max(0, 42 + density * 28 + startBonus - gaps * 1.8);
}

function levenshteinDistance(a, b) {
  if (Math.abs(a.length - b.length) > 3) return Number.POSITIVE_INFINITY;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function getAliasScore(alias, queryInfo) {
  if (!queryInfo.compact) return 1;

  const aliasNormalized = normalizeShopSearch(alias);
  const candidates = [
    aliasNormalized,
    compactRawShopSearch(alias),
    compactShopSearch(alias),
  ].filter(Boolean);

  let best = 0;

  candidates.forEach((candidate) => {
    if (candidate === queryInfo.normalized || candidate === queryInfo.compact) {
      best = Math.max(best, 130);
    }

    if (candidate.startsWith(queryInfo.compact)) {
      best = Math.max(best, 112 - Math.min(candidate.length - queryInfo.compact.length, 28));
    }

    if (candidate.includes(queryInfo.compact)) {
      best = Math.max(best, 92 - Math.min(candidate.indexOf(queryInfo.compact), 22));
    }

    best = Math.max(best, getSubsequenceScore(queryInfo.compact, candidate));

    if (queryInfo.compact.length >= 3 && candidate.length <= queryInfo.compact.length + 3) {
      const distance = levenshteinDistance(queryInfo.compact, candidate);
      if (distance <= 2) {
        best = Math.max(best, 64 - distance * 10);
      }
    }
  });

  return best;
}

function getProductScore(product, queryInfo) {
  if (!queryInfo.compact) return 1;

  let score = 0;

  if (product.searchText.includes(queryInfo.normalized)) {
    score = Math.max(score, 88);
  }

  if (product.searchCompactText.includes(queryInfo.compact)) {
    score = Math.max(score, 82);
  }

  const tokenHits = queryInfo.tokens.filter((token) => product.searchText.includes(token));
  if (queryInfo.tokens.length && tokenHits.length === queryInfo.tokens.length) {
    score = Math.max(score, 66 + Math.min(queryInfo.tokens.length * 4, 14));
  }

  product.searchAliases.forEach((alias) => {
    score = Math.max(score, getAliasScore(alias, queryInfo));
  });

  return score;
}

function getMinimumScore(queryInfo) {
  if (!queryInfo.compact) return 0;
  if (queryInfo.compact.length <= 2) return 55;
  if (queryInfo.compact.length <= 4) return 58;
  return 32;
}

function matchesShopFilters(product) {
  const typeMatch = shopState.type === "all" || product.type === shopState.type;
  const seriesMatch = shopState.series === "all" || product.series === shopState.series;
  const idealMatch = shopState.ideal === "all" || product.ideals.includes(shopState.ideal);
  return typeMatch && seriesMatch && idealMatch;
}

function sortProducts(products, queryInfo) {
  return products.sort((a, b) => {
    if (queryInfo?.compact && b.score !== a.score) return b.score - a.score;
    if (shopState.sort === "camera" && a.product.type !== b.product.type) return a.product.type === "camera" ? -1 : 1;
    if (shopState.sort === "lens" && a.product.type !== b.product.type) return a.product.type === "lens" ? -1 : 1;
    if (shopState.sort === "name") return a.product.title.localeCompare(b.product.title, "zh-CN");
    return a.product.index - b.product.index;
  });
}

function getShopTitle(product) {
  const model = normalizeSpaces(product.model);
  const title = normalizeSpaces(product.title || model);

  if (product.type === "lens") {
    const withoutModel = title
      .replace(new RegExp(`\\s*[（(]${model}[）)]\\s*`, "i"), " ")
      .replace(/\s+/g, " ")
      .trim();
    const lensNameMatch = withoutModel.match(
      /^(?:(?:Vario-Tessar|Sonnar|Planar|Distagon|Tessar)\s+T\*\s+)?(?:FE|E|DT)\s+(?:C\s+)?(?:PZ\s+)?\d+(?:-\d+)?mm\s*(?:F|T)[\d.]+(?:-[\d.]+)?(?:\s+(?:Macro|STF|PZ|OSS|GM|G|ZA|II|LE))*\b/i
    );

    return lensNameMatch ? lensNameMatch[0].replace(/\s+/g, " ").trim() : withoutModel;
  }

  return model || title;
}

function getSeries(product, text) {
  if (product.type === "lens") {
    if (text.includes("g大师") || /\bgm\b/.test(text)) return "g-master";
    if (/\bg\b/.test(text) || text.includes("g镜头")) return "g-lens";
    return "lens";
  }

  if (text.includes("cinema line") || /\bfx/.test(text)) return "cinema";
  if (text.includes("alpha 1")) return "alpha-1";
  if (text.includes("alpha 9")) return "alpha-9";
  if (text.includes("alpha 7r")) return "alpha-7r";
  if (text.includes("alpha 7c")) return "alpha-7c";
  if (text.includes("alpha 7")) return "alpha-7";
  return "camera";
}

function getIdeals(text) {
  const ideals = [];
  if (/50mm|85mm|135mm|人像|portrait|f1\.2|f1\.4|f1\.8/.test(text)) ideals.push("portrait");
  if (/旅行|轻量|轻巧|compact|alpha 7c|zv|24-50|16-25/.test(text)) ideals.push("travel");
  if (/视频|电影|vlog|zv|fx|cinema|pz|电动变焦|4k/.test(text)) ideals.push("video");
  if (/高速|体育|生态|远摄|超远摄|400|600|800|alpha 9/.test(text)) ideals.push("action");
  if (/旗舰|专业|alpha 1|alpha 9|g大师|gm|cinema/.test(text)) ideals.push("pro");
  return ideals.length ? ideals : ["pro"];
}

function getShopBadge(product, text) {
  if (product.type === "camera") {
    if (text.includes("cinema line") || /\bfx/.test(text)) return "Cinema Line";
    if (text.includes("zv")) return "Vlog";
    if (text.includes("aps-c") || text.includes("半画幅")) return "APS-C";
    return "Alpha";
  }

  if (text.includes("g大师") || /\bgm\b/.test(text)) return "G Master";
  if (text.includes("zeiss") || text.includes("蔡司")) return "ZEISS";
  if (/\bg\b/.test(text) || text.includes("g镜头")) return "G Lens";
  return "E Mount";
}

const officialLaunchPrices = {
  P32856728: {
    price: 13999,
    label: "发售建议零售价",
    note: "Alpha 7C II 单机身",
    source: "索尼中国 2023-08-30 产品新闻",
  },
  P32856873: {
    price: 20999,
    label: "发售建议零售价",
    note: "Alpha 7CR 单机身",
    source: "索尼中国 2023-08-30 产品新闻",
  },
  P32854170: {
    price: 25999,
    label: "发售建议零售价",
    note: "Alpha 7R V 单机身",
    source: "索尼中国 2022-10-27 产品新闻",
  },
  P32852226: {
    price: 12499,
    label: "发售建议零售价",
    note: "Alpha 7C 单机身",
    source: "索尼中国 2020-09-15 产品新闻",
  },
  P50009478: {
    price: 14000,
    label: "发售建议零售价",
    note: "FX30B 不含手柄单机",
    source: "索尼中国 2022-09-30 产品新闻",
  },
  P32874950: {
    price: 19800,
    label: "发售建议零售价",
    note: "FX2B 单机身",
    source: "索尼中国 2025 产品新闻",
  },
  P32874150: {
    price: 32000,
    label: "发售建议零售价",
    note: "FX3 / FX3A 单机身",
    source: "索尼中国 官方产品新闻",
  },
  P43654450: {
    price: 41999,
    label: "发售建议零售价",
    note: "FX6 单机身",
    source: "索尼中国 2020-11-18 产品新闻",
  },
  P80850725: {
    price: 17999,
    label: "发售建议零售价",
    note: "Alpha 7 V 单机身",
    source: "索尼中国 2025-12-02 产品新闻",
  },
  P50009266: {
    price: 16999,
    label: "发售建议零售价",
    note: "Alpha 7 IV 单机身",
    source: "索尼中国 2021-10-22 产品新闻",
  },
  P32858325: {
    price: 6999,
    label: "发售建议零售价",
    note: "ZV-E10 II 单机身",
    source: "索尼中国 2024-07-10 产品新闻",
  },
  P80850425: {
    price: 9999,
    label: "发售建议零售价",
    note: "Alpha 6700 单机身",
    source: "索尼中国 2023-07-13 产品新闻",
  },
  P32858670: {
    price: 47999,
    label: "发售建议零售价",
    note: "Alpha 1 II 单机身",
    source: "索尼中国 2024-11-20 产品新闻",
  },
  P32853370: {
    price: 47999,
    label: "发售建议零售价",
    note: "Alpha 1 单机身",
    source: "索尼中国 2021-01-27 产品新闻",
  },
  P32854328: {
    price: 15499,
    label: "发售建议零售价",
    note: "ZV-E1 单机身",
    source: "索尼中国 2023-03-30 产品新闻",
  },
  P32856370: {
    price: 44999,
    label: "发售建议零售价",
    note: "Alpha 9 III 单机身",
    source: "索尼中国 2023-11-07 产品新闻",
  },
  P32851970: {
    price: 23999,
    label: "发售建议零售价",
    note: "Alpha 7S III 单机身",
    source: "索尼中国 2020-07-29 产品新闻",
  },
  P80819870: {
    price: 33999,
    label: "发售建议零售价",
    note: "RX1R III 单机",
    source: "索尼中国 2025 产品新闻",
  },
  P80819078: {
    price: 5199,
    label: "发售建议零售价",
    note: "ZV-1 单机",
    source: "索尼中国 2020-05-29 产品新闻",
  },
  P80819276: {
    price: 3499,
    label: "发售建议零售价",
    note: "ZV-1F 单机",
    source: "索尼中国 2022-09-15 产品新闻",
  },
  P80819477: {
    price: 5899,
    label: "发售建议零售价",
    note: "ZV-1 II 单机",
    source: "索尼中国 2023-05-23 产品新闻",
  },
  P32829425: {
    price: 9219,
    originalPrice: 14599,
    label: "当前价格",
    note: "Alpha 7 III 单机身",
    source: "用户指定价格",
  },
  P32853070: {
    price: 22999,
    label: "发售建议零售价",
    note: "Alpha 7R IV 单机身",
    source: "用户指定价格",
  },
  P80850526: {
    price: 4699,
    label: "当前价格",
    note: "ZV-E10 单机身",
    source: "用户指定价格",
  },
  P32851225: {
    price: 10599,
    label: "当前价格",
    note: "Alpha 6600 单机身",
    source: "用户指定价格",
  },
  P32859925: {
    price: 7499,
    label: "当前价格",
    note: "Alpha 6400 单机身",
    source: "用户指定价格",
  },
  P80818875: {
    price: 8699,
    label: "当前价格",
    note: "DSC-RX100M7 单机",
    source: "用户指定价格",
  },
  VnibKENx0: {
    price: 85000,
    label: "发售建议零售价",
    note: "FX9 单机身",
    source: "用户指定价格",
  },
};

const officialLensPrices = Object.fromEntries(
  [
    ["P32863476", 9299, "SEL100M28GM 单品"],
    ["P32863276", 28999, "SEL50150GM 单品"],
    ["P32862476", 18999, "SEL400800G 单品"],
    ["P32863376", 6499, "SEL16F18G 单品"],
    ["P32862376", 22000, "SEL2870GM 单品"],
    ["P32863586", 12400, "SEL85F14GM2 单品"],
    ["P32861476", 16499, "SEL1635GM2 单品"],
    ["P32860076", 14499, "SEL2470GM2 单品"],
    ["P32849976", 18999, "SEL70200GM2 单品"],
    ["P32860876", 7999, "SEL2450G 单品"],
    ["P32861576", 8499, "SEL1625G 单品"],
    ["P32861676", 45999, "SEL300F28GM 单品"],
    ["P32849286", 11300, "SEL14F18GM 单品"],
    ["P32847676", 11300, "SEL24F14GM 单品"],
    ["P32848976", 11300, "SEL35F14GM 单品"],
    ["P32860686", 9599, "SEL50F14GM 单品"],
    ["P32849076", 15999, "SEL50F12GM 单品"],
    ["P32845776", 11499, "SEL85F14GM 单品"],
    ["P32845076", 11000, "SEL100F28GM 单品"],
    ["P32847786", 13500, "SEL135F18GM 单品"],
    ["P32847576", 95000, "SEL400F28GM 单品"],
    ["P32848076", 105000, "SEL600F40GM 单品"],
    ["P32846576", 16500, "SEL1635GM 单品"],
    ["P32845676", 14999, "SEL2470GM 单品"],
    ["P32848486", 21999, "SEL1224GM 单品"],
    ["P32846476", 18999, "SEL70200GM 单品"],
    ["P32848886", 17500, "SEL100400GM 单品"],
    ["P50006562", 8499, "SELP1635G 单品"],
    ["P50006572", 7999, "SEL2070G 单品"],
    ["P32844576", 10100, "SEL70200G 单品"],
    ["P32860986", 10999, "SEL70200G2 单品"],
    ["P32842076", 7400, "SEL90M28G 单品"],
    ["P32846276", 8600, "SEL70300G 单品"],
    ["P32860276", 4699, "SELP1020G 单品"],
    ["P32860476", 4699, "SEL15F14G 单品"],
    ["P32844076", 4400, "SELP18105G 单品"],
    ["P32848276", 6899, "SEL70350G 单品"],
    ["P32848376", 7499, "SEL20F18G 单品"],
    ["P32849376", 4699, "SEL24F28G 单品"],
    ["P32849476", 4699, "SEL40F25G 单品"],
    ["P32849576", 4699, "SEL50F25G 单品"],
    ["P32846840", 24000, "SELP18110G 单品"],
    ["P32847186", 14800, "SELP28135G 单品"],
    ["P32847076", 12500, "SEL1224G 单品"],
    ["P50006571", 9999, "SEL24105G 单品"],
    ["P32847876", 14500, "SEL200600G 单品"],
    ["P94643350", 41999, "SELC1635G 单品"],
    ["P32847986", 8999, "SEL1655G 单品"],
    ["P32844876", 7100, "SEL1635Z 单品"],
    ["P32841976", 4600, "SEL1670Z 单品"],
    ["P32844376", 6200, "SEL2470Z 单品"],
    ["P32844976", 9900, "SEL35F14Z 单品"],
    ["P32844176", 4000, "SEL35F28Z 单品"],
    ["P32845976", 11000, "SEL50F14Z 单品"],
    ["P50006567", 4900, "SEL55F18Z 单品"],
    ["P32841476", 4700, "SEL1018 单品"],
    ["P32840276", 5200, "SEL18200 单品"],
    ["P32841776", 4500, "SEL18200LE 单品"],
    ["P32841876", 8000, "SELP18200 单品"],
    ["P32845376", 6500, "SEL24240 单品"],
    ["P32840376", 2600, "SEL55210/S 单品"],
    ["P32844776", 2600, "SEL55210/B 单品"],
    ["P32847476", 4700, "SEL18135 单品"],
    ["P32860376", 3399, "SEL11F18 单品"],
    ["P50004819", 4700, "SEL35F18F 单品"],
    ["P32845876", 3600, "SEL50M28 单品"],
    ["P32841676", 2300, "SEL20F28 单品"],
    ["P32845176", 2600, "SEL28F20 单品"],
    ["P32841576", 2950, "SEL35F18 单品"],
    ["P32840676", 2200, "SEL50F18/S 单品"],
    ["P32844676", 2200, "SEL50F18/B 单品"],
    ["P32846076", 1700, "SEL50F18F 单品"],
    ["P32840476", 1900, "SEL30M35 单品"],
    ["P32846976", 4319, "SEL85F18 单品"],
    ["P32845476", 1900, "SEL057FEC 单品"],
    ["P32845576", 1500, "SEL075UWC 单品"],
    ["P02668771", 1100, "VCL-ECU2 单品"],
    ["P02644571", 1200, "VCL-ECF2 单品"],
    ["P32846676", 3900, "SEL14TC 单品"],
    ["P32846776", 3900, "SEL20TC 单品"],
  ].map(([sku, price, note]) => [
    sku,
    {
      price,
      label: "当前价格",
      note,
      source: "Sony China official price API (OW-1/CNY, 2026-04-21)",
    },
  ])
);

Object.assign(officialLaunchPrices, officialLensPrices);

function getOfficialLaunchPrice(product) {
  return officialLaunchPrices[product.sku8D] || null;
}

function formatPrice(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
}

function renderShopCardPrice(product) {
  if (!product.launchPrice) {
    return '<span>官方发售价</span><strong>待补</strong><em>未找到索尼官方发售价格来源</em>';
  }

  const originalPrice = Number(product.launchPrice.originalPrice || 0);
  const currentPrice = formatPrice(product.launchPrice.price);
  const labelText = ["发售建议零售价", "当前价格"].includes(product.launchPrice.label)
    ? "建议零售价"
    : product.launchPrice.label;
  const priceMarkup = originalPrice > Number(product.launchPrice.price || 0)
    ? `<div class="shop-card-price-row"><b>${formatPrice(originalPrice)}</b><strong>${currentPrice}</strong></div>`
    : `<strong>${currentPrice}</strong>`;

  return `<span>${labelText}</span>${priceMarkup}<em>${product.launchPrice.note}</em>`;
}

function formatPaymentTime(value) {
  if (!value) return "未记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未记录";

  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function getCheckoutDeliveryFee() {
  return checkoutDeliveryFees[shopRefs.delivery?.value] || 0;
}

function updateCheckoutTotals(productTotal, hasMissingPrice) {
  const deliveryFee = productTotal > 0 ? getCheckoutDeliveryFee() : 0;
  const payable = productTotal + deliveryFee;
  const productTotalText = hasMissingPrice ? "待确认" : formatPrice(productTotal);
  const deliveryFeeText = hasMissingPrice ? "待确认" : formatPrice(deliveryFee);
  const payableText = hasMissingPrice ? "待确认" : formatPrice(payable);

  shopRefs.subtotal.textContent = productTotalText;
  shopRefs.checkoutTotal.textContent = payableText;
  if (shopRefs.checkoutProductsTotal) shopRefs.checkoutProductsTotal.textContent = productTotalText;
  if (shopRefs.checkoutDeliveryFee) shopRefs.checkoutDeliveryFee.textContent = deliveryFeeText;
}

function getCheckoutProductTotal() {
  const activeOrder = getActiveCheckoutOrder();
  if (activeOrder) return Number(activeOrder.productTotal || 0);

  return shopState.cart.reduce((sum, product) => {
    return sum + (product.launchPrice ? product.launchPrice.price * (product.quantity || 1) : 0);
  }, 0);
}

function getCartOrderItems() {
  return shopState.cart.map((product) => ({
    title: product.title,
    quantity: product.quantity || 1,
    price: product.launchPrice ? product.launchPrice.price : 0,
  }));
}

function getActiveCheckoutOrder() {
  if (!activeCheckoutOrderId) return null;
  return shopState.orders.find((order) => order.orderId === activeCheckoutOrderId) || null;
}

function getCheckoutFormOrderData(baseOrder = {}) {
  const productTotal = Number(baseOrder.productTotal ?? getCheckoutProductTotal());
  const deliveryFee = getCheckoutDeliveryFee();
  const payment = shopRefs.payment?.value || "WeChat Pay";
  const delivery = shopRefs.delivery?.value || "标准配送";
  const address = [
    document.getElementById("checkout-province")?.value,
    document.getElementById("checkout-city")?.value,
    document.getElementById("checkout-district")?.value,
    document.getElementById("checkout-address-detail")?.value,
  ].filter(Boolean).join(" ");

  return {
    ...baseOrder,
    lastName: document.getElementById("checkout-last-name")?.value || "",
    firstName: document.getElementById("checkout-first-name")?.value || "",
    name: `${document.getElementById("checkout-last-name")?.value || ""}${document.getElementById("checkout-first-name")?.value || ""}` || "未填写",
    phone: `+86 ${document.getElementById("checkout-phone")?.value || "未填写"}`,
    email: document.getElementById("checkout-email")?.value || "未填写",
    province: document.getElementById("checkout-province")?.value || "",
    city: document.getElementById("checkout-city")?.value || "",
    district: document.getElementById("checkout-district")?.value || "",
    addressDetail: document.getElementById("checkout-address-detail")?.value || "",
    address: address || "未填写",
    payment,
    delivery,
    productTotal,
    deliveryFee,
    total: productTotal + deliveryFee,
    items: baseOrder.items?.length ? baseOrder.items : getCartOrderItems(),
  };
}

function getCheckoutSummary() {
  const paidAt = new Date();
  const activeOrder = getActiveCheckoutOrder();
  const baseOrder = activeOrder || {
    orderId: `SONY-${paidAt.getTime().toString().slice(-8)}`,
    createdAt: paidAt.toISOString(),
    expiresAt: new Date(paidAt.getTime() + checkoutDurationSeconds * 1000).toISOString(),
  };

  return {
    ...getCheckoutFormOrderData(baseOrder),
    paidAt: paidAt.toISOString(),
    status: "paid",
  };
}

function createPendingCheckoutOrder() {
  const now = new Date();
  const productTotal = shopState.cart.reduce((sum, product) => {
    return sum + (product.launchPrice ? product.launchPrice.price * (product.quantity || 1) : 0);
  }, 0);
  const delivery = shopRefs.delivery?.value || "标准配送";
  const deliveryFee = checkoutDeliveryFees[delivery] || 0;

  const order = {
    orderId: `SONY-${now.getTime().toString().slice(-8)}`,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + checkoutDurationSeconds * 1000).toISOString(),
    paidAt: null,
    status: "unpaid",
    lastName: "",
    firstName: "",
    name: "未填写",
    phone: "未填写",
    email: "未填写",
    province: "",
    city: "",
    district: "",
    addressDetail: "",
    address: "未填写",
    payment: shopRefs.payment?.value || "WeChat Pay",
    delivery,
    productTotal,
    deliveryFee,
    total: productTotal + deliveryFee,
    items: getCartOrderItems(),
  };

  shopState.orders = [order, ...shopState.orders.filter((item) => item.orderId !== order.orderId)];
  activeCheckoutOrderId = order.orderId;
  persistOrders();
  renderOrderCount();
  renderOrders();
  return order;
}

function updateOrderInState(order) {
  const index = shopState.orders.findIndex((item) => item.orderId === order.orderId);
  if (index >= 0) {
    shopState.orders[index] = order;
  } else {
    shopState.orders.unshift(order);
  }
  persistOrders();
  renderOrderCount();
  renderOrders();
}

function syncActiveCheckoutOrderFromForm() {
  const order = getActiveCheckoutOrder();
  if (!order || getOrderStatus(order) !== "unpaid") return null;
  const updated = getCheckoutFormOrderData(order);
  updateOrderInState(updated);
  return updated;
}

function openPaymentModal(modal) {
  modal?.classList.add("is-open");
  modal?.setAttribute("aria-hidden", "false");
}

function closePaymentModal(modal) {
  modal?.classList.remove("is-open");
  modal?.setAttribute("aria-hidden", "true");
}

function clearPaymentSimulationTimer() {
  window.clearTimeout(paymentSimulationTimerId);
  paymentSimulationTimerId = null;
}

function clearOrderCreationTimer() {
  window.clearTimeout(orderCreationTimerId);
  orderCreationTimerId = null;
}

function openWechatQrModal(event) {
  event?.preventDefault();
  openPaymentModal(shopRefs.wechatModal);
}

function openServiceWidget() {
  shopRefs.serviceWidget?.classList.add("is-open");
  window.setTimeout(() => {
    shopRefs.serviceInput?.focus({ preventScroll: true });
  }, 180);
}

function closeServiceWidget() {
  shopRefs.serviceWidget?.classList.remove("is-open");
}

function toggleServiceWidget() {
  if (!shopRefs.serviceWidget) return;
  if (shopRefs.serviceWidget.classList.contains("is-open")) {
    closeServiceWidget();
    return;
  }
  openServiceWidget();
}

function submitServiceMessage(event) {
  event?.preventDefault();
  const value = normalizeSpaces(shopRefs.serviceInput?.value || "");
  if (!value) {
    shopRefs.serviceInput?.focus({ preventScroll: true });
    return;
  }

  if (shopRefs.serviceInput) {
    shopRefs.serviceInput.value = "";
  }
  closeServiceWidget();
}

function closePaymentSuccessFlow() {
  closePaymentModal(shopRefs.paymentSuccess);
  closeCheckout();
}

function openOrders() {
  window.location.href = "orders.html";
}

function closeOrders() {
  setOrdersManageMode(false);
  closeOrderDetail();
  shopRefs.orders.classList.remove("is-open");
  shopRefs.orders.setAttribute("aria-hidden", "true");
}

function renderOrderCount() {
  if (shopRefs.floatingOrderCount) {
    shopRefs.floatingOrderCount.textContent = shopState.orders.length;
  }
}

function syncOrderManageUI() {
  const selectedCount = shopState.selectedOrderIds.size;
  const canManage = shopState.orders.length > 0;

  shopRefs.orders?.classList.toggle("is-managing", shopState.orderManageMode);
  if (shopRefs.ordersManage) {
    shopRefs.ordersManage.textContent = shopState.orderManageMode ? "完成" : "管理";
    shopRefs.ordersManage.disabled = !canManage;
    shopRefs.ordersManage.setAttribute("aria-pressed", shopState.orderManageMode ? "true" : "false");
  }
  shopRefs.ordersBulkBar?.classList.toggle("hidden", !shopState.orderManageMode);
  if (shopRefs.ordersSelectedCount) {
    shopRefs.ordersSelectedCount.textContent = `已选择 ${selectedCount} 个订单`;
  }
  if (shopRefs.ordersDeleteSelected) {
    shopRefs.ordersDeleteSelected.disabled = selectedCount === 0;
  }
}

function setOrdersManageMode(isEnabled) {
  shopState.orderManageMode = Boolean(isEnabled && shopState.orders.length);
  if (!shopState.orderManageMode) {
    shopState.selectedOrderIds.clear();
  }
  renderOrders();
}

function toggleOrderSelection(orderId) {
  if (!shopState.orderManageMode || !orderId) return;

  if (shopState.selectedOrderIds.has(orderId)) {
    shopState.selectedOrderIds.delete(orderId);
  } else {
    shopState.selectedOrderIds.add(orderId);
  }
  renderOrders();
}

function openOrderDeleteConfirm() {
  if (!shopState.selectedOrderIds.size) return;
  shopRefs.orderDeleteConfirm.classList.add("is-open");
  shopRefs.orderDeleteConfirm.setAttribute("aria-hidden", "false");
}

function closeOrderDeleteConfirm() {
  shopRefs.orderDeleteConfirm.classList.remove("is-open");
  shopRefs.orderDeleteConfirm.setAttribute("aria-hidden", "true");
}

function deleteSelectedOrders() {
  if (!shopState.selectedOrderIds.size) return;

  shopState.orders = shopState.orders.filter((order) => !shopState.selectedOrderIds.has(order.orderId));
  shopState.selectedOrderIds.clear();
  shopState.orderManageMode = false;
  persistOrders();
  renderOrderCount();
  renderOrders();
  closeOrderDeleteConfirm();
  closeOrderDetail();
}

function getOrderStatusSteps(order = {}) {
  return [
    ["订单已提交", "已生成订单编号"],
    ["支付成功", formatPaymentTime(order.paidAt)],
    ["订单处理中", "Sony Alpha Store 正在准备商品"],
    ["等待配送", order.delivery || "配送方式待确认"],
  ];
}

function renderOrderDetail(order) {
  if (!shopRefs.orderDetailContent || !order) return;

  const items = (order.items || []).map((item) => `
    <li>
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(formatPrice(item.price))} x ${item.quantity || 1}</span>
      </div>
      <b>${formatPrice((item.price || 0) * (item.quantity || 1))}</b>
    </li>
  `).join("");

  const timeline = getOrderStatusSteps(order).map(([title, text], index) => `
    <li class="${index <= 2 ? "is-done" : ""}">
      <i></i>
      <div>
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(text)}</span>
      </div>
    </li>
  `).join("");

  shopRefs.orderDetailContent.innerHTML = `
    <div class="shop-order-detail-hero">
      <h2 id="shop-order-detail-title">${escapeHTML(order.orderId)}</h2>
      <strong>${formatPrice(order.total || 0)}</strong>
    </div>
    <div class="shop-order-detail-status">
      <span>订单状态</span>
      <strong>处理中</strong>
    </div>
    <section class="shop-order-detail-section">
      <h3>商品明细</h3>
      <ul class="shop-order-detail-items">${items}</ul>
    </section>
    <section class="shop-order-detail-grid" aria-label="订单信息">
      <div><span>收件人</span><strong>${escapeHTML(order.name || "未填写")}</strong></div>
      <div><span>联系电话</span><strong>${escapeHTML(order.phone || "未填写")}</strong></div>
      <div><span>配送地址</span><strong>${escapeHTML(order.address || "未填写")}</strong></div>
      <div><span>配送方式</span><strong>${escapeHTML(order.delivery || "未填写")}</strong></div>
      <div><span>支付方式</span><strong>${escapeHTML(order.payment || "未填写")}</strong></div>
      <div><span>支付时间</span><strong>${escapeHTML(formatPaymentTime(order.paidAt))}</strong></div>
    </section>
    <section class="shop-order-detail-section">
      <h3>费用明细</h3>
      <div class="shop-order-detail-money">
        <div><span>商品总价</span><strong>${formatPrice(order.productTotal || 0)}</strong></div>
        <div><span>配送费</span><strong>${formatPrice(order.deliveryFee || 0)}</strong></div>
        <div><span>实付金额</span><strong>${formatPrice(order.total || 0)}</strong></div>
      </div>
    </section>
    <section class="shop-order-detail-section">
      <h3>配送状态</h3>
      <ol class="shop-order-timeline">${timeline}</ol>
    </section>
  `;
}

function openOrderDetail(orderId) {
  if (!orderId || shopState.orderManageMode) return;
  const order = shopState.orders.find((item) => item.orderId === orderId);
  if (!order || !shopRefs.orderDetail) return;

  renderOrderDetail(order);
  shopRefs.orderDetail.classList.add("is-open");
  shopRefs.orderDetail.setAttribute("aria-hidden", "false");
}

function closeOrderDetail() {
  if (!shopRefs.orderDetail) return;
  shopRefs.orderDetail.classList.remove("is-open");
  shopRefs.orderDetail.setAttribute("aria-hidden", "true");
}

function renderOrders() {
  if (!shopRefs.ordersList) return;

  if (!shopState.orders.length) {
    shopState.orderManageMode = false;
    shopState.selectedOrderIds.clear();
    shopRefs.ordersList.innerHTML = '<p class="shop-orders-empty">暂无已完成订单。</p>';
    syncOrderManageUI();
    return;
  }

  shopRefs.ordersList.innerHTML = shopState.orders.map((order) => {
    const isSelected = shopState.selectedOrderIds.has(order.orderId);
    const items = order.items.map((item) => `
      <li>
        <span>${escapeHTML(item.title)} × ${item.quantity}</span>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
      </li>
    `).join("");

    return `
      <article class="shop-order-card${shopState.orderManageMode ? " is-manageable" : ""}${isSelected ? " is-selected" : ""}" data-order-id="${escapeHTML(order.orderId)}" tabindex="${shopState.orderManageMode ? "-1" : "0"}" role="button" aria-label="查看订单 ${escapeHTML(order.orderId)} 详情">
        ${shopState.orderManageMode ? `
          <button class="shop-order-select" type="button" data-order-select="${escapeHTML(order.orderId)}" aria-pressed="${isSelected ? "true" : "false"}" aria-label="选择订单 ${escapeHTML(order.orderId)}">
            <span></span>
          </button>
        ` : ""}
        <div class="shop-order-card-head">
          <div>
            <h3>${escapeHTML(order.orderId)}</h3>
          </div>
          <strong>${formatPrice(order.total)}</strong>
        </div>
        <ul class="shop-order-products">${items}</ul>
        <div class="shop-order-meta">
          <div><span>支付时间</span><strong>${escapeHTML(formatPaymentTime(order.paidAt))}</strong></div>
          <div><span>收件人</span><strong>${escapeHTML(order.name)}</strong></div>
          <div><span>联系电话</span><strong>${escapeHTML(order.phone)}</strong></div>
          <div><span>配送地址</span><strong>${escapeHTML(order.address)}</strong></div>
          <div><span>配送方式</span><strong>${escapeHTML(order.delivery)}</strong></div>
          <div><span>支付方式</span><strong>${escapeHTML(order.payment)}</strong></div>
        </div>
      </article>
    `;
  }).join("");

  syncOrderManageUI();
}

function renderSuccessDetails(summary = getCheckoutSummary()) {
  const itemRows = summary.items.map((item) => `
    <article class="shop-success-item">
      <div>
        <strong>${item.title}</strong>
        <span>数量 ${item.quantity} · 单价 ${formatPrice(item.price)}</span>
      </div>
      <em>${formatPrice(item.price * item.quantity)}</em>
    </article>
  `).join("");

  shopRefs.successDetails.innerHTML = `
    <div class="shop-success-row"><span>订单编号</span><strong>${summary.orderId}</strong></div>
    <div class="shop-success-row"><span>支付时间</span><strong>${formatPaymentTime(summary.paidAt)}</strong></div>
    <div class="shop-success-row"><span>收件人</span><strong>${summary.name}</strong></div>
    <div class="shop-success-row"><span>联系电话</span><strong>${summary.phone}</strong></div>
    <div class="shop-success-row"><span>邮箱</span><strong>${summary.email}</strong></div>
    <div class="shop-success-row"><span>配送地址</span><strong>${summary.address}</strong></div>
    <div class="shop-success-row"><span>配送方式</span><strong>${summary.delivery}</strong></div>
    <div class="shop-success-row"><span>支付方式</span><strong>${summary.payment}</strong></div>
    <section class="shop-success-products">
      <p>购买商品</p>
      ${itemRows}
    </section>
    <div class="shop-success-row"><span>商品总价</span><strong>${formatPrice(summary.productTotal)}</strong></div>
    <div class="shop-success-row"><span>配送费</span><strong>${formatPrice(summary.deliveryFee)}</strong></div>
    <div class="shop-success-row shop-success-total"><span>实付金额</span><strong>${formatPrice(summary.total)}</strong></div>
  `;
}

const shopProducts = shopSourceProducts.map((product, index) => {
  const title = getShopTitle(product);
  const description = normalizeSpaces(product.description || product.category);
  const filters = Array.isArray(product.filters)
    ? product.filters.map((value) => normalizeSpaces(value)).filter(Boolean)
    : [];
  const rawText = [
    product.type,
    product.category,
    product.model,
    product.title,
    product.description,
    product.sku8D,
    ...filters,
  ].join(" ");
  const searchText = normalizeShopSearch(rawText);
  const readableText = normalizeSpaces(rawText).toLowerCase();
  const searchAliases = createShopAliases(product, product.model, title, description, filters);

  return {
    ...product,
    index,
    title,
    description,
    filters,
    searchText,
    searchCompactText: compactShopSearch(rawText),
    searchAliases,
    series: getSeries(product, readableText),
    ideals: getIdeals(readableText),
    badge: getShopBadge(product, readableText),
    launchPrice: getOfficialLaunchPrice(product),
  };
});

function getFilteredProducts() {
  const queryInfo = getQueryInfo(shopState.query);
  const minimumScore = getMinimumScore(queryInfo);

  return sortProducts(
    shopProducts
      .map((product) => ({
        product,
        score: getProductScore(product, queryInfo),
      }))
      .filter(({ product, score }) => matchesShopFilters(product) && score >= minimumScore),
    queryInfo
  ).map(({ product }) => product);
}

function setActiveFilter(group, value) {
  document.querySelectorAll(`[data-filter-group="${group}"] [data-filter]`).forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === value);
  });
}

function syncSeriesFiltersForType() {
  const allowedSeries = seriesFiltersByType[shopState.type] || null;
  let selectedSeriesIsVisible = true;

  document.querySelectorAll('[data-filter-group="series"] [data-filter]').forEach((button) => {
    const isVisible = !allowedSeries || allowedSeries.has(button.dataset.filter);
    button.classList.toggle("hidden", !isVisible);
    button.disabled = !isVisible;
    button.setAttribute("aria-hidden", isVisible ? "false" : "true");

    if (!isVisible && button.dataset.filter === shopState.series) {
      selectedSeriesIsVisible = false;
    }
  });

  if (!selectedSeriesIsVisible) {
    shopState.series = "all";
  }

  setActiveFilter("series", shopState.series);
}

function createNode(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function findShopProductByModel(model) {
  return shopProducts.find((product) => product.model === model);
}

function getDetailScenes(product) {
  const tags = [
    product.badge,
    ...(product.ideals || []).map((ideal) => detailLabels[ideal]).filter(Boolean),
    ...(product.filters || []),
  ].filter((tag, index, list) => tag && list.indexOf(tag) === index);

  if (tags.length) return tags.slice(0, 6);
  return product.type === "lens"
    ? ["E 卡口", "镜头系统", "影像创作"]
    : ["照片创作", "视频创作", "索尼影像"];
}

function getDetailEyebrow(product) {
  if (product.type === "lens") return `SONY E-MOUNT | ${product.model}`;
  if (product.badge === "Cinema Line") return `SONY CINEMA LINE | ${product.model}`;
  return `SONY ALPHA | ${product.model}`;
}

function getDetailTypeLabel(product) {
  if (product.type === "lens") return "镜头";
  if (product.badge === "Cinema Line") return "专业电影摄影机";
  return "相机";
}

const officialNoiseTerms = [
  "回放",
  "删除",
  "保护",
  "打印",
  "柱状图",
  "白平衡",
  "闪光灯",
  "遥控",
  "网络",
  "接口",
  "电源",
  "随机附件",
  "操作系统",
  "播放",
];

const mojibakePattern = /(閿|缁|闂€|鈧|娑|鐎|閺|剕|箌)/;

function cleanOfficialText(value, maxLength = 180) {
  const text = normalizeSpaces(value)
    .replace(/鈩?/g, "")
    .replace(/庐/g, "")
    .replace(/\s*;\s*$/g, "")
    .trim();

  if (!text) return "";
  if (text.includes("锟") || mojibakePattern.test(text)) return "";
  if (/^(暂无|--|-)$/.test(text)) return "";
  if (officialNoiseTerms.some((term) => text === term)) return "";
  if (text.length <= maxLength) return text;
  return "";
}

function getProductDetailTitle(product) {
  const model = cleanOfficialText(product.model, 60);
  const title = cleanOfficialText(product.title || product.model, 120) || model || product.model;

  if (product.type === "lens") {
    const withoutModel = title
      .replace(new RegExp(`\\s*[（(]${model}[）)]\\s*`, "i"), " ")
      .replace(/\s+/g, " ")
      .trim();
    const lensNameMatch = withoutModel.match(
      /^(?:(?:Vario-Tessar|Sonnar|Planar|Distagon|Tessar)\s+T\*\s+)?(?:FE|E|DT)\s+(?:C\s+)?(?:PZ\s+)?\d+(?:-\d+)?mm\s*(?:F|T)[\d.]+(?:-[\d.]+)?(?:\s+(?:Macro|STF|PZ|OSS|GM|G|ZA|II|LE))*\b/i
    );

    return lensNameMatch ? lensNameMatch[0].replace(/\s+/g, " ").trim() : withoutModel;
  }

  if (model) {
    const markers = [`(${model})`, `（${model}）`];
    const marker = markers.find((item) => title.includes(item));
    if (marker) {
      return title.slice(0, title.indexOf(marker) + marker.length).trim();
    }
  }

  return title;
}

function createGeneratedCameraDetail(product, scenes) {
  const seriesLabel = product.badge || "索尼影像";
  const title = getProductDetailTitle(product);
  return {
    eyebrow: getDetailEyebrow(product),
    title,
    model: product.model,
    tagline: product.description || seriesLabel,
    summary: `${title} 属于 ${product.category || "索尼影像产品"}，面向${scenes.slice(0, 3).join("、")}等创作场景。`,
    specs: [
      ["产品类型", getDetailTypeLabel(product)],
      ["官方分类", product.category || "索尼影像产品"],
      ["型号", product.model],
      ["SKU", product.sku8D || "以官方页面为准"],
      ["定位", product.description || seriesLabel],
      ["官方页面", "可通过底部按钮打开索尼中国官方页面查看完整规格"],
    ],
    sections: [
      {
        title: "产品定位",
        kicker: seriesLabel.toUpperCase(),
        body: `${title} 围绕 ${product.description || seriesLabel} 展开，适合需要在画质、机动性和创作效率之间取得平衡的影像用户。`,
        bullets: [
          `官方分类：${product.category || "索尼影像产品"}`,
          `型号：${product.model}`,
          product.sku8D ? `官方 SKU：${product.sku8D}` : "完整销售信息以索尼中国官方页面为准",
        ],
      },
      {
        title: "影像创作",
        kicker: "PHOTO / VIDEO",
        body:
          "作为索尼影像系统的一部分，它可以与 E 卡口镜头、影像附件和创作软件配合，覆盖照片、视频以及混合创作流程。",
        bullets: [
          "适合按题材搭配不同焦段与附件",
          "可结合索尼官方页面继续查看完整画质、对焦、视频与操控规格",
          "适用于商城页内的相机、镜头和创作场景筛选",
        ],
      },
      {
        title: "官方信息入口",
        kicker: "SONY STYLE",
        body:
          "底部按钮会打开该产品在索尼中国官方页面中的信息，便于继续查看完整规格与销售说明。",
        bullets: [
          "官方页面用于查看完整规格、销售配置和说明",
          "进入商城按钮保留当前商品定位，便于继续浏览",
          "后续可以按每一件商品继续接入商城购买流程",
        ],
      },
    ],
    scenes,
    sourceUrl: product.productUrl,
    shopUrl: "shop.html",
  };
}

function createGeneratedLensDetail(product, scenes) {
  const lensTags = (product.filters || []).length ? product.filters.slice(0, 5).join("、") : product.badge;
  const title = getProductDetailTitle(product);
  return {
    eyebrow: getDetailEyebrow(product),
    title,
    model: product.model,
    tagline: product.description || product.badge,
    summary: `${title} 属于 ${product.category || "索尼 E 卡口镜头系统"}，适合${scenes.slice(0, 4).join("、")}等拍摄题材。`,
    specs: [
      ["产品类型", getDetailTypeLabel(product)],
      ["官方分类", product.category || "索尼 E 卡口镜头系统"],
      ["型号", product.model],
      ["镜头定位", product.badge || "E 卡口镜头"],
      ["适用标签", lensTags || "以官方页面为准"],
      ["官方页面", "可通过底部按钮打开索尼中国官方页面查看完整规格"],
    ],
    sections: [
      {
        title: "镜头定位",
        kicker: product.badge || "E-MOUNT",
        body: `${title} 是索尼 E 卡口系统中的一支${product.badge || "镜头"}，可根据题材搭配 Alpha 机身完成照片与视频创作。`,
        bullets: [
          `官方分类：${product.category || "索尼 E 卡口镜头系统"}`,
          `型号：${product.model}`,
          product.sku8D ? `官方 SKU：${product.sku8D}` : "完整销售信息以索尼中国官方页面为准",
        ],
      },
      {
        title: "适合题材",
        kicker: "SCENE",
        body:
          "根据官方产品标签和商城分类整理，这支镜头可服务于不同焦段、画幅和题材需求。具体光学结构、最近对焦距离、重量和尺寸请查看官方详情页。",
        bullets: scenes.slice(0, 5).map((scene) => `适合：${scene}`),
      },
      {
        title: "系统搭配",
        kicker: "ALPHA SYSTEM",
        body:
          "作为索尼 E 卡口镜头系统的一部分，它可以和 Alpha 相机、Cinema Line 机身及相关附件共同组成完整创作方案。",
        bullets: [
          "可按题材与机身定位选择搭配",
          "官方页面可查看完整规格与样张信息",
          "进入商城按钮会保留当前商品定位，便于继续浏览",
        ],
      },
    ],
    scenes,
    sourceUrl: product.productUrl,
    shopUrl: "shop.html",
  };
}

function createGeneratedProductDetail(product) {
  const scenes = getDetailScenes(product);
  return product.type === "lens"
    ? createGeneratedLensDetail(product, scenes)
    : createGeneratedCameraDetail(product, scenes);
}

function uniqueCleanList(items, maxLength = 180) {
  const seen = new Set();
  return items
    .map((item) => cleanOfficialText(item, maxLength))
    .filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
}

function collectOfficialPairs(detail) {
  const pairs = [];

  (detail.specs || []).forEach(([label, value]) => {
    const cleanLabel = cleanOfficialText(label, 42);
    const cleanValue = cleanOfficialText(value, 260);
    if (cleanLabel && cleanValue) pairs.push({ label: cleanLabel, value: cleanValue });
  });

  (detail.sections || []).forEach((section) => {
    (section.bullets || []).forEach((bullet) => {
      const rawBullet = normalizeSpaces(bullet).replace(/鈩?/g, "").replace(/庐/g, "");
      if (!rawBullet || rawBullet.includes("锟") || mojibakePattern.test(rawBullet)) return;

      const colonIndex = rawBullet.search(/[：:]/);
      if (colonIndex > 0) {
        const label = cleanOfficialText(rawBullet.slice(0, colonIndex), 42);
        const value = cleanOfficialText(rawBullet.slice(colonIndex + 1), 6000);
        if (label && value) {
          pairs.push({ label, value });
          return;
        }
      }

      const cleanBullet = cleanOfficialText(rawBullet, 260);
      if (cleanBullet) pairs.push({ label: normalizeSpaces(section.title || "官方信息"), value: cleanBullet });
    });
  });

  return pairs;
}

function findOfficialValue(pairs, labels, options = {}) {
  const { includes = [], excludes = [], maxLength = 180 } = options;
  const labelList = Array.isArray(labels) ? labels : [labels];
  const includeList = Array.isArray(includes) ? includes : [includes];
  const excludeList = Array.isArray(excludes) ? excludes : [excludes];

  const match = pairs.find(({ label, value }) => {
    const text = `${label} ${value}`;
    return labelList.some((item) => label.includes(item))
      && includeList.every((item) => !item || text.includes(item))
      && excludeList.every((item) => !item || !text.includes(item));
  });

  return match ? cleanOfficialText(match.value, maxLength) : "";
}

function findOfficialByText(pairs, terms, options = {}) {
  const { excludes = [], maxLength = 180 } = options;
  const termList = Array.isArray(terms) ? terms : [terms];
  const excludeList = Array.isArray(excludes) ? excludes : [excludes];
  const match = pairs.find(({ label, value }) => {
    const text = `${label} ${value}`;
    return termList.every((term) => text.includes(term))
      && excludeList.every((item) => !item || !text.includes(item));
  });

  return match ? cleanOfficialText(`${match.label}：${match.value}`, maxLength) : "";
}

function findBestOfficialByText(pairs, terms, options = {}) {
  const { prefer = [], excludes = [], maxLength = 180 } = options;
  const termList = Array.isArray(terms) ? terms : [terms];
  const preferList = Array.isArray(prefer) ? prefer : [prefer];
  const excludeList = Array.isArray(excludes) ? excludes : [excludes];
  const matches = pairs.filter(({ label, value }) => {
    const text = `${label} ${value}`;
    return termList.every((term) => text.includes(term))
      && excludeList.every((item) => !item || !text.includes(item));
  });

  const preferred = matches.find(({ label, value }) => {
    const text = `${label} ${value}`;
    return preferList.some((item) => item && text.includes(item));
  });

  const match = preferred || matches[0];
  return match ? cleanOfficialText(`${match.label}：${match.value}`, maxLength) : "";
}

function compactOfficialLine(label, value) {
  const cleanLabel = cleanOfficialText(label, 42);
  const cleanValue = cleanOfficialText(value, 180);
  return cleanLabel && cleanValue ? `${cleanLabel}：${cleanValue}` : "";
}

function joinOfficialValues(values, fallback = "") {
  return uniqueCleanList(values, 170).join("、") || fallback;
}

function summarizeOfficialVideo(pairs) {
  const videoText = pairs
    .filter(({ label, value }) => {
      const text = `${label} ${value}`;
      return /(文件格式|录制格式|录制帧率|影像尺寸|慢动作|动态范围|伽马|视频|动态影像)/.test(text)
        && !/(静态影像|照片效果|随机附件|音频输入|电池续航)/.test(text);
    })
    .map(({ label, value }) => `${label} ${value}`)
    .join(" ");

  const formats = [];
  if (/XAVC HS/i.test(videoText)) formats.push("XAVC HS");
  if (/XAVC S-I/i.test(videoText)) formats.push("XAVC S-I");
  if (/XAVC S/i.test(videoText)) formats.push("XAVC S");

  const quality = [];
  if (/4K|3840\s*x\s*2160/i.test(videoText)) quality.push("4K 视频");
  if (/10bit|10-bit/i.test(videoText)) quality.push("10-bit");
  if (/4:2:2/.test(videoText)) quality.push("4:2:2");
  if (/120p|119\.88p|100p/.test(videoText)) {
    quality.push("最高约 120p");
  } else if (/60p|59\.94p|50p/.test(videoText)) {
    quality.push("最高约 60p");
  }
  if (/S-Cinetone/i.test(videoText)) quality.push("S-Cinetone");
  if (/S-Log3/i.test(videoText)) quality.push("S-Log3");

  if (!formats.length && !quality.length) return "";
  return `${quality.join(" / ") || "视频记录"}${formats.length ? `，支持 ${formats.join(" / ")} 格式` : ""}`;
}

function createCuratedOfficialCameraDetail(product, detail, pairs) {
  const scenes = getDetailScenes(product);
  const title = getProductDetailTitle(product);
  const tagline = cleanOfficialText(detail.tagline, 70) || product.description || product.badge;
  const sensorType = findOfficialValue(pairs, ["传感器类型"], { maxLength: 90 });
  const sensorSize = findOfficialValue(pairs, ["传感器尺寸"], { maxLength: 90 });
  const pixels = findOfficialValue(pairs, ["有效像素", "有效像素数"], { maxLength: 90 });
  const processor = findOfficialValue(pairs, ["AI智能芯片", "影像处理器"], { maxLength: 110 });
  const focusPoints = findOfficialValue(pairs, ["对焦点"], { maxLength: 150 });
  const recognition = findOfficialValue(pairs, ["识别主体类型"], { maxLength: 140 });
  const video = summarizeOfficialVideo(pairs);
  const stabilizer = findBestOfficialByText(pairs, ["防抖"], {
    prefer: ["5轴", "五轴", "增强", "级"],
    maxLength: 130,
  });
  const weight = findOfficialValue(pairs, ["重量"], { maxLength: 120 });
  const screen = findOfficialValue(pairs, ["液晶屏类型"], { maxLength: 90 });
  const shutter = findOfficialValue(pairs, ["连拍速度"], { maxLength: 130 });
  const iso = findOfficialValue(pairs, ["ISO 感光度设定", "ISO感光度设定"], { maxLength: 150 });
  const pixelShift = findOfficialByText(pairs, ["像素转换多重拍摄"], { maxLength: 120 });

  const specs = [
    ["影像核心", joinOfficialValues([pixels, sensorType || sensorSize], product.description || tagline)],
    ["处理系统", processor || "以索尼中国官方规格为准"],
    ["智能对焦", joinOfficialValues([focusPoints, recognition], "官方自动对焦系统")],
    ["视频能力", video || "支持照片与视频混合创作"],
    ["稳定表现", stabilizer || "机身与镜头系统协同提供稳定拍摄体验"],
    ["机身设计", joinOfficialValues([weight, screen], product.badge || product.category)],
  ];

  const sections = [
    {
      title: "影像核心",
      kicker: "IMAGE CORE",
      body: `${title} 的核心信息来自索尼中国官方规格，页面仅保留对画质判断最有价值的传感器、像素与记录信息。`,
      bullets: uniqueCleanList([
        compactOfficialLine("有效像素", pixels),
        compactOfficialLine("传感器类型", sensorType),
        compactOfficialLine("传感器尺寸", sensorSize),
        compactOfficialLine("感光度", iso),
      ]).slice(0, 4),
    },
    {
      title: "对焦与识别",
      kicker: "AUTOFOCUS",
      body: "这一部分只保留自动对焦系统中最影响拍摄体验的信息，去掉菜单级别的细项。",
      bullets: uniqueCleanList([
        compactOfficialLine("对焦点", focusPoints),
        compactOfficialLine("识别主体", recognition),
        findOfficialByText(pairs, ["实时眼部对焦"], { maxLength: 90 }),
      ]).slice(0, 4),
    },
    {
      title: "视频与稳定",
      kicker: "VIDEO / STABILIZATION",
      body: "视频部分不展示冗长编码表，只概括官方规格中可读性更强的格式、色彩与稳定能力。",
      bullets: uniqueCleanList([
        compactOfficialLine("视频记录", video),
        compactOfficialLine("防抖", stabilizer),
        pixelShift,
      ]).slice(0, 4),
    },
    {
      title: "机身与使用",
      kicker: "BODY / CONTROL",
      body: "机身部分优先展示重量、屏幕和连拍等实际使用时更容易感知的参数。",
      bullets: uniqueCleanList([
        compactOfficialLine("重量", weight),
        compactOfficialLine("液晶屏", screen),
        compactOfficialLine("连拍", shutter),
      ]).slice(0, 4),
    },
  ].map((section) => ({
    ...section,
    bullets: section.bullets.length ? section.bullets : ["完整参数可通过底部按钮打开索尼中国官方详情页查看"],
  }));

  return {
    eyebrow: cleanOfficialText(detail.eyebrow, 80) || getDetailEyebrow(product),
    title,
    model: cleanOfficialText(detail.model, 50) || product.model,
    tagline,
    summary: `${tagline}。已按官网规格重新整理，只保留核心画质、对焦、视频、稳定和机身信息。`,
    specs,
    sections,
    scenes: scenes.slice(0, 4),
    sourceUrl: detail.sourceUrl || product.productUrl,
    shopUrl: detail.shopUrl || "shop.html",
  };
}

function createCuratedOfficialLensDetail(product, detail, pairs) {
  const scenes = getDetailScenes(product);
  const title = getProductDetailTitle(product);
  const name = findOfficialValue(pairs, ["名称", "产品名称"], { maxLength: 120 }) || title;
  const lensType = findOfficialValue(pairs, ["镜头类型", "类别"], { maxLength: 90 });
  const mount = findOfficialValue(pairs, ["镜头卡口"], { maxLength: 60 });
  const frame = findOfficialValue(pairs, ["画幅"], { maxLength: 60 });
  const focal = findOfficialValue(pairs, ["焦距 (mm)", "焦距"], { excludes: ["APS-C"], maxLength: 70 });
  const apscFocal = findOfficialValue(pairs, ["APS-C画幅下的35mm规格换算焦距"], { maxLength: 80 });
  const maxAperture = findOfficialValue(pairs, ["最大光圈"], { maxLength: 60 });
  const minAperture = findOfficialValue(pairs, ["最小光圈"], { maxLength: 60 });
  const blades = findOfficialValue(pairs, ["光圈叶片"], { maxLength: 60 });
  const structure = findOfficialValue(pairs, ["镜头结构"], { maxLength: 80 });
  const minFocus = findOfficialValue(pairs, ["最近对焦距离"], { maxLength: 80 });
  const magnification = findOfficialValue(pairs, ["最大放大倍率"], { maxLength: 80 });
  const filter = findOfficialValue(pairs, ["滤光镜直径"], { maxLength: 60 });
  const size = findOfficialValue(pairs, ["尺寸"], { maxLength: 95 });
  const weight = findOfficialValue(pairs, ["重量"], { maxLength: 90 });
  const stabilizer = findOfficialValue(pairs, ["OSS", "防抖"], { maxLength: 80 });

  const specs = [
    ["镜头定位", lensType || product.badge || "索尼 E 卡口镜头"],
    ["焦距", joinOfficialValues([focal ? `${focal}mm` : "", apscFocal ? `APS-C 等效 ${apscFocal}mm` : ""], product.description || title)],
    ["光圈", joinOfficialValues([maxAperture ? `最大 F${maxAperture}` : "", minAperture ? `最小 F${minAperture}` : "", blades ? `${blades}片光圈叶片` : ""], "以官方规格为准")],
    ["光学结构", structure || "以索尼中国官方规格为准"],
    ["近摄能力", joinOfficialValues([minFocus, magnification ? `最大放大倍率 ${magnification}x` : ""], "以官方规格为准")],
    ["体积重量", joinOfficialValues([weight, size, filter ? `滤镜 ${filter}mm` : ""], "以官方规格为准")],
  ];

  const sections = [
    {
      title: "焦段与画幅",
      kicker: "FOCAL RANGE",
      body: "先呈现最影响镜头选择的画幅、焦距和卡口信息，便于判断它适合搭配哪类 Alpha 机身。",
      bullets: uniqueCleanList([
        compactOfficialLine("名称", name),
        compactOfficialLine("卡口", mount),
        compactOfficialLine("画幅", frame),
        compactOfficialLine("焦距", focal ? `${focal}mm` : ""),
        compactOfficialLine("APS-C 等效", apscFocal ? `${apscFocal}mm` : ""),
      ]).slice(0, 5),
    },
    {
      title: "光学与光圈",
      kicker: "OPTICS",
      body: "光学部分保留结构和光圈等关键信息，去掉附件清单和过细的说明项。",
      bullets: uniqueCleanList([
        compactOfficialLine("镜头结构", structure),
        compactOfficialLine("最大光圈", maxAperture ? `F${maxAperture}` : ""),
        compactOfficialLine("最小光圈", minAperture ? `F${minAperture}` : ""),
        compactOfficialLine("光圈叶片", blades),
      ]).slice(0, 4),
    },
    {
      title: "近摄与操控",
      kicker: "FOCUS / CONTROL",
      body: "这一部分更关注实际拍摄手感，包括最近对焦、放大倍率和防抖等信息。",
      bullets: uniqueCleanList([
        compactOfficialLine("最近对焦距离", minFocus),
        compactOfficialLine("最大放大倍率", magnification),
        compactOfficialLine("防抖", stabilizer),
      ]).slice(0, 4),
    },
    {
      title: "携带与搭配",
      kicker: "BUILD",
      body: "体积重量和滤镜尺寸决定了镜头的携带压力与配件搭配方式，因此优先保留。",
      bullets: uniqueCleanList([
        compactOfficialLine("重量", weight),
        compactOfficialLine("尺寸", size),
        compactOfficialLine("滤光镜直径", filter ? `${filter}mm` : ""),
      ]).slice(0, 4),
    },
  ].map((section) => ({
    ...section,
    bullets: section.bullets.length ? section.bullets : ["完整参数可通过底部按钮打开索尼中国官方详情页查看"],
  }));

  return {
    eyebrow: cleanOfficialText(detail.eyebrow, 80) || getDetailEyebrow(product),
    title,
    model: cleanOfficialText(detail.model, 50) || product.model,
    tagline: cleanOfficialText(detail.tagline, 90) || product.description || product.badge,
    summary: `${cleanOfficialText(detail.tagline, 90) || product.description || name}。已按官网规格重新整理，只保留焦段、光圈、光学结构、近摄和携带信息。`,
    specs,
    sections,
    scenes: scenes.slice(0, 4),
    sourceUrl: detail.sourceUrl || product.productUrl,
    shopUrl: detail.shopUrl || "shop.html",
  };
}

function createCuratedOfficialDetail(product, detail) {
  const pairs = collectOfficialPairs(detail);
  return product.type === "lens"
    ? createCuratedOfficialLensDetail(product, detail, pairs)
    : createCuratedOfficialCameraDetail(product, detail, pairs);
}

function getProductDetail(productOrModel) {
  const product = typeof productOrModel === "string"
    ? findShopProductByModel(productOrModel)
    : productOrModel;

  if (!product) return null;

  const customDetail = customProductDetails[product.title] || customProductDetails[product.model];
  if (customDetail) {
    return {
      ...customDetail,
      sourceUrl: customDetail.sourceUrl || product.productUrl,
      shopUrl: customDetail.shopUrl || "shop.html",
    };
  }

  const officialDetail = officialProductDetails[product.sku8D];
  if (officialDetail) {
    return createCuratedOfficialDetail(product, officialDetail);
  }

  return createGeneratedProductDetail(product);
}

function closeProductDetail() {
  if (!activeDetailOverlay) return;

  const overlay = activeDetailOverlay;
  overlay.classList.remove("is-open");
  document.body.classList.remove("product-detail-open");

  window.setTimeout(() => {
    overlay.remove();
    if (activeDetailOverlay === overlay) {
      activeDetailOverlay = null;
    }
  }, 560);

  if (lastDetailTrigger && typeof lastDetailTrigger.focus === "function") {
    lastDetailTrigger.focus({ preventScroll: true });
  }
}

function createDetailStat(label, value) {
  const item = createNode("div", "product-detail-stat");
  const labelNode = createNode("span", "", label);
  const valueNode = createNode("strong", "", value);
  item.append(labelNode, valueNode);
  return item;
}

function createDetailSection(section) {
  const block = createNode("section", "product-detail-section");
  const title = createNode("h3", "", section.title);
  const body = createNode("p", "product-detail-section-body", section.body);
  const list = createNode("ul", "product-detail-section-list");

  section.bullets.forEach((item) => {
    list.appendChild(createNode("li", "", item));
  });

  block.append(title, body, list);
  return block;
}

function getShopUrl(product, detail) {
  const baseUrl = detail.shopUrl || "shop.html";
  const separator = baseUrl.includes("?") ? "&" : "?";
  const params = new URLSearchParams();

  if (product.sku8D) params.set("sku", product.sku8D);
  if (product.model) params.set("model", product.model);

  return `${baseUrl}${separator}${params.toString()}`;
}

function openProductDetail(model, trigger) {
  const detail = getProductDetail(model);
  const product = findShopProductByModel(model);
  if (!detail || !product) return;

  recordProductFootprint(product, "shop");
  closeProductDetail();
  lastDetailTrigger = trigger || document.activeElement;

  const overlay = createNode("section", "product-detail-overlay");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "product-detail-title");
  overlay.dataset.detailOverlay = "true";

  const sheet = createNode("div", "product-detail-sheet");
  const closeButton = createNode("button", "product-detail-close", "关闭");
  closeButton.type = "button";
  closeButton.dataset.detailClose = "true";
  closeButton.setAttribute("aria-label", "关闭产品详情");

  const media = createNode("div", "product-detail-media");
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = detail.title;
  image.decoding = "async";
  media.appendChild(image);

  const content = createNode("div", "product-detail-content");
  const title = createNode("h2", "", detail.title);
  title.id = "product-detail-title";
  const tagline = createNode("p", "product-detail-tagline", detail.tagline);
  const summary = createNode("p", "product-detail-summary", detail.summary);

  const stats = createNode("div", "product-detail-stats");
  detail.specs.forEach(([label, value]) => stats.appendChild(createDetailStat(label, value)));

  const sections = createNode("div", "product-detail-sections");
  detail.sections.forEach((section) => sections.appendChild(createDetailSection(section)));

  const sceneRow = createNode("div", "product-detail-scenes");
  (detail.scenes || []).forEach((scene) => sceneRow.appendChild(createNode("span", "", scene)));

  const actionRow = createNode("div", "product-detail-actions");
  const sourceLink = createNode("a", "product-detail-link", "打开索尼中国官方详情页");
  sourceLink.href = detail.sourceUrl;
  sourceLink.target = "_blank";
  sourceLink.rel = "noreferrer";

  const addToCartButton = createNode("button", "product-detail-link", "加入购物车");
  addToCartButton.type = "button";
  addToCartButton.addEventListener("click", () => {
    addToCart(product);
    closeProductDetail();
  });

  actionRow.append(sourceLink, addToCartButton);

  content.append(title, tagline, summary, stats, sections);
  if (sceneRow.children.length) {
    content.appendChild(sceneRow);
  }
  content.appendChild(actionRow);
  sheet.append(closeButton, media, content);
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
  activeDetailOverlay = overlay;
  document.body.classList.add("product-detail-open");

  window.requestAnimationFrame(() => {
    overlay.classList.add("is-open");
    closeButton.focus({ preventScroll: true });
  });
}

function bindProductDetailEvents() {
  document.addEventListener("click", (event) => {
    if (!activeDetailOverlay) return;
    if (event.target.closest("[data-detail-close]") || event.target === activeDetailOverlay) {
      closeProductDetail();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeDetailOverlay) {
      closeProductDetail();
    }
  });
}

function createShopCard(product) {
  const card = document.createElement("article");
  card.className = "shop-card";
  card.dataset.productModel = product.model;

  if (getProductDetail(product)) {
    card.classList.add("has-detail");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `查看${product.title}产品详情`);
  }

  const visual = document.createElement("div");
  visual.className = "shop-card-media";

  if (product.image) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";
    image.decoding = "async";
    visual.appendChild(image);
  }

  const body = document.createElement("div");
  body.className = "shop-card-body";

  const meta = document.createElement("div");
  meta.className = "shop-card-meta";
  meta.innerHTML = `<span>${product.badge}</span><span>${product.type === "camera" ? "相机" : "镜头"}</span>`;

  const title = document.createElement("h2");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.textContent = product.description || product.category;

  const price = document.createElement("div");
  price.className = product.launchPrice ? "shop-card-price" : "shop-card-price is-missing";
  price.innerHTML = renderShopCardPrice(product);

  const actions = document.createElement("div");
  actions.className = "shop-card-actions";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "加入购物车";
  addButton.addEventListener("click", () => addToCart(product));

  const detailButton = document.createElement("button");
  detailButton.type = "button";
  detailButton.className = "shop-card-secondary-action";
  detailButton.textContent = "产品详情";
  detailButton.addEventListener("click", () => openProductDetail(product.model, card));

  actions.append(addButton, detailButton);
  body.append(meta, title, description, price, actions);
  card.append(visual, body);

  if (getProductDetail(product)) {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".shop-card-actions")) return;
      openProductDetail(product.model, card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openProductDetail(product.model, card);
    });
  }

  return card;
}

function renderShop() {
  const products = getFilteredProducts();
  shopRefs.grid.innerHTML = "";
  products.forEach((product) => shopRefs.grid.appendChild(createShopCard(product)));

  if (shopRefs.count) {
    shopRefs.count.textContent = `${products.length} 件商品`;
  }
  shopRefs.note.textContent = products.length
    ? `已筛选出 ${products.length} 件商品`
    : "没有找到匹配商品";
  shopRefs.empty.classList.toggle("hidden", products.length > 0);
}

function addToCart(product) {
  const existing = shopState.cart.find((item) => item.sku8D === product.sku8D);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    shopState.cart.push({ ...product, quantity: 1 });
  }
  renderCart();
  openCart();
}

function changeCartQuantity(sku8D, delta) {
  const item = shopState.cart.find((product) => product.sku8D === sku8D);
  if (!item) return;
  item.quantity = Math.max(1, (item.quantity || 1) + delta);
  renderCart();
}

function removeFromCart(sku8D) {
  shopState.cart = shopState.cart.filter((item) => item.sku8D !== sku8D);
  if (shopState.pendingRemovalSku === sku8D) {
    shopState.pendingRemovalSku = null;
  }
  renderCart();
  renderRemoveConfirm();
}

function requestRemoveFromCart(sku8D) {
  shopState.pendingRemovalSku = sku8D;
  renderRemoveConfirm();
}

function cancelRemoveFromCart() {
  shopState.pendingRemovalSku = null;
  renderRemoveConfirm();
}

function renderRemoveConfirm() {
  const product = shopState.cart.find((item) => item.sku8D === shopState.pendingRemovalSku);
  const isOpen = Boolean(product);

  shopRefs.removeConfirm.classList.toggle("is-open", isOpen);
  shopRefs.removeConfirm.setAttribute("aria-hidden", isOpen ? "false" : "true");
  shopRefs.removeConfirmName.textContent = product
    ? `${product.title} 将从购物车中移除。`
    : "该商品将从购物车中移除。";
  shopRefs.removeConfirmAccept.disabled = !isOpen;
}

function openClearCartConfirm() {
  if (!shopState.cart.length) return;
  shopRefs.clearConfirm.classList.add("is-open");
  shopRefs.clearConfirm.setAttribute("aria-hidden", "false");
}

function closeClearCartConfirm() {
  shopRefs.clearConfirm.classList.remove("is-open");
  shopRefs.clearConfirm.setAttribute("aria-hidden", "true");
}

function clearCart() {
  shopState.cart = [];
  shopState.pendingRemovalSku = null;
  renderCart();
  renderRemoveConfirm();
  closeClearCartConfirm();
}

function renderCart() {
  const cartQuantity = shopState.cart.reduce((sum, product) => sum + (product.quantity || 1), 0);
  shopRefs.cartCount.textContent = cartQuantity;
  shopRefs.floatingCartCount.textContent = cartQuantity;
  const hasMissingPrice = shopState.cart.some((product) => !product.launchPrice);
  const subtotal = shopState.cart.reduce((sum, product) => {
    return sum + (product.launchPrice ? product.launchPrice.price * (product.quantity || 1) : 0);
  }, 0);
  updateCheckoutTotals(subtotal, hasMissingPrice);
  shopRefs.checkout.disabled = shopState.cart.length === 0 || hasMissingPrice;
  shopRefs.cartItems.innerHTML = "";

  if (!shopState.cart.length) {
    const empty = document.createElement("p");
    empty.className = "shop-cart-empty";
    empty.textContent = "还没有加入商品。";
    shopRefs.cartItems.appendChild(empty);
    return;
  }

  shopState.cart.forEach((product) => {
    const quantity = product.quantity || 1;
    const item = document.createElement("div");
    item.className = "shop-cart-item";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;

    const copy = document.createElement("div");
    copy.className = "shop-cart-copy";
    const title = document.createElement("strong");
    title.textContent = product.title;
    const meta = document.createElement("span");
    meta.className = "shop-cart-price";
    meta.textContent = product.launchPrice
      ? formatPrice(product.launchPrice.price)
      : "官方发售价待补";
    const controls = document.createElement("div");
    controls.className = "shop-cart-quantity";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "shop-cart-quantity-button";
    minus.textContent = "-";
    minus.disabled = quantity <= 1;
    minus.setAttribute("aria-label", `减少 ${product.title} 数量`);
    minus.addEventListener("click", () => changeCartQuantity(product.sku8D, -1));

    const amount = document.createElement("span");
    amount.className = "shop-cart-quantity-value";
    amount.textContent = quantity;
    amount.setAttribute("aria-label", `当前数量 ${quantity}`);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "shop-cart-quantity-button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `增加 ${product.title} 数量`);
    plus.addEventListener("click", () => changeCartQuantity(product.sku8D, 1));

    controls.append(minus, amount, plus);
    copy.append(title, meta, controls);

    const actions = document.createElement("div");
    actions.className = "shop-cart-actions";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "shop-cart-remove";
    remove.textContent = "移除";
    remove.addEventListener("click", () => requestRemoveFromCart(product.sku8D));
    actions.appendChild(remove);

    item.append(image, copy, actions);
    shopRefs.cartItems.appendChild(item);
  });
}

function openCart() {
  closeOrders();
  shopRefs.cart.classList.add("is-open");
  shopRefs.cart.setAttribute("aria-hidden", "false");
}

function closeCart() {
  shopRefs.cart.classList.remove("is-open");
  shopRefs.cart.setAttribute("aria-hidden", "true");
}

function formatCheckoutTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function stopCheckoutTimer() {
  window.clearInterval(checkoutTimerId);
  checkoutTimerId = null;
}

function showCheckoutExpiredNotice() {
  openPaymentModal(shopRefs.checkoutExpired);
}

function handleCheckoutExpired() {
  stopCheckoutTimer();
  clearPaymentSimulationTimer();
  const order = getActiveCheckoutOrder();
  if (order && getOrderStatus(order) === "unpaid") {
    updateOrderInState({
      ...order,
      status: "closed",
      closedAt: new Date().toISOString(),
    });
  }
  closePaymentModal(shopRefs.addressMapModal);
  closePaymentModal(shopRefs.qrModal);
  closePaymentModal(shopRefs.paymentLoading);
  closeCheckout();
  activeCheckoutOrderId = null;
  showCheckoutExpiredNotice();
}

function updateCheckoutTimer() {
  const order = getActiveCheckoutOrder();
  if (!order || getOrderStatus(order) !== "unpaid") {
    stopCheckoutTimer();
    return;
  }

  checkoutRemainingSeconds = Math.max(0, Math.ceil((new Date(order.expiresAt).getTime() - Date.now()) / 1000));

  if (shopRefs.checkoutTimer) {
    shopRefs.checkoutTimer.textContent = formatCheckoutTime(checkoutRemainingSeconds);
  }

  if (checkoutRemainingSeconds <= 0) {
    handleCheckoutExpired();
    return;
  }

}

function startCheckoutTimer() {
  stopCheckoutTimer();
  clearPaymentSimulationTimer();
  shopRefs.payButton.disabled = false;
  updateCheckoutTimer();
  checkoutTimerId = window.setInterval(updateCheckoutTimer, 1000);
}

function setCheckoutFormFromOrder(order = {}) {
  const setValue = (id, value) => {
    const field = document.getElementById(id);
    if (field) field.value = value && value !== "未填写" ? value : "";
  };

  const plainPhone = String(order.phone || "").replace(/^\+86\s*/, "");
  setValue("checkout-last-name", order.lastName);
  setValue("checkout-first-name", order.firstName || order.name);
  setValue("checkout-phone", plainPhone);
  setValue("checkout-email", order.email);
  setValue("checkout-province", order.province);
  document.getElementById("checkout-province")?.dispatchEvent(new Event("change"));
  setValue("checkout-city", order.city);
  document.getElementById("checkout-city")?.dispatchEvent(new Event("change"));
  setValue("checkout-district", order.district);
  setValue("checkout-address-detail", order.addressDetail);
  if (shopRefs.payment && order.payment) shopRefs.payment.value = order.payment;
  if (shopRefs.delivery && order.delivery) shopRefs.delivery.value = order.delivery;
  shopRefs.payment?.dispatchEvent(new Event("change"));
}

function openCheckoutForOrder(order) {
  if (!order || getOrderStatus(order) !== "unpaid") return;
  activeCheckoutOrderId = order.orderId;
  closePaymentModal(shopRefs.checkoutExpired);
  setCheckoutFormFromOrder(order);
  updateCheckoutTotals(Number(order.productTotal || 0), false);
  startCheckoutTimer();
  shopRefs.checkoutPanel.classList.add("is-open");
  shopRefs.checkoutPanel.setAttribute("aria-hidden", "false");
}

function openCheckout() {
  const activeOrder = getActiveCheckoutOrder();
  if (activeOrder && getOrderStatus(activeOrder) === "unpaid") {
    openCheckoutForOrder(activeOrder);
    return;
  }

  if (!shopState.cart.length) return;
  clearOrderCreationTimer();
  closeCart();
  openPaymentModal(shopRefs.orderCreating);
  orderCreationTimerId = window.setTimeout(() => {
    const order = createPendingCheckoutOrder();
    closePaymentModal(shopRefs.orderCreating);
    openCheckoutForOrder(order);
  }, 1100);
}

function closeCheckout() {
  syncActiveCheckoutOrderFromForm();
  clearPaymentSimulationTimer();
  shopRefs.checkoutPanel.classList.remove("is-open");
  shopRefs.checkoutPanel.setAttribute("aria-hidden", "true");
  closePaymentModal(shopRefs.addressMapModal);
  closePaymentModal(shopRefs.qrModal);
  closePaymentModal(shopRefs.paymentLoading);
  shopRefs.checkoutHint.textContent = "这是演示结算界面，不会产生真实订单或付款。";
}

function getCheckoutField(id) {
  return document.getElementById(id);
}

function setCheckoutError(message) {
  if (!shopRefs.checkoutError) return;
  shopRefs.checkoutError.textContent = message;
  shopRefs.checkoutError.classList.toggle("hidden", !message);
}

function clearCheckoutValidation() {
  setCheckoutError("");
  document.querySelectorAll(".shop-checkout-dialog .is-invalid").forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  });
}

function markCheckoutField(field) {
  field?.classList.add("is-invalid");
  field?.setAttribute("aria-invalid", "true");
}

function clearCheckoutFieldError(field) {
  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");
}

function validateCheckoutForm() {
  clearCheckoutValidation();

  const requiredFields = [
    ["checkout-last-name", "请填写姓"],
    ["checkout-first-name", "请填写名"],
    ["checkout-phone", "请填写联系电话"],
    ["checkout-email", "请填写邮箱"],
    ["checkout-province", "请选择省 / 直辖市"],
    ["checkout-city", "请选择城市"],
    ["checkout-district", "请选择区 / 县"],
    ["checkout-address-detail", "请填写详细地址"],
  ];

  if (checkoutCardPaymentTypes.has(shopRefs.payment.value)) {
    requiredFields.push(["checkout-card-number", "请填写卡号"]);
    requiredFields.push(["checkout-card-cvv", "请填写 CVV"]);
  }

  const missing = requiredFields
    .map(([id, message]) => ({ field: getCheckoutField(id), message }))
    .filter((item) => !normalizeSpaces(item.field?.value));

  missing.forEach((item) => markCheckoutField(item.field));

  if (missing.length) {
    setCheckoutError(missing[0].message);
    missing[0].field?.focus();
    return false;
  }

  return true;
}

function showQrPayment() {
  const payment = shopRefs.payment.value;
  shopRefs.qrLogo.src = checkoutPaymentLogos[payment] || checkoutPaymentLogos["WeChat Pay"];
  shopRefs.qrLogo.alt = payment;
  shopRefs.qrName.textContent = payment;
  openPaymentModal(shopRefs.qrModal);
}

function showPaymentSuccess() {
  clearPaymentSimulationTimer();
  const summary = getCheckoutSummary();
  updateOrderInState(summary);
  stopCheckoutTimer();
  activeCheckoutOrderId = null;
  shopState.cart = [];
  shopState.pendingRemovalSku = null;
  renderCart();
  renderSuccessDetails(summary);
  closePaymentModal(shopRefs.paymentLoading);
  closePaymentModal(shopRefs.qrModal);
  openPaymentModal(shopRefs.paymentSuccess);
}

function runCardPaymentSimulation() {
  clearPaymentSimulationTimer();
  openPaymentModal(shopRefs.paymentLoading);
  paymentSimulationTimerId = window.setTimeout(showPaymentSuccess, 3000);
}

function runQrPaymentSimulation() {
  clearPaymentSimulationTimer();
  closePaymentModal(shopRefs.qrModal);
  openPaymentModal(shopRefs.paymentLoading);
  paymentSimulationTimerId = window.setTimeout(showPaymentSuccess, 3000);
}

function handleCheckoutPayment() {
  if (checkoutRemainingSeconds <= 0) return;
  if (!validateCheckoutForm()) return;
  syncActiveCheckoutOrderFromForm();

  if (checkoutCardPaymentTypes.has(shopRefs.payment.value)) {
    runCardPaymentSimulation();
    return;
  }

  showQrPayment();
}

function syncProductFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const payOrderId = params.get("payOrder");
  if (payOrderId) {
    window.setTimeout(() => {
      const order = shopState.orders.find((item) => item.orderId === payOrderId);
      if (order && getOrderStatus(order) === "unpaid") {
        openCheckoutForOrder(order);
      }
    }, 250);
    return;
  }

  const sku = params.get("sku");
  const model = params.get("model");
  const product = shopProducts.find((item) => item.sku8D === sku || item.model === model);
  if (!product) return;

  shopState.type = product.type === "lens" ? "lens" : "camera";
  shopState.series = "all";
  shopState.query = product.title;
  shopRefs.search.value = product.title;
  setActiveFilter("type", shopState.type);
  setActiveFilter("series", shopState.series);
}

function hideSuggestions() {
  suggestionState.items = [];
  suggestionState.activeIndex = -1;
  shopRefs.suggestions.classList.add("hidden");
  shopRefs.suggestions.innerHTML = "";
  shopRefs.search.setAttribute("aria-expanded", "false");
}

function setActiveSuggestion(index) {
  suggestionState.activeIndex = index;
  shopRefs.suggestions.querySelectorAll(".search-suggestion").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
    button.setAttribute("aria-selected", buttonIndex === index ? "true" : "false");
  });
}

function applySuggestion(product) {
  shopState.query = product.title;
  shopRefs.search.value = product.title;
  hideSuggestions();
  renderShop();
}

function getSuggestionProducts() {
  const queryInfo = getQueryInfo(shopState.query);
  const minimumScore = getMinimumScore(queryInfo);

  return sortProducts(
    shopProducts
      .map((product) => ({
        product,
        score: getProductScore(product, queryInfo),
      }))
      .filter(({ product, score }) => matchesShopFilters(product) && score >= minimumScore),
    queryInfo
  )
    .slice(0, 6)
    .map(({ product }) => product);
}

function renderSuggestions() {
  if (!shopState.query) {
    hideSuggestions();
    return;
  }

  suggestionState.items = getSuggestionProducts();
  suggestionState.activeIndex = -1;
  shopRefs.suggestions.innerHTML = "";

  if (!suggestionState.items.length) {
    hideSuggestions();
    return;
  }

  suggestionState.items.forEach((product, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-suggestion";
    button.dataset.suggestionIndex = String(index);
    button.id = `shop-search-suggestion-${index}`;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", "false");

    const title = document.createElement("span");
    title.textContent = product.title;

    const meta = document.createElement("em");
    meta.textContent = `${product.badge} / ${product.category || getDetailTypeLabel(product)}`;

    button.append(title, meta);
    shopRefs.suggestions.appendChild(button);
  });

  shopRefs.suggestions.classList.remove("hidden");
  shopRefs.search.setAttribute("aria-expanded", "true");
}

function bindShopEvents() {
  shopRefs.search.addEventListener("input", (event) => {
    shopState.query = event.target.value.trim();
    renderShop();
    renderSuggestions();
  });

  shopRefs.search.addEventListener("focus", renderSuggestions);

  shopRefs.search.addEventListener("keydown", (event) => {
    if (shopRefs.suggestions.classList.contains("hidden")) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = Math.min(
        suggestionState.activeIndex + 1,
        suggestionState.items.length - 1
      );
      setActiveSuggestion(nextIndex);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = Math.max(suggestionState.activeIndex - 1, 0);
      setActiveSuggestion(nextIndex);
    }

    if (event.key === "Enter" && suggestionState.activeIndex >= 0) {
      event.preventDefault();
      applySuggestion(suggestionState.items[suggestionState.activeIndex]);
    }

    if (event.key === "Escape") {
      hideSuggestions();
    }
  });

  shopRefs.suggestions.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  shopRefs.suggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-suggestion-index]");
    if (!button) return;

    const product = suggestionState.items[Number(button.dataset.suggestionIndex)];
    if (product) applySuggestion(product);
  });

  shopRefs.sort.addEventListener("change", (event) => {
    shopState.sort = event.target.value;
    renderShop();
    renderSuggestions();
  });

  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      const groupName = group.dataset.filterGroup;
      shopState[groupName] = button.dataset.filter;
      setActiveFilter(groupName, shopState[groupName]);
      if (groupName === "type") {
        syncSeriesFiltersForType();
      }
      renderShop();
      renderSuggestions();
    });
  });

  shopRefs.reset.addEventListener("click", () => {
    shopState.type = "camera";
    shopState.series = "all";
    shopState.ideal = "all";
    shopState.query = "";
    shopRefs.search.value = "";
    setActiveFilter("type", "camera");
    setActiveFilter("series", "all");
    setActiveFilter("ideal", "all");
    syncSeriesFiltersForType();
    renderShop();
    hideSuggestions();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".shop-search")) {
      hideSuggestions();
    }
  });

  shopRefs.contactWechat?.addEventListener("click", openWechatQrModal);
  shopRefs.serviceToggle?.addEventListener("click", toggleServiceWidget);
  shopRefs.servicePanel?.addEventListener("submit", submitServiceMessage);
  shopRefs.cartToggle.addEventListener("click", openCart);
  shopRefs.floatingOrder.addEventListener("click", openOrders);
  shopRefs.ordersManage.addEventListener("click", () => {
    setOrdersManageMode(!shopState.orderManageMode);
  });
  shopRefs.ordersList.addEventListener("click", (event) => {
    const selectButton = event.target.closest("[data-order-select]");
    if (selectButton) {
      toggleOrderSelection(selectButton.dataset.orderSelect);
      return;
    }

    const card = event.target.closest("[data-order-id]");
    if (shopState.orderManageMode && card) {
      toggleOrderSelection(card.dataset.orderId);
      return;
    }

    if (card) {
      openOrderDetail(card.dataset.orderId);
    }
  });
  shopRefs.ordersList.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key) || shopState.orderManageMode) return;

    const card = event.target.closest("[data-order-id]");
    if (!card) return;
    event.preventDefault();
    openOrderDetail(card.dataset.orderId);
  });
  shopRefs.ordersCancelManage.addEventListener("click", () => setOrdersManageMode(false));
  shopRefs.ordersDeleteSelected.addEventListener("click", openOrderDeleteConfirm);
  shopRefs.orderDeleteConfirmCancel.addEventListener("click", closeOrderDeleteConfirm);
  shopRefs.orderDeleteConfirmAccept.addEventListener("click", deleteSelectedOrders);
  shopRefs.orderDeleteConfirm.addEventListener("click", (event) => {
    if (event.target === shopRefs.orderDeleteConfirm) closeOrderDeleteConfirm();
  });
  shopRefs.orderDetailClose?.addEventListener("click", closeOrderDetail);
  shopRefs.orderDetail?.addEventListener("click", (event) => {
    if (event.target === shopRefs.orderDetail) closeOrderDetail();
  });
  shopRefs.ordersClose.addEventListener("click", closeOrders);
  shopRefs.orders.addEventListener("click", (event) => {
    if (event.target === shopRefs.orders) closeOrders();
  });
  shopRefs.floatingCart.addEventListener("click", openCart);
  shopRefs.floatingTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  shopRefs.cartClose.addEventListener("click", closeCart);
  shopRefs.cart.addEventListener("click", (event) => {
    if (event.target === shopRefs.cart) closeCart();
  });
  shopRefs.cartClear.addEventListener("click", openClearCartConfirm);

  shopRefs.removeConfirmCancel.addEventListener("click", cancelRemoveFromCart);
  shopRefs.removeConfirmAccept.addEventListener("click", () => {
    if (!shopState.pendingRemovalSku) return;
    removeFromCart(shopState.pendingRemovalSku);
  });
  shopRefs.removeConfirm.addEventListener("click", (event) => {
    if (event.target === shopRefs.removeConfirm) cancelRemoveFromCart();
  });
  shopRefs.clearConfirmCancel.addEventListener("click", closeClearCartConfirm);
  shopRefs.clearConfirmAccept.addEventListener("click", clearCart);
  shopRefs.clearConfirm.addEventListener("click", (event) => {
    if (event.target === shopRefs.clearConfirm) closeClearCartConfirm();
  });

  shopRefs.checkout.addEventListener("click", openCheckout);
  shopRefs.delivery?.addEventListener("change", renderCart);
  document.querySelectorAll(".shop-checkout-dialog input, .shop-checkout-dialog select").forEach((field) => {
    field.addEventListener("pointerdown", () => {
      clearCheckoutFieldError(field);
      setCheckoutError("");
    });
    field.addEventListener("input", () => {
      clearCheckoutFieldError(field);
      setCheckoutError("");
    });
    field.addEventListener("change", () => {
      clearCheckoutFieldError(field);
      setCheckoutError("");
    });
  });
  shopRefs.checkoutClose.addEventListener("click", closeCheckout);
  shopRefs.addressMapOpen?.addEventListener("click", openCheckoutAddressMap);
  shopRefs.addressMapClose?.addEventListener("click", () => closePaymentModal(shopRefs.addressMapModal));
  shopRefs.checkoutPanel.addEventListener("click", (event) => {
    if (event.target === shopRefs.checkoutPanel) closeCheckout();
  });
  shopRefs.addressMapModal?.addEventListener("click", (event) => {
    if (event.target === shopRefs.addressMapModal) closePaymentModal(shopRefs.addressMapModal);
  });
  shopRefs.payButton.addEventListener("click", handleCheckoutPayment);
  shopRefs.qrClose?.addEventListener("click", () => closePaymentModal(shopRefs.qrModal));
  shopRefs.qrComplete?.addEventListener("click", runQrPaymentSimulation);
  shopRefs.wechatClose?.addEventListener("click", () => closePaymentModal(shopRefs.wechatModal));
  shopRefs.successClose?.addEventListener("click", closePaymentSuccessFlow);
  shopRefs.checkoutExpiredClose?.addEventListener("click", () => closePaymentModal(shopRefs.checkoutExpired));
  shopRefs.checkoutExpiredConfirm?.addEventListener("click", () => closePaymentModal(shopRefs.checkoutExpired));
  shopRefs.qrModal?.addEventListener("click", (event) => {
    if (event.target === shopRefs.qrModal) closePaymentModal(shopRefs.qrModal);
  });
  shopRefs.wechatModal?.addEventListener("click", (event) => {
    if (event.target === shopRefs.wechatModal) closePaymentModal(shopRefs.wechatModal);
  });
  shopRefs.paymentSuccess?.addEventListener("click", (event) => {
    if (event.target === shopRefs.paymentSuccess) closePaymentSuccessFlow();
  });
  shopRefs.checkoutExpired?.addEventListener("click", (event) => {
    if (event.target === shopRefs.checkoutExpired) closePaymentModal(shopRefs.checkoutExpired);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && shopState.pendingRemovalSku) {
      cancelRemoveFromCart();
    }
    if (event.key === "Escape") {
      closeOrderDetail();
      closeServiceWidget();
      closeClearCartConfirm();
      closeOrderDeleteConfirm();
      closeOrders();
      clearOrderCreationTimer();
      closePaymentModal(shopRefs.addressMapModal);
      closePaymentModal(shopRefs.wechatModal);
      closePaymentModal(shopRefs.qrModal);
      closePaymentModal(shopRefs.orderCreating);
      closePaymentModal(shopRefs.checkoutExpired);
      if (shopRefs.paymentSuccess?.classList.contains("is-open")) {
        closePaymentSuccessFlow();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (!shopRefs.serviceWidget?.classList.contains("is-open")) return;
    if (!event.target.closest("#shop-service-widget")) {
      closeServiceWidget();
    }
  });
}

function toRegionItem(item) {
  if (typeof item === "string") {
    return { name: item, children: [] };
  }

  return {
    name: item.name || item.label || item.value || "",
    children: Array.isArray(item.children) ? item.children : [],
  };
}

function buildFallbackRegionSource() {
  return Object.entries(checkoutCityData).map(([province, cities]) => ({
    name: province,
    children: cities.map((city) => ({
      name: city,
      children: checkoutDistrictData[city] || ["市辖区"],
    })),
  }));
}

function normalizeRegionSource(data) {
  if (Array.isArray(data)) {
    return data.map(toRegionItem).filter((item) => item.name);
  }

  if (data && typeof data === "object") {
    return Object.entries(data).map(([province, cities]) => ({
      name: province,
      children: Array.isArray(cities)
        ? cities
        : Object.entries(cities || {}).map(([city, districts]) => ({
            name: city,
            children: Array.isArray(districts) ? districts : [],
          })),
    }));
  }

  return [];
}

function mergeRegionSources(primary = [], fallback = []) {
  const merged = primary.map((item) => ({
    ...item,
    children: Array.isArray(item.children) ? item.children.map(toRegionItem) : [],
  }));

  const existingProvinceNames = new Set(merged.map((item) => item.name));

  fallback.forEach((fallbackProvince) => {
    const normalizedFallback = {
      ...fallbackProvince,
      children: Array.isArray(fallbackProvince.children)
        ? fallbackProvince.children.map(toRegionItem)
        : [],
    };

    const existing = merged.find((item) => item.name === normalizedFallback.name);
    if (!existing) {
      merged.push(normalizedFallback);
      return;
    }

    const existingCityNames = new Set((existing.children || []).map((item) => item.name));
    normalizedFallback.children.forEach((city) => {
      if (!existingCityNames.has(city.name)) {
        existing.children.push(city);
      }
    });
  });

  return merged;
}

async function loadCheckoutRegionSource() {
  const fallbackSource = buildFallbackRegionSource();
  checkoutRegionSource = fallbackSource;

  try {
    const response = await fetch(checkoutRegionDataUrl, { cache: "force-cache" });
    if (!response.ok) return;
    const data = await response.json();
    const normalized = normalizeRegionSource(data);
    if (normalized.length) {
      checkoutRegionSource = mergeRegionSources(normalized, fallbackSource);
    }
  } catch (error) {
    checkoutRegionSource = fallbackSource;
  }
}

function normalizeRegionName(value) {
  return normalizeSpaces(value)
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|自治州|自治县|自治旗|省|市|区|县|旗$/g, "")
    .replace(/市辖区/g, "")
    .trim();
}

function findRegionItemMatch(items, candidates) {
  const normalizedCandidates = (Array.isArray(candidates) ? candidates : [candidates])
    .map((item) => normalizeRegionName(item))
    .filter(Boolean);

  if (!normalizedCandidates.length) return null;

  const regionItems = items.map(toRegionItem).filter((item) => item.name);

  for (const candidate of normalizedCandidates) {
    const exact = regionItems.find((item) => normalizeRegionName(item.name) === candidate);
    if (exact) return exact;
  }

  for (const candidate of normalizedCandidates) {
    const partial = regionItems.find((item) => {
      const normalized = normalizeRegionName(item.name);
      return normalized && (normalized.includes(candidate) || candidate.includes(normalized));
    });
    if (partial) return partial;
  }

  return null;
}

function triggerSelectChange(field) {
  field?.dispatchEvent(new Event("change", { bubbles: true }));
}

function isMunicipalityRegion(name) {
  return ["北京市", "上海市", "天津市", "重庆市", "香港特别行政区", "澳门特别行政区"].includes(name);
}

function getDisplayNameCandidates(reverseResult) {
  const raw = [
    reverseResult?.display_name,
    reverseResult?.name,
  ]
    .filter(Boolean)
    .join(",")
    .split(/[，,]/)
    .map((item) => normalizeSpaces(item))
    .filter(Boolean);

  return Array.from(new Set(raw));
}

function getAddressCandidates(address, keys = [], extras = []) {
  const values = [
    ...keys.map((key) => address?.[key]),
    ...extras,
  ]
    .map((item) => normalizeSpaces(item))
    .filter(Boolean);

  return Array.from(new Set(values));
}

function findCityByDistrictCandidate(cityItems, districtCandidates) {
  const normalizedCandidates = districtCandidates.map((item) => normalizeRegionName(item)).filter(Boolean);
  if (!normalizedCandidates.length) return { cityItem: null, districtItem: null };

  for (const cityItem of cityItems) {
    const districts = (cityItem.children || []).map(toRegionItem).filter((item) => item.name);
    const districtItem = findRegionItemMatch(districts, normalizedCandidates);
    if (districtItem) {
      return { cityItem, districtItem };
    }
  }

  return { cityItem: null, districtItem: null };
}

function buildCheckoutAddressDetail(address = {}, fallbackName = "") {
  const rawSegments = [
    [address.road, address.house_number].filter(Boolean).join(" "),
    address.neighbourhood,
    address.suburb,
    address.residential,
    address.amenity,
    address.building,
    address.shop,
    address.tourism,
    address.office,
    address.hamlet,
    address.village,
  ];

  const blocked = new Set([
    address.province,
    address.state,
    address.city,
    address.county,
    address.city_district,
    address.district,
    address.town,
    address.state_district,
    address.country,
  ].map((item) => normalizeRegionName(item)).filter(Boolean));

  const unique = [];
  rawSegments.forEach((segment) => {
    const value = normalizeSpaces(segment);
    if (!value) return;
    const normalized = normalizeRegionName(value);
    if (normalized && blocked.has(normalized)) return;
    if (!unique.includes(value)) {
      unique.push(value);
    }
  });

  if (unique.length) {
    return unique.join(" ");
  }

  return normalizeSpaces(fallbackName);
}

function mergeReverseGeocodeResults(primary = {}, fallback = {}) {
  const primaryAddress = primary.address && typeof primary.address === "object" ? primary.address : {};
  const fallbackAddress = fallback.address && typeof fallback.address === "object" ? fallback.address : {};

  return {
    ...fallback,
    ...primary,
    address: {
      ...fallbackAddress,
      ...primaryAddress,
    },
    display_name: primary.display_name || fallback.display_name || "",
    name: primary.name || fallback.name || "",
  };
}

async function applyCheckoutAddressSelection(reverseResult) {
  const address = reverseResult?.address || {};
  const displayNameCandidates = getDisplayNameCandidates(reverseResult);
  const provinceField = document.getElementById("checkout-province");
  const cityField = document.getElementById("checkout-city");
  const districtField = document.getElementById("checkout-district");
  const detailField = document.getElementById("checkout-address-detail");
  if (!provinceField || !cityField || !districtField || !detailField) return;

  if (!checkoutRegionSource.length) {
    await loadCheckoutRegionSource();
  }

  const provinceCandidates = getAddressCandidates(
    address,
    ["province", "state", "region"],
    displayNameCandidates
  );
  const provinceItem = findRegionItemMatch(checkoutRegionSource, provinceCandidates);

  if (provinceItem) {
    provinceField.value = provinceItem.name;
    triggerSelectChange(provinceField);
  }

  const cityItems = (provinceItem?.children || []).map(toRegionItem).filter((item) => item.name);
  const cityCandidates = getAddressCandidates(
    address,
    ["city", "municipality", "county", "state_district", "town"],
    displayNameCandidates
  );
  let cityItem =
    findRegionItemMatch(cityItems, cityCandidates) ||
    (provinceItem && isMunicipalityRegion(provinceItem.name) ? cityItems[0] || null : null);

  const districtCandidates = getAddressCandidates(
    address,
    ["city_district", "district", "county", "suburb", "borough", "town", "village"],
    displayNameCandidates
  );

  let districtItem = null;

  if (!cityItem && cityItems.length) {
    const inferred = findCityByDistrictCandidate(cityItems, districtCandidates);
    cityItem = inferred.cityItem;
    districtItem = inferred.districtItem;
  }

  if (cityItem) {
    cityField.value = cityItem.name;
    triggerSelectChange(cityField);
  }

  const districtOptions = (cityItem?.children || []).map(toRegionItem).map((item) => item.name).filter(Boolean);
  if (!districtItem) {
    districtItem = findRegionItemMatch(
      districtOptions.map((name) => ({ name, children: [] })),
      districtCandidates
    );
  }

  if (!districtItem && districtOptions.length === 1) {
    districtItem = { name: districtOptions[0] };
  }

  if (districtItem) {
    districtField.value = districtItem.name;
    triggerSelectChange(districtField);
  }

  detailField.value = buildCheckoutAddressDetail(reverseResult?.address, reverseResult?.name || "");

  [provinceField, cityField, districtField, detailField].forEach((field) => clearCheckoutFieldError(field));
  setCheckoutError("");

  return {
    province: Boolean(provinceField.value),
    city: Boolean(cityField.value),
    district: Boolean(districtField.value),
    detail: Boolean(normalizeSpaces(detailField.value)),
  };
}

async function requestReverseGeocode(lat, lng, zoom = 18) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("zoom", String(zoom));
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "zh-CN");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("reverse_failed");
  }

  return response.json();
}

async function reverseGeocodeCheckoutPoint(lat, lng) {
  const precise = await requestReverseGeocode(lat, lng, 18);
  const preciseAddress = precise?.address || {};

  const needsFallback =
    !normalizeSpaces(preciseAddress.city) ||
    (!normalizeSpaces(preciseAddress.district) &&
      !normalizeSpaces(preciseAddress.city_district) &&
      !normalizeSpaces(preciseAddress.county));

  if (!needsFallback) {
    return precise;
  }

  try {
    const broader = await requestReverseGeocode(lat, lng, 14);
    return mergeReverseGeocodeResults(precise, broader);
  } catch (error) {
    return precise;
  }
}

function ensureCheckoutAddressMap() {
  if (checkoutAddressMap || !window.L) return checkoutAddressMap;

  checkoutAddressMap = L.map("checkout-address-map", {
    zoomControl: false,
    attributionControl: true,
  }).setView([35.8617, 104.1954], 4.6);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    subdomains: "abcd",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  }).addTo(checkoutAddressMap);

  L.control.zoom({ position: "bottomright" }).addTo(checkoutAddressMap);

  checkoutAddressMap.on("click", async (event) => {
    const { lat, lng } = event.latlng;

    if (checkoutAddressMarker) {
      checkoutAddressMarker.setLatLng([lat, lng]);
    } else {
      checkoutAddressMarker = L.marker([lat, lng]).addTo(checkoutAddressMap);
    }

    if (shopRefs.addressMapNote) {
      shopRefs.addressMapNote.textContent = "正在识别地址，请稍候";
    }

    try {
      const reverseResult = await reverseGeocodeCheckoutPoint(lat, lng);
      const filled = await applyCheckoutAddressSelection(reverseResult);
      checkoutAddressMarker.bindPopup("地址已回填").openPopup();
      if (shopRefs.addressMapNote) {
        shopRefs.addressMapNote.textContent =
          filled?.province && filled?.city && filled?.district
            ? "已自动回填地址信息"
            : "已尽量回填地址，请检查并补充缺失的市区信息";
      }
      window.setTimeout(() => {
        closePaymentModal(shopRefs.addressMapModal);
      }, 180);
    } catch (error) {
      if (shopRefs.addressMapNote) {
        shopRefs.addressMapNote.textContent = "当前位置暂时无法识别，请换一个位置再试";
      }
    }
  });

  return checkoutAddressMap;
}

function openCheckoutAddressMap() {
  openPaymentModal(shopRefs.addressMapModal);
  if (shopRefs.addressMapNote) {
    shopRefs.addressMapNote.textContent = "请在地图上单击需要配送的位置";
  }

  const map = ensureCheckoutAddressMap();
  if (!map) {
    if (shopRefs.addressMapNote) {
      shopRefs.addressMapNote.textContent = "地图组件加载失败，请稍后重试";
    }
    return;
  }

  window.setTimeout(() => {
    map.invalidateSize();
  }, 120);
}

async function bindCheckoutAddressFields() {
  const province = document.getElementById("checkout-province");
  const city = document.getElementById("checkout-city");
  const district = document.getElementById("checkout-district");
  if (!province || !city || !district) return;

  const fillSelect = (select, placeholder, options) => {
    select.innerHTML = "";
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = placeholder;
    select.appendChild(empty);
    options.forEach((option) => {
      const item = document.createElement("option");
      item.textContent = option;
      select.appendChild(item);
    });
  };

  await loadCheckoutRegionSource();
  fillSelect(province, "省 / 直辖市", checkoutRegionSource.map((item) => item.name));

  province.addEventListener("change", () => {
    const selectedProvince = checkoutRegionSource.find((item) => item.name === province.value);
    const cities = (selectedProvince?.children || []).map(toRegionItem).filter((item) => item.name);
    fillSelect(city, "城市", cities.map((item) => item.name));
    fillSelect(district, "区 / 县", []);
  });

  city.addEventListener("change", () => {
    const selectedProvince = checkoutRegionSource.find((item) => item.name === province.value);
    const selectedCity = (selectedProvince?.children || [])
      .map(toRegionItem)
      .find((item) => item.name === city.value);
    const districts = (selectedCity?.children || []).map(toRegionItem).map((item) => item.name).filter(Boolean);
    fillSelect(district, "区 / 县", districts.length ? districts : checkoutDistrictData[city.value] || ["市辖区"]);
  });
}

function bindCheckoutPaymentField() {
  if (!shopRefs.payment || !shopRefs.paymentLogo) return;

  const updateLogo = () => {
    const value = shopRefs.payment.value;
    shopRefs.paymentLogo.src = checkoutPaymentLogos[value] || checkoutPaymentLogos["WeChat Pay"];
    shopRefs.paymentLogo.alt = value;
    shopRefs.cardFields?.classList.toggle("hidden", !checkoutCardPaymentTypes.has(value));
    shopRefs.payButton.textContent = checkoutCardPaymentTypes.has(value) ? "确认支付" : "继续";
  };

  shopRefs.payment.addEventListener("change", updateLogo);
  updateLogo();
}

function bindBackToTopVisibility() {
  if (!shopRefs.floatingTop) return;
  const updateFloatingTop = () => {
    const shouldShow = window.scrollY > 220;
    shopRefs.floatingTop.classList.toggle("is-visible", shouldShow);
    shopRefs.floatingTop.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  };
  updateFloatingTop();
  window.addEventListener("scroll", updateFloatingTop, { passive: true });
}

function bindFloatingCartVisibility() {
  if (!("IntersectionObserver" in window)) {
    shopRefs.floatingCart.classList.add("is-visible");
    shopRefs.floatingCart.setAttribute("aria-hidden", "false");
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      const shouldShow = !entry.isIntersecting;
      shopRefs.floatingCart.classList.toggle("is-visible", shouldShow);
      shopRefs.floatingCart.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    },
    {
      root: null,
      threshold: 0.12,
    }
  );

  observer.observe(shopRefs.cartToggle);
}

function playShopArrival() {
  if (!shouldPlayShopArrival) {
    return;
  }

  try {
    sessionStorage.removeItem("sonyShopTransition");
  } catch (error) {}

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    document.documentElement.classList.remove("shop-arriving");
    return;
  }

  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  window.setTimeout(() => {
    document.documentElement.classList.remove("shop-arriving");
    document.body.classList.remove("is-ready");
  }, 940);
}

const checkoutAddressReady = bindCheckoutAddressFields();
bindCheckoutPaymentField();
bindShopEvents();
bindProductDetailEvents();
bindFloatingCartVisibility();
bindBackToTopVisibility();
syncSeriesFiltersForType();
renderShop();
renderCart();
renderOrderCount();
renderOrders();
checkoutAddressReady.then(syncProductFromQuery).catch(syncProductFromQuery);
playShopArrival();
