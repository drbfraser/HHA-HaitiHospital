import * as ENV from 'utils/processEnv';

import http from 'http';
import { Application } from 'express';
import { createServer } from 'server';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT } from './endPoints';
import { TEST_SERVER_PORT } from 'utils/processEnv';
import { connectTestMongo } from 'utils/mongoDb';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserCollection, { UserWithInstanceMethods } from 'models/user';
import DepartmentCollection from 'models/departments';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

export const DEP_ID = {
  GENERAL: '666e07bb81f0646fc4c87c9f',
  REHAB: '666e07bb81f0646fc4c87ca1',
  MATERNITY: '666e07bb81f0646fc4c87ca5',
  NICU_PAEDS: '666e07bb81f0646fc4c87ca3',
  COMMUNITY_HEATH: '666e07bb81f0646fc4c87ca7',
  INVALID: '776e07bb81f0646fc4c87ca7',
};

export const USER_ID = {
  ADMIN: '666e07bb81f0646fc4c87cae',
  REGULAR: '666e07bb81f0646fc4c87cb7',
  DEP_HEAD: '666e07bb81f0646fc4c87cb4',
  MED_DIR: '666e07bb81f0646fc4c87cb1',
};

export interface UserAccount {
  username: string;
  password: string;
}

export const INVALID_ID = '000000000000000000000000';

const AdminUser: UserAccount = {
  username: 'user0',
  password: ENV.PASSWORD_SEED,
};

const IncorrectPasswordUser: UserAccount = {
  username: 'user0',
  password: 'INCORRECT PASSWORD',
};

const NormalUser: UserAccount = {
  username: 'user3',
  password: ENV.PASSWORD_SEED,
};

const DepartmentHead: UserAccount = {
  username: 'user2',
  password: ENV.PASSWORD_SEED,
};

const MedicalDirector: UserAccount = {
  username: 'user1',
  password: ENV.PASSWORD_SEED,
};

export const Accounts = {
  AdminUser,
  IncorrectPasswordUser,
  NormalUser,
  DepartmentHead,
  MedicalDirector,
};

export const setupApp = () => {
  return createServer();
};

export const setupHttpServer = (testApp: Application) => {
  const httpServer = http.createServer(testApp);
  httpServer.listen(TEST_SERVER_PORT, () => {});
  return httpServer;
};

export const closeServer = async (
  agent: any,
  httpServer: http.Server,
  mongo: MongoMemoryServer,
) => {
  agent.close();
  httpServer.close();
  await mongoose.disconnect();
  await mongo.stop();
};

export const setUpSession = async (user: UserAccount) => {
  let mongo = await connectTestMongo();
  await seedMongo();

  let app: Application = setupApp();
  let httpServer = setupHttpServer(app);
  let agent = chai.request.agent(app);

  let res = await agent.get(CSRF_ENDPOINT);
  let csrf = res?.body?.CSRFToken;

  await agent
    .post(LOGIN_ENDPOINT)
    .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
    .send(user);

  await dropMongo();

  return { agent, httpServer, mongo, csrf, isError: false };
};

export const seedMongo = async () => {
  let deps = await DepartmentCollection.insertMany([
    {
      _id: mongoose.Types.ObjectId(DEP_ID.GENERAL),
      name: 'General',
      hasReport: false,
    },
    {
      _id: mongoose.Types.ObjectId(DEP_ID.REHAB),
      name: 'Rehab',
      hasReport: true,
    },
    {
      _id: mongoose.Types.ObjectId(DEP_ID.MATERNITY),
      name: 'Maternity',
      hasReport: true,
    },
    {
      _id: mongoose.Types.ObjectId(DEP_ID.NICU_PAEDS),
      name: 'NICU/Paeds',
      hasReport: true,
    },
    {
      _id: mongoose.Types.ObjectId(DEP_ID.COMMUNITY_HEATH),
      name: 'Community & Health',
      hasReport: true,
    },
  ]);
  for (const dep of deps) {
    await dep.save();
  }

  let users = await UserCollection.insertMany([
    {
      _id: mongoose.Types.ObjectId(USER_ID.ADMIN),
      role: 'Admin',
      username: 'user0',
      password: ENV.PASSWORD_SEED,
      name: 'Admin User',
      departmentId: DEP_ID.GENERAL,
    },
    {
      _id: mongoose.Types.ObjectId(USER_ID.MED_DIR),
      role: 'Medical Director',
      username: 'user1',
      password: ENV.PASSWORD_SEED,
      name: 'Medical Director User',
      departmentId: DEP_ID.GENERAL,
    },
    {
      _id: mongoose.Types.ObjectId(USER_ID.DEP_HEAD),
      role: 'Head of Department',
      username: 'user2',
      password: ENV.PASSWORD_SEED,
      name: 'Head of General Department User',
      departmentId: DEP_ID.GENERAL,
    },
    {
      _id: mongoose.Types.ObjectId(USER_ID.REGULAR),
      role: 'User',
      username: 'user3',
      password: ENV.PASSWORD_SEED,
      name: 'Regular User',
      departmentId: DEP_ID.GENERAL,
    },
  ]);

  await Promise.all(users.map((user) => asyncRegisterUser(user)));
};

export const dropMongo = async () => {
  await mongoose.connection.dropDatabase();
};

async function asyncRegisterUser(user: UserWithInstanceMethods) {
  return new Promise((resolve, reject) => {
    user.registerUser(user, (err: Error, user: UserWithInstanceMethods) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}
