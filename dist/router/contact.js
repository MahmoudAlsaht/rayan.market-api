"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const contact_1 = require("../controllers/contact");
const router = express_1.default.Router({ mergeParams: true });
router
    .route('/contacts')
    .get((0, express_async_handler_1.default)(contact_1.getContacts))
    .post((0, express_async_handler_1.default)(contact_1.createContact));
router
    .route('/contacts/:contact_id')
    .get((0, express_async_handler_1.default)(contact_1.getContact))
    .delete((0, express_async_handler_1.default)(contact_1.deleteContact))
    .put((0, express_async_handler_1.default)(contact_1.updateContact));
exports.default = router;
//# sourceMappingURL=contact.js.map