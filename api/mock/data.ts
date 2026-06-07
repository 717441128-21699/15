export type UserRole = 'headquarters' | 'region' | 'store';

export type Region = 'east' | 'north' | 'south' | 'west' | 'central';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  region?: Region;
  storeId?: string;
  avatar?: string;
  phone: string;
  email: string;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
  brand: string;
  address: string;
  region: Region;
  regionId: Region;
  manager: string;
  phone: string;
  openDate: string;
  area: number;
  seats: number;
  totalTables: number;
  staffCount: number;
  status: 'open' | 'closed' | 'renovation';
}

export interface DailyKPI {
  date: string;
  storeId: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  customers: number;
  foodCost: number;
  laborCost: number;
  rentCost: number;
  otherCost: number;
  profit: number;
  profitMargin: number;
  foodCostRate: number;
  laborCostRate: number;
  turnoverRate: number;
  satisfaction: number;
}

export interface Dish {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  grossMargin: number;
  salesCount: number;
  salesAmount: number;
  storeId: string;
}

export interface ApprovalStep {
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}

export interface ApprovalFlow {
  storeManagerConfirm?: ApprovalStep;
  regionManagerReview?: ApprovalStep;
  hqDirectorApprove?: ApprovalStep;
}

export interface Alert {
  id: string;
  storeId: string;
  storeName?: string;
  type: 'wastage' | 'turnover';
  level: 'level1' | 'level2';
  status: 'pending' | 'confirmed' | 'reviewed' | 'approved' | 'resolved' | 'expired';
  metricValue: number;
  threshold: number;
  consecutiveDays: number;
  createdAt: string;
  suggestion: string;
  approvalFlow?: ApprovalFlow;
}

