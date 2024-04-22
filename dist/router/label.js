"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const label_1 = require("../controllers/label");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_async_handler_1.default)(label_1.getLabels))
    .post((0, express_async_handler_1.default)(label_1.createLabel));
router.get('/:labelId', (0, express_async_handler_1.default)(label_1.getLabel));
exports.default = router;
//# sourceMappingURL=label.js.map