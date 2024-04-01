import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import PromoCode from '../models/promoCode';
import { checkIfDateInBetween } from '../utils';

export const getPromos = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const promos = await PromoCode.find();
		const sendPromos = [];
		for (const promo of promos) {
			if (promo?.expired) {
				promo.expired = true;
				promo.startDate = null;
				promo.endDate = null;
				await promo.save();
			}			
			if (
				!checkIfDateInBetween(
					promo?.startDate,
					promo?.endDate,
				)
			) {
				promo.expired = true;
				promo.startDate = null;
				promo.endDate = null;
				await promo.save();
			}
			sendPromos.push(promo);
		}
		res.status(200).json(sendPromos);
	} catch (e: any) {
		console.error(e);
		next(new ExpressError(e.message, 404));
	}
};

export const createPromo = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { code, discount, startDate, endDate } = req.body;
		const promo = new PromoCode({
			code,
			discount,
			startDate: startDate || null,
			endDate: endDate || null,
		});
		await promo.save();
		res.status(200).send(promo);
	} catch (e: any) {
		console.error(e);
		next(new ExpressError(e.message, 404));
	}
};

export const updatePromo = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { promo_id } = req.params;
		const { code, discount, startDate, endDate, expired } =
			req.body;
		const promo = await PromoCode.findById(promo_id);

		promo.code = code;
		promo.discount = discount;
		promo.startDate = startDate || null;
		promo.endDate = endDate || null;
		promo.expired = expired;
		await promo.save();

		res.status(200).send(promo);
	} catch (e: any) {
		console.error(e);
		next(new ExpressError(e.message, 404));
	}
};
