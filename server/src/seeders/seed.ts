import * as ENV from 'utils/processEnv';
import _ from 'lodash';

import { BiomechStatus, Department, Role, User } from '@hha/common';
import BioMech from 'models/bioMech';
import CaseStudy, { CaseStudyOptions } from 'models/caseStudies';
import DepartmentCollection from 'models/departments';
import Departments, { DefaultDepartments } from 'utils/departments';
import {
  ObjectSerializer,
  QuestionGroup,
  buildMaternityReport,
  buildNicuPaedsReport,
  buildCommunityHealthReport,
  buildRehabReport,
} from '@hha/common';
import UserCollection from 'models/user';

import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import MessageCollection from 'models/messageBoard';
import { ReportCollection } from 'models/report';
import { TemplateCollection } from 'models/template';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import reports from './data/defaultReports.json';
import messages from './data/defaultMessages.json';
import brokenEquipment from './data/defaultBioMech.json';
import caseStudies from './data/defaultCaseStudies.json';
type ID = string;
type ErrorType = string;

let nameMapper: Map<string, string>;

const selectRandomUser = (users: User[]): User => {
  const randomUserIndex = Math.floor(Math.random() * users.length);
  return users[randomUserIndex];
};

export const seedDb = async () => {
  try {
    await seedDepartments();
    await setupDepartmentMap();
    await seedUsers();
    await seedMessageBoard();
    await seedBioMech();
    await seedEmployeeOfTheMonth();
    await seedCaseStudies();
    await seedTemplates();
    await seedReports();

    console.log('Database seeding completed.');
    process.exit();
  } catch (e) {
    console.log(`Database seeding failed: ${e}`);
  }
};

export const setupDepartmentMap = async () => {
  const departments: Department[] = await DepartmentCollection.find();
  nameMapper = Departments.Hashtable.initNameToId(departments);
};

export const seedUsers = async () => {
  console.log('Seeding users...');
  try {
    // Delete seeded users on server start so we can reseed them.
    await UserCollection.deleteMany({});

    for (const index of [...Array(15).keys()]) {
      let password = index === 0 ? ENV.RAND_PASSWORD_SEED : ENV.PASSWORD_SEED; // Select password based on user index

      const foundUser = await UserCollection.findOne({ username: `user${index}` }).exec();
      if (foundUser) {
        switch (index) {
          case 0:
            foundUser.role = Role.Admin;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 1:
            foundUser.role = Role.MedicalDirector;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 2:
            foundUser.role = Role.HeadOfDepartment;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 3:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community.name,
              nameMapper,
            );
            break;
          case 4:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab.name,
              nameMapper,
            );
            break;
          case 5:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity.name,
              nameMapper,
            );
            break;
          case 6:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 7:
            foundUser.role = Role.Admin;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 8:
            foundUser.role = Role.MedicalDirector;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 9:
            foundUser.role = Role.HeadOfDepartment;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 10:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community.name,
              nameMapper,
            );
            break;
          case 11:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab.name,
              nameMapper,
            );
            break;
          case 12:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity.name,
              nameMapper,
            );
            break;
          case 13:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 14:
            foundUser.role = Role.BioMechanic;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.BioMechanic.name,
              nameMapper,
            );
            break;
          default:
            break;
        }
        foundUser.save();
      } else {
        let name;
        if (index >= 7 && index <= 13) {
          switch (index) {
            case 7:
              name = 'Michael Admin';
              break;
            case 8:
              name = 'Michael MD';
              break;
            case 9:
              name = 'Michael HOD';
              break;
            case 10:
              name = 'Michael Community User';
              break;
            case 11:
              name = 'Michael Rehab User';
              break;
            case 12:
              name = 'Michael Maternity User';
              break;
            case 13:
              name = 'Michael NICU User';
              break;
          }
        } else {
          name = faker.person.fullName();
        }
        const user = new UserCollection({
          username: `user${index}`,
          password: password,
          name: name,
        });

        switch (index) {
          case 0:
            user.role = Role.Admin;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 1:
            user.role = Role.MedicalDirector;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 2:
            user.role = Role.HeadOfDepartment;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 3:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community.name,
              nameMapper,
            );
            break;
          case 4:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab.name,
              nameMapper,
            );
            break;
          case 5:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity.name,
              nameMapper,
            );
            break;
          case 6:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 7:
            user.role = Role.Admin;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 8:
            user.role = Role.MedicalDirector;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General.name,
              nameMapper,
            );
            break;
          case 9:
            user.role = Role.HeadOfDepartment;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 10:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community.name,
              nameMapper,
            );
            break;
          case 11:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab.name,
              nameMapper,
            );
            break;
          case 12:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity.name,
              nameMapper,
            );
            break;
          case 13:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU.name,
              nameMapper,
            );
            break;
          case 14:
            user.role = Role.BioMechanic;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.BioMechanic.name,
              nameMapper,
            );
            break;
          default:
            break;
        }
        await user.registerUser(user, () => {});
        // check if user is registered
      }
    }

    console.log('Users seeded');
  } catch (err: any) {
    console.error(err);
  }
};

