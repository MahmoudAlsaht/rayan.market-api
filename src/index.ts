import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
	config({ path: `.env.local`, override: true });
}

import express, {
	Response,
	Request,
	NextFunction,
} from 'express';
import { connectDB } from './db';
import cors from 'cors';
import mailgunRouter from './router/mailgun';
import userRouter from './router/user';
import profileRouter from './router/profile';
import mongoSanitize from 'express-mongo-sanitize';
import firebaseDb from './firebase/config';

const application = () => {
	const app = express();

	const port = process.env.PORT || 5000;

	connectDB();
	firebaseDb();

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cors({ origin: '*' }));
	app.use(
		mongoSanitize({
			replaceWith: '_',
		}),
	);

	app.use('/', mailgunRouter);
	app.use('/auth', userRouter);
	app.use('/account', profileRouter);

	app.use(
		(
			err: any,
			req: Request,
			res: Response,
			next: NextFunction,
		) => {
			const { statusCode = 500 } = err;
			if (!err.message)
				err.message = 'Something Went Wrong!';
			res.status(statusCode).send({
				err,
				title: `Error: ${statusCode}`,
			});
		},
	);

	app.listen(port, () => {
		return console.log(`http://localhost:${port}`);
	});
};

application();
