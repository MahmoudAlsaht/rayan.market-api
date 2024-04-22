"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const district_1 = require("../controllers/district");
const router = express_1.default.Router({ mergeParams: true });
router
    .route('/')
    .get((0, express_async_handler_1.default)(district_1.getDistricts))
    .post((0, express_async_handler_1.default)(district_1.createDistrict));
router
    .route('/:district_id')
    .get((0, express_async_handler_1.default)(district_1.getDistrict))
    .put((0, express_async_handler_1.default)(district_1.updateDistrict))
    .delete((0, express_async_handler_1.default)(district_1.deleteDistrict));
exports.default = router;
//# sourceMappingURL=district.js.map