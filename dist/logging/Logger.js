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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger(ctx) {
        if (ctx === void 0) { ctx = {}; }
        this.ctx = ctx;
    }
    Logger.prototype.info = function (msg, ctx) {
        this.log('info', msg, ctx);
    };
    Logger.prototype.error = function (msg, err, ctx) {
        if (ctx === void 0) { ctx = {}; }
        this.log('error', msg, __assign({ error: err }, ctx));
    };
    Logger.prototype.debug = function (msg, ctx) {
        this.log('debug', msg, ctx);
    };
    Logger.prototype.setCtx = function (key, val) {
        this.ctx[key] = val;
    };
    Logger.prototype.log = function (level, msg, ctx) {
        if (ctx === void 0) { ctx = {}; }
        console[level](__assign(__assign(__assign({ message: msg, createdAt: new Date().toISOString() }, this.ctx), ctx), { level: level }));
    };
    return Logger;
}());
exports.Logger = Logger;
