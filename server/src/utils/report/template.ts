import { ItemAnswer, ItemType, ItemTypeKeys, ReportDescriptor, ReportItem } from "../definitions/report";
import { formatDateString, getItemTypeFromValue, getLengthOfEnum } from '../utils';
import { InvalidInput, IllegalState } from '../../exceptions/systemException';
import { TemplateDocument } from '../../models/template';
import { DepartmentId } from "../../common/definitions/departments";


interface TemplateReport extends ReportDescriptor{};
interface TemplateItem extends ReportItem{};
export type TemplateItems = Array<TemplateItem>;
type TemplateAnswer = ItemAnswer;

export const getTemplateDocumentFromReport = (report: ReportDescriptor): TemplateDocument => {
    const reportTemplate = getReportTemplate(report);
    const doc = buildTemplateDocument(reportTemplate);
    return doc;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const getReportTemplate = (report: ReportDescriptor): TemplateReport => {
    const emptyItems: TemplateItems = report.items.map((item) => {
        return getItemTemplate(item);
    })

    const template: TemplateReport = {
        meta: report.meta,
        items: emptyItems
    }
    return template;
}

const getItemTemplate = (item: ReportItem): TemplateItem => {
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

const buildTemplateDocument = (template: TemplateReport): TemplateDocument => {
    let newDoc: TemplateDocument = {
        id: template.meta.id,
        departmentId: DepartmentId[template.meta.departmentId].toString(),
        submittedByUserId: template.meta.submittedUserId,
        submittedDate: formatDateString(template.meta.submittedDate),
        items: template.items
    }
    return newDoc;
}

const mapToDefaultAnswer = new Map<ItemTypeKeys, string>();
const initToDefaultAnswerMap = (map: Map<ItemTypeKeys, string>) => {
    map.clear();
    map.set("N", "0");
    map.set("SUM", "0");
    //ToDo: fill out the rest
    const expectedSize = getLengthOfEnum(ItemType);
    if (map.size != expectedSize) {
        throw new IllegalState(`item - default answer map must have length ${expectedSize}`);
    }
}
initToDefaultAnswerMap(mapToDefaultAnswer);
const getDefaultAnswer = (item: ReportItem): string => {
    const typeKey = item.type;
    const defaultAnswer = mapToDefaultAnswer.get(typeKey);
    if (!defaultAnswer) {
        throw new InvalidInput(`Item of type ${item.type} does not support a default value`);
    }
    return defaultAnswer;
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
