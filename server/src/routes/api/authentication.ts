import { NextFunction, Request, Response, Router } from 'express';

import { HTTP_OK_CODE } from 'exceptions/httpException';
import UserCollection from 'models/user';
import { logger } from '../../logger';
import requireJwtAuth from 'middleware/requireJwtAuth';
import requireLocalAuth from '../../middleware/requireLocalAuth';

const router = Router();

router.post('/login', requireLocalAuth, async (req: Request, res: Response) => {
  const user = req.body;
  const mongooseUser = await UserCollection.findOne({ username: user.username });
  const jsonUser = await mongooseUser!.toJson();
  const token = mongooseUser!.generateJWT();
  res.cookie('jwt', token, { httpOnly: true });
  res
    .status(HTTP_OK_CODE)
    .json({ success: true, isAuth: true, user: jsonUser, csrfToken: req.body._csrf });
});

router.post('/logout', requireJwtAuth, (req: Request, res: Response, next: NextFunction) => {
  res.cookie('jwt', 'invalidated-jwt-token');
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.send(true);
});

router.get('/csrftoken', (req: Request, res: Response) => {
  res.json({ CSRFToken: req.csrfToken() });
});

export default router;
