import * as mongoose from 'mongoose';

import { questionSchema } from './question';

const { Schema } = mongoose;

const reportSchema = new Schema({
    metadata: {
        updatedBy: mongoose.Types.ObjectId,
        departmentId: {
            type: Number,
            required: true
        },
        dateCreated: {
            type: Date,
            required: true
        },
        dateUpdated: {
            type: Date,
            required: true
        },

    },
    questions: [questionSchema]
});

reportSchema.virtual('name').get(function() {
    const createdDate: Date = this.metadata.dateCreated;
    const year: number = createdDate.getFullYear();

    // getMonth() is 0 based
    const month: number = createdDate.getMonth() + 1;
    const name = `${year}-${(month < 10)? 0: ''}${month}`;

    return name;
});

export const ReportModel = mongoose.model('Report', reportSchema);