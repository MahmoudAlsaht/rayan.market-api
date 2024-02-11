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
exports.removeAccount = exports.uploadProfileImage = exports.updateUserPassword = exports.updateUserEmailAndUsername = exports.fetchProfile = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const profile_1 = __importDefault(require("../models/profile"));
const user_1 = __importDefault(require("../models/user"));
const image_1 = __importDefault(require("../models/image"));
const utils_1 = require("../utils");
const destroyFile_1 = require("../firebase/firestore/destroyFile");
const fetchProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profile_id } = req.params;
        const profile = yield profile_1.default.findById(profile_id)
            .populate({ path: 'user' })
            .populate({ path: 'profileImage' });
        res.status(200).send(profile);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404).send({ error: e.message });
    }
});
exports.fetchProfile = fetchProfile;
const updateUserEmailAndUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { profile_id } = req.params;
        const { email, username, password } = req.body;
        const profile = yield profile_1.default.findById(profile_id)
            .populate({ path: 'user' })
            .populate({ path: 'profileImage' });
        const user = yield user_1.default.findById((_a = profile === null || profile === void 0 ? void 0 : profile.user) === null || _a === void 0 ? void 0 : _a._id);
        (0, utils_1.checkPassword)(password, (_b = user === null || user === void 0 ? void 0 : user.password) === null || _b === void 0 ? void 0 : _b.hash);
        if (email && email.length > 0)
            user.email = email;
        if (username && username.length > 0)
            user.username = username;
        yield user.save();
        res.status(200).send({
            username: user === null || user === void 0 ? void 0 : user.username,
            email: user === null || user === void 0 ? void 0 : user.email,
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
exports.updateUserEmailAndUsername = updateUserEmailAndUsername;
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
const uploadProfileImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const { profile_id } = req.params;
        const { password, imageURL } = req.body;
        const profile = yield profile_1.default.findById(profile_id)
            .populate({ path: 'user' })
            .populate({ path: 'profileImage' });
        const user = yield user_1.default.findById((_e = profile === null || profile === void 0 ? void 0 : profile.user) === null || _e === void 0 ? void 0 : _e._id);
        (0, utils_1.checkPassword)(password, (_f = user === null || user === void 0 ? void 0 : user.password) === null || _f === void 0 ? void 0 : _f.hash);
        if (imageURL && imageURL.length > 0) {
            const image = yield new image_1.default({
                path: imageURL,
                filename: `profilesImages/${profile === null || profile === void 0 ? void 0 : profile._id}'s-Image`,
                imageType: 'profileImage',
                doc: profile,
            });
            yield image.save();
            profile.profileImage = image;
            yield profile.save();
        }
        res.status(200).send(profile);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.uploadProfileImage = uploadProfileImage;
const removeAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j;
    try {
        const { profile_id } = req.params;
        const { password } = req.body;
        const profile = yield profile_1.default.findById(profile_id)
            .populate({ path: 'profileImage' })
            .populate({ path: 'user' });
        const user = yield user_1.default.findById((_g = profile === null || profile === void 0 ? void 0 : profile.user) === null || _g === void 0 ? void 0 : _g._id);
        (0, utils_1.checkPassword)(password, (_h = user === null || user === void 0 ? void 0 : user.password) === null || _h === void 0 ? void 0 : _h.hash);
        const profileImage = yield image_1.default.findById((_j = profile === null || profile === void 0 ? void 0 : profile.profileImage) === null || _j === void 0 ? void 0 : _j._id);
        if (profileImage) {
            yield (0, destroyFile_1.deleteImage)(profileImage === null || profileImage === void 0 ? void 0 : profileImage.filename);
            yield (profileImage === null || profileImage === void 0 ? void 0 : profileImage.deleteOne());
        }
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