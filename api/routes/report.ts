import { Router, Response } from 'express';
import { AuthRequest } from '../app.js';
import {
  weeklyReports,
  stores,
  dailyKPIs,
  filterStoresByRole,
  filterDataByRole,
} from '../mock/data.js';

const router = Router();

const getStoreName = (storeId?: string) => (storeId ? stores.find((s) => s.id === storeId)?.name || storeId : '全部门店');

router.get('/weekly', (req: AuthRequest, res: Response) => {
  const { storeId, latest } = req.query;

  let filteredReports = weeklyReports.filter((r) => {
    if (req.userRole === 'headquarters') {
      return storeId ? r.storeId === storeId : r.storeId === undefined;
    }
    if (req.userRole === 'region') {
      const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
      const allowedIds = new Set(allowedStores.map((s) => s.id));
      if (storeId) {
        return r.storeId === storeId && allowedIds.has(storeId);
      }
      return r.storeId === undefined;
    }
    return r.storeId === req.userStoreId;
  });

  if (latest === 'true') {
    const sortedReports = filteredReports.sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
    const latestDate = sortedReports[0]?.endDate;
    filteredReports = sortedReports.filter((r) => r.endDate === latestDate);
  } else {
    filteredReports = filteredReports.sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
  }

  const result = filteredReports.map((r) => ({
    ...r,
    storeName: getStoreName(r.storeId),
  }));

  res.json({
    code: 200,
    message: '获取每周健康报告成功',
    data: result,
  });
});

router.get('/latest', (req: AuthRequest, res: Response) => {
  const { storeId } = req.query;

  let filteredReports = weeklyReports.filter((r) => {
    if (req.userRole === 'headquarters') {
      return storeId ? r.storeId === storeId : r.storeId === undefined;
    }
    if (req.userRole === 'region') {
      const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
      const allowedIds = new Set(allowedStores.map((s) => s.id));
      if (storeId) {
        return r.storeId === storeId && allowedIds.has(storeId);
      }
      return r.storeId === undefined;
    }
    return r.storeId === req.userStoreId;
  });

  const latest = filteredReports.sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  )[0];

  if (!latest) {
    return res.status(404).json({ code: 404, message: '未找到报告数据' });
  }

  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const allowedStoreIds = new Set(allowedStores.map((s) => s.id));

  const reportKPIs = dailyKPIs.filter(
    (k) =>
      allowedStoreIds.has(k.storeId) &&
      k.date >= latest.startDate &&
      k.date <= latest.endDate
  );

  const totalRevenue = reportKPIs.reduce((sum, k) => sum + k.revenue, 0);
  const totalProfit = reportKPIs.reduce((sum, k) => sum + k.profit, 0);
  const totalOrders = reportKPIs.reduce((sum, k) => sum + k.orders, 0);
  const totalCustomers = reportKPIs.reduce((sum, k) => sum + k.customers, 0);
  const totalFoodCost = reportKPIs.reduce((sum, k) => sum + k.foodCost, 0);
  const totalLaborCost = reportKPIs.reduce((sum, k) => sum + k.laborCost, 0);

  const dailyTrend: Array<{
    date: string;
    revenue: number;
    profit: number;
    profitMargin: number;
  }> = [];
  const dateMap = new Map<string, typeof dailyKPIs>();
  reportKPIs.forEach((k) => {
    if (!dateMap.has(k.date)) dateMap.set(k.date, []);
    dateMap.get(k.date)!.push(k);
  });

  dateMap.forEach((kpis, date) => {
    const dayRevenue = kpis.reduce((sum, k) => sum + k.revenue, 0);
    const dayProfit = kpis.reduce((sum, k) => sum + k.profit, 0);
    dailyTrend.push({
      date,
      revenue: dayRevenue,
      profit: dayProfit,
      profitMargin: dayRevenue > 0 ? Math.round((dayProfit / dayRevenue) * 10000) / 100 : 0,
    });
  });
  dailyTrend.sort((a, b) => a.date.localeCompare(b.date));

  const storeRanking = allowedStores.map((store) => {
    const storeKPIs = reportKPIs.filter((k) => k.storeId === store.id);
    const storeRevenue = storeKPIs.reduce((sum, k) => sum + k.revenue, 0);
    const storeProfit = storeKPIs.reduce((sum, k) => sum + k.profit, 0);
    return {
      storeId: store.id,
      storeName: store.name,
      city: store.city,
      revenue: storeRevenue,
      profit: storeProfit,
      profitMargin: storeRevenue > 0 ? Math.round((storeProfit / storeRevenue) * 10000) / 100 : 0,
      foodCostRate: storeRevenue > 0
        ? Math.round((storeKPIs.reduce((sum, k) => sum + k.foodCost, 0) / storeRevenue) * 10000) / 100
        : 0,
      satisfaction: storeKPIs.length > 0
        ? Math.round((storeKPIs.reduce((sum, k) => sum + k.satisfaction, 0) / storeKPIs.length) * 10) / 10
        : 0,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  res.json({
    code: 200,
    message: '获取最新健康报告成功',
    data: {
      report: {
        ...latest,
        storeName: getStoreName(latest.storeId),
      },
      summary: {
        totalRevenue,
        totalProfit,
        totalOrders,
        totalCustomers,
        profitMargin: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 10000) / 100 : 0,
        foodCostRate: totalRevenue > 0 ? Math.round((totalFoodCost / totalRevenue) * 10000) / 100 : 0,
        laborCostRate: totalRevenue > 0 ? Math.round((totalLaborCost / totalRevenue) * 10000) / 100 : 0,
      },
      dailyTrend,
      storeRanking,
    },
  });
});

export default router;
