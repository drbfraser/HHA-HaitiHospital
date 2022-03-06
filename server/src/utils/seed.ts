import faker from 'faker';
import User, { Role } from '../models/user';
import Department from '../models/leaderboard';
import { DepartmentName } from '../common/definitions/departments';
import NicuPaeds from '../models/nicuPaeds';
import Community from '../models/community';
import MessageBody from '../models/messageBoard';
import CaseStudy, { CaseStudyOptions } from '../models/caseStudies';
import BioMech, { bioMechEnum } from '../models/bioMech';
import EmployeeOfTheMonth from 'models/employeeOfTheMonth';

import * as ENV from './processEnv';

export const seedDb = async () => {
  //   await User.deleteMany({});
  // TODO: Remove delete many when in prod
  await MessageBody.deleteMany({});
  await CaseStudy.deleteMany({});

  //   await seedUsers();
  await seedCaseStudies();
  await seedDepartments();
  await seedMessageBoard();
  await seedLeaderboard();
  await seedBioMech();
  await seedEmployeeOfTheMonth();
  console.log('Database seeding completed.');
};

export const seedUsers = async () => {
  console.log('Seeding users...');

  try {
    // Delete seeded users on server start so we can reseed them.
    // await User.collection.dropIndexes();

    [...Array(7).keys()].forEach(async (index, i) => {
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
          case 6:
            foundUser.role = Role.User;
            foundUser.department = DepartmentName.NicuPaeds;
            break;
          default:
            break;
        }
        foundUser.save();
      } else {
        const user = new User({
          username: `user${index}`,
          password: ENV.PASSWORD_SEED,
          name: faker.name.findName()
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
          case 6:
            user.role = Role.User;
            user.department = DepartmentName.NicuPaeds;
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
};

export const seedDepartments = async () => {
  console.log('Seeding default departments...');

  let dateTime: Date = new Date();
  var month: number = dateTime.getUTCMonth() + 1;
  var year: number = dateTime.getUTCFullYear();
  //ONLY USED TO TEST - MUST REMOVE IF IN PROD:
  await NicuPaeds.deleteMany({});
  await Community.deleteMany({});

  //TODO Rehab Department Default value creation:

  // NICU/Paeds Department Default value creation:
  var departmentId: number = 1;
  var departmentName: string = 'nicupaeds';
  const originalNicuPaedsDocument = new NicuPaeds({ departmentId, departmentName, month, year });
  await originalNicuPaedsDocument.save();

  //TODO Community
  departmentId = 2;
  departmentName = 'community';
  const originalCommunityDocument = new Community({ departmentId, departmentName, month, year });
  await originalCommunityDocument.save();

  console.log('Default departments seeded');
};

export const seedMessageBoard = async () => {
  console.log('Seeding message board...');

  const users = await User.find();
  users.map(async (user, index) => {
    let message;
    switch (user.username) {
      case 'user2':
        message = new MessageBody({
          departmentId: 1,
          departmentName: user.department,
          userId: user.id,
          date: new Date(),
          messageBody: 'Everyone will get the day off on December 25th. Thank you.',
          messageHeader: 'Christmas'
        });
        message.save();
        break;
      case 'user3':
        message = new MessageBody({
          departmentId: 3,
          departmentName: user.department,
          userId: user.id,
          date: new Date(),
          messageBody: 'Welcome to the message board!',
          messageHeader: 'Welcome'
        });
        message.save();
        break;
      case 'user4':
        message = new MessageBody({
          departmentId: 0,
          departmentName: user.department,
          userId: user.id,
          date: new Date(),
          messageBody: 'The case study is due this Friday. Please submit the case study form before the deadline',
          messageHeader: 'Case study due'
        });
        message.save();
        break;
      case 'user5':
        message = new MessageBody({
          departmentId: 2,
          departmentName: user.department,
          userId: user.id,
          date: new Date(),
          messageBody: 'There is a holiday tomorrow, the hospital is closed.',
          messageHeader: 'Hospital Closed'
        });
        message.save();
        break;
      default:
        break;
    }
  });
  console.log('Message board seeded');
};

export const seedCaseStudies = async () => {
  console.log('Seeding case studies...');

  try {
    const users = await User.find();
    users.map(async (user, index) => {
      let caseStudy;
      switch (user.username) {
        case 'user2':
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.PatientStory,
            user: user.id,
            userDepartment: user.department,
            imgPath: 'public/images/case1.jpg',
            featured: true,
            patientStory: {
              patientsName: faker.name.findName(),
              patientsAge: faker.random.number({ min: 10, max: 50 }),
              whereIsThePatientFrom: faker.lorem.words(),
              whyComeToHcbh: faker.lorem.sentences(),
              howLongWereTheyAtHcbh: faker.lorem.words(),
              diagnosis: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10)
            }
          });
          caseStudy.save();
          break;
        case 'user3':
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.StaffRecognition,
            user: user.id,
            userDepartment: user.department,
            imgPath: 'public/images/case2.jpg',
            featured: false,
            staffRecognition: {
              staffName: faker.name.findName(),
              jobTitle: faker.lorem.words(),
              department: faker.lorem.words(),
              howLongWorkingAtHcbh: faker.lorem.words(),
              mostEnjoy: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10)
            }
          });
          caseStudy.save();
          break;
        case 'user4':
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.TrainingSession,
            user: user.id,
            userDepartment: user.department,
            imgPath: 'public/images/case2.jpg',
            featured: false,
            trainingSession: {
              trainingDate: faker.date.recent(),
              trainingOn: faker.lorem.sentences(),
              whoConducted: faker.name.findName(),
              whoAttended: faker.name.findName(),
              benefitsFromTraining: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10)
            }
          });
          caseStudy.save();
          break;
        case 'user5':
          caseStudy = new CaseStudy({
            caseStudyType: CaseStudyOptions.EquipmentReceived,
            user: user.id,
            userDepartment: user.department,
            imgPath: 'public/images/case2.jpg',
            featured: false,
            equipmentReceived: {
              equipmentReceived: faker.lorem.words(),
              departmentReceived: faker.lorem.words(),
              whoSentEquipment: faker.name.findName(),
              purchasedOrDonated: faker.lorem.words(),
              whatDoesEquipmentDo: faker.lorem.sentences(),
              caseStudyStory: faker.lorem.paragraph(10)
            }
          });
          caseStudy.save();
          break;
        default:
          break;
      }
    });

    console.log('Case studies seeded');
  } catch (err: any) {
    console.log(err);
  }
};

