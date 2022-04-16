import { User } from '../models/user';
import { Role } from '../models/user';

// Make sure provied departmentId is valid
export const checkUserIsDepartmentAuthed = (user: User, departmentId: string) => {
  if (user.role === Role.Admin || user.role === Role.MedicalDirector) {
    return true;
  }

  const userDepartment = user.departmentId;
  return userDepartment === departmentId;
};
