import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	fetchProfile,
	removeAccount,
	updateUserEmailAndUsername,
	updateUserPassword,
	uploadProfileImage,
} from '../controllers/profile';
const router = express.Router();

router.get(
	'/profile/:profile_id',
	expressAsyncHandler(fetchProfile),
);

router.post(
	'/profile/:profile_id/updateUserEmailAndUsername',
	expressAsyncHandler(updateUserEmailAndUsername),
);

router.post(
	'/profile/:profile_id/updateUserPassword',
	expressAsyncHandler(updateUserPassword),
);

router.post(
	'/profile/:profile_id/upload-profile-image',
	expressAsyncHandler(uploadProfileImage),
);

router.delete(
	'/profile/:profile_id/delete-account',
	expressAsyncHandler(removeAccount),
);

export default router;
