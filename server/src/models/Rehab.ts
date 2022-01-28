enum DischargedDiagnosisEnum {
  Other,
  SCI,
  Stroke
}

enum DischargeReasonEnum {
  AllGoalsMet,
  GoalsPartiallyMet,
  GoalsNotMet
}

enum DischargeOutcomeEnum {
  Independent,
  ModifiedIndependent,
  SuperVision,
  MinimumAssistance,
  ModerateAssistance,
  MaximumAssistance,
  Dependent
}

enum MobilityAidEnum {
  WheelChair,
  Walker,
  Cane,
  Crutches
}

enum DischargeLocationEnum {
  ReturnHomeAlone,
  ReturnHomeFamily,
  AdmittedToHospital
}

enum DischargeEmploymentStatusEnum {
  Employed,
  UnemployedUnableToFindWork,
  UnemployedDueToCondition,
  RetiredDueToAge
}

enum PatientDiagnosisEnum {
  Other,
  SCI,
  CVA
}

export interface RehabModel {
  departmentId: number;
  year: number;
  userId: number;
  bedsAvailable: number;
  bedDays: number;
  patientDays: number;
  Hospitalized: number;
  dischargedAlive: DischargedAlive[];
  diedBefore48hr: DiedInfo[];
  diedAfter48hr: DiedInfo[];
  daysHospitalized: number;
  referrals: number;
  transfers: number;
  selfDischarge: SelfDischarge; // -- VALIDATION REQUIRED - FRONT/BACKEND;
  stayedInWard: StayedInWard; // -- VALIDATION REQUIRED - FRONT/BACKEND
  Admissions: Admission;
  numberOfOutpatients: number;
  returningOutpatients: number;
  newOutpatientInitialEvaluations: NewOutpatientInitialEvaluation;
}

export interface DischargedAlive {
  // Static: enum dischargedDiagnosis: [Other, SCI, Stroke]
  dischargedDiagnosis: DischargedDiagnosisEnum;
  numDaysInRehabUnit: number;
  dischargeReason: DischargeReasonEnum;
  dischargeOutcomeADLsSelfCare: DischargeOutcomeEnum;
  dischargedOutcomeTransfersMobility: DischargeOutcomeEnum;
  mobilityAid: MobilityAidEnum;
  dischargeLocation: DischargeLocationEnum;
  dischargeEmploymentStatus: DischargeEmploymentStatusEnum;
}

export interface DiedInfo {
  patientDiagnosis: PatientDiagnosisEnum;
  age: number;
  causeOfDeath: string;
}

export interface SelfDischarge {
  // -- VALIDATION REQUIRED - FRONT/BACKEND
  other: number;
  selfDischarged: number; // all values properties below have to add up to this
  financeCantAfford: number;
  financeLefTtoAvoidPaying: number;
  religiousCultural: number;
  personalFamily: number;
}

export interface StayedInWard {
  // -- VALIDATION REQUIRED - FRONT/BACKEND
  stayedInWard: number; // all values properties below have to add up to this
  reasonNotYetDischarged: ReasonNotYetDischarged;
  LengthOfStayOfCurrentInpatients: LengthOfStayOfCurrentInpatients;
}

export interface ReasonNotYetDischarged {
  woundCare: number;
  otherMedicalReason: number;
  financialNoPlaceToDischargeTo: number;
}

export interface LengthOfStayOfCurrentInpatients {
  oneMonthsTo3months: number;
  threeMonthsTo6months: number;
  sixMonthsTo1year: number;
  oneYearTo2years: number;
  twoYearsTo3years: number;
  threeOrMoreYears: number;
}

export interface Admission {
  totalAdmissions: number;
  whereDoPatientsComeFrom: WhereDoPatientsComeFrom;
  mainCondition: AdmissionMainCondition;
  timeFromInjuryUntilAdmittedToRehab: TimeFromInjuryUntilAdmittedToRehab;
}

export interface WhereDoPatientsComeFrom {
  quarterMorin: number;
  capHaitian: number;
  departmentNord: number;
  otherDepartments: WhereDoPatientsComeFromOtherDepartments[]; // ensure that the .length of otherDepartments is part of the totalAdmissions
}

export interface WhereDoPatientsComeFromOtherDepartments {
  location: string;
  numberOfPatients: number;
}

export interface AdmissionMainCondition {
  // TODO: ??????? idk man properties here ????
  causeOfSCI: CauseOfSCI;
  Stroke: number;
  fracturedHip: number;
  fractureLongBones: number;
  neurodegenerativeDisease: number;
  headInjury: number;
  woundCare: number;
  otherMedical: number;
  otherTrauma: number;
}

export interface CauseOfSCI {
  transportAccident: number;
  fall: number;
  assault: number;
  sports: number;
  nonTraumaticSpinalCordDysfunction: number;
  medicalSurgicalComplication: number;
  otherTraumaticReason: number;
}

export interface TimeFromInjuryUntilAdmittedToRehab {
  lessThan1Month: number;
  oneMonthTo2Months: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  twoYears: number;
  threeOrMoreYears: number;
}

export interface NewOutpatientInitialEvaluation {
  numNewOutPatientInitialEvaluations: number; // each properties below this must have numbers totalling this value.
  mainConditionOfNewPatients: MainConditionOfNewPatients;
  ageOfNewPatients: AgeOfNewPatients;
  gender: NumOfEachGender;
}

export interface MainConditionOfNewPatients {
  other: number;
  sciParaplegia: number;
  sciTetraplegia: number;
  strokeCVA: number;
  fracturedHip: number;
  fracturedLongBones: number;
  neurodegenerativeDisease: number;
  headInjury: number;
  woundCare: number;
  cerebralPalsy: number;
  downSyndrome: number;
}

export interface AgeOfNewPatients {
  zeroTo5: number;
  sixTo11: number;
  twelveTo18: number;
  thirtyOneTo50: number;
  fiftyOneTo70: number;
  seventyOneOrOlder: number;
}

export interface NumOfEachGender {
  male: number;
  female: number;
}
