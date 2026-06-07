import { Router, type Request, type Response } from 'express';
import { mockForecastItems, mockSupplierQuotes } from '../mock/data.js';

const router = Router();

router.post('/upload-promotion', async (req: Request, res: Response): Promise<void> => {
  const { fileName } = req.body as { fileName?: string };
  res.json({
    success: true,
    data: {
      message: `促销方案${fileName ? ' "' + fileName + '" ' : ''}上传成功`,
      extractedDishes: [
        { name: '招牌红烧肉', discountPrice: 38, originalPrice: 48 },
        { name: '松鼠鳜鱼', discountPrice: 58, originalPrice: 70 },
        { name: '蒜蓉西兰花', discountPrice: 16, originalPrice: 22 },
      ],
    },
  });
});

router.post('/upload-quote', async (req: Request, res: Response): Promise<void> => {
  const { fileName } = req.body as { fileName?: string };
  res.json({
    success: true,
    data: {
      message: `供应商报价单${fileName ? ' "' + fileName + '" ' : ''}上传成功`,
      supplierCount: 4,
      ingredientCount: 12,
    },
  });
});

router.get('/forecast', async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: {
      forecast: mockForecastItems,
      quotes: mockSupplierQuotes,
      totalSavedCost: mockSupplierQuotes.reduce((sum, q) => sum + (q.savedCost || 0), 0),
    },
  });
});

export default router;
