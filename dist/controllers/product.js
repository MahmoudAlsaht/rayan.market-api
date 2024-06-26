"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProductViews = exports.updateProduct = exports.getProduct = exports.createProduct = exports.filterProducts = exports.getProducts = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const product_1 = __importDefault(require("../models/product"));
const image_1 = __importDefault(require("../models/image"));
const category_1 = __importDefault(require("../models/category"));
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const brand_1 = __importDefault(require("../models/brand"));
const label_1 = __importDefault(require("../models/label"));
const productOption_1 = __importDefault(require("../models/productOption"));
const getProducts = async (req, res, next) => {
    try {
        const products = await product_1.default.find()
            .populate('productOptions')
            .populate('productImage')
            .populate('category')
            .populate('brand')
            .populate('labels');
        const sendProducts = [];
        for (const product of products) {
            if (product?.isOffer) {
                if (product?.isEndDate) {
                    if (!(0, utils_2.checkIfDateInBetween)(product?.startOfferDate, product?.endOfferDate)) {
                        product.isOffer = false;
                        product.isEndDate = false;
                        product.startOfferDate = null;
                        product.endOfferDate = null;
                        product.newPrice = null;
                        product.offerExpiresDate = 0;
                        (product.lastModified = new Date()),
                            await product.save();
                        sendProducts.push({
                            ...product,
                            isOffer: false,
                            newPrice: null,
                            offerExpiresDate: 0,
                        });
                    }
                }
                else {
                    if ((0, utils_2.checkIfOfferEnded)(product?.lastModified, product?.offerExpiresDate)) {
                        product.isOffer = false;
                        product.newPrice = null;
                        product.offerExpiresDate = 0;
                        product.lastModified = new Date();
                        await product.save();
                        sendProducts.push({
                            ...product,
                            isOffer: false,
                            newPrice: null,
                            offerExpiresDate: 0,
                        });
                    }
                }
            }
            sendProducts.push(product);
        }
        res.status(200).send(sendProducts);
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getProducts = getProducts;
const filterProducts = async (req, res, next) => {
    try {
        const products = await product_1.default.find()
            .populate('productOptions')
            .populate('productImage')
            .populate('category')
            .populate('brand');
        res.status(200).send(products);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.filterProducts = filterProducts;
const createProduct = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { name, categoryId, brandId, price, quantity, newPrice, isOffer, offerExpiresDate, labels, label, startDate, endDate, isEndDate, productType, description, } = req.body;
        const product = new product_1.default({
            name,
            productType,
            price: price ? parseFloat(price) : null,
            quantity: parseInt(quantity),
            newPrice: newPrice !== 'NaN' ? parseFloat(newPrice) : null,
            isOffer: isOffer === 'true' ? true : false,
            isEndDate: isEndDate === 'true' ? true : false,
            offerExpiresDate: offerExpiresDate === 'null'
                ? 0
                : offerExpiresDate,
            createdAt: new Date(),
            lastModified: new Date(),
            startOfferDate: startDate !== 'undefined' ? startDate : null,
            endOfferDate: endDate !== 'undefined' ? endDate : null,
            description: productType === 'electrical'
                ? description
                : null,
        });
        if (productType === 'options') {
            const productOption = new productOption_1.default({
                type: parseFloat(price) === 0
                    ? 'weight'
                    : 'flavor',
                quantity: parseFloat(price) === 0 ? quantity : 0,
                product,
            });
            product.productOptions.push(productOption);
            await product.save();
            await productOption.save();
        }
        if (label || labels)
            if (labels)
                for (const selectedLabel of labels) {
                    const label = await label_1.default.findById(selectedLabel);
                    product?.labels.push(label);
                    label.products.push(product);
                    await label.save();
                }
            else {
                const selectedLabel = await label_1.default.findById(label);
                product?.labels.push(selectedLabel);
                selectedLabel.products.push(product);
                await selectedLabel.save();
            }
        if (categoryId) {
            const category = await category_1.default.findById(categoryId);
            category.products.push(product);
            product.category = category;
            await category.save();
        }
        if (brandId) {
            const brand = await brand_1.default.findById(brandId);
            brand.products.push(product);
            product.brand = brand;
            await brand.save();
        }
        if (req.file) {
            const { filename, path } = req.file;
            const image = new image_1.default({
                path: path,
                filename: filename,
                imageType: 'productImage',
                doc: product,
            });
            await image.save();
            product.productImage = image;
        }
        await product.save();
        res.status(200).send(product);
    }
    catch (e) {
        await (0, utils_1.deleteImage)(req.file?.filename);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createProduct = createProduct;
const getProduct = async (req, res, next) => {
    try {
        const { product_id } = req.params;
        const product = await product_1.default.findById(product_id).populate('productOptions');
        for (const option of product.productOptions) {
            if (option?.type === 'flavor') {
                const productOption = await productOption_1.default.findById(option?._id);
                productOption.price =
                    product?.newPrice || product?.price;
            }
        }
        const sendProduct = await product_1.default.findById(product_id)
            .populate('productOptions')
            .populate('productImage')
            .populate('labels');
        res.status(200).send(sendProduct);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getProduct = getProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { product_id } = req.params;
        const { name, price, quantity, categoryId, brandId, newPrice, isOffer, offerExpiresDate, labels, label, startDate, endDate, isEndDate, description, } = req.body;
        const product = await product_1.default.findById(product_id)
            .populate('productImage')
            .populate('category');
        product.lastModified = new Date();
        if (name)
            product.name = name;
        if (price)
            product.price = parseFloat(price);
        if (quantity)
            product.quantity = quantity;
        if (newPrice) {
            product.newPrice =
                newPrice !== 'NaN' ? parseFloat(newPrice) : null;
        }
        product.isOffer = isOffer === 'true' ? true : false;
        product.isEndDate = isEndDate === 'true' ? true : false;
        if (offerExpiresDate !== 'undefined')
            product.offerExpiresDate = offerExpiresDate;
        if (startDate !== 'undefined')
            product.startOfferDate = startDate;
        if (endDate !== 'undefined')
            product.endOfferDate = endDate;
        // update product
        if (categoryId !== 'undefined') {
            // remove the product from former cat and brand and add it to the new ones
            const formerCat = await category_1.default.findById(product?.category?._id);
            if (formerCat)
                await formerCat?.updateOne({
                    $pull: { products: product?._id },
                });
            const currCat = await category_1.default.findById(categoryId);
            product.category = currCat;
            currCat?.products.push(product);
            await currCat.save();
        }
        if (brandId !== 'undefined') {
            const formerBrand = await brand_1.default.findById(product?.brand?._id);
            if (formerBrand)
                await formerBrand?.updateOne({
                    $pull: { products: product?._id },
                });
            const currBrand = await brand_1.default.findById(brandId);
            product.category = currBrand;
            currBrand.products.push(product);
            await currBrand.save();
        }
        if (product?.productType === 'electrical')
            product.description = description;
        if (label || labels)
            if (labels)
                for (const selectedLabel of labels) {
                    const label = await label_1.default.findById(selectedLabel);
                    product?.labels.push(label);
                    label.products.push(product);
                    await label.save();
                }
            else {
                const selectedLabel = await label_1.default.findById(label);
                product?.labels.push(selectedLabel);
                selectedLabel.products.push(product);
                await selectedLabel.save();
            }
        if (req.file) {
            const { filename, path } = req.file;
            const image = (await image_1.default.findById(product?.productImage?._id)) ||
                new image_1.default({
                    imageType: 'productImage',
                    doc: product,
                });
            if (image?.filename) {
                await (0, utils_1.deleteImage)(image?.filename);
            }
            image.filename = filename;
            image.path = path;
            await image.save();
            product.productImage = image;
        }
        await product.save();
        res.status(200).send(product);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updateProduct = updateProduct;
const updateProductViews = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { product_id } = req.params;
        const product = await product_1.default.findById(product_id);
        product.views += 1;
        await product.save();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updateProductViews = updateProductViews;
const deleteProduct = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { product_id } = req.params;
        const product = await product_1.default.findById(product_id)
            .populate('productImage')
            .populate('category')
            .populate('brand');
        const category = await category_1.default.findById(product?.category?._id).populate('products');
        if (category) {
            await category.updateOne({
                $pull: { products: product_id },
            });
            await category.save();
        }
        const brand = await brand_1.default.findById(product?.brand?._id).populate('products');
        if (brand) {
            await brand.updateOne({
                $pull: { products: product_id },
            });
            await brand.save();
        }
        await (0, utils_1.deleteImage)(product?.productImage?.filename);
        await image_1.default.findByIdAndDelete(product?.productImage?._id);
        await product.deleteOne();
        res.status(200).send(product_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.js.map