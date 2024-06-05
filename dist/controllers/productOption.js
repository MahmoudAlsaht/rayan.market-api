"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductOption = exports.updateProductOption = exports.createNewProductOption = exports.getOption = exports.getProductsOptions = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const productOption_1 = __importDefault(require("../models/productOption"));
const product_1 = __importDefault(require("../models/product"));
const utils_1 = require("../utils");
const getProductsOptions = async (req, res, next) => {
    try {
        const { product_id } = req.params;
        const product = await product_1.default.findById(product_id).populate('productOptions');
        res.status(200).send(product?.productOptions);
    }
    catch (e) {
        new expressError_1.default('Something went wrong', 404);
    }
};
exports.getProductsOptions = getProductsOptions;
const getOption = async (req, res, next) => {
    try {
        const { productOption_id } = req.params;
        const productOption = await productOption_1.default.findById(productOption_id);
        res.status(200).send(productOption);
    }
    catch (e) {
        new expressError_1.default('Something went wrong', 404);
    }
};
exports.getOption = getOption;
const createNewProductOption = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { product_id } = req.params;
        const { optionType, optionName, optionPrice, optionQuantity, } = req.body;
        const product = await product_1.default.findById(product_id);
        const productOption = new productOption_1.default({
            type: optionType,
            optionName,
            product,
        });
        if (optionType === 'weight' && optionPrice)
            productOption.price = optionPrice;
        if (optionType !== 'weight' && optionQuantity)
            productOption.quantity = optionQuantity;
        product.productOptions.push(productOption);
        await product.save();
        await productOption.save();
        res.status(200).send(productOption);
    }
    catch (e) {
        new expressError_1.default(e.message, 404);
    }
};
exports.createNewProductOption = createNewProductOption;
const updateProductOption = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { productOption_id } = req.params;
        const { optionName, optionPrice, optionQuantity } = req.body;
        const productOption = await productOption_1.default.findById(productOption_id);
        if (optionName)
            productOption.optionName = optionName;
        if (productOption?.type === 'weight' && optionPrice)
            productOption.price = optionPrice;
        if (productOption?.type !== 'weight' && optionQuantity)
            productOption.quantity = optionQuantity;
        await productOption.save();
        res.status(200).send(productOption);
    }
    catch (e) {
        new expressError_1.default(e.message, 404);
    }
};
exports.updateProductOption = updateProductOption;
const deleteProductOption = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { productOption_id, product_id } = req.params;
        const product = await product_1.default.findById(product_id);
        product?.updateOne({
            $pull: { productOptions: productOption_id },
        });
        await product.save();
        await productOption_1.default.findByIdAndDelete(productOption_id);
        res.status(200).send(productOption_id);
    }
    catch (e) {
        new expressError_1.default(e.message, 404);
    }
};
exports.deleteProductOption = deleteProductOption;
//# sourceMappingURL=productOption.js.map