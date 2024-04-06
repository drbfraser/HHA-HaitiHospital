import mongoose from 'mongoose';
import { LeaderboardJson } from '@hha/common';
import { leaderboardPointsCalculator } from 'utils/leaderboard';
import { Department, DepartmentJson } from '@hha/common';

const { Schema } = mongoose;

export interface DepartmentWithInstanceMethods extends Department {
  toJson: () => Promise<DepartmentJson>;
  toLeaderboard: (pointsFactor: number) => Promise<LeaderboardJson>;
}

export const departmentSchema = new Schema<DepartmentWithInstanceMethods>({
  name: { type: String, required: true },
});

departmentSchema.methods.toJson = async function (): Promise<DepartmentJson> {
  const json: DepartmentJson = {
    id: this._id,
    name: this.name,
  };
  return json;
};

departmentSchema.methods.toLeaderboard = async function (
  pointsFactor: number,
): Promise<LeaderboardJson> {
  return await leaderboardPointsCalculator(pointsFactor, this);
};

export const DEPARTMENT_MODEL_NAME = 'Department';
const DepartmentCollection = mongoose.model<DepartmentWithInstanceMethods>(
  DEPARTMENT_MODEL_NAME,
  departmentSchema,
  'Department',
);

export default DepartmentCollection;