export const seedLeaderboard = async () => {
  console.log('Seeding leaderboard...');
  try {
    await Department.deleteMany({});
    for (let key in DepartmentName) {
      let departmentName = DepartmentName[key];
      const department = new Department({
        name: departmentName
      });
      department.save();
    }
    console.log('Leaderboard seeded');
  } catch (err: any) {
    console.log(err);
  }
};

export const seedBioMech = async () => {
  console.log('Seeding biomechanical support...');
  try {
    await BioMech.deleteMany({});
    const users = await User.find();
    users.map(async (user, index) => {
      let bioMechReport;
      switch (user.username) {
        case 'user3':
          bioMechReport = new BioMech({
            user: user,
            department: user.department,
            equipmentName: 'X-Ray',
            equipmentFault: 'Not Working',
            equipmentPriority: bioMechEnum.Urgent,
            imgPath: 'public/images/bioMech0.jpeg'
          });
          bioMechReport.save();
          break;
        case 'user4':
          bioMechReport = new BioMech({
            user: user,
            department: user.department,
            equipmentName: 'Surgery Lights',
            equipmentFault: 'Lights are not turning on',
            equipmentPriority: bioMechEnum.Important,
            imgPath: 'public/images/bioMech1.jpeg'
          });
          bioMechReport.save();
          break;
        default:
          break;
      }
    });
    console.log('Biomechanical support seeded');
  } catch (err: any) {
    console.log(err);
  }
};

export const seedEmployeeOfTheMonth = async () => {
  console.log('Seeding employee of the month...');
  try {
    await EmployeeOfTheMonth.deleteOne({});
    const employeeOfTheMonth = new EmployeeOfTheMonth({
      name: 'John Doe',
      department: 'Rehab',
      description: 'This is a placeholder',
      imgPath: 'public/images/default_user.png'
    });
    employeeOfTheMonth.save();
    console.log('Employee of the month seeded');
  } catch (err: any) {
    console.log(err);
  }
};
