import { Router, type Request, type Response } from 'express';
import { mockStores, mockSalesTrend, mockWastageCategories, generateTimeSlotData } from '../mock/data.js';
import type { UserRole } from '../../src/types/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const role = req.headers['x-user-role'] as UserRole;
  const storeId = req.headers['x-user-store-id'] as string;
  const regionId = req.headers['x-user-region-id'] as string;
  const { city, brand } = req.query as { city?: string; brand?: string };

  let stores = [...mockStores];

  if (role === 'store' && storeId) {
    stores = stores.filter((s) => s.id === storeId);
  } else if (role === 'region' && regionId) {
    stores = stores.filter((s) => s.regionId === regionId);
  }

  if (city) {
    stores = stores.filter((s) => s.city === city || s.province === city);
  }
  if (brand) {
    stores = stores.filter((s) => s.brand === brand);
  }

  res.json({ success: true, data: stores });
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const store = mockStores.find((s) => s.id === id);

  if (!store) {
    res.status(404).json({ success: false, message: '门店不存在' });
    return;
  }

  res.json({ success: true, data: store });
});

router.get('/:id/sales-trend', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: mockSalesTrend });
});

router.get('/:id/wastage-category', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: mockWastageCategories });
});

router.get('/:id/time-slot', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: generateTimeSlotData() });
});

export default router;
