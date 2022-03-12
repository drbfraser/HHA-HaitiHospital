import { DepartmentName } from 'common/definitions/departments';

export interface EmployeeOfTheMonth {
  name: { type: string; required: true };
  department: { type: DepartmentName; required: true };
  description: { type: string; required: true };
  imgPath: { type: string; required: true };
}
