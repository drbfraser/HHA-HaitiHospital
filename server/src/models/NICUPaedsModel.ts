export interface NICUPaedsModel {
    departmentId: number;
    createdOn:Date;
    createdByUserId:number; //user Last Edited, or user created?
    userId: number;
    lastUpdatedOn: Date;
    lastUpdatedByUserId: number;

    bedsAvailable: number;
    bedDays: number;
    patientDays: number;
    hospitalized: {
        total: number,
        nicu?: number;
        paeds?: number;
    };
    dischargedAlive:{
        total: number,
        nicu?: number;
        paeds?: number;
    };
    diedBefore48hr: {
        total: number,
        nicu?: number;
        paeds?: number;
    };
    diedAfter48hr: {
        total: number,
        nicu?: number;
        paeds?: number;
    };
    daysHospitalized: number;
    referrals: number;
    transfers: number;
    selfDischarge: {
        total: number,
        cannotAfford?: number;
        avoidedPaying?: number;
        religiousCultural?: number;
        personalFamily?: number;
        other?: number;
    };
    stayedInWard: number;
    admissions: {
        total: number,
        comeFrom?: {
            quarterMorin?: number;
            capHaitian?: number;
            departmentNord?: number;
            otherDepartments?: [{
                nameOfDepartment?: string;
		        numberOfPatients?: number;
            }];
        };

        age?: {
            extremelyPreterm?: number; //<28Weeks
            veryPreterm?: number; //28-32weeks
            moderateToLatePreterm?: number; //32-37weeks
            fullTerm?: number; //37+weeks
            olderThanNeonate?: number; //>4weeks old
            age4To5Weeks?: number;
            age6To11Weeks?: number;
            age12To18Weeks?: number;
        };

        gender?:{
            male?: number;
            female?: number;
        }

        mainCondition?: {
            respiratoryArrest?: number;
            traumaticInjury?: number;
            septicShock?: number;
            hypovolemicShock?: number;
            seizuresOrConvulsions?: number;
            poisoning?: number;
            alteredMentalStatus?: number;
            gastroenteritis?: number;
            hemorrhage?: number;
            hypothermia?: number;
            cardiacCongenitalAnomaly?: number;
            otherCongenitalAnomaly?: number;
            malnutrition?: number;
            meningitis?: number;
            communityAcquiredPneumonia?: number;
            aspirationPneumonia?: number;
            moderatePrematurity?: number;
            severePrematurity?: number;
            otherMedical?:[{
                nameOfCondition?: string;
                numberOfPatients?: number;
            }];
        };
    };

    numberOfOutPatients: {
        total: number;

        age?: {
            extremelyPreterm?: number; //<28Weeks
            veryPreterm?: number; //28-32weeks
            moderateToLatePreterm?: number; //32-37weeks
            fullTerm?: number; //37+weeks
            olderThanNeonate?: number; //>4weeks old
            age4To5Weeks?: number;
            age6To11Weeks?: number;
            age12To18Weeks?: number;
        };

        gender?:{
            male?: number;
            female?: number;
        }

        mainCondition?: {
            respiratoryArrest?: number;
            traumaticInjury?: number;
            septicShock?: number;
            hypovolemicShock?: number;
            seizuresOrConvulsions?: number;
            poisoning?: number;
            alteredMentalStatus?: number;
            gastroenteritis?: number;
            hemorrhage?: number;
            hypothermia?: number;
            cardiacCongenitalAnomaly?: number;
            otherCongenitalAnomaly?: number;
            malnutrition?: number;
            meningitis?: number;
            communityAcquiredPneumonia?: number;
            aspirationPneumonia?: number;
            moderatePrematurity?: number;
            severePrematurity?: number;
            otherMedical?:[{
                nameOfCondition?: string;
                numberOfPatients?: number;
            }];
        };

        
    };
}