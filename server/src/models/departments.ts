import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface Department {
  _id: string;
  name: string;
}

export interface Leaderboard {
  id: string;
  name: string;
  points: number;
  nCaseStudies: number;
}

const departmentSchema = new Schema({
  name: { type: String, required: true }
});

const Department = mongoose.model('Department', departmentSchema, 'Department');

export default Department;
