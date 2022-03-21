// Common utility functions used throughout the client
import { Role } from 'constants/interfaces';
import { DepartmentName } from 'common/definitions/departments';

export const isUserInDepartment = (userDepartment: string, wantedDepartment: string): boolean => {
  if (userDepartment === wantedDepartment) {
    return true;
  }
  return false;
};

export const renderBasedOnRole = (currentUserRole: string, requiredRoles: string[]): boolean => {
  if (requiredRoles.includes(currentUserRole)) {
    return true;
  }
  return false;
};

export const renderBasedOnUserRoleAndDepartment = (
  currentUserRole: string,
  requiredRoles: string[],
  currentUserDepartment: string,
  requiredDepartments: string[],
): boolean => {
  if (
    requiredRoles.includes(currentUserRole) &&
    requiredDepartments.includes(currentUserDepartment)
  ) {
    return true;
  }
  return false;
};

export const getAllUserRoles = (): Role[] => {
  return [Role.Admin, Role.HeadOfDepartment, Role.MedicalDirector, Role.User];
};

export const isRoleRequired = (rolesAllowed: Role[]): boolean => {
  if (rolesAllowed.length > 0) {
    return true;
  }
  return false;
};

export const isRoleAuthenticated = (rolesAllowed: Role[], currentUserRole: string): boolean => {
  if (rolesAllowed.length > 0) {
    const userRoleAuthenticated = rolesAllowed.find((role) => currentUserRole === role);
    if (userRoleAuthenticated) {
      return true;
    }
  }
  return false;
};

export const isDepartmentRequired = (departmentsAllowed: DepartmentName[]): boolean => {
  if (departmentsAllowed.length > 0) {
    return true;
  }
  return false;
};

export const isDepartmentAllowed = (
  departmentsAllowed: Role[],
  currentUserDepartment: string,
): boolean => {
  if (departmentsAllowed.length > 0) {
    const userRoleAuthenticated = departmentsAllowed.find((role) => currentUserDepartment === role);
    if (userRoleAuthenticated) {
      return true;
    }
  }
  return false;
};
