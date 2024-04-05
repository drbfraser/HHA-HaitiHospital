// Common utility functions used throughout the client
import { Role, DepartmentJson as Department } from '@hha/common';

export const isUserInDepartment = (userDepartment: string, wantedDepartment: string): boolean => {
  return userDepartment === wantedDepartment;
};

export const renderBasedOnRole = (currentUserRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(currentUserRole);
};

export const renderBasedOnUserRoleAndDepartment = (
  currentUserRole: string,
  requiredRoles: string[],
  currentUserDepartment: string,
  requiredDepartments: string[],
): boolean => {
  return (
    requiredRoles.includes(currentUserRole) && requiredDepartments.includes(currentUserDepartment)
  );
};

export const getAllUserRoles = (): Role[] => {
  return [Role.Admin, Role.HeadOfDepartment, Role.MedicalDirector, Role.User];
};

export const isRoleRequired = (rolesAllowed: Role[]): boolean => {
  return rolesAllowed.length > 0;
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

export const isDepartmentRequired = (departmentsAllowed: Department[]): boolean => {
  return departmentsAllowed.length > 0;
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
