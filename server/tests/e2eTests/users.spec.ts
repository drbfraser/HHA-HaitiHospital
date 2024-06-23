import http from 'http';
import { Application } from 'express';
import {
  setupApp,
  setupHttpServer,
  Accounts,
  closeServer,
  dropMongo,
  seedMongo,
  setUpSession,
  USER_ID,
} from 'testTools/mochaHooks';
import {
  CSRF_ENDPOINT,
  DEPARTMENT_ENDPOINT,
  LOGIN_ENDPOINT,
  USERS_ENDPOINT,
} from 'testTools/endPoints';
import { Done } from 'mocha';
import { _ } from 'ajv';
import {
  HTTP_CONFLICT_CODE,
  HTTP_CREATED_CODE,
  HTTP_INTERNALERROR_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
  HTTP_UNPROCESSABLE_ENTITY_CODE,
} from 'exceptions/httpException';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedMessageBoard } from 'seeders/seed';

chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;
let userIds: string[];

interface User {
  username: string;
  password: string;
  name: string;
  role: string;
  department: { id: string; name: string };
}
const WORKING_PASSWORD = 'J0hnP@ssw0rd';

async function updatePostedUserIds() {
  const response = await agent.get(USERS_ENDPOINT);
  userIds.push(response.body[0].id);
}

