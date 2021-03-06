import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import UserCollection, { hashPassword, Role, User, validateUserSchema } from '../../models/user';
import Departments from 'utils/departments';
import { BadRequest, Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';
import { IllegalState } from 'exceptions/systemException';
import { registerUserCreate, registerUserEdit } from 'sanitization/schemas/registerUser';

const router = Router();

router.put('/:id', requireJwtAuth, roleAuth(Role.Admin), registerUserEdit, validateInput, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUser = await UserCollection.findById(req.params.id);
    if (!targetUser) {
      throw new NotFound(`No user with provided Id found`);
    }

    const updatedUser = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
      departmentId: req.body.department.id
    };

    const existingUser = await UserCollection.findOne({ username: updatedUser.username }).lean();
    if (existingUser && existingUser.username !== targetUser.username) {
      throw new Conflict(`Username ${req.body.username} is taken`);
    }

    if (updatedUser.password && updatedUser.password !== '') {
      updatedUser.password = await hashPassword(updatedUser.password);
    }
    if (!(await Departments.Database.validateDeptId(updatedUser.departmentId))) {
      throw new BadRequest(`Invalid department id ${updatedUser.departmentId}`);
    }

    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    await UserCollection.findByIdAndUpdate(targetUser.id, { $set: updatedUser }, { new: true });

    res.sendStatus(HTTP_NOCONTENT_CODE);
  } catch (e) {
    next(e);
  }
});

router.get('/me', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const doc = await UserCollection.findOne({ username: req.user.username });
    if (!doc) {
      throw new IllegalState(`Can not find username for the requesting user`);
    }
    const json = await doc.toJson();
    res.status(HTTP_OK_CODE).json(json);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundUser = await UserCollection.findById(req.params.id);
    if (!foundUser) {
      throw new NotFound(`No user with provided id available`);
    }
    const json = await foundUser.toJson();
    res.status(HTTP_OK_CODE).json(json);
  } catch (e) {
    next(e);
  }
});

router.get('/', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserCollection.find().sort({ createdAt: 'desc' });
    const jsonUsers = await Promise.all(users.map((user) => user.toJson()));
    res.status(HTTP_OK_CODE).json(jsonUsers);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await UserCollection.findByIdAndRemove(userId);
    if (!user) {
      throw new NotFound(`No user with provided id found`);
    }
    res.sendStatus(HTTP_NOCONTENT_CODE);
  } catch (e) {
    next(e);
  }
});

router.post('/', requireJwtAuth, roleAuth(Role.Admin), registerUserCreate, validateInput, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { username, password, name, role, department } = req.body;
    let departmentId = department.id;
    const existingUser = await UserCollection.findOne({ username });
    if (existingUser) {
      throw new Conflict(`Username ${username} exists`);
    }
    if (!(await Departments.Database.validateDeptId(departmentId))) {
      throw new BadRequest(`Invalid department id ${department.id}`);
    }

    const userInfo: User = {
      username: username,
      password: password,
      name: name,
      role: role,
      departmentId: departmentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newUser = new UserCollection(userInfo);
    console.log('Validating user schema using joi');
    const validationResult = validateUserSchema.validate({
      username,
      password,
      name,
      role,
      departmentId
    });

    if (validationResult.error) {
      let errorMessage = validationResult.error.details[0].message.replace(/["]+/g, '');
      errorMessage = errorMessage[0].toUpperCase() + errorMessage.slice(1);
      throw new BadRequest(errorMessage);
    }

    newUser.registerUser(newUser, (err: any) => {
      if (err) throw new InternalError(`Failed to register new user: ${err}`);
      res.status(HTTP_CREATED_CODE).send(`New user created`);
    });
  } catch (e) {
    next(e);
  }
});

export default router;
