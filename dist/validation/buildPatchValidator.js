"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPatchValidator = exports.buildPatchValidationMiddleware = void 0;
var jsonschema_1 = require("jsonschema");
var fast_json_patch_1 = require("fast-json-patch");
var ValidatorProvider_1 = require("./ValidatorProvider");
var buildPatchValidationMiddleware = function (resource) {
    var _a, _b;
    var validator = ValidatorProvider_1.ValidatorProvider.getValidator(resource);
    var patchValidator;
    if (validator) {
        patchValidator = exports.buildPatchValidator(validator, (_b = (_a = resource.operations) === null || _a === void 0 ? void 0 : _a.update) === null || _b === void 0 ? void 0 : _b.unknownFieldsPolicy);
    }
    var validatePatchRequest = function (req, res, next) {
        var patchError = fast_json_patch_1.validate(req.body);
        if (patchError) {
            req.logger.error('Patch operation failed validation', patchError);
            return res.status(400)
                .send({ message: patchError.message })
                .end();
        }
        // Validate patch body specifically for resource if schema provided
        if (patchValidator) {
            var problems = patchValidator(req.body);
            if (problems.length > 0) {
                req.logger.error('Patch operation failed validation for resource schema', { problems: problems });
                return res.status(400)
                    .json({ message: 'Bad request: ' + problems.join('\n') });
            }
        }
        next();
    };
    return validatePatchRequest;
};
exports.buildPatchValidationMiddleware = buildPatchValidationMiddleware;
var buildPatchValidator = function (validator, unknownFieldsPolicy) {
    var e_1, _a;
    if (unknownFieldsPolicy === void 0) { unknownFieldsPolicy = 'reject'; }
    var knownPaths = {};
    try {
        for (var _b = __values(Object.entries(validator.schemas)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), path = _d[0], schema = _d[1];
            var stripped = path.replace(/^\w+#/i, '');
            var deflated = stripped.replace(/\/properties/g, '');
            var clonedSchema = JSON.parse(JSON.stringify(schema));
            delete clonedSchema.required;
            knownPaths[deflated] = clonedSchema;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return function (patches) {
        var e_2, _a, e_3, _b;
        var problems = [];
        try {
            for (var patches_1 = __values(patches), patches_1_1 = patches_1.next(); !patches_1_1.done; patches_1_1 = patches_1.next()) {
                var _c = patches_1_1.value, op = _c.op, path = _c.path, value = _c.value;
                if (!(path in knownPaths)) {
                    if (unknownFieldsPolicy === 'reject') {
                        problems.push("Unknown path: " + path + ". Only known paths may be updated.");
                    }
                    continue;
                }
                var schema = knownPaths[path];
                var result = jsonschema_1.validate(value, schema);
                try {
                    for (var _d = (e_3 = void 0, __values(result.errors)), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var res = _e.value;
                        problems.push([path, res.path].join('/').replace(/\/$/, '') + " " + res.message);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (patches_1_1 && !patches_1_1.done && (_a = patches_1.return)) _a.call(patches_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return problems;
    };
};
exports.buildPatchValidator = buildPatchValidator;
