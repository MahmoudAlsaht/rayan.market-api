import { model, Schema } from 'mongoose';
import { TProduct } from './product';
import { TContactInfo } from './contact';
import { TUser } from './user';
import { TAnonymousUser } from './anonymousUser';
import { TPromoCode } from './promoCode';

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
	shippingFees: string;
	products: TOrderProduct[];
	totalPrice: string;
	createdAt: Date;
	orderId: string;
	status: string;
	isUserRegistered: boolean;
	user: TUser | TAnonymousUser;
	promoCode?: TPromoCode | null;
	paymentMethod: string;
	billTotal: string;
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
	totalPrice: String,
	billTotal: String,
	promoCode: { type: Schema.Types.ObjectId, ref: 'PromoCode' },
	paymentMethod: String,
	shippingFees: { type: String },
});

const Order = model<TOrder>('Order', OrderSchema);

export default Order;
