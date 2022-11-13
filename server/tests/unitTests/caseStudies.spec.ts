import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CASE_STUDIES_ENDPOINT, CASE_STUDIES_FEATURED_ENDPOINT, CSRF_ENDPOINT, LOGIN_ENDPOINT } from './testTools/endPoints';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;

describe('getCaseStudies', function () {
  before('Create a Working Server and Login With Admin', function (done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error, res) {
      if (error) done(error);
      let csrf: String = res?.body?.CSRFToken;

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

  it('Should Get All Featured Case Studies', function (done) {
    agent.get(CASE_STUDIES_FEATURED_ENDPOINT).end(function (error: any, response: any) {
      if (error) return done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(200);

      done();
    });
  });

  it('Should Get All Case Studies', function (done) {
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    });
  });
});
