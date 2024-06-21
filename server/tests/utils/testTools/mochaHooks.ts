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
import {
  seedDepartments,
  seedUsers,
  seedBioMech,
  seedCaseStudies,
  seedEmployeeOfTheMonth,
  seedMessageBoard,
  seedReports,
  seedTemplates,
  setupDepartmentMap,
} from 'seeders/seed';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
export interface UserAccount {
  username: string;
  password: string;
}

const AdminUser: UserAccount = {
  username: 'user0',
  password: 'C@td0g',
};

const IncorrectPasswordUser: UserAccount = {
  username: 'user0',
  password: 'INCORRECT PASSWORD',
};

const NormalUser: UserAccount = {
  username: 'user3',
  password: 'C@td0g',
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

export const closeServer = (agent: any, httpServer: http.Server) => {
  agent.close();
  httpServer.close();
};

export const getCSRFToken = async (agent: ChaiHttp.Agent): Promise<string | null> => {
  try {
    const res = await agent.get(CSRF_ENDPOINT);

    return res.body.CSRFToken;
  } catch (error) {
    return null;
  }
};

export async function authenticate(
  agent: ChaiHttp.Agent,
  csrf: string,
  userAccount: UserAccount = AdminUser,
) {
  const res = await agent
    .post(LOGIN_ENDPOINT)
    .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
    .send(userAccount);

  if (res.error) {
    throw new Error('Authentication failed');
  }
}

export const setUpSession = async (user: UserAccount) => {
  const app = setupApp();
  const httpServer = setupHttpServer(app);
  const agent = chai.request.agent(app);
  connectMongo();

  try {
    const csrf = await getCSRFToken(agent);

    if (!csrf) {
      throw new Error('Unable to fetch csrf token');
    }

    await authenticate(agent, csrf!, user);
  } catch (error) {
    return { agent, httpServer, isError: true };
  }

  return { agent, httpServer, isError: false };
};

export const setUpMemoryMongo = async (): Promise<MongoMemoryServer> => {
  console.log('starting session!');
  let mongoServer = await connectTestMongo();
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

  return mongoServer;
};

export const tearDownUpMemoryMongo = async (memoryDb: MongoMemoryServer) => {
  await mongoose.disconnect();
  await memoryDb.stop();
};
