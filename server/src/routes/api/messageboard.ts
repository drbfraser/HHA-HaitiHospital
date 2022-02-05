const router = require('express').Router();
import MessageBody from '../../models/MessageBody';
import { Request, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/User';
import { registerMessageBoardCreate } from '../../schema/registerMessageBoard';

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
  await MessageBody.find({})
    .sort({ date: 'desc' })
    .populate('userId')
    .then((response: any) => res.status(200).json(response))
    .catch((err: any) => res.status(400).json('Could not find any results: ' + err));
});

//REMOVED FOR NOW - MIGHT BRING DEPARTMENT SPECIFIC MESSAGES FUNCTION BACK LATER
router.get('/department/:departmentId', requireJwtAuth, async (req: Request, res: Response) => {
  await MessageBody.find({ departmentId: req.params.departmentId })
    .sort({ date: 'desc' })
    .then((response: any) => res.json(response))
    .catch((err: any) => res.status(400).json('Could not find any results: ' + err));
});

router.get('/:id', async (req: Request, res: Response) => {
  await MessageBody.findById(req.params.id)
    .populate('userId')
    .then((response: any) => res.status(200).json(response))
    .catch((err: any) => res.status(400).json('Could not find any results: ' + err));
});

router.post('/', requireJwtAuth, checkIsInRole(Role.Admin), registerMessageBoardCreate, validateInput, async (req: Request, res: Response) => {
  let dateTime: Date = new Date();
  const departmentId: number = req.body.departmentId;
  const departmentName: string = req.body.departmentName;
  const date: Date = dateTime;
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
    .then(() => res.status(201).json('Message has been successfully posted'))
    .catch((err: any) => res.status(400).json('Message did not successfully post: ' + err));
});

//make the changes to message of id reportID
router.put('/:id', requireJwtAuth, checkIsInRole(Role.Admin), registerMessageBoardCreate, validateInput, async (req: Request, res: Response) => {
  let dateTime: Date = new Date();
  const departmentId: number = parseInt(req.body.departmentId);
  const departmentName: string = req.body.departmentName;
  const date: Date = dateTime;
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

  return await MessageBody.findByIdAndUpdate({ _id: req.params.id }, updatedMessage, { new: true })
    .populate('userId')
    .then((message: any) => res.status(201).json(message))
    .catch((err: any) => res.status(400).json('Edit message failed: ' + err));
});

// delete message id
router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin), async (req: Request, res: Response) => {
  try {
    await MessageBody.findByIdAndRemove(req.params.id)
      .then((data: any) => res.status(204).json(data))
      .catch((err: any) => res.status(400).json('Failed to delete: ' + err));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export = router;
