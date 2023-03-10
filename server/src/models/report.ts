import * as mongoose from 'mongoose';
import Departments from 'utils/departments';
import { DEPARTMENT_MODEL_NAME } from './departments';

import UserCollection, { USER_MODEL_NAME } from './user';

const { Schema } = mongoose;

export interface IReport {
  _id: string;
  departmentId: string;
  reportMonth: Date;
  submittedDate: Date;
  submittedUserId: string;
  submittedBy: string;
  reportObject: object;
}

const PATH_TO_DEPARTMENT_ID = 'departmentId';
const PATH_TO_USER_ID = 'submittedUserId';

const reportSchema = new Schema({
  departmentId: {
    type: String,
    required: true,
    ref: DEPARTMENT_MODEL_NAME,
  },
  reportMonth: {
    type: Date,
    required: true,
  },
  submittedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  submittedBy: {
    type: String,
    required: true,
  },
  submittedUserId: {
    type: String,
    required: true,
    ref: USER_MODEL_NAME,
  },
  reportObject: { type: Object, required: true },
});

export const REPORT_MODEL_NAME = 'Report';
export const ReportCollection = mongoose.model(REPORT_MODEL_NAME, reportSchema);

// >>>> VALIDATORS >>>>

const validDepartment = async (value: string) => {
  const valid = await Departments.Database.validateDeptId(value);
  return valid;
};

const verifyUser = async (value: string) => {
  const existed = await UserCollection.exists({ _id: value });
  return existed;
};

// don't validate in test environment
if (process.env.NODE_ENV !== 'test') {
  reportSchema.path(`${PATH_TO_DEPARTMENT_ID}`).validate({
    validator: validDepartment,
    message: function (props: mongoose.ValidatorProps) {
      return `Department id ${props.value} is invalid`;
    },
  });

  reportSchema.path(`${PATH_TO_USER_ID}`).validate({
    validator: verifyUser,
    message: function (props: mongoose.ValidatorProps) {
      return `Report references to non-existing user`;
    },
  });
}

// <<<< VALIDATORS <<<<<
