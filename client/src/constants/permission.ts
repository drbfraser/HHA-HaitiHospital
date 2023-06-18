import { Role } from 'constants/interfaces';

export enum Permission {
  ACCESS_PAGE = 'can_view_dashboard',
  EDIT_PAGE = 'can_edit_page',
  DELETE_PAGE = 'can_delete_page',
}

export const rolePermissions = {
  [Role.Admin]: [
    Permission.ACCESS_PAGE,
    Permission.EDIT_PAGE,
    Permission.DELETE_PAGE,
  ],
  [Role.User]: [Permission.ACCESS_PAGE],
  [Role.HeadOfDepartment]: [Permission.ACCESS_PAGE],
  [Role.MedicalDirector]: [Permission.ACCESS_PAGE],
  [Role.BioMechanic]: [Permission.ACCESS_PAGE]
};