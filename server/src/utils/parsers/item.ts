import { IllegalState, InvalidInput } from 'exceptions/systemException';
import { getItemTypeFromValue, getLengthOfEnum } from '../utils';
import * as _JsonUtils from '../report/json_report';
import * as _ReportDefs from '../definitions/report';
import * as _JsonDefs from '@hha/common';
import {
  hasNumType,
  checkAnswerType,
  hasSumType,
  hasEqualType,
  hasGroupType,
} from '../report/json_item';
import { isSumCorrect } from '../report/item';

export const getParserJsonToItem = (type: string): JsonToItem.ItemParser => {
  const typeKey = getItemTypeFromValue(type);
  const parser = JsonToItem.getParserByType(typeKey!);
  return parser!;
};

export const getParserItemToJson = (typeKey: _JsonDefs.ItemTypeKeys): ItemToJson.ItemParser => {
  const parser = ItemToJson.getParserByType(typeKey);
  return parser!;
};

// >>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

namespace JsonToItem {
  export interface ItemParser {
    (jsonItem: _JsonDefs.JsonReportItem): _ReportDefs.ReportItem;
  }

  const parseToNumericItem: ItemParser = (
    jsonItem: _JsonDefs.JsonReportItem,
  ): _ReportDefs.ReportNumericItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!hasNumType(jsonItem)) {
      throw new InvalidInput(
        `Constructor for numeric item but ${jsonItem.type} was provided - item: ${jsonItem.description}`,
      );
    }

    if (_JsonUtils.getItemAnswerLength(jsonItem) !== 1) {
      throw new InvalidInput(`Numeric item -"${jsonItem.description}" must have exactly 1 answer`);
    }
    const answerList = _JsonUtils.getAnswerList(jsonItem);
    checkAnswerType(answerList, typeKey!);

    let newItem: _ReportDefs.ReportNumericItem = {
      type: typeKey,
      description: jsonItem.description,
      answer: answerList,
    };

    return newItem;
  };

  const parseNumericChildren = (
    childItem: _JsonDefs.JsonReportItem,
    parentItem: _JsonDefs.JsonReportItem,
  ): _ReportDefs.ReportItem => {
    const isChildTypeValid =
      hasNumType(childItem) || hasSumType(childItem) || hasGroupType(childItem);
    const childType = _JsonUtils.getItemType(childItem);
    if (!isChildTypeValid) {
      throw new InvalidInput(
        `Item: ${parentItem.description} does not support a child of type ${childType}`,
      );
    }

    const parser = getParserJsonToItem(childType);
    const child = parser(childItem);
    return child;
  };

  const parseToSumItem: ItemParser = (
    jsonItem: _JsonDefs.JsonReportItem,
  ): _ReportDefs.ReportSumItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!hasSumType(jsonItem)) {
      throw new InvalidInput(
        `Constructor for sum item but ${typeKey} was provided - item: ${jsonItem.description}`,
      );
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
    const children = jsonChildren.map((child) => {
      return parseNumericChildren(child, jsonItem);
    });

    const sum = Number(answerList[0]);
    if (!isSumCorrect(sum, children)) {
      throw new InvalidInput(`Sum item: ${jsonItem.description} does not add up`);
    }

    let newItem: _ReportDefs.ReportSumItem = {
      type: typeKey!,
      description: jsonItem.description,
      answer: answerList,
      children: children,
    };
    return newItem;
  };

  const parseToEqualItem: ItemParser = (
    jsonItem: _JsonDefs.JsonReportItem,
  ): _ReportDefs.ReportEqualItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!hasEqualType(jsonItem)) {
      throw new InvalidInput(
        `Constructor for equal item but ${typeKey} was provided - item: ${jsonItem.description}`,
      );
    }
    if (_JsonUtils.isInATable(jsonItem)) {
      throw new InvalidInput(`An Equal item should not be in a table`);
    }
    if (_JsonUtils.getItemAnswerLength(jsonItem) > 1) {
      throw new InvalidInput(`An Equal item: ${jsonItem.description} must have only 1 answer`);
    }

    const answerList = _JsonUtils.getAnswerList(jsonItem);
    checkAnswerType(answerList, typeKey!);

    const jsonChildren = _JsonUtils.getChildren(jsonItem);
    const children = jsonChildren.map((child) => {
      return parseNumericChildren(child, jsonItem);
    });

    const equalValue = Number(answerList[0]);
    const corrects = Array<Value>();
    const errors = Array<Value>();
    const checkChildren = (child: _ReportDefs.ReportItem): void => {
      const answer = Number(child.answer[0]);
      if (equalValue - answer == 0) corrects.push(Correct(0));
      else errors.push(Error(new ParsingError('')));
    };

    children.forEach(checkChildren);

    if (errors.length > 0)
      // Todo: report detailed list of errors here and throw.
      throw new InvalidInput(`Item: ${jsonItem.description} has invalid children`);

    let newItem: _ReportDefs.ReportEqualItem = {
      type: typeKey!,
      description: jsonItem.description,
      answer: answerList,
      children: children,
    };
    return newItem;
  };

  /* 
    These type definitions just a prototype for a type structure to support error handling.
    This is inspired on Scala's Either but it is no where near a complete implementation. 
    Future dev are free to use any implementation they see fit.

    The goal is to have the ability to parse over a collection of items and collect a list
    of all the errors.

    Ideally, our system should not throw exceptions since it is error prone. We should instead make it like a 'pipe' where 
    values are transformed from one to another. More detail here: 
    https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
    That said, this maybe hard to achieve in javascript
    */
  type Either<L, R> = { value: Array<R>; error: Array<L> };

  type Value = Either<ParsingError, number>;

  class ParsingError {
    protected message: string;

    constructor(msg: string) {
      this.message = msg;
    }

    toString(): string {
      return 'Paring Error: ' + this.message;
    }
  }

  function Correct(value: number): Value {
    return { value: [value], error: Array<any>() };
  }

  function Error<T>(error: ParsingError): Value {
    return { value: Array<any>(), error: [error] };
  }

  const parseToGroupItem: ItemParser = (
    jsonItem: _JsonDefs.JsonReportItem,
  ): _ReportDefs.ReportGroupItem => {
    const typeKey = getItemTypeFromValue(jsonItem.type);
    if (!hasGroupType(jsonItem)) {
      throw new InvalidInput(
        `Constructor for Group item but ${typeKey} was provided - item: ${jsonItem.description}`,
      );
    }
    if (_JsonUtils.isInATable(jsonItem)) {
      throw new InvalidInput(`A Group type item should not be in a table`);
    }

    const jsonChildren = _JsonUtils.getChildren(jsonItem);
    const children = jsonChildren.map((child) => {
      return parseNumericChildren(child, jsonItem);
    });

    const sum = children.map((item) => Number(item.answer[0])).reduce((prev, curr) => prev + curr);

    let newItem: _ReportDefs.ReportGroupItem = {
      type: typeKey!,
      description: jsonItem.description,
      answer: [sum.toString()],
      children: children,
    };

    return newItem;
  };

  type ParserByType = Map<_JsonDefs.ItemType, ItemParser>;
  const parserByType: ParserByType = new Map<_JsonDefs.ItemType, ItemParser>();
  const initParserByType = (map: Map<_JsonDefs.ItemType, ItemParser>) => {
    map.clear();
    map.set(_JsonDefs.ItemType.NUMERIC, parseToNumericItem);
    map.set(_JsonDefs.ItemType.SUM, parseToSumItem);
    map.set(_JsonDefs.ItemType.EQUAL, parseToEqualItem);
    map.set(_JsonDefs.ItemType.GROUP, parseToGroupItem);

    const expectedSize = getLengthOfEnum(_JsonDefs.ItemType);
    if (map.size != expectedSize) {
      throw new IllegalState(`item type - constructor map must have length ${expectedSize}`);
    }
  };
  initParserByType(parserByType);
  export const getParserByType = (typeKey: _JsonDefs.ItemTypeKeys): ItemParser => {
    const type = _JsonDefs.ItemType[typeKey];
    const parser = parserByType.get(type);
    if (!parser) {
      throw new InvalidInput(`Parser from json to item for item type ${type} is not supported`);
    }
    return parser!;
  };
}

