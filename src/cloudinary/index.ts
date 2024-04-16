// @ts-nocheck
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

const {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_KEY,
	CLOUDINARY_SECRET,
} = process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_KEY,
	api_secret: CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'AlRayan-International-Markets',
		allowedFormat: async (req, file) => [
			'png',
			'jpeg',
			'jpg',
			'mp4',
			'gif',
		],
	},
});

export default cloudinary;
