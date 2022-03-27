import { IllegalState, InvalidInput } from "exceptions/systemException";
import { getItemTypeFromValue, getLengthOfEnum } from '../utils';
import * as  _JsonUtils from "../report/json_report";
import * as _ReportDefs from '../../models/template'
import * as ItemType from "../definitions/report";
import * as _JsonDefs from 'common/definitions/json_report';
import { hasNumType, checkAnswerType, hasSumType } from "../report/json_item";
import { isSumCorrect } from "../report/item";

export const getParserJsonToItem = (type: string): JsonToItem.ItemParser => {
    const typeKey = getItemTypeFromValue(type);
    const parser = JsonToItem.getParserByType(typeKey!);
    return parser!;
};

export const getParserItemToJson = (typeKey: _ReportDefs.ItemTypeKeys) : ItemToJson.ItemParser => {
    const parser = ItemToJson.getParserByType(typeKey);
    return parser!;
};

// >>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


namespace JsonToItem {
    export interface ItemParser {
        (jsonItem: _JsonDefs.JsonReportItem): _ReportDefs.ReportItem;    
    }

    const parseToNumericItem: ItemParser = (jsonItem: _JsonDefs.JsonReportItem): _ReportDefs.ReportNItem => {
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

    const parseToSumItem: ItemParser = (jsonItem: _JsonDefs.JsonReportItem): _ReportDefs.ReportSumItem => {
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

            const parser = getParserJsonToItem(childType);
            const child = parser(jsonChild);
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
            children: children
        };
        return newItem;
    }

    export type ParserByType = Map<_ReportDefs.ItemTypeKeys, ItemParser>
    const parserByType: ParserByType = new Map<_ReportDefs.ItemTypeKeys, ItemParser>();
    const initParserByType = (map: Map<_ReportDefs.ItemTypeKeys, ItemParser>) => {
        map.clear();
        map.set("N", parseToNumericItem);
        map.set("SUM", parseToSumItem);
        const expectedSize = getLengthOfEnum(ItemType.ItemType);
        if (map.size != expectedSize) {
            throw new IllegalState(`item type - constructor map must have length ${expectedSize}`);
        }
    }
    initParserByType(parserByType);

    export const getParserByType = (typeKey: _ReportDefs.ItemTypeKeys): ItemParser => {
        const parser = parserByType.get(typeKey);
        if (!parser) {
            throw new InvalidInput(`Parser from json to item for item type ${typeKey} is not supported`);
        }
        return parser!;
    }
};

namespace ItemToJson {
    export interface ItemParser {
        (item: _ReportDefs.ReportItem): _JsonDefs.JsonReportItem;
    }

    const parseFromItem: ItemParser = (item: _ReportDefs.ReportItem): _JsonDefs.JsonReportItem => {
        const jsonType: string = ItemType.ItemType[item.type].toString();
        const jsonDescription: string = item.description;
        const answer: _JsonDefs.JsonItemAnswer = item.answer;
        const jsonAnswer: Array<_JsonDefs.JsonItemAnswer> = new Array<_JsonDefs.JsonItemAnswer>();
        jsonAnswer.push(answer);

        const jsonItem: _JsonDefs.JsonReportItem = {
            type: jsonType,
            description: jsonDescription,
            answer: jsonAnswer
        }
        return jsonItem;
    }

    const parseFromNumericItem: ItemParser = (item: _ReportDefs.ReportNItem): _JsonDefs.JsonReportItem => {
        const jsonItem: _JsonDefs.JsonReportItem = parseFromItem(item);
        return jsonItem;
    }

    const parseFromSumItem: ItemParser = (item: _ReportDefs.ReportSumItem): _JsonDefs.JsonReportItem => {
        const base: _JsonDefs.JsonReportItem = parseFromItem(item);
        const jsonChildren: _JsonDefs.JsonItemChildren = item.children.map((child) => {
            const parser = getParserByType(child.type);
            return parser(child);
        });

        const jsonItem: _JsonDefs.JsonReportItem = {
            type: base.type,
            description: base.description,
            answer: base.answer,
            items: jsonChildren
        };

        return jsonItem;
    }

    export type ParserByType = Map<_ReportDefs.ItemTypeKeys, ItemParser>
    const parserByType: ParserByType = new Map<_ReportDefs.ItemTypeKeys, ItemParser>();
    const initParserByType = (map: ParserByType) => {
        map.set("N", parseFromNumericItem);
        map.set("SUM", parseFromSumItem);

        const expectedSize = getLengthOfEnum(ItemType.ItemType); 
        if (map.size != expectedSize) {
            throw new IllegalState(`Item type - parser map must have size of ${expectedSize} but have size ${map.size}`);
        }
    }
    initParserByType(parserByType);

    export const getParserByType = (typeKey: _ReportDefs.ItemTypeKeys): ItemParser => {

        const parser = parserByType.get(typeKey);
        if (!parser) {
            throw new InvalidInput(`Parser from item to json for item type ${typeKey} is not supported`);
        }
        return parser!;
    }
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
