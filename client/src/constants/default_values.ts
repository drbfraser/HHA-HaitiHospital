import { UserClientModel as User, Role } from '@hha/common';

export const EMPTY_USER_JSON: User = {
  id: '',
  name: '',
  username: '',
  role: Role.User,
  department: {
    id: '',
    name: '',
  },
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};
