import type {
  User,
  LoginRequest,
  LoginResponse,
  Store,
  KPIData,
  RegionHeatmapData,
  DishMargin,
  SalesTrend,
  WastageCategory,
  Alert,
  AlertQueryParams,
  ForecastItem,
  SupplierQuote,
  HealthReport,
  TimeSlotData,
  StoreFilters,
} from '@/types';
import { useAppStore } from '@/store';

const BASE_URL = '/api';

interface BackendResponse<T> {
  data: T;
  message?: string;
  code: number;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const appState = useAppStore.getState();
  const token = appState.token;
  const user = appState.user;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(user?.role ? { 'x-user-role': user.role } : {}),
    ...(user?.regionId ? { 'x-user-region': user.regionId } : {}),
    ...(user?.storeId ? { 'x-user-store-id': user.storeId } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAppStore.getState().logout();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: BackendResponse<T> = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data;
}

export const authApi = {
  login: (payload: LoginRequest) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProfile: () =>
    request<User>('/auth/userinfo', {
      method: 'GET',
    }),
};

interface BackendStore extends Store {
  todayRevenue?: number;
  todayOrders?: number;
  todayCustomers?: number;
  todayProfitMargin?: number;
  revenueChange?: number;
  turnoverRate?: number;
  wastageRate?: number;
  healthLevel?: 'excellent' | 'good' | 'average' | 'poor';
  healthScore?: number;
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    totalProfit: number;
    avgProfitMargin: number;
    avgFoodCostRate: number;
    avgLaborCostRate: number;
    avgSatisfaction: number;
  };
}

interface BackendKPI {
  today: {
    revenue: number;
    orders: number;
    customers: number;
    profit: number;
    avgOrderValue: number;
    profitMargin: number;
  };
  yesterdayComparison: {
    revenue: number;
    orders: number;
  };
  thisWeek: {
    revenue: number;
    orders: number;
    customers: number;
    profit: number;
    profitMargin: number;
    avgFoodCostRate: number;
    avgLaborCostRate: number;
    avgSatisfaction: number;
    storeCount: number;
  };
  weekComparison: {
    revenue: number;
    orders: number;
  };
}

interface BackendDishMargin {
  rank: number;
  name: string;
  category: string;
  salesAmount: number;
  salesCount: number;
  avgPrice: number;
  avgCost: number;
  grossMargin: number;
  grossProfit: number;
}

interface BackendSalesTrendItem {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
  customers: number;
  profitMargin: number;
}

interface BackendWasteCategoryItem {
  name: string;
  amount: number;
  percentage: number;
}

const wasteCategoryMap: Record<string, { category: WastageCategory['category']; label: string }> = {
  '过期浪费': { category: 'expired', label: '过期浪费' },
  '操作损耗': { category: 'operation', label: '操作损耗' },
  '备料过多': { category: 'over_prep', label: '备料过多' },
  '品质问题': { category: 'quality', label: '品质问题' },
  '其他原因': { category: 'other', label: '其他原因' },
};

export const storeApi = {
  getStores: (params?: StoreFilters) => {
    const query = new URLSearchParams();
    if (params?.city) query.set('city', params.city);
    if (params?.brand) query.set('brand', params.brand);
    if (params?.regionId) query.set('regionId', params.regionId);
    const queryString = query.toString();
    return request<BackendStore[]>(`/stores${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  getStoreById: (id: string) =>
    request<BackendStore>(`/stores/${id}`, {
      method: 'GET',
    }),

  getSalesTrend: (storeId: string) =>
    request<BackendSalesTrendItem[]>(`/stores/${storeId}/sales-trend`, {
      method: 'GET',
    }).then((items) => {
      return items.map((item) => ({
        date: item.date,
        dishes: [
          {
            dishId: 'revenue',
            dishName: '总营收',
            quantity: item.orders,
            revenue: item.revenue,
          },
          {
            dishId: 'profit',
            dishName: '利润',
            quantity: item.customers,
            revenue: item.profit,
          },
        ],
      })) as SalesTrend[];
    }),

  getWastageCategory: (storeId: string) =>
    request<BackendWasteCategoryItem[]>(`/stores/${storeId}/waste-category`, {
      method: 'GET',
    }).then((items) => {
      return items.map((item) => {
        const mapped = wasteCategoryMap[item.name] || { category: 'other', label: item.name };
        return {
          category: mapped.category,
          label: mapped.label,
          amount: item.amount,
          percentage: item.percentage,
        } as WastageCategory;
      });
    }),

  getTimeSlots: (storeId: string) =>
    request<TimeSlotData[]>(`/stores/${storeId}/time-slots`, {
      method: 'GET',
    }),
};

export const kpiApi = {
  getSummary: (params?: { storeId?: string; city?: string; brand?: string }) => {
    const query = new URLSearchParams();
    if (params?.storeId) query.set('storeId', params.storeId);
    if (params?.city) query.set('city', params.city);
    if (params?.brand) query.set('brand', params.brand);
    const queryString = query.toString();
    return request<BackendKPI>(`/kpi/summary${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    }).then((kpi) => {
      return {
        totalRevenue: kpi.thisWeek.revenue,
        revenueYoY: kpi.weekComparison.revenue / 100,
        revenueMoM: kpi.yesterdayComparison.revenue / 100,
        turnoverRate: kpi.today.orders / kpi.thisWeek.storeCount / 10,
        turnoverRateYoY: kpi.weekComparison.orders / 100,
        turnoverRateMoM: kpi.yesterdayComparison.orders / 100,
        grossMargin: kpi.thisWeek.profitMargin / 100,
        grossMarginYoY: 0.02,
        grossMarginMoM: 0.01,
        wastageRate: kpi.thisWeek.avgFoodCostRate / 100 / 3,
        wastageRateYoY: -0.01,
        wastageRateMoM: -0.005,
        outputPerCapita: kpi.thisWeek.revenue / (kpi.thisWeek.storeCount * 15),
        outputYoY: 0.05,
        outputMoM: 0.03,
      } as KPIData;
    });
  },

  getHeatmap: () =>
    request<RegionHeatmapData[]>('/kpi/heatmap', {
      method: 'GET',
    }),
};

