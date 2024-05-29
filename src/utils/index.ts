import bcrypt from 'bcrypt';
import { TUser } from '../models/user';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import cloudinary from '../cloudinary';
import twilio from 'twilio';

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
		: user?.role === 'admin';
};

export const isEditor = async (user: TUser | null) => {
	return !isAuthenticated(user)
		? false
		: user?.role === 'editor';
};

export const isStaff = async (user: TUser | null) => {
	return !isAuthenticated(user)
		? false
		: user?.role === 'staff';
};

export const isCustomer = async (user: TUser | null) => {
	return !isAuthenticated(user)
		? false
		: user?.role === 'customer';
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

export const checkIfDateInBetween = (
	start: string,
	end: string,
) => {
	if (!start || !end) return false;

	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.tz.setDefault('Asia/Amman');

	const startDate = new Date(start).getTime();
	const endDate = new Date(end).getTime();

	const currentDate = dayjs().format('YYYY-MM-DD');

	const isBetween =
		new Date(currentDate).getTime() >= startDate &&
		new Date(currentDate).getTime() <= endDate;

	return isBetween;
};

export const remainingDays = (
	createdAt: Date,
	expireDate: number,
) => {
	const todyDate = new Date();
	const created = new Date(createdAt);
	const diff = todyDate.getTime() - created.getTime();
	const days = Math.round(diff / (1000 * 3600 * 24));
	return expireDate - days;
};

export const genOrderId = () => {
	let orderId = '';

	for (let i = 0; i < 10; i++) {
		orderId += `${Math.floor(Math.random() * 10)}`;
	}
	return orderId;
};

export function applyDiscount(
	totalPrice: number,
	discountPercentage: number,
) {
	const discount = totalPrice * (discountPercentage / 100);
	const discountedTotal = totalPrice - discount;
	return discountedTotal;
}

export const deleteImage = async (filename: string) => {
	try {
		await cloudinary.uploader.destroy(filename);
	} catch (e: any) {
		console.log(e);
	}
};

export const generateRandomSixDigit = () => {
	const min = 100000;
	const max = 999999;
	return `${
		Math.floor(Math.random() * (max - min + 1)) + min
	}`;
};

export const sendVerificationCode = async (
	code: string,
	phoneNumber: string,
) => {
	try {
		const { TWILIO_SID, TWILIO_AUTHTOKEN } = process.env;

		const client = await twilio(
			TWILIO_SID,
			TWILIO_AUTHTOKEN,
		);

		const message = await client.messages.create({
			// body: 'Your Twilio code is 1238432',
			body: `Your appointment is coming up on July 21 at 3PM and Your Code is: (${code})`,
			from: 'whatsapp:+14155238886',
			to: `whatsapp:+962785384842`,
			// to: `whatsapp:+962${phoneNumber.slice(1)}`,
		});
		// console.log(message);
	} catch (e: any) {
		console.error(e);
	}
};
