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
var eighty_1 = require("./eighty");
var mockAuth_1 = require("./fixtures/mockAuth");
var fixtures_1 = require("./fixtures");
describe('updateOp', function () {
    ['mongodb'].forEach(function (db) {
        var eightyRouter;
        var uut;
        var fixtures;
        var teardown;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var testSchema, _a, router, init, tearDown;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        testSchema = "\n            version: \"1.0.0\"\n\n            database:\n              type: " + db + "\n            \n            resources:\n              - name: book\n                schemaPath: ./src/fixtures/schemas/book.ts\n                operations:\n                  getOne:\n                    authentication: false\n                  update:\n                    authentication: true\n                    unknownFieldsPolicy: allow\n            ";
                        uut = express_1.default();
                        uut.use(mockAuth_1.mockAuthenticator);
                        _a = eighty_1.eighty({
                            schemaRaw: testSchema,
                        }), router = _a.router, init = _a.init, tearDown = _a.tearDown;
                        eightyRouter = router;
                        teardown = tearDown;
                        uut.use(router);
                        return [4 /*yield*/, fixtures_1.buildMongoFixtures()];
                    case 1:
                        fixtures = _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = teardown;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, teardown()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [4 /*yield*/, fixtures_1.cleanupMongoFixtures()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects unauthenticated request for authenticated op", function () { return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = fixtures.books[0]._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch("/books/" + id)
                                .send([
                                { op: 'replace', path: '/author/name', value: 'New Name' }
                            ]).expect(401)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects invalid PATCH operation", function () { return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = fixtures.books[0]._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch("/books/" + id)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'foo', path: 4, value: 'wrong' }
                            ]).expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects invalid PATCH for specific resource", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .patch('/books/iDdoesntmattter')
                            .set({ Authorization: 'userA' })
                            .send([
                            { op: 'replace', path: '/author/age', value: 'shouldntbeastring' }
                        ]).expect(400)
                            .expect(function (res) { return expect(res.body.message).toContain('is not of a type(s)'); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: patch for unknown path using ts schema throws 500?
        // Book 0
        it(db + ": applies valid replace operation", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[0];
                        expected = __assign(__assign({}, book), { id: book._id.toString(), author: __assign(__assign({}, book.author), { age: 420 }) });
                        delete expected._id;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch("/books/" + book._id.toString())
                                .set({ Authorization: 'userA' })
                                .send([
                                { 'op': 'replace', path: '/author/age', value: 420 }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get("/books/" + book._id.toString())
                                .send()
                                .expect(function (res) {
                                expect(res.body.author.age).toEqual(420);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": fails replace on nonexistent pointer", function () { return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = fixtures.books[1]._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch("/books/" + id)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'replace', path: '/foo/bar', value: 20 }
                            ]).expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 1
        it(db + ": applies add operation on unvalidated path", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[1];
                        expected = __assign(__assign({}, book), { id: book._id.toString(), foo: 'bar' });
                        delete expected._id;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch("/books/" + book._id.toString())
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'add', path: '/foo', value: 'bar' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get("/books/" + book._id.toString())
                                .send()
                                .expect(function (res) { return expect(res.body).toEqual(expected); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 2
        it(db + ": applies move op", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[2];
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch("/books/" + book._id.toString())
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'move', from: '/author/age', path: '/pages' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get("/books/" + book._id.toString())
                                .send()
                                .expect(function (res) {
                                expect(res.body).toMatchObject({
                                    pages: book.author.age
                                });
                                expect(res.body.author.age).toBeUndefined();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 3
        it(db + ": applies remove operation on optional field", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[3];
                        expected = __assign(__assign({}, book), { id: book._id.toString() });
                        delete expected._id;
                        delete expected.author.age;
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch("/books/" + book._id.toString())
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'remove', path: '/author/age' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get("/books/" + book._id.toString())
                                .send()
                                .expect(function (res) { return expect(res.body.author.age).toBeUndefined(); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 4
        it(db + ": applies valid copy op", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, expected, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[4];
                        expected = __assign(__assign({}, book), { id: book._id.toString(), pages: book.author.age });
                        delete expected._id;
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userC' })
                                .send([
                                { op: 'copy', from: '/author/age', path: '/pages' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(200)
                                .expect(function (res) { return expect(res.body).toEqual(expected); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 5
        it(db + ": applies op if test passes", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[5];
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'test', path: '/title', value: fixtures.books[5].title },
                                { op: 'replace', path: '/title', value: 'Changed' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(function (res) { return expect(res.body.title).toEqual('Changed'); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        //         // TODO: doesnt apply operation if test fails (include one passing test)
        it(db + ": doesnt apply change if test fails", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[6];
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'test', path: '/title', value: 'not' + book.title },
                                { op: 'replace', path: '/title', value: 'Changed' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(function (res) {
                                expect(res.body.title).not.toEqual('Changed');
                                expect(res.body.title).toEqual(book.title);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: rejects operation that puts resource into invalid state
        it(db + ": rejects operation that puts resource into invalid state", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[7];
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'remove', path: '/title' },
                                { op: 'remove', path: '/author/name' }
                            ]).expect(400)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(200)
                                .expect(function (res) { return expect(res.body.title).toEqual(book.title); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 8
        it(db + ": it applies multiple valid ops", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[8];
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'replace', path: '/title', value: 'Better title' },
                                { op: 'copy', from: '/author/age', path: '/pages' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(function (res) {
                                expect(res.body.title).toEqual('Better title');
                                expect(res.body.pages).toEqual(res.body.author.age);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 9
        it(db + ": peforms valid ADDs on array field", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[9];
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'add', path: '/themes/0', value: 'being first' }
                            ]).expect(200)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .set({ Authorization: 'userA' })
                                .expect(function (res) {
                                expect(res.body.themes[0]).toEqual('being first');
                                expect(res.body.themes[1]).toEqual(book.themes[0]);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'add', path: '/themes/-', value: 'end value' }
                            ]).expect(200)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .set({ Authorization: 'userA' })
                                .send()
                                .expect(function (res) {
                                expect(res.body.themes[res.body.themes.length - 1]).toEqual('end value');
                                expect(res.body.themes[0]).toEqual('being first');
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        //         // TODO: Find suite of tests for PATCH standard?
        // Book 10
        it(db + ": rejects invalid replace op on array field", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[10];
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'replace', path: '/themes/0', value: 5 }
                            ]).expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Book 11
        it(db + ": correctly calls success callbacks", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url, mockFn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[11];
                        url = "/books/" + book._id.toString();
                        mockFn = jest.fn();
                        eightyRouter
                            .resources('book')
                            .ops('update')
                            .onSuccess(function (req) {
                            mockFn(req.resource);
                        });
                        return [4 /*yield*/, supertest_1.default(uut)
                                .patch(url)
                                .set({ Authorization: 'userA' })
                                .send([
                                { op: 'add', path: '/themes/0', value: 'callbacks' }
                            ]).expect(200)
                                .expect(function (res) {
                                expect(mockFn).toHaveBeenCalledTimes(1);
                                expect(mockFn.mock.calls[0][0]).toEqual(res.body);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
