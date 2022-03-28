import { HTTP_OK_CODE } from 'exceptions/httpException';
import { Router, Request, Response } from 'express';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import requireJwtAuth from 'middleware/requireJwtAuth';
import requireLocalAuth from '../../middleware/requireLocalAuth';

const router = Router();

router.post('/login', requireLocalAuth, (req: any, res: Response) => {
  const token = req.user.generateJWT();
  const user = req.user.toJSON();
  res.cookie('jwt', token, { httpOnly: true });
  res.status(HTTP_OK_CODE).json({ success: true, isAuth: true, user, csrfToken: req.body._csrf });
}, httpErrorMiddleware);

router.post('/logout', requireJwtAuth, (req: Request, res: Response) => {
  res.cookie('jwt', 'invalidated-jwt-token');
  req.logout();
  console.log('User successfully logged out');
  res.send(true);
}, httpErrorMiddleware);

router.get('/csrftoken', (req: Request, res: Response) => {
  res.json({ CSRFToken: req.csrfToken() });
});

export default router;
