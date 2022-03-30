import { JsonReportDescriptor } from 'common/definitions/json_report';
import mongoose, { Model } from 'mongoose';
import { ReportDescriptor } from 'utils/definitions/report';
import { parseToJson } from 'utils/json_report_parser/json_report';
import { generateReportFromTemplate, TemplateItems } from 'utils/report/template';
const { Schema } = mongoose;

export interface TemplateBase {
    id: string,
    departmentId: string,
    submittedDate: string,
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
    },
    departmentId: {type: String, unique: true, required: true},
    submittedByUserId: {type: String, required: true},
    submittedDate: {type: String, required: true},
    items: {type: Object, required: true}
});

templateSchema.methods.toJsonReport = function(): JsonReportDescriptor {
    const report: ReportDescriptor = generateReportFromTemplate(this);
    return parseToJson(report);
}

const TEMPLATE_COLLECTION_NAME = "Template";
const TemplateCollection = mongoose.model<TemplateWithUtils>(TEMPLATE_COLLECTION_NAME, templateSchema);

const uniqueTemplateId = (value: string) => {
    TemplateCollection.countDocuments({ id: value }, function(err, count: Number) {
        if (err) {
            return false;
        }
        // If more than 0 count, invalidate
        if (!count) {
            return false;
        }
    });

    return true;
}

const uniqueTemplateDepartment = (value: string) => {
    TemplateCollection.countDocuments({ departmentId: value }, function(err, count: Number) {
        if (err) {
            return false;
        }
        // If more than 0 count, invalidate
        if (count) {
            return false;
        }

        return true;
    });
}

templateSchema.path('id').validate({
    validator: uniqueTemplateId,
    message: function(props) {
        return `Template with id ${props.value} already exists`;
    }
});
templateSchema.path('departmentId').validate({
    validator: uniqueTemplateDepartment,
    message: function(props) {
        return `Template with department id ${props.value} already exists`;
    }
});
export { TemplateCollection };
