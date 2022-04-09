import { JsonReportDescriptor } from 'common/json_report';
import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';
import { ReportDescriptor } from 'utils/definitions/report';
import { verifyDeptId } from 'utils/departments';
import { parseToJson } from 'utils/parsers/json_report';

import UserModel, { USER_MODEL_NAME } from './user';

const { Schema } = mongoose;

interface ReportWithInstanceMethods extends ReportDescriptor {
    toJson: () => JsonReportDescriptor
};

const PATH_TO_ID = 'id';
const PATH_TO_DEPARTMENT_ID = 'departmentId';
const PATH_TO_USER_ID = 'submittedUserId';
const PATH_TO_REPORT_MONTH = 'reportMonth';

const reportSchema = new Schema<ReportWithInstanceMethods>({
    id: {
        type: String,
        required: true,
        default: randomUUID
    },
    departmentId: {
        type: String,
        required: true
    },
    reportMonth: {
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

// >>>> VALIDATORS >>>>

const uniqueId = async (value: string) => {
    const count = await ReportModel.countDocuments({ id: value });
    return count === 0;
}
reportSchema.path(`${PATH_TO_ID}`).validate({
    validator: uniqueId,
    message: function(props: mongoose.ValidatorProps) {
        return `Report with id ${props.value} already exists`;
    }
});

const validDepartment = async (value: string) => {
    const valid = verifyDeptId(value);
    return valid;
}
reportSchema.path(`${PATH_TO_DEPARTMENT_ID}`).validate({
    validator: validDepartment,
    message: function(props: mongoose.ValidatorProps) {
        return `Department id ${props.value} is invalid`;
    }
});

const verifyUser = async (value: string) => {
    const existed = await UserModel.exists({ _id: value});
    return existed;
}
reportSchema.path(`${PATH_TO_USER_ID}`).validate({
    validator: verifyUser,
    message: function(props: mongoose.ValidatorProps) {
        return `Report references to non-existing user`;
    }
})

const uniqueReportMonth = async (value: Date) => {
    const count = await ReportModel.countDocuments({ reportMonth: value });
    return count === 0;
};
reportSchema.path(`${PATH_TO_REPORT_MONTH}`).validate({
    validator: uniqueReportMonth,
    message: function(props: mongoose.ValidatorProps) {
        return `Report for date: ${props.value} already exists`;
    }
})

// <<<< VALIDATORS <<<<<