import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const communitySchema = new Schema({
  // entry data
  month: { type: Number, required: true, min: 0 },
  year: { type: Number, required: true, min: 0 },
  departmentId: { type: Number, required: true, min: 0 },
  departmentName: { type: String, required: true },

  deliveries: {
    lessThan15: { type: Number, default: 0 },
    from15To19: { type: Number, default: 0 },
    from20To24: { type: Number, default: 0 },
    from25To29: { type: Number, default: 0 },
    overThirty: { type: Number, default: 0 },
    ageUnknown: { type: Number, default: 0 }
  },

  births: {
    weightLow: { type: Number, default: 0 }, // weight < 1.5kg
    weightMedium: { type: Number, default: 0 }, // 1.5kg <= weight <= 2.5kg
    weightHigh: { type: Number, default: 0 }, // weight >= 2.5kg
    notWeighed: { type: Number, default: 0 },
    immediatelyBreastfed: { type: Number, default: 0 },
    skinToSkinTherapy: { type: Number, default: 0 }
  },

  postNatal: {
    breastfeedingVitaminA: { type: Number, default: 0 }, // Breastfeeding women receiving vitamin A
    breastfeedingMUAC: { type: Number, default: 0 }, // Breastfeeding women with MUAC <210mm
    breastfeedingMalnutrition: { type: Number, default: 0 }, // Breastfeeding women with malnutrition support
    domesticVisitsInThreeDays: { type: Number, default: 0 } // Domestic visits in 0-3 days
  },

  birthControl: {
    // not sure what the women/men means
    ocp: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 },
      cycleNum: { type: Number, default: 0 },
      cycleDaysOutOfStock: { type: Number, default: 0 }
    },
    patch: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 },
      cycleNum: { type: Number, default: 0 },
      cycleDaysOutOfStock: { type: Number, default: 0 }
    },
    depoInjection: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 },
      vialNum: { type: Number, default: 0 },
      vialDaysOutOfStock: { type: Number, default: 0 }
    },
    implant: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 },
      packNum: { type: Number, default: 0 },
      packDaysOutOfStock: { type: Number, default: 0 }
    },
    interUterineDevices: {
      // IUD
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 },
      pieceNum: { type: Number, default: 0 },
      pieceDaysOutOfStock: { type: Number, default: 0 }
    },
    vaginalRing: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 },
      pieceNum: { type: Number, default: 0 },
      pieceDaysOutOfStock: { type: Number, default: 0 }
    },
    breastfeedingAsBirthControl: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 }
    },
    femaleCondom: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 },
      pieceNum: { type: Number, default: 0 },
      pieceDaysOutOfStock: { type: Number, default: 0 }
    },
    sterlisation: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 }
    },
    maleCondom: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 }
    },
    vasectomy: {
      acceptantsUnder25: { type: Number, default: 0 },
      acceptants25AndPlus: { type: Number, default: 0 },
      totalUsersUnder25: { type: Number, default: 0 },
      totalUsers25AndPlus: { type: Number, default: 0 }
    },
    ccvSterlisation: { type: Number, default: 0 },
    ccvVasectomy: { type: Number, default: 0 }
  },

  vaccineManagement: {
    bcg: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    vpo: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    penta: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    rota: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    rr: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    dt: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    vpi: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    flu: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    dtp: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    covid19: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    }
  },

  consumables: {
    sab005ml: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    sab05ml: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    sdil2ml: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    sdil5ml: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    boitesSec: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    },
    coton: {
      quantityAvailableDuringMonth: { type: Number, default: 0 },
      balanceAtEndOfMonth: { type: Number, default: 0 },
      daysOutOfStock: { type: Number, default: 0 }
    }
  },

  vaccination: {
    bcg: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    vpo: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    vpo1: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    vpo2: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    rappelVpo: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    vpi: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    penta1: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    penta2: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    penta3: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    rota1: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    rota2: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    rr1: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    rr2: {
      girlsInst12To32Months: { type: Number, default: 0 },
      girlsComm12To32Months: { type: Number, default: 0 },
      boysInst12To32Months: { type: Number, default: 0 },
      boysComm12To32Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    pneumo1: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    pneumo2: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    pneumo3: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    dtpRappel: {
      girlsInst12To32Months: { type: Number, default: 0 },
      girlsComm12To32Months: { type: Number, default: 0 },
      boysInst12To32Months: { type: Number, default: 0 },
      boysComm12To32Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    ecv: {
      girlsInstUnder11Months: { type: Number, default: 0 },
      girlsCommUnder11Months: { type: Number, default: 0 },
      boysInstUnder11Months: { type: Number, default: 0 },
      boysCommUnder11Months: { type: Number, default: 0 },
      dosesUsed: { type: Number, default: 0 },
      dosesAdministered: { type: Number, default: 0 }
    },
    dt1Inst: { type: Number, default: 0 },
    dt2Inst: { type: Number, default: 0 }
  }
});

// TODO : validate data before inserting into schema
// export const validateData = (data) => {

// };

const Community = mongoose.model('Community', communitySchema, 'Departments');
export default Community;
