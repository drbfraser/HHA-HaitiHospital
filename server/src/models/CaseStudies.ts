import mongoose from 'mongoose';

const { Schema } = mongoose;

const patientStorySchema = new Schema(
  {
    createdByUser: { type: String },
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
    createdByUser: { type: String },
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
    createdByUser: { type: String },
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
    createdByUser: { type: String },
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
    createdByUser: { type: String },
    caseStudyStory: { type: String },
  },
  { timestamps: true },
);

const PatientStory = mongoose.model('PatientStory', patientStorySchema, 'caseStudies');
const StaffRecognition = mongoose.model('StaffRecognition', staffRecognitionSchema, 'caseStudies');
const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema, 'caseStudies');
const EquipmentReceived = mongoose.model('EquipmentReceived', equipmentReceivedSchema, 'caseStudies');
const OtherStory = mongoose.model('OtherStory', otherStorySchema, 'caseStudies');

export {
  PatientStory,
  StaffRecognition,
  TrainingSession,
  EquipmentReceived,
  OtherStory,
}
