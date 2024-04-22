"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
// @ts-nocheck
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, } = process.env;
cloudinary_1.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET,
});
exports.storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'AlRayan-International-Markets',
        allowedFormat: async (req, file) => [
            'png',
            'jpeg',
            'jpg',
            'mp4',
            'gif',
        ],
    },
});
exports.default = cloudinary_1.v2;
//# sourceMappingURL=index.js.map