describe('Users Test', function () {
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

  it('Should Successfully Get All Users', function (done: Done) {
    agent.get(USERS_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      done();
    });
  });

  it('Should Successfully Get a User via ID', function (done: Done) {
    // First grab all users to locate an ID
    agent.get(USERS_ENDPOINT).end(function (error: any, response: any) {
      const user = response.body[0];
      const id: string = user.id;

      agent.get(`${USERS_ENDPOINT}/${id}`).end(function (error: any, response: any) {
        if (error) done(error);

        expect(error).to.be.null;
        expect(response).to.have.status(HTTP_OK_CODE);
        expect(response.body).to.deep.equal(user);
        done();
      });
    });
  });

  it('Should Unsuccessfully Get a User Due to Invalid User Id', function (done: Done) {
    agent.get(`${USERS_ENDPOINT}/${'Invalid'}`).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
      done();
    });
  });

  it('Should Successfully Get My User', function (done: Done) {
    agent.get(`${USERS_ENDPOINT}/me`).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      expect(response.body.role).to.equal('Admin');
      done();
    });
  });

  it('Should Successfully Post a New User', async function () {
    // Grab a valid department id
    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'JohnUsername',
      password: 'J0hnP@ssword',
      name: 'John',
      role: 'User',
      department: { id: departmentId, name: departmentName },
    };
    const postResponse = await agent
      .post(USERS_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(postResponse).to.have.status(HTTP_CREATED_CODE);

    const getResponse = await agent.get(USERS_ENDPOINT);
    expect(getResponse).to.have.status(HTTP_OK_CODE);
    expect(getResponse.body[0].name).to.equal('John');
    expect(getResponse.body[0].role).to.equal('User');
    updatePostedUserIds();
  });

  it('Should Unsuccessfully Post a New User Due to Existing Username Conflict', async function () {
    // Grab a valid department id
    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'user0',
      password: WORKING_PASSWORD,
      name: 'John',
      role: 'User',
      department: { id: departmentId, name: departmentName },
    };
    const postResponse = await agent
      .post(USERS_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(postResponse).to.have.status(HTTP_CONFLICT_CODE);
  });

  it('Should Unsuccessfully Post a New User Due to Invalid Department Id', async function () {
    // Grab a valid department id
    const newUser: User = {
      username: 'JohnUsername',
      password: WORKING_PASSWORD,
      name: 'John',
      role: 'User',
      department: { id: 'Invalid', name: 'Invalid Name' },
    };
    const postResponse = await agent
      .post(USERS_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(postResponse).to.have.status(HTTP_UNPROCESSABLE_ENTITY_CODE);
  });

  it('Should Unsuccessfully Post a New User Due to Invalid Password', async function () {
    // Grab a valid department id
    const newUser: User = {
      username: 'JohnUsername',
      password: 'notvalidpassword',
      name: 'John',
      role: 'User',
      department: { id: 'Invalid', name: 'Invalid Name' },
    };
    const postResponse = await agent
      .post(USERS_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(postResponse).to.have.status(HTTP_UNPROCESSABLE_ENTITY_CODE);
  });

  it('Should Successfully Update a User', async function () {
    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: WORKING_PASSWORD + 'UPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: departmentId, name: departmentName },
    };

    const userResponse = await agent.get(USERS_ENDPOINT);
    const userId: string = USER_ID.REGULAR;

    const updatedResponse = await agent
      .put(`${USERS_ENDPOINT}/${userId}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(updatedResponse).to.have.status(HTTP_NOCONTENT_CODE);

    const updatedGetResponse = await agent.get(`${USERS_ENDPOINT}/${userId}`);
    expect(updatedGetResponse).to.have.status(HTTP_OK_CODE);
    expect(updatedGetResponse.body.name).to.equal('JohnUPDATED');
  });

  it('Should Unsuccessfully Update a User Due to Username Conflicts', async function () {
    const userId = USER_ID.REGULAR;

    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'user0',
      password: WORKING_PASSWORD + 'UPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: departmentId, name: departmentName },
    };

    const updatedResponse = await agent
      .put(`${USERS_ENDPOINT}/${userId}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(updatedResponse).to.have.status(HTTP_CONFLICT_CODE);
  });

  it('Should Unsuccessfully Update a User Due to Invalid Department Id', async function () {
    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: WORKING_PASSWORD + 'UPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: 'Invalid Id', name: 'Invalid Name' },
    };

    const userResponse = await agent.get(USERS_ENDPOINT);
    const userId: string = userResponse.body[0].id;

    const updatedResponse = await agent
      .put(`${USERS_ENDPOINT}/${userId}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(updatedResponse).to.have.status(HTTP_UNPROCESSABLE_ENTITY_CODE);
  });

  it('Should Unsuccessfully Update a User Due to Invalid Password', async function () {
    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: 'notvalidpassword_updated',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: 'Invalid Id', name: 'Invalid Name' },
    };
    const userResponse = await agent.get(USERS_ENDPOINT);
    const userId: string = userResponse.body[0].id;
    const updatedResponse = await agent
      .put(`${USERS_ENDPOINT}/${userId}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(updatedResponse).to.have.status(HTTP_UNPROCESSABLE_ENTITY_CODE);
  });

  it('Should Unsuccessfully Update a User Due to Invalid User ID', async function () {
    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: WORKING_PASSWORD + 'UPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: departmentId, name: departmentName },
    };

    const updatedResponse = await agent
      .put(`${USERS_ENDPOINT}/${'Invalid'}}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(newUser);
    expect(updatedResponse).to.have.status(HTTP_INTERNALERROR_CODE);
  });

  it('Should Successfully Delete a User', function (done: Done) {
    agent.get(USERS_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      const id: string = USER_ID.REGULAR; // The first User is not Admin
      agent
        .delete(`${USERS_ENDPOINT}/${id}`)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .end(function (error: any, response: any) {
          if (error) done(error);
          expect(response).to.have.status(HTTP_NOCONTENT_CODE);

          // Check that the user no longer exists
          agent.get(`${USERS_ENDPOINT}/${id}`).end(function (error: any, response: any) {
            if (error) done(error);
            expect(response).to.have.status(HTTP_NOTFOUND_CODE);
            done();
          });
        });
    });
  });

  it('Should Unsuccessfully Delete a User Due to Invalid User Id', function (done: Done) {
    agent
      .delete(`${USERS_ENDPOINT}/${'Invalid Id'}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
        done();
      });
  });
});
