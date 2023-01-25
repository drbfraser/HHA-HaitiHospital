import { SystemException } from 'exceptions/systemException';
import { TemplateCollection } from 'models/old_template';
import { User } from 'models/user';
import { ReportDescriptor, ReportItems } from 'utils/definitions/report';
import Departments from 'utils/departments';
import { generateNewReportFromTemplate } from 'utils/parsers/old_template';
import { generateUuid } from 'utils/utils';

export const getReportItems = (report: ReportDescriptor): ReportItems => {
  return report.items;
};

export const updateSubmissionDate = (report: ReportDescriptor) => {
  report.submittedDate = new Date();
};

export const setSubmittor = (report: ReportDescriptor, user: User) => {
  report.submittedUserId = user._id!;
};

export const setReportMonth = (report: ReportDescriptor, date: Date) => {
  report.reportMonth = date;
};

export const generateReportForMonth = async (
  deptId: string,
  reportMonth: Date,
  requestor: User,
): Promise<ReportDescriptor> => {
  const deptValid = await Departments.Database.validateDeptId(deptId);
  if (!deptValid) {
    throw new SystemException(`Department id ${deptId} is invalid`);
  }

  const deptTemplate = await TemplateCollection.findOne({ departmentId: deptId }).lean();
  if (!deptTemplate) {
    const newEmptyReport: ReportDescriptor = {
      id: generateUuid(),
      departmentId: deptId,
      submittedDate: new Date(),
      submittedUserId: requestor._id!,
      reportMonth: reportMonth,
      items: [],
    };
    return newEmptyReport;
  } else {
    const newReport: ReportDescriptor = generateNewReportFromTemplate(deptTemplate);
    updateSubmissionDate(newReport);
    setSubmittor(newReport, requestor);
    setReportMonth(newReport, reportMonth);
    return newReport;
  }
};
