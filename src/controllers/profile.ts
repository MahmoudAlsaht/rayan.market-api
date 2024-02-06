import { Response, Request, NextFunction } from 'express';
import ExpressError from '../middlewares/expressError';
import Profile from '../models/profile';
import User from '../models/user';
import Image from '../models/image';
import { checkPassword, genPassword } from '../utils';
import { deleteImage } from '../firebase/firestore/destroyFile';

export const fetchProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const profile = await Profile.findById(profile_id)
			.populate({ path: 'user' })
			.populate({ path: 'profileImage' });
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

		const profile = await Profile.findById(profile_id)
			.populate({ path: 'user' })
			.populate({ path: 'profileImage' });
		const user = await User.findById(profile?.user?.id);
		checkPassword(password, user?.password?.hash);

		if (email && email.length > 0) user.email = email;
		if (username && username.length > 0)
			user.username = username;

		await user.save();

		res.status(200).send({
			username: user?.username,
			email: user?.email,
			isAdmin: user?.isAdmin,
			profile: profile?.id,
			id: user?.id,
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
		const user = await User.findById(profile?.user?.id);
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

export const uploadProfileImage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { profile_id } = req.params;
		const { password, imageURL } = req.body;

		const profile = await Profile.findById(profile_id)
			.populate({ path: 'user' })
			.populate({ path: 'profileImage' });
		const user = await User.findById(profile?.user?.id);
		checkPassword(password, user?.password?.hash);

		if (imageURL && imageURL.length > 0) {
			const image = await new Image({
				path: imageURL,
				filename: `profilesImages/${profile?.id}'s-Image`,
				imageType: 'profileImage',
				doc: profile,
			});
			await image.save();
			profile.profileImage = image;
			await profile.save();
		}
		res.status(200).send(profile);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
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

		const profile = await Profile.findById(profile_id)
			.populate({ path: 'profileImage' })
			.populate({ path: 'user' });
		const user = await User.findById(profile?.user?.id);
		checkPassword(password, user?.password?.hash);

		const profileImage = await Image.findById(
			profile?.profileImage?.id,
		);

		if (profileImage) {
			await deleteImage(profileImage?.filename);
			await profileImage?.deleteOne();
		}

		await user?.deleteOne();

		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(400);
	}
};
