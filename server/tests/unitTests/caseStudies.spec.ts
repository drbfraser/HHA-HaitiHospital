import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF, LOGIN } from './testTools/endPoints';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let app: Application;
let httpServer: http.Server;
let agent: any;
let csrf: String;

describe('getCaseStudies', () => {
  before('Create a Working Server and Login With Admin', (done) => {
    app = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF).end((error, res) => {
      if (error) done(error);
      csrf = res?.body?.CSRFToken;

      agent
        .post(LOGIN)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(Accounts.AdminUser)
        .end((error: any, response: any) => {
          if (error) return done(error);
          done();
        });
    });
  });

  after('Close a Working Server', () => {
    closeServer(agent, httpServer);
  });

  it('Should Get All Featured Case Studies', (done) => {
    agent.get('/api/case-studies/featured').end((error: any, response: any) => {
      if (error) return done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(200);

      done();
    });
  });

  it('Should Get All Case Studies', (done) => {
    agent.get('/api/case-studies/').end((error: any, response: any) => {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    });
  });
});
