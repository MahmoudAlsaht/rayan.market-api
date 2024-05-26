import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getOrders,
	createOrder,
	getOrder,
	updateOrderStatus,
} from '../controllers/order';
import { checkUserToken } from '../middlewares';
const router = express.Router();

router.get('/', checkUserToken, expressAsyncHandler(getOrders));

router
	.route('/:order_id')
	.get(expressAsyncHandler(getOrder))
	.put(checkUserToken, expressAsyncHandler(updateOrderStatus));

router.post('/new', expressAsyncHandler(createOrder));

export default router;
