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
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = exports.filterProducts = exports.getProducts = void 0;
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
            .populate('productImages')
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
            .populate('productImages')
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
        const { name, categoryId, brandId, price, quantity, imagesUrls, newPrice, isOffer, offerExpiresDate, } = req.body;
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
        if (imagesUrls && imagesUrls.length > 0) {
            for (const imageUrl of imagesUrls) {
                const image = new image_1.default({
                    path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                    filename: `products/${categoryId}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                    imageType: 'productImage',
                    doc: product,
                });
                yield image.save();
                product.productImages.push(image);
            }
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
        const product = yield product_1.default.findById(product_id).populate('productImages');
        res.status(200).send(product);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getProduct = getProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const { name, price, quantity, category, brand, imagesUrls, newPrice, isOffer, offerExpiresDate, } = req.body;
        const product = yield product_1.default.findById(product_id).populate('productImages');
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
        if (imagesUrls && imagesUrls.length > 0) {
            for (const imageUrl of imagesUrls) {
                const image = yield new image_1.default({
                    path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                    filename: `products/${category}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                    imageType: 'productImage',
                    doc: product,
                });
                yield image.save();
                product.productImages.push(image);
            }
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
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { product_id } = req.params;
        const product = yield product_1.default.findById(product_id)
            .populate('productImages')
            .populate('category')
            .populate('brand');
        const category = yield category_1.default.findById((_a = product === null || product === void 0 ? void 0 : product.category) === null || _a === void 0 ? void 0 : _a._id).populate('products');
        yield category.updateOne({
            $pull: { products: product_id },
        });
        yield category.save();
        const brand = yield brand_1.default.findById((_b = product === null || product === void 0 ? void 0 : product.brand) === null || _b === void 0 ? void 0 : _b._id).populate('products');
        yield brand.updateOne({
            $pull: { products: product_id },
        });
        yield brand.save();
        for (const image of product === null || product === void 0 ? void 0 : product.productImages) {
            yield (0, destroyFile_1.deleteImage)(image === null || image === void 0 ? void 0 : image.filename);
            yield image_1.default.findByIdAndDelete(image === null || image === void 0 ? void 0 : image._id);
        }
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