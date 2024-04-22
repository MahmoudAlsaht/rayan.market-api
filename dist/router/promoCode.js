"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const promo_1 = require("../controllers/promo");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, express_async_handler_1.default)(promo_1.createPromo))
    .get((0, express_async_handler_1.default)(promo_1.getPromos));
router
    .route('/:promo_id')
    .put((0, express_async_handler_1.default)(promo_1.updatePromo))
    .delete((0, express_async_handler_1.default)(promo_1.deletePromo));
router.route('/:promoCode').get((0, express_async_handler_1.default)(promo_1.getPromo));
exports.default = router;
//# sourceMappingURL=promoCode.js.map