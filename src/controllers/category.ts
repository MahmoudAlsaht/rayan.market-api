import { Response, Request, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Category from '../models/category';

export const getCategories = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const categories = await Category.find();

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
		const category = await Category.findById(category_id);
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
		const category = await Category.findById(
			category_id,
		).populate('products');
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
		await category.save();
		res.status(200).send(category);
	} catch (e: any) {
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
		const category = await Category.findById(category_id);
		if (name && name?.length > 0) category.name = name;
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
		const { name } = req.body;
		const { category_id } = req.params;
		const category = await Category.findById(category_id);
		await category.deleteOne();

		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};
