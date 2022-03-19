import { JsonReportItem } from "common/definitions/json_report";
import { IllegalState, InvalidInput } from "exceptions/systemException";
import { getEnumKeyByStringValue, getLengthOfEnum } from "./common";
import { JsonReport } from "./json_report";
import * as _ReportDefs from '../definitions/report'

export const getItemTypeFromValue = (type: string): _ReportDefs.ItemTypeKeys=> {
    const key = getEnumKeyByStringValue(_ReportDefs.ItemType, type);
    if (!key) {
        throw new InvalidInput(`Item of type: ${type} is not supported`);
    }
    return key!;
};

export const getConstructorForItemType = (type: string): _ReportDefs.ReportItemConstructor => {
    const typeKey = getItemTypeFromValue(type);
    const constructor = mapItemTypeToConstructor.get(typeKey!);
    if (!constructor) {
        throw new InvalidInput(`Constructor for item type "${type}" is not yet supported`);
    }
    return constructor!;
};


const numericReportItemConstructor: _ReportDefs.ReportItemConstructor = (jsonItem: JsonReportItem): _ReportDefs.ReportNItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!isANumericItem(jsonItem)) {
        throw new InvalidInput(`Constructor for numeric item but ${typeKey} was provided - item: ${jsonItem.description}`);
    }

    if (JsonReport.getItemAnswerLength(jsonItem) !== 1) {
        throw new InvalidInput(`Numeric item -"${jsonItem.description}" must have exactly 1 answer`);
    }
    const answerList = JsonReport.getAnswerList(jsonItem);
    JsonReport.validateAnswerType(answerList, typeKey!);

    let newItem: _ReportDefs.ReportNItem = {
        type: typeKey!,
        description: jsonItem.description,
        answer: answerList
    };

    return newItem;
}

const sumReportItemConstructor: _ReportDefs.ReportItemConstructor = (jsonItem: JsonReportItem): _ReportDefs.ReportSumItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!isASumItem(jsonItem)) {
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

        const isChildTypeValid = isANumericItem(jsonChild) || isASumItem(jsonChild); 
        const childType = JsonReport.getItemType(jsonChild);

        if (!(isChildTypeValid)) {
            throw new InvalidInput(`Item: ${jsonItem.description} does not support a child of type ${childType}`);
        }

        const constructor = getConstructorForItemType(childType);
        const child = constructor(jsonChild);
        return child;
    });

    const sum = Number(answerList[0]);
    if (!isSumCorrect(sum, children)) {
        throw new InvalidInput(`Sum item: ${jsonItem.description} does not add up`);
    };

    let newItem: _ReportDefs.ReportSumItem = {
        type: typeKey!,
        description: jsonItem.description,
        answer: answerList,
        numericItems: children
    };
    return newItem;
}

const mapItemTypeToConstructor = new Map<_ReportDefs.ItemTypeKeys, _ReportDefs.ReportItemConstructor>();
const initItemConstructorMap = (map: Map<_ReportDefs.ItemTypeKeys, _ReportDefs.ReportItemConstructor>) => {
    map.clear();
    map.set("N", numericReportItemConstructor);
    map.set("SUM", sumReportItemConstructor);
    const expectedSize = getLengthOfEnum(_ReportDefs.ItemType);
    if (map.size != expectedSize) {
        throw new IllegalState(`item type - constructor map must have length ${expectedSize}`);
    }
}
initItemConstructorMap(mapItemTypeToConstructor);

const isSumCorrect = (sum: Number, children: _ReportDefs.ReportNItem[]) => {
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

const isANumericItem = (jsonItem: JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (_ReportDefs.ItemType[typeKey!] !== _ReportDefs.ItemType.N) {
        return false;
    }
    return true;
}
const isASumItem = (jsonItem: JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (_ReportDefs.ItemType[typeKey!] !== _ReportDefs.ItemType.SUM) {
        return false;
    }
    return true;
}

const getAnswerList = (item: _ReportDefs.ReportItem): _ReportDefs.ItemAnswer => {
    return item.answer;
};