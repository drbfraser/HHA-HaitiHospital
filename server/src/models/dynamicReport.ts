import { JsonReportDescriptor } from 'common/json_report';
import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';
import { ReportDescriptor } from 'utils/definitions/report';
import { parseToJson } from 'utils/parsers/json_report';

import { USER_MODEL_NAME } from './user';

const { Schema } = mongoose;

interface ReportWithInstanceMethods extends ReportDescriptor {
    toJson: () => JsonReportDescriptor
};

const reportSchema = new Schema<ReportWithInstanceMethods>({
  meta: {
      id: {
          type: String,
          required: true,
          default: randomUUID
      },
      departmentId: {
          type: String,
          required: true
      },
      createdDate: {
          type: Date,
          required: true
      },
      submittedDate: {
          type: Date,
          required: true,
          default: Date.now
      },
      submittedUserId: {
          type: String,
          required: true,
          ref: USER_MODEL_NAME
      }
  },
  items: { type: Object, required: true }
});

reportSchema.methods.toJson = function(): JsonReportDescriptor {
    const json = parseToJson(this);
    return json;
}

reportSchema.virtual('name').get(function () {
  const createdDate: Date = this.metadata.dateCreated;
  const year: number = createdDate.getFullYear();

  // getMonth() is 0 based
  const month: number = createdDate.getMonth() + 1;
  const name = `${year}-${month < 10 ? 0 : ''}${month}`;

  return name;
});

export const REPORT_MODEL_NAME = "Report";
export const ReportModel = mongoose.model<ReportWithInstanceMethods>(REPORT_MODEL_NAME, reportSchema);
