const router = require('express').Router();
const { number } = require('joi');
let NicuPaeds = require('../../models/NicuPaeds')


router.route('/').get((req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    NicuPaeds.find()
        .then(NicuPaeds=> res.json(NicuPaeds))
        .catch(err => res.status(400).json('Reports could not be found: ' + err));
});

router.route('/:id').delete((req,res) => {
    NicuPaeds.findByIdAndDelete(req.params.id)
        .then(() => res.json('Report deleted.'))
        .catch(err => res.status(400).json('Report could not be deleted: ' + err));
});

router.route('/add').post((req: any, res)=>{ //adding NICUPaeds Form into the Database
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    console.log("test");
    const departmentId = Number(req.body.departmentId);
    const createdOn = req.body.createdOn;
    const createdByUserId = Number(req.body.createdByUserId);
    const userId = Number(req.body.userId);
    const lastUpdatedOn = req.body.lastUpdatedOn;
    const lastUpdatedByUserId = Number(req.body.lastUpdatedByUserId);

    const bedsAvailable = Number(req.body.bedsAvailable);
    const bedDays = Number(req.body.bedDays);
    const patientDays = Number(req.body.patientDays);
    const hospitalized = {
        total : Number(req.body.hospitalized.total),
        nicu : Number(req.body.hospitalized?.nicu),
        paeds : Number(req.body.hospitalized?.paeds)
    };
    
    const dischargedAlive = {
        total : Number(req.body.dischargedAlive.total),
        nicu : Number(req.body.dischargedAlive?.nicu),
        paeds : Number(req.body.dischargedAlive?.paeds)
    };
    const diedBefore48hr = {
        total : Number(req.body.diedBefore48hr.total),
        nicu : Number(req.body.diedBefore48hr?.nicu),
        paeds : Number(req.body.diedBefore48hr?.paeds),
    };
    const diedAfter48hr = {
        total: Number(req.body.diedAfter48hr.total),
        nicu : Number(req.body.diedAfter48hr?.nicu),
        paeds : Number(req.body.diedAfter48hr?.paeds),
    };
    const daysHospitalized = Number(req.body.daysHospitalized);
    const referrals = Number(req.body.referrals);
    const transfers = Number(req.body.transfers);
    const selfDischarge = {
        total : Number(req.body.selfDischarge.total),
        cannotAfford : Number(req.body.selfDischarge?.cannotAfford),
        avoidedPaying : Number(req.body.selfDischarge?.avoidedPaying),
        religiousCultural: Number(req.body.selfDischarge?.religiousCultural), 
        personalFamily : Number(req.body.selfDischarge?.personalFamily),
        other : Number(req.body.selfDischarge?.other), 
    };
    const stayedInWard = Number(req.body.stayedInWard);
    const admissions = {
        total : Number(req.body.admissions.total),

        comeFrom : {
            quarterMorin : Number(req.body.admissions?.comeFrom?.quarterMorin),
            capHaitian : Number(req.body.admissions?.comeFrom?.capHaitian),
            departmentNord : Number(req.body.admissions?.comeFrom?.departmentNord),
            otherDepartments : [
                {
                    nameOfDepartment : req.body.admissions?.comeFrom?.otherDepartments[0]?.nameOfDepartment,
                    numberOfPatients: Number(req.body.admissions?.comeFrom?.otherDepartments[0]?.numberOfPatients)
                },
            ],
        },

        age : {
            extremelyPreterm : Number(req.body.admissions?.age?.extremelyPreterm),
            veryPreterm : Number(req.body.admissions?.age?.veryPreterm),
            moderateToLatePreterm : Number(req.body.admissions?.age?.moderateToLatePreterm),
            fullTerm : Number(req.body.admissions?.age?.fullTerm),
            olderThanNeonate : Number(req.body.admissions?.age?.olderThanNeonate),
            age4To5Weeks : Number(req.body.admissions?.age?.age4To5Weeks),
            age6To11Weeks : Number(req.body.admissions?.age?.age6To11Weeks),
            age12To18Weeks : Number(req.body.admissions?.age?.age12To18Weeks),
        },

        gender : {
            male : Number(req.body.admissions?.gender?.male),
            female : Number(req.body.admissions?.gender?.female),
        },

        mainCondition: {
            respiratoryArrest: Number(req.body.admissions?.mainCondition?.respiratoryArrest),
            traumaticInjury: Number(req.body.admissions?.mainCondition?.traumaticInjury),
            septicShock: Number(req.body.admissions?.mainCondition?.septicShock),
            hypovolemicShock: Number(req.body.admissions?.mainCondition?.hypovolemicShock),
            seizuresOrConvulsions: Number(req.body.admissions?.mainCondition?.seizuresOrConvulsions),
            poisoning: Number(req.body.admissions?.mainCondition?.poisoning),
            alteredMentalStatus: Number(req.body.admissions?.mainCondition?.alteredMentalStatus),
            gastroenteritis: Number(req.body.admissions?.mainCondition?.gastroenteritis),
            hemorrhage: Number(req.body.admissions?.mainCondition?.hemorrhage),
            hypothermia: Number(req.body.admissions?.mainCondition?.hypothermia),
            cardiacCongenitalAnomaly: Number(req.body.admissions?.mainCondition?.cardiacCongenitalAnomaly),
            otherCongenitalAnomaly: Number(req.body.admissions?.mainCondition?.otherCongenitalAnomaly),
            malnutrition: Number(req.body.admissions?.mainCondition?.malnutrition),
            meningitis: Number(req.body.admissions?.mainCondition?.meningitis),
            communityAcquiredPneumonia: Number(req.body.admissions?.mainCondition?.communityAcquiredPneumonia),
            aspirationPneumonia: Number(req.body.admissions?.mainCondition?.aspirationPneumonia),
            moderatePrematurity: Number(req.body.admissions?.mainCondition?.moderatePrematurity),
            severePrematuriy: Number(req.body.admissions?.mainCondition?.severePrematurity),
            otherMedical:[{
                nameOfCondition: req.body.admissions?.mainCondition?.otherMedical[0]?.nameOfCondition,
                numberOfPatients: Number(req.body.admissions?.mainCondition?.otherMedical[0]?.numberOfPatients),
            }],  
        },
    };

    const numberOfOutPatients = {
        total : Number(req.body.numberOfOutPatients.total),

        age : {
            extremelyPreterm : Number(req.body.numberOfOutPatients?.age?.extremelyPreterm),
            veryPreterm : Number(req.body.numberOfOutPatients?.age?.veryPreterm),
            moderateToLatePreterm : Number(req.body.numberOfOutPatients?.age?.moderateToLatePreterm),
            fullTerm : Number(req.body.numberOfOutPatients?.age?.fullTerm),
            olderThanNeonate : Number(req.body.numberOfOutPatients?.age?.olderThanNeonate),
            age4To5Weeks : Number(req.body.numberOfOutPatients?.age?.age4To5Weeks),
            age6To11Weeks : Number(req.body.numberOfOutPatients?.age?.age6To11Weeks),
            age12To18Weeks : Number(req.body.numberOfOutPatients?.age?.age12To18Weeks),
        },

        gender : {
            male : Number(req.body.numberOfOutPatients?.gender?.male),
            female : Number(req.body.numberOfOutPatients?.gender?.female),
        },

        mainCondition: {
            respiratoryArrest: Number(req.body.numberOfOutPatients?.mainCondition?.respiratoryArrest),
            traumaticInjury: Number(req.body.numberOfOutPatients?.mainCondition?.traumaticInjury),
            septicShock: Number(req.body.numberOfOutPatients?.mainCondition?.septicShock),
            hypovolemicShock: Number(req.body.numberOfOutPatients?.mainCondition?.hypovolemicShock),
            seizuresOrConvulsions: Number(req.body.numberOfOutPatients?.mainCondition?.seizuresOrConvulsions),
            poisoning: Number(req.body.numberOfOutPatients?.mainCondition?.poisoning),
            alteredMentalStatus: Number(req.body.numberOfOutPatients?.mainCondition?.alteredMentalStatus),
            gastroenteritis: Number(req.body.numberOfOutPatients?.mainCondition?.gastroenteritis),
            hemorrhage: Number(req.body.numberOfOutPatients?.mainCondition?.hemorrhage),
            hypothermia: Number(req.body.numberOfOutPatients?.mainCondition?.hypothermia),
            cardiacCongenitalAnomaly: Number(req.body.numberOfOutPatients?.mainCondition?.cardiacCongenitalAnomaly),
            otherCongenitalAnomaly: Number(req.body.numberOfOutPatients?.mainCondition?.otherCongenitalAnomaly),
            malnutrition: Number(req.body.numberOfOutPatients?.mainCondition?.malnutrition),
            meningitis: Number(req.body.numberOfOutPatients?.mainCondition?.meningitis),
            communityAcquiredPneumonia: Number(req.body.numberOfOutPatients?.mainCondition?.communityAcquiredPneumonia),
            aspirationPneumonia: Number(req.body.numberOfOutPatients?.mainCondition?.aspirationPneumonia),
            moderatePrematurity: Number(req.body.numberOfOutPatients?.mainCondition?.moderatePrematurity),
            severePrematuriy: Number(req.body.numberOfOutPatients?.mainCondition?.severePrematurity),
            otherMedical:[{
                nameOfCondition: req.body.numberOfOutPatients?.mainCondition?.otherMedical[0]?.nameOfCondition,
                numberOfPatients: Number(req.body.numberOfOutPatients?.mainCondition?.otherMedical[0]?.numberOfPatients),
            }],  
        },
    };


    const newNicuPaedsDocument = new NicuPaeds({
        departmentId,
        createdOn,
        createdByUserId,
        lastUpdatedOn,
        lastUpdatedByUserId,
        bedsAvailable,
        bedDays,
        patientDays,
        hospitalized,
        dischargedAlive,
        diedBefore48hr,
        diedAfter48hr,
        daysHospitalized,
        referrals,
        transfers,
        selfDischarge,
        stayedInWard,
        admissions,
        numberOfOutPatients
    });

    newNicuPaedsDocument.save()
        .then(() => res.json("Report has been successfully submitted"))
        .catch(err => res.status(400).json('Report did not successfully submit: ' + err));
})

export = router;