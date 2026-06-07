import { Router, Response } from 'express';
import { AuthRequest } from '../app.js';
import {
  stores,
  dailyKPIs,
  timeSlotData,
  wasteCategories,
  filterStoresByRole,
  filterDataByRole,
} from '../mock/data.js';

const router = Router();

router.get('/', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);

  const storesWithStats = allowedStores.map((store) => {
    const today = new Date().toISOString().split('T')[0];
    const todayKPI = dailyKPIs.find((k) => k.storeId === store.id && k.date === today);
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterdayKPI = dailyKPIs.find((k) => k.storeId === store.id && k.date === yesterday);

    return {
      ...store,
      todayRevenue: todayKPI?.revenue || 0,
      todayOrders: todayKPI?.orders || 0,
      todayCustomers: todayKPI?.customers || 0,
      todayProfitMargin: todayKPI?.profitMargin || 0,
      revenueChange:
        todayKPI && yesterdayKPI
          ? Math.round(((todayKPI.revenue - yesterdayKPI.revenue) / yesterdayKPI.revenue) * 10000) / 100
          : 0,
    };
  });

  res.json({
    code: 200,
    message: '获取门店列表成功',
    data: storesWithStats,
  });
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const storeId = req.params.id.toUpperCase();
  const store = allowedStores.find((s) => s.id.toUpperCase() === storeId);

  if (!store) {
    return res.status(404).json({ code: 404, message: '门店不存在或无权限访问' });
  }

  const recentKPIs = dailyKPIs
    .filter((k) => k.storeId === store.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  const totalRevenue = recentKPIs.reduce((sum, k) => sum + k.revenue, 0);
  const totalOrders = recentKPIs.reduce((sum, k) => sum + k.orders, 0);
  const totalProfit = recentKPIs.reduce((sum, k) => sum + k.profit, 0);
  const avgFoodCostRate = recentKPIs.length > 0
    ? Math.round((recentKPIs.reduce((sum, k) => sum + k.foodCostRate, 0) / recentKPIs.length) * 100) / 100
    : 0;
  const avgLaborCostRate = recentKPIs.length > 0
    ? Math.round((recentKPIs.reduce((sum, k) => sum + k.laborCostRate, 0) / recentKPIs.length) * 100) / 100
    : 0;
  const avgSatisfaction = recentKPIs.length > 0
    ? Math.round((recentKPIs.reduce((sum, k) => sum + k.satisfaction, 0) / recentKPIs.length) * 10) / 10
    : 0;

  res.json({
    code: 200,
    message: '获取门店详情成功',
    data: {
      ...store,
      stats: {
        totalRevenue,
        totalOrders,
        totalProfit,
        avgProfitMargin: recentKPIs.length > 0
          ? Math.round((totalProfit / totalRevenue) * 10000) / 100
          : 0,
        avgFoodCostRate,
        avgLaborCostRate,
        avgSatisfaction,
      },
    },
  });
});

router.get('/:id/sales-trend', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const storeId = req.params.id.toUpperCase();
  const store = allowedStores.find((s) => s.id.toUpperCase() === storeId);

  if (!store) {
    return res.status(404).json({ code: 404, message: '门店不存在或无权限访问' });
  }

  const days = parseInt(req.query.days as string) || 30;

  const trend = dailyKPIs
    .filter((k) => k.storeId === store.id)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days)
    .map((k) => ({
      date: k.date,
      revenue: k.revenue,
      profit: k.profit,
      orders: k.orders,
      customers: k.customers,
      profitMargin: k.profitMargin,
    }));

  res.json({
    code: 200,
    message: '获取销量趋势成功',
    data: trend,
  });
});

router.get('/:id/waste-category', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const storeId = req.params.id.toUpperCase();
  const store = allowedStores.find((s) => s.id.toUpperCase() === storeId);

  if (!store) {
    return res.status(404).json({ code: 404, message: '门店不存在或无权限访问' });
  }

  const data = wasteCategories.find((w) => w.storeId === store.id);

  res.json({
    code: 200,
    message: '获取损耗分类成功',
    data: data?.categories || [],
  });
});

router.get('/:id/time-slots', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const storeId = req.params.id.toUpperCase();
  const store = allowedStores.find((s) => s.id.toUpperCase() === storeId);

  if (!store) {
    return res.status(404).json({ code: 404, message: '门店不存在或无权限访问' });
  }

  const data = timeSlotData.find((t) => t.storeId === store.id);

  res.json({
    code: 200,
    message: '获取时段数据成功',
    data: data?.slots || [],
  });
});

export default router;
