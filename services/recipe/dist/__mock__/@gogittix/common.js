"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.BadRequestError = exports.NotAuthorizedError = exports.requireAuth = exports.currentUser = void 0;
const currentUser = (req, res, next) => {
    req.currentUser = { id: "test-user-id" }; // ✅ Fake user for tests
    next();
};
exports.currentUser = currentUser;
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        return res.status(401).json({ error: "Unauthorized request" });
    }
    next();
};
exports.requireAuth = requireAuth;
class NotAuthorizedError extends Error {
    constructor() {
        super("Not authorized");
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
