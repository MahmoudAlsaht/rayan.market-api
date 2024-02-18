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
	return !isAuthenticated(user)
		? false
		: user.role === 'admin';
};

export const isStaff = async (user: TUser | null) => {
	return !isAuthenticated(user)
		? false
		: user.role === 'staff';
};

export const isCustomer = async (user: TUser | null) => {
	return !isAuthenticated(user)
		? false
		: user.role === 'customer';
};

export const checkIfOfferEnded = (
	createdAt: Date,
	expireDate: number,
) => {
	const todyDate = new Date();
	const created = new Date(createdAt);
	const diff = todyDate.getTime() - created.getTime();
	const days = diff / (1000 * 3600 * 24);
	return days > expireDate;
};

export const remainingDays = (
	createdAt: Date,
	expireDate: number,
) => {
	const todyDate = new Date();
	const created = new Date(createdAt);
	const diff = todyDate.getTime() - created.getTime();
	const days = Math.round(diff / (1000 * 3600 * 24));
	console.log(expireDate - days);
	return expireDate - days;
};
