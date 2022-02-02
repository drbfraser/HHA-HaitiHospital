import { Router, Request, Response } from 'express';
import requireLocalAuth from '../middleware/requireLocalAuth';

const router = Router();

router.post('/login', requireLocalAuth, (req: any, res: Response) => {
  const token = req.user.generateJWT();
  const user = req.user.toJSON();
  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json({ success: true, isAuth: true, user });
});

router.get('/logout', (req: Request, res: Response) => {
  console.log('User successfully logged out');
  res.cookie('jwt', 'invalidated-jwt-token');
  req.logout();
  res.send(false);
});

export default router;
