"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = __importStar(require("mongoose"));
var Schema = mongoose.Schema;
var nicuPaedsSchema = new Schema({
    // entry data
    departmentId: { type: Number, required: true, min: 0, },
    createdOn: { type: Date, required: true, },
    createdByUserId: { type: Number, required: true, min: 0, },
    lastUpdatedOn: { type: Date, required: true, },
    lastUpdatedByUserId: { type: Number, required: true, min: 0, },
    //patient data
    bedsAvailable: { type: Number, required: true, min: 0, },
    bedDays: { type: Number, required: true, min: 0, },
    patientDays: { type: Number, required: true, min: 0, },
    hospitalized: {
        total: { type: Number, required: true, min: 0, },
        nicu: Number,
        paeds: Number,
    },
    dischargedAlive: {
        total: { type: Number, required: true, min: 0, },
        nicu: Number,
        paeds: Number,
    },
    diedBefore48hr: {
        total: { type: Number, required: true, min: 0, },
        nicu: Number,
        paeds: Number,
    },
    diedAfter48hr: {
        total: { type: Number, required: true, min: 0, },
        nicu: Number,
        paeds: Number,
    },
    daysHospitalized: { type: Number, required: true, min: 0, },
    referrals: { type: Number, required: true, min: 0, },
    transfers: { type: Number, required: true, min: 0, },
    selfDischarge: {
        total: { type: Number, required: true, min: 0, },
        cannotAfford: Number,
        avoidedPaying: Number,
        religiousCultural: Number,
        personalFamily: Number,
        other: Number,
    },
    stayedInWard: { type: Number, required: true, min: 0, },
    admissions: {
        total: { type: Number, required: true, min: 0, },
        comeFrom: {
            quarterMorin: Number,
            capHaitian: Number,
            departmentNord: Number,
            otherDepartments: [Schema.Types.Mixed],
        },
        age: {
            extremelyPreterm: Number,
            veryPreterm: Number,
            moderateToLatePreterm: Number,
            fullTerm: Number,
            olderThanNeonate: Number,
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
            otherMedical: [Schema.Types.Mixed],
        },
    },
    numberOfOutPatients: {
        total: { type: Number, required: true, min: 0, },
        age: {
            extremelyPreterm: Number,
            veryPreterm: Number,
            moderateToLatePreterm: Number,
            fullTerm: Number,
            olderThanNeonate: Number,
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
            otherMedical: [Schema.Types.Mixed],
        },
    },
});
// TODO : validate data before inserting into schema
// export const validateData = (data) => {
// };
var NicuPaeds = mongoose.model('NicuPaeds', nicuPaedsSchema);
module.exports = NicuPaeds;
