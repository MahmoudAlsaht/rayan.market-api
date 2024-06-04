"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductOptionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
    },
    optionName: String,
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
    price: {
        type: Number,
    },
    quantity: { type: Number },
});
const ProductOption = (0, mongoose_1.model)('ProductOption', ProductOptionSchema);
exports.default = ProductOption;
//# sourceMappingURL=productOption.js.map