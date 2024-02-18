import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ExpressError from './expressError';
const { SECRET_1, SECRET_2 } = process.env;

export interface CustomRequest extends Request {
	token: string | JwtPayload;
}

export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (token == null) res.sendStatus(403);

		const decoded = jwt.verify(token, SECRET_1);
		(req as CustomRequest).token = decoded;
	} catch (e: any) {
		console.error(e.message);
		next(new ExpressError(e.message, 403));
	}
};
