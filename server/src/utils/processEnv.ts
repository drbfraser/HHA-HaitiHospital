import 'dotenv/config';

class EnviromentConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Enviroment Configuration Error';
  }
}

// Options with default values.
export const MONGO_DB = 'mongodb://localhost:27017/' || process.env.MONGO_URI;
export const CORS = 'http://localhost:3000' || process.env.CORS;
export const SERVER_PORT = 5000 || parseInt(process.env.SERVER_PORT);
export const TEST_SERVER_PORT = 5001 || parseInt(process.env.TEST_PORT);

// Options without default values.
const passwordSeed = process.env.PASSWORD_SEED;
if (passwordSeed === undefined) throw new EnviromentConfigurationError('PWD_SEED missing');
export const PASSWORD_SEED = passwordSeed;

const secret = process.env.JWT_SECRET;
if (secret === undefined) throw new EnviromentConfigurationError('JWT SECRET missing from .env');
export const JWT_SECRET = secret;
