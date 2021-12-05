import * as mongoose from 'mongoose';
// import { FormDataModels } from './formdataModels';
const { Schema } = mongoose;

export enum DepartmentName {
  NicuPaeds = "NICU/Paeds",
  Maternity = "Maternity",
  Rehab = "Rehab",
  CommunityHealth = "Community & Health",
}

export enum DepartmentId {
  Rehab = 0,
  NicuPaeds = 1,
  CommunityHealth = 2,
  Maternity = 3,
}

export function getDepartmentName(deptId: number): DepartmentName {
  switch (deptId) {
      case 0:
          return DepartmentName.Rehab;

      case 1:
          return DepartmentName.NicuPaeds;
      
      case 2:
          return DepartmentName.CommunityHealth;

      case 3:
          return DepartmentName.Maternity;

      default:
          throw new Error("Invalid department id");
  }  
}

const departmentsSchema = new Schema({
    
});

const Departments = mongoose.model('Departments', departmentsSchema, 'Departments');
export default Departments;