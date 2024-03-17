import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	checkUser,
	createAnonymousUser,
	editUserRole,
	getUsers,
	signin,
	signup,
} from '../controllers/user';

const router = express.Router();

router.get('/', expressAsyncHandler(checkUser));

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

export default router;
