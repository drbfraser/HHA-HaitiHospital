import { ItemTypeKeys, ReportMeta } from './report';

export interface TemplateItem {
    type: ItemTypeKeys;
    description: string;
}
//Short Answer Item
// export interface ReportSaItem extends ReportItem<string> {};
//Numeric Item

export interface ReportNItem extends TemplateItem { }
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
export interface ReportSumItem extends TemplateItem {
    children: Array<ReportNItem | ReportSumItem>;
}
//Survey Generator item
// export interface JsonReportSurveyItem extends ReportItem<number> {
//     items: Array<ReportItem<ItemAnswerTypes>>
// }

export type TemplateItems = Array<TemplateItem>;
export interface TemplateReport {
    meta: ReportMeta;
    items: TemplateItems
}
