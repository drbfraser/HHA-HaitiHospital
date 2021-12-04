import * as mongoose from 'mongoose';

const { Schema } = mongoose;

enum bioMechEnum {
    Urgent = "Urgent",
    Important = "Important",
    NonUrgent = "Non-Urgent",
}

const bioMechSchema = new Schema({
    //all BioMech Data
    userId: {type: Date, required: true},
    createdOn: {type: Date, required: true},
    equipmentName: {type: String, required: true},
    equipmentFault: {type: String, required: true},
    equipmentPriority: {type: bioMechEnum, required: true},

    //image data
    image: {
        // imageData: {type: Buffer, required: true},
        imgPath: {type: String, required: true},
        contentType: {type: String, required: true},
    },
});

const BioMech = mongoose.model('BioMech', bioMechSchema, 'BioMechReports');
export default BioMech;