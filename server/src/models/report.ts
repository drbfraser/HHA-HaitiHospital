import { InvalidInput } from 'exceptions/systemException';
import mongoose from 'mongoose';
import { ReportItems } from '../utils/definitions/report';
const { Schema } = mongoose;

export interface TemplateDocument {
    id: String,
    departmentId: String,
    submittedDate: String,
    items: ReportItems
}

const templateSchema = new Schema<TemplateDocument>({
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

const TEMPLATE_COLLECTION_NAME = "Template";
const TemplateCollection = mongoose.model<TemplateDocument>(TEMPLATE_COLLECTION_NAME, templateSchema);

const uniqueTemplateId = (value) => {
    TemplateCollection.count({ id: value }, function(err, count) {
        if (err) {
            throw new Error(err.message);
        }
        // If more than 0 count, invalidate
        if (!count) {
            throw new InvalidInput("Template id must be unique");
        }
    });
}

const uniqueTemplateDepartment = (value, done) => {
    TemplateCollection.count({ departmentId: value }, function(err, count) {
        if (err) {
            done(err);
        }
        // If more than 0 count, invalidate
        done(!count);
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