namespace ItemToJson {
  export interface ItemParser {
    (item: _ReportDefs.ReportItem): _JsonDefs.JsonReportItem;
  }

  const baseParser: ItemParser = (item: _ReportDefs.ReportItem): _JsonDefs.JsonReportItem => {
    const jsonType: string = _JsonDefs.ItemType[item.type].toString();
    const jsonDescription: string = item.description;
    const answer: _JsonDefs.JsonItemAnswer = item.answer;
    const jsonAnswer: Array<_JsonDefs.JsonItemAnswer> = new Array<_JsonDefs.JsonItemAnswer>();
    jsonAnswer.push(answer);

    const jsonItem: _JsonDefs.JsonReportItem = {
      type: jsonType,
      description: jsonDescription,
      answer: jsonAnswer,
    };
    return jsonItem;
  };

  const parseFromNumericItem: ItemParser = (
    item: _ReportDefs.ReportNumericItem,
  ): _JsonDefs.JsonReportItem => {
    const jsonItem: _JsonDefs.JsonReportItem = baseParser(item);
    return jsonItem;
  };

  const parseFromSumItem: ItemParser = (
    item: _ReportDefs.ReportSumItem,
  ): _JsonDefs.JsonReportItem => {
    const base: _JsonDefs.JsonReportItem = baseParser(item);
    const jsonChildren: _JsonDefs.JsonItemChildren = item.children.map((child) => {
      const parser = getParserByType(child.type);
      return parser(child);
    });

    const jsonItem: _JsonDefs.JsonReportItem = { ...base, items: jsonChildren };
    return jsonItem;
  };

  type ParserByType = Map<_JsonDefs.ItemType, ItemParser>;
  const parserByType: ParserByType = new Map<_JsonDefs.ItemType, ItemParser>();
  const initParserByType = (map: ParserByType) => {
    map.set(_JsonDefs.ItemType.NUMERIC, parseFromNumericItem);
    map.set(_JsonDefs.ItemType.SUM, parseFromSumItem);
    map.set(_JsonDefs.ItemType.EQUAL, parseFromSumItem);
    map.set(_JsonDefs.ItemType.GROUP, parseFromSumItem);

    const expectedSize = getLengthOfEnum(_JsonDefs.ItemType);
    if (map.size != expectedSize) {
      throw new IllegalState(
        `Item type - parser map must have size of ${expectedSize} but have size ${map.size}`,
      );
    }
  };
  initParserByType(parserByType);

  export const getParserByType = (typeKey: _JsonDefs.ItemTypeKeys): ItemParser => {
    const type = _JsonDefs.ItemType[typeKey];
    const parser = parserByType.get(type);
    if (!parser) {
      throw new InvalidInput(`Parser from item to json for item type ${type} is not supported`);
    }
    return parser!;
  };
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
