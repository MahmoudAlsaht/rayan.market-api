import { model, Schema } from 'mongoose';
import { TProfile } from './profile';
import { TDistrict } from './district';

export type TContactInfo = {
	_id: string;
	district: TDistrict;
	contactNumber: string;
	profile: TProfile;
};

const ContactSchema = new Schema<TContactInfo>({
	district: { type: Schema.Types.ObjectId, ref: 'District' },
	contactNumber: String,
	profile: {
		type: Schema.Types.ObjectId,
	},
});

const Contact = model<TContactInfo>('Contact', ContactSchema);

export default Contact;
