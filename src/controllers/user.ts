import { Response, Request, NextFunction } from 'express';
import User from '../models/user';
import Profile from '../models/profile';
import ExpressError from '../middlewares/expressError';
import { checkPassword, genPassword } from '../utils';
import bcrypt from 'bcrypt';
import AnonymousUser from '../models/anonymousUser';
import Contact from '../models/contact';

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username, phone, password, isAdmin } = req.body;

		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;

		if (username.search(usernameRegrex) !== -1) {
			throw new Error('Invalid username');
		}

		const user = await new User({
			phone,
			username,
			password: await genPassword(password),
			isAdmin,
		});

		const profile = await new Profile({
			user,
		});

		user.profile = profile?.id;

		await user.save();
		await profile.save();

		res.status(200).send({
			username: user?.username,
			phone: user?.phone,
			isAdmin: user?.isAdmin,
			profile: profile?.id,
			_id: user?._id,
		});
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404).send({ error: e.message });
	}
};

export const signin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { phone, password } = req.body;

		const user = await User.findOne({ phone });

		if (user == null)
			throw new Error('Invalid User Credentials');

		checkPassword(password, user?.password.hash);

		res.status(200).send({
			username: user?.username,
			phone: user?.phone,
			isAdmin: user?.isAdmin,
			profile: user?.profile,
			_id: user?._id,
		});
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404).send({ error: e.message });
	}
};

export const createAnonymousUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { firstName, lastName, city, street, phone } =
			req.body;

		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;

		if (
			firstName.search(usernameRegrex) !== -1 ||
			lastName.search(usernameRegrex) !== -1
		) {
			throw new Error('Invalid username');
		}

		const contact = new Contact({
			address: {
				city,
				street,
			},
			contactNumber: phone,
		});
		await contact.save();
		const anonymousUser = await new AnonymousUser({
			phone,
			username: `${firstName} ${lastName}`,
			contact,
		}).populate('contact');

		await anonymousUser.save();

		res.status(200).send(anonymousUser);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404).send({ error: e.message });
	}
};
