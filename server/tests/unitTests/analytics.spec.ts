import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Application } from 'express';
import http from 'http';
import { Accounts, closeServer, setUpSession } from './testTools/mochaHooks';
import { ANALYTICS_ENDPOINT, ANALYTICS_QUESTION_ENDPOINT } from './testTools/endPoints';
import DepartmentCollection from 'models/departments';
import { HTTP_NOTFOUND_CODE, HTTP_OK_CODE, HTTP_UNAUTHORIZED_CODE } from 'exceptions/httpException';

chai.use(chaiHttp);

const getDepartmentId = async (departmentName: string) => {
  const department = await DepartmentCollection.findOne({
    name: departmentName,
  }).lean();

  return department?._id?.toString();
};

describe('Analytics API test for users with privileges', function () {
  let agent: ChaiHttp.Agent;
  let httpServer: http.Server;

  before('Create a working server and login with Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    agent = session.agent;
    httpServer = session.httpServer;

    if (session.isError) {
      throw new Error('Authentication failed');
    }
  });

  it('should return a list of questions for rehab template', async function () {
    try {
      const departmentId = await getDepartmentId('Rehab');

      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId,
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
      const departmentId = await getDepartmentId('Maternity');

      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId,
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
      const departmentId = await getDepartmentId('NICU/Paeds');

      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId,
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
      const departmentId = await getDepartmentId('Community & Health');

      const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
        departmentId,
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
        departmentId: '664506c4953ff74f94965e79',
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

  after('Closing a working server', function () {
    closeServer(agent, httpServer);
  });
});

describe('Analytics API tests for users without privileges', function () {
  let agent: ChaiHttp.Agent;
  let httpServer: http.Server;
  before('Create a working server and login with a user with User role', async function () {
    const session = await setUpSession(Accounts.NormalUser);

    agent = session.agent;
    httpServer = session.httpServer;

    if (session.isError) {
      throw new Error('Authentication failed');
    }
  });

  it('should return an error when a normal user accesses all questions in any department', async function () {
    const res = await agent.get(ANALYTICS_QUESTION_ENDPOINT).query({
      departmentId: '664506c4953ff74f94965e79',
    });

    expect(res).to.have.status(HTTP_UNAUTHORIZED_CODE);
  });

  it('should return an error when a normal user accesses analytics for any department', async function () {
    const res = await agent.get(ANALYTICS_ENDPOINT).query({
      departmentIds: '664506c4953ff74f94965e79',
      questionId: '1',
      startDate: '2024-02-30T14:00:00Z',
      endDate: '2025-05-30T14:00:00Z',
      timeStep: 'month',
      aggregateBy: 'month',
    });

    expect(res).to.have.status(HTTP_UNAUTHORIZED_CODE);
  });

  after('Closing a working server', function () {
    closeServer(agent, httpServer);
  });
});
