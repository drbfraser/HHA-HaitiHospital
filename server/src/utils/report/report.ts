import { ReportDescriptor, ReportItems, ReportMeta } from "utils/definitions/report";

export const getReportMeta = (report: ReportDescriptor): ReportMeta => {
    return report.meta;
}

export const getReportItems = (report: ReportDescriptor): ReportItems => {
    return report.items;
}