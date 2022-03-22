import { ItemType, ItemTypeKeys } from 'common/definitions/report';
import { IllegalState, InvalidInput } from 'exceptions/systemException';
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
        throw new InvalidInput(`"${jsonItem.description}" item has invalid item type: ${jsonItem.type}`);
    }
    if (ItemType[typeKey!] !== ItemType.N) {
        return false;
    }
    return true;
}
export const isASumItem = (jsonItem: JsonReportItem): boolean => {
    const typeKey = Report.getItemTypeFromValue(jsonItem.type);
    if (!typeKey) {
        throw new InvalidInput(`"${jsonItem.description}" item has invalid item type: ${jsonItem.type}`);
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

export const validateAnswerType = (answer: JsonItemAnswer, itemType: ItemTypeKeys) => {
    const typeChecker = getAnswerTypeChecker(itemType);
    typeChecker(answer);
}

// >>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const isBooleanValue = (str: string) => {
    const parsed = JSON.parse(str.toLowerCase());
    if (parsed === true || parsed === false) {
        return true;
    }
    
    return false;
}

interface AnswerTypeChecker {
    (answer: JsonItemAnswer): void
};

const mapItemTypeToAnswerTypeChecker = new Map<ItemTypeKeys, AnswerTypeChecker>();
const initItemAnswerTypeCheckerMap = (map: Map<ItemTypeKeys, AnswerTypeChecker>) => {
    map.clear();
    map.set("N", numericAnswerTypeChecker);
    map.set("SUM", numericAnswerTypeChecker);
    //ToDo: fill out the rest later
    if (map.size != Object.keys(ItemType).length) {
        throw new IllegalState(`item - answer type checker map must have length ${Object.keys(ItemType).length}`);
    }
}
initItemAnswerTypeCheckerMap(mapItemTypeToAnswerTypeChecker);

// a single cell answer may have more than 1 entry
const numericAnswerTypeChecker: AnswerTypeChecker = (answer: JsonItemAnswer) => {
    answer.forEach((answerEntry) => {
        if (isNaN(Number(answerEntry))) {
            throw new InvalidInput(`Item must have a numeric answer but got this ${answerEntry}`);
        }
    })
}

// a single cell answer may have more than 1 entry
const booleanAnswerTypeChecker: AnswerTypeChecker = (answer: JsonItemAnswer) => {
    answer.forEach((answerEntry) => {
        if (!isBooleanValue(answerEntry)) {
            throw new InvalidInput(`Item must have a boolean type answer but got this ${answerEntry}`);
        }
    })
}

// a single cell answer may have more than 1 entry
const stringAnswerTypeChecker: AnswerTypeChecker = (answer: JsonItemAnswer) => {
    // jsonReport only supports string value
    return true;
}

const getAnswerTypeChecker = (typeKey: ItemTypeKeys): AnswerTypeChecker => {
    const typeChecker = mapItemTypeToAnswerTypeChecker.get(typeKey);
    if (!typeChecker) {
        throw new InvalidInput(`Item of type ${typeKey} does not have an answer type checker`);
    }
    return typeChecker;
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<
}