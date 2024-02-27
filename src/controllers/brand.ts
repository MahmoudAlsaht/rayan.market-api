import { Response, Request, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Brand from '../models/brand';
import Image from '../models/image';
import { deleteImage } from '../firebase/firestore/destroyFile';

export const getBrands = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const brands = await Brand.find()
			.populate('image')
			.populate('products');

		res.status(200).send(brands);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
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
			.populate('products')
			.populate('image');
		res.status(200).send(brand);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const getBrandProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { brand_id } = req.params;
		const brand = await Brand.findById(brand_id)
			.populate('products')
			.populate('image');
		res.status(200).send(brand?.products);
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
		const { name, imageUrl } = req.body;
		const brand = await new Brand({
			name,
			createdAt: new Date(),
		});

		if (imageUrl) {
			const image = new Image({
				path: imageUrl?.url,
				filename: `brands/${name}/${imageUrl?.fileName}'s-Image`,
				imageType: 'BrandImage',
				doc: brand,
			});
			await image.save();
			brand.image = image;
		}

		await brand.save();
		res.status(200).send(brand);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const updateBrand = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, imageUrl } = req.body;
		const { brand_id } = req.params;
		const brand = await Brand.findById(brand_id).populate(
			'image',
		);
		if (name && name?.length > 0) brand.name = name;

		if (imageUrl) {
			if (brand.image) {
				await deleteImage(brand?.image?.filename);
				await Image.findByIdAndDelete(brand?.image?._id);
			}
			const image = new Image({
				path: imageUrl?.url,
				filename: `brands/${name}/${imageUrl?.fileName}'s-Image`,
				imageType: 'BrandImage',
				doc: brand,
			});
			await image.save();

			brand.image = image;
		}

		await brand.save();

		res.status(200).send(brand);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const deleteBrand = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
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
		res.status(400);
	}
};

export const removeImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { brand_id } = req.params;
		const brand = await Brand.findById(brand_id).populate(
			'image',
		);
		const imageId = brand?.image?._id;
		await deleteImage(brand?.image?.filename);
		brand.image = null;

		await brand.save();
		res.status(200).send(imageId);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};
