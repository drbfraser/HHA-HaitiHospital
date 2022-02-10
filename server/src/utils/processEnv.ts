import 'dotenv/config';

class EnviromentConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Enviroment Configuration Error';
  }
}

// Options with default values.
export const MONGO_DB = process.env.MONGO_URI ?? 'mongodb://localhost:27017/';
export const CORS = process.env.CORS ?? 'http://localhost:3000';
export const SERVER_PORT = parseInt(process.env.SERVER_PORT ?? '5000');
export const TEST_SERVER_PORT = parseInt(process.env.TEST_PORT ?? '5001');

// Options without default values.
const passwordSeed = process.env.PASSWORD_SEED;
if (passwordSeed === undefined) throw new EnviromentConfigurationError('PASSWORD_SEED missing');
export const PASSWORD_SEED = passwordSeed;

const secret = process.env.JWT_SECRET;
if (secret === undefined) throw new EnviromentConfigurationError('JWT_SECRET missing');
export const JWT_SECRET = secret;
