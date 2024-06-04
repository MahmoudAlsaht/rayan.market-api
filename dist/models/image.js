"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    imageType: {
        type: String,
        required: true,
    },
    doc: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: function () {
            return this.imageType === 'productImage'
                ? 'Product'
                : this.imageType === 'bannerImage'
                    ? 'Banner'
                    : this.imageType === 'CategoryImage'
                        ? 'Category'
                        : this.imageType === 'BrandImage' && 'Brand';
        },
    },
    link: String,
    showForMobile: { type: Boolean, default: false },
});
const Image = (0, mongoose_1.model)('Image', ImageSchema);
exports.default = Image;
//# sourceMappingURL=image.js.map