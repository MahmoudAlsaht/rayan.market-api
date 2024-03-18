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
exports.deleteBanner = exports.updateBanner = exports.getBanner = exports.createBanner = exports.getBanners = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const banner_1 = __importDefault(require("../models/banner"));
const image_1 = __importDefault(require("../models/image"));
const destroyFile_1 = require("../firebase/firestore/destroyFile");
const brand_1 = __importDefault(require("../models/brand"));
const category_1 = __importDefault(require("../models/category"));
const getBanners = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield banner_1.default.find().populate('bannerImages');
        res.status(200).send(banners);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getBanners = getBanners;
const createBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, imagesUrls, type, category, brand } = req.body;
        const doc = type === 'brand'
            ? yield brand_1.default.findById(brand)
            : type === 'category'
                ? yield category_1.default.findById(category)
                : null;
        const banner = new banner_1.default({
            name,
            bannerType: type,
            doc,
            createdAt: new Date(),
        });
        if (doc) {
            doc.banner = banner;
            yield doc.save();
        }
        if (imagesUrls && imagesUrls.length > 0) {
            for (const imageUrl of imagesUrls) {
                const image = new image_1.default({
                    path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                    filename: `banners/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                    imageType: 'bannerImages',
                    doc: banner,
                });
                yield image.save();
                banner.bannerImages.push(image);
            }
        }
        yield banner.save();
        res.status(200).send(banner);
    }
    catch (e) {
        console.log(e);
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.createBanner = createBanner;
const getBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { banner_id } = req.params;
        const banner = yield banner_1.default.findById(banner_id).populate('bannerImages');
        res.status(200).send(banner);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getBanner = getBanner;
const updateBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { banner_id } = req.params;
        const { name, imagesUrls } = req.body;
        const banner = yield banner_1.default.findById(banner_id).populate('bannerImages');
        if (name)
            banner.name = name;
        if (imagesUrls && imagesUrls.length > 0) {
            for (const imageUrl of imagesUrls) {
                const image = yield new image_1.default({
                    path: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.url,
                    filename: `banners/${name}/${imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.fileName}'s-Image`,
                    imageType: 'bannerImages',
                    doc: banner,
                });
                yield image.save();
                banner.bannerImages.push(image);
            }
        }
        yield banner.save();
        res.status(200).send(banner);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.updateBanner = updateBanner;
// export const updateBannersActivity = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction,
// ) => {
// 	try {
// 		const { banner_id } = req.params;
// 		const { active } = req.body;
// 		const banner = await Banner.findById(banner_id).populate(
// 			'bannerImages',
// 		);
// 		const banners = await Banner.find().populate(
// 			'bannerImages',
// 		);
// 		for (const banner of banners) {
// 			banner.active = false;
// 			await banner.save();
// 		}
// 		banner.active = active;
// 		await banner.save();
// 		const sendBanners = banners.map((b) =>
// 			b?.id === banner.id ? banner : b,
// 		);
// 		res.status(200).send(sendBanners);
// 	} catch (e: any) {
// 		next(new ExpressError(e.message, 404));
// 		res.status(404);
// 	}
// };
const deleteBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { banner_id } = req.params;
        const banner = yield banner_1.default.findById(banner_id).populate('bannerImages');
        for (const image of banner === null || banner === void 0 ? void 0 : banner.bannerImages) {
            yield (0, destroyFile_1.deleteImage)(image === null || image === void 0 ? void 0 : image.filename);
            yield image_1.default.findByIdAndDelete(image === null || image === void 0 ? void 0 : image._id);
        }
        yield banner.deleteOne();
        res.status(200).send(banner_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=banner.js.map