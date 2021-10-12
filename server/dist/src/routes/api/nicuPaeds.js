"use strict";
var router = require('express').Router();
var number = require('joi').number;
var NicuPaeds = require('../../models/NicuPaeds');
router.route('/').get(function (req, res) {
    NicuPaeds.find()
        .then(function (NicuPaeds) { return res.json(NicuPaeds); })
        .catch(function (err) { return res.status(400).json('Reports could not be found: ' + err); });
});
router.route('/:id').delete(function (req, res) {
    NicuPaeds.findByIdAndDelete(req.params.id)
        .then(function () { return res.json('Report deleted.'); })
        .catch(function (err) { return res.status(400).json('Report could not be deleted: ' + err); });
});
router.route('/add').post(function (req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111, _112, _113, _114, _115, _116, _117, _118, _119, _120, _121, _122, _123, _124;
    var departmentId = Number(req.body.departmentId);
    var createdOn = req.body.createdOn;
    var createdByUserId = Number(req.body.createdByUserId);
    var userId = Number(req.body.userId);
    var lastUpdatedOn = req.body.lastUpdatedOn;
    var lastUpdatedByUserId = Number(req.body.lastUpdatedByUserId);
    var bedsAvailable = Number(req.body.bedsAvailable);
    var bedDays = Number(req.body.bedDays);
    var patientDays = Number(req.body.patientDays);
    var hospitalized = {
        total: Number(req.body.hospitalized.total),
        nicu: Number((_a = req.body.hospitalized) === null || _a === void 0 ? void 0 : _a.nicu),
        paeds: Number((_b = req.body.hospitalized) === null || _b === void 0 ? void 0 : _b.paeds)
    };
    var dischargedAlive = {
        total: Number(req.body.dischargedAlive.total),
        nicu: Number((_c = req.body.dischargedAlive) === null || _c === void 0 ? void 0 : _c.nicu),
        paeds: Number((_d = req.body.dischargedAlive) === null || _d === void 0 ? void 0 : _d.paeds)
    };
    var diedBefore48hr = {
        total: Number(req.body.diedBefore48hr.total),
        nicu: Number((_e = req.body.diedBefore48hr) === null || _e === void 0 ? void 0 : _e.nicu),
        paeds: Number((_f = req.body.diedBefore48hr) === null || _f === void 0 ? void 0 : _f.paeds),
    };
    var diedAfter48hr = {
        total: Number(req.body.diedAfter48hr.total),
        nicu: Number((_g = req.body.diedAfter48hr) === null || _g === void 0 ? void 0 : _g.nicu),
        paeds: Number((_h = req.body.diedAfter48hr) === null || _h === void 0 ? void 0 : _h.paeds),
    };
    var daysHospitalized = Number(req.body.daysHospitalized);
    var referrals = Number(req.body.referrals);
    var transfers = Number(req.body.transfers);
    var selfDischarge = {
        total: Number(req.body.selfDischarge.total),
        cannotAfford: Number((_j = req.body.selfDischarge) === null || _j === void 0 ? void 0 : _j.cannotAfford),
        avoidedPaying: Number((_k = req.body.selfDischarge) === null || _k === void 0 ? void 0 : _k.avoidedPaying),
        religiousCultural: Number((_l = req.body.selfDischarge) === null || _l === void 0 ? void 0 : _l.religiousCultural),
        personalFamily: Number((_m = req.body.selfDischarge) === null || _m === void 0 ? void 0 : _m.personalFamily),
        other: Number((_o = req.body.selfDischarge) === null || _o === void 0 ? void 0 : _o.other),
    };
    var stayedInWard = Number(req.body.stayedInWard);
    var admissions = {
        total: Number(req.body.admissions.total),
        comeFrom: {
            quarterMorin: Number((_q = (_p = req.body.admissions) === null || _p === void 0 ? void 0 : _p.comeFrom) === null || _q === void 0 ? void 0 : _q.quarterMorin),
            capHaitian: Number((_s = (_r = req.body.admissions) === null || _r === void 0 ? void 0 : _r.comeFrom) === null || _s === void 0 ? void 0 : _s.capHaitian),
            departmentNord: Number((_u = (_t = req.body.admissions) === null || _t === void 0 ? void 0 : _t.comeFrom) === null || _u === void 0 ? void 0 : _u.departmentNord),
            otherDepartments: [
                {
                    nameOfDepartment: (_x = (_w = (_v = req.body.admissions) === null || _v === void 0 ? void 0 : _v.comeFrom) === null || _w === void 0 ? void 0 : _w.otherDepartments[0]) === null || _x === void 0 ? void 0 : _x.nameOfDepartment,
                    numberOfPatients: Number((_0 = (_z = (_y = req.body.admissions) === null || _y === void 0 ? void 0 : _y.comeFrom) === null || _z === void 0 ? void 0 : _z.otherDepartments[0]) === null || _0 === void 0 ? void 0 : _0.numberOfPatients)
                },
            ],
        },
        age: {
            extremelyPreterm: Number((_2 = (_1 = req.body.admissions) === null || _1 === void 0 ? void 0 : _1.age) === null || _2 === void 0 ? void 0 : _2.extremelyPreterm),
            veryPreterm: Number((_4 = (_3 = req.body.admissions) === null || _3 === void 0 ? void 0 : _3.age) === null || _4 === void 0 ? void 0 : _4.veryPreterm),
            moderateToLatePreterm: Number((_6 = (_5 = req.body.admissions) === null || _5 === void 0 ? void 0 : _5.age) === null || _6 === void 0 ? void 0 : _6.moderateToLatePreterm),
            fullTerm: Number((_8 = (_7 = req.body.admissions) === null || _7 === void 0 ? void 0 : _7.age) === null || _8 === void 0 ? void 0 : _8.fullTerm),
            olderThanNeonate: Number((_10 = (_9 = req.body.admissions) === null || _9 === void 0 ? void 0 : _9.age) === null || _10 === void 0 ? void 0 : _10.olderThanNeonate),
            age4To5Weeks: Number((_12 = (_11 = req.body.admissions) === null || _11 === void 0 ? void 0 : _11.age) === null || _12 === void 0 ? void 0 : _12.age4To5Weeks),
            age6To11Weeks: Number((_14 = (_13 = req.body.admissions) === null || _13 === void 0 ? void 0 : _13.age) === null || _14 === void 0 ? void 0 : _14.age6To11Weeks),
            age12To18Weeks: Number((_16 = (_15 = req.body.admissions) === null || _15 === void 0 ? void 0 : _15.age) === null || _16 === void 0 ? void 0 : _16.age12To18Weeks),
        },
        gender: {
            male: Number((_18 = (_17 = req.body.admissions) === null || _17 === void 0 ? void 0 : _17.gender) === null || _18 === void 0 ? void 0 : _18.male),
            female: Number((_20 = (_19 = req.body.admissions) === null || _19 === void 0 ? void 0 : _19.gender) === null || _20 === void 0 ? void 0 : _20.female),
        },
        mainCondition: {
            respiratoryArrest: Number((_22 = (_21 = req.body.admissions) === null || _21 === void 0 ? void 0 : _21.mainCondition) === null || _22 === void 0 ? void 0 : _22.respiratoryArrest),
            traumaticInjury: Number((_24 = (_23 = req.body.admissions) === null || _23 === void 0 ? void 0 : _23.mainCondition) === null || _24 === void 0 ? void 0 : _24.traumaticInjury),
            septicShock: Number((_26 = (_25 = req.body.admissions) === null || _25 === void 0 ? void 0 : _25.mainCondition) === null || _26 === void 0 ? void 0 : _26.septicShock),
            hypovolemicShock: Number((_28 = (_27 = req.body.admissions) === null || _27 === void 0 ? void 0 : _27.mainCondition) === null || _28 === void 0 ? void 0 : _28.hypovolemicShock),
            seizuresOrConvulsions: Number((_30 = (_29 = req.body.admissions) === null || _29 === void 0 ? void 0 : _29.mainCondition) === null || _30 === void 0 ? void 0 : _30.seizuresOrConvulsions),
            poisoning: Number((_32 = (_31 = req.body.admissions) === null || _31 === void 0 ? void 0 : _31.mainCondition) === null || _32 === void 0 ? void 0 : _32.poisoning),
            alteredMentalStatus: Number((_34 = (_33 = req.body.admissions) === null || _33 === void 0 ? void 0 : _33.mainCondition) === null || _34 === void 0 ? void 0 : _34.alteredMentalStatus),
            gastroenteritis: Number((_36 = (_35 = req.body.admissions) === null || _35 === void 0 ? void 0 : _35.mainCondition) === null || _36 === void 0 ? void 0 : _36.gastroenteritis),
            hemorrhage: Number((_38 = (_37 = req.body.admissions) === null || _37 === void 0 ? void 0 : _37.mainCondition) === null || _38 === void 0 ? void 0 : _38.hemorrhage),
            hypothermia: Number((_40 = (_39 = req.body.admissions) === null || _39 === void 0 ? void 0 : _39.mainCondition) === null || _40 === void 0 ? void 0 : _40.hypothermia),
            cardiacCongenitalAnomaly: Number((_42 = (_41 = req.body.admissions) === null || _41 === void 0 ? void 0 : _41.mainCondition) === null || _42 === void 0 ? void 0 : _42.cardiacCongenitalAnomaly),
            otherCongenitalAnomaly: Number((_44 = (_43 = req.body.admissions) === null || _43 === void 0 ? void 0 : _43.mainCondition) === null || _44 === void 0 ? void 0 : _44.otherCongenitalAnomaly),
            malnutrition: Number((_46 = (_45 = req.body.admissions) === null || _45 === void 0 ? void 0 : _45.mainCondition) === null || _46 === void 0 ? void 0 : _46.malnutrition),
            meningitis: Number((_48 = (_47 = req.body.admissions) === null || _47 === void 0 ? void 0 : _47.mainCondition) === null || _48 === void 0 ? void 0 : _48.meningitis),
            communityAcquiredPneumonia: Number((_50 = (_49 = req.body.admissions) === null || _49 === void 0 ? void 0 : _49.mainCondition) === null || _50 === void 0 ? void 0 : _50.communityAcquiredPneumonia),
            aspirationPneumonia: Number((_52 = (_51 = req.body.admissions) === null || _51 === void 0 ? void 0 : _51.mainCondition) === null || _52 === void 0 ? void 0 : _52.aspirationPneumonia),
            moderatePrematurity: Number((_54 = (_53 = req.body.admissions) === null || _53 === void 0 ? void 0 : _53.mainCondition) === null || _54 === void 0 ? void 0 : _54.moderatePrematurity),
            severePrematuriy: Number((_56 = (_55 = req.body.admissions) === null || _55 === void 0 ? void 0 : _55.mainCondition) === null || _56 === void 0 ? void 0 : _56.severePrematurity),
            otherMedical: [{
                    nameOfCondition: (_59 = (_58 = (_57 = req.body.admissions) === null || _57 === void 0 ? void 0 : _57.mainCondition) === null || _58 === void 0 ? void 0 : _58.otherMedical[0]) === null || _59 === void 0 ? void 0 : _59.nameOfCondition,
                    numberOfPatients: Number((_62 = (_61 = (_60 = req.body.admissions) === null || _60 === void 0 ? void 0 : _60.mainCondition) === null || _61 === void 0 ? void 0 : _61.otherMedical[0]) === null || _62 === void 0 ? void 0 : _62.numberOfPatients),
                }],
        },
    };
    var numberOfOutPatients = {
        total: Number(req.body.numberOfOutPatients.total),
        age: {
            extremelyPreterm: Number((_64 = (_63 = req.body.numberOfOutPatients) === null || _63 === void 0 ? void 0 : _63.age) === null || _64 === void 0 ? void 0 : _64.extremelyPreterm),
            veryPreterm: Number((_66 = (_65 = req.body.numberOfOutPatients) === null || _65 === void 0 ? void 0 : _65.age) === null || _66 === void 0 ? void 0 : _66.veryPreterm),
            moderateToLatePreterm: Number((_68 = (_67 = req.body.numberOfOutPatients) === null || _67 === void 0 ? void 0 : _67.age) === null || _68 === void 0 ? void 0 : _68.moderateToLatePreterm),
            fullTerm: Number((_70 = (_69 = req.body.numberOfOutPatients) === null || _69 === void 0 ? void 0 : _69.age) === null || _70 === void 0 ? void 0 : _70.fullTerm),
            olderThanNeonate: Number((_72 = (_71 = req.body.numberOfOutPatients) === null || _71 === void 0 ? void 0 : _71.age) === null || _72 === void 0 ? void 0 : _72.olderThanNeonate),
            age4To5Weeks: Number((_74 = (_73 = req.body.numberOfOutPatients) === null || _73 === void 0 ? void 0 : _73.age) === null || _74 === void 0 ? void 0 : _74.age4To5Weeks),
            age6To11Weeks: Number((_76 = (_75 = req.body.numberOfOutPatients) === null || _75 === void 0 ? void 0 : _75.age) === null || _76 === void 0 ? void 0 : _76.age6To11Weeks),
            age12To18Weeks: Number((_78 = (_77 = req.body.numberOfOutPatients) === null || _77 === void 0 ? void 0 : _77.age) === null || _78 === void 0 ? void 0 : _78.age12To18Weeks),
        },
        gender: {
            male: Number((_80 = (_79 = req.body.numberOfOutPatients) === null || _79 === void 0 ? void 0 : _79.gender) === null || _80 === void 0 ? void 0 : _80.male),
            female: Number((_82 = (_81 = req.body.numberOfOutPatients) === null || _81 === void 0 ? void 0 : _81.gender) === null || _82 === void 0 ? void 0 : _82.female),
        },
        mainCondition: {
            respiratoryArrest: Number((_84 = (_83 = req.body.numberOfOutPatients) === null || _83 === void 0 ? void 0 : _83.mainCondition) === null || _84 === void 0 ? void 0 : _84.respiratoryArrest),
            traumaticInjury: Number((_86 = (_85 = req.body.numberOfOutPatients) === null || _85 === void 0 ? void 0 : _85.mainCondition) === null || _86 === void 0 ? void 0 : _86.traumaticInjury),
            septicShock: Number((_88 = (_87 = req.body.numberOfOutPatients) === null || _87 === void 0 ? void 0 : _87.mainCondition) === null || _88 === void 0 ? void 0 : _88.septicShock),
            hypovolemicShock: Number((_90 = (_89 = req.body.numberOfOutPatients) === null || _89 === void 0 ? void 0 : _89.mainCondition) === null || _90 === void 0 ? void 0 : _90.hypovolemicShock),
            seizuresOrConvulsions: Number((_92 = (_91 = req.body.numberOfOutPatients) === null || _91 === void 0 ? void 0 : _91.mainCondition) === null || _92 === void 0 ? void 0 : _92.seizuresOrConvulsions),
            poisoning: Number((_94 = (_93 = req.body.numberOfOutPatients) === null || _93 === void 0 ? void 0 : _93.mainCondition) === null || _94 === void 0 ? void 0 : _94.poisoning),
            alteredMentalStatus: Number((_96 = (_95 = req.body.numberOfOutPatients) === null || _95 === void 0 ? void 0 : _95.mainCondition) === null || _96 === void 0 ? void 0 : _96.alteredMentalStatus),
            gastroenteritis: Number((_98 = (_97 = req.body.numberOfOutPatients) === null || _97 === void 0 ? void 0 : _97.mainCondition) === null || _98 === void 0 ? void 0 : _98.gastroenteritis),
            hemorrhage: Number((_100 = (_99 = req.body.numberOfOutPatients) === null || _99 === void 0 ? void 0 : _99.mainCondition) === null || _100 === void 0 ? void 0 : _100.hemorrhage),
            hypothermia: Number((_102 = (_101 = req.body.numberOfOutPatients) === null || _101 === void 0 ? void 0 : _101.mainCondition) === null || _102 === void 0 ? void 0 : _102.hypothermia),
            cardiacCongenitalAnomaly: Number((_104 = (_103 = req.body.numberOfOutPatients) === null || _103 === void 0 ? void 0 : _103.mainCondition) === null || _104 === void 0 ? void 0 : _104.cardiacCongenitalAnomaly),
            otherCongenitalAnomaly: Number((_106 = (_105 = req.body.numberOfOutPatients) === null || _105 === void 0 ? void 0 : _105.mainCondition) === null || _106 === void 0 ? void 0 : _106.otherCongenitalAnomaly),
            malnutrition: Number((_108 = (_107 = req.body.numberOfOutPatients) === null || _107 === void 0 ? void 0 : _107.mainCondition) === null || _108 === void 0 ? void 0 : _108.malnutrition),
            meningitis: Number((_110 = (_109 = req.body.numberOfOutPatients) === null || _109 === void 0 ? void 0 : _109.mainCondition) === null || _110 === void 0 ? void 0 : _110.meningitis),
            communityAcquiredPneumonia: Number((_112 = (_111 = req.body.numberOfOutPatients) === null || _111 === void 0 ? void 0 : _111.mainCondition) === null || _112 === void 0 ? void 0 : _112.communityAcquiredPneumonia),
            aspirationPneumonia: Number((_114 = (_113 = req.body.numberOfOutPatients) === null || _113 === void 0 ? void 0 : _113.mainCondition) === null || _114 === void 0 ? void 0 : _114.aspirationPneumonia),
            moderatePrematurity: Number((_116 = (_115 = req.body.numberOfOutPatients) === null || _115 === void 0 ? void 0 : _115.mainCondition) === null || _116 === void 0 ? void 0 : _116.moderatePrematurity),
            severePrematuriy: Number((_118 = (_117 = req.body.numberOfOutPatients) === null || _117 === void 0 ? void 0 : _117.mainCondition) === null || _118 === void 0 ? void 0 : _118.severePrematurity),
            otherMedical: [{
                    nameOfCondition: (_121 = (_120 = (_119 = req.body.numberOfOutPatients) === null || _119 === void 0 ? void 0 : _119.mainCondition) === null || _120 === void 0 ? void 0 : _120.otherMedical[0]) === null || _121 === void 0 ? void 0 : _121.nameOfCondition,
                    numberOfPatients: Number((_124 = (_123 = (_122 = req.body.numberOfOutPatients) === null || _122 === void 0 ? void 0 : _122.mainCondition) === null || _123 === void 0 ? void 0 : _123.otherMedical[0]) === null || _124 === void 0 ? void 0 : _124.numberOfPatients),
                }],
        },
    };
    var newNicuPaedsDocument = new NicuPaeds({
        departmentId: departmentId,
        createdOn: createdOn,
        createdByUserId: createdByUserId,
        lastUpdatedOn: lastUpdatedOn,
        lastUpdatedByUserId: lastUpdatedByUserId,
        bedsAvailable: bedsAvailable,
        bedDays: bedDays,
        patientDays: patientDays,
        hospitalized: hospitalized,
        dischargedAlive: dischargedAlive,
        diedBefore48hr: diedBefore48hr,
        diedAfter48hr: diedAfter48hr,
        daysHospitalized: daysHospitalized,
        referrals: referrals,
        transfers: transfers,
        selfDischarge: selfDischarge,
        stayedInWard: stayedInWard,
        admissions: admissions,
        numberOfOutPatients: numberOfOutPatients
    });
    newNicuPaedsDocument.save()
        .then(function () { return res.json("Report has been successfully submitted"); })
        .catch(function (err) { return res.status(400).json('Report did not successfully submit: ' + err); });
});
module.exports = router;
