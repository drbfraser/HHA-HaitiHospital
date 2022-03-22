import { IllegalState, InvalidInput } from "exceptions/systemException";
import { getItemTypeFromValue, getLengthOfEnum } from "./common";
import * as  _JsonUtils from "../json_report";
import * as _ReportDefs from '../../models/report'
import * as _JsonDefs from 'common/definitions/json_report';

export const getParserToItem = (type: string): _ReportDefs.ItemParser => {
    const typeKey = getItemTypeFromValue(type);
    const parser = typeToParser.get(typeKey!);
    if (!parser) {
        throw new InvalidInput(`Constructor for item type "${type}" is not yet supported`);
    }
    return parser!;
};

// >>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const parseToNumericItem: _ReportDefs.ItemParser = (jsonItem: _JsonDefs.JsonReportItem): _ReportDefs.ReportNItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!hasNumType(jsonItem)) {
        throw new InvalidInput(`Constructor for numeric item but ${typeKey} was provided - item: ${jsonItem.description}`);
    }

    if (_JsonUtils.getItemAnswerLength(jsonItem) !== 1) {
        throw new InvalidInput(`Numeric item -"${jsonItem.description}" must have exactly 1 answer`);
    }
    const answerList = _JsonUtils.getAnswerList(jsonItem);
    checkAnswerType(answerList, typeKey!);

    let newItem: _ReportDefs.ReportNItem = {
        type: typeKey!,
        description: jsonItem.description,
        answer: answerList
    };

    return newItem;
}

const parseToSumItem: _ReportDefs.ItemParser = (jsonItem: _JsonDefs.JsonReportItem): _ReportDefs.ReportSumItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!hasSumType(jsonItem)) {
        throw new InvalidInput(`Constructor for sum item but ${typeKey} was provided - item: ${jsonItem.description}`);
    }
    if (_JsonUtils.isInATable(jsonItem)) {
        throw new InvalidInput(`A Sum type item should not be in a table`);
    }
    if (_JsonUtils.getItemAnswerLength(jsonItem) > 1) {
        throw new InvalidInput(`A Sum item: ${jsonItem.description} must have only 1 answer`);
    }

    const answerList = _JsonUtils.getAnswerList(jsonItem);
    checkAnswerType(answerList, typeKey!);

    const jsonChildren = _JsonUtils.getChildren(jsonItem);
    const children = jsonChildren.map((jsonChild) => {

        const isChildTypeValid = hasNumType(jsonChild) || hasSumType(jsonChild); 
        const childType = _JsonUtils.getItemType(jsonChild);

        if (!(isChildTypeValid)) {
            throw new InvalidInput(`Item: ${jsonItem.description} does not support a child of type ${childType}`);
        }

        const constructor = getParserToItem(childType);
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

const typeToParser = new Map<_ReportDefs.ItemTypeKeys, _ReportDefs.ItemParser>();
const initTypeToParserMap = (map: Map<_ReportDefs.ItemTypeKeys, _ReportDefs.ItemParser>) => {
    map.clear();
    map.set("N", parseToNumericItem);
    map.set("SUM", parseToSumItem);
    const expectedSize = getLengthOfEnum(_ReportDefs.ItemType);
    if (map.size != expectedSize) {
        throw new IllegalState(`item type - constructor map must have length ${expectedSize}`);
    }
}
initTypeToParserMap(typeToParser);

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

const hasNumType = (jsonItem: _JsonDefs.JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (_ReportDefs.ItemType[typeKey!] !== _ReportDefs.ItemType.N) {
        return false;
    }
    return true;
};

const hasSumType = (jsonItem: _JsonDefs.JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (_ReportDefs.ItemType[typeKey!] !== _ReportDefs.ItemType.SUM) {
        return false;
    }
    return true;
};

const getAnswerList = (item: _ReportDefs.ReportItem): _ReportDefs.ItemAnswer => {
    return item.answer;
};

const checkAnswerType = (answer: _JsonDefs.JsonItemAnswer, itemType: _ReportDefs.ItemTypeKeys) => {
    const typeChecker = getAnswerTypeChecker(itemType);
    typeChecker(answer);
}

const isBooleanValue = (str: string) => {
    const parsed = JSON.parse(str.toLowerCase());
    if (parsed === true || parsed === false) {
        return true;
    }
    
    return false;
}

interface AnswerTypeChecker {
    (answer: _JsonDefs.JsonItemAnswer): void
};
// a single cell answer may have more than 1 entry
const numericAnswerTypeChecker: AnswerTypeChecker = (answer: _JsonDefs.JsonItemAnswer) => {
    answer.forEach((answerEntry) => {
        if (isNaN(Number(answerEntry))) {
            throw new InvalidInput(`Item must have a numeric answer but got this ${answerEntry}`);
        }
    })
}
// a single cell answer may have more than 1 entry
const booleanAnswerTypeChecker: AnswerTypeChecker = (answer: _JsonDefs.JsonItemAnswer) => {
    answer.forEach((answerEntry) => {
        if (!isBooleanValue(answerEntry)) {
            throw new InvalidInput(`Item must have a boolean type answer but got this ${answerEntry}`);
        }
    })
}
// a single cell answer may have more than 1 entry
const stringAnswerTypeChecker: AnswerTypeChecker = (answer: _JsonDefs.JsonItemAnswer) => {
    // jsonReport only supports string value
    return true;
}

const mapItemTypeToAnswerTypeChecker = new Map<_ReportDefs.ItemTypeKeys, AnswerTypeChecker>();
const initItemAnswerTypeCheckerMap = (map: Map<_ReportDefs.ItemTypeKeys, AnswerTypeChecker>) => {
    map.clear();
    map.set("N", numericAnswerTypeChecker);
    map.set("SUM", numericAnswerTypeChecker);
    //ToDo: fill out the rest later
    const expectedSize = getLengthOfEnum(_ReportDefs.ItemType);
    if (map.size != expectedSize) {
        throw new IllegalState(`item - answer type checker map must have length ${expectedSize}`);
    }
}
initItemAnswerTypeCheckerMap(mapItemTypeToAnswerTypeChecker);

const getAnswerTypeChecker = (typeKey: _ReportDefs.ItemTypeKeys): AnswerTypeChecker => {
    const typeChecker = mapItemTypeToAnswerTypeChecker.get(typeKey);
    if (!typeChecker) {
        throw new InvalidInput(`Item of type ${typeKey} does not have an answer type checker`);
    }
    return typeChecker;
}
