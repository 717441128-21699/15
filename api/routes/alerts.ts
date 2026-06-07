import { Router, type Request, type Response } from 'express';
import { mockAlerts } from '../mock/data.js';
import type { Alert, AlertStatus, UserRole } from '../../src/types/index.js';

const router = Router();

let alertsData = [...mockAlerts];

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const role = req.headers['x-user-role'] as UserRole;
  const storeId = req.headers['x-user-store-id'] as string;
  const regionId = req.headers['x-user-region-id'] as string;
  const { level, status } = req.query as { level?: string; status?: string };

  let alerts = [...alertsData];

  if (role === 'store' && storeId) {
    alerts = alerts.filter((a) => a.storeId === storeId);
  }

  if (level) {
    alerts = alerts.filter((a) => a.level === level);
  }
  if (status) {
    alerts = alerts.filter((a) => a.status === status);
  }

  alerts.sort((a, b) => {
    const levelOrder: Record<string, number> = { level2: 0, level1: 1 };
    const statusOrder: Record<string, number> = { pending: 0, confirmed: 1, reviewed: 2, approved: 3, resolved: 4, expired: 5 };
    if (levelOrder[a.level] !== levelOrder[b.level]) return levelOrder[a.level] - levelOrder[b.level];
    return statusOrder[a.status] - statusOrder[b.status];
  });

  res.json({ success: true, data: alerts });
});

router.post('/:id/confirm', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { comment, userName, userId } = req.body as { comment?: string; userName: string; userId: string };

  const alert = alertsData.find((a) => a.id === id);
  if (!alert) {
    res.status(404).json({ success: false, message: '预警不存在' });
    return;
  }

  alert.status = 'confirmed';
  alert.approvalFlow = {
    ...alert.approvalFlow,
    storeManagerConfirm: {
      userId,
      userName,
      status: 'approved',
      comment,
      timestamp: new Date().toISOString(),
    },
  };

  res.json({ success: true, data: alert });
});

router.post('/:id/review', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { comment, userName, userId } = req.body as { comment?: string; userName: string; userId: string };

  const alert = alertsData.find((a) => a.id === id);
  if (!alert) {
    res.status(404).json({ success: false, message: '预警不存在' });
    return;
  }

  alert.status = 'reviewed';
  alert.approvalFlow = {
    ...alert.approvalFlow,
    regionManagerReview: {
      userId,
      userName,
      status: 'approved',
      comment,
      timestamp: new Date().toISOString(),
    },
  };

  res.json({ success: true, data: alert });
});

router.post('/:id/approve', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { comment, userName, userId } = req.body as { comment?: string; userName: string; userId: string };

  const alert = alertsData.find((a) => a.id === id);
  if (!alert) {
    res.status(404).json({ success: false, message: '预警不存在' });
    return;
  }

  alert.status = 'approved';
  alert.approvalFlow = {
    ...alert.approvalFlow,
    hqDirectorApprove: {
      userId,
      userName,
      status: 'approved',
      comment,
      timestamp: new Date().toISOString(),
    },
  };

  res.json({ success: true, data: alert });
});

router.post('/:id/resolve', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const alert = alertsData.find((a) => a.id === id);
  if (!alert) {
    res.status(404).json({ success: false, message: '预警不存在' });
    return;
  }

  alert.status = 'resolved';
  res.json({ success: true, data: alert });
});

export default router;
