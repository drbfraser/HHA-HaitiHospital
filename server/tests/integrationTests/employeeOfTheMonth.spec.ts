import http from 'http';
import { Accounts, closeServer, setUpSession, seedMongo, dropMongo } from 'testTools/mochaHooks';
import { DEPARTMENT_ENDPOINT, EMPLOYEE_OF_THE_MONTH_ENDPOINT } from 'testTools/endPoints';
import { HTTP_OK_CODE } from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;
let imgPaths: string[];

function getDepartments() {
  return agent.get(DEPARTMENT_ENDPOINT);
}

function updatePostedImgPaths(imgPath: string) {
  imgPaths.push(imgPath);
}

describe('Employee of the Month Tests', function () {
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

  it('Should Successfully Create the Employee of the Month', async function () {
    // Get a department because it is needed in the PUT request
    const departments = await getDepartments();
    const generalDepartment = departments.body[0];

    const imgPath: string = 'public/images/avatar1.jpg';

    const document: string = `{"id": "1", "name":"John","department":{"id":"${generalDepartment.id}","name":"${generalDepartment.name}"},"description":"John is incredible!", "awardedYear": "2022", "awardedMonth": "08"}`;
    const putResponse = await agent
      .post(EMPLOYEE_OF_THE_MONTH_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .field('document', document)
      .attach('file', imgPath);
    expect(putResponse).to.have.status(HTTP_OK_CODE);
  });
});
