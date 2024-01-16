import { config } from 'dotenv';
config({ path: `.env.local`, override: true });

import express, { Request, Response } from 'express';
import { createMessage } from './utils/mailgun';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req: Request, res: Response) => {
	return res.send('Express Typescript on Vercel');
});

app.get('/ping', (_req: Request, res: Response) => {
	return res.send('pong 🏓');
});

app.get('/send', async (_req: Request, res: Response) => {
	const msg = await createMessage('mahmoudalsoht@gmail.com');
	res.status(200).send(msg);
});

app.listen(port, () => {
	return console.log(`Server is listening on ${port}`);
});
