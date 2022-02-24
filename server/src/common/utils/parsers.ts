import { JsonReportDescriptor } from "common/definitions/json_report";

// https://github.com/YousefED/typescript-json-schema
import * as TJS from 'typescript-json-schema';
import { JSON_REPORT_TYPE, PATH_TO_JSON_REPORT_TYPES, PATH_TO_REPORT_TYPES } from "./constants";

const getJsonSchemaGenerator = () => {
    // optionally pass ts compiler options
    const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
    };

    // optionally pass a base path
    const basePath = "./";
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
    const schema = schemaGenerator.getSchemaForSymbol(JSON_REPORT_TYPE);
    console.log(schema);
    return null;
}