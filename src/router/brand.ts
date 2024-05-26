import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createBrand,
	deleteBrand,
	getBrands,
	getBrand,
	updateBrand,
} from '../controllers/brand';
import multer from 'multer';
import { storage } from '../cloudinary';
import { checkUserToken } from '../middlewares';

const upload = multer({ storage });
const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getBrands))
	.post(
		checkUserToken,
		upload.single('file'),
		expressAsyncHandler(createBrand),
	);

router
	.route('/:brand_id')
	.get(expressAsyncHandler(getBrand))
	.put(
		checkUserToken,
		upload.single('file'),
		expressAsyncHandler(updateBrand),
	)
	.delete(checkUserToken, expressAsyncHandler(deleteBrand));

export default router;
