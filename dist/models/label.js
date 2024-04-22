"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LabelSchema = new mongoose_1.Schema({
    value: { type: String, unique: false },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }],
});
const Label = (0, mongoose_1.model)('Label', LabelSchema);
exports.default = Label;
//# sourceMappingURL=label.js.map