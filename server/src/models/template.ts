import mongoose from 'mongoose';
import { TemplateItems } from 'utils/report/template';
const { Schema } = mongoose;

export interface TemplateDocument {
    id: string,
    departmentId: string,
    submittedDate: string,
    submittedByUserId: string,
    items: TemplateItems
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
    TemplateCollection.countDocuments({ id: value }, function(err, count) {
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

const uniqueTemplateDepartment = (value) => {
    TemplateCollection.countDocuments({ departmentId: value }, function(err, count) {
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
