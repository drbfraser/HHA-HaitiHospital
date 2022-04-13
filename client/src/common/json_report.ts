import { nameof } from 'ts-simple-nameof';

export enum ItemType {
  // SA = "short answer",
  NUMERIC = 'numeric',
  // YN = "yes no",
  // MCQ = "mcq",
  // PO = "pick one",
  // MCQ_OPTION = "mcq option",
  SUM = 'sum'
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
  readonly id: string;
  readonly department: {
    id: string;
    name: string;
  };
  readonly submittedDate?: string;
  readonly submittedUserId?: string;
}

export type JsonItemAnswer = Array<string>;
export type JsonItemChildren = Array<JsonReportItem>;
export interface JsonReportItem {
  /**
   * Json structure of an item
   */
  readonly type: string;
  readonly description: string;
  // answer is an array of array to support table
  // the outer array is for table row (sharing 1 question which is the column)
  // the inner array is the actual answer to that 1 cell (row, col)
  // one cell/one question may have more than 1 entry for an answer.
  readonly answer: Array<JsonItemAnswer>;

  // To suppport mcq (choices and selection)
  readonly options?: Array<JsonMcqOption>;
  readonly hasUserInput?: string;
  readonly optionOther?: JsonMcqOption;

  // To support table
  // inner array contains the actual children of a cell.
  readonly items?: JsonItemChildren;
}

export interface JsonMcqOption {
  readonly description: string;
  readonly value: string;
}

export type JsonReportItems = Array<JsonReportItem>;
export interface JsonReportDescriptor {
  /**
   * Meta data for a submitted report.
   *
   */
  readonly meta: JsonReportMeta;

  /**
   * A collection of items in a submitted report.
   *
   */
  readonly items: JsonReportItems;
}
