import { Logger } from 'winston';
import { buildDevLogger } from './dev.logger';
import { buildProdLogger } from './prod.logger';

/**
    levels {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    }   
**/

let logger: Logger;

if (process.env.NODE_ENV !== 'production') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export { logger };
