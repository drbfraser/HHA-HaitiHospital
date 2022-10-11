import mongoose from 'mongoose';
import { IllegalState } from '../exceptions/systemException';
import UserModel from './user';
import { UserApiOut } from '../routes/api/jsons/user';
import { formatDateString } from '../utils/utils';

const { Schema } = mongoose;

export interface MessageBoardComment {
  userId: string;
  parentMessageId: string;
  messageComment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageBoardCommentJson {
  id: string;
  user: UserApiOut.UserJson;
  parentMessageId: string;
  messageComment: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageBoardCommentWithInstanceMethods extends MessageBoardComment {
  toJson: () => Promise<MessageBoardCommentJson>;
}

const messageBoardCommentSchema = new Schema<MessageBoardCommentWithInstanceMethods>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    messageComment: { type: String, required: true },
    parentMessageId: { type: String, required: true }
  },
  { timestamps: true }
);

messageBoardCommentSchema.methods.toJson = async function (): Promise<MessageBoardCommentJson> {
  const userDoc = await UserModel.findOne({ _id: this.userId }).exec();
  if (!userDoc) {
    throw new IllegalState(`Message references to non-existing user with id ${this.userId}`);
  }
  const userJson = await userDoc.toJson();

  const json: MessageBoardCommentJson = {
    id: this._id,
    user: userJson,
    parentMessageId: this.parentMessageId,
    messageComment: this.messageComment,
    createdAt: formatDateString(this.createdAt),
    updatedAt: formatDateString(this.createdAt)
  };

  return json;
};

const MessageBoardComment = mongoose.model<MessageBoardCommentWithInstanceMethods>('MessageBoardComment', messageBoardCommentSchema, 'MessageBoardComment');
export default MessageBoardComment;
