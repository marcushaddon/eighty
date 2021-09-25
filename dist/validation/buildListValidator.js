"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildListValidationMiddleware = void 0;
var _1 = require(".");
var filterPageFields = function (fields) {
    delete fields['count'];
    delete fields['skip'];
    delete fields['sort'];
    delete fields['order'];
    return fields;
};
var buildListValidationMiddleware = function (resource) {
    // BOOKMARK
    var validateListParams = function (req, res, next) {
        var _a, _b;
        var queryParams = req.query;
        var countParam = queryParams.count, skipParam = queryParams.skip, sort = queryParams.sort, order = queryParams.order;
        var count = countParam && parseInt(countParam) || 20;
        var skip = skipParam && parseInt(skipParam) || 0;
        req.count = count;
        req.skip = skip;
        req.sort = sort;
        req.order = order;
        var filteredFitlers = filterPageFields(queryParams);
        var policy = ((_b = (_a = resource.operations) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.unknownFieldsPolicy) || 'reject';
        try {
            var filtersWithCorrectedTypes = _1.correctTypes(filteredFitlers, resource, policy);
            req.filters = filtersWithCorrectedTypes;
        }
        catch (e) {
            req.logger.error('Encountered error resolving filter types', e);
            return res.status(e.status || 500)
                .send({ message: e.message || 'Internal server error' })
                .end();
        }
        // TODO: validate filters (ie accept 'in', 'gte', etc but reject 'foo' as invalid and 'contains' as unupported in current version)
        next();
    };
    return validateListParams;
};
exports.buildListValidationMiddleware = buildListValidationMiddleware;
