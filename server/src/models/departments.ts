import mongoose from 'mongoose';

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
  toJson: () => DepartmentJson;
}

const departmentSchema = new Schema<DepartmentWithInstanceMethods>({
  name: { type: String, required: true }
});

departmentSchema.methods.toJson = async function (): Promise<DepartmentJson> {
  let json: DepartmentJson = {
    id: this._id,
    name: this.name
  };
  return json;
};

const Department = mongoose.model<DepartmentWithInstanceMethods>('Department', departmentSchema, 'Department');

export default Department;
