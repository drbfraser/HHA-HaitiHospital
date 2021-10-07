export interface NICUPaeds {
    departmentId:number;
    year:number;
    userId:number; //user Last Edited, or user created?
    created: Date;
    lastUpdated: Date;
    lastUpdatedByUserId: number;

    bedsAvailable: number;
    bedDays: number;
    patientDays: number;
    Hospitalized: {
        HospitalizedNICU: number;
        HospitalizedPaeds: number;
    };
    dischargedAlive:{
        dischargedAliveNICU: number;
        dischargedAlivePaeds: number;
    };
    diedBefore48hr: {
        diedBefore48hrNICU: number;
        diedBefore48hrPaeds: number;
    };
    diedAfter48hr: {
        diedAfter48hrNICU: number;
        diedAfter48hrPaeds: number;
    };
    daysHospitalized: number;
    referrals: number;
    transfers: number;
    selfDischarge: {
        cannotAffordCare: number;
        avoidedPaying: number;
        ReligiousorCultural: number;
        PersonalorFamily: number;
        Other: number;
    };
    stayedInWard: number;
    Admissions: {
        whereDoPatientsComeFrom: {
            quarterMorin: number;
            capHaitian: number;
            departmentNord: number;
            otherDepartments: [{
                location: string;
		numberOfPatients: number;
            }];
        };

        ageOfInfantAdmitted: {
            extremelyPreterm: number; //<28Weeks
            veryPreterm: number; //28-32weeks
            moderateToLatePreterm: number; //32-37weeks
            fullTerm: number; //37+weeks
            olderThanNeonate: number; //>4weeks old
            age4To5Weeks: number;
            age6To11Weeks: number;
            age12To18Weeks: number;
        };

        genderOfInfantAdmitted:{
            maleOfInfantAdmitted: number;
            femaleOfInfantAdmitted: number;
        }

        mainConditionOfInfantAdmitted: {
            respiratoryArrest: number;
            traumaticInjury: number;
            septicShock: number;
            hypovolemicShock: number;
            seizuresOrConvulsions: number;
            poisoning: number;
            alteredMentalStatus: number;
            gastroenteritis: number;
            hemorrhage: number;
            cardiacCongenitalAnomaly: number;
            otherCongenitalAnomaly: number;
            malnutrition: number;
            meningitis: number;
            communityAcquiredPneumonia: number;
            aspirationPneumonia: number;
            moderatePrematurity: number;
            otherOfInfantAdmitted:[{
                otherMainCondition: string;
            }];
        };

        numberOfOutpatients: {
            totalNumberOfOutpatients: number;

            ageOfOutPatients: {
                extremelyPreterm: number; //<28Weeks
                veryPreterm: number; //28-32weeks
                moderateToLatePreterm: number; //32-37weeks
                fullTerm: number; //37+weeks
                olderThanNeonate: number; //>4weeks old
                fourTo5Weeks: number;
                sixTo11Weeks: number;
                twelveTo18Weeks: number;
            };

            mainConditionOfOutpatients:{
                respiratoryArrest: number;
                traumaticInjury: number;
                septicShock: number;
                hypovolemicShock: number;
                seizuresOrConvulsions: number;
                poisoning: number;
                alteredMentalStatus: number;
                gastroenteritis: number;
                hemorrhage: number;
                cardiacCongenitalAnomaly: number;
                otherCongenitalAnomaly: number;
                malnutrition: number;
                meningitis: number;
                communityAcquiredPneumonia: number;
                aspirationPneumonia: number;
                moderatePrematurity: number;
                otherOfOutpatients:[{
                    otherMainCondition: string;
                }];
            };

            genderOfOutpatients: {
                boyOfOutpatients: number;
                girlOfOutpatients: number;
            }
        };

    };
}