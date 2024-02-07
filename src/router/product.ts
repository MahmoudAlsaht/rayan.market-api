import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getProducts,
	getProduct,
	updateProduct,
	createProduct,
	deleteProduct,
} from '../controllers/product';
import {
	getProductImages,
	getProductImage,
	removeImage,
} from '../controllers/productImages';

const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getProducts))
	.post(expressAsyncHandler(createProduct));

router
	.route('/:product_id')
	.get(expressAsyncHandler(getProduct))
	.put(expressAsyncHandler(updateProduct))
	.delete(expressAsyncHandler(deleteProduct));

router
	.route('/:product_id/images')
	.get(expressAsyncHandler(getProductImages));

router
	.route('/:product_id/images/:image_id')
	.get(expressAsyncHandler(getProductImage))
	.delete(expressAsyncHandler(removeImage));

export default router;
