"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var _a = __1.eighty({
    schemaPath: './src/demo/demo.yaml',
}), init = _a.init, tearDown = _a.tearDown, crudServer = _a.router;
crudServer.listen(4001, function () { return console.log('CRUD demo listening on port 4000'); });
