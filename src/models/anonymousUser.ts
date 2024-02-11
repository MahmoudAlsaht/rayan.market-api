import { model, Schema } from 'mongoose';
import { TOrder } from './order';
import { TContactInfo } from './contact';

export type TAnonymousUser = {
	_id: string;
	username: string;
	email: string;
	orders?: TOrder[];
	contact?: TContactInfo;
};

const AnonymousUserSchema = new Schema<TAnonymousUser>({
	username: { type: String, required: true },
	email: { type: String, required: true },
	contact: {
		type: Schema.Types.ObjectId,
		ref: 'Contact',
	},
	orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
});

const AnonymousUser = model<TAnonymousUser>(
	'AnonymousUser',
	AnonymousUserSchema,
);

export default AnonymousUser;
