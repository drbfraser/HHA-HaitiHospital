import faker from 'faker';

import User from '../models/User';
import Department, { DepartmentName } from '../models/Leaderboard';
import Message from '../models/Message';
import { deleteAllAvatars } from './utils';

import NicuPaeds from '../models/NicuPaeds';
import Community from '../models/Community';

import MessageBody from '../models/MessageBody';
import CaseStudy from '../models/CaseStudies';

export const seedDb = async () => {
  console.log('Seeding users...');

  await User.deleteMany({});
  await User.collection.dropIndexes().catch(err => console.log(err));
  // await Message.deleteMany({});
  // await deleteAllAvatars(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

  // create users
  const usersPromises = [...Array(6).keys()].map((index, i) => {
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
      user.department = DepartmentName.NicuPaeds;
    } else if (index === 3) {
      user.department = DepartmentName.Maternity;
    } else if (index === 4) {
      user.department = DepartmentName.Rehab;
    } else if (index === 5) {
      user.department = DepartmentName.CommunityHealth;
    }
    user.registerUser(user, () => {});
    return user;
  });

  // await Promise.all(
  //   usersPromises.map(async (user) => {
  //     user.registerUser(user, () => {});
  //     // await user.save();
  //   }),
  // );

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
    departmentName: 'Community Health',
    authorId: 1,
    name: faker.name.findName(),
    date: new Date(),
    messageBody: 'Everyone will get the day off on December 25th. Thank you.',
    messageHeader: 'Christmas',
  });

  const message2 = new MessageBody({
    departmentId: 0,
    departmentName: 'NICU PAEDS',
    authorId: 2,
    name: faker.name.findName(),
    date: new Date(),
    messageBody: 'Welcome to the message board!',
    messageHeader: 'Welcome',
  });

  const message3 = new MessageBody({
    departmentId: 1,
    departmentName: 'Maternity',
    authorId: 3,
    name: faker.name.findName(),
    date: new Date(),
    messageBody: 'The case study is due this Friday. Please submit the case study form before the deadline',
    messageHeader: 'Case study due',
  });

  message1.save();
  message2.save();
  await message3.save();
  console.log('Message board seeded');
}

export const seedCaseStudies = async () => {
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
  };
}