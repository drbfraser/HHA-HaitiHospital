import { JsonReportDescriptor, JSON_REPORT_DESCRIPTOR_NAME} from "common/definitions/json_report";

// https://github.com/YousefED/typescript-json-schema
import * as TJS from 'typescript-json-schema';
import { PATH_TO_JSON_REPORT_TYPES } from "./constants";

import Ajv, { JSONSchemaType } from 'ajv';
import fs from 'fs';
import path from 'path';
import standaloneCode from 'ajv/dist/standalone';
let validations;

import ts from 'typescript';

const getTsCompilerOptions = function(): {} {
    try {
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
    catch (e) {
        throw new Error(e);
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
        // Todo: set schema id with "id": string
    };

    const generator = TJS.buildGenerator(program, settings);
    if (!generator) 
        throw new Error("failed to build a json schema generator");

    return generator;
}

const getSchemaId = (objectName: string): string => {
    return `#/definitions/${objectName}`;
}

const initAjvAsStandAlone = function() {
    const schemaGenerator = getSchemaGenerator();
    const schema = schemaGenerator!.getSchemaForSymbol(JSON_REPORT_DESCRIPTOR_NAME);

    let x: JSONSchemaType<JsonReportDescriptor>;

    console.log(schema);
    schema["$id"] = getSchemaId(JSON_REPORT_DESCRIPTOR_NAME);
    
    const ajv = new Ajv(
        {code: {source: true},
        schemas: [schema]}
    );
    let moduleCode = standaloneCode(ajv);
    fs.writeFileSync(path.join(__dirname, "consume/validate-cjs.js"), moduleCode);
    validations = require('./consume/validate-cjs');
}

export const cleanupAjvStandAlone = function() {
    try {
        fs.unlinkSync(path.join(__dirname, "consume/validate-cjs.js"));
    } catch (e) {
        throw new Error(`Clean Ajv StandAlone failed: ${e}`)
    }

}

const validateJsonString = function(jsonString: string, objectName: string) {
    if (!validations) {
        throw new Error("Init Ajv validator first");
    }
    const validator = validations[getSchemaId(objectName)];
    const valid = validator(JSON.parse(jsonString));

    if (valid === false) {
        throw new Error(`${validator.errors}`);
    }
}

const jsonStringToJsonReport = function(jsonString: string) : JsonReportDescriptor {
    validateJsonString(jsonString, JSON_REPORT_DESCRIPTOR_NAME); 
    const jsonReport: JsonReportDescriptor = JSON.parse(jsonString);
    return jsonReport;
}

export {jsonStringToJsonReport, initAjvAsStandAlone};