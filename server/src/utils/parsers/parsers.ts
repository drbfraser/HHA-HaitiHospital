// https://github.com/YousefED/typescript-json-schema
import * as TJS from 'typescript-json-schema';
import { PATH_TO_JSON_REPORT_TYPES } from '../constants';
import Ajv, { ValidateFunction } from 'ajv';
import path from 'path';
import ts from 'typescript';
import { ReportDescriptor } from 'utils/definitions/report';
import { JsonReportDescriptor, JSON_REPORT_DESCRIPTOR_NAME } from '@hha/common';
import {
  FileNotFound,
  IllegalState,
  InvalidInput,
  IOException,
  SystemException,
} from 'exceptions/systemException';
import { parseToReport } from 'utils/parsers/report';
import { parseToJson } from './json_report';
import { logger } from '../../logger';

/**
 * Parse a json string to a ReportDescriptor. Throws 400 on invalid structure or semantic.
 * @param jsonString json string to parse
 * @returns return a jsonReport object if sucessful
 */
export const jsonStringToReport = async function (jsonString: string): Promise<ReportDescriptor> {
  const jsonReport: JsonReportDescriptor = validateStructure(
    jsonString,
    JSON_REPORT_DESCRIPTOR_NAME,
  );
  const report = await parseToReport(jsonReport);
  return report;
};

export const reportToJsonReport = async (
  report: ReportDescriptor,
): Promise<JsonReportDescriptor> => {
  const jsonReport: JsonReportDescriptor = await parseToJson(report);
  return jsonReport;
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>
const getTsCompilerOptions = function (): {} {
  try {
    const configFileName = ts.findConfigFile(__dirname, ts.sys.fileExists, 'tsconfig.json') || null;
    if (!configFileName) {
      throw new FileNotFound("Can't find ts config file. Using default configuration");
    }
    const configFile = ts.readConfigFile(configFileName!, ts.sys.readFile);
    if (!configFile) {
      throw new IOException("Can't read ts config file. Using default configuration");
    }

    const compilerOptions = ts.parseJsonConfigFileContent(
      configFile!.config,
      ts.sys,
      path.dirname(configFileName),
    );
    return compilerOptions;
  } catch (e) {
    if (e instanceof SystemException) {
      logger.error(e);
      return {};
    }
    throw e;
  }
};

const getSchemaGenerator = function () {
  // this generator generate JSON schema for JsonReportDescriptor in PATH_TO_JSON_REPORT_TYPES
  // optionally pass ts compiler options
  const compilerOptions: TJS.CompilerOptions = getTsCompilerOptions();

  // optionally pass a base path
  const basePath = __dirname;
  const pathsToTypes = [PATH_TO_JSON_REPORT_TYPES];

  const program = TJS.getProgramFromFiles(pathsToTypes, compilerOptions, basePath);

  // optionally pass argument to schema generator
  const settings: TJS.PartialArgs = {
    required: true,
    strictNullChecks: true,
  };

  const generator = TJS.buildGenerator(program, settings);
  if (!generator) throw new IllegalState('Failed to build a json schema generator');

  return generator;
};

const ajvValidators: { [interfaceName: string]: ValidateFunction } = {};
const getAjvValidator = function (schemaName: string): ValidateFunction {
  const schemaGenerator = getSchemaGenerator();
  const schema = schemaGenerator!.getSchemaForSymbol(schemaName);
  if (!schema) {
    throw new IllegalState(`No schema for ${schemaName} found`);
  }

  const ajv = new Ajv();
  if (!ajvValidators[schemaName]) {
    const validator = ajv.compile(schema);
    if (!validator) throw new IllegalState('failed to build an ajv parser');
    ajvValidators[schemaName] = validator;
  }

  return ajvValidators[schemaName];
};

const validateStructure = function (jsonString: string, objectName: string): JsonReportDescriptor {
  const ajvValidator = getAjvValidator(objectName);
  const json: JsonReportDescriptor = JSON.parse(jsonString);
  const validate = ajvValidator!(json);
  if (!validate) {
    throw new InvalidInput(`json for ${objectName} is malformed`);
  }

  return json;
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<
