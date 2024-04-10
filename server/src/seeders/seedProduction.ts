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
      username: 'admin', // Should I change it to user0 ?
      password: ENV.PASSWORD_SEED,
      name: 'Admin',
      role: Role.Admin,
      departmentId: Departments.Hashtable.getDeptIdFromName(DefaultDepartments.General, nameMapper),
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
      (async () => await seedDb(true))(); // anonymous async function
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        'Are you starting from scratch? (old data will be discarded) (y / Y to confirm)',
        async function (answer: string) {
          if (answer.toUpperCase() === 'Y') {
            startFromScratch();
          } else {
            rl.question(
              'Confirm to reseed template (old templates will be discarded) (y / Y to confirm): ',
              async function (answer: string) {
                if (answer.toUpperCase() === 'Y') await updateTemplate();
                else console.log('Database seeding cancelled');
                rl.close();
              },
            );
          }
        },
      );

      rl.on('close', function () {
        process.exit(0);
      });
    }
  })
  .catch((err) => console.log(err));
