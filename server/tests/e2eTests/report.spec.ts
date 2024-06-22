import { QuestionGroup, ObjectSerializer, buildRehabReport } from '@hha/common';
import http from 'http';
import {
  Accounts,
  closeServer,
  setUpSession,
  seedMongo,
  dropMongo,
  DEP_GEN_ID,
  USER_ADMIN_ID,
  DEP_REHAB_ID,
} from 'testTools/mochaHooks';
import { REPORT_ENDPOINT } from 'testTools/endPoints';
import {
  HTTP_CREATED_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
  HTTP_UNPROCESSABLE_ENTITY_CODE,
} from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ReportCollection } from 'models/report';
import mongoose from 'mongoose';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const reportObject = require('../utils/testData/ReportObjectTestData.json');
chai.use(chaiHttp);

async function createReport(reportId: string, departmentId = DEP_GEN_ID) {
  await new ReportCollection({
    _id: mongoose.Types.ObjectId(reportId),
    departmentId: departmentId,
    submittedUserId: USER_ADMIN_ID,
    submittedBy: 'user2',
    reportMonth: '2024-06-01T07:00:00.000Z',
    reportObject: reportObject,
    isDraft: false,
    submittedDate: '2024-06-15T21:29:32.200Z',
  }).save();
}

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

  beforeEach('start with clean mongoDB', async function () {
    await seedMongo();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('should fetch report correctly', async function () {
    const reportId = '666e07bc81f0646fc4c87de2';
    await createReport(reportId);

    const res = await agent.get(`${REPORT_ENDPOINT}/${reportId}`);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.have.property('report');
    expect(
      new QuestionGroup<string, string>('ROOT', res.body.report.reportObject) instanceof
        QuestionGroup,
    ).to.be.true;
  });

  it(`should get all reports correctly`, async function () {
    const reportIds = [
      '666e07bc81f0646fc4c87de2',
      '666e07bc81f0646fc4c87de3',
      '666e07bc81f0646fc4c87de4',
      '666e07bc81f0646fc4c87de5',
    ];
    for (const id of reportIds) {
      await createReport(id);
    }

    let res = await agent.get(REPORT_ENDPOINT);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(4);
  });

  it(`should get all reports from a specific department correctly`, async function () {
    await createReport('666e07bc81f0646fc4c87de2', DEP_GEN_ID);
    await createReport('666e07bc81f0646fc4c87de3', DEP_GEN_ID);
    await createReport('666e07bc81f0646fc4c87de4', DEP_REHAB_ID);

    let res = await agent.get(`${REPORT_ENDPOINT}/department/${DEP_GEN_ID}`);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.be.an('array');
    expect(res.body.every((report: any) => report.departmentId == DEP_GEN_ID)).to.be.true;
  });

  it('should save report correctly', async function () {
    const objectSerializer = ObjectSerializer.getObjectSerializer();
    const serializedReport = objectSerializer.serialize(buildRehabReport());
    let res = await agent
      .post(REPORT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({
        departmentId: DEP_GEN_ID,
        submittedUserId: USER_ADMIN_ID,
        submittedBy: 'Jamie Doe',
        reportMonth: new Date(),
        serializedReport,
        isDraft: true,
      });

    expect(res).to.have.status(HTTP_CREATED_CODE);
    expect(res.body).to.have.property('message');
    expect(res.body).to.have.property('report');
    expect(res.body.report).to.have.property('_id');
    expect(
      new QuestionGroup<string, string>('ROOT', res.body.report.reportObject) instanceof
        QuestionGroup,
    ).to.be.true;
    expect(await ReportCollection.find({ submittedUserId: USER_ADMIN_ID })).is.not.empty;
  });

  it('should delete a report by id', async function () {
    const deleteId = '666e07bc81f0646fc4c87de2';
    const keepId = '666e07bc81f0646fc4c87de3';
    await createReport(deleteId, DEP_GEN_ID);
    await createReport(keepId, DEP_GEN_ID);

    let res = await agent.delete(`${REPORT_ENDPOINT}/${deleteId}`).set({ 'CSRF-Token': csrf });

    expect(res).to.have.status(HTTP_NOCONTENT_CODE);
    expect(await ReportCollection.findById(deleteId)).is.null;
    expect(await ReportCollection.findById(keepId)).is.not.empty;
  });

  it('should fail to delete a report by an id that does not exist', async function () {
    const invalidId = '76687ef1366f942478fa3d80';
    let res = await agent.delete(`${REPORT_ENDPOINT}/${invalidId}`).set({ 'CSRF-Token': csrf });

    expect(res).to.have.status(HTTP_NOTFOUND_CODE);
    expect(res.error.text).to.equal(`No report with id ${invalidId}`);
  });

  it('should update an existing report by id', async function () {
    const editId = '666757ab7e9e11769488a487';
    await createReport(editId);

    let res = await agent.put(REPORT_ENDPOINT).set({ 'CSRF-Token': csrf }).send({
      id: editId,
      serializedReport: {},
      submittedBy: 'Ronald Hyatt',
      reportMonth: '2024-01-01T08:00:00.000Z',
      isDraft: true,
    });

    let editedReport = await ReportCollection.findById(editId);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body.message).to.equal('Report updated');
    expect(editedReport.serializedReport).to.be.undefined;
    expect(editedReport.reportMonth.getTime()).to.equal(
      new Date('2024-01-01T08:00:00.000Z').getTime(),
    );
    expect(editedReport.isDraft).to.be.true;
  });

  it('should fail if the report month is missing', async function () {
    const reportId = '666757ab7e9e11769488a487';
    await createReport(reportId);

    let res = await agent.put(REPORT_ENDPOINT).set({ 'CSRF-Token': csrf }).send({
      id: '666757ab7e9e11769488a487',
      serializedReport: {},
      submittedBy: 'Ronald Hyatt',
      isDraft: true,
    });

    expect(res).to.have.status(HTTP_UNPROCESSABLE_ENTITY_CODE);
    expect(res.error.text).to.equal(`Report month is required`);
  });
});
