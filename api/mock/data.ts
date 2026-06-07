import {
  User,
  Store,
  KPIData,
  RegionHeatmapData,
  DishMargin,
  SalesTrend,
  WastageCategory,
  Alert,
  ForecastItem,
  SupplierQuote,
  HealthReport,
  TimeSlotData,
} from '../../src/types';

export const mockUsers: User[] = [
  {
    id: 'hq001',
    name: '张运营',
    role: 'headquarters',
  },
  {
    id: 'rg001',
    name: '李经理',
    role: 'region',
    regionId: 'east',
  },
  {
    id: 'st001',
    name: '王店长',
    role: 'store',
    storeId: 'SH001',
  },
];

export const mockStores: Store[] = [
  {
    id: 'SH001',
    name: '上海陆家嘴店',
    city: '上海',
    province: '上海',
    brand: '味道轩',
    address: '上海市浦东新区陆家嘴环路1000号',
    totalTables: 48,
    staffCount: 32,
    regionId: 'east',
    healthStatus: 'good',
    todayTurnover: 3.2,
    todayWastage: 4.2,
  },
  {
    id: 'SH002',
    name: '上海人民广场店',
    city: '上海',
    province: '上海',
    brand: '味道轩',
    address: '上海市黄浦区南京东路200号',
    totalTables: 36,
    staffCount: 28,
    regionId: 'east',
    healthStatus: 'average',
    todayTurnover: 2.6,
    todayWastage: 5.8,
  },
  {
    id: 'BJ001',
    name: '北京国贸店',
    city: '北京',
    province: '北京',
    brand: '味道轩',
    address: '北京市朝阳区建国门外大街1号',
    totalTables: 52,
    staffCount: 38,
    regionId: 'north',
    healthStatus: 'excellent',
    todayTurnover: 3.8,
    todayWastage: 3.1,
  },
  {
    id: 'BJ002',
    name: '北京三里屯店',
    city: '北京',
    province: '北京',
    brand: '味道轩',
    address: '北京市朝阳区三里屯路19号',
    totalTables: 42,
    staffCount: 30,
    regionId: 'north',
    healthStatus: 'good',
    todayTurnover: 3.4,
    todayWastage: 3.9,
  },
  {
    id: 'GZ001',
    name: '广州天河城店',
    city: '广州',
    province: '广东',
    brand: '味道轩',
    address: '广州市天河区天河路208号',
    totalTables: 40,
    staffCount: 28,
    regionId: 'south',
    healthStatus: 'poor',
    todayTurnover: 2.1,
    todayWastage: 6.5,
  },
  {
    id: 'SZ001',
    name: '深圳万象城店',
    city: '深圳',
    province: '广东',
    brand: '味道轩',
    address: '深圳市罗湖区宝安南路1881号',
    totalTables: 45,
    staffCount: 32,
    regionId: 'south',
    healthStatus: 'good',
    todayTurnover: 3.1,
    todayWastage: 4.0,
  },
  {
    id: 'HZ001',
    name: '杭州西湖店',
    city: '杭州',
    province: '浙江',
    brand: '味道轩',
    address: '杭州市西湖区延安路98号',
    totalTables: 38,
    staffCount: 26,
    regionId: 'east',
    healthStatus: 'excellent',
    todayTurnover: 3.6,
    todayWastage: 3.2,
  },
  {
    id: 'CD001',
    name: '成都春熙路店',
    city: '成都',
    province: '四川',
    brand: '味道轩',
    address: '成都市锦江区春熙路东段1号',
    totalTables: 44,
    staffCount: 30,
    regionId: 'west',
    healthStatus: 'average',
    todayTurnover: 2.8,
    todayWastage: 5.1,
  },
];

export const mockKPIData: KPIData = {
  totalRevenue: 12856400,
  revenueYoY: 12.5,
  revenueMoM: 8.3,
  turnoverRate: 3.12,
  turnoverRateYoY: 6.8,
  turnoverRateMoM: 4.2,
  grossMargin: 62.4,
  grossMarginYoY: 2.1,
  grossMarginMoM: 1.5,
  wastageRate: 4.3,
  wastageRateYoY: -1.2,
  wastageRateMoM: -0.8,
  outputPerCapita: 8640,
  outputYoY: 9.2,
  outputMoM: 5.6,
};

