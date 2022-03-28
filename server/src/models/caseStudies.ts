import { boolean } from 'joi';
import mongoose from 'mongoose';

const { Schema } = mongoose;

export enum CaseStudyOptions {
  PatientStory = 'Patient Story',
  StaffRecognition = 'Staff Recognition',
  TrainingSession = 'Training Session',
  EquipmentReceived = 'Equipment Received',
  OtherStory = 'Other Story'
}

const patientStorySchema = new Schema(
  {
    patientsName: { type: String, required: true },
    patientsAge: { type: Number, required: true },
    whereIsThePatientFrom: { type: String, required: true },
    whyComeToHcbh: { type: String, required: true },
    howLongWereTheyAtHcbh: { type: String, required: true },
    diagnosis: { type: String, required: true },
    caseStudyStory: { type: String, required: true }
  },
  { _id: false }
);

const staffRecognitionSchema = new Schema(
  {
    staffName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    howLongWorkingAtHcbh: { type: String, required: true },
    mostEnjoy: { type: String, required: true },
    caseStudyStory: { type: String, required: true }
  },
  { _id: false }
);

const trainingSessionSchema = new Schema(
  {
    trainingDate: { type: Date, required: true },
    trainingOn: { type: String, required: true },
    whoConducted: { type: String, required: true },
    whoAttended: { type: String, required: true },
    benefitsFromTraining: { type: String, required: true },
    caseStudyStory: { type: String, required: true }
  },
  { _id: false }
);

const equipmentReceivedSchema = new Schema(
  {
    equipmentReceived: { type: String, required: true },
    departmentReceived: { type: String, required: true },
    whoSentEquipment: { type: String, required: true },
    purchasedOrDonated: { type: String, required: true },
    whatDoesEquipmentDo: { type: String, required: true },
    caseStudyStory: { type: String, required: true }
  },
  { _id: false }
);

const otherStorySchema = new Schema(
  {
    caseStudyStory: { type: String, required: true }
  },
  { _id: false }
);

const caseStudySchema = new Schema(
  {
    caseStudyType: { type: CaseStudyOptions, required: true },
    // TODO: add created by user. right now JWT is not yet applied
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userDepartment: String,
    patientStory: patientStorySchema,
    staffRecognition: staffRecognitionSchema,
    trainingSession: trainingSessionSchema,
    equipmentReceived: equipmentReceivedSchema,
    otherStory: otherStorySchema,
    imgPath: { type: String, required: true },
    featured: { type: Boolean, required: true }
  },
  { timestamps: true }
);

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

export default CaseStudy;
