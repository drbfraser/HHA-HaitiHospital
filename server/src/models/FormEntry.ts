import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const formEntrySchema = new Schema({
  //front
  departmentId: { type: Number, required: true },
  reportingMonth: { type: Date, required: false }, //TODO: For future plans, encorporate a way to sort by specific date. Currently the dates are filtered and ordered by the created/last updated on
  createdOn: { type: Date, required: true },
  createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  lastUpdatedOn: { type: Date, required: true },
  lastUpdatedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },

  //all the data
  formData: { type: Schema.Types.Mixed }
});

const FormEntry = mongoose.model('FormEntry', formEntrySchema, 'Reports');
export default FormEntry;
