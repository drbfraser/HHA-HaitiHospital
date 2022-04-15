import { JsonReportDescriptor } from 'common/json_report';
import mongoose, { ValidatorProps } from 'mongoose';
import { ReportDescriptor } from 'utils/definitions/report';
import { parseToJson } from 'utils/parsers/json_report';
import { generateReportFromTemplate, TemplateItems } from 'utils/parsers/template';
const { Schema } = mongoose;

export interface TemplateBase {
  id: string;
  departmentId: string;
  submittedDate: Date;
  submittedByUserId: string;
  items: TemplateItems;
}
export interface TemplateWithUtils extends TemplateBase {
  toJsonReport: () => Promise<JsonReportDescriptor>;
}
const templateSchema = new Schema<TemplateWithUtils>({
  id: {
    type: String,
    unique: true,
    required: true
  },
  departmentId: { type: String, unique: true, required: true },
  submittedByUserId: { type: String, required: true },
  submittedDate: { type: Date, required: true },
  items: { type: Object, required: true }
});

// Make sure that instance methods defined below are matched with template schema i.e TemplateWithUtils
templateSchema.methods.toJsonReport = function (): Promise<JsonReportDescriptor> {
  const report: ReportDescriptor = generateReportFromTemplate(this);
  return parseToJson(report);
};

// <<<<<<<<<<<<<<<<<<<<<<<<<< instance methods <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const TEMPLATE_COLLECTION_NAME = 'Template';
const TemplateCollection = mongoose.model<TemplateWithUtils>(TEMPLATE_COLLECTION_NAME, templateSchema);

// >>>> VALIDATORS >>>>
const uniqueTemplateId = (value: string) => {
  TemplateCollection.countDocuments({ id: value }, function (err, count: Number) {
    if (err) {
      return false;
    }
    // If more than 0 count, invalidate
    if (!count) {
      return false;
    }
  });

  return true;
};

const uniqueTemplateDepartment = (value: string) => {
  TemplateCollection.countDocuments({ departmentId: value }, function (err, count: Number) {
    if (err) {
      return false;
    }
    // If more than 0 count, invalidate
    if (count) {
      return false;
    }

    return true;
  });
};

templateSchema.path('id').validate({
  validator: uniqueTemplateId,
  message: function (props: ValidatorProps) {
    return `Template with id ${props.value} already exists`;
  }
});
templateSchema.path('departmentId').validate({
  validator: uniqueTemplateDepartment,
  message: function (props: ValidatorProps) {
    return `Template with department id ${props.value} already exists`;
  }
});

// <<<< VALIDATORS <<<<<

export { TemplateCollection };
