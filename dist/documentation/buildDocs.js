"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDocs = void 0;
var operations_1 = require("../const/operations");
var util_1 = require("../util");
var buildResourceSchemas_1 = require("../buildResourceSchemas");
var buildDocs = function (schema) {
    var baseDoc = {
        openapi: '3.0.0',
        info: {
            title: schema.name || 'CRUD API',
            version: '1.2.3'
        },
        paths: buildPaths(schema.resources)
    };
    return baseDoc;
};
exports.buildDocs = buildDocs;
var buildPaths = function (resources) {
    var e_1, _a, _b;
    var paths = resources.map(function (resource) {
        if (!resource.operations)
            return [];
        return Object.entries(resource.operations)
            .map(function (_a) {
            var _b = __read(_a, 2), op = _b[0], config = _b[1];
            return buildPath(op, config, resource);
        });
    }).reduce(function (acc, current) { return __spreadArray(__spreadArray([], __read(acc)), __read(current)); }, []);
    var pathsObj = {};
    try {
        for (var paths_1 = __values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
            var path = paths_1_1.value;
            var description = path.description, responses = path.responses, parameters = path.parameters;
            var methodObj = {
                description: description,
                responses: responses,
                parameters: parameters,
            };
            if (!pathsObj[path.route]) {
                pathsObj[path.route] = (_b = {},
                    _b[path.method] = methodObj,
                    _b);
            }
            else {
                pathsObj[path.route][path.method] = methodObj;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    ;
    return pathsObj;
};
var buildPath = function (op, opConfig, resource) {
    var _a, e_2, _b;
    var _c = util_1.getRoute(op, resource), openApiRoute = _c.openApiRoute, openApiParams = _c.openApiParams;
    var queryParamTemplates = op === 'list' ? buildListParams(resource) : [];
    var queryParams = queryParamTemplates.map(function (template) { return ({
        in: template.in,
        name: template.name,
        description: fmt(template.descriptionTemplate, op, resource, { field: template.name }),
        example: fmt(template.exampleTemplate, op, resource, { field: template.name }),
    }); });
    var _d = opMap[op], descriptionTemplate = _d.descriptionTemplate, successStatus = _d.successStatus;
    var method = operations_1.opMethods[op];
    var description = fmt(descriptionTemplate, op, resource);
    var authDescriptionTemplate = buildAuthDescriptionTemplate(opConfig);
    var authDescription = fmt(authDescriptionTemplate, op, resource);
    var successContent = successStatus.getContent(resource);
    var successDescription = fmt(successStatus.descriptionTemplate, op, resource);
    var stati = (_a = {},
        _a[successStatus.status] = {
            description: successDescription,
            content: {
                'application/json': { schema: successContent },
            },
        },
        _a);
    try {
        for (var errors_1 = __values(errors), errors_1_1 = errors_1.next(); !errors_1_1.done; errors_1_1 = errors_1.next()) {
            var error = errors_1_1.value;
            stati[error.status] = {
                description: fmt(error.descriptionTemplate, op, resource)
            };
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (errors_1_1 && !errors_1_1.done && (_b = errors_1.return)) _b.call(errors_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    ;
    var parameters = openApiParams.map(function (p) {
        return __assign(__assign({}, p), { description: fmt(p.descriptionTemplate, op, resource) });
    });
    var allParams = __spreadArray(__spreadArray([], __read(parameters)), __read(queryParams));
    return {
        method: method,
        route: openApiRoute,
        parameters: allParams,
        description: description + authDescription,
        responses: stati,
    };
};
var buildAuthDescriptionTemplate = function (op) {
    var template = ' ';
    if (op.authentication || op.authorization) {
        template += 'Authentication required.';
    }
    if (op.authorization) {
        var _a = op.authorization, allOf = _a.allOf, anyOf = _a.anyOf;
        var requirements = (allOf || anyOf)
            .map(function (config) {
            switch (config.type) {
                case 'hasRole':
                    return "have the role '" + config.role + "'";
                case 'inGroup':
                    return "belong to user group '" + config.group + "'";
                case 'isResource':
                    return 'be the <resource> in question';
                case 'isOwner':
                    return 'be the owner of the <resource>';
                default:
                    throw new Error("Unknown authorization type: " + config.type);
            }
        });
        if (requirements.length === 1) {
            template += " Additionally, the user making the request must " + requirements[0] + ".";
        }
        else {
            var level = allOf ? 'all' : 'at least one';
            var condition = allOf ? 'and' : 'or';
            template += " Additionally, the user making the request must meet " + level + " of the following requirements: ";
            template += requirements
                .slice(0, requirements.length - 1)
                .join(', ');
            template += ", " + condition + " " + requirements[requirements.length - 1] + ".";
        }
    }
    return template;
};
var maybeGetSchema = function (resource) {
    return resource.schemaPath && buildResourceSchemas_1.loadSchema(resource) || {};
};
var getPaginatedVersion = function (schema) { return ({
    type: 'object',
    properties: {
        total: {
            type: 'number',
        },
        results: {
            type: 'array',
            items: schema,
        }
    },
    required: ['total', 'results']
}); };
var buildPatchOpSchema = function () {
    return {
        type: "array",
        items: {
            type: "object",
            properties: {
                op: {
                    type: "string",
                    enum: ["add", "remove", "replace", "copy"],
                },
                path: { type: "string" },
                from: { type: "string" },
                value: { type: "any" },
            },
            required: ["op", "path"]
        }
    };
};
// TODO: This is where its broken
var buildListParams = function (resource) {
    var irrelevant = new Set(['required', 'object', 'properties', 'type', '$schema', '']);
    // TODO: Figure out valid filter params based on resource
    if (!resource.schemaPath)
        return [];
    var schema = buildResourceSchemas_1.loadSchema(resource);
    var paths = util_1.printAllPaths(schema);
    var relevantPaths = paths
        .filter(function (path) { return (path.indexOf('required') === -1 &&
        path[path.length - 1] !== 'object' &&
        path[0] !== '$schema'); });
    var params = relevantPaths
        .map(function (path) { return path
        .map(function (part) { return part === 'items' && '[i]' || part; })
        .filter(function (part) { return !irrelevant.has(part); })
        .slice(0, -1)
        .join('.'); });
    var types = relevantPaths.map(function (p) { return p[p.length - 1]; });
    var filters = params
        .map(function (param, i) {
        var typeForParam = types[i];
        var ops = queryTypeOperatorsTemplates[typeForParam];
        return ops.map(function (_a) {
            var descTemplate = _a.descTemplate, exampleTemplate = _a.exampleTemplate, op = _a.op;
            return ({
                in: 'query',
                name: param + (op === '=' ? '' : "[" + op + "]"),
                descriptionTemplate: descTemplate,
                exampleTemplate: exampleTemplate,
            });
        });
    }).reduce(function (acc, curr) { return __spreadArray(__spreadArray([], __read(acc)), __read(curr)); }, []);
    return filters;
};
var equalQueryParam = function (t) { return ({
    op: '=',
    descTemplate: 'filters for records where <field> equals given value',
    exampleTemplate: "?<field>=" + (t === 'string' && 'foo' || t === 'number' && '7' || t === 'boolean' && 'true' || 'TODO')
}); };
var queryTypeOperatorsTemplates = {
    number: __spreadArray([equalQueryParam('number'), {
            op: '[in]',
            descTemplate: 'filters for records where <field> in values',
            exampleTemplate: '?<field>[in]=3&<field>[in]=5',
        }], __read([['gt', 'greater than'], ['lt', 'less than'], ['gte', 'greater than or equal to'], ['lte', 'less than or equal to']].map(function (_a) {
        var _b = __read(_a, 2), op = _b[0], desc = _b[1];
        return ({
            op: "[" + op + "]",
            descTemplate: "filters for records where <field> " + desc + " given value",
            exampleTemplate: "?<field>=10"
        });
    }))),
    string: __spreadArray(__spreadArray([equalQueryParam('string'), {
            op: '[in]',
            descTemplate: 'filters for records where <field> in values',
            exampleTemplate: '?<field>[in]=3&<field>[in]=5',
        }], __read([['gt', 'comes after'], ['lt', 'comes before'], ['gte', 'comes after or the same as'], ['lte', 'comes before or the same as']].map(function (_a) {
        var _b = __read(_a, 2), op = _b[0], desc = _b[1];
        return ({
            op: "[" + op + "]",
            descTemplate: "filters for records where <field> " + desc + " given value",
            exampleTemplate: "?<field>=aab"
        });
    }))), [{
            op: '[likeTODO]',
            descTemplate: 'filters for records where <field> matches given pattern',
            exampleTemplate: '?<field>=t*do'
        }]),
    array: [{
            op: '[containsTODO]',
            descTemplate: 'filters for records where <field> contains given value',
            exampleTemplate: '?<field>=foo'
        }],
    boolean: [equalQueryParam('boolean')],
};
var opMap = {
    getOne: {
        descriptionTemplate: "Fetches one <resource>.",
        successStatus: {
            status: 200,
            descriptionTemplate: "Successfully fetched a <resource>.",
            getContent: maybeGetSchema
        },
    },
    list: {
        descriptionTemplate: "Lists <resource>s.",
        successStatus: {
            status: 200,
            descriptionTemplate: "Successfully listed <resource>s.",
            getContent: function (resource) { return getPaginatedVersion(maybeGetSchema(resource)); },
        }
    },
    create: {
        descriptionTemplate: "Creates a new <resource>.",
        successStatus: {
            status: 201,
            descriptionTemplate: "Successfully created a <resource>.",
            getContent: maybeGetSchema,
        }
    },
    replace: {
        descriptionTemplate: "Replaces one <resource>.",
        successStatus: {
            status: 200,
            descriptionTemplate: "Successfully replaced <resource>.",
            getContent: maybeGetSchema,
        }
    },
    update: {
        descriptionTemplate: "Makes JSON Patch update to one <resource>.",
        successStatus: {
            status: 200,
            descriptionTemplate: "Successfully updated <resource>.",
            getContent: function (resource) { return buildPatchOpSchema(); },
        }
    },
    delete: {
        descriptionTemplate: "Deletes one <resource>.",
        successStatus: {
            status: 200,
            descriptionTemplate: "Successfully fetched a <resource>.",
            getContent: function (resource) { return undefined; },
        }
    },
};
var errors = [
    {
        status: 404,
        descriptionTemplate: "Unable to find <resource>.",
    },
    {
        status: 401,
        descriptionTemplate: "Unauthenticated users are not allowed to <op> <resource>s."
    },
    {
        status: 403,
        descriptionTemplate: "User is not authorized to <op> this <resource>."
    },
    {
        status: 500,
        descriptionTemplate: "We encountered an internal error."
    }
];
var fmt = function (template, op, resource, dict) {
    var opsAndNames = template
        .replace(/<resource>/g, resource.name)
        .replace(/<op>/g, util_1.friendlyOpNames[op]);
    if (!dict)
        return opsAndNames;
    Object.entries(dict)
        .forEach(function (_a) {
        var _b = __read(_a, 2), from = _b[0], to = _b[1];
        var exp = new RegExp("<" + from + ">", 'g');
        opsAndNames = opsAndNames
            .replace(exp, to);
    });
    return opsAndNames;
};
