"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expressError_1 = __importDefault(require("./expressError"));
const user_1 = __importDefault(require("../models/user"));
const { SECRET_1 } = process.env;
const checkUserToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            throw new Error();
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_1);
        const user = await user_1.default.findById(decoded.id);
        if (!user)
            throw new Error('YOU ARE NOT AUTHORIZED');
        else
            req.user = user;
        next();
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.checkUserToken = checkUserToken;
//# sourceMappingURL=index.js.map