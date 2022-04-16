import { JsonReportDescriptor } from 'common/json_report';
import { randomUUID } from 'crypto';
import mongoose, { ValidatorProps } from 'mongoose';
import { ReportDescriptor } from 'utils/definitions/report';
import Departments from 'utils/departments';
import { parseToJson } from 'utils/parsers/json_report';
import { fromTemplateToReport, TemplateItems } from 'utils/parsers/template';
import UserCollection, { USER_MODEL_NAME } from './user';
const { Schema } = mongoose;

export interface Template {
  id: string;
  departmentId: string;
  submittedDate: Date;
  submittedByUserId: string;
  items: TemplateItems;
}
export interface TemplateWithInstanceMethods extends Template {
  toJson: () => Promise<JsonReportDescriptor>;
}

const PATH_TO_ID = 'id';
const PATH_TO_USER_ID = 'submittedByUserId';
const PATH_TO_DEPARTMENT_ID = 'departmentId';

const templateSchema = new Schema<TemplateWithInstanceMethods>({
  id: {
    type: String,
    unique: true,
    required: true,
    default: randomUUID
  },
  departmentId: { type: String, unique: true, required: true },
  submittedByUserId: { type: String, required: true, ref: USER_MODEL_NAME },
  submittedDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  items: { type: Object, required: true }
});

// Make sure that instance methods defined below are matched with template schema i.e TemplateWithUtils
templateSchema.methods.toJson = function (): Promise<JsonReportDescriptor> {
  const report: ReportDescriptor = fromTemplateToReport(this);
  return parseToJson(report);
};

// <<<<<<<<<<<<<<<<<<<<<<<<<< instance methods <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const TEMPLATE_COLLECTION_NAME = 'Template';
const TemplateCollection = mongoose.model<TemplateWithInstanceMethods>(TEMPLATE_COLLECTION_NAME, templateSchema);

// >>>> VALIDATORS >>>>

const uniqueTemplateId = async (value: string) => {
  const count = await TemplateCollection.countDocuments({ id: value });
  return count === 0;
};

const uniqueTemplateDepartment = async (value: string) => {
  const count = await TemplateCollection.countDocuments({ departmentId: value });
  return count === 0;
};

const validDepartment = async (value: string) => {
  const valid = await Departments.Database.validateDeptId(value);
  return valid;
};

const verifyUser = async (value: string) => {
  const existed = await UserCollection.exists({ _id: value });
  return existed;
};

templateSchema.path(`${PATH_TO_ID}`).validate({
  validator: uniqueTemplateId,
  message: function (props: ValidatorProps) {
    return `Template with id ${props.value} already exists`;
  }
});

templateSchema.path(`${PATH_TO_DEPARTMENT_ID}`).validate({
  validator: validDepartment,
  message: function (props: ValidatorProps) {
    return `Department id ${props.value} is invalid`;
  }
});
templateSchema.path(`${PATH_TO_DEPARTMENT_ID}`).validate({
  validator: uniqueTemplateDepartment,
  message: function (props: ValidatorProps) {
    return `Template with department id ${props.value} already exists`;
  }
});

templateSchema.path(`${PATH_TO_USER_ID}`).validate({
  validator: verifyUser,
  message: function (props: ValidatorProps) {
    return `Template references to non-existing user`;
  }
});

// <<<< VALIDATORS <<<<<

export { TemplateCollection };
