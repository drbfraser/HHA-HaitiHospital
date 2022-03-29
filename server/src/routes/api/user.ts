import { Router, Request, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import User, { hashPassword, Role, validateUserSchema } from '../../models/user';
import { registerUserCreate, registerUserEdit } from '../../schema/registerUser';
import { verifyDeptId } from 'common/definitions/departments';
import { BadRequest, Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { roleAuth } from 'middleware/roleAuth';

const router = Router();

router.put('/:id', requireJwtAuth, roleAuth(Role.Admin), registerUserEdit, validateInput, async (req: Request, res: Response) => {
    const targetUser = await User.findById(req.params.id).exec();
    if (!targetUser) {
        throw new NotFound(`No user with provided Id found`);
    }

    const existingUser = await User.findOne({ username: req.body.username }).exec();
    if (existingUser && existingUser.username !== targetUser.username) {
      throw new Conflict(`Username ${req.body.username} is taken`)
    }

    let password: string | null = null;
    if (req.body.password && req.body.password !== '') {
      password = await hashPassword(req.body.password);
    }

    const updatedUser = { name: req.body.name, username: req.body.username, password, role: req.body.role, department: req.body.department };
    if (!verifyDeptId(updatedUser.department)) {
        throw new BadRequest(`Invalid department id ${updatedUser.department}`);
    }
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    await User.findByIdAndUpdate(targetUser.id, { $set: updatedUser }, { new: true }).exec();

    res.status(HTTP_NOCONTENT_CODE).send();
});

router.get('/me', requireJwtAuth, async (req, res) => {
  res.json(req.user);
});

router.get('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response) => {
    const foundUser = await User.findById(req.params.id).exec();
    if (!foundUser) {
        throw new NotFound(`No user with provided id available`);
    }
    res.status(HTTP_OK_CODE).json(foundUser);
});

router.get('/', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response) => {
    const users: [] = await User.find().sort({ createdAt: 'desc' }).exec();
    res.status(HTTP_OK_CODE).json(users);
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response) => {
    const tempUser = await User.findById(req.params.id).exec();
    if (!tempUser) {
        throw new NotFound(`No user found with provided id`);
    }
    const userId = req.params.id;
    const user = await User.findByIdAndRemove(userId).exec();
    if (!user) {
        throw new NotFound(`No user with provided id found`);
    }
    res.status(HTTP_NOCONTENT_CODE).send();
});

router.post('/', requireJwtAuth, roleAuth(Role.Admin), registerUserCreate, validateInput, async (req: Request, res: Response) => {
    let { username, password, name, role, department } = req.body;
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      throw new Conflict(`Username ${username} exists`);
    }
    if (!verifyDeptId(department)) {
      throw new BadRequest(`Invalid department id ${department}`);
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
      throw new BadRequest(errorMessage);
    }

    newUser.registerUser(newUser, (err: any) => {
      if (err) throw new InternalError(`Failed to register new user: ${err}`);
      res.status(HTTP_CREATED_CODE).send(`New user created`);
    });
});

export default router;
