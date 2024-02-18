import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	fetchProfile,
	removeAccount,
	updateUserPhoneAndUsername,
	updateUserPassword,
} from '../controllers/profile';
const router = express.Router();

router.get(
	'/profile/:profile_id',
	expressAsyncHandler(fetchProfile),
);

router.post(
	'/profile/:profile_id/updateUserPhoneAndUsername',
	expressAsyncHandler(updateUserPhoneAndUsername),
);

router.post(
	'/profile/:profile_id/updateUserPassword',
	expressAsyncHandler(updateUserPassword),
);

router.delete(
	'/profile/:profile_id/delete-account',
	expressAsyncHandler(removeAccount),
);

export default router;
