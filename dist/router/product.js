"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_1 = require("../controllers/product");
const cloudinary_1 = require("../cloudinary");
const multer_1 = __importDefault(require("multer"));
const middlewares_1 = require("../middlewares");
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(product_1.getProducts))
    .post(middlewares_1.checkUserToken, upload.single('file'), (0, express_async_handler_1.default)(product_1.createProduct));
router.get('/filter-products', (0, express_async_handler_1.default)(product_1.filterProducts));
router
    .route('/:product_id')
    .get((0, express_async_handler_1.default)(product_1.getProduct))
    .put(middlewares_1.checkUserToken, upload.single('file'), (0, express_async_handler_1.default)(product_1.updateProduct))
    .patch(middlewares_1.checkUserToken, (0, express_async_handler_1.default)(product_1.updateProductViews))
    .delete(middlewares_1.checkUserToken, (0, express_async_handler_1.default)(product_1.deleteProduct));
exports.default = router;
//# sourceMappingURL=product.js.map