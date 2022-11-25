import { ObjectSerializer } from '@hha/common';
import { IReport } from 'models/report';
import { ITemplate } from 'models/template';

export const serializeReportObject = (report: IReport) => {
  return {
    ...report,
    reportObject: ObjectSerializer.getObjectSerializer().serialize(report.reportObject)
  };
};

export const serializeTemplateReportObject = (template: ITemplate) => {
  return {
    ...template,
    reportObject: ObjectSerializer.getObjectSerializer().serialize(template.reportObject)
  };
};
