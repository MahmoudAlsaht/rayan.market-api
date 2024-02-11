"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_1 = require("../controllers/product");
const productImages_1 = require("../controllers/productImages");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(product_1.getProducts))
    .post((0, express_async_handler_1.default)(product_1.createProduct));
router
    .route('/:product_id')
    .get((0, express_async_handler_1.default)(product_1.getProduct))
    .put((0, express_async_handler_1.default)(product_1.updateProduct))
    .delete((0, express_async_handler_1.default)(product_1.deleteProduct));
router
    .route('/:product_id/images')
    .get((0, express_async_handler_1.default)(productImages_1.getProductImages));
router
    .route('/:product_id/images/:image_id')
    .get((0, express_async_handler_1.default)(productImages_1.getProductImage))
    .delete((0, express_async_handler_1.default)(productImages_1.removeImage));
exports.default = router;
//# sourceMappingURL=product.js.map