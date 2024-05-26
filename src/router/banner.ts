import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getBanners,
	getBanner,
	updateBanner,
	createBanner,
	deleteBanner,
	getBannerByType,
} from '../controllers/banner';
import {
	getBannerImages,
	getBannerImage,
	removeImage,
	updateImageLink,
} from '../controllers/bannerImages';
import multer from 'multer';
import { storage } from '../cloudinary';
import { checkUserToken } from '../middlewares';

const upload = multer({ storage });

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(expressAsyncHandler(getBanners))
	.post(
		checkUserToken,
		upload.array('files', 4),
		expressAsyncHandler(createBanner),
	);

router
	.route('/:banner_id')
	.get(expressAsyncHandler(getBanner))
	.put(
		checkUserToken,
		upload.array('files', 4),
		expressAsyncHandler(updateBanner),
	)
	.delete(checkUserToken, expressAsyncHandler(deleteBanner));

router.route('/type').post(expressAsyncHandler(getBannerByType));

router
	.route('/:banner_id/images')
	.get(expressAsyncHandler(getBannerImages));

router
	.route('/:banner_id/images/:image_id')
	.get(expressAsyncHandler(getBannerImage))
	.delete(checkUserToken, expressAsyncHandler(removeImage))
	.put(checkUserToken, expressAsyncHandler(updateImageLink));

export default router;
