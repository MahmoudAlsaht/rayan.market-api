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
Object.defineProperty(exports, "__esModule", { value: true });
const body = (product) => `<div>
    <div>
    <img src="${product === null || product === void 0 ? void 0 : product.imageUrl}" alt="${product === null || product === void 0 ? void 0 : product.name}">
        <div>
            <h5>
                ${product === null || product === void 0 ? void 0 : product.name}
            </h5>
            <h5>
                Price: ${product === null || product === void 0 ? void 0 : product.price} JOD
            </h5>
            <h5>
            You have ordered ${product === null || product === void 0 ? void 0 : product.counter} item(s) of this product
        </h5>
        </div>
    </div>
</div>`;
function createATemplate(products, username, orderStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const bodyProducts = [];
        for (const product of products) {
            yield bodyProducts.push(body(product));
        }
        return orderStatus === 'accepted'
            ? `<h1>Hello ${username}</h1>` +
                bodyProducts +
                `<h2>Thanks for trying my demo app</h2>` +
                `<div>
            <div><a href="https://github.com/MahmoudAlsaht">Github Account</a></div>
            <div><a href="https://www.linkedin.com/in/mahmoud-alsaht-0b621620a/">Linkedin Account</a></div>
            <div><a href="https://wa.me/962785384842">Whatsapp Account</a></div>
        </div>`
            : orderStatus === 'rejected' &&
                `<h1>Hello ${username}</h1>` +
                    `<div>Sorry Your Last Order Has Been Rejected</div>` +
                    `<h2>Thanks for trying my demo app</h2>` +
                    `<div>
            <div><a href="https://github.com/MahmoudAlsaht">Github Account</a></div>
            <div><a href="https://www.linkedin.com/in/mahmoud-alsaht-0b621620a/">Linkedin Account</a></div>
            <div><a href="https://wa.me/962785384842">Whatsapp Account</a></div>
        </div>`;
    });
}
exports.default = createATemplate;
//# sourceMappingURL=emailHtml.js.map