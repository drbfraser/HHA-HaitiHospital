const router = require('express').Router();
import MessageBody from '../../models/messageBoard';
import { Request, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/user';
import { registerMessageBoardCreate } from '../../schema/registerMessageBoard';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError } from 'exceptions/httpException';
import { getDeptNameFromId, verifyDeptId } from 'common/definitions/departments';

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
  await MessageBody.find({})
    .sort({ date: 'desc' })
    .populate('userId')
    .then((response: any) => res.status(HTTP_OK_CODE).json(response))
    .catch((err: any) => { throw new InternalError(`Failed to get messages: ${err}`)});
}, httpErrorMiddleware);

router.get('/department/:departmentId', requireJwtAuth, async (req: Request, res: Response) => {
  await MessageBody.find({ departmentId: req.params.departmentId })
    .sort({ date: 'desc' })
    .then((response: any) => res.status(HTTP_OK_CODE).json(response))
    .catch((err: any) => { throw new InternalError(`Failed to find messages for department id ${req.params.departmentId}: ${err}`)});
}, httpErrorMiddleware);

router.get('/:id', async (req: Request, res: Response) => {
  await MessageBody.findById(req.params.id)
    .populate('userId')
    .then((response: any) => res.status(HTTP_OK_CODE).json(response))
    .catch((err: any) => { throw new InternalError(`Failed to find message with id ${req.params.id}: ${err}`)});
}, httpErrorMiddleware);

router.post('/', requireJwtAuth, checkIsInRole(Role.Admin), registerMessageBoardCreate, validateInput, async (req: Request, res: Response) => {
  const departmentId: string = req.body.departmentId;
  if (!verifyDeptId) {
    throw new BadRequest(`Invalid department id ${departmentId}`);
  }

  const departmentName: string = getDeptNameFromId(departmentId);
  const date: Date = new Date();
  const messageBody: string = req.body.messageBody;
  //TODO: replace messageHeader with Document Type
  const messageHeader: string = req.body.messageHeader;
  // @ts-ignore
  const userId: string = req.user.id;
  const messageEntry = new MessageBody({
    departmentId: departmentId,
    departmentName: departmentName,
    userId: userId,
    date: date,
    messageBody: messageBody,
    messageHeader: messageHeader
  });

  await messageEntry
    .save()
    .then(() => res.status(HTTP_CREATED_CODE).json('Message has been successfully posted'))
    .catch((err: any) => { throw new InternalError(`Submit message failed: ${err}`) });
}, httpErrorMiddleware);

//make the changes to message of id reportID
router.put('/:id', requireJwtAuth, checkIsInRole(Role.Admin), registerMessageBoardCreate, validateInput, async (req: Request, res: Response) => {
  const departmentId: string = req.body.departmentId;
  if (!verifyDeptId) {
    throw new BadRequest(`Invalid department id ${departmentId}`);
  }

  const departmentName: string = getDeptNameFromId(departmentId);
  const date: Date = new Date();
  const messageBody: string = req.body.messageBody;
  //TODO: replace messageHeader with Document Type
  const messageHeader: string = req.body.messageHeader;
  // @ts-ignore
  const userId: string = req.user.id;

  const updatedMessage = {
    departmentId: departmentId,
    departmentName: departmentName,
    userId: userId,
    date: date,
    messageBody: messageBody,
    messageHeader: messageHeader
  };

  Object.keys(updatedMessage).forEach((k) => (!updatedMessage[k] || updatedMessage[k] === undefined) && delete updatedMessage[k]);

  await MessageBody.findByIdAndUpdate({ _id: req.params.id }, updatedMessage, { new: true })
    .populate('userId')
    .then((message: any) => res.status(HTTP_NOCONTENT_CODE).json(message))
    .catch((err: any) => { throw new InternalError(`Failed to update message with id ${req.params.id}: ${err}`)});
}, httpErrorMiddleware);

// delete message id
router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req: Request, res: Response) => {
    const msgId: string = req.params.id;
    await MessageBody.findByIdAndRemove(msgId)
        .then((data: any) => res.status(HTTP_NOCONTENT_CODE).send(`Removed message with id ${msgId}`))
        .catch((err: any) => { throw new InternalError(`Failed to remove message with id ${msgId}: ${err}`)});
}, httpErrorMiddleware);

export = router;
