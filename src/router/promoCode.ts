import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createPromo,
	deletePromo,
	getPromo,
	getPromos,
	updatePromo,
} from '../controllers/promo';
import { checkUserToken } from '../middlewares';

const router = express.Router();

router
	.route('/')
	.post(checkUserToken, expressAsyncHandler(createPromo))
	.get(expressAsyncHandler(getPromos));

router
	.route('/:promo_id')
	.put(checkUserToken, expressAsyncHandler(updatePromo))
	.delete(checkUserToken, expressAsyncHandler(deletePromo));

router.route('/:promoCode').get(expressAsyncHandler(getPromo));

export default router;
