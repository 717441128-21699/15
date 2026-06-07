import { Router, type Request, type Response } from 'express';
import { mockDishMargins } from '../mock/data.js';

const router = Router();

router.get('/margin-ranking', async (req: Request, res: Response): Promise<void> => {
  const { type = 'top', category } = req.query as { type?: 'top' | 'bottom'; category?: string };

  let dishes = [...mockDishMargins];

  if (category && category !== 'all') {
    dishes = dishes.filter((d) => d.category === category);
  }

  dishes.sort((a, b) => (type === 'top' ? b.grossMargin - a.grossMargin : a.grossMargin - b.grossMargin));

  res.json({ success: true, data: dishes.slice(0, 10) });
});

export default router;
