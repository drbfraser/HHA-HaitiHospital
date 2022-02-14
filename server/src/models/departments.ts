import * as mongoose from 'mongoose';
import Department from './leaderboard';
// import { FormDataModels } from './formdataModels';
const { Schema } = mongoose;

export enum DepartmentName {
  NicuPaeds = 'NICU/Paeds',
  Maternity = 'Maternity',
  Rehab = 'Rehab',
  CommunityHealth = 'Community & Health'
}

export enum DepartmentId {
  Rehab = 0,
  NicuPaeds = 1,
  CommunityHealth = 2,
  Maternity = 3
}

export function getDepartmentName(deptId: number): DepartmentName {
  switch (deptId) {
    case DepartmentId.Rehab:
      return DepartmentName.Rehab;
    case DepartmentId.NicuPaeds:
      return DepartmentName.NicuPaeds;
    case DepartmentId.CommunityHealth:
      return DepartmentName.CommunityHealth;
    case DepartmentId.Maternity:
      return DepartmentName.Maternity;
    default:
      throw new Error('Invalid department id');
  }
}

export function getDepartmentId(deptName: string): DepartmentId {
    switch (deptName) {
        case DepartmentName.NicuPaeds:
            return DepartmentId.NicuPaeds;
        case DepartmentName.Maternity:
            return DepartmentId.Maternity;
        case DepartmentName.Rehab:
            return DepartmentId.Rehab;
        case DepartmentName.CommunityHealth:
            return DepartmentId.CommunityHealth;
        default:
            throw new Error("Invalid department name");
    }
}

const departmentsSchema = new Schema({});

const Departments = mongoose.model('Departments', departmentsSchema, 'Departments');
export default Departments;
