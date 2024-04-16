import { Response, Request, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Category from '../models/category';
import Image from '../models/image';
import { deleteImage } from '../utils';

export const getCategories = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const categories = await Category.find()
			.populate('image')
			.populate('products')
			.populate('banner');

		res.status(200).send(categories);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const getCategory = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { category_id } = req.params;
		const category = await Category.findById(category_id)
			.populate('products')
			.populate('image')
			.populate({
				path: 'banner',
				populate: 'bannerImages',
			});
		res.status(200).send(category);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const getCategoryProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { category_id } = req.params;
		const category = await Category.findById(category_id)
			.populate('products')
			.populate('image');
		res.status(200).send(category?.products);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const createCategory = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name } = req.body;
		const category = await new Category({
			name,
			createdAt: new Date(),
		});

		if (req.file) {
			const { filename, path } = req.file;
			const image = new Image({
				path,
				filename,
				imageType: 'CategoryImage',
				doc: category,
			});
			await image.save();
			category.image = image;
		}

		await category.save();
		res.status(200).send(category);
	} catch (e: any) {
		await deleteImage(req.file?.filename);
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const updateCategory = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name } = req.body;
		const { category_id } = req.params;
		const category = await Category.findById(
			category_id,
		).populate('image');

		console.log(req.body.name);
		if (name !== 'undefined' && name?.length > 0)
			category.name = name;

		if (req.file) {
			const { filename, path } = req.file;
			if (category.image) {
				await deleteImage(category?.image?.filename);
			}
			const image =
				(await Image.findById(category?.image?._id)) ||
				new Image({ category });
			image.filename = filename;
			image.path = path;
			await image.save();
			category.image = image;
		}

		await category.save();

		res.status(200).send(category);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};

export const deleteCategory = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { category_id } = req.params;
		const category = await Category.findById(
			category_id,
		).populate('image');

		await deleteImage(category?.image?.filename);
		await Image.findByIdAndDelete(category?.image?._id);

		await category.deleteOne();

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
		const { category_id } = req.params;
		const category = await Category.findById(
			category_id,
		).populate('image');
		const imageId = category?.image?._id;
		await deleteImage(category?.image?.filename);
		category.image = null;

		await category.save();
		res.status(200).send(imageId);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};
