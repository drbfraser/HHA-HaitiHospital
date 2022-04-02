import { verifyDeptId } from 'common/definitions/departments';
import { JsonReportDescriptor, JsonReportMeta } from 'common/json_report';
import { InvalidInput } from 'exceptions/systemException';
import { ReportDescriptor, ReportItems, ReportMeta } from "../definitions/report";
import * as _JsonUtils  from '../report/json_report';
import * as _ItemParser from './item';

/**
 * A parser from a jsonReport to a ReportDescriptor. It uses an item parser corresponding to
 * each item type to parse items in jsonReport to actual items in ReportDescriptor.
 */
export const parseToReport = (jsonReport: JsonReportDescriptor): ReportDescriptor => {
    const meta: ReportMeta = parseToReportMeta(_JsonUtils.getReportMeta(jsonReport));
    const items: ReportItems = _JsonUtils.getReportItems(jsonReport).map((jsonItem) => {
        const itemConstructor = _ItemParser.getParserJsonToItem(_JsonUtils.getItemType(jsonItem));
        return itemConstructor(jsonItem);
    })
  
    let report: ReportDescriptor = {meta: meta, 
        items:items,
    };
    return report;
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const parseToReportMeta = (jsonMeta: JsonReportMeta) => {
    const isValid: boolean = verifyDeptId(jsonMeta.department.id);
    if (!isValid) {
        throw new InvalidInput(`Department Id: ${jsonMeta.department.id} is not valid`);
    }

    let submittedDate: Date = new Date();
    if (jsonMeta.submittedDate) {
        submittedDate = new Date(jsonMeta.submittedDate!);
        if (!submittedDate) {
            throw new InvalidInput(`Submitted date provided is not valid: ${jsonMeta.submittedDate}`);
        }
    }
    
    let submittedUserId: string = "";
    if (jsonMeta.submittedUserId) {
        submittedUserId = jsonMeta.submittedUserId;

    }

    let meta: ReportMeta = {
        id: jsonMeta.id,
        departmentId: jsonMeta.department.id,
        submittedDate: submittedDate,
        submittedUserId: submittedUserId
    };
    return meta;
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
