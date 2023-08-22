import { ReportCollection, IReport } from 'models/report';
import { QuestionGroup } from '@hha/common';
import { ObjectSerializer, buildRehabMockReport } from '@hha/common';
import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, REPORT_ENDPOINT } from './testTools/endPoints';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: String;
let testReport: IReport;

describe('report tests', function () {
  before('Create a Working Server and Login With Admin', function (done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error, res) {
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

  after('Close a Working Server', function () {
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

  xit('should save report correctly', function (done) {
    console.warn('WARNING: Saving report test is pending due to an issue');
    const objectSerializer = ObjectSerializer.getObjectSerializer();
    const serializedReport = objectSerializer.serialize(buildRehabMockReport());
    agent
      .post(REPORT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({
        departmentId: '123',
        submittedUserId: '123',
        submittedBy: '123',
        reportMonth: new Date(),
        serializedReport,
      })
      .end(function (err: any, res: any) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('report');
        expect(
          new QuestionGroup<string, string>('ROOT', res.body.report.reportObject) instanceof
            QuestionGroup,
        ).to.be.true;
        done();
      });
  });
});
