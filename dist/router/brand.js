"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const brand_1 = require("../controllers/brand");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(brand_1.getBrands))
    .post((0, express_async_handler_1.default)(brand_1.createBrand));
router
    .route('/:brand_id')
    .get((0, express_async_handler_1.default)(brand_1.getBrand))
    .put((0, express_async_handler_1.default)(brand_1.updateBrand))
    .patch((0, express_async_handler_1.default)(brand_1.removeImage))
    .delete((0, express_async_handler_1.default)(brand_1.deleteBrand));
router.get('/:brand_id/products', (0, express_async_handler_1.default)(brand_1.getBrandProducts));
exports.default = router;
//# sourceMappingURL=brand.js.map