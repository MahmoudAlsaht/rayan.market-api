import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
	createAnonymousUser,
	signin,
	signup,
} from '../controllers/user';

const router = express.Router();

router.post('/signup', expressAsyncHandler(signup));

router.post('/signin', expressAsyncHandler(signin));

router.post(
	'/anonymous',
	expressAsyncHandler(createAnonymousUser),
);

export default router;
