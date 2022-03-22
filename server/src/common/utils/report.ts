import { getDepartmentIdKeyFromValue } from 'common/definitions/departments';
import { JsonReportDescriptor, JsonReportItem, JsonReportMeta } from 'common/definitions/json_report';
import { IllegalState, InvalidInput } from 'exceptions/systemException';
import { ItemType, ItemTypeKeys, ReportDescriptor, ReportItem, ReportItemConstructor, ReportItems, ReportMeta, ReportNItem, ReportSumItem } from '../definitions/report';
import { getEnumKeyByStringValue } from './common';
import { JsonReport } from './json_report';

export namespace Report {

export const getItemTypeFromValue = (type: string): ItemTypeKeys | null=> {
    const key = getEnumKeyByStringValue(ItemType, type);
    return key;
}

export const getAnswerList = (item: ReportItem) => {
    return item.answer[0];
}

const getConstructorForItemType = (type: string): ReportItemConstructor => {
    const typeKey = getItemTypeFromValue(type);
    if (!typeKey) {
        throw new InvalidInput(`Item type of "${type}" is not supported`);
    }
    const constructor = mapItemTypeToConstructor.get(typeKey!);
    if (!constructor) {
        throw new InvalidInput(`Constructor for item type "${type}" is not yet supported`);
    }
    return constructor!;
}

const mapItemTypeToConstructor = new Map<ItemTypeKeys, ReportItemConstructor>();
const initItemConstructorMap = (map: Map<ItemTypeKeys, ReportItemConstructor>) => {
    map.clear();
    map.set("N", Report.numericReportItemConstructor);
    map.set("SUM", Report.sumReportItemConstructor);
    if (map.size != Object.keys(ItemType).length) {
        throw new IllegalState(`item type - constructor map must have length ${Object.keys(ItemType).length}`);
    }
}
initItemConstructorMap(mapItemTypeToConstructor);

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


export const numericReportItemConstructor: ReportItemConstructor = (jsonItem: JsonReportItem): ReportNItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!JsonReport.isANumericItem(jsonItem)) {
        throw new InvalidInput(`Constructor for numeric item but ${typeKey} was provided - item: ${jsonItem.description}`);
    }

    if (JsonReport.getItemAnswerLength(jsonItem) !== 1) {
        throw new InvalidInput(`Numeric item -"${jsonItem.description}" must have exactly 1 answer`);
    }
    const answerList = JsonReport.getAnswerList(jsonItem);
    JsonReport.validateAnswerType(answerList, typeKey!);

    let newItem: ReportNItem = {
        type: typeKey!,
        description: jsonItem.description,
        answer: answerList
    };

    return newItem;
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
        throw new InvalidInput(`Constructor for sum item but ${typeKey} was provided - item: ${jsonItem.description}`);
    }
    if (JsonReport.isInATable(jsonItem)) {
        throw new InvalidInput(`A Sum type item should not be in a table`);
    }
    if (JsonReport.getItemAnswerLength(jsonItem) > 1) {
        throw new InvalidInput(`A Sum item: ${jsonItem.description} must have only 1 answer`);
    }

    const answerList = JsonReport.getAnswerList(jsonItem);
    JsonReport.validateAnswerType(answerList, typeKey!);

    const jsonChildren = JsonReport.getChildren(jsonItem);
    const children = jsonChildren.map((jsonChild) => {
        return numericReportItemConstructor(jsonChild);
    });

    const sum = Number(answerList[0]);
    if (!isSumCorrect(sum, children)) {
        throw new InvalidInput(`Sum item: ${jsonItem.description} does not add up`);
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
    const deptIdKey = getDepartmentIdKeyFromValue(jsonMeta.departmentId);
    if (!deptIdKey) {
        throw new InvalidInput(`Department Id: ${jsonMeta.departmentId} is not valid`);
    }

    const submittedDate = new Date(jsonMeta.submittedDate);
    if (!submittedDate) {
        throw new InvalidInput(`Submitted date provided is not valid: ${jsonMeta.submittedDate}`);
    }

    const submittedUserId = jsonMeta.submittedUserId;
    if (!verifyUserId(submittedUserId)) {
        throw new InvalidInput(`Submitted user is not logged in`);
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