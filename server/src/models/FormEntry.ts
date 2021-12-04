import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const formEntrySchema = new Schema({
    //front 
    departmentId: {type: Number, required: true},
    createdOn: { type: Date, required: true, },
    createdByUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    lastUpdatedOn: { type: Date, required: true, },
    lastUpdatedByUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},

    //all the data
    formData: { type: Schema.Types.Mixed },
});

const FormEntry = mongoose.model('FormEntry', formEntrySchema, 'Reports');
export default FormEntry;