"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.getBanner = exports.createBanner = exports.getBanners = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const banner_1 = __importDefault(require("../models/banner"));
const image_1 = __importDefault(require("../models/image"));
const utils_1 = require("../utils");
const brand_1 = __importDefault(require("../models/brand"));
const category_1 = __importDefault(require("../models/category"));
const getBanners = async (req, res, next) => {
    try {
        const banners = await banner_1.default.find().populate('bannerImages');
        res.status(200).send(banners);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.getBanners = getBanners;
const createBanner = async (req, res, next) => {
    try {
        const { name, imagesUrls, type, category, brand } = req.body;
        const doc = type === 'brand'
            ? await brand_1.default.findById(brand)
            : type === 'category'
                ? await category_1.default.findById(category)
                : null;
        const banner = new banner_1.default({
            name,
            bannerType: type,
            doc,
            createdAt: new Date(),
        });
        if (doc) {
            doc.banner = banner;
            await doc.save();
        }
        if (req.files) {
            for (const file of req.files) {
                const { filename, path } = file;
                const image = new image_1.default({
                    path,
                    filename,
                    imageType: 'bannerImages',
                    doc: banner,
                });
                await image.save();
                banner.bannerImages.push(image);
            }
        }
        await banner.save();
        res.status(200).send(banner);
    }
    catch (e) {
        for (const file of req.files) {
            await (0, utils_1.deleteImage)(req.file?.filename);
        }
        console.log(e);
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.createBanner = createBanner;
const getBanner = async (req, res, next) => {
    try {
        const { banner_id } = req.params;
        const banner = await banner_1.default.findById(banner_id).populate('bannerImages');
        res.status(200).send(banner);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.getBanner = getBanner;
const updateBanner = async (req, res, next) => {
    try {
        const { banner_id } = req.params;
        const { name } = req.body;
        const banner = await banner_1.default.findById(banner_id).populate('bannerImages');
        if (name)
            banner.name = name;
        if (req.files) {
            for (const file of req.files) {
                const { filename, path } = file;
                const image = await new image_1.default({
                    path,
                    filename,
                    imageType: 'bannerImages',
                    doc: banner,
                });
                await image.save();
                banner.bannerImages.push(image);
            }
        }
        await banner.save();
        res.status(200).send(banner);
    }
    catch (e) {
        for (const file of req.files) {
            await (0, utils_1.deleteImage)(req.file?.filename);
        }
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res, next) => {
    try {
        const { banner_id } = req.params;
        const banner = await banner_1.default.findById(banner_id).populate('bannerImages');
        for (const image of banner?.bannerImages) {
            await (0, utils_1.deleteImage)(image?.filename);
            await image_1.default.findByIdAndDelete(image?._id);
        }
        await banner.deleteOne();
        res.status(200).send(banner_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=banner.js.map