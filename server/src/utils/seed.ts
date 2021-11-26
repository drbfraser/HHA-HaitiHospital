import faker from 'faker';

import User, { hashPassword, Role } from '../models/User';
import Department, { DepartmentName } from '../models/Leaderboard';

import NicuPaeds from '../models/NicuPaeds';
import Community from '../models/Community';

import MessageBody from '../models/MessageBody';
import CaseStudy from '../models/CaseStudies';

export const seedDb = async () => {
  console.log('Seeding users...');

  await User.collection.dropIndexes().catch(err => console.log(err));

  [...Array(6).keys()].forEach(async (index, i) => {
    var foundUser = await User.findOne({ username: `user${index}` });
    if (foundUser) {
      let role = undefined;
      let department = undefined;
      switch (index) {
        case 0: 
          role = Role.Admin;
          break;
        case 1:
          role = Role.MedicalDirector;
          break;
        case 2:
          role = Role.HeadOfDepartment;
          department = DepartmentName.NicuPaeds;
          break;
        case 3:
          role = Role.User;
          department = DepartmentName.Maternity;
          break;
        case 4:
          role = Role.User;
          department = DepartmentName.Rehab;
          break;
        case 5:
          role = Role.User;
          department = DepartmentName.CommunityHealth;
          break;
        default:
          break;
      }
      const updatedUser = { name: faker.name.findName(), role, department };
      await User.findOneAndUpdate({ username: `user${index}` }, { $set: updatedUser }, { new: true });

    } else {

      const user = new User({
        username: `user${index}`,
        password: '123456789',
        name: faker.name.findName(),
      });

      switch (index) {
        case 0:
          user.role = Role.Admin;
          break;
        case 1:
          user.role = Role.MedicalDirector;
          break;
        case 2:
          user.role = Role.HeadOfDepartment;
          user.department = DepartmentName.NicuPaeds;
          break;
        case 3:
          user.role = Role.User;
          user.department = DepartmentName.Maternity;
          break;
        case 4:
          user.role = Role.User;
          user.department = DepartmentName.Rehab;
          break;
        case 5:
          user.role = Role.User;
          user.department = DepartmentName.CommunityHealth;
          break;
        default:
          break;
      }

      user.registerUser(user, () => {});
    }
  });

  console.log('Users seeded');
};

export const seedDepartments = async() => {
  console.log("Seeding default departments...");

  let dateTime: Date = new Date();
  var month: number = dateTime.getUTCMonth() + 1;
  var year: number = dateTime.getUTCFullYear();
  //ONLY USED TO TEST - MUST REMOVE IF IN PROD:
  await NicuPaeds.deleteMany({});
  await Community.deleteMany({});

  //TODO Rehab Department Default value creation:

  // NICU/Paeds Department Default value creation:
  var departmentId: number = 1;
  var departmentName: string = "nicupaeds";
  const originalNicuPaedsDocument = new NicuPaeds({departmentId,departmentName,month,year});
  originalNicuPaedsDocument.save();


  //TODO Community
  departmentId = 2;
  departmentName = "community";
  const originalCommunityDocument = new Community({departmentId,departmentName, month, year});
  await originalCommunityDocument.save();

  console.log("Default departments seeded");
}

export const seedMessageBoard = async () => {
  console.log('Seeding message board...')
  await MessageBody.deleteMany({});

  // add 3 messages
  const message1 = new MessageBody({
    departmentId: 3,
    departmentName: DepartmentName.CommunityHealth,
    authorId: 1,
    name: faker.name.findName(),
    date: new Date(),
    messageBody: 'Everyone will get the day off on December 25th. Thank you.',
    messageHeader: 'Christmas',
  });

  const message2 = new MessageBody({
    departmentId: 0,
    departmentName: DepartmentName.NicuPaeds,
    authorId: 2,
    name: faker.name.findName(),
    date: new Date(),
    messageBody: 'Welcome to the message board!',
    messageHeader: 'Welcome',
  });

  const message3 = new MessageBody({
    departmentId: 1,
    departmentName: DepartmentName.Maternity,
    authorId: 3,
    name: faker.name.findName(),
    date: new Date(),
    messageBody: 'The case study is due this Friday. Please submit the case study form before the deadline',
    messageHeader: 'Case study due',
  });

  await message1.save();
  await message2.save();
  await message3.save();
  console.log('Message board seeded');
}

export const seedCaseStudies = async (user) => {
  console.log('Seeding case studies...')
  await CaseStudy.deleteMany({});

  const caseStudy1 = new CaseStudy({
    caseStudyType: 4,
    otherStory: {
      caseStudyStory: "This is a long story..."
    }
  });

  const caseStudy2 = new CaseStudy({
    caseStudyType: 2,
    trainingSession: {
      trainingDate: new Date(),
      trainingOn: "How to be a Jedi 101",
      whoConducted: "Master Yoda",
      whoAttended: "Luke Skywalker",
      benefitsFromTraining: "Learned how to be a Jedi",
      caseStudyStory: "Jedi training was the action of teaching an apprentice the ways of the Force in the Jedi Order. Under the Galactic Republic, Force-sensitive beings were brought to the Jedi Temple on Coruscant from across the galaxy and trained as Jedi younglings by Grand Master Yoda.",
    }
  });

  caseStudy1.save();
  await caseStudy2.save();
  console.log('Case studies seeded');
}

export const seedLeaderboard = async() => {
  await Department.deleteMany({});
  for (let key in DepartmentName) {
    let departmentName = DepartmentName[key];
    const department = new Department({
      name: departmentName,
    });
    department.save();
  }
}