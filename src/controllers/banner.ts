import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Banner from '../models/banner';
import Image from '../models/image';
import { deleteImage, isAdmin, isEditor } from '../utils';
import Brand from '../models/brand';
import Category from '../models/category';
import { CustomUserRequest } from '../middlewares';

type TFile = {
	filename: string;
	path: string;
};

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
	}
};

export const createBanner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { name, type, category, brand } = req.body;

		const doc =
			type === 'brand'
				? await Brand.findById(brand)
				: type === 'category'
				? await Category.findById(category)
				: null;

		const banner =
			type === 'main' ||
			type === 'offers' ||
			type === 'homeProducts'
				? await Banner.findOne({ bannerType: type })
				: new Banner({
						name,
						bannerType: type,
						doc,
						createdAt: new Date(),
				  });

		if (doc) {
			doc.banner = banner;
			await doc.save();
		}

		if (req.files) {
			for (const file of req.files as TFile[]) {
				const { filename, path } = file;
				const image = new Image({
					path,
					filename,
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
		for (const file of req.files as TFile[]) {
			await deleteImage(req.file?.filename);
		}
		console.log(e);
		next(new ExpressError(e.message, 404));
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
	}
};

export const getBannerByType = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { type } = req.body;
		const banner = await Banner.findOne({
			bannerType: type,
		}).populate('bannerImages');
		res.status(200).send(banner);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const updateBanner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { banner_id } = req.params;
		const { name } = req.body;

		const banner = await Banner.findById(banner_id).populate(
			'bannerImages',
		);

		if (name) banner.name = name;

		if (req.files) {
			for (const file of req.files as TFile[]) {
				const { filename, path } = file;
				const image = await new Image({
					path,
					filename,
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
		for (const file of req.files as TFile[]) {
			await deleteImage(req.file?.filename);
		}
		next(new ExpressError(e.message, 404));
	}
};

export const deleteBanner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

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
	}
};
