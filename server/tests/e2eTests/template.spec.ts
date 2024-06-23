import { QuestionGroup } from '@hha/common';
import http from 'http';
import { Application } from 'express';
import {
  setupApp,
  setupHttpServer,
  Accounts,
  closeServer,
  dropMongo,
  seedMongo,
  setUpSession,
  DEP_ID,
} from 'testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, TEMPLATE_ENDPOINT } from 'testTools/endPoints';
import { ITemplate, TemplateCollection } from 'models/template';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedMessageBoard, seedTemplates } from 'seeders/seed';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: String;

describe('template tests', function () {
  let mongo: MongoMemoryServer;
  before('Create a Working Server and Login With Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    httpServer = session.httpServer;
    agent = session.agent;
    mongo = session.mongo;
    csrf = session.csrf;
  });

  after('Close a Working Server and delete any added reports', async function () {
    closeServer(agent, httpServer, mongo);
  });

  beforeEach('start with clean mongoDB', async function () {
    await seedMongo();
    await seedTemplates();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('should fetch template correctly', function (done) {
    agent
      .get(`${TEMPLATE_ENDPOINT}/${DEP_ID.REHAB}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (err: any, res: any) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('template');
        expect(
          new QuestionGroup<string, string>('', res.body.template.reportObject) instanceof
            QuestionGroup,
        ).to.be.true;
        done();
      });
  });
});
