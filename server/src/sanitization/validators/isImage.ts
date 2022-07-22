import { CustomValidator } from 'express-validator';

export const isImage: CustomValidator = (value) => {
  const file: Express.Multer.File = value;
  const regex = new RegExp(/image\/png|jpeg|jpg/g);
  return regex.test(file.mimetype);
};

export const MUST_BE_AN_IMAGE_FILE: string = `Expecting an image file .png, .jpeg, or .jpg`;
