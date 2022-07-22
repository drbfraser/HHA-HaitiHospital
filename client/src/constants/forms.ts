import { Role, Department } from './interfaces';
import { Path } from 'react-hook-form';
import { BiomechPriority } from 'pages/broken_kit_report/BiomechModel';

// >>>>>>>>>>>>>>>>>>>>>>>>>> FORMS BY useForm() >>>>>>>>>>>>>>>>>>>>>>>>>>>>

export interface AdminUserFormData {
  username: string;
  name: string;
  password: string;
  role: Role;
  department: Department;
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

export interface BiomechForm {
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: BiomechPriority;
  file: File;
};

export const BIOMECH_REPORT_FIELDS: {
    equipmentName: Path<BiomechForm>
    equipmentFault: Path<BiomechForm>
    equipmentPriority: Path<BiomechForm>
    file: Path<BiomechForm> 
} = {
    equipmentName: 'equipmentName',
    equipmentFault: 'equipmentFault',
    equipmentPriority: 'equipmentPriority',
    file: 'file'
}
