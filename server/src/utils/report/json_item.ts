import { IllegalState, InvalidInput } from "exceptions/systemException";
import { getItemTypeFromValue, getLengthOfEnum } from "../utils";
import * as _ReportDefs from "../definitions/report";
import * as _JsonDefs from 'common/json_report';

export const hasNumType = (jsonItem: _JsonDefs.JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    return _JsonDefs.ItemType[typeKey] === _JsonDefs.ItemType.NUMERIC;
};
export const hasSumType = (jsonItem: _JsonDefs.JsonReportItem): boolean => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    return _JsonDefs.ItemType[typeKey] === _JsonDefs.ItemType.SUM;
};

export const checkAnswerType = (answer: _JsonDefs.JsonItemAnswer, itemType: _JsonDefs.ItemTypeKeys) => {
    const typeChecker = getAnswerTypeChecker(itemType);
    typeChecker(answer);
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>
const isBooleanValue = (str: string) => {
    const parsed = JSON.parse(str.toLowerCase());
    return typeof parsed === "boolean";
};
interface AnswerTypeChecker {
    (answer: _JsonDefs.JsonItemAnswer): void;
}
;
// a single cell answer may have more than 1 entry
const numericAnswerTypeChecker: AnswerTypeChecker = (answer: _JsonDefs.JsonItemAnswer) => {
    answer.forEach((answerEntry) => {
        if (isNaN(Number(answerEntry))) {
            throw new InvalidInput(`Item must have a numeric answer but got this ${answerEntry}`);
        }
    });
};
// a single cell answer may have more than 1 entry
const booleanAnswerTypeChecker: AnswerTypeChecker = (answer: _JsonDefs.JsonItemAnswer) => {
    answer.forEach((answerEntry) => {
        if (!isBooleanValue(answerEntry)) {
            throw new InvalidInput(`Item must have a boolean type answer but got this ${answerEntry}`);
        }
    });
};
// a single cell answer may have more than 1 entry
const stringAnswerTypeChecker: AnswerTypeChecker = (answer: _JsonDefs.JsonItemAnswer) => {
    // jsonReport only supports string value
    return true;
};
const mapItemTypeToAnswerTypeChecker = new Map<_JsonDefs.ItemType, AnswerTypeChecker>();
const initItemAnswerTypeCheckerMap = (map: Map<_JsonDefs.ItemType, AnswerTypeChecker>) => {
    map.clear();
    map.set(_JsonDefs.ItemType.NUMERIC, numericAnswerTypeChecker);
    map.set(_JsonDefs.ItemType.SUM, numericAnswerTypeChecker);
    //ToDo: fill out the rest later
    const expectedSize = getLengthOfEnum(_JsonDefs.ItemType);
    if (map.size != expectedSize) {
        throw new IllegalState(`item - answer type checker map must have length ${expectedSize}`);
    }
};
initItemAnswerTypeCheckerMap(mapItemTypeToAnswerTypeChecker);
const getAnswerTypeChecker = (typeKey: _JsonDefs.ItemTypeKeys): AnswerTypeChecker => {
    const type = _JsonDefs.ItemType[typeKey];
    const typeChecker = mapItemTypeToAnswerTypeChecker.get(type);
    if (!typeChecker) {
        throw new InvalidInput(`Item of type ${type} does not have an answer type checker`);
    }
    return typeChecker;
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<