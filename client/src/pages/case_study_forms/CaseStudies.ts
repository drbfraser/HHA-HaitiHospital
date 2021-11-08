enum CaseStudyOptions {
    PatientStory,
    StaffRecognition,
    TrainingSession,
    EquipmentReceived,
    OtherStory,
}

interface patientStorySchema {
        patientsName: { type: String, required: true },
        patientsAge: { type: Number, required: true },
        whereIsThePatientFrom: { type: String, required: true },
        whyComeToHCBH: { type: String, required: true },
        howLongWereTheyAtHCBHinDays: { type: Number, required: true },
        diagnosis: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface staffRecognitionSchema {
        staffName: { type: String, required: true },
        jobTitle: { type: String, required: true },
        department: { type: String, required: true },
        howManyMonthsWorkingAtHCBH: { type: Number, required: true },
        mostEnjoy: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface trainingSessionSchema {
        trainingDate: { type: Date, required: true },
        trainingOn: { type: String, required: true },
        whoConducted: { type: String, required: true },
        whoAttended: { type: String, required: true },
        benefitsFromTraining: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface equipmentReceivedSchema {
        equipmentReceived: { type: String, required: true },
        departmentIdReceived: { type: Number, required: true },
        whoSentEquipment: { type: String, required: true },
        purchasedOrDonated: { type: String, required: true },
        whatDoesEquipmentDo: { type: String, required: true },
        caseStudyStory: { type: String, required: true },
}

interface otherStorySchema {
        caseStudyStory: { type: String, required: true },
}

export interface caseStudyModel{
        caseStudyType: { type: CaseStudyOptions, required: true },
        // TODO: add created by user. right now JWT is not yet applied
        // createdByUser: { type: String},
        patientStory: patientStorySchema,
        staffRecognition: staffRecognitionSchema,
        trainingSession: trainingSessionSchema,
        equipmentReceived: equipmentReceivedSchema,
        otherStory: otherStorySchema
};
