import { Role } from '@hha/common';
import { Path } from 'react-hook-form';

export interface AdminUserFormData {
  username: string;
  name: string;
  password: string;
  role: Role;
  department: {
    id: string;
    name: string;
  };
}

export const ADMIN_USER_FORM_FIELDS: {
  username: Path<AdminUserFormData>;
  name: Path<AdminUserFormData>;
  password: Path<AdminUserFormData>;
  role: Path<AdminUserFormData>;
  department: {
    this: Path<AdminUserFormData>;
    id: Path<AdminUserFormData>;
    name: Path<AdminUserFormData>;
  };
} = {
  username: 'username',
  name: 'name',
  password: 'password',
  role: 'role',
  department: {
    this: 'department',
    id: 'department.id',
    name: 'department.name',
  },
};
