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
    /**
     * Meta data for an item
     */
    readonly type: string;
}

export type JsonItemAnswer = Array<string>;

interface JsonReportItem {
    /**
     * Json structure of an item
     */
    readonly meta: JsonReportItemMeta;
    readonly description: string;
    readonly answer: Array<JsonItemAnswer>;

    // To suppport mcq (choices and selection)
    readonly options?: Array<JsonMcqOption>;
    readonly hasUserInput?: boolean;
    readonly optionOther?: JsonMcqOption;

    // To support survey generator and sum (any item that has sub-items)
    readonly items?: Array<JsonReportItem>

}

export interface JsonMcqOption {
    readonly description: string;
    readonly value: string;
}

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