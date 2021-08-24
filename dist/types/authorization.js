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
exports.AuthorizationSchemaValidator = exports.AuthorizationMethodValidator = exports.OwnershipAuthorizationValidator = exports.IdentityAuthorizationValidator = exports.RoleAuthorizationValidator = exports.GroupAuthorizationValidator = void 0;
var rt = __importStar(require("runtypes"));
exports.GroupAuthorizationValidator = rt.Record({
    type: rt.Literal("inGroup"),
    group: rt.String
});
exports.RoleAuthorizationValidator = rt.Record({
    type: rt.Literal("hasRole"),
    role: rt.String
});
exports.IdentityAuthorizationValidator = rt.Record({
    type: rt.Literal("isResource")
});
exports.OwnershipAuthorizationValidator = rt.Record({
    type: rt.Literal("isOwner"),
    ownerField: rt.Optional(rt.String),
});
exports.AuthorizationMethodValidator = rt.Union(exports.GroupAuthorizationValidator, exports.RoleAuthorizationValidator, exports.IdentityAuthorizationValidator, exports.IdentityAuthorizationValidator, exports.OwnershipAuthorizationValidator);
// TODO: need to manually enforce that one and only one is present
exports.AuthorizationSchemaValidator = rt.Record({
    allOf: rt.Optional(rt.Array(exports.AuthorizationMethodValidator).withConstraint(function (val) { return val.length > 0; })),
    anyOf: rt.Optional(rt.Array(exports.AuthorizationMethodValidator).withConstraint(function (val) { return val.length > 0; })),
});
