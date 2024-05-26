import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Label from '../models/label';
import { CustomUserRequest } from '../middlewares';
import { isAdmin, isEditor } from '../utils';

export const createLabel = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { labelValue } = req.body;
		let label;
		label =
			(await Label.findOne({ value: labelValue })) ||
			new Label({ value: labelValue });
		await label.save();
		res.status(200).send(label);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const getLabels = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const labels = await Label.find().populate({
			path: 'products',
			populate: 'productImage',
		});
		res.status(200).send(labels);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const getLabel = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { label_id } = req.params;
		const label = await Label.findById(label_id).populate({
			path: 'products',
			populate: 'productImage',
		});
		res.status(200).send(label);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};
