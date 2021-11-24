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

export interface User {
  username: string;
  name: string;
  role: Role;
  department: DepartmentName; 
}