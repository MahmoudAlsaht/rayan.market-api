import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	getContacts,
	createContact,
	getContact,
	updateContact,
	deleteContact,
} from '../controllers/contact';
import {
	createDistrict,
	deleteDistrict,
	getDistrict,
	getDistricts,
	updateDistrict,
} from '../controllers/district';
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

router
	.route('/district')
	.get(expressAsyncHandler(getDistricts))
	.post(expressAsyncHandler(createDistrict));

router
	.route('/district/:district_id')
	.get(expressAsyncHandler(getDistrict))
	.put(expressAsyncHandler(updateDistrict))
	.delete(expressAsyncHandler(deleteDistrict));

export default router;
