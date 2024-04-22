"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ContactSchema = new mongoose_1.Schema({
    district: { type: mongoose_1.Schema.Types.ObjectId, ref: 'District' },
    contactNumber: String,
    profile: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
});
const Contact = (0, mongoose_1.model)('Contact', ContactSchema);
exports.default = Contact;
//# sourceMappingURL=contact.js.map