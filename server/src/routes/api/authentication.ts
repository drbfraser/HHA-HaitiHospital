
import { HTTP_OK_CODE } from 'exceptions/httpException';
import { Router, Request, Response } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import UserModel from 'models/user';
import { RequestWithUser } from 'utils/definitions/express';
import requireLocalAuth from '../../middleware/requireLocalAuth';

const router = Router();

router.post('/login', requireLocalAuth, async (req: RequestWithUser, res: Response) => {
  const user = req.user;
  const mongooseUser = await UserModel.findOne({username: user.username});
  const jsonUser = mongooseUser!.toJson();
  const token = mongooseUser!.generateJWT();
  res.cookie('jwt', token, { httpOnly: true });
  res.status(HTTP_OK_CODE).json({ success: true, isAuth: true, user: jsonUser, csrfToken: req.body._csrf });
});

router.post('/logout', requireJwtAuth, (req: RequestWithUser, res: Response) => {
  res.cookie('jwt', 'invalidated-jwt-token');
  req.logout();
  console.log('User successfully logged out');
  res.send(true);
});

router.get('/csrftoken', (req: Request, res: Response) => {
  res.json({ CSRFToken: req.csrfToken() });
});

export default router;