export const seedMessageBoard = async () => {
  console.log('Seeding message board...');
  try {
    await MessageCollection.deleteMany({});
    const users: User[] = await UserCollection.find();

    //how to get size of array in javascript
    // Wait for users to be seeded before creating messages.
    for (let i = 0; i < messages.length; i++) {
      const randomUser: User = selectRandomUser(users);
      const message = new MessageCollection({
        departmentId: randomUser.departmentId,
        userId: randomUser._id,
        date: new Date(),
        messageBody: messages[i][1],
        messageHeader: messages[i][0],
      });
      message.save();
    }
    console.log('Message board seeded');
  } catch (err: any) {
    console.error(err);
  }
};

const setDefaultFeaturedCaseStudy = (user: User, caseStudyTemplate: string[]) => {
  try {
    let caseStudy = new CaseStudy({
      caseStudyType: CaseStudyOptions.PatientStory,
      userId: user._id,
      departmentId: user.departmentId,
      imgPath: 'public/images/case1.jpg',
      featured: true,
      patientStory: {
        patientsName: caseStudyTemplate[1],
        patientsAge: caseStudyTemplate[2],
        whereIsThePatientFrom: caseStudyTemplate[3],
        whyComeToHcbh: caseStudyTemplate[4],
        howLongWereTheyAtHcbh: caseStudyTemplate[5],
        diagnosis: caseStudyTemplate[6],
        caseStudyStory: caseStudyTemplate[7],
      },
    });
    caseStudy.save();
  } catch (err: any) {
    console.error(err);
  }
};

export const seedCaseStudies = async () => {
  console.log('Seeding case studies...');
  try {
    await CaseStudy.deleteMany({});
    const users = await UserCollection.find().lean();
    const randomDefaultUser = selectRandomUser(users);

    setDefaultFeaturedCaseStudy(randomDefaultUser, caseStudies[0] as string[]);

    for (let i = 1; i < caseStudies.length; i++) {
      const randomUser = selectRandomUser(users);
      generateRandomCaseStudy(
        caseStudies[i][0] as string,
        randomUser,
        caseStudies[i] as (string | string[])[],
      );
    }
    console.log('Case studies seeded');
  } catch (err: any) {
    console.error(err);
  }
};

export const seedDepartments = async () => {
  console.log('Seeding departments...');
  try {
    await DepartmentCollection.deleteMany({});
    // The idea here is to eventually allow departments be added via a POST request so departments no longer uses enums
    for (const departmentInfo of Object.values(DefaultDepartments)) {
      const department = new DepartmentCollection({
        name: departmentInfo.name,
        hasReport: departmentInfo.hasReport,
      });
      await department.save();
    }
    console.log('Departments seeded');
  } catch (err: any) {
    console.error(err);
  }
};

