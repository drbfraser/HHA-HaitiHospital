import {
  ItemAnswer,
  ReportDescriptor,
  ReportEqualItem,
  ReportItem,
  ReportItems,
  ReportNumericItem,
  ReportSumItem,
  ReportGroupItem,
} from '../definitions/report';
import { generateUuid, getLengthOfEnum } from '../utils';
import { InvalidInput, IllegalState } from 'exceptions/systemException';
import { Template } from 'models/old_template';
import { ItemType, ItemTypeKeys } from '@hha/common';

interface TemplateItem extends ReportItem {}
interface TemplateNItem extends ReportNumericItem {}
interface TemplateSumItem extends ReportSumItem {}
interface TemplateEqualItem extends ReportEqualItem {}

interface TemplateReport extends ReportDescriptor {}
interface TemplateItem extends ReportItem {}
interface TemplateNItem extends ReportNumericItem {}
interface TemplateSumItem extends ReportSumItem {}
interface TemplateEqualItem extends ReportEqualItem {}
interface TemplateGroupItem extends ReportGroupItem {}

export type TemplateItems = Array<TemplateItem>;
type TemplateAnswer = ItemAnswer;

export const fromReportToTemplate = (report: ReportDescriptor): Template => {
  const emptyItems = ItemToTemplate.getEmptyItems(report);

  let template: Template = {
    id: report.id,
    departmentId: report.departmentId,
    submittedByUserId: report.submittedUserId,
    submittedBy: report.submittedBy,
    submittedDate: report.submittedDate,
    items: emptyItems,
    isDraft: report.isDraft,
  };

  return template;
};

export const generateNewTemplate = (report: ReportDescriptor): Template => {
  let newDoc: Template = fromReportToTemplate(report);
  newDoc.id = generateUuid();
  return newDoc;
};

export const fromTemplateToReport = (doc: Template): ReportDescriptor => {
  let report: ReportDescriptor;
  let meta = {
    id: doc.id,
    departmentId: doc.departmentId,
    submittedDate: doc.submittedDate,
    submittedUserId: doc.submittedByUserId,
    submittedBy: doc.submittedBy,
    isDraft: doc.isDraft,
  };
  let items: ReportItems = doc.items;
  return (report = { ...meta, items: items });
};

export const generateNewReportFromTemplate = (doc: Template): ReportDescriptor => {
  let newReport = fromTemplateToReport(doc);
  newReport.id = generateUuid();
  return newReport;
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
namespace ItemToTemplate {
  export const getEmptyItems = (report: ReportDescriptor): TemplateItems => {
    // const emptyItems: TemplateItems = report.items
    //   .filter(item => ItemType.)
    //   .map((item) => {
    //   const templateParser: ItemTemplateParser  = getParserForType(
    //     item.type,
    //   );
    //   return templateParser(item);
    // });

    // unused right now, commented due to TS migration
    return [];
  };

  const mapToDefaultAnswer = new Map<ItemType, string>();
  const initToDefaultAnswerMap = (map: Map<ItemType, string>) => {
    map.clear();
    map.set(ItemType.NUMERIC, '0');
    map.set(ItemType.SUM, '0');
    map.set(ItemType.EQUAL, '0');
    map.set(ItemType.GROUP, '0');
    //ToDo: fill out the rest
    const expectedSize = getLengthOfEnum(ItemType);
    if (map.size != expectedSize) {
      throw new IllegalState(`item - default answer map must have length ${expectedSize}`);
    }
  };
  initToDefaultAnswerMap(mapToDefaultAnswer);
  const getDefaultAnswer = (item: ReportItem): string => {
    const type = ItemType[item.type];
    const defaultAnswer = mapToDefaultAnswer.get(type);
    if (!defaultAnswer) {
      throw new InvalidInput(`Item of type ${type} does not support a default value`);
    }
    return defaultAnswer;
  };

  interface ItemTemplateParser {
    (item: ReportItem): TemplateItem;
  }

  interface SumItemTemplateParser {
    (item: ReportSumItem): TemplateSumItem;
  }

  const baseItemParser = (item: ReportItem): TemplateItem => {
    let answer: TemplateAnswer;
    answer = item.answer.map(() => {
      return getDefaultAnswer(item);
    });

    const emptyItem: TemplateItem = {
      type: item.type,
      description: item.description,
      answer: answer,
    };
    return emptyItem;
  };
  const numericParser: ItemTemplateParser = (item: ReportNumericItem): TemplateNItem => {
    let base: TemplateItem = baseItemParser(item);
    let numItem: TemplateNItem = base;
    return numItem;
  };

  const sumParser: SumItemTemplateParser = (item: ReportSumItem): TemplateSumItem => {
    let base: TemplateItem = baseItemParser(item);
    let children: TemplateItem[] = item.children
      .filter((child) => child.type == ItemType.SUM.toString())
      .map((child) => {
        const parser = getParserForType((child as ReportSumItem).type);
        return parser(child as ReportSumItem);
      });
    let sumItem: TemplateSumItem = { ...base, children: children };
    return sumItem;
  };

  const equalParser: SumItemTemplateParser = (item: ReportEqualItem): TemplateEqualItem => {
    return sumParser(item) as TemplateEqualItem;
  };

  const groupParser: SumItemTemplateParser = (item: ReportEqualItem): TemplateEqualItem => {
    return sumParser(item) as TemplateGroupItem;
  };

  const typeToParser = new Map<ItemType, ItemTemplateParser | SumItemTemplateParser>();
  const initTypeToParserMap = (map: Map<ItemType, ItemTemplateParser | SumItemTemplateParser>) => {
    map.clear();
    map.set(ItemType.NUMERIC, numericParser);
    map.set(ItemType.SUM, sumParser);
    map.set(ItemType.EQUAL, equalParser);
    map.set(ItemType.GROUP, equalParser);
    //ToDo: fill out the rest
    const expectedSize = getLengthOfEnum(ItemType);
    if (map.size != expectedSize) {
      throw new IllegalState(`item - default answer map must have length ${expectedSize}`);
    }
  };
  initTypeToParserMap(typeToParser);
  const getParserForType = (typeKey: ItemTypeKeys): ItemTemplateParser | SumItemTemplateParser => {
    const type = ItemType[typeKey];
    const parser = typeToParser.get(type);
    if (!parser) {
      throw new InvalidInput(`Item of type ${type} does not have template parser`);
    }
    return parser;
  };
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
