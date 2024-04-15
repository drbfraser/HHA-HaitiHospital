import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import UserCollection, { hashAlgorithm, hashPassword, Role, User } from '../../models/user';
import Departments from 'utils/departments';
import {
  BadRequest,
  Conflict,
  HTTP_CREATED_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_OK_CODE,
  HTTP_UNPROCESSABLE_ENTITY_CODE,
  InternalError,
  NotFound,
} from 'exceptions/httpException';
import { roleAuth } from 'middleware/roleAuth';
import { IllegalState } from 'exceptions/systemException';
import { user as inputValidator } from 'sanitization/schemas/user';
import { isValidPasswordString } from 'utils/utils';

const router = Router();

// Update existing user
router.put(
  '/:id',
  requireJwtAuth,
  roleAuth(Role.Admin),
  inputValidator.put,
  validateInput,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUser = await UserCollection.findById(req.params.id);
      if (!targetUser) {
        throw new NotFound(`No user with provided Id found`);
      }

      interface UpdatedUser {
        hashAlgorithm: string;
        name: string;
        username: string;
        password: string;
        role: string;
        departmentId: string;
      }

      const updatedUser: UpdatedUser = {
        hashAlgorithm: hashAlgorithm.bcrypt,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        departmentId: req.body.department.id,
      };

      const existingUser = await UserCollection.findOne({ username: updatedUser.username }).lean();
      if (existingUser && existingUser.username !== targetUser.username) {
        throw new Conflict(`Username ${req.body.username} is taken`);
      }

      if (updatedUser.password && updatedUser.password !== '') {
        if (!isValidPasswordString(updatedUser.password)) {
          // early return if password is not valid
          res.status(HTTP_UNPROCESSABLE_ENTITY_CODE).send({
            errors: [
              {
                param: 'Password',
                msg: 'Password needs to be at between 6 and 60 characters long and contain at least one number, one special character, one uppercase and one lowercase letter',
              },
            ],
          });
          return;
        }
        updatedUser.password = await hashPassword(updatedUser.password);
        updatedUser.hashAlgorithm = hashAlgorithm.argon2id;
      }

      if (!(await Departments.Database.validateDeptId(updatedUser.departmentId))) {
        throw new BadRequest(`Invalid department id ${updatedUser.departmentId}`);
      }
      Object.keys(updatedUser).forEach(
        (k) =>
          !updatedUser[k as keyof UpdatedUser] &&
          updatedUser[k as keyof UpdatedUser] !== undefined &&
          delete updatedUser[k as keyof UpdatedUser],
      );

      await UserCollection.findByIdAndUpdate(targetUser.id, { $set: updatedUser }, { new: true });

      res.sendStatus(HTTP_NOCONTENT_CODE);
    } catch (e) {
      next(e);
    }
  },
);

router.get('/me', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new NotFound('User not logged in');
    }
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

router.get(
  '/:id',
  requireJwtAuth,
  roleAuth(Role.Admin),
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

router.get(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserCollection.find().sort({ createdAt: 'desc' });
      const jsonUsers = await Promise.all(users.map((user) => user.toJson()));
      res.status(HTTP_OK_CODE).json(jsonUsers);
    } catch (e) {
      next(e);
    }
  },
);

router.delete(
  '/:id',
  requireJwtAuth,
  roleAuth(Role.Admin),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new NotFound('User not logged in');
      }
      const userId = req.params.id;
      if (userId == req.user._id) {
        throw new BadRequest('User cannot delete their own account');
      }
      const user = await UserCollection.findByIdAndRemove(userId);
      if (!user) {
        throw new NotFound(`No user with provided id found`);
      }
      res.sendStatus(HTTP_NOCONTENT_CODE);
    } catch (e) {
      next(e);
    }
  },
);

// Admin creates user
router.post(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin),
  inputValidator.post,
  validateInput,
  async (req: Request, res: Response, next: NextFunction) => {
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
        updatedAt: new Date(),
      };
      const newUser = new UserCollection(userInfo);

      // We want to check if the password is valid here instead of in mongoose because the actual password is hashed so mongoose validation is applied on the hashed password.
      // Also because we want old passwords to be valid even if the password validation changes.
      if (!isValidPasswordString(newUser.password)) {
        res.status(HTTP_UNPROCESSABLE_ENTITY_CODE).send({
          errors: [
            {
              param: 'Password',
              msg: 'Password needs to be at between 6 and 60 characters long and contain at least one number, one special character, one uppercase and one lowercase letter',
            },
          ],
        });
        // early return if password is not valid
        return;
      }
      newUser.registerUser(newUser, (err: any) => {
        if (err) throw new InternalError(`Failed to register new user: ${err}`);
        res.status(HTTP_CREATED_CODE).send(`New user created`);
      });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
