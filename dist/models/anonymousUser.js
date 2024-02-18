"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AnonymousUserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    phone: { type: String, required: true },
    contact: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Contact',
    },
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }],
});
const AnonymousUser = (0, mongoose_1.model)('AnonymousUser', AnonymousUserSchema);
exports.default = AnonymousUser;
//# sourceMappingURL=anonymousUser.js.map