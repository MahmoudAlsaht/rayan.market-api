import express from 'express';
import {
	createNewProductOption,
	getProductsOptions,
	updateProductOption,
	deleteProductOption,
} from '../controllers/productOption';
import expressAsyncHandler from 'express-async-handler';
import { checkUserToken } from '../middlewares';

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(expressAsyncHandler(getProductsOptions))
	.post(
		checkUserToken,
		expressAsyncHandler(createNewProductOption),
	);

router
	.route('/:productOption_id')
	.put(
		checkUserToken,
		expressAsyncHandler(updateProductOption),
	)
	.delete(
		checkUserToken,
		expressAsyncHandler(deleteProductOption),
	);

export default router;
