import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Product from '../models/product';
import Image from '../models/image';
import { deleteImage } from '../firebase/firestore/destroyFile';

export const getProductImages = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const product = await Product.findById(
			product_id,
		).populate('productImages');

		res.status(200).send(product?.productImages);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const getProductImage = async (
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

export const removeImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { image_id } = req.params;
		const image = await Image.findById(image_id);
		await deleteImage(image?.filename);
		await image?.deleteOne();
		res.status(200).send(image);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};
