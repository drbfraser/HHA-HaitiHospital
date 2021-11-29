import {CSSProperties} from 'react';
export interface CustomCssProps extends CSSProperties {
  '--grid-cols'? : string,
  '--griditem-alignself'? :string,
  '--griditem-justifyself'?: string,
};
export interface ElementStyleProps {
    classes?: string;
    style?: CustomCssProps;
};

export interface Json {
    [x: string]: string|number|boolean|Date|Json|JsonArray,
}
export interface JsonArray extends Array<Json> { }

type ReportEntry = string | number | boolean | ReportProps | ReportProps[];
export interface ReportProps {
  [index : string] :  ReportEntry,
}

type MessageEntry = string | number | boolean | MessageProps | MessageProps[];
export interface MessageProps {
    [index : string] :  MessageEntry,
}

export interface Message {
  departmentId: number;
  departmentName: string;
  authorId: number;
  date: Date;
  messageBody: string;
  messageHeader: string;
}

export const emptyMessage : Message = {
    messageBody: '',
    messageHeader: '',
    departmentId: 0,
    departmentName: '',
    authorId: 0,
    date: new Date(),
}

export enum Role {
  Admin = "Admin",
  MedicalDirector = "Medical Director",
  HeadOfDepartment = "Head of Department",
  User = "User",
}

export enum DepartmentName {
  NicuPaeds = "NICU/Paeds",
  Maternity = "Maternity",
  Rehab = "Rehab",
  CommunityHealth = "Community & Health",
}

export enum DepartmentId{
    NicuPaeds = 1,
    Maternity = 2,
    Rehab = 3,
    CommunityHealth = 4,
}

export function getDepartmentId(dept: DepartmentName): DepartmentId {
    switch (dept) {
        case DepartmentName.NicuPaeds:
            return DepartmentId.NicuPaeds;

        case DepartmentName.Maternity:
            return DepartmentId.Maternity;
        
        case DepartmentName.Rehab:
            return DepartmentId.Rehab;

        case DepartmentName.CommunityHealth:
            return DepartmentId.CommunityHealth;

        default:
            return DepartmentId.NicuPaeds;
    }  
}


export interface User {
  username: string;
  name: string;
  password: string;
  role: Role;
  department: DepartmentName;
}