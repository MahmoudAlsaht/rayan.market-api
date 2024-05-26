import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getContacts,
	createContact,
	getContact,
	updateContact,
	deleteContact,
} from '../controllers/contact';
import { checkUserToken } from '../middlewares';

const router = express.Router({ mergeParams: true });

router
	.route('/contacts')
	.get(expressAsyncHandler(getContacts))
	.post(checkUserToken, expressAsyncHandler(createContact));

router
	.route('/contacts/:contact_id')
	.get(expressAsyncHandler(getContact))
	.delete(checkUserToken, expressAsyncHandler(deleteContact))
	.put(checkUserToken, expressAsyncHandler(updateContact));

export default router;
