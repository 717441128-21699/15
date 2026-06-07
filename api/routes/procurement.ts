import { Router, Response } from 'express';
import { AuthRequest } from '../app.js';
import {
  promotions,
  supplierQuotes,
  demandForecasts,
  stores,
  users,
  filterStoresByRole,
  filterDataByRole,
} from '../mock/data.js';

const router = Router();

const getStoreName = (storeId: string) => stores.find((s) => s.id === storeId)?.name || storeId;
const getUserName = (userId: string) => users.find((u) => u.id === userId)?.name || '-';

router.get('/promotions', (req: AuthRequest, res: Response) => {
  const { status, storeId } = req.query;

  let filteredPromotions = filterDataByRole(promotions, req.userRole!, req.userRegion, req.userStoreId);

  if (status) {
    filteredPromotions = filteredPromotions.filter((p) => p.status === status);
  }
  if (storeId) {
    filteredPromotions = filteredPromotions.filter((p) => p.storeId === storeId);
  }

  const result = filteredPromotions
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .map((p) => ({
      ...p,
      storeName: getStoreName(p.storeId),
      uploadedByName: getUserName(p.uploadedBy),
    }));

  res.json({
    code: 200,
    message: '获取促销活动列表成功',
    data: result,
  });
});

router.post('/promotions', (req: AuthRequest, res: Response) => {
  const { storeId, name, type, startDate, endDate, discount } = req.body;

  if (!storeId || !name || !type || !startDate || !endDate) {
    return res.status(400).json({ code: 400, message: '请填写完整的促销信息' });
  }

  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  if (!allowedStores.find((s) => s.id === storeId)) {
    return res.status(403).json({ code: 403, message: '无权限操作该门店' });
  }

  const newPromo = {
    id: `PROMO${String(promotions.length + 1).padStart(4, '0')}`,
    storeId,
    name,
    type,
    startDate,
    endDate,
    discount: discount || 0.9,
    status: 'active' as const,
    uploadedBy: req.user?.id || '',
    uploadedAt: new Date().toISOString(),
  };

  promotions.push(newPromo);

  res.json({
    code: 200,
    message: '促销活动上传成功',
    data: {
      ...newPromo,
      storeName: getStoreName(newPromo.storeId),
      uploadedByName: getUserName(newPromo.uploadedBy),
    },
  });
});

router.post('/upload-promotion', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const dishCount = 15 + Math.floor(Math.random() * 20);

  res.json({
    code: 200,
    message: `促销方案解析成功，共识别 ${dishCount} 道促销菜品`,
    data: { message: '促销方案上传成功', dishCount },
  });
});

router.get('/supplier-quotes', (req: AuthRequest, res: Response) => {
  const { supplierName, valid } = req.query;

  let filteredQuotes = [...supplierQuotes];

  if (supplierName) {
    filteredQuotes = filteredQuotes.filter((q) =>
      q.supplierName.includes(supplierName as string)
    );
  }
  if (valid === 'true') {
    const today = new Date().toISOString().split('T')[0];
    filteredQuotes = filteredQuotes.filter(
      (q) => q.validFrom <= today && q.validTo >= today
    );
  }

  const result = filteredQuotes
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .map((q) => ({
      ...q,
      uploadedByName: getUserName(q.uploadedBy),
    }));

  res.json({
    code: 200,
    message: '获取供应商报价成功',
    data: result,
  });
});

router.post('/supplier-quotes', (req: AuthRequest, res: Response) => {
  const { supplierName, itemName, unit, price, quantity, validFrom, validTo } = req.body;

  if (!supplierName || !itemName || !unit || !price || !validFrom || !validTo) {
    return res.status(400).json({ code: 400, message: '请填写完整的报价信息' });
  }

  const newQuote = {
    id: `QUOTE${String(supplierQuotes.length + 1).padStart(4, '0')}`,
    supplierName,
    itemName,
    unit,
    price: Number(price),
    quantity: quantity || 100,
    validFrom,
    validTo,
    uploadedBy: req.user?.id || '',
    uploadedAt: new Date().toISOString(),
  };

  supplierQuotes.push(newQuote);

  res.json({
    code: 200,
    message: '供应商报价上传成功',
    data: {
      ...newQuote,
      uploadedByName: getUserName(newQuote.uploadedBy),
    },
  });
});

router.post('/upload-quote', (req: AuthRequest, res: Response) => {
  const supplierCount = 4 + Math.floor(Math.random() * 4);

  res.json({
    code: 200,
    message: `报价单解析成功，共识别 ${supplierCount} 家供应商报价`,
    data: { message: '报价单上传成功', supplierCount },
  });
});

router.get('/demand-forecast', (req: AuthRequest, res: Response) => {
  const { storeId, date } = req.query;

  let filteredForecasts = filterDataByRole(demandForecasts, req.userRole!, req.userRegion, req.userStoreId);

  if (storeId) {
    filteredForecasts = filteredForecasts.filter((f) => f.storeId === storeId);
  }
  if (date) {
    filteredForecasts = filteredForecasts.filter((f) => f.date === date);
  }

  const result = filteredForecasts
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((f) => ({
      ...f,
      storeName: getStoreName(f.storeId),
    }));

  res.json({
    code: 200,
    message: '获取需求预测成功',
    data: result,
  });
});

