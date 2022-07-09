import { UserJson, Role, EMPTY_DEPARTMENT } from './interfaces';

export const EMPTY_USER_JSON: UserJson = {
  id: '',
  name: '',
  role: Role.User,
  department: EMPTY_DEPARTMENT,
  createdAt: '',
  updatedAt: '',
};
