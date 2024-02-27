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
exports.removeImage = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryProducts = exports.getCategory = exports.getCategories = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const category_1 = __importDefault(require("../models/category"));
const image_1 = __importDefault(require("../models/image"));
const destroyFile_1 = require("../firebase/firestore/destroyFile");
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find()
            .populate('image')
            .populate('products');
        res.status(200).send(categories);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getCategories = getCategories;
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id)
            .populate('products')
            .populate('image');
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getCategory = getCategory;
const getCategoryProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id)
            .populate('products')
            .populate('image');
        res.status(200).send(category === null || category === void 0 ? void 0 : category.products);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getCategoryProducts = getCategoryProducts;
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, imageUrl } = req.body;
        const category = yield new category_1.default({
            name,
            createdAt: new Date(),
        });
        if (imageUrl) {
            const image = new image_1.default({
                path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                filename: `categories/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                imageType: 'CategoryImage',
                doc: category,
            });
            yield image.save();
            category.image = image;
        }
        yield category.save();
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, imageUrl } = req.body;
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id).populate('image');
        if (name && (name === null || name === void 0 ? void 0 : name.length) > 0)
            category.name = name;
        if (imageUrl) {
            if (category.image) {
                yield (0, destroyFile_1.deleteImage)((_a = category === null || category === void 0 ? void 0 : category.image) === null || _a === void 0 ? void 0 : _a.filename);
                yield image_1.default.findByIdAndDelete((_b = category === null || category === void 0 ? void 0 : category.image) === null || _b === void 0 ? void 0 : _b._id);
            }
            const image = new image_1.default({
                path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                filename: `categories/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                imageType: 'CategoryImage',
                doc: category,
            });
            yield image.save();
            category.image = image;
        }
        yield category.save();
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id).populate('image');
        yield (0, destroyFile_1.deleteImage)((_c = category === null || category === void 0 ? void 0 : category.image) === null || _c === void 0 ? void 0 : _c.filename);
        yield image_1.default.findByIdAndDelete((_d = category === null || category === void 0 ? void 0 : category.image) === null || _d === void 0 ? void 0 : _d._id);
        yield category.deleteOne();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.deleteCategory = deleteCategory;
const removeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id).populate('image');
        const imageId = (_e = category === null || category === void 0 ? void 0 : category.image) === null || _e === void 0 ? void 0 : _e._id;
        yield (0, destroyFile_1.deleteImage)((_f = category === null || category === void 0 ? void 0 : category.image) === null || _f === void 0 ? void 0 : _f.filename);
        category.image = null;
        yield category.save();
        res.status(200).send(imageId);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.removeImage = removeImage;
//# sourceMappingURL=category.js.map