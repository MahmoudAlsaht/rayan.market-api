"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnonymousUser = exports.signin = exports.signup = exports.checkUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const profile_1 = __importDefault(require("../models/profile"));
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const utils_1 = require("../utils");
const anonymousUser_1 = __importDefault(require("../models/anonymousUser"));
const contact_1 = __importDefault(require("../models/contact"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { SECRET_1 } = process.env;
const checkUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            throw new Error();
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_1);
        const user = yield user_1.default.findById(decoded.id);
        res.status(200).send({
            username: user === null || user === void 0 ? void 0 : user.username,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            role: user === null || user === void 0 ? void 0 : user.role,
            profile: user === null || user === void 0 ? void 0 : user.profile,
            _id: user === null || user === void 0 ? void 0 : user._id,
        });
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.checkUser = checkUser;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, phone, password } = req.body;
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (username.search(usernameRegrex) !== -1) {
            throw new Error('Invalid username');
        }
        const user = yield new user_1.default({
            phone,
            username,
            email: null,
            password: yield (0, utils_1.genPassword)(password),
        });
        const profile = yield new profile_1.default({
            user,
        });
        user.profile = profile === null || profile === void 0 ? void 0 : profile.id;
        yield user.save();
        yield profile.save();
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id, name: user === null || user === void 0 ? void 0 : user.username }, SECRET_1);
        res.status(200).send({
            token,
            user: {
                username: user === null || user === void 0 ? void 0 : user.username,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                role: user === null || user === void 0 ? void 0 : user.role,
                profile: profile === null || profile === void 0 ? void 0 : profile.id,
                _id: user === null || user === void 0 ? void 0 : user._id,
            },
        });
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, password } = req.body;
        const user = yield user_1.default.findOne({ phone });
        if (user == null)
            throw new Error('Invalid User Credentials');
        (0, utils_1.checkPassword)(password, user === null || user === void 0 ? void 0 : user.password.hash);
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id, name: user === null || user === void 0 ? void 0 : user.username }, SECRET_1);
        res.status(200).send({
            token,
            user: {
                username: user === null || user === void 0 ? void 0 : user.username,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                role: user === null || user === void 0 ? void 0 : user.role,
                profile: user === null || user === void 0 ? void 0 : user.profile,
                _id: user === null || user === void 0 ? void 0 : user._id,
            },
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
});
exports.signin = signin;
const createAnonymousUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, city, street, phone } = req.body;
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (name.search(usernameRegrex) !== -1) {
            throw new Error('Invalid username');
        }
        const contact = new contact_1.default({
            address: {
                city,
                street,
            },
            contactNumber: phone,
        });
        yield contact.save();
        const anonymousUser = yield new anonymousUser_1.default({
            phone,
            username: name,
            contact,
        }).populate('contact');
        yield anonymousUser.save();
        res.status(200).send(anonymousUser);
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
    }
});
exports.createAnonymousUser = createAnonymousUser;
//# sourceMappingURL=user.js.map