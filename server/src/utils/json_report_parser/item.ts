import { IllegalState, InvalidInput } from "exceptions/systemException";
import { getItemTypeFromValue, getLengthOfEnum } from '../utils';
import * as  _JsonUtils from "../report/json_report";
import * as _ReportDefs from '../../models/report'
import * as _JsonDefs from 'common/definitions/json_report';
import { hasNumType, checkAnswerType, hasSumType } from "../report/json_item";
import { isSumCorrect } from "../report/item";

export const getParserJsonToItem = (type: string): _ReportDefs.ItemParser => {
    const typeKey = getItemTypeFromValue(type);
    const parser = JsonToItem.typeToParser.get(typeKey!);
    if (!parser) {
        throw new InvalidInput(`Constructor for item type "${type}" is not yet supported`);
    }
    return parser!;
};

// >>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

namespace JsonToItem {
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

            const constructor = getParserJsonToItem(childType);
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

    export const typeToParser = new Map<_ReportDefs.ItemTypeKeys, _ReportDefs.ItemParser>();
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

};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
