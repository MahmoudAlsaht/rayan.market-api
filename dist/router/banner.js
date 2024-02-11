"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const banner_1 = require("../controllers/banner");
const bannerImages_1 = require("../controllers/bannerImages");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(banner_1.getBanners))
    .post((0, express_async_handler_1.default)(banner_1.createBanner));
router
    .route('/:banner_id')
    .get((0, express_async_handler_1.default)(banner_1.getBanner))
    .patch((0, express_async_handler_1.default)(banner_1.updateBannersActivity))
    .put((0, express_async_handler_1.default)(banner_1.updateBanner))
    .delete((0, express_async_handler_1.default)(banner_1.deleteBanner));
router
    .route('/:banner_id/images')
    .get((0, express_async_handler_1.default)(bannerImages_1.getBannerImages));
router
    .route('/:banner_id/images/:image_id')
    .get((0, express_async_handler_1.default)(bannerImages_1.getBannerImage))
    .delete((0, express_async_handler_1.default)(bannerImages_1.removeImage));
exports.default = router;
//# sourceMappingURL=banner.js.map