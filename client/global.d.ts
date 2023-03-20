type ErrorType = string;
type FunctionalComponent = (object: Object) => JSX.Element;
type ID = string;
type IReportObject<ReportType> = {
  _id: string;
  departmentId: string;
  reportMonth: Date;
  reportObject: ReportType;
  submittedBy: string;
  submittedDate: Date;
};
