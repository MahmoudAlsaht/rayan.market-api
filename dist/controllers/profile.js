"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAccount = exports.updateUserPassword = exports.updateUserPhoneAndUsername = exports.fetchProfile = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const profile_1 = __importDefault(require("../models/profile"));
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils");
const fetchProfile = async (req, res, next) => {
    try {
        const { profile_id } = req.params;
        const profile = await profile_1.default.findById(profile_id).populate({ path: 'user' });
        res.status(200).send(profile);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
};
exports.fetchProfile = fetchProfile;
const updateUserPhoneAndUsername = async (req, res, next) => {
    try {
        const { profile_id } = req.params;
        const { phone, username } = req.body;
        const profile = await profile_1.default.findById(profile_id).populate({ path: 'user' });
        const user = await user_1.default.findById(profile?.user?._id);
        if (phone && phone.length > 0)
            user.phone = phone;
        if (username && username.length > 0)
            user.username = username;
        await user.save();
        res.status(200).send({
            username: user?.username,
            phone: user?.phone,
            role: user?.role,
            profile: profile?._id,
            id: user?._id,
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
};
exports.updateUserPhoneAndUsername = updateUserPhoneAndUsername;
const updateUserPassword = async (req, res, next) => {
    try {
        const { profile_id } = req.params;
        const { newPassword, currentPassword } = req.body;
        const profile = await profile_1.default.findById(profile_id).populate({ path: 'user' });
        const user = await user_1.default.findById(profile?.user?._id);
        (0, utils_1.checkPassword)(currentPassword, user?.password?.hash);
        if (newPassword)
            user.password = await (0, utils_1.genPassword)(newPassword);
        await user.save();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
};
exports.updateUserPassword = updateUserPassword;
const removeAccount = async (req, res, next) => {
    try {
        const { profile_id } = req.params;
        const { password } = req.body;
        const profile = await profile_1.default.findById(profile_id).populate({ path: 'user' });
        const user = await user_1.default.findById(profile?.user?._id);
        (0, utils_1.checkPassword)(password, user?.password?.hash);
        await user?.deleteOne();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
};
exports.removeAccount = removeAccount;
//# sourceMappingURL=profile.js.map