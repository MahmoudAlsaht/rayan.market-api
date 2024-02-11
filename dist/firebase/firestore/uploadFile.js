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
exports.uploadImage = void 0;
const storage_1 = require("firebase/storage");
const uploadImage = (imageFile, name, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storage = (0, storage_1.getStorage)();
        const imageRef = (0, storage_1.ref)(storage, `${folderName}/${name}'s-Image`);
        const snapShot = yield (0, storage_1.uploadBytes)(imageRef, imageFile);
        const imageURL = yield (0, storage_1.getDownloadURL)(snapShot.ref);
        return imageURL;
    }
    catch (e) {
        throw new Error('Something went wrong, please try again later');
    }
});
exports.uploadImage = uploadImage;
//# sourceMappingURL=uploadFile.js.map