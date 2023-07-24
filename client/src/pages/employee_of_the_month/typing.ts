import { Department } from 'constants/interfaces';
import * as H from 'history';

export interface EmployeeOfTheMonth {
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

export interface YearMonthParams {
  year: string;
  month: string;
}
