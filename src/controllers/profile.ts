import { Response, Request, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Profile from '../models/profile';
import User from '../models/user';
import { checkPassword, genPassword } from '../utils';

export const fetchProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const profile = await Profile.findById(
			profile_id,
		).populate({ path: 'user' });
		res.status(200).send(profile);
	} catch (e) {
		next(new ExpressError(e.message, 404));
	}
};

export const updateUserPhoneAndUsername = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const { phone, username } = req.body;

		const profile = await Profile.findById(
			profile_id,
		).populate({ path: 'user' });
		const user = await User.findById(profile?.user?._id);

		if (phone && phone.length > 0) user.phone = phone;
		if (username && username.length > 0)
			user.username = username;

		await user.save();

		res.status(200).send({
			username: user?.username,
			phone: user?.phone,
			role: user?.role,
			profile: profile?._id,
			id: user?._id,
		});
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const updateUserPassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const { newPassword, currentPassword } = req.body;

		const profile = await Profile.findById(
			profile_id,
		).populate({ path: 'user' });
		const user = await User.findById(profile?.user?._id);
		checkPassword(currentPassword, user?.password?.hash);

		if (newPassword)
			user.password = await genPassword(newPassword);

		await user.save();

		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const removeAccount = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const { password } = req.body;

		const profile = await Profile.findById(
			profile_id,
		).populate({ path: 'user' });
		const user = await User.findById(profile?.user?._id);
		checkPassword(password, user?.password?.hash);

		await user?.deleteOne();

		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};
