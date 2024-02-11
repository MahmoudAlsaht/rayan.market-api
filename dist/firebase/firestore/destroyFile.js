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
exports.deleteImage = void 0;
const storage_1 = require("firebase/storage");
const deleteImage = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storage = (0, storage_1.getStorage)();
        // Create a reference to the file to delete
        const desertRef = (0, storage_1.ref)(storage, filename);
        // Delete the file
        yield (0, storage_1.deleteObject)(desertRef);
    }
    catch (e) {
        console.log(e.message);
        throw new Error('Something went wrong, please try again later');
    }
});
exports.deleteImage = deleteImage;
//# sourceMappingURL=destroyFile.js.map