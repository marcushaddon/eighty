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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var supertest_1 = __importDefault(require("supertest"));
var eighty_1 = require("./eighty");
var fixtures_1 = require("./fixtures");
var mockAuth_1 = require("./fixtures/mockAuth");
describe('list', function () {
    ['mongodb'].forEach(function (db) {
        var fixtures;
        var uut;
        var tearDownEighty;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, router, init, tearDown;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fixtures_1.buildMongoFixtures()];
                    case 1:
                        fixtures = _b.sent();
                        _a = eighty_1.eighty({
                            schemaRaw: testSchema
                        }).build(), router = _a.router, init = _a.init, tearDown = _a.tearDown;
                        uut = express_1.default();
                        uut.use(mockAuth_1.mockAuthenticator);
                        uut.use(router);
                        tearDownEighty = tearDown;
                        return [4 /*yield*/, init()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tearDownEighty()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fixtures_1.cleanupMongoFixtures()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        var testSchema = "\n        version: \"1.0.0\" \n\n        database:\n          type: " + db + "\n\n        resources:\n          - name: user\n            schemaPath: ./src/fixtures/schemas/user.yaml\n            operations:\n              list:\n                authentication: false\n                unknownFieldsPolicy: reject\n          - name: book\n            schemaPath: ./src/fixtures/schemas/book.yaml\n            operations:\n              list:\n                authentication: true\n                unknownFieldsPolicy: allow\n        ";
        it(db + ": lists resources", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users')
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            expect(res.body.results.length).toEqual(fixtures.users.length);
                            expect(res.body.total).toEqual(fixtures.users.length);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": limits results", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // TODO: Check pagination values!
                    return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?count=2')
                            .send()
                            .expect(200)
                            .expect(function (res1) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                expect(res1.body.results.length).toEqual(2);
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        // TODO: Check pagination values!
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": skips results", function () { return __awaiter(void 0, void 0, void 0, function () {
            var skip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = fixtures.users.length - 3;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get("/users?skip=" + skip)
                                .send()
                                .expect(200)
                                .expect(function (res2) {
                                expect(res2.body.results.length).toEqual(3);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": applies filter operators", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?age[gt]=40')
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            var filtered = fixtures.users
                                .filter(function (r) { return r.age > 40; });
                            expect(res.body.results.length).toEqual(filtered.length);
                            expect(res.body.total).toEqual(filtered.length);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": applies multiple filters", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?age[gt]=20&score[lt]=200')
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            expect(res.body.results.length).toEqual(1);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": filters on id field", function () { return __awaiter(void 0, void 0, void 0, function () {
            var books, url1, url2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        books = fixtures.books.slice(0, 2);
                        url1 = "/books?" + books.map(function (book) { return "id=" + book._id.toString(); }).join('&');
                        url2 = "/books?" + books.map(function (book) { return "id[in]=" + book._id.toString(); }).join('&');
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url1)
                                .set({ Authorization: 'userA' })
                                .send()
                                .expect(200)
                                .expect(function (res) { return expect(res.body.results.length).toEqual(2); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": applies filter operators on nested fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?config.nickname[in]=aNickname&config.nickname[in]=dNickname')
                            .send()
                            .expect(200)
                            .expect(function (res) { return expect(res.body.results.length).toEqual(2); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects unauthenticated request for authenticated op", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/books')
                            .send()
                            .expect(401)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": accepts authenticated request for authenticated op", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/books?count=1')
                            .set({ Authorization: 'userA' })
                            .send()
                            .expect(200)
                            .expect(function (res) { return expect(res.body.results.length).toEqual(1); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects filters on unknown fields when unknownFieldsPolicy: reject", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?foo[gt]=aaa')
                            .send()
                            .expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": accepts filters on unkown fields (assuming they are strings) when unknownFieldsPolicy: accept", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/books?notInSchema[gt]=aaa')
                            .set({ Authorization: 'userA' })
                            .send()
                            .expect(200)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": sorts and orders", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?sort=name&order=ASC')
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            var first = res.body.results[0];
                            var last = res.body.results[res.body.results.length - 1];
                            expect(first.name <= last.name).toBeTruthy();
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get('/users?sort=name&order=DESC')
                                .send()
                                .expect(200)
                                .expect(function (res) {
                                var first = res.body.results[0];
                                var last = res.body.results[res.body.results.length - 1];
                                expect(first.name >= last.name).toBeTruthy();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("$" + db + ": queries for nested array fields containing single field", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?interests[contains]=reading')
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            expect(res.body.results.length).toEqual(2);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": queries for nested array fields containing multiple fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .get('/users?interests[contains]=reading&interests[contains]=arithmetic')
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            expect(res.body.results.length).toEqual(1);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
