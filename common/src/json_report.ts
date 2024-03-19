import { nameof } from 'ts-simple-nameof';

export enum ItemType {
  // SA = "short answer",
  NUMERIC = 'numeric',
  // YN = "yes no",
  // MCQ = "mcq",
  // PO = "pick one",
  // MCQ_OPTION = "mcq option",
  SUM = 'sum',
  EQUAL = 'equal',
  GROUP = 'group',
  // SG = "survey generator"
}
export type ItemTypeKeys = keyof typeof ItemType;

// A hack to stringify an interface name
// https://stackoverflow.com/questions/27945515/is-it-possible-to-get-name-of-the-interface-as-a-string#comment106146140_53431302
// Interfaces property will be stringified so make sure the property name is identical to the interface name who is being stringified.
interface Interfaces {
  JsonReportDescriptor: JsonReportDescriptor;
}
export const JSON_REPORT_DESCRIPTOR_NAME = nameof<Interfaces>((o) => o.JsonReportDescriptor);

export interface JsonReportMeta {
  id: string;
  department: {
    id: string;
    name: string;
  };
  submittedDate?: string;
  submittedUserId?: string;
  submittedBy?: string;
  isDraft?: boolean;
}

export type JsonItemAnswer = Array<string>;
export type JsonItemChildren = Array<JsonReportItem>;
export interface JsonReportItem {
  /**
   * Json structure of an item
   */
  type: string;
  description: string;
  // answer is an array of array to support table
  // the outer array is for table row (sharing 1 question which is the column)
  // the inner array is the actual answer to that 1 cell (row, col)
  // one cell/one question may have more than 1 entry for an answer.
  answer: Array<JsonItemAnswer>;

  // To suppport mcq (choices and selection)
  options?: Array<JsonMcqOption>;
  hasUserInput?: string;
  optionOther?: JsonMcqOption;

  // To support table
  // inner array contains the actual children of a cell.
  items?: JsonItemChildren;
}

export interface JsonMcqOption {
  description: string;
  value: string;
}

export type JsonReportItems = Array<JsonReportItem>;
export interface JsonReportDescriptor {
  /**
   * Meta data for a submitted report.
   *
   */
  meta: JsonReportMeta;

  /**
   * A collection of items in a submitted report.
   *
   */
  items: JsonReportItems;
}

export interface ReportMetaData {
  departmentId: string;
  reportMonth: string;
  _id: string;
  submittedDate?: Date | undefined;
  submittedUserId?: string;
  submittedBy?: string;
  isDraft?: boolean;
}
