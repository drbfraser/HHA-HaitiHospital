import { DepartmentName } from 'common/definitions/departments';

export interface EmployeeOfTheMonth {
  name: string;
  department: DepartmentName;
  description: string;
  imgPath: string;
  createdAt: string;
  updatedAt: string;
}
