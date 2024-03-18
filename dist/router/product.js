"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_1 = require("../controllers/product");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(product_1.getProducts))
    .post((0, express_async_handler_1.default)(product_1.createProduct));
router.get('/filter-products', (0, express_async_handler_1.default)(product_1.filterProducts));
router
    .route('/:product_id')
    .get((0, express_async_handler_1.default)(product_1.getProduct))
    .put((0, express_async_handler_1.default)(product_1.updateProduct))
    .patch((0, express_async_handler_1.default)(product_1.updateProductViews))
    .delete((0, express_async_handler_1.default)(product_1.deleteProduct));
exports.default = router;
//# sourceMappingURL=product.js.map