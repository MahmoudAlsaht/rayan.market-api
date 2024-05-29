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
import mongoSanitize from 'express-mongo-sanitize';
import userRouter from './router/user';
import profileRouter from './router/profile';
import categoryRouter from './router/category';
import brandRouter from './router/brand';
import productRouter from './router/product';
import bannerRouter from './router/banner';
import contactRouter from './router/contact';
import orderRouter from './router/order';
import labelRouter from './router/label';
import promoRouter from './router/promoCode';
import districtRouter from './router/district';
import { sendVerificationCode } from './utils';

const application = () => {
	const app = express();

	const port = process.env.PORT || 5000;

	connectDB();

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cors({ origin: '*' }));
	app.use(
		mongoSanitize({
			replaceWith: '_',
		}),
	);

	app.use('/auth', userRouter);
	app.use('/account', profileRouter);
	app.use('/category', categoryRouter);
	app.use('/brand', brandRouter);
	app.use('/product', productRouter);
	app.use('/banner', bannerRouter);
	app.use('/account/:profile_id', contactRouter);
	app.use('/order', orderRouter);
	app.use('/label', labelRouter);
	app.use('/promo', promoRouter);
	app.use('/district', districtRouter);

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
