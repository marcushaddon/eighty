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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterBuilder = void 0;
var express_1 = __importDefault(require("express"));
var body_parser_1 = require("body-parser");
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var operations_1 = require("./const/operations");
var db_1 = require("./db/db");
var util_1 = require("./util");
var buildResourceSchemas_1 = require("./buildResourceSchemas");
var buildInitLoggerMW_1 = require("./logging/buildInitLoggerMW");
var buildCreateOp_1 = require("./ops/buildCreateOp");
var buildReplaceOp_1 = require("./ops/buildReplaceOp");
var buildupdateOp_1 = require("./ops/buildupdateOp");
var buildDeleteOp_1 = require("./ops/buildDeleteOp");
var buildGetOneOp_1 = require("./ops/buildGetOneOp");
var buildListOp_1 = require("./ops/buildListOp");
var ValidatorProvider_1 = require("./validation/ValidatorProvider");
var buildCreateValidator_1 = require("./validation/buildCreateValidator");
var auth_1 = require("./auth");
var buildPatchValidator_1 = require("./validation/buildPatchValidator");
var buildListValidator_1 = require("./validation/buildListValidator");
var authorization_1 = require("./auth/authorization");
var documentation_1 = require("./documentation");
var RouterBuilder = /** @class */ (function () {
    function RouterBuilder(schema) {
        this.schema = schema;
        this.built = false;
        this.preOpPlugins = {};
        this.postOpPlugins = {};
        this.db = db_1.resolveDbClient(schema.database);
    }
    /**
     * Creates routes and handlers to be registered on an Express router.
     */
    RouterBuilder.prototype.build = function () {
        var e_1, _a, e_2, _b;
        var _this = this;
        var resources = (this.schema.resources || []);
        try {
            // Register validators
            for (var resources_1 = __values(resources), resources_1_1 = resources_1.next(); !resources_1_1.done; resources_1_1 = resources_1.next()) {
                var resource = resources_1_1.value;
                if (!resource.schemaPath)
                    continue;
                var validator = buildResourceSchemas_1.loadValidator(resource);
                if (!validator)
                    continue;
                ValidatorProvider_1.ValidatorProvider.register(resource.schemaPath, validator);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (resources_1_1 && !resources_1_1.done && (_a = resources_1.return)) _a.call(resources_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        ;
        var resourceRoutes = resources
            .map(function (resource) { return _this.createRoutes(resource); });
        var flattened = resourceRoutes
            .reduce(function (acc, current) { return __spreadArray(__spreadArray([], __read(acc)), __read(current)); });
        var docs = this.buildDocs(this.schema);
        var docsRouteHandlers = [{
                method: 'use',
                route: '/docs',
                handler: swagger_ui_express_1.default.serve,
            }, {
                method: 'get',
                route: '/api.json',
                handler: [function (_, res) { return res.json(docs).end(); }]
            }, {
                method: 'get',
                route: '/docs',
                handler: [swagger_ui_express_1.default.setup(docs)]
            }];
        var withDocs = __spreadArray(__spreadArray([], __read(flattened)), __read(docsRouteHandlers));
        var router = express_1.default();
        router.use(body_parser_1.json());
        try {
            for (var withDocs_1 = __values(withDocs), withDocs_1_1 = withDocs_1.next(); !withDocs_1_1.done; withDocs_1_1 = withDocs_1.next()) {
                var _c = withDocs_1_1.value, route = _c.route, handler = _c.handler, method = _c.method;
                router[method].apply(router, __spreadArray([route], __read(handler)));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (withDocs_1_1 && !withDocs_1_1.done && (_b = withDocs_1.return)) _b.call(withDocs_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // TODO: make this lazy
        var init = this.db.connect.bind(this.db);
        var tearDown = this.db.disconnect.bind(this.db);
        this.built = true;
        return { router: router, init: init, tearDown: tearDown };
    };
    ;
    /**
     * Creates default get/CRUD routes for a resource,
     * overriding routes/behaviors with those specified in
     * schema where specified.
     */
    RouterBuilder.prototype.createRoutes = function (resource) {
        // const specifiedOps = Object.keys(resource.operations || [] as string[]);
        var _this = this;
        var routes = resource.operations ? (Object.keys(resource.operations).map(function (op) { return _this.buildRoute(op, resource); })) : [];
        return routes;
    };
    ;
    /**
     * Builds a route by assembling default middlewares, overriding
     * modifying, or omitting each middleware where specified.
     */
    RouterBuilder.prototype.buildRoute = function (op, resource) {
        var _a, _b, _c;
        var middlewares = [];
        var operationConfig = (_a = resource.operations) === null || _a === void 0 ? void 0 : _a[op];
        var initLoggerMW = buildInitLoggerMW_1.buildInitLoggerMiddleware(resource, op);
        middlewares.push(initLoggerMW);
        if (operationConfig === null || operationConfig === void 0 ? void 0 : operationConfig.authentication) {
            middlewares.push(auth_1.ensureAuthenticated);
        }
        if (operationConfig === null || operationConfig === void 0 ? void 0 : operationConfig.authorization) {
            var authorizationMW = authorization_1.buildAuthorization(resource, operationConfig.authorization);
            middlewares.push(authorizationMW);
        }
        var preOpPlugins = (_b = this.preOpPlugins[resource.name]) === null || _b === void 0 ? void 0 : _b[op];
        if (preOpPlugins) {
            preOpPlugins.forEach(function (pi) { return middlewares.push(pi); });
        }
        if (resource.schemaPath) {
            var validationBuilder = getValidationBuilder(op);
            var validationMW = validationBuilder(resource);
            middlewares.push(validationMW);
        }
        var opBuilder = getOpBuilder(op);
        var opMW = opBuilder({
            resource: resource,
            db: this.db,
        });
        middlewares.push(opMW);
        // TODO: rename to plugin
        var postOpPlugins = (_c = this.postOpPlugins[resource.name]) === null || _c === void 0 ? void 0 : _c[op];
        if (postOpPlugins) {
            postOpPlugins.forEach(function (pi) { return middlewares.push(pi); });
        }
        // Finisher
        middlewares.push(function (req, res) {
            var status = req.status || 500;
            var resource = req.resource;
            var error = req.error;
            if (error) {
                req.logger.error("Encountered error performing " + op + " on " + resource.name, error);
                return res.status(status).json(error).end();
            }
            req.logger.info("Successfully completed \"" + op + "\" on resource \"" + resource.name + "\"");
            return res.status(status).json(resource).end();
        });
        var expressRoute = util_1.getRoute(op, resource).expressRoute;
        return {
            route: expressRoute,
            method: operations_1.opMethods[op],
            handler: middlewares
        };
    };
    RouterBuilder.prototype.buildDocs = function (schema) {
        return documentation_1.buildDocs(schema);
    };
    RouterBuilder.prototype.registerPlugin = function (pluginMap, resourceName, op, pi) {
        if (this.built) {
            throw new Error('Invalid use of RouterBuilder fluent API: Op middleware plugins must be registered before calling "build()"');
        }
        if (!pluginMap[resourceName])
            pluginMap[resourceName] = {};
        if (!pluginMap[resourceName][op])
            pluginMap[resourceName][op] = [];
        pluginMap[resourceName][op].push(pi);
    };
    RouterBuilder.prototype.resources = function (resourceName) {
        var resource = this.schema.resources.find(function (rec) { return rec.name === resourceName; });
        if (typeof resource === 'undefined') {
            throw new Error("Eighty: unknown resource: " + resourceName);
        }
        var self = this;
        return {
            ops: function (op) {
                if (!resource.operations || !(op in resource.operations)) {
                    throw new Error("Error registering op plugin, operation " + op + " not specified for resource \"" + resource.name + "\"");
                }
                var subscriber = {};
                subscriber.beforeOp = function (plugin) {
                    self.registerPlugin(self.preOpPlugins, resourceName, op, plugin);
                    return subscriber;
                };
                // TODO: rename onSuccess -> something like 'afterQuery/Op' or something
                subscriber.onSuccess = function (plugin) {
                    self.registerPlugin(self.postOpPlugins, resourceName, op, plugin);
                    return subscriber;
                };
                return subscriber;
            }
        };
    };
    return RouterBuilder;
}());
exports.RouterBuilder = RouterBuilder;
// TODO: move these to ops/
var noOpBuilder = function () {
    var noop = function (req, res) {
        res.status(404).end();
    };
    return noop;
};
var getOpBuilder = function (op) {
    var builders = {
        list: buildListOp_1.buildListOp,
        getOne: buildGetOneOp_1.buildGetOneOp,
        create: buildCreateOp_1.buildCreateOp,
        replace: buildReplaceOp_1.buildReplaceOp,
        update: buildupdateOp_1.buildUpdateOp,
        delete: buildDeleteOp_1.buildDeleteOp,
    };
    return builders[op] || noOpBuilder;
};
var noValidationBuilder = function () {
    var noValidation = function (req, res, next) {
        next();
    };
    return noValidation;
};
// TODO: Move this to validation/
var getValidationBuilder = function (op) {
    var builders = {
        list: buildListValidator_1.buildListValidationMiddleware,
        create: buildCreateValidator_1.buildCreateValidationMiddleware,
        replace: buildCreateValidator_1.buildCreateValidationMiddleware,
        update: buildPatchValidator_1.buildPatchValidationMiddleware
    };
    return builders[op] || noValidationBuilder;
};
