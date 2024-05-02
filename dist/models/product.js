"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const image_1 = __importDefault(require("./image"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: 'string',
        required: true,
    },
    productImage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Image',
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Brand',
    },
    createdAt: Date,
    lastModified: Date,
    price: {
        type: Number,
        required: true,
    },
    newPrice: Number,
    quantity: { type: Number, required: true },
    isOffer: { type: Boolean, default: false },
    isEndDate: { type: Boolean, default: false },
    offerExpiresDate: { type: Number, default: 0 },
    startOfferDate: String,
    endOfferDate: String,
    remaining: Number,
    views: { type: Number, default: 0 },
    numberOfPurchases: { type: Number, default: 0 },
    labels: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Label' }],
});
const Product = (0, mongoose_1.model)('Product', ProductSchema);
ProductSchema.pre('deleteOne', { document: true, query: false }, async function () {
    await image_1.default.deleteOne({
        _id: {
            $in: this.productImage,
        },
    });
});
exports.default = Product;
//# sourceMappingURL=product.js.map