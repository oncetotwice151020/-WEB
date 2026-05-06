const ORDER_STORAGE_KEY = "sonyShopOrders";
const PRODUCT_FOOTPRINT_STORAGE_KEY = "sonyProductFootprints";

const orderState = {
  orders: loadOrders(),
  footprints: loadProductFootprints(),
  activeOrderId: null,
  activeView: "orders",
  manageMode: false,
  selectedOrderIds: new Set(),
  activeFilter: "all",
  reviewOrderId: null,
  reviewViewOrderId: null,
};

const orderRefs = {
  summary: document.getElementById("orders-summary"),
  quickPanel: document.getElementById("orders-quick-panel"),
  footprintCount: document.getElementById("orders-footprint-count"),
  footprintsView: document.getElementById("orders-footprints-view"),
  footprintsGrid: document.getElementById("orders-footprints-grid"),
  footprintsEmpty: document.getElementById("orders-footprints-empty"),
  clearFootprints: document.getElementById("orders-clear-footprints"),
  workspace: document.querySelector(".orders-workspace"),
  countPay: document.getElementById("orders-count-pay"),
  countReceive: document.getElementById("orders-count-receive"),
  countUse: document.getElementById("orders-count-use"),
  countReview: document.getElementById("orders-count-review"),
  countAftersale: document.getElementById("orders-count-aftersale"),
  countAll: document.getElementById("orders-count-all"),
  list: document.getElementById("orders-list"),
  detail: document.getElementById("orders-detail-panel"),
  manage: document.getElementById("orders-manage"),
  bulkBar: document.getElementById("orders-bulk-bar"),
  selectedCount: document.getElementById("orders-selected-count"),
  cancelManage: document.getElementById("orders-cancel-manage"),
  deleteSelected: document.getElementById("orders-delete-selected"),
  deleteConfirm: document.getElementById("orders-delete-confirm"),
  deleteCancel: document.getElementById("orders-delete-cancel"),
  deleteAccept: document.getElementById("orders-delete-accept"),
  deleteBlocked: document.getElementById("orders-delete-blocked"),
  deleteBlockedClose: document.getElementById("orders-delete-blocked-close"),
  receiveConfirm: document.getElementById("orders-receive-confirm"),
  receiveCancel: document.getElementById("orders-receive-cancel"),
  receiveAccept: document.getElementById("orders-receive-accept"),
  checkoutPanel: document.getElementById("orders-checkout-panel"),
  checkoutClose: document.getElementById("orders-checkout-close"),
  checkoutTimer: document.getElementById("orders-checkout-timer"),
  checkoutLastName: document.getElementById("orders-checkout-last-name"),
  checkoutFirstName: document.getElementById("orders-checkout-first-name"),
  checkoutPhone: document.getElementById("orders-checkout-phone"),
  checkoutEmail: document.getElementById("orders-checkout-email"),
  checkoutProvince: document.getElementById("orders-checkout-province"),
  checkoutCity: document.getElementById("orders-checkout-city"),
  checkoutDistrict: document.getElementById("orders-checkout-district"),
  checkoutAddressDetail: document.getElementById("orders-checkout-address-detail"),
  checkoutDelivery: document.getElementById("orders-checkout-delivery"),
  checkoutPayment: document.getElementById("orders-checkout-payment"),
  checkoutPaymentLogo: document.getElementById("orders-checkout-payment-logo"),
  checkoutCardFields: document.getElementById("orders-card-fields"),
  checkoutCardNumber: document.getElementById("orders-card-number"),
  checkoutCardCvv: document.getElementById("orders-card-cvv"),
  addressMapOpen: document.getElementById("orders-checkout-address-map-open"),
  addressMapModal: document.getElementById("orders-address-map-modal"),
  addressMapClose: document.getElementById("orders-address-map-close"),
  addressMapNote: document.getElementById("orders-address-map-note"),
  checkoutError: document.getElementById("orders-checkout-error"),
  checkoutTotal: document.getElementById("orders-checkout-total"),
  checkoutProductsTotal: document.getElementById("orders-checkout-products-total"),
  checkoutDeliveryFee: document.getElementById("orders-checkout-delivery-fee"),
  payButton: document.getElementById("orders-pay-button"),
  qrModal: document.getElementById("orders-qr-modal"),
  qrClose: document.getElementById("orders-qr-close"),
  qrComplete: document.getElementById("orders-qr-complete"),
  qrLogo: document.getElementById("orders-qr-logo"),
  qrName: document.getElementById("orders-qr-name"),
  paymentLoading: document.getElementById("orders-payment-loading"),
  paymentSuccess: document.getElementById("orders-payment-success"),
  successClose: document.getElementById("orders-success-close"),
  successDetails: document.getElementById("orders-success-details"),
};

let activePaymentOrderId = null;
let ordersCheckoutTimerId = null;
let ordersPaymentTimerId = null;
let ordersCheckoutAddressMap = null;
let ordersCheckoutAddressMarker = null;

const checkoutDurationSeconds = 5 * 60;
const checkoutDeliveryFees = {
  标准配送: 0,
  门店自提: 0,
  当日送达: 50,
};
const checkoutCardPaymentTypes = new Set(["UnionPay", "Mastercard", "VISA", "JCB", "American Express"]);
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

const checkoutRegionDataUrl = "https://unpkg.com/china-division@2.7.0/dist/pca.json";
let ordersCheckoutRegionSource = [];

function normalizeSpaces(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

const ORDER_STATUS_CONFIG = {
  unpaid: {
    label: "待付款",
    canDelete: false,
    canPay: true,
    canReceive: false,
    isCompleted: false,
  },
  paid: {
    label: "待收货",
    canDelete: false,
    canPay: false,
    canReceive: true,
    isCompleted: false,
  },
  completed: {
    label: "已完成",
    canDelete: true,
    canPay: false,
    canReceive: false,
    isCompleted: true,
  },
  reviewed: {
    label: "已评价",
    canDelete: true,
    canPay: false,
    canReceive: false,
    isCompleted: true,
  },
  closed: {
    label: "已关闭",
    canDelete: true,
    canPay: false,
    canReceive: false,
    isCompleted: false,
  },
  canceled: {
    label: "已取消",
    canDelete: true,
    canPay: false,
    canReceive: false,
    isCompleted: false,
  },
  refunded: {
    label: "已退款",
    canDelete: true,
    canPay: false,
    canReceive: false,
    isCompleted: false,
  },
  aftersale: {
    label: "售后处理中",
    canDelete: false,
    canPay: false,
    canReceive: false,
    isCompleted: false,
  },
};

const ORDER_STATUS_FALLBACK = {
  label: "待处理",
  canDelete: true,
  canPay: false,
  canReceive: false,
  isCompleted: false,
};

const ORDER_FILTERS = {
  all: {
    label: "全部订单",
    empty: "暂无订单",
    predicate: () => true,
  },
  pay: {
    label: "待付款",
    empty: "暂无待付款订单",
    predicate: (order) => isOrderUnpaid(order),
  },
  receive: {
    label: "待收货",
    empty: "暂无待收货订单",
    predicate: (order) => isOrderPaid(order),
  },
  use: {
    label: "待使用",
    empty: "暂无待使用订单",
    predicate: () => false,
  },
  review: {
    label: "评价",
    empty: "暂无评价订单",
    predicate: (order) => isOrderReviewRelated(order),
  },
  aftersale: {
    label: "退换/售后",
    empty: "暂无售后订单",
    predicate: () => false,
  },
};

function loadOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
    if (!Array.isArray(orders)) return [];
    return closeExpiredOrders(orders);
  } catch (error) {
    return [];
  }
}

function loadProductFootprints() {
  try {
    const footprints = JSON.parse(localStorage.getItem(PRODUCT_FOOTPRINT_STORAGE_KEY) || "[]");
    return Array.isArray(footprints) ? footprints.slice(0, 20) : [];
  } catch (error) {
    return [];
  }
}

