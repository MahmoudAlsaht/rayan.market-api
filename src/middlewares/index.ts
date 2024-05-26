import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ExpressError from './expressError';
import User, { TUser } from '../models/user';
const { SECRET_1 } = process.env;

export interface CustomUserRequest extends Request {
	user: TUser | null;
}

export const checkUserToken = async (
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
		if (!user) throw new Error('YOU ARE NOT AUTHORIZED');
		else (req as CustomUserRequest).user = user;

		next();
	} catch (e: any) {
		next(new ExpressError(e.message, 404));
	}
};
