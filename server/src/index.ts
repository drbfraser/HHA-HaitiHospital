import 'dotenv/config';
import express from 'express';
// import * as mongoose from 'mongoose';
import mongoose from "mongoose";
import * as https from 'https';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import passport from 'passport';
import all_routes from 'express-list-endpoints';

import routes from './routes';
import { seedDb } from './utils/seed';

const app = express();

// Cross-Origin 
const cors = require('cors');
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type']
}
app.use(cors(corsOptions));

// Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./services/jwtStrategy');
require('./services/localStrategy');

//console.log(JSON.stringify(process.env, null, '\t'));

// Connect to Mongo
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected...');
    //seedDb();
  })
  .catch((err) => console.log(err));

// Use Routes
app.use('/', routes);
app.use('/public', express.static(join(__dirname, '../public')));

// Start listening to PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

