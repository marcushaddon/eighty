"use strict";
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
exports.correctTypes = void 0;
var errors_1 = require("../errors");
var ValidatorProvider_1 = require("./ValidatorProvider");
// TODO: Put this in file specific to list validation/parsing
// TODO: This should be middleware
var correctTypes = function (query, resource, unknownFieldPolicy) {
    var _a;
    var validator = ValidatorProvider_1.ValidatorProvider.getValidator(resource);
    if (!validator) {
        return query;
    }
    var corrected = {};
    var _loop_1 = function (path) {
        var translated = dottedToSchemaPath(path, resource.name);
        var fieldType = (_a = validator.schemas[translated]) === null || _a === void 0 ? void 0 : _a.type;
        var converter = CONVERTERS[fieldType];
        if (!converter) {
            if (unknownFieldPolicy === 'reject') {
                throw new errors_1.BadRequestError("\n                Unable to filter on unknown field: " + path + ".\n                To filter on a field, it must be defined in the resources schema\n                ");
            }
            ;
            corrected[path] = query[path];
            return "continue";
        }
        var converted = applyConverter(converter, query[path]);
        if (converted !== null && typeof converted === 'object') {
            // TODO: This means the value is an 'operator' like [in] or [gte]
            // so we need to make sure this operator makes sense for the type
            Object.keys(converted).forEach(function (op) { return checkOpForType(op, fieldType); });
        }
        corrected[path] = converted;
    };
    // parse dotted paths into schema path style
    for (var path in query) {
        _loop_1(path);
    }
    return corrected;
};
exports.correctTypes = correctTypes;
var dottedToSchemaPath = function (dotted, resourceName) {
    return resourceName + "#/properties/" + dotted.split('.').join('/properties/');
};
var applyConverter = function (converter, val) {
    if (typeof val === 'string') {
        return converter(val);
    }
    else if (Array.isArray(val)) {
        return val.map(function (item) { return converter(item); });
    }
    else if (typeof val === 'object') {
        var keyVals = Object.entries(val)
            .map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], subVal = _b[1];
            return [key, applyConverter(converter, subVal)];
        });
        var converted_1 = {};
        keyVals.forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], val = _b[1];
            return converted_1[key] = val;
        });
        return converted_1;
    }
    else {
        // TODO: This should respect unknown field policy
        throw new Error("Unknown filter val type " + val);
    }
};
var CONVERTERS = {
    number: parseFloat,
    string: function (val) { return val.toString(); },
    array: function (val) { return val; }
    // TODO: additional types (float, etc)
};
var TYPE_OP_MAP = {
    string: new Set(['gt', 'gte', 'lt', 'lte', 'like', 'contains', 'in']),
    number: new Set(['gt', 'gte', 'lt', 'lte', 'in']),
    array: new Set(['contains']),
    // TODO: additional types (float, etc)
};
var checkOpForType = function (filter, fieldType) {
    if (!TYPE_OP_MAP[fieldType].has(filter)) {
        throw new errors_1.BadRequestError("Filter \"" + filter + "\" not applicable to field of type \"" + fieldType);
    }
};
