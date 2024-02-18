import { Response, Request, NextFunction } from 'express';
import User from '../models/user';
import Profile from '../models/profile';
import ExpressError from '../middlewares/expressError';
import { checkPassword, genPassword } from '../utils';
import AnonymousUser from '../models/anonymousUser';
import Contact from '../models/contact';
import jwt, { JwtPayload } from 'jsonwebtoken';

const { SECRET_1 } = process.env;

export const checkUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (token == null) throw new Error();

		const decoded: any = jwt.verify(token, SECRET_1);

		const user = await User.findById(decoded.id);

		res.status(200).send({
			username: user?.username,
			phone: user?.phone,
			role: user?.role,
			profile: user?.profile,
			_id: user?._id,
		});
	} catch (e: any) {
		console.log(e);
		next(new ExpressError(e.message, 404));
	}
};

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username, phone, password } = req.body;

		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;

		if (username.search(usernameRegrex) !== -1) {
			throw new Error('Invalid username');
		}

		const user = await new User({
			phone,
			username,
			email: null,
			password: await genPassword(password),
		});

		const profile = await new Profile({
			user,
		});

		user.profile = profile?.id;

		await user.save();
		await profile.save();

		const token = jwt.sign(
			{ id: user?._id, name: user?.username },
			SECRET_1,
		);

		res.status(200).send({
			token,
			user: {
				username: user?.username,
				phone: user?.phone,
				role: user?.role,
				profile: profile?.id,
				_id: user?._id,
			},
		});
	} catch (e: any) {
		console.log(e);
		next(new ExpressError(e.message, 404));
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

		const token = jwt.sign(
			{ id: user?._id, name: user?.username },
			SECRET_1,
		);

		res.status(200).send({
			token,
			user: {
				username: user?.username,
				phone: user?.phone,
				role: user?.role,
				profile: user?.profile,
				_id: user?._id,
			},
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
