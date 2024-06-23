const fs = require('fs');

import { logger } from '../logger';

export const deleteUploadedImage = (filepath: string) => {
  //TODO: find better way to deal with this
  if (process.env.NODE_ENV !== 'test') {
    fs.unlink(filepath, (error: any) => {
      error
        ? logger.error(error.message)
        : logger.debug('DELETED IMAGE WITH FILEPATH: '.concat(filepath));
    });
  } else {
    logger.debug(
      'In not in test environment, would have DELETED IMAGE WITH FILEPATH: '.concat(filepath),
    );
  }
};
