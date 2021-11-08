enum CaseStudyOptions {
    PatientStory,
    StaffRecognition,
    TrainingSession,
    EquipmentReceived,
    OtherStory,
}

interface PatientStory {
        patientsName: { type: String, required: true },
        patientsAge: { type: Number, required: true },
        whereIsThePatientFrom: { type: String, required: true },
        whyComeToHCBH: { type: String, required: true },
        howLongWereTheyAtHCBHinDays: { type: Number, required: true },
        diagnosis: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface StaffRecognition {
        staffName: { type: String, required: true },
        jobTitle: { type: String, required: true },
        department: { type: String, required: true },
        howManyMonthsWorkingAtHCBH: { type: Number, required: true },
        mostEnjoy: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface TrainingSession {
        trainingDate: { type: Date, required: true },
        trainingOn: { type: String, required: true },
        whoConducted: { type: String, required: true },
        whoAttended: { type: String, required: true },
        benefitsFromTraining: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface EquipmentReceived {
        equipmentReceived: { type: String, required: true },
        departmentIdReceived: { type: Number, required: true },
        whoSentEquipment: { type: String, required: true },
        purchasedOrDonated: { type: String, required: true },
        whatDoesEquipmentDo: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface OtherStory {
        caseStudyStory: { type: String, required: true },
}

export interface CaseStudyModel{
        caseStudyType: { type: CaseStudyOptions, required: true },
        // TODO: add created by user. right now JWT is not yet applied
        // createdByUser: { type: String},
        patientStory: PatientStory,
        staffRecognition: StaffRecognition,
        trainingSession: TrainingSession,
        equipmentReceived: EquipmentReceived,
        otherStory: OtherStory
};
