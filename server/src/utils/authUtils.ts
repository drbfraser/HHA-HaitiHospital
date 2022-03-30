import { InvalidInput } from 'exceptions/systemException';
import UserModel from '../models/user';
import { Role } from '../models/user';

export const checkUserIsDepartmentAuthed = async (userId: string, reportDepartmentId: string, userRole: string) => {
  // All roles other than a regular user role are authorized to do any departmental work
  if (userRole != Role.User) {
    return true;
  }
  const user = await UserModel.findById(userId).lean();
  if (!user) {
    throw new InvalidInput(`No user with provided id found`);
  }
  const userDepartment = user.department;
  return userDepartment === reportDepartmentId;
};
