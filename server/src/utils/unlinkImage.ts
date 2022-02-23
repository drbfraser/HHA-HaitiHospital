const fs = require('fs');

export const deleteUploadedImage = (filepath: string) => {
  fs.unlink(filepath, (error: any) => {
    error ? console.error(error.message) : console.log('DELETED IMAGE WITH FILEPATH: '.concat(filepath));
  });
};
