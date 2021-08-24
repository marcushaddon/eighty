"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = void 0;
var ensureAuthenticated = function (req, res, next) {
    if (!req.user) {
        req.logger.error('User must be authenticated');
        return res.status(401).send({ message: 'Unauthorized' }).end();
    }
    next();
};
exports.ensureAuthenticated = ensureAuthenticated;
