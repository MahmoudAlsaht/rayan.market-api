import { Response, Request, NextFunction } from 'express';
import User from '../models/user';
import Profile from '../models/profile';
import ExpressError from '../middlewares/expressError';
import { checkPassword, genPassword } from '../utils';
import bcrypt from 'bcrypt';
import AnonymousUser from '../models/anonymousUser';

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			username,
			email,
			password,
			phoneNumber,
			isAdmin,
		} = req.body;

		const emailRegex =
			/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;

		if (username.search(usernameRegrex) !== -1) {
			throw new Error('Invalid username');
		}

		if (!emailRegex.test(email)) {
			throw new Error('Invalid username');
		}

		const user = await new User({
			email,
			username,
			password: await genPassword(password),
			phoneNumber,
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

export const signin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password } = req.body;

		const emailRegex =
			/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

		if (!emailRegex.test(email)) {
			throw new Error(
				'Invalid email, Try another email address',
			);
		}

		const user = await User.findOne({ email });

		if (user == null)
			throw new Error('Invalid User Credentials');

		checkPassword(password, user?.password.hash);

		res.status(200).send({
			username: user?.username,
			email: user?.email,
			isAdmin: user?.isAdmin,
			profile: user?.profile,
			id: user?.id,
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
		const {
			firstName,
			lastName,
			email,
			city,
			street,
			phoneNumber,
		} = req.body;

		const emailRegex =
			/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;

		if (
			firstName.search(usernameRegrex) !== -1 ||
			lastName.search(usernameRegrex) !== -1
		) {
			throw new Error('Invalid username');
		}

		if (!emailRegex.test(email)) {
			throw new Error('Invalid username');
		}

		const anonymousUser = await new AnonymousUser({
			email,
			firstName,
			lastName,
			contactsInfo: {
				address: { city, street },
				phoneNumber,
			},
		});

		await anonymousUser.save();

		res.status(200).send(anonymousUser);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
		res.status(404).send({ error: e.message });
	}
};
