import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createLabel,
	getLabel,
	getLabels,
} from '../controllers/label';

const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getLabels))
	.post(expressAsyncHandler(createLabel));

router.get('/:label_id', expressAsyncHandler(getLabel));

export default router;
