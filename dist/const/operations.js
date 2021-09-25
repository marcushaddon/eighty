"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opMethods = exports.Operations = void 0;
exports.Operations = [
    'list',
    'getOne',
    'create',
    // 'createOrReplace',
    'replace',
    'update',
    'delete',
];
exports.opMethods = {
    'list': 'get',
    'getOne': 'get',
    'create': 'post',
    // 'createOrReplace': 'put',
    'replace': 'put',
    'update': 'patch',
    'delete': 'delete',
};
