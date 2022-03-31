import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import UserModel, { hashPassword, Role, User, validateUserSchema } from '../../models/user';
import { registerUserCreate, registerUserEdit } from '../../schema/registerUser';
import { verifyDeptId } from 'common/definitions/departments';
import { BadRequest, Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();

router.put('/:id', requireJwtAuth, roleAuth(Role.Admin), registerUserEdit, validateInput, async (req: Request, res: Response, next: NextFunction) => {
    try {

    const targetUser = await UserModel.findById(req.params.id);
    if (!targetUser) {
        throw new NotFound(`No user with provided Id found`);
    }

    const existingUser = await UserModel.findOne({ username: req.body.username }).lean();
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
    await UserModel.findByIdAndUpdate(targetUser.id, { $set: updatedUser }, { new: true });

    res.status(HTTP_NOCONTENT_CODE).send();

    } catch (e) { next(e); }
});

router.get('/me', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    UserModel.findOne({username: req.user.username}).exec()
        .then((user) => res.json(user!.toJSON()))
        .catch((err) => next(err));
});

router.get('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
    try {

    const foundUser = await UserModel.findById(req.params.id);
    if (!foundUser) {
        throw new NotFound(`No user with provided id available`);
    }
    res.status(HTTP_OK_CODE).json(foundUser.toJSON());

    } catch (e) { next(e); }
});

router.get('/', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
    try {

    const users = await UserModel.find().sort({ createdAt: 'desc' });
    const jsonUsers = users.map((user) => user.toJSON());
    res.status(HTTP_OK_CODE).json(jsonUsers);

    } catch (e) { next(e); }
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: Request, res: Response, next: NextFunction) => {
    try {

    const userId = req.params.id;
    const user = await UserModel.findByIdAndRemove(userId);
    if (!user) {
        throw new NotFound(`No user with provided id found`);
    }
    res.sendStatus(HTTP_NOCONTENT_CODE);

    } catch (e) { next(e); }
});

router.post('/', requireJwtAuth, roleAuth(Role.Admin), registerUserCreate, validateInput, async (req: Request, res: Response, next: NextFunction) => {
    try {

    let { username, password, name, role, department } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new Conflict(`Username ${username} exists`);
    }
    if (!verifyDeptId(department)) {
      throw new BadRequest(`Invalid department id ${department}`);
    }

    const userInfo: User = {
        username: username,
        password: password,
        name: name,
        role: role,
        department: department,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const newUser = new UserModel(userInfo);
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
    
    } catch (e) { next(e); }
});

export default router;
