import http from 'http';
import { Accounts, closeServer, setUpSession, seedMongo, dropMongo } from 'testTools/mochaHooks';
import { DEPARTMENT_ENDPOINT } from 'testTools/endPoints';
import { HTTP_INTERNALERROR_CODE, HTTP_OK_CODE } from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedCaseStudies } from 'seeders/seed';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
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
    await seedCaseStudies();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Successfully Get All Departments By Their IDs', async function () {
    const departments = await agent.get(DEPARTMENT_ENDPOINT);
    const generalId: string = departments.body[0].id;
    const rehabId: string = departments.body[1].id;
    const nicuId: string = departments.body[2].id;
    const maternityId: string = departments.body[3].id;
    const communityHealthId: string = departments.body[4].id;

    const general = await agent.get(`${DEPARTMENT_ENDPOINT}/${generalId}`);
    const rehab = await agent.get(`${DEPARTMENT_ENDPOINT}/${rehabId}`);
    const nicu = await agent.get(`${DEPARTMENT_ENDPOINT}/${nicuId}`);
    const maternity = await agent.get(`${DEPARTMENT_ENDPOINT}/${maternityId}`);
    const communityHealth = await agent.get(`${DEPARTMENT_ENDPOINT}/${communityHealthId}`);

    expect(general).to.have.status(HTTP_OK_CODE);
    expect(rehab).to.have.status(HTTP_OK_CODE);
    expect(nicu).to.have.status(HTTP_OK_CODE);
    expect(maternity).to.have.status(HTTP_OK_CODE);
    expect(communityHealth).to.have.status(HTTP_OK_CODE);
  });

  it('Should Unsuccessfully Get a Department Due to Invalid Id', async function () {
    const general = await agent.get(`${DEPARTMENT_ENDPOINT}/${'Invalid Id'}`);
    expect(general).to.have.status(HTTP_INTERNALERROR_CODE);
  });
});