export interface TimeSlotData {
  storeId: string;
  date: string;
  slots: Array<{
    time: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

export interface WasteCategory {
  storeId: string;
  date: string;
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

export interface Promotion {
  id: string;
  storeId: string;
  name: string;
  type: 'discount' | 'coupon' | 'bundle' | 'special';
  startDate: string;
  endDate: string;
  discount: number;
  status: 'draft' | 'active' | 'ended';
  uploadedBy: string;
  uploadedAt: string;
}

export interface SupplierQuote {
  id: string;
  supplierName: string;
  itemName: string;
  unit: string;
  price: number;
  quantity: number;
  validFrom: string;
  validTo: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface DemandForecast {
  date: string;
  storeId: string;
  items: Array<{
    name: string;
    category: string;
    forecastQuantity: number;
    actualQuantity?: number;
    unit: string;
    confidence: number;
  }>;
}

export interface WeeklyReport {
  id: string;
  week: string;
  startDate: string;
  endDate: string;
  storeId?: string;
  overallScore: number;
  revenueScore: number;
  costScore: number;
  qualityScore: number;
  serviceScore: number;
  highlights: string[];
  issues: string[];
  recommendations: string[];
}

export interface HeatmapData {
  storeId: string;
  day: string;
  data: Array<{
    hour: number;
    value: number;
  }>;
}

const cities: { city: string; region: Region }[] = [
  { city: '上海', region: 'east' },
  { city: '北京', region: 'north' },
  { city: '广州', region: 'south' },
  { city: '深圳', region: 'south' },
  { city: '杭州', region: 'east' },
  { city: '成都', region: 'west' },
  { city: '南京', region: 'east' },
  { city: '武汉', region: 'central' },
];

const cityToProvince: Record<string, string> = {
  '上海': '上海市',
  '北京': '北京市',
  '广州': '广东省',
  '深圳': '广东省',
  '杭州': '浙江省',
  '成都': '四川省',
  '南京': '江苏省',
  '武汉': '湖北省',
};

export const stores: Store[] = cities.map((c, i) => ({
  id: `STORE${String(i + 1).padStart(3, '0')}`,
  name: `味道轩·${c.city}${['旗舰店', '中心店', '万象城店', '大悦城店', '万达广场店', '太古里店', '德基店', '光谷店'][i]}`,
  city: c.city,
  province: cityToProvince[c.city] || c.city,
  brand: '味道轩',
  address: `${c.city}市${['浦东新区陆家嘴', '朝阳区建国路', '天河区天河路', '南山区科技园', '西湖区文三路', '锦江区春熙路', '玄武区中山路', '洪山区光谷广场'][i]}${100 + i * 20}号`,
  region: c.region,
  regionId: c.region,
  manager: ['张伟', '李娜', '王强', '刘芳', '陈明', '赵丽', '孙磊', '周婷'][i],
  phone: `138${String(10000000 + i * 123456).padStart(8, '0')}`,
  openDate: `202${1 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i * 3) % 28 + 1).padStart(2, '0')}`,
  area: 180 + i * 30,
  seats: 80 + i * 10,
  totalTables: 30 + i * 3,
  staffCount: 15 + i * 3,
  status: 'open',
}));

export const users: User[] = [
  {
    id: 'U001',
    username: 'admin',
    password: '123456',
    name: '系统管理员',
    role: 'headquarters',
    phone: '13900000001',
    email: 'admin@weidaoxuan.com',
  },
  {
    id: 'U002',
    username: 'east_region',
    password: '123456',
    name: '华东区经理',
    role: 'region',
    region: 'east',
    phone: '13900000002',
    email: 'east@weidaoxuan.com',
  },
  {
    id: 'U003',
    username: 'north_region',
    password: '123456',
    name: '华北区经理',
    role: 'region',
    region: 'north',
    phone: '13900000003',
    email: 'north@weidaoxuan.com',
  },
  {
    id: 'U004',
    username: 'south_region',
    password: '123456',
    name: '华南区经理',
    role: 'region',
    region: 'south',
    phone: '13900000004',
    email: 'south@weidaoxuan.com',
  },
  {
    id: 'U005',
    username: 'west_region',
    password: '123456',
    name: '西南区经理',
    role: 'region',
    region: 'west',
    phone: '13900000005',
    email: 'west@weidaoxuan.com',
  },
  {
    id: 'U006',
    username: 'central_region',
    password: '123456',
    name: '华中区经理',
    role: 'region',
    region: 'central',
    phone: '13900000006',
    email: 'central@weidaoxuan.com',
  },
  ...stores.map((store, i) => ({
    id: `U${String(10 + i).padStart(3, '0')}`,
    username: `store${i + 1}`,
    password: '123456',
    name: `${store.city}店店长`,
    role: 'store' as UserRole,
    storeId: store.id,
    phone: store.phone,
    email: `store${i + 1}@weidaoxuan.com`,
  })),
];

const baseRevenues = [85000, 78000, 72000, 80000, 68000, 75000, 70000, 65000];

function generateDailyKPIs(): DailyKPI[] {
  const kpis: DailyKPI[] = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    stores.forEach((store, i) => {
      const baseRevenue = baseRevenues[i];
      const weekendMultiplier = isWeekend ? 1.25 + (i % 3) * 0.05 : 1;
      const randomFactor = 0.85 + Math.random() * 0.3;
      const revenue = Math.round(baseRevenue * weekendMultiplier * randomFactor);

      const orders = Math.round(revenue / (45 + Math.random() * 15));
      const avgOrderValue = Math.round((revenue / orders) * 100) / 100;
      const customers = Math.round(orders * (1.8 + Math.random() * 0.6));

      const foodCost = Math.round(revenue * (0.32 + Math.random() * 0.08));
      const laborCost = Math.round(revenue * (0.22 + Math.random() * 0.06));
      const rentCost = Math.round(revenue * (0.08 + Math.random() * 0.03));
      const otherCost = Math.round(revenue * (0.05 + Math.random() * 0.04));
      const profit = revenue - foodCost - laborCost - rentCost - otherCost;

      kpis.push({
        date: dateStr,
        storeId: store.id,
        revenue,
        orders,
        avgOrderValue,
        customers,
        foodCost,
        laborCost,
        rentCost,
        otherCost,
        profit,
        profitMargin: Math.round((profit / revenue) * 10000) / 100,
        foodCostRate: Math.round((foodCost / revenue) * 10000) / 100,
        laborCostRate: Math.round((laborCost / revenue) * 10000) / 100,
        turnoverRate: Math.round(customers / store.seats * (1.5 + Math.random()) * 100) / 100,
        satisfaction: Math.round((4.2 + Math.random() * 0.7) * 10) / 10,
      });
    });
  }

  return kpis.sort((a, b) => a.date.localeCompare(b.date));
}

export const dailyKPIs: DailyKPI[] = generateDailyKPIs();

const dishCategories = ['招牌菜', '热菜', '凉菜', '汤品', '主食', '饮品', '甜点'];
const dishNames: Record<string, string[]> = {
  招牌菜: ['轩酱秘制红烧肉', '招牌酸菜鱼', '味道轩烤鸭', '秘制酱骨', '金汤佛跳墙'],
  热菜: ['宫保鸡丁', '麻婆豆腐', '鱼香肉丝', '回锅肉', '糖醋里脊', '干煸四季豆', '蒜蓉西兰花', '黑椒牛柳'],
  凉菜: ['凉拌黄瓜', '口水鸡', '夫妻肺片', '凉拌木耳', '皮蛋豆腐', '蒜泥白肉'],
  汤品: ['番茄蛋汤', '酸辣汤', '紫菜蛋花汤', '玉米排骨汤', '菌菇汤', '老鸭汤'],
  主食: ['扬州炒饭', '牛肉面', '小笼包', '葱油拌面', '米饭', '肉夹馍'],
  饮品: ['酸梅汤', '鲜榨橙汁', '柠檬茶', '豆浆', '可乐', '雪碧'],
  甜点: ['红糖糍粑', '芒果布丁', '双皮奶', '红豆沙', '冰粉'],
};

function generateDishes(): Dish[] {
  const dishes: Dish[] = [];
  let dishId = 1;

  stores.forEach((store, storeIdx) => {
    const storeFactor = 0.85 + (storeIdx % 5) * 0.08;

    dishCategories.forEach((category) => {
      const names = dishNames[category];
      names.forEach((name) => {
        const basePrice = 15 + Math.floor(Math.random() * 85);
        const price = Math.round(basePrice * (0.95 + Math.random() * 0.1) * 100) / 100;
        const cost = Math.round(price * (0.25 + Math.random() * 0.35) * 100) / 100;
        const grossMargin = Math.round(((price - cost) / price) * 10000) / 100;
        const salesCount = Math.round((50 + Math.random() * 300) * storeFactor);
        const salesAmount = Math.round(price * salesCount * 100) / 100;

        dishes.push({
          id: `DISH${String(dishId++).padStart(4, '0')}`,
          name,
          category,
          price,
          cost,
          grossMargin,
          salesCount,
          salesAmount,
          storeId: store.id,
        });
      });
    });
  });

  return dishes;
}

export const dishes: Dish[] = generateDishes();

const alertConfigs: Array<{
  type: Alert['type'];
  threshold: number;
  minMetricDelta: number;
  suggestions: string[];
}> = [
  {
    type: 'wastage',
    threshold: 5,
    minMetricDelta: 1.5,
    suggestions: [
      '建议加强食材验收标准，减少不合格原材料入库',
      '优化备料计划，根据历史销量精准预估当日用量',
      '加强员工操作培训，规范切配和烹饪流程',
      '建立临期食材优先使用机制，减少过期浪费',
    ],
  },
  {
    type: 'turnover',
    threshold: 2.2,
    minMetricDelta: 0.4,
    suggestions: [
      '优化点餐流程，推荐扫码点餐缩短点单时间',
      '加强出餐效率管理，设定菜品出餐时效标准',
      '培训服务员快速翻台意识，客人离开后3分钟内完成清台',
      '分析客流高峰时段，合理安排前厅人力配置',
    ],
  },
];

function generateAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let alertId = 1;
  const now = new Date();

  const statuses: Alert['status'][] = ['pending', 'confirmed', 'reviewed', 'approved', 'resolved'];
  const statusWeights = [25, 20, 20, 15, 20];

  const storeUsers = users.filter((u) => u.role === 'store');
  const regionUsers = users.filter((u) => u.role === 'region');
  const hqUsers = users.filter((u) => u.role === 'headquarters');

  for (let i = 0; i < 80; i++) {
    const storeIdx = Math.floor(Math.random() * stores.length);
    const config = alertConfigs[Math.floor(Math.random() * alertConfigs.length)];
    const level: Alert['level'] = Math.random() < 0.35 ? 'level2' : 'level1';

    const rand = Math.random() * 100;
    let cumWeight = 0;
    let status: Alert['status'] = 'pending';
    for (let s = 0; s < statuses.length; s++) {
      cumWeight += statusWeights[s];
      if (rand < cumWeight) {
        status = statuses[s];
        break;
      }
    }

    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    const consecutiveDays = level === 'level2' ? 5 + Math.floor(Math.random() * 10) : 1 + Math.floor(Math.random() * 4);
    const metricValue = config.threshold + config.minMetricDelta + Math.random() * (config.type === 'wastage' ? 4 : 1.5);

    const alert: Alert = {
      id: `ALERT${String(alertId++).padStart(4, '0')}`,
      type: config.type,
      level,
      status,
      metricValue: Math.round(metricValue * 10) / 10,
      threshold: config.threshold,
      consecutiveDays,
      storeId: stores[storeIdx].id,
      createdAt: createdAt.toISOString(),
      suggestion: config.suggestions[Math.floor(Math.random() * config.suggestions.length)],
      approvalFlow: {},
    };

    const statusIdx = statuses.indexOf(status);
    if (statusIdx >= 1 && storeUsers.length > 0) {
      const u = storeUsers[Math.floor(Math.random() * storeUsers.length)];
      alert.approvalFlow!.storeManagerConfirm = {
        userId: u.id,
        userName: u.name,
        status: 'approved',
        timestamp: new Date(createdAt.getTime() + 1000 * 60 * 30).toISOString(),
      };
    }
    if (statusIdx >= 2 && regionUsers.length > 0) {
      const u = regionUsers[Math.floor(Math.random() * regionUsers.length)];
      alert.approvalFlow!.regionManagerReview = {
        userId: u.id,
        userName: u.name,
        status: 'approved',
        timestamp: new Date(createdAt.getTime() + 1000 * 60 * 60 * 3).toISOString(),
      };
    }
    if (statusIdx >= 3 && hqUsers.length > 0) {
      const u = hqUsers[Math.floor(Math.random() * hqUsers.length)];
      alert.approvalFlow!.hqDirectorApprove = {
        userId: u.id,
        userName: u.name,
        status: 'approved',
        timestamp: new Date(createdAt.getTime() + 1000 * 60 * 60 * 8).toISOString(),
      };
    }

    alerts.push(alert);
  }

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export let alerts: Alert[] = generateAlerts();

function generateTimeSlotData(): TimeSlotData[] {
  const result: TimeSlotData[] = [];
  const today = new Date().toISOString().split('T')[0];

  stores.forEach((store, storeIdx) => {
    const slots: TimeSlotData['slots'] = [];
    const baseFactor = 0.8 + (storeIdx % 4) * 0.1;

    for (let hour = 6; hour <= 23; hour++) {
      let factor = 0;
      if (hour >= 6 && hour < 9) factor = 0.3;
      else if (hour >= 10 && hour < 14) factor = hour === 12 ? 1.2 : 0.8;
      else if (hour >= 14 && hour < 17) factor = 0.25;
      else if (hour >= 17 && hour < 21) factor = hour === 19 ? 1.3 : 0.9;
      else if (hour >= 21 && hour <= 23) factor = 0.35;

      factor *= baseFactor * (0.9 + Math.random() * 0.2);

      const revenue = Math.round(baseRevenues[storeIdx] / 15 * factor);
      const orders = Math.round(revenue / (45 + Math.random() * 10));

      slots.push({
        time: `${String(hour).padStart(2, '0')}:00`,
        revenue,
        orders,
        customers: Math.round(orders * (1.8 + Math.random() * 0.4)),
      });
    }

    result.push({ storeId: store.id, date: today, slots });
  });

  return result;
}

export const timeSlotData: TimeSlotData[] = generateTimeSlotData();

function generateWasteCategory(): WasteCategory[] {
  const result: WasteCategory[] = [];
  const categories = ['过期浪费', '操作损耗', '备料过多', '品质问题', '其他原因'];
  const today = new Date().toISOString().split('T')[0];

  stores.forEach((store, storeIdx) => {
    const baseAmount = 800 + storeIdx * 100;
    const percentages = [0.28, 0.32, 0.18, 0.14, 0.08];
    const randomPercents = percentages.map(p => p * (0.8 + Math.random() * 0.4));
    const sum = randomPercents.reduce((a, b) => a + b, 0);

    const cats: WasteCategory['categories'] = categories.map((name, i) => ({
      name,
      amount: Math.round(baseAmount * randomPercents[i] / sum),
      percentage: Math.round((randomPercents[i] / sum) * 10000) / 100,
    }));

    result.push({
      storeId: store.id,
      date: today,
      categories: cats,
    });
  });

  return result;
}

export const wasteCategories: WasteCategory[] = generateWasteCategory();

function generatePromotions(): Promotion[] {
  const promotions: Promotion[] = [];
  const promoNames = ['新品尝鲜8折', '周末满减活动', '会员日特惠', '午市套餐优惠', '晚市双人套餐', '节日特惠活动'];
  const types: Promotion['type'][] = ['discount', 'coupon', 'bundle', 'special'];
  let promoId = 1;
  const now = new Date();

  stores.forEach((store, storeIdx) => {
    const count = 2 + (storeIdx % 3);
    for (let i = 0; i < count; i++) {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 20));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7 + Math.floor(Math.random() * 14));

      promotions.push({
        id: `PROMO${String(promoId++).padStart(4, '0')}`,
        storeId: store.id,
        name: promoNames[Math.floor(Math.random() * promoNames.length)],
        type: types[Math.floor(Math.random() * types.length)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        discount: Math.round((0.65 + Math.random() * 0.3) * 100) / 100,
        status: endDate < now ? 'ended' : startDate > now ? 'draft' : 'active',
        uploadedBy: users[Math.floor(Math.random() * users.length)].id,
        uploadedAt: new Date(startDate.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      });
    }
  });

  return promotions;
}

export let promotions: Promotion[] = generatePromotions();

function generateSupplierQuotes(): SupplierQuote[] {
  const quotes: SupplierQuote[] = [];
  const suppliers = ['绿源蔬菜配送', '优质肉业', '海鲜直供', '粮油批发', '调味品专营', '饮品供应商'];
  const items = [
    { name: '新鲜大白菜', unit: 'kg' },
    { name: '猪五花肉', unit: 'kg' },
    { name: '牛里脊', unit: 'kg' },
    { name: '三文鱼', unit: 'kg' },
    { name: '大米', unit: '袋(25kg)' },
    { name: '食用油', unit: '桶(5L)' },
    { name: '生抽酱油', unit: '瓶(1L)' },
    { name: '鸡蛋', unit: '箱(30枚)' },
  ];
  let quoteId = 1;
  const now = new Date();

  for (let i = 0; i < 40; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const basePrices: Record<string, number> = {
      '新鲜大白菜': 3.5,
      '猪五花肉': 38,
      '牛里脊': 85,
      '三文鱼': 120,
      '大米': 120,
      '食用油': 75,
      '生抽酱油': 22,
      '鸡蛋': 28,
    };
    const validFrom = new Date(now);
    validFrom.setDate(validFrom.getDate() - Math.floor(Math.random() * 15));
    const validTo = new Date(validFrom);
    validTo.setDate(validTo.getDate() + 30);

    quotes.push({
      id: `QUOTE${String(quoteId++).padStart(4, '0')}`,
      supplierName: suppliers[Math.floor(Math.random() * suppliers.length)],
      itemName: item.name,
      unit: item.unit,
      price: Math.round(basePrices[item.name] * (0.9 + Math.random() * 0.2) * 100) / 100,
      quantity: 50 + Math.floor(Math.random() * 200),
      validFrom: validFrom.toISOString().split('T')[0],
      validTo: validTo.toISOString().split('T')[0],
      uploadedBy: users[Math.floor(Math.random() * 6)].id,
      uploadedAt: new Date(validFrom.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    });
  }

  return quotes;
}

export let supplierQuotes: SupplierQuote[] = generateSupplierQuotes();

function generateDemandForecasts(): DemandForecast[] {
  const result: DemandForecast[] = [];
  const forecastItems = [
    { name: '新鲜大白菜', category: '蔬菜类', unit: 'kg' },
    { name: '猪五花肉', category: '肉类', unit: 'kg' },
    { name: '牛里脊', category: '肉类', unit: 'kg' },
    { name: '三文鱼', category: '海鲜类', unit: 'kg' },
    { name: '大米', category: '主食类', unit: '袋(25kg)' },
    { name: '鸡蛋', category: '蛋类', unit: '箱(30枚)' },
    { name: '番茄', category: '蔬菜类', unit: 'kg' },
    { name: '土豆', category: '蔬菜类', unit: 'kg' },
    { name: '豆腐', category: '豆制品', unit: '盒' },
    { name: '食用油', category: '调料类', unit: '桶(5L)' },
  ];

  const today = new Date();

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    stores.forEach((store, storeIdx) => {
      const storeFactor = 0.85 + (storeIdx % 5) * 0.08;
      const weekendFactor = isWeekend ? 1.3 : 1;

      const items = forecastItems.map((item) => {
        const baseQuantities: Record<string, number> = {
          '新鲜大白菜': 25,
          '猪五花肉': 18,
          '牛里脊': 12,
          '三文鱼': 8,
          '大米': 4,
          '鸡蛋': 6,
          '番茄': 20,
          '土豆': 22,
          '豆腐': 30,
          '食用油': 2,
        };
        const baseQty = baseQuantities[item.name] || 15;
        const forecastQuantity = Math.round(baseQty * storeFactor * weekendFactor * (0.9 + Math.random() * 0.2));

        return {
          name: item.name,
          category: item.category,
          forecastQuantity,
          actualQuantity: dayOffset === 0 ? Math.round(forecastQuantity * (0.9 + Math.random() * 0.2)) : undefined,
          unit: item.unit,
          confidence: Math.round((0.82 + Math.random() * 0.15) * 10000) / 100,
        };
      });

      result.push({ date: dateStr, storeId: store.id, items });
    });
  }

  return result;
}

export const demandForecasts: DemandForecast[] = generateDemandForecasts();

function generateWeeklyReports(): WeeklyReport[] {
  const reports: WeeklyReport[] = [];
  const now = new Date();
  let reportId = 1;

  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() - weekOffset * 7 - (endDate.getDay() + 1) % 7);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);
    const week = `${startDate.getFullYear()}年第${Math.floor((endDate.getTime() - new Date(startDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}周`;

