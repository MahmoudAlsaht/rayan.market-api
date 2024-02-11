import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getOrders,
	createOrder,
	getOrder,
	updateOrderStatus,
} from '../controllers/order';
const router = express.Router();

router.post('/', expressAsyncHandler(getOrders));

router
	.route('/:order_id')
	.get(expressAsyncHandler(getOrder))
	.put(expressAsyncHandler(updateOrderStatus));

router.post('/new', expressAsyncHandler(createOrder));

export default router;
