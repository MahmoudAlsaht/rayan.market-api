"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrand = exports.getBrands = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const brand_1 = __importDefault(require("../models/brand"));
const image_1 = __importDefault(require("../models/image"));
const utils_1 = require("../utils");
const getBrands = async (req, res, next) => {
    try {
        const brands = await brand_1.default.find()
            .populate('image')
            .populate({
            path: 'products',
            populate: { path: 'productImage' },
        })
            .populate('banner');
        res.status(200).send(brands);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getBrands = getBrands;
const getBrand = async (req, res, next) => {
    try {
        const { brand_id } = req.params;
        const brand = await brand_1.default.findById(brand_id)
            .populate({
            path: 'products',
            populate: { path: 'productImage' },
        })
            .populate('image')
            .populate({
            path: 'banner',
            populate: 'bannerImages',
        });
        res.status(200).send(brand);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
};
exports.getBrand = getBrand;
const createBrand = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { name } = req.body;
        const brand = await new brand_1.default({
            name,
            createdAt: new Date(),
        });
        if (req.file) {
            const { filename, path } = req.file;
            const image = new image_1.default({
                path,
                filename,
                imageType: 'BrandImage',
                doc: brand,
            });
            await image.save();
            brand.image = image;
        }
        await brand.save();
        res.status(200).send(brand);
    }
    catch (e) {
        await (0, utils_1.deleteImage)(req.file?.filename);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { name } = req.body;
        const { brand_id } = req.params;
        const brand = await brand_1.default.findById(brand_id).populate('image');
        if (name !== 'undefined' && name?.length > 0)
            brand.name = name;
        if (req.file) {
            const { filename, path } = req.file;
            if (brand.image) {
                await (0, utils_1.deleteImage)(brand?.image?.filename);
            }
            const image = (await image_1.default.findById(brand?.image?._id)) ||
                new image_1.default({
                    brand,
                    imageType: 'BrandImage',
                    doc: brand,
                });
            image.filename = filename;
            image.path = path;
            await image.save();
            brand.image = image;
        }
        await brand.save();
        res.status(200).send(brand);
    }
    catch (e) {
        await (0, utils_1.deleteImage)(req.file?.filename);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { brand_id } = req.params;
        const brand = await brand_1.default.findById(brand_id).populate('image');
        await (0, utils_1.deleteImage)(brand?.image?.filename);
        await image_1.default.findByIdAndDelete(brand?.image?._id);
        await brand.deleteOne();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.deleteBrand = deleteBrand;
//# sourceMappingURL=brand.js.map