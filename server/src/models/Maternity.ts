enum ReasonForSelfDischarge {
	Other,
	FinanceLeaveAsCannotAffordCare,
	FinanceLeftToAvoidPaying,
	ReligiousCultural,
	PersonalFamily,
}

export interface Maternity {
	bedsAvailable: number;
	bedDays: number;
	patientDays: number;
	hospitalized: number;
	dischargedAlive: number;
	diedBefore48h: {
        age: number;
        causeOfDeath: string;
    };
	diedAfter48h: {
        age: number;
        causeOfDeath: string;
    };
	
	daysHospitalised: number;
	referrals: number;
	transfers: number;
	selfDischarged: ReasonForSelfDischarge;
	stayedInWard: number;
	//Admissions
	
	// BIRTHS
	weightLess15kg: {
		normal: number;
		cSection: number;
		instrumental: number;
	}
	weight15kgTo25kg: {
		normal: number;
		cSection: number;
		instrumental: number;
	}
	weightMore25kg: {
		normal: number;
		cSection: number;
		instrumental: number;
	}
	notWeighed: {
		normal: number;
		cSection: number;
		instrumental: number;
	}
	immediatelyBreastfed: {
		normal: number;
		cSection: number;
		instrumental: number;
	}
	skinToSkinTherapy: {
		normal: number;
		cSection: number;
		instrumental: number;
	}
	
	// POST NATAL
	breastfeedingVitaminA: number;
	breastfeedingMUACLessThan210mm: number;
	breastfeedingMalnutrition: number;
	domesticVisits: number;
	postNatalConsultations: {
		hour0ToHour6: number;
		hour7ToDay6: number;
		day7ToDay42: number;
	}
	
	// COMPLICATIONS
	numberComplicationsRecorded: number;
	numberComplicationsReferred: number;
	
	// NUMBER OF STILLBORNS
	Macerated: number;
	nonMacerated: number;
	
	// MATERNAL DEATH IN THE HOSPITAL
	deathInHospital: number;
	deathInCommunity: number;
	
	// SUPPORT FOR WIFE AND MOTHER
	firstVisit: {
		months0To3: number;
		months4To6: number;
		months7To9: number;
	}
	secondVisit: {
		months0To3: number;
		months4To6: number;
		months7To9: number;
	}
	thirdVisit: {
		months0To3: number;
		months4To6: number;
		months7To9: number;
	}
	fourthVisit: {
		months0To3: number;
		months4To6: number;
		months7To9: number;
	}
	fifthVisit: {
		months0To3: number;
		months4To6: number;
		months7To9: number;
	}
	
	// SUPPORT FOR WOMEN HOSPITAL
	pregnanciesAtRisk: number;
	anemiaInPregnant: number;
	receivingIronFolate: number;
	treatedForIronDeficiency: number;
	withBirthPlan: number;
	confirmedMalariaTreatedWithChloroquine: number;
	receivedImpregnatedMosquitoNet: number;
	MUACLessThan210mm: number;
	MAMSupported : number;

	// OTHER SERVICES
	otherReceivingIronFolate: number;
	receivingAceticAcidInspection: number;
	positiveAfterSmearTest: number;
	positiveSmearTakenCareOf: number;
	receivingPostabortionCare: number;
	
	// DELIVERIES			
	normal: {
		lessThan15Years: number;
		years15To19: number;
		years20To24: number;
		years25To29: number;
		years30Plus: number;
		unknown: number;
	}	
	cSection: {
		lessThan15Years: number;
		years15To19: number;
		years20To24: number;
		years25To29: number;
		years30Plus: number;
		unknown: number;
	}	
	instrumental: {
		lessThan15Years: number;
		years15To19: number;
		years20To24: number;
		years25To29: number;
		years30Plus: number;
		unknown: number;
	}
	useOfPartograph: {
		normal: number;
		cSection: number;
		instrumental: number;
	}
	thirdPhaseActiveManagement: {
		normal: number;
		instrumental: number;
	}
	
}