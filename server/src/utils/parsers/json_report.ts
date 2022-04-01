import { getDeptNameFromId } from "common/definitions/departments";
import { JsonReportDescriptor, JsonReportItems, JsonReportMeta } from "common/definitions/json_report";
import { ReportDescriptor, ReportItems, ReportMeta } from "utils/definitions/report";
import { formatDateString } from "utils/utils";
import * as _ReportUtils from "../report/report";
import { getParserItemToJson } from "./item";

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
    const id: string = meta.id;
    const departmentId: string = meta.departmentId;
    const submittedDate: string = formatDateString(meta.submittedDate);
    const submittedUserId: string = meta.submittedUserId;
    
    const jsonMeta: JsonReportMeta = {
        id: id,
        department: {
            id: departmentId,
            name: getDeptNameFromId(departmentId)
        },
        submittedDate: submittedDate,
        submittedUserId: submittedUserId
    }

    return jsonMeta;
}

const parseToJsonItems = (items: ReportItems): JsonReportItems => {
    const jsonItems: JsonReportItems = items.map((item) => {
        const parser: Function = getParserItemToJson(item.type);
        return parser(item);
    });
    return jsonItems;
}

// <<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<