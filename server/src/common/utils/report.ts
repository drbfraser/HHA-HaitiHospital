import { getDepartmentIdKeyFromValue } from 'common/definitions/departments';
import { JsonReportDescriptor, JsonReportMeta } from 'common/definitions/json_report';
import { InvalidInput } from 'exceptions/systemException';
import { ReportDescriptor, ReportItems, ReportMeta } from '../definitions/report';
import { JsonReport } from './json_report';
import * as _Item from './item';

export const reportConstructor = (jsonReport: JsonReportDescriptor): ReportDescriptor => {
    const meta: ReportMeta = reportMetaConstructor(JsonReport.getReportMeta(jsonReport));
    const items: ReportItems = JsonReport.getReportItems(jsonReport).map((jsonItem) => {
        const itemConstructor = _Item.getConstructorForItemType(JsonReport.getItemType(jsonItem));
        return itemConstructor(jsonItem);
    })
  
    let report: ReportDescriptor = {meta: meta, 
        items:items,
    };
    return report;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const verifyUserId = (uid: string): boolean => {
    // ToDo: actually verify submitted user id is logged in user
    return true;
}

const reportMetaConstructor = (jsonMeta: JsonReportMeta) => {
    const deptIdKey = getDepartmentIdKeyFromValue(jsonMeta.departmentId);
    if (!deptIdKey) {
        throw new InvalidInput(`Department Id: ${jsonMeta.departmentId} is not valid`);
    }

    const submittedDate = new Date(jsonMeta.submittedDate);
    if (!submittedDate) {
        throw new InvalidInput(`Submitted date provided is not valid: ${jsonMeta.submittedDate}`);
    }

    const submittedUserId = jsonMeta.submittedUserId;
    if (!verifyUserId(submittedUserId)) {
        throw new InvalidInput(`Submitted user is not logged in`);
    }

    let meta: ReportMeta = {
        id: jsonMeta.id,
        departmentId: deptIdKey,
        submittedDate: submittedDate,
        submittedUserId: submittedUserId
    };
    return meta;
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<