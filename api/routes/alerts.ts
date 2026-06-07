import { Router, Response } from 'express';
import { AuthRequest } from '../app.js';
import { alerts, stores, users, filterDataByRole } from '../mock/data.js';

const router = Router();

const getStoreName = (storeId: string) => stores.find((s) => s.id === storeId)?.name || storeId;
const getUserName = (userId?: string) => users.find((u) => u.id === userId)?.name || '-';

router.get('/', (req: AuthRequest, res: Response) => {
  const {
    status,
    level,
    type,
    storeId,
    page = '1',
    pageSize = '20',
  } = req.query;

  let filteredAlerts = filterDataByRole(alerts, req.userRole!, req.userRegion, req.userStoreId);

  if (status) {
    filteredAlerts = filteredAlerts.filter((a) => a.status === status);
  }
  if (level) {
    filteredAlerts = filteredAlerts.filter((a) => a.level === level);
  }
  if (type) {
    filteredAlerts = filteredAlerts.filter((a) => a.type === type);
  }
  if (storeId) {
    const sid = String(storeId).toUpperCase();
    filteredAlerts = filteredAlerts.filter((a) => a.storeId.toUpperCase() === sid);
  }

  const pageNum = parseInt(page as string, 10);
  const pageSizeNum = parseInt(pageSize as string, 10);
  const start = (pageNum - 1) * pageSizeNum;
  const end = start + pageSizeNum;

  const paginatedAlerts = filteredAlerts.slice(start, end).map((alert) => ({
    ...alert,
    storeName: getStoreName(alert.storeId),
  }));

  const statusStats = {
    pending: filteredAlerts.filter((a) => a.status === 'pending').length,
    confirmed: filteredAlerts.filter((a) => a.status === 'confirmed').length,
    reviewed: filteredAlerts.filter((a) => a.status === 'reviewed').length,
    approved: filteredAlerts.filter((a) => a.status === 'approved').length,
    resolved: filteredAlerts.filter((a) => a.status === 'resolved').length,
  };

  const levelStats = {
    level1: filteredAlerts.filter((a) => a.level === 'level1').length,
    level2: filteredAlerts.filter((a) => a.level === 'level2').length,
  };

  res.json({
    code: 200,
    message: '获取预警列表成功',
    data: {
      list: paginatedAlerts,
      total: filteredAlerts.length,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(filteredAlerts.length / pageSizeNum),
      statusStats,
      levelStats,
    },
  });
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const filteredAlerts = filterDataByRole(alerts, req.userRole!, req.userRegion, req.userStoreId);
  const alert = filteredAlerts.find((a) => a.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ code: 404, message: '预警不存在或无权限访问' });
  }

  res.json({
    code: 200,
    message: '获取预警详情成功',
    data: {
      ...alert,
      storeName: getStoreName(alert.storeId),
    },
  });
});

router.post('/:id/confirm', (req: AuthRequest, res: Response) => {
  const alert = alerts.find((a) => a.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ code: 404, message: '预警不存在' });
  }

  if (alert.status !== 'pending') {
    return res.status(400).json({ code: 400, message: '当前预警状态不允许确认操作' });
  }

  alert.status = 'confirmed';
  alert.approvalFlow = alert.approvalFlow || {};
  alert.approvalFlow.storeManagerConfirm = {
    userId: req.user?.id || '',
    userName: req.user?.name || '',
    status: 'approved',
    timestamp: new Date().toISOString(),
  };

  res.json({
    code: 200,
    message: '预警确认成功',
    data: {
      ...alert,
      storeName: getStoreName(alert.storeId),
    },
  });
});

router.post('/:id/review', (req: AuthRequest, res: Response) => {
  const alert = alerts.find((a) => a.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ code: 404, message: '预警不存在' });
  }

  if (alert.status !== 'confirmed') {
    return res.status(400).json({ code: 400, message: '当前预警状态不允许审核操作' });
  }

  if (req.userRole === 'store') {
    return res.status(403).json({ code: 403, message: '门店角色无审核权限' });
  }

  alert.status = 'reviewed';
  alert.approvalFlow = alert.approvalFlow || {};
  alert.approvalFlow.regionManagerReview = {
    userId: req.user?.id || '',
    userName: req.user?.name || '',
    status: 'approved',
    timestamp: new Date().toISOString(),
  };

  res.json({
    code: 200,
    message: '预警审核成功',
    data: {
      ...alert,
      storeName: getStoreName(alert.storeId),
    },
  });
});

router.post('/:id/approve', (req: AuthRequest, res: Response) => {
  const alert = alerts.find((a) => a.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ code: 404, message: '预警不存在' });
  }

  if (alert.status !== 'reviewed') {
    return res.status(400).json({ code: 400, message: '当前预警状态不允许审批操作' });
  }

  if (req.userRole !== 'headquarters') {
    return res.status(403).json({ code: 403, message: '仅总部角色有审批权限' });
  }

  alert.status = 'approved';
  alert.approvalFlow = alert.approvalFlow || {};
  alert.approvalFlow.hqDirectorApprove = {
    userId: req.user?.id || '',
    userName: req.user?.name || '',
    status: 'approved',
    timestamp: new Date().toISOString(),
  };

  res.json({
    code: 200,
    message: '预警审批成功',
    data: {
      ...alert,
      storeName: getStoreName(alert.storeId),
    },
  });
});

router.post('/:id/resolve', (req: AuthRequest, res: Response) => {
  const alert = alerts.find((a) => a.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ code: 404, message: '预警不存在' });
  }

  if (!['confirmed', 'reviewed', 'approved'].includes(alert.status)) {
    return res.status(400).json({ code: 400, message: '当前预警状态不允许解决操作' });
  }

  alert.status = 'resolved';

  res.json({
    code: 200,
    message: '预警已解决',
    data: {
      ...alert,
      storeName: getStoreName(alert.storeId),
    },
  });
});

export default router;
