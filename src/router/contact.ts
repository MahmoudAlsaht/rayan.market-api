import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getContacts,
	createContact,
	getContact,
	updateContact,
	deleteContact,
} from '../controllers/contact';
const router = express.Router({ mergeParams: true });

router
	.route('/contacts')
	.get(expressAsyncHandler(getContacts))
	.post(expressAsyncHandler(createContact));

router
	.route('/contacts/:contact_id')
	.get(expressAsyncHandler(getContact))
	.delete(expressAsyncHandler(deleteContact))
	.put(expressAsyncHandler(updateContact));

export default router;
