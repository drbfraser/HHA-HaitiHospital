import { Department } from 'constants/interfaces';
import { Types } from 'mongoose';
import * as H from 'history';

export interface EmployeeOfTheMonth {
  id: string;
  name: string;
  department: Department;
  description: string;
  imgPath: string;
  awardedMonth: number;
  awardedYear: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteComponentProps<P> {
  match: match<P>;
  location: H.Location;
  history: H.History;
  staticContext?: any;
}

export interface match<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

export interface EmployeeViewParams {
  year: string;
  month: string;
  eotmId: string;
  type: EmployeeViewType.YearMonth | EmployeeViewType.EotmId;
}

export enum EmployeeViewType {
  YearMonth = 'YEAR_MONTH',
  EotmId = 'EOTM_ID',
}
