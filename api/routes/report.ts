import { Router, type Request, type Response } from 'express';
import { mockHealthReport } from '../mock/data.js';

const router = Router();

router.get('/weekly', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: mockHealthReport });
});

export default router;
