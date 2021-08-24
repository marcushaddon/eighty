"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCreateValidationMiddleware = void 0;
var ValidatorProvider_1 = require("./ValidatorProvider");
// TODO: Make this respect resource.operations.create.unknownFieldsPolicy!
var buildCreateValidationMiddleware = function (resource) {
    var validator = ValidatorProvider_1.ValidatorProvider.getValidator(resource);
    var validate = function (req, res, next) {
        var result = validator === null || validator === void 0 ? void 0 : validator.validate(req.body, validator.schemas[resource.name]);
        if (result === null || result === void 0 ? void 0 : result.errors.length) {
            var errReport = result.errors.map(function (e) { return e.property + " " + e.message; });
            req.logger.error('Request failed validation: ' + errReport);
            return res.status(400)
                .json({
                message: 'Bad request: ' + errReport
            }).end();
        }
        return next();
    };
    return validate;
};
exports.buildCreateValidationMiddleware = buildCreateValidationMiddleware;
