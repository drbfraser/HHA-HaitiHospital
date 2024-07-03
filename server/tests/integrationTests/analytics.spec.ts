import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import {
  Accounts,
  closeServer,
  DEP_ID,
  dropMongo,
  seedMongo,
  setUpSession,
} from 'testTools/mochaHooks';
import { ANALYTICS_ENDPOINT, ANALYTICS_QUESTION_ENDPOINT } from 'testTools/endPoints';
import DepartmentCollection from 'models/departments';
import { HTTP_NOTFOUND_CODE, HTTP_OK_CODE, HTTP_UNAUTHORIZED_CODE } from 'exceptions/httpException';
import { removeMonthsByTimeStep } from 'utils/analytics';
import { AnalyticsForMonths } from 'routes/api/analytics';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedTemplates } from 'seeders/seed';

chai.use(chaiHttp);

const getDepartmentId = async (departmentName: string) => {
  const department = await DepartmentCollection.findOne({
    name: departmentName,
  }).lean();

  return department?._id?.toString();
};

describe('Analytics API test for users with privileges', function () {
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
    await seedTemplates();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('should return a list of questions for rehab template', async function () {
    try {
      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId: DEP_ID.REHAB,
      });

      expect(res).to.have.status(HTTP_OK_CODE);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);

      expect(res.body).to.deep.include({
        id: '14_3_1',
        en: 'SCI - tetraplegia',
        fr: 'SCI - tétraplégie',
      });
    } catch (error) {
      throw error;
    }
  });

  it('should return a list of questions for maternity template', async function () {
    try {
      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId: DEP_ID.MATERNITY,
      });

      expect(res).to.have.status(HTTP_OK_CODE);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);

      expect(res.body).to.deep.include({
        id: 'Q15_3_0',
        en: 'Question for Domestic visits in 0-3 days and Quantity (number)',
        fr: 'Question pour Visites domicllaries 0-3 jours et quantité (nombre)',
      });
    } catch (error) {
      throw error;
    }
  });

  it('should return a list of questions for nicu-paeds template', async function () {
    try {
      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId: DEP_ID.NICU_PAEDS,
      });

      expect(res).to.have.status(HTTP_OK_CODE);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);

      expect(res.body).to.deep.include({
        id: '3',
        en: 'Patient days',
        fr: 'Jours-patient',
      });
    } catch (error) {
      throw error;
    }
  });

  it('should return a list of questions for community & health template', async function () {
    try {
      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId: DEP_ID.COMMUNITY_HEATH,
      });

      expect(res).to.have.status(HTTP_OK_CODE);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);

      expect(res.body).to.deep.include({
        id: 'q7_3_2_0',
        en: 'Question for dT1+dT2+ and Inst.',
        fr: 'Question pour dT1+dT2+ et Inst.',
      });
    } catch (error) {
      throw error;
    }
  });

  it('should return an error when department id is invalid', async function () {
    try {
      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId: DEP_ID.INVALID,
      });

      expect(res).to.have.status(HTTP_NOTFOUND_CODE);
    } catch (error) {
      throw error;
    }
  });

  it('should return a list of answers to questions', async function () {
    const departmentId = await getDepartmentId('Rehab');
    const res = await agent.get(ANALYTICS_ENDPOINT).query({
      departmentIds: departmentId,
      questionId: '1',
      startDate: '2024-02-30T14:00:00Z',
      endDate: '2025-05-30T14:00:00Z',
      timeStep: 'month',
      aggregateBy: 'month',
    });

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.be.an('array');
  });
});

describe('Analytics API tests for users without privileges', function () {
  let httpServer: http.Server;
  let agent: any;
  let csrf: String;
  let mongo: MongoMemoryServer;

  before('Create a Working Server and Login With User', async function () {
    const session = await setUpSession(Accounts.NormalUser);

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

  it('should return an error when a normal user accesses all questions in any department', async function () {
    const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
      departmentId: DEP_ID.REHAB,
    });

    expect(res).to.have.status(HTTP_UNAUTHORIZED_CODE);
  });

  it('should return an error when a normal user accesses analytics for any department', async function () {
    const res = await agent.get(ANALYTICS_ENDPOINT).query({
      departmentIds: DEP_ID.REHAB,
      questionId: '1',
      startDate: '2024-02-30T14:00:00Z',
      endDate: '2025-05-30T14:00:00Z',
      timeStep: 'month',
      aggregateBy: 'month',
    });

    expect(res).to.have.status(HTTP_UNAUTHORIZED_CODE);
  });
});

describe('#removeMonthByTimeStep()', function () {
  it('should remove dates not following time step of a year', function () {
    const testData: AnalyticsForMonths[] = [
      {
        _id: '06 2023',
        reports: [],
      },
      {
        _id: '08 2023',
        reports: [],
      },
      {
        _id: '08 2024',
        reports: [],
      },
      {
        _id: '06 2025',
        reports: [],
      },
      {
        _id: '06 2024',
        reports: [],
      },
    ];

    const startDate = new Date(Date.parse('2023-06-02'));

    expect(removeMonthsByTimeStep(testData, startDate)).deep.equal([
      {
        _id: '06 2023',
        reports: [],
      },
      {
        _id: '06 2025',
        reports: [],
      },
      {
        _id: '06 2024',
        reports: [],
      },
    ]);
  });
});
