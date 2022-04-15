import Departments from '../departments';
import { JsonReportDescriptor, JsonReportItems } from 'common/json_report';
import { ReportDescriptor, ReportItems } from 'utils/definitions/report';
import { formatDateString } from 'utils/utils';
import { getParserItemToJson } from './item';

export const parseToJson = async (report: ReportDescriptor) => {
  const id: string = report.id;
  const departmentId: string = report.departmentId;
  const submittedDate: string = formatDateString(report.submittedDate);
  const submittedUserId: string = report.submittedUserId;
  const items: JsonReportItems = parseToJsonItems(report.items);

  const jsonReport: JsonReportDescriptor = {
    meta: {
        id: id,
        department: {
            id: departmentId,
            name: await Departments.Database.getDeptNameById(departmentId)
        },
        submittedDate: submittedDate,
        submittedUserId: submittedUserId
    },
    items: items
  };
  return jsonReport;
};

// >>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>
const parseToJsonItems = (items: ReportItems): JsonReportItems => {
  const jsonItems: JsonReportItems = items.map((item) => {
    const parser: Function = getParserItemToJson(item.type);
    return parser(item);
  });
  return jsonItems;
};

// <<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<
