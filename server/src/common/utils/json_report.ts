import { ItemType } from 'common/definitions/report';
import { JsonItemAnswer, JsonItemChildren, JsonReportItem } from '../definitions/json_report';
import { getItemTypeFromValue } from './report';

export namespace JsonReport {
/**
 * 
 * @param jsonItem Item being examnined
 * @param rowIndex If item is not in a table, rowIndex = 0
 * @returns if item has children
 */
export const hasChildren = (jsonItem: JsonReportItem, rowIndex: number = 0): boolean => {
    if (jsonItem.items) {
        if (jsonItem.items![rowIndex].length > 0)
            return true;
    }
    return false;
};

export const getChildren = (jsonItem: JsonReportItem, rowIndex: number = 0): JsonItemChildren => {
    if (hasChildren(jsonItem, rowIndex)) {
        return jsonItem.items![rowIndex];
    }
    else {
        return [];
    }
} 

export const isInATable = (jsonItem: JsonReportItem): boolean => {
    if (jsonItem.answer.length > 1) {
        return true;
    }
    return false;
}

export const isANumericItem = (jsonItem: JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!typeKey) {
        throw new Error(`"${jsonItem.description}" item has invalid item type: ${jsonItem.type}`);
    }
    if (ItemType[typeKey!] !== ItemType.N) {
        return false;
    }
    return true;
}
export const isASumItem = (jsonItem: JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!typeKey) {
        throw new Error(`"${jsonItem.description}" item has invalid item type: ${jsonItem.type}`);
    }
    if (ItemType[typeKey!] !== ItemType.SUM) {
        return false;
    }
    return true;
}

export const getItemAnswerLength = (jsonItem: JsonReportItem): number => {
    const count = jsonItem.answer[0].length;
    return count;
}

export const getAnswerList = (jsonItem: JsonReportItem): JsonItemAnswer => {
    return jsonItem.answer[0];
}

}