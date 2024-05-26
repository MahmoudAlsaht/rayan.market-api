import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createLabel,
	getLabel,
	getLabels,
} from '../controllers/label';
import { checkUserToken } from '../middlewares';

const router = express.Router();

router
	.route('/')
	.get(expressAsyncHandler(getLabels))
	.post(checkUserToken, expressAsyncHandler(createLabel));

router.get(
	'/:label_id',
	checkUserToken,
	expressAsyncHandler(getLabel),
);

export default router;
