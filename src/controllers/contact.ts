import { Request, Response, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Profile from '../models/profile';
import Contact from '../models/contact';
import District from '../models/district';
import { CustomUserRequest } from '../middlewares';
import { isAuthenticated } from '../utils';

export const getContacts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const profile = await Profile.findById(
			profile_id,
		).populate({
			path: 'contacts',
			populate: { path: 'district' },
		});

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
		const { user } = req as CustomUserRequest;
		if (!isAuthenticated(user))
			throw new Error('YOU ARE NOT A USER');

		const { profile_id } = req.params;
		const { district, contactNumber } = req.body;

		const profile = await Profile.findById(profile_id);
		const foundDistrict = await District.findById(district);
		const contact = await new Contact({
			district: foundDistrict,
			contactNumber,
			profile,
		});
		profile.contacts.push(contact);

		await profile.save();
		await contact.save();

		res.status(200).send(contact);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const getContact = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { contact_id } = req.params;
		const contact = await Contact.findById(
			contact_id,
		).populate('district');

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
		const { user } = req as CustomUserRequest;
		if (!isAuthenticated(user))
			throw new Error('YOU ARE NOT A USER');

		const { contact_id } = req.params;
		const { district, contactNumber } = req.body;

		const contact = await Contact.findById(contact_id);
		if (district) contact.district = district;
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
		const { user } = req as CustomUserRequest;
		if (!isAuthenticated(user))
			throw new Error('YOU ARE NOT A USER');

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
