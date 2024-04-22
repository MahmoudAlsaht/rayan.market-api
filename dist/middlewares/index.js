"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expressError_1 = __importDefault(require("./expressError"));
const { SECRET_1, SECRET_2 } = process.env;
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            res.sendStatus(403);
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_1);
        req.token = decoded;
    }
    catch (e) {
        console.error(e.message);
        next(new expressError_1.default(e.message, 403));
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=index.js.map