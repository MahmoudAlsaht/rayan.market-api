import { model, Schema } from 'mongoose';
import { TOrder } from './order';
import { TContactInfo } from './contact';

export type TAnonymousUser = {
	_id: string;
	username?: string;
	phone: string;
	orders?: TOrder[];
	contact?: TContactInfo;
	verificationCode?: string | null;
};

const AnonymousUserSchema = new Schema<TAnonymousUser>({
	username: { type: String },
	phone: { type: String },
	contact: {
		type: Schema.Types.ObjectId,
		ref: 'Contact',
	},
	orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
	verificationCode: { type: String },
});

const AnonymousUser = model<TAnonymousUser>(
	'AnonymousUser',
	AnonymousUserSchema,
);

export default AnonymousUser;
