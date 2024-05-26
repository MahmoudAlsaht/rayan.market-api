"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.updateImageLink = exports.getBannerImage = exports.getBannerImages = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const banner_1 = __importDefault(require("../models/banner"));
const image_1 = __importDefault(require("../models/image"));
const utils_1 = require("../utils");
const getBannerImages = async (req, res, next) => {
    try {
        const { banner_id } = req.params;
        const banner = await banner_1.default.findById(banner_id).populate('bannerImages');
        res.status(200).send(banner?.bannerImages);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.getBannerImages = getBannerImages;
const getBannerImage = async (req, res, next) => {
    try {
        const { image_id } = req.params;
        const image = await image_1.default.findById(image_id);
        res.status(200).send(image);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getBannerImage = getBannerImage;
const updateImageLink = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { image_id, banner_id } = req.params;
        const { link } = req.body;
        await image_1.default.findByIdAndUpdate(image_id, {
            link,
        });
        const banner = await banner_1.default.findById(banner_id).populate('bannerImages');
        res.status(200).send(banner);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updateImageLink = updateImageLink;
const removeImage = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { banner_id, image_id } = req.params;
        const image = await image_1.default.findById(image_id);
        const banner = await banner_1.default.findById(banner_id);
        await (0, utils_1.deleteImage)(image?.filename);
        await banner.updateOne({
            $pull: { bannerImages: image_id },
        });
        await banner.save();
        await image?.deleteOne();
        res.status(200).send(image_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.removeImage = removeImage;
//# sourceMappingURL=bannerImages.js.map