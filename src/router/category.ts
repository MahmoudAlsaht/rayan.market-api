import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
} from '../controllers/category';
const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getCategories))
	.post(expressAsyncHandler(createCategory));

router
	.route('/:category_id')
	.get(expressAsyncHandler(getCategory))
	.put(expressAsyncHandler(updateCategory))
	.delete(expressAsyncHandler(deleteCategory));

export default router;
