"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.updatePassword = exports.checkResetPassword = exports.generateVerificationCode = exports.createAnonymousUser = exports.verifyAnonymousUserPhone = exports.signin = exports.signupUsernameAndPassword = exports.signupPhoneNumber = exports.getUsers = exports.editUserRole = exports.checkUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const profile_1 = __importDefault(require("../models/profile"));
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const utils_1 = require("../utils");
const anonymousUser_1 = __importDefault(require("../models/anonymousUser"));
const contact_1 = __importDefault(require("../models/contact"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const district_1 = __importDefault(require("../models/district"));
const { SECRET_1 } = process.env;
const checkUser = async (req, res, next) => {
    try {
        const { user } = req;
        res.status(200).send({
            username: user?.username,
            phone: user?.phone,
            role: user?.role,
            profile: user?.profile,
            _id: user?._id,
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.checkUser = checkUser;
const editUserRole = async (req, res, next) => {
    try {
        const admin = req.user;
        if (!(0, utils_1.isAdmin)(admin))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { userId, role } = req.body;
        const user = await user_1.default.findById(userId);
        if (user)
            user.role = role;
        await user.save();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.editUserRole = editUserRole;
const getUsers = async (req, res, next) => {
    try {
        const admin = req.user;
        if (!(0, utils_1.isAdmin)(admin))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const users = await user_1.default.find();
        const usersWithoutPasswords = users.map((user) => {
            return {
                username: user?.username,
                phone: user?.phone,
                role: user?.role,
                profile: user?.profile,
                _id: user?._id,
            };
        });
        res.status(200).send(usersWithoutPasswords);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getUsers = getUsers;
const signupPhoneNumber = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const user = (await user_1.default.findOne({ phone }).populate('profile')) ||
            (await new user_1.default({
                phone,
            }).populate('profile'));
        const profile = (await profile_1.default?.findById(user?.profile?._id)) ||
            (await new profile_1.default());
        profile.user = user;
        user.profile = profile?.id;
        user.verificationCode = (0, utils_1.generateRandomSixDigit)();
        await user.save();
        await profile.save();
        await (0, utils_1.sendVerificationCode)(user?.verificationCode, user?.phone);
        res.status(200).send({
            userId: user?._id,
            verificationCode: user?.verificationCode,
        });
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.signupPhoneNumber = signupPhoneNumber;
const signupUsernameAndPassword = async (req, res, next) => {
    try {
        const { username, password, userId, verificationCode } = req.body;
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (username.search(usernameRegrex) !== -1) {
            throw new Error('Invalid username');
        }
        const user = await user_1.default?.findById(userId);
        if (user == null)
            throw new Error('Some thing went wrong');
        if (user?.verificationCode !== verificationCode)
            throw new Error('Invalid User Credentials');
        user.verificationCode = null;
        user.username = username;
        user.password = await (0, utils_1.genPassword)(password);
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user?._id, name: user?.username }, SECRET_1);
        res.status(200).send({
            token,
            user: {
                username: user?.username,
                phone: user?.phone,
                role: user?.role,
                profile: user?.profile,
                _id: user?._id,
            },
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.signupUsernameAndPassword = signupUsernameAndPassword;
const signin = async (req, res, next) => {
    try {
        const { phone, password } = req.body;
        const user = await user_1.default.findOne({ phone });
        if (user == null)
            throw new Error('Invalid User Credentials');
        (0, utils_1.checkPassword)(password, user?.password.hash);
        const token = jsonwebtoken_1.default.sign({ id: user?._id, name: user?.username }, SECRET_1);
        res.status(200).send({
            token,
            user: {
                username: user?.username,
                phone: user?.phone,
                role: user?.role,
                profile: user?.profile,
                _id: user?._id,
            },
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.signin = signin;
const verifyAnonymousUserPhone = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const anonymousUser = (await anonymousUser_1.default.findOne({ phone })) ||
            new anonymousUser_1.default({
                phone,
            });
        anonymousUser.verificationCode =
            (0, utils_1.generateRandomSixDigit)();
        await anonymousUser.save();
        await (0, utils_1.sendVerificationCode)(anonymousUser?.verificationCode, anonymousUser?.phone);
        res.status(200).send({
            userId: anonymousUser?._id,
            verificationCode: anonymousUser?.verificationCode,
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.verifyAnonymousUserPhone = verifyAnonymousUserPhone;
const createAnonymousUser = async (req, res, next) => {
    try {
        const { name, districtId, verificationCode, userId } = req.body;
        const anonymousUser = await anonymousUser_1.default.findById(userId).populate('contact');
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (name.search(usernameRegrex) !== -1) {
            throw new Error('Invalid username');
        }
        const district = await district_1.default.findById(districtId);
        const contact = (await contact_1.default.findById(anonymousUser?.contact?._id)) || new contact_1.default();
        contact.district = district;
        contact.contactNumber = anonymousUser?.phone;
        await contact.save();
        anonymousUser.username = name;
        anonymousUser.contact = contact;
        if (anonymousUser?.verificationCode !== verificationCode)
            throw new Error('Invalid Code');
        anonymousUser.verificationCode = null;
        await anonymousUser.save();
        res.status(200).send(anonymousUser);
    }
    catch (e) {
        console.error(e);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createAnonymousUser = createAnonymousUser;
const generateVerificationCode = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const user = await user_1.default.findOne({ phone });
        if (user == null)
            throw new Error('Invalid User Credentials');
        user.verificationCode = (0, utils_1.generateRandomSixDigit)();
        await user.save();
        await (0, utils_1.sendVerificationCode)(user?.verificationCode, user?.phone);
        res.status(200).send(user?._id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.generateVerificationCode = generateVerificationCode;
const checkResetPassword = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { verificationCode } = req.body;
        const user = await user_1.default.findById(user_id);
        if (user == null)
            throw new Error('Invalid User Credentials');
        if (user?.verificationCode !== verificationCode)
            throw new Error('Invalid Code');
        user.verificationCode = null;
        await user.save();
        res.status(200).send();
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.checkResetPassword = checkResetPassword;
const updatePassword = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { password, passwordConfirmation } = req.body;
        const user = await user_1.default.findById(user_id);
        if (user == null)
            throw new Error('Invalid User Credentials');
        if (passwordConfirmation !== password ||
            passwordConfirmation === '' ||
            password === '' ||
            passwordConfirmation == null ||
            password == null)
            throw new Error('Invalid Password');
        user.password = await (0, utils_1.genPassword)(password);
        await user.save();
        res.status(200).send();
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updatePassword = updatePassword;
const createUser = async (req, res, next) => {
    try {
        const admin = req.user;
        if (!(0, utils_1.isAdmin)(admin))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { username, phone, password, role } = req.body;
        const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;
        if (username.search(usernameRegrex) !== -1) {
            throw new Error('Invalid username');
        }
        const user = await new user_1.default({
            phone,
            username,
            email: null,
            password: await (0, utils_1.genPassword)(password),
            role,
        });
        const profile = await new profile_1.default({
            user,
        });
        user.profile = profile?.id;
        await user.save();
        await profile.save();
        res.status(200).send({
            username: user?.username,
            phone: user?.phone,
            role: user?.role,
            profile: profile?.id,
            _id: user?._id,
        });
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createUser = createUser;
//# sourceMappingURL=user.js.map