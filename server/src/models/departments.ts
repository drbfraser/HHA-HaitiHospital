import mongoose from 'mongoose';
import CaseStudy, { CaseStudy as CaseStudyModel } from './caseStudies';
import { currYear, currMonth } from 'utils/dateFormatting';

const { Schema } = mongoose;

export interface Department {
  _id: string;
  name: string;
}

export interface DepartmentJson {
  id: string;
  name: string;
}

export interface LeaderboardJson {
  id: string;
  name: string;
  points: number;
  nCaseStudies: number;
}

export interface DepartmentWithInstanceMethods extends Department {
  toJson: () => Promise<DepartmentJson>;
  toLeaderboard: (pointsFactor: number) => Promise<LeaderboardJson>;
}

const departmentSchema = new Schema<DepartmentWithInstanceMethods>({
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
  const numberOfCaseStudies: CaseStudyModel[] = await CaseStudy.find({
    // Checks if the case study is created between YYYY-MM-01T00:00:00 and YYYY-(next month)-01T00:00:00
    createdAt: {
      $gte: new Date(currYear, currMonth, 1),
      $lte: new Date(currYear, currMonth + 1, 1)
    },
    departmentId: this._id
  });

  // Eventually will need to add report points to this
  const json: LeaderboardJson = {
    id: this._id,
    name: this.name,
    points: pointsFactor * numberOfCaseStudies.length,
    nCaseStudies: numberOfCaseStudies.length
  };
  return json;
};

const Department = mongoose.model<DepartmentWithInstanceMethods>('Department', departmentSchema, 'Department');

export default Department;
