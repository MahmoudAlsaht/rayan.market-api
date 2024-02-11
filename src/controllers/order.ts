import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Order from '../models/order';
import Product from '../models/product';
import User from '../models/user';
import AnonymousUser from '../models/anonymousUser';
import Contact from '../models/contact';
import { isAdmin, isAuthenticated } from '../utils';

export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = req.body;

		let orders;
		if (userId !== '') {
			orders = await Order.find({ user: userId });
		} else {
			orders = await Order.find();
		}

		res.status(200).send(orders);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const getOrder = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { order_id } = req.params;
		const order = await Order.findById(order_id)
			.populate('user')
			.populate('contact');
		res.status(200).send(order);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			products,
			totalPrice,
			isUserRegistered,
			userId,
			contactId,
		} = req.body;

		const contact = await Contact.findById(contactId);
		const order = new Order({
			totalPrice: parseInt(totalPrice),
			products,
			isUserRegistered,
			contact,
		});

		await order.save();

		const user = isUserRegistered
			? await User.findById(userId)
			: await AnonymousUser.findById(userId);

		order.user = user;
		user.orders.push(order);
		await user.save();
		order.orderId = order?.id.slice(10);

		for (const product of products) {
			const fetchedProduct = await Product.findById(
				product?._id,
			);
			fetchedProduct.quantity =
				fetchedProduct.quantity - product?.counter;
			await fetchedProduct.save();
		}

		await order.save();

		res.status(200).send(order);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const updateOrderStatus = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { order_id } = req.params;
		const { updatedStatus, userId } = req.body;

		const user = await User.findById(userId);
		const order = await Order.findById(order_id).populate(
			'user',
		);

		if (
			updatedStatus === 'accepted' ||
			updatedStatus === 'rejected' ||
			updatedStatus === 'completed'
		) {
			if (!isAdmin(user)) {
				throw new Error('You Are Not Authorized');
			}
		} else if (updatedStatus === 'canceled') {
			if (!isAuthenticated(user)) {
				throw new Error('You Are Not Authorized');
			}
		} else {
			throw new Error(
				'Unexpected status: ' + updatedStatus,
			);
		}

		order.status = updatedStatus;
		await order.save();
		res.status(200).send(order);
	} catch (e: any) {
		next(new ExpressError(e.message, e.status));
		res.status(404);
	}
};
