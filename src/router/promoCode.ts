import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createPromo, getPromos } from '../controllers/promo';

const router = express.Router();

router
	.route('/')
	.post(expressAsyncHandler(createPromo))
	.get(expressAsyncHandler(getPromos));

export default router;
