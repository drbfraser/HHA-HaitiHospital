import mongoose from 'mongoose';

const { Schema } = mongoose;

enum CaseStudyOptions {
    PatientStory,
    StaffRecognition,
    TrainingSession,
    EquipmentReceived,
    OtherStory,
}

const patientStorySchema = new Schema(
    {
        patientsName: { type: String, required: true },
        patientsAge: { type: Number, required: true },
        whereIsThePatientFrom: { type: String, required: true },
        whyComeToHcbh: { type: String, required: true },
        howLongWereTheyAtHcbh: { type: String, required: true },
        diagnosis: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
    }
);

const staffRecognitionSchema = new Schema(
    {
        staffName: { type: String, required: true },
        jobTitle: { type: String, required: true },
        department: { type: String, required: true },
        howLongWorkingAtHcbh: { type: String, required: true },
        mostEnjoy: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
    }
);

const trainingSessionSchema = new Schema(
    {
        trainingDate: { type: Date, required: true },
        trainingOn: { type: String, required: true },
        whoConducted: { type: String, required: true },
        whoAttended: { type: String, required: true },
        benefitsFromTraining: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
    }
);

const equipmentReceivedSchema = new Schema(
    {
        equipmentReceived: { type: String, required: true },
        departmentReceived: { type: String, required: true },
        whoSentEquipment: { type: String, required: true },
        purchasedOrDonated: { type: String, required: true },
        whatDoesEquipmentDo: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
    }
);

const otherStorySchema = new Schema(
    {
        caseStudyStory: { type: String, required: true },
    }
);

const caseStudySchema = new Schema(
    {
        caseStudyType: { type: CaseStudyOptions, required: true },
        // TODO: add created by user. right now JWT is not yet applied
        // createdByUser: { type: String},
        patientStory: patientStorySchema,
        staffRecognition: staffRecognitionSchema,
        trainingSession: trainingSessionSchema,
        equipmentReceived: equipmentReceivedSchema,
        otherStory: otherStorySchema,
        img: { type: String, required: true }
    },
    { timestamps: true },
);

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

export default CaseStudy;
