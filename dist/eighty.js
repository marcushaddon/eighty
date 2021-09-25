"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eighty = exports.parseSchema = exports.readFile = void 0;
var fs = __importStar(require("fs"));
var yaml = __importStar(require("yaml"));
var schema_1 = require("./types/schema");
var RouterBuilder_1 = require("./RouterBuilder");
var readFile = function (fp) { return fs.readFileSync(fp).toString(); };
exports.readFile = readFile;
var parseSchema = function (contents) {
    var parsed = yaml.parse(contents);
    return schema_1.EightySchemaValidator.check(parsed);
};
exports.parseSchema = parseSchema;
var eighty = function (opts) {
    var schema;
    if (opts.schema) {
        schema = opts.schema;
    }
    else if (opts.schemaRaw) {
        schema = exports.parseSchema(opts.schemaRaw);
    }
    else if (opts.schemaPath) {
        var contents = exports.readFile(opts.schemaPath);
        schema = exports.parseSchema(contents);
    }
    else {
        throw new Error('One of schema | schemaRaw | schema path is required');
    }
    var routerBuilder = new RouterBuilder_1.RouterBuilder(schema);
    // const devChecklist = buildChecklist(schema);
    // console.table(devChecklist);
    return routerBuilder;
};
exports.eighty = eighty;
