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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSchema = exports.loadValidator = void 0;
var fs = __importStar(require("fs"));
var yaml = __importStar(require("yaml"));
var jsonschema_1 = __importDefault(require("jsonschema"));
var TJS = __importStar(require("typescript-json-schema"));
var loadValidator = function (resource) {
    var validator = new jsonschema_1.default.Validator();
    var schema = exports.loadSchema(resource);
    validator.addSchema(schema, resource.name);
    return validator;
};
exports.loadValidator = loadValidator;
var loadSchema = function (resource) {
    if (!resource.schemaPath)
        return;
    var schema;
    if (resource.schemaPath.endsWith('.yaml') || resource.schemaPath.endsWith('.yml')) {
        schema = loadYAMLSchema(resource.schemaPath);
    }
    else if (resource.schemaPath.endsWith('.ts')) {
        schema = loadTSSchema(resource);
    }
    else {
        throw new Error('Unsuported resource schema type');
    }
    return schema;
};
exports.loadSchema = loadSchema;
var loadYAMLSchema = function (path) {
    var file = fs.readFileSync(path).toString();
    var parsed = yaml.parse(file);
    return parsed;
};
var memos = {};
var loadTSSchema = function (resource) {
    if (!resource.schemaPath)
        return {};
    var typeName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
    if (memos[resource.schemaPath])
        return memos[resource.schemaPath];
    var program = TJS.getProgramFromFiles([resource.schemaPath]);
    var schema = TJS.generateSchema(program, typeName, { required: true });
    if (!schema) {
        throw new Error("Unable to parse schema for resource " + resource.name + " from Typescript file " + resource.schemaPath);
    }
    memos[resource.schemaPath] = schema;
    return schema;
};
