import { UserJson as User } from '@hha/common';
import { AdminUserFormData } from './typing';

export const initAdminForm = (data: User): AdminUserFormData => {
  return {
    username: '',
    password: '',
    name: data.name,
    department: data.department,
    role: data.role,
  };
};