export const mockHeatmapData: RegionHeatmapData[] = [
  { province: '北京', city: '北京', turnoverRate: 3.6, storeCount: 2, avgRevenue: 892000 },
  { province: '上海', city: '上海', turnoverRate: 2.9, storeCount: 2, avgRevenue: 756000 },
  { province: '广东', city: '广州', turnoverRate: 2.1, storeCount: 1, avgRevenue: 523000 },
  { province: '广东', city: '深圳', turnoverRate: 3.1, storeCount: 1, avgRevenue: 712000 },
  { province: '浙江', city: '杭州', turnoverRate: 3.6, storeCount: 1, avgRevenue: 689000 },
  { province: '四川', city: '成都', turnoverRate: 2.8, storeCount: 1, avgRevenue: 612000 },
  { province: '江苏', city: '南京', turnoverRate: 3.0, storeCount: 1, avgRevenue: 654000 },
  { province: '湖北', city: '武汉', turnoverRate: 2.7, storeCount: 1, avgRevenue: 578000 },
];

export const mockDishMargins: DishMargin[] = [
  { id: 'd001', name: '招牌红烧肉', category: '热菜', salesVolume: 12850, revenue: 514000, cost: 164480, grossMargin: 68 },
  { id: 'd002', name: '松鼠鳜鱼', category: '热菜', salesVolume: 8420, revenue: 589400, cost: 200396, grossMargin: 66 },
  { id: 'd003', name: '水晶虾仁', category: '热菜', salesVolume: 9650, revenue: 386000, cost: 146680, grossMargin: 62 },
  { id: 'd004', name: '蒜蓉西兰花', category: '素菜', salesVolume: 15230, revenue: 228450, cost: 57112, grossMargin: 75 },
  { id: 'd005', name: '蟹黄豆腐', category: '热菜', salesVolume: 7820, revenue: 273700, cost: 112217, grossMargin: 59 },
  { id: 'd006', name: '糖醋里脊', category: '热菜', salesVolume: 11450, revenue: 343500, cost: 144270, grossMargin: 58 },
  { id: 'd007', name: '宫保鸡丁', category: '热菜', salesVolume: 13800, revenue: 345000, cost: 141450, grossMargin: 59 },
  { id: 'd008', name: '麻婆豆腐', category: '热菜', salesVolume: 16200, revenue: 275400, cost: 68850, grossMargin: 75 },
  { id: 'd009', name: '清蒸鲈鱼', category: '海鲜', salesVolume: 6850, revenue: 479500, cost: 220570, grossMargin: 54 },
  { id: 'd010', name: '扬州炒饭', category: '主食', salesVolume: 18500, revenue: 277500, cost: 69375, grossMargin: 75 },
  { id: 'd011', name: '时蔬沙拉', category: '凉菜', salesVolume: 4200, revenue: 84000, cost: 42000, grossMargin: 50 },
  { id: 'd012', name: '凉拌黄瓜', category: '凉菜', salesVolume: 7800, revenue: 78000, cost: 23400, grossMargin: 70 },
];

const generateSalesTrend = (): SalesTrend[] => {
  const dishes = [
    { dishId: 'd001', dishName: '招牌红烧肉' },
    { dishId: 'd002', dishName: '松鼠鳜鱼' },
    { dishId: 'd004', dishName: '蒜蓉西兰花' },
    { dishId: 'd008', dishName: '麻婆豆腐' },
    { dishId: 'd010', dishName: '扬州炒饭' },
  ];
  const trend: SalesTrend[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    trend.push({
      date: dateStr,
      dishes: dishes.map((d) => ({
        ...d,
        quantity: Math.floor(80 + Math.random() * 120 + (6 - i) * 8),
        revenue: Math.floor(3000 + Math.random() * 5000 + (6 - i) * 300),
      })),
    });
  }
  return trend;
};

export const mockSalesTrend = generateSalesTrend();

export const mockWastageCategories: WastageCategory[] = [
  { category: 'expired', label: '过期浪费', amount: 12800, percentage: 35, color: '#dc2626' },
  { category: 'operation', label: '操作损耗', amount: 9850, percentage: 27, color: '#e8823b' },
  { category: 'over_prep', label: '备料过多', amount: 8420, percentage: 23, color: '#f59e0b' },
  { category: 'quality', label: '品质问题', amount: 3650, percentage: 10, color: '#0ea5e9' },
  { category: 'other', label: '其他原因', amount: 1830, percentage: 5, color: '#9fb3c8' },
];

