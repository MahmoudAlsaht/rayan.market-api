"use strict";
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
const promoCode_1 = __importDefault(require("../models/promoCode"));
const getOrders = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await user_1.default.findById(userId);
        let orders;
        if (user?.role === 'customer') {
            orders = await order_1.default.find({ user: userId });
        }
        else if (user?.role === 'admin' ||
            user?.role === 'staff' ||
            user?.role === 'editor') {
            orders = await order_1.default.find();
        }
        res.status(200).send(orders);
    }
    catch (e) {
        console.error(e.message);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getOrders = getOrders;
const getOrder = async (req, res, next) => {
    try {
        const { order_id } = req.params;
        const order = await order_1.default.findById(order_id)
            .populate('user')
            .populate({
            path: 'contact',
            populate: { path: 'district' },
        });
        console.log(order);
        res.status(200).send(order);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getOrder = getOrder;
const createOrder = async (req, res, next) => {
    try {
        const { products, totalPrice, isUserRegistered, userId, contactId, paymentMethod, promoCode, } = req.body;
        const contact = await contact_1.default.findById(contactId);
        const promo = await promoCode_1.default.findOne({
            code: promoCode,
        });
        const order = new order_1.default({
            totalPrice: promo
                ? (0, utils_1.applyDiscount)(parseFloat(totalPrice), promo?.discount)
                : parseFloat(totalPrice),
            products,
            isUserRegistered,
            contact,
            orderId: (0, utils_1.genOrderId)(),
            paymentMethod,
            promoCode: promo,
        });
        const user = isUserRegistered
            ? await user_1.default.findById(userId)
            : await anonymousUser_1.default.findById(userId);
        order.user = user;
        user.orders.push(order);
        await user.save();
        await order.save();
        for (const product of products) {
            const fetchedProduct = await product_1.default.findById(product?._id);
            fetchedProduct.quantity =
                fetchedProduct.quantity - product?.counter;
            fetchedProduct.numberOfPurchases += 1;
            await fetchedProduct.save();
        }
        await order.save();
        res.status(200).send(order);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res, next) => {
    try {
        const { order_id } = req.params;
        const { updatedStatus, userId } = req.body;
        const user = await user_1.default.findById(userId);
        const order = await order_1.default.findById(order_id).populate('user');
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
        await order.save();
        res.status(200).send(order);
    }
    catch (e) {
        next(new expressError_1.default(e.message, e.status));
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.js.map