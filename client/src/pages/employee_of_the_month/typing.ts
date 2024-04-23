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

export const isNonEmptyObject = (objectName: Object) => {
  return (
    typeof objectName === 'object' && objectName !== null && Object.keys(objectName).length > 0
  );
};
