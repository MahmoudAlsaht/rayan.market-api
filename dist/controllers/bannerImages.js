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
exports.removeImage = exports.getBannerImage = exports.getBannerImages = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const banner_1 = __importDefault(require("../models/banner"));
const image_1 = __importDefault(require("../models/image"));
const destroyFile_1 = require("../firebase/firestore/destroyFile");
const getBannerImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { banner_id } = req.params;
        const banner = yield banner_1.default.findById(banner_id).populate('bannerImages');
        res.status(200).send(banner === null || banner === void 0 ? void 0 : banner.bannerImages);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getBannerImages = getBannerImages;
const getBannerImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getBannerImage = getBannerImage;
const removeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { banner_id, image_id } = req.params;
        const image = yield image_1.default.findById(image_id);
        const banner = yield banner_1.default.findById(banner_id);
        yield (0, destroyFile_1.deleteImage)(image === null || image === void 0 ? void 0 : image.filename);
        yield banner.updateOne({
            $pull: { bannerImages: image_id },
        });
        yield banner.save();
        yield (image === null || image === void 0 ? void 0 : image.deleteOne());
        res.status(200).send(image_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.removeImage = removeImage;
//# sourceMappingURL=bannerImages.js.map