router.get('/demand-forecast/summary', (req: AuthRequest, res: Response) => {
  const allowedStores = filterStoresByRole(req.userRole!, req.userRegion, req.userStoreId);
  const storeId = req.query.storeId as string;

  let filteredForecasts = filterDataByRole(demandForecasts, req.userRole!, req.userRegion, req.userStoreId);
  if (storeId) {
    filteredForecasts = filteredForecasts.filter((f) => f.storeId === storeId);
  }

  const categoryMap = new Map<
    string,
    {
      category: string;
      items: Array<{ name: string; unit: string; totalForecast: number; totalActual?: number; avgConfidence: number }>;
    }
  >();

  filteredForecasts.forEach((forecast) => {
    forecast.items.forEach((item) => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, { category: item.category, items: [] });
      }
      const category = categoryMap.get(item.category)!;
      let existingItem = category.items.find((i) => i.name === item.name);
      if (!existingItem) {
        existingItem = {
          name: item.name,
          unit: item.unit,
          totalForecast: 0,
          avgConfidence: 0,
        };
        category.items.push(existingItem);
      }
      existingItem.totalForecast += item.forecastQuantity;
      if (item.actualQuantity !== undefined) {
        existingItem.totalActual = (existingItem.totalActual || 0) + item.actualQuantity;
      }
      existingItem.avgConfidence += item.confidence;
    });
  });

  const summary = Array.from(categoryMap.values()).map((cat) => ({
    category: cat.category,
    items: cat.items.map((item) => {
      const count = filteredForecasts.length;
      return {
        ...item,
        avgConfidence: count > 0 ? Math.round((item.avgConfidence / count) * 100) / 100 : 0,
        accuracyRate:
          item.totalActual && item.totalForecast > 0
            ? Math.round((1 - Math.abs(item.totalActual - item.totalForecast) / item.totalForecast) * 10000) / 100
            : null,
      };
    }),
  }));

  res.json({
    code: 200,
    message: '获取需求预测汇总成功',
    data: {
      storeCount: storeId ? 1 : allowedStores.length,
      forecastDays: new Set(filteredForecasts.map((f) => f.date)).size,
      categories: summary,
    },
  });
});

router.get('/forecast', (req: AuthRequest, res: Response) => {
  const ingredients = [
    { id: 'ing-001', name: '新鲜大白菜', unit: 'kg', base: 85 },
    { id: 'ing-002', name: '猪五花肉', unit: 'kg', base: 62 },
    { id: 'ing-003', name: '牛里脊', unit: 'kg', base: 38 },
    { id: 'ing-004', name: '三文鱼', unit: 'kg', base: 24 },
    { id: 'ing-005', name: '大米', unit: '袋(25kg)', base: 12 },
    { id: 'ing-006', name: '食用油', unit: '桶(5L)', base: 8 },
    { id: 'ing-007', name: '生抽酱油', unit: '瓶(1L)', base: 18 },
    { id: 'ing-008', name: '鸡蛋', unit: '箱(30枚)', base: 15 },
  ];

  const items = ingredients.map((ing, idx) => {
    const hourlyDemand: number[] = [];
    for (let h = 0; h < 72; h++) {
      const hourOfDay = h % 24;
      let factor = 0.2;
      if (hourOfDay >= 6 && hourOfDay < 9) factor = 0.6;
      else if (hourOfDay >= 10 && hourOfDay < 14) factor = hourOfDay === 12 ? 1.4 : 0.9;
      else if (hourOfDay >= 14 && hourOfDay < 17) factor = 0.25;
      else if (hourOfDay >= 17 && hourOfDay < 21) factor = hourOfDay === 19 ? 1.5 : 1.0;
      else if (hourOfDay >= 21) factor = 0.15;
      hourlyDemand.push(Math.round(ing.base / 24 * factor * (0.85 + Math.random() * 0.3)));
    }
    const totalDemand = hourlyDemand.reduce((a, b) => a + b, 0);
    return {
      ingredientId: ing.id,
      ingredientName: ing.name,
      unit: ing.unit,
      hourlyDemand,
      totalDemand,
      suggestedOrder: Math.round(totalDemand * 1.1),
    };
  });

  const suppliers = ['绿源蔬菜配送', '优质肉业', '海鲜直供', '粮油批发', '调味品专营', '饮品供应商'];
  const quotes = supplierQuotes.slice(0, 10).map((q, idx) => {
    const supplierIdx = suppliers.indexOf(q.supplierName);
    const supIdx = supplierIdx >= 0 ? supplierIdx : idx;
    return {
      supplierId: `sup-${String(supIdx + 1).padStart(3, '0')}`,
      supplierName: q.supplierName,
      ingredientId: `ing-${String(Math.floor(Math.random() * 8) + 1).padStart(3, '0')}`,
      ingredientName: q.itemName,
      price: q.price,
      minOrder: 10,
      deliveryTime: '次日08:00前送达',
      unit: q.unit,
    };
  });

  res.json({
    code: 200,
    message: '获取72小时采购预测成功',
    data: { items, quotes },
  });
});

export default router;