export const mockAlerts: Alert[] = [
  {
    id: 'a001',
    storeId: 'GZ001',
    storeName: '广州天河城店',
    type: 'wastage',
    level: 'level2',
    status: 'confirmed',
    metricValue: 6.5,
    threshold: 5,
    consecutiveDays: 8,
    createdAt: '2026-06-01T09:00:00Z',
    suggestion: '建议优化食材采购计划，加强备料管理，培训后厨减少操作损耗',
    daysRemaining: 0,
    approvalFlow: {
      storeManagerConfirm: {
        userId: 'st002',
        userName: '陈店长',
        status: 'approved',
        comment: '已确认问题，正在制定整改方案',
        timestamp: '2026-06-02T10:30:00Z',
      },
      regionManagerReview: {
        userId: 'rg002',
        userName: '刘经理',
        status: 'approved',
        comment: '同意，建议派区域督导协助整改',
        timestamp: '2026-06-03T14:20:00Z',
      },
      hqDirectorApprove: {
        userId: 'hq001',
        userName: '张运营',
        status: 'pending',
      },
    },
  },
  {
    id: 'a002',
    storeId: 'SH002',
    storeName: '上海人民广场店',
    type: 'wastage',
    level: 'level1',
    status: 'pending',
    metricValue: 5.8,
    threshold: 5,
    consecutiveDays: 3,
    createdAt: '2026-06-05T09:00:00Z',
    suggestion: '建议检查库存管理流程，减少过期食材，优化备料量',
    daysRemaining: 2,
  },
  {
    id: 'a003',
    storeId: 'GZ001',
    storeName: '广州天河城店',
    type: 'turnover',
    level: 'level1',
    status: 'pending',
    metricValue: 2.1,
    threshold: 2.73,
    consecutiveDays: 4,
    createdAt: '2026-06-04T09:00:00Z',
    suggestion: '建议分析客流变化，推出午市/晚市促销活动，优化菜单结构',
    daysRemaining: 1,
  },
  {
    id: 'a004',
    storeId: 'CD001',
    storeName: '成都春熙路店',
    type: 'wastage',
    level: 'level1',
    status: 'resolved',
    metricValue: 5.1,
    threshold: 5,
    consecutiveDays: 3,
    createdAt: '2026-05-28T09:00:00Z',
    suggestion: '建议优化备料流程',
  },
];

export const mockForecastItems: ForecastItem[] = [
  {
    ingredientId: 'i001',
    ingredientName: '猪五花肉',
    unit: 'kg',
    hourlyDemand: Array.from({ length: 72 }, () => Math.random() * 8 + 2),
    totalDemand: 386,
    suggestedOrder: 420,
    currentStock: 58,
  },
  {
    ingredientId: 'i002',
    ingredientName: '新鲜鲈鱼',
    unit: 'kg',
    hourlyDemand: Array.from({ length: 72 }, () => Math.random() * 5 + 1),
    totalDemand: 215,
    suggestedOrder: 240,
    currentStock: 32,
  },
  {
    ingredientId: 'i003',
    ingredientName: '河虾仁',
    unit: 'kg',
    hourlyDemand: Array.from({ length: 72 }, () => Math.random() * 4 + 1.5),
    totalDemand: 198,
    suggestedOrder: 220,
    currentStock: 45,
  },
  {
    ingredientId: 'i004',
    ingredientName: '西兰花',
    unit: 'kg',
    hourlyDemand: Array.from({ length: 72 }, () => Math.random() * 10 + 3),
    totalDemand: 468,
    suggestedOrder: 520,
    currentStock: 86,
  },
  {
    ingredientId: 'i005',
    ingredientName: '嫩豆腐',
    unit: '盒',
    hourlyDemand: Array.from({ length: 72 }, () => Math.random() * 12 + 5),
    totalDemand: 612,
    suggestedOrder: 680,
    currentStock: 124,
  },
  {
    ingredientId: 'i006',
    ingredientName: '土鸡蛋',
    unit: '个',
    hourlyDemand: Array.from({ length: 72 }, () => Math.random() * 20 + 8),
    totalDemand: 1050,
    suggestedOrder: 1200,
    currentStock: 320,
  },
];

export const mockSupplierQuotes: SupplierQuote[] = [
  { supplierId: 's001', supplierName: '绿源生鲜', ingredientId: 'i001', ingredientName: '猪五花肉', price: 38.5, minOrder: 50, deliveryTime: '次日6:00前', isRecommended: true, savedCost: 1155 },
  { supplierId: 's002', supplierName: '肉联直供', ingredientId: 'i001', ingredientName: '猪五花肉', price: 41.2, minOrder: 100, deliveryTime: '当日22:00前' },
  { supplierId: 's003', supplierName: '优选肉品', ingredientId: 'i001', ingredientName: '猪五花肉', price: 39.8, minOrder: 30, deliveryTime: '次日8:00前' },
  { supplierId: 's001', supplierName: '绿源生鲜', ingredientId: 'i002', ingredientName: '新鲜鲈鱼', price: 58.0, minOrder: 30, deliveryTime: '次日6:00前' },
  { supplierId: 's004', supplierName: '海味鲜', ingredientId: 'i002', ingredientName: '新鲜鲈鱼', price: 52.5, minOrder: 40, deliveryTime: '次日7:00前', isRecommended: true, savedCost: 2640 },
  { supplierId: 's005', supplierName: '菜篮子', ingredientId: 'i004', ingredientName: '西兰花', price: 6.8, minOrder: 100, deliveryTime: '次日5:00前', isRecommended: true, savedCost: 832 },
  { supplierId: 's001', supplierName: '绿源生鲜', ingredientId: 'i004', ingredientName: '西兰花', price: 7.5, minOrder: 80, deliveryTime: '次日6:00前' },
];

