import * as ENV from 'utils/processEnv';

import BioMech, { BiomechStatus } from 'models/bioMech';
import CaseStudy, { CaseStudyOptions } from 'models/caseStudies';
import DepartmentCollection, { Department } from 'models/departments';
import Departments, { DefaultDepartments } from 'utils/departments';
import {
  ObjectSerializer,
  QuestionGroup,
  buildMaternityReport,
  buildNicuPaedsReport,
  buildCommunityHealthReport,
  buildRehabReport,
} from '@hha/common';
import UserCollection, { Role, User } from 'models/user';

import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import MessageCollection from 'models/messageBoard';
import { ReportCollection } from 'models/report';
import { TemplateCollection } from 'models/template';
import faker from 'faker';
import mongoose from 'mongoose';

let nameMapper: Map<string, string>;

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
    // await seedPermissions();

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

    for (const index of [...Array(15).keys()]) {
      const foundUser = await UserCollection.findOne({ username: `user${index}` }).exec();
      if (foundUser) {
        switch (index) {
          case 0:
            foundUser.role = Role.Admin;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 1:
            foundUser.role = Role.MedicalDirector;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 2:
            foundUser.role = Role.HeadOfDepartment;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 3:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community,
              nameMapper,
            );
            break;
          case 4:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab,
              nameMapper,
            );
            break;
          case 5:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity,
              nameMapper,
            );
            break;
          case 6:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 7:
            foundUser.role = Role.Admin;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 8:
            foundUser.role = Role.MedicalDirector;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 9:
            foundUser.role = Role.HeadOfDepartment;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 10:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community,
              nameMapper,
            );
            break;
          case 11:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab,
              nameMapper,
            );
            break;
          case 12:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity,
              nameMapper,
            );
            break;
          case 13:
            foundUser.role = Role.User;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 14:
            foundUser.role = Role.BioMechanic;
            foundUser.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.BioMechanic,
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
          name = faker.name.findName();
        }
        const user = new UserCollection({
          username: `user${index}`,
          password: ENV.PASSWORD_SEED,
          name: name,
        });

        switch (index) {
          case 0:
            user.role = Role.Admin;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 1:
            user.role = Role.MedicalDirector;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 2:
            user.role = Role.HeadOfDepartment;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 3:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community,
              nameMapper,
            );
            break;
          case 4:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab,
              nameMapper,
            );
            break;
          case 5:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity,
              nameMapper,
            );
            break;
          case 6:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 7:
            user.role = Role.Admin;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 8:
            user.role = Role.MedicalDirector;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.General,
              nameMapper,
            );
            break;
          case 9:
            user.role = Role.HeadOfDepartment;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 10:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Community,
              nameMapper,
            );
            break;
          case 11:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Rehab,
              nameMapper,
            );
            break;
          case 12:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.Maternity,
              nameMapper,
            );
            break;
          case 13:
            user.role = Role.User;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.NICU,
              nameMapper,
            );
            break;
          case 14:
            user.role = Role.BioMechanic;
            user.departmentId = Departments.Hashtable.getDeptIdFromName(
              DefaultDepartments.BioMechanic,
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

    const messages = [
      ['Patient Information', 'Patient in Room 415 has a scheduled surgery at 1pm today.'],
      [
        'Hospital Policy Update',
        "The hospital's policy on patient visitation has been updated. Please review it carefully.",
      ],
      [
        'Cafeteria Closure',
        'The cafeteria will be closed for cleaning tonight. Please make alternative arrangements for meals.',
      ],
      [
        'Patient Appointment',
        'Patient in Room 601 has a scheduled consultation with the oncologist at 2pm today.',
      ],
      ['Volunteer Program', "The hospital's volunteer program is now accepting new applications."],
      [
        'Hand Hygiene Audit',
        'Reminder: The hospital-wide hand hygiene audit will take place next week.',
      ],
      [
        'IT Maintenance',
        "The IT department will be performing maintenance on the hospital's servers tonight.",
      ],
      [
        'Patient Care',
        'Patient in Room 308 is experiencing shortness of breath. Please assess the situation and provide appropriate care.',
      ],
      ['Flu Shot Clinic', "The hospital's annual flu shot clinic will be held next week."],
      ['Cafeteria Promotion', 'The cafeteria is running a promotion on healthy snacks this week.'],
      [
        'Translation Request',
        'Patient in Room 501 has requested a translator. Please contact the appropriate personnel.',
      ],
      [
        'Bed Linen Shortage',
        'The hospital is currently experiencing a shortage of bed linens. Please use them judiciously.',
      ],
      [
        'Patient Safety Training',
        'The night shift supervisor will be holding a training session on patient safety next week.',
      ],
      [
        'Patient Discharge',
        'Patient in Room 712 has been discharged. Please arrange for transportation if necessary.',
      ],
      [
        'Gift Shop Announcement',
        "The hospital's gift shop is now open. Please stop by and support our auxiliary volunteers.",
      ],
      [
        'Disaster Preparedness Drill',
        'Reminder: The hospital-wide disaster preparedness drill is scheduled for next month.',
      ],
      [
        'Radiology Department Backlog',
        'The radiology department is experiencing a backlog of scans. Please prioritize urgent cases.',
      ],
      ['Scheduled CT Scan', 'Patient in Room 301 has a scheduled CT scan at 11am today.'],
      [
        'Blood Donation Request',
        'The hospital is running low on certain types of blood products. Please contact the blood bank if you can donate.',
      ],
      [
        'Cafeteria Renovations',
        'The cafeteria will be closed for renovations starting next Monday. Please make alternative arrangements for meals.',
      ],
      [
        'Spiritual Counselor Request',
        'Patient in Room 401 has requested a spiritual counselor. Please contact the appropriate personnel.',
      ],
      [
        'Workplace Violence Prevention',
        "The hospital's policy on workplace violence prevention has been updated. Please review it carefully.",
      ],
      [
        'Team-Building Exercise',
        'The night shift supervisor will be holding a team-building exercise next week.',
      ],
      [
        'Scheduled Family Visit',
        'Patient in Room 212 has a scheduled visit from a family member at 2pm today.',
      ],
      [
        'Cultural Competence Workshop',
        'The hospital is offering a workshop on cultural competence in healthcare next month.',
      ],
      [
        'Fresh Produce Order',
        'The cafeteria is running low on fresh produce. Please order more if possible.',
      ],
      [
        'Bedside Commode Request',
        'Patient in Room 511 has requested a bedside commode. Please provide one if available.',
      ],
      [
        'Parking Garage Closure',
        "The hospital's parking garage will be closed for repairs next week. Please park in alternative locations.",
      ],
      [
        'Night Shift Staffing',
        'The night shift will be overstaffed tonight. Please let us know if you would like to take a break or leave early.',
      ],
      [
        'Food Allergy Alert',
        'Patient in Room 303 has a severe peanut allergy. Please ensure that no peanuts or peanut products are served to them.',
      ],
      [
        'Emergency Drill',
        "The hospital's emergency response team will be conducting a drill tomorrow morning. Please follow instructions from staff members.",
      ],
      [
        'New Equipment Training',
        "The hospital's biomedical department will be holding training sessions on the new equipment installed in the operating rooms.",
      ],
      [
        'Patient Discharge Delay',
        'The discharge of patient in Room 604 has been delayed. Please inform their family members accordingly.',
      ],
      [
        'Flowers and Gifts Policy',
        'The hospital has updated its policy on flowers and gifts for patients. Please review it carefully.',
      ],
      [
        'Surgical Staff Meeting',
        'All surgical staff are requested to attend a meeting in the conference room at 3pm today.',
      ],
      [
        'MRI Machine Maintenance',
        'The MRI machine will be unavailable for use for maintenance from 10am to 2pm tomorrow.',
      ],
      [
        'Medical Waste Disposal',
        'Reminder: All staff members must dispose of medical waste in designated containers only.',
      ],
      [
        'Interpreter Needed',
        'Patient in Room 709 requires an interpreter for their appointment tomorrow morning. Please arrange accordingly.',
      ],
      [
        'Pharmacy Staffing',
        'The pharmacy department is short-staffed tonight. Please contact the supervisor if you are available to help.',
      ],
      [
        'Patient Satisfaction Survey',
        "The hospital's patient satisfaction survey will be conducted in the next few weeks. Please encourage patients to participate.",
      ],
      [
        'Nursing Conference',
        'The annual nursing conference will be held next month. Please register if you would like to attend.',
      ],
      [
        'Supply Room Inventory',
        'All staff members are requested to assist in taking inventory of the supply room tomorrow morning.',
      ],
      [
        'IT Security Update',
        "The hospital's IT department has released a security update. Please ensure that your devices are up-to-date.",
      ],
      [
        'Patient Transfer Request',
        'The patient in Room 408 has requested a transfer to another hospital. Please initiate the necessary arrangements.',
      ],
      [
        'Community Blood Drive',
        'The hospital is hosting a community blood drive next week. Please encourage donors to sign up.',
      ],
      [
        'Laboratory Result Delay',
        'The laboratory is experiencing delays in releasing test results. Please inform patients accordingly.',
      ],
      [
        'Environmental Services Training',
        'The environmental services department will be conducting training sessions on infection control and sanitation practices.',
      ],
      [
        'Patient Meal Preferences',
        'All staff members are requested to inquire about patient meal preferences and communicate them to the dietary department.',
      ],
      [
        'Employee Assistance Program',
        "The hospital's employee assistance program is available to provide counseling and support to staff members.",
      ],
      [
        'Surgical Instrument Cleaning',
        'All surgical staff members are reminded to ensure that surgical instruments are cleaned and sterilized properly.',
      ],
      [
        'Maternity Ward Visitor Policy',
        "The maternity ward's visitor policy has been updated. Please review it carefully.",
      ],
      [
        'Physical Therapy Referral',
        'Patient in Room 510 requires a referral for physical therapy. Please consult with the attending physician.',
      ],
      [
        'Human Resources Policy Update',
        "The hospital's human resources department has updated its policies on employee benefits. Please review them carefully.",
      ],
      [
        'Security Alert',
        'A security alert has been issued for a missing patient. Please be vigilant and report any suspicious activity.',
      ],
      [
        'Volunteer Appreciation Event',
        "The hospital's auxiliary volunteers will be honored at an appreciation event next week.",
      ],
      [
        'Billing and Insurance Assistance',
        "The hospital's billing and insurance assistance office is available to provide support to patients and their families.",
      ],
      [
        'Infection Control Audit',
        'The hospital-wide infection control audit will be conducted next week. Please ensure that all protocols are followed.',
      ],
      [
        'Patient Fall Prevention',
        'Reminder: All staff members are responsible for ensuring that patient fall prevention protocols are followed.',
      ],
      [
        'Medical Record Requests',
        'All medical record requests must be submitted to the health information management department.',
      ],
      [
        'Nursing Shift Change',
        'All nursing staff members are reminded to properly communicate patient information during shift change.',
      ],
      [
        'Patient Transport Request',
        'Patient in Room 201 requires transportation to a medical appointment offsite. Please arrange accordingly.',
      ],
      [
        'Employee Wellness Program',
        "The hospital's employee wellness program is available to provide resources and support for staff members' well-being.",
      ],
      [
        'Infection Control Training',
        'All staff members are required to attend infection control training sessions next week.',
      ],
      [
        'Patient Safety Concern',
        'If you have a concern about patient safety, please report it to your supervisor or the patient safety department.',
      ],
      [
        'Medication Administration Error',
        'If you have made a medication administration error, please report it immediately to the attending physician.',
      ],
      [
        'Patient Room Cleaning',
        'All staff members are responsible for ensuring that patient rooms are cleaned and sanitized properly.',
      ],
      [
        'Code Blue Response Drill',
        "The hospital's code blue response team will be conducting a drill tomorrow afternoon.",
      ],
      [
        'Patient Appointment Reminder',
        'Reminder: Please remind patients of their upcoming appointments and provide necessary instructions.',
      ],
      [
        'Radiology Equipment Maintenance',
        'The radiology department will be conducting maintenance on the imaging equipment from 8am to 12pm tomorrow.',
      ],
      [
        'Social Work Consult Request',
        'Patient in Room 408 requires a social work consult. Please contact the social work department.',
      ],
      [
        'Medical Equipment Loan Request',
        "The hospital's medical equipment loan program is available to provide equipment for patient care at home.",
      ],
      [
        'Patient Discharge Instructions',
        'All staff members are responsible for ensuring that patients receive proper discharge instructions and follow-up care plans.',
      ],
      [
        'Pharmacy Medication Shortage',
        'The pharmacy department is currently experiencing a shortage of certain medications. Please consult with the pharmacist for alternative options.',
      ],
      [
        'Patient Transport Policy',
        "The hospital's patient transport policy has been updated. Please review it carefully.",
      ],
      [
        'Surgical Procedure Change',
        'The surgical procedure for patient in Room 605 has been changed. Please consult with the attending physician for details.',
      ],
      [
        'Patient Experience Improvement',
        'The hospital is committed to improving the patient experience. Please share any ideas or suggestions with the patient experience department.',
      ],
      [
        'Security Camera Upgrade',
        "The hospital's security cameras will be upgraded next week. Please be aware of potential disruptions.",
      ],
      [
        'Interdisciplinary Care Team Meeting',
        'The interdisciplinary care team will be holding a meeting tomorrow morning to discuss patient care plans.',
      ],
      [
        'Laboratory Specimen Collection Reminder',
        'Reminder: All laboratory specimens must be collected and labeled properly.',
      ],
      [
        'Volunteer Opportunities',
        "The hospital's auxiliary volunteer program has opportunities available for those interested in volunteering.",
      ],
      [
        'Patient Satisfaction Feedback',
        'Please encourage patients to provide feedback on their experience at the hospital to help us improve our services.',
      ],
      [
        'Environmental Services Request',
        'If you need assistance from the environmental services department, please submit a request through the online system.',
      ],
      [
        'Medical Staff Meeting',
        'All medical staff members are requested to attend a meeting in the conference room at 4pm today.',
      ],
      [
        'Patient Communication Assistance',
        'If you need assistance communicating with a patient, please contact the interpreter services department.',
      ],
      [
        'Medication Disposal Reminder',
        'Reminder: All medication must be disposed of properly to prevent potential harm or misuse.',
      ],
      [
        'Patient Financial Assistance',
        "The hospital's financial assistance program is available to provide support for patients with financial hardship.",
      ],
    ];

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

const setDefaultFeaturedCaseStudy = (user: User, caseStudyTemplate) => {
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
    const caseStudies = [
      [
        'Patient Story',
        'Linda Etienne',
        '43',
        'Port-au-Prince',
        'Severe stomach pain',
        '3 days',
        'Gastrointestinal bleeding caused by a peptic ulcer',
        "Linda Etienne, a 43-year-old mother of three, had been experiencing severe stomach pain for several days before she decided to visit the hospital. At first, she thought it was just a stomach bug and tried to tough it out, but the pain only got worse. Finally, her husband convinced her to seek medical attention. When she arrived at the hospital, Linda was seen by a gastroenterologist who suspected that she might have a peptic ulcer. After some tests, the doctor confirmed that Linda did indeed have an ulcer, and that it had caused gastrointestinal bleeding. Linda was admitted to the hospital and given medication to help control the bleeding and reduce the inflammation in her stomach. She was also advised to make some lifestyle changes, such as avoiding spicy and acidic foods, and reducing her stress levels. After three days in the hospital, Linda's condition had improved significantly. She was discharged with a prescription for medication to continue treating her ulcer, and advised to follow up with her gastroenterologist regularly. Although Linda was initially scared and reluctant to seek medical attention, she was grateful to the hospital staff for their kindness and expertise in helping her recover from her illness. She now knows the importance of taking care of her health and seeking medical help when needed.",
      ],
      [
        'Patient Story',
        'Jean-Francois Michel',
        '29',
        'Cap-Haitien',
        'Chest pain and shortness of breath',
        '2 days',
        'Myocardial infarction (heart attack)',
        "Jean-Francois Michel, a 29-year-old musician from Cap-Haitien, was rushed to the hospital after experiencing chest pain and shortness of breath. He had been feeling unwell for a few days, but didn't think it was anything serious until the pain became unbearable. When he arrived at the hospital, doctors quickly diagnosed him with a myocardial infarction (heart attack) and began treatment. Jean-Francois underwent surgery to unblock a clogged artery and was monitored closely by hospital staff during his recovery. After two days in the hospital, he was stable enough to be discharged and was advised to make some lifestyle changes, such as quitting smoking and reducing his alcohol intake, to reduce his risk of future heart problems. Jean-Francois was grateful to the hospital staff for their quick and effective treatment, and now takes his health more seriously.",
      ],
      [
        'Training Session',
        '03-01-2023',
        'Patient Communication',
        'Dr. Smith',
        ['Nurse Johnson', 'Nurse Lee', 'Dr. Patel'],
        'Improved communication skills will help hospital staff build stronger relationships with patients and improve patient satisfaction.',
        'During the training, attendees learned about best practices for communicating with patients and how to handle difficult situations. Nurse Johnson shared a story about a patient who was upset and anxious about their upcoming procedure. She used active listening skills and empathy to help the patient feel more comfortable and informed about what to expect. The patient later wrote a letter thanking Nurse Johnson for her care.',
      ],
      [
        'Training Session',
        '03-07-2023',
        'Infection Control',
        'Dr. Garcia',
        ['Nurse Kim', 'Nurse Singh', 'Dr. Chen'],
        'Improved infection control practices can help prevent the spread of disease and protect both patients and staff.',
        "During the training, attendees learned about the importance of proper hand hygiene and how to properly clean and disinfect surfaces. Nurse Kim shared a story about a time when she witnessed a colleague not washing their hands properly before entering a patient's room. She used the opportunity to educate her colleague about the importance of hand hygiene and how it can help protect patients from infections.",
      ],
      [
        'Patient Story',
        'Louis Charles',
        '72',
        'Les Cayes',
        'Weakness and dizziness',
        '2 days',
        'Dehydration and low blood pressure',
        'Louis Charles, a 72-year-old farmer from Les Cayes, had been feeling weak and dizzy for several days before he decided to visit the hospital. When he arrived, doctors discovered that he was severely dehydrated and had low blood pressure. Louis was admitted to the hospital and given fluids intravenously to help rehydrate him. Doctors also discovered that he had an underlying heart condition that was contributing to his symptoms. Louis was monitored closely by hospital staff during his stay, and after two days, he was stable enough to be discharged. He was advised to continue taking his medication for his heart condition and to drink plenty of fluids to avoid becoming dehydrated again. Louis was grateful to the hospital staff for their quick and effective treatment, and for helping him feel better.',
      ],
      [
        'Patient Story',
        'Sophie Jean',
        '18',
        'Gonaives',
        'Fever and body aches',
        '3 days',
        'Malaria',
        'Sophie Jean, an 18-year-old student from Gonaives, had been feeling unwell for several days before she decided to visit the hospital. When she arrived, doctors discovered that she had a fever and body aches, and suspected that she might have malaria. After some tests, their suspicions were confirmed, and Sophie was admitted to the hospital to receive treatment. She was given medication to help control the fever and reduce the severity of her symptoms. Hospital staff monitored her closely during her stay, and after three days, she was feeling much better. Sophie was discharged with a prescription for medication to complete her treatment for malaria, and advised to take measures to avoid being bitten by mosquitoes in the future. Sophie was grateful to the hospital staff for their care and attention, and for helping her recover from her illness.',
      ],
      [
        'Patient Story',
        'Pierre-Jean Louis',
        '41',
        'Port-au-Prince',
        'Abdominal pain and swelling',
        '5 days',
        'Gastric cancer',
        'Pierre-Jean Louis, a 41-year-old taxi driver from Port-au-Prince, had been experiencing abdominal pain and swelling for several weeks before he decided to visit the hospital. When he arrived, doctors discovered a mass in his stomach and suspected that he might have gastric cancer. After some tests, their suspicions were confirmed, and Pierre-Jean was admitted to the hospital to receive treatment. He underwent surgery to remove the cancerous tumor and was closely monitored during his recovery. Hospital staff provided him with emotional support and helped him cope with the difficult news of his diagnosis. After five days in the hospital, Pierre-Jean was stable enough to be discharged, and was advised to continue with further treatment and follow-up appointments. Although he was scared and uncertain about his future, Pierre-Jean was grateful to the hospital staff for their expertise and compassion in helping him through his illness.',
      ],
      [
        'Patient Story',
        'Marie Antoine',
        '28',
        'Jacmel',
        'Difficulty breathing',
        '1 day',
        'Asthma',
        'Marie Antoine, a 28-year-old teacher from Jacmel, had been experiencing difficulty breathing for several days before she decided to visit the hospital. When she arrived, doctors diagnosed her with asthma and admitted her to the hospital for treatment. She was given medication to help open up her airways and reduce inflammation. Hospital staff monitored her closely during her stay, and after one day, she was feeling much better. Marie was discharged with a prescription for medication to manage her asthma symptoms, and advised to avoid triggers such as cigarette smoke and dust.',
      ],
      [
        'Patient Story',
        'Jean-Baptiste Dubois',
        '65',
        'Leogane',
        'Chest pain and shortness of breath',
        '4 days',
        'Heart attack',
        'Jean-Baptiste Dubois, a 65-year-old retiree from Leogane, was rushed to the hospital after experiencing severe chest pain and shortness of breath. When he arrived, doctors diagnosed him with a heart attack and admitted him to the hospital for emergency treatment. He underwent surgery to clear blocked arteries and was closely monitored during his recovery. Hospital staff provided him with emotional support and helped him adjust to the lifestyle changes needed to manage his condition. After four days in the hospital, Jean-Baptiste was stable enough to be discharged, and was advised to follow a healthy diet and exercise plan to prevent future heart problems.',
      ],
      [
        'Patient Story',
        'Jacqueline Francois',
        '42',
        'Cap-Haitien',
        'Severe abdominal pain',
        '2 days',
        'Gallstones',
        'Jacqueline Francois, a 42-year-old market vendor from Cap-Haitien, had been experiencing severe abdominal pain for several days before she decided to visit the hospital. When she arrived, doctors diagnosed her with gallstones and admitted her to the hospital for treatment. She underwent surgery to remove the gallstones and was closely monitored during her recovery. Hospital staff provided her with pain medication and advised her on dietary changes to prevent future gallstones from forming. After two days in the hospital, Jacqueline was feeling much better and was discharged with a prescription for medication to manage her pain.',
      ],
    ];

    setDefaultFeaturedCaseStudy(randomDefaultUser, caseStudies[0]);

    for (let i = 1; i < caseStudies.length; i++) {
      const randomUser = selectRandomUser(users);
      generateRandomCaseStudy(caseStudies[i][0], randomUser, caseStudies[i]);
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
    for (let deptName in DefaultDepartments) {
      const department = new DepartmentCollection({
        name: DefaultDepartments[deptName],
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
    const brokenEquipment = [
      ['X-ray machine', 'Cracked display screen caused by accidental impact', 'urgent'],
      ['MRI scanner', 'Power failure due to electrical surge during lightning storm', 'important'],
      [
        'Ultrasound machine',
        'Faulty probe with distorted images caused by wear and tear',
        'non-urgent',
      ],
      [
        'ECG machine',
        'Loose cable connection causing intermittent signal loss due to repeated use',
        'important',
      ],
      [
        'Ventilator',
        'Low oxygen output due to blocked flow sensor caused by buildup of debris',
        'urgent',
      ],
      [
        'Defibrillator',
        'Battery failure with error message "Battery Low" caused by expired battery',
        'important',
      ],
      ['Anesthesia machine', 'Leaking gas from faulty valve caused by wear and tear', 'urgent'],
      [
        'Blood pressure monitor',
        'Malfunctioning cuff with inaccurate readings caused by worn-out components',
        'non-urgent',
      ],
      ['Surgical microscope', 'Blurred lens with poor focus caused by dirty lens', 'non-urgent'],
      [
        'Pulse oximeter',
        'Faulty sensor causing erratic readings caused by damaged sensor',
        'important',
      ],
      [
        'Fetal heart rate monitor',
        'No power due to disconnected power cord caused by accidental unplugging',
        'urgent',
      ],
      [
        'Endoscope',
        'Cracked lens with visible distortion caused by accidental impact',
        'non-urgent',
      ],
      [
        'Infusion pump',
        'Blocked line due to debris in infusion tubing caused by contamination',
        'important',
      ],
      [
        'Nebulizer',
        'No mist output due to clogged mesh caused by accumulation of medication residue',
        'non-urgent',
      ],
      [
        'Syringe pump',
        'Jammed plunger with error message "Pump Failure" caused by damaged plunger',
        'urgent',
      ],
      ['Wheelchair', 'Broken wheel causing wobbling caused by wear and tear', 'non-urgent'],
      [
        'Hospital bed',
        'Worn out mattress with visible sagging caused by repeated use',
        'non-urgent',
      ],
      ['Walker', 'Loose grip causing slipping caused by wear and tear', 'non-urgent'],
      ['Crutches', 'Broken handle causing instability caused by accidental impact', 'non-urgent'],
      [
        'Blood gas analyzer',
        'Outdated software with compatibility issues caused by lack of updates',
        'important',
      ],
    ];

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
        DefaultDepartments.Maternity,
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

const generateRandomCaseStudy = (caseStudyType, user: User, caseStudyTemplate) => {
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
            staffName: faker.name.findName(),
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
            whoSentEquipment: faker.name.findName(),
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

const seedReports = async () => {
  console.log(`Seeding reports...`);
  try {
    await ReportCollection.deleteMany({});
    const user = await UserCollection.findOne({ username: 'user2' });
    const serializer = ObjectSerializer.getObjectSerializer();
    const serialized = serializer.serialize(buildNicuPaedsReport());
    let report = new ReportCollection({
      departmentId: user?.departmentId,
      submittedUserId: user?._id,
      submittedBy: user?.username,
      reportMonth: new Date(new Date().getFullYear(), new Date().getMonth()),
      reportObject: serialized,
      isDraft: false,
    });
    await report.save();
    console.log(`Reports seeded`);
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
    const readline = require('readline');
    const IS_GITLAB_CI = process.env.IS_GITLAB_CI ?? 'false';
    if (process.env.IS_GITLAB_CI === 'true') {
      (async () => await seedDb())(); // anonymous async function
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        `Confirm to reseed database (old data will be discarded) (Y to confirm): `,
        async function (answer) {
          if (answer === 'Y') await seedDb();
          rl.close();
        },
      );

      rl.on('close', function () {
        process.exit(0);
      });
    }
  })
  .catch((err) => console.log(err));
