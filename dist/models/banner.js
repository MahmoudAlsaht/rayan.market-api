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
    active: {
        type: Boolean,
        default: false,
    },
});
const Banner = (0, mongoose_1.model)('Banner', BannerSchema);
BannerSchema.pre('deleteOne', { document: true, query: false }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield image_1.default.deleteMany({
            _id: {
                $in: this.bannerImages,
            },
        });
    });
});
exports.default = Banner;
//# sourceMappingURL=banner.js.map