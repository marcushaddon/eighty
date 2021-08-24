"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAuthorization = void 0;
var errors_1 = require("../errors");
var inGroup = function (config) { return ({
    pre: function inGroup(user) {
        var groupConfig = config;
        var singleGroup = user.group === groupConfig.group;
        var multipleGroups = !!user.groups && user.groups.indexOf(groupConfig.group) > -1;
        return singleGroup || multipleGroups;
    }
}); };
var hasRole = function (config) { return ({
    pre: function hasRole(user) {
        var roleConfig = config;
        var singleRole = user.role === roleConfig.role;
        var multipleRoles = !!user.roles && user.roles.indexOf(roleConfig.role) > -1;
        return singleRole || multipleRoles;
    }
}); };
var isResource = function (config) { return ({
    post: function isResource(user, resource) { return user.id === resource.id; },
}); };
var isOwner = function (config) { return ({
    post: function isOwner(user, resource) { return user.id === resource.createdBy; }
}); };
var checkBuilders = {
    inGroup: inGroup,
    hasRole: hasRole,
    isResource: isResource,
    isOwner: isOwner,
};
var and = function (prev, current) { return prev && current; };
var or = function (prev, current) { return prev || current; };
var explainPass = function (checks, results, mode) {
    var quantifier = mode === 'allOf' ? 'all' : 'one or more';
    var explaination = "Passed " + quantifier + " auth checks. Passed: ";
    var passed = checks
        .map(function (check) { return "\"" + check.name + "\""; })
        .filter(function (_, i) { return results[i]; })
        .join(', ');
    explaination += passed;
    return explaination;
};
var explainFail = function (checks, results, mode) {
    var quantifier = mode === 'allOf' ? 'all' : 'one or more';
    var explaination = "Failed to pass " + quantifier + " auth checks. Failed: ";
    var failed = checks
        .map(function (check) { return "\"" + check.name + "\""; })
        .filter(function (_, i) { return !results[i]; })
        .join(', ');
    explaination += failed;
    return explaination;
};
var buildAuthorization = function (resource, config) {
    var mode = 'allOf' in config ? 'allOf' : 'anyOf'; // We can assume only one is set
    var checkFuncs = config[mode].map(function (checkConfig) { return checkBuilders[checkConfig.type](checkConfig); });
    var preChecks = checkFuncs.map(function (_a) {
        var pre = _a.pre;
        return pre;
    }).filter(function (check) { return !!check; });
    var postChecks = checkFuncs.map(function (_a) {
        var post = _a.post;
        return post;
    }).filter(function (check) { return !!check; });
    var authorize = function (req, res, next) {
        if (preChecks.length > 0) {
            var user_1 = req.user;
            var results = preChecks.map(function (check) { return check(user_1); });
            var passPreCheck = results.reduce(mode === 'allOf' ? and : or);
            var explaination = void 0;
            if (passPreCheck) {
                explaination = explainPass(preChecks, results, mode);
            }
            else {
                explaination = explainFail(preChecks, results, mode);
            }
            if (!passPreCheck) {
                req.logger.error('Request failed authorization check: ' + explaination);
                return res.status(403).send({ message: explaination }).end();
            }
            req.logger.info('Request passed authorization check: ' + explaination);
        }
        if (postChecks.length === 0) {
            next();
        }
        req.authorizer = function (user, resource) {
            var results = postChecks.map(function (check) { return check(user, resource); });
            var passPostCheck = results.reduce(mode === 'allOf' ? and : or);
            var explaination;
            if (passPostCheck) {
                explaination = explainPass(postChecks, results, mode);
            }
            else {
                explaination = explainFail(postChecks, results, mode);
            }
            if (!passPostCheck) {
                req.logger.error('Request failed authorization check: ' + explaination);
                throw new errors_1.AuthorizationError("Forbidden: " + explaination);
            }
        };
        next();
    };
    return authorize;
};
exports.buildAuthorization = buildAuthorization;
