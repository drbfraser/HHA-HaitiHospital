import http, { request } from 'http';
import { Application } from 'express';
import {
  setupApp,
  setupHttpServer,
  Accounts,
  closeServer,
  seedMongo,
  setUpSession,
  dropMongo,
} from 'testTools//mochaHooks';
import {
  CSRF_ENDPOINT,
  LOGIN_ENDPOINT,
  USERS_ENDPOINT,
  LOGOUT_ENDPOINT,
} from 'testTools/endPoints';
import { HTTP_OK_CODE } from 'exceptions/httpException';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import { connectTestMongo } from 'utils/mongoDb';
import { mongo } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

chai.use(chaiHttp);

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

  it('Should Fetch the Users', function (done) {
    agent.get(USERS_ENDPOINT).end(function (error: any, res: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(res).to.have.status(HTTP_OK_CODE);
      done();
    });
  });

  it('Should Logout Admin User', function (done) {
    agent
      .post(LOGOUT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({})
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(error).to.be.null;
        expect(response.body).to.be.true;
        done();
      });
  });
});
