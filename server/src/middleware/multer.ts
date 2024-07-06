import { NextFunction, Request, Response } from 'express';

import { BadRequest } from 'exceptions/httpException';
import multer from 'multer';

const maxSize = 200 * 1024 * 1024; // max file size in bytes: 200 MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    // in the testing environment, skip the step of saving a new file so it doesn't clutter the project.
    if (process.env.NODE_ENV === 'test') {
      cb(null, file.originalname);
    } else {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, `case-study-${Date.now()}-${fileName}`);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const match = ['image/png', 'image/jpeg', 'image/jpg'];
    if (match.indexOf(file.mimetype) === -1) {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    } else {
      cb(null, true);
    }
  },
});

// Take req.file assigned by multer.single() and assign it to
// req.body.file as to accomodate express-validator validators
// since they only look for input fields inside
// req.body, req.param, req.query, req.header, ... (by convention)
/**
 * @param inputField - is a field of a multipart form with which multer parses the media
 */
export const ImageUploader = (inputField: string, required = true) => {
  //TODO: figure out how to prevent files to be created when testing
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadSingleFile = upload.single(inputField);

    uploadSingleFile(req, res, (error) => {
      if (error) {
        return next(new BadRequest(error.message));
      } else {
        if (required && !req.file) return next(new BadRequest(`Expecting an image`));

        if (req.file) {
          req.file!.path = req.file!.path.replace(/\\/g, '/');
        }

        req.body.file = req.file;
        return next();
      }
    });
  };
};
export default upload;
