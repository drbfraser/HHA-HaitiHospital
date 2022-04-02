const router = require('express').Router();
import MessageBody from '../../models/messageBoard';
import { NextFunction, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import { Role } from '../../models/user';
import { registerMessageBoardCreate } from '../../schema/registerMessageBoard';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { verifyDeptId } from 'common/definitions/departments';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const docs = await MessageBody.find({}).sort({ date: 'desc' }).exec();
        const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
        res.status(HTTP_OK_CODE).json(jsons);
    }
    catch (e) {
        next(e);
    }
});

router.get('/department/:departmentId', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

    const deptId = req.params.departmentId;
    if (!verifyDeptId(deptId)) {
        throw new BadRequest(`Invalid department id: ${deptId}`);
    }
    const docs = await MessageBody.find({ departmentId: deptId }).sort({ date: 'desc' }).exec();
    const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);

    }
    catch (e) {
        next(e);
    }
});

router.get('/:id', async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

    const msgId = req.params.id;
    const doc = await MessageBody.findById(msgId).exec();
    if (!doc) {
        throw new NotFound(`No message with id ${msgId} available`);
    }
    const json = doc.toJson();
    res.status(HTTP_OK_CODE).json(json);
    
    } catch (e) {
        next(e);
    }
});

router.post('/', requireJwtAuth, roleAuth(Role.Admin), registerMessageBoardCreate, validateInput, (req: RequestWithUser, res: Response, next: NextFunction) => {
  
  const departmentId: string = req.body.department.id;
  if (!verifyDeptId(departmentId)) {
    return next(new BadRequest(`Invalid department id ${departmentId}`));
  }

  const date: Date = new Date();
  const messageBody: string = req.body.messageBody;
  const messageHeader: string = req.body.messageHeader;
  const userId: string = req.user._id!;
  const messageEntry = new MessageBody({
    departmentId: departmentId,
    userId: userId,
    date: date,
    messageBody: messageBody,
    messageHeader: messageHeader
  });

  messageEntry.save()
    .then(() => res.sendStatus(HTTP_CREATED_CODE))
    .catch((err: any) => next(new InternalError(`Message submission failed: ${err}`)));
});

router.put('/:id', requireJwtAuth, roleAuth(Role.Admin), registerMessageBoardCreate, validateInput, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {

  const departmentId: string = req.body.department.id;
  if (!verifyDeptId(departmentId)) {
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

  const msg = await MessageBody.findByIdAndUpdate({ _id: req.params.id }, updatedMessage, { new: true });
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
    const msg = await MessageBody.findByIdAndRemove(msgId);
    if (!msg) {
        throw new NotFound(`No message with id ${msgId} found`);
    }
    res.status(HTTP_NOCONTENT_CODE).send();

    } catch (e) { next(e); }
});

export = router;
