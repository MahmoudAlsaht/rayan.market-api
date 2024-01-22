import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
	config({ path: `.env.local`, override: true });
}

import express, { Request, Response } from 'express';
import { createMessage } from './utils/mailgun';
import cors from 'cors';
import createATemplate from './emailHtml';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));

app.post('/send', async (req: Request, res: Response) => {
	try {
		const { username, email, products, orderStatus } =
			req.body;
		const html = await createATemplate(
			products,
			username,
			orderStatus,
		);
		await createMessage(email, html);
		res.sendStatus(200);
	} catch (e) {
		console.error(e);
		res.status(404).send({ e });
	}
});

app.listen(port, () => {
	return console.log(`http://localhost:${port}`);
});
