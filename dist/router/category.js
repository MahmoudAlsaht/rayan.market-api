"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const category_1 = require("../controllers/category");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../cloudinary");
const middlewares_1 = require("../middlewares");
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(category_1.getCategories))
    .post(middlewares_1.checkUserToken, upload.single('file'), (0, express_async_handler_1.default)(category_1.createCategory));
router
    .route('/:category_id')
    .get((0, express_async_handler_1.default)(category_1.getCategory))
    .put(middlewares_1.checkUserToken, upload.single('file'), (0, express_async_handler_1.default)(category_1.updateCategory))
    .delete(middlewares_1.checkUserToken, (0, express_async_handler_1.default)(category_1.deleteCategory));
router.get('/:category_id/products', (0, express_async_handler_1.default)(category_1.getCategoryProducts));
exports.default = router;
//# sourceMappingURL=category.js.map