"use strict";
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
exports.printAllPaths = exports.friendlyOpNames = exports.getRoute = void 0;
var getRoute = function (op, resource) {
    if (op === 'list' || op === 'create')
        return {
            expressRoute: "/" + resource.name + "s",
            openApiRoute: "/" + resource.name + "s",
            openApiParams: [],
        };
    return {
        expressRoute: "/" + resource.name + "s/:id",
        openApiRoute: "/" + resource.name + "s/{id}",
        openApiParams: [
            {
                in: 'path',
                name: 'id',
                descriptionTemplate: 'The id of the $resource$ to be $op$ed',
            }
        ]
    };
};
exports.getRoute = getRoute;
exports.friendlyOpNames = {
    getOne: 'fetch',
    list: 'list',
    create: 'create',
    replace: 'replace',
    update: 'update',
    delete: 'delete'
};
var isObj = function (val) { return val !== null && typeof val === 'object'; };
var printAllPaths = function (obj) { return Object.keys(obj)
    .map(function (key) {
    var val = obj[key];
    if (!isObj(val)) {
        return [[key, val]];
    }
    else {
        return exports.printAllPaths(val).map(function (branch) { return __spreadArray([key], __read(branch)); });
    }
}).reduce(function (acc, curr) { return __spreadArray(__spreadArray([], __read(acc)), __read(curr)); }, []); };
exports.printAllPaths = printAllPaths;
