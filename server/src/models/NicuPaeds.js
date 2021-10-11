import mongoose from 'mongoose';

const { Schema } = mongoose;

const nicuPaedsSchema = new Schema({
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

const NicuPaeds = mongoose.model('NicuPaeds', nicuPaedsSchema);
module.exports = NicuPaeds;


