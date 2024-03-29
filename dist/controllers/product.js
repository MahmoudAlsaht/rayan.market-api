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
exports.deleteProduct = exports.updateProductViews = exports.updateProduct = exports.getProduct = exports.createProduct = exports.filterProducts = exports.getProducts = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const product_1 = __importDefault(require("../models/product"));
const image_1 = __importDefault(require("../models/image"));
const category_1 = __importDefault(require("../models/category"));
const destroyFile_1 = require("../firebase/firestore/destroyFile");
const utils_1 = require("../utils");
const brand_1 = __importDefault(require("../models/brand"));
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find()
            .populate('productImage')
            .populate('category')
            .populate('brand');
        const sendProducts = [];
        for (const product of products) {
            if (product === null || product === void 0 ? void 0 : product.isOffer) {
                if ((0, utils_1.checkIfOfferEnded)(product === null || product === void 0 ? void 0 : product.lastModified, product === null || product === void 0 ? void 0 : product.offerExpiresDate)) {
                    product.isOffer = false;
                    product.newPrice = null;
                    product.offerExpiresDate = 0;
                    (product.lastModified = new Date()),
                        yield product.save();
                    sendProducts.push(Object.assign(Object.assign({}, product), { isOffer: false, newPrice: null, offerExpiresDate: 0 }));
                }
            }
            sendProducts.push(product);
        }
        res.status(200).send(sendProducts);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
        5;
    }
});
exports.getProducts = getProducts;
const filterProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find()
            .populate('productImage')
            .populate('category')
            .populate('brand');
        res.status(200).send(products);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.filterProducts = filterProducts;
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, categoryId, brandId, price, quantity, imageUrl, newPrice, isOffer, offerExpiresDate, } = req.body;
        const product = new product_1.default({
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            newPrice: newPrice && parseFloat(newPrice),
            isOffer,
            createdAt: new Date(),
            lastModified: new Date(),
        });
        if (isOffer)
            product.offerExpiresDate = offerExpiresDate;
        const category = yield category_1.default.findById(categoryId);
        const brand = yield brand_1.default.findById(brandId);
        category.products.push(product);
        brand.products.push(product);
        product.category = category;
        product.brand = brand;
        if (imageUrl) {
            const image = new image_1.default({
                path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                filename: `products/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                imageType: 'productImage',
                doc: product,
            });
            yield image.save();
            product.productImage = image;
        }
        yield product.save();
        yield category.save();
        yield brand.save();
        res.status(200).send(product);
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.createProduct = createProduct;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const product = yield product_1.default.findById(product_id).populate('productImage');
        res.status(200).send(product);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getProduct = getProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { product_id } = req.params;
        const { name, price, quantity, category, brand, imageUrl, newPrice, isOffer, offerExpiresDate, } = req.body;
        const product = yield product_1.default.findById(product_id).populate('productImage');
        product.lastModified = new Date();
        if (name)
            product.name = name;
        if (price)
            product.price = parseFloat(price);
        if (quantity)
            product.quantity = quantity;
        // TODO: remove the product from former cat and brand and add it to the new ones
        if (category)
            product.category = category;
        if (brand)
            product.brand = brand;
        if (newPrice)
            product.newPrice = newPrice;
        if (isOffer)
            product.offerExpiresDate = offerExpiresDate;
        product.isOffer = isOffer;
        if (imageUrl) {
            yield (0, destroyFile_1.deleteImage)((_a = product === null || product === void 0 ? void 0 : product.productImage) === null || _a === void 0 ? void 0 : _a.filename);
            yield image_1.default.findByIdAndDelete((_b = product === null || product === void 0 ? void 0 : product.productImage) === null || _b === void 0 ? void 0 : _b._id);
            const image = new image_1.default({
                path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                filename: `products/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                imageType: 'productImage',
                doc: product,
            });
            yield image.save();
            product.productImage = image;
        }
        yield product.save();
        res.status(200).send(product);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.updateProduct = updateProduct;
const updateProductViews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const product = yield product_1.default.findById(product_id);
        product.views += 1;
        yield product.save();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.updateProductViews = updateProductViews;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        const { product_id } = req.params;
        const product = yield product_1.default.findById(product_id)
            .populate('productImage')
            .populate('category')
            .populate('brand');
        const category = yield category_1.default.findById((_c = product === null || product === void 0 ? void 0 : product.category) === null || _c === void 0 ? void 0 : _c._id).populate('products');
        yield category.updateOne({
            $pull: { products: product_id },
        });
        yield category.save();
        const brand = yield brand_1.default.findById((_d = product === null || product === void 0 ? void 0 : product.brand) === null || _d === void 0 ? void 0 : _d._id).populate('products');
        yield brand.updateOne({
            $pull: { products: product_id },
        });
        yield brand.save();
        yield (0, destroyFile_1.deleteImage)((_e = product === null || product === void 0 ? void 0 : product.productImage) === null || _e === void 0 ? void 0 : _e.filename);
        yield image_1.default.findByIdAndDelete((_f = product === null || product === void 0 ? void 0 : product.productImage) === null || _f === void 0 ? void 0 : _f._id);
        yield product.deleteOne();
        res.status(200).send(product_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.js.map