export const seedBioMech = async () => {
  console.log('Seeding biomechanical support...');
  try {
    await BioMech.deleteMany({});
    const users: User[] = await UserCollection.find();

    for (let i = 0; i < brokenEquipment.length; i++) {
      const randomUser = selectRandomUser(users);
      const bioMechReport = new BioMech({
        userId: randomUser,
        departmentId: randomUser.departmentId,
        equipmentName: brokenEquipment[i][0],
        equipmentFault: brokenEquipment[i][1],
        equipmentPriority: brokenEquipment[i][2],
        equipmentStatus: BiomechStatus.BACKLOG,
        imgPath: 'public/images/bioMech0.jpeg',
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
    await EmployeeOfTheMonth.deleteMany({});
    const employeeOfTheMonth = new EmployeeOfTheMonth({
      name: 'John Doe',
      departmentId: Departments.Hashtable.getDeptIdFromName(
        DefaultDepartments.Maternity.name,
        nameMapper,
      ),
      description:
        "Meet Sarah, a nurse working at a large hospital in the bustling city. She's been working at the hospital for almost three years now and has become an indispensable part of the team. Sarah is known for her dedication, her positive attitude, and her willingness to go above and beyond to help her patients.Last month, Sarah was named Employee of the Month, and for good reason. She had been working long hours and handling an increased workload due to the recent surge in patients with COVID-19. Despite the added stress, Sarah remained calm and composed, always putting her patients' needs first.One of Sarah's patients, a young girl named Emily, was admitted to the hospital with a serious illness. Emily was scared and anxious, but Sarah took the time to sit with her, answer her questions, and comfort her. Sarah went out of her way to make sure Emily felt safe and cared for, and the girl's parents were incredibly grateful for Sarah's kindness. But it wasn't just Sarah's bedside manner that earned her the Employee of the Month award. She also played a key role in training new nurses, helping to ensure that the hospital's high standards of patient care were upheld. And despite her busy schedule, Sarah always found time to help her colleagues and lend a listening ear when they needed it. Overall, Sarah's commitment to her patients, her colleagues, and the hospital as a whole made her an obvious choice for Employee of the Month. Her hard work and dedication are a true inspiration to everyone around her, and the hospital is lucky to have her on their team.",
      imgPath: 'public/images/avatar0.jpg',
      awardedMonth: new Date().getMonth() + 1,
      awardedYear: new Date().getFullYear(),
    });
    employeeOfTheMonth.save();
    console.log('Employee of the month seeded');
  } catch (err: any) {
    console.error(err);
  }
};

const generateRandomCaseStudy = (
  caseStudyType: string,
  user: User,
  caseStudyTemplate: (string | string[])[],
) => {
  try {
    let caseStudy;
    switch (caseStudyType) {
      case CaseStudyOptions.PatientStory:
        caseStudy = new CaseStudy({
          caseStudyType: CaseStudyOptions.PatientStory,
          userId: user._id,
          departmentId: user.departmentId,
          imgPath: 'public/images/case1.jpg',
          featured: false,
          patientStory: {
            patientsName: caseStudyTemplate[1],
            patientsAge: caseStudyTemplate[2],
            whereIsThePatientFrom: caseStudyTemplate[3],
            whyComeToHcbh: caseStudyTemplate[4],
            howLongWereTheyAtHcbh: caseStudyTemplate[5],
            diagnosis: caseStudyTemplate[6],
            caseStudyStory: caseStudyTemplate[7],
          },
        });
        caseStudy.save();
        break;
      case CaseStudyOptions.StaffRecognition:
        caseStudy = new CaseStudy({
          caseStudyType: CaseStudyOptions.StaffRecognition,
          userId: user._id,
          departmentId: user.departmentId,
          imgPath: 'public/images/case2.jpg',
          featured: false,
          staffRecognition: {
            staffName: faker.person.fullName(),
            jobTitle: faker.lorem.words(),
            department: faker.lorem.words(),
            howLongWorkingAtHcbh: faker.lorem.words(),
            mostEnjoy: faker.lorem.sentences(),
            caseStudyStory: faker.lorem.paragraph(10),
          },
        });
        caseStudy.save();
        break;
      case CaseStudyOptions.TrainingSession:
        caseStudy = new CaseStudy({
          caseStudyType: CaseStudyOptions.TrainingSession,
          userId: user._id,
          departmentId: user.departmentId,
          imgPath: 'public/images/case2.jpg',
          featured: false,
          trainingSession: {
            trainingDate: faker.date.recent(),
            trainingOn: caseStudyTemplate[2],
            whoConducted: caseStudyTemplate[3],
            whoAttended: caseStudyTemplate[4].toString(),
            benefitsFromTraining: caseStudyTemplate[5],
            caseStudyStory: caseStudyTemplate[6],
          },
        });
        caseStudy.save();
        break;
      case CaseStudyOptions.EquipmentReceived:
        caseStudy = new CaseStudy({
          caseStudyType: CaseStudyOptions.EquipmentReceived,
          userId: user._id,
          departmentId: user.departmentId,
          imgPath: 'public/images/case2.jpg',
          featured: false,
          equipmentReceived: {
            equipmentReceived: faker.lorem.words(),
            departmentReceived: faker.lorem.words(),
            whoSentEquipment: faker.person.fullName(),
            purchasedOrDonated: faker.lorem.words(),
            whatDoesEquipmentDo: faker.lorem.sentences(),
            caseStudyStory: faker.lorem.paragraph(10),
          },
        });
        caseStudy.save();
        break;
      case CaseStudyOptions.OtherStory:
        caseStudy = new CaseStudy({
          caseStudyType: CaseStudyOptions.OtherStory,
          userId: user._id,
          departmentId: user.departmentId,
          imgPath: 'public/images/case2.jpg',
          featured: false,
          otherStory: {
            caseStudyStory: faker.lorem.paragraph(10),
          },
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

type Report = QuestionGroup<string, string>;
export const seedTemplates = async () => {
  console.log(`Seeding templates...`);
  try {
    await TemplateCollection.deleteMany({});

    const serializer = ObjectSerializer.getObjectSerializer();

    const reportDepartmentMap: [Report, string][] = [
      [buildRehabReport(), DefaultDepartments.Rehab.name],
      [buildMaternityReport(), DefaultDepartments.Maternity.name],
      [buildNicuPaedsReport(), DefaultDepartments.NICU.name],
      [buildCommunityHealthReport(), DefaultDepartments.Community.name],
    ];

    for (const tuple of reportDepartmentMap) {
      const report: Report = tuple[0];
      const departmentName: string = tuple[1];

      const departmentId: string = await Departments.Database.getDeptIdByName(departmentName);
      const serialized = serializer.serialize(report);
      let template = new TemplateCollection({
        departmentId: departmentId,
        reportObject: serialized,
      });
      await template.save();
    }
    console.log(`Templates seeded`);
  } catch (err) {
    console.log(err);
  }
};

export interface IQuestionItem {
  id: string;
  prompt: { en: string; fr: string };
  answer?: number | string;
}

export interface IReportTemplate {
  questionItems: IQuestionItem[];
  prompt: { en: string; fr: string };
}

export type ReportData = {
  nicupaeds: IReportTemplate;
  maternity: IReportTemplate;
  rehab: IReportTemplate;
  communityHealth: IReportTemplate;
};

export const seedReports = async () => {
  console.log(`Seeding reports...`);
  try {
    await ReportCollection.deleteMany({});
    const departments = await DepartmentCollection.find({
      name: { $in: ['NICU/Paeds', 'Maternity', 'Rehab', 'Community & Health'] },
    });
    const departmentIds = departments.map((dep) => dep.id);
    const users = await Promise.all(
      departmentIds.map(async (depId) => {
        let user = await UserCollection.findOne({
          departmentId: depId,
        });
        return user;
      }),
    );
    const serializer = ObjectSerializer.getObjectSerializer();

    const defaultReports = [
      { defaultReport: reports.rehab, user: users[0] },
      { defaultReport: reports.maternity, user: users[1] },
      { defaultReport: reports.nicupaeds, user: users[2] },
      { defaultReport: reports.communityHealth, user: users[3] },
    ];

    const defaultDates = [
      new Date('2022-01-01'),
      new Date('2023-01-01'),
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
    ];

    validateReports(reports, [
      () => buildNicuPaedsReport(),
      () => buildMaternityReport(),
      () => buildRehabReport(),
      () => buildCommunityHealthReport(),
    ]);

    for (const date of defaultDates) {
      for (const { defaultReport, user } of defaultReports) {
        const serialized = serializer.serialize(scrambleReport(defaultReport));
        let report = new ReportCollection({
          departmentId: user?.departmentId,
          submittedUserId: user?._id,
          submittedBy: user?.username,
          reportMonth: date,
          reportObject: serialized,
          isDraft: false,
        });
        await report.save();
      }
    }
    console.log(`Reports seeded`);
  } catch (err) {
    console.log(err);
  }
};

function scrambleReport(report: IReportTemplate): IReportTemplate {
  const scrambleNumber = (num: number): number => {
    const range = 0.5 * num;
    const min = num - range;
    const max = num + range;
    return Math.round(Math.random() * (max - min) + min);
  };

  const scrambledReport: IReportTemplate = { ...report, questionItems: [] };

  report.questionItems.forEach((item) => {
    if (typeof item.answer === 'number') {
      const scrambledItem: IQuestionItem = { ...item, answer: scrambleNumber(item.answer) };
      scrambledReport.questionItems.push(scrambledItem);
    } else {
      scrambledReport.questionItems.push(item);
    }
  });

  return scrambledReport;
}

export const validateReports = (
  reportsToValidate: ReportData,
  buildReportTemplateFunctions: (() => QuestionGroup<ID, ErrorType>)[],
) => {
  const defaultReports = [
    { defaultReport: reportsToValidate.nicupaeds, template: buildReportTemplateFunctions[0]() },
    { defaultReport: reportsToValidate.maternity, template: buildReportTemplateFunctions[1]() },
    { defaultReport: reportsToValidate.rehab, template: buildReportTemplateFunctions[2]() },
    {
      defaultReport: reportsToValidate.communityHealth,
      template: buildReportTemplateFunctions[3](),
    },
  ];

  for (const { defaultReport, template } of defaultReports) {
    const defaultData = defaultReport.questionItems.map((qi) => {
      return [qi.id, qi.prompt];
    });
    const templateData = template.getQuestionItems().map((qi) => {
      return [qi.getId(), qi.getPrompt()];
    });

    if (!_.isEqual(defaultData, templateData)) {
      console.log(
        'WARNING - template for',
        defaultReport.prompt.en,
        'does not match template. Please review and update either the template or sample data.',
      );
      console.log('Sample data:', defaultData);
      console.log('Template:', templateData);
    }
  }
};

// Checks to only connect to MongoDB if run from the command line
// to prevent connecting to Mongo when using exported functions.
if (require.main === module) {
  mongoose
    .connect(ENV.MONGO_DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('MongoDB Connected...');
      const readline = require('readline');
      if (process.env.IS_GITLAB_CI === 'true') {
        (async () => await seedDb())(); // anonymous async function
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `Confirm to reseed database (old data will be discarded) (y / Y to confirm): `,
          async function (answer: string) {
            if (answer.toUpperCase() === 'Y') await seedDb();
            else console.log('Database seeding cancelled');
            rl.close();
          },
        );

        rl.on('close', function () {
          process.exit(0);
        });
      }
    })
    .catch((err) => console.log(err));
}