export const dishApi = {
  getMarginRanking: (params?: {
    category?: string;
    storeId?: string;
    sort?: 'asc' | 'desc';
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.storeId) query.set('storeId', params.storeId);
    if (params?.sort) query.set('sortBy', params.sort === 'asc' ? 'grossMargin' : 'grossMargin');
    if (params?.limit) query.set('limit', String(params.limit));
    const queryString = query.toString();
    return request<BackendDishMargin[]>(
      `/dishes/gross-margin-ranking${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
      }
    ).then((items) => {
      return items.map((item, index) => ({
        id: `dish-${index}`,
        name: item.name,
        category: item.category,
        salesVolume: item.salesCount,
        revenue: item.salesAmount,
        cost: item.salesAmount - item.grossProfit,
        grossMargin: item.grossMargin,
      })) as DishMargin[];
    });
  },
};

interface BackendAlertList {
  list: Alert[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  statusStats: Record<string, number>;
  levelStats: Record<string, number>;
}

export const alertApi = {
  getAlerts: (params?: AlertQueryParams) => {
    const query = new URLSearchParams();
    if (params?.level) query.set('level', params.level);
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    if (params?.storeId) query.set('storeId', params.storeId);
    const queryString = query.toString();
    return request<BackendAlertList>(`/alerts${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    }).then((resp) => resp.list || []);
  },

  confirmAlert: (alertId: string, comment?: string) =>
    request<Alert>(`/alerts/${alertId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),

  reviewAlert: (alertId: string, comment?: string) =>
    request<Alert>(`/alerts/${alertId}/review`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),

  approveAlert: (alertId: string, comment?: string) =>
    request<Alert>(`/alerts/${alertId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),

  resolveAlert: (alertId: string, comment?: string) =>
    request<Alert>(`/alerts/${alertId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),
};

export const procurementApi = {
  uploadPromotion: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ message: string; dishCount: number }>(
      '/procurement/upload-promotion',
      {
        method: 'POST',
        body: formData,
        headers: {},
      }
    );
  },

  uploadQuote: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ message: string; supplierCount: number }>(
      '/procurement/upload-quote',
      {
        method: 'POST',
        body: formData,
        headers: {},
      }
    );
  },

  getForecast: (params?: { storeId?: string; regionId?: string }) => {
    const query = new URLSearchParams();
    if (params?.storeId) query.set('storeId', params.storeId);
    if (params?.regionId) query.set('regionId', params.regionId);
    const queryString = query.toString();
    return request<{
      items: ForecastItem[];
      quotes: SupplierQuote[];
    }>(`/procurement/forecast${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },
};

export const reportApi = {
  getWeeklyReport: (params?: {
    storeId?: string;
    regionId?: string;
    weekStart?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.storeId) query.set('storeId', params.storeId);
    if (params?.regionId) query.set('regionId', params.regionId);
    if (params?.weekStart) query.set('weekStart', params.weekStart);
    const queryString = query.toString();
    return request<HealthReport>(
      `/report/weekly${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
      }
    );
  },
};
