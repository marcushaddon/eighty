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
var mockAuth_1 = require("./fixtures/mockAuth");
var mockDb_1 = require("./fixtures/mockDb");
jest.mock('./db/mongodb', function () { });
describe('create', function () {
    ['mock'].forEach(function (db) {
        var testSchema = "\n        version: \"1.0.0\" \n\n        database:\n          type: " + db + "\n\n        resources:\n          - name: user\n            schemaPath: ./src/fixtures/schemas/user.yaml\n            operations:\n              create:\n                authentication: false\n          - name: book\n            schemaPath: ./src/fixtures/schemas/book.yaml\n            operations:\n              getOne:\n                authentication: false\n              create:\n                authentication: true\n\n        ";
        var builder;
        var uut;
        var tearDownEighty;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, router, tearDown;
            return __generator(this, function (_b) {
                uut = express_1.default();
                builder = eighty_1.eighty({
                    schemaRaw: testSchema,
                });
                _a = builder.build(), router = _a.router, tearDown = _a.tearDown;
                uut.use(mockAuth_1.mockAuthenticator);
                uut.use(router);
                tearDownEighty = tearDown;
                return [2 /*return*/];
            });
        }); });
        afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tearDownEighty()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(jest.clearAllMocks);
        it(db + ": creates a valid resource", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, mockCreatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            name: 'test-user',
                            age: 34
                        };
                        mockCreatedUser = __assign(__assign({}, mockUser), { id: uuid_1.v4() });
                        mockDb_1.mockDbClient.create.mockResolvedValue(mockCreatedUser);
                        return [4 /*yield*/, supertest_1.default(uut)
                                .post('/users')
                                .send(mockUser)
                                .expect(201)
                                .expect(function (res) {
                                expect(res.body.id).toBeDefined();
                                expect(res.body.name).toEqual('test-user');
                                expect(res.body.age).toEqual(34);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects invalid resource", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supertest_1.default(uut)
                            .post('/users')
                            .send({
                            name: 'invalid',
                            age: 'cool-user'
                        }).expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": validates array field", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockBook, mockCreated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBook = {
                            title: 'test',
                            pages: 100,
                            author: {
                                name: 'test author',
                            },
                            themes: ['technology']
                        };
                        mockCreated = __assign(__assign({}, mockBook), { id: uuid_1.v4() });
                        mockDb_1.mockDbClient.create.mockResolvedValue(mockCreated);
                        return [4 /*yield*/, supertest_1.default(uut)
                                .post('/books')
                                .set({ Authorization: 'userA' })
                                .send(mockBook).expect(201)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": invalidates array field", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockBook;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBook = {
                            title: 'test',
                            pages: 100,
                            author: {
                                name: 'test',
                                age: 345
                            },
                            themes: ['technology', { name: 'the future' }]
                        };
                        return [4 /*yield*/, supertest_1.default(uut)
                                .post('/books')
                                .set({ Authorization: 'userA' })
                                .send(mockBook).expect(400)];
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
                            .post('/books')
                            .send({
                            title: 'Unauthenticated Book',
                            pages: 35
                        }).expect(401)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": accepts authenticated request for authenticated op", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockBook;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockBook = {
                            title: 'Authenticated Book',
                            pages: 24,
                            author: {
                                name: 'Authorntentcated',
                                age: 40
                            }
                        };
                        mockDb_1.mockDbClient.create.mockImplementation(function (_, pending, createdBy) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, (__assign(__assign({}, pending), { id: uuid_1.v4(), createdBy: createdBy }))];
                            });
                        }); });
                        return [4 /*yield*/, supertest_1.default(uut)
                                .post('/books')
                                .set({ 'Authorization': 'userA' })
                                .send(mockBook).expect(201)
                                .expect(function (res) {
                                expect(res.body.createdBy).toEqual('userAID');
                                expect(res.body.title).toEqual(mockBook.title);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
