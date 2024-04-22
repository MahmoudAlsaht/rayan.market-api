"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const image_1 = __importDefault(require("./image"));
const BannerSchema = new mongoose_1.Schema({
    name: {
        type: 'string',
        required: true,
    },
    bannerImages: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Image',
        },
    ],
    createdAt: {
        type: Date,
        required: true,
    },
    bannerType: {
        type: String,
        default: 'normal',
    },
    doc: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: function () {
            return this.bannerType === 'brand'
                ? 'Brand'
                : this.bannerType === 'category'
                    ? 'Category'
                    : null;
        },
    },
});
const Banner = (0, mongoose_1.model)('Banner', BannerSchema);
BannerSchema.pre('deleteOne', { document: true, query: false }, async function () {
    await image_1.default.deleteMany({
        _id: {
            $in: this.bannerImages,
        },
    });
});
exports.default = Banner;
//# sourceMappingURL=banner.js.map