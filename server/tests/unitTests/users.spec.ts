import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, DEPARTMENT_ENDPOINT, LOGIN_ENDPOINT, USERS_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';
import { _ } from 'ajv';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
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

async function updatePostedUserIds() {
  const response = await agent.get(USERS_ENDPOINT);
  userIds.push(response.body[0].id);
}

describe('Users Test', function () {
  before('Create a Working Server and Login With Admin', function (done: Done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);
    userIds = Array<string>();

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

  after('Close a Working Server', async function () {
    // Cleaning up created users not deleted during testing
    for await (const userId of userIds) {
      try {
        await agent.delete(`${USERS_ENDPOINT}/${userId}`).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });
      } catch (error: any) {
        console.log(error);
      }
    }
    closeServer(agent, httpServer);
  });

  it('Should Successfully Get All Users', function (done: Done) {
    agent.get(USERS_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
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
        expect(response).to.have.status(200);
        expect(response.body).to.deep.equal(user);
        done();
      });
    });
  });

  it('Should Successfully Get My User', function (done: Done) {
    agent.get(`${USERS_ENDPOINT}/me`).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
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
      password: 'JohnPassword',
      name: 'John',
      role: 'User',
      department: { id: departmentId, name: departmentName }
    };
    const postResponse = await agent.post(USERS_ENDPOINT).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).send(newUser);
    expect(postResponse).to.have.status(201);

    const getResponse = await agent.get(USERS_ENDPOINT);
    expect(getResponse).to.have.status(200);
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
      username: 'JohnUsername',
      password: 'JohnPassword',
      name: 'John',
      role: 'User',
      department: { id: departmentId, name: departmentName }
    };
    const postResponse = await agent.post(USERS_ENDPOINT).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).send(newUser);
    expect(postResponse).to.have.status(409);
  });

  it('Should Unsuccessfully Post a New User Due to Invalid Department Id', async function () {
    // Grab a valid department id
    const newUser: User = {
      username: 'JohnUsername',
      password: 'JohnPassword',
      name: 'John',
      role: 'User',
      department: { id: 'Invalid', name: 'Invalid Name' }
    };
    const postResponse = await agent.post(USERS_ENDPOINT).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).send(newUser);
    expect(postResponse).to.have.status(422);
  });

  it('Should Successfully Update a User', async function () {
    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: 'JohnPasswordUPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: departmentId, name: departmentName }
    };

    const userResponse = await agent.get(USERS_ENDPOINT);
    const userId: string = userResponse.body[0].id;

    const updatedResponse = await agent.put(`${USERS_ENDPOINT}/${userId}`).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).send(newUser);
    expect(updatedResponse).to.have.status(204);

    const updatedGetResponse = await agent.get(`${USERS_ENDPOINT}/${userId}`);
    expect(updatedGetResponse).to.have.status(200);
    expect(updatedGetResponse.body.name).to.equal('JohnUPDATED');
  });

  it('Should Unsuccessfully Update a User Due to Username Conflicts', async function () {
    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: 'JohnPasswordUPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: departmentId, name: departmentName }
    };

    const userResponse = await agent.get(USERS_ENDPOINT);
    const userId: string = userResponse.body[1].id; // Grab the second user because the first user was updated in the previous test

    const updatedResponse = await agent.put(`${USERS_ENDPOINT}/${userId}`).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).send(newUser);
    expect(updatedResponse).to.have.status(409);
  });

  it('Should Unsuccessfully Update a User Due to Invalid Department Id', async function () {
    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: 'JohnPasswordUPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: 'Invalid Id', name: 'Invalid Name' }
    };

    const userResponse = await agent.get(USERS_ENDPOINT);
    const userId: string = userResponse.body[0].id;

    const updatedResponse = await agent.put(`${USERS_ENDPOINT}/${userId}`).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).send(newUser);
    expect(updatedResponse).to.have.status(422);
  });

  it('Should Unsuccessfully Update a User Due to Invalid User ID', async function () {
    const departmentResponse = await agent.get(DEPARTMENT_ENDPOINT);
    const departmentName: string = departmentResponse.body[0].name;
    const departmentId: string = departmentResponse.body[0].id;

    const newUser: User = {
      username: 'JohnUsernameUPDATED',
      password: 'JohnPasswordUPDATED',
      name: 'JohnUPDATED',
      role: 'User',
      department: { id: departmentId, name: departmentName }
    };

    const updatedResponse = await agent.put(`${USERS_ENDPOINT}/${'Invalid'}}`).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).send(newUser);
    expect(updatedResponse).to.have.status(500);
  });

  it('Should Successfully Delete a User', function (done: Done) {
    agent.get(USERS_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      const id: string = response.body[0].id; // The first User is not Admin
      agent
        .delete(`${USERS_ENDPOINT}/${id}`)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .end(function (error: any, response: any) {
          if (error) done(error);
          expect(response).to.have.status(204);

          // Check that the user no longer exists
          agent.get(`${USERS_ENDPOINT}/${id}`).end(function (error: any, response: any) {
            if (error) done(error);
            expect(response).to.have.status(404);
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
        expect(response).to.have.status(500);
        done();
      });
  });
});
