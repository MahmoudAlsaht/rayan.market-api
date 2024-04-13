import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import District from '../models/district';

export const getDistricts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const districts = await District.find();
		res.status(200).send(districts);
	} catch (e: any) {
		console.error(e.message);
		next(new ExpressError(e.message, 404));
	}
};

export const createDistrict = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, shippingFees } = req.body;
		const district = new District({
			name,
			shippingFees: shippingFees || 2,
		});
		await district.save();
		res.status(200).send(district);
	} catch (e: any) {
		console.error(e.message);
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
		console.error(e.message);
		next(new ExpressError(e.message, 404));
	}
};

export const updateDistrict = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { district_id } = req.params;
		const { name, shippingFees } = req.body;
		const district = await District.findById(district_id);
		if (name) district.name = name;
		if (shippingFees) district.shippingFees = shippingFees;
		await district.save();
		res.status(200).send(district);
	} catch (e: any) {
		console.error(e.message);
		next(new ExpressError(e.message, 404));
	}
};

export const deleteDistrict = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { district_id } = req.params;
		await District.findByIdAndDelete(district_id);
		res.status(200).send(district_id);
	} catch (e: any) {
		console.error(e.message);
		next(new ExpressError(e.message, 404));
	}
};
