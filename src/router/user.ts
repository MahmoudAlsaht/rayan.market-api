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

const router = express.Router();

router.get('/', expressAsyncHandler(checkUser));

router.post('/create-user', expressAsyncHandler(createUser));

router
	.route('/users')
	.get(expressAsyncHandler(getUsers))
	.post(expressAsyncHandler(editUserRole));

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
