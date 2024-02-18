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
exports.removeAccount = exports.updateUserPassword = exports.updateUserPhoneAndUsername = exports.fetchProfile = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const profile_1 = __importDefault(require("../models/profile"));
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils");
const fetchProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profile_id } = req.params;
        const profile = yield profile_1.default.findById(profile_id).populate({ path: 'user' });
        res.status(200).send(profile);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
});
exports.fetchProfile = fetchProfile;
const updateUserPhoneAndUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { profile_id } = req.params;
        const { phone, username, password } = req.body;
        const profile = yield profile_1.default.findById(profile_id).populate({ path: 'user' });
        const user = yield user_1.default.findById((_a = profile === null || profile === void 0 ? void 0 : profile.user) === null || _a === void 0 ? void 0 : _a._id);
        (0, utils_1.checkPassword)(password, (_b = user === null || user === void 0 ? void 0 : user.password) === null || _b === void 0 ? void 0 : _b.hash);
        if (phone && phone.length > 0)
            user.phone = phone;
        if (username && username.length > 0)
            user.username = username;
        yield user.save();
        res.status(200).send({
            username: user === null || user === void 0 ? void 0 : user.username,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
            profile: profile === null || profile === void 0 ? void 0 : profile._id,
            id: user === null || user === void 0 ? void 0 : user._id,
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
});
exports.updateUserPhoneAndUsername = updateUserPhoneAndUsername;
const updateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { profile_id } = req.params;
        const { newPassword, currentPassword } = req.body;
        const profile = yield profile_1.default.findById(profile_id).populate({ path: 'user' });
        const user = yield user_1.default.findById((_c = profile === null || profile === void 0 ? void 0 : profile.user) === null || _c === void 0 ? void 0 : _c._id);
        (0, utils_1.checkPassword)(currentPassword, (_d = user === null || user === void 0 ? void 0 : user.password) === null || _d === void 0 ? void 0 : _d.hash);
        if (newPassword)
            user.password = yield (0, utils_1.genPassword)(newPassword);
        yield user.save();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
});
exports.updateUserPassword = updateUserPassword;
const removeAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const { profile_id } = req.params;
        const { password } = req.body;
        const profile = yield profile_1.default.findById(profile_id).populate({ path: 'user' });
        const user = yield user_1.default.findById((_e = profile === null || profile === void 0 ? void 0 : profile.user) === null || _e === void 0 ? void 0 : _e._id);
        (0, utils_1.checkPassword)(password, (_f = user === null || user === void 0 ? void 0 : user.password) === null || _f === void 0 ? void 0 : _f.hash);
        yield (user === null || user === void 0 ? void 0 : user.deleteOne());
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.removeAccount = removeAccount;
//# sourceMappingURL=profile.js.map