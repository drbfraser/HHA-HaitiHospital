"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_REPORT_DESCRIPTOR_NAME = exports.ItemType = void 0;
const ts_simple_nameof_1 = require("ts-simple-nameof");
var ItemType;
(function (ItemType) {
    // SA = "short answer",
    ItemType["NUMERIC"] = "numeric";
    // YN = "yes no",
    // MCQ = "mcq",
    // PO = "pick one",
    // MCQ_OPTION = "mcq option",
    ItemType["SUM"] = "sum";
    ItemType["EQUAL"] = "equal";
    ItemType["GROUP"] = "group";
    // SG = "survey generator"
})(ItemType = exports.ItemType || (exports.ItemType = {}));
exports.JSON_REPORT_DESCRIPTOR_NAME = (0, ts_simple_nameof_1.nameof)((o) => o.JsonReportDescriptor);
