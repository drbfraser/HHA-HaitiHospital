import mongoose from 'mongoose';

const { Schema } = mongoose;

const patientStorySchema = new Schema(
  {
    patientsName: { type: String },
    patientsAge: { type: Number },
    whereIsThePatientFrom: { type: String },
    whyComeToHCBH: { type: String },
    howLongWereTheyAtHCBHinDays: { type: Number },
    diagnosis: { type: String },
    caseStudyStory: { type: String },
  },
  { timestamps: true },
);

const staffRecognitionSchema = new Schema(
  {
    staffName: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    howManyMonthsWorkingAtHCBH: { type: Number },
    mostEnjoy: { type: String },
    caseStudyStory: { type: String },
  },
  { timestamps: true },
);

const trainingSessionSchema = new Schema(
  {
    trainingDate: { type: Date },
    trainingOn: { type: String },
    whoConducted: { type: String },
    whoAttended: { type: String },
    benefitsFromTraining: { type: String },
    caseStudyStory: { type: String },
  },
  { timestamps: true },
);

const equipmentReceivedSchema = new Schema(
  {
    equipmentReceived: { type: String },
    departmentIdReceived: { type: Number },
    whoSentEquipment: { type: String },
    purchasedOrDonated: { type: String },
    whatDoesEquipmentDo: { type: String },
    caseStudyStory: { type: String },
  },
  { timestamps: true },
);

const otherStorySchema = new Schema(
  {
    caseStudyStory: { type: String },
  },
  { timestamps: true },
);

const caseStudySchema = new Schema(
  {
    caseStudyType: { type: String },
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
