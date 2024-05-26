import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	checkUser,
	createAnonymousUser,
	editUserRole,
	getUsers,
	generateVerificationCode,
	signin,
	signup,
	checkResetPassword,
	updatePassword,
	createUser,
} from '../controllers/user';
import { checkUserToken } from '../middlewares';

const router = express.Router();

router.get('/', checkUserToken, expressAsyncHandler(checkUser));

router.post(
	'/create-user',
	checkUserToken,
	expressAsyncHandler(createUser),
);

router
	.route('/users')
	.get(checkUserToken, expressAsyncHandler(getUsers))
	.post(checkUserToken, expressAsyncHandler(editUserRole));

router.post('/signup', expressAsyncHandler(signup));

router.post('/signin', expressAsyncHandler(signin));

router.post(
	'/anonymous',
	expressAsyncHandler(createAnonymousUser),
);

router.post(
	'/reset-password',
	expressAsyncHandler(generateVerificationCode),
);

router.post(
	'/reset-password/:user_id',
	expressAsyncHandler(checkResetPassword),
);

router.post(
	'/reset-password/:user_id/update-password',
	expressAsyncHandler(updatePassword),
);

export default router;
