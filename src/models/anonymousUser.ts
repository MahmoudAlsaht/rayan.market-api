import { model, Schema } from 'mongoose';

export type TAnonymousUser = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
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

const AnonymousUserSchema = new Schema<TAnonymousUser>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	contactsInfo: [
		{
			address: {
				city: String,
				street: String,
			},
			contactNumber: String,
		},
	],
});

const AnonymousUser = model<TAnonymousUser>(
	'AnonymousUser',
	AnonymousUserSchema,
);

export default AnonymousUser;
