import mongoose from 'mongoose';

const { Schema } = mongoose;

enum CaseStudyOptions {
  OtherStory,
  PatientStory,
  StaffRecognition,
  TrainingSession,
  EquipmentReceived,
}

enum DepartmentEnum {
  Rehab = "REHAB",
  NICU_PAED = "NICU_PAED",
  Maternity = "MATERNITY",
  CommunityHealth = "COMMUNITY_HEALTH"
}

enum PurchasedOrDonatedEnum {
  Purchased = "PURCHASED",
  Donated = "DONATED"
}

export interface PatientStory {
  patientsName: string;
  patientsAge: number;
  whereIsThePatientFrom: string;
  whyComeToHCBH: string;
  howLongWereTheyAtHCBHinDays: number;
  diagnosis: string;
  caseStudyStory: string;
}

export interface StaffRecognition {
  staffName: string;
  jobTitle: string;
  department: DepartmentEnum,
  howManyMonthsWorkingAtHCBH: number,
  mostEnjoy: string;
  caseStudyStory: string;
}

export interface TrainingSession {
  trainingDate: Date;
  trainingOn: string;
  whoConducted: string;
  whoAttended: string;
  benefitsFromTraining: string;
  caseStudyStory: string;
}

export interface EquipmentReceived {
  equipmentReceived: string;
  departmentReceived: DepartmentEnum;
  whoSentEquipment: string;
  purchasedOrDonated: PurchasedOrDonatedEnum;
  whatDoesEquipmentDo: string;
  caseStudyStory: string;
}

export interface otherStory {
  caseStudyStory: string;
}



// export interface CaseStudies extends Document {
//   createdByUser: string;
//   createdAt: Date;
//   updatedAt: Date;
// }



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

const patientStory = mongoose.model('PatientStory', patientStorySchema, 'caseStudies');
const staffRecognition = mongoose.model('StaffRecognition', staffRecognitionSchema, 'caseStudies');

export {
  patientStory,
  staffRecognition,
}
