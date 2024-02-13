import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Product from '../models/product';
import Image from '../models/image';
import Category from '../models/category';
import { deleteImage } from '../firebase/firestore/destroyFile';

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const products = await Product.find()
			.populate('productImages')
			.populate('category');
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
			price,
			quantity,
			imagesUrls,
			newPrice,
			isOffer,
		} = req.body;

		const product = new Product({
			name,
			price: parseInt(price),
			quantity: parseInt(quantity),
			newPrice: newPrice && parseInt(newPrice),
			isOffer,
			createdAt: new Date(),
		});
		const category = await Category.findById(categoryId);
		category.products.push(product);
		product.category = category;
		if (imagesUrls && imagesUrls.length > 0) {
			for (const imageUrl of imagesUrls) {
				const image = new Image({
					path: imageUrl?.url,
					filename: `products/${categoryId}/${imageUrl?.fileName}'s-Image`,
					imageType: 'productImage',
					doc: product,
				});
				await image.save();
				product.productImages.push(image);
			}
		}
		await product.save();
		await category.save();
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
		).populate('productImages');

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
			imagesUrls,
			newPrice,
			isOffer,
		} = req.body;

		const product = await Product.findById(
			product_id,
		).populate('productImages');

		if (name) product.name = name;
		if (price) product.price = price;
		if (quantity) product.quantity = quantity;
		if (category) product.category = category;
		if (newPrice) product.newPrice = newPrice;
		product.isOffer = isOffer;

		if (imagesUrls && imagesUrls.length > 0) {
			for (const imageUrl of imagesUrls) {
				const image = await new Image({
					path: imageUrl?.url,
					filename: `products/${category}/${imageUrl?.fileName}'s-Image`,
					imageType: 'productImage',
					doc: product,
				});
				await image.save();
				product.productImages.push(image);
			}
		}
		await product.save();

		res.status(200).send(product);
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
			.populate('productImages')
			.populate('category');

		const category = await Category.findById(
			product?.category?._id,
		).populate('products');

		await category.updateOne({
			$pull: { products: product_id },
		});

		await category.save();

		for (const image of product?.productImages) {
			await deleteImage(image?.filename);
			await Image.findByIdAndDelete(image?._id);
		}

		await product.deleteOne();
		res.status(200).send(product_id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};