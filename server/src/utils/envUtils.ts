import 'dotenv/config';

class EnviromentConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Enviroment Configuration Error';
  }
}

export const MONGO_DB = process.env.MONGO_UR || 'mongodb://localhost:27017/';
export const SERVER_PORT = process.env.SERVER_PORT || 5000;
export const CORS = process.env.CORS || 'http://localhost:3000';

const pwdSeed = process.env.SEED_PWD;
if (pwdSeed === undefined) throw new EnviromentConfigurationError('PWD_SEED missing');
export const PASSWORD_SEED = pwdSeed;

const secret = process.env.JWT_SECRET;
if (secret === undefined) throw new EnviromentConfigurationError('JWT SECRET missing from .env');
export const JWT_SECRET = secret;
