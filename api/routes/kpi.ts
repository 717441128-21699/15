import { Router, Response } from 'express';
import { AuthRequest } from '../app.js';
import {
  dailyKPIs,
  heatmapData,
  filterStoresByRole,
  filterDataByRole,
} from '../mock/data.js';

const router = Router();

router.get('/summary', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const allowedStoreIds = new Set(allowedStores.map((s) => s.id));

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const todayKPIs = dailyKPIs.filter((k) => allowedStoreIds.has(k.storeId) && k.date === today);
  const yesterdayKPIs = dailyKPIs.filter((k) => allowedStoreIds.has(k.storeId) && k.date === yesterday);
  const lastWeekKPIs = dailyKPIs.filter(
    (k) => allowedStoreIds.has(k.storeId) && k.date >= lastWeek && k.date <= today
  );
  const prevWeekKPIs = dailyKPIs.filter(
    (k) => allowedStoreIds.has(k.storeId) && k.date >= new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0] && k.date < lastWeek
  );

  const sumField = (arr: typeof dailyKPIs, field: keyof typeof dailyKPIs[0]) =>
    arr.reduce((sum, k) => sum + (k[field] as number), 0);

  const todayRevenue = sumField(todayKPIs, 'revenue');
  const yesterdayRevenue = sumField(yesterdayKPIs, 'revenue');
  const weekRevenue = sumField(lastWeekKPIs, 'revenue');
  const prevWeekRevenue = sumField(prevWeekKPIs, 'revenue');

  const todayOrders = sumField(todayKPIs, 'orders');
  const yesterdayOrders = sumField(yesterdayKPIs, 'orders');
  const weekOrders = sumField(lastWeekKPIs, 'orders');
  const prevWeekOrders = sumField(prevWeekKPIs, 'orders');

  const todayCustomers = sumField(todayKPIs, 'customers');
  const weekCustomers = sumField(lastWeekKPIs, 'customers');

  const todayProfit = sumField(todayKPIs, 'profit');
  const weekProfit = sumField(lastWeekKPIs, 'profit');

  const avgFoodCostRate = lastWeekKPIs.length > 0
    ? Math.round((sumField(lastWeekKPIs, 'foodCost') / sumField(lastWeekKPIs, 'revenue')) * 10000) / 100
    : 0;
  const avgLaborCostRate = lastWeekKPIs.length > 0
    ? Math.round((sumField(lastWeekKPIs, 'laborCost') / sumField(lastWeekKPIs, 'revenue')) * 10000) / 100
    : 0;
  const avgSatisfaction = lastWeekKPIs.length > 0
    ? Math.round((sumField(lastWeekKPIs, 'satisfaction') / lastWeekKPIs.length) * 10) / 10
    : 0;

  const storeCount = allowedStores.length;

  res.json({
    code: 200,
    message: '获取KPI汇总成功',
    data: {
      today: {
        revenue: todayRevenue,
        orders: todayOrders,
        customers: todayCustomers,
        profit: todayProfit,
        avgOrderValue: todayOrders > 0 ? Math.round((todayRevenue / todayOrders) * 100) / 100 : 0,
        profitMargin: todayRevenue > 0 ? Math.round((todayProfit / todayRevenue) * 10000) / 100 : 0,
      },
      yesterdayComparison: {
        revenue: yesterdayRevenue > 0
          ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 10000) / 100
          : 0,
        orders: yesterdayOrders > 0
          ? Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 10000) / 100
          : 0,
      },
      thisWeek: {
        revenue: weekRevenue,
        orders: weekOrders,
        customers: weekCustomers,
        profit: weekProfit,
        profitMargin: weekRevenue > 0 ? Math.round((weekProfit / weekRevenue) * 10000) / 100 : 0,
        avgFoodCostRate,
        avgLaborCostRate,
        avgSatisfaction,
        storeCount,
      },
      weekComparison: {
        revenue: prevWeekRevenue > 0
          ? Math.round(((weekRevenue - prevWeekRevenue) / prevWeekRevenue) * 10000) / 100
          : 0,
        orders: prevWeekOrders > 0
          ? Math.round(((weekOrders - prevWeekOrders) / prevWeekOrders) * 10000) / 100
          : 0,
      },
    },
  });
});

router.get('/heatmap', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const storeId = req.query.storeId as string;

  let filteredHeatmap = filterDataByRole(heatmapData, req.userRole!, req.userRegion, req.userStoreId);

  if (storeId) {
    filteredHeatmap = filteredHeatmap.filter((h) => h.storeId === storeId);
  }

  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  const aggregatedData = days.map((day) => {
    const dayData = filteredHeatmap.filter((h) => h.day === day);
    const hours: Array<{ hour: number; value: number }> = [];

    for (let hour = 6; hour <= 23; hour++) {
      const hourValues = dayData.map((d) => d.data.find((h) => h.hour === hour)?.value || 0);
      const avgValue = hourValues.length > 0
        ? Math.round(hourValues.reduce((a, b) => a + b, 0) / hourValues.length)
        : 0;
      hours.push({ hour, value: avgValue });
    }

    return { day, data: hours };
  });

  res.json({
    code: 200,
    message: '获取热力图数据成功',
    data: aggregatedData,
  });
});

router.get('/daily', (req: AuthRequest, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  const storeId = req.query.storeId as string;

  let filteredKPIs = filterDataByRole(dailyKPIs, req.userRole!, req.userRegion, req.userStoreId);

  if (storeId) {
    filteredKPIs = filteredKPIs.filter((k) => k.storeId === storeId);
  }

  const dateMap = new Map<string, typeof dailyKPIs>();
  filteredKPIs.forEach((k) => {
    if (!dateMap.has(k.date)) dateMap.set(k.date, []);
    dateMap.get(k.date)!.push(k);
  });

  const result = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-days)
    .map(([date, kpis]) => {
      const sum = (field: keyof typeof kpis[0]) =>
        kpis.reduce((s, k) => s + (k[field] as number), 0);
      const totalRevenue = sum('revenue');
      const totalProfit = sum('profit');
      return {
        date,
        revenue: totalRevenue,
        profit: totalProfit,
        orders: sum('orders'),
        customers: sum('customers'),
        foodCost: sum('foodCost'),
        laborCost: sum('laborCost'),
        profitMargin: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 10000) / 100 : 0,
        foodCostRate: totalRevenue > 0 ? Math.round((sum('foodCost') / totalRevenue) * 10000) / 100 : 0,
        laborCostRate: totalRevenue > 0 ? Math.round((sum('laborCost') / totalRevenue) * 10000) / 100 : 0,
        satisfaction: kpis.length > 0
          ? Math.round((sum('satisfaction') / kpis.length) * 10) / 10
          : 0,
      };
    });

  res.json({
    code: 200,
    message: '获取每日KPI成功',
    data: result,
  });
});

export default router;
