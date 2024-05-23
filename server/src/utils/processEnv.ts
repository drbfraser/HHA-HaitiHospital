import 'dotenv/config';

class EnvironmentConfigurationError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'Environment Configuration Error';
  }
}

// Options with default values.
export const MONGO_DB = process.env.MONGO_URI ?? 'mongodb://localhost:27017/';
export const CORS = process.env.CORS ?? 'http://localhost:3000';
export const SERVER_PORT = parseInt(process.env.SERVER_PORT ?? '5000');
export const TEST_SERVER_PORT = parseInt(process.env.TEST_PORT ?? '5001');

// Options without default values.
const passwordSeed = process.env.PASSWORD_SEED;
if (passwordSeed === undefined) throw new EnvironmentConfigurationError('PASSWORD_SEED missing');
export const PASSWORD_SEED = passwordSeed;

const randPassword = process.env.RAND_PASSWORD_SEED;
if (randPassword === undefined) throw new EnvironmentConfigurationError('RAND_PASSWORD missing');
export const RAND_PASSWORD_SEED = randPassword;

const secret = process.env.JWT_SECRET;
if (secret === undefined) throw new EnvironmentConfigurationError('JWT_SECRET missing');
export const JWT_SECRET = secret;

const sessionSecret = process.env.SESSION_SECRET;
if (sessionSecret === undefined) throw new EnvironmentConfigurationError('SESSION_SECRET missing');
export const SESSION_SECRET = secret;
