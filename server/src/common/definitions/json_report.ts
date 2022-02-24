// A hack to stringify an interface name
// https://stackoverflow.com/questions/27945515/is-it-possible-to-get-name-of-the-interface-as-a-string#comment106146140_53431302
// Interfaces property will be stringified so make sure the property name is identical to the interface name who is being stringified.
import { nameof } from 'ts-simple-nameof';
interface Interfaces {
    JsonReportDescriptor: JsonReportDescriptor;
}
export const JSON_REPORT_DESCRIPTOR_NAME = nameof<Interfaces>((o) => o.JsonReportDescriptor);

export interface JsonReportMeta {
    readonly id: string;
    readonly departmentId : string;
    readonly submittedDate: string;
    readonly submittedUserId: string;
};

export interface JsonReportItemMeta {
    readonly type: string;
}

export type JsonItemAnswer = Array<string>;

interface JsonReportItem {
    readonly meta: JsonReportItemMeta;
    readonly description: string;
    readonly answer: Array<JsonItemAnswer>;
}

//Short Answer Item
// export interface JsonReportSaItem extends JsonReportItem {};
//Numeric Item
export interface JsonReportNItem extends JsonReportItem {};
//Yes No item
// export interface JsonReportYnItem extends JsonReportItem {};
//Mcq item
// export interface JsonReportMcqItem extends JsonReportItem {
//     readonly options: Array<JsonMcqOption>;
//     readonly hasUserInput: boolean;
//     other?: JsonMcqOption;
// };
//Pick one item
// export interface JsonReportPoItem extends JsonReportMcqItem {}

// export interface JsonMcqOption {
//     readonly description: string;
//     readonly value: string;
// }
//Sum item
export interface JsonReportSumItem extends JsonReportItem {
    readonly numericItems: Array<JsonReportNItem>;
};

//Survey Generator item
// export interface JsonReportSurveyItem extends JsonReportItem {
//     readonly items: Array<JsonReportItem>
// }

export interface JsonReportDescriptor {
    /**
     * Meta data for a submitted report.
     * 
     */
    readonly meta: JsonReportMeta;

    /**
     * A collection of items in a submitted report.
     */
    readonly items: Array<JsonReportItem>; 
};