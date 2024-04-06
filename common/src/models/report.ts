export interface IReport {
  _id: string;
  departmentId: string;
  reportMonth: Date;
  submittedDate: Date;
  submittedUserId: string;
  submittedBy: string;
  reportObject: object;
  isDraft: boolean;
}
