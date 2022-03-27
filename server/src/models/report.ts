import mongoose from 'mongoose';
import { ReportItems } from '../utils/definitions/report';
const { Schema } = mongoose;

interface TemplateDocument {
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
const TemplateCollection = mongoose.model(TEMPLATE_COLLECTION_NAME, templateSchema);

const uniqueTemplateId = (value, done) => {
    TemplateCollection.count({ id: value }, function(err, count) {
        if (err) {
            done(err);
        }
        // If more than 0 count, invalidate
        done(!count);
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
    validator: [ uniqueTemplateId, uniqueTemplateDepartment ],
    message: function(props) {
        return `Template with id ${props.value} already exists`;
    }
});

export { TemplateCollection };
