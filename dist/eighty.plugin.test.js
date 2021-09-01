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
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var _1 = require(".");
var fixtures_1 = require("./fixtures");
var mockAuth_1 = require("./fixtures/mockAuth");
describe('plugins', function () {
    var fixtures;
    var uut;
    var testSchema = {
        version: '1.0.0',
        database: { type: 'mongodb' },
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
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fixtures_1.buildMongoFixtures()];
                case 1:
                    fixtures = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('CLEARNING UP?');
                    return [4 /*yield*/, fixtures_1.cleanupMongoFixtures()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('runs passthrough plugin on create', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder, mockFn, _a, router, tearDown;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
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
                            .send({
                            title: 'foobook',
                            pages: 5,
                            author: {
                                name: 'chrill',
                                age: 20,
                            }
                        }).expect(201)
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
    it('runs effectful plugin on getOne', function () { return __awaiter(void 0, void 0, void 0, function () {
        var builder, _a, router, tearDown, uut, bookId;
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
                    bookId = fixtures.books[0]._id.toString();
                    return [4 /*yield*/, supertest_1.default(uut)
                            .get("/books/" + bookId)
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
    it('runs short circuit plugin on list', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        res.json(filtered).end();
                    });
                    _a = builder.build(), router = _a.router, tearDown = _a.tearDown;
                    return [4 /*yield*/, supertest_1.default(router)
                            .get('/books?count=10000000') // To get all of them
                            .send()
                            .expect(200)
                            .expect(function (res) {
                            expect(res.body.length).toBeLessThanOrEqual(fixtures.books.length / 2 + 1);
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