export const mockHealthReport: HealthReport = {
  weekStart: '2026-06-01',
  weekEnd: '2026-06-07',
  healthScore: 82,
  healthLevel: 'good',
  metricsComparison: [
    { metric: 'revenue', label: '总营收', unit: '万元', currentWeek: 1285.6, lastWeek: 1186.8, samePeriodLastYear: 1142.3 },
    { metric: 'turnover', label: '翻台率', unit: '次', currentWeek: 3.12, lastWeek: 2.99, samePeriodLastYear: 2.92 },
    { metric: 'margin', label: '毛利率', unit: '%', currentWeek: 62.4, lastWeek: 61.5, samePeriodLastYear: 61.1 },
    { metric: 'wastage', label: '损耗率', unit: '%', currentWeek: 4.3, lastWeek: 4.7, samePeriodLastYear: 4.8 },
    { metric: 'output', label: '人均产出', unit: '元', currentWeek: 8640, lastWeek: 8182, samePeriodLastYear: 7912 },
  ],
  wastageReasonDistribution: [
    { reason: '过期浪费', percentage: 35, amount: 44800 },
    { reason: '操作损耗', percentage: 27, amount: 34560 },
    { reason: '备料过多', percentage: 23, amount: 29440 },
    { reason: '品质问题', percentage: 10, amount: 12800 },
    { reason: '其他原因', percentage: 5, amount: 6400 },
  ],
  staffRanking: [
    { staffId: 'e001', staffName: '刘大厨', storeName: '北京国贸店', output: 15680, rank: 1, trend: 'up' },
    { staffId: 'e002', staffName: '陈师傅', storeName: '杭州西湖店', output: 14520, rank: 2, trend: 'stable' },
    { staffId: 'e003', staffName: '王大厨', storeName: '北京三里屯店', output: 13890, rank: 3, trend: 'up' },
    { staffId: 'e004', staffName: '张师傅', storeName: '上海陆家嘴店', output: 12650, rank: 4, trend: 'down' },
    { staffId: 'e005', staffName: '李厨', storeName: '深圳万象城店', output: 11820, rank: 5, trend: 'up' },
    { staffId: 'e006', staffName: '赵师傅', storeName: '成都春熙路店', output: 10560, rank: 6, trend: 'stable' },
    { staffId: 'e007', staffName: '孙大厨', storeName: '上海人民广场店', output: 9840, rank: 7, trend: 'down' },
    { staffId: 'e008', staffName: '周师傅', storeName: '广州天河城店', output: 8920, rank: 8, trend: 'down' },
  ],
  suggestions: [
    '建议在广州天河城店推出午市商务套餐，提升翻台率2.1→2.8',
    '将低毛利菜品"时蔬沙拉"进行配方优化或调整定价，毛利率可从50%提升至60%',
    '加强上海、广州区域门店库存管理，预计可降低损耗率0.8-1.2个百分点',
    '周五至周日增加高峰期兼职人员配置，优化排班效率可降低人工成本约5%',
    '将"麻婆豆腐"、"扬州炒饭"等高毛利菜品设为推荐菜，预计可提升整体毛利率1.5%',
  ],
};

export const generateTimeSlotData = (): TimeSlotData[] => {
  const slots = [];
  for (let h = 10; h <= 22; h++) {
    slots.push({
      hour: `${h}:00`,
      turnover: h >= 11 && h <= 14 ? 0.6 + Math.random() * 0.3 : h >= 17 && h <= 20 ? 0.55 + Math.random() * 0.35 : 0.1 + Math.random() * 0.2,
      orders: h >= 11 && h <= 14 ? 80 + Math.floor(Math.random() * 40) : h >= 17 && h <= 20 ? 70 + Math.floor(Math.random() * 50) : 10 + Math.floor(Math.random() * 25),
      revenue: h >= 11 && h <= 14 ? 28000 + Math.floor(Math.random() * 12000) : h >= 17 && h <= 20 ? 32000 + Math.floor(Math.random() * 15000) : 3000 + Math.floor(Math.random() * 8000),
    });
  }
  return slots;
};
