// Common utility functions used throughout the client
import { Role } from "constants/interfaces";

export const isUserInDepartment = (userDepartment: string, wantedDepartment: string): boolean => {
    if (userDepartment === wantedDepartment) {
        return true;
    }
    return false;
}

export const renderBasedOnRole = (currentUserRole: string, requiredRoles: string[]): boolean => {
    if (requiredRoles.includes(currentUserRole)) {
        return true;
    }
    return false;
}

export const renderBasedOnUserRoleAndDepartment = (currentUserRole: string, requiredRoles: string[], currentUserDepartment: string, requiredDepartments: string[]): boolean => {
    if (requiredRoles.includes(currentUserRole) && requiredDepartments.includes(currentUserDepartment)) {
        return true;
    }
    return false;
}

export const getAllUserRoles = (): Role[] => {
    return [Role.Admin, Role.HeadOfDepartment, Role.MedicalDirector, Role.User]
}