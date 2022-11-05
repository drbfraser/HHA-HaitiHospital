import * as mongoose from 'mongoose';
import Departments from 'utils/departments';
import { formatDateString } from 'utils/utils';

import UserCollection, { USER_MODEL_NAME } from './user';

const { Schema } = mongoose;

const PATH_TO_DEPARTMENT_ID = 'departmentId';
const PATH_TO_USER_ID = 'submittedUserId';
const PATH_TO_REPORT_MONTH = 'reportMonth';

const reportSchema = new Schema({
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
  reportObject: { type: Object, required: true }
});

export const REPORT_MODEL_NAME = 'Report';
export const ReportCollection = mongoose.model(REPORT_MODEL_NAME, reportSchema);

// >>>> VALIDATORS >>>>

const validDepartment = async (value: string) => {
  const valid = await Departments.Database.validateDeptId(value);
  return valid;
};
reportSchema.path(`${PATH_TO_DEPARTMENT_ID}`).validate({
  validator: validDepartment,
  message: function (props: mongoose.ValidatorProps) {
    return `Department id ${props.value} is invalid`;
  }
});

const verifyUser = async (value: string) => {
  const existed = await UserCollection.exists({ _id: value });
  return existed;
};
reportSchema.path(`${PATH_TO_USER_ID}`).validate({
  validator: verifyUser,
  message: function (props: mongoose.ValidatorProps) {
    return `Report references to non-existing user`;
  }
});

const uniqueReportMonth = async function (value: Date) {
  const count = await ReportCollection.countDocuments({ reportMonth: value, departmentId: this.departmentId });
  return count === 0;
};

reportSchema.path(`${PATH_TO_REPORT_MONTH}`).validate({
  validator: uniqueReportMonth,
  message: function (props: mongoose.ValidatorProps) {
    return `Report for date: ${formatDateString(props.value)} already exists`;
  }
});

// <<<< VALIDATORS <<<<<
