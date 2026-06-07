import { Router, type Request, type Response } from 'express';
import { mockUsers } from '../mock/data.js';
import type { User, UserRole } from '../../src/types/index.js';

const router = Router();

const TOKEN_MAP: Record<string, User> = {};

mockUsers.forEach((user) => {
  TOKEN_MAP[`token-${user.id}`] = user;
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, role } = req.body as { username?: string; role?: UserRole };
  let user: User | undefined;

  if (role) {
    user = mockUsers.find((u) => u.role === role);
  } else {
    user = mockUsers[0];
  }

  if (!user) {
    res.status(401).json({ success: false, message: '登录失败' });
    return;
  }

  const token = `token-${user.id}`;
  res.json({
    success: true,
    data: {
      token,
      user,
    },
  });
});

router.get('/profile', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || '';
  const user = TOKEN_MAP[token];

  if (!user) {
    res.status(401).json({ success: false, message: '未登录' });
    return;
  }

  res.json({ success: true, data: user });
});

export default router;
