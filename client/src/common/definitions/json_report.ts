/**
 * @additionalProperties false
 */
export interface JsonReportMeta {
    readonly id: string;
    readonly departmentId : string;
    readonly submittedDate: string;
    readonly submittedUserId: string;
};

/**
 * @additionalProperties false
 */
export interface JsonReportItemMeta {
    /**
     * Meta data for an item
     */
    readonly type: string;
}

/**
 * @additionalProperties false
 */
export type JsonItemAnswer = Array<string>;

/**
 * @additionalProperties false
 */
interface JsonReportItem {
    /**
     * Json structure of an item
     */
    readonly meta: JsonReportItemMeta;
    readonly description: string;
    readonly answer: Array<JsonItemAnswer>;

    // To suppport mcq (choices and selection)
    readonly options?: Array<JsonMcqOption>;
    readonly hasUserInput?: string;
    readonly optionOther?: JsonMcqOption;

    // To support survey generator and sum (any item that has sub-items)
    readonly items?: Array<JsonReportItem>

}

/**
 * @additionalProperties false
 */
export interface JsonMcqOption {
    readonly description: string;
    readonly value: string;
}

/**
 * @additionalProperties false
 * */
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