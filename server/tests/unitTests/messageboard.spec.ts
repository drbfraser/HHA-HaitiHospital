import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, MESSAGEBOARD_ENDPOINT, DEPARTMENT_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;
let departmentIds: string[];
let messageIds: string[];

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
      // console.log(`${message.department.id}'s error is: ${response.error.text}`);
      expect(error).to.be.null;
      expect(response).to.have.status(expectedStatus);
      if (!next) done();
      else next(done);
    });
}

function getDepartmentIds(done: Done) {
  agent.get(DEPARTMENT_ENDPOINT).end(function (error: any, response: any) {
    if (error) done(error);
    departmentIds = response.body.map((department) => department.id);
    done();
  });
}

function updatePostedMessageIds(done: Done) {
  agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
    if (error) done(error);
    messageIds.push(response.body[0].id);
    done();
  });
}

describe('Messageboard Tests', function () {
  before('Create a Working Server and Login With Admin', function (done: Done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);
    messageIds = new Array<string>();

    agent.get(CSRF_ENDPOINT).end(function (error, res) {
      if (error) done(error);
      csrf = res?.body?.CSRFToken;

      agent
        .post(LOGIN_ENDPOINT)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(Accounts.AdminUser)
        .end(function (error: any, response: any) {
          if (error) return done(error);
          getDepartmentIds(done);
        });
    });
  });

  after('Close a Working Server', async function () {
    // Cleaning up posted messages that were not removed during testing
    for await (const messageId of messageIds) {
      try {
        await agent.delete(`${MESSAGEBOARD_ENDPOINT}/${messageId}`).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });
      } catch (error: any) {
        console.log(error);
      }
    }
    closeServer(agent, httpServer);
  });

  it('Should Get All Messages from the Messageboard', function (done: Done) {
    agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
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
        expect(response).to.have.status(200);
        expect(response.body).to.deep.equal(message);
        done();
      });
    });
  });

  it('Should Fail to Get Messages Due To Invalid Department', function (done: Done) {
    agent.get(`${MESSAGEBOARD_ENDPOINT}/department/invalid`).end(function (error: any, response: any) {
      expect(response).to.have.status(500);
      done();
    });
  });

  it('Should Get Messages From General Department', function (done: Done) {
    const generalDeptId: string = departmentIds[0];
    agent.get(`${MESSAGEBOARD_ENDPOINT}/department/${generalDeptId}`).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      const entries: Array<Object> = Object.entries(response.body);
      const results: boolean = entries.every((element) => element[1].department.id === generalDeptId);
      expect(results).to.be.true;

      done();
    });
  });

  it('Should Fail Posting a New Message due to Invalid Department ID', function (done: Done) {
    const newMessage: MessageObject = {
      department: { id: 'invalid department id' },
      messageHeader: 'test header',
      messageBody: 'test body'
    };

    postMessage(newMessage, done, 500);
  });

  it('Should Successfully Post a New Message', function (done: Done) {
    const departmentId: string = departmentIds[0]; // Get department id for the General Department
    const newMessage: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header',
      messageBody: 'test body'
    };

    postMessage(newMessage, done, 201, updatePostedMessageIds);
  });

  it('Should Successfully Post a New Message and Get it', function (done: Done) {
    const departmentId: string = departmentIds[1];
    const newMessage: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header',
      messageBody: 'test body'
    };

    postMessage(newMessage, done, 201, function () {
      agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);

        // Check that the most recent message uploaded is the one sent
        // Note that there is no way to set the message ID during the POST request, so it is unknown
        const message = response.body[0]; // Server sorts messages in descending order during GET, so grab the first one

        expect(response).to.have.status(200);
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
      .end(function (error, response) {
        // Cannot check if a particular type of error has been thrown: https://stackoverflow.com/questions/53140856/how-to-throw-error-in-node-js-and-catch-it-mocha
        expect(response).to.have.status(500);
        done();
      });
  });

  it('Should Successfully Post a New Message and Delete it', function (done: Done) {
    const departmentId: string = departmentIds[1];
    const newMessage: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header msg',
      messageBody: 'test body msg'
    };

    postMessage(newMessage, done, 201, function () {
      agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);
        const message = response.body[0];
        const messageId: string = message.id; // Server sorts messages in descending order during GET, so grab the first one

        agent
          .delete(`${MESSAGEBOARD_ENDPOINT}/${messageId}`)
          .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
          .end(function (error, response) {
            if (error) done(error);
            expect(response).to.have.status(204);

            // Check that the message does not exist anymore
            agent.get(`${MESSAGEBOARD_ENDPOINT}/${messageId}`).end(function (error: any, response: any) {
              if (error) done(error);
              expect(response).to.have.status(404);
              done();
            });
          });
      });
    });
  });

  it('Should Successfully Post a New Message and Update It', function (done: Done) {
    const departmentId: string = departmentIds[1];
    const message: MessageObject = {
      department: { id: departmentId },
      messageHeader: 'test header msg',
      messageBody: 'test body msg'
    };

    postMessage(message, done, 201, function () {
      // Retrieve the ID of the message in order to upate it
      agent.get(MESSAGEBOARD_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);
        const oldMessage = response.body[0];
        const messageId = oldMessage.id;

        const newMessage: MessageObject = {
          department: { id: departmentId },
          messageHeader: 'test header msg UPDATED',
          messageBody: 'test body msg UPDATED'
        };

        agent
          .put(`${MESSAGEBOARD_ENDPOINT}/${messageId}`)
          .send(newMessage)
          .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
          .end(function (error, response) {
            if (error) done(error);
            expect(response).to.have.status(200);
            updatePostedMessageIds(done);
          });
      });
    });
  });
});
