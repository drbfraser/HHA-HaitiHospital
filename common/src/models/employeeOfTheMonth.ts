import { DepartmentJson } from './department';

export interface EmployeeOfTheMonth {
  name: string;
  departmentId: string;
  description: string;
  awardedMonth: number;
  awardedYear: number;
  updatedAt: Date;
  createdAt: Date;
  imgPath?: string;
}

export interface EmployeeOfTheMonthJson {
  id: string;
  name: string;
  department: DepartmentJson;
  description: string;
  imgPath?: string;
  awardedMonth: number;
  awardedYear: number;
  updatedAt: string;
  createdAt: string;
}
