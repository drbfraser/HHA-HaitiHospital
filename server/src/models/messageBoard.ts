import { getDeptNameFromId } from 'common/definitions/departments';
import { IllegalState } from 'exceptions/systemException';
import * as mongoose from 'mongoose';
import { formatDateString } from 'utils/utils';
import UserModel, { UserJson } from './user';

const { Schema } = mongoose;

interface Message {
    departmentId: string,
    userId: string,
    date: Date,
    messageBody: string,
    messageHeader: string,
}

interface MessageJson {
    id: string,
    department: {
        id: string,
        name: string
    },
    user: UserJson,
    date: string,
    messageBody: string,
    messageHeader: string,
}

interface MessageWithInstanceMethods extends Message {
    toJson: () => Promise<MessageJson>
};
const messageBodySchema = new Schema<MessageWithInstanceMethods>({
  // entry data
  departmentId: { type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: new Date() },
  messageBody: { type: String, required: true, default: '' },
  messageHeader: { type: String, required: true, default: '' }
});
messageBodySchema.methods.toJson = async function(): Promise<MessageJson> {
    const userDoc = await UserModel.findOne({_id: this.userId}).exec();
    if (!userDoc) {
        throw new IllegalState(`Message references to non-existing user with id ${this.userId}`);
    }
    const userJson = userDoc.toJson();

    const json: MessageJson = {
        id: this._id,
        department: {
            id: this.departmentId,
            name: getDeptNameFromId(this.departmentId)
        },
        user: userJson,
        date: formatDateString(this.date),
        messageBody: this.messageBody,
        messageHeader: this.messageHeader
    };
    return json;
}

const MessageBody = mongoose.model<MessageWithInstanceMethods>('MessageBody', messageBodySchema, 'Message Board');
export default MessageBody;
