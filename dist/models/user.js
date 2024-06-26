"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profile_1 = __importDefault(require("./profile"));
const UserSchema = new mongoose_1.Schema({
    username: { type: String },
    phone: { type: String, required: true, unique: true },
    password: {
        hash: {
            type: String,
        },
        salt: {
            type: String,
        },
    },
    role: { type: String, default: 'customer' },
    profile: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' },
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }],
    verificationCode: String || null,
});
UserSchema.pre('deleteOne', { document: true, query: false }, async function () {
    await profile_1.default.deleteOne({
        _id: {
            $in: this.profile,
        },
    });
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map