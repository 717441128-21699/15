import { Router, Request, Response } from 'express';
import { users } from '../mock/data.js';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      code: 400,
      message: '请输入用户名和密码',
    });
  }

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({
      code: 401,
      message: '用户名或密码错误',
    });
  }

  const { password: _pwd, ...userInfo } = user;

  res.json({
    code: 200,
    message: '登录成功',
    data: {
      token: user.id,
      user: userInfo,
    },
  });
});

router.get('/userinfo', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未登录或登录已过期',
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const user = users.find((u) => u.id === token);

  if (!user) {
    return res.status(401).json({
      code: 401,
      message: '用户信息无效',
    });
  }

  const { password: _pwd, ...userInfo } = user;

  res.json({
    code: 200,
    message: '获取用户信息成功',
    data: userInfo,
  });
});

router.post('/logout', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '退出登录成功',
  });
});

export default router;
