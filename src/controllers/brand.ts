import { Response, Request, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Brand from '../models/brand';
import Image from '../models/image';
import { deleteImage, isAdmin, isEditor } from '../utils';
import { CustomUserRequest } from '../middlewares';

export const getBrands = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const brands = await Brand.find()
			.populate('image')
			.populate({
				path: 'products',
				populate: { path: 'productImage' },
			})
			.populate('banner');

		res.status(200).send(brands);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const getBrand = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { brand_id } = req.params;
		const brand = await Brand.findById(brand_id)
			.populate({
				path: 'products',
				populate: { path: 'productImage' },
			})
			.populate('image')
			.populate({
				path: 'banner',
				populate: 'bannerImages',
			});
		res.status(200).send(brand);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const createBrand = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { name } = req.body;
		const brand = await new Brand({
			name,
			createdAt: new Date(),
		});

		if (req.file) {
			const { filename, path } = req.file;
			const image = new Image({
				path,
				filename,
				imageType: 'BrandImage',
				doc: brand,
			});
			await image.save();
			brand.image = image;
		}

		await brand.save();
		res.status(200).send(brand);
	} catch (e: any) {
		await deleteImage(req.file?.filename);
		next(new ExpressError(e.message, 404));
	}
};

export const updateBrand = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { name } = req.body;
		const { brand_id } = req.params;
		const brand = await Brand.findById(brand_id).populate(
			'image',
		);
		if (name !== 'undefined' && name?.length > 0)
			brand.name = name;

		if (req.file) {
			const { filename, path } = req.file;
			if (brand.image) {
				await deleteImage(brand?.image?.filename);
			}
			const image =
				(await Image.findById(brand?.image?._id)) ||
				new Image({ brand });
			image.filename = filename;
			image.path = path;
			await image.save();
			brand.image = image;
		}

		await brand.save();

		res.status(200).send(brand);
	} catch (e: any) {
		await deleteImage(req.file?.filename);
		next(new ExpressError(e.message, 404));
	}
};

export const deleteBrand = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { brand_id } = req.params;
		const brand = await Brand.findById(brand_id).populate(
			'image',
		);

		await deleteImage(brand?.image?.filename);
		await Image.findByIdAndDelete(brand?.image?._id);

		await brand.deleteOne();

		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};
