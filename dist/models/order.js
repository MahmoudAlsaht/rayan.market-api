"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    contact: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Contact',
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: function () {
            return this.isUserRegistered
                ? 'User'
                : 'AnonymousUser';
        },
    },
    products: [
        {
            _id: String,
            imageUrl: String,
            name: String,
            quantity: Number,
            price: Number,
            counter: { type: Number, default: 1 },
        },
    ],
    orderId: String,
    createdAt: { type: Date, default: new Date() },
    status: { type: String, default: 'pending' },
    isUserRegistered: Boolean,
    totalPrice: Number,
});
const Order = (0, mongoose_1.model)('Order', OrderSchema);
exports.default = Order;
//# sourceMappingURL=order.js.map