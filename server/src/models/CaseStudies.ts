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
    patientsName: { type: String },
    patientsAge: { type: Number },
    whereIsThePatientFrom: { type: String },
    whyComeToHCBH: { type: String },
    howLongWereTheyAtHCBHinDays: { type: Number },
    diagnosis: { type: String },
    caseStudyStory: { type: String },
  }
);

const staffRecognitionSchema = new Schema(
  {
    staffName: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    howManyMonthsWorkingAtHCBH: { type: Number },
    mostEnjoy: { type: String },
    caseStudyStory: { type: String },
  }
);

const trainingSessionSchema = new Schema(
  {
    trainingDate: { type: Date },
    trainingOn: { type: String },
    whoConducted: { type: String },
    whoAttended: { type: String },
    benefitsFromTraining: { type: String },
    caseStudyStory: { type: String },
  }
);

const equipmentReceivedSchema = new Schema(
  {
    equipmentReceived: { type: String },
    departmentIdReceived: { type: Number },
    whoSentEquipment: { type: String },
    purchasedOrDonated: { type: String },
    whatDoesEquipmentDo: { type: String },
    caseStudyStory: { type: String },
  }
);

const otherStorySchema = new Schema(
  {
    caseStudyStory: { type: String },
  }
);

const caseStudySchema = new Schema(
  {
    caseStudyType: { type: CaseStudyOptions },
    // TODO: add created by user. right now JWT is not yet applied
    // createdByUser: { type: String},
    patientStory: patientStorySchema,
    staffRecognition: staffRecognitionSchema,
    trainingSession: trainingSessionSchema,
    equipmentReceived: equipmentReceivedSchema,
    otherStory: otherStorySchema
  },
  { timestamps: true },
);

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

export default CaseStudy;
