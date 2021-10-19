import * as mongoose from 'mongoose';

const { Schema } = mongoose;

//
// INTERFACE
//
export interface INicuPaeds {
  departmentId: number;
  createdOn: Date;
  createdByUserId: number; //user Last Edited, or user created?
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


//
// SCHEMA
// 
const nicuPaedsSchema = new Schema<INicuPaeds>({
  // entry data
  departmentId: { type: Number, required: true, min: 0, },
  createdOn: { type: Date, required: true, },
  createdByUserId: { type: Number, required: true, min: 0, },
  lastUpdatedOn: { type: Date, required: true, },
  lastUpdatedByUserId: { type: Number, required: true, min: 0, },
  
  //patient data
  bedsAvailable: { type: Number, required: true, min: 0, }, // MSPP required
  bedDays: { type: Number, required: true, min: 0, }, // MSPP required
  patientDays: { type: Number, required: true, min: 0, }, // MSPP required  
  hospitalized: {
    total: { type: Number, required: true, min: 0, }, // MSPP required
    nicu: Number,
    paeds: Number,
  },
  dischargedAlive: {
    total: { type: Number, required: true, min: 0, }, // MSPP required
    nicu: Number,
    paeds: Number,
  },
  diedBefore48hr: {
    total: { type: Number, required: true, min: 0, }, // MSPP required
    nicu: Number,
    paeds: Number,
  },
  diedAfter48hr: {
    total: { type: Number, required: true, min: 0, }, // MSPP required
    nicu: Number,
    paeds: Number,
  },
  daysHospitalized: { type: Number, required: true, min: 0, }, // MSPP required
  referrals: { type: Number, required: true, min: 0, }, // MSPP required
  transfers: { type: Number, required: true, min: 0, }, // MSPP required
  selfDischarge: {
    total: { type: Number, required: true, min: 0, }, // MSPP required
    cannotAfford: Number,
    avoidedPaying: Number,
    religiousCultural: Number,
    personalFamily: Number,
    other: Number,
  },
  stayedInWard: { type: Number, required: true, min: 0, }, // MSPP required
  admissions: {
    total: { type: Number, required: true, min: 0, }, // MSPP required
    
    comeFrom: {
      quarterMorin: Number,
      capHaitian: Number,
      departmentNord: Number,
      otherDepartments: [Schema.Types.Mixed],
    },

    age: {
      extremelyPreterm: Number, // <28 Weeks
      veryPreterm: Number, // 28-32 weeks
      moderateToLatePreterm: Number, // 32-37 weeks
      fullTerm: Number, // 37+ weeks
      olderThanNeonate: Number, // >4 weeks old
      age4To5Weeks: Number,
      age6To11Weeks: Number,
      age12To18Weeks: Number, 
    },

    gender: {
      male: Number,
      female: Number,
    },

    mainCondition: {
      respiratoryArrest: Number,
      traumaticInjury: Number,
      septicShock: Number,
      hypovolemicShock: Number,
      seizuresOrConvulsions: Number,
      poisoning: Number,
      alteredMentalStatus: Number,
      gastroenteritis: Number,
      hemorrhage: Number,
      hypothermia: Number,
      cardiacCongenitalAnomaly: Number,
      otherCongenitalAnomaly: Number,
      malnutrition: Number,
      meningitis: Number,
      communityAcquiredPneumonia: Number,
      aspirationPneumonia: Number,
      moderatePrematurity: Number,
      severePrematurity: Number,
      otherMedical:[Schema.Types.Mixed],
    },
  },
    
  numberOfOutPatients: {
    total: { type: Number, required: true, min: 0, }, // MSPP required

    age: {
      extremelyPreterm: Number, // <28 Weeks
      veryPreterm: Number, // 28-32 weeks
      moderateToLatePreterm: Number, // 32-37 weeks
      fullTerm: Number, // 37+ weeks
      olderThanNeonate: Number, // >4 weeks old
      age4To5Weeks: Number,
      age6To11Weeks: Number,
      age12To18Weeks: Number, 
    },

    gender: {
      male: Number,
      female: Number,
    },

    mainCondition: {
      respiratoryArrest: Number,
      traumaticInjury: Number,
      septicShock: Number,
      hypovolemicShock: Number,
      seizuresOrConvulsions: Number,
      poisoning: Number,
      alteredMentalStatus: Number,
      gastroenteritis: Number,
      hemorrhage: Number,
      hypothermia: Number,
      cardiacCongenitalAnomaly: Number,
      otherCongenitalAnomaly: Number,
      malnutrition: Number,
      meningitis: Number,
      communityAcquiredPneumonia: Number,
      aspirationPneumonia: Number,
      moderatePrematurity: Number,
      severePrematurity: Number,
      otherMedical:[Schema.Types.Mixed],
    },
  },
});




// TODO : validate data before inserting into schema
// export const validateData = (data) => {
  
// };

const NicuPaeds = mongoose.model<INicuPaeds>('NicuPaeds', nicuPaedsSchema);
export default NicuPaeds;


