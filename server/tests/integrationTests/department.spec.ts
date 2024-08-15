import http from 'http';
import {
  Accounts,
  closeServer,
  setUpSession,
  seedMongo,
  dropMongo,
  DEP_ID,
} from 'testTools/mochaHooks';
import { DEPARTMENT_ENDPOINT } from 'testTools/endPoints';
import {
  HTTP_INTERNALERROR_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
} from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;

describe('Department Tests', function () {
  let mongo: MongoMemoryServer;

  before('Create a Working Server and Login With Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    httpServer = session.httpServer;
    agent = session.agent;
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

  it('Should get list of all departments', async function () {
    const res = await agent.get(DEPARTMENT_ENDPOINT);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('id').that.is.a('string');
    expect(res.body[0]).to.have.property('name').that.is.a('string');
    expect(res.body[0]).to.have.property('hasReport').that.is.a('boolean');
  });

  it('Should get a department by its Id', async function () {
    const res = await agent.get(`${DEPARTMENT_ENDPOINT}/${DEP_ID.GENERAL}`);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body.id).to.be.equal(DEP_ID.GENERAL);
    expect(res.body.name).to.be.equal('General');
    expect(res.body.hasReport).to.be.false;
  });

  it('Should Unsuccessfully Get a Department Due to Invalid Id', async function () {
    const general = await agent.get(`${DEPARTMENT_ENDPOINT}/${'Invalid Id'}`);

    expect(general).to.have.status(HTTP_INTERNALERROR_CODE);
  });

  it('Should return not found code if department does not exist with that ID', async function () {
    const invalidId = '76687ef1366f942478fa3d80';

    const general = await agent.get(`${DEPARTMENT_ENDPOINT}/${invalidId}`);

    expect(general).to.have.status(HTTP_NOTFOUND_CODE);
  });
});
