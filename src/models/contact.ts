import { model, Schema } from 'mongoose';
import { TProfile } from './profile';

export type TContactInfo = {
	_id: string;
	address: {
		city: string;
		street: string;
	};
	contactNumber: string;
	profile: TProfile;
};

const ContactSchema = new Schema<TContactInfo>({
	address: {
		city: String,
		street: String,
	},
	contactNumber: String,
	profile: {
		type: Schema.Types.ObjectId,
	},
});

const Contact = model<TContactInfo>('Contact', ContactSchema);

export default Contact;
