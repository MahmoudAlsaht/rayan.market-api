"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const banner_1 = require("../controllers/banner");
const bannerImages_1 = require("../controllers/bannerImages");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../cloudinary");
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const router = express_1.default.Router({ mergeParams: true });
router
    .route('/')
    .get((0, express_async_handler_1.default)(banner_1.getBanners))
    .post(upload.array('files', 4), (0, express_async_handler_1.default)(banner_1.createBanner));
router
    .route('/:banner_id')
    .get((0, express_async_handler_1.default)(banner_1.getBanner))
    .put(upload.array('files', 4), (0, express_async_handler_1.default)(banner_1.updateBanner))
    .delete((0, express_async_handler_1.default)(banner_1.deleteBanner));
router.route('/type').post((0, express_async_handler_1.default)(banner_1.getBannerByType));
router
    .route('/:banner_id/images')
    .get((0, express_async_handler_1.default)(bannerImages_1.getBannerImages));
router
    .route('/:banner_id/images/:image_id')
    .get((0, express_async_handler_1.default)(bannerImages_1.getBannerImage))
    .delete((0, express_async_handler_1.default)(bannerImages_1.removeImage))
    .put((0, express_async_handler_1.default)(bannerImages_1.updateImageLink));
exports.default = router;
//# sourceMappingURL=banner.js.map