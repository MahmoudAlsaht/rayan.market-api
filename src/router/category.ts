import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
	getCategoryProducts,
} from '../controllers/category';
import multer from 'multer';
import { storage } from '../cloudinary';

const upload = multer({ storage });

const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getCategories))
	.post(
		upload.single('file'),
		expressAsyncHandler(createCategory),
	);

router
	.route('/:category_id')
	.get(expressAsyncHandler(getCategory))
	.put(
		upload.single('file'),
		expressAsyncHandler(updateCategory),
	)
	.delete(expressAsyncHandler(deleteCategory));

router.get(
	'/:category_id/products',
	expressAsyncHandler(getCategoryProducts),
);

export default router;
