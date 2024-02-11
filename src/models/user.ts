import { model, Schema } from 'mongoose';
import Profile, { TProfile } from './profile';
import { TOrder } from './order';

export type TUser = {
	_id: string;
	username: string;
	email: string;
	password: { hash: string; salt: string };
	phoneNumber?: string;
	isAdmin: boolean;
	profile: TProfile;
	orders?: TOrder[];
};

const UserSchema = new Schema<TUser>({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: {
		hash: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
			required: true,
		},
	},
	isAdmin: { type: Boolean, required: true, default: false },
	phoneNumber: { type: String, required: false },
	profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
	orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
});

UserSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function () {
		await Profile.deleteOne({
			_id: {
				$in: this.profile,
			},
		});
	},
);

const User = model<TUser>('User', UserSchema);

export default User;
