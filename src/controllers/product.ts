import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Product from '../models/product';
import Image from '../models/image';
import Category from '../models/category';
import { deleteImage, isAdmin, isEditor } from '../utils';
import {
	checkIfDateInBetween,
	checkIfOfferEnded,
} from '../utils';
import Brand from '../models/brand';
import Label from '../models/label';
import { CustomUserRequest } from '../middlewares';
import ProductOption from '../models/productOption';

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const products = await Product.find()
			.populate('productOptions')
			.populate('productImage')
			.populate('category')
			.populate('brand')
			.populate('labels');
		const sendProducts = [];
		for (const product of products) {
			if (product?.isOffer) {
				if (product?.isEndDate) {
					if (
						!checkIfDateInBetween(
							product?.startOfferDate,
							product?.endOfferDate,
						)
					) {
						product.isOffer = false;
						product.isEndDate = false;
						product.startOfferDate = null;
						product.endOfferDate = null;
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
				} else {
					if (
						checkIfOfferEnded(
							product?.lastModified,
							product?.offerExpiresDate,
						)
					) {
						product.isOffer = false;
						product.newPrice = null;
						product.offerExpiresDate = 0;
						product.lastModified = new Date();
						await product.save();
						sendProducts.push({
							...product,
							isOffer: false,
							newPrice: null,
							offerExpiresDate: 0,
						});
					}
				}
			}
			sendProducts.push(product);
		}

		res.status(200).send(sendProducts);
	} catch (e: any) {
		console.log(e);
		next(new ExpressError(e.message, 404));
	}
};

