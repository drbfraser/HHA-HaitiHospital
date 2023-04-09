import fs from 'fs';
import { promisify } from 'util';
import { logger } from '../logger';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

export const deleteAllAvatars = async (absoluteFolderPath) => {
  try {
    const files = await readdir(absoluteFolderPath);
    const unlinkPromises = files.map((filename) => {
      if (!['avatar0.jpg', 'avatar1.jpg', 'avatar2.jpg'].includes(filename)) {
        logger.debug('Deleting avatar: ', filename);
        unlink(`${absoluteFolderPath}/${filename}`);
      }
    });
    return Promise.all(unlinkPromises);
  } catch (err) {
    logger.error(err);
  }
};

export const isValidUrl = (str) => {
  var urlRegex =
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
};

import { InvalidInput } from 'exceptions/systemException';
import crypto from 'crypto';
import { ItemType, ItemTypeKeys } from '@hha/common';
import { CustomError } from 'exceptions/custom_exception';
import { Error, NativeError } from 'mongoose';
import { BadRequest, InternalError, NotFound } from 'exceptions/httpException';
import { MONGOOSE_NO_DOCUMENT_ERROR_NAME, MONGOOSE_VALIDATOR_ERROR_NAME } from './constants';

export const getEnumKeyByStringValue = function <T extends { [index: string]: any }>(
  myEnum: T,
  enumValue: string,
): keyof T | null {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x].toString() == enumValue);
  return keys.length > 0 ? keys[0] : null;
};

export const getLengthOfEnum = function <T extends { [index: string]: any }>(myEnum: T): number {
  let count = Object.keys(myEnum).filter((key) => isNaN(Number(key))).length;
  return count;
};

export const getItemTypeFromValue = (type: string): ItemTypeKeys => {
  const key = getEnumKeyByStringValue(ItemType, type);
  if (!key) {
    throw new InvalidInput(`Item of type: ${type} is not supported`);
  }
  return key!;
};

export const formatDateString = (date: Date): string => {
  // const myOptions = {year: "numeric", month: 'long', day: 'numeric'};
  const result = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return result;
};

export const generateUuid = (): string => {
  const id: string = crypto.randomBytes(16).toString('hex');
  return id;
};

export const mongooseErrorToMyError = (err: NativeError): CustomError => {
  switch (err.name) {
    case MONGOOSE_VALIDATOR_ERROR_NAME: {
      const castErr = err as Error.ValidationError;
      let msg = '';
      for (let field in castErr.errors) {
        msg += castErr.errors[field].message + '\n';
      }
      return new BadRequest(msg);
    }
    case MONGOOSE_NO_DOCUMENT_ERROR_NAME: {
      return new NotFound(`No document found`);
    }
    default: {
      return new InternalError(`${err.message}`);
    }
  }
};

// To extract a TS type's properties to string
// Ref: https://stackoverflow.com/a/42516869
export const proxiedPropertyOf = <IObj>() =>
  new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw new Error(`Setter not supported`);
      },
    },
  ) as {
    [P in keyof IObj]: P;
  };

export const isValidPasswordString = (password: string): boolean => {
  // this regex checks for at least one uppercase, one lowercase, one number, and one special character with a minimum length of 6
  const regexPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
  return password.length >= 6 && password.length <= 60 && regexPattern.test(password);
};
