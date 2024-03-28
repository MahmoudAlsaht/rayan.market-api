import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Product from '../models/product';
import Label from '../models/label';

export const createLabel = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { labelValue } = req.body;
		let label;
		label =
			(await Label.findOne({ value: labelValue })) ||
			new Label({ value: labelValue });
		await label.save();
		res.status(200).send(label);
	} catch (e: any) {
		console.log(e.message);
		next(new ExpressError(e.message, 404));
	}
};

export const getLabels = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const labels = await Label.find().populate('products');
		res.status(200).send(labels);
	} catch (e: any) {
		console.log(e.message);
		next(new ExpressError(e.message, 404));
	}
};

export const getLabel = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { labelId } = req.params;
		const label = await Label.findById(labelId).populate(
			'products',
		);
		res.status(200).send(label);
	} catch (e: any) {
		console.log(e.message);
		next(new ExpressError(e.message, 404));
	}
};
