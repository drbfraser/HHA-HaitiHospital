import express from 'express';
// import * as mongoose from 'mongoose';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import * as EnvUtils from './utils/envUtils';
import routes from './routes';
import { seedDb } from './utils/seed';

const app = express();

// Cross-Origin
const cors = require('cors');
const corsOptions = {
  origin: process.env.CORS,
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
  .connect(EnvUtils.MONGO_DB, {
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

// Start listening to PORT
const port = EnvUtils.SERVER_PORT;
app.listen(port, () => console.log(`Server started on port ${port}`));
