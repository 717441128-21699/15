import { Router, type Request, type Response } from 'express';
import { mockKPIData, mockHeatmapData } from '../mock/data.js';

const router = Router();

router.get('/summary', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: mockKPIData });
});

router.get('/heatmap', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: mockHeatmapData });
});

export default router;
