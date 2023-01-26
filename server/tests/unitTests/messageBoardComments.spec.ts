import http from 'http';
import { Application } from 'express';
import {
  setupApp,
  setupHttpServer,
  attemptAuthentication,
  Accounts,
  closeServer,
} from './testTools/mochaHooks';
import {
  CSRF_ENDPOINT,
  LOGIN_ENDPOINT,
  MESSAGEBOARD_COMMENT_ENDPOINT,
  MESSAGEBOARD_ENDPOINT,
} from './testTools/endPoints';
import { Done } from 'mocha';
import { HTTP_CREATED_CODE, HTTP_INTERNALERROR_CODE, HTTP_OK_CODE } from 'exceptions/httpException';
import MessageCollection from 'models/messageBoard';

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
      expect(response).to.have.status(HTTP_OK_CODE);

      const messageId = response.body[0].id;

      agent
        .get(`${MESSAGEBOARD_COMMENT_ENDPOINT}/${messageId}`)
        .end(function (error: any, response: any) {
          if (error) done(error);

          expect(response).to.have.status(HTTP_OK_CODE);
          done();
        });
    });
  });

  it('Should Unsuccessfully Get Message Comments Due to Invalid Message Parent Id', function (done: Done) {
    agent
      .get(`${MESSAGEBOARD_COMMENT_ENDPOINT}/${'Invalid'}`)
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
        done();
      });
  });

  it('Should Successfully Post a Comment', function (done: Done) {
    // Get a message first to get an ID
    agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);

      const messageId: string = response.body[0].id;
      const messageComment: MessageComment = {
        parentMessageId: messageId,
        messageComment: 'Sample Test',
      };

      agent
        .post(MESSAGEBOARD_COMMENT_ENDPOINT)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(messageComment)
        .end(function (error: any, response: any) {
          if (error) done(error);
          expect(error).to.be.null;
          expect(response).to.have.status(HTTP_CREATED_CODE);
          done();
        });
    });
  });

  it('Should Unsuccessfully Post a Comment Due To Invalid Parent Message Id', function (done: Done) {
    const messageComment: MessageComment = {
      parentMessageId: 'Invalid Id',
      messageComment: 'Sample Test',
    };

    agent
      .post(MESSAGEBOARD_COMMENT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(messageComment)
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(error).to.be.null;
        expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
        done();
      });
  });
});
