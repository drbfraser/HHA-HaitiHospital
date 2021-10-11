
export const TEST_NICU_REPORT_1_JSON = 
{
    "reportId": 1,
    "departmentId": 123,
    "createdOn": "2021-10-07T23:23:35.732Z",
    "createdByUserId": 123482,
    "lastUpdatedOn": "2021-10-07T23:23:35.732Z",
    "lastUpdatedByUserId": 123767,
    "bedsAvailable": 2,
    "bedDays": 2,
    "patientDays": 1,
    "hospitalized": {
      "total": 3,
      "nicu": 2,
      "paeds": 1
    },
    "dischargedAlive": {
      "total": 5,
      "nicu": 3,
      "paeds": 2
    },
    "diedBefore48hr": {
      "total": 4,
      "nicu": 2,
      "paeds": 2
    },
    "diedAfter48hr": {
      "total": 6,
      "nicu": 4,
      "paeds": 2
    },
    "daysHospitalized": 12,
    "referrals": 3,
    "transfers": 4,
    "selfDischarge": {
      "total": 6,
      "cannotAfford": 1,
      "avoidedPaying": 1,
      "religiousCultural": 2,
      "personalFamily": 0,
      "other": 1
    },
    "stayedInWard": 3,
    "admissions": {
      "total": 5,
      "comeFrom": {
        "quarterMorin": 1,
        "capHaitian": 1,
        "departmentNord": 2,
        "otherDepartments": [
          {
            "nameOfDepartment": "SFU",
            "numberOfPatients": 1
          }
        ]
      },
      "age": {
        "extremelyPreterm": 1,
        "veryPreterm": 0,
        "moderateToLatePreterm": 0,
        "fullTerm": 0,
        "olderThanNeonate": 0,
        "age4To5Weeks": 2,
        "age6To11Weeks": 0,
        "age12To18Weeks": 2
      },
      "gender": {
        "male": 3,
        "female": 2
      },
      "mainCondition": {
        "respiratoryArrest": 0,
        "traumaticInjury": 0,
        "septicShock": 0,
        "hypovolemicShock": 0,
        "seizuresOrConvulsions": 0,
        "poisoning": 1,
        "alteredMentalStatus": 0,
        "gastroenteritis": 1,
        "hemorrhage": 0,
        "hypothermia": 2,
        "cardiacCongenitalAnomaly": 0,
        "otherCongenitalAnomaly": 0,
        "malnutrition": 1,
        "meningitis": 1,
        "communityAcquiredPneumonia": 0,
        "aspirationPneumonia": 0,
        "moderatePrematurity": 0,
        "severePrematurity":2,
        "otherMedical": [
          {
            "nameOfCondition": "COVID",
            "numberOfPatients": 1
          }
        ]
      }
    },
    "numberOfOutPatients": {
      "total": 3,
      "age": {
        "extremelyPreterm": 0,
        "veryPreterm": 0,
        "moderateToLatePreterm": 0,
        "fullTerm": 1,
        "olderThanNeonate": 0,
        "age4To5Weeks": 0,
        "age6To11Weeks": 0,
        "age12To18Weeks": 2
      },
      "gender": {
        "male": 1,
        "female": 2
      },
      "mainCondition": {
        "respiratoryArrest": 0,
        "traumaticInjury": 0,
        "septicShock": 0,
        "hypovolemicShock": 0,
        "seizuresOrConvulsions": 0,
        "poisoning": 0,
        "alteredMentalStatus": 0,
        "gastroenteritis": 0,
        "hemorrhage": 1,
        "hypothermia":2,
        "cardiacCongenitalAnomaly": 0,
        "otherCongenitalAnomaly": 0,
        "malnutrition": 0,
        "meningitis": 0,
        "communityAcquiredPneumonia": 0,
        "aspirationPneumonia": 0,
        "moderatePrematurity": 1,
        "severePrematurity": 2,
        "otherMedical": [
          {
            "nameOfCondition": "COVID",
            "numberOfPatients": 1
          }
        ]
      }
    }
  }

export const TEST_NICU_REPORT_1_JSON_SHORT = {
    "reportId": 1,
    "departmentId": 123,
    "createdOn": "2021-10-07T23:23:35.732Z",
    "createdByUserId": 123482,
    "lastUpdatedOn": "2021-10-07T23:23:35.732Z",
    "lastUpdatedByUserId": 123767,
    "bedsAvailable": 2,
    "bedDays": 2,
    "patientDays": 1,
    "hospitalized": {
      "total": 3,
      "nicu": 2,
      "paeds": 1
    },
    "dischargedAlive": {
      "total": 5,
      "nicu": 3,
      "paeds": 2
    },
    "admissions": {
        "total": 5,
        "comeFrom": {
          "quarterMorin": 1,
          "capHaitian": 1,
          "departmentNord": 2,
          "otherDepartments": [
            {
              "nameOfDepartment": "SFU",
              "numberOfPatients": 1
            }
          ]
        },
    }    
}

export const TEST_NICU_REPORTS = [TEST_NICU_REPORT_1_JSON];
