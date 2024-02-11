import bcrypt from 'bcrypt';
import { TUser } from '../models/user';

export const genPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return { salt, hash };
};

export const checkPassword = (
	password: string,
	hash: string,
) => {
	if (!bcrypt.compareSync(password, hash))
		throw new Error('User Credentials are not Valid!');
};

export const isAuthenticated = async (user: TUser | null) => {
	return !user ? false : true;
};

export const isAdmin = async (user: TUser | null) => {
	return !isAuthenticated(user) ? false : user.isAdmin;
};
