const sourceProducts = Array.isArray(window.sonyOfficialProducts)
  ? window.sonyOfficialProducts
  : [];
const PRODUCT_FOOTPRINT_STORAGE_KEY = "sonyProductFootprints";
const PRODUCT_FOOTPRINT_LIMIT = 20;
const officialProductDetails =
  window.sonyOfficialProductDetails && typeof window.sonyOfficialProductDetails === "object"
    ? window.sonyOfficialProductDetails
    : {};

const shouldPlaySearchArrival = document.documentElement.classList.contains("search-arriving");

const labels = {
  all: "\u5168\u90e8",
  camera: "\u76f8\u673a",
  lens: "\u955c\u5934",
  pro: "\u4e13\u4e1a\u65d7\u8230",
  video: "\u89c6\u9891\u521b\u4f5c",
  travel: "\u65c5\u884c\u8f7b\u91cf",
  portrait: "\u4eba\u50cf",
  action: "\u9ad8\u901f\u6293\u62cd",
};

const purposeRules = {
  pro: [
    "alpha 1",
    "alpha 9",
    "g\u5927\u5e08",
    "g master",
    "gm",
    "\u65d7\u8230",
    "\u5546\u4e1a",
    "\u4e13\u4e1a",
    "\u5168\u753b\u5e45",
    "cinema line",
    "fx",
    "\u7535\u5f71\u6444\u5f71\u673a",
  ],
  video: [
    "zv",
    "fx",
    "cinema line",
    "vlog",
    "video",
    "\u89c6\u9891",
    "\u7535\u5f71",
    "\u76f4\u64ad",
    "\u7535\u52a8\u53d8\u7126",
    "pz",
    "\u53cc\u5f71\u50cf",
  ],
  travel: [
    "\u65c5\u884c",
    "\u8f7b\u5de7",
    "\u8f7b\u91cf",
    "\u53e3\u888b",
    "compact",
    "aps-c",
    "\u534a\u753b\u5e45",
    "rx100",
    "wx",
    "hx",
  ],
  portrait: [
    "\u4eba\u50cf",
    "portrait",
    "50mm",
    "85mm",
    "135mm",
    "f1.2",
    "f1.4",
    "f1.8",
  ],
  action: [
    "\u4f53\u80b2",
    "\u751f\u6001",
    "\u9ad8\u901f",
    "\u8fdc\u6444",
    "\u8d85\u8fdc\u6444",
    "400",
    "600",
    "800",
    "alpha 9",
    "rx10",
  ],
};

const searchProducts = sourceProducts.map((product, index) => normalizeProduct(product, index));

