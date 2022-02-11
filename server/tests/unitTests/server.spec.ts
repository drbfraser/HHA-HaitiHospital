import request from 'supertest';
import http from 'http';
import { createServer } from '../../src/server';
import * as ENV from '../../src/utils/processEnv';
import { Application, Request, Response, NextFunction } from 'express';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Test 1: Create a non-working server
describe('test non-working server', () => {
  let testApp: Application;
  before(() => {
    testApp = createServer();
  });
  it('should instantiate server unsuccessfully', (done) => {
    request(testApp).get('/').expect(404, done);
  });
});

// Test 2: Create a working server
describe('test working server', () => {
  let testApp: Application;
  let httpServer: http.Server;
  before(() => {
    testApp = createServer();
    testApp.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.send('Welcome to HHA');
    });
    httpServer = http.createServer(testApp);
    httpServer.listen(ENV.TEST_SERVER_PORT);
  });
  after(() => {
    httpServer.close();
  });
  it('should instantiate server successfully', (done) => {
    request(httpServer).get('/').expect(200, done);
  });
});
