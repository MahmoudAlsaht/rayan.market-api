"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.applyDiscount = exports.genOrderId = exports.remainingDays = exports.checkIfDateInBetween = exports.checkIfOfferEnded = exports.isCustomer = exports.isStaff = exports.isAdmin = exports.isAuthenticated = exports.checkPassword = exports.genPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const cloudinary_1 = __importDefault(require("../cloudinary"));
const genPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    const hash = await bcrypt_1.default.hash(password, salt);
    return { salt, hash };
};
exports.genPassword = genPassword;
const checkPassword = (password, hash) => {
    if (!bcrypt_1.default.compareSync(password, hash))
        throw new Error('User Credentials are not Valid!');
};
exports.checkPassword = checkPassword;
const isAuthenticated = async (user) => {
    return !user ? false : true;
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = async (user) => {
    return !(0, exports.isAuthenticated)(user)
        ? false
        : user.role === 'admin';
};
exports.isAdmin = isAdmin;
const isStaff = async (user) => {
    return !(0, exports.isAuthenticated)(user)
        ? false
        : user.role === 'staff';
};
exports.isStaff = isStaff;
const isCustomer = async (user) => {
    return !(0, exports.isAuthenticated)(user)
        ? false
        : user.role === 'customer';
};
exports.isCustomer = isCustomer;
const checkIfOfferEnded = (createdAt, expireDate) => {
    const todyDate = new Date();
    const created = new Date(createdAt);
    const diff = todyDate.getTime() - created.getTime();
    const days = diff / (1000 * 3600 * 24);
    return days > expireDate;
};
exports.checkIfOfferEnded = checkIfOfferEnded;
const checkIfDateInBetween = (start, end) => {
    if (!start || !end)
        return false;
    dayjs_1.default.extend(utc_1.default);
    dayjs_1.default.extend(timezone_1.default);
    dayjs_1.default.tz.setDefault('Asia/Amman');
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const currentDate = (0, dayjs_1.default)().format('YYYY-MM-DD');
    const isBetween = new Date(currentDate).getTime() >= startDate &&
        new Date(currentDate).getTime() <= endDate;
    return isBetween;
};
exports.checkIfDateInBetween = checkIfDateInBetween;
const remainingDays = (createdAt, expireDate) => {
    const todyDate = new Date();
    const created = new Date(createdAt);
    const diff = todyDate.getTime() - created.getTime();
    const days = Math.round(diff / (1000 * 3600 * 24));
    return expireDate - days;
};
exports.remainingDays = remainingDays;
const genOrderId = () => {
    let orderId = '';
    for (let i = 0; i < 10; i++) {
        orderId += `${Math.floor(Math.random() * 10)}`;
    }
    return orderId;
};
exports.genOrderId = genOrderId;
function applyDiscount(totalPrice, discountPercentage) {
    const discount = totalPrice * (discountPercentage / 100);
    const discountedTotal = totalPrice - discount;
    return discountedTotal;
}
exports.applyDiscount = applyDiscount;
const deleteImage = async (filename) => {
    try {
        await cloudinary_1.default.uploader.destroy(filename);
    }
    catch (e) {
        console.log(e);
    }
};
exports.deleteImage = deleteImage;
//# sourceMappingURL=index.js.map