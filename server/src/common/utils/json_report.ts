import { ItemType, ItemTypeKeys, mapItemTypeToAnswerType } from 'common/definitions/report';
import { BadRequestError, InternalError } from 'exceptions/httpException';
import { JsonItemAnswer, JsonItemChildren, JsonReportDescriptor, JsonReportItem, JsonReportMeta } from '../definitions/json_report';
import { Report } from './report';

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

export const getItemType = (jsonItem: JsonReportItem): string => {
    return jsonItem.type;
}

export const isInATable = (jsonItem: JsonReportItem): boolean => {
    if (jsonItem.answer.length > 1) {
        return true;
    }
    return false;
}

export const isANumericItem = (jsonItem: JsonReportItem): boolean => {
    const typeKey = Report.getItemTypeFromValue(jsonItem.type);
    if (!typeKey) {
        throw new Error(`"${jsonItem.description}" item has invalid item type: ${jsonItem.type}`);
    }
    if (ItemType[typeKey!] !== ItemType.N) {
        return false;
    }
    return true;
}
export const isASumItem = (jsonItem: JsonReportItem): boolean => {
    const typeKey = Report.getItemTypeFromValue(jsonItem.type);
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

export const getReportItems = (report: JsonReportDescriptor): JsonReportItem[] => {
    return report.items;
}

export const getReportMeta = (report: JsonReportDescriptor): JsonReportMeta => {
    return report.meta;
}

const isBooleanValue = (str: string) => {
    const parsed = JSON.parse(str.toLowerCase());
    if (parsed === true || parsed === false) {
        return true;
    }
    
    return false;
}

export const validateAnswerInputType = (answer: JsonItemAnswer, itemType: ItemTypeKeys) => {
    // a single cell answer may have more than 1 entry
    switch (mapItemTypeToAnswerType.get(itemType)) {
        case ("number"): {
            answer.forEach((answerEntry) => {
                if (isNaN(Number(answerEntry))) {
                    throw new BadRequestError(`Item must have numeric answer but got this ${answerEntry}`);
                }
            })
            break;
        }
        case("boolean"): {
            answer.forEach((answerEntry) => {
                if (!isBooleanValue(answerEntry)) {
                    throw new BadRequestError(`Item must have boolean answer but got this ${answerEntry}`);
                }
            })
            break;
        }
        case("string"): {
            break;
        }
        default: {
            throw new InternalError("Item type is not defined to map with an answer type");
        }
    }
}
}