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
exports.createMessage = void 0;
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const form_data_1 = __importDefault(require("form-data"));
const mailgun = new mailgun_js_1.default(form_data_1.default);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_APIKEY,
});
const createMessage = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const msg = yield mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: 'mStore Team <me@samples.mailgun.org>',
            to: email,
            subject: 'hello',
            text: 'Testing some Mailgun awesomeness!',
            html: '<h1>Testing some Mailgun awesomeness!</h1>',
        });
        console.log(msg);
    }
    catch (e) {
        console.error(e);
    }
});
exports.createMessage = createMessage;
//# sourceMappingURL=mailgun.js.map