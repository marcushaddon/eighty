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
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateFilters = exports.MongoDbClient = void 0;
var mongodb_1 = require("mongodb");
var fast_json_patch_1 = require("fast-json-patch");
var errors_1 = require("../errors");
var ValidatorProvider_1 = require("../validation/ValidatorProvider");
var MongoDbClient = /** @class */ (function () {
    function MongoDbClient() {
        this.connected = false;
        this.connString = process.env['MONGO_URL'];
        this.dbName = process.env['MONGODB_DB_NAME'] || 'local';
        if (!this.connString)
            throw new Error('MongoDb was specified as database, but no connection string was found in environment (MONGO_URL)');
    }
    MongoDbClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.connected)
                            return [2 /*return*/];
                        _a = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(process.env.MONGO_URL)];
                    case 1:
                        _a.mongo = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.mongo.db(this.dbName)];
                    case 2:
                        _b.db = _c.sent();
                        this.connected = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDbClient.prototype.disconnect = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.mongo) === null || _a === void 0 ? void 0 : _a.close(true))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDbClient.prototype.list = function (_a) {
        var _b;
        var resource = _a.resource, _c = _a.skip, skip = _c === void 0 ? 0 : _c, _d = _a.count, count = _d === void 0 ? 20 : _d, sort = _a.sort, _e = _a.order, order = _e === void 0 ? 'ASC' : _e, _f = _a.filters, filters = _f === void 0 ? {} : _f;
        return __awaiter(this, void 0, void 0, function () {
            var translatedFilters, baseQuery, orderParam, res, all, transformed, total;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _h.sent();
                        translatedFilters = exports.translateFilters(filters);
                        baseQuery = (_b = this.db) === null || _b === void 0 ? void 0 : _b.collection(resource.name + 's').find(translatedFilters);
                        if (sort) {
                            orderParam = order === 'ASC' ? 1 : -1;
                            baseQuery = baseQuery === null || baseQuery === void 0 ? void 0 : baseQuery.sort((_g = {}, _g[sort] = orderParam, _g));
                        }
                        return [4 /*yield*/, baseQuery
                                .skip(skip)
                                .limit(count)];
                    case 2:
                        res = _h.sent();
                        return [4 /*yield*/, (res === null || res === void 0 ? void 0 : res.toArray())];
                    case 3:
                        all = _h.sent();
                        transformed = (all || []).map(function (r) {
                            var niceId = __assign(__assign({}, r), { id: r._id.toString() });
                            delete niceId._id;
                            return niceId;
                        });
                        return [4 /*yield*/, baseQuery.count()];
                    case 4:
                        total = _h.sent();
                        return [2 /*return*/, {
                                total: total,
                                skipped: skip,
                                results: transformed
                            }];
                }
            });
        });
    };
    MongoDbClient.prototype.getById = function (resource, id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, formatted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db
                                .collection(resource.name + 's')
                                .findOne({ _id: new mongodb_1.ObjectId(id) })];
                    case 2:
                        res = _a.sent();
                        if (!res)
                            throw new errors_1.NotFoundError(resource.name + " with id " + id + " not found");
                        formatted = __assign(__assign({}, res), { id: res._id.toString() });
                        delete formatted._id;
                        return [2 /*return*/, formatted];
                }
            });
        });
    };
    MongoDbClient.prototype.create = function (resource, pending, createdBy) {
        return __awaiter(this, void 0, void 0, function () {
            var res, withCreatedBy, e_1, created, withNiceId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        withCreatedBy = __assign(__assign({}, pending), { createdBy: createdBy });
                        return [4 /*yield*/, this.db.collection(resource.name + 's')
                                .insertOne(withCreatedBy)];
                    case 3:
                        res = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        throw e_1;
                    case 5:
                        created = res.ops[0];
                        withNiceId = __assign(__assign({}, created), { id: created._id.toString() });
                        delete withNiceId._id;
                        return [2 /*return*/, withNiceId];
                }
            });
        });
    };
    MongoDbClient.prototype.update = function (resource, id, ops) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, results, ops_1, ops_1_1, op, validator, result, formatted;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getById(resource, id)];
                    case 2:
                        existing = _b.sent();
                        results = [];
                        try {
                            for (ops_1 = __values(ops), ops_1_1 = ops_1.next(); !ops_1_1.done; ops_1_1 = ops_1.next()) {
                                op = ops_1_1.value;
                                try {
                                    results.push(fast_json_patch_1.applyOperation(existing, op));
                                }
                                catch (e) {
                                    if (e.name === 'TEST_OPERATION_FAILED')
                                        return [2 /*return*/];
                                    console.error(e.name, e.message, ops);
                                    throw new errors_1.BadRequestError("Encountered " + e.name + " applying patch: " + e.message);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (ops_1_1 && !ops_1_1.done && (_a = ops_1.return)) _a.call(ops_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        validator = ValidatorProvider_1.ValidatorProvider.getValidator(resource);
                        if (validator) {
                            result = validator.validate(existing, validator.schemas[resource.name]);
                            if (!result.valid) {
                                formatted = result.errors
                                    .map(function (err) { return err.toString(); })
                                    .join('. ');
                                throw new errors_1.BadRequestError("Error updating resource: " + formatted);
                            }
                        }
                        return [4 /*yield*/, this.replace(resource, existing.id, existing)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, existing];
                }
            });
        });
    };
    MongoDbClient.prototype.replace = function (resource, id, replacement, replacerId) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.collection(resource.name + 's')
                                .replaceOne({ _id: new mongodb_1.ObjectId(id) }, replacement)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDbClient.prototype.delete = function (resourceName, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.collection(resourceName + 's')
                                .deleteOne({ _id: new mongodb_1.ObjectId(id) })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MongoDbClient;
}());
exports.MongoDbClient = MongoDbClient;
var translateFilters = function (parsedQueryString) {
    var e_3, _a;
    if (!parsedQueryString)
        return {};
    var $and = [];
    var filters = {};
    // Extract filters by fields
    var keyVals = Object.entries(parsedQueryString);
    try {
        for (var keyVals_1 = __values(keyVals), keyVals_1_1 = keyVals_1.next(); !keyVals_1_1.done; keyVals_1_1 = keyVals_1.next()) {
            var _b = __read(keyVals_1_1.value, 2), key = _b[0], val = _b[1];
            if (key === 'id') {
                filters['_id'] = mapIdVals(val);
            }
            else if (typeof val === 'string') {
                filters[key] = val;
            }
            else if (Array.isArray(val)) {
                filters[key] = { $in: val };
            }
            else if (val) {
                var mapped = mapFilters(val);
                if (mapped.length < 2) {
                    filters[key] = mapped[0];
                }
                else {
                    $and = __spreadArray(__spreadArray([], __read($and)), __read(mapped));
                }
            }
            else {
                console.error("Unhandled case- " + key + ": " + val);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (keyVals_1_1 && !keyVals_1_1.done && (_a = keyVals_1.return)) _a.call(keyVals_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    if ($and.length > 0) {
        filters['$and'] = $and;
    }
    ;
    return filters;
};
exports.translateFilters = translateFilters;
var mapIdVals = function (vals) {
    if (Array.isArray(vals)) {
        var $in = vals.map(function (v) {
            if (typeof v !== 'string')
                throw new errors_1.BadRequestError("Invalid type for id field: " + typeof v);
            return new mongodb_1.ObjectId(v);
        });
        return { $in: $in };
    }
    else if (typeof vals === 'string') {
        return new mongodb_1.ObjectId(vals);
    }
    else if (typeof vals === 'object') {
        throw new Error('[in] notation for id field to be implemented!');
    }
    else {
        throw new errors_1.BadRequestError("Invalid type for id field: " + typeof vals);
    }
};
var mapFilters = function (filterObj) { return Object.entries(filterObj)
    .map(function (_a) {
    var _b;
    var _c = __read(_a, 2), key = _c[0], val = _c[1];
    if (!(key in OperatorMap)) {
        throw new errors_1.BadRequestError("Unrecognized query filter: " + key);
    }
    var mappedOp = OperatorMap[key];
    if (mappedOp === '$all' && !Array.isArray(val)) {
        val = [val];
    }
    return _b = {}, _b[mappedOp] = val, _b;
}); };
var OperatorMap = {
    'lt': '$lt',
    'lte': '$lte',
    'gt': '$gt',
    'gte': '$gte',
    'exists': '$TODO',
    'in': '$in',
    // TODO: regex, contains
    'contains': '$all',
};
