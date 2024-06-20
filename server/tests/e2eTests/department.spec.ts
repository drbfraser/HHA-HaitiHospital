import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, Accounts, closeServer } from 'testTools/mochaHooks';
import { CSRF_ENDPOINT, DEPARTMENT_ENDPOINT, LOGIN_ENDPOINT } from 'testTools/endPoints';
import { Done } from 'mocha';
import { HTTP_INTERNALERROR_CODE, HTTP_OK_CODE } from 'exceptions/httpException';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;

describe('Department Tests', function () {
  before('Create a Working Server and Login With Admin', function (done: Done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error: Error, res: any) {
      if (error) done(error);
      let csrf: string = res?.body?.CSRFToken;

      agent
        .post(LOGIN_ENDPOINT)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(Accounts.AdminUser)
        .end(function (error: any, response: any) {
          if (error) return done(error);
          done();
        });
    });
  });

  after('Close a Working Server', function () {
    closeServer(agent, httpServer);
  });

  it('Should Successfully Get All Departments', function (done: Done) {
    agent.get(DEPARTMENT_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      expect(response.body[0].name).to.equal('General');
      expect(response.body[1].name).to.equal('Rehab');
      expect(response.body[2].name).to.equal('NICU/Paeds');
      expect(response.body[3].name).to.equal('Maternity');
      expect(response.body[4].name).to.equal('Community & Health');
      done();
    });
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
