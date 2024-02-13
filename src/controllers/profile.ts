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
		res.status(404).send({ error: e.message });
	}
};

export const updateUserEmailAndUsername = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const { email, username, password } = req.body;

		const profile = await Profile.findById(
			profile_id,
		).populate({ path: 'user' });
		const user = await User.findById(profile?.user?._id);
		checkPassword(password, user?.password?.hash);

		if (email && email.length > 0) user.email = email;
		if (username && username.length > 0)
			user.username = username;

		await user.save();

		res.status(200).send({
			username: user?.username,
			email: user?.email,
			isAdmin: user?.isAdmin,
			profile: profile?._id,
			id: user?._id,
		});
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404).send({ error: e.message });
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
		res.status(404).send({ error: e.message });
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
		res.status(400);
	}
};
