// import { IllegalState } from 'exceptions/systemException';
import { ItemTypeKeys } from 'common/definitions/json_report';

// export enum AnswerType {
//     number,
//     boolean,
//     string
// }
// export type AnswerTypeKeys = keyof typeof AnswerType;

// export const mapItemTypeToAnswerType = new Map<ItemTypeKeys, AnswerTypeKeys>();
// const initItemAnswerMap = (map: Map<ItemTypeKeys, AnswerTypeKeys>) => {
//     map.clear();
//     map.set("N", "number");
//     map.set("SUM", "number");
//     // ToDo: fill out later
//     if (map.size != Object.keys(ItemType).length)
//         throw new IllegalState(`item type - answer type map must have length ${Object.keys(ItemType).length}`);
// };
// initItemAnswerMap(mapItemTypeToAnswerType);


export interface ReportMeta {
    id: string;
    departmentId: string;
    submittedDate: Date;
    submittedUserId: string;
}

export type ItemAnswer = Array<string>;
export interface ReportItem {
    type: ItemTypeKeys;
    description: string;
    answer: ItemAnswer;
}
//Short Answer Item
// export interface ReportSaItem extends ReportItem<string> {};
//Numeric Item

export interface ReportNItem extends ReportItem { }
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
    children: Array<ReportNItem | ReportSumItem>;
}
//Survey Generator item
// export interface JsonReportSurveyItem extends ReportItem<number> {
//     items: Array<ReportItem<ItemAnswerTypes>>
// }

export type ReportItems = Array<ReportItem>;
export interface ReportDescriptor {
    meta: ReportMeta;
    items: ReportItems;
}
