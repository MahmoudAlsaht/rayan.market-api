"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const order_1 = require("../controllers/order");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.get('/', middlewares_1.checkUserToken, (0, express_async_handler_1.default)(order_1.getOrders));
router
    .route('/:order_id')
    .get((0, express_async_handler_1.default)(order_1.getOrder))
    .put(middlewares_1.checkUserToken, (0, express_async_handler_1.default)(order_1.updateOrderStatus));
router.post('/new', (0, express_async_handler_1.default)(order_1.createOrder));
exports.default = router;
//# sourceMappingURL=order.js.map