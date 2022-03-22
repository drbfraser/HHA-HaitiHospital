import faker from 'faker';
import UserModel, { hashPassword, Role, User } from '../models/user';
import Department from '../models/leaderboard';
import { DepartmentName } from '../common/definitions/departments';
import NicuPaeds from '../models/nicuPaeds';
import Community from '../models/community';
import MessageBody from '../models/messageBoard';
import CaseStudy, { CaseStudyOptions } from '../models/caseStudies';
import BioMech, { bioMechEnum } from '../models/bioMech';
import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import { getDepartmentId } from '../common/definitions/departments';

import * as ENV from './processEnv';

export const seedDb = async () => {
  // await UserModel.deleteMany({});
  // TODO: Remove delete many when in prod
  await MessageBody.deleteMany({});
  await CaseStudy.deleteMany({});

  // await seedUsers();
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
    // await UserModel.collection.dropIndexes();

    [...Array(7).keys()].forEach(async (index, i) => {
      var foundUser = await UserModel.findOne({ username: `user${index}` });
      if (foundUser) {
        switch (index) {
          case 0:
            foundUser.role = Role.Admin;
            foundUser.department = DepartmentName.NicuPaeds;
            break;
          case 1:
            foundUser.role = Role.MedicalDirector;
            foundUser.department = DepartmentName.NicuPaeds;
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
        const user = new UserModel({
          username: `user${index}`,
          password: ENV.PASSWORD_SEED,
          name: faker.name.findName()
        });

        switch (index) {
          case 0:
            user.role = Role.Admin;
            user.department = DepartmentName.NicuPaeds;
            break;
          case 1:
            user.role = Role.MedicalDirector;
            user.department = DepartmentName.NicuPaeds;
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

  const users: User[] = await UserModel.find();
  const numOfMessagesToGenerate: number = 100;
  for (let i = 0; i < numOfMessagesToGenerate; i++) {
    const randomUser: User = selectRandomUser(users);
    const message = new MessageBody({
      departmentId: getDepartmentId(randomUser.department),
      departmentName: randomUser.department,
      userId: randomUser._id,
      date: new Date(),
      messageBody: faker.lorem.words(),
      messageHeader: faker.lorem.words()
    });
    message.save();
  }

  console.log('Message board seeded');
};

export const seedCaseStudies = async () => {
  console.log('Seeding case studies...');

  try {
    const users: User[] = await UserModel.find();

    const randomDefaultUser = selectRandomUser(users);
    setDefaultFeaturedCaseStudy(randomDefaultUser);
    const numCaseStudiesToGenerate: number = 100;
    for (let i = 0; i < numCaseStudiesToGenerate; i++) {
      const randomUser = selectRandomUser(users);
      const randomCaseStudy = randomEnumValue(CaseStudyOptions);
      generateRandomCaseStudy(randomCaseStudy, randomUser);
    }

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
    const users: User[] = await UserModel.find();
    const numOfBioMechReportsToGenerate: number = 100;
    for (let i = 0; i < numOfBioMechReportsToGenerate; i++) {
      const randomUser = selectRandomUser(users);
      const bioMechReport = new BioMech({
        user: randomUser,
        department: randomUser.department,
        equipmentName: faker.lorem.words(),
        equipmentFault: faker.lorem.words(),
        equipmentPriority: randomEnumValue(bioMechEnum),
        imgPath: 'public/images/bioMech0.jpeg'
      });
      bioMechReport.save();
    }
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

const setDefaultFeaturedCaseStudy = (user) => {
  let caseStudy = new CaseStudy({
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
};

const generateRandomCaseStudy = (caseStudyType, user) => {
  let caseStudy;
  switch (caseStudyType) {
    case CaseStudyOptions.PatientStory:
      caseStudy = new CaseStudy({
        caseStudyType: CaseStudyOptions.PatientStory,
        user: user.id,
        userDepartment: user.department,
        imgPath: 'public/images/case1.jpg',
        featured: false,
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
    case CaseStudyOptions.StaffRecognition:
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
    case CaseStudyOptions.TrainingSession:
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
    case CaseStudyOptions.EquipmentReceived:
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
    case CaseStudyOptions.OtherStory:
      caseStudy = new CaseStudy({
        caseStudyType: CaseStudyOptions.OtherStory,
        user: user.id,
        userDepartment: user.department,
        imgPath: 'public/images/case2.jpg',
        featured: false,
        otherStory: {
          caseStudyStory: faker.lorem.paragraph(10)
        }
      });
      caseStudy.save();
      break;
    default:
      break;
  }
};

const selectRandomUser = (users: User[]): User => {
  const randomUserIndex = Math.floor(Math.random() * users.length);
  return users[randomUserIndex];
};

// Random Enum Key function here accepts any enumerations and selects the key of the enum.
const randomEnumKey = (enumeration: any): any => {
  const keys = Object.keys(enumeration).filter((k) => !(Math.abs(Number.parseInt(k)) + 1));
  const enumKey = keys[Math.floor(Math.random() * keys.length)];

  return enumKey;
};

// Random Enum value function here accepts any enumerations and selects the value of the enum.
const randomEnumValue = (enumeration: any): any => enumeration[randomEnumKey(enumeration)];
