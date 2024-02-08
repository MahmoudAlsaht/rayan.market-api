import { model, Schema } from 'mongoose';
import Image, { TImage } from './image';
import { TUser } from './user';
import { TContactInfo } from './contact';

export type TProfile = {
	_id: string;
	user: TUser;
	profileImage?: TImage | null;
	contacts?: TContactInfo[];
};

const ProfileSchema = new Schema<TProfile>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	profileImage: {
		type: Schema.Types.ObjectId,
		ref: 'Image',
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
