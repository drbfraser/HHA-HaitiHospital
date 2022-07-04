const router = require('express').Router();
import MessageCollection from 'models/messageBoard';
import { NextFunction, Response } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { validateInput } from 'middleware/inputSanitization';
import { Role } from 'models/user';
import { registerMessageBoardCreate } from 'schema/registerMessageBoard';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound, Unauthorized } from 'exceptions/httpException';
import Departments from 'utils/departments';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    let docs;
    if (req.user.role == Role.User) {
      const userDeptId = await req.user.departmentId;
      const generalDeptId = await Departments.Database.getDeptIdByName('General');
      docs = await MessageCollection.find()
        .or([{ departmentId: userDeptId }, { departmentId: generalDeptId }])
        .sort({ date: 'desc' });
    } else {
      docs = await MessageCollection.find({}).sort({ date: 'desc' });
    }
    const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

router.get('/department/:departmentId', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const deptId = req.params.departmentId;
    if (!(await Departments.Database.validateDeptId(deptId))) {
      throw new BadRequest(`Invalid department id: ${deptId}`);
    }
    if (req.user.role == Role.User) {
      const userDeptId = await req.user.departmentId;
      const generalDeptId = await Departments.Database.getDeptIdByName('General');
      if (deptId != userDeptId && deptId != generalDeptId) {
        throw new Unauthorized(`Do not have access to messages from department id: ${deptId}`);
      }
    }
    const docs = await MessageCollection.find({ departmentId: deptId }).sort({ date: 'desc' });
    const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const msgId = req.params.id;
    let doc;
    if (req.user.role == Role.User) {
      const userDeptId = await req.user.departmentId;
      const generalDeptId = await Departments.Database.getDeptIdByName('General');
      doc = await MessageCollection.findById(msgId).or([{ departmentId: userDeptId }, { departmentId: generalDeptId }]);
    } else {
      doc = await MessageCollection.findById(msgId);
    }
    if (!doc) {
      throw new NotFound(`No message with id ${msgId} available`);
    }
    const json = await doc.toJson();
    res.status(HTTP_OK_CODE).json(json);
  } catch (e) {
    next(e);
  }
});

router.post('/', requireJwtAuth, roleAuth(Role.Admin), registerMessageBoardCreate, validateInput, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const departmentId: string = req.body.department.id;
    if (!(await Departments.Database.validateDeptId(departmentId))) {
      throw new BadRequest(`Invalid department id ${departmentId}`);
    }

    const date: Date = new Date();
    const messageBody: string = req.body.messageBody;
    const messageHeader: string = req.body.messageHeader;
    const userId: string = req.user._id!;
    const messageEntry = new MessageCollection({
      departmentId: departmentId,
      userId: userId,
      date: date,
      messageBody: messageBody,
      messageHeader: messageHeader
    });

    await messageEntry.save();
    res.sendStatus(HTTP_CREATED_CODE);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', requireJwtAuth, roleAuth(Role.Admin), registerMessageBoardCreate, validateInput, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const departmentId: string = req.body.department.id;
    if (!(await Departments.Database.validateDeptId(departmentId))) {
      throw new BadRequest(`Invalid department id ${departmentId}`);
    }

    const date: Date = new Date();
    const messageBody: string = req.body.messageBody;
    const messageHeader: string = req.body.messageHeader;
    const userId: string = req.user._id!;

    const updatedMessage = {
      departmentId: departmentId,
      userId: userId,
      date: date,
      messageBody: messageBody,
      messageHeader: messageHeader
    };

    Object.keys(updatedMessage).forEach((k) => (!updatedMessage[k] || updatedMessage[k] === undefined) && delete updatedMessage[k]);

    const msg = await MessageCollection.findByIdAndUpdate({ _id: req.params.id }, updatedMessage, { new: true });
    if (msg) {
      return res.sendStatus(HTTP_OK_CODE);
    }
    return res.sendStatus(HTTP_CREATED_CODE);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const msgId: string = req.params.id;
    const msg = await MessageCollection.findByIdAndRemove(msgId);
    if (!msg) {
      throw new NotFound(`No message with id ${msgId} found`);
    }
    res.status(HTTP_NOCONTENT_CODE).send();
  } catch (e) {
    next(e);
  }
});

export = router;
