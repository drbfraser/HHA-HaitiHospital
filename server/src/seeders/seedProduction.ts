import * as ENV from 'utils/processEnv';

import { Department, Role, User } from '@hha/common';
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
import { TemplateCollection } from 'models/template';
import mongoose from 'mongoose';
import readline from 'readline';

let nameMapper: Map<string, string>;

const seedDb = async (startFromScratch: boolean) => {
  try {
    if (startFromScratch) {
      await seedDepartments();
      await setupDepartmentMap();
      await seedAdmin();
    }
    await seedTemplates();

    console.log('Database seeding completed.');
    process.exit();
  } catch (e) {
    console.log(`Database seeding failed: ${e}`);
  }
};

const startFromScratch = async () => {
  seedDb(true); // Delete everything and reseed everything from scratch
};

const updateTemplate = async () => {
  seedDb(false); // Ensure that only report template is reseeded
};

const setupDepartmentMap = async () => {
  const departments: Department[] = await DepartmentCollection.find();
  nameMapper = Departments.Hashtable.initNameToId(departments);
};

const seedAdmin = async () => {
  console.log('Seeding users...');
  try {
    // Delete seeded users on server start so we can reseed them.
    await UserCollection.deleteMany({});

    const admin = new UserCollection({
      username: 'user0',
      password: ENV.RAND_PASSWORD_SEED,
      name: 'Admin',
      role: Role.Admin,
      departmentId: Departments.Hashtable.getDeptIdFromName(
        DefaultDepartments.General.name,
        nameMapper,
      ),
    });

    admin.registerUser(admin, () => {}); // Unsure if this should have await or not

    console.log('Users seeded');
  } catch (err: any) {
    console.error(err);
  }
};

const seedDepartments = async () => {
  console.log('Seeding departments...');
  try {
    await DepartmentCollection.deleteMany({});
    // The idea here is to eventually allow departments be added via a POST request so departments no longer uses enums
    for (let deptName of Object.values(DefaultDepartments)) {
      const department = new DepartmentCollection({
        name: deptName,
      });
      await department.save();
    }
    console.log('Departments seeded');
  } catch (err: any) {
    console.error(err);
  }
};

type Report = QuestionGroup<string, string>;
const seedTemplates = async () => {
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

const askQuestion = (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
};

const main = async () => {
  try {
    // Connect to Mongo
    await mongoose.connect(ENV.MONGO_DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected...');

    // Check if running in CI
    if (process.env.IS_GITLAB_CI === 'true') {
      await updateTemplate();
    } else {
      // 1. Ask if reseeding templatae only
      const isOnlyReseedingTemplate = await askQuestion(
        'Confirm to reseed template only (old templates will be discarded) (y / Y to confirm): ',
      );
      if (isOnlyReseedingTemplate.toUpperCase() === 'Y') await updateTemplate();
      else {
        // 2. Ask if starting from scratch
        const isStartingFromScratch = await askQuestion(
          'Are you starting from scratch? (old data will be discarded) (y / Y to confirm): ',
        );
        if (isStartingFromScratch.toUpperCase() === 'Y') await startFromScratch();
        else {
          console.log('Database seeding cancelled');
          process.exit();
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

main();
