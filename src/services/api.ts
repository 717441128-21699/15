import type {
  User,
  UserRole,
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
} from '../types';

const BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: getHeaders(),
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error(json.message || '请求失败');
  }
  return json.data;
}

export const api = {
  auth: {
    login: (role: UserRole) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ role }),
      }),
    profile: () => request<User>('/auth/profile'),
  },
  stores: {
    list: (params?: { city?: string; brand?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<Store[]>(`/stores${qs}`);
    },
    detail: (id: string) => request<Store>(`/stores/${id}`),
    salesTrend: (id: string) => request<SalesTrend[]>(`/stores/${id}/sales-trend`),
    wastageCategory: (id: string) => request<WastageCategory[]>(`/stores/${id}/wastage-category`),
    timeSlot: (id: string) => request<TimeSlotData[]>(`/stores/${id}/time-slot`),
  },
  kpi: {
    summary: () => request<KPIData>('/kpi/summary'),
    heatmap: () => request<RegionHeatmapData[]>('/kpi/heatmap'),
  },
  dishes: {
    marginRanking: (params?: { type?: 'top' | 'bottom'; category?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<DishMargin[]>(`/dishes/margin-ranking${qs}`);
    },
  },
  alerts: {
    list: (params?: { level?: string; status?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
      return request<Alert[]>(`/alerts${qs}`);
    },
    confirm: (id: string, data: { comment?: string; userName: string; userId: string }) =>
      request<Alert>(`/alerts/${id}/confirm`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    review: (id: string, data: { comment?: string; userName: string; userId: string }) =>
      request<Alert>(`/alerts/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    approve: (id: string, data: { comment?: string; userName: string; userId: string }) =>
      request<Alert>(`/alerts/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    resolve: (id: string) =>
      request<Alert>(`/alerts/${id}/resolve`, { method: 'POST' }),
  },
  procurement: {
    uploadPromotion: (fileName: string) =>
      request<{ message: string; extractedDishes: unknown[] }>('/procurement/upload-promotion', {
        method: 'POST',
        body: JSON.stringify({ fileName }),
      }),
    uploadQuote: (fileName: string) =>
      request<{ message: string; supplierCount: number; ingredientCount: number }>('/procurement/upload-quote', {
        method: 'POST',
        body: JSON.stringify({ fileName }),
      }),
    forecast: () =>
      request<{ forecast: ForecastItem[]; quotes: SupplierQuote[]; totalSavedCost: number }>('/procurement/forecast'),
  },
  report: {
    weekly: () => request<HealthReport>('/report/weekly'),
  },
};
