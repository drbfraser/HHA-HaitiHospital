export interface JsonReportMeta {
    readonly id: string;
    readonly departmentId : string;
    readonly submittedDate: string;
    readonly submittedUserId: string;
};

export enum ItemType {
    SA = "short answer",
    N = "numeric",
    YN = "yes no",
    MCQ = "mcq",
    PO = "pick one",
    MCQ_OPTION = "mcq option",
    SUM = "sum",
    // SG = "survey generator"
}

export interface JsonReportItemMeta {
    readonly type: ItemType;
}

interface JsonReportItem {
    readonly meta: JsonReportItemMeta;
    readonly description: string;
    answer?: string;
}

//Short Answer Item
export interface JsonReportSaItem extends JsonReportItem {};
//Numeric Item
export interface JsonReportNItem extends JsonReportItem {};
//Yes No item
export interface JsonReportYnItem extends JsonReportItem {};
//Mcq item
export interface JsonReportMcqItem extends JsonReportItem {
    readonly options: Array<JsonMcqOption>;
    readonly hasUserInput: boolean;
    other?: JsonMcqOption;
};
//Pick one item
export interface JsonReportPoItem extends JsonReportMcqItem {}

export interface JsonMcqOption {
    readonly description: string;
    readonly value: string;
}
//Sum item
export interface JsonReportSumItem extends JsonReportItem {
    readonly numericItems: Array<JsonReportNItem>;
};

//Survey Generator item
// export interface JsonReportSurveyItem extends JsonReportItem {
//     readonly items: Array<JsonReportItem>
//     readonly numSurveys: number;
// }

export interface JsonReportDescriptor {
    readonly meta: JsonReportMeta;
    readonly items: Array<JsonReportItem>; 
};