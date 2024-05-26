"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryProducts = exports.getCategory = exports.getCategories = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const category_1 = __importDefault(require("../models/category"));
const image_1 = __importDefault(require("../models/image"));
const utils_1 = require("../utils");
const getCategories = async (req, res, next) => {
    try {
        const categories = await category_1.default.find()
            .populate('image')
            .populate({
            path: 'products',
            populate: { path: 'productImage' },
        })
            .populate('banner');
        res.status(200).send(categories);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getCategories = getCategories;
const getCategory = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const category = await category_1.default.findById(category_id)
            .populate({
            path: 'products',
            populate: { path: 'productImage' },
        })
            .populate('image')
            .populate({
            path: 'banner',
            populate: 'bannerImages',
        });
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getCategory = getCategory;
const getCategoryProducts = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const category = await category_1.default.findById(category_id)
            .populate({
            path: 'products',
            populate: { path: 'productImage' },
        })
            .populate('image');
        res.status(200).send(category?.products);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getCategoryProducts = getCategoryProducts;
const createCategory = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error();
        const { name } = req.body;
        const category = await new category_1.default({
            name,
            createdAt: new Date(),
        });
        if (req.file) {
            const { filename, path } = req.file;
            const image = new image_1.default({
                path,
                filename,
                imageType: 'CategoryImage',
                doc: category,
            });
            await image.save();
            category.image = image;
        }
        await category.save();
        res.status(200).send(category);
    }
    catch (e) {
        await (0, utils_1.deleteImage)(req.file?.filename);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error();
        const { name } = req.body;
        const { category_id } = req.params;
        const category = await category_1.default.findById(category_id).populate('image');
        console.log(req.body.name);
        if (name !== 'undefined' && name?.length > 0)
            category.name = name;
        if (req.file) {
            const { filename, path } = req.file;
            if (category.image) {
                await (0, utils_1.deleteImage)(category?.image?.filename);
            }
            const image = (await image_1.default.findById(category?.image?._id)) ||
                new image_1.default({ category });
            image.filename = filename;
            image.path = path;
            await image.save();
            category.image = image;
        }
        await category.save();
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error();
        const { category_id } = req.params;
        const category = await category_1.default.findById(category_id).populate('image');
        await (0, utils_1.deleteImage)(category?.image?.filename);
        await image_1.default.findByIdAndDelete(category?.image?._id);
        await category.deleteOne();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.js.map