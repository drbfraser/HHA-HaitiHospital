import { JsonReportDescriptor, JSON_REPORT_DESCRIPTOR_NAME} from "common/definitions/json_report";

// https://github.com/YousefED/typescript-json-schema
import * as TJS from 'typescript-json-schema';
import { PATH_TO_JSON_REPORT_TYPES } from "./constants";

// import Ajv from 'ajv/dist/jtd';
import Ajv, { ValidateFunction } from 'ajv'
import path from 'path';

import ts from 'typescript';

const getTsCompilerOptions = function(): {} {
    const configFileName = ts.findConfigFile(__dirname, ts.sys.fileExists, "tsconfig.json") || null;
    if (!configFileName) {
        throw new Error("Can't find ts config file");
    }
    const configFile = ts.readConfigFile(configFileName!, ts.sys.readFile);
    if (!configFile) {
        throw new Error("Can't read ts config file");
    }

    const compilerOptions = ts.parseJsonConfigFileContent(configFile!.config, ts.sys, path.dirname(configFileName));
    return compilerOptions;
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
        throw new Error("failed to build a json schema generator");

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
        throw new Error(`No schema for ${schemaName} found`);
    }

    schema["$id"] = getSchemaId(schemaName);
    const ajv = new Ajv();

    if (!ajvValidators[schemaName]) {
        const validator = ajv.compile(schema);
        if (!validator)
            throw new Error("failed to build an ajv parser");
        ajvValidators[schemaName] = validator;
    }

    return ajvValidators[schemaName];
}


const validateJsonString = function(jsonString: string, objectName: string) {
    const ajvValidator = getAjvValidator(objectName);
    const json = JSON.parse(jsonString);
    const validate = ajvValidator!(json);

    if (!validate) {
        throw new Error(`json for ${objectName} is malformed`);
    }
}

const jsonStringToJsonReport = function(jsonString: string) : JsonReportDescriptor {
    try {
        validateJsonString(jsonString, JSON_REPORT_DESCRIPTOR_NAME); 
        const jsonReport: JsonReportDescriptor = JSON.parse(jsonString);
        return jsonReport;
    }
    catch (e) {
        return {} as JsonReportDescriptor;
    }
}

export {jsonStringToJsonReport};
