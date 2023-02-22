import { User } from '../models/user';
import { Role } from '../models/user';
import { IReport } from 'models/report';
// Make sure provied departmentId is valid
export const checkUserIsDepartmentAuthed = (user: User, departmentId: string) => {
  if (user.role === Role.Admin || user.role === Role.MedicalDirector) {
    return true;
  }

  const userDepartment = user.departmentId;
  return userDepartment === departmentId;
};

export const checkUserCanEdit = (user: User, report: IReport) => {
  if (user.role === Role.Admin || user.role === Role.MedicalDirector) return true;

  if (user.role === Role.HeadOfDepartment && user.departmentId === report.departmentId) return true;

  if (user._id === report.submittedUserId) return true;

  return false;
};
