export interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray;
}
export interface JsonArray extends Array<Json> {}

type ReportEntry = string | number | boolean | ReportProps | ReportProps[];
export interface ReportProps {
  [index: string]: ReportEntry;
}

type MessageEntry = string | number | boolean | MessageProps | MessageProps[];
export interface MessageProps {
  [index: string]: MessageEntry;
}

export const GeneralDepartment: string = 'General';

export enum Role {
  Admin = 'Admin',
  MedicalDirector = 'Medical Director',
  HeadOfDepartment = 'Head of Department',
  User = 'User',
}

export interface Department {
  id: string;
  name: string;
}

export interface DepartmentJson {
  departments: Department[];
}

export const EMPTY_DEPARTMENT: Department = {
  id: '',
  name: '',
};

export interface Message {
  id: string;
  department: Department;
  date: Date;
  user: UserJson;
  messageBody: string;
  messageHeader: string;
}

export const emptyMessage: Message = {
  id: '',
  department: { id: '', name: '' },
  date: new Date(),
  user: {
    id: '',
    name: '',
    role: Role.Admin,
    department: EMPTY_DEPARTMENT,
    createdAt: '',
    updatedAt: '',
  },
  messageBody: '',
  messageHeader: '',
};

export interface Comment {
  id: string;
  createdAt: Date;
  user: UserJson;
  messageComment: string;
}

export const emptyMessageComment: Comment = {
  id: '',
  createdAt: new Date(),
  user: {
    id: '',
    name: '',
    role: Role.Admin,
    department: EMPTY_DEPARTMENT,
    createdAt: '',
    updatedAt: '',
  },
  messageComment: '',
};

export interface UserJson {
  id: string;
  name: string;
  role: Role;
  department: Department;
  createdAt: string;
  updatedAt: string;
}

export namespace BiomechResponse {
  export interface BiomechGet {
    id: string;
    user: UserJson;
    department: {
      id: string;
      name: string;
    };
    equipmentName: string;
    equipmentFault: string;
    equipmentPriority: string;
    createdAt: string;
    updatedAt: string;
    imgPath: string;
  }
}
