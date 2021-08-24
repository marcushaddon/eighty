"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var operations_1 = require("./const/operations");
var db_1 = require("./db/db");
var util_1 = require("./util");
var buildResourceSchemas_1 = require("./buildResourceSchemas");
var buildInitLoggerMW_1 = require("./logging/buildInitLoggerMW");
var buildCreateOp_1 = require("./ops/buildCreateOp");
var buildReplaceOp_1 = require("./ops/buildReplaceOp");
var buildUpdateOp_1 = require("./ops/buildUpdateOp");
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
        this.successCallbacks = {};
        this.db = db_1.resolveDbClient(schema.database);
    }
    /**
     * Creates routes and handlers to be registered on an Express router.
     */
    RouterBuilder.prototype.createRoutesAndHandlers = function () {
        var e_1, _a;
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
        var docsRouteHandlers = [{
                method: 'use',
                route: '/docs',
                handler: swagger_ui_express_1.default.serve,
            }, {
                method: 'get',
                route: '/docs',
                handler: [swagger_ui_express_1.default.setup(this.buildDocs(this.schema))]
            }];
        var withDocs = __spreadArray(__spreadArray([], __read(flattened)), __read(docsRouteHandlers));
        // TODO: make this lazy
        var init = this.db.connect.bind(this.db);
        var tearDown = this.db.disconnect.bind(this.db);
        return { routesAndHandlers: withDocs, init: init, tearDown: tearDown };
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
        var _a;
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
        var self = this;
        middlewares.push(function maybeRunCallbacks(req, res) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var _b, error, opResource, logger, callbacks, _c;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = req, error = _b.error, opResource = _b.resource, logger = _b.logger;
                            if (!error) return [3 /*break*/, 1];
                            logger.error("Encountered error performing " + op + " on " + resource.name, error);
                            return [3 /*break*/, 4];
                        case 1:
                            logger.info("Successfully performed " + op + " on " + resource.name);
                            callbacks = (_a = self.successCallbacks[resource.name]) === null || _a === void 0 ? void 0 : _a[op];
                            _c = callbacks;
                            if (!_c) return [3 /*break*/, 3];
                            return [4 /*yield*/, Promise.all(callbacks.map(function (cb) { return __awaiter(_this, void 0, void 0, function () {
                                    var e_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, cb(req, res)];
                                            case 1:
                                                _a.sent();
                                                return [3 /*break*/, 3];
                                            case 2:
                                                e_2 = _a.sent();
                                                logger.error("Encountered error while running success callback: " + (cb.name || 'anonymous function'), e_2);
                                                return [3 /*break*/, 3];
                                            case 3:
                                                logger.info("Successfully ran callback: " + (cb.name || 'anonymous function'));
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 2:
                            _c = (_d.sent());
                            _d.label = 3;
                        case 3:
                            _c;
                            _d.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
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
    RouterBuilder.prototype.registerSuccessCallback = function (resourceName, op, cb) {
        if (!this.successCallbacks[resourceName])
            this.successCallbacks[resourceName] = {};
        if (!this.successCallbacks[resourceName][op])
            this.successCallbacks[resourceName][op] = [];
        this.successCallbacks[resourceName][op].push(cb);
    };
    RouterBuilder.prototype.registerFailureCallback = function (resourceName, op, cb) {
        // TODO: Register + add final middleware to appropriate route that runs all registered callbacks
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
        update: buildUpdateOp_1.buildUpdateOp,
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
