import { model, Schema } from 'mongoose';
import { TUser } from './user';
import { TContactInfo } from './contact';

export type TProfile = {
	_id: string;
	user: TUser;
	contacts?: TContactInfo[];
};

const ProfileSchema = new Schema<TProfile>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	contacts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Contact',
		},
	],
});

const Profile = model<TProfile>('Profile', ProfileSchema);

export default Profile;
