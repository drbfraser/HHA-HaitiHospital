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

export const seedDb = async () => {
  try {
    await seedDepartments();
    await setupDepartmentMap();
    await seedUsers();
    await seedTemplates();

    console.log('Database seeding completed.');
    process.exit();
  } catch (e) {
    console.log(`Database seeding failed: ${e}`);
  }
};

const setupDepartmentMap = async () => {
  const departments: Department[] = await DepartmentCollection.find();
  nameMapper = Departments.Hashtable.initNameToId(departments);
};

export const seedUsers = async () => {
  console.log('Seeding users...');
  try {
    // Delete seeded users on server start so we can reseed them.
    await UserCollection.deleteMany({});

    console.log('Users seeded');
  } catch (err: any) {
    console.error(err);
  }
};

export const seedDepartments = async () => {
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
      [buildRehabReport(), DefaultDepartments.Rehab],
      [buildMaternityReport(), DefaultDepartments.Maternity],
      [buildNicuPaedsReport(), DefaultDepartments.NICU],
      [buildCommunityHealthReport(), DefaultDepartments.Community],
    ];
    console.log(`Seeding templates buildRehabReport ...`);

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

// Connect to Mongo
mongoose
  .connect(ENV.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected...');
    if (process.env.IS_GITLAB_CI === 'true') {
      (async () => await seedDb())(); // anonymous async function
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      // rl.question(
      //   'Confirm to reseed database (old data will be discarded) (y / Y to confirm): ',
      //   async function (answer: string) {
      //     if (answer.toUpperCase() === 'Y') await seedDb();
      //     else console.log('Database seeding cancelled');
      //     rl.close();
      //   },
      // );

      // rl.question(
      //   'Are you starting from scratch ? '
      // )

      rl.on('close', function () {
        process.exit(0);
      });
    }
  })
  .catch((err) => console.log(err));
