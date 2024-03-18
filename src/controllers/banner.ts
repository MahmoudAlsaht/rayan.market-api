import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Banner from '../models/banner';
import Image from '../models/image';
import { deleteImage } from '../firebase/firestore/destroyFile';
import Brand from '../models/brand';
import Category from '../models/category';

export const getBanners = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const banners = await Banner.find().populate(
			'bannerImages',
		);
		res.status(200).send(banners);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const createBanner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, imagesUrls, type, category, brand } =
			req.body;

		const doc =
			type === 'brand'
				? await Brand.findById(brand)
				: type === 'category'
				? await Category.findById(category)
				: null;

		const banner = new Banner({
			name,
			bannerType: type,
			doc,
			createdAt: new Date(),
		});

		if (doc) {
			doc.banner = banner;
			await doc.save();
		}

		if (imagesUrls && imagesUrls.length > 0) {
			for (const imageUrl of imagesUrls) {
				const image = new Image({
					path: imageUrl?.url,
					filename: `banners/${name}/${imageUrl?.fileName}'s-Image`,
					imageType: 'bannerImages',
					doc: banner,
				});
				await image.save();
				banner.bannerImages.push(image);
			}
		}
		await banner.save();
		res.status(200).send(banner);
	} catch (e: any) {
		console.log(e);
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const getBanner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { banner_id } = req.params;
		const banner = await Banner.findById(banner_id).populate(
			'bannerImages',
		);

		res.status(200).send(banner);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const updateBanner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { banner_id } = req.params;
		const { name, imagesUrls } = req.body;

		const banner = await Banner.findById(banner_id).populate(
			'bannerImages',
		);

		if (name) banner.name = name;

		if (imagesUrls && imagesUrls.length > 0) {
			for (const imageUrl of imagesUrls) {
				const image = await new Image({
					path: imageUrl?.url,
					filename: `banners/${name}/${imageUrl?.fileName}'s-Image`,
					imageType: 'bannerImages',
					doc: banner,
				});
				await image.save();
				banner.bannerImages.push(image);
			}
		}
		await banner.save();

		res.status(200).send(banner);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

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

export const deleteBanner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { banner_id } = req.params;
		const banner = await Banner.findById(banner_id).populate(
			'bannerImages',
		);

		for (const image of banner?.bannerImages) {
			await deleteImage(image?.filename);
			await Image.findByIdAndDelete(image?._id);
		}

		await banner.deleteOne();
		res.status(200).send(banner_id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};
