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

export interface PatientStoryModel {
  patientsName: string;
  patientsAge: number;
  whereIsThePatientFrom: string;
  whyComeToHCBH: string;
  howLongWereTheyAtHCBHinDays: number;
  diagnosis: string;
  caseStudyStory: string;
}

export interface StaffRecognitionModel {
  staffName: string;
  jobTitle: string;
  department: DepartmentEnum,
  howManyMonthsWorkingAtHCBH: number,
  mostEnjoy: string;
  caseStudyStory: string;
}

export interface TrainingSessionModel {
  trainingDate: Date;
  trainingOn: string;
  whoConducted: string;
  whoAttended: string;
  benefitsFromTraining: string;
  caseStudyStory: string;
}

export interface EquipmentReceivedModel {
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