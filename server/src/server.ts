import http from 'http';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import routes from './routes/routes';
import * as ENV from './utils/processEnv';
const path = require('path');

import csrf from 'csurf';
import httpErrorHandler from 'middleware/httpErrorHandler';

export const createServer = () => {
  const app = express();

  // Path to static folder
  app.use(express.static(path.join(__dirname, '../public')));

  // Cross-Origin
  const cors = require('cors');
  const corsOptions = {
    origin: ENV.CORS,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Cookie', 'x-xsrf-token', 'X-CSRF-TOKEN'],
    exposedHeaders: ['Content-Type']
  };
  app.use(cors(corsOptions));

  // Bodyparser Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use(passport.initialize());
  require('./services/jwtStrategy');
  require('./services/localStrategy');

  // CSRF
  app.use(csrf({ cookie: true }));
  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });

  // Connect to Mongo
  mongoose
    .connect(ENV.MONGO_DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log('MongoDB Connected...');
    })
    .catch((err) => console.log(err));

  // Use Routes
  app.use('/', routes);
  app.use('/public', express.static('public'));
  app.use(httpErrorHandler);

  return app;
};

export const setServerPort = (app: Application, PORT: number) => {
  // Start listening to PORT
  const httpServer = http.createServer(app);
  httpServer.listen(ENV.SERVER_PORT, () => console.log(`Server started on port ${PORT}`));
};