function clearProductFootprints() {
  try {
    localStorage.removeItem(PRODUCT_FOOTPRINT_STORAGE_KEY);
  } catch (error) {}
  orderState.footprints = [];
  renderOrdersPage();
}

function persistOrders() {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderState.orders));
}

function closeExpiredOrders(orders = []) {
  let changed = false;
  const normalized = orders.map((order) => {
    if (order?.status === "unpaid") {
      const expiresAt = new Date(order.expiresAt || 0).getTime();
      if (expiresAt && expiresAt <= Date.now()) {
        changed = true;
        return { ...order, status: "closed", closedAt: order.closedAt || new Date().toISOString() };
      }
    }
    return order;
  });

  if (changed) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (match) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[match];
  });
}

function formatPrice(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
}

function formatCheckoutTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
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
  }).format(date);
}

function formatFootprintTime(value) {
  if (!value) return "刚刚";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";

  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} 小时前`;
  return `${Math.floor(minutes / 1440)} 天前`;
}

function getOrderStatus(order = {}) {
  if (order.status === "completed") return "completed";
  if (order.status === "paid") return "paid";
  if (order.status === "closed") return "closed";
  if (order.status === "unpaid") {
    const expiresAt = new Date(order.expiresAt || 0).getTime();
    return expiresAt && expiresAt <= Date.now() ? "closed" : "unpaid";
  }
  if (order.status && ORDER_STATUS_CONFIG[order.status]) return order.status;
  return order.paidAt ? "paid" : "unpaid";
}

function getOrderStatusConfig(order = {}) {
  const status = getOrderStatus(order);
  return {
    ...ORDER_STATUS_FALLBACK,
    ...(ORDER_STATUS_CONFIG[status] || {}),
    status,
  };
}

function isOrderCompleted(order = {}) {
  return getOrderStatusConfig(order).isCompleted;
}

function isOrderDeletable(order = {}) {
  return getOrderStatusConfig(order).canDelete;
}

function isOrderAwaitingReview(order = {}) {
  return getOrderStatus(order) === "completed" && !order.reviewedAt;
}

function isOrderReviewRelated(order = {}) {
  const status = getOrderStatus(order);
  return status === "completed" || status === "reviewed" || Boolean(order.reviewedAt);
}

function isOrderPaid(order = {}) {
  return getOrderStatusConfig(order).canReceive;
}

function isOrderUnpaid(order = {}) {
  return getOrderStatusConfig(order).canPay;
}

function getOrderStatusLabel(order = {}) {
  return getOrderStatusConfig(order).label;
}

function getSelectedOrders() {
  return orderState.orders.filter((order) => orderState.selectedOrderIds.has(order.orderId));
}

function getActiveFilterConfig() {
  return ORDER_FILTERS[orderState.activeFilter] || ORDER_FILTERS.all;
}

function getVisibleOrders() {
  const filter = getActiveFilterConfig();
  return orderState.orders.filter((order) => filter.predicate(order));
}

function getActiveOrder() {
  return orderState.orders.find((order) => order.orderId === orderState.activeOrderId) || null;
}

function getOrderStatusSteps(order = {}) {
  const status = getOrderStatus(order);
  const terminalStatus = ["closed", "canceled", "refunded"].includes(status);
  const fulfilledStatus = status === "completed" || status === "reviewed";

  if (terminalStatus) {
    return [
      { title: "订单已提交", text: "已生成订单编号", done: true },
      {
        title: getOrderStatusLabel(order),
        text: formatPaymentTime(order.closedAt || order.canceledAt || order.refundedAt),
        done: true,
      },
    ];
  }

  if (status === "aftersale") {
    return [
      { title: "订单已提交", text: "已生成订单编号", done: true },
      { title: "支付成功", text: formatPaymentTime(order.paidAt), done: true },
      { title: "售后处理中", text: "售后服务正在处理该订单", done: true },
    ];
  }

  return [
    { title: "订单已提交", text: "已生成订单编号", done: true },
    {
      title: status === "unpaid" ? "等待支付" : "支付成功",
      text: status === "unpaid" ? "请在有效时间内完成支付" : formatPaymentTime(order.paidAt),
      done: status !== "unpaid",
    },
    {
      title: fulfilledStatus ? "订单已送达" : "订单处理中",
      text: status === "unpaid" ? "完成支付后开始准备商品" : "Sony Alpha Store 正在准备商品",
      done: status === "paid" || fulfilledStatus,
    },
    {
      title: fulfilledStatus ? "已确认收货" : "等待收货",
      text: fulfilledStatus ? formatPaymentTime(order.receivedAt) : order.delivery || "配送方式待确认",
      done: fulfilledStatus,
    },
  ];
}

function setManageMode(isEnabled) {
  orderState.manageMode = Boolean(isEnabled && getVisibleOrders().length);
  if (!orderState.manageMode) {
    orderState.selectedOrderIds.clear();
  }
  renderOrdersPage();
}

function setOrderFilter(filterName) {
  if (!ORDER_FILTERS[filterName]) return;
  orderState.activeView = "orders";
  orderState.activeFilter = filterName;
  orderState.manageMode = false;
  orderState.reviewOrderId = null;
  orderState.reviewViewOrderId = null;
  orderState.selectedOrderIds.clear();
  renderOrdersPage();
  document.querySelector(".orders-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setOrdersView(viewName) {
  orderState.activeView = viewName === "footprints" ? "footprints" : "orders";
  orderState.manageMode = false;
  orderState.reviewOrderId = null;
  orderState.reviewViewOrderId = null;
  orderState.selectedOrderIds.clear();
  if (orderState.activeView === "orders") {
    orderState.activeFilter = "all";
  }
  renderOrdersPage();
}

function toggleOrderSelection(orderId) {
  if (!orderState.manageMode || !orderId) return;

  if (orderState.selectedOrderIds.has(orderId)) {
    orderState.selectedOrderIds.delete(orderId);
  } else {
    orderState.selectedOrderIds.add(orderId);
  }
  renderOrdersPage();
}

function setActiveOrder(orderId) {
  if (orderState.manageMode) {
    toggleOrderSelection(orderId);
    return;
  }

  orderState.activeOrderId = orderId;
  if (orderState.reviewOrderId !== orderId) {
    orderState.reviewOrderId = null;
  }
  if (orderState.reviewViewOrderId !== orderId) {
    orderState.reviewViewOrderId = null;
  }
  renderOrdersPage();
}

function openModal(modal) {
  modal?.classList.add("is-open");
  modal?.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal?.classList.remove("is-open");
  modal?.setAttribute("aria-hidden", "true");
}

function openPaymentModal(modal) {
  openModal(modal);
}

function closePaymentModal(modal) {
  closeModal(modal);
}

function getActivePaymentOrder() {
  if (!activePaymentOrderId) return null;
  return orderState.orders.find((order) => order.orderId === activePaymentOrderId) || null;
}

function stopOrdersCheckoutTimer() {
  window.clearInterval(ordersCheckoutTimerId);
  ordersCheckoutTimerId = null;
}

function clearOrdersPaymentTimer() {
  window.clearTimeout(ordersPaymentTimerId);
  ordersPaymentTimerId = null;
}

function updateOrdersCheckoutTotals(order = getActivePaymentOrder()) {
  if (!order) return;
  const productTotal = Number(order.productTotal || 0);
  const delivery = orderRefs.checkoutDelivery?.value || order.delivery || "标准配送";
  const deliveryFee = checkoutDeliveryFees[delivery] ?? Number(order.deliveryFee || 0);
  const total = productTotal + deliveryFee;
  if (orderRefs.checkoutProductsTotal) orderRefs.checkoutProductsTotal.textContent = formatPrice(productTotal);
  if (orderRefs.checkoutDeliveryFee) orderRefs.checkoutDeliveryFee.textContent = formatPrice(deliveryFee);
  if (orderRefs.checkoutTotal) orderRefs.checkoutTotal.textContent = formatPrice(total);
}

function updateOrdersCheckoutTimer() {
  const order = getActivePaymentOrder();
  if (!order) {
    stopOrdersCheckoutTimer();
    return;
  }

  const seconds = Math.max(0, Math.ceil((new Date(order.expiresAt).getTime() - Date.now()) / 1000));
  if (orderRefs.checkoutTimer) orderRefs.checkoutTimer.textContent = formatCheckoutTime(seconds);

  if (seconds <= 0 || getOrderStatus(order) === "closed") {
    order.status = "closed";
    order.closedAt = order.closedAt || new Date().toISOString();
    persistOrders();
    closeOrdersCheckout();
    renderOrdersPage();
    return;
  }

  if (!isOrderUnpaid(order)) {
    closeOrdersCheckout();
    renderOrdersPage();
  }
}

function startOrdersCheckoutTimer() {
  stopOrdersCheckoutTimer();
  updateOrdersCheckoutTimer();
  ordersCheckoutTimerId = window.setInterval(updateOrdersCheckoutTimer, 1000);
}

function setOrdersCheckoutError(message) {
  if (!orderRefs.checkoutError) return;
  orderRefs.checkoutError.textContent = message;
  orderRefs.checkoutError.classList.toggle("hidden", !message);
}

function markOrdersCheckoutField(field) {
  field?.classList.add("is-invalid");
  field?.setAttribute("aria-invalid", "true");
}

function clearOrdersCheckoutFieldError(field) {
  field?.classList.remove("is-invalid");
  field?.removeAttribute("aria-invalid");
}

function syncOrdersPaymentLogo() {
  const value = orderRefs.checkoutPayment?.value || "WeChat Pay";
  if (orderRefs.checkoutPaymentLogo) {
    orderRefs.checkoutPaymentLogo.src = checkoutPaymentLogos[value] || checkoutPaymentLogos["WeChat Pay"];
    orderRefs.checkoutPaymentLogo.alt = value;
  }
  orderRefs.checkoutCardFields?.classList.toggle("hidden", !checkoutCardPaymentTypes.has(value));
  if (orderRefs.payButton) {
    orderRefs.payButton.textContent = checkoutCardPaymentTypes.has(value) ? "确认支付" : "继续";
  }
}

function ensureCheckoutOption(select, value) {
  if (!select || !value) return;
  const hasOption = Array.from(select.options).some((option) => option.value === value || option.textContent === value);
  if (hasOption) {
    select.value = value;
    return;
  }
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
  select.value = value;
}

function toCheckoutRegionItem(item) {
  if (typeof item === "string") return { name: item, children: [] };
  return {
    name: item?.name || item?.label || item?.value || "",
    children: Array.isArray(item?.children) ? item.children : [],
  };
}

function normalizeCheckoutRegionSource(data) {
  if (Array.isArray(data)) {
    return data.map(toCheckoutRegionItem).filter((item) => item.name);
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

function fillOrdersCheckoutSelect(select, placeholder, options = []) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = placeholder;
  select.appendChild(empty);
  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = option;
    item.textContent = option;
    select.appendChild(item);
  });
  if (current) ensureCheckoutOption(select, current);
}

async function loadOrdersCheckoutRegions() {
  if (ordersCheckoutRegionSource.length) return ordersCheckoutRegionSource;

  try {
    const response = await fetch(checkoutRegionDataUrl, { cache: "force-cache" });
    if (response.ok) {
      const source = normalizeCheckoutRegionSource(await response.json());
      if (source.length) {
        ordersCheckoutRegionSource = source;
        return ordersCheckoutRegionSource;
      }
    }
  } catch (error) {}

  ordersCheckoutRegionSource = [
    { name: "北京市", children: [{ name: "北京市", children: ["东城区", "西城区", "朝阳区", "海淀区"] }] },
    { name: "上海市", children: [{ name: "上海市", children: ["黄浦区", "徐汇区", "静安区", "浦东新区"] }] },
    { name: "江苏省", children: [{ name: "南京市", children: ["玄武区", "秦淮区", "建邺区"] }, { name: "苏州市", children: ["姑苏区", "虎丘区", "吴中区"] }] },
    { name: "香港特别行政区", children: [{ name: "香港", children: ["中西区", "湾仔区", "东区"] }] },
    { name: "澳门特别行政区", children: [{ name: "澳门", children: ["花地玛堂区", "大堂区", "风顺堂区"] }] },
    { name: "台湾省", children: [{ name: "台北市", children: ["中正区", "大同区", "中山区"] }] },
  ];
  return ordersCheckoutRegionSource;
}

async function bindOrdersCheckoutAddressFields() {
  const { checkoutProvince: province, checkoutCity: city, checkoutDistrict: district } = orderRefs;
  if (!province || !city || !district) return;

  await loadOrdersCheckoutRegions();
  fillOrdersCheckoutSelect(province, "省 / 直辖市", ordersCheckoutRegionSource.map((item) => item.name));

  province.addEventListener("change", () => {
    const selectedProvince = ordersCheckoutRegionSource.find((item) => item.name === province.value);
    const cities = (selectedProvince?.children || []).map(toCheckoutRegionItem).filter((item) => item.name);
    fillOrdersCheckoutSelect(city, "城市", cities.map((item) => item.name));
    fillOrdersCheckoutSelect(district, "区 / 县", []);
    syncActivePaymentOrderFromForm();
  });

  city.addEventListener("change", () => {
    const selectedProvince = ordersCheckoutRegionSource.find((item) => item.name === province.value);
    const selectedCity = (selectedProvince?.children || [])
      .map(toCheckoutRegionItem)
      .find((item) => item.name === city.value);
    const districts = (selectedCity?.children || []).map(toCheckoutRegionItem).map((item) => item.name).filter(Boolean);
    fillOrdersCheckoutSelect(district, "区 / 县", districts);
    syncActivePaymentOrderFromForm();
  });

  district.addEventListener("change", syncActivePaymentOrderFromForm);
}

function normalizeRegionName(value) {
  return normalizeSpaces(value)
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|自治州|自治县|自治旗|省|市|区|县|旗/g, "")
    .trim();
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

function getDisplayNameCandidates(reverseResult) {
  return [
    reverseResult?.display_name,
    reverseResult?.name,
  ]
    .filter(Boolean)
    .join(",")
    .split(/[,，]/)
    .map((item) => normalizeSpaces(item))
    .filter(Boolean);
}

function findRegionItemMatch(items, candidates) {
  const normalizedCandidates = (Array.isArray(candidates) ? candidates : [candidates])
    .map((item) => normalizeRegionName(item))
    .filter(Boolean);
  const regionItems = items.map(toCheckoutRegionItem).filter((item) => item.name);

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

function findCityByDistrictCandidate(cityItems, districtCandidates) {
  for (const cityItem of cityItems) {
    const districtItem = findRegionItemMatch(cityItem.children || [], districtCandidates);
    if (districtItem) return { cityItem, districtItem };
  }
  return { cityItem: null, districtItem: null };
}

function isMunicipalityRegion(name) {
  return ["北京市", "上海市", "天津市", "重庆市", "香港特别行政区", "澳门特别行政区"].includes(name);
}

function buildOrdersCheckoutAddressDetail(address = {}, fallbackName = "") {
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
    if (!unique.includes(value)) unique.push(value);
  });

  return unique.length ? unique.join(" ") : normalizeSpaces(fallbackName);
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

async function applyOrdersCheckoutAddressSelection(reverseResult) {
  const address = reverseResult?.address || {};
  const displayNameCandidates = getDisplayNameCandidates(reverseResult);
  const provinceField = orderRefs.checkoutProvince;
  const cityField = orderRefs.checkoutCity;
  const districtField = orderRefs.checkoutDistrict;
  const detailField = orderRefs.checkoutAddressDetail;
  if (!provinceField || !cityField || !districtField || !detailField) return null;

  await loadOrdersCheckoutRegions();

  const provinceCandidates = getAddressCandidates(address, ["province", "state", "region"], displayNameCandidates);
  const provinceItem = findRegionItemMatch(ordersCheckoutRegionSource, provinceCandidates);

  if (provinceItem) {
    provinceField.value = provinceItem.name;
  }

  const cityItems = (provinceItem?.children || []).map(toCheckoutRegionItem).filter((item) => item.name);
  fillOrdersCheckoutSelect(cityField, "城市", cityItems.map((item) => item.name));

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
  }

  const districtOptions = (cityItem?.children || []).map(toCheckoutRegionItem).map((item) => item.name).filter(Boolean);
  fillOrdersCheckoutSelect(districtField, "区 / 县", districtOptions);

  if (!districtItem) {
    districtItem = findRegionItemMatch(districtOptions.map((name) => ({ name, children: [] })), districtCandidates);
  }

  if (!districtItem && districtOptions.length === 1) {
    districtItem = { name: districtOptions[0] };
  }

  if (districtItem) {
    districtField.value = districtItem.name;
  }

  detailField.value = buildOrdersCheckoutAddressDetail(address, reverseResult?.name || "");
  [provinceField, cityField, districtField, detailField].forEach(clearOrdersCheckoutFieldError);
  setOrdersCheckoutError("");
  syncActivePaymentOrderFromForm();

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
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("reverse_failed");
  return response.json();
}

async function reverseGeocodeOrdersCheckoutPoint(lat, lng) {
  const precise = await requestReverseGeocode(lat, lng, 18);
  const preciseAddress = precise?.address || {};
  const needsFallback =
    !normalizeSpaces(preciseAddress.city) ||
    (!normalizeSpaces(preciseAddress.district) &&
      !normalizeSpaces(preciseAddress.city_district) &&
      !normalizeSpaces(preciseAddress.county));

  if (!needsFallback) return precise;

  try {
    const broader = await requestReverseGeocode(lat, lng, 14);
    return mergeReverseGeocodeResults(precise, broader);
  } catch (error) {
    return precise;
  }
}

function ensureOrdersCheckoutAddressMap() {
  if (ordersCheckoutAddressMap || !window.L) return ordersCheckoutAddressMap;

  ordersCheckoutAddressMap = L.map("checkout-address-map", {
    zoomControl: false,
    attributionControl: true,
  }).setView([35.8617, 104.1954], 4.6);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    subdomains: "abcd",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  }).addTo(ordersCheckoutAddressMap);

  L.control.zoom({ position: "bottomright" }).addTo(ordersCheckoutAddressMap);

  ordersCheckoutAddressMap.on("click", async (event) => {
    const { lat, lng } = event.latlng;

    if (ordersCheckoutAddressMarker) {
      ordersCheckoutAddressMarker.setLatLng([lat, lng]);
    } else {
      ordersCheckoutAddressMarker = L.marker([lat, lng]).addTo(ordersCheckoutAddressMap);
    }

    if (orderRefs.addressMapNote) {
      orderRefs.addressMapNote.textContent = "正在识别地址，请稍候";
    }

    try {
      const reverseResult = await reverseGeocodeOrdersCheckoutPoint(lat, lng);
      const filled = await applyOrdersCheckoutAddressSelection(reverseResult);
      ordersCheckoutAddressMarker.bindPopup("地址已回填").openPopup();
      if (orderRefs.addressMapNote) {
        orderRefs.addressMapNote.textContent =
          filled?.province && filled?.city && filled?.district
            ? "已自动回填地址信息"
            : "已尽量回填地址，请检查并补充缺失的市区信息";
      }
      window.setTimeout(() => closePaymentModal(orderRefs.addressMapModal), 180);
    } catch (error) {
      if (orderRefs.addressMapNote) {
        orderRefs.addressMapNote.textContent = "当前位置暂时无法识别，请换一个位置再试";
      }
    }
  });

  return ordersCheckoutAddressMap;
}

function openOrdersCheckoutAddressMap() {
  openPaymentModal(orderRefs.addressMapModal);
  if (orderRefs.addressMapNote) {
    orderRefs.addressMapNote.textContent = "请在地图上单击需要配送的位置";
  }

  const map = ensureOrdersCheckoutAddressMap();
  if (!map) {
    if (orderRefs.addressMapNote) {
      orderRefs.addressMapNote.textContent = "地图组件加载失败，请稍后重试";
    }
    return;
  }

  window.setTimeout(() => map.invalidateSize(), 120);
}

function getOrdersCheckoutAddressText() {
  return [
    orderRefs.checkoutProvince?.value,
    orderRefs.checkoutCity?.value,
    orderRefs.checkoutDistrict?.value,
    orderRefs.checkoutAddressDetail?.value,
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join(" ");
}

function setOrdersCheckoutRegionValues(order = {}) {
  ensureCheckoutOption(orderRefs.checkoutProvince, order.province || "");
  const selectedProvince = ordersCheckoutRegionSource.find((item) => item.name === orderRefs.checkoutProvince?.value);
  const cities = (selectedProvince?.children || []).map(toCheckoutRegionItem).filter((item) => item.name);
  if (cities.length) fillOrdersCheckoutSelect(orderRefs.checkoutCity, "城市", cities.map((item) => item.name));

  ensureCheckoutOption(orderRefs.checkoutCity, order.city || "");
  const selectedCity = cities.find((item) => item.name === orderRefs.checkoutCity?.value);
  const districts = (selectedCity?.children || []).map(toCheckoutRegionItem).map((item) => item.name).filter(Boolean);
  if (districts.length) fillOrdersCheckoutSelect(orderRefs.checkoutDistrict, "区 / 县", districts);

  ensureCheckoutOption(orderRefs.checkoutDistrict, order.district || "");
}

function openOrdersCheckout(order) {
  if (!order || !isOrderUnpaid(order)) return;
  activePaymentOrderId = order.orderId;
  if (!order.expiresAt) {
    order.expiresAt = new Date(Date.now() + checkoutDurationSeconds * 1000).toISOString();
    persistOrders();
  }

  orderRefs.checkoutLastName.value = order.lastName && order.lastName !== "未填写" ? order.lastName : "";
  orderRefs.checkoutFirstName.value = order.firstName && order.firstName !== "未填写" ? order.firstName : "";
  if (!orderRefs.checkoutLastName.value && !orderRefs.checkoutFirstName.value && order.name && order.name !== "未填写") {
    orderRefs.checkoutFirstName.value = order.name;
  }
  orderRefs.checkoutPhone.value = String(order.phone || "").replace(/^\+86\s*/, "").replace("未填写", "");
  orderRefs.checkoutEmail.value = order.email && order.email !== "未填写" ? order.email : "";
  setOrdersCheckoutRegionValues(order);
  orderRefs.checkoutAddressDetail.value = order.addressDetail && order.addressDetail !== "未填写" ? order.addressDetail : "";
  if (!orderRefs.checkoutAddressDetail.value && order.address && order.address !== "未填写") {
    orderRefs.checkoutAddressDetail.value = order.address;
  }
  orderRefs.checkoutDelivery.value = order.delivery || "标准配送";
  orderRefs.checkoutPayment.value = order.payment || "WeChat Pay";
  orderRefs.checkoutCardNumber.value = "";
  orderRefs.checkoutCardCvv.value = "";
  setOrdersCheckoutError("");
  document.querySelectorAll(".orders-page .shop-checkout-dialog .is-invalid").forEach(clearOrdersCheckoutFieldError);
  syncOrdersPaymentLogo();
  updateOrdersCheckoutTotals(order);
  openPaymentModal(orderRefs.checkoutPanel);
  startOrdersCheckoutTimer();
}

function syncActivePaymentOrderFromForm() {
  const order = getActivePaymentOrder();
  if (!order || !isOrderUnpaid(order)) return null;
  const delivery = orderRefs.checkoutDelivery?.value || order.delivery || "标准配送";
  const deliveryFee = checkoutDeliveryFees[delivery] ?? Number(order.deliveryFee || 0);
  const lastName = orderRefs.checkoutLastName?.value || "";
  const firstName = orderRefs.checkoutFirstName?.value || "";
  const address = getOrdersCheckoutAddressText() || "未填写";
  const updated = {
    ...order,
    lastName,
    firstName,
    name: `${lastName}${firstName}` || "未填写",
    phone: `+86 ${orderRefs.checkoutPhone?.value || "未填写"}`,
    email: orderRefs.checkoutEmail?.value || "未填写",
    province: orderRefs.checkoutProvince?.value || "",
    city: orderRefs.checkoutCity?.value || "",
    district: orderRefs.checkoutDistrict?.value || "",
    addressDetail: orderRefs.checkoutAddressDetail?.value || "",
    address,
    delivery,
    payment: orderRefs.checkoutPayment?.value || "WeChat Pay",
    deliveryFee,
    total: Number(order.productTotal || 0) + deliveryFee,
  };
  const index = orderState.orders.findIndex((item) => item.orderId === updated.orderId);
  if (index >= 0) orderState.orders[index] = updated;
  persistOrders();
  renderOrdersPage();
  return updated;
}

function closeOrdersCheckout() {
  syncActivePaymentOrderFromForm();
  clearOrdersPaymentTimer();
  closePaymentModal(orderRefs.checkoutPanel);
  closePaymentModal(orderRefs.addressMapModal);
  closePaymentModal(orderRefs.qrModal);
  closePaymentModal(orderRefs.paymentLoading);
}

function validateOrdersCheckout() {
  setOrdersCheckoutError("");
  const required = [
    [orderRefs.checkoutLastName, "请填写姓"],
    [orderRefs.checkoutFirstName, "请填写名"],
    [orderRefs.checkoutPhone, "请填写联系电话"],
    [orderRefs.checkoutEmail, "请填写邮箱"],
    [orderRefs.checkoutProvince, "请选择省 / 直辖市"],
    [orderRefs.checkoutCity, "请选择城市"],
    [orderRefs.checkoutDistrict, "请选择区 / 县"],
    [orderRefs.checkoutAddressDetail, "请填写详细地址"],
  ];
  if (checkoutCardPaymentTypes.has(orderRefs.checkoutPayment?.value)) {
    required.push([orderRefs.checkoutCardNumber, "请填写卡号"]);
    required.push([orderRefs.checkoutCardCvv, "请填写 CVV"]);
  }
  const missing = required.filter(([field]) => !String(field?.value || "").trim());
  missing.forEach(([field]) => markOrdersCheckoutField(field));
  if (missing.length) {
    setOrdersCheckoutError(missing[0][1]);
    missing[0][0]?.focus();
    return false;
  }
  return true;
}

function showOrdersQrPayment() {
  const payment = orderRefs.checkoutPayment?.value || "WeChat Pay";
  if (orderRefs.qrLogo) {
    orderRefs.qrLogo.src = checkoutPaymentLogos[payment] || checkoutPaymentLogos["WeChat Pay"];
    orderRefs.qrLogo.alt = payment;
  }
  if (orderRefs.qrName) orderRefs.qrName.textContent = payment;
  openPaymentModal(orderRefs.qrModal);
}

function renderOrdersSuccessDetails(order) {
  if (!orderRefs.successDetails || !order) return;
  const itemRows = (order.items || []).map((item) => `
    <article class="shop-success-item">
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <span>数量 ${item.quantity || 1} · 单价 ${formatPrice(item.price)}</span>
      </div>
      <em>${formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}</em>
    </article>
  `).join("");

  orderRefs.successDetails.innerHTML = `
    <div class="shop-success-row"><span>订单编号</span><strong>${escapeHTML(order.orderId)}</strong></div>
    <div class="shop-success-row"><span>支付时间</span><strong>${escapeHTML(formatPaymentTime(order.paidAt))}</strong></div>
    <div class="shop-success-row"><span>收件人</span><strong>${escapeHTML(order.name)}</strong></div>
    <div class="shop-success-row"><span>联系电话</span><strong>${escapeHTML(order.phone)}</strong></div>
    <div class="shop-success-row"><span>配送地址</span><strong>${escapeHTML(order.address)}</strong></div>
    <div class="shop-success-row"><span>支付方式</span><strong>${escapeHTML(order.payment)}</strong></div>
    <section class="shop-success-products">${itemRows}</section>
    <div class="shop-success-row shop-success-total"><span>实付金额</span><strong>${formatPrice(order.total)}</strong></div>
  `;
}

function showOrdersPaymentSuccess() {
  clearOrdersPaymentTimer();
  const order = syncActivePaymentOrderFromForm();
  if (!order) return;
  const paidOrder = {
    ...order,
    status: "paid",
    paidAt: new Date().toISOString(),
  };
  const index = orderState.orders.findIndex((item) => item.orderId === paidOrder.orderId);
  if (index >= 0) orderState.orders[index] = paidOrder;
  persistOrders();
  stopOrdersCheckoutTimer();
  renderOrdersSuccessDetails(paidOrder);
  closePaymentModal(orderRefs.paymentLoading);
  closePaymentModal(orderRefs.qrModal);
  openPaymentModal(orderRefs.paymentSuccess);
  renderOrdersPage();
}

function runOrdersPaymentSimulation() {
  clearOrdersPaymentTimer();
  closePaymentModal(orderRefs.qrModal);
  openPaymentModal(orderRefs.paymentLoading);
  ordersPaymentTimerId = window.setTimeout(showOrdersPaymentSuccess, 3000);
}

function handleOrdersCheckoutPayment() {
  updateOrdersCheckoutTimer();
  if (!validateOrdersCheckout()) return;
  syncActivePaymentOrderFromForm();
  if (checkoutCardPaymentTypes.has(orderRefs.checkoutPayment?.value)) {
    runOrdersPaymentSimulation();
    return;
  }
  showOrdersQrPayment();
}

function closeOrdersPaymentSuccess() {
  closePaymentModal(orderRefs.paymentSuccess);
  closeOrdersCheckout();
  activePaymentOrderId = null;
}

function openDeleteConfirm() {
  if (!orderState.selectedOrderIds.size) return;

  orderState.orders = closeExpiredOrders(orderState.orders);
  const selectedOrders = getSelectedOrders();
  const hasBlockedOrder = selectedOrders.some((order) => !isOrderDeletable(order));
  if (hasBlockedOrder) {
    openModal(orderRefs.deleteBlocked);
    return;
  }

  openModal(orderRefs.deleteConfirm);
}

function closeDeleteConfirm() {
  closeModal(orderRefs.deleteConfirm);
}

function closeDeleteBlocked() {
  closeModal(orderRefs.deleteBlocked);
}

function deleteSelectedOrders() {
  if (!orderState.selectedOrderIds.size) return;

  orderState.orders = closeExpiredOrders(orderState.orders);
  const selectedOrders = getSelectedOrders();
  const hasBlockedOrder = selectedOrders.some((order) => !isOrderDeletable(order));
  if (hasBlockedOrder) {
    closeDeleteConfirm();
    openModal(orderRefs.deleteBlocked);
    return;
  }

  orderState.orders = orderState.orders.filter((order) => !orderState.selectedOrderIds.has(order.orderId));
  if (orderState.activeOrderId && !orderState.orders.some((order) => order.orderId === orderState.activeOrderId)) {
    orderState.activeOrderId = orderState.orders[0]?.orderId || null;
  }
  orderState.selectedOrderIds.clear();
  orderState.manageMode = false;
  persistOrders();
  closeDeleteConfirm();
  renderOrdersPage();
}

function openReceiveConfirm() {
  const order = getActiveOrder();
  if (!order || !isOrderPaid(order)) return;
  openModal(orderRefs.receiveConfirm);
}

function closeReceiveConfirm() {
  closeModal(orderRefs.receiveConfirm);
}

function confirmActiveOrderReceipt() {
  const order = getActiveOrder();
  if (!order || !isOrderPaid(order)) return;

  order.status = "completed";
  order.receivedAt = new Date().toISOString();
  persistOrders();
  closeReceiveConfirm();
  renderOrdersPage();
}

function openOrderReview(orderId) {
  const order = orderState.orders.find((item) => item.orderId === orderId);
  if (!order || !isOrderAwaitingReview(order)) return;

  orderState.activeView = "orders";
  orderState.activeOrderId = orderId;
  orderState.reviewOrderId = orderId;
  orderState.reviewViewOrderId = null;
  orderState.manageMode = false;
  orderState.selectedOrderIds.clear();
  renderOrdersPage();
}

function closeOrderReview() {
  orderState.reviewOrderId = null;
  renderOrdersPage();
}

function viewOrderReview(orderId) {
  const order = orderState.orders.find((item) => item.orderId === orderId);
  if (!order || !order.reviewedAt) return;

  orderState.activeView = "orders";
  orderState.activeOrderId = orderId;
  orderState.reviewOrderId = null;
  orderState.reviewViewOrderId = orderId;
  orderState.manageMode = false;
  orderState.selectedOrderIds.clear();
  renderOrdersPage();
}

function closeOrderReviewView() {
  orderState.reviewViewOrderId = null;
  renderOrdersPage();
}

function completeOrderReview(orderId, review = {}) {
  const order = orderState.orders.find((item) => item.orderId === orderId);
  if (!order || !isOrderAwaitingReview(order)) return;
  const rating = Number(review.rating || 0);
  if (!rating) return;

  order.status = "reviewed";
  order.reviewedAt = new Date().toISOString();
  order.review = {
    rating,
    content: String(review.content || "").trim(),
  };
  orderState.reviewOrderId = null;
  orderState.reviewViewOrderId = orderId;
  persistOrders();
  renderOrdersPage();
}

function renderSummary() {
  if (!orderRefs.summary) return;
  const count = orderState.orders.length;
  const completedCount = orderState.orders.filter(isOrderCompleted).length;
  const total = orderState.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  orderRefs.summary.textContent = count
    ? `${count} 个订单 · 已完成 ${completedCount} 个 · 累计 ${formatPrice(total)}`
    : "暂无订单";
}

function renderQuickPanel() {
  orderState.orders = closeExpiredOrders(orderState.orders);
  orderState.footprints = loadProductFootprints();
  const unpaidCount = orderState.orders.filter(isOrderUnpaid).length;
  const paidCount = orderState.orders.filter(isOrderPaid).length;
  const reviewCount = orderState.orders.filter(isOrderReviewRelated).length;
  const counts = {
    countPay: unpaidCount,
    countReceive: paidCount,
    countUse: 0,
    countReview: reviewCount,
    countAftersale: 0,
    countAll: orderState.orders.length,
  };

  Object.entries(counts).forEach(([key, value]) => {
    if (!orderRefs[key]) return;
    orderRefs[key].textContent = key === "countAll" || value > 0 ? String(value) : "";
  });

  if (orderRefs.footprintCount) {
    orderRefs.footprintCount.textContent = String(orderState.footprints.length);
  }

  orderRefs.quickPanel?.querySelectorAll("[data-orders-view]").forEach((button) => {
    const isActive = button.dataset.ordersView === orderState.activeView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  orderRefs.quickPanel?.querySelectorAll("[data-order-filter]").forEach((button) => {
    const isActive = orderState.activeView === "orders" && button.dataset.orderFilter === orderState.activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function renderFootprintsView() {
  if (!orderRefs.footprintsView || !orderRefs.footprintsGrid || !orderRefs.footprintsEmpty) return;

  const isOpen = orderState.activeView === "footprints";
  orderRefs.footprintsView.classList.toggle("hidden", !isOpen);
  orderRefs.workspace?.classList.toggle("hidden", isOpen);
  if (!isOpen) return;

  orderState.footprints = loadProductFootprints();
  const hasFootprints = orderState.footprints.length > 0;
  orderRefs.footprintsGrid.classList.toggle("hidden", !hasFootprints);
  orderRefs.footprintsEmpty.classList.toggle("hidden", hasFootprints);
  if (orderRefs.clearFootprints) {
    orderRefs.clearFootprints.disabled = !hasFootprints;
  }
  orderRefs.footprintsGrid.innerHTML = orderState.footprints.map((item) => {
    const params = new URLSearchParams();
    if (item.model) params.set("model", item.model);
    if (item.sku8D) params.set("sku", item.sku8D);
    const href = `shop.html${params.toString() ? `?${params.toString()}` : ""}`;

    return `
      <article class="orders-footprint-card">
        <a href="${escapeHTML(href)}" aria-label="查看 ${escapeHTML(item.title || item.model)}">
          <div class="orders-footprint-media">
            ${item.image ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title || item.model)}" loading="lazy">` : ""}
          </div>
          <div class="orders-footprint-copy">
            <h3>${escapeHTML(item.title || item.model || "Sony 产品")}</h3>
            <span>${escapeHTML(item.description || item.category || "索尼影像产品")}</span>
            <em>${escapeHTML(formatFootprintTime(item.viewedAt))}</em>
          </div>
        </a>
      </article>
    `;
  }).join("");
}

function renderOrderList() {
  if (!orderState.orders.length) {
    orderRefs.list.innerHTML = `
      <div class="orders-empty-list">
        <h3>暂无订单</h3>
        <a href="shop.html">前往影像商城</a>
      </div>
    `;
    return;
  }

  const visibleOrders = getVisibleOrders();
  if (!visibleOrders.length) {
    orderRefs.list.innerHTML = `
      <div class="orders-empty-list">
        <h3>${escapeHTML(getActiveFilterConfig().empty)}</h3>
        <button type="button" class="orders-empty-filter-reset" data-order-filter="all">查看全部订单</button>
      </div>
    `;
    return;
  }

  orderRefs.list.innerHTML = visibleOrders.map((order) => {
    const isActive = order.orderId === orderState.activeOrderId;
    const isSelected = orderState.selectedOrderIds.has(order.orderId);
    const itemCount = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const completed = isOrderCompleted(order);
    const canReview = isOrderAwaitingReview(order);
    const canViewReview = ["all", "review"].includes(orderState.activeFilter) && Boolean(order.reviewedAt);
    const reviewAction = canReview
      ? `<button class="orders-review-button" type="button" data-order-review="${escapeHTML(order.orderId)}">去评价</button>`
      : canViewReview
        ? `<button class="orders-review-button" type="button" data-order-view-review="${escapeHTML(order.orderId)}">查看评价</button>`
        : "";

    return `
      <article class="orders-card${isActive ? " is-active" : ""}${isSelected ? " is-selected" : ""}${orderState.manageMode ? " is-managing" : ""}${reviewAction ? " has-review-action" : ""}" data-order-id="${escapeHTML(order.orderId)}" tabindex="0" role="button">
        ${orderState.manageMode ? `
          <button class="orders-select" type="button" data-order-select="${escapeHTML(order.orderId)}" aria-pressed="${isSelected ? "true" : "false"}">
            <span></span>
          </button>
        ` : ""}
        <div>
          <h3>${escapeHTML(order.orderId)}</h3>
          <span>${escapeHTML(formatPaymentTime(order.paidAt))}</span>
        </div>
        <strong>${formatPrice(order.total || 0)}</strong>
        <em>${itemCount} 件商品</em>
        ${!orderState.manageMode ? reviewAction : ""}
        <span class="orders-status-badge${completed ? " is-completed" : ""}">${getOrderStatusLabel(order)}</span>
      </article>
    `;
  }).join("");
}

function renderOrderReview(order) {
  orderRefs.detail.classList.add("is-reviewing");
  const products = (order.items || [])
    .map((item) => `<span>${escapeHTML(item.title)} x ${item.quantity || 1}</span>`)
    .join("");

  orderRefs.detail.innerHTML = `
    <form class="orders-review-panel" id="orders-review-form" data-order-id="${escapeHTML(order.orderId)}">
      <div class="orders-review-hero">
        <div>
          <h2>评价订单</h2>
          <span>${escapeHTML(order.orderId)}</span>
        </div>
        <button class="orders-review-close" type="button" id="orders-review-cancel">返回详情</button>
      </div>
      <section class="orders-review-products" aria-label="评价商品">
        ${products || "<span>Sony Alpha 商品</span>"}
      </section>
      <section class="orders-review-section">
        <h3>整体体验</h3>
        <div class="orders-review-rating" role="radiogroup" aria-label="评价星级">
          ${[5, 4, 3, 2, 1].map((value) => `
            <label>
              <input type="radio" name="rating" value="${value}" required />
              <span>${"★".repeat(value)}</span>
            </label>
          `).join("")}
        </div>
      </section>
      <label class="orders-review-section">
        <h3>评价内容</h3>
        <textarea name="content" rows="7" placeholder="分享你的真实使用感受"></textarea>
      </label>
      <div class="orders-review-actions">
        <button class="orders-review-submit" type="submit">提交评价</button>
      </div>
    </form>
  `;
  syncOrderReviewStars(orderRefs.detail.querySelector(".orders-review-rating"));
}

function syncOrderReviewStars(ratingGroup, hoverValue = null) {
  if (!ratingGroup) return;
  const checked = ratingGroup.querySelector("input[name='rating']:checked");
  const activeValue = Number(hoverValue || checked?.value || 0);
  ratingGroup.querySelectorAll("label").forEach((label) => {
    const input = label.querySelector("input[name='rating']");
    const value = Number(input?.value || 0);
    label.classList.toggle("is-filled", value > 0 && value <= activeValue);
    label.classList.toggle("is-selected", Boolean(input?.checked));
  });
}

function renderOrderReviewView(order) {
  orderRefs.detail.classList.add("is-reviewing");
  const review = order.review || {};
  const rating = Math.max(1, Math.min(5, Number(review.rating || 5)));
  const products = (order.items || [])
    .map((item) => `<span>${escapeHTML(item.title)} x ${item.quantity || 1}</span>`)
    .join("");
  const content = String(review.content || "").trim() || "用户未填写文字评价。";

  orderRefs.detail.innerHTML = `
    <section class="orders-review-panel orders-review-result" aria-label="订单评价">
      <div class="orders-review-hero">
        <div>
          <h2>订单评价</h2>
          <span>${escapeHTML(order.orderId)}</span>
        </div>
        <button class="orders-review-close" type="button" id="orders-review-view-close">返回详情</button>
      </div>
      <section class="orders-review-products" aria-label="评价商品">
        ${products || "<span>Sony Alpha 商品</span>"}
      </section>
      <section class="orders-review-section">
        <h3>评价星级</h3>
        <strong class="orders-review-result-stars">${"★".repeat(rating)}</strong>
      </section>
      <section class="orders-review-section">
        <h3>评价内容</h3>
        <p class="orders-review-result-copy">${escapeHTML(content)}</p>
      </section>
      <div class="orders-review-meta">提交时间：${escapeHTML(formatPaymentTime(order.reviewedAt))}</div>
    </section>
  `;
}

function renderOrderDetail() {
  orderRefs.detail.classList.remove("is-reviewing");
  const order = getActiveOrder();
  if (!order) {
    orderRefs.detail.innerHTML = `
      <div class="orders-empty-detail">
        <h2>选择一张订单</h2>
        <span>订单的商品、配送、支付与状态会显示在这里。</span>
      </div>
    `;
    return;
  }

  if (orderState.reviewOrderId === order.orderId && isOrderAwaitingReview(order)) {
    renderOrderReview(order);
    return;
  }

  if (orderState.reviewViewOrderId === order.orderId && order.reviewedAt) {
    renderOrderReviewView(order);
    return;
  }

  const status = getOrderStatus(order);
  const completed = isOrderCompleted(order);
  const paid = isOrderPaid(order);
  const unpaid = isOrderUnpaid(order);
  const canReview = isOrderAwaitingReview(order);
  const receiptButtonLabel = status === "reviewed"
    ? "已评价"
    : completed
      ? "已确认收货"
      : status === "closed"
        ? "订单已关闭"
        : "确认收货";
  const items = (order.items || []).map((item) => `
    <li>
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <span>${formatPrice(item.price)} x ${item.quantity || 1}</span>
      </div>
      <b>${formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}</b>
    </li>
  `).join("");

  const statusSteps = getOrderStatusSteps(order);
  const statusLabel = getOrderStatusLabel(order);
  const timeline = statusSteps.map((step) => `
    <li class="${step.done ? "is-done" : ""}">
      <i></i>
      <div>
        <strong>${escapeHTML(step.title)}</strong>
        <span>${escapeHTML(step.text)}</span>
      </div>
    </li>
  `).join("");

  orderRefs.detail.innerHTML = `
    <div class="orders-detail-hero">
      <div>
        <h2>${escapeHTML(order.orderId)}</h2>
        <strong>${formatPrice(order.total || 0)}</strong>
      </div>
      <div class="orders-detail-actions">
        <span class="orders-detail-status${completed ? " is-completed" : ""}">当前状态：${escapeHTML(statusLabel)}</span>
        ${
          unpaid
            ? `<button class="orders-receive-button" type="button" id="orders-go-pay">去支付</button>`
            : canReview
              ? `<button class="orders-receive-button" type="button" id="orders-go-review">去评价</button>`
              : `<button class="orders-receive-button" type="button" id="orders-confirm-receipt" ${paid ? "" : "disabled"}>
                ${receiptButtonLabel}
              </button>`
        }
      </div>
    </div>
    <section class="orders-detail-section">
      <h3>商品明细</h3>
      <ul class="orders-detail-items">${items}</ul>
    </section>
    <section class="orders-info-grid" aria-label="订单信息">
      <div><span>收件人</span><strong>${escapeHTML(order.name || "未填写")}</strong></div>
      <div><span>联系电话</span><strong>${escapeHTML(order.phone || "未填写")}</strong></div>
      <div><span>配送地址</span><strong>${escapeHTML(order.address || "未填写")}</strong></div>
      <div><span>配送方式</span><strong>${escapeHTML(order.delivery || "未填写")}</strong></div>
      <div><span>支付方式</span><strong>${escapeHTML(order.payment || "未填写")}</strong></div>
      <div><span>支付时间</span><strong>${escapeHTML(formatPaymentTime(order.paidAt))}</strong></div>
    </section>
    <section class="orders-detail-section">
      <h3>费用明细</h3>
      <div class="orders-money-list">
        <div><span>商品总价</span><strong>${formatPrice(order.productTotal || 0)}</strong></div>
        <div><span>配送费</span><strong>${formatPrice(order.deliveryFee || 0)}</strong></div>
        <div><span>实付金额</span><strong>${formatPrice(order.total || 0)}</strong></div>
      </div>
    </section>
    <section class="orders-detail-section">
      <h3>订单状态</h3>
      <ol class="orders-timeline">${timeline}</ol>
    </section>
  `;
}

function syncManageUI() {
  const selectedCount = orderState.selectedOrderIds.size;
  const canManage = getVisibleOrders().length > 0;
  document.body.classList.toggle("orders-managing", orderState.manageMode);
  orderRefs.manage.textContent = orderState.manageMode ? "完成" : "管理";
  orderRefs.manage.disabled = !canManage;
  orderRefs.manage.setAttribute("aria-pressed", orderState.manageMode ? "true" : "false");
  orderRefs.bulkBar.classList.toggle("hidden", !orderState.manageMode);
  orderRefs.selectedCount.textContent = `已选择 ${selectedCount} 个订单`;
  orderRefs.deleteSelected.disabled = selectedCount === 0;
}

function renderOrdersPage() {
  const visibleOrders = getVisibleOrders();
  if (!orderState.activeOrderId && visibleOrders.length) {
    orderState.activeOrderId = visibleOrders[0].orderId;
  }
  if (orderState.activeOrderId && !visibleOrders.some((order) => order.orderId === orderState.activeOrderId)) {
    orderState.activeOrderId = visibleOrders[0]?.orderId || null;
  }
  if (!orderState.orders.length) {
    orderState.manageMode = false;
    orderState.selectedOrderIds.clear();
    orderState.activeOrderId = null;
  }

  renderSummary();
  renderQuickPanel();
  renderFootprintsView();
  renderOrderList();
  renderOrderDetail();
  syncManageUI();
}

function bindOrderEvents() {
  orderRefs.quickPanel?.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-orders-view]");
    if (viewButton) {
      event.preventDefault();
      setOrdersView(viewButton.dataset.ordersView);
      return;
    }

    const filterButton = event.target.closest("[data-order-filter]");
    if (!filterButton) return;
    event.preventDefault();
    setOrderFilter(filterButton.dataset.orderFilter);
  });

  orderRefs.footprintsView?.addEventListener("click", (event) => {
    if (event.target.closest("#orders-clear-footprints")) {
      event.preventDefault();
      clearProductFootprints();
      return;
    }

    const viewButton = event.target.closest("[data-orders-view]");
    if (!viewButton) return;
    event.preventDefault();
    setOrdersView(viewButton.dataset.ordersView);
  });

  orderRefs.manage.addEventListener("click", () => setManageMode(!orderState.manageMode));
  orderRefs.cancelManage.addEventListener("click", () => setManageMode(false));
  orderRefs.deleteSelected.addEventListener("click", openDeleteConfirm);
  orderRefs.deleteCancel.addEventListener("click", closeDeleteConfirm);
  orderRefs.deleteAccept.addEventListener("click", deleteSelectedOrders);
  orderRefs.deleteBlockedClose.addEventListener("click", closeDeleteBlocked);
  orderRefs.receiveCancel.addEventListener("click", closeReceiveConfirm);
  orderRefs.receiveAccept.addEventListener("click", confirmActiveOrderReceipt);

  orderRefs.deleteConfirm.addEventListener("click", (event) => {
    if (event.target === orderRefs.deleteConfirm) closeDeleteConfirm();
  });

  orderRefs.deleteBlocked.addEventListener("click", (event) => {
    if (event.target === orderRefs.deleteBlocked) closeDeleteBlocked();
  });

  orderRefs.receiveConfirm.addEventListener("click", (event) => {
    if (event.target === orderRefs.receiveConfirm) closeReceiveConfirm();
  });

  orderRefs.detail.addEventListener("click", (event) => {
    if (event.target.closest("#orders-go-pay")) {
      const order = getActiveOrder();
      if (order) openOrdersCheckout(order);
      return;
    }
    if (event.target.closest("#orders-go-review")) {
      const order = getActiveOrder();
      if (order) openOrderReview(order.orderId);
      return;
    }
    if (event.target.closest("#orders-review-cancel")) {
      closeOrderReview();
      return;
    }
    if (event.target.closest("#orders-review-view-close")) {
      closeOrderReviewView();
      return;
    }
    if (event.target.closest("#orders-confirm-receipt")) openReceiveConfirm();
  });

  orderRefs.detail.addEventListener("mouseover", (event) => {
    const ratingLabel = event.target.closest(".orders-review-rating label");
    if (!ratingLabel) return;
    const ratingGroup = ratingLabel.closest(".orders-review-rating");
    const value = ratingLabel.querySelector("input[name='rating']")?.value;
    syncOrderReviewStars(ratingGroup, value);
  });

  orderRefs.detail.addEventListener("mouseout", (event) => {
    const ratingGroup = event.target.closest(".orders-review-rating");
    if (!ratingGroup || ratingGroup.contains(event.relatedTarget)) return;
    syncOrderReviewStars(ratingGroup);
  });

  orderRefs.detail.addEventListener("change", (event) => {
    const ratingInput = event.target.closest(".orders-review-rating input[name='rating']");
    if (!ratingInput) return;
    syncOrderReviewStars(ratingInput.closest(".orders-review-rating"));
  });

  orderRefs.detail.addEventListener("submit", (event) => {
    const form = event.target.closest("#orders-review-form");
    if (!form) return;
    event.preventDefault();
    const formData = new FormData(form);
    completeOrderReview(form.dataset.orderId, {
      rating: formData.get("rating"),
      content: formData.get("content"),
    });
  });

  orderRefs.checkoutClose?.addEventListener("click", closeOrdersCheckout);
  orderRefs.checkoutPanel?.addEventListener("click", (event) => {
    if (event.target === orderRefs.checkoutPanel) closeOrdersCheckout();
  });
  orderRefs.addressMapOpen?.addEventListener("click", openOrdersCheckoutAddressMap);
  orderRefs.addressMapClose?.addEventListener("click", () => closePaymentModal(orderRefs.addressMapModal));
  orderRefs.addressMapModal?.addEventListener("click", (event) => {
    if (event.target === orderRefs.addressMapModal) closePaymentModal(orderRefs.addressMapModal);
  });
  orderRefs.checkoutPayment?.addEventListener("change", () => {
    syncOrdersPaymentLogo();
    syncActivePaymentOrderFromForm();
  });
  orderRefs.checkoutDelivery?.addEventListener("change", () => {
    updateOrdersCheckoutTotals();
    syncActivePaymentOrderFromForm();
  });
  document.querySelectorAll("#orders-checkout-panel input, #orders-checkout-panel select").forEach((field) => {
    field.addEventListener("pointerdown", () => {
      clearOrdersCheckoutFieldError(field);
      setOrdersCheckoutError("");
    });
    field.addEventListener("input", () => {
      clearOrdersCheckoutFieldError(field);
      setOrdersCheckoutError("");
    });
  });
  orderRefs.payButton?.addEventListener("click", handleOrdersCheckoutPayment);
  orderRefs.qrClose?.addEventListener("click", () => closePaymentModal(orderRefs.qrModal));
  orderRefs.qrComplete?.addEventListener("click", runOrdersPaymentSimulation);
  orderRefs.qrModal?.addEventListener("click", (event) => {
    if (event.target === orderRefs.qrModal) closePaymentModal(orderRefs.qrModal);
  });
  orderRefs.successClose?.addEventListener("click", closeOrdersPaymentSuccess);
  orderRefs.paymentSuccess?.addEventListener("click", (event) => {
    if (event.target === orderRefs.paymentSuccess) closeOrdersPaymentSuccess();
  });

  orderRefs.list.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-order-filter]");
    if (filterButton) {
      setOrderFilter(filterButton.dataset.orderFilter);
      return;
    }

    const selectButton = event.target.closest("[data-order-select]");
    if (selectButton) {
      toggleOrderSelection(selectButton.dataset.orderSelect);
      return;
    }

    const reviewButton = event.target.closest("[data-order-review]");
    if (reviewButton) {
      openOrderReview(reviewButton.dataset.orderReview);
      return;
    }

    const viewReviewButton = event.target.closest("[data-order-view-review]");
    if (viewReviewButton) {
      viewOrderReview(viewReviewButton.dataset.orderViewReview);
      return;
    }

    const card = event.target.closest("[data-order-id]");
    if (card) setActiveOrder(card.dataset.orderId);
  });

  orderRefs.list.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    const card = event.target.closest("[data-order-id]");
    if (!card) return;
    event.preventDefault();
    setActiveOrder(card.dataset.orderId);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDeleteConfirm();
      closeDeleteBlocked();
      closeReceiveConfirm();
      closeOrdersCheckout();
      closePaymentModal(orderRefs.addressMapModal);
      closePaymentModal(orderRefs.qrModal);
      closePaymentModal(orderRefs.paymentSuccess);
      setManageMode(false);
    }
  });
}

bindOrdersCheckoutAddressFields().catch(() => {});
bindOrderEvents();
renderOrdersPage();
window.setInterval(() => {
  const nextOrders = closeExpiredOrders(orderState.orders);
  if (JSON.stringify(nextOrders) !== JSON.stringify(orderState.orders)) {
    orderState.orders = nextOrders;
    renderOrdersPage();
  }
}, 1000);
