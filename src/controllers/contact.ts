import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Profile from '../models/profile';
import Contact from '../models/contact';

export const getContacts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const profile = await Profile.findById(
			profile_id,
		).populate('contacts');

		res.status(200).send(profile?.contacts);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const createContact = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const { city, street, contactNumber } = req.body;

		const profile = await Profile.findById(profile_id);
		const contact = await new Contact({
			address: { city, street },
			contactNumber,
			profile,
		});
		profile.contacts.push(contact);

		await profile.save();
		await contact.save();

		res.status(200).send(contact);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const getContact = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { contact_id } = req.params;
		const contact = await Contact.findById(contact_id);

		res.status(200).send(contact);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const updateContact = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { contact_id } = req.params;
		const { city, street, contactNumber } = req.body;

		const contact = await Contact.findById(contact_id);
		if (city) contact.address.city = city;
		if (street) contact.address.street = street;
		if (contactNumber) contact.contactNumber = contactNumber;

		await contact.save();

		res.status(200).send(contact);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};

export const deleteContact = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id, contact_id } = req.params;
		const profile = await Profile.findById(profile_id);
		const contact = await Contact.findById(contact_id);

		await profile.updateOne({
			$pull: { contacts: contact_id },
		});
		await profile.save();

		await contact.deleteOne();

		res.status(200).send(contact_id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404);
	}
};
