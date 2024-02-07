import { model, Schema } from 'mongoose';
import Image, { TImage } from './image';
import { TUser } from './user';

export type TProfile = {
	id: string;
	user: TUser;
	profileImage?: TImage | null;
	contactsInfo?: [
		{
			address: {
				city: string;
				street: string;
			};
			contactNumber: string;
		},
	];
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
	contactsInfo: {
		address: {
			city: String,
			street: String,
		},
		contactNumber: String,
	},
});

const Profile = model<TProfile>('Profile', ProfileSchema);

export default Profile;
