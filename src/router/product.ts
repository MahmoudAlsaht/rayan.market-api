import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getProducts,
	getProduct,
	updateProduct,
	createProduct,
	deleteProduct,
	filterProducts,
	updateProductViews,
} from '../controllers/product';
import { verifyToken } from '../middlewares';

const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getProducts))
	.post(expressAsyncHandler(createProduct));

router.get(
	'/filter-products',
	expressAsyncHandler(filterProducts),
);

router
	.route('/:product_id')
	.get(expressAsyncHandler(getProduct))
	.put(expressAsyncHandler(updateProduct))
	.patch(expressAsyncHandler(updateProductViews))
	.delete(expressAsyncHandler(deleteProduct));

export default router;
