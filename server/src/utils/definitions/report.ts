// import { IllegalState } from 'exceptions/systemException';
import { ItemTypeKeys } from '@hha/common';

export type ItemAnswer = Array<string>;
export interface ReportItem {
  type: ItemTypeKeys;
  description: string;
  answer: ItemAnswer;
}
//Short Answer Item
// export interface ReportSaItem extends ReportItem<string> {};
//Numeric Item

export interface ReportNumericItem extends ReportItem {}
//Yes No item
// export interface ReportYnItem extends ReportItem<boolean> {};
//Mcq item
// export interface ReportMcqItem extends ReportItem<number> {
//     options: Array<JsonMcqOption>;
//     hasUserInput: boolean;
//     other?: JsonMcqOption;
// };
//Pick one item
// export interface ReportPoItem extends ReportMcqItem {};
// export interface JsonMcqOption {
//     description: string;
//     value: string;
// }
//Sum item
export interface ReportSumItem extends ReportItem {
  children: Array<ReportNumericItem | ReportSumItem>;
}

export interface ReportEqualItem extends ReportItem {
  children: Array<ReportNumericItem | ReportSumItem>;
}

export interface ReportGroupItem extends ReportItem {
  children: Array<ReportItem>;
}
//Survey Generator item
// export interface JsonReportSurveyItem extends ReportItem<number> {
//     items: Array<ReportItem<ItemAnswerTypes>>
// }

export type ReportItems = Array<ReportItem>;
export interface ReportDescriptor {
  id: string;
  departmentId: string;
  submittedDate: Date;
  reportMonth?: Date;
  submittedUserId: string;
  submittedBy: string;
  items: ReportItems;
}
