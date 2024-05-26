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
import { storage } from '../cloudinary';
import multer from 'multer';
import { checkUserToken } from '../middlewares';

const upload = multer({ storage });

const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getProducts))
	.post(
		checkUserToken,
		upload.single('file'),
		expressAsyncHandler(createProduct),
	);

router.get(
	'/filter-products',
	expressAsyncHandler(filterProducts),
);

router
	.route('/:product_id')
	.get(expressAsyncHandler(getProduct))
	.put(
		checkUserToken,
		upload.single('file'),
		expressAsyncHandler(updateProduct),
	)
	.patch(
		checkUserToken,
		expressAsyncHandler(updateProductViews),
	)
	.delete(checkUserToken, expressAsyncHandler(deleteProduct));

export default router;
