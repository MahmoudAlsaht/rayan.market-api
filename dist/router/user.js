"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.get('/', (0, express_async_handler_1.default)(user_1.checkUser));
router.post('/create-user', (0, express_async_handler_1.default)(user_1.createUser));
router
    .route('/users')
    .get((0, express_async_handler_1.default)(user_1.getUsers))
    .post((0, express_async_handler_1.default)(user_1.editUserRole));
router.post('/signup', (0, express_async_handler_1.default)(user_1.signup));
router.post('/signin', (0, express_async_handler_1.default)(user_1.signin));
router.post('/anonymous', (0, express_async_handler_1.default)(user_1.createAnonymousUser));
router.post('/reset-password', (0, express_async_handler_1.default)(user_1.generateVerificationCode));
router.post('/reset-password/:user_id', (0, express_async_handler_1.default)(user_1.checkResetPassword));
router.post('/reset-password/:user_id/update-password', (0, express_async_handler_1.default)(user_1.updatePassword));
exports.default = router;
//# sourceMappingURL=user.js.map