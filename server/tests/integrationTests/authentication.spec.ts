import http from 'http';
import {
  Accounts,
  closeServer,
  seedMongo,
  setUpSession,
  dropMongo,
  setupApp,
  setupHttpServer,
} from 'testTools//mochaHooks';
import {
  USERS_ENDPOINT,
  LOGOUT_ENDPOINT,
  CSRF_ENDPOINT,
  LOGIN_ENDPOINT,
} from 'testTools/endPoints';
import { HTTP_OK_CODE, HTTP_UNAUTHORIZED_CODE } from 'exceptions/httpException';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Application } from 'express';
import { connectTestMongo } from 'utils/mongoDb';

chai.use(chaiHttp);

describe('Test login process', function () {
  let httpServer: http.Server;
  let agent: any;
  let mongo: MongoMemoryServer;

  before('Create a Working Server', async function () {
    await connectTestMongo();

    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);
  });

  after('Close a Working server', async function () {
    closeServer(agent, httpServer, mongo);
  });

  beforeEach('start with clean mongoDB', async function () {
    await seedMongo();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should generate a CSRF token', async function () {
    let res = await agent.get(CSRF_ENDPOINT);

    expect(res.body.CSRFToken).to.be.a('string');
  });

  it('Should log in as admin user', async function () {
    let csrfRes = await agent.get(CSRF_ENDPOINT);
    let csrf = csrfRes?.body?.CSRFToken;

    const res = await agent
      .post(LOGIN_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(Accounts.AdminUser);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body.success).to.be.true;
    expect(res.body.isAuth).to.be.true;
  });
});

describe('Test Admin Authorization', function () {
  let httpServer: http.Server;
  let agent: any;
  let csrf: String;
  let mongo: MongoMemoryServer;

  before('Create a Working Server and Login With Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    httpServer = session.httpServer;
    agent = session.agent;
    csrf = session.csrf;
    mongo = session.mongo;
  });

  after('Close a Working Server and delete any added reports', async function () {
    closeServer(agent, httpServer, mongo);
  });

  beforeEach('start with clean mongoDB', async function () {
    await seedMongo();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Logout Admin User and make subsequent requests unauthorized', async function () {
    const response = await agent
      .post(LOGOUT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({});

    expect(response.body).to.be.true;

    const loggedOutResponse = await agent.get(USERS_ENDPOINT);
    expect(loggedOutResponse).to.have.status(HTTP_UNAUTHORIZED_CODE);
  });
});
