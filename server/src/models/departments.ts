import mongoose from 'mongoose';

const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    name: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
    nCaseStudies: { type: Number, require: true, default: 0 }
  },
  { timestamps: true }
);

const Department = mongoose.model('Department', departmentSchema);

export default Department;
