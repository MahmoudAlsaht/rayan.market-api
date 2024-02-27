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
exports.removeImage = exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrandProducts = exports.getBrand = exports.getBrands = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const brand_1 = __importDefault(require("../models/brand"));
const image_1 = __importDefault(require("../models/image"));
const destroyFile_1 = require("../firebase/firestore/destroyFile");
const getBrands = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield brand_1.default.find()
            .populate('image')
            .populate('products');
        res.status(200).send(brands);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getBrands = getBrands;
const getBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brand_id } = req.params;
        const brand = yield brand_1.default.findById(brand_id)
            .populate('products')
            .populate('image');
        res.status(200).send(brand);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getBrand = getBrand;
const getBrandProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brand_id } = req.params;
        const brand = yield brand_1.default.findById(brand_id)
            .populate('products')
            .populate('image');
        res.status(200).send(brand === null || brand === void 0 ? void 0 : brand.products);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getBrandProducts = getBrandProducts;
const createBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, imageUrl } = req.body;
        const brand = yield new brand_1.default({
            name,
            createdAt: new Date(),
        });
        if (imageUrl) {
            const image = new image_1.default({
                path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                filename: `brands/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                imageType: 'BrandImage',
                doc: brand,
            });
            yield image.save();
            brand.image = image;
        }
        yield brand.save();
        res.status(200).send(brand);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.createBrand = createBrand;
const updateBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, imageUrl } = req.body;
        const { brand_id } = req.params;
        const brand = yield brand_1.default.findById(brand_id).populate('image');
        if (name && (name === null || name === void 0 ? void 0 : name.length) > 0)
            brand.name = name;
        if (imageUrl) {
            if (brand.image) {
                yield (0, destroyFile_1.deleteImage)((_a = brand === null || brand === void 0 ? void 0 : brand.image) === null || _a === void 0 ? void 0 : _a.filename);
                yield image_1.default.findByIdAndDelete((_b = brand === null || brand === void 0 ? void 0 : brand.image) === null || _b === void 0 ? void 0 : _b._id);
            }
            const image = new image_1.default({
                path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                filename: `brands/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                imageType: 'BrandImage',
                doc: brand,
            });
            yield image.save();
            brand.image = image;
        }
        yield brand.save();
        res.status(200).send(brand);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.updateBrand = updateBrand;
const deleteBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { brand_id } = req.params;
        const brand = yield brand_1.default.findById(brand_id).populate('image');
        yield (0, destroyFile_1.deleteImage)((_c = brand === null || brand === void 0 ? void 0 : brand.image) === null || _c === void 0 ? void 0 : _c.filename);
        yield image_1.default.findByIdAndDelete((_d = brand === null || brand === void 0 ? void 0 : brand.image) === null || _d === void 0 ? void 0 : _d._id);
        yield brand.deleteOne();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.deleteBrand = deleteBrand;
const removeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const { brand_id } = req.params;
        const brand = yield brand_1.default.findById(brand_id).populate('image');
        const imageId = (_e = brand === null || brand === void 0 ? void 0 : brand.image) === null || _e === void 0 ? void 0 : _e._id;
        yield (0, destroyFile_1.deleteImage)((_f = brand === null || brand === void 0 ? void 0 : brand.image) === null || _f === void 0 ? void 0 : _f.filename);
        brand.image = null;
        yield brand.save();
        res.status(200).send(imageId);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.removeImage = removeImage;
//# sourceMappingURL=brand.js.map