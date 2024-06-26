import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Order from '../models/order';
import Product from '../models/product';
import User from '../models/user';
import AnonymousUser from '../models/anonymousUser';
import Contact from '../models/contact';
import {
	applyDiscount,
	genOrderId,
	isAdmin,
	isAuthenticated,
	isStaff,
} from '../utils';
import PromoCode from '../models/promoCode';
import District from '../models/district';
import { CustomUserRequest } from '../middlewares';

export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user } = req as CustomUserRequest;
		let orders;
		if (user?.role === 'customer') {
			orders = await Order.find({ user: user?._id });
		} else if (
			user?.role === 'admin' ||
			user?.role === 'staff' ||
			user?.role === 'editor'
		) {
			orders = await Order.find();
		}

		res.status(200).send(orders);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
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
			.populate({
				path: 'contact',
				populate: { path: 'district' },
			});
		res.status(200).send(order);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
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
			paymentMethod,
			promoCode,
		} = req.body;

		const contact = await Contact.findById(
			contactId,
		).populate('district');

		const promo = await PromoCode.findOne({
			code: promoCode,
		});
		const district = await District.findById(
			contact?.district?._id,
		);
		const order = new Order({
			billTotal:
				promo && promo?.promoType === 'product'
					? applyDiscount(
							parseFloat(totalPrice as string),
							promo?.discount,
					  )
					: parseFloat(totalPrice),
			products,
			isUserRegistered,
			contact,
			orderId: genOrderId(),
			paymentMethod,
			promoCode: promo,
			shippingFees:
				promo && promo?.promoType === 'shipping'
					? applyDiscount(
							parseFloat(
								contact?.district?.shippingFees,
							),
							promo?.discount,
					  )
					: parseFloat(
							contact?.district?.shippingFees,
					  ),
		});

		order.totalPrice = `${
			parseFloat(order?.billTotal) +
			parseFloat(order?.shippingFees)
		}`;

		const user = isUserRegistered
			? await User.findById(userId)
			: await AnonymousUser.findById(userId);

		order.user = user;
		user.orders.push(order);

		await user.save();
		await order.save();

		for (const product of products) {
			const fetchedProduct = await Product.findById(
				product?._id,
			);
			fetchedProduct.quantity =
				fetchedProduct.quantity - product?.counter;
			fetchedProduct.numberOfPurchases += 1;
			await fetchedProduct.save();
		}

		await order.save();

		res.status(200).send(order);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const updateOrderStatus = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { order_id } = req.params;
		const { updatedStatus } = req.body;

		const { user } = req as CustomUserRequest;

		const order = await Order.findById(order_id).populate(
			'user',
		);

		if (
			updatedStatus === 'accepted' ||
			updatedStatus === 'rejected' ||
			updatedStatus === 'completed'
		) {
			if (!isAdmin(user) || !isStaff(user)) {
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
	}
};
