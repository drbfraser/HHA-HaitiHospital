import faker from 'faker';
import User from '../models/User';
import NicuPaeds from '../models/NicuPaeds';
import Community from '../models/Community';

export const seedDepartments = async() => {
    let dateTime: Date = new Date();
    var month: number = dateTime.getUTCMonth() + 1;
    var year: number = dateTime.getUTCFullYear();
    //ONLY USED TO TEST - MUST REMOVE IF IN PROD:
    await NicuPaeds.deleteMany({});
    await Community.deleteMany({});

    console.log("seeding default Departments...");

    //TODO Rehab Department Default value creation:

    // NICU/Paeds Department Default value creation:
    var departmentId: number = 1;
    var departmentName: string = "nicupaeds";
    const originalNicuPaedsDocument = new NicuPaeds({departmentId,departmentName,month,year});
    await originalNicuPaedsDocument.save();


    //TODO Community
    departmentId = 2;
    departmentName = "community";
    const originalCommunityDocument = new Community({departmentId,departmentName, month, year});
    await originalCommunityDocument.save();

    //TODO Case Studies


    //Alim test for loop
    for (const key in originalNicuPaedsDocument) {
        console.log(key);
    }
    console.log("seeding default Department successful");
}

