import { DepartmentJson } from './department';
import { unknownUserJson, UserApiOut } from './user';

export interface Message {
  departmentId: string;
  userId: string;
  date: Date;
  messageBody: string;
  messageHeader: string;
}

export interface MessageJson {
  id: string;
  department: DepartmentJson;
  user: UserApiOut.UserGet | null;
  date: string;
  messageBody: string;
  messageHeader: string;
}

export interface MessageClientModel {
  id: string;
  department: DepartmentJson;
  user: UserApiOut.UserGet | null;
  date: Date;
  messageBody: string;
  messageHeader: string;
}

export const emptyMessage: MessageJson = {
  id: '',
  department: { id: '', name: '' },
  date: new Date().toLocaleDateString(),
  user: unknownUserJson,
  messageBody: '',
  messageHeader: '',
};
