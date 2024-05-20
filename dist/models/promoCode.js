"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PromoSchema = new mongoose_1.Schema({
    code: { type: String, unique: true },
    discount: Number,
    expired: { type: Boolean, default: false },
    promoType: { type: String, default: 'product' },
    startDate: String,
    endDate: String,
});
const PromoCode = (0, mongoose_1.model)('PromoCode', PromoSchema);
exports.default = PromoCode;
//# sourceMappingURL=promoCode.js.map