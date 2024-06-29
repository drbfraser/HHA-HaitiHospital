const fs = require('fs');

import { logger } from '../logger';

export const deleteUploadedImage = (filepath: string) => {
  //TODO: may want a better way to deal with file management, ignoring deletion based on environment is ok for now
  // but may cause issues in the future.
  if (process.env.NODE_ENV !== 'test') {
    fs.unlink(filepath, (error: any) => {
      error
        ? logger.error(error.message)
        : logger.debug('DELETED IMAGE WITH FILEPATH: '.concat(filepath));
    });
  } else {
    logger.debug(
      'Did not delete becasue code has been ran in the test environment, however it would have DELETED IMAGE WITH FILEPATH: '.concat(
        filepath,
      ),
    );
  }
};
