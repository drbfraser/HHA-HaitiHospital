import http from 'http';
import { Accounts, closeServer, dropMongo, seedMongo, setUpSession } from 'testTools/mochaHooks';
import { LEADERBOARD_ENDPOINT } from 'testTools/endPoints';
import { Done } from 'mocha';
import { HTTP_OK_CODE } from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;

describe('Leaderboard Tests', function () {
  let mongo: MongoMemoryServer;
  before('Create a Working Server and Login With Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    httpServer = session.httpServer;
    agent = session.agent;
    mongo = session.mongo;
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

  it('should get all leaderboard points', function (done: Done) {
    agent.get(LEADERBOARD_ENDPOINT).end(function (err: any, res: any) {
      expect(err).to.be.null;
      expect(res).to.have.status(HTTP_OK_CODE);
      done();
    });
  });
});
