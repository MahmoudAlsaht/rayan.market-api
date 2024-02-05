"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailHtml_1 = __importDefault(require("../emailHtml"));
const mailgun_1 = require("../utils/mailgun");
const router = express_1.default.Router();
router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, products, orderStatus } = req.body;
        const html = yield (0, emailHtml_1.default)(products, username, orderStatus);
        yield (0, mailgun_1.createMessage)(email, html);
        res.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        res.status(404).send({ e });
    }
}));
exports.default = router;
//# sourceMappingURL=mailgun.js.map