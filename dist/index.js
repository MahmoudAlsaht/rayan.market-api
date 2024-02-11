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
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const config_1 = __importDefault(require("./firebase/config"));
const mailgun_1 = __importDefault(require("./router/mailgun"));
const user_1 = __importDefault(require("./router/user"));
const profile_1 = __importDefault(require("./router/profile"));
const category_1 = __importDefault(require("./router/category"));
const product_1 = __importDefault(require("./router/product"));
const banner_1 = __importDefault(require("./router/banner"));
const contact_1 = __importDefault(require("./router/contact"));
const order_1 = __importDefault(require("./router/order"));
const application = () => {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 5000;
    (0, db_1.connectDB)();
    (0, config_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cors_1.default)({ origin: '*' }));
    app.use((0, express_mongo_sanitize_1.default)({
        replaceWith: '_',
    }));
    app.use('/', mailgun_1.default);
    app.use('/auth', user_1.default);
    app.use('/account', profile_1.default);
    app.use('/category', category_1.default);
    app.use('/product', product_1.default);
    app.use('/banner', banner_1.default);
    app.use('/account/:profile_id', contact_1.default);
    app.use('/order', order_1.default);
    app.use((err, req, res, next) => {
        const { statusCode = 500 } = err;
        if (!err.message)
            err.message = 'Something Went Wrong!';
        res.status(statusCode).send({
            err,
            title: `Error: ${statusCode}`,
        });
    });
    app.listen(port, () => {
        return console.log(`http://localhost:${port}`);
    });
};
application();
//# sourceMappingURL=index.js.map