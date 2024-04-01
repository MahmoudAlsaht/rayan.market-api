import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createPromo,
	getPromos,
	updatePromo,
} from '../controllers/promo';

const router = express.Router();

router
	.route('/')
	.post(expressAsyncHandler(createPromo))
	.get(expressAsyncHandler(getPromos));

router.route('/:promo_id').put(expressAsyncHandler(updatePromo));

export default router;
