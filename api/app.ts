import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { users, User, Region, UserRole } from './mock/data.js';

import authRouter from './routes/auth.js';
import storesRouter from './routes/stores.js';
import kpiRouter from './routes/kpi.js';
import dishesRouter from './routes/dishes.js';
import alertsRouter from './routes/alerts.js';
import procurementRouter from './routes/procurement.js';
import reportRouter from './routes/report.js';

export interface AuthRequest extends Request {
  user?: User;
  userRole?: UserRole;
  userRegion?: Region;
  userStoreId?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.path === '/api/auth/login') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const userRole = req.headers['x-user-role'] as string;
  const userRegion = req.headers['x-user-region'] as string;
  const userStoreId = req.headers['x-user-store-id'] as string;

  if (!userRole || !['headquarters', 'region', 'store'].includes(userRole)) {
    return res.status(401).json({ code: 401, message: '未授权访问，请设置正确的 x-user-role 请求头' });
  }

  let user: User | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    user = users.find((u) => u.id === token);
  }

  if (!user) {
    if (userRole === 'store' && userStoreId) {
      user = users.find((u) => u.role === 'store' && u.storeId === userStoreId);
    } else if (userRole === 'region' && userRegion) {
      user = users.find((u) => u.role === 'region' && u.region === userRegion);
    } else if (userRole === 'headquarters') {
      user = users.find((u) => u.role === 'headquarters');
    }
  }

  if (!user) {
    return res.status(401).json({ code: 401, message: '用户信息无效' });
  }

  req.user = user;
  req.userRole = user.role;
  req.userRegion = user.region;
  req.userStoreId = user.storeId;

  next();
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: AuthRequest, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/stores', authMiddleware, storesRouter);
app.use('/api/kpi', authMiddleware, kpiRouter);
app.use('/api/dishes', authMiddleware, dishesRouter);
app.use('/api/alerts', authMiddleware, alertsRouter);
app.use('/api/procurement', authMiddleware, procurementRouter);
app.use('/api/report', authMiddleware, reportRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '味道轩餐饮智能平台 API 服务正常运行',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ code: 404, message: '请求的资源不存在' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ code: 500, message: '服务器内部错误', error: err.message });
});

export default app;
