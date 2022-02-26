import { JsonReportDescriptor, JSON_REPORT_DESCRIPTOR_NAME, JSON_REPORT_META_NAME } from "common/definitions/json_report";

// https://github.com/YousefED/typescript-json-schema
import * as TJS from 'typescript-json-schema';
import { PATH_TO_JSON_REPORT_TYPES, PATH_TO_REPORT_TYPES } from "./constants";

import Ajv from 'ajv';

import ts from 'typescript';
import path from 'path';

const getTsCompilerOptions = function(): {} {
    const configFileName = ts.findConfigFile(__dirname, ts.sys.fileExists, "tsconfig.json");
    const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
    const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configFileName));
    return compilerOptions;
}

const initSchemaGenerator = () => {
    // this generator can generate json schema for types in 2 dirs:
    // PATH_TO_JSON_REPORT_TYPES and PATH_TO_REPORT_TYPES

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
    };

    const generator = TJS.buildGenerator(program, settings);
    return generator;
}

const schemaGenerator = initSchemaGenerator();
const ajv = new Ajv();

export const jsonStringToJsonReport = function(jsonString: string) : JsonReportDescriptor {
    validateJsonString(jsonString, JSON_REPORT_DESCRIPTOR_NAME); 
    const jsonReport: JsonReportDescriptor = JSON.parse(jsonString);
    return jsonReport;
}

const validateJsonString = function(jsonString: string, objectName: string) {
    
    const schema = schemaGenerator.getSchemaForSymbol(objectName);

    const validator = ajv.compile(schema);
    const valid = validator(JSON.parse(jsonString));

    if (valid === false) {
        throw new Error(`${validator.errors}`);
    }
}
