import { Department } from 'constants/interfaces';

export interface EmployeeOfTheMonth {
  name: string;
  department: Department;
  description: string;
  imgPath: string;
  createdAt: string;
  updatedAt: string;
}
