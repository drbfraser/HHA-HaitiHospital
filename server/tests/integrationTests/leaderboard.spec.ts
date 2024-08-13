import http from 'http';
import {
  Accounts,
  closeServer,
  DEP_ID,
  dropMongo,
  seedMongo,
  setUpSession,
  USER_ID,
} from 'testTools/mochaHooks';
import { LEADERBOARD_ENDPOINT } from 'testTools/endPoints';
import { HTTP_OK_CODE } from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import CaseStudyModel, { CaseStudyOptions } from 'models/caseStudies';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

async function createEmptyCaseStudy(departmentId: string, date: Date = new Date()) {
  let caseStudy = new CaseStudyModel({
    caseStudyType: CaseStudyOptions.PatientStory,
    userId: USER_ID.ADMIN,
    departmentId: departmentId,
    imgPath: 'public/images/case1.jpg',
    featured: false,
  });
  caseStudy.createdAt = date;
  await caseStudy.save();
  return caseStudy.toObject();
}

describe('Leaderboard Tests', function () {
  let mongo: MongoMemoryServer;
  let httpServer: http.Server;
  let agent: any;

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

  it('should get all leaderboard points ordered from highest first', async function () {
    // Rehab should have 20 points for 2 case studies
    await createEmptyCaseStudy(DEP_ID.REHAB);
    await createEmptyCaseStudy(DEP_ID.REHAB);

    // NICU will have 10 points for one cast study
    await createEmptyCaseStudy(DEP_ID.NICU_PAEDS);

    // Maternity will have 0 points because its case studies were not this month
    const currentMonth = new Date().getMonth();
    const lastMonth = new Date(new Date().setMonth(currentMonth - 1));
    await createEmptyCaseStudy(DEP_ID.MATERNITY, lastMonth);

    const res = await agent.get(LEADERBOARD_ENDPOINT);
    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.have.deep.ordered.members([
      {
        id: DEP_ID.REHAB,
        nCaseStudies: 2,
        name: 'Rehab',
        points: 20,
      },
      {
        id: DEP_ID.NICU_PAEDS,
        nCaseStudies: 1,
        name: 'NICU/Paeds',
        points: 10,
      },
      {
        id: DEP_ID.MATERNITY,
        nCaseStudies: 0,
        name: 'Maternity',
        points: 0,
      },
      {
        id: DEP_ID.COMMUNITY_HEATH,
        nCaseStudies: 0,
        name: 'Community & Health',
        points: 0,
      },
    ]);
  });
});
