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

export interface Message {
  department: Department;
  date: Date;
  user: UserJson;
  messageBody: string;
  messageHeader: string;
}

export const emptyMessage: Message = {
  department: { id: '', name: '' },
  date: new Date(),
  user: {
    username: '',
    name: '',
    role: Role.Admin,
    department: { id: '', name: '' },
    createdAt: '',
    updatedAt: '',
  },
  messageBody: '',
  messageHeader: '',
};

export interface User {
  username: string;
  name: string;
  password: string;
  role: Role;
  department: Department;
}

export interface UserJson {
  username: string;
  name: string;
  role: Role;
  department: Department;
  createdAt: string;
  updatedAt: string;
}
