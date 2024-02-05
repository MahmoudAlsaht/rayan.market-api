"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
if (process.env.NODE_ENV !== 'production') {
    (0, dotenv_1.config)({ path: `.env.local`, override: true });
}
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mailgun_1 = __importDefault(require("./router/mailgun"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({ origin: '*' }));
app.use('/', mailgun_1.default);
app.listen(port, () => {
    return console.log(`http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map