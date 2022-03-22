import { JsonItemAnswer, JsonReportDescriptor, JsonReportItem, JsonReportItemMeta, JsonReportMeta, JSON_REPORT_DESCRIPTOR_NAME } from 'common/definitions/json_report';

// https://github.com/YousefED/typescript-json-schema
import * as TJS from 'typescript-json-schema';
import { PATH_TO_JSON_REPORT_TYPES } from './constants';
import Ajv, { ValidateFunction } from 'ajv';
import path from 'path';
import ts from 'typescript';
import { BadRequestError, InternalError } from 'exceptions/httpException';

const getTsCompilerOptions = function (): {} {
  try {
    const configFileName = ts.findConfigFile(__dirname, ts.sys.fileExists, 'tsconfig.json') || null;
    if (!configFileName) {
      throw new InternalError("Can't find ts config file. Using default configuration");
    }
    const configFile = ts.readConfigFile(configFileName!, ts.sys.readFile);
    if (!configFile) {
      throw new InternalError("Can't read ts config file. Using default configuration");
    }

    const compilerOptions = ts.parseJsonConfigFileContent(configFile!.config, ts.sys, path.dirname(configFileName));
    return compilerOptions;
  } catch (e) {
    console.log(e);
    return {};
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
    strictNullChecks: true
  };

  const generator = TJS.buildGenerator(program, settings);
  if (!generator) throw new InternalError('Failed to build a json schema generator');

  return generator;
};

const getSchemaId = (objectName: string): string => {
  return `#/definitions/${objectName}`;
};

const ajvValidators: { [interfaceName: string]: ValidateFunction } = {};
const getAjvValidator = function (schemaName: string) {
  const schemaGenerator = getSchemaGenerator();
  const schema = schemaGenerator!.getSchemaForSymbol(schemaName);

  if (!schema) {
    throw new InternalError(`No schema for ${schemaName} found`);
  }

  schema['$id'] = getSchemaId(schemaName);
  const ajv = new Ajv();

  if (!ajvValidators[schemaName]) {
    const validator = ajv.compile(schema);
    if (!validator) throw new InternalError('failed to build an ajv parser');
    ajvValidators[schemaName] = validator;
  }

  return ajvValidators[schemaName];
};

const validateJsonString = function (jsonString: string, objectName: string) {
  const ajvValidator = getAjvValidator(objectName);
  const json = JSON.parse(jsonString);
  const validate = ajvValidator!(json);

  if (!validate) {
    throw new BadRequestError(`json for ${objectName} is malformed`);
  }
};

const verifyUserId = (uid: string): boolean => {
    // ToDo: actually verify submitted user id is logged in user
    return true;
}

const validateSemanticsOfReportMeta = (meta: JsonReportMeta) => {
    const deptId = getDepartmentIdFromString(meta.departmentId);
    if (!deptId) {
        throw new BadRequestError(`No department with id ${meta.departmentId}`);
    }
    const submittedDate = new Date(meta.submittedDate);
    if (!submittedDate) {
        throw new BadRequestError(`Submitted date provided is not valid: ${meta.submittedDate}`);
    }
    const isUser = verifyUserId(meta.submittedUserId);
    if (!isUser) {
        throw new UnauthorizedError(`Submitted user is not logged in`);
    }
}

const validateSemantics = (report: JsonReportDescriptor) => {
    // Meta
    validateSemanticsOfReportMeta(report.meta);

    // Items
    validateSemanticsOfReportItems(report.items);
}

const isBooleanValue = (str: string) => {
    const parsed = JSON.parse(str.toLowerCase());
    if (parsed === true || parsed === false) {
        return true;
    }
    
    return false;
}

const validateAnswerInputType = (answer: JsonItemAnswer, itemType: ItemTypeKeys) => {
    // a single cell answer may have more than 1 entry
    switch (mapItemTypeToAnswerType.get(itemType)) {
        case ("number"): {
            answer.forEach((answerEntry) => {
                if (isNaN(Number(answerEntry))) {
                    throw new BadRequestError(`Item must have numeric answer but got this ${answerEntry}`);
                }
            })
            break;
        }
        case("boolean"): {
            answer.forEach((answerEntry) => {
                if (!isBooleanValue(answerEntry)) {
                    throw new BadRequestError(`Item must have boolean answer but got this ${answerEntry}`);
                }
            })
            break;
        }
        case("string"): {
            break;
        }
        default: {
            throw new InternalError("Item type is not defined to map with an answer type");
        }
    }
}

const validateItemChildren = (item: JsonReportItem) => {

};

const validateSemanticsOfAReportItem = (item: JsonReportItem) => {
    const typeKey = getItemTypeFromValue(item.type);
    if (!typeKey) {
        throw new Error(`No item of type ${item.type}`);
    }

    // answer can contains more than 1 cell if item was a table
    item.answer.forEach((singleCellAnswer) => {
        validateAnswerInputType(singleCellAnswer, typeKey);
    })

    // children - to support wrapper item
    validateItemChildren(item);
    // ToDo: fill the rest when implement other item types
}

const validateSemanticsOfReportItems = (items: Array<JsonReportItem>) => {
    items.forEach((item) => validateSemanticsOfAReportItem(item));
}   

const jsonStringToJsonReport = function (jsonString: string): JsonReportDescriptor {
  validateStructure(jsonString, JSON_REPORT_DESCRIPTOR_NAME);
  const jsonReport: JsonReportDescriptor = JSON.parse(jsonString);

//   validateSemantics(jsonReport);
  return jsonReport;
};



const jsonReportToReport = function(json: JsonReportDescriptor): ReportDescriptor {
    const report = reportConstructor(json);
    return report;
}
export { jsonStringToJsonReport, initAjvAsStandAlone, cleanupAjvStandAlone };



