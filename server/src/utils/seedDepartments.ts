import faker from 'faker';
import User from '../models/User';
let NicuPaeds = require('../models/NicuPaeds');
let Community = require('../models/Community');

export const seedDepartments = async() => {

    //ONLY USED TO TEST - MUST REMOVE IF IN PROD:
    await NicuPaeds.deleteMany({});

    console.log("seeding default Departments...");

    //TODO Rehab Department Default value creation:

    // NICU/Paeds Department Default value creation:
    var departmentId: number = 1;
    var departmentName: string = "nicupaeds";
    const originalNicuPaedsDocument = new NicuPaeds({departmentId,departmentName});
    await originalNicuPaedsDocument.save();


    //TODO Community
    departmentId = 2;
    departmentName = "community";
    const originalCommunityDocument = new Community({departmentId,departmentName});
    await originalCommunityDocument.save();

    //TODO Case Studies

    console.log("seeding default Department successful");
}

