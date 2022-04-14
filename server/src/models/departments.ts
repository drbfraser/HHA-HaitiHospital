import mongoose from 'mongoose';

const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: { type: String, required: true }
});

const Department = mongoose.model('Department', departmentSchema, 'Department');

export default Department;
