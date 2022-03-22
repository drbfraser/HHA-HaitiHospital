import { ReportDescriptor, ReportItems, ReportMeta } from "models/report"

export const getReportMeta = (report: ReportDescriptor): ReportMeta => {
    return report.meta;
}

export const getReportItems = (report: ReportDescriptor): ReportItems => {
    return report.items;
}
