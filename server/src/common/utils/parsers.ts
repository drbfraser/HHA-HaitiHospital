import { JsonReportDescriptor, JSON_REPORT_DESCRIPTOR_NAME } from "common/definitions/json_report";

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

const getJsonSchemaGenerator = () => {
    // optionally pass ts compiler options
    const compilerOptions: TJS.CompilerOptions = getTsCompilerOptions();

    // optionally pass a base path
    const basePath = __dirname;
    const pathsToTypes = [PATH_TO_JSON_REPORT_TYPES, PATH_TO_REPORT_TYPES];

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

export const jsonToJsonReport = function(jsonString: string): JsonReportDescriptor {
    // JSON.parse(jsonString, )
    const schemaGenerator = getJsonSchemaGenerator();
    const schema = schemaGenerator.getSchemaForSymbol(JSON_REPORT_DESCRIPTOR_NAME);

    const ajv = new Ajv();
    const validator = ajv.compile(schema);
    console.log("Test validate: ", validator(jsonString));
    return null;
}