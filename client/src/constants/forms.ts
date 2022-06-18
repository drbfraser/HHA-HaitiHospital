import { Role, Department } from './interfaces';
import { Path } from 'react-hook-form';

// >>>>>>>>>>>>>>>>>>>>>>>>>> FORMS BY useForm() >>>>>>>>>>>>>>>>>>>>>>>>>>>>

export interface AdminUserFormData {
  username: string;
  name: string;
  password: string;
  role: Role;
  department: Department;
}

export const ADMIN_USER_FORM_FIELDS: {
    username: Path<AdminUserFormData>,
    name: Path<AdminUserFormData>,
    password: Path<AdminUserFormData>,
    role: Path<AdminUserFormData>,
    department: {
        this: Path<AdminUserFormData>,
        id: Path<AdminUserFormData>,
        name: Path<AdminUserFormData>
    }
} = {
  username: 'username',
  name: 'name',
  password: 'password',
  role: 'role',
  department: {
    this: 'department',
    id: 'department.id',
    name: 'department.name'
  }
};
