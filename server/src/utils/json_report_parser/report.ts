import { getDepartmentIdKeyFromValue } from 'common/definitions/departments';
import { JsonReportDescriptor, JsonReportMeta } from 'common/definitions/json_report';
import { InvalidInput } from 'exceptions/systemException';
import { ReportDescriptor, ReportItems, ReportMeta } from '../../models/report';
import * as _JsonUtils  from '../report/json_report';
import * as _ToItem from './item';

/**
 * A parser from a jsonReport to a ReportDescriptor. It uses an item parser corresponding to
 * each item type to parse items in jsonReport to actual items in ReportDescriptor.
 */
export const parseToReport = (jsonReport: JsonReportDescriptor): ReportDescriptor => {
    const meta: ReportMeta = parseToReportMeta(_JsonUtils.getReportMeta(jsonReport));
    const items: ReportItems = _JsonUtils.getReportItems(jsonReport).map((jsonItem) => {
        const itemConstructor = _ToItem.getParserJsonToItem(_JsonUtils.getItemType(jsonItem));
        return itemConstructor(jsonItem);
    })
  
    let report: ReportDescriptor = {meta: meta, 
        items:items,
    };
    return report;
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const verifyUserId = (uid: string): boolean => {
    // ToDo: actually verify submitted user id is logged in user
    return true;
}

const parseToReportMeta = (jsonMeta: JsonReportMeta) => {
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
