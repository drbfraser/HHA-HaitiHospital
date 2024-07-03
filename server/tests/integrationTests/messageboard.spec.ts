import http from 'http';
import {
  Accounts,
  closeServer,
  DEP_ID,
  dropMongo,
  seedMongo,
  setUpSession,
} from 'testTools/mochaHooks';
import { MESSAGEBOARD_ENDPOINT, DEPARTMENT_ENDPOINT } from 'testTools/endPoints';
import { Done } from 'mocha';
import {
  HTTP_CREATED_CODE,
  HTTP_INTERNALERROR_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
} from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedMessageBoard } from 'seeders/seed';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;

interface MessageObject {
  department: { id: string };
  messageHeader: string;
  messageBody: string;
}

function postMessage(message: MessageObject, done: Done, expectedStatus: Number, next?: Function) {
  agent
    .post(MESSAGEBOARD_ENDPOINT)
    .send(message)
    .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
    .end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(expectedStatus);
      if (!next) done();
      else next(done);
    });
}

function updatePostedMessageIds(done: Done) {
  agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
    if (error) done(error);
    done();
  });
}

describe('Messageboard Tests', function () {
  let mongo: MongoMemoryServer;
  before('Create a Working Server and Login With Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    httpServer = session.httpServer;
    agent = session.agent;
    mongo = session.mongo;
    csrf = session.csrf;
  });

  after('Close a Working Server and delete any added reports', async function () {
    closeServer(agent, httpServer, mongo);
  });

  beforeEach('start with clean mongoDB', async function () {
    await seedMongo();
    await seedMessageBoard();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Get All Messages from the Messageboard', function (done: Done) {
    agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      done();
    });
  });

  it('Should Get a Message Via Message ID', function (done: Done) {
    agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      const message = response.body[0];
      const id: string = message.id;
      agent.get(`${MESSAGEBOARD_ENDPOINT}/${id}`).end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_OK_CODE);
        expect(response.body).to.deep.equal(message);
        done();
      });
    });
  });

  it('Should Fail to Get Message Due to Invalid Message ID', function (done: Done) {
    agent.get(`${MESSAGEBOARD_ENDPOINT}/${'Invalid Id'}`).end(function (error: any, response: any) {
      if (error) done(error);
      expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
      done();
    });
  });

  it('Should Fail to Get Messages Due To Invalid Department', function (done: Done) {
    agent.get(`${MESSAGEBOARD_ENDPOINT}/department/invalid`).end(function (
      error: any,
      response: any,
    ) {
      expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
      done();
    });
  });

  it('Should Get Messages From General Department', function (done: Done) {
    agent.get(`${MESSAGEBOARD_ENDPOINT}/department/${DEP_ID.GENERAL}`).end(function (
      error: any,
      response: any,
    ) {
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      const entries: Array<Object> = Object.entries(response.body);
      const results: boolean = entries.every(
        (element: any) => element[1].department.id === DEP_ID.GENERAL,
      );
      expect(results).to.be.true;

      done();
    });
  });

  it('Should Fail Posting a New Message due to Invalid Department ID', function (done: Done) {
    const newMessage: MessageObject = {
      department: { id: 'invalid department id' },
      messageHeader: 'test header',
      messageBody: 'test body',
    };

    postMessage(newMessage, done, HTTP_INTERNALERROR_CODE);
  });

  it('Should Successfully Post a New Message', function (done: Done) {
    const departmentId: string = DEP_ID.GENERAL; // Get department id for the General Department
    const newMessage: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header',
      messageBody: 'test body',
    };

    postMessage(newMessage, done, HTTP_CREATED_CODE, updatePostedMessageIds);
  });

  it('Should Successfully Post a New Message and Get it', function (done: Done) {
    const departmentId: string = DEP_ID.GENERAL;
    const newMessage: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header',
      messageBody: 'test body',
    };

    postMessage(newMessage, done, HTTP_CREATED_CODE, function () {
      agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);

        // Check that the most recent message uploaded is the one sent
        // Note that there is no way to set the message ID during the POST request, so it is unknown
        const message = response.body[0]; // Server sorts messages in descending order during GET, so grab the first one

        expect(response).to.have.status(HTTP_OK_CODE);
        expect(message.department.id).to.equal(departmentId);
        expect(message.messageHeader).to.equal('test header');
        expect(message.messageBody).to.equal('test body');

        updatePostedMessageIds(done);
      });
    });
  });

  it('Should Fail to Delete a Message Because It Does Not Exist', function (done: Done) {
    agent
      .delete(`${MESSAGEBOARD_ENDPOINT}/${'invalidId'}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (error: Error, response: any) {
        // Cannot check if a particular type of error has been thrown: https://stackoverflow.com/questions/53140856/how-to-throw-error-in-node-js-and-catch-it-mocha
        expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
        done();
      });
  });

  it('Should Successfully Post a New Message and Delete it', function (done: Done) {
    const departmentId: string = DEP_ID.GENERAL;
    const newMessage: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header msg',
      messageBody: 'test body msg',
    };

    postMessage(newMessage, done, HTTP_CREATED_CODE, function () {
      agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);
        const message = response.body[0];
        const messageId: string = message.id; // Server sorts messages in descending order during GET, so grab the first one

        agent
          .delete(`${MESSAGEBOARD_ENDPOINT}/${messageId}`)
          .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
          .end(function (error: Error, response: any) {
            if (error) done(error);
            expect(response).to.have.status(HTTP_NOCONTENT_CODE);

            // Check that the message does not exist anymore
            agent.get(`${MESSAGEBOARD_ENDPOINT}/${messageId}`).end(function (
              error: any,
              response: any,
            ) {
              if (error) done(error);
              expect(response).to.have.status(HTTP_NOTFOUND_CODE);
              done();
            });
          });
      });
    });
  });

  it('Should Successfully Post a New Message and Update It', function (done: Done) {
    const departmentId: string = DEP_ID.GENERAL;
    const message: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header msg',
      messageBody: 'test body msg',
    };

    postMessage(message, done, HTTP_CREATED_CODE, function () {
      // Retrieve the ID of the message in order to upate it
      agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);
        const oldMessage = response.body[0];
        const messageId = oldMessage.id;

        const newMessage: MessageObject = {
          department: { id: departmentId },
          messageHeader: 'test header msg UPDATED',
          messageBody: 'test body msg UPDATED',
        };

        agent
          .put(`${MESSAGEBOARD_ENDPOINT}/${messageId}`)
          .send(newMessage)
          .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
          .end(function (error: Error, response: any) {
            if (error) done(error);
            expect(response).to.have.status(HTTP_OK_CODE);
            updatePostedMessageIds(done);
          });
      });
    });
  });
});
