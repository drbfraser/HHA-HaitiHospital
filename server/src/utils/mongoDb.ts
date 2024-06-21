import { logger } from 'logger';
import mongoose from 'mongoose';
import * as ENV from 'utils/processEnv';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function connectMongo() {
  mongoose
    .connect(ENV.MONGO_DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      logger.info('Connect to MongoDB');
    })
    .catch((err) => logger.error(err));
}

export async function connectTestMongo(): Promise<MongoMemoryServer> {
  let mongoServer = await MongoMemoryServer.create();
  await mongoose
    .connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      logger.info('Connected to in-memory MongoDB');
    })
    .catch((err) => logger.error(err));

  return mongoServer;
}
