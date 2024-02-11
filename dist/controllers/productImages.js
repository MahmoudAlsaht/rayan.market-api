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
exports.removeImage = exports.getProductImage = exports.getProductImages = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const product_1 = __importDefault(require("../models/product"));
const image_1 = __importDefault(require("../models/image"));
const destroyFile_1 = require("../firebase/firestore/destroyFile");
const getProductImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const product = yield product_1.default.findById(product_id).populate('productImages');
        res.status(200).send(product === null || product === void 0 ? void 0 : product.productImages);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getProductImages = getProductImages;
const getProductImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image_id } = req.params;
        const image = yield image_1.default.findById(image_id);
        res.status(200).send(image);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getProductImage = getProductImage;
const removeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id, image_id } = req.params;
        const image = yield image_1.default.findById(image_id);
        const product = yield product_1.default.findById(product_id);
        yield (0, destroyFile_1.deleteImage)(image === null || image === void 0 ? void 0 : image.filename);
        yield product.updateOne({
            $pull: { productImages: image_id },
        });
        yield product.save();
        yield (image === null || image === void 0 ? void 0 : image.deleteOne());
        res.status(200).send(image_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.removeImage = removeImage;
//# sourceMappingURL=productImages.js.map