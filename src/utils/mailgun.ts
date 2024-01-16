import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_APIKEY,
});

export const createMessage = async (email: string) => {
	try {
		const msg = await mg.messages.create(
			process.env.MAILGUN_DOMAIN,
			{
				from: 'm-store Team <me@samples.mailgun.org>',
				to: email,
				subject: 'hello',
				text: 'Testing some Mailgun awesomeness!',
				html: '<h1>Testing some Mailgun awesomeness!</h1>',
			},
		);
		console.log(msg);
	} catch (e) {
		console.error(e);
	}
};
