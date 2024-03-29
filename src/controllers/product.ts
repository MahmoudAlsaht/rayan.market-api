import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Product from '../models/product';
import Image from '../models/image';
import Category from '../models/category';
import { deleteImage } from '../firebase/firestore/destroyFile';
import { checkIfOfferEnded, remainingDays } from '../utils';
import Brand from '../models/brand';

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const products = await Product.find()
			.populate('productImage')
			.populate('category')
			.populate('brand');
		const sendProducts = [];

		for (const product of products) {
			if (product?.isOffer) {
				if (
					checkIfOfferEnded(
						product?.lastModified,
						product?.offerExpiresDate,
					)
				) {
					product.isOffer = false;
					product.newPrice = null;
					product.offerExpiresDate = 0;
					(product.lastModified = new Date()),
						await product.save();
					sendProducts.push({
						...product,
						isOffer: false,
						newPrice: null,
						offerExpiresDate: 0,
					});
				}
			}
			sendProducts.push(product);
		}

		res.status(200).send(sendProducts);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
		5;
	}
};

export const filterProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const products = await Product.find()
			.populate('productImage')
			.populate('category')
			.populate('brand');
		res.status(200).send(products);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			name,
			categoryId,
			brandId,
			price,
			quantity,
			imageUrl,
			newPrice,
			isOffer,
			offerExpiresDate,
		} = req.body;

		const product = new Product({
			name,
			price: parseFloat(price),
			quantity: parseInt(quantity),
			newPrice: newPrice && parseFloat(newPrice),
			isOffer,
			createdAt: new Date(),
			lastModified: new Date(),
		});

		if (isOffer) product.offerExpiresDate = offerExpiresDate;
		const category = await Category.findById(categoryId);
		const brand = await Brand.findById(brandId);

		category.products.push(product);

		brand.products.push(product);

		product.category = category;
		product.brand = brand;

		if (imageUrl) {
			const image = new Image({
				path: imageUrl?.url,
				filename: `products/${name}/${imageUrl?.fileName}'s-Image`,
				imageType: 'productImage',
				doc: product,
			});
			await image.save();
			product.productImage = image;
		}

		await product.save();
		await category.save();
		await brand.save();
		res.status(200).send(product);
	} catch (e: any) {
		console.log(e);
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const getProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const product = await Product.findById(
			product_id,
		).populate('productImage');

		res.status(200).send(product);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const {
			name,
			price,
			quantity,
			category,
			brand,
			imageUrl,
			newPrice,
			isOffer,
			offerExpiresDate,
		} = req.body;

		const product = await Product.findById(
			product_id,
		).populate('productImage');

		product.lastModified = new Date();
		if (name) product.name = name;
		if (price) product.price = parseFloat(price);
		if (quantity) product.quantity = quantity;
		// TODO: remove the product from former cat and brand and add it to the new ones
		if (category) product.category = category;
		if (brand) product.brand = brand;
		if (newPrice) product.newPrice = newPrice;
		if (isOffer) product.offerExpiresDate = offerExpiresDate;
		product.isOffer = isOffer;

		if (imageUrl) {
			await deleteImage(product?.productImage?.filename);
			await Image.findByIdAndDelete(
				product?.productImage?._id,
			);
			const image = new Image({
				path: imageUrl?.url,
				filename: `products/${name}/${imageUrl?.fileName}'s-Image`,
				imageType: 'productImage',
				doc: product,
			});
			await image.save();
			product.productImage = image;
		}

		await product.save();

		res.status(200).send(product);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const updateProductViews = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const product = await Product.findById(product_id);
		product.views += 1;
		await product.save();
		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { product_id } = req.params;
		const product = await Product.findById(product_id)
			.populate('productImage')
			.populate('category')
			.populate('brand');

		const category = await Category.findById(
			product?.category?._id,
		).populate('products');
		await category.updateOne({
			$pull: { products: product_id },
		});

		await category.save();

		const brand = await Brand.findById(
			product?.brand?._id,
		).populate('products');

		await brand.updateOne({
			$pull: { products: product_id },
		});

		await brand.save();

		await deleteImage(product?.productImage?.filename);
		await Image.findByIdAndDelete(
			product?.productImage?._id,
		);

		await product.deleteOne();
		res.status(200).send(product_id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};
