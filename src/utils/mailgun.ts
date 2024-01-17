import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_APIKEY,
});

export const createMessage = async (
	email: string,
	html: string,
) => {
	try {
		const msg = await mg.messages.create(
			process.env.MAILGUN_DOMAIN,
			{
				from: 'mStore Team <me@samples.mailgun.org>',
				to: email,
				subject: 'Order Summary',
				html: html,
			},
		);
	} catch (e) {
		console.error(e);
	}
};
