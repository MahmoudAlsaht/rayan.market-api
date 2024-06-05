import {
	Response,
	Request,
	NextFunction,
	response,
} from 'express';
import ExpressError from '../middlewares/expressError';
import ProductOption from '../models/productOption';
import Product from '../models/product';
import { CustomUserRequest } from '../middlewares';
import { isAdmin, isEditor } from '../utils';

export const getProductsOptions = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const product = await Product.findById(
			product_id,
		).populate('productOptions');
		res.status(200).send(product?.productOptions);
	} catch (e: any) {
		new ExpressError('Something went wrong', 404);
	}
};

export const getOption = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { productOption_id } = req.params;
		const productOption = await ProductOption.findById(
			productOption_id,
		);
		res.status(200).send(productOption);
	} catch (e: any) {
		new ExpressError('Something went wrong', 404);
	}
};

export const createNewProductOption = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { product_id } = req.params;
		const {
			optionType,
			optionName,
			optionPrice,
			optionQuantity,
		} = req.body;
		const product = await Product.findById(product_id);

		const productOption = new ProductOption({
			type: optionType,
			optionName,
			product,
		});

		if (optionType === 'weight' && optionPrice)
			productOption.price = optionPrice;
		if (optionType !== 'weight' && optionQuantity)
			productOption.quantity = optionQuantity;

		product.productOptions.push(productOption);

		await product.save();
		await productOption.save();

		res.status(200).send(productOption);
	} catch (e: any) {
		new ExpressError(e.message, 404);
	}
};

export const updateProductOption = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { productOption_id } = req.params;
		const { optionName, optionPrice, optionQuantity } =
			req.body;

		const productOption = await ProductOption.findById(
			productOption_id,
		);
		if (optionName) productOption.optionName = optionName;
		if (productOption?.type === 'weight' && optionPrice)
			productOption.price = optionPrice;
		if (productOption?.type !== 'weight' && optionQuantity)
			productOption.quantity = optionQuantity;

		await productOption.save();

		res.status(200).send(productOption);
	} catch (e: any) {
		new ExpressError(e.message, 404);
	}
};

export const deleteProductOption = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { productOption_id, product_id } = req.params;
		const product = await Product.findById(product_id);
		product?.updateOne({
			$pull: { productOptions: productOption_id },
		});
		await product.save();
		await ProductOption.findByIdAndDelete(productOption_id);
		res.status(200).send(productOption_id);
	} catch (e: any) {
		new ExpressError(e.message, 404);
	}
};
