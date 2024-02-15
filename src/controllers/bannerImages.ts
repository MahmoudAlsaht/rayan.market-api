import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Banner from '../models/banner';
import Image from '../models/image';
import { deleteImage } from '../firebase/firestore/destroyFile';

export const getBannerImages = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { banner_id } = req.params;
		const banner = await Banner.findById(banner_id).populate(
			'bannerImages',
		);

		res.status(200).send(banner?.bannerImages);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const getBannerImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { image_id } = req.params;
		const image = await Image.findById(image_id);
		res.status(200).send(image);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const updateImageLink = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { image_id, banner_id } = req.params;
		const { link } = req.body;
		await Image.findByIdAndUpdate(image_id, {
			link,
		});
		const banner = await Banner.findById(banner_id).populate(
			'bannerImages',
		);
		res.status(200).send(banner);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const removeImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { banner_id, image_id } = req.params;
		const image = await Image.findById(image_id);
		const banner = await Banner.findById(banner_id);
		await deleteImage(image?.filename);
		await banner.updateOne({
			$pull: { bannerImages: image_id },
		});
		await banner.save();
		await image?.deleteOne();
		res.status(200).send(image_id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};
