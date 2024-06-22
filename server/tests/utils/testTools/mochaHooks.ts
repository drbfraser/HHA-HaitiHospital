import * as ENV from 'utils/processEnv';

import http from 'http';
import { Application } from 'express';
import PORT from './serverPort';
import { createServer, setServerPort } from '../../../src/server';
import { endianness } from 'os';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT } from './endPoints';
import { TEST_SERVER_PORT } from 'utils/processEnv';
import { connectMongo, connectTestMongo } from 'utils/mongoDb';
import mongoose, { ClientSession, mongo } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserCollection, { UserWithInstanceMethods } from 'models/user';
import DepartmentCollection from 'models/departments';
import { CaseStudyWithInstanceMethods } from 'models/caseStudies';

export const GEN_DEP_ID = '666e07bb81f0646fc4c87c9f';
export const ADMIN_USER_ID = '666e07bb81f0646fc4c87cae';
export const REG_USER_ID = '666e07bb81f0646fc4c87cb7';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
export interface UserAccount {
  username: string;
  password: string;
}

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
export const Accounts = {
  AdminUser,
  IncorrectPasswordUser,
  NormalUser,
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
    .send(Accounts.AdminUser);

  await dropMongo();

  return { agent, httpServer, mongo, csrf, isError: false };
};

export const seedMongo = async () => {
  let deps = await DepartmentCollection.insertMany([
    {
      _id: mongoose.Types.ObjectId(GEN_DEP_ID),
      name: 'General',
      hasReport: false,
      __v: 0,
    },
  ]);
  for (const dep of deps) {
    await dep.save();
  }

  let users = await UserCollection.insertMany([
    {
      _id: mongoose.Types.ObjectId(ADMIN_USER_ID),
      role: 'Admin',
      username: 'user0',
      password: ENV.PASSWORD_SEED,
      name: 'Admin User',
      departmentId: GEN_DEP_ID,
    },
    {
      _id: mongoose.Types.ObjectId(REG_USER_ID),
      role: 'User',
      username: 'user3',
      password: ENV.PASSWORD_SEED,
      name: 'Regular User',
      departmentId: GEN_DEP_ID,
    },
  ]);

  for (const user of users) {
    await asyncRegisterUser(user);
  }
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
