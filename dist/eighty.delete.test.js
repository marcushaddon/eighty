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
var fixtures_1 = require("./fixtures");
var mockAuth_1 = require("./fixtures/mockAuth");
var eighty_1 = require("./eighty");
describe('delete', function () {
    ['mongodb'].forEach(function (db) {
        var uut;
        var fixtures;
        var teardownEighty;
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, router, tearDown;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fixtures_1.buildMongoFixtures()];
                    case 1:
                        fixtures = _b.sent();
                        _a = eighty_1.eighty({
                            schemaRaw: "\n                version: \"1.0.0\"\n\n                database:\n                  type: mongodb\n                \n                resources:\n                  - name: user\n                    schemaPath: ./src/fixtures/schemas/user.yaml\n                    operations:\n                      getOne:\n                        authentication: false\n                      delete:\n                        authentication: true\n\n                  - name: book\n                    schemaPath: ./src/fixtures/schemas/book.yaml\n                    operations:\n                      getOne:\n                        authentication: false\n                      delete:\n                        authentication: false\n                ",
                        }).build(), router = _a.router, tearDown = _a.tearDown;
                        teardownEighty = tearDown;
                        uut = express_1.default();
                        uut.use(mockAuth_1.mockAuthenticator);
                        uut.use(router);
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, teardownEighty()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fixtures_1.cleanupMongoFixtures()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": performs unauthenticated delete", function () { return __awaiter(void 0, void 0, void 0, function () {
            var book, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        book = fixtures.books[0];
                        url = "/books/" + book._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .delete(url)
                                .send()
                                .expect(204)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(404)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": rejects unauthenticated request for authenticated op", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = fixtures.users[1];
                        url = "/users/" + user._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .delete(url)
                                .send()
                                .expect(401)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(200)
                                .expect(function (res) { return expect(res.body.name).toEqual(user.name); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it(db + ": performs authenticated op", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = fixtures.users[0];
                        url = "/users/" + user._id.toString();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .delete(url)
                                .set({ Authorization: 'userA' })
                                .send()
                                .expect(204)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, supertest_1.default(uut)
                                .get(url)
                                .send()
                                .expect(404)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // it(`${db}: correctly runs success callbacks`, async () => {
        //   const user = fixtures.users[1];
        //   const url = `/users/${user._id.toString()}`;
        //   const mockFn = jest.fn();
        //   eightyRouter
        //     .resources('user')
        //     .ops('delete')
        //     .onSuccess((req, _, next) => {
        //       mockFn(req.resource);
        //       next();
        //     });
        //   await request(uut)
        //     .delete(url)
        //     .set({ Authorization: 'userA' })
        //     .send()
        //     .expect(204)
        //     .expect(res => {
        //       expect(mockFn).toHaveBeenCalledTimes(1);
        //       expect(mockFn.mock.calls[0][0].id).toEqual(user._id.toString());
        //     })
        // });
    });
});
