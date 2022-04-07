import { JsonReportDescriptor } from 'common/json_report';
import { randomUUID } from 'crypto';
import mongoose, { ValidatorProps } from 'mongoose';
import { ReportDescriptor } from 'utils/definitions/report';
import { parseToJson } from 'utils/parsers/json_report';
import { getNewReportFromTemplate, TemplateItems } from 'utils/parsers/template';
import { USER_MODEL_NAME } from './user';
const { Schema } = mongoose;

export interface TemplateBase {
    id?: string,
    departmentId: string,
    submittedDate?: Date,
    submittedByUserId: string,
    items: TemplateItems
}
export interface TemplateWithUtils extends TemplateBase {
    toJsonReport: () => JsonReportDescriptor
};
const templateSchema = new Schema<TemplateWithUtils>({
    id: {
        type: String, 
        unique: true, 
        required: true,
        default: randomUUID
    },
    departmentId: {type: String, unique: true, required: true},
    submittedByUserId: {type: String, required: true, ref: USER_MODEL_NAME},
    submittedDate: {
        type: Date, 
        required: true, 
        default: Date.now
    },
    items: {type: Object, required: true}
});

// Make sure that instance methods defined below are matched with template schema i.e TemplateWithUtils
templateSchema.methods.toJsonReport = function(): JsonReportDescriptor {
    const report: ReportDescriptor = getNewReportFromTemplate(this);
    return parseToJson(report);
}

// <<<<<<<<<<<<<<<<<<<<<<<<<< instance methods <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const TEMPLATE_COLLECTION_NAME = "Template";
const TemplateCollection = mongoose.model<TemplateWithUtils>(TEMPLATE_COLLECTION_NAME, templateSchema);

// >>>> VALIDATORS >>>>

const uniqueTemplateId = async (value: string) => {
    const count = await TemplateCollection.countDocuments({ id: value });
    return count === 0;
}

const uniqueTemplateDepartment = async (value: string) => {
    const count = await TemplateCollection.countDocuments({ departmentId: value });
    return count === 0;
}

templateSchema.path('id').validate({
    validator: uniqueTemplateId,
    message: function(props: ValidatorProps) {
        return `Template with id ${props.value} already exists`;
    }
});
templateSchema.path('departmentId').validate({
    validator: uniqueTemplateDepartment,
    message: function(props: ValidatorProps) {
        return `Template with department id ${props.value} already exists`;
    }
});

// <<<< VALIDATORS <<<<<

export { TemplateCollection };
