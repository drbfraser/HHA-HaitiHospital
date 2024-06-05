import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, IMAGE_ENDPOINT, LOGIN_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';
import { HTTP_OK_CODE } from 'exceptions/httpException';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;

describe('Image Tests', function () {
  before('Create a Working Server and Login With Admin', function (done: Done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      let csrf: string = response?.body?.CSRFToken;

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

  it('Should Successfully Get an Image', function (done: Done) {
    const imgPath: string = 'avatar1.jpg';
    agent.get(`${IMAGE_ENDPOINT}/${imgPath}`).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      done();
    });
  });
});
