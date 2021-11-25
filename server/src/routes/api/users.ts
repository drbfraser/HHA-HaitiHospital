import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import User, { hashPassword, validateUser, Role, validateUserSchema } from '../../models/User';
import Message from '../../models/Message';
import { seedDb } from '../../utils/seed';
import { checkIsInRole } from '../../utils/roleUtils';

const router = Router();

router.put('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req : Request, res : Response, next : NextFunction) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(422).send({ message: 'Username is in use' });
    }

    let password = null;
    if (req.body.password && req.body.password !== '') {
      password = await hashPassword(req.body.password);
    }

    const updatedUser = { name: req.body.name, username: req.body.username, password, role: req.body.role, department: req.body.department };
    // remove '', null, undefined
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    const user = await User.findByIdAndUpdate(tempUser.id, { $set: updatedUser }, { new: true });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/me', requireJwtAuth, async (req, res) => {
  res.json(req.user);
});

// get one user, currently working
router.get('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req, res) => {
  User.findById(req.params.id)
      .then(data => res.json(data))
      .catch(err => res.status(400).json({ message: 'Failed to get user: ' + err}));
});

// get all users, currently working
router.get('/', requireJwtAuth, checkIsInRole(Role.Admin), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 'desc' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// delete user, currently working without req.user 
router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req, res) => {
  try {
    const tempUser = await User.findById(req.params.id);
    console.log(tempUser);
    const reqUser : any = req.user;
    console.log(reqUser);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });

    const user = await User.findByIdAndRemove(tempUser.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// add user, currently working
router.post('/', requireJwtAuth, checkIsInRole(Role.Admin), async (req, res) => {
  try {
    const { username, password, name, role, department } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(422).send({ message: 'Username is in use' });
    }

    const newUser = await new User({
      username,
      password,
      name,
      role,
      department,
    });

    await validateUserSchema.validateAsync({
      username,
      password,
      name,
      role,
      department,
    });

    newUser.registerUser(newUser, (err, user) => {
      if (err) throw err;
      res.json({ message: 'Successfully added user.' }); // just redirect to login
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
