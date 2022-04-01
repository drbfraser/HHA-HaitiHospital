import { getDeptNameFromId } from 'common/definitions/departments';
import * as mongoose from 'mongoose';
import { formatDateString } from 'utils/utils';

let dateTime: Date = new Date();
const { Schema } = mongoose;

interface Message {
    departmentId: string,
    userId: string,
    date: Date,
    messageBody: string,
    messageHeader: string
}

interface MessageJson {
    id: string,
    department: {
        id: string,
        name: string
    },
    userId: string,
    date: string,
    messageBody: string,
    messageHeader: string
}

interface MessageWithInstanceMethods extends Message {
    toJson: () => MessageJson
};
const messageBodySchema = new Schema<MessageWithInstanceMethods>({
  // entry data
  departmentId: { type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: dateTime },
  messageBody: { type: String, required: true, default: '' },
  messageHeader: { type: String, required: true, default: '' }
});
messageBodySchema.methods.toJson = function(): MessageJson {
    const json: MessageJson = {
        id: this._id,
        department: {
            id: this.departmentId,
            name: getDeptNameFromId(this.departmentId)
        },
        userId: this.userId,
        date: formatDateString(this.date),
        messageBody: this.messageBody,
        messageHeader: this.messageHeader
    };
    return json;
}

const MessageBody = mongoose.model<MessageWithInstanceMethods>('MessageBody', messageBodySchema, 'Message Board');
export default MessageBody;