    reports.push({
      id: `REPORT${String(reportId++).padStart(4, '0')}`,
      week,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      overallScore: Math.round((78 + Math.random() * 18) * 10) / 10,
      revenueScore: Math.round((75 + Math.random() * 20) * 10) / 10,
      costScore: Math.round((76 + Math.random() * 19) * 10) / 10,
      qualityScore: Math.round((80 + Math.random() * 17) * 10) / 10,
      serviceScore: Math.round((82 + Math.random() * 15) * 10) / 10,
      highlights: [
        '本周营业额同比增长8.5%',
        '客户满意度评分达到4.6分',
        '招牌菜销量创新高',
      ],
      issues: [
        '个别门店食材成本率略高于目标',
        '周末高峰时段出餐速度有待提升',
      ],
      recommendations: [
        '建议优化食材采购计划，降低成本率',
        '增加周末高峰期临时人手配置',
        '加强新员工培训，提升服务质量',
      ],
    });

    stores.forEach((store, storeIdx) => {
      const storeFactor = 0.9 + (storeIdx % 5) * 0.04;
      reports.push({
        id: `REPORT${String(reportId++).padStart(4, '0')}`,
        week,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        storeId: store.id,
        overallScore: Math.round((75 + Math.random() * 20) * storeFactor * 10) / 10,
        revenueScore: Math.round((72 + Math.random() * 22) * storeFactor * 10) / 10,
        costScore: Math.round((74 + Math.random() * 20) * storeFactor * 10) / 10,
        qualityScore: Math.round((78 + Math.random() * 18) * storeFactor * 10) / 10,
        serviceScore: Math.round((80 + Math.random() * 16) * storeFactor * 10) / 10,
        highlights: [
          `${store.city}店本周营业额达成率105%`,
          '客户投诉量较上周下降30%',
        ],
        issues: [
          '食材损耗率略有上升',
          '部分时段服务人员不足',
        ],
        recommendations: [
          '加强库存管理，减少食材损耗',
          '优化排班制度，合理配置人力',
        ],
      });
    });
  }

  return reports;
}

