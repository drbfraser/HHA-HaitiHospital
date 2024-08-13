import http from 'http';
import {
  Accounts,
  closeServer,
  dropMongo,
  INVALID_ID,
  seedMongo,
  setUpSession,
  USER_ID,
} from 'testTools/mochaHooks';
import { MESSAGEBOARD_COMMENT_ENDPOINT } from 'testTools/endPoints';
import { HTTP_BADREQUEST_CODE, HTTP_CREATED_CODE, HTTP_OK_CODE } from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import MessageBoardComment from 'models/messageBoardComment';
import { createMessage } from './messageboard.spec';

chai.use(chaiHttp);

async function createComment(userId = USER_ID.ADMIN, parentId: string, text = 'a comment here') {
  const comment = new MessageBoardComment({
    userId: userId,
    messageComment: text,
    parentMessageId: parentId,
  });
  await comment.save();
  return comment.toJson();
}

interface MessageComment {
  parentMessageId: string;
  messageComment: string;
}

describe('Message Board Comments Test', function () {
  let mongo: MongoMemoryServer;
  let httpServer: http.Server;
  let agent: any;
  let csrf: string;

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
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Successfully Get Message Comments', async function () {
    const messageBoard = await createMessage();
    const ignoreBoard = await createMessage();

    const comment1 = await createComment(USER_ID.ADMIN, messageBoard.id);
    const comment2 = await createComment(USER_ID.ADMIN, messageBoard.id);

    await createComment(USER_ID.ADMIN, ignoreBoard.id);

    // Get a message first to get an ID
    const res = await agent.get(`${MESSAGEBOARD_COMMENT_ENDPOINT}/${messageBoard.id}`);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.have.lengthOf(2);
    expect(res.body.some((comment: any) => comment.id == comment1.id)).to.be.true;
    expect(res.body.some((comment: any) => comment.id == comment2.id)).to.be.true;
  });

  it('Should Unsuccessfully Get Message Comments Due to Invalid Message Parent Id', async function () {
    const res = await agent.get(`${MESSAGEBOARD_COMMENT_ENDPOINT}/${INVALID_ID}`);

    expect(res).to.have.status(HTTP_BADREQUEST_CODE);
  });

  it('Should Successfully Post a Comment', async function () {
    const messageBoard = await createMessage();

    const messageId: string = messageBoard.id;
    const messageComment: MessageComment = {
      parentMessageId: messageId,
      messageComment: 'Sample Test',
    };

    const res = await agent
      .post(MESSAGEBOARD_COMMENT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(messageComment);

    expect(res).to.have.status(HTTP_CREATED_CODE);
    expect(await MessageBoardComment.findOne({ userId: USER_ID.ADMIN })).to.not.be.null;
  });

  it('Should Unsuccessfully Post a Comment Due To Invalid Parent Message Id', async function () {
    const messageComment: MessageComment = {
      parentMessageId: INVALID_ID,
      messageComment: 'Sample Test',
    };

    const res = await agent
      .post(MESSAGEBOARD_COMMENT_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send(messageComment);

    expect(res).to.have.status(HTTP_BADREQUEST_CODE);
  });
});