function recordProductFootprint(product, source = "search") {
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

const searchState = {
  type: "all",
  purpose: "all",
  query: "",
};

const suggestionState = {
  items: [],
  activeIndex: -1,
};

const productDetails = {
  "Alpha 7C II": {
    eyebrow: "SONY ALPHA | ILCE-7CM2",
    title: "Alpha 7C II",
    model: "ILCE-7CM2",
    tagline: "全画幅双影像小“7”",
    summary:
      "将约3300万像素全画幅画质、AI 智能识别、4K 视频能力与轻巧机身整合在一起，适合日常记录、旅行、人像与混合创作。",
    specs: [
      ["影像核心", "约3300万有效像素全画幅背照式 Exmor R CMOS"],
      ["处理系统", "BIONZ XR 影像处理器 + AI 智能芯片"],
      ["智能对焦", "759个相位检测对焦点，支持人、动物、鸟类、昆虫、车辆与飞机识别"],
      ["视频能力", "4K 60p、10-bit 4:2:2、S-Cinetone 与 LUT 监看"],
      ["稳定表现", "照片最高支持7级5轴防抖，视频支持增强防抖模式"],
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
    tagline: "全画幅画质旗舰小“7”",
    summary:
      "将约6100万像素全画幅画质、AI 智能识别和轻巧机身整合在一起，适合风光、旅行、人文街拍、人像与高分辨率创作。",
    specs: [
      ["影像核心", "约6100万有效像素全画幅背照式 Exmor R CMOS"],
      ["处理系统", "BIONZ XR 影像处理器 + AI 智能芯片"],
      ["智能对焦", "693个相位检测对焦点，支持人、动物、鸟类、昆虫、汽车 / 火车与飞机识别"],
      ["高分辨率", "支持像素转换多重拍摄，16张合成约2.408亿像素影像"],
      ["视频能力", "4K 60p、10-bit 4:2:2、S-Cinetone、S-Log3 与 LUT 监看"],
      ["机身设计", "约515g，最高7级5轴防抖，多角度侧翻 LCD"],
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
          "像素转换多重拍摄适合静物、文物、产品和风光等需要极致细节的场景，也让 A7CR 和普通轻量全画幅机型拉开层次。",
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

let activeDetailOverlay = null;
let lastDetailTrigger = null;

const refs = {
  input: document.getElementById("product-search"),
  typeButtons: document.querySelectorAll("[data-type]"),
  purposeButtons: document.querySelectorAll("[data-purpose]"),
  grid: document.getElementById("search-results"),
  summary: document.getElementById("search-summary"),
  count: document.getElementById("search-count"),
  empty: document.getElementById("search-empty"),
  suggestions: document.getElementById("search-suggestions"),
  wechatTrigger: document.getElementById("search-wechat-trigger"),
  wechatModal: document.getElementById("search-wechat-modal"),
  wechatClose: document.getElementById("search-wechat-close"),
};

function openSearchWechatModal() {
  if (!refs.wechatModal) return;
  refs.wechatModal.classList.add("is-open");
  refs.wechatModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeSearchWechatModal() {
  if (!refs.wechatModal) return;
  refs.wechatModal.classList.remove("is-open");
  refs.wechatModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function normalizeSpaces(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeSearchValue(value) {
  return normalizeSpaces(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[™®]/g, "")
    .replace(/α/g, "alpha")
    .replace(/\bsony\b/g, "")
    .replace(/\u7d22\u5c3c/g, "")
    .replace(/\u5fae\u5355/g, " alpha ")
    .replace(/\u9ed1\u5361/g, " rx ")
    .replace(/\u5168\u753b\u5e45/g, " full frame ")
    .replace(/\u534a\u753b\u5e45/g, " aps-c ")
    .replace(/[·・]/g, " ")
    .replace(/[_/|+()（）,，、:：;；]/g, " ")
    .replace(/[-‐‑‒–—―－]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactRawSearchValue(value) {
  return normalizeSearchValue(value).replace(/[^a-z0-9\u4e00-\u9fff]/g, "");
}

function romanValue(value) {
  const romanMap = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };
  return romanMap[value] || value;
}

function compactSearchValue(value) {
  const raw = compactRawSearchValue(value);
  return raw.replace(/(\d+[a-z]*)(iii|ii|iv|v)$/g, (_, prefix, roman) => {
    return prefix + romanValue(roman);
  });
}

function addAlias(aliases, value) {
  const normalized = normalizeSearchValue(value);
  if (!normalized) return;

  aliases.add(normalized);
  aliases.add(compactRawSearchValue(normalized));
  aliases.add(compactSearchValue(normalized));
}

function addAlphaAliases(aliases, model) {
  const normalized = normalizeSearchValue(model);
  const match = normalized.match(/^alpha\s+(.+)$/);
  if (!match) return;

  const rest = match[1];
  const restRaw = compactRawSearchValue(rest);
  const restCompact = compactSearchValue(rest);

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
  const normalized = normalizeSearchValue(model);
  const compactRaw = compactRawSearchValue(normalized);
  const compact = compactSearchValue(normalized);

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

function createSearchAliases(product, model, title, description, filters) {
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
  const normalized = normalizeSearchValue(query);
  return {
    raw: query,
    normalized,
    compactRaw: compactRawSearchValue(query),
    compact: compactSearchValue(query),
    tokens: normalized.split(" ").filter(Boolean),
  };
}

function normalizeProduct(product, index) {
  const title = normalizeSpaces(product.title || product.model);
  const model = normalizeSpaces(product.model || title);
  const description = normalizeSpaces(product.description || product.category);
  const filters = Array.isArray(product.filters)
    ? product.filters.map(normalizeSpaces).filter(Boolean)
    : [];
  const searchableText = [
    product.type,
    product.category,
    product.sku8D,
    model,
    title,
    description,
    ...filters,
  ]
    .join(" ");
  const searchText = normalizeSearchValue(searchableText);
  const searchAliases = createSearchAliases(product, model, title, description, filters);

  const purposes = getPurposes(searchText);
  const displayTags = [
    ...purposes.map((purpose) => labels[purpose]),
    ...filters.slice(0, 3),
  ].filter((tag, index, list) => tag && list.indexOf(tag) === index);

  return {
    type: product.type,
    category: normalizeSpaces(product.category),
    sku8D: normalizeSpaces(product.sku8D),
    model,
    title,
    description,
    image: normalizeSpaces(product.image),
    productUrl: normalizeSpaces(product.productUrl),
    source: normalizeSpaces(product.source),
    filters,
    badge: getBadge(product, searchText),
    purposes,
    displayTags,
    searchText,
    searchCompactText: compactSearchValue(searchableText),
    searchAliases,
    sourceIndex: index,
  };
}

function getBadge(product, searchText) {
  if (product.type === "camera") {
    if (searchText.includes("cinema line") || /\bfx/.test(searchText)) return "Cinema Line";
    if (searchText.includes("zv")) return "Vlog";
    if (searchText.includes("rx") || searchText.includes("\u9ed1\u5361")) return "\u9ed1\u5361 / RX";
    if (searchText.includes("aps-c") || searchText.includes("\u534a\u753b\u5e45")) return "APS-C";
    return "\u5168\u753b\u5e45";
  }

  if (searchText.includes("g\u5927\u5e08") || /\bgm\b/.test(searchText)) return "G Master";
  if (searchText.includes("zeiss") || searchText.includes("\u8521\u53f8")) return "ZEISS";
  if (searchText.includes("aps-c") || searchText.includes("\u534a\u753b\u5e45")) return "APS-C";
  if (searchText.includes("\u589e\u8ddd") || searchText.includes("\u8f6c\u6362\u5668")) return "\u955c\u5934\u9644\u4ef6";
  if (/\bg\b/.test(searchText) || searchText.includes("g\u955c\u5934")) return "G";
  return "\u955c\u5934";
}

function getPurposes(searchText) {
  const purposes = Object.entries(purposeRules)
    .filter(([, words]) => words.some((word) => searchText.includes(word.toLowerCase())))
    .map(([purpose]) => purpose);

  return purposes;
}

function createNode(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function findProductByModel(model) {
  return searchProducts.find((product) => product.model === model);
}

function getDetailScenes(product) {
  const tags = [
    product.badge,
    ...product.displayTags,
    ...product.filters,
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

    if (lensNameMatch) {
      return lensNameMatch[0]
        .replace(/\s+/g, " ")
        .replace(/\s+(全画幅|索尼|新一代|超三元).*$/u, "")
        .trim();
    }

    return withoutModel;
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
          "适用于检索页内的相机、镜头和创作场景筛选",
        ],
      },
      {
        title: "官方信息入口",
        kicker: "SONY STYLE",
        body:
          "底部按钮会打开该产品在索尼中国官方页面中的信息。之后你自建商城页面后，可通过“进入商城”进入对应购买流程。",
        bullets: [
          "官方页面用于查看完整规格、销售配置和说明",
          "进入商城按钮当前预留到 shop.html",
          "后续可以按每个商品独立接入自建商城地址",
        ],
      },
    ],
    scenes,
    sourceUrl: product.productUrl,
    shopUrl: "shop.html",
  };
}

function createGeneratedLensDetail(product, scenes) {
  const lensTags = product.filters.length ? product.filters.slice(0, 5).join("、") : product.badge;
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
          "根据官方产品标签和检索分类整理，这支镜头可服务于不同焦段、画幅和题材需求。具体光学结构、最近对焦距离、重量和尺寸请查看官方详情页。",
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
          "进入商城按钮当前预留到 shop.html，便于之后接入自建商城",
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

const mojibakePattern = /(锛|绾|鐨|鍏|涓|鏄|瀹|闀|鐩|褰|€)/;

function cleanOfficialText(value, maxLength = 180) {
  const text = normalizeSpaces(value)
    .replace(/™/g, "")
    .replace(/®/g, "")
    .replace(/\s*;\s*$/g, "")
    .replace(/\s*，\s*$/g, "")
    .trim();

  if (!text) return "";
  if (text.includes("�") || mojibakePattern.test(text)) return "";
  if (/^(是|否|有|无|--|-)$/.test(text)) return "";
  if (officialNoiseTerms.some((term) => text === term)) return "";
  if (text.length <= maxLength) return text;
  return "";
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
      const rawBullet = normalizeSpaces(bullet).replace(/™/g, "").replace(/®/g, "");
      if (!rawBullet || rawBullet.includes("�") || mojibakePattern.test(rawBullet)) return;

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
  return uniqueCleanList(values, 170).join("，") || fallback;
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
      body: "光学部分保留结构和光圈等关键指标，去掉附件清单和过细的说明项。",
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
    ? findProductByModel(productOrModel)
    : productOrModel;

  if (!product) return null;

  const customDetail = productDetails[product.model];
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

function enterShopWithTransition(event, url) {
  if (event) event.preventDefault();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    window.location.href = url;
    return;
  }

  try {
    sessionStorage.setItem("sonyShopTransition", "1");
  } catch (error) {}

  document.body.classList.add("is-transitioning");

  const transition = createNode("div", "shop-entry-transition");
  transition.setAttribute("aria-hidden", "true");
  document.body.appendChild(transition);

  window.requestAnimationFrame(() => {
    transition.classList.add("is-active");
  });

  window.setTimeout(() => {
    window.location.href = url;
  }, 540);
}

function openProductDetail(model, trigger) {
  const detail = getProductDetail(model);
  const product = findProductByModel(model);
  if (!detail || !product) return;

  recordProductFootprint(product, "search");
  hideSuggestions();
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

  const shopLink = createNode("a", "product-detail-link", "进入商城");
  shopLink.href = getShopUrl(product, detail);
  shopLink.addEventListener("click", (event) => enterShopWithTransition(event, shopLink.href));

  actionRow.append(sourceLink, shopLink);

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

  const aliasNormalized = normalizeSearchValue(alias);
  const candidates = [
    aliasNormalized,
    compactRawSearchValue(alias),
    compactSearchValue(alias),
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

function matchesFilters(product) {
  const typeMatch = searchState.type === "all" || product.type === searchState.type;
  const purposeMatch =
    searchState.purpose === "all" || product.purposes.includes(searchState.purpose);

  return typeMatch && purposeMatch;
}

function getRankedProducts() {
  const queryInfo = getQueryInfo(searchState.query);
  const minimumScore = getMinimumScore(queryInfo);

  return searchProducts
    .map((product) => ({
      product,
      score: getProductScore(product, queryInfo),
    }))
    .filter(({ product, score }) => matchesFilters(product) && score >= minimumScore)
    .sort((a, b) => {
      if (!queryInfo.compact) return a.product.sourceIndex - b.product.sourceIndex;
      if (b.score !== a.score) return b.score - a.score;
      return a.product.title.localeCompare(b.product.title, "zh-CN");
    });
}

function createCard(product) {
  const card = document.createElement("article");
  card.className = "search-card";
  card.dataset.productModel = product.model;

  if (getProductDetail(product)) {
    card.classList.add("has-detail");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `查看${product.title}产品详情`);
  }

  const visual = document.createElement("div");
  visual.className = "search-card-image";

  if (product.image) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";
    image.decoding = "async";
    visual.appendChild(image);
  } else {
    visual.classList.add("search-card-placeholder");
    const visualType = document.createElement("span");
    visualType.textContent = labels[product.type];
    const visualModel = document.createElement("strong");
    visualModel.textContent = product.model;
    const visualSku = document.createElement("em");
    visualSku.textContent = product.sku8D;
    visual.append(visualType, visualModel, visualSku);
  }

  const body = document.createElement("div");
  body.className = "search-card-body";

  const meta = document.createElement("div");
  meta.className = "search-card-meta";

  const badge = document.createElement("span");
  badge.textContent = product.badge;

  const type = document.createElement("span");
  type.textContent = product.category || labels[product.type];

  meta.append(badge, type);

  const title = document.createElement("h2");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.textContent = product.description;

  const tags = document.createElement("div");
  tags.className = "search-card-tags";

  product.displayTags.forEach((label) => {
    const tag = document.createElement("span");
    tag.textContent = label;
    tags.appendChild(tag);
  });

  body.append(meta, title, description, tags);
  card.append(visual, body);

  if (getProductDetail(product)) {
    card.addEventListener("click", () => openProductDetail(product.model, card));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openProductDetail(product.model, card);
    });
  }

  return card;
}

function renderProducts() {
  const results = getRankedProducts().map(({ product }) => product);

  refs.grid.innerHTML = "";
  results.forEach((product) => refs.grid.appendChild(createCard(product)));

  refs.empty.classList.toggle("hidden", results.length > 0);
  refs.count.textContent = `${results.length} \u4ef6\u4ea7\u54c1`;

  const typeLabel = labels[searchState.type];
  const purposeLabel =
    searchState.purpose === "all" ? "\u5168\u90e8\u7528\u9014" : labels[searchState.purpose];
  const queryLabel = searchState.query ? ` / \u6a21\u7cca\u5339\u914d\u201c${searchState.query}\u201d` : "";
  refs.summary.textContent = `${typeLabel} / ${purposeLabel}${queryLabel}`;
}

function setActive(buttons, key, value) {
  buttons.forEach((button) => button.classList.toggle("is-active", button.dataset[key] === value));
}

function hideSuggestions() {
  suggestionState.items = [];
  suggestionState.activeIndex = -1;
  refs.suggestions.classList.add("hidden");
  refs.suggestions.innerHTML = "";
  refs.input.setAttribute("aria-expanded", "false");
}

function setActiveSuggestion(index) {
  suggestionState.activeIndex = index;
  refs.suggestions.querySelectorAll(".search-suggestion").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
    button.setAttribute("aria-selected", buttonIndex === index ? "true" : "false");
  });
}

function applySuggestion(product) {
  searchState.query = product.title;
  refs.input.value = product.title;
  hideSuggestions();
  renderProducts();
}

function renderSuggestions() {
  if (!searchState.query) {
    hideSuggestions();
    return;
  }

  suggestionState.items = getRankedProducts()
    .slice(0, 6)
    .map(({ product }) => product);
  suggestionState.activeIndex = -1;
  refs.suggestions.innerHTML = "";

  if (!suggestionState.items.length) {
    hideSuggestions();
    return;
  }

  suggestionState.items.forEach((product, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-suggestion";
    button.dataset.suggestionIndex = String(index);
    button.id = `search-suggestion-${index}`;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", "false");

    const title = document.createElement("span");
    title.textContent = product.title;

    const meta = document.createElement("em");
    meta.textContent = `${product.badge} / ${product.category || labels[product.type]}`;

    button.append(title, meta);
    refs.suggestions.appendChild(button);
  });

  refs.suggestions.classList.remove("hidden");
  refs.input.setAttribute("aria-expanded", "true");
}

function bindSearchEvents() {
  refs.input.addEventListener("input", (event) => {
    searchState.query = event.target.value.trim();
    renderProducts();
    renderSuggestions();
  });

  refs.input.addEventListener("focus", renderSuggestions);

  refs.input.addEventListener("keydown", (event) => {
    if (refs.suggestions.classList.contains("hidden")) return;

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

  refs.suggestions.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  refs.suggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-suggestion-index]");
    if (!button) return;

    const product = suggestionState.items[Number(button.dataset.suggestionIndex)];
    if (product) applySuggestion(product);
  });

  refs.typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      searchState.type = button.dataset.type;
      setActive(refs.typeButtons, "type", searchState.type);
      renderProducts();
      renderSuggestions();
    });
  });

  refs.purposeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      searchState.purpose = button.dataset.purpose;
      setActive(refs.purposeButtons, "purpose", searchState.purpose);
      renderProducts();
      renderSuggestions();
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-field")) {
      hideSuggestions();
    }
  });

  document.addEventListener("click", (event) => {
    if (!activeDetailOverlay) return;
    if (event.target.closest("[data-detail-close]") || event.target === activeDetailOverlay) {
      closeProductDetail();
    }
  });

  refs.wechatTrigger?.addEventListener("click", openSearchWechatModal);
  refs.wechatClose?.addEventListener("click", closeSearchWechatModal);

  document.addEventListener("click", (event) => {
    if (event.target === refs.wechatModal) {
      closeSearchWechatModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeDetailOverlay) {
      closeProductDetail();
      return;
    }

    if (event.key === "Escape" && refs.wechatModal?.classList.contains("is-open")) {
      closeSearchWechatModal();
    }
  });
}

function playSearchArrival() {
  if (!shouldPlaySearchArrival) {
    return;
  }

  try {
    sessionStorage.removeItem("sonySearchTransition");
  } catch (error) {}

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    document.documentElement.classList.remove("search-arriving");
    return;
  }

  const arrival = document.createElement("div");
  arrival.className = "search-arrival";
  arrival.setAttribute("aria-hidden", "true");
  document.body.appendChild(arrival);

  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  window.setTimeout(() => {
    document.documentElement.classList.remove("search-arriving");
    arrival.remove();
  }, 760);
}

bindSearchEvents();
renderProducts();
playSearchArrival();
