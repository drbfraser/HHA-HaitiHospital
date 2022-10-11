import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { validateInput } from '../../middleware/inputSanitization';
import MessageBoardCommentModel, { MessageBoardComment } from '../../models/messageBoardComment';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from '../../exceptions/httpException';
import { RequestWithUser } from '../../utils/definitions/express';

const router = Router();

/**
 * Get message board comments by parent message post ID
 */
router.get('/:id', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const parentMessageId = req.params.id;
    const docs = await MessageBoardCommentModel.find({ parentMessageId: parentMessageId }).sort({ date: 'desc' });
    if (!docs) {
      throw new NotFound(`No message board parent comments post with id ${parentMessageId} available`);
    }
    const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

router.post('/', requireJwtAuth, validateInput, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = req.user;
  const userId = user._id!;
  const parentMessageId: string = req.body.parentMessageId;
  const messageComment: string = req.body.messageComment;
  const messageBoardComment: MessageBoardComment = {
    userId: userId,
    parentMessageId: parentMessageId,
    messageComment: messageComment,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const doc = new MessageBoardCommentModel(messageBoardComment);
  doc
    .save()
    .then(() => res.sendStatus(HTTP_CREATED_CODE))
    .catch((err: any) => next(new InternalError(`Message board comment submission failed: ${err}`)));
});

export = router;
