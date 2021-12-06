import { Router, Request, Response } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import User, { hashPassword, Role, validateUserSchema, validateUpdatedUserSchema } from '../../models/User';
import { checkIsInRole } from '../../utils/authUtils';

const router = Router();

router.put('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req : Request, res : Response) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user' });

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.username !== tempUser.username) {
      return res.status(422).json({ message: 'Username is in use' });
    }

    const validationResult = validateUpdatedUserSchema.validate({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
      department: req.body.department,
    });

    if (validationResult.error) {
      let errorMessage = validationResult.error.details[0].message.replace(/["]+/g, '');
      errorMessage = errorMessage[0].toUpperCase() + errorMessage.slice(1);
      return res.status(403).json({ message: errorMessage });
    }

    let password = null;
    if (req.body.password && req.body.password !== '') {
      password = await hashPassword(req.body.password);
    }

    const updatedUser = { name: req.body.name, username: req.body.username, password, role: req.body.role, department: req.body.department };
    // remove '', null, undefined
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    const user = await User.findByIdAndUpdate(tempUser.id, { $set: updatedUser }, { new: true });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/me', requireJwtAuth, async (req, res) => {
  res.json(req.user);
});

// get one user, currently working
router.get('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    if (!foundUser) return res.status(404).json({ message: 'No such user' });
    res.json(foundUser);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// get all users, currently working
router.get('/', requireJwtAuth, checkIsInRole(Role.Admin), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 'desc' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// delete user, currently working without req.user 
router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req, res) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user' });

    const user = await User.findByIdAndRemove(tempUser.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
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

    const validationResult = validateUserSchema.validate({
      username,
      password,
      name,
      role,
      department,
    });

    if (validationResult.error) {
      let errorMessage = validationResult.error.details[0].message.replace(/["]+/g, '');
      errorMessage = errorMessage[0].toUpperCase() + errorMessage.slice(1);
      return res.status(403).json({ message: errorMessage });
    }

    newUser.registerUser(newUser, (err, user) => {
      if (err) throw err;
      res.json({ message: 'Successfully added user.' }); // just redirect to login
    });

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
