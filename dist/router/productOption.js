"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productOption_1 = require("../controllers/productOption");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router({ mergeParams: true });
router
    .route('/')
    .get((0, express_async_handler_1.default)(productOption_1.getProductsOptions))
    .post(middlewares_1.checkUserToken, (0, express_async_handler_1.default)(productOption_1.createNewProductOption));
router
    .route('/:productOption_id')
    .get((0, express_async_handler_1.default)(productOption_1.getOption))
    .put(middlewares_1.checkUserToken, (0, express_async_handler_1.default)(productOption_1.updateProductOption))
    .delete(middlewares_1.checkUserToken, (0, express_async_handler_1.default)(productOption_1.deleteProductOption));
exports.default = router;
//# sourceMappingURL=productOption.js.map