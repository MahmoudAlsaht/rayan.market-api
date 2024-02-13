"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProfileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    contacts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Contact',
        },
    ],
});
const Profile = (0, mongoose_1.model)('Profile', ProfileSchema);
exports.default = Profile;
//# sourceMappingURL=profile.js.map