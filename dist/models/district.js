"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DistrictSchema = new mongoose_1.Schema({
    name: { type: String, unique: true },
    shippingFees: { type: Number, default: 2 },
});
const District = (0, mongoose_1.model)('District', DistrictSchema);
exports.default = District;
//# sourceMappingURL=district.js.map