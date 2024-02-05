import express, { Request, Response } from 'express';
import createATemplate from '../emailHtml';
import { createMessage } from '../utils/mailgun';

const router = express.Router();

router.post('/send', async (req: Request, res: Response) => {
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

export default router;
