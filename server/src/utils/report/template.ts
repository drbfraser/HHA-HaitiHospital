import { ItemAnswer, ItemType, ItemTypeKeys, ReportDescriptor, ReportItem, ReportItems, ReportMeta, ReportNItem, ReportSumItem } from "../definitions/report";
import { formatDateString, generateUuid, getLengthOfEnum } from '../utils';
import { InvalidInput, IllegalState } from '../../exceptions/systemException';
import { TemplateDocument } from '../../models/template';
import { DepartmentId } from "../../common/definitions/departments";


interface TemplateReport extends ReportDescriptor{};
interface TemplateItem extends ReportItem{};
interface TemplateNItem extends ReportNItem{};
interface TemplateSumItem extends ReportSumItem{};
export type TemplateItems = Array<TemplateItem>;
type TemplateAnswer = ItemAnswer;

export const getTemplateDocumentFromReport = (report: ReportDescriptor): TemplateDocument => {
    const reportTemplate = ItemToTemplate.getReportTemplate(report);
    const doc = ItemToTemplate.buildTemplateDocument(reportTemplate);
    return doc;
}

export const generateReportFromDocument = (doc: TemplateDocument): ReportDescriptor => {
    let report: ReportDescriptor;
    let meta: ReportMeta = {
        id: doc.id,
        departmentId: DepartmentId[doc.departmentId].toString(),
        submittedDate: new Date(doc.submittedDate),
        submittedUserId: doc.submittedByUserId
    }
    let items: ReportItems = doc.items;
    return report = {
        meta: meta,
        items: items
    }
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
namespace ItemToTemplate {
export const getReportTemplate = (report: ReportDescriptor): TemplateReport => {
    const emptyItems: TemplateItems = report.items.map((item) => {
        const templateParser: ItemTemplateParser = getParserForType(item.type);
        return templateParser(item);
    })

    const template: TemplateReport = {
        meta: report.meta,
        items: emptyItems
    }
    return template;
}

export const buildTemplateDocument = (template: TemplateReport): TemplateDocument => {
    let newDoc: TemplateDocument = {
        id: template.meta.id,
        departmentId: DepartmentId[template.meta.departmentId].toString(),
        submittedByUserId: template.meta.submittedUserId,
        submittedDate: formatDateString(template.meta.submittedDate),
        items: template.items
    }
    return newDoc;
}

const mapToDefaultAnswer = new Map<ItemType, string>();
const initToDefaultAnswerMap = (map: Map<ItemType, string>) => {
    map.clear();
    map.set(ItemType.NUMERIC, "0");
    map.set(ItemType.SUM, "0");
    //ToDo: fill out the rest
    const expectedSize = getLengthOfEnum(ItemType);
    if (map.size != expectedSize) {
        throw new IllegalState(`item - default answer map must have length ${expectedSize}`);
    }
}
initToDefaultAnswerMap(mapToDefaultAnswer);
const getDefaultAnswer = (item: ReportItem): string => {
    const type = ItemType[item.type];
    const defaultAnswer = mapToDefaultAnswer.get(type);
    if (!defaultAnswer) {
        throw new InvalidInput(`Item of type ${type} does not support a default value`);
    }
    return defaultAnswer;
}

interface ItemTemplateParser {
    (item: ReportItem): TemplateItem
}
const baseItemParser = (item: ReportItem): TemplateItem => {
    let answer: TemplateAnswer;
    answer = item.answer.map((element) => {
        return getDefaultAnswer(item);
    });

    const emptyItem: TemplateItem = {
        type: item.type,
        description: item.description,
        answer: answer
    }
    return emptyItem;
}
const numericParser: ItemTemplateParser = (item: ReportNItem): TemplateNItem => {
    let base: TemplateItem = baseItemParser(item);
    let numItem: TemplateNItem = base;
    return numItem;
}
const sumParser: ItemTemplateParser = (item: ReportSumItem): TemplateSumItem => {
    let base: TemplateItem = baseItemParser(item);
    let children: TemplateItem[] = item.children.map((child) => {
        const parser = getParserForType(child.type);
        return parser(child);
    })
    let sumItem: TemplateSumItem = {...base, children: children};
    return sumItem;
}

const typeToParser = new Map<ItemType, ItemTemplateParser>();
const initTypeToParserMap = (map: Map<ItemType, ItemTemplateParser>) => {
    map.clear();
    map.set(ItemType.NUMERIC, numericParser);
    map.set(ItemType.SUM, sumParser);
    //ToDo: fill out the rest
    const expectedSize = getLengthOfEnum(ItemType);
    if (map.size != expectedSize) {
        throw new IllegalState(`item - default answer map must have length ${expectedSize}`);
    }
}
initTypeToParserMap(typeToParser);
const getParserForType = (typeKey: ItemTypeKeys): ItemTemplateParser => {
    const type = ItemType[typeKey];
    const parser = typeToParser.get(type);
    if (!parser) {
        throw new InvalidInput(`Item of type ${type} does not have template parser`);
    }
    return parser;
}
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
