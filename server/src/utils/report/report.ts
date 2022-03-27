import { ReportDescriptor, ReportItems, ReportMeta } from "utils/definitions/report";
import { TemplateItems, TemplateReport } from "utils/definitions/template";
import * as _ItemUtils from "./item";

export const getReportMeta = (report: ReportDescriptor): ReportMeta => {
    return report.meta;
}

export const getReportItems = (report: ReportDescriptor): ReportItems => {
    return report.items;
}

export const getTemplate = (report: ReportDescriptor): TemplateReport => {
    const emptyItems: TemplateItems = report.items.map((item) => {
        return _ItemUtils.getTemplate(item);
    })

    const template: TemplateReport = {
        meta: report.meta,
        items: emptyItems
    }
    return template;
}