import { QuestionGroup, ObjectSerializer, buildRehabReport } from '@hha/common';
import http from 'http';
import {
  Accounts,
  closeServer,
  setUpSession,
  seedMongo,
  dropMongo,
  GEN_DEP_ID,
  ADMIN_USER_ID,
} from 'testTools/mochaHooks';
import { REPORT_ENDPOINT } from 'testTools/endPoints';
import {
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
  HTTP_UNPROCESSABLE_ENTITY_CODE,
} from 'exceptions/httpException';
import DepartmentCollection from 'models/departments';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ReportCollection } from 'models/report';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('report tests', function () {
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

  beforeEach('start with clean mongoDB', async () => {
    await seedMongo();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('should fetch report correctly', function (done) {
    new ReportCollection();

    agent
      .get(`${REPORT_ENDPOINT}/${testReport._id}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (err: any, res: any) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('report');
        expect(
          new QuestionGroup<string, string>('ROOT', res.body.report.reportObject) instanceof
            QuestionGroup,
        ).to.be.true;
        done();
      });
  });

  it(`should get all reports correctly`, (done) => {
    agent.get(REPORT_ENDPOINT).end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(HTTP_OK_CODE);
      expect(res.body).to.be.an('array');
      done();
    });
  });

  it(`should get all reports from a specific department correctly`, async () => {
    const department = await DepartmentCollection.findOne({
      name: 'Maternity',
    }).lean();

    agent
      .get(`${REPORT_ENDPOINT}/department/${department?._id}`)
      .end(async (err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(HTTP_OK_CODE);
        expect(res.body).to.be.an('array');
        expect(res.body.every((report: any) => report.PATH_TO_DEPARTMENT_ID == department?._id)).to
          .be.true;
      });
  });

  it('should save report correctly', function (done) {
    const objectSerializer = ObjectSerializer.getObjectSerializer();
    const serializedReport = objectSerializer.serialize(buildRehabReport());
    agent
      .post(REPORT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({
        departmentId: GEN_DEP_ID,
        submittedUserId: ADMIN_USER_ID,
        submittedBy: 'Jamie Doe',
        reportMonth: new Date(),
        serializedReport,
        isDraft: true,
      })
      .end(function (err: any, res: any) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('report');
        expect(res.body.report).to.have.property('_id');
        expect(
          new QuestionGroup<string, string>('ROOT', res.body.report.reportObject) instanceof
            QuestionGroup,
        ).to.be.true;
        done();
      });
  });

  it('should post a new report and then delete that report by id', function (done) {
    let reportId: string;
    const objectSerializer = ObjectSerializer.getObjectSerializer();
    const serializedReport = objectSerializer.serialize(buildRehabReport());
    agent
      .post(REPORT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({
        departmentId: '66623f46a596535e40d39bdd',
        submittedUserId: '66623f46a596535e40d39be8',
        submittedBy: 'Jamie Doe',
        reportMonth: new Date(),
        serializedReport,
        isDraft: true,
      })
      .end(function (err: any, res: any) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('report');
        reportId = res.body.report._id;

        agent
          .delete(`${REPORT_ENDPOINT}/${reportId}`)
          .set({ 'CSRF-Token': csrf })
          .end(function (error: any, response: any) {
            if (error) done(error);
            expect(response).to.have.status(HTTP_NOCONTENT_CODE);
            done();
          });
      });
  });

  it('should fail to delete a report by an id that does not exist', (done) => {
    const invalidId = '76687ef1366f942478fa3d80';
    agent
      .delete(`${REPORT_ENDPOINT}/${invalidId}`)
      .set({ 'CSRF-Token': csrf })
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_NOTFOUND_CODE);
        expect(response.error.text).to.equal(`No report with id ${invalidId}`);
        done();
      });
  });

  it('should update an existing report by id', (done) => {
    agent
      .put(REPORT_ENDPOINT)
      .set({ 'CSRF-Token': csrf })
      .send({
        id: '666757ab7e9e11769488a487',
        serializedReport: {},
        submittedBy: 'Ronald Hyatt',
        reportMonth: '2024-01-01T08:00:00.000Z',
        isDraft: true,
      })
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_OK_CODE);
        expect(response.body.message).to.equal('Report updated');
        done();
      });
  });

  it('should fail if the report month is missing', (done) => {
    agent
      .put(REPORT_ENDPOINT)
      .set({ 'CSRF-Token': csrf })
      .send({
        id: '666757ab7e9e11769488a487',
        serializedReport: {},
        submittedBy: 'Ronald Hyatt',
        isDraft: true,
      })
      .end(function (error: any, response: any) {
        expect(response).to.have.status(HTTP_UNPROCESSABLE_ENTITY_CODE);
        expect(response.error.text).to.equal(`Report month is required`);
        done();
      });
  });
});
