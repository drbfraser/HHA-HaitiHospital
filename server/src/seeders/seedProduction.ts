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
import { ReportCollection } from 'models/report';
import MessageCollection from 'models/messageBoard';
import EmployeeOfTheMonthCollection from 'models/employeeOfTheMonth';
import CaseStudy from 'models/caseStudies';
import BioMechCollection from 'models/bioMech';
import { connectMongo } from 'utils/mongoDb';

let nameMapper: Map<string, string>;

const seedDb = async (startFromScratch: boolean) => {
  try {
    if (startFromScratch) {
      await seedDepartments();
      await setupDepartmentMap();
      await seedAdmin();
      await removeOldData();
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
    for (let defaultDept of Object.values(DefaultDepartments)) {
      const department = new DepartmentCollection({
        name: defaultDept.name,
        hasReport: defaultDept.hasReport,
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

const removeOldData = async () => {
  console.log('Removing old data...');
  try {
    await MessageCollection.deleteMany({});
    console.log('Messages deleted');
    await BioMechCollection.deleteMany({});
    console.log('BioMech entries deleted');
    await EmployeeOfTheMonthCollection.deleteMany({});
    console.log('Employees of the Month deleted');
    await CaseStudy.deleteMany({});
    console.log('Case Studies deleted');
    await ReportCollection.deleteMany({});
    console.log('Reports deleted');
    console.log('Old data removed');
  } catch (e) {
    console.log(e);
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

// get department IDs with pre-existing data, so that we don't create orphaned data
// note: "orphaned data" is data pointing to a department that no longer exists; we want to avoid this when reseeding the departments because it will cause errors during
const getDepartmentsWithData = async () => {
  const messageDepartments = await MessageCollection.distinct(`departmentId`);
  const biomechDepartments = await BioMechCollection.distinct(`departmentId`);
  const employeeOfTheMonthDepartments = await EmployeeOfTheMonthCollection.distinct(`departmentId`);
  const caseStudyDepartments = await CaseStudy.distinct(`departmentId`);
  const reportDepartments = await ReportCollection.distinct(`departmentId`);

  const allDepartments = [
    ...messageDepartments,
    ...biomechDepartments,
    ...employeeOfTheMonthDepartments,
    ...caseStudyDepartments,
    ...reportDepartments,
  ];

  const departmentsWithData = [...new Set(allDepartments)];

  return departmentsWithData;
};

// update departments while taking care to not create orphaned data
const updateDepartments = async () => {
  console.log('Updating departments...');

  const oldDepartmentNames = await DepartmentCollection.distinct(`name`);
  const usedDepartmentIds = await getDepartmentsWithData();
  const usedDepartmentNames = await Promise.all(
    usedDepartmentIds.map(async (id: string) => {
      const department = await DepartmentCollection.findById(id);
      return department ? department.name : 'Unknown Department';
    }),
  );
  const newDepartmentNames = Object.values(DefaultDepartments).map((dep) => dep.name);

  // departments that are not used should be deleted
  const departmentsToDelete = oldDepartmentNames.filter(
    (dep) => !usedDepartmentNames.includes(dep),
  );

  // departments that are used but not present in the latest list should be marked for manual resolution
  const deletedDepartmentsInUse = usedDepartmentNames.filter(
    (name) => !newDepartmentNames.includes(name),
  );

  // departments that are in the latest list but don't already exist should be added
  const newDepartments = newDepartmentNames.filter((name) => !usedDepartmentNames.includes(name));

  await DepartmentCollection.deleteMany({ name: { $in: departmentsToDelete } });
  for (let deletedDept of departmentsToDelete) {
    console.log('Removed department ', deletedDept);
  }

  if (deletedDepartmentsInUse.length > 0) {
    console.error(
      'Error: attempting to delete a department that has data associated. Please backup and/or remove the data before trying again. Exiting...',
    );
    process.exit(1);
  }

  for (let defaultDept of Object.values(DefaultDepartments)) {
    if (newDepartments.includes(defaultDept.name)) {
      const department = new DepartmentCollection({
        name: defaultDept.name,
        hasReport: defaultDept.hasReport,
      });
      await department.save();
      console.log('Added department ', defaultDept.name);
    }
  }

  if (departmentsToDelete.length == 0 && newDepartments.length == 0) {
    console.log('No updates made to departments');
  }
};

const updateAndMergeData = async () => {
  try {
    await updateDepartments();
    await updateTemplate();

    console.log(`Database seeding completed.`);
    process.exit();
  } catch (e) {
    console.log(`Database seeding failed: ${e}`);
  }
};

const pickSeedingOption = async () => {
  // 1. Ask if reseeding template only
  const isOnlyReseedingTemplate = await askQuestion(
    'Confirm to reseed template only (old templates will be discarded) (y / Y to confirm): ',
  );
  if (isOnlyReseedingTemplate.toUpperCase() === 'Y') {
    await updateTemplate();
    return;
  }

  // 2. Ask if reseeding departments
  const isReseedingDepartment = await askQuestion(
    'Confirm to reseed departments (y / Y to confirm): ',
  );
  if (isReseedingDepartment.toUpperCase() === 'Y') {
    await updateAndMergeData();
    return;
  }

  // 3. Ask if starting from scratch
  const isStartingFromScratch = await askQuestion(
    'Are you starting from scratch? (old data will be discarded) (y / Y to confirm): ',
  );
  if (isStartingFromScratch.toUpperCase() === 'Y') await startFromScratch();
  else {
    console.log('Database seeding cancelled');
    process.exit();
  }
};

const main = async () => {
  try {
    // Connect to Mongo
    await connectMongo();
    console.log('MongoDB Connected...');

    // Check if running in CI
    if (process.env.IS_GITLAB_CI === 'true') {
      await updateTemplate();
    } else {
      await pickSeedingOption();
    }
  } catch (err) {
    console.log(err);
  }
};

main();
