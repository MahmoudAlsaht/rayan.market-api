import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
	config({ path: `.env.local`, override: true });
}

import express from 'express';
import cors from 'cors';
import mailgunRouter from './router/mailgun';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));

app.use('/', mailgunRouter);

app.listen(port, () => {
	return console.log(`http://localhost:${port}`);
});
