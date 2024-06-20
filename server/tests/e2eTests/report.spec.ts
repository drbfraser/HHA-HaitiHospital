import { ReportCollection } from 'models/report';
import { IReport, QuestionGroup, ObjectSerializer, buildRehabReport } from '@hha/common';
import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, Accounts, closeServer } from 'testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, REPORT_ENDPOINT } from 'testTools/endPoints';
import {
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
  HTTP_UNPROCESSABLE_ENTITY_CODE,
} from 'exceptions/httpException';
import DepartmentCollection from 'models/departments';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: String;
let testReport: IReport;
let newReportIds: string[] = [];

describe('report tests', function () {
  before('Create a Working Server and Login With Admin', function (done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error: Error, res: any) {
      if (error) done(error);
      csrf = res?.body?.CSRFToken;

      agent
        .post(LOGIN_ENDPOINT)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(Accounts.AdminUser)
        .end(function (error: any, response: any) {
          if (error) return done(error);
          done();
        });
      ReportCollection.find({})
        .lean()
        .then((reports: IReport[]) => {
          testReport = reports[0];
        });
    });
  });

  after('Close a Working Server and delete any added reports', async function () {
    for (const reportId of newReportIds) {
      try {
        await agent
          .delete(`${REPORT_ENDPOINT}/${reportId}`)
          .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });
      } catch (error) {
        console.warn(error);
      }
    }

    closeServer(agent, httpServer);
  });

  it('should fetch report correctly', function (done) {
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
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('report');
        expect(res.body.report).to.have.property('_id');
        expect(
          new QuestionGroup<string, string>('ROOT', res.body.report.reportObject) instanceof
            QuestionGroup,
        ).to.be.true;
        newReportIds.push(res.body.report._id);
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
