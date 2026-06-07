import { Router, Response } from 'express';
import { AuthRequest } from '../app.js';
import { dishes, stores, filterDataByRole } from '../mock/data.js';

const router = Router();

router.get('/gross-margin-ranking', (req: AuthRequest, res: Response) => {
  const storeId = req.query.storeId as string;
  const category = req.query.category as string;
  const limit = parseInt(req.query.limit as string) || 20;
  const sortBy = (req.query.sortBy as string) || 'grossMargin';

  let filteredDishes = filterDataByRole(dishes, req.userRole!, req.userRegion, req.userStoreId);

  if (storeId) {
    filteredDishes = filteredDishes.filter((d) => d.storeId === storeId);
  }
  if (category) {
    filteredDishes = filteredDishes.filter((d) => d.category === category);
  }

  const aggregatedMap = new Map<
    string,
    {
      name: string;
      category: string;
      totalSalesAmount: number;
      totalSalesCount: number;
      avgPrice: number;
      avgCost: number;
      weightedGrossMargin: number;
      storeCount: number;
    }
  >();

  filteredDishes.forEach((dish) => {
    if (!aggregatedMap.has(dish.name)) {
      aggregatedMap.set(dish.name, {
        name: dish.name,
        category: dish.category,
        totalSalesAmount: 0,
        totalSalesCount: 0,
        avgPrice: 0,
        avgCost: 0,
        weightedGrossMargin: 0,
        storeCount: 0,
      });
    }
    const entry = aggregatedMap.get(dish.name)!;
    entry.totalSalesAmount += dish.salesAmount;
    entry.totalSalesCount += dish.salesCount;
    entry.avgPrice += dish.price;
    entry.avgCost += dish.cost;
    entry.weightedGrossMargin += dish.grossMargin * dish.salesAmount;
    entry.storeCount++;
  });

  const ranking = Array.from(aggregatedMap.values())
    .map((entry) => ({
      name: entry.name,
      category: entry.category,
      salesAmount: Math.round(entry.totalSalesAmount * 100) / 100,
      salesCount: entry.totalSalesCount,
      avgPrice: Math.round((entry.avgPrice / entry.storeCount) * 100) / 100,
      avgCost: Math.round((entry.avgCost / entry.storeCount) * 100) / 100,
      grossMargin:
        entry.totalSalesAmount > 0
          ? Math.round((entry.weightedGrossMargin / entry.totalSalesAmount) * 100) / 100
          : 0,
      grossProfit:
        Math.round(entry.totalSalesAmount * (entry.weightedGrossMargin / entry.totalSalesAmount / 100) * 100) /
        100,
    }))
    .sort((a, b) => {
      if (sortBy === 'salesAmount') return b.salesAmount - a.salesAmount;
      if (sortBy === 'salesCount') return b.salesCount - a.salesCount;
      if (sortBy === 'grossProfit') return b.grossProfit - a.grossProfit;
      return b.grossMargin - a.grossMargin;
    })
    .slice(0, limit)
    .map((d, i) => ({
      rank: i + 1,
      ...d,
    }));

  res.json({
    code: 200,
    message: '获取菜品毛利排名成功',
    data: ranking,
  });
});

router.get('/categories', (req: AuthRequest, res: Response) => {
  let filteredDishes = filterDataByRole(dishes, req.userRole!, req.userRegion, req.userStoreId);

  const categoryMap = new Map<
    string,
    {
      name: string;
      dishCount: number;
      totalSalesAmount: number;
      totalSalesCount: number;
      avgGrossMargin: number;
    }
  >();

  filteredDishes.forEach((dish) => {
    if (!categoryMap.has(dish.category)) {
      categoryMap.set(dish.category, {
        name: dish.category,
        dishCount: 0,
        totalSalesAmount: 0,
        totalSalesCount: 0,
        avgGrossMargin: 0,
      });
    }
    const entry = categoryMap.get(dish.category)!;
    entry.dishCount++;
    entry.totalSalesAmount += dish.salesAmount;
    entry.totalSalesCount += dish.salesCount;
    entry.avgGrossMargin += dish.grossMargin * dish.salesAmount;
  });

  const categories = Array.from(categoryMap.values())
    .map((entry) => ({
      name: entry.name,
      dishCount: entry.dishCount,
      salesAmount: Math.round(entry.totalSalesAmount * 100) / 100,
      salesCount: entry.totalSalesCount,
      avgGrossMargin:
        entry.totalSalesAmount > 0
          ? Math.round((entry.avgGrossMargin / entry.totalSalesAmount) * 100) / 100
          : 0,
    }))
    .sort((a, b) => b.salesAmount - a.salesAmount);

  res.json({
    code: 200,
    message: '获取菜品分类成功',
    data: categories,
  });
});

export default router;
