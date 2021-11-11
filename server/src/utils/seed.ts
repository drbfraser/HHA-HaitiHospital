import faker from 'faker';

import User from '../models/User';

import NicuPaeds from '../models/NicuPaeds';
import Community from '../models/Community';

export const seedDb = async () => {
  console.log('Seeding users...');

  await User.deleteMany({});

  // create 5 users
  const usersPromises = [...Array(5).keys()].map((index, i) => {
    const user = new User({
      username: `user${index}`,
      password: '123456789',
      name: faker.name.findName(),
    });

    if (index === 0) {
      user.role = 'ADMIN';
    } else if (index === 1) {
      user.role = 'MED_DIR';
    } else if (index === 2) {
      user.role = 'DEPT_HEAD';
    }
    // user.registerUser(user, () => {});
    return user;
  });

  await Promise.all(
    usersPromises.map(async (user) => {
      await user.registerUser(user, () => {});
      // await user.save();
    }),
  );

  console.log('Users seeded');
};

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

  console.log("seeding default Department successful");
}

export const seedCaseStudies = async () => {
  // create 5 case studies
  
}