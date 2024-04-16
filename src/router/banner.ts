import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getBanners,
	getBanner,
	updateBanner,
	createBanner,
	deleteBanner,
} from '../controllers/banner';
import {
	getBannerImages,
	getBannerImage,
	removeImage,
	updateImageLink,
} from '../controllers/bannerImages';
import multer from 'multer';
import { storage } from '../cloudinary';

const upload = multer({ storage });

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(expressAsyncHandler(getBanners))
	.post(
		upload.array('files', 4),
		expressAsyncHandler(createBanner),
	);

router
	.route('/:banner_id')
	.get(expressAsyncHandler(getBanner))
	.put(
		upload.array('files', 4),
		expressAsyncHandler(updateBanner),
	)
	.delete(expressAsyncHandler(deleteBanner));

router
	.route('/:banner_id/images')
	.get(expressAsyncHandler(getBannerImages));

router
	.route('/:banner_id/images/:image_id')
	.get(expressAsyncHandler(getBannerImage))
	.delete(expressAsyncHandler(removeImage))
	.put(expressAsyncHandler(updateImageLink));

export default router;
