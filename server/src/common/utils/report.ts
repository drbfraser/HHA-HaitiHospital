import { JsonItemAnswer, JsonReportDescriptor, JsonReportItem, JsonReportMeta } from 'common/definitions/json_report';
import { BadRequestError, InternalError, UnauthorizedError } from 'exceptions/httpException';
import { ItemType, ItemTypeKeys, mapItemTypeToAnswerType, mapItemTypeToConstructor, ReportDescriptor, ReportItem, ReportItemConstructor, ReportItems, ReportMeta, ReportNItem, ReportSumItem } from '../definitions/report';
import { getEnumKeyByStringValue } from './common';
import { getDepartmentIdFromString } from './departments';
import { JsonReport } from './json_report';

export namespace Report {

export const getItemTypeFromValue = (type: string): ItemTypeKeys | null=> {
    const key = getEnumKeyByStringValue(ItemType, type);
    return key;
}

const getConstructorForItemType = (type: string): ReportItemConstructor => {
    const typeKey = getItemTypeFromValue(type);
    if (!typeKey) {
        throw new Error(`Item type of "${type}" type is not valid`);
    }
    const constructor = mapItemTypeToConstructor.get(typeKey!);
    if (!constructor) {
        throw new Error(`Constructor for item type "${type}" is not yet supported`);
    }
    return constructor!;
}


export const reportConstructor = (jsonReport: JsonReportDescriptor): ReportDescriptor => {
    const meta: ReportMeta = reportMetaConstructor(JsonReport.getReportMeta(jsonReport));
    const items: ReportItems = JsonReport.getReportItems(jsonReport).map((jsonItem) => {
        const itemConstructor = getConstructorForItemType(JsonReport.getItemType(jsonItem));
        return itemConstructor(jsonItem);
    })
  
    let report: ReportDescriptor = {meta: meta, 
        items:items,
    };
    return report;
}

const isBooleanValue = (str: string) => {
    const parsed = JSON.parse(str.toLowerCase());
    if (parsed === true || parsed === false) {
        return true;
    }
    
    return false;
}

const validateAnswerInputType = (answer: JsonItemAnswer, itemType: ItemTypeKeys) => {
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

export const numericReportItemConstructor: ReportItemConstructor = (jsonItem: JsonReportItem): ReportNItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!JsonReport.isANumericItem(jsonItem)) {
        throw new Error(`Constructor for numeric item but ${typeKey} was provided - item: ${jsonItem.description}`);
    }

    if (JsonReport.getItemAnswerLength(jsonItem) !== 1) {
        throw new Error(`Numeric item -"${jsonItem.description}" must have exactly 1 answer`);
    }
    const answerList = JsonReport.getAnswerList(jsonItem);
    validateAnswerInputType(answerList, typeKey!);

    let newItem: ReportNItem = {
        type: typeKey!,
        description: jsonItem.description,
        answer: answerList
    };

    return newItem;
}

export const getAnswerList = (item: ReportItem) => {
    return item.answer[0];
}

const isSumCorrect = (sum: Number, children: ReportNItem[]) => {
    let childrenSum = 0;
    children.forEach((child) => {
        const answerList = getAnswerList(child);
        childrenSum += Number(answerList[0]);
    })

    if (sum === childrenSum)
        return true;
    else
        return false;
}

export const sumReportItemConstructor: ReportItemConstructor = (jsonItem: JsonReportItem): ReportSumItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!JsonReport.isASumItem(jsonItem)) {
        throw new Error(`Constructor for sum item but ${typeKey} was provided - item: ${jsonItem.description}`);
    }
    if (JsonReport.isInATable(jsonItem)) {
        throw new Error(`A Sum type item should not be in a table`);
    }
    if (JsonReport.getItemAnswerLength(jsonItem) > 1) {
        throw new Error(`A Sum item: ${jsonItem.description} must have only 1 answer`);
    }

    const answerList = JsonReport.getAnswerList(jsonItem);
    validateAnswerInputType(answerList, typeKey!);

    const jsonChildren = JsonReport.getChildren(jsonItem);
    const children = jsonChildren.map((jsonChild) => {
        return numericReportItemConstructor(jsonChild);
    });

    const sum = Number(answerList[0]);
    if (!isSumCorrect(sum, children)) {
        throw new Error(`Sum item: ${jsonItem.description} does not add up`);
    };

    let newItem: ReportSumItem = {
        type: typeKey!,
        description: jsonItem.description,
        answer: answerList,
        numericItems: children
    };
    return newItem;
}

const verifyUserId = (uid: string): boolean => {
    // ToDo: actually verify submitted user id is logged in user
    return true;
}

const reportMetaConstructor = (jsonMeta: JsonReportMeta) => {
    const deptIdKey = getDepartmentIdFromString(jsonMeta.departmentId);
    if (!deptIdKey) {
        throw new Error(`Department Id: ${jsonMeta.departmentId} is not valid`);
    }

    const submittedDate = new Date(jsonMeta.submittedDate);
    if (!submittedDate) {
        throw new Error(`Submitted date provided is not valid: ${jsonMeta.submittedDate}`);
    }

    const submittedUserId = jsonMeta.submittedUserId;
    if (!verifyUserId(submittedUserId)) {
        throw new Error(`Submitted user is not logged in`);
    }

    let meta: ReportMeta = {
        id: jsonMeta.id,
        departmentId: deptIdKey,
        submittedDate: submittedDate,
        submittedUserId: submittedUserId
    };
    return meta;
};
}