"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpressError extends Error {
    message;
    statusCode;
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.default = ExpressError;
//# sourceMappingURL=expressError.js.map