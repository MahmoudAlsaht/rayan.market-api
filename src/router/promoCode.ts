import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createPromo,
	deletePromo,
	getPromos,
	updatePromo,
} from '../controllers/promo';

const router = express.Router();

router
	.route('/')
	.post(expressAsyncHandler(createPromo))
	.get(expressAsyncHandler(getPromos));

router
	.route('/:promo_id')
	.put(expressAsyncHandler(updatePromo))
	.delete(expressAsyncHandler(deletePromo));

export default router;
