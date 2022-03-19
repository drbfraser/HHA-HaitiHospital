import { DepartmentId } from "common/definitions/departments";
import { JsonReportDescriptor, JsonReportItem, JsonReportItems, JsonReportMeta } from "common/definitions/json_report";
import { ReportDescriptor, ReportItems, ReportMeta } from "models/report";
import * as _ReportUtils from "../report/report";

export const parseToJson = (report: ReportDescriptor) => {
    const meta: JsonReportMeta = parseToJsonMeta(_ReportUtils.getReportMeta(report));
    const items: JsonReportItems = parseToJsonItems(_ReportUtils.getReportItems(report));
    const jsonReport: JsonReportDescriptor = {
        meta: meta,
        items: items
    };
    return jsonReport;
}

// >>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>

const parseToJsonMeta = (meta: ReportMeta): JsonReportMeta => {
    const id: string = meta.id.toString();
    const departmentId: string = DepartmentId[meta.departmentId].toString();
    const submittedDate: string = meta.submittedDate.toString();
    const submittedUserId: string = meta.submittedUserId;
    
    const jsonMeta: JsonReportMeta = {
        id: id,
        departmentId: departmentId,
        submittedDate: submittedDate,
        submittedUserId: submittedUserId
    }

    return jsonMeta;
}

const parseToJsonItems = (items: ReportItems): JsonReportItems => {
    const items: JsonReportItems = items.map((item) => {

    })
}

// <<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<