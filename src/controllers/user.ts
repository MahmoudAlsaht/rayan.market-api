import { Response, Request, NextFunction } from 'express';
import User, { TUser } from '../models/user';
import Profile from '../models/profile';
import ExpressError from '../middlewares/expressError';
import {
	checkPassword,
	genPassword,
	generateRandomSixDigit,
} from '../utils';
import AnonymousUser from '../models/anonymousUser';
import Contact from '../models/contact';
import jwt from 'jsonwebtoken';
import District from '../models/district';

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
		next(new ExpressError(e.message, 404));
	}
};

export const editUserRole = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId, role } = req.body;
		const user = await User.findById(userId);
		if (user) user.role = role;
		await user.save();
		res.sendStatus(200);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const users: TUser[] = await User.find();

		const usersWithoutPasswords = users.map((user) => {
			return {
				username: user?.username,
				phone: user?.phone,
				role: user?.role,
				profile: user?.profile,
				_id: user?._id,
			};
		});

		res.status(200).send(usersWithoutPasswords);
	} catch (e: any) {
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
	}
};

export const createAnonymousUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, districtId, phone } = req.body;

		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;

		if (name.search(usernameRegrex) !== -1) {
			throw new Error('Invalid username');
		}

		const district = await District.findById(districtId);

		const contact = new Contact({
			district,
			contactNumber: phone,
		});
		await contact.save();
		const anonymousUser = await new AnonymousUser({
			phone,
			username: name,
			contact,
		}).populate('contact');

		await anonymousUser.save();

		res.status(200).send(anonymousUser);
	} catch (e: any) {
		console.log(e);
		next(new ExpressError(e.message, 404));
	}
};

export const generateVerificationCode = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { phone } = req.body;
		const user = await User.findOne({ phone });

		if (user == null)
			throw new Error('Invalid User Credentials');

		user.verificationCode = generateRandomSixDigit();

		await user.save();
		res.status(200).send(user?._id);
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const checkResetPassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user_id } = req.params;
		const { verificationCode } = req.body;
		const user = await User.findById(user_id);

		if (user == null)
			throw new Error('Invalid User Credentials');

		if (user?.verificationCode !== verificationCode)
			throw new Error('Invalid Code');

		user.verificationCode = null;
		await user.save();
		res.status(200).send();
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const updatePassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user_id } = req.params;
		const { password, passwordConfirmation } = req.body;
		const user = await User.findById(user_id);

		if (user == null)
			throw new Error('Invalid User Credentials');

		if (
			passwordConfirmation !== password ||
			passwordConfirmation === '' ||
			password === '' ||
			passwordConfirmation == null ||
			password == null
		)
			throw new Error('Invalid Password');

		user.password = await genPassword(password);
		await user.save();
		res.status(200).send();
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};

export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username, phone, password, adminId, role } =
			req.body;
		console.log('hit route create user');

		const admin = await User.findById(adminId);

		if (admin == null || admin?.role !== 'admin')
			throw new Error('YOU ARE NOT AUTHORIZED');

		const usernameRegrex = /[.&*+?^${}()|[\]\\]/g;

		if (username.search(usernameRegrex) !== -1) {
			throw new Error('Invalid username');
		}

		const user = await new User({
			phone,
			username,
			email: null,
			password: await genPassword(password),
			role,
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
			role: user?.role,
			profile: profile?.id,
			_id: user?._id,
		});
	} catch (e: any) {
		console.log(e);
		next(new ExpressError(e.message, 404));
	}
};
