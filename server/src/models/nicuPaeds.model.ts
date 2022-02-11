import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const nicuPaedsSchema = new Schema({
  // entry data
  month: { type: Number, required: true, min: 0 },
  year: { type: Number, required: true, min: 0 },
  departmentId: { type: Number, required: true, min: 0 },
  departmentName: { type: String, required: true },

  //patient data
  bedsAvailable: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
  bedDays: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
  patientDays: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
  hospitalized: {
    total: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
    nicu: { type: Number, default: 0 },
    paeds: { type: Number, default: 0 }
  },
  dischargedAlive: {
    total: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
    nicu: { type: Number, default: 0 },
    paeds: { type: Number, default: 0 }
  },
  diedBefore48hr: {
    total: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
    nicu: { type: Number, default: 0 },
    paeds: { type: Number, default: 0 }
  },
  diedAfter48hr: {
    total: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
    nicu: { type: Number, default: 0 },
    paeds: { type: Number, default: 0 }
  },
  daysHospitalized: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
  referrals: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
  transfers: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
  selfDischarge: {
    total: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
    cannotAfford: { type: Number, default: 0 },
    avoidedPaying: { type: Number, default: 0 },
    religiousCultural: { type: Number, default: 0 },
    personalFamily: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  stayedInWard: { type: Number, required: true, min: 0, default: 0 }, // MSPP required
  admissions: {
    total: { type: Number, required: true, min: 0, default: 0 }, // MSPP required

    comeFrom: {
      quarterMorin: { type: Number, default: 0 },
      capHaitian: { type: Number, default: 0 },
      departmentNord: { type: Number, default: 0 },
      otherDepartments: [Schema.Types.Mixed]
    },

    age: {
      extremelyPreterm: { type: Number, default: 0 }, // <28 Weeks
      veryPreterm: { type: Number, default: 0 }, // 28-32 weeks
      moderateToLatePreterm: { type: Number, default: 0 }, // 32-37 weeks
      fullTerm: { type: Number, default: 0 }, // 37+ weeks
      olderThanNeonate: { type: Number, default: 0 }, // >4 weeks old
      age4To5Weeks: { type: Number, default: 0 },
      age6To11Weeks: { type: Number, default: 0 },
      age12To18Weeks: { type: Number, default: 0 }
    },

    gender: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 }
    },

    mainCondition: {
      respiratoryArrest: { type: Number, default: 0 },
      traumaticInjury: { type: Number, default: 0 },
      septicShock: { type: Number, default: 0 },
      hypovolemicShock: { type: Number, default: 0 },
      seizuresOrConvulsions: { type: Number, default: 0 },
      poisoning: { type: Number, default: 0 },
      alteredMentalStatus: { type: Number, default: 0 },
      gastroenteritis: { type: Number, default: 0 },
      hemorrhage: { type: Number, default: 0 },
      hypothermia: { type: Number, default: 0 },
      cardiacCongenitalAnomaly: { type: Number, default: 0 },
      otherCongenitalAnomaly: { type: Number, default: 0 },
      malnutrition: { type: Number, default: 0 },
      meningitis: { type: Number, default: 0 },
      communityAcquiredPneumonia: { type: Number, default: 0 },
      aspirationPneumonia: { type: Number, default: 0 },
      moderatePrematurity: { type: Number, default: 0 },
      severePrematurity: { type: Number, default: 0 },
      otherMedical: [Schema.Types.Mixed]
    }
  },

  numberOfOutPatients: {
    total: { type: Number, required: true, min: 0, default: 0 }, // MSPP required

    age: {
      extremelyPreterm: { type: Number, default: 0 }, // <28 Weeks
      veryPreterm: { type: Number, default: 0 }, // 28-32 weeks
      moderateToLatePreterm: { type: Number, default: 0 }, // 32-37 weeks
      fullTerm: { type: Number, default: 0 }, // 37+ weeks
      olderThanNeonate: { type: Number, default: 0 }, // >4 weeks old
      age4To5Weeks: { type: Number, default: 0 },
      age6To11Weeks: { type: Number, default: 0 },
      age12To18Weeks: { type: Number, default: 0 }
    },

    gender: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 }
    },

    mainCondition: {
      respiratoryArrest: { type: Number, default: 0 },
      traumaticInjury: { type: Number, default: 0 },
      septicShock: { type: Number, default: 0 },
      hypovolemicShock: { type: Number, default: 0 },
      seizuresOrConvulsions: { type: Number, default: 0 },
      poisoning: { type: Number, default: 0 },
      alteredMentalStatus: { type: Number, default: 0 },
      gastroenteritis: { type: Number, default: 0 },
      hemorrhage: { type: Number, default: 0 },
      hypothermia: { type: Number, default: 0 },
      cardiacCongenitalAnomaly: { type: Number, default: 0 },
      otherCongenitalAnomaly: { type: Number, default: 0 },
      malnutrition: { type: Number, default: 0 },
      meningitis: { type: Number, default: 0 },
      communityAcquiredPneumonia: { type: Number, default: 0 },
      aspirationPneumonia: { type: Number, default: 0 },
      moderatePrematurity: { type: Number, default: 0 },
      severePrematurity: { type: Number, default: 0 },
      otherMedical: [Schema.Types.Mixed]
    }
  }
});

// TODO : validate data before inserting into schema
// export const validateData = (data) => {

// };

const NicuPaeds = mongoose.model('NicuPaeds', nicuPaedsSchema, 'Departments');
export default NicuPaeds;
