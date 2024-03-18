"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
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
    banner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Banner',
    },
    createdAt: Date,
});
const Category = (0, mongoose_1.model)('Category', CategorySchema);
exports.default = Category;
//# sourceMappingURL=category.js.map