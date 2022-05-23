import mongoose from 'mongoose';
import { LeaderboardJson } from './leaderboard';
import { leaderboardPointsCalculator } from '../utils/leaderboard';

const { Schema } = mongoose;

// _id will be assigned by MongoDB
export interface Department {
  _id?: string;
  name: string;
}

export interface DepartmentJson {
  id: string;
  name: string;
}

export interface DepartmentWithInstanceMethods extends Department {
  toJson: () => Promise<DepartmentJson>;
  toLeaderboard: (pointsFactor: number) => Promise<LeaderboardJson>;
}

export const departmentSchema = new Schema<DepartmentWithInstanceMethods>({
  name: { type: String, required: true }
});

departmentSchema.methods.toJson = async function (): Promise<DepartmentJson> {
  const json: DepartmentJson = {
    id: this._id,
    name: this.name
  };
  return json;
};

departmentSchema.methods.toLeaderboard = async function (pointsFactor: number): Promise<LeaderboardJson> {
  return await leaderboardPointsCalculator(pointsFactor, this);
};

const DepartmentCollection = mongoose.model<DepartmentWithInstanceMethods>('Department', departmentSchema, 'Department');

export default DepartmentCollection;
