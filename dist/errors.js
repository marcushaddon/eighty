"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = exports.BadRequestError = exports.NotFoundError = void 0;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        if (message === void 0) { message = 'Not found'; }
        var _this = _super.call(this) || this;
        _this.status = 404;
        _this.message = 'Not found';
        _this.message = message;
        return _this;
    }
    return NotFoundError;
}(Error));
exports.NotFoundError = NotFoundError;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        if (message === void 0) { message = 'Bad request'; }
        var _this = _super.call(this) || this;
        _this.status = 400;
        _this.message = 'Bad request';
        _this.message = message;
        return _this;
    }
    return BadRequestError;
}(Error));
exports.BadRequestError = BadRequestError;
var AuthorizationError = /** @class */ (function (_super) {
    __extends(AuthorizationError, _super);
    function AuthorizationError(message) {
        if (message === void 0) { message = 'Forbidden'; }
        var _this = _super.call(this) || this;
        _this.status = 403;
        _this.message = 'Forbidden';
        _this.message = message;
        return _this;
    }
    return AuthorizationError;
}(Error));
exports.AuthorizationError = AuthorizationError;
