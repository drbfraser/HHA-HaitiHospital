import { Router, Request, Response } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import requireLocalAuth from '../../middleware/requireLocalAuth';

const router = Router();

router.post('/login', requireLocalAuth, (req: any, res: Response) => {
  const token = req.user.generateJWT();
  const user = req.user.toJSON();
  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json({ success: true, isAuth: true, user, csrfToken: req.body._csrf });
});

router.post('/logout', requireJwtAuth, (req: Request, res: Response) => {
  console.log('User successfully logged out');
  res.cookie('jwt', 'invalidated-jwt-token');
  req.logout();
  res.redirect('/');
});

router.get('/csrftoken', (req: Request, res: Response) => {
  res.json({ CSRFToken: req.csrfToken() });
});

export default router;
