import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import {
	createDistrict,
	deleteDistrict,
	getDistrict,
	getDistricts,
	updateDistrict,
} from '../controllers/district';
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(expressAsyncHandler(getDistricts))
	.post(expressAsyncHandler(createDistrict));

router
	.route('/:district_id')
	.get(expressAsyncHandler(getDistrict))
	.put(expressAsyncHandler(updateDistrict))
	.delete(expressAsyncHandler(deleteDistrict));

export default router;
