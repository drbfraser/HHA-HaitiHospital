import { DepartmentId } from "../../models/departments";


export enum ItemType {
    // SA = "short answer",
    N = "numeric",
    // YN = "yes no",
    // MCQ = "mcq",
    // PO = "pick one",
    // MCQ_OPTION = "mcq option",
    SUM = "sum",
    // SG = "survey generator"
}

export interface ReportMeta {
    id: string;
    departmentId : DepartmentId;
    submittedDate: Date;
    submittedUserId: string;
};

export interface ReportItemMeta {
    type: ItemType;
}

export type ItemAnswer<Type> = Array<Type>;
interface ReportItem<Type> {
    meta: ReportItemMeta;
    description: string;
    answer: Array<ItemAnswer<Type>>
}

//Short Answer Item
export interface ReportSaItem extends ReportItem<string> {
};
//Numeric Item
export interface ReportNItem extends ReportItem<number> {
};
//Yes No item
export interface ReportYnItem extends ReportItem<boolean> {
};
//Mcq item
export interface ReportMcqItem extends ReportItem<number> {
    options: Array<JsonMcqOption>;
    hasUserInput: boolean;
    other?: JsonMcqOption;
};
//Pick one item
export interface ReportPoItem extends ReportMcqItem {
};

export interface JsonMcqOption {
    description: string;
    value: string;
}
//Sum item
export interface ReportSumItem extends ReportItem<number> {
    numericItems: Array<ReportNItem>;
};

//Survey Generator item
export interface JsonReportSurveyItem extends ReportItem<number> {
    items: Array<ReportItem<ItemAnswerTypes>>
}

export type ItemAnswerTypes = string | number | boolean;
export interface JsonReportDescriptor {
    meta: ReportMeta;
    items: Array<ReportItem<ItemAnswerTypes>>; 
};