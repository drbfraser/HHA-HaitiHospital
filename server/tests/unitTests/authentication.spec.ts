import http, { request } from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, USERS_ENDPOINT, LOGOUT_ENDPOINT } from './testTools/endPoints';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let agent: any;
let httpServer: http.Server;
let csrf: string;

describe('Test Admin Authorization', function () {
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
    });
  });

  after('Close a Working Server', function () {
    closeServer(agent, httpServer);
  });

  it('Should Fetch the Users', function (done) {
    agent.get(USERS_ENDPOINT).end(function (error: any, res: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Should Logout Admin User', function (done) {
    agent
      .post(LOGOUT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({})
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(error).to.be.null;
        expect(response.body).to.be.true;
        done();
      });
  });
});
