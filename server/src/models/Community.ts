export interface CommunityModel {
    deliveries: {
        lessThan15: number,
        from15To19: number,
        from20To24: number,
        from25To29: number,
        overThirty: number,
        ageUnknown: number,
    }

    births: {
        weightLow: number, // weight < 1.5kg
        weightMedium: number, // 1.5kg <= weight <= 2.5kg
        weightHigh: number, // weight >= 2.5kg
        notWeighed: number,
        immediatelyBreastfed: number,
        skinToSkinTherapy: number,
    }

    postNatal: {
        breastfeedingVitaminA: number, // Breastfeeding women receiving vitamin A
        breastfeedingMUAC: number, // Breastfeeding women with MUAC <210mm
        breastfeedingMalnutrition: number, // Breastfeeding women with malnutrition support
        domesticVisitsInThreeDays: number, // Domestic visits in 0-3 days
    }

    birthControl: { // not sure what the women/men means 
        ocp: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
            cycleNum: number,
            cycleDaysOutOfStock: number,
        },
        patch: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
            cycleNum: number,
            cycleDaysOutOfStock: number,
        },
        depoInjection: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
            vialNum: number,
            vialDaysOutOfStock: number,
        },
        implant: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
            packNum: number,
            packDaysOutOfStock: number,
        },
        interUterineDevices: { // IUD
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
            pieceNum: number,
            pieceDaysOutOfStock: number,
        },
        vaginalRing: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
            pieceNum: number,
            pieceDaysOutOfStock: number,
        },
        breastfeedingAsBirthControl: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
        },
        femaleCondom: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
            pieceNum: number,
            pieceDaysOutOfStock: number,
        },
        sterlisation: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
        },
        maleCondom: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
        },
        vasectomy: {
            acceptantsUnder25: number,
            acceptants25AndPlus: number,
            totalUsersUnder25: number,
            totalUsers25AndPlus: number,
        },
        ccvSterlisation: number,
        ccvVasectomy: number,
    }

    vaccineManagement: {
        bcg: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        vpo: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        penta: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        rota: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        rr: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        dt: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        vpi: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        flu: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        dtp: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        covid19: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
    }

    consumables: {
        sab005ml: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        sab05ml: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        sdil2ml: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        sdil5ml: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        boitesSec: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
        coton: {
            quantityAvailableDuringMonth: number,
            balanceAtEndOfMonth: number,
            daysOutOfStock: number,
        },
    }

    vaccination: {
        bcg: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        vpo: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        vpo1: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        vpo2: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        rappelVpo: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        vpi: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        penta1: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        penta2: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        penta3: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        rota1: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        rota2: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        rr1: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        rr2: {
            girlsInst12To32Months: number,
            girlsComm12To32Months: number,
            boysInst12To32Months: number,
            boysComm12To32Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        pneumo1: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        pneumo2: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        pneumo3: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        dtpRappel: {
            girlsInst12To32Months: number,
            girlsComm12To32Months: number,
            boysInst12To32Months: number,
            boysComm12To32Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        ecv: {
            girlsInstUnder11Months: number,
            girlsCommUnder11Months: number,
            boysInstUnder11Months: number,
            boysCommUnder11Months: number,
            dosesUsed: number,
            dosesAdministered: number,
        },
        dt1Inst: number,
        dt2Inst: number,
    }
}