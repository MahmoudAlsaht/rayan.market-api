import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	fetchProfile,
	removeAccount,
	updateUserPhoneAndUsername,
	updateUserPassword,
} from '../controllers/profile';
import { checkUserToken } from '../middlewares';
const router = express.Router();

router.get(
	'/profile/:profile_id',
	expressAsyncHandler(fetchProfile),
);

router.post(
	'/profile/:profile_id/updateUserPhoneAndUsername',
	checkUserToken,
	expressAsyncHandler(updateUserPhoneAndUsername),
);

router.post(
	'/profile/:profile_id/updateUserPassword',
	checkUserToken,
	expressAsyncHandler(updateUserPassword),
);

router.delete(
	'/profile/:profile_id/delete-account',
	checkUserToken,
	expressAsyncHandler(removeAccount),
);

export default router;
