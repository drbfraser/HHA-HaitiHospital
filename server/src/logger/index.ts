import { Logger } from 'winston';
import { buildDevLogger } from './dev.logger';
import { buildProdLogger } from './prod.logger';

const logger: Logger = process.env.NODE_ENV !== 'production' ? buildDevLogger() : buildProdLogger();

export { logger };
