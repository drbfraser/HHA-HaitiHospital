import mongoose, { ValidatorProps } from 'mongoose';
import Departments from 'utils/departments';
import { DEPARTMENT_MODEL_NAME } from './departments';
import UserCollection, { USER_MODEL_NAME } from './user';
const { Schema } = mongoose;

export interface ITemplate {
  _id?: string;
  departmentId: string;
  reportObject: object;
}

const PATH_TO_USER_ID = 'submittedUserId';
const PATH_TO_DEPARTMENT_ID = 'departmentId';

const templateSchema = new Schema({
  departmentId: {
    type: String,
    required: [true, "can't be blank"],
    index: true,
    ref: DEPARTMENT_MODEL_NAME
  },
  reportObject: { type: Object, required: true }
});

// <<<<<<<<<<<<<<<<<<<<<<<<<< instance methods <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const TEMPLATE_MODEL_NAME = 'Template';
const TemplateCollection = mongoose.model(TEMPLATE_MODEL_NAME, templateSchema);

// >>>> VALIDATORS >>>>

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

// don't validate in test environment
if (process.env.NODE_ENV !== 'test') {
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
}

// <<<< VALIDATORS <<<<<

export { TemplateCollection };
