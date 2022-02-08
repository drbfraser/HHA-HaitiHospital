import 'dotenv/config';
import http from 'http';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import routes from './routes/routes';
import { seedDb } from './utils/seed';

export const createServer = () => {
  const app = express();

  // Cross-Origin
  const cors = require('cors');
  const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
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

  // Connect to Mongo
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log('MongoDB Connected...');
      seedDb();
    })
    .catch((err) => console.log(err));

  // Use Routes
  app.use('/', routes);
  app.use('/public', express.static('public'));

  return app;
};

export const setServerPort = (app: Application, PORT: number) => {
  // Start listening to PORT
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};
