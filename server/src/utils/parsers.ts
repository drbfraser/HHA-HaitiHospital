import { JsonReportDescriptor, JSON_REPORT_DESCRIPTOR_NAME} from "common/definitions/json_report";

// https://github.com/YousefED/typescript-json-schema
import * as TJS from 'typescript-json-schema';
import { PATH_TO_JSON_REPORT_TYPES } from "./constants";

// import Ajv from 'ajv/dist/jtd';
import Ajv, { ValidateFunction } from 'ajv'
import path from 'path';

import ts from 'typescript';
import { BadRequestError, InternalError } from "exceptions/httpException";

const getTsCompilerOptions = function(): {} {
    try {
        const configFileName = ts.findConfigFile(__dirname, ts.sys.fileExists, "tsconfig.json") || null;
        if (!configFileName) {
            throw new InternalError("Can't find ts config file. Using dafult configuration");
        }
        const configFile = ts.readConfigFile(configFileName!, ts.sys.readFile);
        if (!configFile) {
            throw new InternalError("Can't read ts config file. Using default configuration");
        }

        const compilerOptions = ts.parseJsonConfigFileContent(configFile!.config, ts.sys, path.dirname(configFileName));
        return compilerOptions;
    }
    catch (e) {
        console.log(e);
        return {};
    }
}

const getSchemaGenerator = function() {
    // this generator generate JSON schema for JsonReportDescriptor in PATH_TO_JSON_REPORT_TYPES
    // optionally pass ts compiler options
    const compilerOptions: TJS.CompilerOptions = getTsCompilerOptions();

    // optionally pass a base path
    const basePath = __dirname;
    const pathsToTypes = [PATH_TO_JSON_REPORT_TYPES];

    const program = TJS.getProgramFromFiles(
        pathsToTypes,
        compilerOptions,
        basePath
    );

     // optionally pass argument to schema generator
    const settings: TJS.PartialArgs = {
        required: true,
        strictNullChecks: true,
    };
    
    const generator = TJS.buildGenerator(program, settings);
    if (!generator) 
        throw new InternalError("Failed to build a json schema generator");

    return generator;
}

const getSchemaId = (objectName: string): string => {
    return `#/definitions/${objectName}`;
}

const ajvValidators: {[interfaceName: string]: ValidateFunction} = {};
const getAjvValidator = function(schemaName: string) {
    const schemaGenerator = getSchemaGenerator();
    const schema = schemaGenerator!.getSchemaForSymbol(schemaName);
    
    if (!schema) {
        throw new InternalError(`No schema for ${schemaName} found`);
    }

    schema["$id"] = getSchemaId(schemaName);
    const ajv = new Ajv();

    if (!ajvValidators[schemaName]) {
        const validator = ajv.compile(schema);
        if (!validator)
            throw new InternalError("failed to build an ajv parser");
        ajvValidators[schemaName] = validator;
    }

    return ajvValidators[schemaName];
}


const validateJsonString = function(jsonString: string, objectName: string) {
    const ajvValidator = getAjvValidator(objectName);
    const json = JSON.parse(jsonString);
    const validate = ajvValidator!(json);

    if (!validate) {
        throw new BadRequestError(`json for ${objectName} is malformed`);
    }
}

const jsonStringToJsonReport = function(jsonString: string) : JsonReportDescriptor {
    validateJsonString(jsonString, JSON_REPORT_DESCRIPTOR_NAME); 
    const jsonReport: JsonReportDescriptor = JSON.parse(jsonString);
    return jsonReport;
}

export {jsonStringToJsonReport};
