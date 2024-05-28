import { BadRequest, InternalError, NotFound } from 'exceptions/httpException';
import { Error, NativeError } from 'mongoose';
import { ItemType, ItemTypeKeys } from '@hha/common';
import {
  CLASS_KEY,
  COMPOSITE_QUESTION_IDENTIFIER,
  EXPANDABLE_QUESTION_IDENTIFIER,
  KEY_FOR_QUESTIONS,
  MONGOOSE_NO_DOCUMENT_ERROR_NAME,
  MONGOOSE_VALIDATOR_ERROR_NAME,
  NUMERIC_QUESTION_IDENTIFIER,
  QUESTION_IDENTIFIER,
} from './constants';

import { CustomError } from 'exceptions/custom_exception';
import { InvalidInput } from 'exceptions/systemException';
import crypto from 'crypto';
import fs from 'fs';
import { logger } from '../logger';
import { promisify } from 'util';
import { ITemplate } from 'models/template';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

export const deleteAllAvatars = async (absoluteFolderPath: string) => {
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

export const isValidUrl = (str: string) => {
  var urlRegex =
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
};

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

export const formatDateString = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

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
  const regexPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{6,}$/;
  return password.length >= 6 && password.length <= 60 && regexPattern.test(password);
};

export type FlatQuestion = {
  en: string;
  fr: string;
  id: string;
};
const recursivelyParseQuestions = (template: any, result: FlatQuestion[]) => {
  /***
   * This function extracts all the questions (both nested and not nested) for the analytics feature
   * We want to flatten the questions since questions are nested. This will make it easier to analyze
   *  - Loop through all the key-value pairs in template
   *  - if value at template[key] is an object, then template[key] is either an object or an array
   *      - if template[key] is an array, then recur on the array's element
   *      - if template[key] is an object, then recur on the object's value
   * - We use "prompt" as an identifier for a question and we are only intersted in questions of type:
   *  - NumericQuestion
   *  - ExpandableQuestion
   *  - CompositionQuestion
   * - We chose these 3 types because they are questions that have numeric answers from looking attemplate data
   */
  Object.keys(template).forEach((key) => {
    if (
      key == KEY_FOR_QUESTIONS &&
      (template[CLASS_KEY] == NUMERIC_QUESTION_IDENTIFIER ||
        template[CLASS_KEY] == EXPANDABLE_QUESTION_IDENTIFIER ||
        template[CLASS_KEY] == COMPOSITE_QUESTION_IDENTIFIER)
    ) {
      result.push({ ...template[key], id: template[QUESTION_IDENTIFIER] });
      return;
    }

    if (typeof template[key] == 'object') {
      if (Array.isArray(template[key])) {
        template[key].forEach((subTemplate: any) => {
          recursivelyParseQuestions(subTemplate, result);
        });
      } else {
        recursivelyParseQuestions(template[key], result);
      }
    }
  });
};

export const parseQuestions = (template: ITemplate) => {
  const result: FlatQuestion[] = [];

  recursivelyParseQuestions(template, result);

  return result;
};
