import { DepartmentName } from '../common/definitions/departments';

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

export interface Message {
  departmentId: number;
  departmentName: string;
  date: Date;
  user: Object;
  messageBody: string;
  messageHeader: string;
}

export const emptyMessage: Message = {
  messageBody: '',
  messageHeader: '',
  departmentId: -1,
  user: {},
  departmentName: '',
  date: new Date(),
};

export enum Role {
  Admin = 'Admin',
  MedicalDirector = 'Medical Director',
  HeadOfDepartment = 'Head of Department',
  User = 'User',
}

export interface User {
  username: string;
  name: string;
  password: string;
  role: Role;
  department: DepartmentName;
}

export interface UserJson {
  username: string;
  name: string;
  password: string;
  role: Role;
  department: DepartmentName;
  createdAt: string;
  updatedAt: string;
}
