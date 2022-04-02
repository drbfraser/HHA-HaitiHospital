import { Router, Request, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import User, { hashPassword, Role, validateUserSchema } from '../../models/user';
import { checkIsInRole } from '../../utils/authUtils';
import { registerUserCreate, registerUserEdit } from '../../schema/registerUser';
import { msgCatchError } from 'utils/sanitizationMessages';
import { DepartmentName } from 'common/definitions/departments';

const router = Router();
interface UserData {
  username: string;
  password: string;
  name: string;
  department: DepartmentName;
  role: Role;
}

router.put('/:id', requireJwtAuth, checkIsInRole(Role.Admin), registerUserEdit, validateInput, async (req: Request, res: Response) => {
  try {
    const userData: UserData = setGeneralDepartmentForAdminAndMedicalDir(req.body);
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'No such user' });

    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser && existingUser.username !== targetUser.username) {
      return res.status(422).json({ message: 'Username is taken' });
    }

    let password: string | null = null;
    if (userData.password && userData.password !== '') {
      password = await hashPassword(userData.password);
    }

    const updatedUser = { name: userData.name, username: userData.username, password, role: userData.role, department: userData.department };
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    const user = await User.findByIdAndUpdate(targetUser.id, { $set: updatedUser }, { new: true });

    res.status(201).json(user);
  } catch (err: any) {
    res.status(500).json(msgCatchError);
  }
});

router.get('/me', requireJwtAuth, async (req, res) => {
  res.json(req.user);
});

// get one user, currently working
router.get('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findById(req.params.id);
    if (!foundUser) return res.status(404).json({ message: 'No such user' });
    res.status(200).json(foundUser);
  } catch (err: any) {
    res.status(500).json(msgCatchError);
  }
});

// get all users, currently working
router.get('/', requireJwtAuth, checkIsInRole(Role.Admin), async (req: Request, res: Response) => {
  try {
    const users: [] = await User.find().sort({ createdAt: 'desc' });
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json(msgCatchError);
  }
});

// delete user, currently working without req.user
router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req: Request, res: Response) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user' });
    const user = await User.findByIdAndRemove(tempUser.id);
    res.status(204).json(user);
  } catch (err: any) {
    res.status(500).json(msgCatchError);
  }
});

// add user, currently working
router.post('/', requireJwtAuth, checkIsInRole(Role.Admin), registerUserCreate, validateInput, async (req: Request, res: Response) => {
  try {
    const userData: UserData = setGeneralDepartmentForAdminAndMedicalDir(req.body);
    let { username, password, name, role, department } = userData;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(422).send({ message: 'Username is in use' });
    }

    const newUser = await new User({
      username,
      password,
      name,
      role,
      department
    });

    const validationResult = validateUserSchema.validate({
      username,
      password,
      name,
      role,
      department
    });

    if (validationResult.error) {
      let errorMessage = validationResult.error.details[0].message.replace(/["]+/g, '');
      errorMessage = errorMessage[0].toUpperCase() + errorMessage.slice(1);
      return res.status(403).json({ message: errorMessage });
    }

    newUser.registerUser(newUser, (err: any) => {
      if (err) throw err;
      res.status(201).json({ message: 'Successfully added user.' });
    });
  } catch (err: any) {
    res.status(500).json(msgCatchError);
  }
});

const setGeneralDepartmentForAdminAndMedicalDir = (data: UserData): UserData => {
  if (data.role === Role.Admin || data.role === Role.MedicalDirector) {
    data.department = DepartmentName.General;
  }
  return data;
};

export default router;
