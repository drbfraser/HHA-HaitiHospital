import { User } from '../models/user';
import { Role } from '../models/user';
import { IReport } from 'models/report';
// Make sure provied departmentId is valid
export const checkUserCanViewReport = (user: User, departmentId: string) => {
  if (
    user.role === Role.Admin ||
    user.role === Role.MedicalDirector ||
    user.role === Role.HeadOfDepartment
  ) {
    return true;
  }

  const userDepartment = user.departmentId;
  return userDepartment === departmentId;
};

export const checkUserCanCreateReport = (user: User, reportDepartmentId: string) => {
  if (user.role === Role.Admin || user.role === Role.MedicalDirector) return true;

  if (user.role === Role.HeadOfDepartment && user.departmentId === reportDepartmentId) return true;

  return false;
};

export const checkUserCanEditReport = (user: User, report: IReport) => {
  if (user.role === Role.Admin || user.role === Role.MedicalDirector) return true;

  if (user.role === Role.HeadOfDepartment && user.departmentId === report.departmentId) return true;

  if (user._id === report.submittedUserId) return true;

  return false;
};

export const filterViewableReports = (user: User, reports: IReport[]) => {
  if (
    user.role === Role.Admin ||
    user.role === Role.MedicalDirector ||
    user.role === Role.HeadOfDepartment
  )
    return reports;

  if (user.role === Role.User)
    return reports.filter((report) => user.departmentId === report.departmentId);

  return [];
};

export const checkUserHasMessageAdminLevelAuth = (user: User, departmentId: string) => {
  if (user.role === Role.Admin || user.role === Role.MedicalDirector) return true;

  if (user.role === Role.HeadOfDepartment && user.departmentId === departmentId) return true;

  return false;
};
