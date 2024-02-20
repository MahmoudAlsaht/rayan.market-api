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
exports.genOrderId = exports.remainingDays = exports.checkIfOfferEnded = exports.isCustomer = exports.isStaff = exports.isAdmin = exports.isAuthenticated = exports.checkPassword = exports.genPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const genPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    const hash = yield bcrypt_1.default.hash(password, salt);
    return { salt, hash };
});
exports.genPassword = genPassword;
const checkPassword = (password, hash) => {
    if (!bcrypt_1.default.compareSync(password, hash))
        throw new Error('User Credentials are not Valid!');
};
exports.checkPassword = checkPassword;
const isAuthenticated = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return !user ? false : true;
});
exports.isAuthenticated = isAuthenticated;
const isAdmin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return !(0, exports.isAuthenticated)(user)
        ? false
        : user.role === 'admin';
});
exports.isAdmin = isAdmin;
const isStaff = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return !(0, exports.isAuthenticated)(user)
        ? false
        : user.role === 'staff';
});
exports.isStaff = isStaff;
const isCustomer = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return !(0, exports.isAuthenticated)(user)
        ? false
        : user.role === 'customer';
});
exports.isCustomer = isCustomer;
const checkIfOfferEnded = (createdAt, expireDate) => {
    const todyDate = new Date();
    const created = new Date(createdAt);
    const diff = todyDate.getTime() - created.getTime();
    const days = diff / (1000 * 3600 * 24);
    return days > expireDate;
};
exports.checkIfOfferEnded = checkIfOfferEnded;
const remainingDays = (createdAt, expireDate) => {
    const todyDate = new Date();
    const created = new Date(createdAt);
    const diff = todyDate.getTime() - created.getTime();
    const days = Math.round(diff / (1000 * 3600 * 24));
    console.log(expireDate - days);
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
//# sourceMappingURL=index.js.map