const router = require('express').Router();
import MessageBody from '../../models/messageBoard';
import { Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import { Role } from '../../models/user';
import { registerMessageBoardCreate } from '../../schema/registerMessageBoard';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { getDeptNameFromId, verifyDeptId } from 'common/definitions/departments';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response) => {
  MessageBody.find({}).sort({ date: 'desc' }).populate('userId').exec()
    .then((response: []) => res.status(HTTP_OK_CODE).json(response))
    .catch((err: any) => { throw new InternalError(`Failed to get messages: ${err}`)});
});

router.get('/department/:departmentId', requireJwtAuth, async (req: RequestWithUser, res: Response) => {
  const deptId = req.params.departmentId;
  if (!verifyDeptId(deptId)) {
      throw new BadRequest(`Invalid department id: ${deptId}`);
  }

  MessageBody.find({ departmentId: deptId }).sort({ date: 'desc' }).exec()
    .then((response: []) => res.status(HTTP_OK_CODE).json(response))
    .catch((err: any) => { throw new InternalError(`Failed to find messages for department id ${req.params.departmentId}: ${err}`)});
});

router.get('/:id', async (req: RequestWithUser, res: Response) => {
  const msgId = req.params.id;
  MessageBody.findById(msgId).populate('userId').exec()
    .then((response: any) => {
        if (!response) {
            throw new NotFound(`No message with id ${msgId} available`);
        }
        res.status(HTTP_OK_CODE).json(response)
    })
    .catch((err: any) => { throw new InternalError(`Failed to find message with id ${msgId}: ${err}`)});
});

router.post('/', requireJwtAuth, roleAuth(Role.Admin), registerMessageBoardCreate, validateInput, async (req: RequestWithUser, res: Response) => {
  const departmentId: string = req.body.departmentId;
  if (!verifyDeptId(departmentId)) {
    throw new BadRequest(`Invalid department id ${departmentId}`);
  }

  const departmentName: string = getDeptNameFromId(departmentId);
  const date: Date = new Date();
  const messageBody: string = req.body.messageBody;
  //TODO: replace messageHeader with Document Type
  const messageHeader: string = req.body.messageHeader;
  // @ts-ignore
  const userId: string = req.user._id;
  const messageEntry = new MessageBody({
    departmentId: departmentId,
    departmentName: departmentName,
    userId: userId,
    date: date,
    messageBody: messageBody,
    messageHeader: messageHeader
  });

  messageEntry.save()
    .then(() => res.status(HTTP_CREATED_CODE).json('Message has been successfully posted'))
    .catch((err: any) => { throw new InternalError(`Message submission failed: ${err}`) });
});

//make the changes to message of id reportID
router.put('/:id', requireJwtAuth, roleAuth(Role.Admin), registerMessageBoardCreate, validateInput, async (req: RequestWithUser, res: Response) => {
  const departmentId: string = req.body.departmentId;
  if (!verifyDeptId(departmentId)) {
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

  const msg = await MessageBody.findByIdAndUpdate({ _id: req.params.id }, updatedMessage, { new: true }).populate('userId');
  if (!msg) {
    throw new NotFound(`No message with id ${req.params.id} found`);
  }
  res.status(HTTP_OK_CODE).json(msg).send();
});

// delete message id
router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin), async (req: RequestWithUser, res: Response) => {
    const msgId: string = req.params.id;
    const msg = await MessageBody.findByIdAndRemove(msgId);
    if (!msg) {
        throw new NotFound(`No message with id ${msgId} found`);
    }
    res.status(HTTP_NOCONTENT_CODE).send();
});

export = router;
