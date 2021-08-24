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
exports.fixtureAuthenticator = exports.mockAuthenticator = void 0;
var userA = {
    id: 'userAID',
    name: 'userA'
};
var userB = {
    id: 'userBID',
    name: 'userB'
};
var userC = {
    id: 'userCID',
    name: 'userC'
};
var adminUser = {
    id: 'adminID',
    name: 'admin',
    role: 'ADMIN',
};
var superUser = {
    id: 'superUserID',
    name: 'super user',
    role: 'SUPER_USER'
};
var mockAuthenticator = function (req, res, next) {
    var mockToken = (req.headers['authorization'] || 'NONE');
    var users = {
        userA: userA,
        userB: userB,
        userC: userC,
        adminUser: adminUser,
        superUser: superUser,
    };
    req.user = users[mockToken];
    next();
};
exports.mockAuthenticator = mockAuthenticator;
var fixtureAuthenticator = function (userFixtures) { return function (req, res, next) {
    var mockToken = (req.headers['authorization'] || 'NONE');
    var users = {};
    userFixtures.forEach(function (user) { return users[user.name] = __assign(__assign({}, user), { id: user._id.toString() }); });
    req.user = users[mockToken];
    next();
}; };
exports.fixtureAuthenticator = fixtureAuthenticator;
