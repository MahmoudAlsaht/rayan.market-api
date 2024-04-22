"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const brand_1 = require("../controllers/brand");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../cloudinary");
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(brand_1.getBrands))
    .post(upload.single('file'), (0, express_async_handler_1.default)(brand_1.createBrand));
router
    .route('/:brand_id')
    .get((0, express_async_handler_1.default)(brand_1.getBrand))
    .put(upload.single('file'), (0, express_async_handler_1.default)(brand_1.updateBrand))
    .delete((0, express_async_handler_1.default)(brand_1.deleteBrand));
exports.default = router;
//# sourceMappingURL=brand.js.map