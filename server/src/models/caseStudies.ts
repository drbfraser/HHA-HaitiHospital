import Departments from 'utils/departments';
import { IllegalState } from 'exceptions/systemException';
import mongoose from 'mongoose';
import { formatDateString } from 'utils/utils';
import UserCollection from './user';
import { UserApiOut } from '../routes/api/jsons/user';

const { Schema } = mongoose;

export enum CaseStudyOptions {
  PatientStory = 'Patient Story',
  StaffRecognition = 'Staff Recognition',
  TrainingSession = 'Training Session',
  EquipmentReceived = 'Equipment Received',
  OtherStory = 'Other Story'
}

export interface PatientStory {
  patientsName: string;
  patientsAge: number;
  whereIsThePatientFrom: string;
  whyComeToHcbh: string;
  howLongWereTheyAtHcbh: string;
  diagnosis: string;
  caseStudyStory: string;
}

const patientStorySchema = new Schema<PatientStory>(
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

export interface StaffRecognition {
  staffName: string;
  jobTitle: string;
  department: string;
  howLongWorkingAtHcbh: string;
  mostEnjoy: string;
  caseStudyStory: string;
}

const staffRecognitionSchema = new Schema<StaffRecognition>(
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

export interface TrainingSession {
  trainingDate: Date;
  trainingOn: string;
  whoConducted: string;
  whoAttended: string;
  benefitsFromTraining: string;
  caseStudyStory: string;
}
const trainingSessionSchema = new Schema<TrainingSession>(
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

export interface EquipmentReceived {
  equipmentReceived: string;
  departmentReceived: string;
  whoSentEquipment: string;
  purchasedOrDonated: string;
  whatDoesEquipmentDo: string;
  caseStudyStory: string;
}
const equipmentReceivedSchema = new Schema<EquipmentReceived>(
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

export interface OtherStory {
  caseStudyStory: string;
}
const otherStorySchema = new Schema<OtherStory>(
  {
    caseStudyStory: { type: String, required: true }
  },
  { _id: false }
);

export interface CaseStudy {
  caseStudyType: CaseStudyOptions;
  userId: string;
  departmentId: string;
  patientStory?: PatientStory;
  staffRecognition?: StaffRecognition;
  trainingSession?: TrainingSession;
  equipmentReceived?: EquipmentReceived;
  otherStory?: OtherStory;
  imgPath: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyJson {
  id: string;
  caseStudyType: CaseStudyOptions;
  user: UserApiOut.UserJson;
  department: {
    id: string;
    name: string;
  };
  patientStory?: PatientStory;
  staffRecognition?: StaffRecognition;
  trainingSession?: TrainingSession;
  equipmentReceived?: EquipmentReceived;
  otherStory?: OtherStory;
  imgPath: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyWithInstanceMethods extends CaseStudy {
  toJson: () => Promise<CaseStudyJson>;
}

const caseStudySchema = new Schema<CaseStudyWithInstanceMethods>(
  {
    caseStudyType: { type: CaseStudyOptions, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    departmentId: { type: String, required: true },
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
caseStudySchema.methods.toJson = async function (): Promise<CaseStudyJson> {
  const userDoc = await UserCollection.findById(this.userId);
  if (!userDoc) {
    throw new IllegalState(`Case study references to non-existing user id ${this.userId}`);
  }

  const userJson = await userDoc.toJson();
  const json: CaseStudyJson = {
    id: this._id,
    caseStudyType: this.caseStudyType,
    user: userJson,
    department: {
      id: this.departmentId,
      name: await Departments.Database.getDeptNameById(this.departmentId)
    },
    imgPath: this.imgPath,
    featured: this.featured,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    patientStory: this.patientStory ? this.patientStory : undefined,
    staffRecognition: this.staffRecognition ? this.staffRecognition : undefined,
    trainingSession: this.trainingSession ? this.trainingSession : undefined,
    equipmentReceived: this.equipmentReceived,
    otherStory: this.otherStory ? this.otherStory : undefined
  };

  return json;
};

const CaseStudyModel = mongoose.model<CaseStudyWithInstanceMethods>('CaseStudy', caseStudySchema, 'CaseStudy');

export default CaseStudyModel;
