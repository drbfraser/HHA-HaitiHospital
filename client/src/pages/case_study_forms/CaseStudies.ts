enum CaseStudyOptions {
    PatientStory,
    StaffRecognition,
    TrainingSession,
    EquipmentReceived,
    OtherStory,
}

interface PatientStory {
    patientsName: { type: string, required: true },
    patientsAge: { type: number, required: true },
    whereIsThePatientFrom: { type: string, required: true },
    whyComeToHCBH: { type: string, required: true },
    howLongWereTheyAtHCBHinDays: { type: number, required: true },
    diagnosis: { type: string, required: true },
    caseStudyStory: { type: string, required: true },
}

interface StaffRecognition {
    staffName: { type: string, required: true },
    jobTitle: { type: string, required: true },
    department: { type: string, required: true },
    howManyMonthsWorkingAtHCBH: { type: number, required: true },
    mostEnjoy: { type: string, required: true },
    caseStudyStory: { type: string, required: true },
}

interface TrainingSession {
    trainingDate: { type: Date, required: true },
    trainingOn: { type: string, required: true },
    whoConducted: { type: string, required: true },
    whoAttended: { type: string, required: true },
    benefitsFromTraining: { type: string, required: true },
    caseStudyStory: { type: string, required: true },
}

interface EquipmentReceived {
    equipmentReceived: { type: string, required: true },
    departmentIdReceived: { type: number, required: true },
    whoSentEquipment: { type: string, required: true },
    purchasedOrDonated: { type: string, required: true },
    whatDoesEquipmentDo: { type: string, required: true },
    caseStudyStory: { type: string, required: true },
}

interface OtherStory {
    caseStudyStory: { type: string, required: true },
}

export interface CaseStudyModel{
    caseStudyType: { type: CaseStudyOptions, required: true },
    // TODO: add created by user. right now JWT is not yet applied
    // createdByUser: { type: string},
    patientStory: PatientStory,
    staffRecognition: StaffRecognition,
    trainingSession: TrainingSession,
    equipmentReceived: EquipmentReceived,
    otherStory: OtherStory
};
