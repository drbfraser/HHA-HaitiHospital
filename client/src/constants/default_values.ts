import { UserDetails, Role, EMPTY_DEPARTMENT } from './interfaces';

export const EMPTY_USER_JSON: UserDetails = {
  id: '',
  name: '',
  role: Role.User,
  department: EMPTY_DEPARTMENT,
  createdAt: '',
  updatedAt: '',
};
