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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildChecklist = void 0;
var buildChecklist = function (schema) {
    // Database connection string
    var dbItems = dbChecklist(schema);
    var resourceItems = resourceChecklist(schema);
    return __spreadArray(__spreadArray([], __read(dbItems)), __read(resourceItems));
};
exports.buildChecklist = buildChecklist;
var dbChecklist = function (schema) {
    var dbType;
    var dbConnVar;
    switch (schema.database.type) {
        case 'mongodb':
            dbType = 'MongoDB';
            dbConnVar = 'MONGO_URL';
            break;
        case 'postgres':
            dbType = 'Postgres SQL';
            dbConnVar = 'POSTGRES_URL';
            break;
        default:
            throw new Error("Unsupported db type: " + schema.database.type);
    }
    return [
        "A connection string is set to env var: $" + dbConnVar,
        "A healthy " + dbType + " instance is running at address indicated by $" + dbConnVar
    ];
};
var resourceChecklist = function (schema) {
    var e_1, _a;
    var collection = schema.database.type === 'mongodb' ? 'collection' : 'table';
    var list = [];
    try {
        for (var _b = __values(schema.resources), _c = _b.next(); !_c.done; _c = _b.next()) {
            var resource = _c.value;
            list.push("Database has a " + collection + " with name \"" + resource.name + "s\"");
            list = __spreadArray(__spreadArray([], __read(list)), __read(opsChecklist(schema, resource)));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return list;
};
var opsChecklist = function (schema, resource) {
    if (!resource.operations)
        return [];
    var list = [];
    if (resource.operations.getOne && schema.database.type !== 'mongodb') {
        list.push("Table \"" + resource.name + "s\" has unique \"id\" column for getOne operation");
    }
    // TODO: gather auth checklist
    list.push('Authentication middleware in place that attaches "user" ' +
        'object to req on authenticated routes. "user" object has id field, ' +
        'and if user belongs to a group or has a role, "group" and "role" ' +
        'fields respectively.');
    return list;
};
var schema = {
    name: 'Cool CRUD',
    version: '1.0.0',
    database: {
        type: 'postgres',
    },
    resources: [
        {
            name: 'bike',
            operations: {
                create: {
                    authentication: true,
                    authorization: {
                        allOf: [
                            { type: 'hasRole', role: 'bike-builder' }
                        ]
                    }
                },
                getOne: {}
            }
        }
    ]
};
