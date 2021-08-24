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
exports.OperationValidator = exports.UnknownFieldsPolicyValidator = exports.OperationNameValidator = void 0;
var rt = __importStar(require("runtypes"));
var authorization_1 = require("./authorization");
exports.OperationNameValidator = rt.Union(rt.Literal('list'), rt.Literal('getOne'), rt.Literal('create'), 
// rt.Literal('createOrReplace'),
rt.Literal('replace'), rt.Literal('update'), rt.Literal('delete'));
exports.UnknownFieldsPolicyValidator = rt.Union(rt.Literal('reject'), rt.Literal('allow'));
// TODO: Maybe need to manully handle illogical cominations of authentication + authorization
// Idea: instead of making them optional, make them union of their type | boolean
// and force them to opt out by supplying false!!
exports.OperationValidator = rt.Record({
    authentication: rt.Optional(rt.Boolean),
    authorization: rt.Optional(authorization_1.AuthorizationSchemaValidator),
    unknownFieldsPolicy: rt.Optional(exports.UnknownFieldsPolicyValidator)
});
