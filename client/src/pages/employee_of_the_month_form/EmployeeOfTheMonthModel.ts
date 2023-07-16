import { Department } from 'constants/interfaces';

export interface EmployeeOfTheMonth {
  name: string;
  department: Department;
  description: string;
  imgPath: string;
  awardedMonth: number;
  awardedYear: number;
  createdAt: string;
  updatedAt: string;
}
