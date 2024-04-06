import { UserClientModel } from '@hha/common';
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

export interface UserJson {
  errorMessage: string;
  isAuth: boolean;
  loading: boolean;
  userDetails: UserClientModel;
}

export interface QuestionRow {
  id: string;
  prompt?: string;
  answer: string;
}
