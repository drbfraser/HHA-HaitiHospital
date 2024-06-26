import * as mongoose from 'mongoose';

import Departments from 'utils/departments';
import UserCollection from './user';
import { formatDateString } from 'utils/utils';
import { Message, MessageJson, unknownUserJson } from '@hha/common';

const { Schema } = mongoose;

interface MessageWithInstanceMethods extends Message {
  toJson: () => Promise<MessageJson>;
}
const messageBodySchema = new Schema<MessageWithInstanceMethods>(
  {
    // entry data
    departmentId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: new Date() },
    messageBody: { type: String, required: true, default: '' },
    messageHeader: { type: String, required: true, default: '' },
  },
  {
    writeConcern: {
      w: 'majority',
    },
  },
);
messageBodySchema.methods.toJson = async function (): Promise<MessageJson> {
  const userDoc = await UserCollection.findOne({ _id: this.userId }).exec();
  const userJson = userDoc ? await userDoc.toJson() : unknownUserJson;

  const json: MessageJson = {
    id: this._id,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId),
    },
    user: userJson,
    date: this.date.toISOString(),
    messageBody: this.messageBody,
    messageHeader: this.messageHeader,
  };

  return json;
};

const MessageCollection = mongoose.model<MessageWithInstanceMethods>(
  'MessageBody',
  messageBodySchema,
  'MessageBoard',
);
export default MessageCollection;
