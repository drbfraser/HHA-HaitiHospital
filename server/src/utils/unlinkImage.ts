const fs = require('fs');
import { logger } from '../logger';

export const deleteUploadedImage = (filepath: string) => {
  fs.unlink(filepath, (error: any) => {
    error ? logger.error(error.message) : logger.debug('DELETED IMAGE WITH FILEPATH: '.concat(filepath));
  });
};
