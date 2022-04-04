import faker from 'faker';
import UserModel, { Role, User } from '../models/user';
import Department from '../models/departments';
import { DepartmentName } from './departments';
import MessageBody from '../models/messageBoard';
import CaseStudy, { CaseStudyOptions } from '../models/caseStudies';
import BioMech, { bioMechEnum } from '../models/bioMech';
import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import * as ENV from './processEnv';

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

const setDepartment = (user: User): string => {
  return user.role === 'Admin' || user.role === 'Medical Director' ? '5' : user.departmentId;
};

export const seedDb = async () => {
  // TODO: Remove delete many when in prod
  //   await UserModel.deleteMany({});
  await MessageBody.deleteMany({});
  await CaseStudy.deleteMany({});

  await seedUsers();
  await seedLeaderboard();
  await seedCaseStudies();
  await seedMessageBoard();
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
      var foundUser = await UserModel.findOne({ username: `user${index}` }).exec();
      if (foundUser) {
        switch (index) {
          case 0:
            foundUser.role = Role.Admin;
            foundUser.departmentId = '5';
            break;
          case 1:
            foundUser.role = Role.MedicalDirector;
            foundUser.departmentId = '5';
            break;
          case 2:
            foundUser.role = Role.HeadOfDepartment;
            foundUser.departmentId = '2';
            break;
          case 3:
            foundUser.role = Role.User;
            foundUser.departmentId = '4';
            break;
          case 4:
            foundUser.role = Role.User;
            foundUser.departmentId = '1';
            break;
          case 5:
            foundUser.role = Role.User;
            foundUser.departmentId = '3';
            break;
          case 6:
            foundUser.role = Role.User;
            foundUser.departmentId = '2';
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
            user.departmentId = '5';
            break;
          case 1:
            user.role = Role.MedicalDirector;
            user.departmentId = '5';
            break;
          case 2:
            user.role = Role.HeadOfDepartment;
            user.departmentId = '2';
            break;
          case 3:
            user.role = Role.User;
            user.departmentId = '4';
            break;
          case 4:
            user.role = Role.User;
            user.departmentId = '1';
            break;
          case 5:
            user.role = Role.User;
            user.departmentId = '3';
            break;
          case 6:
            user.role = Role.User;
            user.departmentId = '2';
            break;
          default:
            break;
        }

        await user.registerUser(user, () => {});
      }
    });
    console.log('Users seeded');
  } catch (err: any) {
    console.error(err);
  }
};

export const seedMessageBoard = async () => {
  console.log('Seeding message board...');
  try {
    const users: User[] = await UserModel.find();
    const numOfMessagesToGenerate: number = 100;
    for (let i = 0; i < numOfMessagesToGenerate; i++) {
      const randomUser: User = selectRandomUser(users);
      const message = new MessageBody({
        departmentId: 1,
        userId: randomUser._id,
        date: new Date(),
        messageBody: faker.lorem.words(),
        messageHeader: faker.lorem.words()
      });
      message.save();
    }
    console.log('Message board seeded');
  } catch (err: any) {
    console.error(err);
  }
};

const setDefaultFeaturedCaseStudy = (user: User) => {
  try {
    let caseStudy = new CaseStudy({
      caseStudyType: CaseStudyOptions.PatientStory,
      userId: user._id,
      departmentId: setDepartment(user),
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
  } catch (err: any) {
    console.error(err);
  }
};

export const seedCaseStudies = async () => {
  console.log('Seeding case studies...');
  try {
    const users = await UserModel.find().lean();
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
    console.error(err);
  }
};

export const seedLeaderboard = async () => {
  console.log('Seeding leaderboard...');
  try {
    await Department.deleteMany({});
    for (let key in DepartmentName) {
      // We want do not want the General to be seeded as a leaderboard department
      if (key === DepartmentName.General) {
        continue;
      }
      let departmentName = DepartmentName[key];
      const department = new Department({
        name: departmentName
      });
      await department.save();
    }
    console.log('Leaderboard seeded');
  } catch (err: any) {
    console.error(err);
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
        userId: randomUser,
        departmentId: setDepartment(randomUser),
        equipmentName: faker.lorem.words(),
        equipmentFault: faker.lorem.words(),
        equipmentPriority: randomEnumValue(bioMechEnum),
        imgPath: 'public/images/bioMech0.jpeg'
      });
      bioMechReport.save();
    }
    console.log('Biomechanical support seeded');
  } catch (err: any) {
    console.error(err);
  }
};

export const seedEmployeeOfTheMonth = async () => {
  console.log('Seeding employee of the month...');
  try {
    await EmployeeOfTheMonth.deleteOne({});
    const employeeOfTheMonth = new EmployeeOfTheMonth({
      name: 'John Doe',
      departmentId: '1',
      description: 'This is a placeholder',
      imgPath: 'public/images/default_user.png'
    });
    employeeOfTheMonth.save();
    console.log('Employee of the month seeded');
  } catch (err: any) {
    console.error(err);
  }
};

const generateRandomCaseStudy = (caseStudyType, user: User) => {
  try {
    let caseStudy;
    switch (caseStudyType) {
      case CaseStudyOptions.PatientStory:
        caseStudy = new CaseStudy({
          caseStudyType: CaseStudyOptions.PatientStory,
          userId: user._id,
          departmentId: setDepartment(user),
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
          userId: user._id,
          departmentId: setDepartment(user),
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
          userId: user._id,
          departmentId: setDepartment(user),
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
          userId: user._id,
          departmentId: setDepartment(user),
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
          userId: user._id,
          departmentId: setDepartment(user),
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
  } catch (err: any) {
    console.error(err);
  }
};
