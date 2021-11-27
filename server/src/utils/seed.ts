import faker from 'faker';
import { join } from 'path';

import User, { Role } from '../models/User';
import Department, { DepartmentName } from '../models/Leaderboard';
import Message from '../models/Message';
import { deleteAllAvatars } from './utils';

import NicuPaeds from '../models/NicuPaeds';
import Community from '../models/Community';

export const seedDb = async () => {
  console.log('Seeding users...');

  await User.deleteMany({});
  await User.collection.dropIndexes().catch(err => console.log(err));
  // await Message.deleteMany({});
  // await deleteAllAvatars(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

  // create users
  const usersPromises = [...Array(7).keys()].map((index, i) => {
    const user = new User({
      // provider: 'email',
      username: `user${index}`,
      // email: `email${index}@email.com`,
      password: '123456789',
      name: faker.name.findName(),
      // avatar: faker.image.avatar(),
      // avatar: `avatar${index}.jpg`,
      // bio: faker.lorem.sentences(3),
    });

    if (index === 0) {
      user.role = Role.Admin;
    } else if (index === 1) {
      user.role = Role.MedicalDirector;
    } else if (index === 2) {
      user.role = Role.HeadOfDepartment;
      user.department = DepartmentName.NicuPaeds;
    } else if (index === 3) {
      user.department = DepartmentName.Maternity;
    } else if (index === 4) {
      user.department = DepartmentName.Rehab;
    } else if (index === 5) {
      user.department = DepartmentName.CommunityHealth;
    } else if (index === 6) {
      user.department = DepartmentName.NicuPaeds;
    }
    user.registerUser(user, () => {});
    return user;
  });

  // await Promise.all(
  //   usersPromises.map(async (user) => {
  //     user.registerUser(user, () => {});
  //     // await user.save();
  //   }),
  // );

  // // create 9 messages
  // const messagePromises = [...Array(9).keys()].map((index, i) => {
  //   const message = new Message({
  //     text: faker.lorem.sentences(3),
  //   });
  //   return message;
  // });

  // await Promise.all(
  //   messagePromises.map(async (message) => {
  //     await message.save();
  //   }),
  // );

  // const users = await User.find();
  // const messages = await Message.find();

  // // every user 3 messages
  // users.map(async (user, index) => {
  //   const threeMessagesIds = messages.slice(index * 3, index * 3 + 3).map((m) => m.id);
  //   await User.updateOne({ _id: user.id }, { $push: { messages: threeMessagesIds } });
  // });

  // // 0,1,2 message belong to user 0 ...
  // messages.map(async (message, index) => {
  //   const j = Math.floor(index / 3);
  //   const user = users[j];
  //   await Message.updateOne(
  //     { _id: message.id },
  //     {
  //       $set: {
  //         user: user.id,
  //       },
  //     },
  //   );
  // });
  console.log('Users seeded');

  
};

export const seedDepartments = async() => {
  let dateTime: Date = new Date();
  var month: number = dateTime.getUTCMonth() + 1;
  var year: number = dateTime.getUTCFullYear();
  //ONLY USED TO TEST - MUST REMOVE IF IN PROD:
  await NicuPaeds.deleteMany({});
  await Community.deleteMany({});

  console.log("seeding default Departments...");

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

  //TODO Case Studies

  console.log("seeding default Department successful");
}

export const seedLeaderboard = async() => {
  await Department.deleteMany({});
  for (let key in DepartmentName) {
    let departmentName = DepartmentName[key];
    const department = new Department({
      name: departmentName,
    });
    department.save();
  };
}