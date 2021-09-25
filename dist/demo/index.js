"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var builder = __1.eighty({
    schemaPath: './src/demo/demo.yaml',
});
builder
    .resources('book')
    .ops('create')
    .onSuccess(function (req, res, next) {
    console.log('DEMO PLUGIN IN RUNNING!!!');
    next();
});
var router = builder.build().router;
router.listen(4001, function () { return console.log('CRUD demo listening on port 4000'); });
