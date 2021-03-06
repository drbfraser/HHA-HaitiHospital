import { BadRequest } from 'exceptions/httpException';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const maxSize = 200 * 1024 * 1024; // max file size in bytes: 200 MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `case-study-${Date.now()}-${fileName}`);
  }
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
  }
});

// Take req.file assigned by multer.single() and assign it to
// req.body.file as to accomodate express-validator validators
// since they only look for input fields inside
// req.body, req.param, req.query, req.header, ... (by convention)
export const oneImageUploader = (inputField: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const multerSingle = upload.single(inputField);
    multerSingle(req, res, (error) => {
      if (error) {
        next(new BadRequest(error.message))
      } else {
        if (!req.file) next(new BadRequest(`Expecting an image`));
        req.file!.path = req.file!.path.replace(/\\/g, '/');
        req.body.file = req.file;
        next();
      }
    });
  };
};
export default upload;
