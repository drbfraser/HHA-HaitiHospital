import * as mongoose from 'mongoose';

let dateTime: Date = new Date();
const { Schema } = mongoose;

const messageBodySchema = new Schema({
  // entry data
  departmentId: { type: Number, required: true, min: 0 },
  departmentName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: dateTime },
  messageBody: { type: String, required: true, default: '' },
  messageHeader: { type: String, required: true, default: '' }
});

const MessageBody = mongoose.model('MessageBody', messageBodySchema, 'Message Board');
export default MessageBody;
