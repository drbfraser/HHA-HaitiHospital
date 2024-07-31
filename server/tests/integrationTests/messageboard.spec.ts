import http from 'http';
import {
  Accounts,
  closeServer,
  DEP_ID,
  dropMongo,
  INVALID_ID,
  seedMongo,
  setUpSession,
  USER_ID,
} from 'testTools/mochaHooks';
import { MESSAGEBOARD_ENDPOINT } from 'testTools/endPoints';
import { Done } from 'mocha';
import {
  HTTP_BADREQUEST_CODE,
  HTTP_CREATED_CODE,
  HTTP_INTERNALERROR_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
} from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import MessageCollection from 'models/messageBoard';

chai.use(chaiHttp);

interface MessageObject {
  department: { id: string };
  messageHeader: string;
  messageBody: string;
}

async function createMessage(
  departmentId = DEP_ID.GENERAL,
  userId = USER_ID.ADMIN,
  body = 'Message Body',
  header = 'Message Header',
) {
  const message = new MessageCollection({
    departmentId: departmentId,
    userId: userId,
    date: new Date(),
    messageBody: body,
    messageHeader: header,
  });
  message.save();
  return message.toJson();
}

describe('Messageboard Tests', function () {
  let httpServer: http.Server;
  let agent: any;
  let csrf: string;
  let mongo: MongoMemoryServer;

  before('Create a Working Server and Login With Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    httpServer = session.httpServer;
    agent = session.agent;
    mongo = session.mongo;
    csrf = session.csrf;
  });

  after('Close a Working Server', async function () {
    closeServer(agent, httpServer, mongo);
  });

  beforeEach('start with clean mongoDB', async function () {
    await seedMongo();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Get All Messages from the Messageboard', async function () {
    await createMessage();
    await createMessage();
    await createMessage();

    const res = await agent.get(MESSAGEBOARD_ENDPOINT);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(3);
  });

  it('Should Get a Message Via Message ID', async function () {
    const message = await createMessage(
      DEP_ID.GENERAL,
      USER_ID.ADMIN,
      'New message body!',
      'New message header!',
    );
    await createMessage();

    const res = await agent.get(`${MESSAGEBOARD_ENDPOINT}/${message.id}`);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body.id).to.equal(message.id.toString());
    expect(res.body.messageBody).to.equal(message.messageBody);
    expect(res.body.messageHeader).to.equal(message.messageHeader);
  });

  it('Should Fail to Get Message Due to Invalid Message ID', async function () {
    const res = await agent.get(`${MESSAGEBOARD_ENDPOINT}/${INVALID_ID}`);

    expect(res).to.have.status(HTTP_NOTFOUND_CODE);
  });

  it('Should Fail to Get Messages Due To Invalid Department', async function () {
    const res = await agent.get(`${MESSAGEBOARD_ENDPOINT}/department/${INVALID_ID}`);

    expect(res).to.have.status(HTTP_BADREQUEST_CODE);
  });

  it('Should Get Messages From General Department', async function () {
    await createMessage(DEP_ID.MATERNITY);
    await createMessage(DEP_ID.MATERNITY);
    await createMessage();
    await createMessage();

    const res = await agent.get(`${MESSAGEBOARD_ENDPOINT}/department/${DEP_ID.GENERAL}`);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.be.an('array');
    expect(res.body.every((msg: any) => msg.department.id == DEP_ID.GENERAL)).to.be.true;
  });

  it('Should Successfully Post a New Message', async function () {
    const header = 'test header';
    const body = 'test body';
    const newMessage: MessageObject = {
      department: { id: DEP_ID.GENERAL },
      messageHeader: header,
      messageBody: body,
    };

    const res = await agent
      .post(MESSAGEBOARD_ENDPOINT)
      .send(newMessage)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    const newMsg = await MessageCollection.findOne({ userId: USER_ID.ADMIN });
    expect(res).to.have.status(HTTP_CREATED_CODE);
    expect(newMsg).is.not.null;
    expect(newMsg?.messageBody).is.equal(body);
    expect(newMsg?.messageHeader).is.equal(header);
    expect(newMsg?.departmentId).is.equal(DEP_ID.GENERAL);
  });

  it('Should Fail Posting a New Message due to Invalid Department ID', async function () {
    const newMessage: MessageObject = {
      department: { id: INVALID_ID },
      messageHeader: 'test header',
      messageBody: 'test body',
    };

    const res = await agent
      .post(MESSAGEBOARD_ENDPOINT)
      .send(newMessage)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    const newMsg = await MessageCollection.findOne({ userId: USER_ID.ADMIN });
    expect(res).to.have.status(HTTP_BADREQUEST_CODE);
    expect(newMsg).is.null;
  });

  it('Should Successfully Delete an existing message', async function () {
    const msg = await createMessage();
    const keepMsg = await createMessage();

    const res = await agent
      .delete(`${MESSAGEBOARD_ENDPOINT}/${msg.id}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    expect(res).to.have.status(HTTP_NOCONTENT_CODE);
    expect(await MessageCollection.findOne({ _id: msg.id })).is.null;
    expect(await MessageCollection.findOne({ _id: keepMsg.id })).is.not.null;
  });

  it('Should Fail to Delete a Message Because It Does Not Exist', async function () {
    const res = await agent
      .delete(`${MESSAGEBOARD_ENDPOINT}/${INVALID_ID}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    expect(res).to.have.status(HTTP_NOTFOUND_CODE);
  });

  it('Should succesfully update a message', async function () {
    const msg = await createMessage();
    const updatedBody = 'test header msg UPDATED';
    const updatedHeader = 'test body msg UPDATED';

    const newMessage: MessageObject = {
      department: { id: DEP_ID.GENERAL },
      messageHeader: updatedHeader,
      messageBody: updatedBody,
    };

    const res = await agent
      .put(`${MESSAGEBOARD_ENDPOINT}/${msg.id}`)
      .send(newMessage)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    expect(res).to.have.status(HTTP_OK_CODE);
    const updatedMessage = await MessageCollection.findOne({ _id: msg.id });
    expect(updatedMessage?.messageHeader).to.equal(updatedHeader);
    expect(updatedMessage?.messageBody).to.equal(updatedBody);
  });
});
