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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var _1 = require(".");
var mockDb_1 = require("./fixtures/mockDb");
var mockAuth_1 = require("./fixtures/mockAuth");
var errors_1 = require("./errors");
describe('plugins', function () {
    var books;
    var mockDb;
    var uut;
    var testSchema = {
        version: '1.0.0',
        database: { type: 'mock' },
        resources: [
            {
                name: 'book',
                schemaPath: './src/fixtures/schemas/book.ts',
                operations: {
                    create: {
                        authentication: true,
                    },
                    getOne: {
                        authentication: false,
                    },
                    list: {
                        authentication: false,
                    }
                }
            }
        ]
    };
    beforeEach(function () {
        var e_1, _a;
        books = __spreadArray([], __read(Array(30))).map(function (_, i) { return ({
            title: 'mock book',
            pages: 5 * i,
            id: uuid_1.v4(),
        }); });
        mockDb = {
            books: {}
        };
        try {
            for (var books_1 = __values(books), books_1_1 = books_1.next(); !books_1_1.done; books_1_1 = books_1.next()) {
                var book = books_1_1.value;
                mockDb.books[book.id] = book;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (books_1_1 && !books_1_1.done && (_a = books_1.return)) _a.call(books_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        mockDb_1.mockDbClient.create.mockImplementation(function (resource, pending, createdBy) {
            var created = __assign(__assign({}, pending), { id: uuid_1.v4(), createdBy: createdBy });
            mockDb[resource.name + 's'][created.id] = created;
            return created;
        });
        mockDb_1.mockDbClient.getById.mockImplementation(function (resource, id) {
            var _a;
            var existing = (_a = mockDb[resource.name + 's']) === null || _a === void 0 ? void 0 : _a[id];
            if (!existing)
                throw new errors_1.NotFoundError('Unable to find mock resource');
            return existing;
        });
        mockDb_1.mockDbClient.list.mockImplementation(function (_a) {
            var resource = _a.resource;
            var res = Object.values(mockDb[resource.name + 's']);
            return {
                results: res,
                total: res.length,
            };
        });
    });
    it('runs passthrough pre plugin on getOne', function () { return __awaiter(void 0, void 0, void 0, function () {
        var book, builder, mockFn, _a, router, tearDown, uut;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    book = books[0];
                    builder = _1.eighty({ schema: testSchema });
                    mockFn = jest.fn();
                    builder.resources('book')
                        .ops('getOne')
                        .beforeOp(function (req, res, next) {
                        mockFn();
                        next();
                    });
                    _a = builder.build(), router = _a.router, tearDown = _a.tearDown;
                    uut = express_1.default();
                    uut.use(mockAuth_1.mockAuthenticator);
                    uut.use(router);
                    return [4 /*yield*/, supertest_1.default(uut)
                            .get("/books/" + book.id)
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            expect(mockFn).toHaveBeenCalledTimes(1);
                        }).then(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tearDown()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // TODO: is this even possible?
    it.skip('runs effectful pre plugin on create', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    it('runs short circuit pre plugin on create', function () { return __awaiter(void 0, void 0, void 0, function () {
        var shortBook, longBook, mockFn, builder, _a, router, tearDown, uut;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    shortBook = {
                        title: 'short',
                        pages: 20,
                        author: {
                            name: 'quick'
                        }
                    };
                    longBook = {
                        title: 'long',
                        pages: 2000,
                        author: {
                            name: 'blowhard'
                        }
                    };
                    mockFn = jest.fn();
                    builder = _1.eighty({ schema: testSchema });
                    builder.resources('book')
                        .ops('create')
                        .beforeOp(function (req, res, next) {
                        var pending = req.body;
                        if (pending.pages < 100) {
                            return next();
                        }
                        mockFn(pending.pages);
                        res.status(400)
                            .send({ message: 'TLDR BRO' })
                            .end();
                    });
                    _a = builder.build(), router = _a.router, tearDown = _a.tearDown;
                    uut = express_1.default();
                    uut.use(mockAuth_1.mockAuthenticator);
                    uut.use(router);
                    return [4 /*yield*/, supertest_1.default(uut)
                            .post('/books')
                            .set({ Authorization: 'userA' })
                            .send(shortBook)
                            .expect(201)
                            .expect(function (res) {
                            expect(res.body.title).toEqual('short');
                            expect(mockFn).toHaveBeenCalledTimes(0);
                        })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, supertest_1.default(uut)
                            .post('/books')
                            .set({ Authorization: 'userA' })
                            .send(longBook)
                            .expect(400)
                            .expect(function (res) {
                            expect(res.body.message).toEqual('TLDR BRO');
                            expect(mockFn).toHaveBeenCalledTimes(1);
                            expect(mockFn).toHaveBeenCalledWith(longBook.pages);
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('runs passthrough post plugin on create', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBook, mockCreated, builder, mockFn, _a, router, tearDown;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockBook = {
                        title: 'foobook',
                        pages: 5,
                        author: {
                            name: 'chrill',
                            age: 20,
                        }
                    };
                    mockCreated = __assign(__assign({}, mockBook), { id: uuid_1.v4() });
                    mockDb_1.mockDbClient.create.mockResolvedValue(mockCreated);
                    builder = _1.eighty({ schema: testSchema });
                    mockFn = jest.fn();
                    builder
                        .resources('book')
                        .ops('create')
                        .onSuccess(function (req, _, next) {
                        mockFn(req.resource);
                        next();
                    });
                    _a = builder.build(), router = _a.router, tearDown = _a.tearDown;
                    uut = express_1.default();
                    uut.use(mockAuth_1.mockAuthenticator);
                    uut.use(router);
                    return [4 /*yield*/, supertest_1.default(uut)
                            .post('/books')
                            .set({ 'Authorization': 'userA' })
                            .send(mockBook).expect(201)
                            .expect(function (res) {
                            expect(mockFn).toHaveBeenCalledTimes(1);
                            expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ title: 'foobook' }));
                        })
                            .then(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tearDown()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('runs effectful post plugin on getOne', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder, _a, router, tearDown, uut, bookId, url;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    builder = _1.eighty({ schema: testSchema });
                    builder
                        .resources('book')
                        .ops('getOne')
                        .onSuccess(function (req, _, next) {
                        req.status = 420;
                        req.resource.title = 'MODIFIED';
                        next();
                    });
                    _a = builder.build(), router = _a.router, tearDown = _a.tearDown;
                    uut = express_1.default();
                    uut.use(mockAuth_1.mockAuthenticator);
                    uut.use(router);
                    bookId = books[0].id;
                    url = "/books/" + bookId;
                    return [4 /*yield*/, supertest_1.default(uut)
                            .get(url)
                            .send()
                            .expect(420)
                            .expect(function (res) { return expect(res.body.title).toEqual('MODIFIED'); })
                            .then(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tearDown()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('runs short circuit post plugin on list', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder, _a, router, tearDown;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    builder = _1.eighty({ schema: testSchema });
                    builder
                        .resources('book')
                        .ops('list')
                        .onSuccess(function (req, res) {
                        var filtered = req.resource.results
                            .filter(function (_, idx) { return idx % 2 === 0; });
                        res.json(__assign(__assign({}, req.resource), { results: filtered })).end();
                    });
                    _a = builder.build(), router = _a.router, tearDown = _a.tearDown;
                    return [4 /*yield*/, supertest_1.default(router)
                            .get('/books?count=10000000') // To get all of them
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            expect(res.body.results.length).toBeLessThanOrEqual(books.length / 2 + 1);
                        }).then(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tearDown()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
