import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import User, { hashPassword, validateUser } from '../../models/User';
import Message from '../../models/Message';
import { seedDb } from '../../utils/seed';
import { checkIsInRole, ROLES } from '../../utils/roleUtils';

const router = Router();

router.put('/:id', requireJwtAuth, async (req : Request, res : Response, next : NextFunction) => {
  try {
    const tempUser = await User.findById(req.params.id);
    const reqUser : any = req.user;
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });

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
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/reseed', async (req, res) => {
  await seedDb();
  res.json({ message: 'Database reseeded successfully.' });
});

router.get('/me', requireJwtAuth, async (req, res) => {
  // const reqUser : any = req.user;
  // const me : any = req.user.toJSON();
  const me : any = JSON.parse(JSON.stringify(req.user));
  res.json({ me });
});

// get one user, currently working
router.get('/:id', requireJwtAuth, async (req, res) => {
  User.findById(req.params.id)
      .then(data => res.json(data))
      .catch(err => res.status(400).json('Failed to get user: ' + err));
});

// get all users, currently working
router.get('/', requireJwtAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 'desc' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// delete user, currently working without req.user 
router.delete('/:id', requireJwtAuth, checkIsInRole(ROLES.Admin), async (req, res) => {
  try {
    const tempUser = await User.findById(req.params.id);
    console.log(tempUser);
    const reqUser : any = req.user;
    console.log(reqUser);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });

    const user = await User.findByIdAndRemove(tempUser.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// add user, currently working
router.post('/', requireJwtAuth, checkIsInRole(ROLES.Admin), async (req, res) => {
  try {
    const reqUser : any = req.user;

    const { username, password, name, role, department } = req.body;

    const existingUser = await User.findOne({ username });

    console.log(req.body);
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

    newUser.registerUser(newUser, (err, user) => {
      if (err) throw err;
      res.json({ message: 'Successfully added user.' }); // just redirect to login
    });

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
