import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createBrand,
	deleteBrand,
	getBrands,
	getBrand,
	updateBrand,
	getBrandProducts,
	removeImage,
} from '../controllers/brand';
const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getBrands))
	.post(expressAsyncHandler(createBrand));

router
	.route('/:brand_id')
	.get(expressAsyncHandler(getBrand))
	.put(expressAsyncHandler(updateBrand))
	.patch(expressAsyncHandler(removeImage))
	.delete(expressAsyncHandler(deleteBrand));

router.get(
	'/:brand_id/products',
	expressAsyncHandler(getBrandProducts),
);

export default router;
