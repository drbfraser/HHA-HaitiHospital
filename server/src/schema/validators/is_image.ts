import { CustomValidator } from 'express-validator';

const isImage: CustomValidator = (value) => {
  const file: Express.Multer.File = value;
  const regex = new RegExp(`image/*`);
  return regex.test(file.mimetype);
};

const MUST_BE_AN_IMAGE_FILE: string = `Expecting an image file`;

export { isImage, MUST_BE_AN_IMAGE_FILE };
