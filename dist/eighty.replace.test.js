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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var supertest_1 = __importDefault(require("supertest"));
var uuid_1 = require("uuid");
var eighty_1 = require("./eighty");
var errors_1 = require("./errors");
var mockAuth_1 = require("./fixtures/mockAuth");
var db_1 = require("./db");
var mockDb_1 = require("./fixtures/mockDb");
describe('replace', function () {
    ['mongodb'].forEach(function (db) {
        var teardown;
        var user;
        var book;
        var mockDb;
        var fixtures;
        var uut;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, router, init, tearDown;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        db_1.DbClients.set('mock', function () { return mockDb_1.mockDbClient; });
                        _a = eighty_1.eighty({
                            schemaRaw: "\n                version: \"1.0.0\"\n\n                database:\n                  type: mock\n                \n                resources:\n                  - name: user\n                    schemaPath: ./src/fixtures/schemas/user.yaml\n                    operations:\n                      getOne:\n                        authentication: false\n                      replace:\n                        authentication: true\n                  - name: book\n                    schemaPath: ./src/fixtures/schemas/book.yaml\n                    operations:\n                      getOne:\n                        authentication: false\n                      replace:\n                        authentication: false\n                "
                        }).build(), router = _a.router, init = _a.init, tearDown = _a.tearDown;
                        teardown = tearDown;
                        uut = express_1.default();
                        uut.use(mockAuth_1.mockAuthenticator);
                        uut.use(router);
                        return [4 /*yield*/, init()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, teardown()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () {
            var _a, _b;
            user = {
                name: 'mockusers',
                id: uuid_1.v4(),
            };
            book = {
                title: 'mock book',
                pages: 234,
                author: {
                    name: 'mock author',
                    age: 24,
                },
                themes: ['war', 'peace'],
                id: uuid_1.v4()
            };
            mockDb = {
                books: (_a = {},
                    _a[book.id] = book,
                    _a),
                users: (_b = {},
                    _b[user.id] = user,
                    _b)
            };
            mockDb_1.mockDbClient.replace.mockImplementation(function (resource, id, replacement, replacerId) {
                var _a;
                var existing = (_a = mockDb[resource.name + 's']) === null || _a === void 0 ? void 0 : _a[id];
                if (!existing)
                    throw new errors_1.NotFoundError('Unable to find mock resource');
                mockDb[resource.name + 's'][id] = __assign(__assign({}, replacement), { id: id });
            });
            mockDb_1.mockDbClient.getById.mockImplementation(function (resource, id) {
                var _a;
                var res = (_a = mockDb[resource.name + 's']) === null || _a === void 0 ? void 0 : _a[id];
                if (res)
                    return res;
                throw new errors_1.NotFoundError('Unable to find mock resource');
            });
        });
        afterEach(jest.clearAllMocks);
        it(db + ": rejects invalid replace", function () { return __awaiter(void 0, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "/books/" + book.id;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .put(url)
                                .send({
                                title: 5,
                                pages: 'one hundred',
                            }).expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects unauthorized replace for authorized op", function () { return __awaiter(void 0, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "/users/" + book.id;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .put(url)
                                .send({})
                                .expect(401)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": performs valid unauthenticated replace", function () { return __awaiter(void 0, void 0, void 0, function () {
            var url, newBook, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "/books/" + book.id;
                        newBook = {
                            title: 'New title',
                            pages: 22,
                            author: {
                                name: 'New author',
                                age: 55
                            }
                        };
                        expected = __assign(__assign({}, newBook), { id: book.id });
                        return [4 /*yield*/, supertest_1.default(uut)
                                .put(url)
                                .send(newBook).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(function (res) { return expect(res.body).toEqual(expected); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": performs valid authenticated replace", function () { return __awaiter(void 0, void 0, void 0, function () {
            var url, newUser, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "/users/" + user.id;
                        newUser = {
                            name: 'New person',
                            age: 34,
                            config: {
                                score: 100
                            }
                        };
                        expected = __assign(__assign({}, newUser), { id: user.id });
                        return [4 /*yield*/, supertest_1.default(uut)
                                .put(url)
                                .set({ Authorization: 'userA' })
                                .send(newUser)
                                .expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(function (res) { return expect(res.body).toEqual(expected); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": performds valid replace with nested array fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "/books/" + book.id;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .put(url)
                                .send({
                                title: 'new title',
                                pages: 3452,
                                author: {
                                    name: 'new name',
                                },
                                themes: ['replacing things']
                            }).expect(200)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects invalid replace with nested array fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "/books/" + book.id;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .put(url)
                                .send({
                                title: 'new title',
                                pages: 3452,
                                author: {
                                    name: 'new name',
                                },
                                themes: ['replacing things', 5]
                            }).expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
