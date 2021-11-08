import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import faker from 'faker';

import User from '../models/User';
import requireLocalAuth from '../middleware/requireLocalAuth';
import { registerSchema } from '../services/validators';
import { Schema } from 'mongoose';

const router = Router();

router.post('/login', requireLocalAuth, (req: Request, res: Response) => {
  // @ts-ignore
  const token = req.user.generateJWT();
  // @ts-ignore
  const user = req.user.toJSON();
  // httpOnly means cookie can't be accessed via JS
  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json({ success: true, token, user });
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const someJoi : any = Joi;
  const { error } = someJoi.validate(req.body, registerSchema);
  if (error) {
    console.error("Failed registration validation")
    return res.status(422).send({ success: false, message: error.details[0].message });
  }

  // const { email, password, name, username } = req.body;
  const { username, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(422).send({ success: false, message: 'Username is in use' });
    }

    try {
      const newUser = await new User({
        // provider: 'email',
        // email,
        username,
        password,
        name,
        // avatar: faker.image.avatar(),
      });

      newUser.registerUser(newUser, (err, user) => {
        if (err) throw err;
        res.status(200).json({ success: true, message: 'Register success.' }); // just redirect to login
      });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
});

// logout
router.get('/logout', (req: Request, res: Response) => {
  console.log('User successfully logged out');
  res.cookie('jwt', 'invalidated-jwt-token');
  req.logout();
  res.send(false);
});

export default router;
