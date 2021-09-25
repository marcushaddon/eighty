"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorProvider = void 0;
var ValidatorProvider = /** @class */ (function () {
    function ValidatorProvider() {
    }
    ValidatorProvider.register = function (path, validator) {
        ValidatorProvider.validators.set(path, validator);
    };
    ValidatorProvider.getValidator = function (resource) {
        if (!resource.schemaPath)
            return;
        return ValidatorProvider.validators.get(resource.schemaPath);
    };
    ValidatorProvider.validators = new Map();
    return ValidatorProvider;
}());
exports.ValidatorProvider = ValidatorProvider;