export const weeklyReports: WeeklyReport[] = generateWeeklyReports();

function generateHeatmapData(): HeatmapData[] {
  const result: HeatmapData[] = [];
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  stores.forEach((store, storeIdx) => {
    const storeFactor = 0.85 + (storeIdx % 5) * 0.07;

    days.forEach((day) => {
      const isWeekend = day === '周六' || day === '周日';
      const data: HeatmapData['data'] = [];

      for (let hour = 6; hour <= 23; hour++) {
        let factor = 0;
        if (hour >= 6 && hour < 9) factor = 0.2;
        else if (hour >= 10 && hour < 14) factor = hour === 12 ? 0.9 : 0.5;
        else if (hour >= 14 && hour < 17) factor = 0.15;
        else if (hour >= 17 && hour < 21) factor = hour === 19 ? (isWeekend ? 1.0 : 0.85) : 0.6;
        else if (hour >= 21 && hour <= 23) factor = 0.2;

        factor *= storeFactor * (isWeekend ? 1.3 : 1);
        const value = Math.round(factor * 100);

        data.push({ hour, value });
      }

      result.push({ storeId: store.id, day, data });
    });
  });

  return result;
}

export const heatmapData: HeatmapData[] = generateHeatmapData();

export function filterStoresByRole(userRole: UserRole, userRegion?: Region, userStoreId?: string): Store[] {
  if (userRole === 'headquarters') return stores;
  if (userRole === 'region') return stores.filter((s) => s.region === userRegion);
  return stores.filter((s) => s.id === userStoreId);
}

export function filterDataByRole<T extends { storeId: string }>(
  data: T[],
  userRole: UserRole,
  userRegion?: Region,
  userStoreId?: string,
): T[] {
  const allowedStores = filterStoresByRole(userRole, userRegion, userStoreId);
  const allowedIds = new Set(allowedStores.map((s) => s.id));
  return data.filter((d) => allowedIds.has(d.storeId));
}
