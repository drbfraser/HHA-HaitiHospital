import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const formEntrySchema = new Schema({
    //front 
    departmentId: {type: Number, required: true},
    createdOn: { type: Date, required: true, },
    createdByUserId: { type: Number, required: true, min: 0, },
    lastUpdatedOn: { type: Date, required: true, },
    lastUpdatedByUserId: { type: Number, required: true, min: 0, },

    //all the data
    formData: { type: Schema.Types.Mixed },
});

const FormEntry = mongoose.model('FormEntry', formEntrySchema, 'Reports');
export default FormEntry;