"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BrandSchema = new mongoose_1.Schema({
    name: {
        type: 'string',
        required: true,
        unique: true,
    },
    products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Image',
    },
    createdAt: Date,
});
const Brand = (0, mongoose_1.model)('Brand', BrandSchema);
exports.default = Brand;
//# sourceMappingURL=brand.js.map