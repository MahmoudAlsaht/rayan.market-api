import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import District from '../models/district';
import { CustomUserRequest } from '../middlewares';
import { isAdmin, isEditor } from '../utils';

export const getDistricts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const districts = await District.find();
		res.status(200).send(districts);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const createDistrict = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { name, shippingFees } = req.body;
		const district = new District({
			name,
			shippingFees: shippingFees || '2',
		});
		await district.save();
		res.status(200).send(district);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const getDistrict = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { district_id } = req.params;
		const district = await District.findById(district_id);
		res.status(200).send(district);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const updateDistrict = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { district_id } = req.params;
		const { name, shippingFees } = req.body;
		const district = await District.findById(district_id);
		if (name) district.name = name;
		if (shippingFees) district.shippingFees = shippingFees;
		await district.save();
		res.status(200).send(district);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const deleteDistrict = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { district_id } = req.params;
		await District.findByIdAndDelete(district_id);
		res.status(200).send(district_id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};
