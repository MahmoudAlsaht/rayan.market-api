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
exports.updateOrderStatus = exports.createOrder = exports.getOrder = exports.getOrders = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const order_1 = __importDefault(require("../models/order"));
const product_1 = __importDefault(require("../models/product"));
const user_1 = __importDefault(require("../models/user"));
const anonymousUser_1 = __importDefault(require("../models/anonymousUser"));
const contact_1 = __importDefault(require("../models/contact"));
const utils_1 = require("../utils");
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        let orders;
        if (userId !== '') {
            orders = yield order_1.default.find({ user: userId });
        }
        else {
            orders = yield order_1.default.find();
        }
        res.status(200).send(orders);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getOrders = getOrders;
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id } = req.params;
        const order = yield order_1.default.findById(order_id)
            .populate('user')
            .populate('contact');
        res.status(200).send(order);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getOrder = getOrder;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { products, totalPrice, isUserRegistered, userId, contactId, } = req.body;
        const contact = yield contact_1.default.findById(contactId);
        const order = new order_1.default({
            totalPrice: parseInt(totalPrice),
            products,
            isUserRegistered,
            contact,
        });
        yield order.save();
        const user = isUserRegistered
            ? yield user_1.default.findById(userId)
            : yield anonymousUser_1.default.findById(userId);
        order.user = user;
        user.orders.push(order);
        yield user.save();
        order.orderId = order === null || order === void 0 ? void 0 : order.id.slice(10);
        for (const product of products) {
            const fetchedProduct = yield product_1.default.findById(product === null || product === void 0 ? void 0 : product._id);
            fetchedProduct.quantity =
                fetchedProduct.quantity - (product === null || product === void 0 ? void 0 : product.counter);
            yield fetchedProduct.save();
        }
        yield order.save();
        res.status(200).send(order);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id } = req.params;
        const { updatedStatus, userId } = req.body;
        const user = yield user_1.default.findById(userId);
        const order = yield order_1.default.findById(order_id).populate('user');
        if (updatedStatus === 'accepted' ||
            updatedStatus === 'rejected' ||
            updatedStatus === 'completed') {
            if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isStaff)(user)) {
                throw new Error('You Are Not Authorized');
            }
        }
        else if (updatedStatus === 'canceled') {
            if (!(0, utils_1.isAuthenticated)(user)) {
                throw new Error('You Are Not Authorized');
            }
        }
        else {
            throw new Error('Unexpected status: ' + updatedStatus);
        }
        order.status = updatedStatus;
        yield order.save();
        res.status(200).send(order);
    }
    catch (e) {
        next(new expressError_1.default(e.message, e.status));
        res.status(404);
    }
});
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.js.map