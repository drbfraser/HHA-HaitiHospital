import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, MESSAGEBOARD_COMMENT_ENDPOINT, MESSAGEBOARD_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;

interface MessageComment {
  parentMessageId: string;
  messageComment: string;
}

describe('Message Board Comments Test', function () {
  before('Create a Working Server and Login With Admin', function (done: Done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      csrf = response?.body?.CSRFToken;

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

  it('Should Successfully Get Message Comments', function (done: Done) {
    // Get a message first to get an ID
    agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);

      const messageId = response.body[0].id;

      agent.get(`${MESSAGEBOARD_COMMENT_ENDPOINT}/${messageId}`).end(function (error: any, response: any) {
        if (error) done(error);

        expect(response).to.have.status(200);
        done();
      });
    });
  });

  it('Should Successfully Post a Comment', function (done: Done) {
    // TODO: Prevent Message from being posted if parent ID is not valid
    // Get a message first to get an ID
    agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);

      const messageId: string = response.body[0].id;
      const messageComment: MessageComment = { parentMessageId: messageId, messageComment: 'Sample Test' };

      agent
        .post(MESSAGEBOARD_COMMENT_ENDPOINT)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(messageComment)
        .end(function (error: any, response: any) {
          if (error) done(error);
          expect(error).to.be.null;
          expect(response).to.have.status(201);
          done();
        });
    });
  });
});
