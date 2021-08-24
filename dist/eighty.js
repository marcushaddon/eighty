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
exports.eighty = exports.parseSchema = exports.readFile = void 0;
var fs = __importStar(require("fs"));
var yaml = __importStar(require("yaml"));
var body_parser_1 = require("body-parser");
var express_1 = __importDefault(require("express"));
var schema_1 = require("./types/schema");
var RouterBuilder_1 = require("./RouterBuilder");
var documentation_1 = require("./documentation");
var readFile = function (fp) { return fs.readFileSync(fp).toString(); };
exports.readFile = readFile;
var parseSchema = function (contents) {
    var parsed = yaml.parse(contents);
    return schema_1.EightySchemaValidator.check(parsed);
};
exports.parseSchema = parseSchema;
var eighty = function (opts) {
    var e_1, _a;
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
    var _b = routerBuilder.createRoutesAndHandlers(), routesAndHandlers = _b.routesAndHandlers, init = _b.init, tearDown = _b.tearDown;
    var router = express_1.default();
    router.use(body_parser_1.json());
    var middlewareReport = [];
    try {
        for (var routesAndHandlers_1 = __values(routesAndHandlers), routesAndHandlers_1_1 = routesAndHandlers_1.next(); !routesAndHandlers_1_1.done; routesAndHandlers_1_1 = routesAndHandlers_1.next()) {
            var _c = routesAndHandlers_1_1.value, route = _c.route, handler = _c.handler, method = _c.method;
            middlewareReport.push([method, route, handler.map(function (h) { return h.name; }).join('->')]);
            router[method].apply(router, __spreadArray([route], __read(handler)));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (routesAndHandlers_1_1 && !routesAndHandlers_1_1.done && (_a = routesAndHandlers_1.return)) _a.call(routesAndHandlers_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // This should maybe happen after registering 'plugins'
    console.table(middlewareReport);
    var devChecklist = documentation_1.buildChecklist(schema);
    console.table(devChecklist);
    var resourceFinder = function (resourceName) {
        var resource = schema.resources.find(function (rec) { return rec.name === resourceName; });
        if (typeof resource === 'undefined') {
            throw new Error("Eighty: unknown resource: " + resourceName);
        }
        return {
            ops: function (op) {
                if (!resource.operations || !(op in resource.operations)) {
                    throw new Error("Error registering op callback, operation " + op + " not specified for resource \"" + name + "\"");
                }
                var subscriber = {};
                subscriber.onSuccess = function (cb) {
                    routerBuilder.registerSuccessCallback(resourceName, op, cb);
                    return subscriber;
                };
                subscriber.onFailure = function (cb) {
                    routerBuilder.registerFailureCallback(resourceName, op, cb);
                    return subscriber;
                };
                return subscriber;
            }
        };
    };
    router.resources = resourceFinder;
    return {
        init: init,
        tearDown: tearDown,
        router: router
    };
};
exports.eighty = eighty;
