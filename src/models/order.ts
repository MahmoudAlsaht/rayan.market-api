import { model, Schema } from 'mongoose';
import { TProduct } from './product';
import { TContactInfo } from './contact';
import { TUser } from './user';
import { TAnonymousUser } from './anonymousUser';

export type TOrderProduct = {
	_id: string;
	name: string;
	price: number;
	imageUrl: string;
	quantity: number;
	counter: 1;
};

export type TOrder = {
	_id: string;
	contact: TContactInfo;
	products: TOrderProduct[];
	totalPrice: number;
	createdAt: Date;
	orderId: string;
	status: string;
	isUserRegistered: boolean;
	user: TUser | TAnonymousUser;
};

const OrderSchema = new Schema<TOrder>({
	contact: {
		type: Schema.Types.ObjectId,
		ref: 'Contact',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: function () {
			return this.isUserRegistered
				? 'User'
				: 'AnonymousUser';
		},
	},
	products: [
		{
			_id: String,
			imageUrl: String,
			name: String,
			quantity: Number,
			price: Number,
			counter: { type: Number, default: 1 },
		},
	],
	orderId: String,
	createdAt: { type: Date, default: new Date() },
	status: { type: String, default: 'pending' },
	isUserRegistered: Boolean,
	totalPrice: Number,
});

const Order = model<TOrder>('Order', OrderSchema);

export default Order;
