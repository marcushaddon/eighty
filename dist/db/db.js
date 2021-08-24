"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbClients = exports.resolveDbClient = void 0;
var mongodb_1 = require("./mongodb");
var resolveDbClient = function (dbConfig) {
    return exports.DbClients.get(dbConfig.type)();
};
exports.resolveDbClient = resolveDbClient;
exports.DbClients = new Map([
    // [ 'mock', () => new MockDbClient() ],
    // [ 'postgres', () => new PostgresClient() ],
    ['mongodb', function () { return new mongodb_1.MongoDbClient(); }],
]);
