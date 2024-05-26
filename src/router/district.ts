import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import {
	createDistrict,
	deleteDistrict,
	getDistrict,
	getDistricts,
	updateDistrict,
} from '../controllers/district';
import { checkUserToken } from '../middlewares';
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(expressAsyncHandler(getDistricts))
	.post(checkUserToken, expressAsyncHandler(createDistrict));

router
	.route('/:district_id')
	.get(expressAsyncHandler(getDistrict))
	.put(checkUserToken, expressAsyncHandler(updateDistrict))
	.delete(checkUserToken, expressAsyncHandler(deleteDistrict));

export default router;
