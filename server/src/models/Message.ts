import mongoose from 'mongoose';
import Joi from 'joi';
import { User } from './User';
import { anyTypeAnnotation } from '@babel/types';
const { Schema } = mongoose;

export interface Message extends Document {
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

const messageSchema = new Schema<Message>(
  {
    text: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

messageSchema.methods.toJSON = function () {
  const someUser: any = this.user;
  return {
    id: this._id,
    text: this.text,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    user: someUser.toJSON(),
  };
};

export const validateMessage = (message: Message) => {
  const someJoi: any = Joi;

  const schema = {
    text: Joi.string().min(5).max(300).required(),
  };
  return someJoi.validate(message, schema);
};

const Message = mongoose.model('Message', messageSchema);

export default Message;
