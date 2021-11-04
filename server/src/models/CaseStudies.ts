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

const caseStudiesSchema = new Schema(
  {
    caseStudyType: { type: String },
    patientStory: patientStorySchema,
    staffRecognition: staffRecognitionSchema,
    trainingSession: trainingSessionSchema,
    equipmentReceived: equipmentReceivedSchema,
    otherStory: otherStorySchema
  },
  { timestamps: true },
);

// const PatientStory = mongoose.model('PatientStory', patientStorySchema, 'caseStudies');
// const StaffRecognition = mongoose.model('StaffRecognition', staffRecognitionSchema, 'caseStudies');
// const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema, 'caseStudies');
// const EquipmentReceived = mongoose.model('EquipmentReceived', equipmentReceivedSchema, 'caseStudies');
// const OtherStory = mongoose.model('OtherStory', otherStorySchema, 'caseStudies');
const CaseStudies = mongoose.model('CaseStudies', caseStudiesSchema, 'caseStudies');

// export {
//   PatientStory,
//   StaffRecognition,
//   TrainingSession,
//   EquipmentReceived,
//   OtherStory,
//   CaseStudies,
// }
export default CaseStudies;