export const filterProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const products = await Product.find()
			.populate('productOptions')
			.populate('productImage')
			.populate('category')
			.populate('brand');
		res.status(200).send(products);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const {
			name,
			categoryId,
			brandId,
			price,
			quantity,
			newPrice,
			isOffer,
			offerExpiresDate,
			labels,
			label,
			startDate,
			endDate,
			isEndDate,
			productType,
			description,
		} = req.body;

		const product = new Product({
			name,
			productType,
			price: price ? parseFloat(price) : null,
			quantity: parseInt(quantity),
			newPrice:
				newPrice !== 'NaN' ? parseFloat(newPrice) : null,
			isOffer: isOffer === 'true' ? true : false,
			isEndDate: isEndDate === 'true' ? true : false,
			offerExpiresDate:
				offerExpiresDate === 'null'
					? 0
					: offerExpiresDate,
			createdAt: new Date(),
			lastModified: new Date(),
			startOfferDate:
				startDate !== 'undefined' ? startDate : null,
			endOfferDate:
				endDate !== 'undefined' ? endDate : null,
			description:
				productType === 'electrical'
					? description
					: null,
		});

		if (productType === 'options') {
			const productOption = new ProductOption({
				type:
					parseFloat(price) === 0
						? 'weight'
						: 'flavor',
				quantity: parseFloat(price) === 0 ? quantity : 0,
				product,
			});
			product.productOptions.push(productOption);
			await product.save();
			await productOption.save();
		}

		if (label || labels)
			if (labels)
				for (const selectedLabel of labels) {
					const label = await Label.findById(
						selectedLabel,
					);
					product?.labels.push(label);
					label.products.push(product);
					await label.save();
				}
			else {
				const selectedLabel = await Label.findById(
					label,
				);
				product?.labels.push(selectedLabel);
				selectedLabel.products.push(product);
				await selectedLabel.save();
			}

		if (categoryId) {
			const category = await Category.findById(categoryId);
			category.products.push(product);
			product.category = category;
			await category.save();
		}

		if (brandId) {
			const brand = await Brand.findById(brandId);
			brand.products.push(product);
			product.brand = brand;
			await brand.save();
		}

		if (req.file) {
			const { filename, path } = req.file;
			const image = new Image({
				path: path,
				filename: filename,
				imageType: 'productImage',
				doc: product,
			});
			await image.save();
			product.productImage = image;
		}

		await product.save();
		res.status(200).send(product);
	} catch (e: any) {
		await deleteImage(req.file?.filename);
		next(new ExpressError(e.message, 404));
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
		).populate('productOptions');

		for (const option of product.productOptions) {
			if (option?.type === 'flavor') {
				const productOption =
					await ProductOption.findById(option?._id);
				productOption.price =
					product?.newPrice || product?.price;
			}
		}

		const sendProduct = await Product.findById(product_id)
			.populate('productOptions')
			.populate('productImage')
			.populate('labels');

		res.status(200).send(sendProduct);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const updateProduct = async (
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
			name,
			price,
			quantity,
			categoryId,
			brandId,
			newPrice,
			isOffer,
			offerExpiresDate,
			labels,
			label,
			startDate,
			endDate,
			isEndDate,
			description,
		} = req.body;

		const product = await Product.findById(product_id)
			.populate('productImage')
			.populate('category');

		product.lastModified = new Date();
		if (name) product.name = name;
		if (price) product.price = parseFloat(price);
		if (quantity) product.quantity = quantity;
		if (newPrice) {
			product.newPrice =
				newPrice !== 'NaN' ? parseFloat(newPrice) : null;
		}
		product.isOffer = isOffer === 'true' ? true : false;
		product.isEndDate = isEndDate === 'true' ? true : false;
		if (offerExpiresDate !== 'undefined')
			product.offerExpiresDate = offerExpiresDate;
		if (startDate !== 'undefined')
			product.startOfferDate = startDate;
		if (endDate !== 'undefined')
			product.endOfferDate = endDate;
		// update product
		if (categoryId !== 'undefined') {
			// remove the product from former cat and brand and add it to the new ones
			const formerCat = await Category.findById(
				product?.category?._id,
			);
			if (formerCat)
				await formerCat?.updateOne({
					$pull: { products: product?._id },
				});
			const currCat = await Category.findById(categoryId);
			product.category = currCat;
			currCat?.products.push(product);
			await currCat.save();
		}
		if (brandId !== 'undefined') {
			const formerBrand = await Brand.findById(
				product?.brand?._id,
			);
			if (formerBrand)
				await formerBrand?.updateOne({
					$pull: { products: product?._id },
				});

			const currBrand = await Brand.findById(brandId);
			product.category = currBrand;
			currBrand.products.push(product);
			await currBrand.save();
		}
		if (product?.productType === 'electrical')
			product.description = description;

		if (label || labels)
			if (labels)
				for (const selectedLabel of labels) {
					const label = await Label.findById(
						selectedLabel,
					);
					product?.labels.push(label);
					label.products.push(product);
					await label.save();
				}
			else {
				const selectedLabel = await Label.findById(
					label,
				);
				product?.labels.push(selectedLabel);
				selectedLabel.products.push(product);
				await selectedLabel.save();
			}

		if (req.file) {
			const { filename, path } = req.file;
			const image =
				(await Image.findById(
					product?.productImage?._id,
				)) ||
				new Image({
					imageType: 'productImage',
					doc: product,
				});
			if (image?.filename) {
				await deleteImage(image?.filename);
			}
			image.filename = filename;
			image.path = path;
			await image.save();
			product.productImage = image;
		}

		await product.save();

		res.status(200).send(product);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const updateProductViews = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { product_id } = req.params;
		const product = await Product.findById(product_id);
		product.views += 1;
		await product.save();
		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		if (!isAdmin(user) || !isEditor(user))
			throw new Error('YOU ARE NOT AUTHORIZED');

		const { product_id } = req.params;
		const product = await Product.findById(product_id)
			.populate('productImage')
			.populate('category')
			.populate('brand');

		const category = await Category.findById(
			product?.category?._id,
		).populate('products');
		if (category) {
			await category.updateOne({
				$pull: { products: product_id },
			});
			await category.save();
		}

		const brand = await Brand.findById(
			product?.brand?._id,
		).populate('products');

		if (brand) {
			await brand.updateOne({
				$pull: { products: product_id },
			});

			await brand.save();
		}

		await deleteImage(product?.productImage?.filename);
		await Image.findByIdAndDelete(
			product?.productImage?._id,
		);

		await product.deleteOne();
		res.status(200).send(product_id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};
