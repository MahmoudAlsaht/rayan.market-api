"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const profile_1 = require("../controllers/profile");
const router = express_1.default.Router();
router.get('/profile/:profile_id', (0, express_async_handler_1.default)(profile_1.fetchProfile));
router.post('/profile/:profile_id/updateUserPhoneAndUsername', (0, express_async_handler_1.default)(profile_1.updateUserPhoneAndUsername));
router.post('/profile/:profile_id/updateUserPassword', (0, express_async_handler_1.default)(profile_1.updateUserPassword));
router.delete('/profile/:profile_id/delete-account', (0, express_async_handler_1.default)(profile_1.removeAccount));
exports.default = router;
//# sourceMappingURL=profile.js.map