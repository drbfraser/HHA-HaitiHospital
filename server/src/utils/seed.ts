import faker from 'faker';

import User, { hashPassword, Role } from '../models/User';
import Department, { DepartmentName } from '../models/Leaderboard';

import NicuPaeds from '../models/NicuPaeds';
import Community from '../models/Community';

import MessageBody from '../models/MessageBody';
import CaseStudy, { CaseStudyOptions } from '../models/CaseStudies';

export const seedDb = async () => {
  await seedUsers();

  seedCaseStudies();
  seedDepartments();
  seedMessageBoard();
  seedLeaderboard();
};

export const seedUsers = async() => {
  console.log('Seeding users...');

  try {
    await User.collection.dropIndexes();

    [...Array(6).keys()].forEach(async (index, i) => {
      var foundUser = await User.findOne({ username: `user${index}` });
      if (foundUser) {
        switch (index) {
          case 0: 
            foundUser.role = Role.Admin;
            foundUser.department = undefined;
            break;
          case 1:
            foundUser.role = Role.MedicalDirector;
            foundUser.department = undefined;
            break;
          case 2:
            foundUser.role = Role.HeadOfDepartment;
            foundUser.department = DepartmentName.NicuPaeds;
            break;
          case 3:
            foundUser.role = Role.User;
            foundUser.department = DepartmentName.Maternity;
            break;
          case 4:
            foundUser.role = Role.User;
            foundUser.department = DepartmentName.Rehab;
            break;
          case 5:
            foundUser.role = Role.User;
            foundUser.department = DepartmentName.CommunityHealth;
            break;
          default:
            break;
        }
        foundUser.save();

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

        await user.registerUser(user, () => {});
      }
    });

    console.log('Users seeded');
  } catch (err) {
    console.log(err);
  }
}

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
  await originalNicuPaedsDocument.save();


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

  message1.save();
  message2.save();
  message3.save();
  console.log('Message board seeded');
}

export const seedCaseStudies = async () => {
  console.log('Seeding case studies...')

  try {
    await CaseStudy.deleteMany({});
  
    const users = await User.find();
    users.map(async (user, index) => {
      var caseStudy;
      switch (user.username) {
        case "user2":
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.PatientStory,
            user: user.id,
            userDepartment: user.department,
            imgPath: "public/images/case1.jpg",
            patientStory: {
              patientsName: faker.name.findName(),
              patientsAge: faker.random.number({ 'min': 10, 'max': 50 }),
              whereIsThePatientFrom: faker.lorem.words(),
              whyComeToHcbh: faker.lorem.sentences(),
              howLongWereTheyAtHcbh: faker.lorem.words(),
              diagnosis: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10),
            }
          });
          caseStudy.save();
          break;
        case "user3":
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.StaffRecognition,
            user: user.id,
            userDepartment: user.department,
            imgPath: "public/images/case2.jpg",
            staffRecognition: {
              staffName: faker.name.findName(),
              jobTitle: faker.lorem.words(),
              department: faker.lorem.words(),
              howLongWorkingAtHcbh: faker.lorem.words(),
              mostEnjoy: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10),
            }
          });
          caseStudy.save();
          break;
        case "user4":
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.TrainingSession,
            user: user.id,
            userDepartment: user.department,
            trainingSession: {
              trainingDate: faker.date.recent(),
              trainingOn: faker.lorem.sentences(),
              whoConducted: faker.name.findName(),
              whoAttended: faker.name.findName(),
              benefitsFromTraining: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10),
            }
          });
          caseStudy.save();
          break;
        case "user5":
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.EquipmentReceived,
            user: user.id,
            userDepartment: user.department,
            equipmentReceived: {
              equipmentReceived: faker.lorem.words(),
              departmentReceived: faker.lorem.words(),
              whoSentEquipment: faker.name.findName(),
              purchasedOrDonated: faker.lorem.words(),
              whatDoesEquipmentDo: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10),
            }
          });
          caseStudy.save();
          break;
        default:
          break;
      }
    });
  
    console.log('Case studies seeded');
  } catch (err) {
    console.log(err);
  }
}

export const seedLeaderboard = async() => {
  console.log('Seeding leaderboard...');
  try {
    await Department.deleteMany({});
    for (let key in DepartmentName) {
      let departmentName = DepartmentName[key];
      const department = new Department({
        name: departmentName,
      });
      department.save();
    }
    console.log('Leaderboard seeded');
  } catch (err) {
    console.log(err);
  }
}